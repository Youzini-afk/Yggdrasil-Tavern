import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ST_EVENT_TYPES } from '@ydltavern/types/st';
import type { Chat, STChatMessage, Turn } from '@ydltavern/types';
import { createEventSource, createSTChatProxy, createSTContext, createSTChatProxyFromStore, createTurnStore } from '../src/index.js';

describe('event source', () => {
  it('handles on/once/off ordering', () => {
    const eventSource = createEventSource();
    const calls: string[] = [];
    const removed = (): void => {
      calls.push('removed');
    };

    eventSource.on(ST_EVENT_TYPES.MESSAGE_SENT, () => calls.push('on-1'));
    eventSource.once(ST_EVENT_TYPES.MESSAGE_SENT, () => calls.push('once'));
    eventSource.on(ST_EVENT_TYPES.MESSAGE_SENT, () => calls.push('on-2'));
    eventSource.on(ST_EVENT_TYPES.MESSAGE_SENT, removed);
    eventSource.off(ST_EVENT_TYPES.MESSAGE_SENT, removed);

    assert.equal(eventSource.listenerCount(ST_EVENT_TYPES.MESSAGE_SENT), 3);
    assert.equal(eventSource.emit(ST_EVENT_TYPES.MESSAGE_SENT, { id: 'message-1' }), true);
    assert.deepEqual(calls, ['on-1', 'once', 'on-2']);
    assert.equal(eventSource.listenerCount(ST_EVENT_TYPES.MESSAGE_SENT), 2);

    eventSource.emit(ST_EVENT_TYPES.MESSAGE_SENT);
    assert.deepEqual(calls, ['on-1', 'once', 'on-2', 'on-1', 'on-2']);
  });

  it('exposes known event types', () => {
    const eventSource = createEventSource();

    assert.equal(eventSource.eventTypes.MESSAGE_SENT, 'message_sent');
    assert.equal(eventSource.eventTypes.GENERATION_STARTED, 'generation_started');
  });
});

describe('chat proxy', () => {
  it('projects a Turn to mes', () => {
    const proxy = createSTChatProxy(createChat([createTurn('turn-1', 'Hello from a turn')]));

    assert.equal(proxy.length, 1);
    assert.equal(proxy[0]?.mes, 'Hello from a turn');
    assert.deepEqual([...proxy].map((message) => message.mes), ['Hello from a turn']);
  });

  it('fires push and pop hooks', () => {
    const calls: string[] = [];
    const proxy = createSTChatProxy(createChat([]), {
      onPush: (messages) => calls.push(`push:${messages.length}`),
      onDelete: (index, message) => calls.push(`delete:${index}:${message.mes ?? ''}`),
    });
    const message: STChatMessage = { mes: 'Added message' };

    assert.equal(proxy.push(message), 1);
    assert.equal(proxy.pop()?.mes, message.mes);
    assert.deepEqual(calls, ['push:1', 'delete:0:Added message']);
  });

  it('updates the store snapshot through message property assignment', () => {
    const store = createTurnStore(createChat([createTurn('turn-1', 'Before')]));
    const proxy = createSTChatProxyFromStore(store);

    proxy[0]!.mes = 'After';
    proxy[0]!.name = 'Edited Assistant';

    assert.equal(proxy[0]?.mes, 'After');
    assert.equal(store.snapshot().turns[0]?.variants[0]?.subs[0]?.kind, 'text');
    assert.deepEqual(store.snapshot().turns[0]?.variants[0]?.subs[0], {
      kind: 'text',
      text: 'After',
      segment_role: 'main',
    });
    assert.equal(store.snapshot().turns[0]?.speaker?.name, 'Edited Assistant');
  });

  it('updates the store snapshot through index assignment', () => {
    const store = createTurnStore(createChat([createTurn('turn-1', 'Before')]));
    const proxy = createSTChatProxyFromStore(store);

    proxy[0] = { mes: 'Replacement', is_user: true, name: 'User' };

    assert.equal(proxy[0]?.mes, 'Replacement');
    assert.equal(store.snapshot().turns[0]?.role, 'user');
    assert.equal(store.snapshot().turns[0]?.speaker?.name, 'User');
  });

  it('pushes a message into the store and updates length', () => {
    const store = createTurnStore(createChat([]));
    const proxy = createSTChatProxyFromStore(store);

    assert.equal(proxy.push({ mes: 'Added', name: 'Assistant' }), 1);

    assert.equal(proxy.length, 1);
    assert.equal(store.snapshot().turns.length, 1);
    assert.equal(store.snapshot().turns[0]?.index, 0);
    assert.equal(proxy[0]?.mes, 'Added');
  });

  it('keeps indexes continuous after splice and delete', () => {
    const store = createTurnStore(
      createChat([createTurn('turn-1', 'One'), createTurn('turn-2', 'Two'), createTurn('turn-3', 'Three')]),
    );
    const proxy = createSTChatProxyFromStore(store);

    const removed = proxy.splice(1, 1, { mes: 'Inserted' });
    delete proxy[0];

    assert.deepEqual(removed.map((message) => message.mes), ['Two']);
    assert.deepEqual([...proxy].map((message) => message.mes), ['Inserted', 'Three']);
    assert.deepEqual(
      store.snapshot().turns.map((turn) => turn.index),
      [0, 1],
    );
  });
});

describe('context runtime', () => {
  it('returns a stable context across calls', () => {
    const runtime = createSTContext({ chat: createChat([]) });

    assert.equal(runtime.getContext(), runtime.context);
    assert.equal(runtime.getContext(), runtime.getContext());
    assert.equal(runtime.context.event_types.MESSAGE_SENT, 'message_sent');
    assert.equal(runtime.context.event_types.GENERATION_STARTED, 'generation_started');
  });

  it('addOneMessage emits an event and mutates live chat', () => {
    const runtime = createSTContext({ chat: createChat([]) });
    const calls: string[] = [];
    runtime.context.eventSource.on(ST_EVENT_TYPES.MESSAGE_RECEIVED, (message) => {
      if (isSTChatMessage(message)) {
        calls.push(message.mes ?? '');
      }
    });

    const added = runtime.context.addOneMessage({ mes: 'Added through context', name: 'Assistant' });

    assert.equal(added.mes, 'Added through context');
    assert.equal(runtime.context.chat.length, 1);
    assert.equal(runtime.context.chat[0]?.mes, 'Added through context');
    assert.deepEqual(calls, ['Added through context']);
    assert.deepEqual(runtime.context.saveChat(), { ok: true, turns: 1 });
    assert.doesNotThrow(() => runtime.context.saveSettingsDebounced());
  });

  it('Generate emits lifecycle events and appends assistant message', () => {
    const runtime = createSTContext({ chat: createChat([]), name2: 'Bot' });
    const calls: string[] = [];
    runtime.context.eventSource.on(ST_EVENT_TYPES.GENERATION_STARTED, () => calls.push('start'));
    runtime.context.eventSource.on(ST_EVENT_TYPES.STREAM_TOKEN_RECEIVED, (token) => calls.push(`token:${String(token)}`));
    runtime.context.eventSource.on(ST_EVENT_TYPES.MESSAGE_RECEIVED, (message) => {
      if (isSTChatMessage(message)) {
        calls.push(`message:${message.mes ?? ''}`);
      }
    });
    runtime.context.eventSource.on(ST_EVENT_TYPES.GENERATION_ENDED, () => calls.push('end'));

    const result = runtime.context.Generate({ prompt: 'Generated text' });

    assert.deepEqual(calls, ['start', 'token:Generated text', 'message:Generated text', 'end']);
    assert.equal(result.ok, true);
    assert.equal(result.index, 0);
    assert.equal(runtime.context.generationStarted, false);
    assert.equal(runtime.context.chat[0]?.mes, 'Generated text');
    assert.equal(runtime.context.chat[0]?.name, 'Bot');
  });

  it('substituteParams replaces basic macros with overrides', () => {
    const runtime = createSTContext({ chat: createChat([]), name1: 'Alice', name2: 'Bob' });

    assert.equal(
      runtime.context.substituteParams('{{user}} greets {{char}} at {{time}} on {{date}}', {
        char: 'Carol',
        time: '10:30',
        date: '2026-05-21',
      }),
      'Alice greets Carol at 10:30 on 2026-05-21',
    );
  });
});

function isSTChatMessage(value: unknown): value is STChatMessage {
  return typeof value === 'object' && value !== null && 'mes' in value;
}

function createChat(turns: readonly Turn[]): Chat {
  return {
    id: 'chat-1',
    meta: {},
    turns,
  };
}

function createTurn(id: string, text: string): Turn {
  return {
    id,
    index: 0,
    role: 'assistant',
    speaker: { name: 'Assistant' },
    variants: [
      {
        id: `${id}-variant`,
        subs: [
          { kind: 'text', text, segment_role: 'main' },
          { kind: 'thinking', text: 'Reasoning text' },
          {
            kind: 'tool_call',
            tool: { name: 'lookup' },
            arguments: { query: 'example' },
            call_id: 'call-1',
          },
        ],
        meta: {},
        created_at: 1_700_000_000_000,
      },
    ],
    active_variant: 0,
    source: 'generation',
    created_at: 1_700_000_000_000,
  };
}
