# 下一步

> [English](./NEXT_STEPS.en.md) · [中文](./NEXT_STEPS.md)

Round 4 U-track、Round 5 V-track、Round 6 W-track 与 Round 7 X-track 已完成：sandbox ESM loader、browser stubs、extended ST API bridge、BME smoke、World Info 预算/概率对齐、macro engine 深实现迁移、SillyTavern UI parity shell、9 个 provider-backed drawers、ST theme JSON import/export、browser-ready surface bundle、9 个 mount adapters、clients/web E2E demo 路径、@fontsource 字体打包、slash commands A-N 全量 canonical 覆盖与 durable docs 更新均已落地。这里不再保留 W/X 项，只记录后续方向。

## Performance baseline benchmark

- **Subprocess JSON-RPC**：测量 `ydltavern-engine` capability 调用的 cold/warm latency、payload 大小、serialization 成本与错误路径。
- **SSE streaming**：测量 `model.live_call.stream` 的首 token 延迟、chunk cadence、cancel latency 与 host outbound audit overhead。
- **Prompt construction**：测量 PromptManager、World Info、macro expansion、token counting 与 instruct wrapping 在典型上下文长度下的成本。
- **Golden fixture reuse**：把 benchmark inputs 固定成可复现 fixtures，避免性能数字随 demo 数据漂移。

## Phase B pain-point resolution

- **Multi-agent orchestration**：定义 YdlTavern 如何把 ST-style chat flow 映射到 Yggdrasil agent/session 协作，而不是把 agent 逻辑塞进 UI。
- **MCP protocol surface**：明确 MCP tool/resource/prompt 通过 Yggdrasil capability boundary 暴露给 YdlTavern 的方式。
- **Vector RAG**：把 memory/vectors extension 的 plan-only 路径推进到 audited vector retrieval，保持 host-managed storage 与 outbound policy。
- **ToolManager full registration**：补齐 ST ToolManager / slash / extension command 的注册、权限、审计与 UI 可见性。

## Surface hosting and marketplace

- **Production bundle hosting**：在 Yggdrasil host 上实现 package static route，把已安装 package 的 `bundle.mjs`、styles 和 fonts 作为 same-origin URLs 暴露。
- **Real font Unicode subset extension**：当前 bundle 仅包含 @fontsource Latin subset（4 个 woff2，约 50KB）；如需 CJK/emoji/更完整 Unicode 覆盖，需要设计额外 subset 与 bundle-size 策略。
- **Cross-origin allowlist**：为社区 marketplace 设计 surface bundle allowlist、integrity pin、version pin 与 audit metadata；默认仍要求 same-origin。
- **Multiple mounted surfaces**：把当前单一 outlet 扩展为可管理多个 iframe surface，同时保留 sandbox 与 lifecycle isolation。

## Heavy extension compatibility decision

- **BME-class extensions**：继续把 BME 等重扩展作为显式决策点，而不是默认声明兼容。可选路径：A) 扩展 browser/DOM/ESM stubs 直到能功能 smoke；B) 通过 host capability bridge 为其高风险 API 提供受审计替代；C) 明确标记为 unsupported/needs patch，并维护兼容记录。
- **Decision criteria**：以权限边界、审计可见性、维护成本和真实用户价值决定 A/B/C，不为了单个扩展破坏 sandbox 默认安全模型。

## Real extension loading follow-up

- **Smarter ESM resolution**：覆盖 BME 的 `regex/engine.js` 风格路径、扩展内 alias、目录 index、无扩展名 import 等常见路径形态。
- **More browser stubs**：考虑用 `Map` 实现基础 IndexedDB stub，优先满足初始化期 schema/setup，不承诺完整 Dexie/IndexedDB 行为。
- **Audited fetch bridge**：不要在 sandbox 直接开放 `fetch`；通过 Yggdrasil outbound capability bridge 路由，继承 host allowlist、secret_ref、redaction、audit 与 timeout。
- **WASM loading via host bridge**：为需要 native acceleration 的扩展设计 host-mediated WASM 加载路径，保留审计和资源限制。
- **Worker stub**：提供最小 Worker-like stub，先服务初始化和消息注册路径，再评估真实后台执行。
- **Full BME functional smoke**：当 ESM resolution 和 browser stubs 更丰富后，把当前 env-gated BME bootstrap smoke 升级到功能 smoke；在此之前不要宣称 BME 完整可用。

## Golden harness follow-up

- 继续增加 WI、macro、instruct、tokenizer 和 chat fixtures，避免当前 20/20 perfect 被误读为全域 ST 兼容。
- 保持 `_summary.json` 作为文档数字来源。

## Extension ecosystem follow-up

- 把更多 plan-only / provider-heavy built-in extensions 推进到可执行但受审计的路径。
- 为真实第三方扩展维护单独兼容记录：可加载、可初始化、核心功能可用、需要 patch、不支持。
- 扩展安装仍依赖后续 git/zip/package installer 流程；不要把加载能力等同于安装能力。
