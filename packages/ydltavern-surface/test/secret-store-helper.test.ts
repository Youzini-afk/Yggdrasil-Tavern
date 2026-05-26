import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { defaultSecretName, normalizeSecretRef, secretRefForEnv, secretRefForProject, secretRefForStore, validateSecretRef } from '../src/state/secrets.ts';

describe('defaultSecretName', () => {
  it('maps openai to OPENAI_API_KEY', () => {
    assert.equal(defaultSecretName('openai'), 'OPENAI_API_KEY');
  });

  it('maps anthropic to ANTHROPIC_API_KEY', () => {
    assert.equal(defaultSecretName('anthropic'), 'ANTHROPIC_API_KEY');
  });

  it('maps custom-openai to OPENAI_API_KEY', () => {
    assert.equal(defaultSecretName('custom-openai'), 'OPENAI_API_KEY');
  });

  it('falls back to provider-derived name for unknown', () => {
    assert.equal(defaultSecretName('lambdalabs'), 'LAMBDALABS_API_KEY');
  });

  it('replaces dashes with underscores in fallback', () => {
    assert.equal(defaultSecretName('my-vendor'), 'MY_VENDOR_API_KEY');
  });
});

describe('secretRefForStore', () => {
  it('produces a secret_ref:store: reference', () => {
    assert.equal(secretRefForStore('OPENAI_API_KEY'), 'secret_ref:store:OPENAI_API_KEY');
  });

  it('produces project and env scoped references', () => {
    assert.equal(secretRefForProject('OPENAI_API_KEY'), 'secret_ref:project:OPENAI_API_KEY');
    assert.equal(secretRefForEnv('OPENAI_API_KEY'), 'secret_ref:env:OPENAI_API_KEY');
  });

  it('rejects unsupported or raw-looking refs', () => {
    for (const value of ['sk-raw-secret', 'Bearer test-key', 'secret_ref:inline:OPENAI_API_KEY', 'secret_ref:file:OPENAI_API_KEY', 'secret_ref:unknown:OPENAI_API_KEY', 'secret_ref:store:1BAD']) {
      assert.notEqual(validateSecretRef(value), undefined);
      assert.equal(normalizeSecretRef(value), undefined);
    }
  });

  it('accepts supported refs and trims them', () => {
    assert.equal(normalizeSecretRef(' secret_ref:store:OPENAI_API_KEY '), 'secret_ref:store:OPENAI_API_KEY');
    assert.equal(normalizeSecretRef('secret_ref:project:OPENAI_API_KEY'), 'secret_ref:project:OPENAI_API_KEY');
    assert.equal(normalizeSecretRef('secret_ref:env:OPENAI_API_KEY'), 'secret_ref:env:OPENAI_API_KEY');
  });
});
