// util-dir-shim.mjs: Catches all imports from ST's scripts/util/ directory
// Must provide all named exports that ST modules expect from util/ submodules

export class StructuredCloneMap {
  #map = new Map();
  constructor(iterable) {
    if (iterable && typeof iterable[Symbol.iterator] === 'function') {
      for (const [k, v] of iterable) { this.#map.set(k, v); }
    }
  }
  get size() { return this.#map.size; }
  get(key) { return this.#map.get(key); }
  set(key, val) { this.#map.set(key, val); return this; }
  has(key) { return this.#map.has(key); }
  delete(key) { return this.#map.delete(key); }
  clear() { this.#map.clear(); }
  forEach(cb) { this.#map.forEach(cb); }
  keys() { return this.#map.keys(); }
  values() { return this.#map.values(); }
  entries() { return this.#map.entries(); }
  [Symbol.iterator]() { return this.#map[Symbol.iterator](); }
  clone() { return new StructuredCloneMap(this.#map.entries()); }
}

export class AccountStorage {
  constructor() { this.data = {}; }
  getItem(k) { return this.data[k]; }
  setItem(k, v) { this.data[k] = v; }
  removeItem(k) { delete this.data[k]; }
}
export const accountStorage = new AccountStorage();

export class SimpleMutex {
  #locked = false;
  #queue = [];
  acquire() {
    return new Promise(resolve => {
      const tryAcquire = () => {
        if (!this.#locked) {
          this.#locked = true;
          resolve({ release: () => { this.#locked = false; if (this.#queue.length) this.#queue.shift()(); } });
        } else {
          this.#queue.push(tryAcquire);
        }
      };
      tryAcquire();
    });
  }
  update(fn) { return async (...args) => { const lock = await this.acquire(); try { return await fn(...args); } finally { lock.release(); } }; }
}

export class Semaphore {
  acquire() { return Promise.resolve({ release() {} }); }
}

// Other potential util/ exports
export function debounce(fn) { return fn; }
export function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
export function escapeRegex(str) { return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
export function uuidv4() { return '00000000-0000-0000-0000-000000000001'; }
export function getStringHash(str) { return 0; }
export function escapeHtml(str) { return str; }
export function onlyUnique(value, index, array) { return array.indexOf(value) === index; }
export function equalsIgnoreCaseAndAccents(a, b) { return a.toLowerCase() === b.toLowerCase(); }
export function isTrueBoolean(val) { return val === true || val === 'true'; }
export function isFalseBoolean(val) { return val === false || val === 'false'; }
export function parseJsonFile() { return {}; }
export function download() {}
export function getSortableDelay() { return 0; }
export function resetScrollHeight() {}
export function initScrollHeight() {}
export function flashHighlight() {}
export function select2ModifyOptions() {}
export function getSelect2OptionId() { return ''; }
export function dynamicSelect2DataViaAJAX() { return []; }
export function highlightRegex() { return ''; }
export function select2ChoiceClickSubscribe() {}
export function getSanitizedFilename(name) { return name; }
export function checkOverwriteExistingData() { return false; }
export function parseStringArray(str) { return Array.isArray(str) ? str : []; }
export function cancelDebounce() {}
export function findChar() { return null; }
export function normalizeArray() { return []; }
export function getUniqueName() { return ''; }
export function logSlashCommandWarn() {}
export function addLongPressEvent() {}
export function regexFromString(str) { return new RegExp(str); }
export function textValueMatcher() { return null; }
export function stringFormat() { return ''; }
export function isUuid() { return false; }
export function isValidUrl() { return false; }
export function isDataURL() { return false; }
export function getBase64Async() { return Promise.resolve(''); }
export function getFileText() { return Promise.resolve(''); }
export function getImageSizeFromDataURL() { return { width: 0, height: 0 }; }
export function getAudioDurationFromDataURL() { return Promise.resolve(0); }
export function getVideoDurationFromDataURL() { return Promise.resolve(0); }
export function createThumbnail() { return Promise.resolve(''); }
export function getCharaFilename() { return ''; }
export function getFileBuffer() { return Promise.resolve(null); }
export function extractDataFromPng() { return null; }
export function setValueByPath() {}
export function deleteValueByPath() {}
export function isSubsetOf() { return true; }
export function sanitizeSelector() { return ''; }
export function versionCompare() { return 0; }
export function PAGINATION_TEMPLATE() { return ''; }
export function navigation_option() { return {}; }

// Default export
export default {};
