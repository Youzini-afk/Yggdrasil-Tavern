import type { Chat } from '@ydltavern/types';
import { TurnView } from '../components/TurnView.js';
import { STDiagnosticsPanel } from '../components/STDiagnosticsPanel.js';
import { EngineCorePreviewPanel } from '../components/EngineCorePreviewPanel.js';
import { ImportersPanel } from '../components/ImportersPanel.js';
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
  const rootClass = composeClass(SURFACE_ROOT_CLASSES, className);

  return (
    <div className={rootClass}>
      <section className="chat-hero">
        <span className="chat-hero-eyebrow">ydltavern/play · scaffold</span>
        <h1 className="chat-hero-title">
          <span className="hero-line-1">Turn-based</span>
          <span className="hero-line-2">conversation, projected.</span>
        </h1>
        <p className="chat-hero-lede">
          One fixture, three views: a Turn renderer wired to <code>@ydltavern/types</code>,
          the SillyTavern compatibility surface from <code>@ydltavern/st-compat</code>,
          and a prompt + request preview from <code>@ydltavern/engine-core</code>.
        </p>
        <dl className="chat-meta">
          <div>
            <dt>chat.id</dt>
            <dd>
              <code>{chat.id}</code>
            </dd>
          </div>
          <div>
            <dt>title</dt>
            <dd>{chat.meta.title ?? 'Untitled'}</dd>
          </div>
          <div>
            <dt>turns</dt>
            <dd>{chat.turns.length}</dd>
          </div>
          <div>
            <dt>source_format</dt>
            <dd>
              <code>{chat.meta.source_format ?? 'native'}</code>
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
          {chat.turns.map((turn) => (
            <TurnView key={turn.id} turn={turn} />
          ))}
        </div>
      </section>

      {showDiagnostics ? (
        <section className="chat-diagnostics" aria-label="Compatibility and engine diagnostics">
          <header className="section-marker">
            <span className="section-marker-rule" aria-hidden="true" />
            <span className="section-marker-label">02 · diagnostics</span>
          </header>
          <div className="diag-stack">
            <STDiagnosticsPanel chat={chat} />
            <EngineCorePreviewPanel chat={chat} />
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
