import React from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';
import { useTavern } from '../../../app/TavernProvider';

const INSTRUCT_TEMPLATES = [
  { value: 'none', label: 'None (Chat completion)' },
  { value: 'chatml', label: 'ChatML' },
  { value: 'llama3', label: 'Llama 3' },
  { value: 'alpaca', label: 'Alpaca' },
  { value: 'vicuna', label: 'Vicuna' },
  { value: 'mistral', label: 'Mistral' },
  { value: 'gemma', label: 'Gemma' },
  { value: 'phi3', label: 'Phi-3' },
  { value: 'custom', label: 'Custom…' },
];

const CONTEXT_TEMPLATES = [
  { value: 'default', label: 'Default' },
  { value: 'roleplay', label: 'Roleplay' },
  { value: 'novel', label: 'Novel' },
  { value: 'custom', label: 'Custom…' },
];

export function AdvancedFormattingDrawer({ drawers }: { drawers: DrawerState }) {
  const tavern = useTavern();
  const settings = tavern.formattingSettings;

  return (
    <DrawerShell id="advanced-formatting" drawers={drawers} side="left" title="Advanced Formatting">
      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Context template</h3>
          <small>Frames the prompt with story string, examples, jailbreak.</small>
        </header>

        <div className="range-block">
          <label>
            <span>Active template:</span>
            <select
              className="text_pole"
              value={settings.contextTemplate}
              onChange={(e) => tavern.updateFormattingSettings({ contextTemplate: e.target.value })}
            >
              {CONTEXT_TEMPLATES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="range-block">
          <label>
            <span>Story string:</span>
            <textarea
              className="textarea_compact"
              rows={4}
              value={settings.storyString}
              onChange={(e) => tavern.updateFormattingSettings({ storyString: e.target.value })}
              placeholder="{{description}}{{personality}}{{scenario}}"
              aria-label="Story string"
            />
          </label>
        </div>

        <div className="range-block">
          <label>
            <span>Example separator:</span>
            <input
              type="text"
              className="text_pole"
              value={settings.exampleSeparator}
              onChange={(e) => tavern.updateFormattingSettings({ exampleSeparator: e.target.value })}
              aria-label="Example separator"
            />
          </label>
        </div>

        <div className="range-block">
          <label>
            <span>Chat start:</span>
            <input
              type="text"
              className="text_pole"
              value={settings.chatStart}
              onChange={(e) => tavern.updateFormattingSettings({ chatStart: e.target.value })}
              aria-label="Chat start"
            />
          </label>
        </div>
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Instruct mode</h3>
          <small>Wraps user/assistant turns with role tokens for instruct-tuned models.</small>
        </header>

        <label className="checkbox_label">
          <input
            type="checkbox"
            checked={settings.instructEnabled}
            onChange={(e) => tavern.updateFormattingSettings({ instructEnabled: e.target.checked })}
          />
          <span>Enable instruct mode</span>
        </label>

        <div className="range-block">
          <label>
            <span>Template:</span>
            <select
              className="text_pole"
              value={settings.instructTemplate}
              onChange={(e) => tavern.updateFormattingSettings({ instructTemplate: e.target.value })}
            >
              {INSTRUCT_TEMPLATES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="range-block">
          <label>
            <span>Input sequence:</span>
            <input
              type="text"
              className="text_pole"
              value={settings.instructInputSequence}
              onChange={(e) => tavern.updateFormattingSettings({ instructInputSequence: e.target.value })}
              aria-label="Input sequence"
            />
          </label>
        </div>

        <div className="range-block">
          <label>
            <span>Output sequence:</span>
            <input
              type="text"
              className="text_pole"
              value={settings.instructOutputSequence}
              onChange={(e) => tavern.updateFormattingSettings({ instructOutputSequence: e.target.value })}
              aria-label="Output sequence"
            />
          </label>
        </div>

        <div className="range-block">
          <label>
            <span>System sequence:</span>
            <input
              type="text"
              className="text_pole"
              value={settings.instructSystemSequence}
              onChange={(e) => tavern.updateFormattingSettings({ instructSystemSequence: e.target.value })}
              aria-label="System sequence"
            />
          </label>
        </div>

        <div className="range-block">
          <label>
            <span>Stop sequence:</span>
            <input
              type="text"
              className="text_pole"
              value={settings.instructStopSequence}
              onChange={(e) => tavern.updateFormattingSettings({ instructStopSequence: e.target.value })}
              aria-label="Stop sequence"
            />
          </label>
        </div>

        <label className="checkbox_label">
          <input
            type="checkbox"
            checked={settings.instructSystemSameAsUser}
            onChange={(e) => tavern.updateFormattingSettings({ instructSystemSameAsUser: e.target.checked })}
          />
          <span>System same as user</span>
        </label>
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>System prompt</h3>
        </header>

        <label className="checkbox_label">
          <input
            type="checkbox"
            checked={settings.systemPromptEnabled}
            onChange={(e) => tavern.updateFormattingSettings({ systemPromptEnabled: e.target.checked })}
          />
          <span>Use system prompt</span>
        </label>

        <div className="range-block">
          <label>
            <span>Content:</span>
            <textarea
              className="textarea_compact"
              rows={6}
              value={settings.systemPrompt}
              onChange={(e) => tavern.updateFormattingSettings({ systemPrompt: e.target.value })}
              placeholder="You are {{char}}, a fictional character…"
              aria-label="System prompt"
            />
          </label>
        </div>

        <div className="range-block">
          <label>
            <span>Post-history instructions:</span>
            <textarea
              className="textarea_compact"
              rows={3}
              value={settings.postHistoryInstructions}
              onChange={(e) => tavern.updateFormattingSettings({ postHistoryInstructions: e.target.value })}
              placeholder=""
              aria-label="Post-history instructions"
            />
          </label>
        </div>
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Stopping strings</h3>
          <small>One per line. The model stops when any string is generated.</small>
        </header>
        <textarea
          className="textarea_compact"
          rows={4}
          value={settings.stopStrings}
          onChange={(e) => tavern.updateFormattingSettings({ stopStrings: e.target.value })}
          placeholder={`<|endoftext|>\n<|im_end|>`}
          aria-label="Stop strings"
        />
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Reasoning</h3>
          <small>For models that emit a reasoning block before the response.</small>
        </header>

        <div className="range-block">
          <label>
            <span>Reasoning prefix:</span>
            <input
              type="text"
              className="text_pole"
              value={settings.reasoningPrefix}
              onChange={(e) => tavern.updateFormattingSettings({ reasoningPrefix: e.target.value })}
              aria-label="Reasoning prefix"
            />
          </label>
        </div>

        <div className="range-block">
          <label>
            <span>Reasoning suffix:</span>
            <input
              type="text"
              className="text_pole"
              value={settings.reasoningSuffix}
              onChange={(e) => tavern.updateFormattingSettings({ reasoningSuffix: e.target.value })}
              aria-label="Reasoning suffix"
            />
          </label>
        </div>

        <label className="checkbox_label">
          <input
            type="checkbox"
            checked={settings.reasoningAutoCollapse}
            onChange={(e) => tavern.updateFormattingSettings({ reasoningAutoCollapse: e.target.checked })}
          />
          <span>Auto-collapse reasoning blocks</span>
        </label>
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Macros</h3>
        </header>
        <label className="checkbox_label">
          <input
            type="checkbox"
            checked={settings.macroEnabled}
            onChange={(e) => tavern.updateFormattingSettings({ macroEnabled: e.target.checked })}
          />
          <span>Enable macro substitution ({"{{macro}}"})</span>
        </label>
        <label className="checkbox_label">
          <input
            type="checkbox"
            checked={settings.macroNestedRecursive}
            onChange={(e) => tavern.updateFormattingSettings({ macroNestedRecursive: e.target.checked })}
          />
          <span>Allow nested/recursive macros</span>
        </label>
      </section>
    </DrawerShell>
  );
}
