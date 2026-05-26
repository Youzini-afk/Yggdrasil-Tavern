export interface ConnectorInspectorProps {
    /** Provider request snapshots per source (or null/undefined if none yet). */
    readonly requests?: readonly RequestSnapshot[] | null;
}
interface RequestSnapshot {
    readonly source: string;
    readonly body: Record<string, unknown>;
    readonly diagnostics: {
        readonly stripped: readonly string[];
        readonly notes: readonly string[];
    };
}
export declare function ConnectorInspector({ requests, }: ConnectorInspectorProps): JSX.Element;
export {};
//# sourceMappingURL=ConnectorInspector.d.ts.map