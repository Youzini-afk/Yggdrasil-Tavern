# YdlTavern Round 6 — Fork 完善收尾 (W-track)

> 临时计划文件。每阶段完成后 push。全部完成后由 W7 删除并并入长期文档。

## 目的

把 V-track 留下的 stub/TODO/cosmetic 痛点全部收口，让 fork 真正达到"用户可以打开就用"的完成度。这是为接下来的 baseline benchmark + Phase B 痛点解决做准备。

不做：
- 性能优化（baseline benchmark 之后再决定）
- 痛点解决（多 agent / MCP / 向量记忆，属于 Phase B）
- 真实 live model smoke
- 真实代码签名 / auto-updater

## 调研基础

来自三份调研报告（已 review）：

**chat 4 项 cosmetic**: 全是同一个 bug —— `chat_completion_source` 和 `stream` 在 body 字面量里插入位置太早，跟 ST 不一致。trivial 修复（重新排列字段插入顺序）。

**V5 TODO V7 wiring**: 
- 6 个 `// TODO V7` markers (BackgroundsDrawer/WorldInfoDrawer/AIConfigDrawer ×2/CharactersDrawer/PersonaDrawer)
- 5 个 STUB 常量 (STUB_BGS/BOOKS/ENTRY/CHARACTERS/PERSONAS) 
- TavernProvider 缺：sampler 块、connection 块、persona 块、formatting 块、4 个库 collection (worldbooks/characters/personas/backgrounds)
- 4 个 form (Sampler/Connection/Persona/Theme) 中只有 ThemeForm 真正接到了 provider；其他都只在 SettingsPanel 里写 localStorage（与 TavernProvider 双轨持久化）
- `SettingsPanel.tsx` 用单独的 localStorage 键持久化 connection/sampler/persona —— 与 TavernProvider 形成不一致
- MessageBubble (V3) + SendForm (V4) 写完了但 TavernShell 还在用旧的 TurnView/MessageComposer 路径
- 字体：`surface.css` 显式声明字体不打包，靠 host 提供 / 系统 fallback

**clients/web ↔ surface e2e**:
- 当前 `@ydltavern/surface` 的 `npm run build` 只是 tsc + copy CSS —— 不是 browser-ready bundle，仍保留对 react/react-virtuoso 等的 bare imports
- 9 个 surface 在 manifest 声明，但 `src/index.ts` 只导出 3 个（Play/Settings/Extensions）
- 没有 mount adapter，组件是 React 组件，frame 期望 `(root, props) => void` 或 `{mount}`
- `surface-frame.html` 的 CSP 不允许 inline scripts（与现实代码矛盾）
- `clients/web/src/main.ts` 里没有调用 `mountSurface`
- `clients/web/vite.config.ts` 没有 surface bundle 资产路由

## 阶段

### W0 — 计划 push

本文件。

### W1 — Chat cosmetic → perfect

**位置**: `packages/ydltavern-engine-core/src/chat-completion-providers.ts`

`buildChatRequest` 当前 body 字面量顺序：
```text
type, messages, model, chat_completion_source, stream, temperature, ...
```

ST `createGenerationParameters` 顺序（公认的）：
```text
type, messages, model, temperature, frequency_penalty, presence_penalty, top_p, max_tokens, stream, chat_completion_source, user_name, char_name, group_names, include_reasoning, enable_web_search, request_images, request_image_resolution, request_image_aspect_ratio, custom_prompt_post_processing
```

修复：把 base body 字面量按 ST 顺序重排。**只改字段插入顺序，不改字段值/存在/语义**。

期望：
- 4 个 chat scenario 从 cosmetic → perfect
- golden harness 总数 16 perfect → 20 perfect
- 现有 295+ engine-core tests 不破

### W2 — TavernProvider 扩展

**位置**: `packages/ydltavern-surface/src/app/TavernProvider.tsx`

把 6 个抽屉的 STUB 替换为真实的 TavernProvider state，加入完整的库管理与设置层。

新增 state slices（独立分片，不全塞进 TavernSettings）：

```text
// 库 (collections)
characters: CharacterEntry[]
personas: PersonaEntry[]
worldBooks: WorldBookEntry[]
backgrounds: BackgroundEntry[]

// 选择 (selection)
activeCharacterId / activePersonaId / activeWorldBookId / activeBackgroundId
selectedWorldEntryId

// 设置分片 (settings slices)
samplerSettings: SamplerSettings
connectionSettings: ConnectionSettings
formattingSettings: FormattingSettings
backgroundDisplaySettings: { fitMode, autoSelect }

// 连接 profiles
connectionProfiles: Record<name, ConnectionSettings>
activeConnectionProfile: string | null
```

新增方法（按调研报告的 priority list）：

```text
// 设置
setActivePreset(id), updateSamplerSettings(partial)
updateConnectionSettings(partial), saveConnectionProfile(name)
loadConnectionProfile(name), deleteConnectionProfile(name)
updateFormattingSettings(partial)
resetSettings(scope)

// 库 CRUD（plan-only / 内存 + 持久化）
createCharacter / updateCharacter / deleteCharacter / duplicateCharacter / importCharacter / exportCharacter
createPersona / updatePersona / deletePersona / importPersona
createWorldBook / updateWorldBook / deleteWorldBook
createWorldEntry(bookId) / updateWorldEntry / deleteWorldEntry / duplicateWorldEntry
setActiveBackground / setBackgroundFitMode / setBackgroundAutoSelect

// 消息操作（W4 用）
editMessage(id, text), deleteMessage(id), moveMessage(id, dir)
copyMessage(id), hideMessage / unhideMessage
swipeLeft(id), swipeRight(id), regenerate(id)
branchMessage(id), checkpointMessage(id)
```

持久化：每个分片用独立 schema 版本化的 localStorage key
```text
ydltavern.settings.v2          (升级现有 v1)
ydltavern.themeSettings.v1     (现有，保留)
ydltavern.samplerSettings.v1   (新)
ydltavern.connectionProfiles.v1
ydltavern.formattingSettings.v1
ydltavern.personas.v1
ydltavern.characters.v1
ydltavern.worldbooks.v1
ydltavern.backgrounds.v1
```

包含 v1→v2 fallback 迁移（旧的 `ydltavern.settings` 拆分到新 slices）。

**重要约束**：
- 所有 CRUD 都是 plan-only / 内存 + localStorage（W7 之前不接 host capability）
- secrets 从不落 localStorage 明文，只存 `secret_ref:env:NAME` 字符串
- 集合方法返回新 entry 的 id，方便 form 立刻定位

### W3 — V5 forms 接到 TavernProvider

**位置**: `packages/ydltavern-surface/src/components/shell/drawers/*.tsx` + `src/components/product/Settings/*.tsx`

把 V5 留下的 6 个 TODO V7 markers + 5 个 STUB 替换掉：

- `AIConfigDrawer`: SamplerForm 的 onChange 接到 `tavern.updateSamplerSettings`；preset 选择接到 `setActivePreset`
- `APIConnectionsDrawer`: `tavern.connectionSettings`/`updateConnectionSettings`/`saveConnectionProfile`
- `AdvancedFormattingDrawer`: 全部 input 接到 `tavern.formattingSettings`/`updateFormattingSettings`
- `WorldInfoDrawer`: 替换 STUB_BOOKS/STUB_ENTRY，用 `tavern.worldBooks` + `selectedWorldBookId`/`selectedWorldEntryId`
- `BackgroundsDrawer`: 替换 STUB_BGS，用 `tavern.backgrounds`/`activeBackgroundId`
- `PersonaDrawer`: 替换 STUB_PERSONAS，用 `tavern.personas`/`activePersonaId`
- `CharactersDrawer`: 替换 STUB_CHARACTERS，用 `tavern.characters`

合并 `SettingsPanel.tsx` 的双轨 localStorage：让 SettingsPanel 也通过 TavernProvider 写，避免双 source-of-truth。

新增内置 seed 数据（首次启动空集合时插入）：
- 1 个默认 persona "You"
- 1 个示例 character (sample-aria 风格)
- 1 个空 world book
- 1 个 default background

期望：抽屉中所有 form input 都真实读写 TavernProvider，刷新页面后保留。

### W4 — Message + Composer 集成

**位置**: `packages/ydltavern-surface/src/app/TavernShell.tsx` + `src/components/product/MessageList.tsx` (新)

把 V3 的 MessageBubble 和 V4 的 SendForm 真正纳入 shell：

1. **新建 `MessageList.tsx`**：渲染 `liveChat.turns` 时用 MessageBubble（替代 ChatList → TurnView 旧路径）
   - 保留 react-virtuoso 虚拟列表
   - 把 turn 数据映射到 MessageBubble props（avatar、name、timestamp、token count、reasoning、media、swipes）
   - 把 onSwipeLeft/onSwipeRight/onEdit/onDelete/onRegenerate/onCopy/onBranch 接到 W2 新增的 provider 方法

2. **替换 MessageComposer**：让 TavernShell 用 SendForm + ComposerToolbar + StreamingIndicator
   - SendForm.onSend → `tavern.sendMessage` (从字符串方式触发)
   - SendForm.onContinue → 新加 `tavern.continueLastReply`
   - SendForm.onImpersonate → 新加 `tavern.impersonate`
   - SendForm.onStop → `tavern.cancelGeneration` (现有)
   - StreamingIndicator 由 `tavern.isGenerating` 驱动

3. **保留旧路径作为废弃 export**：TurnView.tsx 和 MessageComposer.tsx 暂留（向后兼容），添加 deprecation 注释，下个 round 删除

期望：消息渲染走完整的 ST `.mes` DOM 结构，所有 swipe/edit/branch 按钮真实触发 provider。

### W5 — Surface bundle browser-ready

**位置**: `packages/ydltavern-surface/`

让 surface bundle 真的能在浏览器 iframe 里 `import()` 出来。

1. **加 Vite 库构建**：
   - `vite.config.ts`：library mode，输出单个 ESM 文件 `dist/bundle.mjs`
   - 不 externalize React（自带 ship）—— iframe 隔离的代价
   - 不 externalize react-virtuoso 等
   - 输出 source map，但生产可关
   - target es2022
   - `package.json` 加 `"build:bundle": "vite build"` 脚本，`build` 同时跑 tsc + bundle

2. **加 mount adapters**：所有 9 个 surface 都暴露 `mountTavern{Surface}Surface(root, props)` 函数：
   ```ts
   export function mountTavernPlaySurface(root, props) {
     const reactRoot = ReactDOM.createRoot(root);
     reactRoot.render(<TavernProvider {...providerProps}><TavernPlaySurface {...props} /></TavernProvider>);
     return () => reactRoot.unmount();
   }
   ```
   返回 unmount 函数，以便 SurfaceHost 清理

3. **补全 src/index.ts 导出**：把 9 个 surface 的 React 组件 + 9 个 mount adapter 都从 index.ts 导出
   当前只有 3 个 surface 组件，需要新增：
   - `src/surfaces/TavernCharactersSurface.tsx`
   - `src/surfaces/TavernWorldInfoSurface.tsx`
   - `src/surfaces/TavernPersonaSurface.tsx`
   - `src/surfaces/TavernAIResponseConfigSurface.tsx`
   - `src/surfaces/TavernUserSettingsSurface.tsx`
   - `src/surfaces/TavernBackgroundsSurface.tsx`
   每个都是简单的薄壳，渲染对应 drawer 内容（不带 drawer chrome），让 host 可以单独挂载

4. **更新 manifest.yaml + surface.manifest.json**：把 metadata.export_name 全部指向 mount adapter 而不是组件

5. **scripts/copy-assets.mjs**：除了 CSS 也复制 bundle.mjs 到 dist

期望：`npm run build` 输出可被浏览器 iframe `import()` 的 bundle.mjs，9 个 mount adapter 全部可调用。

### W6 — Yggdrasil clients/web 真实挂载

**位置**: `/workspace/Yggdrasil/Yggdrasil/clients/web/`

让 clients/web 真的能从 manifest 发现 → 解析 bundle URL → iframe 挂载 → 双向 RPC。

1. **修复 surface-frame.html CSP**：
   - 当前 CSP 不允许 inline scripts，但代码用了 inline module
   - 改为外部 `surface-frame-bootstrap.js`，CSP 改为 `script-src 'self'`
   - 或者加 `'unsafe-inline'` 但这违背安全设计 —— 用外部 JS 更好

2. **bundle URL 解析**：
   - `clients/web/src/surfaces/surface-host.ts` 加 `resolveSurfaceBundle(packageId, surfaceId, manifestMetadata)` 函数
   - 当前 demo 时使用硬编码映射：
     ```ts
     const DEMO_SURFACE_BUNDLES = {
       'ydltavern/surface': '/surface-bundles/ydltavern/bundle.mjs'
     };
     ```
   - Vite dev server 加静态路由 `/surface-bundles/ydltavern/*` 指向 YdlTavern 的 dist
   - production 留 TODO（host 静态文件路由属于将来）

3. **main.ts 集成 mountSurface**：
   - 在 Play 路由上检测：当用户点击 surface card 的 "Mount" 按钮时
   - `mountSurface({ containerId: 'surface-outlet', surfaceId, bundleUrl, exportName, hostBridge })`
   - 加一个 `<div id="surface-outlet">` 在 play.ts 渲染区
   - 加 unmount 按钮回到 surface 列表
   - hostBridge.callRpc 转发到现有 `client.invoke`

4. **添加 e2e demo 路径**：profile-forge-alpha 启动 → 加载 ydltavern-surface 包（声明 manifest.yaml 路径） → host serve 把 dist 暴露在 /surface-bundles/ → web 客户端可以 mount → 显示 Tavern UI

期望：从 `npm run dev --prefix clients/web` 启动，能在浏览器里看到 YdlTavern 的 surface 真实运行（至少 Play surface 一个），点击按钮能 RPC 到 host。

### W7 — 字体策略 + 文档收敛 + 删除 plan

**位置**: 多个

1. **字体策略选择**：决定 self-hosted vs Google Fonts CDN vs 保留系统 fallback
   - 推荐：**self-hosted Noto Sans + Noto Sans Mono** （AGPL 兼容、离线可用、无外部 CDN 依赖）
   - 在 `packages/ydltavern-surface/public/fonts/` 放 Noto Sans/Mono 的 woff2（取一两个权重）
   - 在 `surface.css` 加 `@font-face` 声明，font-display: swap
   - copy-assets.mjs 复制到 dist
   - 更新 `surface.css` 的"字体不打包"声明

2. **删除临时 plan**：`rm docs/YDLTAVERN_ROUND6_PLAN.md`

3. **更新长期文档**（双语）：
   - `README.md` / `.en.md`：更新 fork 状态（4/4 chat perfect, 9 surface mount adapters, 完整 provider state）
   - `docs/COMPATIBILITY_MATRIX.md` / `.en.md`：W-track summary 段落
   - `docs/ARCHITECTURE.md` / `.en.md`：新增 "Surface bundle build" 章节
   - `docs/guides/UI_FORK_GUIDE.md` / `.en.md`：补 mount adapter 章节
   - `docs/roadmap/NEXT_STEPS.md` / `.en.md`：W-track 完成，添加 baseline benchmark + Phase B 项

4. **新增 guide**：`docs/guides/E2E_INTEGRATION.md` / `.en.md`，文档化 W6 的 e2e demo 流程

## 完成判据

- 各包 typecheck / build / test 通过
- golden harness `_summary.json` 显示 20/20 perfect 或 close
- TavernProvider 包含完整 9 抽屉所需的 state + methods，所有 STUB_ 常量被替换
- TavernShell.tsx 渲染 MessageList (基于 MessageBubble) 和 SendForm，旧 TurnView 路径标记 deprecated
- `npm run build --prefix packages/ydltavern-surface` 输出 `dist/bundle.mjs` (browser-ready ESM)
- 9 个 mount adapter 全部可从 index.ts import
- clients/web 能 `mountSurface` 加载 ydltavern Play surface，按钮点击能 RPC 到 host
- self-hosted Noto Sans 字体在 dist 中可用
- 临时 plan 删除，长期文档同步

## 不变量

- YdlTavern 永远不直连网络（HTTPS 经 Yggdrasil outbound）
- raw API key 不入 manifest/code/audit/localStorage 明文
- iframe sandbox 仍 `allow-scripts` only（W6 不放宽）
- 内核 content-free
- 现有 934+ tests 不破，golden harness 不退步
- AGPLv3 兼容（Noto Sans 是 SIL OFL，可商用）
