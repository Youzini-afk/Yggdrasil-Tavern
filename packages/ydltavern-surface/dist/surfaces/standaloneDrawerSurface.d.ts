import { type ComponentType } from 'react';
import { type DrawerId, type DrawerState } from '../components/shell/useDrawers.js';
export interface StandaloneDrawerSurfaceProps {
    readonly className?: string;
    readonly sessionId?: string;
    readonly projectId?: string;
}
export interface CreateStandaloneDrawerSurfaceOptions {
    readonly drawerId: DrawerId;
    readonly surfaceClassName: string;
    readonly Drawer: ComponentType<{
        drawers: DrawerState;
    }>;
}
/**
 * Creates a standalone surface that renders a drawer body in an always-open
 * harness, without the TavernShell rails/sheld around it.
 */
export declare function createStandaloneDrawerSurface({ drawerId, surfaceClassName, Drawer, }: CreateStandaloneDrawerSurfaceOptions): (props: StandaloneDrawerSurfaceProps) => JSX.Element;
//# sourceMappingURL=standaloneDrawerSurface.d.ts.map