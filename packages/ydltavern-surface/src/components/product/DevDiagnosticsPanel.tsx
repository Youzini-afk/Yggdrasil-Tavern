import { EngineCorePreviewPanel } from '../EngineCorePreviewPanel.js';
import { ImportersPanel } from '../ImportersPanel.js';
import { PromptCriticalPanel } from '../PromptCriticalPanel.js';
import { SlashDiagnosticsPanel } from '../SlashDiagnosticsPanel.js';
import { STDiagnosticsPanel } from '../STDiagnosticsPanel.js';
import { useTavern } from '../../app/TavernProvider.js';

export function DevDiagnosticsPanel(): JSX.Element {
  const tavern = useTavern();
  if (!tavern.showDiagnostics) return <section className="drawer-panel"><h2>Dev diagnostics</h2><p>Diagnostics are disabled by the host.</p></section>;
  return <section className="drawer-panel product-dev-panel"><h2>Dev diagnostics</h2><div className="diag-stack compact"><STDiagnosticsPanel runtime={tavern.runtime} /><EngineCorePreviewPanel chat={tavern.liveChat} /><PromptCriticalPanel runtime={tavern.runtime} chat={tavern.liveChat} /><SlashDiagnosticsPanel runtime={tavern.runtime} /><ImportersPanel /></div></section>;
}
