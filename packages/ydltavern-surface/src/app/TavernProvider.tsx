import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Chat } from '@ydltavern/types';
import { createSTContext, createTurnStore, type STContextRuntime } from '@ydltavern/st-compat';
import { sampleChat } from '../fixtures/sample-chat.js';

export type TavernDrawer = 'settings' | 'assets' | 'extensions' | 'dev';

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
}

export interface TavernProviderProps {
  readonly chat?: Chat;
  readonly showDiagnostics?: boolean;
  readonly children: ReactNode;
}

const TavernContext = createContext<TavernRuntimeState | undefined>(undefined);

export function TavernProvider({ chat = sampleChat, showDiagnostics = true, children }: TavernProviderProps): JSX.Element {
  const [revision, setRevision] = useState(0);
  const [input, setInput] = useState('');
  const [activeDrawer, setActiveDrawer] = useState<TavernDrawer>('settings');

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
    <TavernContext.Provider value={{ runtime, liveChat, input, activeDrawer, showDiagnostics, setInput, setActiveDrawer, sendMessage, generateReply, editFirstMessage, swipeReply, regenerateReply }}>
      {children}
    </TavernContext.Provider>
  );
}

export function useTavern(): TavernRuntimeState {
  const context = useContext(TavernContext);
  if (context === undefined) throw new Error('useTavern must be used inside <TavernProvider>.');
  return context;
}
