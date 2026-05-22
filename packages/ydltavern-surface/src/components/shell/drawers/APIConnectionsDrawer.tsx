import React from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';

export function APIConnectionsDrawer({ drawers }: { drawers: DrawerState }) {
  return (
    <DrawerShell id="api-connections" drawers={drawers} side="left" title="API Connections">
      <div className="drawer-placeholder">
        <p>Provider selection, baseURL, secret_ref.</p>
        <p className="drawer-coming-soon">Coming in V5.</p>
      </div>
    </DrawerShell>
  );
}
