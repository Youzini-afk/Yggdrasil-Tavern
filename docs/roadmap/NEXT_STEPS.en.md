# Next steps

> [English](./NEXT_STEPS.en.md) · [中文](./NEXT_STEPS.md)

This document is about where YdlTavern goes next. For completed state and compatibility coverage, see [`../COMPATIBILITY_MATRIX.md`](../COMPATIBILITY_MATRIX.en.md).

## What's actively in flight

These are known to-dos that will get done.

### Extension ecosystem hosting

- **Production extension hosting**: implement the host static route for `/scripts/extensions/<id>/`, serving installed extension files and ST compatibility shims.
- **Activity Drawer**: transparently show extension activity (fetch URL hashes, localStorage writes, slash command registrations, event listeners, DOM mount targets) without blocking.

### Performance and alignment

The performance baseline lives in [`../guides/PERFORMANCE_BASELINE.md`](../guides/PERFORMANCE_BASELINE.en.md) and `perf/baseline.json`. Future optimizations use it as the regression reference, with 10% as the advisory threshold for stable scenarios and 20% for more variable E2E / jsdom / WASM scenarios.

- **Multi-agent orchestration**: define how YdlTavern maps ST-style chat flow onto Yggdrasil agent / session collaboration without putting agent logic into the UI.
- **MCP protocol surface**: define how MCP tools / resources / prompts are exposed to YdlTavern through the Yggdrasil capability boundary.
- **Vector RAG**: move the memory / vectors extension from plan-only paths to audited vector retrieval while keeping storage and outbound policy host-managed.
- **ToolManager full registration**: complete registration, permissions, audit, and UI visibility for ST ToolManager / slash / extension commands.

### Surface hosting and marketplace

- **Converged foundation**: YdlTavern can install as a Yggdrasil native project into the profile/project registry; installed project surface bundles are exposed by the host under `/surface-bundles/projects/<id>/...` as same-origin routes; the host bridge uses typed `allowed_capability_ids` and allowlists to restrict callable surface capabilities.
- **Cross-origin allowlist**: design surface bundle allowlists, integrity pins, version pins, and audit metadata for community marketplaces; same-origin remains the default.
- **Multiple mounted surfaces**: expand the current single outlet to manage multiple iframe surfaces while preserving sandbox and lifecycle isolation.

### Golden harness

- Keep adding WI, macro, instruct, tokenizer, and chat fixtures so the current 20/20 perfect count is not mistaken for full-domain ST compatibility.
- Keep `_summary.json` as the source for documented numbers.

### Extension ecosystem

- Maintain separate compatibility records for real third-party extensions: loadable, initializes, core functionality works, needs patch, unsupported.
- Add legacy library shims and ST module URL shims as community extensions reveal gaps.
- Extension installation uses the Yggdrasil git package channel; basic project install/host bridge support is available, but community extension distribution, marketplace allowlists, and installation UX still need separate work.
