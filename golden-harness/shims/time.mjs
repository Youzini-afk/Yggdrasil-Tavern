/**
 * Time shim: Freezes Date and moment to deterministic values.
 * Fixed epoch: 1748520000000 = 2026-05-22T12:00:00Z
 */

const FROZEN_EPOCH = 1748520000000; // 2026-05-22T12:00:00Z

// Save originals
const _RealDate = Date;

// Override Date
const FrozenDate = class Date extends _RealDate {
  constructor(...args) {
    if (args.length === 0) {
      super(FROZEN_EPOCH);
    } else {
      super(...args);
    }
  }

  static now() {
    return FROZEN_EPOCH;
  }

  static parse(str) {
    return _RealDate.parse(str);
  }

  static UTC(...args) {
    return _RealDate.UTC(...args);
  }
};

globalThis.Date = FrozenDate;

// Override performance.now
const _perfOrigin = 0;
globalThis.performance = {
  now: () => _perfOrigin,
  timeOrigin: _perfOrigin,
  mark: () => {},
  measure: () => {},
};

// We'll override moment.now when moment is loaded (see globals.mjs)
let _momentOverridden = false;

function overrideMomentNow(momentRef) {
  if (momentRef && typeof momentRef.now === 'function') {
    const origNow = momentRef.now;
    momentRef.now = () => FROZEN_EPOCH;
    _momentOverridden = true;
  }
}

export { FROZEN_EPOCH, FrozenDate, overrideMomentNow };
