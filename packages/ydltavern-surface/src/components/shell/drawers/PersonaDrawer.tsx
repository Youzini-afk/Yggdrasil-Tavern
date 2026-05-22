import React, { useState } from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';
import { PersonaForm, DEFAULT_PERSONA_SETTINGS } from '../../product/Settings/PersonaForm';
import type { PersonaSettings } from '../../product/Settings/PersonaForm';

interface PersonaSummary {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  active: boolean;
}

const STUB_PERSONAS: PersonaSummary[] = [
  { id: 'default', name: 'You', description: 'Default user persona', active: true },
];

export function PersonaDrawer({ drawers }: { drawers: DrawerState }) {
  const [activeId, setActiveId] = useState<string>(STUB_PERSONAS[0]!.id);
  const personas = STUB_PERSONAS; // TODO V7: wire to TavernProvider
  const [personaSettings, setPersonaSettings] = useState<PersonaSettings>(DEFAULT_PERSONA_SETTINGS);

  return (
    <DrawerShell id="persona" drawers={drawers} side="left" title="Persona Management">
      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Personas</h3>
          <div className="preset-actions">
            <button type="button" className="menu_button" aria-label="Create persona">
              <i className="fa-solid fa-plus" aria-hidden="true" /> New
            </button>
            <button type="button" className="menu_button" aria-label="Import persona">
              <i className="fa-solid fa-file-import" aria-hidden="true" /> Import
            </button>
          </div>
        </header>

        <ul className="persona-list" role="list">
          {personas.map((persona) => (
            <li key={persona.id} className={`persona-row ${activeId === persona.id ? 'active' : ''}`}>
              <button
                type="button"
                className="persona-row-button"
                onClick={() => setActiveId(persona.id)}
                aria-pressed={activeId === persona.id}
                aria-label={`Activate persona ${persona.name}`}
              >
                <div className="persona-avatar">
                  {persona.avatarUrl ? (
                    <img src={persona.avatarUrl} alt="" />
                  ) : (
                    <div className="persona-avatar-placeholder">
                      <i className="fa-solid fa-user" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="persona-meta">
                  <div className="persona-name">{persona.name}</div>
                  {persona.description && (
                    <div className="persona-description">{persona.description}</div>
                  )}
                </div>
                {persona.active && (
                  <span className="persona-active-badge" aria-label="Active persona">
                    <i className="fa-solid fa-check" aria-hidden="true" />
                  </span>
                )}
              </button>
              <div className="persona-row-actions">
                <button type="button" className="mes_button" aria-label={`Edit ${persona.name}`}>
                  <i className="fa-solid fa-pencil" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="mes_button"
                  aria-label={`Delete ${persona.name}`}
                  disabled={personas.length <= 1}
                >
                  <i className="fa-solid fa-trash" aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Edit active persona</h3>
        </header>
        <PersonaForm settings={personaSettings} onChange={setPersonaSettings} />
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Persona settings</h3>
        </header>
        <label className="checkbox_label">
          <input type="checkbox" defaultChecked />
          <span>Show persona name in chat</span>
        </label>
        <label className="checkbox_label">
          <input type="checkbox" />
          <span>Lock persona to current chat</span>
        </label>
      </section>
    </DrawerShell>
  );
}
