import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createEventSource,
  createSTContextDeep,
  mountSTGlobals,
} from '../src/index.js';
import type { STContextDeep } from '../src/index.js';

const globalTarget = globalThis as Record<string, any>;
const globalKeys = [
  'SillyTavern',
  'eventSource',
  'event_types',
  'chat',
  'characters',
  'this_chid',
  'chat_metadata',
  'extension_settings',
  'extension_prompt_types',
  'extension_prompt_roles',
  'extension_prompts',
  'groups',
  'selected_group',
  'name1',
  'name2',
  'mainApi',
  'getRequestHeaders',
  'saveSettingsDebounced',
  'saveMetadata',
  'saveMetadataDebounced',
  'reloadCurrentChat',
  'saveChat',
  'updateChatMetadata',
  'addOneMessage',
  'deleteLastMessage',
  'substituteParams',
  'messageFormatting',
  'setExtensionPrompt',
  'getExtensionPrompt',
  'getExtensionPromptMaxDepth',
  'removeDepthPrompts',
  'getCurrentChatId',
  'getTokenCountAsync',
  'generate',
  'generateRaw',
  'callPopup',
  'renderExtensionTemplateAsync',
  'doExtrasFetch',
  'getApiUrl',
  'SlashCommandParser',
  'registerSlashCommand',
  '$',
  'jQuery',
  'showdown',
  'DOMPurify',
  'hljs',
  'Handlebars',
  'moment',
  'Popper',
  'Fuse',
  'localforage',
  'diff_match_patch',
  'SVGInject',
  'droll',
  'toastr',
];

function makeContext(): STContextDeep {
  return createSTContextDeep({ eventSource: createEventSource() });
}

async function withGlobalCleanup(fn: () => void | Promise<void>): Promise<void> {
  const snapshot = new Map<string, { existed: boolean; value: any }>();
  for (const key of globalKeys) {
    snapshot.set(key, { existed: key in globalTarget, value: globalTarget[key] });
  }

  try {
    await fn();
  } finally {
    for (const [key, prev] of snapshot) {
      if (prev.existed) globalTarget[key] = prev.value;
      else delete globalTarget[key];
    }
  }
}

test('mountSTGlobals returns mounted diagnostics for core ST globals', async () => {
  await withGlobalCleanup(() => {
    const ctx = makeContext();
    const mount = mountSTGlobals({ context: ctx });
    try {
      assert.ok(mount.mounted.includes('SillyTavern'));
      assert.ok(mount.mounted.includes('eventSource'));
      assert.ok(mount.mounted.includes('chat'));
      assert.ok(mount.mounted.includes('event_types'));
    } finally {
      mount.unmount();
    }
  });
});

test('SillyTavern.getContext returns the mounted context', async () => {
  await withGlobalCleanup(() => {
    const ctx = makeContext();
    const mount = mountSTGlobals({ context: ctx });
    try {
      assert.equal(globalTarget.SillyTavern.getContext(), ctx);
    } finally {
      mount.unmount();
    }
  });
});

test('mounted eventSource is live and emits listener args', async () => {
  await withGlobalCleanup(() => {
    const ctx = makeContext();
    const mount = mountSTGlobals({ context: ctx });
    try {
      let seen: unknown;
      globalTarget.eventSource.on('test', (arg: unknown) => {
        seen = arg;
      });
      globalTarget.eventSource.emit('test', 'arg');
      assert.equal(seen, 'arg');
    } finally {
      mount.unmount();
    }
  });
});

test('mounted chat is a live reference to context chat', async () => {
  await withGlobalCleanup(() => {
    const ctx = makeContext();
    const mount = mountSTGlobals({ context: ctx });
    try {
      globalTarget.chat[0] = { mes: 'x' };
      assert.equal(ctx.chat[0]?.mes, 'x');
    } finally {
      mount.unmount();
    }
  });
});

test('jQuery option mounts both $ and jQuery globals', async () => {
  await withGlobalCleanup(() => {
    const ctx = makeContext();
    const jQuery = () => 'jq';
    const mount = mountSTGlobals({ context: ctx, jQuery });
    try {
      assert.equal(globalTarget.$, jQuery);
      assert.equal(globalTarget.jQuery, jQuery);
    } finally {
      mount.unmount();
    }
  });
});

test('showdown option mounts top-level showdown and SillyTavern.libs.showdown', async () => {
  await withGlobalCleanup(() => {
    const ctx = makeContext();
    const showdown = { Converter: class Converter {} };
    const mount = mountSTGlobals({ context: ctx, showdown });
    try {
      assert.equal(globalTarget.showdown, showdown);
      assert.equal(globalTarget.SillyTavern.libs.showdown, showdown);
    } finally {
      mount.unmount();
    }
  });
});

test('skipExisting true does not overwrite existing globals', async () => {
  await withGlobalCleanup(() => {
    const ctx = makeContext();
    const preexisting = { old: true };
    globalTarget.eventSource = preexisting;
    const mount = mountSTGlobals({ context: ctx, skipExisting: true });
    try {
      assert.equal(globalTarget.eventSource, preexisting);
      assert.ok(!mount.mounted.includes('eventSource'));
    } finally {
      mount.unmount();
    }
  });
});

test('unmount restores globals that existed before mount', async () => {
  await withGlobalCleanup(() => {
    const ctx = makeContext();
    globalTarget.eventSource = 'preexisting';
    const mount = mountSTGlobals({ context: ctx });
    assert.equal(globalTarget.eventSource, ctx.eventSource);
    mount.unmount();
    assert.equal(globalTarget.eventSource, 'preexisting');
  });
});

test('unmount deletes globals that did not exist before mount', async () => {
  await withGlobalCleanup(() => {
    const ctx = makeContext();
    delete globalTarget.eventSource;
    const mount = mountSTGlobals({ context: ctx });
    assert.equal(globalTarget.eventSource, ctx.eventSource);
    mount.unmount();
    assert.equal('eventSource' in globalTarget, false);
  });
});

test('target option mounts on custom object instead of globalThis', async () => {
  await withGlobalCleanup(() => {
    const ctx = makeContext();
    const target: Record<string, any> = {};
    const mount = mountSTGlobals({ context: ctx, target });
    try {
      assert.equal(target.SillyTavern.getContext(), ctx);
      assert.equal(target.eventSource, ctx.eventSource);
      assert.equal(target.chat, ctx.chat);
      assert.equal('eventSource' in globalTarget, false);
    } finally {
      mount.unmount();
    }
  });
});

test('SlashCommandParser.addCommandObject registers in context slash registry', async () => {
  await withGlobalCleanup(() => {
    const ctx = makeContext();
    const mount = mountSTGlobals({ context: ctx });
    try {
      globalTarget.SlashCommandParser.addCommandObject({
        name: 'foo',
        callback: async () => 'bar',
      });
      assert.ok(ctx.slashCommandRegistry.has('foo'));
    } finally {
      mount.unmount();
    }
  });
});

test('SlashCommandParser facade executes registered commands through registry', async () => {
  await withGlobalCleanup(async () => {
    const ctx = makeContext();
    const mount = mountSTGlobals({ context: ctx });
    try {
      globalTarget.SlashCommandParser.addCommandObject({
        name: 'foo',
        callback: async () => 'bar',
      });
      const result = await globalTarget.SlashCommandParser.execute('/foo');
      assert.equal(result.output, 'bar');
    } finally {
      mount.unmount();
    }
  });
});

test('mountSTGlobals mounts deep context field names without fallback aliases', async () => {
  await withGlobalCleanup(() => {
    const ctx = makeContext();
    const mount = mountSTGlobals({ context: ctx });
    try {
      assert.equal(globalTarget.chat_metadata, ctx.chatMetadata);
      assert.equal(globalTarget.extension_settings, ctx.extensionSettings);
      assert.equal(globalTarget.extension_prompt_types.IN_PROMPT, 0);
      assert.equal(globalTarget.extension_prompt_roles.SYSTEM, 0);
      assert.equal(globalTarget.this_chid, ctx.characterId);
      assert.equal(globalTarget.selected_group, ctx.groupId);
    } finally {
      mount.unmount();
    }
  });
});

test('re-mounting twice overwrites cleanly and each unmount restores original', async () => {
  await withGlobalCleanup(() => {
    const ctx1 = makeContext();
    const ctx2 = makeContext();
    globalTarget.eventSource = 'original';

    const first = mountSTGlobals({ context: ctx1 });
    const second = mountSTGlobals({ context: ctx2 });

    assert.equal(globalTarget.eventSource, ctx2.eventSource);
    second.unmount();
    assert.equal(globalTarget.eventSource, 'original');

    first.unmount();
    assert.equal(globalTarget.eventSource, 'original');
  });
});

test('mountSTGlobals can mount pass-through library globals together', async () => {
  await withGlobalCleanup(() => {
    const ctx = makeContext();
    const libs = {
      dompurify: { sanitize: (s: string) => s },
      hljs: { highlight: () => undefined },
      toastr: { info: () => undefined },
    };
    const mount = mountSTGlobals({ context: ctx, ...libs });
    try {
      assert.equal(globalTarget.DOMPurify, libs.dompurify);
      assert.equal(globalTarget.SillyTavern.libs.DOMPurify, libs.dompurify);
      assert.equal(globalTarget.hljs, libs.hljs);
      assert.equal(globalTarget.SillyTavern.libs.hljs, libs.hljs);
      assert.equal(globalTarget.toastr, libs.toastr);
      assert.equal(globalTarget.SillyTavern.libs.toastr, undefined);
    } finally {
      mount.unmount();
    }
  });
});
