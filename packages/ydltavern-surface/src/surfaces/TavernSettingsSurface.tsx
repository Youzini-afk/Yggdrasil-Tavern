export interface TavernSettingsSurfaceProps {
  /** Optional class merged onto the surface root. */
  readonly className?: string;
}

const SURFACE_ROOT_CLASSES = ['ydltavern-surface', 'tavern-surface', 'tavern-surface-settings'];

const PENDING_ITEMS = [
  'Connection profiles & secret refs (track C / D)',
  'Sampler defaults & preset import (track C / D)',
  'Persona, avatar, theme (track G)',
  'Extension permissions & install (track H)',
] as const;

/**
 * Settings surface placeholder. Scaffold only — there is no settings schema,
 * no persistence wiring, and no API contract here yet. Declared in
 * `surface.manifest.json` so hosts can route to it; the rendered placeholder
 * is honest about the gap.
 */
export function TavernSettingsSurface({ className }: TavernSettingsSurfaceProps): JSX.Element {
  const rootClass = composeClass(SURFACE_ROOT_CLASSES, className);

  return (
    <div className={rootClass}>
      <section className="placeholder-hero">
        <span className="placeholder-eyebrow">ydltavern/settings · scaffold</span>
        <h1 className="placeholder-title">
          <span className="placeholder-line-1">Settings,</span>
          <span className="placeholder-line-2">but not yet wired.</span>
        </h1>
        <p className="placeholder-lede">
          Tavern settings live here once the schema lands. For now this surface is
          a manifest placeholder — no persistence, no shape, no choices.
        </p>
      </section>

      <aside className="placeholder-card">
        <header className="placeholder-card-header">
          <span className="placeholder-card-eyebrow">pending</span>
          <h2 className="placeholder-card-title">What this surface owes you</h2>
        </header>
        <ul className="placeholder-list">
          {PENDING_ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

function composeClass(base: readonly string[], extra: string | undefined): string {
  if (extra === undefined || extra.length === 0) {
    return base.join(' ');
  }
  return [...base, extra].join(' ');
}
