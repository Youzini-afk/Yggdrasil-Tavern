import { invokeCapability } from '../host-rpc/index.js';
import { assertValidSecretRef, isValidSecretRef, parseSecretRef } from '@ydltavern/engine-core';
const PUT = 'official/secret-store-lab/put_secret';
const HAS = 'official/secret-store-lab/has_secret';
const LIST = 'official/secret-store-lab/list_secrets';
const DEL = 'official/secret-store-lab/delete_secret';
const HEALTH = 'official/secret-store-lab/health';
const PUT_PROJECT = 'official/secret-store-lab/put_project_secret';
export async function storeSecret(name, value) {
    const out = await invokeCapability(PUT, { name, value });
    return out;
}
export async function storeProjectSecret(projectId, name, value) {
    const out = await invokeCapability(PUT_PROJECT, { project_id: projectId, name, value });
    return out;
}
export async function hasSecret(name) {
    const out = await invokeCapability(HAS, { name });
    return out.exists;
}
export async function listSecrets() {
    const out = await invokeCapability(LIST, {});
    return out.names;
}
export async function deleteSecret(name) {
    const out = await invokeCapability(DEL, { name });
    return out.removed;
}
export async function secretStoreHealth() {
    return await invokeCapability(HEALTH, {});
}
export function secretRefForStore(name) {
    return assertValidSecretRef(`secret_ref:store:${name}`);
}
export function secretRefForProject(name) {
    return assertValidSecretRef(`secret_ref:project:${name}`);
}
export function secretRefForEnv(name) {
    return assertValidSecretRef(`secret_ref:env:${name}`);
}
export function validateSecretRef(value) {
    if (value.trim().length === 0)
        return undefined;
    if (isValidSecretRef(value))
        return undefined;
    return 'Expected secret_ref:store:NAME, secret_ref:project:NAME, or secret_ref:env:NAME with a safe NAME';
}
export function normalizeSecretRef(value) {
    if (typeof value !== 'string' || value.trim().length === 0)
        return undefined;
    return parseSecretRef(value)?.ref;
}
/** Default secret name for a provider (used by API Connections drawer) */
export function defaultSecretName(provider) {
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
//# sourceMappingURL=secrets.js.map