# Next steps

> [English](./NEXT_STEPS.en.md) · [中文](./NEXT_STEPS.md)

Round 4 U-track is complete: sandbox ESM loader, browser stubs, extended ST API bridge, BME smoke, conditional chat tools emission, World Info budget/probability alignment, macro-engine deep implementation migration, and durable doc updates have landed. This file no longer carries U1-U6 temporary tasks; it records forward-looking work only.

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
