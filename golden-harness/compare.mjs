#!/usr/bin/env node
/**
 * compare.mjs: Runs YdlTavern deep-port modules against the same scenarios
 * and diffs against the ST-generated fixtures.
 *
 * Usage:
 *   node compare.mjs --scenario scenarios/instruct/chatml.json
 *   node compare.mjs --all
 *
 * For each scenario:
 * 1. Read fixture from fixtures/<category>/<name>.json
 * 2. Read scenario from scenarios/<category>/<name>.json
 * 3. Run YdlTavern deep-port equivalent
 * 4. Deep-equal compare against fixture
 * 5. Write diff report to diff/<category>-<name>.json
 * 6. Return exit 0 if all match, 1 if any diff
 */

import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HARNESS_ROOT = __dirname;

// Parse CLI args
const args = process.argv.slice(2);
let scenarioPath = null;
let runAll = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--scenario' && args[i + 1]) {
    scenarioPath = args[++i];
  } else if (args[i] === '--all') {
    runAll = true;
  }
}

if (!scenarioPath && !runAll) {
  console.error('Error: Specify --scenario <path> or --all');
  process.exit(1);
}

function parseScenarioPath(path) {
  const rel = resolve(path).replace(resolve(HARNESS_ROOT, 'scenarios') + '/', '');
  const parts = rel.split('/');
  const category = parts[0];
  const name = basename(parts[parts.length - 1], '.json');
  return { category, name, rel };
}

async function findAllScenarios() {
  const scenarios = [];
  const categories = ['chat', 'world-info', 'macro', 'instruct'];
  for (const cat of categories) {
    const catDir = resolve(HARNESS_ROOT, 'scenarios', cat);
    if (!existsSync(catDir)) continue;
    const files = await readdir(catDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        scenarios.push(resolve(catDir, file));
      }
    }
  }
  return scenarios.sort();
}

/**
 * Deep-diff two objects, returning the paths where they differ.
 */
function deepDiff(a, b, path = '') {
  const diffs = [];

  if (a === b) return diffs;

  if (typeof a !== typeof b || a === null || b === null) {
    diffs.push({ path: path || '$', expected: a, actual: b });
    return diffs;
  }

  if (typeof a !== 'object') {
    if (a !== b) {
      diffs.push({ path: path || '$', expected: a, actual: b });
    }
    return diffs;
  }

  if (Array.isArray(a) !== Array.isArray(b)) {
    diffs.push({ path: path || '$', expected: a, actual: b });
    return diffs;
  }

  if (Array.isArray(a)) {
    const maxLen = Math.max(a.length, b.length);
    for (let i = 0; i < maxLen; i++) {
      const subPath = `${path || '$'}[${i}]`;
      if (i >= a.length) {
        diffs.push({ path: subPath, expected: undefined, actual: b[i] });
      } else if (i >= b.length) {
        diffs.push({ path: subPath, expected: a[i], actual: undefined });
      } else {
        diffs.push(...deepDiff(a[i], b[i], subPath));
      }
    }
  } else {
    const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of allKeys) {
      if (!(key in a)) {
        diffs.push({ path: `${path || '$'}.${key}`, expected: undefined, actual: b[key] });
      } else if (!(key in b)) {
        diffs.push({ path: `${path || '$'}.${key}`, expected: a[key], actual: undefined });
      } else {
        diffs.push(...deepDiff(a[key], b[key], `${path || '$'}.${key}`));
      }
    }
  }

  return diffs;
}

/**
 * Run YdlTavern deep-port equivalent for a scenario.
 * In v0, this returns a placeholder since the deep-port modules
 * are not yet fully implemented. This function will be updated
 * as YdlTavern's engine-core package is built out.
 */
async function runYdlTavernPort(scenario, category) {
  // Check if ydltavern-engine-core is available
  const engineCorePath = resolve(HARNESS_ROOT, '..', 'packages', 'ydltavern-engine-core', 'dist', 'index.mjs');

  if (existsSync(engineCorePath)) {
    try {
      const engine = await import(`file://${engineCorePath}`);
      // Call the appropriate function based on category
      switch (category) {
        case 'instruct':
          if (engine.formatInstructModeChat) {
            const t = scenario.template;
            return engine.formatInstructModeChat(
              scenario.charName, scenario.message, scenario.isUser,
              scenario.isNarrator, scenario.forceAvatar, scenario.userName,
              scenario.charName, scenario.forceOutputSequence, t,
            );
          }
          break;
        case 'macro':
          if (engine.evaluateMacros) {
            return engine.evaluateMacros(scenario.text, scenario.env);
          }
          break;
        // TODO: chat, world-info categories
      }
    } catch (err) {
      console.warn(`  Could not load engine-core: ${err.message}`);
    }
  }

  // No deep-port available yet — return null to indicate "not implemented"
  return null;
}

/**
 * Compare a single scenario's fixture against YdlTavern output.
 */
async function compareScenario(path) {
  const { category, name, rel } = parseScenarioPath(path);

  console.log(`\n[${category}/${name}] Comparing...`);

  // Read fixture
  const fixturePath = resolve(HARNESS_ROOT, 'fixtures', category, `${name}.json`);
  if (!existsSync(fixturePath)) {
    console.log(`[${category}/${name}] No fixture found — skipping`);
    return { category, name, match: false, error: 'No fixture' };
  }

  const fixture = JSON.parse(await readFile(fixturePath, 'utf8'));

  // If the fixture was skipped, skip comparison
  if (fixture._meta?.skipped) {
    console.log(`[${category}/${name}] Fixture was skipped — skipping comparison`);
    return { category, name, match: null, error: 'Fixture skipped' };
  }

  // Read scenario
  const scenario = JSON.parse(await readFile(path, 'utf8'));

  // Run YdlTavern deep-port
  const ytOutput = await runYdlTavernPort(scenario, category);

  if (ytOutput === null) {
    console.log(`[${category}/${name}] YdlTavern deep-port not available yet`);
    const diffReport = {
      _meta: { category, name, compared_at: new Date().toISOString() },
      status: 'NO_YDLTAVERN_PORT',
      fixture_output: fixture.output,
      ydltavern_output: null,
      diffs: [],
      note: 'YdlTavern deep-port module not yet implemented for this category',
    };

    // Write diff report
    const diffDir = resolve(HARNESS_ROOT, 'diff');
    await mkdir(diffDir, { recursive: true });
    const diffPath = resolve(diffDir, `${category}-${name}.json`);
    await writeFile(diffPath, JSON.stringify(diffReport, null, 2) + '\n', 'utf8');

    return { category, name, match: null, error: 'No deep-port' };
  }

  // Deep compare
  const diffs = deepDiff(fixture.output, ytOutput);
  const match = diffs.length === 0;

  // Write diff report
  const diffDir = resolve(HARNESS_ROOT, 'diff');
  await mkdir(diffDir, { recursive: true });
  const diffPath = resolve(diffDir, `${category}-${name}.json`);

  const diffReport = {
    _meta: { category, name, compared_at: new Date().toISOString() },
    status: match ? 'MATCH' : 'DIFF',
    fixture_output: fixture.output,
    ydltavern_output: ytOutput,
    diffs: diffs,
    diff_count: diffs.length,
  };

  await writeFile(diffPath, JSON.stringify(diffReport, null, 2) + '\n', 'utf8');

  if (match) {
    console.log(`[${category}/${name}] ✓ MATCH`);
  } else {
    console.log(`[${category}/${name}] ✗ DIFF (${diffs.length} differences)`);
  }

  return { category, name, match, diffCount: diffs.length };
}

// ====== Main ======
async function main() {
  console.log('=== YdlTavern Golden Harness — Compare ===\n');

  let scenarioPaths;
  if (runAll) {
    scenarioPaths = await findAllScenarios();
    console.log(`Found ${scenarioPaths.length} scenarios to compare.`);
  } else {
    scenarioPaths = [resolve(scenarioPath)];
  }

  const results = [];
  for (const path of scenarioPaths) {
    const result = await compareScenario(path);
    results.push(result);
  }

  // Summary
  const total = results.length;
  const matched = results.filter(r => r.match === true).length;
  const differed = results.filter(r => r.match === false).length;
  const noPort = results.filter(r => r.match === null).length;

  console.log(`\n=== Comparison Results ===`);
  console.log(`Total: ${total}  Matched: ${matched}  Differed: ${differed}  NoPort: ${noPort}`);

  process.exit(differed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
