import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CAPTION_SOURCE,
  DEFAULT_CAPTION_SETTINGS,
  planCaption,
  TTS_PROVIDERS,
  DEFAULT_TTS_SETTINGS,
  selectTtsSegments,
  planTtsNarration,
  TRANSLATE_PROVIDERS,
  DEFAULT_TRANSLATE_SETTINGS,
  planTranslate,
  shouldTranslateMessage,
  DEFAULT_EXPRESSIONS_SETTINGS,
  planClassifyExpression,
  SpriteCache,
  ATTACHMENT_SCOPE,
  DATABANK_SLASH_COMMANDS,
  DataBankStore,
  CONNECTION_PROFILE_FIELDS,
  snapshotConnectionProfile,
  applyConnectionProfilePlan,
  SD_TRIGGER,
  SD_BACKENDS,
  processSdTriggers,
  DEFAULT_GALLERY_SETTINGS,
} from '../dist/index.js';

// Caption
test('CAPTION_SOURCE has extras/local/horde/multimodal', () => {
  assert.equal(CAPTION_SOURCE.EXTRAS, 'extras');
  assert.equal(CAPTION_SOURCE.MULTIMODAL, 'multimodal');
});

test('planCaption maps source to endpoint and renders template when caption provided', () => {
  const plan = planCaption({
    settings: DEFAULT_CAPTION_SETTINGS,
    imageRef: 'data:image/png;base64,...',
    caption: 'a cat on a sofa',
    user: 'Alice',
    char: 'Bob',
  });
  assert.equal(plan.source, 'multimodal');
  assert.equal(plan.endpoint, '/api/multimodal/caption');
  assert.ok(plan.rendered.includes('Alice'));
  assert.ok(plan.rendered.includes('Bob'));
  assert.ok(plan.rendered.includes('a cat on a sofa'));
});

test('planCaption local source uses /api/extra/caption', () => {
  const plan = planCaption({
    settings: { ...DEFAULT_CAPTION_SETTINGS, source: 'local' },
    imageRef: 'x',
  });
  assert.equal(plan.endpoint, '/api/extra/caption');
});

// TTS
test('TTS_PROVIDERS includes major providers', () => {
  for (const p of ['System', 'ElevenLabs', 'OpenAI', 'Edge', 'XTTS']) {
    assert.ok(TTS_PROVIDERS.includes(p), `missing ${p}`);
  }
});

test('selectTtsSegments returns whole text when no filters', () => {
  const segs = selectTtsSegments('Hello world', DEFAULT_TTS_SETTINGS);
  assert.deepEqual([...segs], ['Hello world']);
});

test('selectTtsSegments by paragraphs splits on blank lines', () => {
  const segs = selectTtsSegments(
    'p1\np1 line 2\n\np2',
    { ...DEFAULT_TTS_SETTINGS, narrate_by_paragraphs: true },
  );
  assert.equal(segs.length, 2);
  assert.ok(segs[0].includes('p1'));
  assert.equal(segs[1], 'p2');
});

test('selectTtsSegments dialogues_only keeps quoted segments', () => {
  const segs = selectTtsSegments(
    '"hello" she said. "bye" he replied.',
    { ...DEFAULT_TTS_SETTINGS, narrate_dialogues_only: true },
  );
  assert.ok(segs[0].includes('"hello"'));
  assert.ok(segs[0].includes('"bye"'));
});

test('planTtsNarration returns empty when disabled', () => {
  const plan = planTtsNarration({
    settings: { ...DEFAULT_TTS_SETTINGS, enabled: false },
    messageId: 1,
    characterName: 'Alice',
    text: 'hi',
  });
  assert.deepEqual([...plan], []);
});

test('planTtsNarration skips user messages unless narrate_user', () => {
  const off = planTtsNarration({
    settings: { ...DEFAULT_TTS_SETTINGS, enabled: true, narrate_user: false },
    messageId: 1, characterName: 'U', text: 'hi', isUser: true,
  });
  assert.deepEqual([...off], []);

  const on = planTtsNarration({
    settings: { ...DEFAULT_TTS_SETTINGS, enabled: true, narrate_user: true },
    messageId: 1, characterName: 'U', text: 'hi', isUser: true,
  });
  assert.equal(on.length, 1);
});

test('planTtsNarration includes voiceId from voice_per_character', () => {
  const plan = planTtsNarration({
    settings: { ...DEFAULT_TTS_SETTINGS, enabled: true, voice_per_character: { Alice: 'voice-001' } },
    messageId: 1, characterName: 'Alice', text: 'hello',
  });
  assert.equal(plan[0].voiceId, 'voice-001');
});

// Translate
test('TRANSLATE_PROVIDERS includes deepl/google/libre/yandex/claude', () => {
  for (const p of ['deepl', 'google', 'libre', 'yandex', 'claude']) {
    assert.ok(TRANSLATE_PROVIDERS.includes(p), `missing ${p}`);
  }
});

test('planTranslate maps to /api/translate/<provider>', () => {
  const plan = planTranslate('hello', { ...DEFAULT_TRANSLATE_SETTINGS, provider: 'deepl', target_language: 'fr' });
  assert.equal(plan.endpoint, '/api/translate/deepl');
  assert.equal(plan.target, 'fr');
});

test('shouldTranslateMessage respects auto_mode', () => {
  assert.equal(shouldTranslateMessage({ ...DEFAULT_TRANSLATE_SETTINGS, auto_mode: 'off' }, 'incoming'), false);
  assert.equal(shouldTranslateMessage({ ...DEFAULT_TRANSLATE_SETTINGS, auto_mode: 'incoming' }, 'incoming'), true);
  assert.equal(shouldTranslateMessage({ ...DEFAULT_TRANSLATE_SETTINGS, auto_mode: 'incoming' }, 'outgoing'), false);
  assert.equal(shouldTranslateMessage({ ...DEFAULT_TRANSLATE_SETTINGS, auto_mode: 'both' }, 'outgoing'), true);
});

// Expressions
test('planClassifyExpression returns endpoint for classify api', () => {
  const plan = planClassifyExpression('She smiles warmly.', DEFAULT_EXPRESSIONS_SETTINGS);
  assert.equal(plan.api, 'classify');
  assert.equal(plan.endpoint, '/api/extra/classify');
  assert.equal(plan.fallback, 'neutral');
});

test('planClassifyExpression truncates text to 1000 chars', () => {
  const long = 'x'.repeat(2000);
  const plan = planClassifyExpression(long, DEFAULT_EXPRESSIONS_SETTINGS);
  assert.equal(plan.text.length, 1000);
});

test('SpriteCache stores and retrieves sprite lists', () => {
  const cache = new SpriteCache();
  cache.set('alice', ['neutral', 'happy', 'angry']);
  assert.deepEqual(cache.get('alice'), ['neutral', 'happy', 'angry']);
  cache.clear();
  assert.equal(cache.get('alice'), undefined);
});

// Attachments / Data Bank
test('ATTACHMENT_SCOPE has global/character/chat', () => {
  assert.equal(ATTACHMENT_SCOPE.GLOBAL, 'global');
  assert.equal(ATTACHMENT_SCOPE.CHARACTER, 'character');
  assert.equal(ATTACHMENT_SCOPE.CHAT, 'chat');
});

test('DATABANK_SLASH_COMMANDS includes both /databank- and /data-bank- aliases', () => {
  assert.ok(DATABANK_SLASH_COMMANDS.includes('databank-list'));
  assert.ok(DATABANK_SLASH_COMMANDS.includes('data-bank-list'));
  assert.ok(DATABANK_SLASH_COMMANDS.includes('databank-add'));
  assert.ok(DATABANK_SLASH_COMMANDS.includes('databank-disable'));
});

test('DataBankStore add/list/remove by scope', () => {
  const store = new DataBankStore();
  store.add({ id: 'a1', url: 'u', name: 'a', scope: 'global', size: 100 });
  store.add({ id: 'b1', url: 'u', name: 'b', scope: 'character', size: 100 });
  store.add({ id: 'c1', url: 'u', name: 'c', scope: 'chat', size: 100 });
  assert.equal(store.list().length, 3);
  assert.equal(store.list('character').length, 1);
  assert.equal(store.remove('character', 'b1'), true);
  assert.equal(store.list('character').length, 0);
});

test('DataBankStore setEnabled toggles disabled flag', () => {
  const store = new DataBankStore();
  store.add({ id: 'a1', url: 'u', name: 'a', scope: 'global', size: 100 });
  store.setEnabled('global', 'a1', false);
  assert.equal(store.get('global', 'a1').disabled, true);
  store.setEnabled('global', 'a1', true);
  assert.equal(store.get('global', 'a1').disabled, false);
});

test('DataBankStore update applies partial patch', () => {
  const store = new DataBankStore();
  store.add({ id: 'a1', url: 'u', name: 'orig', scope: 'global', size: 100 });
  store.update('global', 'a1', { name: 'updated', text: 'extracted' });
  assert.equal(store.get('global', 'a1').name, 'updated');
  assert.equal(store.get('global', 'a1').text, 'extracted');
});

// Connection Manager
test('CONNECTION_PROFILE_FIELDS includes core ST profile fields', () => {
  for (const f of ['mode', 'api', 'preset', 'model', 'instruct', 'context', 'tokenizer', 'sysprompt']) {
    assert.ok(CONNECTION_PROFILE_FIELDS.includes(f), `missing ${f}`);
  }
});

test('snapshotConnectionProfile reads current state into a profile', () => {
  const { profile } = snapshotConnectionProfile(
    {
      mode: 'cc',
      api: 'openai',
      preset: 'default',
      model: 'gpt-4o',
      sysprompt: 'You are X',
    },
    { name: 'My profile' },
  );
  assert.equal(profile.mode, 'cc');
  assert.equal(profile.api, 'openai');
  assert.equal(profile.preset, 'default');
  assert.equal(profile.model, 'gpt-4o');
  assert.equal(profile.sysprompt, 'You are X');
  assert.equal(profile.name, 'My profile');
});

test('snapshotConnectionProfile honors exclude list', () => {
  const { profile } = snapshotConnectionProfile(
    { mode: 'cc', api: 'openai', model: 'gpt-4o' },
    { name: 'p', exclude: ['model'] },
  );
  assert.equal(profile.api, 'openai');
  assert.equal(profile.model, undefined);
});

test('applyConnectionProfilePlan emits ordered command list', () => {
  const profile = {
    id: 'p1',
    name: 'p',
    mode: 'cc',
    api: 'openai',
    preset: 'default',
    model: 'gpt-4o',
  };
  const plan = applyConnectionProfilePlan(profile);
  const commands = plan.map((p) => p.command);
  assert.ok(commands.includes('mode'));
  assert.ok(commands.includes('api'));
  assert.ok(commands.includes('preset'));
  assert.ok(commands.includes('model'));
});

test('applyConnectionProfilePlan respects exclude', () => {
  const profile = {
    id: 'p1',
    name: 'p',
    mode: 'cc',
    api: 'openai',
    model: 'gpt-4o',
    exclude: ['model'],
  };
  const plan = applyConnectionProfilePlan(profile);
  const commands = plan.map((p) => p.command);
  assert.equal(commands.includes('model'), false);
  assert.ok(commands.includes('api'));
});

// Stable Diffusion
test('SD_TRIGGER and SD_BACKENDS expose ST canonical sets', () => {
  assert.equal(SD_TRIGGER.CHARACTER, 'character');
  assert.ok(SD_BACKENDS.includes('automatic1111'));
  assert.ok(SD_BACKENDS.includes('comfy'));
  assert.ok(SD_BACKENDS.includes('novelai'));
});

test('processSdTriggers detects "draws an image of X"', () => {
  const r = processSdTriggers({ text: 'She draws an image of a sunset over mountains.' });
  assert.equal(r.trigger, 'character');
  assert.ok(r.subject.includes('sunset'));
});

test('processSdTriggers returns no trigger for empty/no-match text', () => {
  assert.equal(processSdTriggers({ text: '' }).trigger, undefined);
  assert.equal(processSdTriggers({ text: 'plain text' }).trigger, undefined);
});

// Gallery
test('DEFAULT_GALLERY_SETTINGS has folders and sort', () => {
  assert.deepEqual(DEFAULT_GALLERY_SETTINGS.folders, {});
  assert.equal(DEFAULT_GALLERY_SETTINGS.sort, 'desc');
});
