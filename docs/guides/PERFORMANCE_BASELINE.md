# Performance Baseline（YdlTavern）

> [English](./PERFORMANCE_BASELINE.en.md) · [中文](./PERFORMANCE_BASELINE.md)

## 这是什么

YdlTavern 在 [`perf/baseline.json`](../../perf/baseline.json) 中保留一份已提交的性能基线。每个 YdlTavern 包都有自己的 `bench/` 目录和 tinybench 场景。优化前后应本地运行它们，用同一台机器上的 JSON 结果判断趋势。

这不是 CI 预算，也不是跨机器可比的绝对分数。它是一个可复现、schema 友好的本地参考点，用来避免在 multi-agent、MCP、vector RAG、ToolManager 等后续工作里无意引入明显回归。

## 如何运行

### 单个包

```bash
npm run bench --prefix packages/ydltavern-engine-core
```

输出写入该包的 `bench/last.json`，例如：

```text
packages/ydltavern-engine-core/bench/last.json
```

单包运行适合正在优化某个局部路径时快速查看趋势。

### 全部包并聚合

```bash
node scripts/run-all-benches.mjs
```

该命令依次运行五个包的 bench，然后把各包 `bench/last.json` 聚合到：

```text
perf/baseline.json
```

### 不重新运行，只聚合已有 last.json

```bash
node scripts/run-all-benches.mjs --no-run
```

`--no-run` 适合验证聚合器、检查 schema 或在已有 bench 结果之间快速重建根基线文件。

## 包与场景

当前基线覆盖 5 个包、37 个场景。

### `@ydltavern/engine-core`（12 个场景）

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

这些场景覆盖 PromptManager、World Info、宏展开和 tokenizer 热路径。

### `@ydltavern/importers`（6 个场景）

- `import.character.png.small`
- `import.character.png.large`
- `import.world_book.small`
- `import.world_book.large`
- `import.jsonl.small`
- `import.jsonl.large`

这些场景使用合成 fixture 测量角色卡、世界书和 JSONL chat 导入成本。

### `@ydltavern/st-compat`（9 个场景）

- `chat.proxy.read`
- `chat.proxy.write`
- `chat.proxy.iterate`
- `eventSource.emit.no_listeners`
- `eventSource.emit.10_listeners`
- `eventSource.emit.100_listeners`
- `slash.parse.simple`
- `slash.parse.pipe`
- `slash.execute.simple`

这些场景覆盖 ST API surface 的常见同步路径：`chat[]` Proxy、eventSource 和 slash parser/runtime。

### `@ydltavern/extensions`（5 个场景）

- `sandbox.bootstrap`
- `sandbox.invoke.simple`
- `regex.apply.short`
- `regex.apply.long`
- `loader.parse_manifest`

这些场景覆盖 QuickJS sandbox 初始化/调用、regex 扩展和 extension loader manifest 解析。

### `@ydltavern/surface`（5 个场景）

- `formatting.markdown.short`
- `formatting.markdown.long`
- `formatting.markdown.with_xss`
- `formatting.regex_hooks.10`
- `formatting.full_pipeline.100msg`

这些场景覆盖 messageFormatting、DOMPurify、regex hook 与 100-message formatting pipeline。

## Schema

根文件使用 `yggdrasil.bench.v1`，形状和 Yggdrasil 的 `perf/baseline.json` 保持接近：

- `schema`：当前为 `yggdrasil.bench.v1`。
- `created_at`：生成时间，Unix 毫秒。
- `repo`：YdlTavern 固定为 `"YdlTavern"`。
- `node_version`：运行 bench 的 Node.js 版本。
- `git`：`commit`、`branch`、`dirty`。
- `env`：`os`、`arch`、`num_cpus`。
- `packages`：以包名为 key 的包级 bench 结果。

每个 `<package-bench>` 包含：

- `schema`
- `created_at`
- `package`
- `node_version`
- `git`
- `env`
- `benchmarks`

每个 benchmark 记录包含：

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

`throughput` 当前使用：

```json
{
  "value": 577667,
  "unit": "ops/s"
}
```

## 回归判断

tinybench 本身没有内置 compare 命令。YdlTavern 使用 schema 友好的 JSON，方便后续脚本或人工检查：

1. 在同一台机器上运行优化前基线。
2. 应用优化。
3. 再运行同一组 bench。
4. 对同名场景比较 `mean_ms`。

阈值建议：

- 稳定同步场景先用 10%。
- 受 GC、WASM 初始化、jsdom 或文件解析影响较大的场景可用 20%。
- 小于 1 ms 的极短场景优先看趋势，不要过度解读单次百分比。

当前回归判断只作 advisory，不进入 CI gate。PR 可以引用关键场景的 `mean_ms`、`p95_ms` 与 `rsd_pct`，说明为什么变化可接受。

## 参考基线

已提交的参考基线位于：

```text
perf/baseline.json
```

它对应 B5 聚合提交 `5671700`，来自 Linux 开发机，不是 CI budget。跨机器比较没有意义；请在自己的机器上重新运行，并把同机前后结果作为判断依据。

推荐流程：

```bash
node scripts/run-all-benches.mjs
cp perf/baseline.json /tmp/ydltavern-before.json
# 修改代码
node scripts/run-all-benches.mjs
# 对比 /tmp/ydltavern-before.json 与 perf/baseline.json 中同名 scenario 的 mean_ms
```

## 已知限制

- `@ydltavern/extensions` 的 `sandbox.bootstrap` 主要测到 QuickJS WASM 初始化，均值约 25 ms 量级；它会主导 extensions 包的平均成本。
- `@ydltavern/surface` 的 long markdown 与 `formatting.full_pipeline.100msg` 是当前主要热点候选。
- surface bench 使用 jsdom，比真实浏览器多一层成本；把 surface 数字视为相对趋势，不视为绝对浏览器性能。
- PNG / JSONL importer 使用合成 fixture，不代表真实 ST 导出文件的全部分布。
- tinybench 结果受 Node 版本、CPU governor、后台负载、GC 与热启动状态影响。
- 当前 schema 记录 wall-clock 与 tinybench 统计，不记录 RSS delta；需要内存分析时单独使用 Node profiling 工具。

## 使用方式

优化工作应：

1. 把 `perf/baseline.json` 作为 before/after regression reference。
2. 每个显著改动后重跑相关包 bench；合并前至少重跑全量聚合。
3. 同时查看 `mean_ms` 与 `p95_ms`，避免只优化均值却拉高尾延迟。
4. 如果优化改变行为形状、fixture 形状或 ST 对齐假设，同步更新 `docs/COMPATIBILITY_MATRIX.md` 与相关 guide。
5. 不为性能绕过 ST 兼容层、Yggdrasil capability boundary、权限、审计或 AGPL 义务。
