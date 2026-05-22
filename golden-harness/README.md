# YdlTavern Golden Harness v0

Deterministic fixture generator and regression checker for YdlTavern, using SillyTavern's real ESM modules as the reference implementation.

## Purpose

The golden harness imports SillyTavern's **actual** ESM modules through jsdom + targeted shims, runs known scenario inputs through ST's `evaluateMacros`, `getWorldInfoPrompt`, `sendOpenAIRequest` (with fetch interception), and `formatInstructModeChat`, and writes deterministic JSON fixtures to disk. YdlTavern's deep-port modules then run the same scenarios and diff against these fixtures.

This creates a **"real ruler"** — the harness proves that YdlTavern's reimplementation produces the same output as ST's original code for the same inputs.

## Setup

### 1. ST Source Path

Set the `YDLTAVERN_ST_PATH` environment variable to point to your SillyTavern source:

```bash
export YDLTAVERN_ST_PATH=/workspace/Yggdrasil/SillyTavern
```

Default: `/workspace/Yggdrasil/SillyTavern`

### 2. Install Dependencies

```bash
cd golden-harness
npm install
```

### 3. Pin the ST Commit

Record which ST commit the fixtures were generated against:

```bash
cd $YDLTAVERN_ST_PATH && git rev-parse HEAD > ../YdlTavern/golden-harness/.st-commit-pin
```

When ST updates, regenerate fixtures and update the pin:

```bash
cd $YDLTAVERN_ST_PATH && git pull
cd ../YdlTavern/golden-harness && npm run test
cd $YDLTAVERN_ST_PATH && git rev-parse HEAD > ../YdlTavern/golden-harness/.st-commit-pin
```

## Usage

### Generate Fixtures from ST

```bash
# Run all scenarios
npm run test

# Run a specific scenario
node --import ./shims/register-loader.mjs runner/run.mjs --scenario scenarios/instruct/chatml.json
```

Fixtures are written to `fixtures/<category>/<name>.json`.

### Tokenizer Fixtures

The `tokenizer/` scenario category is a P2.5 runtime-registry baseline. Unlike
the original v0 categories, tokenizer fixtures are currently generated from
YdlTavern's own `countTokens(text, { modelHint })` adapters rather than from ST's
backend `getTokenCountAsync(...)` endpoint. Treat these as a self-baseline for
regression detection until a future harness revision can capture ST backend
counts directly.

Accuracy levels in tokenizer fixture output:

| Accuracy | Meaning | Families |
|----------|---------|----------|
| `exact` | Local BPE/tokenizer package is used. | OpenAI/GPT-2 (`gpt-tokenizer`), Llama 1/2, Llama 3, HF tokenizer source supplied by caller or fetched with the runtime HF fetcher |
| `approximation` | Local text-only estimate; structured API-specific content is not represented. | Claude (`@anthropic-ai/tokenizer`) |
| `guesstimate` | ST-compatible UTF-8 byte length / 3.35 fallback because no real local tokenizer source is available. | Mistral/Qwen/Gemma/etc. without caller-supplied HF source |

HF-family tokenizers can now be loaded from caller-supplied `tokenizer.json` or via
`fetchHuggingFaceTokenizer`, which asks the Yggdrasil host to download the file
through `kernel.outbound.execute`. The harness tokenizer scenarios remain a
self-baseline unless a fixture explicitly wires a real HF source.

### Compare YdlTavern Output Against Fixtures

```bash
# Compare all scenarios
npm run compare

# Compare a specific scenario
node compare.mjs --scenario scenarios/instruct/chatml.json
```

`compare.mjs` runs the YdlTavern deep-port modules against the same scenario JSON
that produced each fixture, then writes one report per scenario to
`diff/<category>-<name>.json` plus an aggregate `diff/_summary.json`.

Round 2 R1 made this workflow operational against the current deep-port modules.
Round 3 T-track tightened the shims and current results are **9/20 perfect**,
**3/20 cosmetic**, **8/20 structural**, **0/20 unverifiable**, and **0 errors**.

The comparator intentionally exits 0 after writing reports, even when structural
diffs are found. Treat `diff/_summary.json` as the pass/fail source of truth for
compatibility work.

### Diff Classification

Each diff report uses one of these classifications:

| Classification | Meaning |
|----------------|---------|
| `perfect` | YdlTavern output is byte-identical to the fixture after JSON serialization. |
| `cosmetic` | The stable JSON object is equal, but original serialization differs by key order or whitespace. |
| `structural` | Keys, array lengths, scalar values, or nested object shapes differ. Reports include up to 50 `delta` paths. |
| `unverifiable` | The ST fixture is incomplete or shim-derived, or a fixture/export is missing, so the scenario cannot prove byte-level compatibility. |
| `error` | The comparator threw before it could produce a meaningful comparison. |

`diff/_summary.json` contains total counts and per-category counts. A category
should only be documented as implemented when every scenario in that category is
`perfect`.

### Workflow: Regenerating Fixtures vs Running Diffs

1. Regenerate ST fixtures only when the ST reference commit or scenario inputs
   change:

   ```bash
   npm run test
   ```

2. Build YdlTavern packages used by the comparator:

   ```bash
   npm run build --prefix ../packages/ydltavern-engine-core
   ```

3. Run YdlTavern-vs-fixture diffs:

   ```bash
   node compare.mjs --all
   cat diff/_summary.json
   ```

4. Inspect any non-perfect reports under `diff/` and update the compatibility
   matrix with the exact counts from `_summary.json`.

### Verify Determinism

Run the harness twice and verify byte-identical output:

```bash
npm run test
cp -r fixtures/ /tmp/fixtures1
npm run test
diff -r fixtures/ /tmp/fixtures1
# Should produce no output (identical)
```

`node runner/run.mjs --all` is also expected to produce byte-identical fixtures on
repeated runs. The shims freeze moment/Date and seed `Math.random`, so WI budget
paths, probability gates, random macros, and time macros are deterministic.

## Architecture

### Custom Module Loader

The harness uses Node.js `module.register()` to install a custom module resolution hook. When ST modules are imported, the hook intercepts resolution of ST's dependency hubs (`lib.js`, `script.js`, and all sibling modules) and redirects them to our shim modules. This allows us to import ST's **real** target modules (like `instruct-mode.js`, `macros.js`) while providing controlled dependencies.

**Key files:**
- `shims/register-loader.mjs` — Registers the custom loader via `--import`
- `shims/loader-hook.mjs` — The async resolve hook that redirects ST imports
- `shims/globals.mjs` — Installs all globals in correct order before ST import

### Shim Order (critical)

1. `dom.mjs` — jsdom globals (window, document, Node, Element, localStorage)
2. `jquery.mjs` — Minimal `$` stub
3. `time.mjs` — Frozen Date/moment (epoch: 1748520000000 = 2025-05-29T12:00:00Z)
4. `rng.mjs` — seedrandom('ydltavern-fixture-v1') replaces Math.random
5. `uuid.mjs` — Deterministic UUID sequence
6. `domPurify.mjs` — Passthrough sanitizer
7. `fetch.mjs` — Fetch interceptor (captures request body)
8. `toastr.mjs` — No-op notifications
9. `popup.mjs` — Reject all dialogs

### Deterministic Controls

| Source | Strategy |
|--------|----------|
| Date/time | `Date.now()` → fixed epoch `1748520000000` |
| RNG | `Math.random` → `seedrandom('ydltavern-fixture-v1')` |
| UUID | `uuidv4` → sequential `00000000-0000-4000-8000-XXXXXXXXXXXX` |
| Network | `fetch` → interceptor, captures body, returns 200 OK |
| DOM | jsdom instance with jQuery stub |
| Settings | All ST settings globals pinned to defaults |

### Round 3 shim deepening

- **World Info** now executes ST `checkWorldInfo` end-to-end under the harness
  instead of returning empty shim activations. Scenario entries are loaded into the
  shimmed WI store, budget accounting is deterministic, and probability/RNG paths
  use the seeded harness RNG. Current WI scenarios are therefore verifiable and
  classified as structural rather than unverifiable.
- **Macros** now execute ST `evaluateMacros` end-to-end under the harness instead
  of fallback-only substitution. Moment/Date are frozen and random macro paths use
  the seeded harness RNG. `macro/env-basic` is byte-identical; nested, random, and
  time macro scenarios still have documented structural deltas.

## Scenario Categories

| Category | ST Function | Scenario Count | Current Status |
|----------|------------|----------------|-----------|
| instruct | `formatInstructModeChat` | 2 | ✅ Perfect — 2/2 byte-identical, see `diff/instruct-*.json` |
| chat | `sendOpenAIRequest` | 4 | ⚠️ Mostly cosmetic — 0/4 perfect, 3 cosmetic, 1 structural, see `diff/chat-*.json` |
| macro | `evaluateMacros` | 4 | ⚠️ Verifiable — 1/4 perfect, 3 structural, see `diff/macro-*.json` |
| world-info | `checkWorldInfo` | 4 | ⚠️ Verifiable — 0/4 perfect, 4 structural, see `diff/world-info-*.json` |
| tokenizer | YdlTavern `countTokens` | 6 | ✅ Perfect self-baseline — 6/6 match current runtime output |

## Fixture Generation Results

**20/20 scenarios produce fixtures/diffs.** Determinism verified (byte-identical on repeated runs).

Round 3 comparison currently covers **20/20 scenarios** (14 base + 6 tokenizer):
9 perfect, 3 cosmetic, 8 structural, 0 unverifiable, 0 errors. See
`diff/_summary.json` for the exact current breakdown.

Next steps: close the documented structural deltas in chat, world-info, and macro
reports and keep expanding scenario coverage.

### Detailed Status

- **instruct/** (2/2): Both ChatML and Llama3 templates produce byte-identical formatted output via ST's real `formatInstructModeChat`.
- **chat/** (4/4): All four chat scenarios capture the full request body via fetch interception. Three scenarios are cosmetic-only and one remains structural.
- **macro/** (4/4): Full `evaluateMacros` executes under frozen moment/Date and seeded RNG. `env-basic` is byte-identical; nested, random, and time scenarios have structural deltas.
- **world-info/** (4/4): `checkWorldInfo` executes against scenario WI entries with deterministic budget/RNG controls. All four scenarios are verifiable and currently structural.
- **tokenizer/** (6/6): `countTokens(text, { modelHint })` self-baseline is byte-identical against current runtime output.

## Known Limitations (v0)

1. **evaluateMacros structural deltas**: The ST macro engine now runs end-to-end under the harness, but nested, random, and time macro scenarios still differ structurally from YdlTavern output. Treat `diff/macro-*.json` as the compatibility work queue.

2. **World Info structural deltas**: The harness now loads scenario entries and executes `checkWorldInfo`, but YdlTavern output still differs from ST in all four current WI scenarios. Treat `diff/world-info-*.json` as the compatibility work queue.

3. **Event handler errors in WI**: The WI module emits events that trigger event handlers. Some handlers can still see reduced harness state compared with a full ST browser session. These errors are non-fatal when the WI scan completes and reports a structural diff.

4. **Chat is not byte-perfect**: Three chat scenarios are cosmetic-only, but one still has a structural delta. Do not document chat completion request parity as implemented until all four scenarios are perfect.

5. **Top-level side effects**: ST modules run top-level code that accesses DOM elements. Our jQuery stub catches these calls, but some might produce unexpected behavior.

6. **ST module loader must use `--import`**: The custom module loader is registered via `node --import ./shims/register-loader.mjs`. This flag must be present for any script that imports ST modules.

## License Note

This repository does NOT vendor SillyTavern source code. ST is referenced at runtime via the `YDLTAVERN_ST_PATH` environment variable. SillyTavern is licensed under AGPL-3.0.
