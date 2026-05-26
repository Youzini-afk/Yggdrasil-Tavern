import { AIConfigDrawer } from '../components/shell/drawers/AIConfigDrawer.js';
import { createStandaloneDrawerSurface } from './standaloneDrawerSurface.js';
/** Standalone AI Response Configuration surface for embedding via SurfaceHost. */
export const TavernAIResponseConfigSurface = createStandaloneDrawerSurface({
    drawerId: 'ai-config',
    surfaceClassName: 'tavern-surface-ai-response-config',
    Drawer: AIConfigDrawer,
});
//# sourceMappingURL=TavernAIResponseConfigSurface.js.map