import { useEffect } from 'react';
import { normalizeQuickReplySets } from '@ydltavern/extensions';
import type { STExtensionRecord } from '@ydltavern/extensions';
import { SendForm } from '../components/product/Composer/SendForm.js';
import { MessageList } from '../components/product/MessageList.js';
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

  useEffect(() => {
    if (tavern.needsApiConnection) {
      drawers.open('api-connections');
    }
  }, [tavern.needsApiConnection, drawers]);

  // Escape closes active drawer unless focus is inside a textarea/input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (!drawers.openId) return;
      const active = document.activeElement;
      if (active instanceof HTMLTextAreaElement) return;
      if (active instanceof HTMLInputElement && (active.type === 'text' || active.type === 'search')) return;
      e.preventDefault();
      drawers.close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [drawers]);

  const handleQuickReply = (id: string) => {
    if (!id) return;
    tavern.pushSystemNotice('Quick reply is not yet available on this surface.');
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
          <MessageList
            onOpenApiConnections={() => drawers.open('api-connections')}
            onOpenCharacters={() => drawers.open('characters')}
            onOpenExtensions={() => drawers.open('extensions')}
          />
          <QuickReplyBar sets={qrSets} onTrigger={handleQuickReply} />
          <SendForm
            onSend={(text) => tavern.sendMessage(text)}
            onContinue={() => tavern.continueLastReply()}
            onImpersonate={() => tavern.impersonate()}
            onStop={() => tavern.cancelGeneration()}
            onOptions={() => {
              // TODO Phase B: open options menu (slash commands, attach, etc.)
            }}
            isGenerating={tavern.isGenerating}
            needsApiConnection={tavern.needsApiConnection}
            onOpenApiConnections={() => drawers.open('api-connections')}
          />
        </Sheld>

        <div id="movingDivs" data-extension-territory />

        {/* Hidden extension territory shells so ST extensions can query them even before first drawer open. */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <div id="extensions_settings" data-extension-territory />
          <div id="extensions_settings2" data-extension-territory />
        </div>

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
