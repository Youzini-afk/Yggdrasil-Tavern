import { sampleChat } from '../fixtures/sample-chat';
import { TurnView } from '../components/TurnView';
import { STDiagnosticsPanel } from '../components/STDiagnosticsPanel';
import { EngineCorePreviewPanel } from '../components/EngineCorePreviewPanel';
import { ImportersPanel } from '../components/ImportersPanel';

export function Chat(): JSX.Element {
  return (
    <div className="chat-route">
      <section className="chat-hero">
        <span className="chat-hero-eyebrow">Phase 3 · scaffold</span>
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
              <code>{sampleChat.id}</code>
            </dd>
          </div>
          <div>
            <dt>title</dt>
            <dd>{sampleChat.meta.title ?? 'Untitled'}</dd>
          </div>
          <div>
            <dt>turns</dt>
            <dd>{sampleChat.turns.length}</dd>
          </div>
          <div>
            <dt>source_format</dt>
            <dd>
              <code>{sampleChat.meta.source_format ?? 'native'}</code>
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
          {sampleChat.turns.map((turn) => (
            <TurnView key={turn.id} turn={turn} />
          ))}
        </div>
      </section>

      <section className="chat-diagnostics" aria-label="Compatibility and engine diagnostics">
        <header className="section-marker">
          <span className="section-marker-rule" aria-hidden="true" />
          <span className="section-marker-label">02 · diagnostics</span>
        </header>
        <div className="diag-stack">
          <STDiagnosticsPanel chat={sampleChat} />
          <EngineCorePreviewPanel chat={sampleChat} />
          <ImportersPanel />
        </div>
      </section>
    </div>
  );
}
