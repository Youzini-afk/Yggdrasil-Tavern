// macros-dir-shim.mjs: Catches all imports from ST's scripts/macros/ directory
export function initRegisterMacros() {}
export const macros = {
  registry: {
    registerMacro() {},
    hasMacro() { return false; },
    getMacro() { return null; },
    unregisterMacro() {},
    getMacros() { return []; },
  },
};
export default {};
