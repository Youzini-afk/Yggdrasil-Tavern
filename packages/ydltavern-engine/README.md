# YdlTavern Engine（Yggdrasil 子进程能力包）

这是 YdlTavern 引擎的 Yggdrasil 子进程能力包骨架。

当前阶段：只有 stub 响应，无真实模型调用、无网络、无文件系统。

## 使用

- 构建：`npm run build`
- 类型检查：`npm run typecheck`
- 挂到 Yggdrasil host：在 host profile 里 autoload 这个 manifest：`packages/ydltavern-engine/manifest.yaml`

## 后续

preset compile / WI evaluate / generate pipeline 跟随 C 与 I 轨道实现。

- [C 轨道：引擎核心](../../docs/tracks/C_ENGINE_CORE.md)
