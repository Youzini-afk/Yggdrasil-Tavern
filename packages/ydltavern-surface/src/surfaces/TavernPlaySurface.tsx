import { useCallback, useMemo, useState } from 'react';
import type { Chat } from '@ydltavern/types';
import { createSTContext, createTurnStore, type TurnStore } from '@ydltavern/st-compat';
import { TurnView } from '../components/TurnView.js';
import { STDiagnosticsPanel } from '../components/STDiagnosticsPanel.js';
import { EngineCorePreviewPanel } from '../components/EngineCorePreviewPanel.js';
import { ImportersPanel } from '../components/ImportersPanel.js';
import { PromptCriticalPanel } from '../components/PromptCriticalPanel.js';
import { SlashDiagnosticsPanel } from '../components/SlashDiagnosticsPanel.js';
import { sampleChat } from '../fixtures/sample-chat.js';

export interface TavernPlaySurfaceProps {
  /**
   * The Chat to render. Defaults to the bundled `sampleChat` fixture so the
   * surface renders standalone in demos and tests.
   */
  readonly chat?: Chat;
  /**
   * When true (default), shows the ST-compat / engine-core / importers
   * diagnostic panels under the turn stream. Hosts that want a clean play
   * surface can pass `showDiagnostics={false}`.
   */
  readonly showDiagnostics?: boolean;
  /** Optional class merged onto the surface root. */
  readonly className?: string;
}

const SURFACE_ROOT_CLASSES = ['ydltavern-surface', 'tavern-surface', 'tavern-surface-play'];

export function TavernPlaySurface({
  chat = sampleChat,
  showDiagnostics = true,
  className,
}: TavernPlaySurfaceProps): JSX.Element {
  const [revision, setRevision] = useState(0);
  const [input, setInput] = useState('');

  // Own TurnStore is a mirror of the st-compat runtime's internal store.
  // We keep it in sync via chatHooks + explicit pushes after addOneMessage / Generate,
  // then snapshot() to get live Turn[] for rendering.
  const { runtime, ownStore } = useMemo(() => {
    const store = createTurnStore(chat);
    const rt = createSTContext({
      chat,
      chatHooks: {
        onEdit: (_index, message) => {
          store.updateMessage(_index, {
            mes: message.mes,
            name: message.name,
            is_user: message.is_user,
            is_system: message.is_system,
            extra: message.extra,
          });
          setRevision((r) => r + 1);
        },
        onPush: (messages) => {
          messages.forEach((m) => store.pushMessage(m));
          setRevision((r) => r + 1);
        },
        onDelete: (index) => {
          store.deleteMessage(index);
          setRevision((r) => r + 1);
        },
      },
    });
    return { runtime: rt, ownStore: store };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);

  // Snapshot is re-read every render via revision so Turn list stays live.
  const liveChat = ownStore.snapshot();
  const ctx = runtime.getContext();

  const handleSend = useCallback(() => {
    const mes = input.trim();
    if (!mes) return;
    const message = ctx.addOneMessage({ is_user: true, name: ctx.name1, mes });
    ownStore.pushMessage(message);
    setRevision((r) => r + 1);
    setInput('');
  }, [input, ctx, ownStore]);

  const handleFakeGenerate = useCallback(() => {
    const result = ctx.Generate({
      text: 'This is a fake generated reply from the surface contract slice.',
    });
    ownStore.pushMessage(result.message);
    setRevision((r) => r + 1);
  }, [ctx, ownStore]);

  const handleEditFirst = useCallback(() => {
    const first = ctx.chat[0];
    if (!first) return;
    first.mes = `${first.mes} [edited via surface]`;
    // Proxy setter triggers onEdit hook, which syncs ownStore and bumps revision.
  }, [ctx]);

  const rootClass = composeClass(SURFACE_ROOT_CLASSES, className);

  return (
    <div className={rootClass}>
      <section className="chat-hero">
        <span className="chat-hero-eyebrow">ydltavern/play · contract-slice</span>
        <h1 className="chat-hero-title">
          <span className="hero-line-1">Live Turn store</span>
          <span className="hero-line-2">backed by ST context.</span>
        </h1>
        <p className="chat-hero-lede">
          A thin contract consumer: fixture imported into a live{' '}
          <code>createSTContext</code> runtime, Turn list projected from a
          mirrored store snapshot, send / generate / edit wired to the real
          proxy, and diagnostics driven by actual event dispatch.
        </p>
        <div className="live-badge-row">
          <span className="live-badge" key={`length-${revision}`}>
            ctx.chat.length = {ctx.chat.length}
          </span>
          <span className="live-badge" key={`turns-${revision}`}>
            turns = {liveChat.turns.length}
          </span>
        </div>
        <dl className="chat-meta">
          <div>
            <dt>chat.id</dt>
            <dd>
              <code>{liveChat.id}</code>
            </dd>
          </div>
          <div>
            <dt>title</dt>
            <dd>{liveChat.meta.title ?? 'Untitled'}</dd>
          </div>
          <div>
            <dt>turns</dt>
            <dd>{liveChat.turns.length}</dd>
          </div>
          <div>
            <dt>source_format</dt>
            <dd>
              <code>{liveChat.meta.source_format ?? 'native'}</code>
            </dd>
          </div>
        </dl>
      </section>

      <section className="chat-stream" aria-label="Turn stream">
        <header className="section-marker">
          <span className="section-marker-rule" aria-hidden="true" />
          <span className="section-marker-label">01 · turn renderer</span>
        </header>
        <div className="turn-stream">
          {liveChat.turns.map((turn) => (
            <TurnView key={turn.id} turn={turn} />
          ))}
        </div>

        <div className="chat-controls">
          <div className="chat-input-row">
            <input
              className="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Type a message and press Enter…"
              aria-label="Message input"
            />
            <button
              type="button"
              className="chat-button chat-button-send"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
          <div className="chat-actions">
            <button
              type="button"
              className="chat-button chat-button-generate"
              onClick={handleFakeGenerate}
            >
              Fake Generate
            </button>
            <button
              type="button"
              className="chat-button chat-button-edit"
              onClick={handleEditFirst}
            >
              Edit first message
            </button>
          </div>
        </div>
      </section>

      {showDiagnostics ? (
        <section className="chat-diagnostics" aria-label="Compatibility and engine diagnostics">
          <header className="section-marker">
            <span className="section-marker-rule" aria-hidden="true" />
            <span className="section-marker-label">02 · diagnostics</span>
          </header>
          <div className="diag-stack">
            <STDiagnosticsPanel runtime={runtime} />
            <EngineCorePreviewPanel chat={liveChat} />
            <PromptCriticalPanel runtime={runtime} chat={liveChat} />
            <SlashDiagnosticsPanel runtime={runtime} />
            <ImportersPanel />
          </div>
        </section>
      ) : null}
    </div>
  );
}

function composeClass(base: readonly string[], extra: string | undefined): string {
  if (extra === undefined || extra.length === 0) {
    return base.join(' ');
  }
  return [...base, extra].join(' ');
}
