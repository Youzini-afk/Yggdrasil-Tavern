import { EngineCorePreviewPanel } from '../EngineCorePreviewPanel.js';
import { ImportersPanel } from '../ImportersPanel.js';
import { PromptCriticalPanel } from '../PromptCriticalPanel.js';
import { SlashDiagnosticsPanel } from '../SlashDiagnosticsPanel.js';
import { STDiagnosticsPanel } from '../STDiagnosticsPanel.js';
import { PromptManagerInspector } from './PromptManagerInspector.js';
import { WorldInfoInspector } from './WorldInfoInspector.js';
import { STScriptInspector } from './STScriptInspector.js';
import { ExtensionsInspector } from './ExtensionsInspector.js';
import { ConnectorInspector } from './ConnectorInspector.js';
import { useTavern } from '../../app/TavernProvider.js';

export function DevDiagnosticsPanel(): JSX.Element {
  const tavern = useTavern();
  if (!tavern.showDiagnostics) return <section className="drawer-panel"><h2>Dev diagnostics</h2><p>Diagnostics are disabled by the host.</p></section>;
  return (
    <section className="drawer-panel product-dev-panel">
      <h2>Dev diagnostics</h2>
      <div className="diag-stack compact">
        <STDiagnosticsPanel runtime={tavern.runtime} />
        <EngineCorePreviewPanel chat={tavern.liveChat} />
        <PromptCriticalPanel runtime={tavern.runtime} chat={tavern.liveChat} />
        <SlashDiagnosticsPanel runtime={tavern.runtime} />
        <ImportersPanel />
        <PromptManagerInspector result={null} />
        <WorldInfoInspector result={null} />
        <STScriptInspector registry={null} scope={null} pipeHistory={null} flags={null} />
        <ExtensionsInspector activationPlan={null} disabled={null} />
        <ConnectorInspector requests={null} />
      </div>
    </section>
  );
}
