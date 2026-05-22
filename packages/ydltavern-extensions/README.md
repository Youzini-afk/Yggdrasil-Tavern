# @ydltavern/extensions

YdlTavern 的 SillyTavern 内置扩展逻辑、ST-style extension loader 和扩展 sandbox 包。当前状态仍是 partial：纯逻辑路径比 provider/DOM/网络型路径更完整。

## Recent additions

- QuickJS sandbox：`src/sandbox/` 包含 runtime、host bridge、loader、permissions 和 audit。
- sandbox v0 可执行 ST extension JS，提供受限 `getContext`、extension prompt、event、slash command、settings bridge。
- 默认阻断 network/fetch/XHR；host API 调用记录脱敏后的参数形状。
- loader-st 的 manifest parse / activation plan 可交给 sandbox 执行，但真实 git/zip 安装和完整 DOM/style/i18n 注入仍未完成。
- 内置扩展覆盖目前按 `5/14 partial` 记录：regex 真实，memory/vectors/quick-reply/token-counter 为可执行纯逻辑，provider-heavy 扩展多为 plan/approximation。

## Commands

- Typecheck: `npm run typecheck`
- Test: `npm test`
- Build: `npm run build`
