import { ExtensionsPanel } from '../components/product/ExtensionsPanel.js';

export interface TavernExtensionsSurfaceProps { readonly className?: string; }
const SURFACE_ROOT_CLASSES = ['ydltavern-surface', 'tavern-surface', 'tavern-surface-extensions'];
const PENDING_ITEMS = ['Extension loader & sandbox boundary', 'Registry, install, version pinning', 'STScript / slash command host', 'Built-in extensions catalog'] as const;

export function TavernExtensionsSurface({ className }: TavernExtensionsSurfaceProps): JSX.Element {
  return <div className={composeClass(SURFACE_ROOT_CLASSES, className)}><ExtensionsPanel /><aside className="placeholder-card compact-card"><span className="placeholder-card-eyebrow">next wiring</span><ul className="placeholder-list">{PENDING_ITEMS.map((item) => <li key={item}>{item}</li>)}</ul></aside></div>;
}
function composeClass(base: readonly string[], extra: string | undefined): string { return extra ? [...base, extra].join(' ') : base.join(' '); }
