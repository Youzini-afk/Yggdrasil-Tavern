export interface STChatMessage {
  readonly is_user?: boolean;
  readonly is_system?: boolean;
  readonly name?: string;
  readonly send_date?: string;
  readonly mes?: string;
  readonly swipe_id?: number;
  readonly swipes?: readonly string[];
  readonly swipes_info?: readonly STSwipeInfo[];
  readonly extra?: STMessageExtra;
  readonly [key: string]: unknown;
}

export interface STSwipeInfo {
  readonly send_date?: string;
  readonly gen_started?: string;
  readonly gen_finished?: string;
  readonly extra?: STMessageExtra;
  readonly [key: string]: unknown;
}

export interface STMessageExtra {
  readonly reasoning?: string;
  readonly tool_invocations?: readonly Record<string, unknown>[];
  readonly image?: string;
  readonly images?: readonly string[];
  readonly audio?: string;
  readonly file?: string;
  readonly files?: readonly string[];
  readonly notes?: readonly string[];
  readonly is_internal_step?: boolean;
  readonly [key: string]: unknown;
}
