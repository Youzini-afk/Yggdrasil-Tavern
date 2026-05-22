# 下一步

> [English](./NEXT_STEPS.en.md) · [中文](./NEXT_STEPS.md)

Round 4 U-track 与 Round 5 V-track 已完成：sandbox ESM loader、browser stubs、extended ST API bridge、BME smoke、chat tools 条件发出、World Info 预算/概率对齐、macro engine 深实现迁移、SillyTavern UI parity shell、9 抽屉、ST theme JSON import/export、移动端响应式，以及 durable docs 更新均已落地。这里不再保留 U1-U6 或 V1-V7 临时任务，只记录后续方向。

## Surface UI 后续

- **接通 V5 表单 change handlers**：把 V5 中标记 TODO V7 的 drawer form handlers 全部接到 `TavernProvider`，避免只更新局部 UI 或 stub。
- **SamplerForm → TavernProvider**：sampler matrix、preset、banned tokens、logit bias、streaming 等 change events 写入统一 settings state。
- **ConnectionForm / PersonaForm → TavernProvider**：provider profile、status、persona list、persona edit form 与 toggles 接入 provider state。
- **Drawers → live Yggdrasil capabilities**：World Info list 从 `kernel.surface.contribution.list` / 未来 worldbook capability 读取；character list 接入 importers；extensions、backgrounds、API profiles 接真实 host 数据。
- **clients/web 端到端 hosting**：用真实 Yggdrasil `clients/web` 挂载全部 9 个 surface contributions，覆盖 iframe SurfaceHost、manifest discovery、slot routing 和 drawer-specific entry。
- **Visual regression testing**：为 ST classic themes、9 drawers、message bubble、composer、mobile breakpoints 建 screenshot baseline。
- **真实 font loading**：当前 Noto Sans 依赖系统字体 / host 预加载；需要明确 host-level font loading 或 bundle 策略。

## Real extension loading 后续

- **更聪明的 ESM resolution**：覆盖 BME 的 `regex/engine.js` 风格路径、扩展内 alias、目录 index、无扩展名 import 等常见路径形态。
- **更多 browser stubs**：考虑用 `Map` 实现基础 IndexedDB stub，优先满足初始化期 schema/setup，不承诺完整 Dexie/IndexedDB 行为。
- **Audited fetch bridge**：不要在 sandbox 直接开放 `fetch`；通过 Yggdrasil outbound capability bridge 路由，继承 host allowlist、secret_ref、redaction、audit 与 timeout。
- **WASM loading via host bridge**：为需要 native acceleration 的扩展设计 host-mediated WASM 加载路径，保留审计和资源限制。
- **Worker stub**：提供最小 Worker-like stub，先服务初始化和消息注册路径，再评估真实后台执行。
- **Full BME functional smoke**：当 ESM resolution 和 browser stubs 更丰富后，把当前 env-gated BME bootstrap smoke 升级到功能 smoke；在此之前不要宣称 BME 完整可用。

## Golden harness 后续

- 把 chat 的 4 个 cosmetic-only diff 压到 byte-identical。
- 继续增加 WI、macro、instruct、tokenizer 和 chat fixtures，避免当前 16/20 perfect 被误读为全域 ST 兼容。
- 保持 `_summary.json` 作为文档数字来源。

## 扩展生态后续

- 把更多 plan-only / provider-heavy built-in extensions 推进到可执行但受审计的路径。
- 为真实第三方扩展维护单独兼容记录：可加载、可初始化、核心功能可用、需要 patch、不支持。
- 扩展安装仍依赖后续 git/zip/package installer 流程；不要把加载能力等同于安装能力。
