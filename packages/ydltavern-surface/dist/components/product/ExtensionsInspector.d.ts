export interface ExtensionsInspectorProps {
    /** Extension loader activation plan (or null/undefined if not yet loaded). */
    readonly activationPlan?: ActivationPlan | null;
    /** Disabled extension IDs from the store. */
    readonly disabled?: readonly string[] | null;
}
interface ActivationPlan {
    readonly activated: readonly ActivatedExtension[];
    readonly skipped: readonly SkippedExtension[];
}
interface ActivatedExtension {
    readonly id: string;
    readonly manifest: {
        readonly display_name: string;
        readonly generate_interceptor?: string;
    };
    readonly steps: readonly {
        kind: string;
    }[];
}
interface SkippedExtension {
    readonly id: string;
    readonly reasons: readonly string[];
}
export declare function ExtensionsInspector({ activationPlan, disabled, }: ExtensionsInspectorProps): JSX.Element;
export {};
//# sourceMappingURL=ExtensionsInspector.d.ts.map