import { type STExtensionRecord, type STActivationContext } from '@ydltavern/extensions';
export interface ExtensionsPanelProps {
    readonly records?: readonly STExtensionRecord[];
    readonly activationContext?: STActivationContext;
}
export declare function ExtensionsPanel({ records, activationContext, }: ExtensionsPanelProps): JSX.Element;
//# sourceMappingURL=ExtensionsPanel.d.ts.map