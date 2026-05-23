import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { defaultSecretName, secretRefForStore } from '../src/state/secrets.ts';

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
});
