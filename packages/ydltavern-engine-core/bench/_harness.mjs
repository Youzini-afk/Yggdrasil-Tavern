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
  } catch {
    return { commit: null, branch: null, dirty: false };
  }
}

function percentile(samples, pct) {
  if (!Array.isArray(samples) || samples.length === 0) return 0;
  const sorted = [...samples].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil((pct / 100) * sorted.length) - 1));
  return sorted[index] ?? 0;
}

function resultValue(result, names, fallback = 0) {
  for (const name of names) {
    const value = result?.[name];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
  }
  return fallback;
}

function resultOptional(result, names) {
  for (const name of names) {
    const value = result?.[name];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
  }
  return undefined;
}

function resultSamples(result) {
  return Array.isArray(result?.samples)
    ? result.samples
    : Array.isArray(result?.latency?.samples)
      ? result.latency.samples
      : [];
}

function samplesCount(result) {
  return resultValue(result?.latency, ['samplesCount'], resultValue(result, ['samplesCount'], resultSamples(result).length));
}

function latencyResult(result) {
  return result?.latency && typeof result.latency === 'object' ? result.latency : result;
}

function throughputHz(result, meanMs) {
  const direct = resultOptional(result, ['hz']);
  if (direct !== undefined) return direct;
  const throughput = result?.throughput;
  const hz = resultOptional(throughput, ['hz', 'mean', 'p50']);
  if (hz !== undefined) return hz;
  return meanMs > 0 ? 1000 / meanMs : undefined;
}

export async function runBench(packageName, scenarios) {
  const bench = new Bench({ time: 1000, iterations: 50, warmup: true, warmupIterations: 5, retainSamples: true });

  for (const { name, fn, setup } of scenarios) {
    if (setup) await setup();
    bench.add(name, fn);
  }

  await bench.run();

  const benchmarks = bench.tasks.map((task) => {
    const raw = task.result;
    const r = latencyResult(raw);
    const samples = resultSamples(raw);
    const mean = resultValue(r, ['mean'], 0);
    const hz = throughputHz(raw, mean);

    return {
      name: task.name,
      iterations: resultValue(raw, ['iterations', 'totalIterations'], raw?.totalTime && mean ? Math.round(raw.totalTime / mean) : samplesCount(raw)),
      samples: samplesCount(raw),
      min_ms: resultValue(r, ['min'], percentile(samples, 0)),
      p50_ms: resultValue(r, ['p50', 'median'], percentile(samples, 50)),
      p95_ms: resultOptional(r, ['p95']) ?? percentile(samples, 95),
      p99_ms: resultValue(r, ['p99'], percentile(samples, 99)),
      max_ms: resultValue(r, ['max'], percentile(samples, 100)),
      mean_ms: mean,
      rsd_pct: resultValue(r, ['rme'], resultValue(raw, ['rme'], 0)),
      throughput: hz ? { value: Math.round(hz), unit: 'ops/s' } : undefined,
    };
  });

  const result = {
    schema: 'yggdrasil.bench.v1',
    created_at: Date.now(),
    package: packageName,
    node_version: process.version,
    git: gitInfo(),
    env: {
      os: platform(),
      arch: arch(),
      num_cpus: cpus().length,
    },
    benchmarks,
  };

  await writeFile(new URL('./last.json', import.meta.url), JSON.stringify(result, null, 2));

  console.log(`\n=== ${packageName} bench ===`);
  console.log('scenario                                  mean(ms)   p95(ms)   ops/s');
  console.log('-'.repeat(72));
  for (const b of benchmarks) {
    const opsStr = b.throughput ? String(b.throughput.value) : '-';
    console.log(`${b.name.padEnd(40)}  ${b.mean_ms.toFixed(3).padStart(8)}  ${b.p95_ms.toFixed(3).padStart(8)}  ${opsStr.padStart(10)}`);
  }

  return result;
}
