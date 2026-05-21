export interface TavernExtensionsSurfaceProps {
  /** Optional class merged onto the surface root. */
  readonly className?: string;
}

const SURFACE_ROOT_CLASSES = ['ydltavern-surface', 'tavern-surface', 'tavern-surface-extensions'];

const PENDING_ITEMS = [
  'Extension loader & sandbox boundary (track H)',
  'Registry, install, version pinning (track H)',
  'STScript / slash command host (track E)',
  'Built-in extensions catalog (track F)',
] as const;

/**
 * Extensions surface placeholder. Scaffold only — there is no loader, no
 * registry, and no install flow here yet. The rendered placeholder names the
 * tracks that will land each piece, so the gap stays legible.
 */
export function TavernExtensionsSurface({
  className,
}: TavernExtensionsSurfaceProps): JSX.Element {
  const rootClass = composeClass(SURFACE_ROOT_CLASSES, className);

  return (
    <div className={rootClass}>
      <section className="placeholder-hero">
        <span className="placeholder-eyebrow">ydltavern/extensions · scaffold</span>
        <h1 className="placeholder-title">
          <span className="placeholder-line-1">Extensions,</span>
          <span className="placeholder-line-2">no loader, no registry.</span>
        </h1>
        <p className="placeholder-lede">
          The extension loader, registry, and install flow live in tracks H/I.
          This surface is a placeholder so the manifest can declare it without
          claiming behavior we haven&rsquo;t built.
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
