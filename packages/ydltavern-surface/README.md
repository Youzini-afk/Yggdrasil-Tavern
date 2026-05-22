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

## Manifests

本包保留两份 manifest，各自面向不同 host 层：

- `manifest.yaml` 是 Yggdrasil-compliant package manifest，供 Yggdrasil host 读取，并通过 `kernel.surface.contribution.list` 暴露 `ydltavern/play`、`ydltavern/settings` 和 `ydltavern/extensions`。
- `surface.manifest.json` 是 React-host-side bundle descriptor，保留 framework hints、CSS wrapper、fonts、fixtures 和 sample props 等 SurfaceHost 挂载 React 组件需要的补充信息。
- 两者会并存一段时间；后续当 Yggdrasil surface loader 语义稳定后，可以考虑合并。
- `manifest.yaml` 中每个 surface contribution 的 `metadata` 字段携带 SurfaceHost 需要的 React-specific hints，例如 `framework`、`export_name` 和 `wrapper_class`。

```yaml
# manifest.yaml — Yggdrasil package manifest
contributes:
  surfaces:
    - id: ydltavern/play
      slot: experience_entry
      ...
```

```json
// surface.manifest.json — React bundle descriptor
{
  "manifest_version": "0.1-draft",
  "surfaces": [...]
}
```
