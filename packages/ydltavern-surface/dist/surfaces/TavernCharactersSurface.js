import { CharactersDrawer } from '../components/shell/drawers/CharactersDrawer.js';
import { createStandaloneDrawerSurface } from './standaloneDrawerSurface.js';
/**
 * Standalone Characters surface for embedding via SurfaceHost.
 * Renders the Characters drawer content as a hosted surface.
 */
export const TavernCharactersSurface = createStandaloneDrawerSurface({
    drawerId: 'characters',
    surfaceClassName: 'tavern-surface-characters',
    Drawer: CharactersDrawer,
});
//# sourceMappingURL=TavernCharactersSurface.js.map