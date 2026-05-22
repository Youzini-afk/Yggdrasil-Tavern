export type { AuditEntry } from './runtime.js';

export function auditArgsShape(args: readonly unknown[]): unknown {
  return args.map((arg) => shapeOf(arg));
}

function shapeOf(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return { type: 'string', length: value.length };
  if (typeof value === 'number' || typeof value === 'boolean') return { type: typeof value };
  if (Array.isArray(value)) return { type: 'array', length: value.length };
  if (typeof value === 'object') return { type: 'object', keys: Object.keys(value).sort() };
  return { type: typeof value };
}
