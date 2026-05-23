import { runBench } from './_harness.mjs';
import { Bench } from 'tinybench';
import { createSTContextDeep, createSTContext, createEventSource } from '../dist/src/index.js';
import { createChat } from './fixtures/chat.mjs';

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

const runtime = createSTContext({ chat: createChat(1000) });
const ctx = runtime.context;

const deepCtx = createSTContextDeep({ eventSource: createEventSource() });
const noListenerCtx = createSTContextDeep({ eventSource: createEventSource() });

const tenListenerCtx = createSTContextDeep({ eventSource: createEventSource() });
for (let i = 0; i < 10; i++) tenListenerCtx.eventSource.on('test_evt', () => {});

const hundredListenerCtx = createSTContextDeep({ eventSource: createEventSource() });
for (let i = 0; i < 100; i++) hundredListenerCtx.eventSource.on('test_evt', () => {});

await runBench('@ydltavern/st-compat', [
  {
    name: 'chat.proxy.read',
    fn: () => { let s = 0; for (let i = 0; i < 1000; i++) s += ctx.chat[i].mes.length; return s; },
  },
  {
    name: 'chat.proxy.write',
    fn: () => { for (let i = 0; i < 1000; i++) ctx.chat[i] = { name: 'Y', is_user: false, is_system: false, mes: `w${i}` }; },
  },
  {
    name: 'chat.proxy.iterate',
    fn: () => { let n = 0; for (const t of ctx.chat) { if (t) n++; } return n; },
  },
  {
    name: 'eventSource.emit.no_listeners',
    fn: () => noListenerCtx.eventSource.emit('test_evt', 1),
  },
  {
    name: 'eventSource.emit.10_listeners',
    fn: () => tenListenerCtx.eventSource.emit('test_evt', 1),
  },
  {
    name: 'eventSource.emit.100_listeners',
    fn: () => hundredListenerCtx.eventSource.emit('test_evt', 1),
  },
  {
    name: 'slash.parse.simple',
    fn: () => deepCtx.slashCommandRegistry.execute('/echo hello'),
  },
  {
    name: 'slash.parse.pipe',
    fn: () => deepCtx.slashCommandRegistry.execute('/getvar x | /setvar y {{pipe}}'),
  },
  {
    name: 'slash.execute.simple',
    fn: async () => { await deepCtx.executeSlashCommands?.('/echo hello'); },
  },
]);
