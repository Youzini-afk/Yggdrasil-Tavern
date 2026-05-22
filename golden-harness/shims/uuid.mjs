/**
 * UUID shim: Provides deterministic sequential UUIDs.
 * ST uses uuidv4 in many places; we replace it with a counter-based sequence.
 */

let _uuidCounter = 0;

function deterministicUuid() {
  _uuidCounter++;
  const hex = _uuidCounter.toString(16).padStart(12, '0');
  return `00000000-0000-4000-8000-${hex}`;
}

function resetUuidCounter() {
  _uuidCounter = 0;
}

function uuidv4() {
  return deterministicUuid();
}

// Install as global
globalThis.uuidv4 = uuidv4;

export { uuidv4, deterministicUuid, resetUuidCounter };
