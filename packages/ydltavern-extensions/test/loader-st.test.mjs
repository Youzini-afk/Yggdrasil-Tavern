import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ST_EXTENSION_HOOK_NAMES,
  parseSTManifest,
  isActivationEligible,
  sortByActivationOrder,
  buildLoadPlan,
  planHookDispatch,
  STDisabledExtensionsStore,
  planActivateAll,
} from '../dist/index.js';

// ---------------------------------------------------------------------------
// parseSTManifest

test('parseSTManifest accepts minimal valid manifest with display_name', () => {
  const result = parseSTManifest({ display_name: 'My Extension' });
  assert.equal(result.errors.length, 0);
  assert.ok(result.manifest);
  assert.equal(result.manifest.display_name, 'My Extension');
});

test('parseSTManifest rejects null input', () => {
  const result = parseSTManifest(null);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /must be a JSON object/);
  assert.equal(result.manifest, undefined);
});

test('parseSTManifest rejects array input', () => {
  const result = parseSTManifest([{ display_name: 'X' }]);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /must be a JSON object/);
});

test('parseSTManifest rejects primitive input', () => {
  for (const val of [42, 'string', true]) {
    const result = parseSTManifest(val);
    assert.equal(result.errors.length, 1, `should reject ${typeof val}`);
    assert.match(result.errors[0], /must be a JSON object/);
  }
});

test('parseSTManifest reports missing display_name as error', () => {
  const result = parseSTManifest({ js: 'index.js' });
  assert.ok(result.errors.some(e => e.includes('missing required field: display_name')));
});

test('parseSTManifest reports non-string display_name as error', () => {
  const result = parseSTManifest({ display_name: 123 });
  assert.ok(result.errors.some(e => e.includes('display_name must be a non-empty string')));
});

test('parseSTManifest reports empty display_name as error', () => {
  const result = parseSTManifest({ display_name: '   ' });
  assert.ok(result.errors.some(e => e.includes('display_name must be a non-empty string')));
});

test('parseSTManifest reports non-number loading_order as error', () => {
  const result = parseSTManifest({ display_name: 'X', loading_order: 'high' });
  assert.ok(result.errors.some(e => e.includes('loading_order must be a number')));
});

test('parseSTManifest reports non-string-array requires as error', () => {
  const result = parseSTManifest({ display_name: 'X', requires: [1, 2] });
  assert.ok(result.errors.some(e => e.includes('requires must be an array of strings')));
});

test('parseSTManifest reports non-string-array optional as error', () => {
  const result = parseSTManifest({ display_name: 'X', optional: true });
  assert.ok(result.errors.some(e => e.includes('optional must be an array of strings')));
});

test('parseSTManifest reports non-string-array dependencies as error', () => {
  const result = parseSTManifest({ display_name: 'X', dependencies: 'other-ext' });
  assert.ok(result.errors.some(e => e.includes('dependencies must be an array of strings')));
});

test('parseSTManifest reports non-object hooks as error', () => {
  const result = parseSTManifest({ display_name: 'X', hooks: 'activate' });
  assert.ok(result.errors.some(e => e.includes('hooks must be an object')));
});

test('parseSTManifest reports null hooks as error', () => {
  const result = parseSTManifest({ display_name: 'X', hooks: null });
  assert.ok(result.errors.some(e => e.includes('hooks must be an object')));
});

test('parseSTManifest reports non-object i18n as error', () => {
  const result = parseSTManifest({ display_name: 'X', i18n: 'en' });
  assert.ok(result.errors.some(e => e.includes('i18n must be an object')));
});

test('parseSTManifest warns on unknown manifest fields', () => {
  const result = parseSTManifest({ display_name: 'X', unknown_field: true, another_unknown: 42 });
  assert.equal(result.warnings.length, 2);
  assert.ok(result.warnings.some(w => w.includes('unknown_field')));
  assert.ok(result.warnings.some(w => w.includes('another_unknown')));
});

test('parseSTManifest returns parsed manifest when no errors', () => {
  const raw = {
    display_name: 'Full',
    loading_order: 5,
    requires: ['extras1'],
    optional: ['extras2'],
    dependencies: ['dep1'],
    js: 'main.js',
    css: 'style.css',
    hooks: { activate: 'doActivate' },
    i18n: { en: 'en.json' },
    generate_interceptor: 'myInterceptor',
    author: 'dev',
    version: '1.0.0',
  };
  const result = parseSTManifest(raw);
  assert.equal(result.errors.length, 0);
  assert.equal(result.manifest.display_name, 'Full');
  assert.equal(result.manifest.loading_order, 5);
  assert.deepEqual(result.manifest.requires, ['extras1']);
  assert.deepEqual(result.manifest.dependencies, ['dep1']);
  assert.equal(result.manifest.generate_interceptor, 'myInterceptor');
});

// ---------------------------------------------------------------------------
// isActivationEligible

test('isActivationEligible: eligible when no requirements', () => {
  const decision = isActivationEligible('ext-a', { display_name: 'A' }, {
    installedExtras: new Set(),
    installedExtensions: new Set(),
    disabledExtensions: new Set(),
    clientVersion: '1.0.0',
  });
  assert.equal(decision.eligible, true);
  assert.equal(decision.reasons.length, 0);
});

test('isActivationEligible: ineligible when in disabledExtensions (reason: user-disabled)', () => {
  const decision = isActivationEligible('ext-a', { display_name: 'A' }, {
    installedExtras: new Set(),
    installedExtensions: new Set(),
    disabledExtensions: new Set(['ext-a']),
    clientVersion: '1.0.0',
  });
  assert.equal(decision.eligible, false);
  assert.deepEqual(decision.reasons, ['user-disabled']);
});

test('isActivationEligible: ineligible when missing required Extras module', () => {
  const decision = isActivationEligible('ext-a', { display_name: 'A', requires: ['translate'] }, {
    installedExtras: new Set(['tts']),
    installedExtensions: new Set(),
    disabledExtensions: new Set(),
    clientVersion: '1.0.0',
  });
  assert.equal(decision.eligible, false);
  assert.ok(decision.reasons.some(r => r.includes('missing extras module')));
  assert.ok(decision.reasons.some(r => r.includes('translate')));
});

test('isActivationEligible: ineligible when dependency not installed', () => {
  const decision = isActivationEligible('ext-a', { display_name: 'A', dependencies: ['ext-b'] }, {
    installedExtras: new Set(),
    installedExtensions: new Set(),
    disabledExtensions: new Set(),
    clientVersion: '1.0.0',
  });
  assert.equal(decision.eligible, false);
  assert.ok(decision.reasons.some(r => r.includes('missing dependency')));
  assert.ok(decision.reasons.some(r => r.includes('ext-b')));
});

test('isActivationEligible: ineligible when dependency present but disabled', () => {
  const decision = isActivationEligible('ext-a', { display_name: 'A', dependencies: ['ext-b'] }, {
    installedExtras: new Set(),
    installedExtensions: new Set(['ext-b']),
    disabledExtensions: new Set(['ext-b']),
    clientVersion: '1.0.0',
  });
  assert.equal(decision.eligible, false);
  assert.ok(decision.reasons.some(r => r.includes('dependency disabled')));
  assert.ok(decision.reasons.some(r => r.includes('ext-b')));
});

test('isActivationEligible: ineligible when minimum_client_version > current', () => {
  const decision = isActivationEligible('ext-a', { display_name: 'A', minimum_client_version: '2.0.0' }, {
    installedExtras: new Set(),
    installedExtensions: new Set(),
    disabledExtensions: new Set(),
    clientVersion: '1.5.0',
  });
  assert.equal(decision.eligible, false);
  assert.ok(decision.reasons.some(r => r.includes('< required')));
});

test('isActivationEligible: eligible when minimum_client_version <= current', () => {
  const decision = isActivationEligible('ext-a', { display_name: 'A', minimum_client_version: '1.0.0' }, {
    installedExtras: new Set(),
    installedExtensions: new Set(),
    disabledExtensions: new Set(),
    clientVersion: '1.5.0',
  });
  assert.equal(decision.eligible, true);
});

test('isActivationEligible: eligible when minimum_client_version equals current', () => {
  const decision = isActivationEligible('ext-a', { display_name: 'A', minimum_client_version: '1.5.0' }, {
    installedExtras: new Set(),
    installedExtensions: new Set(),
    disabledExtensions: new Set(),
    clientVersion: '1.5.0',
  });
  assert.equal(decision.eligible, true);
});

// ---------------------------------------------------------------------------
// sortByActivationOrder

test('sortByActivationOrder sorts by loading_order ascending', () => {
  const records = [
    { id: 'c', manifest: { display_name: 'C', loading_order: 300 } },
    { id: 'a', manifest: { display_name: 'A', loading_order: 100 } },
    { id: 'b', manifest: { display_name: 'B', loading_order: 200 } },
  ];
  const sorted = sortByActivationOrder(records);
  assert.equal(sorted[0].id, 'a');
  assert.equal(sorted[1].id, 'b');
  assert.equal(sorted[2].id, 'c');
});

test('sortByActivationOrder: same loading_order sorted by display_name ascending', () => {
  const records = [
    { id: 'c', manifest: { display_name: 'Gamma', loading_order: 100 } },
    { id: 'a', manifest: { display_name: 'Alpha', loading_order: 100 } },
    { id: 'b', manifest: { display_name: 'Beta', loading_order: 100 } },
  ];
  const sorted = sortByActivationOrder(records);
  assert.equal(sorted[0].id, 'a');
  assert.equal(sorted[1].id, 'b');
  assert.equal(sorted[2].id, 'c');
});

test('sortByActivationOrder: default loading_order=1000 when missing', () => {
  const records = [
    { id: 'low', manifest: { display_name: 'Low', loading_order: 500 } },
    { id: 'default', manifest: { display_name: 'AAA' } },
    { id: 'high', manifest: { display_name: 'High', loading_order: 1500 } },
  ];
  const sorted = sortByActivationOrder(records);
  assert.equal(sorted[0].id, 'low');
  assert.equal(sorted[1].id, 'default');
  assert.equal(sorted[2].id, 'high');
});

test('sortByActivationOrder does not mutate original array', () => {
  const records = [
    { id: 'b', manifest: { display_name: 'B', loading_order: 200 } },
    { id: 'a', manifest: { display_name: 'A', loading_order: 100 } },
  ];
  const sorted = sortByActivationOrder(records);
  assert.equal(records[0].id, 'b');
  assert.equal(sorted[0].id, 'a');
});

// ---------------------------------------------------------------------------
// buildLoadPlan

test('buildLoadPlan emits add_locale step when i18n[currentLocale] exists', () => {
  const plan = buildLoadPlan({
    id: 'ext-a',
    manifest: { display_name: 'A', i18n: { en: 'locales/en.json' } },
    basePath: '/scripts/extensions/ext-a',
    currentLocale: 'en',
  });
  const localeStep = plan.steps.find(s => s.kind === 'add_locale');
  assert.ok(localeStep);
  assert.equal(localeStep.data.locale, 'en');
  assert.ok(localeStep.data.file.includes('/scripts/extensions/ext-a/locales/en.json'));
});

test('buildLoadPlan: no add_locale when locale not declared', () => {
  const plan = buildLoadPlan({
    id: 'ext-a',
    manifest: { display_name: 'A', i18n: { en: 'locales/en.json' } },
    basePath: '/scripts/extensions/ext-a',
    currentLocale: 'fr',
  });
  assert.equal(plan.steps.find(s => s.kind === 'add_locale'), undefined);
});

test('buildLoadPlan: no add_locale when no i18n field', () => {
  const plan = buildLoadPlan({
    id: 'ext-a',
    manifest: { display_name: 'A' },
    basePath: '/scripts/extensions/ext-a',
    currentLocale: 'en',
  });
  assert.equal(plan.steps.find(s => s.kind === 'add_locale'), undefined);
});

test('buildLoadPlan emits add_script step when js declared', () => {
  const plan = buildLoadPlan({
    id: 'ext-a',
    manifest: { display_name: 'A', js: 'index.js' },
    basePath: '/scripts/extensions/ext-a',
  });
  const scriptStep = plan.steps.find(s => s.kind === 'add_script');
  assert.ok(scriptStep);
  assert.equal(scriptStep.data.src, '/scripts/extensions/ext-a/index.js');
  assert.equal(scriptStep.data.type, 'module');
});

test('buildLoadPlan emits add_style step when css declared', () => {
  const plan = buildLoadPlan({
    id: 'ext-a',
    manifest: { display_name: 'A', css: 'style.css' },
    basePath: '/scripts/extensions/ext-a',
  });
  const styleStep = plan.steps.find(s => s.kind === 'add_style');
  assert.ok(styleStep);
  assert.equal(styleStep.data.href, '/scripts/extensions/ext-a/style.css');
});

test('buildLoadPlan emits register_interceptor when generate_interceptor declared', () => {
  const plan = buildLoadPlan({
    id: 'ext-a',
    manifest: { display_name: 'A', generate_interceptor: 'myInterceptor' },
    basePath: '/scripts/extensions/ext-a',
  });
  const interceptorStep = plan.steps.find(s => s.kind === 'register_interceptor');
  assert.ok(interceptorStep);
  assert.equal(interceptorStep.data.name, 'myInterceptor');
});

test('buildLoadPlan emits call_hook for activate hook when hooks.activate set', () => {
  const plan = buildLoadPlan({
    id: 'ext-a',
    manifest: { display_name: 'A', hooks: { activate: 'doActivate' } },
    basePath: '/scripts/extensions/ext-a',
  });
  const hookStep = plan.steps.find(s => s.kind === 'call_hook');
  assert.ok(hookStep);
  assert.equal(hookStep.data.hook, 'activate');
  assert.equal(hookStep.data.export, 'doActivate');
});

test('buildLoadPlan emits mark_active step at end', () => {
  const plan = buildLoadPlan({
    id: 'ext-a',
    manifest: { display_name: 'A' },
    basePath: '/scripts/extensions/ext-a',
  });
  const lastStep = plan.steps[plan.steps.length - 1];
  assert.equal(lastStep.kind, 'mark_active');
  assert.equal(lastStep.data.id, 'ext-a');
});

test('buildLoadPlan steps appear in correct order: locale → script → style → interceptor → hook → mark_active', () => {
  const plan = buildLoadPlan({
    id: 'ext-a',
    manifest: {
      display_name: 'A',
      i18n: { en: 'en.json' },
      js: 'main.js',
      css: 'style.css',
      generate_interceptor: 'intercept',
      hooks: { activate: 'activateFn' },
    },
    basePath: '/ext/a',
    currentLocale: 'en',
  });
  const kinds = plan.steps.map(s => s.kind);
  assert.deepEqual(kinds, [
    'add_locale',
    'add_script',
    'add_style',
    'register_interceptor',
    'call_hook',
    'mark_active',
  ]);
});

test('buildLoadPlan step paths use basePath prefix correctly', () => {
  const plan = buildLoadPlan({
    id: 'my-ext',
    manifest: { display_name: 'My', js: 'app.js', css: 'app.css' },
    basePath: '/custom/path/my-ext',
  });
  const scriptStep = plan.steps.find(s => s.kind === 'add_script');
  const styleStep = plan.steps.find(s => s.kind === 'add_style');
  assert.equal(scriptStep.data.src, '/custom/path/my-ext/app.js');
  assert.equal(styleStep.data.href, '/custom/path/my-ext/app.css');
});

// ---------------------------------------------------------------------------
// planHookDispatch

test('planHookDispatch returns snapshots only for extensions declaring the hook export', () => {
  const records = [
    { id: 'ext-a', manifest: { display_name: 'A', hooks: { activate: 'activateA' } } },
    { id: 'ext-b', manifest: { display_name: 'B' } },
    { id: 'ext-c', manifest: { display_name: 'C', hooks: { activate: 'activateC', disable: 'disableC' } } },
  ];
  const snapshots = planHookDispatch('activate', records);
  assert.equal(snapshots.length, 2);
  assert.equal(snapshots[0].id, 'ext-a');
  assert.equal(snapshots[0].hookExport, 'activateA');
  assert.equal(snapshots[1].id, 'ext-c');
  assert.equal(snapshots[1].hookExport, 'activateC');
});

test('planHookDispatch empty when no extensions have the hook', () => {
  const records = [
    { id: 'ext-a', manifest: { display_name: 'A' } },
    { id: 'ext-b', manifest: { display_name: 'B', hooks: { disable: 'doDisable' } } },
  ];
  const snapshots = planHookDispatch('activate', records);
  assert.equal(snapshots.length, 0);
});

test('planHookDispatch preserves order from input array', () => {
  const records = [
    { id: 'c', manifest: { display_name: 'C', hooks: { enable: 'enableC' } } },
    { id: 'a', manifest: { display_name: 'A', hooks: { enable: 'enableA' } } },
    { id: 'b', manifest: { display_name: 'B', hooks: { enable: 'enableB' } } },
  ];
  const snapshots = planHookDispatch('enable', records);
  assert.equal(snapshots[0].id, 'c');
  assert.equal(snapshots[1].id, 'a');
  assert.equal(snapshots[2].id, 'b');
});

test('planHookDispatch skips hook with empty string export', () => {
  const records = [
    { id: 'ext-a', manifest: { display_name: 'A', hooks: { activate: '' } } },
    { id: 'ext-b', manifest: { display_name: 'B', hooks: { activate: 'realHook' } } },
  ];
  const snapshots = planHookDispatch('activate', records);
  assert.equal(snapshots.length, 1);
  assert.equal(snapshots[0].id, 'ext-b');
});

// ---------------------------------------------------------------------------
// STDisabledExtensionsStore

test('STDisabledExtensionsStore initial seeding from constructor', () => {
  const store = new STDisabledExtensionsStore(['a', 'b']);
  assert.equal(store.isDisabled('a'), true);
  assert.equal(store.isDisabled('b'), true);
  assert.equal(store.isDisabled('c'), false);
});

test('STDisabledExtensionsStore empty by default', () => {
  const store = new STDisabledExtensionsStore();
  assert.equal(store.isDisabled('anything'), false);
});

test('STDisabledExtensionsStore isDisabled true after disable', () => {
  const store = new STDisabledExtensionsStore();
  store.disable('ext-x');
  assert.equal(store.isDisabled('ext-x'), true);
});

test('STDisabledExtensionsStore isDisabled false after enable', () => {
  const store = new STDisabledExtensionsStore(['ext-x']);
  assert.equal(store.isDisabled('ext-x'), true);
  store.enable('ext-x');
  assert.equal(store.isDisabled('ext-x'), false);
});

test('STDisabledExtensionsStore list() returns array', () => {
  const store = new STDisabledExtensionsStore(['b', 'a']);
  const listed = store.list();
  assert.ok(Array.isArray(listed));
  assert.equal(listed.length, 2);
  assert.ok(listed.includes('a'));
  assert.ok(listed.includes('b'));
});

test('STDisabledExtensionsStore serialize() returns array', () => {
  const store = new STDisabledExtensionsStore(['x']);
  store.disable('y');
  const serialized = store.serialize();
  assert.ok(Array.isArray(serialized));
  assert.equal(serialized.length, 2);
  assert.ok(serialized.includes('x'));
  assert.ok(serialized.includes('y'));
});

// ---------------------------------------------------------------------------
// planActivateAll

test('planActivateAll activates eligible extensions in loading_order', () => {
  const records = [
    { id: 'ext-b', manifest: { display_name: 'B', loading_order: 200 } },
    { id: 'ext-a', manifest: { display_name: 'A', loading_order: 100 } },
  ];
  const plan = planActivateAll({
    records,
    ctx: {
      installedExtras: new Set(),
      installedExtensions: new Set(),
      disabledExtensions: new Set(),
      clientVersion: '1.0.0',
    },
    basePath: (id) => `/ext/${id}`,
  });
  assert.equal(plan.activated.length, 2);
  assert.equal(plan.activated[0].id, 'ext-a');
  assert.equal(plan.activated[1].id, 'ext-b');
  assert.equal(plan.skipped.length, 0);
});

test('planActivateAll skips ineligible with reasons preserved', () => {
  const records = [
    { id: 'ext-a', manifest: { display_name: 'A' } },
    { id: 'ext-b', manifest: { display_name: 'B', requires: ['nonexistent'] } },
  ];
  const plan = planActivateAll({
    records,
    ctx: {
      installedExtras: new Set(),
      installedExtensions: new Set(),
      disabledExtensions: new Set(),
      clientVersion: '1.0.0',
    },
    basePath: (id) => `/ext/${id}`,
  });
  assert.equal(plan.activated.length, 1);
  assert.equal(plan.activated[0].id, 'ext-a');
  assert.equal(plan.skipped.length, 1);
  assert.equal(plan.skipped[0].id, 'ext-b');
  assert.ok(plan.skipped[0].reasons.some(r => r.includes('missing extras module')));
});

test('planActivateAll tracks dependency satisfaction as pipeline progresses', () => {
  // ext-a depends on ext-b; ext-b has lower loading_order so it activates first
  const records = [
    { id: 'ext-a', manifest: { display_name: 'A', loading_order: 200, dependencies: ['ext-b'] } },
    { id: 'ext-b', manifest: { display_name: 'B', loading_order: 100 } },
  ];
  const plan = planActivateAll({
    records,
    ctx: {
      installedExtras: new Set(),
      installedExtensions: new Set(),
      disabledExtensions: new Set(),
      clientVersion: '1.0.0',
    },
    basePath: (id) => `/ext/${id}`,
  });
  // ext-b activates first (lower loading_order), then ext-a sees ext-b as installed
  assert.equal(plan.activated.length, 2);
  assert.equal(plan.activated[0].id, 'ext-b');
  assert.equal(plan.activated[1].id, 'ext-a');
  assert.equal(plan.skipped.length, 0);
});

test('planActivateAll dependency fails when dep has higher loading_order', () => {
  // ext-a depends on ext-b; but ext-a has lower loading_order so it runs first
  const records = [
    { id: 'ext-a', manifest: { display_name: 'A', loading_order: 100, dependencies: ['ext-b'] } },
    { id: 'ext-b', manifest: { display_name: 'B', loading_order: 200 } },
  ];
  const plan = planActivateAll({
    records,
    ctx: {
      installedExtras: new Set(),
      installedExtensions: new Set(),
      disabledExtensions: new Set(),
      clientVersion: '1.0.0',
    },
    basePath: (id) => `/ext/${id}`,
  });
  assert.equal(plan.activated.length, 1);
  assert.equal(plan.activated[0].id, 'ext-b');
  assert.equal(plan.skipped.length, 1);
  assert.equal(plan.skipped[0].id, 'ext-a');
  assert.ok(plan.skipped[0].reasons.some(r => r.includes('missing dependency')));
});

test('planActivateAll returns hookFailures empty array initially', () => {
  const plan = planActivateAll({
    records: [{ id: 'ext-a', manifest: { display_name: 'A' } }],
    ctx: {
      installedExtras: new Set(),
      installedExtensions: new Set(),
      disabledExtensions: new Set(),
      clientVersion: '1.0.0',
    },
    basePath: (id) => `/ext/${id}`,
  });
  assert.ok(Array.isArray(plan.hookFailures));
  assert.equal(plan.hookFailures.length, 0);
});

test('planActivateAll passes currentLocale to buildLoadPlan', () => {
  const records = [
    { id: 'ext-a', manifest: { display_name: 'A', i18n: { en: 'en.json' } } },
  ];
  const plan = planActivateAll({
    records,
    ctx: {
      installedExtras: new Set(),
      installedExtensions: new Set(),
      disabledExtensions: new Set(),
      clientVersion: '1.0.0',
    },
    basePath: (id) => `/ext/${id}`,
    currentLocale: 'en',
  });
  assert.equal(plan.activated.length, 1);
  const localeStep = plan.activated[0].steps.find(s => s.kind === 'add_locale');
  assert.ok(localeStep, 'should have add_locale step when currentLocale matches i18n');
});

test('planActivateAll uses basePath function for each extension', () => {
  const records = [
    { id: 'ext-a', manifest: { display_name: 'A', js: 'app.js' } },
    { id: 'ext-b', manifest: { display_name: 'B', js: 'app.js' } },
  ];
  const plan = planActivateAll({
    records,
    ctx: {
      installedExtras: new Set(),
      installedExtensions: new Set(),
      disabledExtensions: new Set(),
      clientVersion: '1.0.0',
    },
    basePath: (id) => `/custom/${id}`,
  });
  const aScript = plan.activated.find(p => p.id === 'ext-a').steps.find(s => s.kind === 'add_script');
  const bScript = plan.activated.find(p => p.id === 'ext-b').steps.find(s => s.kind === 'add_script');
  assert.equal(aScript.data.src, '/custom/ext-a/app.js');
  assert.equal(bScript.data.src, '/custom/ext-b/app.js');
});

// ---------------------------------------------------------------------------
// ST_EXTENSION_HOOK_NAMES

test('ST_EXTENSION_HOOK_NAMES contains all canonical hook names', () => {
  const expected = ['install', 'update', 'delete', 'clean', 'enable', 'disable', 'activate'];
  assert.deepEqual([...ST_EXTENSION_HOOK_NAMES], expected);
});
