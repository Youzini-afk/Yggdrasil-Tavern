# 下一步

> [English](./NEXT_STEPS.en.md) · [中文](./NEXT_STEPS.md)

Round 8 Y-track 已完成：ST 扩展 same-window 托管、messageFormatting（showdown + DOMPurify + hooks）、React DOM territory cession、`mountSTGlobals()`、ST URL layout shims、Vite dev middleware 与 BME/shujuku 真实扩展 smoke tests 均已落地。这里不再保留 Y-track 项，只记录 Round 9 候选与后续方向。

## Round 9 candidates

- **Production extension hosting**：在 host 上实现 `/scripts/extensions/<id>/` static route，服务已安装扩展文件与 ST compatibility shims。
- **Activity Drawer**：透明展示扩展活动（fetch URL hash、localStorage writes、slash command registrations、event listeners、DOM mount targets），不做拦截。
- **Phase B pain-point resolution**：以 [`../guides/PERFORMANCE_BASELINE.md`](../guides/PERFORMANCE_BASELINE.md) 和 `perf/baseline.json` 为 regression reference，推进 multi-agent / MCP / vector RAG / ToolManager 的协议边界与用户路径。

## Phase B pain-point resolution

Phase B 事项都应在同机前后对比 `perf/baseline.json`，普通稳定场景以 10% 为 advisory 阈值，波动较大的 E2E / jsdom / WASM 场景以 20% 为 advisory 阈值。

- **Multi-agent orchestration**：定义 YdlTavern 如何把 ST-style chat flow 映射到 Yggdrasil agent/session 协作，而不是把 agent 逻辑塞进 UI。
- **MCP protocol surface**：明确 MCP tool/resource/prompt 通过 Yggdrasil capability boundary 暴露给 YdlTavern 的方式。
- **Vector RAG**：把 memory/vectors extension 的 plan-only 路径推进到 audited vector retrieval，保持 host-managed storage 与 outbound policy。
- **ToolManager full registration**：补齐 ST ToolManager / slash / extension command 的注册、权限、审计与 UI 可见性。

## Surface hosting and marketplace

- **Production bundle hosting**：在 Yggdrasil host 上实现 package static route，把已安装 package 的 `bundle.mjs`、styles、fonts、ST compatibility shims 与 extension files 作为 same-origin URLs 暴露。
- **Cross-origin allowlist**：为社区 marketplace 设计 surface bundle allowlist、integrity pin、version pin 与 audit metadata；默认仍要求 same-origin。
- **Multiple mounted surfaces**：把当前单一 outlet 扩展为可管理多个 iframe surface，同时保留 sandbox 与 lifecycle isolation。

## Golden harness follow-up

- 继续增加 WI、macro、instruct、tokenizer 和 chat fixtures，避免当前 20/20 perfect 被误读为全域 ST 兼容。
- 保持 `_summary.json` 作为文档数字来源。

## Extension ecosystem follow-up

- 为真实第三方扩展维护单独兼容记录：可加载、可初始化、核心功能可用、需要 patch、不支持。
- 随社区扩展暴露继续补 legacy lib shims 与 ST module URL shims。
- 扩展安装走 Yggdrasil git package channel；加载能力不等同于安装 UX 完成。
