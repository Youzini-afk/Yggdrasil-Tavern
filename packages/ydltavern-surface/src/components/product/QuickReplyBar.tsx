interface QuickReplyItem {
  readonly id: string;
  readonly label: string;
}

interface QuickReplySet {
  readonly id: string;
  readonly name: string;
  readonly enabled: boolean;
  readonly items: readonly QuickReplyItem[];
}

export interface QuickReplyBarProps {
  readonly sets: readonly QuickReplySet[];
  readonly onTrigger: (qrId: string) => void;
}

export function QuickReplyBar({ sets, onTrigger }: QuickReplyBarProps): JSX.Element | null {
  const visible = sets.filter((s) => s.enabled && s.items.length > 0);
  if (visible.length === 0) return null;

  return (
    <section className="tavern-quick-reply-bar">
      {visible.map((set) => (
        <div key={set.id} className="qr-set" data-set-id={set.id}>
          {set.name !== set.id ? (
            <span className="qr-set-label">{set.name}</span>
          ) : null}
          <div className="qr-items" role="group" aria-label={set.name}>
            {set.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className="qr-button"
                onClick={() => onTrigger(item.id)}
                title={item.label}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
