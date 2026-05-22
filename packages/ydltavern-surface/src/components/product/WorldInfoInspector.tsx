import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WorldInfoInspectorProps {
  /** ST World Info routing result (or null/undefined if not yet routed). */
  readonly result?: RoutedEntries | null;
}

export interface RoutedEntries {
  readonly buckets: {
    readonly before?: readonly RoutedEntry[];
    readonly after?: readonly RoutedEntry[];
    readonly ANTop?: readonly RoutedEntry[];
    readonly ANBottom?: readonly RoutedEntry[];
    readonly atDepth?: readonly DepthEntry[];
    readonly EM?: readonly RoutedEntry[];
    readonly outlets?: Record<string, OutletBucket>;
  };
  readonly anPatch?: {
    readonly top: string;
    readonly original: string;
    readonly bottom: string;
    readonly patched: string;
  };
}

interface RoutedEntry {
  readonly id: string;
  readonly order: number;
  readonly content: string;
}

interface DepthEntry {
  readonly depth: number;
  readonly role: string;
  readonly content: string;
}

interface OutletBucket {
  readonly name: string;
  readonly entries: readonly RoutedEntry[];
}

// ---------------------------------------------------------------------------
// Bucket display order
// ---------------------------------------------------------------------------

type BucketKey = 'before' | 'after' | 'ANTop' | 'ANBottom' | 'atDepth' | 'EM';

const BUCKET_LABELS: Record<BucketKey, string> = {
  before: 'Before',
  after: 'After',
  ANTop: 'AN Top',
  ANBottom: 'AN Bottom',
  atDepth: 'At Depth',
  EM: 'EM',
};

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState(): JSX.Element {
  return (
    <section className="diag-panel diag-panel-world-info">
      <header className="diag-panel-header">
        <span className="diag-panel-eyebrow">@ydltavern/deep-port</span>
        <h2>World Info inspector</h2>
      </header>
      <p className="diag-panel-lede">
        No routing result yet. The World Info inspector displays activated entries
        grouped by bucket (before, after, ANTop, ANBottom, atDepth, EM, outlets),
        author note patch breakdown, and outlet summaries. Once the host bridge
        provides a <code>result</code> prop, the full routing output will appear here.
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Content preview helper
// ---------------------------------------------------------------------------

function truncate(text: string, max = 120): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3)}…`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function WorldInfoInspector({
  result,
}: WorldInfoInspectorProps): JSX.Element {
  if (!result) return <EmptyState />;

  const { buckets, anPatch } = result;
  const bucketKeys: BucketKey[] = [
    'before',
    'after',
    'ANTop',
    'ANBottom',
    'EM',
  ];

  return (
    <section className="diag-panel diag-panel-world-info">
      <header className="diag-panel-header">
        <span className="diag-panel-eyebrow">@ydltavern/deep-port</span>
        <h2>World Info inspector</h2>
        <p className="diag-panel-lede">
          Routed World Info entries grouped by insertion bucket. Each entry shows
          its order and truncated content preview. Author note patches detail how
          AN content is assembled from top, original, and bottom fragments.
        </p>
      </header>

      {/* Buckets */}
      <div className="diag-subsection">
        <h3>Activated entries by bucket</h3>
        <ul className="diag-bucket-list" role="list" aria-label="World Info buckets">
          {bucketKeys.map((key) => {
            const entries = buckets[key];
            if (!entries || entries.length === 0) return null;

            const label = BUCKET_LABELS[key] ?? key;
            const count = entries.length;

            return (
              <details key={key} className="diag-bucket-item" open>
                <summary className="diag-bucket-header" role="button" aria-label={`${label} bucket`}>
                  {label}
                  <span className="diag-bucket-count">
                    {count} entr{count === 1 ? 'y' : 'ies'}
                  </span>
                </summary>
                <div className="diag-bucket-body">
                  <ul className="diag-list" role="list" aria-label={`${label} entries`}>
                    {(entries as RoutedEntry[]).map((entry, idx) => (
                      <li key={entry.id ?? idx} className="diag-list-item">
                        <span className="diag-list-key">{entry.id}</span>
                        <span className="diag-list-pos">order {entry.order}</span>
                        <span className="diag-list-text">{truncate(entry.content)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            );
          })}

          {/* Outlets */}
          {buckets.outlets && Object.keys(buckets.outlets).length > 0 ? (
            Object.entries(buckets.outlets).map(([name, outlet]) => {
              const count = outlet.entries.length;
              return (
                <details key={`outlet-${name}`} className="diag-bucket-item" open>
                  <summary className="diag-bucket-header" role="button" aria-label={`Outlet ${name}`}>
                    outlet: {name}
                    <span className="diag-bucket-count">
                      {count} entr{count === 1 ? 'y' : 'ies'}
                    </span>
                  </summary>
                  <div className="diag-bucket-body">
                    <ul className="diag-list" role="list" aria-label={`Outlet ${name} entries`}>
                      {outlet.entries.map((entry, idx) => (
                        <li key={entry.id ?? idx} className="diag-list-item">
                          <span className="diag-list-key">{entry.id}</span>
                          <span className="diag-list-pos">order {entry.order}</span>
                          <span className="diag-list-text">{truncate(entry.content)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              );
            })
          ) : (
            <p className="diag-footnote">No outlet entries routed.</p>
          )}

          {/* atDepth entries rendered with depth/role */}
          {buckets.atDepth && buckets.atDepth.length > 0 ? null : (
            <p className="diag-footnote">No atDepth entries routed.</p>
          )}
        </ul>
      </div>

      {/* Author note patch */}
      {anPatch ? (
        <div className="diag-subsection">
          <h3>Author note patch</h3>
          <div className="diag-an-patch" aria-label="Author note patch breakdown">
            <div className="diag-an-patch-row">
              <span className="diag-an-patch-label">top</span>
              <span className="diag-list-text">{truncate(anPatch.top, 80)}</span>
            </div>
            <div className="diag-an-patch-row">
              <span className="diag-an-patch-label">original</span>
              <span className="diag-list-text">{truncate(anPatch.original, 80)}</span>
            </div>
            <div className="diag-an-patch-row">
              <span className="diag-an-patch-label">bottom</span>
              <span className="diag-list-text">{truncate(anPatch.bottom, 80)}</span>
            </div>
            <div className="diag-an-patch-row">
              <span className="diag-an-patch-label" />
              <span className="diag-badge diag-badge-input">→</span>
              <span className="diag-list-text diag-an-patch-arrow">
                {truncate(anPatch.patched, 120)}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
