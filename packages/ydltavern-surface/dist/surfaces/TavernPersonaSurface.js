import { PersonaDrawer } from '../components/shell/drawers/PersonaDrawer.js';
import { createStandaloneDrawerSurface } from './standaloneDrawerSurface.js';
/** Standalone Persona surface for embedding via SurfaceHost. */
export const TavernPersonaSurface = createStandaloneDrawerSurface({
    drawerId: 'persona',
    surfaceClassName: 'tavern-surface-persona',
    Drawer: PersonaDrawer,
});
//# sourceMappingURL=TavernPersonaSurface.js.map