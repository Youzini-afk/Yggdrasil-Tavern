# @ydltavern/surface

YdlTavern 的 Yggdrasil-hosted React surface bundle。它不是独立 Web/Desktop/App 壳；Yggdrasil shell 负责发现、挂载、权限和平台生命周期。

## Recent additions

- Product UI skeleton：顶部栏、角色栏、聊天主区域、composer、generation controls、settings/assets/extensions/dev 抽屉。
- `react-virtuoso` 虚拟聊天列表，替代诊断页式全量渲染。
- dark / light / parchment 内置主题和 CSS variable 主题系统。
- SettingsPanel 分页：Connection、Sampler、Persona、Theme。
- ExtensionsDrawer 使用真实 loader-st 状态展示扩展启用/禁用/依赖信息。
- QuickReplyBar 和移动响应式布局。

仍是 partial：完整 ST 操作流、主题文件导入、截图对齐和性能目标验收还没完成。

## Commands

- Typecheck: `npm run typecheck`
- Build: `npm run build`
