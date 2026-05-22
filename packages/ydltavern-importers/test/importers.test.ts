import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { join } from 'node:path';

import type { JsonObject } from '@ydltavern/types';
import { exportCharacterCard, exportChatHistory, exportPreset, exportWorldBook, extractPngTextChunks, importCharacterCard, importChatHistory, importInstructPreset, importPersona, importPreset, importQuickReplies, importRegexScripts, importTheme, importWorldBook } from '../src/index.js';

const fixturesDir = join(process.cwd(), 'test', 'fixtures');

test('imports a V2 JSON character card fixture with raw payload preservation', async () => {
  const fixture = await readJsonFixture('character-v2.json');
  const card = importCharacterCard(fixture);

  assert.equal(card.kind, 'character_card');
  assert.equal(card.format, 'st_v2');
  assert.deepEqual(card.version, { spec: 'chara_card_v2', spec_version: '2.0' });
  assert.equal(card.name, 'Aster Fixture');
  assert.equal(card.first_mes, 'Hello from the V2 fixture!');
  assert.deepEqual(card.tags, ['fixture', 'v2', 'asset-spine']);
  assert.deepEqual(card.extensions, {
    talkativeness: 0.65,
    depth_prompt: {
      prompt: 'Remember the imported fixture source.',
      depth: 4,
    },
    ydltavern_fixture: true,
  });
  assert.equal(card.preserved.format, 'st_v2');
  assert.deepEqual(card.preserved.payload, fixture);
  assert.equal(asObject(card.preserved.payload)['fixture_unknown_top_level'], 'top-level unknown value');
  assert.deepEqual(asObject(asObject(card.preserved.payload)['data'])['fixture_unknown_data_field'], { preserve: true, note: 'must remain in raw payload' });
  assert.ok(asObject(asObject(card.preserved.payload)['data'])['character_book']);
  assert.deepEqual(card.diagnostics, []);
});

test('imports a V3-like JSON character card fixture and detects data spec version', async () => {
  const fixture = await readJsonFixture('character-v3.json');
  const card = importCharacterCard(fixture);

  assert.equal(card.kind, 'character_card');
  assert.equal(card.format, 'st_v3');
  assert.deepEqual(card.version, { spec: 'chara_card_v3', spec_version: '3.0' });
  assert.equal(card.name, 'Vega Fixture');
  assert.equal(card.first_mes, 'V3 fixture online.');
  assert.deepEqual(card.tags, ['fixture', 'v3', 'assets']);
  assert.equal(card.preserved.format, 'st_v3');
  assert.deepEqual(card.preserved.payload, fixture);
  assert.deepEqual(asObject(asObject(card.preserved.payload)['data'])['assets'], [
    {
      type: 'icon',
      uri: 'assets/vega-icon.png',
      mime: 'image/png',
      name: 'Vega Icon',
    },
    {
      type: 'avatar',
      uri: 'assets/vega-avatar.webp',
      mime: 'image/webp',
    },
  ]);
  assert.deepEqual(asObject(asObject(card.preserved.payload)['data'])['fixture_v3_unknown'], ['preserve', 'raw']);
  assert.deepEqual(card.diagnostics, []);
});

test('imports a world book fixture preserving key fields and raw entries', async () => {
  const fixture = await readJsonFixture('world-book.json');
  const book = importWorldBook(fixture);

  assert.equal(book.kind, 'world_book');
  assert.equal(book.name, 'Fixture World Book');
  assert.equal(book.entries.length, 2);
  assert.deepEqual(book.entries[0]?.keys, ['Aster', 'fixture']);
  assert.equal(book.entries[0]?.enabled, true);
  assert.equal(book.entries[0]?.position, 0);
  assert.equal(book.entries[0]?.order, 10);
  assert.equal(book.entries[0]?.depth, 3);
  assert.deepEqual(asObject(book.entries[0]?.preserved.payload)['secondary_key'], ['alignment']);
  assert.equal(asObject(book.entries[0]?.preserved.payload)['fixture_unknown_entry_field'], 'preserve me');
  assert.deepEqual(book.entries[1]?.keys, ['Vega', 'asset']);
  assert.equal(book.entries[1]?.enabled, false);
  assert.equal(book.entries[1]?.position, 'after_char');
  assert.equal(book.entries[1]?.order, 20);
  assert.equal(book.entries[1]?.depth, 5);
  assert.equal(book.entries[1]?.probability, 75);
  assert.equal(book.entries[1]?.constant, true);
  assert.deepEqual(asObject(book.entries[1]?.preserved.payload)['secondary_keys'], ['v3']);
  assert.deepEqual(book.preserved.payload, fixture);
  assert.deepEqual(asObject(book.preserved.payload)['fixture_unknown_top_level'], { preserve: true });
  assert.deepEqual(book.diagnostics, []);
});

test('imports JSONL chat fixture into Turn model with conservative raw extra preservation', async () => {
  const fixture = await readFile(join(fixturesDir, 'chat.jsonl'), 'utf8');
  const history = importChatHistory(fixture);

  assert.equal(history.kind, 'chat_history');
  assert.equal(history.chat.turns.length, 3);
  assert.equal(history.chat.turns[0]?.index, 0);
  assert.equal(history.chat.turns[0]?.role, 'system');
  assert.equal(history.chat.turns[0]?.speaker?.name, 'Narrator');
  assert.deepEqual(history.chat.turns[0]?.variants[0]?.subs[0], { kind: 'text', text: 'System fixture setup.' });
  assert.equal(history.chat.turns[1]?.index, 1);
  assert.equal(history.chat.turns[1]?.role, 'user');
  assert.equal(history.chat.turns[1]?.speaker?.name, 'User');
  assert.deepEqual(history.chat.turns[1]?.variants[0]?.subs[0], { kind: 'text', text: 'Can you inspect the fixture?' });
  assert.equal(history.chat.turns[2]?.index, 2);
  assert.equal(history.chat.turns[2]?.role, 'assistant');
  assert.equal(history.chat.turns[2]?.speaker?.name, 'Aster Fixture');
  assert.deepEqual(history.chat.turns[2]?.variants[0]?.subs[0], { kind: 'text', text: 'I preserved the raw fields.' });

  const userRaw = asObject(history.chat.turns[1]?.variants[0]?.meta.raw);
  assert.deepEqual(userRaw['swipes'], ['Can you inspect the fixture?', 'Please inspect the fixture.']);
  assert.deepEqual(asObject(userRaw['extra'])['reasoning'], 'User wants fixture coverage.');

  const assistantRaw = asObject(history.chat.turns[2]?.variants[0]?.meta.raw);
  const assistantExtra = asObject(assistantRaw['extra']);
  assert.equal(assistantExtra['reasoning'], 'Need to keep unknown data visible.');
  assert.deepEqual(assistantExtra['tool_invocations'], [{ id: 'call_fixture', name: 'inspect_fixture', arguments: { path: 'chat.jsonl' } }]);
  assert.deepEqual(assistantExtra['notes'], ['assistant note']);
  assert.deepEqual(assistantRaw['fixture_unknown_message_field'], { preserve: true });
  assert.ok(Array.isArray(history.preserved.payload));
  assert.deepEqual(history.diagnostics, []);
});

test('extracts PNG tEXt chara metadata without CRC validation', () => {
  const payload = { spec: 'chara_card_v2', data: { name: 'Png Aster', description: 'From PNG' } };
  const png = makeTinyPngWithText('chara', Buffer.from(JSON.stringify(payload), 'utf8').toString('base64'));
  const chunks = extractPngTextChunks(png);
  const card = importCharacterCard(png);

  assert.equal(chunks.length, 1);
  assert.equal(chunks[0]?.keyword, 'chara');
  assert.equal(card.name, 'Png Aster');
  assert.equal(card.format, 'png_st');
});

test('imports preset fixture preserving prompt_order, sampler, and raw fields', async () => {
  const fixture = await readJsonFixture('preset-openai.json');
  const preset = importPreset(fixture);

  assert.equal(preset.kind, 'preset');
  assert.equal(preset.format, 'openai');
  assert.equal(preset.name, 'Fixture OpenAI Preset');
  assert.deepEqual(preset.prompt_order, fixture['prompt_order']);
  assert.deepEqual(preset.sampler, asObject(fixture['sampler']));
  assert.deepEqual(preset.raw, fixture);
  assert.deepEqual(exportPreset(preset), fixture);
  assert.deepEqual(preset.diagnostics, []);
});

test('imports persona, theme, quick replies, regex scripts, and instruct presets', async () => {
  const personaFixture = await readJsonFixture('persona.json');
  const themeFixture = await readJsonFixture('theme.json');
  const quickFixture = await readJsonFixture('quick-replies.json');
  const regexFixture = await readJsonFixture('regex-scripts.json');
  const instructFixture = await readJsonFixture('instruct-preset.json');

  const persona = importPersona(personaFixture);
  assert.equal(persona.name, 'Fixture Persona');
  assert.equal(persona.description, 'Persona description fixture.');
  assert.equal(persona.avatar, 'persona.png');
  assert.deepEqual(persona.tags, ['fixture', 'persona']);
  assert.deepEqual(persona.extensions, { favorite_color: 'blue' });
  assert.deepEqual(persona.raw, personaFixture);

  const theme = importTheme(themeFixture);
  assert.equal(theme.name, 'Fixture Theme');
  assert.deepEqual(theme.vars, { '--SmartThemeBodyColor': '#101010' });
  assert.equal(theme.css, '.fixture { color: red; }');
  assert.equal(theme.background, 'bg/fixture.png');
  assert.deepEqual(theme.powerUser, { blur_strength: 8, movingUI: true });

  const quick = importQuickReplies(quickFixture);
  assert.equal(quick.sets.length, 1);
  assert.equal(quick.sets[0]?.name, 'Fixture QR');
  assert.equal(quick.sets[0]?.autoExecute, false);
  assert.deepEqual(quick.sets[0]?.links, ['linked-set']);
  assert.equal(quick.sets[0]?.items[0]?.label, 'Inspect');
  assert.equal(quick.sets[0]?.items[0]?.message, '/inspect');
  assert.equal(quick.sets[0]?.items[0]?.autoExecute, true);

  const regex = importRegexScripts(regexFixture);
  assert.deepEqual(regex.scripts.map((script) => script.scope), ['GLOBAL', 'PRESET', 'SCOPED']);
  assert.equal(regex.scripts[0]?.find, 'foo');
  assert.equal(regex.scripts[0]?.replace, 'bar');
  assert.equal(regex.scripts[0]?.flags, 'gi');
  assert.equal(regex.scripts[0]?.placement, 'prompt');

  const instruct = importInstructPreset(instructFixture);
  assert.equal(instruct.name, 'Fixture Instruct');
  assert.equal(instruct.system, '<|system|>');
  assert.equal(instruct.user, '<|user|>');
  assert.equal(instruct.assistant, '<|assistant|>');
  assert.equal(instruct.separator, '\n');
  assert.equal(instruct.wrap, true);
  assert.deepEqual(instruct.templates, { system: '{{system}}', user: '{{input}}' });
});

test('exports character, world book, and chat using preserved raw JSON shapes', async () => {
  const characterFixture = await readJsonFixture('character-v2.json');
  const worldFixture = await readJsonFixture('world-book.json');
  const chatFixture = await readFile(join(fixturesDir, 'chat.jsonl'), 'utf8');

  assert.deepEqual(exportCharacterCard(importCharacterCard(characterFixture)), characterFixture);
  assert.deepEqual(exportWorldBook(importWorldBook(worldFixture)), worldFixture);
  assert.deepEqual(exportChatHistory(importChatHistory(chatFixture)), chatFixture.trim().split(/\r?\n/u).map((line) => JSON.parse(line) as JsonObject));
});

function makeTinyPngWithText(keyword: string, text: string): Uint8Array {
  const signature = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const textBytes = Buffer.from(`${keyword}\0${text}`, 'latin1');
  const textChunk = makeChunk('tEXt', textBytes);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([signature, textChunk, iendChunk]);
}

function makeChunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBytes = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4); // The parser intentionally does not validate PNG CRC bytes.
  return Buffer.concat([length, typeBytes, data, crc]);
}

async function readJsonFixture(fileName: string): Promise<JsonObject> {
  const text = await readFile(join(fixturesDir, fileName), 'utf8');
  const parsed: unknown = JSON.parse(text);
  assert.ok(isJsonObject(parsed), `${fileName} must contain a JSON object`);
  return parsed;
}

function asObject(value: unknown): JsonObject {
  assert.ok(isJsonObject(value), 'expected JSON object');
  return value;
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
