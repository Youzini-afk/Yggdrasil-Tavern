export type SecretRefScope = 'store' | 'project' | 'env';

export interface ParsedSecretRef {
  readonly scope: SecretRefScope;
  readonly name: string;
  readonly ref: string;
}

const SAFE_SECRET_NAME = /^[A-Za-z_][A-Za-z0-9_-]*$/u;
const SECRET_REF_PREFIX = 'secret_ref:';
const ALLOWED_SECRET_REF_SCOPES: readonly SecretRefScope[] = ['store', 'project', 'env'];

export function parseSecretRef(value: string): ParsedSecretRef | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) return undefined;

  const match = /^secret_ref:([^:]+):(.+)$/u.exec(trimmed);
  if (!match) return undefined;

  const scope = match[1];
  const name = match[2];
  if (scope === undefined || name === undefined || !isSecretRefScope(scope) || !SAFE_SECRET_NAME.test(name)) {
    return undefined;
  }

  return { scope, name, ref: `secret_ref:${scope}:${name}` };
}

export function isValidSecretRef(value: string): boolean {
  return parseSecretRef(value) !== undefined;
}

export function assertValidSecretRef(value: string, fieldName = 'secret_ref'): string {
  const parsed = parseSecretRef(value);
  if (!parsed) {
    throw new Error(`${fieldName} must be one of secret_ref:store:NAME, secret_ref:project:NAME, or secret_ref:env:NAME with a safe NAME`);
  }
  return parsed.ref;
}

export function isSecretRefScope(value: string): value is SecretRefScope {
  return (ALLOWED_SECRET_REF_SCOPES as readonly string[]).includes(value);
}

export function isRawOrUnsupportedSecretRef(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && (!trimmed.startsWith(SECRET_REF_PREFIX) || !isValidSecretRef(trimmed));
}
