interface QuickReplyItem {
    readonly id: string;
    readonly label: string;
}
interface QuickReplySet {
    readonly id: string;
    readonly name: string;
    readonly enabled: boolean;
    readonly items: readonly QuickReplyItem[];
}
export interface QuickReplyBarProps {
    readonly sets: readonly QuickReplySet[];
    readonly onTrigger: (qrId: string) => void;
}
export declare function QuickReplyBar({ sets, onTrigger }: QuickReplyBarProps): JSX.Element | null;
export {};
//# sourceMappingURL=QuickReplyBar.d.ts.map