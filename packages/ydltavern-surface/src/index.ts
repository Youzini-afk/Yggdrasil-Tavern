// Public entry for @ydltavern/surface.
//
// This package is a reusable surface bundle — components and surface
// compositions for Yggdrasil-hosted YdlTavern UI. It is NOT an app shell:
// no router, no main.tsx, no Tauri config, no index.html. Hosts (Yggdrasil
// dashboards, embedding apps, demos) provide the shell.
//
// Stylesheet: import `@ydltavern/surface/styles/surface.css` once at the
// host level. All design tokens are scoped under `.ydltavern-surface` so
// the package never leaks tokens onto `:root`.

// ---- Leaf components ------------------------------------------------------

export { TurnView } from './components/TurnView.js';
export type { TurnViewProps } from './components/TurnView.js';

export { SubMessageView } from './components/SubMessageView.js';
export type { SubMessageViewProps } from './components/SubMessageView.js';

export { STDiagnosticsPanel } from './components/STDiagnosticsPanel.js';
export type { STDiagnosticsPanelProps } from './components/STDiagnosticsPanel.js';

export { EngineCorePreviewPanel } from './components/EngineCorePreviewPanel.js';
export type { EngineCorePreviewPanelProps } from './components/EngineCorePreviewPanel.js';

export { ImportersPanel } from './components/ImportersPanel.js';

export { PromptCriticalPanel } from './components/PromptCriticalPanel.js';
export type { PromptCriticalPanelProps } from './components/PromptCriticalPanel.js';

export { SlashDiagnosticsPanel } from './components/SlashDiagnosticsPanel.js';
export type { SlashDiagnosticsPanelProps } from './components/SlashDiagnosticsPanel.js';

// ---- Surface compositions -------------------------------------------------

export { TavernPlaySurface } from './surfaces/TavernPlaySurface.js';
export type { TavernPlaySurfaceProps } from './surfaces/TavernPlaySurface.js';

export { TavernSettingsSurface } from './surfaces/TavernSettingsSurface.js';
export type { TavernSettingsSurfaceProps } from './surfaces/TavernSettingsSurface.js';

export { TavernExtensionsSurface } from './surfaces/TavernExtensionsSurface.js';
export type { TavernExtensionsSurfaceProps } from './surfaces/TavernExtensionsSurface.js';

// ---- Fixtures (also exposed via the `./fixtures` subpath) -----------------

export { sampleChat } from './fixtures/sample-chat.js';
