export interface STScriptInspectorProps {
    /** Registered STScript commands. */
    readonly registry?: readonly CommandEntry[] | null;
    /** Current scope chain. */
    readonly scope?: ScopeState | null;
    /** Recent pipe values (most recent first). */
    readonly pipeHistory?: readonly unknown[] | null;
    /** Parser flags. */
    readonly flags?: ParserFlags | null;
}
interface CommandEntry {
    readonly name: string;
    readonly aliases?: readonly string[];
    readonly helpString?: string;
}
interface ScopeState {
    readonly variables: Record<string, unknown>;
    readonly parent?: ScopeState | null;
}
interface ParserFlags {
    readonly STRICT_ESCAPING: boolean;
    readonly REPLACE_GETVAR: boolean;
}
export declare function STScriptInspector({ registry, scope, pipeHistory, flags, }: STScriptInspectorProps): JSX.Element;
export {};
//# sourceMappingURL=STScriptInspector.d.ts.map