# YdlTavern Round 8 — 完美 ST DOM Fork (Y-track) [REVISED]

> 临时计划文件。每阶段完成后 push。全部完成后由 Y7 删除并并入长期文档。
>
> 注：之前 Round 8 plan (heavy iframe runtime + manifest v2 + endowments) 方向错误 —
> 那要求社区扩展全部重写适配。本计划取代之，目标是 **ST 扩展无修改即跑**。

## 立场重新校准

```text
错的方向 (前一版 plan):
  ✗ Manifest v2 + endowments + 权限弹窗
  ✗ iframe-per-extension + Comlink 异步桥
  ✗ 强制开发者改 manifest
  → 这不叫 fork, 叫"另一个不兼容的扩展平台"

对的方向 (本计划):
  ✓ 完整镜像 ST 行为: 同窗口运行, 全 API 开放, 全 DOM 可改
  ✓ React 让出 ST 扩展期待的 DOM 领地
  ✓ 提供 ST 标准 URL 布局 + 全局变量 + ESM 兼容门面
  ✓ 旧扩展文件不改一行直接跑
  ✓ 信任模型 = ST 模型 (社区策展 + 用户自担)
```

## 调研基础 (摘要, 长期文档由 Y7 落地)

### ST 扩展契约 (实测自 SillyTavern release)

```text
1. messageFormatting() (script.js:1753-1911) 管线:
   raw → regex扩展 → 引号/代码保护 → showdown → DOMPurify (hooks) → 类前缀化

2. Showdown 配置 (script.js:520-537):
   { emoji, literalMidWordUnderscores, parseImgDimensions, tables,
     underline, simpleLineBreaks, strikethrough, disableForced4SpacesIndentedSublists }
   + markdownUnderscoreExt() + markdownExclusionExt()

3. DOMPurify 配置:
   ADD_TAGS: ['custom-style']
   hooks (chats.js:1901-2009):
     - afterSanitizeAttributes: target=_blank rel=noopener
     - uponSanitizeAttribute: 类名前缀 'custom-' (除 fa- / note- / monospace)
     - uponSanitizeElement: 媒体 allow-list + 换行
     + encodeStyleTags / decodeStyleTags (CSS 选择器前缀化 .mes_text)

4. 关键 DOM 锚点:
   #chat (消息列表)
   #extensions_settings, #extensions_settings2 (扩展设置面板)
   #extensionsMenu (魔杖菜单弹窗)
   #movingDivs (浮动元素容器)
   #send_but_sheld (发送区域 — 实测无此 ID, 实际是 #leftSendForm/#rightSendForm)
   .mes / .mes_block / .mes_text / .mes_buttons / .swipes-counter

5. 公开 globals:
   globalThis.SillyTavern = { libs, getContext }
   ESM exports (extensions 通过 import 取):
     chat, characters, this_chid, chat_metadata, eventSource, event_types,
     extension_prompt_types, extension_prompt_roles, getRequestHeaders, ...
   window.* (legacy lib shims):
     Fuse, DOMPurify, hljs, localforage, Handlebars, diff_match_patch,
     SVGInject, showdown, moment, Popper, droll

6. 扩展导入路径:
   import { ... } from "../../../script.js";          → /script.js
   import { ... } from "../../extensions.js";         → /scripts/extensions.js
   扩展自身位置:                                      → /scripts/extensions/<id>/index.js
```

### YdlTavern 当前状态 vs 目标差距

```text
位置                现状                    需要改成
────────────────────────────────────────────────────────────
.mes_text           {message.text} 纯文本React  dangerouslySetInnerHTML, 走 messageFormatting
.mes_block          已有                    保持
.mes_buttons        已有,但无扩展 mount     增加 .mes_buttons_extra mount slot
#chat               无                      在 MessageList 加 id=chat
#extensions_settings 无                      在 ExtensionsDrawer 加, jQuery 接管
#extensions_settings2 无                     同上
#extensionsMenu     无                      TopBar 旁加, jQuery 接管
#movingDivs         无                      TavernShell 顶层加, jQuery 接管
#leftSendForm       无                      SendForm 包装层
#rightSendForm      无                      SendForm 包装层
window.SillyTavern  无                      bootstrap 时挂载
window.eventSource  无 (仅 sandbox 内)      bootstrap 时挂载
window.chat / etc   无                      bootstrap 时挂载
window.$            无 (但要不要 jQuery?)   YES — 社区扩展全靠它, 必须打包
window.showdown     无                      legacy lib shim
window.DOMPurify    无                      legacy lib shim
/script.js          无                      Vite serve - 兼容门面
/scripts/extensions.js 无                   Vite serve - 兼容门面
/scripts/extensions/ 无                     Vite serve - 真扩展文件
showdown 依赖       无                     新增
DOMPurify 依赖      surface 包无 (golden 有) 新增到 surface
jquery 依赖         无                      新增 (社区扩展 100% 依赖)
```

## 阶段

### Y0 — Re-plan push

删除老 Round 8 plan (heavy iframe runtime 方向错的), 写本文件, push。

### Y1 — Message formatting pipeline (与 ST 字节级对齐)

**位置**: `packages/ydltavern-surface/src/formatting/`

**新增依赖** (surface 包):
```json
"showdown": "^2.1.0",
"dompurify": "^3.4.5",
"@types/showdown": "^2.0.6",
"@types/dompurify": "^3.2.0"
```

**新增文件**:
```text
packages/ydltavern-surface/src/formatting/
  converter.ts                  // showdown 实例 + ST 配置 + markdownUnderscoreExt + markdownExclusionExt
  sanitize.ts                   // DOMPurify config + hooks (target/rel, class前缀化, 媒体allow-list)
  style-tags.ts                 // encodeStyleTags / decodeStyleTags (CSS 选择器加 .mes_text 前缀)
  message-formatting.ts         // formatMessage(raw, opts) — ST messageFormatting 1:1 港口
  hooks.ts                      // 扩展可注册的 pre/post 钩子
  index.ts                      // 统一导出
```

**测试**:
```text
test/formatting/
  converter.test.ts             // showdown 配置回归
  sanitize.test.ts              // XSS 向量 (img onerror / javascript: / iframe / svg onload / data: 等)
  style-tags.test.ts            // CSS 前缀化
  message-formatting.test.ts    // ST 行为对齐: regex → markdown → sanitize 端到端
  hooks.test.ts                 // 钩子注册/触发/卸载
```

**关键约束**:
- 配置必须与 ST 字节级对齐（参见调研报告 line 40-78）
- 类名前缀 `custom-` 跟 ST 一致 (除 `fa-` / `note-` / `monospace`)
- 链接 `target=_blank` + `rel=noopener noreferrer`
- 默认禁用: `<style>`, inline `style=`, `<iframe>`, `on*`, `srcdoc`, `<script>`
- 允许的 data: URI 仅 image/* base64
- 钩子位置: `preMarkdown`, `preSanitize`, `postRender`(DOM)

### Y2 — DOM 领地分配 (React 让出 ST 扩展期待的容器)

**位置**: `packages/ydltavern-surface/src/`

**改动文件**:
```text
app/TavernShell.tsx                       加 #movingDivs 顶层容器
components/product/MessageList.tsx        加 id="chat"
components/product/Message/MessageBubble.tsx
                                          .mes_text 改 dangerouslySetInnerHTML (用 Y1)
                                          加 .mes_buttons_extra mount slot
components/shell/TopBar.tsx               加 #extensionsMenu 兄弟容器
components/product/Composer/SendForm.tsx  加 #leftSendForm / #rightSendForm 包装
components/shell/drawers/ExtensionsDrawer.tsx
                                          加 #extensions_settings + #extensions_settings2 jQuery 让出区
```

**让出策略** (具体到组件):

```tsx
// 完全让出 (jQuery 接管子树)
<div id="extensions_settings" ref={extSettingsRef} />
// useEffect:
//   只在 mount 时记录 ref, 永不 setState 重渲, 永不 setProps
//   组件 return 之后 React 不再触碰内部 DOM

// 协作区 (React 渲染默认 + 扩展 mount slot)
<div className="mes_buttons">
  {/* React 渲染默认按钮: edit/delete/swipe */}
  <span className="mes_buttons_extra" ref={extraRef} />
  {/* extra 子树 React 不进入, 扩展往这里 append */}
</div>

// 消息文本 (走 messageFormatting)
<div
  className="mes_text"
  ref={mesTextRef}
  dangerouslySetInnerHTML={{ __html: formatted }}
/>
// formatted = formatMessage(raw, {isUser, isSystem, ...})
// useEffect 跑 postRender hooks (扩展可注册)
```

**测试** (新增 surface tests):
```text
test/dom-territory.test.ts        各容器 ID/类正确渲染
test/message-bubble-html.test.ts  .mes_text 真 HTML 渲染 + 扩展 className 不被剥
test/extension-mount-slots.test.ts mes_buttons_extra 子树 jQuery 注入后 React 不抹
```

### Y3 — Window globals bootstrap

**位置**: `packages/ydltavern-st-compat/src/window-bootstrap.ts` (新文件)

**任务**: 新增 `mountSTGlobals(opts)` 函数, 在 surface 启动时调用, 把 ST 期待的全部 globals 挂到 `window`/`globalThis`。

```typescript
// window-bootstrap.ts

export interface MountSTGlobalsOptions {
  context: STContextDeep;  // 来自 createSTContextDeep()
  jQuery?: typeof globalThis.$;  // 主流形态: 直接传 jQuery 实例
  showdown?: any;
  dompurify?: any;
  toastr?: any;
}

export function mountSTGlobals(opts: MountSTGlobalsOptions): void {
  const ctx = opts.context;
  const g = globalThis as any;

  // 1. SillyTavern.{libs, getContext}
  g.SillyTavern = {
    libs: {
      DOMPurify: opts.dompurify,
      showdown: opts.showdown,
      // 其他 libs 按需补
    },
    getContext: () => ctx,  // 必须每次返回最新, 不能缓存
  };

  // 2. live globals (ST 通过 ESM export, 我们镜像到 window)
  g.eventSource = ctx.eventSource;
  g.event_types = ctx.event_types;
  g.chat = ctx.chat;  // 注意: ctx.chat 是 live array
  g.characters = ctx.characters;
  g.this_chid = ctx.this_chid;
  g.chat_metadata = ctx.chat_metadata;
  g.extension_settings = ctx.extension_settings;
  g.extension_prompt_types = ctx.extension_prompt_types;
  g.extension_prompt_roles = ctx.extension_prompt_roles;
  g.getRequestHeaders = ctx.getRequestHeaders;

  // 3. SlashCommandParser
  g.SlashCommandParser = ctx.SlashCommandParser;

  // 4. helpers
  g.callPopup = ctx.callPopup ?? makeCallPopupShim();
  g.toastr = opts.toastr ?? makeToastrShim();

  // 5. lib shims (ST lib.js 行为)
  if (opts.jQuery) g.$ = opts.jQuery;
  if (opts.showdown) g.showdown = opts.showdown;
  if (opts.dompurify) g.DOMPurify = opts.dompurify;

  // 6. 给 SETTINGS_LOADED / APP_READY 这种事件触发的钩子留接口
  // 扩展期待启动时 eventSource 已就位
}
```

**重要**: `ctx.chat` 必须是同 reference 的 live array, 扩展 `chat[i].mes = "x"` 立即生效。Round 1-7 已经把 chat 做成 live proxy, 这里只是把 reference 暴露出去。

**集成点**: `packages/ydltavern-surface/src/app/TavernProvider.tsx` 在初始化时调一次 `mountSTGlobals(...)`。

**测试**:
```text
test/window-bootstrap.test.ts     mount 后 window.SillyTavern.getContext() 工作
                                  window.chat[0].mes = "x" 后, ctx.chat[0].mes === "x"
                                  window.eventSource.on / emit 工作
                                  jQuery / showdown / DOMPurify 挂载 (若提供)
```

### Y4 — ESM 兼容门面 (script.js / extensions.js)

**位置**: `packages/ydltavern-surface/public/st-compat/`

**任务**: 创建 ST 期待路径的 ESM 模块文件, 浏览器加载扩展时, `import "../../../script.js"` 命中这些文件。

```text
public/st-compat/
  script.js                                   # 顶层 script.js 兼容门面
  scripts/
    extensions.js                             # 扩展管理器门面
    events.js                                 # event_types / eventSource (从 window)
    st-context.js                             # getContext 门面
    extensions/
      third-party/
        (placeholder)                         # 真扩展 dist 在这里 mount
```

**script.js 内容** (re-export 全部 ST 期待的 ESM exports):

```javascript
// public/st-compat/script.js
// SillyTavern compatibility shim for YdlTavern.
// Re-exports core globals from window.* / globalThis.*

const g = globalThis;

// Live globals (Y3 已挂载)
export const chat = g.chat;
export const characters = g.characters;
export const this_chid = g.this_chid;
export const chat_metadata = g.chat_metadata;
export const eventSource = g.eventSource;
export const event_types = g.event_types;
export const extension_prompt_types = g.extension_prompt_types;
export const extension_prompt_roles = g.extension_prompt_roles;

// Functions
export const getRequestHeaders = (...args) => g.getRequestHeaders?.(...args);
export const saveSettingsDebounced = (...args) => g.saveSettingsDebounced?.(...args);
export const saveMetadata = (...args) => g.saveMetadata?.(...args);
export const reloadCurrentChat = (...args) => g.reloadCurrentChat?.(...args);
export const messageFormatting = (...args) => g.messageFormatting?.(...args);
export const substituteParams = (...args) => g.substituteParams?.(...args);
export const setExtensionPrompt = (...args) => g.SillyTavern?.getContext()?.setExtensionPrompt?.(...args);
export const getExtensionPrompt = (...args) => g.SillyTavern?.getContext()?.getExtensionPrompt?.(...args);
export const generateRaw = (...args) => g.SillyTavern?.getContext()?.generateRaw?.(...args);
// ... 其余 30+ exports

// Constants
export const COMMENT_NAME_DEFAULT = '_System Notification';
// ... 其余常量
```

**extensions.js 内容**:

```javascript
// public/st-compat/scripts/extensions.js
const g = globalThis;

export const extension_settings = g.extension_settings;
export const getContext = () => g.SillyTavern?.getContext();
export const renderExtensionTemplateAsync = (...args) =>
  g.SillyTavern?.getContext()?.renderExtensionTemplateAsync?.(...args);
export const doExtrasFetch = (...args) =>
  g.SillyTavern?.getContext()?.doExtrasFetch?.(...args);
export const getApiUrl = (...args) =>
  g.SillyTavern?.getContext()?.getApiUrl?.(...args);
export const modules = g.modules ?? [];
export const ModuleWorkerWrapper = g.ModuleWorkerWrapper ?? class { /* ... */ };
export const openThirdPartyExtensionMenu = (...args) =>
  g.SillyTavern?.getContext()?.openThirdPartyExtensionMenu?.(...args);
// ... 完整 export 表 (基于扩展实测调研)
```

**完整 export 表** 通过把 ST source 的 `export` 行 grep 出来, 全部对齐。Y4 用 @explorer 完成: 跑一遍 ST source 的 export 抽取, 对每一个 export 在我们的门面里做个对应.

### Y5 — Vite middleware (clients/web 提供 ST URL 布局)

**位置**: `clients/web/vite.config.ts`

**任务**: Vite dev server 中间件, 把 ST 期待的 URL 路径 serve 出来:

```text
URL 路径                          → 文件
─────────────────────────────────────────────
/script.js                        → packages/ydltavern-surface/public/st-compat/script.js
/scripts/extensions.js            → packages/ydltavern-surface/public/st-compat/scripts/extensions.js
/scripts/events.js                → packages/ydltavern-surface/public/st-compat/scripts/events.js
/scripts/st-context.js            → packages/ydltavern-surface/public/st-compat/scripts/st-context.js
/scripts/extensions/<id>/*        → 用户安装的扩展 (动态)
```

**生产环境**: clients/desktop 的 Tauri build 把这些静态文件打进 bundle, host serve 静态路由。Y5 v0 只做 dev server, production 在 Y7 文档化标 TODO.

**测试**:
- 启动 vite dev server
- curl http://127.0.0.1:1420/script.js → 200 + 正确内容
- 浏览器在 surface 里 dynamic import('/script.js') 工作

### Y6 — 真实扩展 smoke 测试 (BME / shujuku 加载到 ready)

**位置**: `packages/ydltavern-surface/test/real-extension-smoke.test.ts` (新)

**任务**: 不要求扩展完整 init (BME 需要真 LM/server, shujuku 需要某些上下文), 只验证:
1. ESM 模块解析: `../../../script.js` 命中我们的门面
2. window.SillyTavern.getContext() 返回有效对象
3. eventSource.on(...) 注册成功
4. 扩展 register 的 slash 命令出现在 SlashCommandParser
5. .mes_text DOM 让出区可以被 jQuery 操作不被 React 抹

**BME smoke** (需要 `YGG_BME_TEST_PATH=/workspace/Yggdrasil/ST-Bionic-Memory-Ecology`):
```text
1. 浏览器环境 (jsdom + happy-dom 都不太行, 用 playwright + headless chromium)
   或者纯 Node + jsdom + 自己 mock window:
2. 加载 surface bundle (TavernProvider mount → 全局挂上)
3. <script type="module"> import '/scripts/extensions/third-party/bme/index.js'
4. 等扩展自身 init (Dexie ensureLoaded, WASM init, eventSource 注册)
5. assert: window.eventSource 至少 N 个 listener (BME 注册 ~30+)
6. assert: 无未捕获异常 (init 内部因 LM 缺失会有 warn, OK)
```

**shujuku smoke** (需要 `YGG_SHUJUKU_TEST_PATH=/workspace/Yggdrasil/shujuku`):
```text
1. 加载 build:extension 输出 (rollup-bundled IIFE)
2. <script src="..."> 注入到 head
3. assert: 设置面板按钮出现在 #extensions_settings 子树
4. assert: SQL.js init 完成 (sql-wasm.wasm 加载)
5. assert: localStorage 写入有命名空间前缀
```

**降级**: CI 环境若两个真 plugin 路径不可达, 跑合成 micro-fixtures (一个最小 ST-style ESM 扩展 + 一个最小 IIFE 扩展)。

### Y7 — 文档收敛 + 删除临时 plan

**新增长期文档** (双语):

1. `docs/guides/EXTENSION_COMPATIBILITY.md` / `.en.md` — 200-300 行
   - ST 兼容承诺 (无需修改适配)
   - 安装方式 (Yggdrasil git install 通道)
   - DOM 契约 (我们提供哪些 ID/容器)
   - 全局变量 (window.SillyTavern.* / eventSource / chat / ...)
   - URL 布局 (/script.js / /scripts/extensions.js)
   - 信任模型 (ST 模型, 用户自担)
   - Activity Drawer 调试面板
   - 已知差异 (我们多了什么 / ST 有但我们没的)

2. `docs/research/round8/` — 调研档归档
   - `EXTENSION_FORK_RESEARCH.md` / `.en.md` — 三份 /tmp 报告合成
   - `ST_DOM_CONTRACT.md` / `.en.md` — Task B/C 数据
   - `MESSAGE_FORMATTING_PIPELINE.md` / `.en.md` — Task A 数据

**更新现有文档**:
- `README.md` / `.en.md` — Round 8 完成行
- `docs/COMPATIBILITY_MATRIX.md` / `.en.md` — DOM 契约 + 全局变量行 implemented
- `docs/ARCHITECTURE.md` / `.en.md` — 新增 "Extension hosting model" 章节
- `docs/roadmap/NEXT_STEPS.md` / `.en.md` — 删 Round 8 项, 加 Round 9 候选 (baseline benchmark / 性能优化 / production hosting)
- `docs/tracks/H_EXTENSION_INTEGRATION.md` / `.en.md` — 升级到完美兼容状态

**删除临时 plan**: `rm docs/YDLTAVERN_ROUND8_PLAN.md`

**最终验证**:
```bash
# 全部 typecheck/test
for pkg in types importers engine-core engine extensions st-compat surface; do
  npm run typecheck --prefix packages/ydltavern-$pkg
  npm test --prefix packages/ydltavern-$pkg
done

# surface build (with bundle)
npm run build --prefix packages/ydltavern-surface
ls packages/ydltavern-surface/dist/  # 含 bundle.mjs + fonts + st-compat shims

# golden harness 不退步
cd golden-harness && node compare.mjs --all > /dev/null && cat diff/_summary.json
# 期望: 仍 20/20 perfect

# clients/web 启动 + 静态路径
cd ../../Yggdrasil
cargo run -p ygg-cli -- host serve --http 127.0.0.1:8787 --profile profiles/forge-alpha.yaml &
npm run dev --prefix clients/web &
curl http://127.0.0.1:1420/script.js | head -10  # 期望: ESM 文件内容
curl http://127.0.0.1:1420/scripts/extensions.js | head -10  # 同上

# 真扩展 smoke (opt-in)
YGG_BME_TEST_PATH=/workspace/Yggdrasil/ST-Bionic-Memory-Ecology \
YGG_SHUJUKU_TEST_PATH=/workspace/Yggdrasil/shujuku \
  npm test --prefix packages/ydltavern-surface

# 文档残留检查
grep -rn "YDLTAVERN_ROUND8_PLAN" docs/ README* 2>&1  # 期望: 空
grep -rn "heavy iframe runtime\|manifest_version.*2\|endowments" docs/ 2>&1  # 期望: 空
```

## 完成判据

- 现有 1282+ tests + 新增 60-100 tests 全绿
- golden harness 仍 20/20 perfect
- showdown + DOMPurify + jQuery 引入并打包
- React shell 渲染所有 ST 期待 DOM ID/类
- window.SillyTavern.getContext() 工作
- /script.js 和 /scripts/extensions.js 浏览器可 import
- BME ESM 模块 import 解析成功
- BME eventSource 注册可见
- shujuku IIFE 加载, sql-wasm 工作
- 临时 plan 删除, 长期 guide + research 落地

## 不变量 (与 ST 一致)

- 内核 content-free
- 信任模型 = ST: 100% 全开权限, 不做权限弹窗, 不做 endowment
- secret_ref 仍是 host-side, 永不入扩展能见
- 现有 944+ tests + 138 slash 行为不变
- AGPLv3 + AGPL-兼容依赖

## 不变量 (我们额外的)

- 跨扩展 storage 不强制隔离 (ST 也不隔离), 但 Activity Drawer 透明显示哪个扩展写了什么
- 错误隔离: try/catch 包扩展回调, 一个崩不带垮整体 (ST 已有, 我们一致)
- React/jQuery 边界: extension territory 一旦 mount, React 永不进入

## 阶段并行依赖

```text
Wave 1 (独立, 4 路并行):
  Y1  formatting pipeline      (showdown + DOMPurify + hooks)
  Y3  window globals bootstrap (st-compat package)
  Y4  ESM 兼容门面文件          (surface package public/)
  Y5 也独立? Y5 调用 Y4 的文件 → 序列后

Wave 2 (依赖 Wave 1):
  Y2  React DOM 让出           (depends Y1 — MessageBubble 用 formatMessage)
  Y5  Vite middleware           (depends Y4 — serves Y4 produced files)

Wave 3 (依赖 Y2 + Y3 + Y5):
  Y6  真扩展 smoke

Wave 4:
  Y7  文档收敛
```

总计 ~10 天工作量 (与之前 plan 估算接近), 但每一份工作都是真实的 fork 兼容性, 不是错方向的扩展平台。
