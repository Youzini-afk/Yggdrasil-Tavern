import { type Turn } from '@ydltavern/types';
export interface TurnViewProps {
    readonly turn: Turn;
}
/**
 * @deprecated W4: replaced by MessageBubble + MessageList. Will be removed in
 * a future round. Keep for backward compat with any external consumers that
 * still import this.
 */
export declare function TurnView({ turn }: TurnViewProps): JSX.Element;
//# sourceMappingURL=TurnView.d.ts.map