# Performance Baseline (YdlTavern)

> [English](./PERFORMANCE_BASELINE.en.md) · [中文](./PERFORMANCE_BASELINE.md)

## What this is

YdlTavern keeps a committed performance baseline at [`perf/baseline.json`](../../perf/baseline.json). Each YdlTavern package has its own `bench/` directory with tinybench scenarios. Run them locally before and after Phase B optimization work to detect trend-level regressions on the same machine.

This is not a CI budget and not an absolute score that can be compared across machines. It is a reproducible, schema-friendly local reference for avoiding accidental regressions while working on multi-agent flows, MCP, vector RAG, ToolManager, and related follow-up work.

## How to run

### Single package

```bash
npm run bench --prefix packages/ydltavern-engine-core
```

Output is written to that package's `bench/last.json`, for example:

```text
packages/ydltavern-engine-core/bench/last.json
```

Single-package runs are best while tuning one local path.

### All packages + aggregate

```bash
node scripts/run-all-benches.mjs
```

This runs the five package benches and aggregates their `bench/last.json` files into:

```text
perf/baseline.json
```

### Skip running, only re-aggregate existing last.json

```bash
node scripts/run-all-benches.mjs --no-run
```

Use `--no-run` to validate the aggregator, inspect schema, or rebuild the root baseline from already captured package results.

## Scenarios per package

The current baseline covers 5 packages and 37 scenarios.

### `@ydltavern/engine-core` (12 scenarios)

- `prompt_manager.compile.small`
- `prompt_manager.compile.medium`
- `prompt_manager.compile.large`
- `world_info.evaluate.small`
- `world_info.evaluate.medium`
- `world_info.evaluate.large`
- `macros.expand.short`
- `macros.expand.long`
- `tokenizer.gpt.encode.short`
- `tokenizer.gpt.encode.long`
- `tokenizer.llama3.encode.short`
- `tokenizer.llama3.encode.long`

These cover PromptManager, World Info, macro expansion, and tokenizer hot paths.

### `@ydltavern/importers` (6 scenarios)

- `import.character.png.small`
- `import.character.png.large`
- `import.world_book.small`
- `import.world_book.large`
- `import.jsonl.small`
- `import.jsonl.large`

These use synthetic fixtures to measure character-card, world-book, and JSONL chat import costs.

### `@ydltavern/st-compat` (9 scenarios)

- `chat.proxy.read`
- `chat.proxy.write`
- `chat.proxy.iterate`
- `eventSource.emit.no_listeners`
- `eventSource.emit.10_listeners`
- `eventSource.emit.100_listeners`
- `slash.parse.simple`
- `slash.parse.pipe`
- `slash.execute.simple`

These cover common synchronous ST API surface paths: the `chat[]` Proxy, eventSource, and slash parser/runtime.

### `@ydltavern/extensions` (5 scenarios)

- `sandbox.bootstrap`
- `sandbox.invoke.simple`
- `regex.apply.short`
- `regex.apply.long`
- `loader.parse_manifest`

These cover QuickJS sandbox startup/invocation, regex extension work, and extension-loader manifest parsing.

### `@ydltavern/surface` (5 scenarios)

- `formatting.markdown.short`
- `formatting.markdown.long`
- `formatting.markdown.with_xss`
- `formatting.regex_hooks.10`
- `formatting.full_pipeline.100msg`

These cover messageFormatting, DOMPurify, regex hooks, and the 100-message formatting pipeline.

## Schema

The root file uses `yggdrasil.bench.v1`, with a shape close to Yggdrasil's own `perf/baseline.json`:

- `schema`: currently `yggdrasil.bench.v1`.
- `created_at`: creation time as Unix milliseconds.
- `repo`: fixed to `"YdlTavern"`.
- `node_version`: Node.js version used for the bench run.
- `git`: `commit`, `branch`, `dirty`.
- `env`: `os`, `arch`, `num_cpus`.
- `packages`: package-level bench results keyed by package name.

Each `<package-bench>` contains:

- `schema`
- `created_at`
- `package`
- `node_version`
- `git`
- `env`
- `benchmarks`

Each benchmark record contains:

- `name`
- `iterations`
- `samples`
- `min_ms`
- `p50_ms`
- `p95_ms`
- `p99_ms`
- `max_ms`
- `mean_ms`
- `rsd_pct`
- `throughput`

`throughput` currently looks like:

```json
{
  "value": 577667,
  "unit": "ops/s"
}
```

## Regression detection

tinybench does not provide a built-in compare command. YdlTavern uses schema-friendly JSON so scripts or humans can compare runs:

1. Run a before baseline on the same machine.
2. Apply the optimization.
3. Run the same benches again.
4. Compare `mean_ms` for scenarios with the same name.

Threshold guidance:

- Use 10% for stable synchronous scenarios.
- Use 20% for scenarios affected by GC, WASM startup, jsdom, or file parsing.
- For sub-millisecond scenarios, prefer trend-level interpretation over a single percentage.

Regression detection is advisory for now and is not a CI gate. PRs can quote the relevant `mean_ms`, `p95_ms`, and `rsd_pct` values and explain why a change is acceptable.

## Reference baseline

The committed reference baseline lives at:

```text
perf/baseline.json
```

It corresponds to B5 aggregation commit `5671700`, was produced on a Linux developer machine, and is not a CI budget. Cross-machine comparison is not meaningful; rerun on your machine and compare same-machine before/after results.

Recommended flow:

```bash
node scripts/run-all-benches.mjs
cp perf/baseline.json /tmp/ydltavern-before.json
# change code
node scripts/run-all-benches.mjs
# compare mean_ms for matching scenarios in /tmp/ydltavern-before.json and perf/baseline.json
```

## Known limitations

- `@ydltavern/extensions` `sandbox.bootstrap` mostly measures QuickJS WASM initialization, around the 25 ms range; it dominates the extensions package mean.
- `@ydltavern/surface` long markdown and `formatting.full_pipeline.100msg` are the main Phase B hot-path candidates.
- Surface benches run on jsdom, which adds cost relative to a real browser; treat surface numbers as relative trends, not absolute browser performance.
- PNG / JSONL importer benches use synthetic fixtures and do not represent the full distribution of real ST exports.
- tinybench results depend on Node version, CPU governor, background load, GC, and warm state.
- The current schema records wall-clock and tinybench statistics, not RSS delta; use Node profiling tools separately for memory work.

## Phase B usage

Phase B optimizations should:

1. Use `perf/baseline.json` as the before/after regression reference.
2. Re-run the relevant package bench after each significant change; run the full aggregate before merging.
3. Check both `mean_ms` and `p95_ms` so mean improvements do not hide worse tail latency.
4. Update `docs/research/round8/` if an optimization changes behavior shape, fixture shape, or ST-alignment assumptions.
5. Do not bypass ST compatibility layers, the Yggdrasil capability boundary, permissions, audit, or AGPL obligations in the name of performance.
