/**
 * jQuery stub: Minimal $ function that provides only the methods ST touches.
 * Returns empty-element selectors for headless mode.
 */

function StubElement(selector) {
  this.selector = selector;
  this.length = 0;
  this._elements = [];
}

// Instance methods ST uses
StubElement.prototype.val = function (newVal) {
  if (newVal !== undefined) return this;
  return '';
};
StubElement.prototype.text = function (newText) {
  if (newText !== undefined) return this;
  return '';
};
StubElement.prototype.html = function (newHtml) {
  if (newHtml !== undefined) return this;
  return '';
};
StubElement.prototype.attr = function (name, value) {
  if (value !== undefined) return this;
  return undefined;
};
StubElement.prototype.prop = function (name, value) {
  if (value !== undefined) return this;
  return undefined;
};
StubElement.prototype.data = function (name, value) {
  if (value !== undefined) return this;
  return undefined;
};
StubElement.prototype.addClass = function () { return this; };
StubElement.prototype.removeClass = function () { return this; };
StubElement.prototype.toggleClass = function () { return this; };
StubElement.prototype.hasClass = function () { return false; };
StubElement.prototype.hide = function () { return this; };
StubElement.prototype.show = function () { return this; };
StubElement.prototype.css = function () { return this; };
StubElement.prototype.remove = function () { return this; };
StubElement.prototype.empty = function () { return this; };
StubElement.prototype.append = function () { return this; };
StubElement.prototype.prepend = function () { return this; };
StubElement.prototype.after = function () { return this; };
StubElement.prototype.before = function () { return this; };
StubElement.prototype.replaceWith = function () { return this; };
StubElement.prototype.trigger = function () { return this; };
StubElement.prototype.on = function () { return this; };
StubElement.prototype.off = function () { return this; };
StubElement.prototype.one = function () { return this; };
StubElement.prototype.each = function (cb) { return this; };
StubElement.prototype.find = function (sel) { return new StubElement(sel); };
StubElement.prototype.closest = function (sel) { return new StubElement(sel); };
StubElement.prototype.children = function (sel) { return new StubElement(sel || '*'); };
StubElement.prototype.parent = function () { return new StubElement('parent'); };
StubElement.prototype.parents = function (sel) { return new StubElement(sel || 'parent'); };
StubElement.prototype.siblings = function (sel) { return new StubElement(sel || '*'); };
StubElement.prototype.next = function () { return new StubElement('next'); };
StubElement.prototype.prev = function () { return new StubElement('prev'); };
StubElement.prototype.first = function () { return this; };
StubElement.prototype.last = function () { return this; };
StubElement.prototype.eq = function () { return this; };
StubElement.prototype.is = function () { return false; };
StubElement.prototype.filter = function () { return this; };
StubElement.prototype.not = function () { return this; };
StubElement.prototype.clone = function () { return new StubElement(this.selector); };
StubElement.prototype.wrap = function () { return this; };
StubElement.prototype.unwrap = function () { return this; };
StubElement.prototype.slideToggle = function () { return Promise.resolve(); };
StubElement.prototype.fadeIn = function () { return this; };
StubElement.prototype.fadeOut = function () { return this; };
StubElement.prototype.animate = function () { return this; };
StubElement.prototype.stop = function () { return this; };
StubElement.prototype.height = function () { return 0; };
StubElement.prototype.width = function () { return 0; };
StubElement.prototype.outerHeight = function () { return 0; };
StubElement.prototype.outerWidth = function () { return 0; };
StubElement.prototype.offset = function () { return { top: 0, left: 0 }; };
StubElement.prototype.position = function () { return { top: 0, left: 0 }; };
StubElement.prototype.scrollTop = function () { return 0; };
StubElement.prototype.scrollLeft = function () { return 0; };
StubElement.prototype[Symbol.iterator] = function* () { yield* this._elements; };

function $(selector) {
  if (typeof selector === 'function') {
    // $(function) — document ready
    selector();
    return;
  }
  if (typeof selector === 'string') {
    return new StubElement(selector);
  }
  if (selector instanceof window.Element || selector instanceof window.HTMLDocument) {
    const el = new StubElement('element');
    el.length = 1;
    el._elements = [selector];
    return el;
  }
  return new StubElement('unknown');
}

// Static methods
$.ajax = function (opts) {
  return Promise.reject(new Error('$.ajax blocked in harness'));
};
$.get = function () { return Promise.reject(new Error('$.get blocked')); };
$.post = function () { return Promise.reject(new Error('$.post blocked')); };
$.getJSON = function () { return Promise.reject(new Error('$.getJSON blocked')); };
$.Deferred = function () {
  const d = { resolve: () => d, reject: () => d, promise: () => ({ done: () => d, fail: () => d, always: () => d }) };
  return d;
};
$.when = function (...args) { return Promise.all(args); };
$.isArray = Array.isArray;
$.isFunction = (fn) => typeof fn === 'function';
$.isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);
$.isEmptyObject = (obj) => Object.keys(obj).length === 0;
$.isPlainObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]';
$.extend = Object.assign;
$.each = function (obj, cb) {
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => cb(i, v));
  } else {
    Object.entries(obj).forEach(([k, v]) => cb(k, v));
  }
  return obj;
};
$.trim = (str) => String(str).trim();
$.parseJSON = JSON.parse;
$.Event = class Event { constructor(type, props) { Object.assign(this, { type, ...props }); } };

// jQuery UI stubs
$.ui = { keyCode: { ENTER: 13, ESCAPE: 27, UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39 } };

// select2 stub — install on prototype chain
StubElement.prototype.select2 = function (opts) { return this; };

// Install as global
globalThis.$ = $;
globalThis.jQuery = $;

export { $ };
