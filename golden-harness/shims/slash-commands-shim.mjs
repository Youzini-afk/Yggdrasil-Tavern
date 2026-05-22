// slash-commands-shim.mjs: Catches all imports from ST's scripts/slash-commands/ directory
// Must provide all named exports from all files in the slash-commands/ directory.
// Each file's exports are grouped together.

// ====== Base classes ======

class AbstractEventTarget {
  #listeners = {};
  addEventListener(type, listener) { (this.#listeners[type] ??= []).push(listener); }
  removeEventListener(type, listener) { this.#listeners[type] = (this.#listeners[type] || []).filter(l => l !== listener); }
  dispatchEvent(type, ...args) { (this.#listeners[type] || []).forEach(l => l(...args)); }
}

class AutoCompleteNameResult {
  constructor(name, type, icon) { this.name = name; this.type = type; this.icon = icon; }
}

class AutoCompleteOption {
  constructor(name, type, icon) { this.name = name; this.type = type; this.icon = icon; }
}

// ====== SlashCommandArgument.js ======
export const ARGUMENT_TYPE = {
  STRING: 'string',
  NUMBER: 'number',
  RANGE: 'range',
  BOOLEAN: 'bool',
  VARIABLE_NAME: 'varname',
  CLOSURE: 'closure',
  SUBCOMMAND: 'subcommand',
  LIST: 'list',
  DICTIONARY: 'dictionary',
};

export class SlashCommandArgument {
  constructor(props = {}) {
    if (typeof props === 'string') props = { description: props };
    this.description = props.description ?? '';
    this.typeList = props.typeList ?? [ARGUMENT_TYPE.STRING];
    this.isRequired = props.isRequired ?? false;
    this.acceptsMultiple = props.acceptsMultiple ?? false;
    this.defaultValue = props.defaultValue ?? null;
    this.enumList = props.enumList ?? [];
    this.name = props.name ?? '';
  }
  static fromProps(props) {
    return new SlashCommandArgument(props);
  }
  toString() { return `[SlashCommandArgument: ${this.name}]`; }
}

export class SlashCommandNamedArgument extends SlashCommandArgument {
  constructor(props = {}) { super(props); this.isNamed = true; }
  static fromProps(props) {
    return new SlashCommandNamedArgument(props);
  }
}

// ====== SlashCommandEnumValue.js ======
export const enumTypes = {
  name: 'name',
  macro: 'macro',
  variable: 'variable',
  file: 'file',
  command: 'command',
};

export class SlashCommandEnumValue {
  constructor(name, value, type, icon) {
    this.name = name;
    this.value = value;
    this.type = type;
    this.icon = icon;
  }
}

// ====== SlashCommandCommonEnumsProvider.js ======
export const enumIcons = {
  default: '◊',
  variable: '𝑥',
  localVariable: 'L',
  globalVariable: 'G',
  scopeVariable: 'S',
  character: '👤',
  group: '🧑‍🤝‍🧑',
  persona: '🧙‍♂️',
  qr: 'QR',
  closure: '𝑓',
  macro: '{{',
  tag: '🏷️',
  world: '🌐',
  preset: '⚙️',
  file: '📄',
  message: '💬',
  reasoning: '💡',
  voice: '🎤',
  server: '🖥️',
  boolean: '🔲',
  true: '✅',
  false: '❌',
  getDataTypeIcon: (type) => '◊',
};

export const commonEnumProviders = {
  boolean: (mode = 'trueFalse') => () => {
    switch (mode) {
      case 'onOff': return [new SlashCommandEnumValue('on', null, 'macro', enumIcons.true), new SlashCommandEnumValue('off', null, 'macro', enumIcons.false)];
      case 'onOffToggle': return [new SlashCommandEnumValue('on', null, 'macro', enumIcons.true), new SlashCommandEnumValue('off', null, 'macro', enumIcons.false), new SlashCommandEnumValue('toggle', null, 'macro', enumIcons.boolean)];
      case 'trueFalse': return [new SlashCommandEnumValue('true', null, 'macro', enumIcons.true), new SlashCommandEnumValue('false', null, 'macro', enumIcons.false)];
      default: return [new SlashCommandEnumValue('true', null, 'macro', enumIcons.true), new SlashCommandEnumValue('false', null, 'macro', enumIcons.false)];
    }
  },
  variables: (...type) => () => [],
  characters: (allowGroups = true) => () => [],
  groups: () => [],
  personas: () => [],
  quickScripts: () => [],
  worlds: () => [],
  presets: () => [],
  tags: () => [],
  closures: () => [],
  message: () => [],
  files: () => [],
  commands: () => [],
  reasoners: () => [],
  ttsVoices: () => [],
  sttModels: () => [],
  servers: () => [],
};

export const commonEnumMatchProviders = {
  boolean: () => () => [],
  variables: () => () => [],
  characters: () => () => [],
  groups: () => () => [],
  personas: () => () => [],
  quickScripts: () => () => [],
  worlds: () => () => [],
  presets: () => () => [],
  tags: () => () => [],
  closures: () => () => [],
  message: () => () => [],
  files: () => () => [],
  commands: () => () => [],
};

// ====== SlashCommand.js ======
export class SlashCommand {
  constructor(name, callback, aliases, help, enums, tokenize, source) {
    this.name = name;
    this.callback = callback;
    this.aliases = aliases;
    this.help = help;
  }
  static fromProps(props) {
    return new SlashCommand(
      props.name,
      props.callback ?? (() => ''),
      props.aliases ?? [],
      props.help ?? '',
      props.enums,
      props.tokenize,
      props.source,
    );
  }
}

// ====== SlashCommandParser.js ======
export const PARSER_FLAG = {
  ALLOW_UNKNOWN: 1 << 0,
  CASE_SENSITIVE: 1 << 1,
  REPLACE_ALL_VARS: 1 << 2,
  TRIM_QUOTATES: 1 << 3,
};

export class SlashCommandParser {
  constructor() { this.commands = {}; }
  parse() { return []; }
  static addCommandObject(cmd) { if (!SlashCommandParser._commands) SlashCommandParser._commands = {}; if (cmd?.name) SlashCommandParser._commands[cmd.name] = cmd; }
  static getCommand(name) { return (SlashCommandParser._commands || {})[name]; }
}

// ====== SlashCommandAbortController.js ======
export class SlashCommandAbortController extends AbstractEventTarget {
  constructor() { super(); this.signal = new SlashCommandAbortSignal(); }
  abort() { this.dispatchEvent('abort'); }
}
export class SlashCommandAbortSignal {
  constructor() { this.aborted = false; }
}

// ====== SlashCommandBreakController.js ======
export class SlashCommandBreakController {
  constructor() { this.requested = false; }
  requestBreak() { this.requested = true; }
}

// ====== SlashCommandBrowser.js ======
export class SlashCommandBrowser {
  constructor() {}
}

// ====== SlashCommandClosure.js ======
export class SlashCommandClosure {
  constructor(callback) { this.callback = callback; }
  execute(...args) { return this.callback?.(...args); }
}

// ====== SlashCommandClosureResult.js ======
export class SlashCommandClosureResult {
  constructor(result) { this.result = result; }
}

// ====== SlashCommandDebugController.js ======
export class SlashCommandDebugController {
  constructor() {}
}

// ====== SlashCommandExecutionError.js ======
export class SlashCommandExecutionError extends Error {
  constructor(message) { super(message); this.name = 'SlashCommandExecutionError'; }
}

// ====== SlashCommandExecutor.js ======
export class SlashCommandExecutor {
  constructor() {}
  execute() { return Promise.resolve(''); }
}

// ====== SlashCommandNamedArgumentAssignment.js ======
export class SlashCommandNamedArgumentAssignment {
  constructor() {}
}

// ====== SlashCommandParserError.js ======
export class SlashCommandParserError extends Error {
  constructor(message) { super(message); this.name = 'SlashCommandParserError'; }
}

// ====== SlashCommandScope.js ======
export class SlashCommandScope {
  constructor(parent) { this.parent = parent; this.variables = {}; }
  getVariable(name) { return this.variables[name] ?? this.parent?.getVariable?.(name); }
  setVariable(name, value) { this.variables[name] = value; }
  get allVariableNames() { return [...Object.keys(this.variables), ...(this.parent?.allVariableNames ?? [])]; }
}
export class SlashCommandScopeVariableExistsError extends Error {
  constructor(message) { super(message); this.name = 'SlashCommandScopeVariableExistsError'; }
}
export class SlashCommandScopeVariableNotFoundError extends Error {
  constructor(message) { super(message); this.name = 'SlashCommandScopeVariableNotFoundError'; }
}

// ====== SlashCommandReturnHelper.js ======
export const slashCommandReturnHelper = {
  isTrue: (val) => val === true || val === 'true',
  isFalse: (val) => val === false || val === 'false',
  canvasFromString: (val) => val,
};

// ====== AutoComplete types ======
export class SlashCommandAutoCompleteNameResult extends AutoCompleteNameResult {}
export class SlashCommandCommandAutoCompleteOption extends AutoCompleteOption {}
export class SlashCommandEnumAutoCompleteOption extends AutoCompleteOption {}
export class SlashCommandNamedArgumentAutoCompleteOption extends AutoCompleteOption {}
export class SlashCommandQuickReplyAutoCompleteOption extends AutoCompleteOption {}
export class SlashCommandVariableAutoCompleteOption extends AutoCompleteOption {}

// ====== SlashCommandBreak.js ======
export class SlashCommandBreak extends SlashCommandExecutor {}

// ====== SlashCommandBreakPoint.js ======
export class SlashCommandBreakPoint extends SlashCommandExecutor {}

// ====== SlashCommandUnnamedArgumentAssignment.js ======
export class SlashCommandUnnamedArgumentAssignment {
  constructor() {}
}

// Default export
export default {};
