# 下一步

> [English](./NEXT_STEPS.en.md) · [中文](./NEXT_STEPS.md)

Round 4 U-track 已完成：sandbox ESM loader、browser stubs、extended ST API bridge、BME smoke、chat tools 条件发出、World Info 预算/概率对齐、macro engine 深实现迁移，以及 durable docs 更新均已落地。这里不再保留 U1-U6 临时任务，只记录后续方向。

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
