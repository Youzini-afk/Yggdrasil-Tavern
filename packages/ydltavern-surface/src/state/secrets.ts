import { invokeCapability } from '../host-rpc/index.js';
import { assertValidSecretRef, isValidSecretRef, parseSecretRef } from '@ydltavern/engine-core';

const PUT = 'official/secret-store-lab/put_secret';
const HAS = 'official/secret-store-lab/has_secret';
const LIST = 'official/secret-store-lab/list_secrets';
const DEL = 'official/secret-store-lab/delete_secret';
const HEALTH = 'official/secret-store-lab/health';
const PUT_PROJECT = 'official/secret-store-lab/put_project_secret';

export interface StoredSecret {
  name: string;
  exists: boolean;
}

export async function storeSecret(name: string, value: string): Promise<{ name: string; created: boolean }> {
  const out = await invokeCapability(PUT, { name, value }) as { name: string; created: boolean };
  return out;
}

export async function storeProjectSecret(projectId: string | undefined, name: string, value: string): Promise<{ name: string; created: boolean }> {
  const out = await invokeCapability(PUT_PROJECT, { project_id: projectId, name, value }) as { name: string; created: boolean };
  return out;
}

export async function hasSecret(name: string): Promise<boolean> {
  const out = await invokeCapability(HAS, { name }) as { exists: boolean };
  return out.exists;
}

export async function listSecrets(): Promise<string[]> {
  const out = await invokeCapability(LIST, {}) as { names: string[] };
  return out.names;
}

export async function deleteSecret(name: string): Promise<boolean> {
  const out = await invokeCapability(DEL, { name }) as { removed: boolean };
  return out.removed;
}

export async function secretStoreHealth(): Promise<{
  store_path: string;
  exists: boolean;
  secret_count: number;
  key_source: 'keyring' | 'file' | 'none';
}> {
  return await invokeCapability(HEALTH, {}) as {
    store_path: string;
    exists: boolean;
    secret_count: number;
    key_source: 'keyring' | 'file' | 'none';
  };
}

export function secretRefForStore(name: string): string {
  return assertValidSecretRef(`secret_ref:store:${name}`);
}

export function secretRefForProject(name: string): string {
  return assertValidSecretRef(`secret_ref:project:${name}`);
}

export function secretRefForEnv(name: string): string {
  return assertValidSecretRef(`secret_ref:env:${name}`);
}

export function validateSecretRef(value: string): string | undefined {
  if (value.trim().length === 0) return undefined;
  if (isValidSecretRef(value)) return undefined;
  return 'Expected secret_ref:store:NAME, secret_ref:project:NAME, or secret_ref:env:NAME with a safe NAME';
}

export function normalizeSecretRef(value: string | undefined): string | undefined {
  if (typeof value !== 'string' || value.trim().length === 0) return undefined;
  return parseSecretRef(value)?.ref;
}

/** Default secret name for a provider (used by API Connections drawer) */
export function defaultSecretName(provider: string): string {
  // Match common ST/community conventions.
  switch (provider) {
    case 'openai':
    case 'custom-openai':
      return 'OPENAI_API_KEY';
    case 'anthropic':
      return 'ANTHROPIC_API_KEY';
    case 'gemini':
      return 'GEMINI_API_KEY';
    case 'mistral':
      return 'MISTRAL_API_KEY';
    case 'deepseek':
      return 'DEEPSEEK_API_KEY';
    case 'openrouter':
      return 'OPENROUTER_API_KEY';
    case 'cohere':
      return 'COHERE_API_KEY';
    case 'groq':
      return 'GROQ_API_KEY';
    case 'horde':
      return 'AI_HORDE_API_KEY';
    case 'novelai':
      return 'NOVELAI_API_KEY';
    case 'mancer':
      return 'MANCER_API_KEY';
    case 'tabbyapi':
      return 'TABBYAPI_KEY';
    default:
      return `${provider.toUpperCase().replace(/-/g, '_')}_API_KEY`;
  }
}
