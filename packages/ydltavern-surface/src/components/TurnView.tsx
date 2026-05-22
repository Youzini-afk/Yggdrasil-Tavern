import { activeVariant, type Turn } from '@ydltavern/types';
import { SubMessageView } from './SubMessageView.js';

export interface TurnViewProps {
  readonly turn: Turn;
}

const ROLE_LABEL: Record<Turn['role'], string> = {
  user: 'User',
  assistant: 'Assistant',
  system: 'System',
  tool: 'Tool',
};

/**
 * @deprecated W4: replaced by MessageBubble + MessageList. Will be removed in
 * a future round. Keep for backward compat with any external consumers that
 * still import this.
 */
export function TurnView({ turn }: TurnViewProps): JSX.Element {
  const variant = activeVariant(turn);
  const variantCount = turn.variants.length;
  const speakerName = turn.speaker?.name ?? ROLE_LABEL[turn.role];
  const swipePosition = `${turn.active_variant + 1} / ${variantCount}`;

  return (
    <article className={`turn turn-role-${turn.role}`} data-turn-index={turn.index}>
      <header className="turn-header">
        <div className="turn-identity">
          <span className="turn-role">{ROLE_LABEL[turn.role]}</span>
          <span className="turn-speaker">{speakerName}</span>
        </div>
        <div className="turn-meta">
          <button type="button" className="swipe swipe-prev" disabled aria-label="Previous variant">
            &#x2039;
          </button>
          <span className="swipe-position" title="active variant / total variants">
            {swipePosition}
          </span>
          <button type="button" className="swipe swipe-next" disabled aria-label="Next variant">
            &#x203a;
          </button>
        </div>
      </header>

      {variant === undefined ? (
        <p className="turn-empty">No active variant.</p>
      ) : (
        <div className="turn-body">
          {variant.subs.map((sub, idx) => (
            <SubMessageView key={`${turn.id}-sub-${idx}`} sub={sub} />
          ))}
        </div>
      )}

      {variant !== undefined && hasMeta(variant.meta) ? (
        <footer className="turn-footer">
          {variant.meta.model !== undefined ? <span>model: {variant.meta.model}</span> : null}
          {variant.meta.tokens !== undefined ? <span>tokens: {variant.meta.tokens}</span> : null}
          {variant.meta.latency_ms !== undefined ? (
            <span>latency: {variant.meta.latency_ms}ms</span>
          ) : null}
          {variant.meta.finish_reason !== undefined ? (
            <span>finish: {variant.meta.finish_reason}</span>
          ) : null}
        </footer>
      ) : null}
    </article>
  );
}

function hasMeta(meta: Turn['variants'][number]['meta']): boolean {
  return (
    meta.model !== undefined ||
    meta.tokens !== undefined ||
    meta.latency_ms !== undefined ||
    meta.finish_reason !== undefined
  );
}
