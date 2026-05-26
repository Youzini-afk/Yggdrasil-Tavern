// SillyTavern public/scripts/st-context.js compatibility shim.

export function getContext() {
  return globalThis.SillyTavern?.getContext?.();
}
