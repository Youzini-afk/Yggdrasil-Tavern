import React from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';
import { ExtensionsPanel } from '../../product/ExtensionsPanel';
import { useTavern } from '../../../app/TavernProvider';

export function ExtensionsDrawer({ drawers }: { drawers: DrawerState }) {
  const tavern = useTavern();

  return (
    <DrawerShell id="extensions" drawers={drawers} side="left" title="Extensions">
      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Installed</h3>
          <div className="preset-actions">
            <button type="button" className="menu_button" aria-label="Install extension">
              <i className="fa-solid fa-plus" /> Install
            </button>
            <button type="button" className="menu_button" aria-label="Refresh extensions">
              <i className="fa-solid fa-arrows-rotate" /> Refresh
            </button>
          </div>
        </header>
        <ExtensionsPanel
          records={tavern.extensionRecords}
          activationContext={tavern.extensionActivationContext}
        />
      </section>
    </DrawerShell>
  );
}
