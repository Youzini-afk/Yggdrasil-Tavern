# 真实扩展加载

> [English](./REAL_EXTENSION_LOADING.en.md) · [中文](./REAL_EXTENSION_LOADING.md)

这份指南说明 YdlTavern sandbox 如何加载 SillyTavern 风格的真实 ESM 扩展、当前开放了哪些能力、哪些能力仍被阻断，以及如何写 smoke test。

## 概览

真实扩展加载指：不再只执行单文件 synthetic fixture，而是让 QuickJS sandbox 从扩展目录读取 ESM 入口文件，解析同包 relative imports，注入 ST host API bridge，并运行扩展初始化代码。

当前已启用：

- QuickJS module mode 执行 ESM。
- 同包 relative import 递归预加载。
- 常见 ST host import 路径映射到虚拟模块。
- 最小浏览器 API stub。
- ST API bridge 扩展面。
- host API 调用 audit log。
- always-on synthetic micro-BME smoke。
- env-gated 真实 BME smoke。

当前仍阻断：

- 网络：`fetch`、XHR、`WebSocket`。
- 本地浏览器数据库：`indexedDB`、OPFS。
- `Worker`、WASM native acceleration。
- 真实 DOM 渲染和复杂 UI 生命周期。
- npm bare imports；依赖必须 vendor 到扩展包内。

## Permission gate

真实扩展加载是显式 opt-in。调用 sandbox loader 时必须授予：

```ts
permissions: {
  realExtensionLoad: true,
}
```

未设置该 flag 时，sandbox 保持 synthetic tests 的默认行为：只暴露最小 bridge，不允许把真实扩展目录当 ESM 包递归读取。这让已有单元测试和低信任执行路径不会意外扩大能力面。

`realExtensionLoad` 只允许读取调用方提供的扩展包文件并启用 ESM loader；它不允许网络、IndexedDB、Worker、WebSocket 或真实 DOM。

## ESM module loading

loader 从扩展入口（通常是 `index.js` 或 manifest 指向的脚本）开始：

1. 读取入口源码。
2. 解析静态 `import ... from '...'` 语句。
3. 对 `./`、`../` relative specifier，解析到同一扩展根目录下的文件。
4. 递归预加载这些模块。
5. 在 QuickJS 中以 module mode evaluate。

解析边界是扩展根目录。loader 不会穿越到任意 host 路径，不会解析 npm bare imports，也不会自动访问 `node_modules`。真实第三方扩展如果依赖包管理器产物，应把依赖 bundle/vendor 到扩展目录中。

## Virtual ST host module

SillyTavern 扩展经常用相对路径 import host 文件，例如：

```js
import { event_types, getRequestHeaders } from '../../../../script.js';
import { extension_prompt_types } from '../../../extensions.js';
import { getTokenCountAsync } from '../../../../openai.js';
```

YdlTavern 不读取真实 SillyTavern 源码文件。loader 会把这些 host 路径映射到一个虚拟模块，虚拟模块只导出 sandbox bridge 允许的 API。当前映射包括：

- `../../../../script.js`
- `../../../extensions.js`
- `../../../../openai.js`

后续会扩展更聪明的 path pattern 支持，例如 BME 源码中出现的 `regex/engine.js` 风格路径。

## Browser stubs

可用 stub：

- `document`
- `window`
- `localStorage`
- `sessionStorage`
- `performance`
- `crypto`
- `AbortController`
- `DOMException`
- `matchMedia`
- `requestAnimationFrame`

这些 stub 只为初始化、注册事件、读写设置等逻辑路径服务。它们不是真实浏览器 DOM，也不承诺 UI 渲染。

阻断 API：

- `fetch`：抛 blocked error。
- `indexedDB`：抛 blocked error。
- `Worker`：抛 blocked error。
- `WebSocket`：抛 blocked error。

需要外发能力的扩展不能直接调用 `fetch`。未来应通过 Yggdrasil host outbound capability bridge 暴露受审计路径。

## ST API bridge surface

U0 baseline 已包含：

- `getContext`
- event on/emit
- `registerSlashCommand`
- `setExtensionPrompt`
- settings bridge

真实扩展加载额外暴露：

- `event_types`
- `extension_prompt_types`
- `extension_prompt_roles`
- `getRequestHeaders`
- `saveSettingsDebounced`
- `saveMetadata`
- `saveMetadataDebounced`
- `reloadCurrentChat`
- `updateChatMetadata`
- `getExtensionPrompt`
- `substituteParams`
- `getTokenCountAsync`

这些 API 通过 host bridge 实现。noop 型函数仍会记录 audit；会改变状态的函数通过 bridge 写入 YdlTavern 侧的 settings、metadata 或 extension prompt store。

## Audit log

每个 host API 调用都会进入 sandbox audit log。日志记录调用名、时间、扩展标识和脱敏参数形状，不记录 raw secret。audit 的目的是让真实扩展加载保持可解释：即使某个 stub 是 noop，也能看到扩展尝试调用了什么。

## Smoke test pattern

参考 `packages/ydltavern-extensions/test/sandbox-real-extension.test.mjs`。

典型测试流程：

1. 创建 sandbox runtime。
2. 创建 host bridge，并注入 settings、metadata、extension prompt store 和 event bus。
3. 授予 `realExtensionLoad: true`。
4. 指定扩展根目录和入口文件。
5. 调用 loader evaluate ESM extension。
6. 断言扩展注册了 event listener、写入 settings、调用了 `setExtensionPrompt` 或其他 host API。
7. 读取 audit log，确认调用顺序和参数形状。

最小 smoke 应避免依赖真实网络、IndexedDB、Worker、WASM 或 DOM 渲染。`test/fixtures/micro-bme/` 是推荐形状：它模拟真实扩展的 ESM/import/API 调用模式，但保持小而 deterministic。

## Real BME

真实 BME smoke 是 opt-in：

```bash
YGG_BME_TEST_PATH=/path/to/extension npm test --prefix packages/ydltavern-extensions
```

不设置 `YGG_BME_TEST_PATH` 时，该测试跳过；CI 仍运行 synthetic micro-BME。

当前真实 BME **不是完整启动**。它会在初始化中走到更深的 import/stub 路径，然后因缺失的 `regex/engine.js` import path 等限制停止。这个失败是已知限制：BME 源码包含 loader v1 尚未覆盖的路径形态，以及 IndexedDB/Dexie/OPFS/fetch/WASM/UI 等能力依赖。

因此当前结论只能写成：sandbox 能加载真实 ESM 扩展入口并推进部分 init；synthetic micro-BME always-on 通过；real BME 需 env opt-in 且还未 full boot。

## 限制

- **No fetch**：sandbox 内 `fetch` 被阻断。需要外发时使用 Yggdrasil host outbound，通过 capability bridge 设计受审计调用。
- **No IndexedDB/OPFS**：当前只支持 settings / metadata / prompt store 这类 host bridge 状态，不提供浏览器持久数据库。
- **No Worker/WASM**：后台线程和 native acceleration 不在 v1 能力内。
- **No real DOM rendering**：UI 扩展可以注册、初始化、读写设置，但不会真正渲染复杂面板。
- **Single-package bundle**：只解析同包 relative imports。npm bare imports、外部 `node_modules` 和任意 host path 都不支持；请 vendor 依赖。

## 后续方向

- 更聪明的 ESM resolution，覆盖 BME 的 `regex/engine.js` 这类路径。
- 基于 `Map` 的基础 IndexedDB stub，用于初始化期 schema/setup。
- audited fetch bridge，通过 Yggdrasil outbound 路由。
- WASM loading via host bridge。
- Worker stub。
- 浏览器 stub 更丰富后，再做 full BME functional smoke。
