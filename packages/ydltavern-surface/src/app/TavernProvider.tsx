import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Chat } from '@ydltavern/types';
import { createSTContext, createTurnStore, type STContextRuntime } from '@ydltavern/st-compat';
import { type STExtensionRecord, type STActivationContext } from '@ydltavern/extensions';
import { sampleChat } from '../fixtures/sample-chat.js';
import { DARK_THEME, getThemeById } from '../components/product/themes/built-in-themes.js';
import type { TavernTheme, TavernThemeSettings } from '../components/product/themes/theme-types.js';

export type TavernDrawer = 'settings' | 'assets' | 'extensions' | 'dev';

export interface TavernSettings {
  activePreset: string;
  streaming: boolean;
  bannedTokens: string;
  logitBias: string;
  fastUImode: boolean;
  reducedMotion: boolean;
  showTimestamps: boolean;
  showTokenCounter: boolean;
  fontScale: number;
  chatWidth: number;
  avatarStyle: number;
}

const DEFAULT_SETTINGS: TavernSettings = {
  activePreset: 'default',
  streaming: true,
  bannedTokens: '',
  logitBias: '',
  fastUImode: false,
  reducedMotion: false,
  showTimestamps: false,
  showTokenCounter: false,
  fontScale: 1,
  chatWidth: 50,
  avatarStyle: 0,
};

function readSettings(): TavernSettings {
  try {
    const raw = localStorage.getItem('ydltavern.settings');
    if (raw) return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<TavernSettings>) };
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS;
}

function writeSettings(settings: TavernSettings): void {
  try { localStorage.setItem('ydltavern.settings', JSON.stringify(settings)); } catch { /* ignore */ }
}

export interface TavernRuntimeState {
  readonly runtime: STContextRuntime;
  readonly liveChat: Chat;
  readonly input: string;
  readonly activeDrawer: TavernDrawer;
  readonly showDiagnostics: boolean;
  readonly setInput: (value: string) => void;
  readonly setActiveDrawer: (drawer: TavernDrawer) => void;
  readonly sendMessage: () => void;
  readonly generateReply: () => void;
  readonly editFirstMessage: () => void;
  readonly swipeReply: () => void;
  readonly regenerateReply: () => void;

  // Settings
  readonly settings: TavernSettings;
  readonly updateSettings: (partial: Partial<TavernSettings>) => void;

  // Theme system
  readonly theme: TavernTheme;
  readonly themeSettings: TavernThemeSettings;
  readonly setThemeSettings: (settings: TavernThemeSettings) => void;

  // Mobile drawer state
  readonly mobileDrawerOpen: boolean;
  readonly setMobileDrawerOpen: (open: boolean) => void;

  // Extension data
  readonly extensionRecords: readonly STExtensionRecord[];
  readonly extensionActivationContext: STActivationContext | undefined;
}

export interface TavernProviderProps {
  readonly chat?: Chat;
  readonly showDiagnostics?: boolean;
  readonly children: ReactNode;
  readonly extensionRecords?: readonly STExtensionRecord[];
  readonly extensionActivationContext?: STActivationContext;
}

const TavernContext = createContext<TavernRuntimeState | undefined>(undefined);

/** Read TavernThemeSettings from localStorage */
function readThemeSettings(): TavernThemeSettings {
  try {
    const raw = localStorage.getItem('ydltavern.themeSettings');
    if (raw) {
      const parsed = JSON.parse(raw) as TavernThemeSettings;
      return parsed;
    }
  } catch { /* ignore */ }
  return {
    themeId: DARK_THEME.name,
    density: DARK_THEME.density,
    fontFamily: DARK_THEME.font.family,
  };
}

function writeThemeSettings(settings: TavernThemeSettings): void {
  try { localStorage.setItem('ydltavern.themeSettings', JSON.stringify(settings)); } catch { /* ignore */ }
}

export function TavernProvider({
  chat = sampleChat,
  showDiagnostics = true,
  children,
  extensionRecords = [],
  extensionActivationContext,
}: TavernProviderProps): JSX.Element {
  const [revision, setRevision] = useState(0);
  const [input, setInput] = useState('');
  const [activeDrawer, setActiveDrawer] = useState<TavernDrawer>('settings');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [themeSettings, setThemeSettingsState] = useState<TavernThemeSettings>(readThemeSettings);
  const [settings, setSettings] = useState<TavernSettings>(readSettings);

  // Recompute TavernTheme when settings change
  const theme = useMemo(() => {
    const base = getThemeById(themeSettings.themeId);
    return {
      ...base,
      font: { ...base.font, family: themeSettings.fontFamily },
      density: themeSettings.density,
    } as TavernTheme;
  }, [themeSettings]);

  const setThemeSettings = useCallback((settings: TavernThemeSettings) => {
    setThemeSettingsState(settings);
    writeThemeSettings(settings);
  }, []);

  const updateSettings = useCallback((partial: Partial<TavernSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      writeSettings(next);
      return next;
    });
  }, []);

  const { runtime, ownStore } = useMemo(() => {
    const store = createTurnStore(chat);
    const rt = createSTContext({
      chat,
      chatHooks: {
        onEdit: (index, message) => {
          store.updateMessage(index, { mes: message.mes, name: message.name, is_user: message.is_user, is_system: message.is_system, extra: message.extra });
          setRevision((r) => r + 1);
        },
        onPush: (messages) => {
          messages.forEach((message) => store.pushMessage(message));
          setRevision((r) => r + 1);
        },
        onDelete: (index) => {
          store.deleteMessage(index);
          setRevision((r) => r + 1);
        },
      },
    });
    return { runtime: rt, ownStore: store };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);

  const ctx = runtime.getContext();
  void revision;
  const liveChat = ownStore.snapshot();

  const sendMessage = useCallback(() => {
    const mes = input.trim();
    if (mes.length === 0) return;
    const message = ctx.addOneMessage({ is_user: true, name: ctx.name1, mes });
    ownStore.pushMessage(message);
    setInput('');
    setRevision((r) => r + 1);
  }, [ctx, input, ownStore]);

  const generateReply = useCallback(() => {
    const result = ctx.Generate({ text: 'This is a fake generated reply from the YdlTavern product surface.' });
    ownStore.pushMessage(result.message);
    setRevision((r) => r + 1);
  }, [ctx, ownStore]);

  const editFirstMessage = useCallback(() => {
    const first = ctx.chat[0];
    if (first) first.mes = `${first.mes} [edited via surface]`;
  }, [ctx]);

  const swipeReply = useCallback(() => {
    const result = ctx.Generate({ text: '[ydltavern fake swipe] alternate response from surface controls.' });
    ownStore.pushMessage(result.message);
    setRevision((r) => r + 1);
  }, [ctx, ownStore]);

  const regenerateReply = useCallback(() => {
    const result = ctx.Generate({ text: '[ydltavern fake regenerate] replacement response from surface controls.' });
    ownStore.pushMessage(result.message);
    setRevision((r) => r + 1);
  }, [ctx, ownStore]);

  return (
    <TavernContext.Provider
      value={{
        runtime,
        liveChat,
        input,
        activeDrawer,
        showDiagnostics,
        setInput,
        setActiveDrawer,
        sendMessage,
        generateReply,
        editFirstMessage,
        swipeReply,
        regenerateReply,
        settings,
        updateSettings,
        theme,
        themeSettings,
        setThemeSettings,
        mobileDrawerOpen,
        setMobileDrawerOpen,
        extensionRecords,
        extensionActivationContext,
      }}
    >
      {children}
    </TavernContext.Provider>
  );
}

export function useTavern(): TavernRuntimeState {
  const context = useContext(TavernContext);
  if (context === undefined) throw new Error('useTavern must be used inside <TavernProvider>.');
  return context;
}
