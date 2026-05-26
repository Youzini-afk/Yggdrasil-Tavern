import type { SubMessage } from '@ydltavern/types';
export interface SubMessageViewProps {
    readonly sub: SubMessage;
}
/**
 * @deprecated W4: replaced by MessageBubble + MessageList. Will be removed in
 * a future round. Keep for backward compat with any external consumers that
 * still import this.
 */
export declare function SubMessageView({ sub }: SubMessageViewProps): JSX.Element | null;
//# sourceMappingURL=SubMessageView.d.ts.map