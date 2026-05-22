// A minimal ST-style extension that uses globalThis APIs (the way real ST
// extensions use ESM imports — but we simulate by reading globalThis directly).

export function microStExtension(g: any): {
  registered: boolean;
  eventListeners: number;
  slashCommands: string[];
} {
  // Real extension would: import { eventSource, event_types } from '../../../script.js';
  // We simulate that ESM resolution by reading globalThis (which our shims do internally).
  const eventSource = g.eventSource;
  const event_types = g.event_types;
  const SlashCommandParser = g.SlashCommandParser;

  if (!eventSource) throw new Error('eventSource not on globalThis');
  if (!event_types) throw new Error('event_types not on globalThis');

  let eventCount = 0;

  // Register some listeners (BME registers ~30+; we register a few).
  const listenerIds: any[] = [];
  for (const evt of ['MESSAGE_RECEIVED', 'MESSAGE_SENT', 'CHAT_CHANGED']) {
    const handler = () => { eventCount++; };
    eventSource.on?.(event_types[evt] ?? evt, handler);
    listenerIds.push({ evt, handler });
  }
  void eventCount;

  // Register a slash command.
  const slashCommands: string[] = [];
  if (SlashCommandParser?.addCommandObject) {
    SlashCommandParser.addCommandObject({
      name: 'mst-hello',
      callback: async () => 'hello from micro st',
    });
    slashCommands.push('mst-hello');
  }

  // Mount UI into #extensions_settings (jQuery-style).
  if (g.document?.getElementById) {
    const settings = g.document.getElementById('extensions_settings');
    if (settings) {
      const div = g.document.createElement('div');
      div.id = 'micro-st-ext-settings';
      div.textContent = 'Micro ST Extension Settings Panel';
      settings.appendChild(div);
    }
  }

  return {
    registered: true,
    eventListeners: listenerIds.length,
    slashCommands,
  };
}
