# Baseline Benchmark Beta (Yggdrasil + YdlTavern)

> 临时计划。每阶段单独 push。B6 删除此文件并将持久内容并入长期文档。

## 目的

在 Phase B 优化工作开始前，**锁定测量基础设施 + 提交参考基线数字**。完成后:

- `ygg perf baseline --compare perf/baseline.json` 检测 Yggdrasil 回归
- `npm run bench` 每个 YdlTavern 包输出 tinybench 结果
- 两仓各自 commit 一份 `perf/baseline.json`
- 后续 Phase B (multi-agent / MCP / vector RAG) 可以与锁定基线比较

## 非目标

- 不做优化（下一周期）
- 不做 CI 强制 gating（仅 advisory 阈值）
- 不做真实浏览器 (Playwright 推迟; 此阶段 jsdom 即可)
- 不集成 criterion/divan (扩展现有 custom harness)

## 工具决策（已锁定）

| 层 | 工具 | 原因 |
|---|---|---|
| Yggdrasil 性能 | 扩展已有 `ygg perf baseline` custom harness | 已覆盖 criterion 不擅长的 integration 场景 |
| YdlTavern 包 | tinybench 6.x (ESM, zero-dep, 程序化) | MIT, AGPL兼容, ESM 原生, 程序化结果 JSON |
| 输出 schema | `yggdrasil.bench.v1` | 含 percentile + memory + throughput + env + git |
| 回归阈值 | 10% wall-clock, 20% E2E | 跨语言噪声场景保守起步 |

---

## B1 — Yggdrasil ScenarioResult 升级

**文件**: `crates/ygg-cli/src/commands/perf.rs`

`ScenarioResult` 新字段:
- `p50_ms`, `p95_ms`, `p99_ms`
- `memory_rss_mb_delta` (`/proc/self/status` 读取; Linux 真值, 其他 OS 返回 `null`)
- `iterations_capped: bool` (大场景 100k 事件强制 1 iter 时为 true)
- 保留 `total_ms / avg_ms / min_ms / max_ms / iterations / notes / status` 向后兼容

顶层 JSON 新字段:
- `env`: `{ os, cpu_brand?, rustc_version?, target_triple, num_cpus }`
- `git`: `{ commit?, branch?, dirty? }`
- `meta.tool_version` 已在, 保留

新 CLI flags (`crates/ygg-cli/src/cli.rs`):
- `--baseline-out <PATH>` 保存完整 JSON
- `--compare <PATH>` 加载先前 JSON, 计算 per-scenario delta, 超阈值 exit non-zero
- `--threshold-pct <N>` 默认 10 (用于 `--compare`)
- `--warmup <N>` 默认 1 (现 0)

验证:
```
cargo test --workspace
cargo run -p ygg-cli -- perf baseline --iterations 3 --format json
cargo run -p ygg-cli -- perf baseline --iterations 3 --baseline-out /tmp/bl.json
cargo run -p ygg-cli -- perf baseline --iterations 3 --compare /tmp/bl.json
```

---

## B2 — Yggdrasil 新场景

**文件**: `crates/ygg-cli/src/commands/perf.rs`

新增:
- `subprocess_cold_start_ms` — spawn → first ready
- `subprocess_handshake_ms` — manifest exchange + first invoke
- `subprocess_invoke_steady_1kb` / `10kb` / `100kb` — steady-state RPC 吞吐
- `outbound_execute_fake_throughput_req_s` — FakeOutboundExecutor 请求/秒
- `outbound_stream_fake_ttft_ms` — SSE-like 首字节延迟
- `outbound_stream_fake_steady_events_s` — 稳态事件率

复用:
- `FakeOutboundExecutor` (无真实 HTTPS)
- 现有 subprocess spawn helpers + 已有的 echo subprocess example

---

## B3 — Yggdrasil 提交 baseline

```bash
cargo run -p ygg-cli -- perf baseline \
  --iterations 30 \
  --warmup 3 \
  --baseline-out perf/baseline.json
```

提交 `perf/baseline.json` + 更新 `docs/performance/BASELINE.md`。

---

## B4 — YdlTavern 各包 benchmark 基础设施

每包加:
- devDep `tinybench@^6.0.2`
- script `bench` 跑 bench 文件
- `bench/index.bench.mjs` tinybench 场景 + 输出 `bench/last.json`
- `bench/fixtures/` 合成 fixture (确定性输入)

### B4a engine-core (优先级最高)

```
prompt_manager.compile.small      5 prompts + 10 messages
prompt_manager.compile.medium     20 prompts + 100 messages + 50 WI
prompt_manager.compile.large      50 prompts + 1000 messages + 500 WI
world_info.evaluate.small         10 entries + 5 keys
world_info.evaluate.medium        100 entries + 50 keys + recursive
world_info.evaluate.large         1000 entries + 500 keys + recursive + decorator
macros.expand.short               100 macro calls
macros.expand.long                5000 calls + nested
tokenizer.gpt.encode.short        cl100k, 100 chars
tokenizer.gpt.encode.long         cl100k, 10k chars
tokenizer.llama3.encode.short
tokenizer.llama3.encode.long
```

### B4b importers

```
import.character.png.small        10KB PNG V2 metadata
import.character.png.large        1MB PNG (synthetic)
import.world_book.small           10 entries
import.world_book.large           1000 entries
import.jsonl.small                100 turns
import.jsonl.large                10k turns
```

### B4c st-compat

```
chat.proxy.read                   1000 reads
chat.proxy.write                  1000 writes
chat.proxy.iterate                full iter over 1000 entries
eventSource.emit.no_listeners
eventSource.emit.10_listeners
eventSource.emit.100_listeners
slash.parse.simple                /echo hello
slash.parse.pipe                  /getvar x | /setvar y {{pipe}}
slash.execute.simple
```

### B4d extensions

```
sandbox.bootstrap                 QuickJS init + ST API bridge mount
sandbox.invoke.simple             single call into sandbox
regex.apply.short                 10 patterns / 1KB text
regex.apply.long                  100 patterns / 100KB text
loader.parse_manifest             50 manifests
```

### B4e surface

```
formatting.markdown.short         100 char
formatting.markdown.long          10KB
formatting.markdown.with_xss      XSS vectors
formatting.regex_hooks.10         10 registered preMarkdown hooks
formatting.full_pipeline.100msg   100 messages full pipeline
```

JSDOM bootstrap 一次, 跨 iter 复用; DOMPurify hooks 仅注册一次。

---

## B5 — YdlTavern 提交统一 baseline

新增 `scripts/run-all-benches.mjs`:
1. 逐包跑 `npm run bench`
2. 读各 `bench/last.json`
3. 合并到根 `perf/baseline.json`
4. 输出 summary table

提交。

---

## B6 — 文档收敛 + 清理

更新:
- `docs/performance/BASELINE.md` (Ygg) — 指向 `perf/baseline.json` + 新场景说明
- `docs/performance/PERFORMANCE_AND_CODE_HEALTH.md` (Ygg) — 扩展 schema 说明
- `docs/guides/PERFORMANCE_BASELINE.md` (YdlTavern, 新) — 如何 bench YdlTavern
- `docs/guides/PERFORMANCE_BASELINE.en.md` (YdlTavern, 新)
- 两仓 README + COMPATIBILITY_MATRIX
- 删除本计划

---

## Wave 结构

- Wave 1: B1 only (Yggdrasil 核心升级 — B2/B3 前置依赖)
- Wave 2: B2 (Ygg scenarios) + B4 (YdlTavern benches) 并行 — 不同仓
- Wave 3: B3 + B5 并行
- Wave 4: B6 文档

预估 4-5 天工作量。

## 不变量

- 内核 content-free 维持
- secret_ref 仍 host-side
- 默认 CI/conformance 仍不联网
- 测量代码不修改 production 行为路径
- AGPL 兼容 deps (tinybench MIT)
