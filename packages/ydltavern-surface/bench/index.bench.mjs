import { runBench } from './_harness.mjs';
import { Bench } from 'tinybench';
import { JSDOM } from 'jsdom';
import { shortText, longText, xssText, hundredMessages } from './fixtures/messages.mjs';

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

const dom = new JSDOM('<!DOCTYPE html>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Node = dom.window.Node;
globalThis.Element = dom.window.Element;

const { formatMessage, registerPreMarkdownHook } = await import('../dist/formatting/index.js');

const cleanups = [];
for (let i = 0; i < 10; i++) {
  cleanups.push(registerPreMarkdownHook(`bench-hook-${i}`, (text) => text.replace(`@@${i}@@`, '')));
}

const baseCtx = { messageId: 'm0', isUser: false, isSystem: false };

await runBench('@ydltavern/surface', [
  { name: 'formatting.markdown.short', fn: () => formatMessage(shortText, baseCtx) },
  { name: 'formatting.markdown.long', fn: () => formatMessage(longText, baseCtx) },
  { name: 'formatting.markdown.with_xss', fn: () => formatMessage(xssText, baseCtx) },
  { name: 'formatting.regex_hooks.10', fn: () => formatMessage(shortText, baseCtx) },
  {
    name: 'formatting.full_pipeline.100msg',
    fn: () => {
      for (const msg of hundredMessages) formatMessage(msg, baseCtx);
    },
  },
]);

cleanups.forEach((c) => c());
