import { MessageComposer } from '../components/product/MessageComposer.js';
import { MessageList } from '../components/product/MessageList.js';
import { GenerationControls } from '../components/product/GenerationControls.js';
import { SettingsPanel } from '../components/product/SettingsPanel.js';
import { AssetsPanel } from '../components/product/AssetsPanel.js';
import { ExtensionsPanel } from '../components/product/ExtensionsPanel.js';
import { DevDiagnosticsPanel } from '../components/product/DevDiagnosticsPanel.js';
import { useTavern, type TavernDrawer } from './TavernProvider.js';

const DRAWERS: readonly { readonly id: TavernDrawer; readonly label: string }[] = [
  { id: 'settings', label: 'Settings' },
  { id: 'assets', label: 'Assets' },
  { id: 'extensions', label: 'Extensions' },
  { id: 'dev', label: 'Dev' },
];

export function TavernShell(): JSX.Element {
  const tavern = useTavern();
  return (
    <div className="tavern-product-shell">
      <header className="tavern-product-topbar">
        <div className="tavern-brand-block"><span>YdlTavern</span><strong>{tavern.liveChat.meta.title ?? 'Untitled chat'}</strong></div>
        <nav className="tavern-topnav" aria-label="Tavern sections"><button className="topnav-button is-active" type="button">Chat</button><button className="topnav-button" type="button">Characters</button><button className="topnav-button" type="button">World Info</button><button className="topnav-button" type="button">Presets</button></nav>
        <div className="tavern-status-pills"><span>{tavern.liveChat.turns.length} turns</span><span>{tavern.runtime.getContext().onlineStatus}</span></div>
      </header>
      <div className="tavern-product-layout">
        <aside className="tavern-left-rail"><div className="character-card-mini"><div className="character-avatar">YT</div><h2>{tavern.runtime.getContext().name2}</h2><p>ST-compatible context. Character, persona, preset, and worldbook state attach here.</p></div><GenerationControls /></aside>
        <main className="tavern-chat-main"><MessageList /><MessageComposer /></main>
        <aside className="tavern-right-drawer"><div className="drawer-tabs">{DRAWERS.map((drawer) => <button key={drawer.id} type="button" className={drawer.id === tavern.activeDrawer ? 'drawer-tab is-active' : 'drawer-tab'} onClick={() => tavern.setActiveDrawer(drawer.id)}>{drawer.label}</button>)}</div><DrawerPanel /></aside>
      </div>
    </div>
  );
}

function DrawerPanel(): JSX.Element {
  const { activeDrawer } = useTavern();
  if (activeDrawer === 'assets') return <AssetsPanel />;
  if (activeDrawer === 'extensions') return <ExtensionsPanel />;
  if (activeDrawer === 'dev') return <DevDiagnosticsPanel />;
  return <SettingsPanel />;
}
