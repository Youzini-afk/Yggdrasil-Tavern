export declare function isNearBottom(scrollContainer: HTMLElement | null, virtuosoScrollContainer?: HTMLElement | null, threshold?: number): boolean;
export interface MessageListProps {
    /** Callback to open the API Connections drawer. */
    onOpenApiConnections?: () => void;
    /** Callback to open the Character Management drawer. */
    onOpenCharacters?: () => void;
    /** Callback to open the Extensions drawer. */
    onOpenExtensions?: () => void;
}
/**
 * MessageList renders liveChat.turns using ST-aligned MessageBubble.
 * Replaces ChatList + TurnView path.
 *
 * Each turn maps to one bubble. For turns with multiple variants and/or
 * reasoning sub-messages, the bubble shows the active variant text and makes
 * reasoning available via the reasoning block.
 *
 * When there are no turns (empty chat), it renders a WelcomeScreen instead
 * that mirrors SillyTavern's welcome panel + how-to-start guidance.
 *
 * NOTE: The early-return for empty state is done via a separate component
 * (`EmptyMessageList`) below so that we never violate the Rules of Hooks
 * by conditionally calling useState/useEffect/useRef.
 */
export declare function MessageList({ onOpenApiConnections, onOpenCharacters, onOpenExtensions, }?: MessageListProps): JSX.Element;
//# sourceMappingURL=MessageList.d.ts.map