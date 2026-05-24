# 下一步

> [English](./NEXT_STEPS.en.md) · [中文](./NEXT_STEPS.md)

这份文档讲 YdlTavern 接下来要往哪走。已完成的现状和兼容覆盖率见 [`../COMPATIBILITY_MATRIX.md`](../COMPATIBILITY_MATRIX.md)。

## 接下来会推进的工作

下面这些不构成新阶段，是已知该做、也会真实推进的事项。

### 扩展生态托管

- **生产扩展 hosting**：在 host 上实现 `/scripts/extensions/<id>/` static route，服务已安装扩展文件与 ST compatibility shims。
- **Activity Drawer**：透明展示扩展活动（fetch URL hash、localStorage writes、slash command registrations、event listeners、DOM mount targets），不做拦截。

### 性能与对齐

性能基线见 [`../guides/PERFORMANCE_BASELINE.md`](../guides/PERFORMANCE_BASELINE.md) 与 `perf/baseline.json`。后续优化以基线为 regression reference，普通稳定场景以 10% 为 advisory 阈值，波动较大的 E2E / jsdom / WASM 场景以 20%。

- **Multi-agent orchestration**：定义 YdlTavern 如何把 ST-style chat flow 映射到 Yggdrasil agent / session 协作，而不是把 agent 逻辑塞进 UI。
- **MCP protocol surface**：明确 MCP tool / resource / prompt 通过 Yggdrasil capability boundary 暴露给 YdlTavern 的方式。
- **Vector RAG**：把 memory / vectors extension 的 plan-only 路径推进到 audited vector retrieval，保持 host-managed storage 与 outbound policy。
- **ToolManager 完整注册**：补齐 ST ToolManager / slash / extension command 的注册、权限、审计与 UI 可见性。

### Surface hosting 与 marketplace

- **生产 bundle hosting**：在 Yggdrasil host 上实现 package static route，把已安装 package 的 `bundle.mjs`、styles、fonts、ST compatibility shims 与 extension files 作为 same-origin URLs 暴露。
- **Cross-origin allowlist**：为社区 marketplace 设计 surface bundle allowlist、integrity pin、version pin 与 audit metadata；默认仍要求 same-origin。
- **多挂载 surface**：把当前单一 outlet 扩展为可管理多个 iframe surface，同时保留 sandbox 与 lifecycle isolation。

### Golden harness

- 继续增加 WI、macro、instruct、tokenizer 和 chat fixtures，避免当前 20/20 perfect 被误读为全域 ST 兼容。
- 保持 `_summary.json` 作为文档数字来源。

### 扩展生态

- 为真实第三方扩展维护单独兼容记录：可加载、可初始化、核心功能可用、需要 patch、不支持。
- 随社区扩展暴露继续补 legacy lib shims 与 ST module URL shims。
- 扩展安装走 Yggdrasil git package channel；加载能力不等同于安装 UX 完成。
