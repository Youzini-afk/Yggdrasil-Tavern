# @ydltavern/extensions

YdlTavern 的 SillyTavern 内置扩展逻辑、ST-style extension loader 和扩展 sandbox 包。当前状态仍是 partial：纯逻辑路径比 provider/DOM/网络型路径更完整。

## Recent additions

- QuickJS sandbox：`src/sandbox/` 包含 runtime、host bridge、loader、permissions 和 audit。
- sandbox 可执行 ST extension JS，提供受限 `getContext`、extension prompt、event、slash command、settings bridge，以及真实扩展加载所需的扩展 ST API。
- ESM loader 支持同包 relative imports；ST host import 路径映射到虚拟 host module。
- 默认阻断 network/fetch/XHR/Worker/WebSocket/IndexedDB；host API 调用记录脱敏后的参数形状。
- loader-st 的 manifest parse / activation plan 可交给 sandbox 执行，但真实 git/zip 安装和完整 DOM/style/i18n 注入仍未完成。
- 内置扩展覆盖目前按 `5/14 partial` 记录：regex 真实，memory/vectors/quick-reply/token-counter 为可执行纯逻辑，provider-heavy 扩展多为 plan/approximation。

## Real extension loading

真实 ST 扩展加载是 opt-in 能力，用于测试和逐步兼容多文件第三方扩展，而不是默认放开所有浏览器能力。

- **Permission gate**：调用 sandbox loader 时必须授予 `realExtensionLoad: true`。未授权时保留 synthetic tests 的默认最小行为。
- **Virtual ST host module**：扩展源码里的 `../../../../script.js`、`../../../extensions.js`、`../../../../openai.js` 等 ST host imports 会映射到虚拟模块，导出 bridge 允许的 API，而不是读取真实 SillyTavern 文件。
- **Bridge surface**：除 U0 baseline（`getContext`、event on/emit、slash command、`setExtensionPrompt`、settings）外，还暴露 `event_types`、`extension_prompt_types`、`extension_prompt_roles`、`getRequestHeaders`、`saveSettingsDebounced`、`saveMetadata`、`saveMetadataDebounced`、`reloadCurrentChat`、`updateChatMetadata`、`getExtensionPrompt`、`substituteParams`、`getTokenCountAsync`。
- **Browser stubs**：`document`、`window`、`localStorage`、`sessionStorage`、`performance`、`crypto`、`AbortController`、`DOMException`、`matchMedia`、`requestAnimationFrame` 可用；`fetch`、`indexedDB`、`Worker`、`WebSocket` 抛 blocked error。
- **Audit**：每个 host API 调用都会写入 audit log，记录调用名和脱敏参数形状。
- **BME smoke**：`test/fixtures/micro-bme/` 是 always-on synthetic smoke；真实 BME 通过 `YGG_BME_TEST_PATH=/path/to/extension npm test` opt-in。真实 BME 目前不是完整启动，仍会在未覆盖的 `regex/engine.js` import 路径等限制处停止。

更多细节见 [`../../docs/guides/REAL_EXTENSION_LOADING.md`](../../docs/guides/REAL_EXTENSION_LOADING.md)。

## Commands

- Typecheck: `npm run typecheck`
- Test: `npm test`
- Build: `npm run build`
