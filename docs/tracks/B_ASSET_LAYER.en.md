# B Track: Asset Layer

> [English](./B_ASSET_LAYER.en.md) · [中文](./B_ASSET_LAYER.md)

## Scope

Bring SillyTavern content asset formats into YdlTavern as-is.

Includes:

- Character cards V1 / V2 / V3 (including PNG embedded metadata chunks)
- CharX zip packages (V3 assets)
- World books / lorebooks (standalone files + `character_book` embedded in character cards)
- OpenAI-family presets (PromptManager preset, about 75 fields)
- Chat history JSONL
- Persona data
- Groups (group chat files)
- Theme / theme JSON
- Quick Reply collections
- Regex script presets
- Instruct mode template

## Ground truth

Sections in `docs/inventory/WORLD_INFO_AND_ASSETS.raw.md`:
`CHARACTER_CARD_V1` / `V2` / `V3`, `PRESET_SCHEMA_OPENAI`, `PROMPT_MANAGER_IDENTIFIERS`, `PERSONA_SCHEMA`, `GROUP_CHAT_SCHEMA`, `QUICK_REPLY_SCHEMA`, `THEME_SCHEMA`, `INSTRUCT_TEMPLATE_SCHEMA`.

## Deliverables

- `importers/` — one importer per format. Input ST original files, output YdlTavern internal representation
- `exporters/` — reverse path, able to export YdlTavern character cards as ST V2 / V3 formats
- Character card importer must preserve PNG chunk order and base64 padding
- Preset importer must preserve each prompt's `enabled` / `injection_position` / `injection_depth` / `injection_order` in `prompt_order`
- Asset importer must not drop unrecognized fields — store them as-is in the `extensions` namespace

## Alignment strategy

Each importer is paired with an alignment fixture:

- Input: real exported ST files (character card PNG, preset JSON, etc.)
- Expected: data is exactly the same when read back by the same ST version
- Unit test: YdlTavern import → internal → export → binary diff against the original file (character card PNG) or deep equal (JSON)

## Dependencies

- Internal Turn model ([`../architecture/TURN_MODEL.en.md`](../architecture/TURN_MODEL.en.md)) is set ✓
- Does not depend on any other track

## Current status

`packages/ydltavern-importers` now has an ST-like fixture spine:

- character V2/V3 JSON fixtures;
- world book fixture;
- JSONL chat fixture;
- PNG `chara` metadata extraction test;
- importers conservatively preserve unknown fields and raw payloads.

This is not the full asset layer yet: exporters, CharX, preset/persona/theme/quick reply/regex/instruct remain to be implemented.

## Out of scope

- Bidirectional sync between modified ST data and the YdlTavern internal schema — import once only
- Third-party derived formats (third-party CharaX variants, ChatGPT history import, etc.) — add importers as needed

## Completion criteria

- Every ST asset format has importer + exporter + alignment fixture
- All fields are upgraded to `implemented` in `COMPATIBILITY_MATRIX.en.md`
- A set of real ST user assets can be imported and displayed successfully
