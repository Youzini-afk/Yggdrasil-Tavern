/**
 * lib-shim.mjs: Replaces ST's webpack-bundled lib.js.
 * Provides the same named exports that ST modules expect from '../lib.js'.
 */

import Handlebars from 'handlebars';
import moment from 'moment';
import { seedrandom } from './rng.mjs';
import Fuse from 'fuse.js';
import DOMPurify from 'dompurify';
import DiffMatchPatch from 'diff-match-patch';

// Lodash stub — minimal implementation covering what ST uses
const lodash = {
  get: (obj, path, def) => {
    const keys = String(path).replace(/\[(\d+)\]/g, '.$1').split('.');
    let result = obj;
    for (const k of keys) { result = result?.[k]; }
    return result ?? def;
  },
  set: (obj, path, val) => {
    const keys = String(path).replace(/\[(\d+)\]/g, '.$1').split('.');
    let cur = obj;
    for (let i = 0; i < keys.length - 1; i++) { cur = cur[keys[i]] || (cur[keys[i]] = {}); }
    cur[keys[keys.length - 1]] = val;
    return obj;
  },
  cloneDeep: (obj) => JSON.parse(JSON.stringify(obj)),
  merge: (target, ...sources) => Object.assign(target, ...sources),
  throttle: (fn) => fn,
  debounce: (fn) => fn,
  isArray: Array.isArray,
  isObject: (v) => typeof v === 'object' && v !== null,
  isString: (v) => typeof v === 'string',
  isNumber: (v) => typeof v === 'number',
  isFunction: (v) => typeof v === 'function',
  isUndefined: (v) => v === undefined,
  isNull: (v) => v === null,
  isEmpty: (v) => !v || (typeof v === 'object' && Object.keys(v).length === 0),
  template: (str) => () => str,
  escape: (str) => String(str).replace(/[&<>"'`=\/]/g, (s) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s] || s)),
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),
  range: (start, end) => Array.from({ length: end - start }, (_, i) => start + i),
  uniq: (arr) => [...new Set(arr)],
  flatten: (arr) => arr.flat(),
  pick: (obj, keys) => keys.reduce((o, k) => { if (k in obj) o[k] = obj[k]; return o; }, {}),
  omit: (obj, keys) => Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k))),
  has: (obj, path) => { try { return lodash.get(obj, path) !== undefined; } catch { return false; } },
  find: (arr, pred) => arr?.find?.(pred),
  filter: (arr, pred) => arr?.filter?.(pred) || [],
  map: (arr, fn) => arr?.map?.(fn) || [],
  reduce: (arr, fn, init) => arr?.reduce?.(fn, init),
  forEach: (arr, fn) => arr?.forEach?.(fn),
  includes: (arr, val) => arr?.includes?.(val) || false,
  indexOf: (arr, val) => arr?.indexOf?.(val) ?? -1,
  sortBy: (arr, fn) => [...(arr || [])].sort(fn || ((a, b) => String(a).localeCompare(String(b)))),
  groupBy: (arr, fn) => { const groups = {}; (arr || []).forEach(item => { const key = typeof fn === 'function' ? fn(item) : item[fn]; (groups[key] = groups[key] || []).push(item); }); return groups; },
  keyBy: (arr, fn) => { const result = {}; (arr || []).forEach(item => { const key = typeof fn === 'function' ? fn(item) : item[fn]; result[key] = item; }); return result; },
  values: (obj) => Object.values(obj || {}),
  keys: (obj) => Object.keys(obj || {}),
  entries: (obj) => Object.entries(obj || {}),
  assign: Object.assign,
  defaults: (obj, ...srcs) => Object.assign({}, ...srcs.reverse(), obj),
  invert: (obj) => Object.fromEntries(Object.entries(obj || {}).map(([k, v]) => [v, k])),
  first: (arr) => arr?.[0],
  last: (arr) => arr?.[arr?.length - 1],
  chunk: (arr, size) => { const result = []; for (let i = 0; i < (arr || []).length; i += size) result.push(arr.slice(i, i + size)); return result; },
  noop: () => {},
  identity: (v) => v,
  constant: (v) => () => v,
  property: (path) => (obj) => lodash.get(obj, path),
  matches: (src) => (obj) => JSON.stringify(obj) === JSON.stringify(src),
  isEqual: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  isPlainObject: (v) => Object.prototype.toString.call(v) === '[object Object]',
  isInteger: Number.isInteger,
  isFinite: Number.isFinite,
  isNaN: Number.isNaN,
  toNumber: (v) => Number(v),
  toString: (v) => String(v),
  split: (str, sep, limit) => String(str || '').split(sep, limit),
  trim: (str) => String(str || '').trim(),
  lowerCase: (str) => String(str || '').toLowerCase(),
  upperCase: (str) => String(str || '').toUpperCase(),
  capitalize: (str) => String(str || '').charAt(0).toUpperCase() + String(str || '').slice(1),
  snakeCase: (str) => String(str || '').replace(/([A-Z])/g, '_$1').toLowerCase(),
  kebabCase: (str) => String(str || '').replace(/([A-Z])/g, '-$1').toLowerCase(),
  camelCase: (str) => String(str || '').replace(/[-_](.)/g, (_, c) => c.toUpperCase()),
  startCase: (str) => String(str || '').replace(/([A-Z])/g, ' $1').trim(),
  replace: (str, pattern, replacement) => String(str || '').replace(pattern, replacement),
  repeat: (str, n) => String(str || '').repeat(n),
  padStart: (str, len, fill) => String(str || '').padStart(len, fill),
  padEnd: (str, len, fill) => String(str || '').padEnd(len, fill),
};

const hljs = { highlight: (code) => ({ value: code }), highlightAuto: (code) => ({ value: code }) };
const localforage = { getItem: async () => null, setItem: async () => {}, removeItem: async () => {} };
const css = { parse: () => ({ stylesheet: { rules: [] } }), stringify: () => '' };
const Bowser = { getParser: () => ({ getBrowser: () => ({}), getOS: () => ({}), getPlatform: () => ({}) }), parse: () => ({ browser: {}, os: {}, platform: {} }) };
const showdown = { Converter: class Converter { makeHtml(text) { return text; } makeMd(html) { return html; } } };
const droll = globalThis.droll || { validate: () => true, roll: (n) => ({ rolls: [1], modifier: 0, total: 1, notation: n }), parse: (n) => ({ count: 1, sides: 1, modifier: 0, notation: n }) };
const morphdom = () => {};
const slideToggle = { toggle: () => {} };
const chalk = { red: (s) => s, green: (s) => s, yellow: (s) => s, blue: (s) => s, gray: (s) => s, bold: { red: (s) => s, green: (s) => s } };
const yaml = { parse: (s) => { try { return JSON.parse(s); } catch { return {}; } }, stringify: (o) => JSON.stringify(o, null, 2) };
// Chevrotain stubs — provide the functions that ST's macro lexer/parser uses
const chevrotain = {
  createToken: (config) => {
    const tokenType = {
      name: config.name,
      PATTERN: config.pattern,
      LABEL: config.label,
    };
    return tokenType;
  },
  Lexer: class Lexer {
    constructor(tokens) { this.tokens = tokens; }
    tokenize(text) { return { tokens: [], groups: {}, errors: [], lines: [...text.split('\n')] }; }
  },
  CstParser: class CstParser {
    constructor(tokens, config) { this.tokens = tokens; this.config = config; this.RULE = (name, fn) => fn; this.SUBRULE = (ref) => ref; this.CONSUME = (token) => token; this.OR = (alts) => alts?.[0]; this.OPTION = (fn) => fn?.(); this.MANY = (fn) => {}; this.MANY_SEP = (sep, fn) => {}; this.AT_LEAST_ONE = (fn) => fn?.(); this.consume = (idx, token) => token; this.subrule = (idx, ref) => ref; this.performSelfAnalysis = () => {}; this.getBaseCstVisitorConstructor = () => class {}; this.getGAstVisitor = () => class {}; }
  },
  tokenMatcher: () => false,
  EOF: { name: 'EOF', PATTERN: null },
};
const gzipSync = (buf) => buf;
const gzip = async (buf) => buf;
const sha256 = (s) => 'sha256-placeholder';
const SVGInject = { inject: async () => {} };
const Popper = {};

// Readability stubs — ST's utils.js imports these
const Readability = class Readability { constructor() {} parse() { return null; } };
const isProbablyReaderable = () => false;

export {
  lodash,
  Fuse,
  DOMPurify,
  hljs,
  localforage,
  Handlebars,
  css,
  Bowser,
  DiffMatchPatch,
  SVGInject,
  showdown,
  moment,
  seedrandom,
  droll,
  morphdom,
  slideToggle,
  chalk,
  yaml,
  chevrotain,
  gzipSync,
  gzip,
  sha256,
  Popper,
  Readability,
  isProbablyReaderable,
};

export function initLibraryShims() {
  // No-op in harness; we install globals directly
}

export default {
  lodash, Fuse, DOMPurify, hljs, localforage, Handlebars, css, Bowser,
  DiffMatchPatch, SVGInject, showdown, moment, seedrandom, droll, morphdom,
  slideToggle, chalk, yaml, chevrotain, gzipSync, gzip, sha256, Popper,
  Readability, isProbablyReaderable, initLibraryShims,
};
