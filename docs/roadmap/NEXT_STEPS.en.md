# Next steps

> [English](./NEXT_STEPS.en.md) · [中文](./NEXT_STEPS.md)

Round 8 Y-track is complete: same-window ST extension hosting, messageFormatting (showdown + DOMPurify + hooks), React DOM territory cession, `mountSTGlobals()`, ST URL layout shims, Vite dev middleware, and BME/shujuku real-extension smoke tests have landed. This file no longer carries Y-track items; it records Round 9 candidates and forward-looking work.

## Round 9 candidates

- **Production extension hosting**: implement the host static route for `/scripts/extensions/<id>/`, serving installed extension files and ST compatibility shims.
- **Activity Drawer**: transparently show extension activity (fetch URL hashes, localStorage writes, slash command registrations, event listeners, DOM mount targets) without blocking.
- **Performance baseline benchmark**: pin benchmark inputs and reporting for subprocess JSON-RPC, SSE streaming, and prompt construction.
- **Phase B pain-point resolution**: advance the protocol boundaries and user paths for multi-agent / MCP / vector RAG / ToolManager.

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

- **Production bundle hosting**: implement a package static route on the Yggdrasil host so installed package `bundle.mjs`, styles, fonts, ST compatibility shims, and extension files are exposed as same-origin URLs.
- **Cross-origin allowlist**: design surface bundle allowlists, integrity pins, version pins, and audit metadata for community marketplaces; same-origin remains the default.
- **Multiple mounted surfaces**: expand the current single outlet to manage multiple iframe surfaces while preserving sandbox and lifecycle isolation.

## Golden harness follow-up

- Keep adding WI, macro, instruct, tokenizer, and chat fixtures so the current 20/20 perfect count is not mistaken for full-domain ST compatibility.
- Keep `_summary.json` as the source for documented numbers.

## Extension ecosystem follow-up

- Maintain separate compatibility records for real third-party extensions: loadable, initializes, core functionality works, needs patch, unsupported.
- Add legacy library shims and ST module URL shims as community extensions reveal gaps.
- Extension installation uses the Yggdrasil git package channel; loading capability does not mean installation UX is complete.
