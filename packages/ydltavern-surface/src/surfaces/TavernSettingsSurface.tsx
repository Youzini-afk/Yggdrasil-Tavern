import { SettingsPanel } from '../components/product/SettingsPanel.js';

export interface TavernSettingsSurfaceProps { readonly className?: string; }
const SURFACE_ROOT_CLASSES = ['ydltavern-surface', 'tavern-surface', 'tavern-surface-settings'];
const PENDING_ITEMS = ['Connection profiles & secret refs', 'Sampler defaults & preset import', 'Persona, avatar, theme', 'Extension permissions & install'] as const;

export function TavernSettingsSurface({ className }: TavernSettingsSurfaceProps): JSX.Element {
  return <div className={composeClass(SURFACE_ROOT_CLASSES, className)}><SettingsPanel /><aside className="placeholder-card compact-card"><span className="placeholder-card-eyebrow">next wiring</span><ul className="placeholder-list">{PENDING_ITEMS.map((item) => <li key={item}>{item}</li>)}</ul></aside></div>;
}
function composeClass(base: readonly string[], extra: string | undefined): string { return extra ? [...base, extra].join(' ') : base.join(' '); }
