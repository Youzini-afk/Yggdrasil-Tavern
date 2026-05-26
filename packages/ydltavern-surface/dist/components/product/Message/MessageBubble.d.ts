export interface MessageBubbleProps {
    message: {
        mesId: number | string;
        chName: string;
        isUser: boolean;
        isSystem: boolean;
        isError?: boolean;
        bookmarkLink?: string;
        avatarUrl?: string;
        text: string;
        reasoning?: string;
        timestamp?: string;
        tokenCount?: number;
        timer?: number;
        media?: {
            kind: 'image' | 'file';
            url: string;
            alt?: string;
        }[];
        bias?: string;
        swipes?: {
            current: number;
            total: number;
        };
    };
    editing?: boolean;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onEdit?: () => void;
    onEditDone?: (text: string) => void;
    onEditCancel?: () => void;
    onDelete?: () => void;
    onCopy?: () => void;
    onBranch?: () => void;
    onCheckpoint?: () => void;
    onTranslate?: () => void;
    onNarrate?: () => void;
    onHide?: () => void;
    onUnhide?: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
}
export declare function MessageBubble(props: MessageBubbleProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=MessageBubble.d.ts.map