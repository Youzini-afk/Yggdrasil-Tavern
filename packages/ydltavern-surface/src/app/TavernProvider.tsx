import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Chat, STChatMessage } from '@ydltavern/types';
import { createSTContext, createTurnStore, type STContextRuntime } from '@ydltavern/st-compat';
import { type STExtensionRecord, type STActivationContext } from '@ydltavern/extensions';
import { sampleChat } from '../fixtures/sample-chat.js';
import { getThemeById } from '../components/product/themes/built-in-themes.js';
import type { TavernTheme, TavernThemeSettings } from '../components/product/themes/theme-types.js';
import {
  DEFAULT_BACKGROUND_DISPLAY,
  DEFAULT_CONNECTION,
  DEFAULT_FORMATTING,
  DEFAULT_SAMPLER,
  DEFAULT_SELECTION,
  DEFAULT_SETTINGS,
  DEFAULT_THEME_SETTINGS,
  SEED_BACKGROUND,
  SEED_CHARACTER,
  SEED_PERSONA,
  SEED_WORLDBOOK,
  type TavernSettings,
} from '../state/defaults.js';
import {
  migrateSettingsV1ToV2,
  readBackgroundDisplaySettings,
  readBackgrounds,
  readCharacters,
  readConnectionState,
  readFormattingSettings,
  readPersonas,
  readSamplerSettings,
  readSelection,
  readTavernSettings,
  readThemeSettings,
  readWorldBooks,
  STORAGE_KEYS,
  writeConnectionState,
  writePersisted,
  writeThemeSettings,
} from '../state/persistence.js';
import type {
  BackgroundDisplaySettings,
  BackgroundEntry,
  CharacterEntry,
  ConnectionSettings,
  FormattingSettings,
  PersistedSelection,
  PersonaEntry,
  SamplerSettings,
  WorldBookEntry,
  WorldEntry,
} from '../types/state.js';

export type TavernDrawer = 'settings' | 'assets' | 'extensions' | 'dev';
export type { TavernSettings } from '../state/defaults.js';
export type {
  BackgroundDisplaySettings,
  BackgroundEntry,
  CharacterEntry,
  ConnectionSettings,
  FormattingSettings,
  PersistedSelection,
  PersonaEntry,
  SamplerSettings,
  WorldBookEntry,
  WorldEntry,
} from '../types/state.js';

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

  readonly settings: TavernSettings;
  readonly updateSettings: (partial: Partial<TavernSettings>) => void;
  readonly setActivePreset: (id: string) => void;

  readonly theme: TavernTheme;
  readonly themeSettings: TavernThemeSettings;
  readonly setThemeSettings: (settings: TavernThemeSettings) => void;

  readonly mobileDrawerOpen: boolean;
  readonly setMobileDrawerOpen: (open: boolean) => void;

  readonly extensionRecords: readonly STExtensionRecord[];
  readonly extensionActivationContext: STActivationContext | undefined;

  readonly samplerSettings: SamplerSettings;
  readonly updateSamplerSettings: (partial: Partial<SamplerSettings>) => void;

  readonly connectionSettings: ConnectionSettings;
  readonly updateConnectionSettings: (partial: Partial<ConnectionSettings>) => void;
  readonly connectionProfiles: Record<string, ConnectionSettings>;
  readonly saveConnectionProfile: (name: string) => void;
  readonly loadConnectionProfile: (name: string) => void;
  readonly deleteConnectionProfile: (name: string) => void;
  readonly activeConnectionProfile: string | null;

  readonly formattingSettings: FormattingSettings;
  readonly updateFormattingSettings: (partial: Partial<FormattingSettings>) => void;

  readonly backgroundDisplaySettings: BackgroundDisplaySettings;
  readonly setBackgroundFitMode: (mode: BackgroundDisplaySettings['fitMode']) => void;
  readonly setBackgroundAutoSelect: (enabled: boolean) => void;

  readonly characters: CharacterEntry[];
  readonly activeCharacterId: string | null;
  readonly setActiveCharacter: (id: string | null) => void;
  readonly createCharacter: (entry: Partial<CharacterEntry>) => string;
  readonly updateCharacter: (id: string, partial: Partial<CharacterEntry>) => void;
  readonly deleteCharacter: (id: string) => void;
  readonly duplicateCharacter: (id: string) => string | null;
  readonly importCharacter: (entry: CharacterEntry) => string;
  readonly exportCharacter: (id: string) => CharacterEntry | null;

  readonly personas: PersonaEntry[];
  readonly activePersonaId: string | null;
  readonly setActivePersona: (id: string | null) => void;
  readonly createPersona: (entry: Partial<PersonaEntry>) => string;
  readonly updatePersona: (id: string, partial: Partial<PersonaEntry>) => void;
  readonly deletePersona: (id: string) => void;
  readonly importPersona: (entry: PersonaEntry) => string;

  readonly worldBooks: WorldBookEntry[];
  readonly activeWorldBookId: string | null;
  readonly selectedWorldEntryId: string | null;
  readonly setActiveWorldBook: (id: string | null) => void;
  readonly setSelectedWorldEntry: (id: string | null) => void;
  readonly createWorldBook: (entry: Partial<WorldBookEntry>) => string;
  readonly updateWorldBook: (id: string, partial: Partial<WorldBookEntry>) => void;
  readonly deleteWorldBook: (id: string) => void;
  readonly createWorldEntry: (bookId: string, entry: Partial<WorldEntry>) => string | null;
  readonly updateWorldEntry: (bookId: string, uid: string, partial: Partial<WorldEntry>) => void;
  readonly deleteWorldEntry: (bookId: string, uid: string) => void;
  readonly duplicateWorldEntry: (bookId: string, uid: string) => string | null;

  readonly backgrounds: BackgroundEntry[];
  readonly activeBackgroundId: string | null;
  readonly setActiveBackground: (id: string | null) => void;
  readonly uploadBackground: (entry: Partial<BackgroundEntry>) => string;
  readonly deleteBackground: (id: string) => void;

  readonly resetSettings: (scope?: 'all' | 'sampler' | 'connection' | 'formatting' | 'theme') => void;

  readonly isGenerating: boolean;
  readonly cancelGeneration: () => void;
  readonly continueLastReply: () => void;
  readonly impersonate: () => void;
  readonly editMessage: (id: string | number, text: string) => void;
  readonly deleteMessage: (id: string | number) => void;
  readonly moveMessage: (id: string | number, direction: 'up' | 'down') => void;
  readonly copyMessage: (id: string | number) => void;
  readonly hideMessage: (id: string | number) => void;
  readonly unhideMessage: (id: string | number) => void;
  readonly swipeLeft: (id: string | number) => void;
  readonly swipeRight: (id: string | number) => void;
  readonly regenerateMessage: (id: string | number) => void;
  readonly branchMessage: (id: string | number) => void;
  readonly checkpointMessage: (id: string | number) => void;
}

export interface TavernProviderProps {
  readonly chat?: Chat;
  readonly showDiagnostics?: boolean;
  readonly children: ReactNode;
  readonly extensionRecords?: readonly STExtensionRecord[];
  readonly extensionActivationContext?: STActivationContext;
}

const TavernContext = createContext<TavernRuntimeState | undefined>(undefined);

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
  const [settings, setSettings] = useState<TavernSettings>(() => {
    migrateSettingsV1ToV2();
    return readTavernSettings();
  });
  const [samplerSettings, setSamplerSettings] = useState<SamplerSettings>(readSamplerSettings);
  const [connectionState, setConnectionState] = useState(readConnectionState);
  const [formattingSettings, setFormattingSettings] = useState<FormattingSettings>(readFormattingSettings);
  const [backgroundDisplaySettings, setBackgroundDisplaySettings] = useState<BackgroundDisplaySettings>(readBackgroundDisplaySettings);
  const [characters, setCharacters] = useState<CharacterEntry[]>(readCharacters);
  const [personas, setPersonas] = useState<PersonaEntry[]>(readPersonas);
  const [worldBooks, setWorldBooks] = useState<WorldBookEntry[]>(readWorldBooks);
  const [backgrounds, setBackgrounds] = useState<BackgroundEntry[]>(readBackgrounds);
  const [selection, setSelectionState] = useState<PersistedSelection>(readSelection);
  const [isGenerating] = useState(false);

  const theme = useMemo(() => {
    const base = getThemeById(themeSettings.themeId);
    return {
      ...base,
      font: { ...base.font, family: themeSettings.fontFamily },
      density: themeSettings.density,
    } as TavernTheme;
  }, [themeSettings]);

  const persistSelection = useCallback((next: PersistedSelection) => {
    setSelectionState(next);
    writePersisted(STORAGE_KEYS.selection, next);
  }, []);

  const patchSelection = useCallback((partial: Partial<PersistedSelection>) => {
    setSelectionState((prev) => {
      const next = { ...prev, ...partial };
      writePersisted(STORAGE_KEYS.selection, next);
      return next;
    });
  }, []);

  const setThemeSettings = useCallback((next: TavernThemeSettings) => {
    setThemeSettingsState(next);
    writeThemeSettings(next);
  }, []);

  const updateSettings = useCallback((partial: Partial<TavernSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      writePersisted(STORAGE_KEYS.settings, next);
      if (partial.activePreset !== undefined) patchSelection({ activePreset: partial.activePreset });
      return next;
    });
  }, [patchSelection]);

  const setActivePreset = useCallback((id: string) => {
    updateSettings({ activePreset: id });
  }, [updateSettings]);

  const updateSamplerSettings = useCallback((partial: Partial<SamplerSettings>) => {
    setSamplerSettings((prev) => {
      const next = { ...prev, ...partial };
      writePersisted(STORAGE_KEYS.sampler, next);
      return next;
    });
  }, []);

  const updateConnectionSettings = useCallback((partial: Partial<ConnectionSettings>) => {
    setConnectionState((prev) => {
      const next = { ...prev, current: { ...prev.current, ...partial } };
      writeConnectionState(next.current, next.profiles);
      return next;
    });
  }, []);

  const saveConnectionProfile = useCallback((name: string) => {
    const trimmed = name.trim();
    if (trimmed.length === 0) return;
    setConnectionState((prev) => {
      const next = { ...prev, profiles: { ...prev.profiles, [trimmed]: prev.current } };
      writeConnectionState(next.current, next.profiles);
      return next;
    });
    patchSelection({ activeConnectionProfile: trimmed });
  }, [patchSelection]);

  const loadConnectionProfile = useCallback((name: string) => {
    setConnectionState((prev) => {
      const profile = prev.profiles[name];
      if (profile === undefined) return prev;
      const next = { ...prev, current: profile };
      writeConnectionState(next.current, next.profiles);
      return next;
    });
    patchSelection({ activeConnectionProfile: name });
  }, [patchSelection]);

  const deleteConnectionProfile = useCallback((name: string) => {
    setConnectionState((prev) => {
      const { [name]: _removed, ...profiles } = prev.profiles;
      const next = { ...prev, profiles };
      writeConnectionState(next.current, next.profiles);
      return next;
    });
    if (selection.activeConnectionProfile === name) patchSelection({ activeConnectionProfile: null });
  }, [patchSelection, selection.activeConnectionProfile]);

  const updateFormattingSettings = useCallback((partial: Partial<FormattingSettings>) => {
    setFormattingSettings((prev) => {
      const next = { ...prev, ...partial };
      writePersisted(STORAGE_KEYS.formatting, next);
      return next;
    });
  }, []);

  const setBackgroundFitMode = useCallback((mode: BackgroundDisplaySettings['fitMode']) => {
    setBackgroundDisplaySettings((prev) => {
      const next = { ...prev, fitMode: mode };
      writePersisted(STORAGE_KEYS.backgroundDisplay, next);
      return next;
    });
  }, []);

  const setBackgroundAutoSelect = useCallback((enabled: boolean) => {
    setBackgroundDisplaySettings((prev) => {
      const next = { ...prev, autoSelectByCharacter: enabled };
      writePersisted(STORAGE_KEYS.backgroundDisplay, next);
      return next;
    });
  }, []);

  const setActiveCharacter = useCallback((id: string | null) => patchSelection({ activeCharacterId: id }), [patchSelection]);
  const setActivePersona = useCallback((id: string | null) => patchSelection({ activePersonaId: id }), [patchSelection]);
  const setActiveWorldBook = useCallback((id: string | null) => patchSelection({ activeWorldBookId: id }), [patchSelection]);
  const setSelectedWorldEntry = useCallback((id: string | null) => patchSelection({ selectedWorldEntryId: id }), [patchSelection]);
  const setActiveBackground = useCallback((id: string | null) => patchSelection({ activeBackgroundId: id }), [patchSelection]);

  const createCharacter = useCallback((entry: Partial<CharacterEntry>) => {
    const now = timestamp();
    const id = entry.id ?? createId('char');
    const nextEntry: CharacterEntry = { id, name: entry.name ?? 'New Character', ...entry, createdAt: entry.createdAt ?? now, updatedAt: entry.updatedAt ?? now };
    setCharacters((prev) => persistArray(STORAGE_KEYS.characters, [...prev, nextEntry]));
    patchSelection({ activeCharacterId: id });
    return id;
  }, [patchSelection]);

  const updateCharacter = useCallback((id: string, partial: Partial<CharacterEntry>) => {
    setCharacters((prev) => persistArray(STORAGE_KEYS.characters, prev.map((entry) => entry.id === id ? { ...entry, ...partial, id, updatedAt: timestamp() } : entry)));
  }, []);

  const deleteCharacter = useCallback((id: string) => {
    setCharacters((prev) => {
      const next = prev.filter((entry) => entry.id !== id);
      if (selection.activeCharacterId === id) patchSelection({ activeCharacterId: next[0]?.id ?? null });
      return persistArray(STORAGE_KEYS.characters, next);
    });
  }, [patchSelection, selection.activeCharacterId]);

  const duplicateCharacter = useCallback((id: string) => {
    const source = characters.find((entry) => entry.id === id);
    if (source === undefined) return null;
    return createCharacter({ ...source, id: createId('char'), name: `${source.name} Copy` });
  }, [characters, createCharacter]);

  const importCharacter = useCallback((entry: CharacterEntry) => {
    setCharacters((prev) => persistArray(STORAGE_KEYS.characters, upsertById(prev, entry)));
    patchSelection({ activeCharacterId: entry.id });
    return entry.id;
  }, [patchSelection]);

  const exportCharacter = useCallback((id: string) => characters.find((entry) => entry.id === id) ?? null, [characters]);

  const createPersona = useCallback((entry: Partial<PersonaEntry>) => {
    const now = timestamp();
    const id = entry.id ?? createId('persona');
    const nextEntry: PersonaEntry = { id, name: entry.name ?? 'New Persona', ...entry, createdAt: entry.createdAt ?? now, updatedAt: entry.updatedAt ?? now };
    setPersonas((prev) => persistArray(STORAGE_KEYS.personas, [...prev, nextEntry]));
    patchSelection({ activePersonaId: id });
    return id;
  }, [patchSelection]);

  const updatePersona = useCallback((id: string, partial: Partial<PersonaEntry>) => {
    setPersonas((prev) => persistArray(STORAGE_KEYS.personas, prev.map((entry) => entry.id === id ? { ...entry, ...partial, id, updatedAt: timestamp() } : entry)));
  }, []);

  const deletePersona = useCallback((id: string) => {
    setPersonas((prev) => {
      const next = prev.filter((entry) => entry.id !== id);
      if (selection.activePersonaId === id) patchSelection({ activePersonaId: next[0]?.id ?? null });
      return persistArray(STORAGE_KEYS.personas, next);
    });
  }, [patchSelection, selection.activePersonaId]);

  const importPersona = useCallback((entry: PersonaEntry) => {
    setPersonas((prev) => persistArray(STORAGE_KEYS.personas, upsertById(prev, entry)));
    patchSelection({ activePersonaId: entry.id });
    return entry.id;
  }, [patchSelection]);

  const createWorldBook = useCallback((entry: Partial<WorldBookEntry>) => {
    const now = timestamp();
    const id = entry.id ?? createId('wb');
    const nextEntry: WorldBookEntry = { id, name: entry.name ?? 'Untitled World Book', enabled: entry.enabled ?? false, entries: entry.entries ?? [], ...entry, createdAt: entry.createdAt ?? now, updatedAt: entry.updatedAt ?? now };
    setWorldBooks((prev) => persistArray(STORAGE_KEYS.worldbooks, [...prev, nextEntry]));
    patchSelection({ activeWorldBookId: id, selectedWorldEntryId: nextEntry.entries[0]?.uid ?? null });
    return id;
  }, [patchSelection]);

  const updateWorldBook = useCallback((id: string, partial: Partial<WorldBookEntry>) => {
    setWorldBooks((prev) => persistArray(STORAGE_KEYS.worldbooks, prev.map((entry) => entry.id === id ? { ...entry, ...partial, id, updatedAt: timestamp() } : entry)));
  }, []);

  const deleteWorldBook = useCallback((id: string) => {
    setWorldBooks((prev) => {
      const next = prev.filter((entry) => entry.id !== id);
      if (selection.activeWorldBookId === id) patchSelection({ activeWorldBookId: next[0]?.id ?? null, selectedWorldEntryId: next[0]?.entries[0]?.uid ?? null });
      return persistArray(STORAGE_KEYS.worldbooks, next);
    });
  }, [patchSelection, selection.activeWorldBookId]);

  const createWorldEntry = useCallback((bookId: string, entry: Partial<WorldEntry>) => {
    const uid = entry.uid ?? createId('wbe');
    const nextEntry: WorldEntry = {
      uid,
      key: entry.key ?? [],
      content: entry.content ?? '',
      position: entry.position ?? 'before_char',
      probability: entry.probability ?? 100,
      order: entry.order ?? 100,
      enabled: entry.enabled ?? true,
      ...entry,
    };
    let created = false;
    setWorldBooks((prev) => persistArray(STORAGE_KEYS.worldbooks, prev.map((book) => {
      if (book.id !== bookId) return book;
      created = true;
      return { ...book, entries: [...book.entries, nextEntry], updatedAt: timestamp() };
    })));
    if (created) patchSelection({ selectedWorldEntryId: uid });
    return created ? uid : null;
  }, [patchSelection]);

  const updateWorldEntry = useCallback((bookId: string, uid: string, partial: Partial<WorldEntry>) => {
    setWorldBooks((prev) => persistArray(STORAGE_KEYS.worldbooks, prev.map((book) => book.id === bookId ? { ...book, entries: book.entries.map((entry) => entry.uid === uid ? { ...entry, ...partial, uid } : entry), updatedAt: timestamp() } : book)));
  }, []);

  const deleteWorldEntry = useCallback((bookId: string, uid: string) => {
    setWorldBooks((prev) => persistArray(STORAGE_KEYS.worldbooks, prev.map((book) => {
      if (book.id !== bookId) return book;
      const entries = book.entries.filter((entry) => entry.uid !== uid);
      if (selection.selectedWorldEntryId === uid) patchSelection({ selectedWorldEntryId: entries[0]?.uid ?? null });
      return { ...book, entries, updatedAt: timestamp() };
    })));
  }, [patchSelection, selection.selectedWorldEntryId]);

  const duplicateWorldEntry = useCallback((bookId: string, uid: string) => {
    const source = worldBooks.find((book) => book.id === bookId)?.entries.find((entry) => entry.uid === uid);
    if (source === undefined) return null;
    return createWorldEntry(bookId, { ...source, uid: createId('wbe'), comment: source.comment ? `${source.comment} Copy` : 'Copy' });
  }, [createWorldEntry, worldBooks]);

  const uploadBackground = useCallback((entry: Partial<BackgroundEntry>) => {
    const id = entry.id ?? createId('bg');
    const nextEntry: BackgroundEntry = { id, name: entry.name ?? 'New Background', url: entry.url ?? '', ...entry };
    setBackgrounds((prev) => persistArray(STORAGE_KEYS.backgrounds, [...prev, nextEntry]));
    patchSelection({ activeBackgroundId: id });
    return id;
  }, [patchSelection]);

  const deleteBackground = useCallback((id: string) => {
    setBackgrounds((prev) => {
      const next = prev.filter((entry) => entry.id !== id);
      if (selection.activeBackgroundId === id) patchSelection({ activeBackgroundId: next[0]?.id ?? null });
      return persistArray(STORAGE_KEYS.backgrounds, next);
    });
  }, [patchSelection, selection.activeBackgroundId]);

  const resetSettings = useCallback((scope: 'all' | 'sampler' | 'connection' | 'formatting' | 'theme' = 'all') => {
    if (scope === 'all' || scope === 'sampler') {
      setSamplerSettings(DEFAULT_SAMPLER);
      writePersisted(STORAGE_KEYS.sampler, DEFAULT_SAMPLER);
    }
    if (scope === 'all' || scope === 'connection') {
      setConnectionState((prev) => ({ current: DEFAULT_CONNECTION, profiles: prev.profiles }));
      writeConnectionState(DEFAULT_CONNECTION, connectionState.profiles);
      patchSelection({ activeConnectionProfile: null });
    }
    if (scope === 'all' || scope === 'formatting') {
      setFormattingSettings(DEFAULT_FORMATTING);
      writePersisted(STORAGE_KEYS.formatting, DEFAULT_FORMATTING);
      setBackgroundDisplaySettings(DEFAULT_BACKGROUND_DISPLAY);
      writePersisted(STORAGE_KEYS.backgroundDisplay, DEFAULT_BACKGROUND_DISPLAY);
    }
    if (scope === 'all' || scope === 'theme') setThemeSettings(DEFAULT_THEME_SETTINGS);
    if (scope === 'all') {
      setSettings(DEFAULT_SETTINGS);
      writePersisted(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
      persistSelection({ ...selection, activePreset: DEFAULT_SETTINGS.activePreset, activeConnectionProfile: null });
    }
  }, [connectionState.profiles, patchSelection, persistSelection, selection, setThemeSettings]);

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
    editStoreMessage(ownStore, 0, (message) => ({ ...message, mes: `${message.mes ?? ''} [edited via surface]` }));
    setRevision((r) => r + 1);
  }, [ownStore]);

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

  const cancelGeneration = useCallback(() => {
    // TODO Phase B: wire to host capability
    console.info('[YdlTavern] cancelGeneration');
  }, []);

  const continueLastReply = useCallback(() => {
    // TODO Phase B: wire to host capability
    console.info('[YdlTavern] continueLastReply');
  }, []);

  const impersonate = useCallback(() => {
    // TODO Phase B: wire to host capability
    console.info('[YdlTavern] impersonate');
  }, []);

  const editMessage = useCallback((id: string | number, text: string) => {
    const index = resolveMessageIndex(ownStore.snapshot(), id);
    if (index === null) return;
    ownStore.updateMessage(index, { mes: text });
    setRevision((r) => r + 1);
  }, [ownStore]);

  const deleteMessage = useCallback((id: string | number) => {
    const index = resolveMessageIndex(ownStore.snapshot(), id);
    if (index === null) return;
    ownStore.deleteMessage(index);
    setRevision((r) => r + 1);
  }, [ownStore]);

  const moveMessage = useCallback((id: string | number, direction: 'up' | 'down') => {
    const snapshot = ownStore.snapshot();
    const index = resolveMessageIndex(snapshot, id);
    if (index === null) return;
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= snapshot.turns.length) return;
    const messages = ownStore.messages();
    const current = messages[index];
    const neighbor = messages[target];
    if (current === undefined || neighbor === undefined) return;
    ownStore.spliceMessages(Math.min(index, target), 2, direction === 'up' ? current : neighbor, direction === 'up' ? neighbor : current);
    setRevision((r) => r + 1);
  }, [ownStore]);

  const copyMessage = useCallback((id: string | number) => {
    const index = resolveMessageIndex(ownStore.snapshot(), id);
    if (index === null) return;
    const message = ownStore.messageAt(index);
    if (message === undefined) return;
    void navigator.clipboard?.writeText(message.mes ?? '').catch(() => undefined);
    ownStore.spliceMessages(index + 1, 0, { ...message, send_date: new Date().toISOString() });
    setRevision((r) => r + 1);
  }, [ownStore]);

  const hideMessage = useCallback((id: string | number) => {
    const index = resolveMessageIndex(ownStore.snapshot(), id);
    if (index === null) return;
    const message = ownStore.messageAt(index);
    ownStore.updateMessage(index, { extra: { ...(message?.extra ?? {}), ydl_hidden: true } });
    setRevision((r) => r + 1);
  }, [ownStore]);

  const unhideMessage = useCallback((id: string | number) => {
    const index = resolveMessageIndex(ownStore.snapshot(), id);
    if (index === null) return;
    const message = ownStore.messageAt(index);
    const { ydl_hidden: _hidden, ...extra } = message?.extra ?? {};
    ownStore.updateMessage(index, { extra });
    setRevision((r) => r + 1);
  }, [ownStore]);

  const swipeMessage = useCallback((id: string | number, delta: -1 | 1) => {
    const index = resolveMessageIndex(ownStore.snapshot(), id);
    if (index === null) return;
    const message = ownStore.messageAt(index);
    const swipes = message?.swipes ?? [];
    if (message === undefined || swipes.length === 0) return;
    const current = message.swipe_id ?? 0;
    const nextSwipe = wrapIndex(current + delta, swipes.length);
    ownStore.updateMessage(index, { mes: swipes[nextSwipe] ?? message.mes, extra: message.extra });
    setRevision((r) => r + 1);
  }, [ownStore]);

  const swipeLeft = useCallback((id: string | number) => swipeMessage(id, -1), [swipeMessage]);
  const swipeRight = useCallback((id: string | number) => swipeMessage(id, 1), [swipeMessage]);

  const regenerateMessage = useCallback((id: string | number) => {
    // TODO Phase B: wire to host capability
    console.info('[YdlTavern] regenerateMessage', id);
    editMessage(id, '[ydltavern fake regenerate] replacement response from message controls.');
  }, [editMessage]);

  const branchMessage = useCallback((id: string | number) => {
    // TODO Phase B: wire to host capability
    console.info('[YdlTavern] branchMessage', id);
  }, []);

  const checkpointMessage = useCallback((id: string | number) => {
    // TODO Phase B: wire to host capability
    console.info('[YdlTavern] checkpointMessage', id);
  }, []);

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
        setActivePreset,
        theme,
        themeSettings,
        setThemeSettings,
        mobileDrawerOpen,
        setMobileDrawerOpen,
        extensionRecords,
        extensionActivationContext,
        samplerSettings,
        updateSamplerSettings,
        connectionSettings: connectionState.current,
        updateConnectionSettings,
        connectionProfiles: connectionState.profiles,
        saveConnectionProfile,
        loadConnectionProfile,
        deleteConnectionProfile,
        activeConnectionProfile: selection.activeConnectionProfile,
        formattingSettings,
        updateFormattingSettings,
        backgroundDisplaySettings,
        setBackgroundFitMode,
        setBackgroundAutoSelect,
        characters,
        activeCharacterId: selection.activeCharacterId,
        setActiveCharacter,
        createCharacter,
        updateCharacter,
        deleteCharacter,
        duplicateCharacter,
        importCharacter,
        exportCharacter,
        personas,
        activePersonaId: selection.activePersonaId,
        setActivePersona,
        createPersona,
        updatePersona,
        deletePersona,
        importPersona,
        worldBooks,
        activeWorldBookId: selection.activeWorldBookId,
        selectedWorldEntryId: selection.selectedWorldEntryId,
        setActiveWorldBook,
        setSelectedWorldEntry,
        createWorldBook,
        updateWorldBook,
        deleteWorldBook,
        createWorldEntry,
        updateWorldEntry,
        deleteWorldEntry,
        duplicateWorldEntry,
        backgrounds,
        activeBackgroundId: selection.activeBackgroundId,
        setActiveBackground,
        uploadBackground,
        deleteBackground,
        resetSettings,
        isGenerating,
        cancelGeneration,
        continueLastReply,
        impersonate,
        editMessage,
        deleteMessage,
        moveMessage,
        copyMessage,
        hideMessage,
        unhideMessage,
        swipeLeft,
        swipeRight,
        regenerateMessage,
        branchMessage,
        checkpointMessage,
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

function createId(prefix: string): string {
  const cryptoUuid = globalThis.crypto?.randomUUID?.();
  if (cryptoUuid !== undefined) return `${prefix}-${cryptoUuid}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function timestamp(): string {
  return new Date().toISOString();
}

function persistArray<T>(key: string, value: T[]): T[] {
  writePersisted(key, value);
  return value;
}

function upsertById<T extends { readonly id: string }>(entries: T[], entry: T): T[] {
  const index = entries.findIndex((candidate) => candidate.id === entry.id);
  if (index === -1) return [...entries, entry];
  return entries.map((candidate) => candidate.id === entry.id ? entry : candidate);
}

function resolveMessageIndex(chat: Chat, id: string | number): number | null {
  if (typeof id === 'number') return id >= 0 && id < chat.turns.length ? id : null;
  const index = chat.turns.findIndex((turn) => turn.id === id || turn.variants.some((variant) => variant.id === id));
  return index === -1 ? null : index;
}

function editStoreMessage(store: ReturnType<typeof createTurnStore>, index: number, update: (message: STChatMessage) => STChatMessage): void {
  const message = store.messageAt(index);
  if (message === undefined) return;
  const next = update(message);
  store.updateMessage(index, { mes: next.mes, name: next.name, is_user: next.is_user, is_system: next.is_system, extra: next.extra });
}

function wrapIndex(index: number, length: number): number {
  return ((index % length) + length) % length;
}
