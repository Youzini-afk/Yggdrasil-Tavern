// bench/_harness.mjs — tinybench wrapper producing yggdrasil.bench.v1 JSON
import { Bench } from 'tinybench';
import { writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { cpus, arch, platform } from 'node:os';

function gitInfo() {
  try {
    return {
      commit: execSync('git rev-parse HEAD').toString().trim(),
      branch: execSync('git rev-parse --abbrev-ref HEAD').toString().trim(),
      dirty: execSync('git status --porcelain').toString().length > 0,
    };
  } catch { return { commit: null, branch: null, dirty: false }; }
}

export async function runBench(packageName, scenarios) {
  const bench = new Bench({ time: 1000, iterations: 50, warmup: true, warmupIterations: 5 });
  for (const s of scenarios) {
    if (s.setup) await s.setup();
    bench.add(s.name, s.fn, s.opts);
  }
  await bench.run();
  
  const benchmarks = bench.tasks.map((task) => {
    const r = task.result || {};
    const samples = r.samples ?? [];
    const sorted = [...samples].sort((a, b) => a - b);
    const pickPct = (p) => sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))] : 0;
    return {
      name: task.name,
      iterations: samples.length,
      samples: samples.length,
      min_ms: r.min ?? sorted[0] ?? 0,
      p50_ms: r.p50 ?? r.median ?? pickPct(0.50),
      p95_ms: r.p95 ?? pickPct(0.95),
      p99_ms: r.p99 ?? pickPct(0.99),
      max_ms: r.max ?? sorted[sorted.length - 1] ?? 0,
      mean_ms: r.mean ?? 0,
      rsd_pct: r.rme ?? 0,
      throughput: r.hz ? { value: Math.round(r.hz), unit: 'ops/s' } : undefined,
    };
  });
  
  const result = {
    schema: 'yggdrasil.bench.v1',
    created_at: Date.now(),
    package: packageName,
    node_version: process.version,
    git: gitInfo(),
    env: { os: platform(), arch: arch(), num_cpus: cpus().length },
    benchmarks,
  };
  
  await writeFile(new URL('./last.json', import.meta.url), JSON.stringify(result, null, 2));
  
  console.log(`\n=== ${packageName} bench ===`);
  console.log(`scenario                                  mean(ms)   p95(ms)   ops/s`);
  console.log(`-`.repeat(72));
  for (const b of benchmarks) {
    const opsStr = b.throughput ? String(b.throughput.value) : '-';
    console.log(`${b.name.padEnd(40)}  ${b.mean_ms.toFixed(3).padStart(8)}  ${b.p95_ms.toFixed(3).padStart(8)}  ${opsStr.padStart(10)}`);
  }
  return result;
}
