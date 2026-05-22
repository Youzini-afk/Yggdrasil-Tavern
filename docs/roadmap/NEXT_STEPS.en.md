# Next steps

> [English](./NEXT_STEPS.en.md) · [中文](./NEXT_STEPS.md)

Round 4 U-track, Round 5 V-track, Round 6 W-track, and Round 7 X-track are complete: sandbox ESM loader, browser stubs, extended ST API bridge, BME smoke, World Info budget/probability alignment, macro-engine deep implementation migration, SillyTavern UI parity shell, 9 provider-backed drawers, ST theme JSON import/export, browser-ready surface bundle, 9 mount adapters, the clients/web E2E demo path, @fontsource font bundling, full slash-command A-N canonical coverage, and durable doc updates have landed. This file no longer carries W/X items; it records forward-looking work only.

## Performance baseline benchmark

- **Subprocess JSON-RPC**: measure cold/warm latency, payload size, serialization cost, and error paths for `ydltavern-engine` capability calls.
- **SSE streaming**: measure time-to-first-token, chunk cadence, cancel latency, and host outbound audit overhead for `model.live_call.stream`.
- **Prompt construction**: measure PromptManager, World Info, macro expansion, token counting, and instruct wrapping costs under typical context lengths.
- **Golden fixture reuse**: pin benchmark inputs as reproducible fixtures so performance numbers do not drift with demo data.

## Phase B pain-point resolution

- **Multi-agent orchestration**: define how YdlTavern maps ST-style chat flow onto Yggdrasil agent/session collaboration without putting agent logic into the UI.
- **MCP protocol surface**: define how MCP tools/resources/prompts are exposed to YdlTavern through the Yggdrasil capability boundary.
- **Vector RAG**: move the memory/vectors extension from plan-only paths to audited vector retrieval while keeping storage and outbound policy host-managed.
- **ToolManager full registration**: complete registration, permissions, audit, and UI visibility for ST ToolManager / slash / extension commands.

## Surface hosting and marketplace

- **Production bundle hosting**: implement a package static route on the Yggdrasil host so installed package `bundle.mjs`, styles, and fonts are exposed as same-origin URLs.
- **Real font Unicode subset extension**: the current bundle includes only the @fontsource Latin subset (4 woff2 files, ~50KB); CJK/emoji/broader Unicode coverage needs a separate subset and bundle-size strategy.
- **Cross-origin allowlist**: design surface bundle allowlists, integrity pins, version pins, and audit metadata for community marketplaces; same-origin remains the default.
- **Multiple mounted surfaces**: expand the current single outlet to manage multiple iframe surfaces while preserving sandbox and lifecycle isolation.

## Heavy extension compatibility decision

- **BME-class extensions**: keep BME and similar heavy extensions as an explicit decision point rather than claiming compatibility by default. Options: A) extend browser/DOM/ESM stubs until functional smoke passes; B) provide audited host capability bridges for high-risk APIs; C) mark unsupported/needs-patch and maintain compatibility records.
- **Decision criteria**: choose A/B/C based on permission boundaries, audit visibility, maintenance cost, and real user value; do not weaken the sandbox default security model for one extension.

## Real extension loading follow-up

- **Smarter ESM resolution**: handle BME-style `regex/engine.js` paths, extension-local aliases, directory indexes, extensionless imports, and other common path patterns.
- **More browser stubs**: consider a basic `Map`-backed IndexedDB stub, prioritized for initialization-time schema/setup rather than full Dexie/IndexedDB compatibility.
- **Audited fetch bridge**: do not enable raw sandbox `fetch`; route outbound through a Yggdrasil outbound capability bridge so host allowlists, `secret_ref`, redaction, audit, and timeout behavior apply.
- **WASM loading via host bridge**: design a host-mediated WASM loading path for extensions that need native acceleration, while retaining audit and resource limits.
- **Worker stub**: provide a minimal Worker-like stub, first for initialization and message-registration paths, then reassess real background execution.
- **Full BME functional smoke**: once ESM resolution and browser stubs are richer, upgrade the current env-gated BME bootstrap smoke into a functional smoke. Until then, do not claim full BME support.

## Golden harness follow-up

- Keep adding WI, macro, instruct, tokenizer, and chat fixtures so the current 20/20 perfect count is not mistaken for full-domain ST compatibility.
- Keep `_summary.json` as the source for documented numbers.

## Extension ecosystem follow-up

- Move more plan-only / provider-heavy built-in extensions to executable but audited paths.
- Maintain separate compatibility records for real third-party extensions: loadable, initializes, core functionality works, needs patch, unsupported.
- Extension installation still depends on future git/zip/package-installer flows; do not equate loading capability with installation capability.
