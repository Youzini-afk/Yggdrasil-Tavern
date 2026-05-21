import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ST_EVENT_TYPES } from '@ydltavern/types/st';
import type { Chat, STChatMessage, Turn } from '@ydltavern/types';
import { createEventSource, createSTChatProxy, createSTContext } from '../src/index.js';

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
    assert.equal(proxy.pop(), message);
    assert.deepEqual(calls, ['push:1', 'delete:0:Added message']);
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
});

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
