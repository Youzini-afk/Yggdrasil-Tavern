#!/usr/bin/env node
/**
 * run.mjs: CLI entry point for the golden harness.
 *
 * Usage:
 *   node runner/run.mjs --scenario scenarios/instruct/chatml.json
 *   node runner/run.mjs --all
 *
 * For each scenario, determines its category (chat/wi/macro/instruct/tokenizer),
 * calls the corresponding extract-*.mjs function, and writes the result
 * to fixtures/<category>/<name>.json.
 */

import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const FIXED_GENERATED_AT = '2025-05-29T12:00:00.000Z';

// Register the ST module loader and install globals BEFORE loading ST modules.
import '../shims/register-loader.mjs';
import '../shims/globals.mjs';

// Now that globals are installed and loader is active, import the ST loader
import { loadSTModules } from './load-st.mjs';
import { extractInstruct } from './extract-instruct.mjs';
import { extractMacro } from './extract-macro.mjs';
import { extractWI } from './extract-wi.mjs';
import { extractPrompt } from './extract-prompt.mjs';
import { extractTokenizer } from './extract-tokenizer.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HARNESS_ROOT = resolve(__dirname, '..');

// Parse CLI args
const args = process.argv.slice(2);
let scenarioPath = null;
let runAll = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--scenario' && args[i + 1]) {
    scenarioPath = args[++i];
  } else if (args[i] === '--all') {
    runAll = true;
  } else if (args[i] === '--help' || args[i] === '-h') {
    console.log('Usage: node runner/run.mjs --scenario <path> | --all');
    process.exit(0);
  }
}

if (!scenarioPath && !runAll) {
  console.error('Error: Specify --scenario <path> or --all');
  process.exit(1);
}

/**
 * Determine scenario category and name from path.
 * e.g., "scenarios/instruct/chatml.json" → { category: "instruct", name: "chatml" }
 */
function parseScenarioPath(path) {
  const rel = resolve(path).replace(resolve(HARNESS_ROOT, 'scenarios') + '/', '');
  const parts = rel.split('/');
  const category = parts[0]; // chat, world-info, macro, instruct, tokenizer
  const name = basename(parts[parts.length - 1], '.json');
  return { category, name, rel };
}

/**
 * Get the extractor function for a category.
 */
function getExtractor(category) {
  switch (category) {
    case 'instruct': return extractInstruct;
    case 'macro': return extractMacro;
    case 'world-info': return extractWI;
    case 'chat': return extractPrompt;
    case 'tokenizer': return extractTokenizer;
    default: throw new Error(`Unknown scenario category: ${category}`);
  }
}

/**
 * Find all scenario files under scenarios/
 */
async function findAllScenarios() {
  const scenarios = [];
  const categories = ['chat', 'world-info', 'macro', 'instruct', 'tokenizer'];

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
 * Run a single scenario and write its fixture.
 */
async function runScenario(path, stModules) {
  const { category, name, rel } = parseScenarioPath(path);

  console.log(`\n[${category}/${name}] Running...`);

  // Read scenario
  const scenarioText = await readFile(path, 'utf8');
  const scenario = JSON.parse(scenarioText);

  // Get extractor
  const extractor = getExtractor(category);

  // Run extraction
  let result;
  let skipped = false;
  let errorMsg = null;

  try {
    result = await extractor(scenario, stModules);
  } catch (err) {
    skipped = true;
    errorMsg = err.message;
    result = { error: err.message, skipped: true };
    console.log(`[${category}/${name}] SKIPPED: ${err.message}`);
  }

  // If the result itself indicates an error (e.g., evaluateMacros failed gracefully)
  if (result?.error && !result?.output) {
    skipped = true;
    errorMsg = result.error;
  }

  // Write fixture
  const fixtureDir = resolve(HARNESS_ROOT, 'fixtures', category);
  const fixturePath = resolve(fixtureDir, `${name}.json`);

  await mkdir(fixtureDir, { recursive: true });

  const fixture = {
    _meta: {
      harness_version: '0.1.0',
      generated_at: FIXED_GENERATED_AT,
      scenario: rel,
      category,
      name,
      skipped: skipped || false,
      error: errorMsg || null,
    },
    input: scenario,
    output: result,
  };

  await writeFile(fixturePath, JSON.stringify(fixture, null, 2) + '\n', 'utf8');

  if (!skipped) {
    console.log(`[${category}/${name}] ✓ Fixture written to fixtures/${category}/${name}.json`);
  } else {
    console.log(`[${category}/${name}] ✗ Skipped: ${errorMsg}`);
  }

  return { category, name, skipped, error: errorMsg };
}

// ====== Main ======
async function main() {
  console.log('=== YdlTavern Golden Harness v0 ===\n');

  // Load ST modules
  const { modules: stModules, errors: loadErrors } = await loadSTModules();

  if (loadErrors.length > 0) {
    console.warn(`\n⚠ ${loadErrors.length} module(s) failed to load:`);
    for (const { name, error } of loadErrors) {
      console.warn(`  - ${name}: ${error}`);
    }
  }

  // Determine which scenarios to run
  let scenarioPaths;
  if (runAll) {
    scenarioPaths = await findAllScenarios();
    console.log(`\nFound ${scenarioPaths.length} scenarios to run.`);
  } else {
    scenarioPaths = [resolve(scenarioPath)];
  }

  // Run each scenario
  const results = [];
  for (const path of scenarioPaths) {
    const result = await runScenario(path, stModules);
    results.push(result);
  }

  // Summary
  const total = results.length;
  const passed = results.filter(r => !r.skipped).length;
  const skipped = results.filter(r => r.skipped).length;

  console.log(`\n=== Results ===`);
  console.log(`Total: ${total}  Passed: ${passed}  Skipped: ${skipped}`);

  if (skipped > 0) {
    console.log('\nSkipped scenarios:');
    for (const r of results.filter(r => r.skipped)) {
      console.log(`  - ${r.category}/${r.name}: ${r.error}`);
    }
  }

  // Exit with 0 if at least one scenario produced a fixture
  process.exit(passed > 0 ? 0 : 1);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
