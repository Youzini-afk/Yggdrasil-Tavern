export interface MessageActionsProps {
    isUser: boolean;
    isSystem: boolean;
    hasBookmark?: boolean;
    onCopy?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onBranch?: () => void;
    onCheckpoint?: () => void;
    onTranslate?: () => void;
    onNarrate?: () => void;
    onHide?: () => void;
    onUnhide?: () => void;
}
export declare function MessageActions(props: MessageActionsProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=MessageActions.d.ts.map