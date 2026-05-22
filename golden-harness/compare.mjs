#!/usr/bin/env node
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;

const HARNESS_VERSION = '1.0';
const FIXED_NOW = '2025-05-29T12:00:00.000Z';

const ENGINE_CORE_DIST = path.join(ROOT, '..', 'packages', 'ydltavern-engine-core', 'dist', 'index.js');
const ST_COMPAT_DIST = path.join(ROOT, '..', 'packages', 'ydltavern-st-compat', 'dist', 'src', 'index.js');

let engineCorePromise;
let stCompatPromise;

// Per-category comparators
const COMPARATORS = {
  chat: compareChat,
  'world-info': compareWorldInfo,
  macro: compareMacro,
  instruct: compareInstruct,
  tokenizer: compareTokenizer,
};

async function main() {
  const args = process.argv.slice(2);
  const targetScenario = parseTargetArg(args);
  const summary = { total: 0, perfect: 0, cosmetic: 0, structural: 0, unverifiable: 0, error: 0, by_category: {} };
  const scenariosRoot = path.join(ROOT, 'scenarios');
  const fixturesRoot = path.join(ROOT, 'fixtures');
  const diffRoot = path.join(ROOT, 'diff');
  await mkdir(diffRoot, { recursive: true });

  for (const category of Object.keys(COMPARATORS)) {
    const scenariosDir = path.join(scenariosRoot, category);
    if (!existsSync(scenariosDir)) continue;
    const files = (await readdir(scenariosDir)).filter((f) => f.endsWith('.json')).sort();
    summary.by_category[category] = { total: 0, perfect: 0, cosmetic: 0, structural: 0, unverifiable: 0, error: 0 };
    for (const file of files) {
      const name = file.replace(/\.json$/, '');
      if (targetScenario && targetScenario !== `${category}/${name}` && targetScenario !== '--all') continue;
      summary.total++;
      summary.by_category[category].total++;
      const scenarioPath = path.join(scenariosDir, file);
      const fixturePath = path.join(fixturesRoot, category, file);
      const diffPath = path.join(diffRoot, `${category}-${name}.json`);
      try {
        const result = await runComparison(category, scenarioPath, fixturePath, name);
        await writeFile(diffPath, JSON.stringify(result, replacer, 2) + '\n', 'utf-8');
        summary[result.classification]++;
        summary.by_category[category][result.classification]++;
      } catch (err) {
        const errResult = {
          harness_version: HARNESS_VERSION,
          scenario: `${category}/${name}`,
          classification: 'error',
          matches: false,
          error: String(err && err.stack ? err.stack : err),
        };
        await writeFile(diffPath, JSON.stringify(errResult, replacer, 2) + '\n', 'utf-8');
        summary.error++;
        summary.by_category[category].error++;
      }
    }
  }

  await writeFile(path.join(diffRoot, '_summary.json'), JSON.stringify(summary, null, 2) + '\n', 'utf-8');
  console.log(JSON.stringify(summary, null, 2));
  process.exit(0);
}

function parseTargetArg(args) {
  if (args.includes('--all')) return null;
  const scenarioIndex = args.indexOf('--scenario');
  if (scenarioIndex >= 0 && args[scenarioIndex + 1]) {
    return normalizeScenarioTarget(args[scenarioIndex + 1]);
  }
  const direct = args.find((arg) => !arg.startsWith('--'));
  if (direct) return normalizeScenarioTarget(direct);

  console.error('Usage: node compare.mjs --all | --scenario scenarios/<category>/<name>.json');
  process.exit(1);
}

function normalizeScenarioTarget(value) {
  const normalized = value.replace(/\\/g, '/').replace(/\.json$/, '');
  const marker = '/scenarios/';
  if (normalized.includes(marker)) return normalized.slice(normalized.lastIndexOf(marker) + marker.length);
  if (normalized.startsWith('scenarios/')) return normalized.slice('scenarios/'.length);
  return normalized;
}

async function runComparison(category, scenarioPath, fixturePath, name) {
  const scenario = JSON.parse(await readFile(scenarioPath, 'utf-8'));
  if (!existsSync(fixturePath)) {
    return makeResult(category, scenario, name, 'unverifiable', { reason: 'fixture missing' });
  }
  const fixture = JSON.parse(await readFile(fixturePath, 'utf-8'));
  if (fixture._meta?.skipped) {
    return makeResult(category, scenario, name, 'unverifiable', {
      reason: 'fixture skipped',
      fixture_error: fixture._meta?.error ?? fixture.output?.error ?? null,
      fixture_output: fixture.output,
    });
  }
  const compare = COMPARATORS[category];
  return await compare(scenario, fixture, category, name);
}

function makeResult(category, scenario, name, classification, extra = {}) {
  return {
    harness_version: HARNESS_VERSION,
    scenario: `${category}/${name ?? scenario._description ?? '?'}`,
    description: scenario._description ?? null,
    classification, // 'perfect' | 'cosmetic' | 'structural' | 'unverifiable' | 'error'
    matches: classification === 'perfect',
    ...extra,
  };
}

async function compareChat(scenario, fixture, category, name) {
  const { buildChatRequest } = await importEngineCore();
  if (typeof buildChatRequest !== 'function') {
    return makeResult(category, scenario, name, 'unverifiable', { reason: 'buildChatRequest export missing' });
  }

  const result = buildChatRequest({
    source: scenario.source,
    model: scenario.model,
    messages: scenario.messages ?? [],
    settings: scenario.settings ?? {},
    tools: scenario.tools,
    bias: scenario.bias,
    generationType: scenario.generationType ?? scenario.generation_type ?? 'normal',
  });
  const actual = result.body;
  const expected = fixture.output?.requestBody ?? fixture.body ?? fixture.captured_request?.body ?? fixture.output;
  const diff = classifyDiff(expected, actual);
  return makeResult(category, scenario, name, diff.classification, {
    expected,
    actual,
    delta: diff.delta,
    diagnostics: result.diagnostics,
  });
}

async function compareWorldInfo(scenario, fixture, category, name) {
  const { evaluateWorldInfo } = await importEngineCore();
  if (typeof evaluateWorldInfo !== 'function') {
    return makeResult(category, scenario, name, 'unverifiable', { reason: 'evaluateWorldInfo export missing' });
  }

  const settings = scenario.settings ?? {};
  const result = evaluateWorldInfo({
    chat: toYdlChat(scenario.chat ?? []),
    book: { name: 'golden-harness', entries: scenario.entries ?? [] },
    scanDepth: settings.world_info_depth ?? scenario.scanDepth ?? 4,
    maxRecursion: settings.world_info_recursive === false ? 1 : Math.max(1, settings.world_info_max_recursion_steps ?? 1),
    generation_type: scenario.generation_type ?? scenario.generationType ?? 'normal',
    budget: settings.world_info_budget === undefined ? undefined : { max: settings.world_info_budget, type: 'characters' },
    randomValues: scenario.randomValues ?? scenario.rngSequence,
    macroContext: scenario.env ?? {},
  });

  const actual = {
    worldInfoBefore: result.buckets.before.join('\n'),
    worldInfoAfter: result.buckets.after.join('\n'),
    activatedEntries: result.activated.map((entry) => ({ uid: numericIfPossible(entry.id), content: entry.content })),
    scenario: scenario._description,
  };
  const expected = fixture.output?.activatedEntries
    ? {
        worldInfoBefore: fixture.output.worldInfoBefore ?? '',
        worldInfoAfter: fixture.output.worldInfoAfter ?? '',
        activatedEntries: fixture.output.activatedEntries,
        scenario: fixture.output.scenario,
      }
    : fixture.output;
  const diff = classifyDiff(expected, actual);

  if (isEmptyWorldInfoShimFixture(expected, scenario)) {
    return makeResult(category, scenario, name, 'unverifiable', {
      reason: 'st_shim_returned_empty',
      expected,
      actual,
      delta: diff.delta,
      diagnostics: result.diagnostics,
    });
  }

  return makeResult(category, scenario, name, diff.classification, {
    expected,
    actual,
    delta: diff.delta,
    diagnostics: result.diagnostics,
  });
}

async function compareMacro(scenario, fixture, category, name) {
  const actualOutput = await runMacroScenario(scenario);
  const actual = {
    output: actualOutput,
    scenario: scenario._description,
    input: scenario.text,
  };
  const expected = fixture.output?.output ?? fixture.output;
  const actualComparable = typeof expected === 'string' ? actual.output : actual;
  const expectedComparable = typeof expected === 'string' ? expected : fixture.output;
  const diff = classifyDiff(expectedComparable, actualComparable);

  if (fixture.output?.partial === true) {
    return makeResult(category, scenario, name, 'unverifiable', {
      reason: 'st_macro_fallback_partial',
      expected: expectedComparable,
      actual: actualComparable,
      delta: diff.delta,
      fixture_error: fixture.output?.error ?? null,
    });
  }

  return makeResult(category, scenario, name, diff.classification, {
    expected: expectedComparable,
    actual: actualComparable,
    delta: diff.delta,
  });
}

async function runMacroScenario(scenario) {
  const env = scenario.env ?? {};
  const engine = await importEngineCore();
  if (typeof engine.substituteMacros === 'function') {
    const result = engine.substituteMacros(String(scenario.text ?? ''), env, {
      overrides: env,
      unknownMacro: 'preserve',
      now: scenario.now ?? env.now ?? FIXED_NOW,
    });
    return result?.text ?? String(result ?? '');
  }

  const compat = await importSTCompat();
  if (typeof compat.substituteSTMacrosDeep === 'function') {
    const result = compat.substituteSTMacrosDeep(String(scenario.text ?? ''), {
      env,
      unknownMacro: 'preserve',
      now: scenario.now ?? env.now ?? FIXED_NOW,
    });
    return result?.text ?? String(result ?? '');
  }

  throw new Error('No macro substitution export found in engine-core or st-compat');
}

async function compareInstruct(scenario, fixture, category, name) {
  const { formatInstructModeChat } = await importEngineCore();
  if (typeof formatInstructModeChat !== 'function') {
    return makeResult(category, scenario, name, 'unverifiable', { reason: 'formatInstructModeChat export missing' });
  }

  const role = scenario.isNarrator ? 'system' : scenario.isUser ? 'user' : 'assistant';
  const message = {
    role,
    content: scenario.message ?? '',
    name: role === 'user' ? scenario.userName : scenario.charName,
    isNarrator: scenario.isNarrator === true,
  };
  const output = formatInstructModeChat(message, scenario.template ?? {}, scenario.charName, scenario.userName);
  const actual = {
    output,
    scenario: scenario._description,
    template_used: `${String(scenario.template?.input_sequence ?? '').slice(0, 30)}...`,
  };
  const expected = fixture.output?.output ?? fixture.output;
  const actualComparable = typeof expected === 'string' ? actual.output : actual;
  const expectedComparable = typeof expected === 'string' ? expected : fixture.output;
  const diff = classifyDiff(expectedComparable, actualComparable);
  return makeResult(category, scenario, name, diff.classification, {
    expected: expectedComparable,
    actual: actualComparable,
    delta: diff.delta,
  });
}

async function compareTokenizer(scenario, fixture, category, name) {
  const { countTokens } = await importEngineCore();
  if (typeof countTokens !== 'function') {
    return makeResult(category, scenario, name, 'unverifiable', { reason: 'countTokens export missing' });
  }

  const result = await countTokens(scenario.text, { modelHint: scenario.model_hint });
  const actual = {
    text_length: scenario.text.length,
    tokenizer_id: result.tokenizerId,
    count: result.count,
    accuracy: result.accuracy,
    expected_tokenizer_id: scenario.expected_tokenizer_id,
    matches_expected: result.tokenizerId === scenario.expected_tokenizer_id,
  };
  const expected = fixture.output;
  const diff = classifyDiff(expected, actual);
  return makeResult(category, scenario, name, diff.classification, {
    expected,
    actual,
    delta: diff.delta,
  });
}

async function importEngineCore() {
  if (!existsSync(ENGINE_CORE_DIST)) {
    throw new Error(`engine-core dist not found at ${ENGINE_CORE_DIST}; run npm run build --prefix packages/ydltavern-engine-core`);
  }
  engineCorePromise ??= import(pathToFileURL(ENGINE_CORE_DIST).href);
  return engineCorePromise;
}

async function importSTCompat() {
  if (!existsSync(ST_COMPAT_DIST)) {
    throw new Error(`st-compat dist not found at ${ST_COMPAT_DIST}; run npm run build --prefix packages/ydltavern-st-compat`);
  }
  stCompatPromise ??= import(pathToFileURL(ST_COMPAT_DIST).href);
  return stCompatPromise;
}

function toYdlChat(stChat) {
  return {
    id: 'golden-harness-chat',
    meta: { source_format: 'sillytavern_jsonl' },
    turns: stChat.map((msg, index) => {
      const text = msg.mes ?? msg.content ?? msg.text ?? '';
      const isUser = msg.is_user === true || msg.role === 'user';
      return {
        id: `turn-${index}`,
        index,
        role: isUser ? 'user' : 'assistant',
        speaker: { name: msg.name ?? (isUser ? 'User' : 'Assistant'), kind: isUser ? 'user' : 'character' },
        variants: [{
          id: `variant-${index}`,
          subs: [{ kind: 'text', text }],
          meta: {},
          created_at: 1748520000000 + index,
        }],
        active_variant: 0,
        source: 'imported',
        created_at: 1748520000000 + index,
      };
    }),
  };
}

function isEmptyWorldInfoShimFixture(expected, scenario) {
  return Array.isArray(scenario.entries)
    && scenario.entries.length > 0
    && expected
    && Array.isArray(expected.activatedEntries)
    && expected.activatedEntries.length === 0
    && (expected.worldInfoBefore ?? '') === ''
    && (expected.worldInfoAfter ?? '') === '';
}

function numericIfPossible(value) {
  const numberValue = Number(value);
  return Number.isInteger(numberValue) && String(numberValue) === String(value) ? numberValue : value;
}

function classifyDiff(expected, actual) {
  const expectedJson = JSON.stringify(expected, replacer, 2);
  const actualJson = JSON.stringify(actual, replacer, 2);
  if (expectedJson === actualJson) return { classification: 'perfect', delta: [] };

  // Stable-key serialization detects key-order-only differences in JSON objects.
  const expectedSorted = JSON.stringify(sortObjectKeys(expected), replacer, 0);
  const actualSorted = JSON.stringify(sortObjectKeys(actual), replacer, 0);
  if (expectedSorted === actualSorted) {
    return { classification: 'cosmetic', delta: ['key ordering or whitespace only'] };
  }

  const delta = diffPaths(expected, actual);
  return { classification: 'structural', delta };
}

function replacer(key, value) {
  // Conservative ignore list for request ids if future fixtures capture them.
  if (key === 'request_id' || key === 'requestId') return undefined;
  return value;
}

function sortObjectKeys(obj) {
  if (Array.isArray(obj)) return obj.map(sortObjectKeys);
  if (obj && typeof obj === 'object') {
    const sorted = {};
    for (const key of Object.keys(obj).sort()) sorted[key] = sortObjectKeys(obj[key]);
    return sorted;
  }
  return obj;
}

function diffPaths(expected, actual, prefix = '$', depth = 0, deltas = []) {
  if (deltas.length >= 50) return deltas;
  if (Object.is(expected, actual)) return deltas;
  if (depth >= 8) {
    deltas.push({ path: prefix, expected: summarize(expected), actual: summarize(actual), note: 'max diff depth reached' });
    return deltas;
  }

  if (typeof expected !== typeof actual || expected === null || actual === null) {
    deltas.push({ path: prefix, expected, actual });
    return deltas;
  }

  if (typeof expected !== 'object') {
    deltas.push({ path: prefix, expected, actual });
    return deltas;
  }

  if (Array.isArray(expected) !== Array.isArray(actual)) {
    deltas.push({ path: prefix, expected: summarize(expected), actual: summarize(actual) });
    return deltas;
  }

  if (Array.isArray(expected)) {
    const maxLen = Math.max(expected.length, actual.length);
    for (let i = 0; i < maxLen && deltas.length < 50; i++) {
      const pathPart = `${prefix}[${i}]`;
      if (i >= expected.length) deltas.push({ path: pathPart, expected: undefined, actual: actual[i] });
      else if (i >= actual.length) deltas.push({ path: pathPart, expected: expected[i], actual: undefined });
      else diffPaths(expected[i], actual[i], pathPart, depth + 1, deltas);
    }
    return deltas;
  }

  const keys = new Set([...Object.keys(expected), ...Object.keys(actual)]);
  for (const key of [...keys].sort()) {
    if (deltas.length >= 50) break;
    const pathPart = `${prefix}.${key}`;
    if (!Object.prototype.hasOwnProperty.call(expected, key)) {
      deltas.push({ path: pathPart, expected: undefined, actual: actual[key] });
    } else if (!Object.prototype.hasOwnProperty.call(actual, key)) {
      deltas.push({ path: pathPart, expected: expected[key], actual: undefined });
    } else {
      diffPaths(expected[key], actual[key], pathPart, depth + 1, deltas);
    }
  }
  return deltas;
}

function summarize(value) {
  if (Array.isArray(value)) return `[array length=${value.length}]`;
  if (value && typeof value === 'object') return `{object keys=${Object.keys(value).length}}`;
  return value;
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
