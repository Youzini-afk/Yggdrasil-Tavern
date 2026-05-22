# Golden Harness Guide

> [English](./GOLDEN_HARNESS.en.md) · [中文](./GOLDEN_HARNESS.md)

## Purpose

The golden harness is YdlTavern's fixture generator for aligning with SillyTavern behavior. It runs in Node.js, loads real SillyTavern ESM modules through jsdom and targeted shims, and turns fixed input scenarios into canonical JSON fixtures. YdlTavern deep-port modules then read the same scenarios and diff against those fixtures.

This does not replace unit tests. Its job is to provide a ruler from ST source: for the same input, what request body, formatted text, or tokenizer count does ST actually produce?

## Directory layout

Key files under `golden-harness/`:

- `README.md`: detailed harness notes, limitations, and v0 status.
- `runner/run.mjs`: unified entrypoint.
- `runner/extract-*.mjs`: per-category fixture extractors.
- `scenarios/<category>/*.json`: input scenarios.
- `fixtures/<category>/*.json`: generated canonical outputs (created after running).
- `shims/`: DOM, jQuery, fetch, time, rng, and ST dependency shims.
- `.st-commit-pin`: recommended record of the ST commit used for fixture generation.

## How to run

Prepare a sibling SillyTavern checkout and set the path:

```bash
export YDLTAVERN_ST_PATH=/workspace/Yggdrasil/SillyTavern
```

Install and run:

```bash
cd golden-harness
npm install
node runner/run.mjs --all
```

If your local runner needs the loader hook, use the `node --import ./shims/register-loader.mjs ...` command shown in `golden-harness/README.md`.

## ST commit pin

Fixtures must say which SillyTavern commit they came from. Recommended before/after fixture updates:

```bash
cd $YDLTAVERN_ST_PATH
git rev-parse HEAD > ../YdlTavern/golden-harness/.st-commit-pin
```

After updating ST source, regenerate fixtures and describe the pin change in the PR. Fixtures without a pin should not be treated as a long-term regression baseline.

## Scenario format

A scenario is a JSON file under `scenarios/<category>/`. It usually contains:

- `name`: stable scenario name.
- `category`: `chat`, `world-info`, `macro`, `instruct`, or `tokenizer`.
- `input`: fixed input for the extractor.
- Optional `settings` / `metadata`: pinned ST settings, model name, template name, random seed notes, etc.

Fields differ slightly by category. When adding a scenario, copy the smallest similar scenario first and edit the input instead of inventing a new schema.

## Fixture format

A fixture is generated JSON written to `fixtures/<category>/<name>.json`. It usually contains:

- scenario name and category;
- ST commit / harness metadata when available;
- canonical output such as provider request body, formatted instruct text, macro expansion, WI structural output, or token count;
- warning or limitation fields when the category uses shim/fallback behavior.

Fixtures should be deterministic. Time, randomness, UUIDs, and fetch are pinned by shims.

## Supported categories

- `chat`: loads ST chat completion request assembly and captures the request body via fetch interception.
- `world-info`: runs ST world-info paths; v0 is still limited by data-store shims.
- `macro`: runs or approximates ST macro expansion; v0 falls back for DOM-dependent macros.
- `instruct`: runs the ST instruct mode formatter.
- `tokenizer`: regression baseline for the YdlTavern runtime tokenizer registry; currently not a full replacement for ST backend token counts.

## Known limitations

The v0 harness is intentionally small. Some scenarios use shims/fallbacks rather than a full ST evaluator: macro instruct/DOM dependencies are incomplete, the world-info data store is not fully populated, chat settings may still use ST defaults, and tokenizer fixtures are currently a YdlTavern adapter self-baseline. See [`golden-harness/README.md`](../../golden-harness/README.md) for the full list.

Do not interpret fixture presence as “this domain is fully implemented.” The compatibility matrix should only be upgraded when the corresponding implementation and diff tests are stable.

## License caveat

SillyTavern is AGPL-3.0. YdlTavern does not vendor ST source and does not copy ST files into this repository. The harness only reads a local sibling checkout through `YDLTAVERN_ST_PATH` and treats it as a read-only reference implementation.

## Adding a scenario

1. Confirm the ST checkout is at the intended commit and update `.st-commit-pin`.
2. Copy a nearby JSON file under `scenarios/<category>/`.
3. Keep the input small and cover one behavior branch.
4. Run `node runner/run.mjs --all` and confirm fixture generation.
5. Run twice and verify there is no random drift.
6. Add or update the matching diff test in the relevant YdlTavern package.
7. If the scenario depends on a shim/fallback, document that limitation in the scenario or PR.

See [`golden-harness/README.md`](../../golden-harness/README.md) for runner details, shim order, and per-category status.
