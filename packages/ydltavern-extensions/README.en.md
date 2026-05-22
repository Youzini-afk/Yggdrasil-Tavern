# @ydltavern/extensions

SillyTavern built-in extension logic, ST-style extension loader, and extension sandbox package for YdlTavern. Current status is partial: pure logic paths are more complete than provider/DOM/network-heavy paths.

## Recent additions

- QuickJS sandbox in `src/sandbox/`: runtime, host bridge, loader, permissions, and audit.
- Sandbox v0 can execute ST extension JS with constrained `getContext`, extension prompt, event, slash command, and settings bridges.
- network/fetch/XHR are blocked by default; host API calls record redacted argument shapes.
- loader-st manifest parse / activation plans can be executed by the sandbox, but real git/zip installation and full DOM/style/i18n injection are not complete.
- Built-in extension coverage is tracked as `5/14 partial`: regex is real; memory/vectors/quick-reply/token-counter are executable pure logic; provider-heavy extensions mostly remain plan/approximation.

## Commands

- Typecheck: `npm run typecheck`
- Test: `npm test`
- Build: `npm run build`
