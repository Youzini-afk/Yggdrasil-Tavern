import { runBench } from './_harness.mjs';
import { importCharacterCard, importWorldBook, importChatHistory } from '../dist/src/index.js';
import { smallPng, largePng } from './fixtures/png.mjs';
import { smallWorldBook, largeWorldBook } from './fixtures/world-book.mjs';
import { smallChatJsonl, largeChatJsonl } from './fixtures/jsonl.mjs';

await runBench('@ydltavern/importers', [
  { name: 'import.character.png.small', fn: () => importCharacterCard(smallPng) },
  { name: 'import.character.png.large', fn: () => importCharacterCard(largePng) },
  { name: 'import.world_book.small', fn: () => importWorldBook(smallWorldBook) },
  { name: 'import.world_book.large', fn: () => importWorldBook(largeWorldBook) },
  { name: 'import.jsonl.small', fn: () => importChatHistory(smallChatJsonl) },
  { name: 'import.jsonl.large', fn: () => importChatHistory(largeChatJsonl) },
]);
