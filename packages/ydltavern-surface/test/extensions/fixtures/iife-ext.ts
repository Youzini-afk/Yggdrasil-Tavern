// Simulates an IIFE-bundled extension (rollup output, like shujuku's
// build:extension).

export function iifeStyleExtension(g: any): { booted: boolean } {
  // IIFE extensions usually grab globalThis at the top.
  const global = g;

  if (!global.SillyTavern) throw new Error('SillyTavern global not present');
  if (!global.eventSource) throw new Error('eventSource global not present');

  // They often write namespaced localStorage keys.
  if (g.localStorage) {
    g.localStorage.setItem('iife-ext__settings', JSON.stringify({ enabled: true }));
  }

  // They register their settings panel by querying #extensions_settings2.
  const settings2 = g.document?.getElementById('extensions_settings2');
  if (settings2) {
    const wrapper = g.document.createElement('div');
    wrapper.id = 'iife-ext-panel';
    wrapper.innerHTML = '<h3>IIFE Extension</h3><div class="settings-body"></div>';
    settings2.appendChild(wrapper);
  }

  return { booted: true };
}
