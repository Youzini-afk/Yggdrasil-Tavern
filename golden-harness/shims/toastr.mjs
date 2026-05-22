/**
 * toastr shim: No-op notification system.
 */

const toastr = {
  success: () => {},
  info: () => {},
  warning: () => {},
  error: () => {},
  options: {},
};

globalThis.toastr = toastr;

export { toastr };
