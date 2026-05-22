import React from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';

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
            <select className="text_pole" defaultValue="default">
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
              placeholder="{{description}}{{personality}}{{scenario}}"
              aria-label="Story string"
            />
          </label>
        </div>

        <div className="range-block">
          <label>
            <span>Example separator:</span>
            <input type="text" className="text_pole" defaultValue="***" aria-label="Example separator" />
          </label>
        </div>

        <div className="range-block">
          <label>
            <span>Chat start:</span>
            <input type="text" className="text_pole" defaultValue="" aria-label="Chat start" />
          </label>
        </div>
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Instruct mode</h3>
          <small>Wraps user/assistant turns with role tokens for instruct-tuned models.</small>
        </header>

        <label className="checkbox_label">
          <input type="checkbox" />
          <span>Enable instruct mode</span>
        </label>

        <div className="range-block">
          <label>
            <span>Template:</span>
            <select className="text_pole" defaultValue="none">
              {INSTRUCT_TEMPLATES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="range-block">
          <label>
            <span>Input sequence:</span>
            <input type="text" className="text_pole" defaultValue="<|im_start|>user\\n" aria-label="Input sequence" />
          </label>
        </div>

        <div className="range-block">
          <label>
            <span>Output sequence:</span>
            <input type="text" className="text_pole" defaultValue="<|im_start|>assistant\\n" aria-label="Output sequence" />
          </label>
        </div>

        <div className="range-block">
          <label>
            <span>System sequence:</span>
            <input type="text" className="text_pole" defaultValue="<|im_start|>system\\n" aria-label="System sequence" />
          </label>
        </div>

        <div className="range-block">
          <label>
            <span>Stop sequence:</span>
            <input type="text" className="text_pole" defaultValue="<|im_end|>" aria-label="Stop sequence" />
          </label>
        </div>

        <label className="checkbox_label">
          <input type="checkbox" defaultChecked />
          <span>System same as user</span>
        </label>
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>System prompt</h3>
        </header>

        <label className="checkbox_label">
          <input type="checkbox" defaultChecked />
          <span>Use system prompt</span>
        </label>

        <div className="range-block">
          <label>
            <span>Content:</span>
            <textarea
              className="textarea_compact"
              rows={6}
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
            <input type="text" className="text_pole" defaultValue="<think>" aria-label="Reasoning prefix" />
          </label>
        </div>

        <div className="range-block">
          <label>
            <span>Reasoning suffix:</span>
            <input type="text" className="text_pole" defaultValue="</think>" aria-label="Reasoning suffix" />
          </label>
        </div>

        <label className="checkbox_label">
          <input type="checkbox" />
          <span>Auto-collapse reasoning blocks</span>
        </label>
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Macros</h3>
        </header>
        <label className="checkbox_label">
          <input type="checkbox" defaultChecked />
          <span>Enable macro substitution ({"{{macro}}"})</span>
        </label>
        <label className="checkbox_label">
          <input type="checkbox" defaultChecked />
          <span>Allow nested/recursive macros</span>
        </label>
      </section>
    </DrawerShell>
  );
}
