import { ExtensionsPanel } from '../components/product/ExtensionsPanel.js';

export interface TavernExtensionsSurfaceProps { readonly className?: string; }
const SURFACE_ROOT_CLASSES = ['ydltavern-surface', 'tavern-surface', 'tavern-surface-extensions'];
const PENDING_ITEMS = ['Extension loader & sandbox boundary', 'Registry, install, version pinning', 'STScript / slash command host', 'Built-in extensions catalog'] as const;

export function TavernExtensionsSurface({ className }: TavernExtensionsSurfaceProps): JSX.Element {
  const records = [
    {
      id: 'token-counter',
      manifest: {
        display_name: 'Token analysis and prompt chunk accounting',
        version: '1.0',
        hooks: { activate: 'Activate' },
      } satisfies import('@ydltavern/extensions').STExtensionManifest,
    },
    {
      id: 'regex',
      manifest: {
        display_name: 'GLOBAL/PRESET/SCOPED text transforms',
        version: '2.1',
        hooks: {},
      } satisfies import('@ydltavern/extensions').STExtensionManifest,
    },
    {
      id: 'quick-reply',
      manifest: {
        display_name: 'Quick reply sets and slash triggers',
        version: '1.5',
        hooks: { activate: 'Activate', install: 'Install' },
      } satisfies import('@ydltavern/extensions').STExtensionManifest,
    },
    {
      id: 'memory',
      manifest: {
        display_name: 'Summary insertion and update plans',
        version: '1.0',
        hooks: { activate: 'Activate' },
      } satisfies import('@ydltavern/extensions').STExtensionManifest,
    },
    {
      id: 'vectors',
      manifest: {
        display_name: 'Retrieval index/query/injection plans',
        version: '0.9',
        hooks: {},
      } satisfies import('@ydltavern/extensions').STExtensionManifest,
    },
    {
      id: 'loader',
      manifest: {
        display_name: 'ST-style manifest discovery, permission gate, load plan',
        version: '1.0.0',
        hooks: {},
      } satisfies import('@ydltavern/extensions').STExtensionManifest,
    },
  ];

  const activationContext: import('@ydltavern/extensions').STActivationContext = {
    installedExtras: new Set(),
    installedExtensions: new Set(records.map((r) => r.id)),
    disabledExtensions: new Set(['memory']),
    clientVersion: '1.13.0',
  };

  return (
    <div className={composeClass(SURFACE_ROOT_CLASSES, className)}>
      <ExtensionsPanel records={records} activationContext={activationContext} />
      <aside className="placeholder-card compact-card">
        <span className="placeholder-card-eyebrow">next wiring</span>
        <ul className="placeholder-list">
          {PENDING_ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
function composeClass(base: readonly string[], extra: string | undefined): string { return extra ? [...base, extra].join(' ') : base.join(' '); }
