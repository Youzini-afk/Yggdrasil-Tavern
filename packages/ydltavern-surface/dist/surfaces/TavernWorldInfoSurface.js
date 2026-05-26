import { WorldInfoDrawer } from '../components/shell/drawers/WorldInfoDrawer.js';
import { createStandaloneDrawerSurface } from './standaloneDrawerSurface.js';
/** Standalone World Info surface for embedding via SurfaceHost. */
export const TavernWorldInfoSurface = createStandaloneDrawerSurface({
    drawerId: 'world-info',
    surfaceClassName: 'tavern-surface-world-info',
    Drawer: WorldInfoDrawer,
});
//# sourceMappingURL=TavernWorldInfoSurface.js.map