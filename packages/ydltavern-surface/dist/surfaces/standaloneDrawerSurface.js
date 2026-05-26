import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { TavernProvider } from '../app/TavernProvider.js';
import { useTavern } from '../app/TavernProvider.js';
import { ThemedRoot } from '../components/product/themes/ThemedRoot.js';
import { useDrawers } from '../components/shell/useDrawers.js';
/**
 * Creates a standalone surface that renders a drawer body in an always-open
 * harness, without the TavernShell rails/sheld around it.
 */
export function createStandaloneDrawerSurface({ drawerId, surfaceClassName, Drawer, }) {
    return function StandaloneDrawerSurface({ className, sessionId, projectId }) {
        return (_jsx("div", { className: composeClass(['ydltavern-surface', 'tavern-surface', surfaceClassName], className), children: _jsx(TavernProvider, { sessionId: sessionId, projectId: projectId, children: _jsx(StandaloneDrawerRoot, { drawerId: drawerId, Drawer: Drawer }) }) }));
    };
}
function StandaloneDrawerRoot({ drawerId, Drawer, }) {
    const tavern = useTavern();
    const drawers = useDrawers();
    // Force this surface's drawer to be open since it IS the surface.
    useEffect(() => {
        drawers.open(drawerId);
    }, [drawerId, drawers]);
    return (_jsx(ThemedRoot, { theme: tavern.theme, children: _jsx("div", { className: "tavern-standalone-surface", "data-drawer-open": drawers.openId ?? 'none', children: _jsx(Drawer, { drawers: drawers }) }) }));
}
function composeClass(base, extra) {
    return extra ? [...base, extra].join(' ') : base.join(' ');
}
//# sourceMappingURL=standaloneDrawerSurface.js.map