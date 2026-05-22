# YdlTavern Round 4 — Real Extension + Structural Closure (U-track)

> 临时计划文件。每阶段完成后 push。全部完成后由 U6 删除并并入长期文档。

## 目的

把 Round 3 留下的两件事做完：

1. **真实 ST 第三方扩展能加载到 QuickJS 沙箱**（用 `/workspace/Yggdrasil/ST-Bionic-Memory-Ecology` 当试金石）
2. **8 个 golden harness structural diff 全部收口**（chat tools / 4 WI / 3 macro）

不做：
- 真实 live model smoke（用户明确推迟）
- 153 slash 命令补全到 100%（独立工作量）
- BME 全量功能跑通（其多文件 ESM/IndexedDB/WASM/网络 离线不可能）

## 关键发现（来自调研）

### Sandbox vs BME

```text
BME 实际形态:           175k LOC, 213 文件, ESM imports, DOM/IndexedDB/Dexie/OPFS/fetch/WASM
当前 sandbox 能力:      单文件 eval, 无 ESM 解析, 缺多个关键 ST API
能跑的部分:            init shell + 事件订阅注册 + prompt 注入回调
不能跑的部分:          UI panel, vector store, retrieval, sync, native acceleration
```

策略：让 sandbox 升级到能加载 ESM extension entry，注入足够的 ST API 与浏览器 stub，让 BME init 跑通并注册它的事件 hook + 设置写入 + prompt 注入；其他模块不强求。

### 8 个 structural diff 根因

```text
chat/openai-tools           ST 不发送 tools/tool_choice（仅在特定条件下）；YdlTavern 总发
                            修复点: chat-completion-providers.ts:231-234

world-info/* (4 个)         全部被 budget_exceeded 拦下；YdlTavern 用字符长度近似，ST 用 token
                            修复点: world-info.ts:476-514, 1721-1727

macro/* (3 个)              活跃的是 packages/ydltavern-engine-core/src/macros.ts (minimal)
                            不是 packages/ydltavern-st-compat/src/macros-st.ts (deep)
                            修复点: macros.ts → 委托给 macros-st.ts
```

## 阶段

### U0 — 计划 push

本文件。

### U1 — Sandbox ESM loader + browser stubs + 扩展 ST API bridge

**位置**: `packages/ydltavern-extensions/src/sandbox/`、`packages/ydltavern-st-compat/src/context-st.ts`

**新增 sandbox 能力**：

```text
runtime.ts:
  evalModule(source, specifier)        改用 evalCode { type: 'module' }
                                        支持 import.meta.url

loader.ts:
  解析 manifest.js 入口的 import 语句
  对 relative imports (./lib/x.js): 通过 readSource 递归读取并预加载
  对 ST host imports (../../../../script.js, ../../../extensions.js):
    映射到虚拟模块，导出 host bridge 暴露的 ST API 全集
  对 npm bare imports: 抛错，建议 vendor 化

bridge.ts 新增暴露:
  event_types                          ST_EVENT_TYPES 常量
  extension_prompt_types               EXTENSION_PROMPT_TYPES
  extension_prompt_roles               EXTENSION_PROMPT_ROLES
  getRequestHeaders                    返回 {'Content-Type':'application/json'}
  saveSettingsDebounced                noop / 记录调用
  saveMetadata                         host bridge 转发
  saveMetadataDebounced                noop / 记录调用
  reloadCurrentChat                    noop
  updateChatMetadata                   host bridge
  getExtensionPrompt                   异步读 ExtensionPromptStore
  substituteParams                     host bridge
  getTokenCountAsync                   approx 计数 (ceil(len/3.35))

browser-stubs.ts (新文件):
  document          { createElement, querySelector, body, head } 最小 stub
  window            { addEventListener, location: { href }, navigator: { userAgent } }
  localStorage      Map-backed get/set/removeItem/clear
  sessionStorage    同
  fetch             throws "blocked in sandbox v1"
  indexedDB         throws "blocked in sandbox v1"
  performance       { now: () => Date.now() }
  crypto            { randomUUID: deterministic } / { getRandomValues: seeded }
  AbortController   real (QuickJS 有原生支持)
  DOMException      class stub
  matchMedia        () => ({ matches: false, addEventListener: noop })

permissions.ts:
  新增 permission flag: realExtensionLoad: false (默认禁，opt-in)
```

**测试**：
- 现有 140 sandbox 测试不破
- 新增 ESM loader 测试：多文件 relative import 解析
- 新增 ST API bridge 测试：每个新增 API 至少 1 测试
- 新增 browser stub 测试：localStorage/document/crypto.randomUUID 至少各 1

预期 sandbox 测试 140 → ~165。

### U2 — BME bootstrap smoke test

**位置**: `packages/ydltavern-extensions/test/sandbox-bme-smoke.test.mjs`

加载 `/workspace/Yggdrasil/ST-Bionic-Memory-Ecology` 的 `index.js` + 必要的相对 import，验证：

1. 模块成功 evaluate（不抛 unhandled）
2. 至少注册了 8 个 event_types 监听器（CHAT_CHANGED, MESSAGE_SENT, GENERATION_*, etc.）
3. extension_settings['ST-BME'] 被写入了默认配置
4. 模拟触发 `GENERATE_BEFORE_COMBINE_PROMPTS` 事件后，setExtensionPrompt 被调用过

**边界**：
- 路径通过 env var `YGG_BME_TEST_PATH` 配置；CI 不设此环境变量则 skip
- BME 的 fetch/IndexedDB 调用会 throw → 测试只断言 init 阶段不依赖它们；如 init 内部 try/catch 吞掉了网络错误就 OK，否则 test 会 fail 显示哪一步阻塞
- 不测 UI、retrieval、sync、wasm

测试为 opt-in 类型（`{ skip: !process.env.YGG_BME_TEST_PATH }`），但包含合成的"micro-BME"等价物，把核心 ST API 调用模式压缩成 ~50 行测试用单文件扩展，作为 always-on 真扩展模式 smoke 验证。

预期：
- BME real test (skip 默认)
- 合成 micro-BME real-shape test (always on)
- sandbox 测试 ~165 → ~170

### U3 — Chat tools structural diff 修复

**位置**: `packages/ydltavern-engine-core/src/chat-completion-providers.ts:231-234`

读 ST 源码 `SillyTavern/public/scripts/openai.js:2779-2781`：ST 只在 `ToolManager.canPerformToolCalls()` 通过时把 tools/tool_choice 加进 body。当前 YdlTavern 一旦输入 tools 就发送。

修复：
- 在请求体构造逻辑里加条件判断：仅当 input 显式表示 tool calling enabled 时才发 tools/tool_choice
- scenario `chat/openai-tools` 的输入需匹配 ST 的"unconditional emit"路径或者 fixture 期望 tools 被剥离 — 读 fixture 决定方向
- 加 1-2 个 chat-completion-providers 测试覆盖 conditional emission

预期：scenario 从 structural → perfect。

### U4 — WI budget 对齐

**位置**: `packages/ydltavern-engine-core/src/world-info.ts:476-514, 1721-1727`

当前 `budgetCost()` 返回字符长度，导致激活计算超预算被 `budget_exceeded` 卡住。

ST 行为（`SillyTavern/public/scripts/world-info.js`）：
- 用 `getTokenCountAsync` 计算 entry content 的 token 数
- max_context * world_info_budget / 100 是预算上限
- 单次激活后剩余预算用于后续 entry

修复：
- `budgetCost(entry)` 改用 token approximation（ceil(content.length / 3.35) — 与 ST 在没有真实 tokenizer 时的 fallback 一致）
- 预算上限计算逻辑核对 ST：`Math.floor(maxContext * budget_pct / 100)`
- 重新跑 4 个 WI scenario 的 fixture（ST 端用相同 approximation），验证激活集合一致

预期：4 个 WI structural → perfect 或 cosmetic（取决于排序/格式细节）。

如果 budget 对齐后还有差异，看具体 delta 是 routing/recursion/probability 哪一类，再决定是否扩到 U4.5。

### U5 — Macro engine 切换

**位置**: `packages/ydltavern-engine-core/src/macros.ts`

`packages/ydltavern-st-compat/src/macros-st.ts` 已经有完整的 ST-compat 深引擎，包括：
- recursion / nested expansion
- comment macro `{{// ...}}`
- `{{trim}}` / `{{newline}}` post-processors
- random/pick/roll with seedrandom
- time/date with frozen moment
- isodate / weekday / datetimeformat

修复：
- 让 `engine-core/src/macros.ts` 的 `substituteMacros` 委托给 `st-compat/src/macros-st.ts` 的实现
- 注意 `st-compat` 是单独的 package，需要要么把 `macros-st.ts` 提取到一个独立模块（移到 engine-core 或新包），要么 engine-core 反向依赖 st-compat（不推荐，因为 engine-core 是底层）
- **首选方案**：把 deep 实现从 st-compat 提取到 engine-core，st-compat 的 macros-st 改为 re-export
- 保留 `engine-core/src/macros.ts` 的旧 API 表面（向后兼容），内部改用深实现

测试：
- engine-core 现有 287 测试不破
- 新增 7-10 个 macro 测试覆盖每个新拿到的 macro 类型（comment/trim/newline/roll/pick/random/isodate/weekday/datetimeformat）

预期：3 个 macro structural → perfect。

### U6 — Golden 重跑 + 矩阵 + 文档收敛

跑 `node compare.mjs --all`，期望 `_summary.json` 接近：

```text
total: 20
perfect: 15-18    (was 9, +6-9)
cosmetic: 0-2
structural: 0-3   (was 8, -5-8)
unverifiable: 0
error: 0
```

更新文档（中英）：
- `docs/COMPATIBILITY_MATRIX.md` / `.en.md`：U-track summary 段落 + 各行更新
- `README.md` / `.en.md`：golden harness 数字
- `docs/ARCHITECTURE.md` / `.en.md`：sandbox ESM loader 章节
- `golden-harness/README.md`：U-track 进展
- `packages/ydltavern-extensions/README.md` / `.en.md`：sandbox 实扩展加载说明

新增 guide：
- `docs/guides/REAL_EXTENSION_LOADING.md` / `.en.md`：BME smoke test 怎么跑、能跑哪些功能、不能跑哪些

删除：
- `docs/YDLTAVERN_ROUND4_PLAN.md`

确认无 broken 引用、所有包 typecheck/build/test 通过。

## 完成判据

- 各包 typecheck / build / test 通过
- sandbox 测试 ~170+
- engine-core 测试 ~300+
- golden harness `_summary.json` perfect ≥ 15
- BME 真扩展 opt-in smoke test 跑通（在有 BME path 的环境下）
- 合成 micro-BME smoke 在 default CI 跑通
- 临时计划删除
- 长期文档同步

## 不变量

- YdlTavern 永远不直连网络
- raw API key 永远不进 manifest/code/audit
- sandbox 默认禁 fetch/XHR/网络（real extension permission flag opt-in 也只允许 mock）
- 内核仍 content-free（kernel.* 命名空间不变）
- 不破坏现有 875+ tests
