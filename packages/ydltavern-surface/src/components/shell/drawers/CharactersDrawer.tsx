import React from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';

export function CharactersDrawer({ drawers }: { drawers: DrawerState }) {
  return (
    <DrawerShell id="characters" drawers={drawers} side="right" title="Characters">
      <div className="drawer-placeholder">
        <p>Character list, create/edit/import/export, group chat members.</p>
        <p className="drawer-coming-soon">Coming in V5.</p>
      </div>
    </DrawerShell>
  );
}
