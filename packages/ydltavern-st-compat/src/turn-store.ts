import type {
  Chat,
  JsonValue,
  STChatMessage,
  STMessageExtra,
  SubMessage,
  TextSubMessage,
  Turn,
  TurnRole,
  TurnSource,
  TurnVariant,
} from '@ydltavern/types';
import { activeVariant } from '@ydltavern/types';

export type STChatProxyMessage = {
  -readonly [Key in keyof STChatMessage]: STChatMessage[Key];
};

export interface STChatMessagePatch {
  readonly mes?: string;
  readonly name?: string;
  readonly is_user?: boolean;
  readonly is_system?: boolean;
  readonly extra?: STMessageExtra;
}

export interface TurnStore {
  readonly length: number;
  snapshot(): Chat;
  messageAt(index: number): STChatMessage | undefined;
  messages(): readonly STChatMessage[];
  pushMessage(message: STChatMessage): Turn;
  updateMessage(index: number, patch: STChatMessagePatch): Turn | undefined;
  deleteMessage(index: number): Turn | undefined;
  spliceMessages(start: number, deleteCount: number, ...messages: readonly STChatMessage[]): readonly Turn[];
}

let generatedId = 0;

export function createTurnStore(chat: Chat): TurnStore {
  return new RuntimeTurnStore(chat);
}

export function projectTurnToSTChatMessage(turn: Turn): STChatMessage {
  const variant = activeVariant(turn);
  const subs = variant?.subs ?? [];
  const extra = projectExtra(subs);
  const message: STChatMessage = {
    is_user: turn.role === 'user',
    is_system: turn.role === 'system',
    name: turn.speaker?.name,
    send_date: new Date(turn.created_at).toISOString(),
    mes: projectMainText(subs),
    swipe_id: turn.active_variant,
    swipes: turn.variants.map((candidate) => projectMainText(candidate.subs)),
    extra,
  };

  return message;
}

class RuntimeTurnStore implements TurnStore {
  private readonly chatId: Chat['id'];
  private readonly chatMeta: Chat['meta'];
  private turns: Turn[];
  private readonly extrasByTurnId = new Map<string, STMessageExtra | undefined>();

  public constructor(chat: Chat) {
    this.chatId = chat.id;
    this.chatMeta = { ...chat.meta };
    this.turns = chat.turns.map((turn, index) => cloneTurnWithIndex(turn, index));
  }

  public get length(): number {
    return this.turns.length;
  }

  public snapshot(): Chat {
    return {
      id: this.chatId,
      meta: { ...this.chatMeta },
      turns: this.turns.map((turn, index) => cloneTurnWithIndex(turn, index)),
    };
  }

  public messageAt(index: number): STChatMessage | undefined {
    const turn = this.turns[index];
    if (turn === undefined) {
      return undefined;
    }

    return this.projectStoredTurn(turn);
  }

  public messages(): readonly STChatMessage[] {
    return this.turns.map((turn) => this.projectStoredTurn(turn));
  }

  public pushMessage(message: STChatMessage): Turn {
    const turn = buildTurnFromMessage(message, this.turns.length);
    this.turns = [...this.turns, turn];
    if (hasOwn(message, 'extra')) {
      this.extrasByTurnId.set(turn.id, message.extra);
    }
    return turn;
  }

  public updateMessage(index: number, patch: STChatMessagePatch): Turn | undefined {
    const currentTurn = this.turns[index];
    if (currentTurn === undefined) {
      return undefined;
    }

    const currentMessage = this.projectStoredTurn(currentTurn);
    const nextMessage: STChatMessage = { ...currentMessage, ...patch };
    const nextTurn = buildTurnFromMessage(nextMessage, index, currentTurn);
    this.turns = this.turns.map((turn, turnIndex) => (turnIndex === index ? nextTurn : turn));

    if (hasOwn(patch, 'extra')) {
      this.extrasByTurnId.set(nextTurn.id, patch.extra);
    } else if (this.extrasByTurnId.has(currentTurn.id) && nextTurn.id !== currentTurn.id) {
      this.extrasByTurnId.set(nextTurn.id, this.extrasByTurnId.get(currentTurn.id));
      this.extrasByTurnId.delete(currentTurn.id);
    }

    return nextTurn;
  }

  public deleteMessage(index: number): Turn | undefined {
    if (index < 0 || index >= this.turns.length) {
      return undefined;
    }

    const [removed] = this.turns.splice(index, 1);
    if (removed !== undefined) {
      this.extrasByTurnId.delete(removed.id);
    }
    this.renumberTurns();
    return removed;
  }

  public spliceMessages(start: number, deleteCount: number, ...messages: readonly STChatMessage[]): readonly Turn[] {
    const normalizedStart = normalizeSpliceStart(start, this.turns.length);
    const effectiveDeleteCount = Math.max(0, Math.min(deleteCount, this.turns.length - normalizedStart));
    const inserted = messages.map((message, offset) => buildTurnFromMessage(message, normalizedStart + offset));
    const removed = this.turns.splice(normalizedStart, effectiveDeleteCount, ...inserted);

    removed.forEach((turn) => this.extrasByTurnId.delete(turn.id));
    messages.forEach((message, offset) => {
      if (hasOwn(message, 'extra')) {
        this.extrasByTurnId.set(inserted[offset]?.id ?? '', message.extra);
      }
    });
    this.renumberTurns();
    return removed.map((turn) => cloneTurnWithIndex(turn, turn.index));
  }

  private projectStoredTurn(turn: Turn): STChatMessage {
    const base = projectTurnToSTChatMessage(turn);
    if (!this.extrasByTurnId.has(turn.id)) {
      return base;
    }

    const extra = this.extrasByTurnId.get(turn.id);
    if (extra === undefined) {
      const { extra: _extra, ...rest } = base;
      return rest;
    }

    return { ...base, extra };
  }

  private renumberTurns(): void {
    this.turns = this.turns.map((turn, index) => cloneTurnWithIndex(turn, index));
  }
}

function buildTurnFromMessage(message: STChatMessage, index: number, previous?: Turn): Turn {
  const role = inferRole(message);
  const now = Date.now();
  const createdAt = parseSendDate(message.send_date) ?? previous?.created_at ?? now;
  const variantCreatedAt = previous?.variants[0]?.created_at ?? createdAt;
  const variantId = previous?.variants[0]?.id ?? createCompatId('st-variant');
  const variant: TurnVariant = {
    id: variantId,
    subs: buildSubMessages(message),
    meta: previous?.variants[0]?.meta ?? {},
    created_at: variantCreatedAt,
  };

  return {
    id: previous?.id ?? createCompatId('st-turn'),
    index,
    role,
    speaker: typeof message.name === 'string' && message.name.length > 0 ? { name: message.name, kind: speakerKind(role) } : undefined,
    variants: [variant],
    active_variant: 0,
    source: inferSource(role, previous?.source),
    created_at: createdAt,
    edited_at: previous === undefined ? undefined : now,
  };
}

function buildSubMessages(message: STChatMessage): readonly SubMessage[] {
  const subs: SubMessage[] = [];
  if (typeof message.mes === 'string') {
    subs.push({ kind: 'text', text: message.mes, segment_role: 'main' });
  }

  if (message.extra?.reasoning !== undefined) {
    subs.push({ kind: 'thinking', text: message.extra.reasoning });
  }

  const notes = message.extra?.notes;
  if (notes !== undefined) {
    notes.forEach((note) => subs.push({ kind: 'note', text: note }));
  }

  return subs;
}

function inferRole(message: STChatMessage): TurnRole {
  if (message.is_system === true) {
    return 'system';
  }

  if (message.is_user === true) {
    return 'user';
  }

  return 'assistant';
}

function inferSource(role: TurnRole, previous?: TurnSource): TurnSource {
  if (role === 'system') {
    return 'system';
  }

  if (role === 'user') {
    return 'user_input';
  }

  return previous ?? 'generation';
}

function speakerKind(role: TurnRole): 'user' | 'character' | 'system' | 'tool' {
  if (role === 'user') {
    return 'user';
  }

  if (role === 'system') {
    return 'system';
  }

  if (role === 'tool') {
    return 'tool';
  }

  return 'character';
}

function parseSendDate(sendDate: string | undefined): number | undefined {
  if (sendDate === undefined) {
    return undefined;
  }

  const parsed = Date.parse(sendDate);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function cloneTurnWithIndex(turn: Turn, index: number): Turn {
  return {
    ...turn,
    index,
    speaker: turn.speaker === undefined ? undefined : { ...turn.speaker },
    variants: turn.variants.map(cloneVariant),
  };
}

function cloneVariant(variant: TurnVariant): TurnVariant {
  return {
    ...variant,
    meta: { ...variant.meta },
    subs: variant.subs.map(cloneSubMessage),
  };
}

function cloneSubMessage(sub: SubMessage): SubMessage {
  return { ...sub };
}

function projectMainText(subs: readonly SubMessage[]): string {
  return subs
    .filter(isMainTextSubMessage)
    .map((sub) => sub.text)
    .join('\n');
}

function isMainTextSubMessage(sub: SubMessage): sub is TextSubMessage {
  return sub.kind === 'text' && (sub.segment_role === undefined || sub.segment_role === 'main');
}

function projectExtra(subs: readonly SubMessage[]): STMessageExtra | undefined {
  const reasoning = subs
    .filter((sub) => sub.kind === 'thinking')
    .map((sub) => sub.text)
    .join('\n');
  const toolInvocations = subs.flatMap((sub) => projectToolInvocation(sub));
  const notes = subs.filter((sub) => sub.kind === 'note').map((sub) => sub.text);

  const extra: STMessageExtra = {
    ...(reasoning.length > 0 ? { reasoning } : {}),
    ...(toolInvocations.length > 0 ? { tool_invocations: toolInvocations } : {}),
    ...(notes.length > 0 ? { notes } : {}),
  };

  return Object.keys(extra).length > 0 ? extra : undefined;
}

function projectToolInvocation(sub: SubMessage): readonly Record<string, unknown>[] {
  if (sub.kind === 'tool_call') {
    return [
      {
        type: 'tool_call',
        call_id: sub.call_id,
        tool: sub.tool,
        arguments: jsonValueToUnknown(sub.arguments),
      },
    ];
  }

  if (sub.kind === 'tool_result') {
    return [
      {
        type: 'tool_result',
        call_id: sub.call_id,
        status: sub.status,
        result: jsonValueToUnknown(sub.result),
      },
    ];
  }

  return [];
}

function jsonValueToUnknown(value: JsonValue): unknown {
  return value;
}

function createCompatId(prefix: string): string {
  generatedId += 1;
  return `${prefix}-${generatedId}`;
}

function normalizeSpliceStart(start: number, length: number): number {
  if (start < 0) {
    return Math.max(length + start, 0);
  }

  return Math.min(start, length);
}

function hasOwn<Key extends PropertyKey>(value: object, key: Key): value is object & Record<Key, unknown> {
  return Object.prototype.hasOwnProperty.call(value, key);
}
