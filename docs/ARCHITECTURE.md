# YdlTavern 与 Yggdrasil 的关系

> [English](./ARCHITECTURE.en.md) · [中文](./ARCHITECTURE.md)

YdlTavern 是一个跑在 [Yggdrasil](https://github.com/Youzini-afk/Yggdrasil) 之上的产品。它通过 Yggdrasil 的公开协议消费平台，跟其他第三方项目享有同样待遇。YdlTavern engine 是 subprocess Path A 包（`entry.contract: "v1"`），通过 bindings 和 `@yggdrasil/kernel-sdk` / subprocess SDK 消费平台能力；YdlTavern surface 是 `surface_bundle` static browser bundle，由 Yggdrasil SurfaceHost 以 sandboxed iframe 加载，并通过受限 host bridge 调用允许的公开协议能力。

```text
┌──────────────────────────────────────────────┐
│  YdlTavern 包族                                 │
│  · Tavern 前端 surface（聊天 / 设置 / 扩展面板）│
│  · ST 扩展兼容层（getContext / eventSource 等） │
│  · 引擎与资产 importer（角色卡 / 世界书 / 预设）│
└──────────────────────────────────────────────┘
                    ▲
                    │ HTTP /rpc + SSE
                    │（公开协议）
                    ▼
┌──────────────────────────────────────────────┐
│  Yggdrasil 平台                                │
│  · 模型 provider（OpenAI / Anthropic / ...）   │
│  · persona-lab / knowledge-lab / context-lab   │
│  · memory-lab / sharing-lab / outbound 审计    │
│  · 流式与取消生命周期、提案与审批              │
│  · 内核：会话、事件、权限                       │
└──────────────────────────────────────────────┘
```

## 边界

YdlTavern 这边管：

- 产品定位、UI 设计语言、操作流；
- Tavern 产品前端 surface（聊天界面、角色卡面板、世界书面板、预设编辑器、扩展管理、设置 UI）；
- SillyTavern 资产 importer；
- SillyTavern 扩展兼容层（API 表面、加载器、运行时桥）；
- 跟 SillyTavern 社区直接对接的所有内容（迁移指南、扩展兼容矩阵、社区频道）；
- YdlTavern 自己的产品决策（默认主题、营销、版本节奏）。

Yggdrasil 那边管：

- 平台底座、内核、公开协议；
- 桌面壳、Web 壳、App 壳、Home / Play / Forge / Assistant 容器，以及 surface hosting；
- 通用能力包（模型接入、persona、knowledge、context、memory、sharing 等）；
- 安全执行（`secret_ref`、网络声明、外发审计、流式生命周期）；
- 平台规范、conformance 用例、跨项目纪律。

边界划清楚的好处：YdlTavern 怎么演化都不会把 Tavern 形态渗进 Yggdrasil 内核；Yggdrasil 演化也不会因为顾及 YdlTavern 而扭曲。Yggdrasil 不写 YdlTavern 的聊天 UI；YdlTavern 不写独立桌面/Web/App 壳。

## 依赖方式

### 开发期

开发者通常会把两个仓库 clone 到同级目录：

```text
some-parent/
├── Yggdrasil/      （平台仓库）
└── YdlTavern/      （本仓库）
```

YdlTavern 调用 Yggdrasil 时走本地 host：用 Yggdrasil 的 CLI 起一个 `ygg host serve --http 127.0.0.1:8787`。YdlTavern 的 engine 包通过 `/rpc` + SSE 消费平台；YdlTavern 的 frontend 以 `@ydltavern/surface` 形式交给 Yggdrasil shell 挂载。

YdlTavern 不依赖 Yggdrasil 的源码路径，也不直接 import Yggdrasil 的内部模块——只通过协议。开发期可通过 workspace path 使用生成的 `@yggdrasil/kernel-sdk`，发行期可改用 npm 包。

### 呈现方式

YdlTavern 前端不是一个独立 app。它是 surface bundle：

- `packages/ydltavern-surface` 提供 React components、样式和 surface descriptor 草案。
- Yggdrasil 的 Web / Desktop / App shell 负责发现、加载、挂载这些 surface。
- YdlTavern surface 负责 Tavern 产品 UI；Yggdrasil shell 负责导航、窗口、权限弹窗、安装、审计和平台生命周期。
- Surface manifest 里的 `allowed_capability_ids` 是 typed 字段，精确声明 bridge 可调用的能力集合。它是 surface-host bridge allowlist 的输入，不授予超出 manifest 权限、capability handle 或 host policy 的额外权威。

未来的本地一体安装可以把 Yggdrasil host 与 YdlTavern 包族打在同一个发行包里，但壳仍归 Yggdrasil，产品前端仍归 YdlTavern。

### 发行期

最终用户可以通过 Yggdrasil 的安装/加载机制获得 YdlTavern 包族。无论本地还是远端 host，YdlTavern 都只通过公开协议和 surface contract 与 Yggdrasil 交互。

## 关键机制

### 模型调用

YdlTavern 不自己接 provider 网络。真实模型调用通过 `ydltavern/engine/model.live_call` 和 `ydltavern/engine/model.live_call.stream` 进入 Yggdrasil：engine 先用 ST unified builder 收集 Tavern 设置，再转换成 provider-final HTTP body。目前人测路径只启用 OpenAI-compatible（OpenAI / DeepSeek / OpenRouter）和 Anthropic/Claude；任意 custom base URL 不会静默变成 outbound host。subprocess SDK `kernelClient` 调用 `kernel.v1.outbound.execute` 或 `kernel.v1.outbound.stream`，host 的 live outbound executor 访问 provider HTTPS。YdlTavern 只传 host-owned `secret_ref` 和 manifest 声明，不读取 raw key；审计、脱敏、取消和超时由 Yggdrasil outbound 事件链负责。

Engine 与 surface 的权威边界分开：engine 是可执行 subprocess 包，持有 manifest 声明的 capability 与出站权限；surface 是静态浏览器 bundle，没有直接 kernel access，只能通过 host bridge 调用 `allowed_capability_ids` 中列出的能力。

### Realtime via Yggdrasil WebSocket outbound

Realtime 模型调用使用单独的 WebSocket 路径：`ydltavern/engine/model.live_realtime` → `kernelClient.openWebSocket` → `kernel.v1.outbound.websocket.open` → provider `wss://...`。OpenAI Realtime 走 `wss://api.openai.com/v1/realtime?model=...`；Gemini Live 目前是 best-effort stub。非流式与 chat completion streaming 仍走上一节的 HTTP/SSE 路径（`kernel.v1.outbound.execute` / `kernel.v1.outbound.stream`）。HTTP、SSE、WebSocket 三条路径共享同一组安全边界：manifest 声明、`secret_ref`、namespace、allowed host、host-side audit/redaction、取消与超时。YdlTavern 不直接打开 WebSocket，也不持有 raw key。

### Tokenizer runtime

`@ydltavern/engine-core` 的 tokenizer registry 保留 ST 的 `TOKENIZER` / best-match 规则，并在运行时按 family lazy load adapter。OpenAI/GPT-2 使用 `gpt-tokenizer`（cl100k/o200k/p50k/r50k），Llama 1/2 使用 `llama-tokenizer-js`，Llama 3 使用 `llama3-tokenizer-js`，Claude 使用 `@anthropic-ai/tokenizer` 的本地近似，Mistral/Gemma/Qwen2/DeepSeek/Yi/Jamba/Nemo/Command R/A 走 `@huggingface/tokenizers`。HF source 可由调用方直接提供，也可用 `fetchHuggingFaceTokenizer` 通过 `kernel.v1.outbound.execute` 向 Yggdrasil host 请求 `tokenizer.json` 下载；fetcher 支持可选 SHA-256 pinning 和内存 LRU cache。没有真实 source 时回落到 ST 风格 UTF-8/3.35 guesstimate。

### 扩展托管模型

ST 扩展与 React shell 运行在同一个 window 中。React 渲染 ST-compatible DOM IDs，并明确让出 jQuery territories。`messageFormatting()` 走 showdown → DOMPurify，并带 extension hooks。Window globals 通过 `mountSTGlobals()` bootstrap。ESM relative imports 解析到 `/script.js` shims；开发期由 Vite middleware 提供，生产期由 host static route 提供。

该模型有意遵循 ST 的信任边界：扩展拥有页面级 DOM/storage/network 访问；YdlTavern 通过错误处理隔离 callback failure，并计划在后续工作中增加透明 Activity Drawer diagnostics。旧 QuickJS sandbox 仍可用于受限 synthetic tests 与 capability experiments，但兼容承诺是让未修改 ST 扩展 same-window 执行。

### QuickJS 扩展 sandbox

`@ydltavern/extensions` 的 `src/sandbox/` 包含 QuickJS runtime、host bridge、ESM loader、permissions、browser stubs 和 audit。ST extension JS 在独立 QuickJS context 内执行。默认 synthetic sandbox 测试仍走最小能力；加载真实 ESM 扩展必须显式授予 `realExtensionLoad: true`，避免旧测试或低信任扩展意外获得文件级 import 能力。

ESM loader 会解析入口模块的静态 relative imports，递归读取同一扩展包内的文件并用 QuickJS module mode evaluate。ST host imports 映射到虚拟模块：`../../../../script.js`、`../../../extensions.js`、`../../../../openai.js` 等路径不读取真实 ST 文件，而是导出 host bridge 允许的 API surface。npm bare imports 仍不解析；第三方扩展需要把依赖 vendor 到扩展包内。

Browser stub 是显式审计过的最小集合：`document`、`window`、`localStorage`、`sessionStorage`、`performance`、`crypto`、`AbortController`、`DOMException`、`matchMedia`、`requestAnimationFrame` 可用；`fetch`、`indexedDB`、`Worker`、`WebSocket` 会抛出 blocked 错误。所有 host API 调用都会进入 audit log，记录脱敏后的调用名与参数形状。当前能跑 synthetic micro-BME always-on smoke；真实 BME 通过 `YGG_BME_TEST_PATH` opt-in，但仍会在未覆盖的 import/stub 路径前停止，不能宣称完整启动或功能可用。

### Macro engine

宏引擎的深 ST-compatible 实现现在位于 `@ydltavern/engine-core`，覆盖递归展开、comment macro、trim/newline 后处理、random/pick/roll seeded RNG、冻结时间/date/isodate/weekday/datetimeformat 等路径。`@ydltavern/st-compat` 的 `macros-st.ts` 作为兼容入口 re-export engine-core 实现，避免底层 engine-core 反向依赖 st-compat。Golden harness 当前 macro 4/4 scenarios 为 byte-perfect。

### Slash command coverage

`createSTContextDeep` 注册 14 个 slash command batches（A-N），覆盖全部 199 个 ST canonical commands。命令分为三类：真实实现直接读写 st-compat context；plan-only descriptors 返回 JSON `{ planned: true, action, fields }`，供 host capability 执行；unsupported sentinels 抛出 `SlashCommandUnsupportedError` 并给出明确原因。重复注册通过 `registerIfMissing` 保留先注册版本，避免覆盖已有 built-in 或早期 batch 行为。`/secret-write` 只接受 `secret_ref:store:*`、`secret_ref:project:*`、`secret_ref:env:*`，拒绝 raw value、inline/file/unknown prefix。

### World Info alignment

World Info pipeline 仍以 ST `checkWorldInfo` 行为为对齐目标。预算成本使用 ST fallback 风格 token approximation（UTF-8/3.35 近似，而不是字符长度），预算上限按 context budget 百分比计算；概率门与随机路径使用 seedrandom 注入，保证 golden harness 与 engine-core 在 fixture 中稳定一致。当前 world-info 4/4 scenarios 为 byte-perfect，但这只覆盖现有 fixtures，不代表所有 WI 边角行为都已全域声明 implemented。

### 前端 surface

YdlTavern 自己提供 Tavern UI：聊天界面、消息渲染、世界书、预设、扩展管理和设置面板。这些 UI 放在 `@ydltavern/surface`，不是 `clients/desktop` 或独立 SPA。Yggdrasil 只负责把 surface 放进 Home / Play / Forge / Assistant 等平台容器。当前 surface 已是产品 UI：`react-virtuoso` 虚拟聊天列表、dark/light/parchment 主题系统、Connection/Sampler/Persona/Theme 设置、loader-st 状态驱动的 ExtensionsDrawer、QuickReplyBar、移动响应式布局，以及完整 TavernProvider 状态层。

Surface descriptor 采用双 manifest 模式：`packages/ydltavern-surface/manifest.yaml` 是 Yggdrasil package manifest，由 host 读取并通过 `kernel.v1.surface.contribution.list` 暴露 9 个 contributions（`ydltavern/play`、`ydltavern/settings`、`ydltavern/extensions`，以及 6 个具体抽屉入口），并用 typed `allowed_capability_ids` 声明 bridge 可调用能力；`packages/ydltavern-surface/surface.manifest.json` 是 React bundle descriptor，保留 export name、wrapper class、fonts、fixtures/sample props 等 framework hints，供 SurfaceHost 挂载 React bundle 时使用。

#### Surface bundle build pipeline

`packages/ydltavern-surface` 有两类构建产物：

- `tsc` 输出 `dist/index.js` 与 `.d.ts`，供 TypeScript / package consumers 使用。
- Vite library mode 输出 `dist/bundle.mjs`，这是 browser-ready ESM `surface_bundle`，可在 Yggdrasil iframe SurfaceHost 中 dynamic import；React 与 surface runtime 依赖被打入 bundle，避免 iframe 里出现 bare imports。它是静态浏览器入口，不是 engine 执行入口。
- `scripts/copy-assets.mjs` 把 `src/styles/*.css` 复制到 `dist/styles/`，并从 `@fontsource/noto-sans@5.2.10` 与 `@fontsource/noto-sans-mono@5.2.10` 复制 4 个 Latin subset woff2 到 `dist/fonts/`。`surface.css` 中的 `@font-face` 使用 `../fonts/` 路径，因此 `dist/styles/surface.css` 会引用 `dist/fonts/`。

字体策略是 self-hosted Noto Sans + Noto Sans Mono（SIL OFL 1.1，AGPL-compatible），并保留 Inter / system fallback。字体由 @fontsource 打包（Noto Sans Regular/Medium/Bold + Noto Sans Mono Regular，Latin subset，约 50KB），不依赖手工放置 `public/fonts/` 文件。

#### TavernProvider state architecture

`TavernProvider` 是 surface UI 的单一状态源。当前人测闭环中，surface 不再生成 fake assistant 内容；未接通的 generate/swipe/regenerate/branch/checkpoint 入口会返回明确 notice，真实发送路径走 `model.live_call` / `.stream`。Provider state 会清理非法 `secret_ref`，错误消息带 `.mes.is-error` 样式，API key 缺失时打开或高亮 API Connections。它包含：

- settings slices：sampler、connection、formatting、background display，以及 active preset / connection profile 等 selection state；
- library collections：characters、personas、world books、backgrounds，以及 active / selected ids；
- CRUD 与消息操作：character/persona/world book/background 管理，message edit/delete/move/copy/hide；swipe/regenerate/branch/checkpoint 在未接通真实 host 能力前返回明确 notice；
- schema-versioned persistence：`ydltavern.settings.v2` 与 sampler / connection / formatting / personas / characters / worldbooks / backgrounds 等独立 localStorage keys，并包含 v1→v2 migration。

9 个 drawer surfaces（AI Config、API Connections、Advanced Formatting、World Info、User Settings、Backgrounds、Extensions、Persona、Characters）都通过 `useTavern()` 读写 provider，不再维护与 provider 冲突的本地 stub state。

#### Shell architecture

`packages/ydltavern-surface/src/components/shell/` 使用 SillyTavern-like shell：`TopBar` 提供 9 个 Font Awesome 图标入口，`DrawerShell` 统一抽屉容器与 backdrop click-to-close，`Sheld` 是 50vw 居中主聊天列，`drawer-rail` layout 负责左右侧抽屉布局。左侧承载 AI Config、API Connections、Advanced Formatting、World Info、User Settings、Backgrounds、Extensions、Persona 8 个抽屉；右侧承载 Characters。

抽屉状态由 `useDrawers` hook 维护：单一 `openId` 保证 mutual exclusion，同一图标再次点击关闭，backdrop 或 Escape 会清空 open state。重抽屉 lazy mount；扩展所需的 `#extensions_settings` / `#extensions_settings2` territory 保持常驻，避免破坏 ST 扩展查询。Yggdrasil `clients/web` / Desktop / App 仍拥有 iframe `SurfaceHost`、导航、权限、安装和平台生命周期；`@ydltavern/surface` 只是 React component library，不是 standalone app，也不拥有平台壳。

#### Visual design system

`src/styles/surface.css` 定义 scoped visual system，包含 29 个 ST-aligned `--tavern-*` tokens，覆盖背景、文字、accent、chat tint、message tint、shadow、border、font scale、animation、Sheld width、avatar 和 icon sizing。ST theme JSON importer/exporter 位于 `src/components/product/themes/st-theme-importer.ts`，在 ST flat JSON 与 YdlTavern `TavernTheme` 之间转换。

内置主题共 6 个：3 个 YdlTavern native（dark、light、parchment）和 3 个 ST classic（Dark V 1.0、Azure、Celestial Macaron）。全局 text-shadow 只在 `.tavern-themed-root` 范围内启用，避免污染 Yggdrasil host 页面。

#### Mobile responsive

移动端覆盖在 `src/styles/mobile.css`，由 `surface.css` 通过 `@import` 引入。它使用 1000px primary breakpoint（匹配 ST `mobile-styles.css`）和 768px secondary breakpoint（更窄竖屏）。1000px 以下抽屉变成 full-screen sheets，top bar 横向滚动，drag/pin handles 隐藏；drawer icons、message buttons、composer buttons 都有更大的 touch target。

移动端还处理 `env(safe-area-inset-bottom)`，`send_textarea` 使用 16px 避免 iOS focus zoom。`prefers-reduced-motion: reduce` 禁用 transitions / animations，`forced-colors: active` 增加显式 border / outline。

### Golden harness

`golden-harness/` 是 Node + jsdom fixture generator。它把 SillyTavern 源码作为只读 sibling（通过 `YDLTAVERN_ST_PATH`）加载，用 shims 拦住 DOM、fetch、随机数和时间，从 ST ESM 模块提取 chat、world-info、macro、instruct、tokenizer fixtures。fixture 作为 YdlTavern 深度移植模块的对齐基准；当前 compare 覆盖 20 个 scenarios（20 perfect、0 cosmetic、0 structural、0 unverifiable、0 error）。

### 扩展生态分发

未来的关键能力：「从 GitHub 地址安装能力包」。Yggdrasil 那边会做成 host 的一条受控 git fetch / 校验 / 沙箱安装路径。YdlTavern 的扩展也走这条路，不自己实现分发逻辑。

详情见 Yggdrasil 的 [`docs/roadmap/NEXT_STEPS.md`](https://github.com/Youzini-afk/Yggdrasil/blob/main/docs/roadmap/NEXT_STEPS.md)。

### 数据所属

- 用户的角色卡、世界书、预设、聊天等内容数据，由 YdlTavern 管理，存在 YdlTavern 自己的存储中（具体形态在实现阶段定）。
- 平台层面的事件、权限授权、提案审计、外发审计，由 Yggdrasil 管理，存在 Yggdrasil 的事件日志里。
- 两层数据可以互相引用（YdlTavern 里的角色 → Yggdrasil 资产 id），但不混在一起。

### 老扩展跑在哪里

兼容层运行在 YdlTavern 内部。老扩展看到的全局 API 由 YdlTavern 提供。当扩展的 API 调用涉及到模型推理、记忆、外发请求时，YdlTavern 把它转换成 Yggdrasil 公开协议调用。

老扩展不知道有 Yggdrasil 存在——它们以为自己还跑在 SillyTavern 里。

## 不变量

不论 YdlTavern 怎么演化：

- 永远跑在 Yggdrasil 公开协议上，不读内部；
- 永远跟 Yggdrasil 在不同仓库；
- 永远不要求 Yggdrasil 加 Tavern 专属 API；
- 永远自己提供 Tavern 产品 UI surface，但不自己拥有平台壳；
- SillyTavern 资产、UI 结构、扩展 API 的兼容覆盖范围只会扩大，不会缩。

## 当前状态

YdlTavern 已经完成 ST 核心运行时的一对一算法移植：资产导入/导出、ST 兼容运行时、STScript 运行时、约 150+ 个 slash commands（A-N，覆盖 199 个 ST canonical commands）、引擎核心（PromptManager、World Info、chat/text completion 适配器、instruct mode、tokenizer registry + HF runtime fetcher、深宏引擎）、内置扩展逻辑、ESM-capable sandbox extension loader、live model call / realtime boundary、产品 surface shell、9 个 provider-backed drawers、browser-ready bundle、9 个 mount adapters、clients/web E2E 集成路径与诊断 inspector 都在可测试代码中。深度移植模块从 ST 源码逐函数移植，内嵌文件/行号引用。

当前状态仍是 `partial`：真实 tokenizer 覆盖已有 OpenAI/GPT-2/Llama/Llama3/Claude/HF families，ST 扩展能在 same-window DOM fork 中通过 globals 与 ESM shims bootstrap，QuickJS sandbox 仍可用于受限 synthetic tests，真实模型调用已能 opt-in 走 Yggdrasil outbound，surface descriptor 已有 Yggdrasil-compliant `manifest.yaml`，golden harness `compare.mjs` 已跑通 20 个 scenarios（20 perfect、0 cosmetic、0 structural、0 unverifiable、0 error）。但这些都还不是全域字节级 ST 对齐——provider-specific I/O、更多真实扩展功能路径和更多 fixture 场景仍需继续补齐。
