import { normalizeQuickReplySets } from '@ydltavern/extensions';
import type { STExtensionRecord } from '@ydltavern/extensions';
import { ChatList } from '../components/product/ChatList.js';
import { MessageComposer } from '../components/product/MessageComposer.js';
import { GenerationControls } from '../components/product/GenerationControls.js';
import { SettingsPanel } from '../components/product/SettingsPanel.js';
import { AssetsPanel } from '../components/product/AssetsPanel.js';
import { ExtensionsPanel } from '../components/product/ExtensionsPanel.js';
import { DevDiagnosticsPanel } from '../components/product/DevDiagnosticsPanel.js';
import { QuickReplyBar } from '../components/product/QuickReplyBar.js';
import { ThemedRoot } from '../components/product/themes/ThemedRoot.js';
import { useTavern, type TavernDrawer } from './TavernProvider.js';

const DRAWERS: readonly { readonly id: TavernDrawer; readonly label: string }[] = [
  { id: 'settings', label: 'Settings' },
  { id: 'assets', label: 'Assets' },
  { id: 'extensions', label: 'Extensions' },
  { id: 'dev', label: 'Dev' },
];

export function TavernShell(): JSX.Element {
  const tavern = useTavern();

  // Build quick reply sets from demo/extension data
  const qrSets = useQuickReplySets(tavern.extensionRecords);

  const handleQuickReply = (_id: string) => {
    // Visual feedback for now; real execution via host bridge later
    // eslint-disable-next-line no-console
    console.log('[QuickReply] triggered:', _id);
  };

  return (
    <ThemedRoot theme={tavern.theme}>
      <div className="tavern-product-shell">
        <header className="tavern-product-topbar">
          <MobileHamburger />
          <div className="tavern-brand-block">
            <span>YdlTavern</span>
            <strong>{tavern.liveChat.meta.title ?? 'Untitled chat'}</strong>
          </div>
          <nav className="tavern-topnav" aria-label="Tavern sections">
            <button className="topnav-button is-active" type="button">Chat</button>
            <button className="topnav-button" type="button">Characters</button>
            <button className="topnav-button" type="button">World Info</button>
            <button className="topnav-button" type="button">Presets</button>
          </nav>
          <div className="tavern-status-pills">
            <span>{tavern.liveChat.turns.length} turns</span>
            <span>{tavern.runtime.getContext().onlineStatus}</span>
          </div>
        </header>

        <div className="tavern-product-layout">
          <aside className="tavern-left-rail">
            <MobileCharacterChip />
            <div className="tablet-up">
              <div className="character-card-mini">
                <div className="character-avatar">YT</div>
                <h2>{tavern.runtime.getContext().name2}</h2>
                <p>ST-compatible context. Character, persona, preset, and worldbook state attach here.</p>
              </div>
              <GenerationControls />
            </div>
          </aside>

          <main className="tavern-chat-main">
            <ChatList />
            <QuickReplyBar sets={qrSets} onTrigger={handleQuickReply} />
            <MessageComposer />
          </main>

          <aside className={`tavern-right-drawer${tavern.mobileDrawerOpen ? ' is-open' : ''}`}>
            <MobileDrawerClose />
            <div className="drawer-tabs">
              {DRAWERS.map((drawer) => (
                <button
                  key={drawer.id}
                  type="button"
                  className={drawer.id === tavern.activeDrawer ? 'drawer-tab is-active' : 'drawer-tab'}
                  onClick={() => tavern.setActiveDrawer(drawer.id)}
                >
                  {drawer.label}
                </button>
              ))}
            </div>
            <DrawerPanel />
          </aside>
        </div>
      </div>
    </ThemedRoot>
  );
}

function DrawerPanel(): JSX.Element {
  const { activeDrawer, extensionRecords, extensionActivationContext } = useTavern();
  if (activeDrawer === 'assets') return <AssetsPanel />;
  if (activeDrawer === 'extensions') return (
    <ExtensionsPanel
      records={extensionRecords}
      activationContext={extensionActivationContext}
    />
  );
  if (activeDrawer === 'dev') return <DevDiagnosticsPanel />;
  return <SettingsPanel />;
}

function MobileHamburger(): JSX.Element {
  const { mobileDrawerOpen, setMobileDrawerOpen } = useTavern();
  return (
    <button
      type="button"
      className="mobile-hamburger"
      aria-label="Toggle drawer"
      aria-expanded={mobileDrawerOpen}
      onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
    >
      <span />
      <span />
      <span />
    </button>
  );
}

function MobileDrawerClose(): JSX.Element {
  const { setMobileDrawerOpen } = useTavern();
  return (
    <button
      type="button"
      className="mobile-drawer-close"
      aria-label="Close drawer"
      onClick={() => setMobileDrawerOpen(false)}
    >
      {'\u2715'}
    </button>
  );
}

function MobileCharacterChip(): JSX.Element {
  const tavern = useTavern();
  return (
    <div className="mobile-character-chip">
      <span className="character-chip-avatar">YT</span>
      <span className="character-chip-name">{tavern.runtime.getContext().name2}</span>
    </div>
  );
}

function useQuickReplySets(
  records: readonly STExtensionRecord[],
): readonly { id: string; name: string; enabled: boolean; items: readonly { id: string; label: string }[] }[] {
  if (records.length === 0) return [];
  const _qrRecord = records.find((r) => r.id === 'quick-reply');
  void _qrRecord;
  // Minimal demo to prove the bar works
  const demo = normalizeQuickReplySets([
    {
      id: 'demo',
      name: 'Demo Set',
      enabled: true,
      items: [
        { id: 'demo_1', label: 'Continue', slashCommand: '/continue' },
        { id: 'demo_2', label: 'Regenerate', slashCommand: '/regenerate' },
        { id: 'demo_3', label: 'Summarize', slashCommand: '/summarize' },
      ],
    },
  ]);
  return demo.sets.map((s) => ({
    id: s.id,
    name: s.name,
    enabled: s.enabled,
    items: s.items.map((i) => ({ id: i.id, label: i.label })),
  }));
}
