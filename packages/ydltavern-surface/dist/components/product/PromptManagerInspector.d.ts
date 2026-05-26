export interface PromptManagerInspectorProps {
    /** ST PromptManager compile result (or null/undefined if not yet compiled). */
    readonly result?: {
        readonly prompts?: readonly PromptEntry[];
        readonly collection?: PromptCollection;
        readonly diagnostics?: PromptDiagnostics;
    } | null;
}
interface PromptEntry {
    readonly identifier: string;
    readonly role?: string;
    readonly content?: string;
    readonly marker?: boolean;
    readonly source?: 'input' | 'default' | 'anchor';
    readonly enabled?: boolean;
}
interface PromptCollection {
    readonly overriddenPrompts?: readonly OverrideEntry[];
    readonly triggerSkipped?: readonly string[];
}
interface OverrideEntry {
    readonly identifier: string;
    readonly status: 'applied' | 'blocked';
    readonly reason?: string;
}
interface PromptDiagnostics {
    readonly warnings?: readonly string[];
}
export declare function PromptManagerInspector({ result, }: PromptManagerInspectorProps): JSX.Element;
export {};
//# sourceMappingURL=PromptManagerInspector.d.ts.map