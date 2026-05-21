import assert from 'node:assert/strict';
import { test } from 'node:test';

import { extractPngTextChunks, importCharacterCard, importChatHistory, importWorldBook } from '../src/index.js';

test('imports a V2 JSON character card', () => {
  const card = importCharacterCard({
    spec: 'chara_card_v2',
    spec_version: '2.0',
    data: {
      name: 'Aster',
      description: 'A helpful test character.',
      personality: 'Warm',
      scenario: 'Testing',
      first_mes: 'Hello!',
      mes_example: '<START>',
      creator_notes: 'Created for tests.',
      tags: ['test', 'v2'],
      extensions: { ydltavern: true },
    },
  });

  assert.equal(card.kind, 'character_card');
  assert.equal(card.format, 'st_v2');
  assert.equal(card.name, 'Aster');
  assert.equal(card.first_mes, 'Hello!');
  assert.deepEqual(card.tags, ['test', 'v2']);
  assert.equal(card.preserved.format, 'st_v2');
});

test('imports a world book with two entries', () => {
  const book = importWorldBook({
    name: 'Test Lore',
    entries: [
      { key: ['alpha'], comment: 'A', content: 'Alpha content', disable: false, order: 10 },
      { keys: ['beta', 'gamma'], content: 'Beta content', enabled: false, position: 1, probability: 50, depth: 4, selective: true, constant: false },
    ],
  });

  assert.equal(book.kind, 'world_book');
  assert.equal(book.entries.length, 2);
  assert.deepEqual(book.entries[0]?.keys, ['alpha']);
  assert.equal(book.entries[0]?.enabled, true);
  assert.deepEqual(book.entries[1]?.keys, ['beta', 'gamma']);
  assert.equal(book.entries[1]?.enabled, false);
  assert.equal(book.entries[1]?.depth, 4);
});

test('imports JSONL chat history into Turn model', () => {
  const history = importChatHistory('{"name":"User","is_user":true,"mes":"Hi"}\n{"name":"Bot","is_user":false,"mes":"Hello","extra":{"mood":"ok"}}');

  assert.equal(history.kind, 'chat_history');
  assert.equal(history.chat.turns.length, 2);
  assert.equal(history.chat.turns[0]?.role, 'user');
  assert.equal(history.chat.turns[1]?.role, 'assistant');
  assert.equal(history.chat.turns[1]?.variants[0]?.subs[0]?.kind, 'text');
  assert.deepEqual(history.chat.turns[1]?.variants[0]?.subs[0], { kind: 'text', text: 'Hello' });
  assert.deepEqual(history.chat.turns[1]?.variants[0]?.meta.raw, { name: 'Bot', is_user: false, extra: { mood: 'ok' } });
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
