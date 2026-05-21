import type { JsonObject, MimeType, Ulid } from './primitives.js';

export type AssetKind =
  | 'character_card'
  | 'world_book'
  | 'preset'
  | 'chat_history'
  | 'persona'
  | 'theme'
  | 'quick_reply'
  | 'regex_script'
  | 'image'
  | 'audio'
  | 'file';

export interface AssetRef {
  readonly id: Ulid;
  readonly kind: AssetKind;
  readonly mime?: MimeType;
  readonly hash?: string;
  readonly original_path?: string;
  readonly metadata?: JsonObject;
}

export interface AttachmentRef {
  readonly id: Ulid;
  readonly asset: AssetRef;
  readonly label?: string;
}

export interface STPreservedPayload<T = unknown> {
  readonly format: string;
  readonly payload: T;
  readonly source_hash?: string;
}
