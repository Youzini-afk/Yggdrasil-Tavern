#!/usr/bin/env node
// scripts/run-all-benches.mjs
//
// Runs `npm run bench` for every YdlTavern package that has a bench/ directory,
// then aggregates each package's bench/last.json into a single
// perf/baseline.json (yggdrasil.bench.v1 multi-package envelope).

import { execSync } from 'node:child_process';
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cpus, arch, platform } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const PACKAGES = [
  'engine-core',
  'importers',
  'st-compat',
  'extensions',
  'surface',
];

function gitInfo() {
  try {
    return {
      commit: execSync('git rev-parse HEAD', { cwd: repoRoot }).toString().trim(),
      branch: execSync('git rev-parse --abbrev-ref HEAD', { cwd: repoRoot })
        .toString()
        .trim(),
      dirty:
        execSync('git status --porcelain', { cwd: repoRoot }).toString().length > 0,
    };
  } catch {
    return { commit: null, branch: null, dirty: false };
  }
}

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

const args = new Set(process.argv.slice(2));
const skipRun = args.has('--no-run');

if (!skipRun) {
  for (const pkg of PACKAGES) {
    console.log(`\n=== Running ${pkg} bench ===`);
    execSync(`npm run bench --prefix packages/ydltavern-${pkg}`, {
      cwd: repoRoot,
      stdio: 'inherit',
    });
  }
}

const aggregated = {
  schema: 'yggdrasil.bench.v1',
  created_at: Date.now(),
  repo: 'YdlTavern',
  node_version: process.version,
  git: gitInfo(),
  env: {
    os: platform(),
    arch: arch(),
    num_cpus: cpus().length,
  },
  packages: {},
};

const summaryRows = [];
for (const pkg of PACKAGES) {
  const lastJsonPath = resolve(
    repoRoot,
    `packages/ydltavern-${pkg}/bench/last.json`,
  );
  if (!(await fileExists(lastJsonPath))) {
    console.warn(`[run-all-benches] missing ${lastJsonPath}, skipping`);
    continue;
  }
  const data = JSON.parse(await readFile(lastJsonPath, 'utf-8'));
  aggregated.packages[`@ydltavern/${pkg}`] = data;

  const benchmarks = data.benchmarks ?? [];
  const means = benchmarks.map((b) => b.mean_ms ?? 0).filter((v) => v > 0);
  if (means.length === 0) {
    summaryRows.push({ pkg, count: 0, minMean: 0, maxMean: 0 });
    continue;
  }
  summaryRows.push({
    pkg,
    count: benchmarks.length,
    minMean: Math.min(...means),
    maxMean: Math.max(...means),
  });
}

const outDir = resolve(repoRoot, 'perf');
await mkdir(outDir, { recursive: true });
const outPath = resolve(outDir, 'baseline.json');
await writeFile(outPath, JSON.stringify(aggregated, null, 2));

console.log('\n=== Aggregated perf/baseline.json ===');
console.log(
  `package                              scenarios   mean range (ms)`,
);
console.log('-'.repeat(72));
for (const row of summaryRows) {
  console.log(
    `@ydltavern/${row.pkg.padEnd(24)}  ${String(row.count).padStart(3)}        ${row.minMean.toFixed(3)} - ${row.maxMean.toFixed(3)}`,
  );
}
console.log(`\nwrote ${outPath}`);
