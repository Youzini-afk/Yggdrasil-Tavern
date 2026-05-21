# YdlTavern Engine（Yggdrasil 子进程能力包）

这是 YdlTavern 引擎的 Yggdrasil 子进程能力包。

当前阶段：contract slice。`preset.compile`、`turn.generate`、`turn.swipe/regenerate/continue`、角色卡/世界书导入会调用本仓库的 types、engine-core、importers、st-compat。仍无真实模型调用、无网络、无 secret。

## 使用

- 构建：`npm run build`
- 类型检查：`npm run typecheck`
- 测试：`npm test`
- 挂到 Yggdrasil host：在 host profile 里 autoload 这个 manifest：`packages/ydltavern-engine/manifest.yaml`

## 后续

下一步是让 world info / persona / instruct 进入 prompt-critical 路径；当前 fake generation 只验证 contract 生命周期。

- [C 轨道：引擎核心](../../docs/tracks/C_ENGINE_CORE.md)
