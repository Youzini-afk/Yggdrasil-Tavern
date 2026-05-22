# @ydltavern/extensions

SillyTavern built-in extension logic, ST-style extension loader, and extension sandbox package for YdlTavern. Current status is partial: pure logic paths are more complete than provider/DOM/network-heavy paths.

## Recent additions

- QuickJS sandbox in `src/sandbox/`: runtime, host bridge, loader, permissions, and audit.
- The sandbox can execute ST extension JS with constrained `getContext`, extension prompt, event, slash command, and settings bridges, plus extended ST APIs needed by real extension loading.
- The ESM loader supports same-package relative imports; ST host import paths map to a virtual host module.
- network/fetch/XHR/Worker/WebSocket/IndexedDB are blocked by default; host API calls record redacted argument shapes.
- loader-st manifest parse / activation plans can be executed by the sandbox, but real git/zip installation and full DOM/style/i18n injection are not complete.
- Built-in extension coverage is tracked as `5/14 partial`: regex is real; memory/vectors/quick-reply/token-counter are executable pure logic; provider-heavy extensions mostly remain plan/approximation.

## Real extension loading

Real ST extension loading is an opt-in capability for testing and gradually supporting multi-file third-party extensions. It does not enable all browser capabilities by default.

- **Permission gate**: sandbox loader calls must grant `realExtensionLoad: true`. Without it, synthetic tests keep the default minimal behavior.
- **Virtual ST host module**: ST host imports such as `../../../../script.js`, `../../../extensions.js`, and `../../../../openai.js` map to a virtual module exporting the bridge's allowed API surface instead of reading real SillyTavern files.
- **Bridge surface**: in addition to the U0 baseline (`getContext`, event on/emit, slash command, `setExtensionPrompt`, settings), the bridge exposes `event_types`, `extension_prompt_types`, `extension_prompt_roles`, `getRequestHeaders`, `saveSettingsDebounced`, `saveMetadata`, `saveMetadataDebounced`, `reloadCurrentChat`, `updateChatMetadata`, `getExtensionPrompt`, `substituteParams`, and `getTokenCountAsync`.
- **Browser stubs**: `document`, `window`, `localStorage`, `sessionStorage`, `performance`, `crypto`, `AbortController`, `DOMException`, `matchMedia`, and `requestAnimationFrame` are available; `fetch`, `indexedDB`, `Worker`, and `WebSocket` throw blocked errors.
- **Audit**: every host API call is written to the audit log with call name and redacted argument shape.
- **BME smoke**: `test/fixtures/micro-bme/` is the always-on synthetic smoke. Real BME is opt-in with `YGG_BME_TEST_PATH=/path/to/extension npm test`. Real BME is not a full boot yet; it still stops on limitations such as the unsupported `regex/engine.js` import path.

See [`../../docs/guides/REAL_EXTENSION_LOADING.en.md`](../../docs/guides/REAL_EXTENSION_LOADING.en.md) for details.

## Commands

- Typecheck: `npm run typecheck`
- Test: `npm test`
- Build: `npm run build`
