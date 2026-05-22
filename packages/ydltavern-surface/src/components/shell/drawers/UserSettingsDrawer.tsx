import React from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';

export function UserSettingsDrawer({ drawers }: { drawers: DrawerState }) {
  return (
    <DrawerShell id="user-settings" drawers={drawers} side="left" title="User Settings">
      <div className="drawer-placeholder">
        <p>Theme picker, UI preferences, font scale.</p>
        <p className="drawer-coming-soon">Coming in V5.</p>
      </div>
    </DrawerShell>
  );
}
