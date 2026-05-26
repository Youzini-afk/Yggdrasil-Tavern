export interface WorldInfoInspectorProps {
    /** ST World Info routing result (or null/undefined if not yet routed). */
    readonly result?: RoutedEntries | null;
}
export interface RoutedEntries {
    readonly buckets: {
        readonly before?: readonly RoutedEntry[];
        readonly after?: readonly RoutedEntry[];
        readonly ANTop?: readonly RoutedEntry[];
        readonly ANBottom?: readonly RoutedEntry[];
        readonly atDepth?: readonly DepthEntry[];
        readonly EM?: readonly RoutedEntry[];
        readonly outlets?: Record<string, OutletBucket>;
    };
    readonly anPatch?: {
        readonly top: string;
        readonly original: string;
        readonly bottom: string;
        readonly patched: string;
    };
}
interface RoutedEntry {
    readonly id: string;
    readonly order: number;
    readonly content: string;
}
interface DepthEntry {
    readonly depth: number;
    readonly role: string;
    readonly content: string;
}
interface OutletBucket {
    readonly name: string;
    readonly entries: readonly RoutedEntry[];
}
export declare function WorldInfoInspector({ result, }: WorldInfoInspectorProps): JSX.Element;
export {};
//# sourceMappingURL=WorldInfoInspector.d.ts.map