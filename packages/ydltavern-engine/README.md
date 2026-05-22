# YdlTavern Engine（Yggdrasil 子进程能力包）

这是 YdlTavern 引擎的 Yggdrasil 子进程能力包。

当前阶段：主要能力面 contract slice。`world_info.evaluate`、`preset.compile`、`turn.generate`、`turn.swipe/regenerate/continue`、asset import/export、script.eval、extension registry/loader plan、model.plan_call 会调用本仓库的 types、engine-core、importers、st-compat、extensions，并透传 prompt、WI、token、stream、extension、model boundary diagnostics。仍无真实模型调用、无网络、无 raw secret。

## 使用

- 构建：`npm run build`
- 类型检查：`npm run typecheck`
- 测试：`npm test`
- 挂到 Yggdrasil host：在 host profile 里 autoload 这个 manifest：`packages/ydltavern-engine/manifest.yaml`

## 后续

下一步是补真实 tokenizer/golden harness、更多 slash commands、真实扩展 JS sandbox 和通过 Yggdrasil public protocol 的真实模型调用；当前 fake generation 只验证 contract 生命周期。

- [C 轨道：引擎核心](../../docs/tracks/C_ENGINE_CORE.md)
