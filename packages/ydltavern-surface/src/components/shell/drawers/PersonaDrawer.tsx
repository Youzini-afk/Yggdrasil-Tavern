import React from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';
import { PersonaForm } from '../../product/Settings/PersonaForm';
import { useTavern } from '../../../app/TavernProvider';

export function PersonaDrawer({ drawers }: { drawers: DrawerState }) {
  const tavern = useTavern();
  const activePersona = tavern.personas.find((persona) => persona.id === tavern.activePersonaId) ?? tavern.personas[0];

  return (
    <DrawerShell id="persona" drawers={drawers} side="left" title="Persona Management">
      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Personas</h3>
          <div className="preset-actions">
            <button
              type="button"
              className="menu_button"
              aria-label="Create persona"
              onClick={() => {
                const id = tavern.createPersona({ name: 'New Persona' });
                tavern.setActivePersona(id);
              }}
            >
              <i className="fa-solid fa-plus" aria-hidden="true" /> New
            </button>
            <button type="button" className="menu_button" aria-label="Import persona">
              <i className="fa-solid fa-file-import" aria-hidden="true" /> Import
            </button>
          </div>
        </header>

        <ul className="persona-list" role="list">
          {tavern.personas.map((persona) => (
            <li key={persona.id} className={`persona-row ${activePersona?.id === persona.id ? 'active' : ''}`}>
              <button
                type="button"
                className="persona-row-button"
                onClick={() => tavern.setActivePersona(persona.id)}
                aria-pressed={activePersona?.id === persona.id}
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
                {activePersona?.id === persona.id && (
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
                  onClick={() => tavern.deletePersona(persona.id)}
                  disabled={tavern.personas.length <= 1}
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
        {activePersona ? (
          <PersonaForm
            key={activePersona.id}
            settings={{
              name: activePersona.name,
              description: activePersona.description ?? '',
              avatarUrl: activePersona.avatarUrl ?? '',
            }}
            onChange={(partial) => tavern.updatePersona(activePersona.id, partial)}
          />
        ) : (
          <p className="drawer-coming-soon">Create a persona to edit.</p>
        )}
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
