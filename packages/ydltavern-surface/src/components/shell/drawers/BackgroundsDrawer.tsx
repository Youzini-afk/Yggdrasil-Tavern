import React from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';

export function BackgroundsDrawer({ drawers }: { drawers: DrawerState }) {
  return (
    <DrawerShell id="backgrounds" drawers={drawers} side="left" title="Backgrounds">
      <div className="drawer-placeholder">
        <p>Background image browser, fit mode, upload.</p>
        <p className="drawer-coming-soon">Coming in V5.</p>
      </div>
    </DrawerShell>
  );
}
