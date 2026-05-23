import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';

import {
  _FetcherLRU,
  fetchHuggingFaceTokenizer,
} from '../dist/index.js';

const MINIMAL_HF_TOKENIZER_JSON = {
  version: '1.0',
  normalizer: null,
  pre_tokenizer: { type: 'Whitespace' },
  post_processor: null,
  decoder: { type: 'WordPiece', prefix: '##', cleanup: true },
  model: {
    type: 'WordPiece',
    vocab: { '[UNK]': 0, hello: 1, world: 2 },
    unk_token: '[UNK]',
  },
  added_tokens: [],
};

const TOKENIZER_CONFIG_JSON = {
  chat_template: '{{ messages }}',
  model_max_length: 4096,
};

function ok(body = MINIMAL_HF_TOKENIZER_JSON) {
  return {
    status: 'ok',
    body_shape: body,
    redaction_state: 'redacted',
    network_performed: true,
    executor_kind: 'mock',
  };
}

function makeMockKernel(responses) {
  const calls = [];
  return {
    calls,
    sendKernelRequest: async (method, params) => {
      calls.push({ method, params });
      const next = responses.shift();
      if (typeof next === 'function') return next(method, params);
      if (next instanceof Error) throw next;
      return next;
    },
  };
}

function sha256(value) {
  const body = typeof value === 'string' ? value : JSON.stringify(value);
  return createHash('sha256').update(body, 'utf8').digest('hex');
}

test('fetchHuggingFaceTokenizer hf-hub builds correct outbound.execute params', async () => {
  const kernel = makeMockKernel([ok(), ok(TOKENIZER_CONFIG_JSON)]);
  const result = await fetchHuggingFaceTokenizer({
    source: 'hf-hub',
    modelId: 'mistralai/Mistral-7B-Instruct-v0.3',
    revision: 'main',
    kernelClient: kernel,
    capabilityId: 'pkg/tokenizer.fetch',
    cacheKey: 'test:hf-params',
  });

  assert.equal(kernel.v1.calls.length, 2);
  const { method, params } = kernel.v1.calls[0];
  assert.equal(method, 'kernel.v1.outbound.execute');
  assert.equal(params.capability_id, 'pkg/tokenizer.fetch');
  assert.equal(params.destination_host, 'huggingface.co');
  assert.equal(params.method, 'GET');
  assert.equal(params.path, '/mistralai/Mistral-7B-Instruct-v0.3/resolve/main/tokenizer.json');
  assert.deepEqual(params.static_headers, { accept: 'application/json' });
  assert.deepEqual(params.secret_headers, {});
  assert.equal(params.timeout_ms, 30000);
  assert.equal(result.url, 'https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3/resolve/main/tokenizer.json');
  assert.equal(result.source, 'hf-hub');
  assert.equal(result.bytes, JSON.stringify(MINIMAL_HF_TOKENIZER_JSON).length);
});

test("fetchHuggingFaceTokenizer source='url' uses provided URL", async () => {
  const kernel = makeMockKernel([ok()]);
  const result = await fetchHuggingFaceTokenizer({
    source: 'url',
    url: 'https://cdn.example.test/models/tokenizer.json?download=1',
    kernelClient: kernel,
    capabilityId: 'pkg/tokenizer.fetch',
    cacheKey: 'test:url-source',
  });

  assert.equal(kernel.v1.calls.length, 1);
  assert.equal(kernel.v1.calls[0].params.destination_host, 'cdn.example.test');
  assert.equal(kernel.v1.calls[0].params.path, '/models/tokenizer.json?download=1');
  assert.equal(result.url, 'https://cdn.example.test/models/tokenizer.json?download=1');
  assert.equal(result.source, 'url');
});

test('fetchHuggingFaceTokenizer adds Authorization secret_header when hfTokenSecretRef provided', async () => {
  const kernel = makeMockKernel([ok()]);
  await fetchHuggingFaceTokenizer({
    source: 'url',
    url: 'https://huggingface.co/private/model/resolve/main/tokenizer.json',
    kernelClient: kernel,
    capabilityId: 'pkg/tokenizer.fetch',
    cacheKey: 'test:auth-header',
    hfTokenSecretRef: 'secret_ref:env:HF_TOKEN',
  });

  assert.deepEqual(kernel.v1.calls[0].params.secret_headers, {
    Authorization: { secret_ref: 'secret_ref:env:HF_TOKEN', scheme: 'bearer' },
  });
  assert.deepEqual(kernel.v1.calls[0].params.secret_refs, ['secret_ref:env:HF_TOKEN']);
});

test('fetchHuggingFaceTokenizer omits Authorization when no token', async () => {
  const kernel = makeMockKernel([ok()]);
  await fetchHuggingFaceTokenizer({
    source: 'url',
    url: 'https://huggingface.co/public/model/resolve/main/tokenizer.json',
    kernelClient: kernel,
    capabilityId: 'pkg/tokenizer.fetch',
    cacheKey: 'test:no-auth-header',
  });

  assert.deepEqual(kernel.v1.calls[0].params.secret_headers, {});
  assert.equal('secret_refs' in kernel.v1.calls[0].params, false);
});

test("fetchHuggingFaceTokenizer cache hit short-circuits second call", async () => {
  const kernel = makeMockKernel([ok()]);
  const options = {
    source: 'url',
    url: 'https://cache.example.test/tokenizer.json',
    kernelClient: kernel,
    capabilityId: 'pkg/tokenizer.fetch',
    cacheKey: 'test:cache-hit',
  };

  const first = await fetchHuggingFaceTokenizer(options);
  const second = await fetchHuggingFaceTokenizer(options);

  assert.equal(kernel.v1.calls.length, 1);
  assert.strictEqual(second, first);
});

test('fetchHuggingFaceTokenizer SHA256 mismatch throws', async () => {
  const kernel = makeMockKernel([ok()]);
  await assert.rejects(
    () => fetchHuggingFaceTokenizer({
      source: 'url',
      url: 'https://sha.example.test/tokenizer.json',
      kernelClient: kernel,
      capabilityId: 'pkg/tokenizer.fetch',
      cacheKey: 'test:sha-mismatch',
      expectedSha256: '0'.repeat(64),
    }),
    /SHA-256 mismatch/,
  );
});

test('fetchHuggingFaceTokenizer SHA256 match succeeds', async () => {
  const kernel = makeMockKernel([ok()]);
  const expectedSha256 = sha256(MINIMAL_HF_TOKENIZER_JSON);
  const result = await fetchHuggingFaceTokenizer({
    source: 'url',
    url: 'https://sha.example.test/tokenizer-match.json',
    kernelClient: kernel,
    capabilityId: 'pkg/tokenizer.fetch',
    cacheKey: 'test:sha-match',
    expectedSha256,
  });

  assert.equal(result.sha256, expectedSha256);
});

test('fetchHuggingFaceTokenizer rejects non-ok response status', async () => {
  const kernel = makeMockKernel([{ status: 'denied', body_shape: { error: 'nope' }, executor_kind: 'mock-deny' }]);
  await assert.rejects(
    () => fetchHuggingFaceTokenizer({
      source: 'url',
      url: 'https://status.example.test/tokenizer.json',
      kernelClient: kernel,
      capabilityId: 'pkg/tokenizer.fetch',
      cacheKey: 'test:non-ok',
    }),
    /status=denied executor_kind=mock-deny/,
  );
});

test('fetchHuggingFaceTokenizer rejects malformed body (not JSON / missing model field)', async () => {
  const notJsonKernel = makeMockKernel([{ status: 'ok', body_text: '{not-json', executor_kind: 'mock' }]);
  await assert.rejects(
    () => fetchHuggingFaceTokenizer({
      source: 'url',
      url: 'https://malformed.example.test/not-json.json',
      kernelClient: notJsonKernel,
      capabilityId: 'pkg/tokenizer.fetch',
      cacheKey: 'test:not-json',
    }),
    /not valid JSON/,
  );

  const missingModelKernel = makeMockKernel([ok({ version: '1.0' })]);
  await assert.rejects(
    () => fetchHuggingFaceTokenizer({
      source: 'url',
      url: 'https://malformed.example.test/missing-model.json',
      kernelClient: missingModelKernel,
      capabilityId: 'pkg/tokenizer.fetch',
      cacheKey: 'test:missing-model',
    }),
    /missing required model field/,
  );
});

test('fetchHuggingFaceTokenizer fetches tokenizer_config.json best-effort', async () => {
  const successKernel = makeMockKernel([ok(), ok(TOKENIZER_CONFIG_JSON)]);
  const success = await fetchHuggingFaceTokenizer({
    source: 'hf-hub',
    modelId: 'config/model',
    kernelClient: successKernel,
    capabilityId: 'pkg/tokenizer.fetch',
    cacheKey: 'test:config-success',
  });

  assert.equal(successKernel.calls.length, 2);
  assert.equal(successKernel.calls[1].params.path, '/config/model/resolve/main/tokenizer_config.json');
  assert.deepEqual(success.tokenizerConfig, TOKENIZER_CONFIG_JSON);
  assert.equal(success.tokenizerConfigBytes, JSON.stringify(TOKENIZER_CONFIG_JSON).length);

  const failKernel = makeMockKernel([ok(), new Error('config unavailable')]);
  const fail = await fetchHuggingFaceTokenizer({
    source: 'hf-hub',
    modelId: 'config/fail-model',
    kernelClient: failKernel,
    capabilityId: 'pkg/tokenizer.fetch',
    cacheKey: 'test:config-fail',
  });

  assert.equal(failKernel.calls.length, 2);
  assert.equal(fail.tokenizerConfig, undefined);
  assert.equal(fail.tokenizerConfigBytes, undefined);
});

test('fetchHuggingFaceTokenizer cache eviction works at capacity', () => {
  const cache = new _FetcherLRU(2);
  cache.set('a', 1);
  cache.set('b', 2);
  cache.set('c', 3);

  assert.equal(cache.size(), 2);
  assert.equal(cache.get('a'), undefined);
  assert.equal(cache.get('b'), 2);
  assert.equal(cache.get('c'), 3);
});

test("fetchHuggingFaceTokenizer revision defaults to 'main'", async () => {
  const kernel = makeMockKernel([ok(), ok(TOKENIZER_CONFIG_JSON)]);
  const result = await fetchHuggingFaceTokenizer({
    source: 'hf-hub',
    modelId: 'default/revision-model',
    kernelClient: kernel,
    capabilityId: 'pkg/tokenizer.fetch',
    cacheKey: 'test:revision-default',
  });

  assert.equal(kernel.v1.calls[0].params.path, '/default/revision-model/resolve/main/tokenizer.json');
  assert.equal(result.revision, 'main');
});

test('fetchHuggingFaceTokenizer revision can be a commit sha', async () => {
  const kernel = makeMockKernel([ok(), ok(TOKENIZER_CONFIG_JSON)]);
  const revision = '0123456789abcdef0123456789abcdef01234567';
  const result = await fetchHuggingFaceTokenizer({
    source: 'hf-hub',
    modelId: 'commit/revision-model',
    revision,
    kernelClient: kernel,
    capabilityId: 'pkg/tokenizer.fetch',
    cacheKey: 'test:revision-commit',
  });

  assert.equal(kernel.v1.calls[0].params.path, `/commit/revision-model/resolve/${revision}/tokenizer.json`);
  assert.equal(result.revision, revision);
});

test('FetcherLRU touch-on-get moves recent items to MRU', () => {
  const cache = new _FetcherLRU(2);
  cache.set('a', 1);
  cache.set('b', 2);
  assert.equal(cache.get('a'), 1);
  cache.set('c', 3);

  assert.equal(cache.get('b'), undefined);
  assert.equal(cache.get('a'), 1);
  assert.equal(cache.get('c'), 3);
});
