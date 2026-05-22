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

export { TavernProvider, useTavern } from './app/TavernProvider.js';
export type { TavernDrawer, TavernProviderProps, TavernRuntimeState } from './app/TavernProvider.js';
export { TavernShell } from './app/TavernShell.js';
export { MessageList } from './components/product/MessageList.js';
export { MessageComposer } from './components/product/MessageComposer.js';
export { GenerationControls } from './components/product/GenerationControls.js';
export { SwipeControls } from './components/product/SwipeControls.js';
export { SettingsPanel } from './components/product/SettingsPanel.js';
export { AssetsPanel } from './components/product/AssetsPanel.js';
export { ExtensionsPanel } from './components/product/ExtensionsPanel.js';
export { DevDiagnosticsPanel } from './components/product/DevDiagnosticsPanel.js';

export { PromptManagerInspector } from './components/product/PromptManagerInspector.js';
export type { PromptManagerInspectorProps } from './components/product/PromptManagerInspector.js';

export { WorldInfoInspector } from './components/product/WorldInfoInspector.js';
export type { WorldInfoInspectorProps } from './components/product/WorldInfoInspector.js';

export { STScriptInspector } from './components/product/STScriptInspector.js';
export type { STScriptInspectorProps } from './components/product/STScriptInspector.js';

export { ExtensionsInspector } from './components/product/ExtensionsInspector.js';
export type { ExtensionsInspectorProps } from './components/product/ExtensionsInspector.js';

export { ConnectorInspector } from './components/product/ConnectorInspector.js';
export type { ConnectorInspectorProps } from './components/product/ConnectorInspector.js';

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
