# Next steps

> [English](./NEXT_STEPS.en.md) · [中文](./NEXT_STEPS.md)

Round 4 U-track and Round 5 V-track are complete: sandbox ESM loader, browser stubs, extended ST API bridge, BME smoke, conditional chat tools emission, World Info budget/probability alignment, macro-engine deep implementation migration, SillyTavern UI parity shell, 9 drawers, ST theme JSON import/export, mobile responsive layout, and durable doc updates have landed. This file no longer carries U1-U6 or V1-V7 temporary tasks; it records forward-looking work only.

## Surface UI follow-up

- **Wire V5 form change handlers**: connect every drawer form handler marked TODO V7 in V5 to `TavernProvider`, instead of updating only local UI or stubs.
- **SamplerForm → TavernProvider**: write sampler matrix, preset, banned tokens, logit bias, streaming, and related change events into unified settings state.
- **ConnectionForm / PersonaForm → TavernProvider**: connect provider profiles, status, persona list, persona edit form, and toggles to provider state.
- **Drawers → live Yggdrasil capabilities**: read the World Info list from `kernel.surface.contribution.list` / future worldbook capabilities; connect the character list to importers; connect extensions, backgrounds, and API profiles to real host data.
- **clients/web end-to-end hosting**: mount all 9 surface contributions in a real Yggdrasil `clients/web` host, covering iframe SurfaceHost, manifest discovery, slot routing, and drawer-specific entries.
- **Visual regression testing**: add screenshot baselines for ST classic themes, 9 drawers, message bubble, composer, and mobile breakpoints.
- **Real font loading**: Noto Sans currently relies on system fonts / host preloading; define an explicit host-level font-loading or bundling strategy.

## Real extension loading follow-up

- **Smarter ESM resolution**: handle BME-style `regex/engine.js` paths, extension-local aliases, directory indexes, extensionless imports, and other common path patterns.
- **More browser stubs**: consider a basic `Map`-backed IndexedDB stub, prioritized for initialization-time schema/setup rather than full Dexie/IndexedDB compatibility.
- **Audited fetch bridge**: do not enable raw sandbox `fetch`; route outbound through a Yggdrasil outbound capability bridge so host allowlists, `secret_ref`, redaction, audit, and timeout behavior apply.
- **WASM loading via host bridge**: design a host-mediated WASM loading path for extensions that need native acceleration, while retaining audit and resource limits.
- **Worker stub**: provide a minimal Worker-like stub, first for initialization and message-registration paths, then reassess real background execution.
- **Full BME functional smoke**: once ESM resolution and browser stubs are richer, upgrade the current env-gated BME bootstrap smoke into a functional smoke. Until then, do not claim full BME support.

## Golden harness follow-up

- Reduce the four chat cosmetic-only diffs to byte-identical output.
- Keep adding WI, macro, instruct, tokenizer, and chat fixtures so the current 16/20 perfect count is not mistaken for full-domain ST compatibility.
- Keep `_summary.json` as the source for documented numbers.

## Extension ecosystem follow-up

- Move more plan-only / provider-heavy built-in extensions to executable but audited paths.
- Maintain separate compatibility records for real third-party extensions: loadable, initializes, core functionality works, needs patch, unsupported.
- Extension installation still depends on future git/zip/package-installer flows; do not equate loading capability with installation capability.
