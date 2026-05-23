import { runBench } from './_harness.mjs';
import { Bench } from 'tinybench';
import {
  ExtensionSandbox,
  REGEX_PLACEMENT,
  getRegexedString,
  parseSTManifest,
} from '../dist/index.js';

import { tenPatterns, hundredPatterns } from './fixtures/regex.mjs';
import { fiftyManifests } from './fixtures/manifests.mjs';
import { microStExtensionSource } from './fixtures/sandbox-ext.mjs';

patchTinybench6Results();

function patchTinybench6Results() {
  if (Bench.prototype.__ydlTavernBenchCompat) return;
  const probe = new Bench({ iterations: 1 });
  probe.add('probe', () => undefined);
  const taskProto = Object.getPrototypeOf(probe.tasks[0]);
  const desc = Object.getOwnPropertyDescriptor(taskProto, 'result');
  if (desc?.get) {
    Object.defineProperty(taskProto, 'result', {
      configurable: true,
      get() {
        const result = desc.get.call(this);
        exposeTinybench6Stats(result);
        return result;
      },
    });
  }
  Bench.prototype.__ydlTavernBenchCompat = true;
}

function exposeTinybench6Stats(r) {
  if (!r?.latency || r.samples) return;
  const latency = r.latency;
  r.samples = [latency.min, latency.p50, latency.p95, latency.p99, latency.max].filter((v) => typeof v === 'number');
  r.min = latency.min;
  r.p50 = latency.p50;
  r.p95 = latency.p95 ?? latency.p99;
  r.p99 = latency.p99;
  r.max = latency.max;
  r.mean = latency.mean;
  r.rme = latency.rme;
  r.hz = r.throughput?.mean;
}

let sandbox;

await runBench('@ydltavern/extensions', [
  {
    name: 'sandbox.bootstrap',
    fn: async () => {
      const s = new ExtensionSandbox('bench-bootstrap', { callTimeoutMs: 250 });
      await s.init();
      s.destroy();
    },
    opts: { iterations: 5, time: 5000 },
  },
  {
    name: 'sandbox.invoke.simple',
    setup: async () => {
      sandbox = new ExtensionSandbox('bench-invoke', { callTimeoutMs: 250 });
      await sandbox.init();
      await sandbox.eval(microStExtensionSource, 'bench-extension.js');
    },
    fn: async () => { await sandbox.eval('40 + 2', 'bench-invoke.js'); },
  },
  {
    name: 'regex.apply.short',
    fn: () => getRegexedString('x'.repeat(1024), tenPatterns, { placement: REGEX_PLACEMENT.AI_OUTPUT }),
  },
  {
    name: 'regex.apply.long',
    fn: () => getRegexedString('x'.repeat(102400), hundredPatterns, { placement: REGEX_PLACEMENT.AI_OUTPUT }),
  },
  {
    name: 'loader.parse_manifest',
    fn: () => fiftyManifests.forEach((m) => parseSTManifest(m)),
  },
]);

sandbox?.destroy();
