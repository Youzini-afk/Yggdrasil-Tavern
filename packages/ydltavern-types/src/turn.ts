import type { AssetRef, AttachmentRef } from './assets.js';
import type { JsonValue, Ulid, UnixMillis } from './primitives.js';

export type TurnRole = 'user' | 'assistant' | 'system' | 'tool';

export type TurnSource = 'user_input' | 'generation' | 'imported' | 'tool' | 'system';

export interface SpeakerRef {
  readonly id?: string;
  readonly name: string;
  readonly avatar?: AssetRef;
  readonly kind?: 'user' | 'character' | 'group_member' | 'system' | 'tool';
}

export interface ToolRef {
  readonly provider?: string;
  readonly name: string;
  readonly ygg_capability_id?: string;
}

export interface SkillRef {
  readonly id: string;
  readonly label?: string;
  readonly ygg_package_id?: string;
}

export interface AgentStepDescriptor {
  readonly id: string;
  readonly label: string;
  readonly status: 'pending' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  readonly detail?: JsonValue;
}

export type SubMessage =
  | TextSubMessage
  | ThinkingSubMessage
  | ToolCallSubMessage
  | ToolResultSubMessage
  | SkillInvokeSubMessage
  | AgentStepSubMessage
  | ImageSubMessage
  | AudioSubMessage
  | AttachmentSubMessage
  | FileEmbedSubMessage
  | NoteSubMessage;

export interface TextSubMessage {
  readonly kind: 'text';
  readonly text: string;
  readonly segment_role?: 'main' | 'narration' | 'speech';
}

export interface ThinkingSubMessage {
  readonly kind: 'thinking';
  readonly text: string;
  readonly collapsed_by_default?: boolean;
  readonly hide_from_prompt?: boolean;
}

export interface ToolCallSubMessage {
  readonly kind: 'tool_call';
  readonly tool: ToolRef;
  readonly arguments: JsonValue;
  readonly call_id: string;
}

export interface ToolResultSubMessage {
  readonly kind: 'tool_result';
  readonly call_id: string;
  readonly result: JsonValue;
  readonly status: 'ok' | 'error' | 'cancelled';
}

export interface SkillInvokeSubMessage {
  readonly kind: 'skill_invoke';
  readonly skill: SkillRef;
  readonly input: JsonValue;
}

export interface AgentStepSubMessage {
  readonly kind: 'agent_step';
  readonly step: AgentStepDescriptor;
}

export interface ImageSubMessage {
  readonly kind: 'image';
  readonly image_ref: AssetRef;
  readonly prompt?: string;
  readonly alt?: string;
}

export interface AudioSubMessage {
  readonly kind: 'audio';
  readonly audio_ref: AssetRef;
  readonly transcript?: string;
}

export interface AttachmentSubMessage {
  readonly kind: 'attachment';
  readonly attachment_ref: AttachmentRef;
}

export interface FileEmbedSubMessage {
  readonly kind: 'file_embed';
  readonly file_ref: AssetRef;
  readonly mime: string;
}

export interface NoteSubMessage {
  readonly kind: 'note';
  readonly text: string;
}

export interface VariantMeta {
  readonly tokens?: number;
  readonly prompt_tokens?: number;
  readonly completion_tokens?: number;
  readonly cost?: number;
  readonly latency_ms?: number;
  readonly finish_reason?: string;
  readonly provider?: string;
  readonly model?: string;
  readonly raw?: JsonValue;
}

export interface TurnVariant {
  readonly id: Ulid;
  readonly generation_id?: string;
  readonly model?: string;
  readonly subs: readonly SubMessage[];
  readonly meta: VariantMeta;
  readonly created_at: UnixMillis;
}

export interface Turn {
  readonly id: Ulid;
  readonly index: number;
  readonly role: TurnRole;
  readonly speaker?: SpeakerRef;
  readonly variants: readonly TurnVariant[];
  readonly active_variant: number;
  readonly source: TurnSource;
  readonly hidden?: boolean;
  readonly memory_summary?: string;
  readonly created_at: UnixMillis;
  readonly edited_at?: UnixMillis;
  readonly deleted?: boolean;
}

export interface ChatMeta {
  readonly title?: string;
  readonly character_id?: string;
  readonly group_id?: string;
  readonly persona_id?: string;
  readonly source_format?: 'sillytavern_jsonl' | 'ydltavern_native' | 'imported';
}

export interface Chat {
  readonly id: Ulid;
  readonly meta: ChatMeta;
  readonly turns: readonly Turn[];
}

export function activeVariant(turn: Turn): TurnVariant | undefined {
  return turn.variants[turn.active_variant];
}

export function mainText(variant: TurnVariant): string {
  return variant.subs
    .filter((sub): sub is TextSubMessage => sub.kind === 'text')
    .map((sub) => sub.text)
    .join('\n');
}
