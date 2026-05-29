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
export type {
  BackgroundDisplaySettings,
  BackgroundEntry,
  CharacterEntry,
  ConnectionSettings as TavernConnectionSettings,
  FormattingSettings,
  PersistedSelection,
  PersonaEntry,
  SamplerSettings as TavernSamplerSettings,
  TavernDrawer,
  TavernProviderProps,
  TavernRuntimeState,
  TavernSettings,
  WorldBookEntry,
  WorldEntry,
} from './app/TavernProvider.js';
export { TavernShell } from './app/TavernShell.js';
export { ChatList } from './components/product/ChatList.js';
export { MessageList } from './components/product/MessageList.js';
export type { MessageListProps } from './components/product/MessageList.js';
export { WelcomeScreen } from './components/product/WelcomeScreen.js';
export type { WelcomeScreenProps } from './components/product/WelcomeScreen.js';
export { MessageComposer } from './components/product/MessageComposer.js';
export { GenerationControls } from './components/product/GenerationControls.js';
export { SwipeControls } from './components/product/SwipeControls.js';
export { SettingsPanel } from './components/product/SettingsPanel.js';
export { AssetsPanel } from './components/product/AssetsPanel.js';
export { ExtensionsPanel } from './components/product/ExtensionsPanel.js';
export { DevDiagnosticsPanel } from './components/product/DevDiagnosticsPanel.js';
export { QuickReplyBar } from './components/product/QuickReplyBar.js';
export type { QuickReplyBarProps } from './components/product/QuickReplyBar.js';
export { ThemedRoot } from './components/product/themes/ThemedRoot.js';
export type { ThemedRootProps } from './components/product/themes/ThemedRoot.js';
export { BUILT_IN_THEMES, getThemeById } from './components/product/themes/built-in-themes.js';
export type { TavernTheme, TavernThemeSettings, ThemeDensity } from './components/product/themes/theme-types.js';
export {
  ConnectionForm,
  SamplerForm,
  PersonaForm,
  ThemeForm,
} from './components/product/Settings/index.js';
export type {
  ConnectionSettings,
  SamplerSettings,
  PersonaSettings,
  TavernThemeSettings as ThemeSettings,
} from './components/product/Settings/index.js';

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

// ---- Shell primitives (V2) ------------------------------------------------

export { useDrawers } from './components/shell/useDrawers.js';
export type { DrawerId, DrawerState } from './components/shell/useDrawers.js';
export { TopBar } from './components/shell/TopBar.js';
export { DrawerShell } from './components/shell/DrawerShell.js';
export type { DrawerShellProps } from './components/shell/DrawerShell.js';
export { Sheld } from './components/shell/Sheld.js';

export {
  AIConfigDrawer,
  APIConnectionsDrawer,
  AdvancedFormattingDrawer,
  WorldInfoDrawer,
  UserSettingsDrawer,
  BackgroundsDrawer,
  ExtensionsDrawer,
  PersonaDrawer,
  CharactersDrawer,
} from './components/shell/drawers/index.js';

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

export { TavernCharactersSurface } from './surfaces/TavernCharactersSurface.js';
export type { TavernCharactersSurfaceProps } from './surfaces/TavernCharactersSurface.js';

export { TavernWorldInfoSurface } from './surfaces/TavernWorldInfoSurface.js';
export type { TavernWorldInfoSurfaceProps } from './surfaces/TavernWorldInfoSurface.js';

export { TavernPersonaSurface } from './surfaces/TavernPersonaSurface.js';
export type { TavernPersonaSurfaceProps } from './surfaces/TavernPersonaSurface.js';

export { TavernAIResponseConfigSurface } from './surfaces/TavernAIResponseConfigSurface.js';
export type { TavernAIResponseConfigSurfaceProps } from './surfaces/TavernAIResponseConfigSurface.js';

export { TavernUserSettingsSurface } from './surfaces/TavernUserSettingsSurface.js';
export type { TavernUserSettingsSurfaceProps } from './surfaces/TavernUserSettingsSurface.js';

export { TavernBackgroundsSurface } from './surfaces/TavernBackgroundsSurface.js';
export type { TavernBackgroundsSurfaceProps } from './surfaces/TavernBackgroundsSurface.js';

export {
  mountTavernPlaySurface,
  mountTavernSettingsSurface,
  mountTavernExtensionsSurface,
  mountTavernCharactersSurface,
  mountTavernWorldInfoSurface,
  mountTavernPersonaSurface,
  mountTavernAIResponseConfigSurface,
  mountTavernUserSettingsSurface,
  mountTavernBackgroundsSurface,
  type MountFn,
} from './surfaces/mount.js';

// ---- Fixtures (also exposed via the `./fixtures` subpath) -----------------

export { createEmptyChat, sampleChat } from './fixtures/sample-chat.js';

// ---- Formatting ------------------------------------------------------------

export {
  formatMessage,
  registerPreMarkdownHook,
  registerPreSanitizeHook,
  registerPostRenderHook,
  getConverter,
  createConverter,
  sanitizeChatHtml,
  ensureDOMPurifyHooks,
  type FormatMessageOptions,
  type PreMarkdownHook,
  type PreSanitizeHtmlHook,
  type PostRenderHook,
  type FormatRenderCtx,
} from './formatting/index.js';
