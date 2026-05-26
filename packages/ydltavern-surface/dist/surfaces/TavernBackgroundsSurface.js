import { BackgroundsDrawer } from '../components/shell/drawers/BackgroundsDrawer.js';
import { createStandaloneDrawerSurface } from './standaloneDrawerSurface.js';
/** Standalone Backgrounds surface for embedding via SurfaceHost. */
export const TavernBackgroundsSurface = createStandaloneDrawerSurface({
    drawerId: 'backgrounds',
    surfaceClassName: 'tavern-surface-backgrounds',
    Drawer: BackgroundsDrawer,
});
//# sourceMappingURL=TavernBackgroundsSurface.js.map