import React from 'react';
import type { DrawerState, DrawerId } from './useDrawers';
export interface DrawerShellProps {
    id: DrawerId;
    drawers: DrawerState;
    side: 'left' | 'right' | 'top';
    title: string;
    children: React.ReactNode;
}
/**
 * Optimized drawer shell for YdlTavern.
 * - Only renders children when the drawer has been open at least once.
 * - Keeps the drawer DOM hidden when not open so ST extensions can mount
 *   into territory nodes inside drawers even while closed.
 */
export declare function DrawerShell({ id, drawers, side, title, children }: DrawerShellProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DrawerShell.d.ts.map