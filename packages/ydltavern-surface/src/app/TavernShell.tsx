import { normalizeQuickReplySets } from '@ydltavern/extensions';
import type { STExtensionRecord } from '@ydltavern/extensions';
import { ChatList } from '../components/product/ChatList.js';
import { MessageComposer } from '../components/product/MessageComposer.js';
import { QuickReplyBar } from '../components/product/QuickReplyBar.js';
import { ThemedRoot } from '../components/product/themes/ThemedRoot.js';
import { useTavern } from './TavernProvider.js';
import { TopBar } from '../components/shell/TopBar.js';
import { Sheld } from '../components/shell/Sheld.js';
import { useDrawers } from '../components/shell/useDrawers.js';
import {
  AIConfigDrawer,
  APIConnectionsDrawer,
  AdvancedFormattingDrawer,
  WorldInfoDrawer,
  UserSettingsDrawer,
  BackgroundsDrawer,
  ExtensionsDrawer,
  PersonaDrawer,
  CharactersDrawer,
} from '../components/shell/drawers/index.js';

export function TavernShell(): JSX.Element {
  const tavern = useTavern();
  const drawers = useDrawers();

  // Build quick reply sets from demo/extension data
  const qrSets = useQuickReplySets(tavern.extensionRecords);

  const handleQuickReply = (_id: string) => {
    // Visual feedback for now; real execution via host bridge later
    // eslint-disable-next-line no-console
    console.log('[QuickReply] triggered:', _id);
  };

  return (
    <ThemedRoot theme={tavern.theme}>
      <div className="ydltavern-surface tavern-shell" data-drawer-open={drawers.openId ?? 'none'}>
        <TopBar drawers={drawers} />

        <div className="drawer-rail drawer-rail-left">
          <AIConfigDrawer drawers={drawers} />
          <APIConnectionsDrawer drawers={drawers} />
          <AdvancedFormattingDrawer drawers={drawers} />
          <WorldInfoDrawer drawers={drawers} />
          <UserSettingsDrawer drawers={drawers} />
          <BackgroundsDrawer drawers={drawers} />
          <ExtensionsDrawer drawers={drawers} />
          <PersonaDrawer drawers={drawers} />
        </div>

        <Sheld>
          <ChatList />
          <QuickReplyBar sets={qrSets} onTrigger={handleQuickReply} />
          <MessageComposer />
        </Sheld>

        <div className="drawer-rail drawer-rail-right">
          <CharactersDrawer drawers={drawers} />
        </div>

        {drawers.openId && (
          <button
            type="button"
            className="drawer-backdrop"
            onClick={drawers.close}
            aria-label="Close drawer"
          />
        )}
      </div>
    </ThemedRoot>
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
