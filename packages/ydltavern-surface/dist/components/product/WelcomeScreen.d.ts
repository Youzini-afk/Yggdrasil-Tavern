export interface WelcomeRecentChat {
    id: string;
    title?: string;
    charName?: string;
    charAvatarUrl?: string;
    chatName?: string;
    updatedAt?: string;
    dateShort?: string;
    lastMessage?: string;
    messageCount?: number;
    fileSize?: string;
    pinned?: boolean;
}
export interface WelcomeScreenProps {
    /**
     * Version string displayed in the welcome header.
     * Defaults to the package version if available.
     */
    version?: string;
    /** Callback when the API Connections button is clicked. */
    onOpenApiConnections?: () => void;
    /** Callback when the Character Management button is clicked. */
    onOpenCharacters?: () => void;
    /** Callback when the Extensions button is clicked. */
    onOpenExtensions?: () => void;
    /**
     * List of recent chats to display.
     * When empty the "no recent chats" hint is shown.
     */
    recentChats?: readonly WelcomeRecentChat[];
    onTemporaryChat?: () => void;
    onOpenChat?: (id: string) => void;
    onPinChat?: (id: string) => void;
    onRenameChat?: (id: string) => void;
    onDeleteChat?: (id: string) => void;
}
/**
 * WelcomeScreen — SillyTavern-style welcome / empty-state panel.
 *
 * Renders inside #chat when there are no messages.
 * Mirrors the DOM structure of ST's welcomePanel + welcome.html / how-to-start:
 *
 *   .welcomePanel
 *     .welcomeHeaderTitle
 *       .welcomeHeaderLogo (.welcomeHeaderLogoText)
 *       .welcomeHeaderVersionDisplay
 *     .welcomeHeader
 *       .recentChatsTitle ("Welcome")
 *       .welcomeShortcuts (Docs / GitHub / Discord / Temporary Chat)
 *     .welcomeRecent
 *       .recentChatsTitle ("Recent Chats")
 *       .recentChatList (.recentChatList-empty / .welcomeEmptyHint)
 *   .mes.mes_welcome_guide[data-is-system="true"]
 *     .mesAvatarWrapper > .avatar > .avatar-placeholder
 *     .mes_block
 *       .ch_name > .name_text ("Welcome")
 *       .mes_text
 *         h3 ("How to start chatting?")
 *         ol > li > button.drawer-opener[data-target=...]
 */
export declare function WelcomeScreen({ version, onOpenApiConnections, onOpenCharacters, onOpenExtensions, onTemporaryChat, onOpenChat, onPinChat, onRenameChat, onDeleteChat, recentChats, }: WelcomeScreenProps): JSX.Element;
//# sourceMappingURL=WelcomeScreen.d.ts.map