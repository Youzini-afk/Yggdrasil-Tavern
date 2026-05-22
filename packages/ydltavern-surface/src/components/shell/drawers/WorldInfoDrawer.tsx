import React from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';

export function WorldInfoDrawer({ drawers }: { drawers: DrawerState }) {
  return (
    <DrawerShell id="world-info" drawers={drawers} side="left" title="World Info">
      <div className="drawer-placeholder">
        <p>World book list, entry editor, routing diagnostics.</p>
        <p className="drawer-coming-soon">Coming in V5.</p>
      </div>
    </DrawerShell>
  );
}
