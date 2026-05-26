import type { Chat } from '@ydltavern/types';
import type { STContextRuntime } from '@ydltavern/st-compat';
export interface PromptCriticalPanelProps {
    /** Live ST context runtime — supplies user/char names and macro context. */
    readonly runtime: STContextRuntime;
    /** Live Chat snapshot (must mirror runtime). */
    readonly chat: Chat;
}
export declare function PromptCriticalPanel({ runtime, chat }: PromptCriticalPanelProps): JSX.Element;
//# sourceMappingURL=PromptCriticalPanel.d.ts.map