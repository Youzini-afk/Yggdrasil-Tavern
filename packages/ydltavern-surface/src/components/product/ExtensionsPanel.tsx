import {
  planActivateAll,
  STDisabledExtensionsStore,
  type STExtensionRecord,
  type STActivationContext,
} from '@ydltavern/extensions';
import { useState, useMemo, useCallback } from 'react';

export interface ExtensionsPanelProps {
  readonly records?: readonly STExtensionRecord[];
  readonly activationContext?: STActivationContext;
}

export function ExtensionsPanel({
  records = [],
  activationContext,
}: ExtensionsPanelProps): JSX.Element {
  const [disabledStore] = useState(() => new STDisabledExtensionsStore(readDisabledFromLs()));
  const [, refresh] = useState(0);

  const plan = useMemo(() => {
    if (records.length === 0 || activationContext === undefined) return undefined;
    return planActivateAll({
      records,
      ctx: activationContext,
      basePath: (id: string) => `/scripts/extensions/${id}`,
    });
  }, [records, activationContext]);

  const handleToggle = useCallback((id: string) => {
    if (disabledStore.isDisabled(id)) {
      disabledStore.enable(id);
    } else {
      disabledStore.disable(id);
    }
    saveDisabledToLs(disabledStore.list());
    refresh((r) => r + 1);
  }, [disabledStore]);

  // Recompute with current disabled state
  const livePlan = useMemo(() => {
    if (records.length === 0 || activationContext === undefined) return undefined;
    const ctx: STActivationContext = {
      ...activationContext,
      disabledExtensions: new Set(disabledStore.list()),
    };
    return planActivateAll({
      records,
      ctx,
      basePath: (id: string) => `/scripts/extensions/${id}`,
    });
  }, [records, activationContext, disabledStore]);

  return (
    <section className="drawer-panel product-extensions-panel">
      <h2>Extensions</h2>

      {records.length === 0 ? (
        <div className="panel-row">
          <span>No extensions registered. Install extensions to see them here.</span>
        </div>
      ) : null}

      {livePlan && (
        <>
          <div className="extension-summary">
            <span className="ext-count-badge ext-activated">
              {livePlan.activated.length} activated
            </span>
            {livePlan.skipped.length > 0 ? (
              <span className="ext-count-badge ext-skipped">
                {livePlan.skipped.length} skipped
              </span>
            ) : null}
          </div>

          <div className="extension-list">
            {records.map((r) => {
              const isDisabled = disabledStore.isDisabled(r.id);
              const skipReasons = livePlan.skipped
                .filter((s) => s.id === r.id)
                .flatMap((s) => s.reasons);
              const activated = !isDisabled && skipReasons.length === 0;

              return (
                <article key={r.id} className={`panel-row ext-row${activated ? '' : ' ext-row-inactive'}`}>
                  <div className="ext-row-header">
                    <div className="ext-info">
                      <strong className="ext-id">{r.id}</strong>
                      <span className="ext-display-name">{r.manifest.display_name}</span>
                      {r.manifest.version ? (
                        <span className="ext-version">v{r.manifest.version}</span>
                      ) : null}
                    </div>
                    <div className="ext-actions">
                      <span className={`ext-status${activated ? ' ext-status-ok' : skipReasons.length > 0 ? ' ext-status-skipped' : ' ext-status-disabled'}`}>
                        {activated ? 'activated' : skipReasons.length > 0 ? 'skipped' : 'disabled'}
                      </span>
                      <button
                        type="button"
                        className="ext-toggle"
                        onClick={() => handleToggle(r.id)}
                        aria-pressed={!isDisabled}
                      >
                        {isDisabled ? 'Enable' : 'Disable'}
                      </button>
                    </div>
                  </div>

                  {skipReasons.length > 0 ? (
                    <ul className="ext-reasons">
                      {skipReasons.map((reason, idx) => (
                        <li key={idx} className="ext-reason">{reason}</li>
                      ))}
                    </ul>
                  ) : null}

                  {r.manifest.hooks && Object.keys(r.manifest.hooks).length > 0 ? (
                    <div className="ext-hooks">
                      {Object.entries(r.manifest.hooks).map(([hook, exp]) => (
                        <span key={hook} className="ext-hook-badge">
                          {hook}:{exp}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </>
      )}

      {plan === undefined && records.length > 0 && (
        <div className="permission-card">
          <strong>Activation Context Missing</strong>
          <p>Extension activation plan cannot be computed without an activation context.</p>
        </div>
      )}
    </section>
  );
}

function readDisabledFromLs(): readonly string[] {
  try {
    const raw = localStorage.getItem('ydltavern.disabledExtensions');
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveDisabledToLs(list: readonly string[]): void {
  try { localStorage.setItem('ydltavern.disabledExtensions', JSON.stringify(list)); } catch { /* ignore */ }
}
