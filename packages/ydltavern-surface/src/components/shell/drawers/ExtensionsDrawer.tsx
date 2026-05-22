import React from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';

export function ExtensionsDrawer({ drawers }: { drawers: DrawerState }) {
  return (
    <DrawerShell id="extensions" drawers={drawers} side="left" title="Extensions">
      <div className="drawer-placeholder">
        <p>Installed extensions, install/enable/disable, hooks.</p>
        <p className="drawer-coming-soon">Coming in V5.</p>
      </div>
    </DrawerShell>
  );
}
