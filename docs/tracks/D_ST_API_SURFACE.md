# D 轨道：ST API 表面

> [English](./D_ST_API_SURFACE.en.md) · [中文](./D_ST_API_SURFACE.md)

## 范围

把 ST 全局 API 表面（`getContext()`、`eventSource`、`event_types`、`SlashCommandParser`、各种 helper）在 YdlTavern 这层提供出来，作为统一 contract。

YdlTavern 自己的 UI 也消费同一份 contract。这是关键——核心团队和扩展开发者用同一套 API，避免 ST 老毛病。

## ground truth

- `docs/inventory/CORE_EVENTS_AND_COMMANDS.raw.md` 全部段
- `docs/architecture/COMPAT_PROJECTION.md`（投影规则）
- 实施时新增 `docs/inventory/GLOBAL_API.md`，机械扫 ST `script.js` + `extensions.js` 的 export / window globals

## 交付

- `compat/getContext.ts` —— 返回兼容 ST 的 context 对象，所有字段从 YdlTavern 状态投影
- `compat/eventSource.ts` —— ST 风格 event bus，YdlTavern 内部事件按 `COMPAT_PROJECTION.md` 规则映射
- `compat/event_types.ts` —— 99+ 个 ST event 常量，名字与字符串值跟 ST 完全一致
- `compat/chat-proxy.ts` —— `chat[]` 的 Proxy 实现：lazy 投影 + 写拦截路由到 Turn 模型
- `compat/globals.ts` —— `window.SillyTavern` / `getRequestHeaders` / `addOneMessage` / `saveChat` / `Generate` / `substituteParams` 等
- 完整 inventory + 状态表 + alignment fixture

## 对齐策略

每个 API 一个独立 alignment fixture：

```text
扩展形如:  eventSource.on('MESSAGE_RECEIVED', handler)
对齐目标:  在 YdlTavern 完成 generation 后，handler 收到的 payload 形状跟 ST 同版本相同
```

```text
扩展形如:  getContext().chat[5].mes = '改写'
对齐目标:  YdlTavern 内部 Turn[5] 的 active variant 被 fork，新 variant 的 main text = '改写'
```

`COMPATIBILITY_MATRIX` 中 D 轨道每一项都对应一个 fixture。

## 依赖

- Turn 模型 ([`../architecture/TURN_MODEL.md`](../architecture/TURN_MODEL.md)) ✓
- 投影规则 ([`../architecture/COMPAT_PROJECTION.md`](../architecture/COMPAT_PROJECTION.md)) ✓
- 不依赖其他轨道；所有其他轨道反过来依赖它

## 当前状态

contract MVP 和深度移植已落地到 `packages/ydltavern-st-compat`：

- live `chat[]` Proxy 读写会更新内部 Turn store；
- `getContext()` 返回完整 ST context shape（`context-st.ts`），包含 state（chat/characters/groups/characterId/groupId/chatId/name1/name2/mainApi/onlineStatus/maxContext/chatMetadata/menuType/extensionSettings/powerUserSettings/tags/tagMap）、bridges（eventSource/extensionPrompts/variables/swipe/toolManager）、functions（getCurrentChatId/reloadCurrentChat/saveChat/saveSettingsDebounced/saveMetadata/updateChatMetadata/addOneMessage/deleteLastMessage/generate/generateRaw/substituteParams/setExtensionPrompt/getExtensionPrompt/getRequestHeaders/getTokenCountAsync/isMobile/etc）、legacy aliases（event_types/eventTypes, main_api/mainApi, online_status/onlineStatus）、symbols（ignore/unset）、deprecated stubs；
- `ExtensionPromptStore`（`context-st.ts`）支持 `set`/`render`/`maxDepth`/`removeDepthPrompts` + async filter callback，对应 ST 的 `setExtensionPrompt`/`getExtensionPrompt` 语义；
- `addOneMessage`、`saveChat`、`saveSettingsDebounced`、`Generate`、`substituteParams` 有真实行为；
- generation lifecycle 会派发事件；未接通真实模型路径时返回明确 notice，不再追加 fake assistant message；
- 单元测试覆盖 push/edit/delete/splice、事件派发、no-fake generation notice、完整宏引擎和 STScript 运行时。

这仍是 `partial`，不是字节级 ST 对齐；下一步要继续补全更多真实 DOM/network bridges、popups、第三方扩展行为和 provider payload 对齐。

## 不在范围内

- 重新发明一套全新的现代 API——新扩展可以直接用 Yggdrasil 公开协议，不强求走 D
- 提供 ST 不存在的便利 API——D 轨道只承接 ST 现有，不发明新的

## 完成判据

- ST 全部已稳定、社区在用的 API 表面在 D 都有对齐实现
- 99+ event_types 全部映射，alignment fixture 通过
- 一组前 N 个流行老扩展的初始化代码能跑通（H 轨道阶段验证）
