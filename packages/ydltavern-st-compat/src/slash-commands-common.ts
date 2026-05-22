import type { STChatMessage } from '@ydltavern/types';
import type { ScopeValue, SlashCommandDef, SlashCommandRegistry } from './stscript-st.js';

export class SlashCommandUnsupportedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SlashCommandUnsupportedError';
  }
}

export interface BatchSlashOptions {
  readonly ctx: {
    chat: STChatMessage[];
    name1: string;
    name2: string;
    substituteParams(text: string): string;
    addOneMessage(message: STChatMessage, options?: Record<string, unknown>): void;
    saveChat(): Promise<void> | void;
    saveSettingsDebounced(): void;
  };
}

export type BatchSlashRegistry = Pick<SlashCommandRegistry, 'register' | 'has'>;

export function registerIfMissing(registry: BatchSlashRegistry, def: SlashCommandDef): void {
  if (!registry.has(def.name)) registry.register(def);
}

/**
 * Register a slash command that returns an explicit unsupported error.
 * Use for commands that genuinely require runtime/DOM/UI we don't have offline.
 */
export interface UnsupportedRegistration {
  readonly name: string;
  readonly aliases?: string[];
  readonly reason: string;
  readonly helpString?: string;
}

export function registerUnsupported(
  registry: BatchSlashRegistry,
  spec: UnsupportedRegistration,
): void {
  const message = `${spec.name} is unsupported by st-compat: ${spec.reason}`;
  registerIfMissing(registry, {
    name: spec.name,
    aliases: spec.aliases,
    helpString: spec.helpString ?? message,
    callback: async () => {
      throw new SlashCommandUnsupportedError(message);
    },
  });
}

/**
 * Register a slash command that returns a plan-only descriptor.
 * Use for commands whose effect needs host capability execution.
 */
export interface PlanOnlyRegistration {
  readonly name: string;
  readonly aliases?: string[];
  readonly action: string;
  readonly fields?: string[];
  readonly helpString?: string;
}

export function registerPlanOnly(
  registry: BatchSlashRegistry,
  spec: PlanOnlyRegistration,
): void {
  registerIfMissing(registry, {
    name: spec.name,
    aliases: spec.aliases,
    helpString: spec.helpString ?? `Plan-only: ${spec.action}`,
    callback: async (args) => {
      const fieldData: Record<string, unknown> = {};
      for (const field of spec.fields ?? []) {
        if (args[field] !== undefined) fieldData[field] = args[field];
      }
      return JSON.stringify({
        planned: true,
        action: spec.action,
        fields: fieldData,
      });
    },
  });
}

export function textValue(value: ScopeValue): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

export function namedString(args: Record<string, ScopeValue>, name: string): string | undefined {
  const value = args[name];
  return value === undefined || value === null ? undefined : String(value);
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function withInsertedOrAdded(ctx: BatchSlashOptions['ctx'], message: STChatMessage, at?: ScopeValue): void {
  const index = normalizeInsertIndex(ctx.chat.length, at);
  if (index === undefined) {
    ctx.addOneMessage(message);
    return;
  }
  ctx.chat.splice(index, 0, message);
}

export function normalizeInsertIndex(length: number, at?: ScopeValue): number | undefined {
  if (at === undefined || at === null || String(at).trim() === '') return undefined;
  let index = Number(at);
  if (!Number.isFinite(index)) return undefined;
  if (index < 0 || Object.is(index, -0)) index = length + index;
  if (index < 0 || index > length) return undefined;
  return index;
}

export function parseIndex(raw: ScopeValue, maxExclusive: number): number {
  const index = Number(raw);
  if (!Number.isInteger(index) || index < 0 || index >= maxExclusive) {
    throw new Error(`Invalid message index: ${String(raw)}`);
  }
  return index;
}

export function mutableMessage(message: STChatMessage): STChatMessage & { extra?: Record<string, unknown>; mes?: string } {
  return message as STChatMessage & { extra?: Record<string, unknown>; mes?: string };
}

export function toBoolean(value: ScopeValue): boolean {
  const normalized = String(value ?? '').trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'on' || normalized === 'yes';
}
