import assert from 'node:assert/strict';
import test from 'node:test';

import { routePromptMessages } from '../dist/index.js';

test('prompt routing reports WI buckets and builds preview messages', () => {
  const buckets = {
    before: [],
    after: [],
    atDepth: [],
    ANTop: ['top note'],
    ANBottom: [],
    EMTop: [],
    EMBottom: [],
    outlet: [],
    examples: [],
    em: [{ position: 'before', content: 'example', entryId: 'em1', order: 1 }],
    depthEntries: [{
      depth: 1,
      role: 'system',
      content: ['deep lore'],
      entries: [{ content: 'deep lore', entryId: 'd1', order: 2, position: 'atDepth', depth: 1, role: 'system' }],
    }],
    anTop: ['top note'],
    anBottom: [],
    anPatch: { top: ['top note'], original: 'original note', bottom: [], patched: 'top note\noriginal note' },
    outlets: { card: { content: ['outlet text'], entries: [{ content: 'outlet text', entryId: 'o1', order: 3, position: 'outlet', outletName: 'card' }] } },
  };

  const result = routePromptMessages([{ role: 'user', content: 'hello' }], buckets);

  assert.deepEqual(result.diagnostics.map((item) => item.route), ['authorNote', 'authorNote', 'atDepth', 'em', 'outlet']);
  assert.deepEqual(result.messagesPreview.map((message) => message.content), [
    'example',
    'deep lore',
    'hello',
    'top note\noriginal note',
    '[outlet:card]\noutlet text',
  ]);
});
