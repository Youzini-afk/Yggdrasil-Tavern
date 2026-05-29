var wy = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function od(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var uh = { exports: {} }, fl = {}, dh = { exports: {} }, ye = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var xi = Symbol.for("react.element"), Sy = Symbol.for("react.portal"), ky = Symbol.for("react.fragment"), Ny = Symbol.for("react.strict_mode"), jy = Symbol.for("react.profiler"), Ey = Symbol.for("react.provider"), Cy = Symbol.for("react.context"), Ty = Symbol.for("react.forward_ref"), Iy = Symbol.for("react.suspense"), Ay = Symbol.for("react.memo"), Py = Symbol.for("react.lazy"), Af = Symbol.iterator;
function Ry(e) {
  return e === null || typeof e != "object" ? null : (e = Af && e[Af] || e["@@iterator"], typeof e == "function" ? e : null);
}
var fh = { isMounted: function() {
  return !1;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, ph = Object.assign, mh = {};
function ea(e, t, n) {
  this.props = e, this.context = t, this.refs = mh, this.updater = n || fh;
}
ea.prototype.isReactComponent = {};
ea.prototype.setState = function(e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, e, t, "setState");
};
ea.prototype.forceUpdate = function(e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function hh() {
}
hh.prototype = ea.prototype;
function ld(e, t, n) {
  this.props = e, this.context = t, this.refs = mh, this.updater = n || fh;
}
var cd = ld.prototype = new hh();
cd.constructor = ld;
ph(cd, ea.prototype);
cd.isPureReactComponent = !0;
var Pf = Array.isArray, gh = Object.prototype.hasOwnProperty, ud = { current: null }, vh = { key: !0, ref: !0, __self: !0, __source: !0 };
function _h(e, t, n) {
  var r, s = {}, i = null, o = null;
  if (t != null) for (r in t.ref !== void 0 && (o = t.ref), t.key !== void 0 && (i = "" + t.key), t) gh.call(t, r) && !vh.hasOwnProperty(r) && (s[r] = t[r]);
  var c = arguments.length - 2;
  if (c === 1) s.children = n;
  else if (1 < c) {
    for (var u = Array(c), p = 0; p < c; p++) u[p] = arguments[p + 2];
    s.children = u;
  }
  if (e && e.defaultProps) for (r in c = e.defaultProps, c) s[r] === void 0 && (s[r] = c[r]);
  return { $$typeof: xi, type: e, key: i, ref: o, props: s, _owner: ud.current };
}
function My(e, t) {
  return { $$typeof: xi, type: e.type, key: t, ref: e.ref, props: e.props, _owner: e._owner };
}
function dd(e) {
  return typeof e == "object" && e !== null && e.$$typeof === xi;
}
function Dy(e) {
  var t = { "=": "=0", ":": "=2" };
  return "$" + e.replace(/[=:]/g, function(n) {
    return t[n];
  });
}
var Rf = /\/+/g;
function $l(e, t) {
  return typeof e == "object" && e !== null && e.key != null ? Dy("" + e.key) : t.toString(36);
}
function ho(e, t, n, r, s) {
  var i = typeof e;
  (i === "undefined" || i === "boolean") && (e = null);
  var o = !1;
  if (e === null) o = !0;
  else switch (i) {
    case "string":
    case "number":
      o = !0;
      break;
    case "object":
      switch (e.$$typeof) {
        case xi:
        case Sy:
          o = !0;
      }
  }
  if (o) return o = e, s = s(o), e = r === "" ? "." + $l(o, 0) : r, Pf(s) ? (n = "", e != null && (n = e.replace(Rf, "$&/") + "/"), ho(s, t, n, "", function(p) {
    return p;
  })) : s != null && (dd(s) && (s = My(s, n + (!s.key || o && o.key === s.key ? "" : ("" + s.key).replace(Rf, "$&/") + "/") + e)), t.push(s)), 1;
  if (o = 0, r = r === "" ? "." : r + ":", Pf(e)) for (var c = 0; c < e.length; c++) {
    i = e[c];
    var u = r + $l(i, c);
    o += ho(i, t, n, u, s);
  }
  else if (u = Ry(e), typeof u == "function") for (e = u.call(e), c = 0; !(i = e.next()).done; ) i = i.value, u = r + $l(i, c++), o += ho(i, t, n, u, s);
  else if (i === "object") throw t = String(e), Error("Objects are not valid as a React child (found: " + (t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
  return o;
}
function zi(e, t, n) {
  if (e == null) return e;
  var r = [], s = 0;
  return ho(e, r, "", "", function(i) {
    return t.call(n, i, s++);
  }), r;
}
function Oy(e) {
  if (e._status === -1) {
    var t = e._result;
    t = t(), t.then(function(n) {
      (e._status === 0 || e._status === -1) && (e._status = 1, e._result = n);
    }, function(n) {
      (e._status === 0 || e._status === -1) && (e._status = 2, e._result = n);
    }), e._status === -1 && (e._status = 0, e._result = t);
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var Ct = { current: null }, go = { transition: null }, Ly = { ReactCurrentDispatcher: Ct, ReactCurrentBatchConfig: go, ReactCurrentOwner: ud };
function yh() {
  throw Error("act(...) is not supported in production builds of React.");
}
ye.Children = { map: zi, forEach: function(e, t, n) {
  zi(e, function() {
    t.apply(this, arguments);
  }, n);
}, count: function(e) {
  var t = 0;
  return zi(e, function() {
    t++;
  }), t;
}, toArray: function(e) {
  return zi(e, function(t) {
    return t;
  }) || [];
}, only: function(e) {
  if (!dd(e)) throw Error("React.Children.only expected to receive a single React element child.");
  return e;
} };
ye.Component = ea;
ye.Fragment = ky;
ye.Profiler = jy;
ye.PureComponent = ld;
ye.StrictMode = Ny;
ye.Suspense = Iy;
ye.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ly;
ye.act = yh;
ye.cloneElement = function(e, t, n) {
  if (e == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
  var r = ph({}, e.props), s = e.key, i = e.ref, o = e._owner;
  if (t != null) {
    if (t.ref !== void 0 && (i = t.ref, o = ud.current), t.key !== void 0 && (s = "" + t.key), e.type && e.type.defaultProps) var c = e.type.defaultProps;
    for (u in t) gh.call(t, u) && !vh.hasOwnProperty(u) && (r[u] = t[u] === void 0 && c !== void 0 ? c[u] : t[u]);
  }
  var u = arguments.length - 2;
  if (u === 1) r.children = n;
  else if (1 < u) {
    c = Array(u);
    for (var p = 0; p < u; p++) c[p] = arguments[p + 2];
    r.children = c;
  }
  return { $$typeof: xi, type: e.type, key: s, ref: i, props: r, _owner: o };
};
ye.createContext = function(e) {
  return e = { $$typeof: Cy, _currentValue: e, _currentValue2: e, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, e.Provider = { $$typeof: Ey, _context: e }, e.Consumer = e;
};
ye.createElement = _h;
ye.createFactory = function(e) {
  var t = _h.bind(null, e);
  return t.type = e, t;
};
ye.createRef = function() {
  return { current: null };
};
ye.forwardRef = function(e) {
  return { $$typeof: Ty, render: e };
};
ye.isValidElement = dd;
ye.lazy = function(e) {
  return { $$typeof: Py, _payload: { _status: -1, _result: e }, _init: Oy };
};
ye.memo = function(e, t) {
  return { $$typeof: Ay, type: e, compare: t === void 0 ? null : t };
};
ye.startTransition = function(e) {
  var t = go.transition;
  go.transition = {};
  try {
    e();
  } finally {
    go.transition = t;
  }
};
ye.unstable_act = yh;
ye.useCallback = function(e, t) {
  return Ct.current.useCallback(e, t);
};
ye.useContext = function(e) {
  return Ct.current.useContext(e);
};
ye.useDebugValue = function() {
};
ye.useDeferredValue = function(e) {
  return Ct.current.useDeferredValue(e);
};
ye.useEffect = function(e, t) {
  return Ct.current.useEffect(e, t);
};
ye.useId = function() {
  return Ct.current.useId();
};
ye.useImperativeHandle = function(e, t, n) {
  return Ct.current.useImperativeHandle(e, t, n);
};
ye.useInsertionEffect = function(e, t) {
  return Ct.current.useInsertionEffect(e, t);
};
ye.useLayoutEffect = function(e, t) {
  return Ct.current.useLayoutEffect(e, t);
};
ye.useMemo = function(e, t) {
  return Ct.current.useMemo(e, t);
};
ye.useReducer = function(e, t, n) {
  return Ct.current.useReducer(e, t, n);
};
ye.useRef = function(e) {
  return Ct.current.useRef(e);
};
ye.useState = function(e) {
  return Ct.current.useState(e);
};
ye.useSyncExternalStore = function(e, t, n) {
  return Ct.current.useSyncExternalStore(e, t, n);
};
ye.useTransition = function() {
  return Ct.current.useTransition();
};
ye.version = "18.3.1";
dh.exports = ye;
var P = dh.exports;
const J = /* @__PURE__ */ od(P);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var zy = P, By = Symbol.for("react.element"), $y = Symbol.for("react.fragment"), Hy = Object.prototype.hasOwnProperty, Fy = zy.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, Uy = { key: !0, ref: !0, __self: !0, __source: !0 };
function xh(e, t, n) {
  var r, s = {}, i = null, o = null;
  n !== void 0 && (i = "" + n), t.key !== void 0 && (i = "" + t.key), t.ref !== void 0 && (o = t.ref);
  for (r in t) Hy.call(t, r) && !Uy.hasOwnProperty(r) && (s[r] = t[r]);
  if (e && e.defaultProps) for (r in t = e.defaultProps, t) s[r] === void 0 && (s[r] = t[r]);
  return { $$typeof: By, type: e, key: i, ref: o, props: s, _owner: Fy.current };
}
fl.Fragment = $y;
fl.jsx = xh;
fl.jsxs = xh;
uh.exports = fl;
var a = uh.exports;
function fd(e) {
  return e.variants[e.active_variant];
}
const Yn = {
  APP_INITIALIZED: "app_initialized",
  // public/scripts/events.js:4
  APP_READY: "app_ready",
  // public/scripts/events.js:5
  EXTRAS_CONNECTED: "extras_connected",
  // public/scripts/events.js:6
  MESSAGE_SWIPED: "message_swiped",
  // public/scripts/events.js:7
  MESSAGE_SENT: "message_sent",
  // public/scripts/events.js:8
  MESSAGE_RECEIVED: "message_received",
  // public/scripts/events.js:9
  MESSAGE_EDITED: "message_edited",
  // public/scripts/events.js:10
  MESSAGE_DELETED: "message_deleted",
  // public/scripts/events.js:11
  MESSAGE_UPDATED: "message_updated",
  // public/scripts/events.js:12
  MESSAGE_FILE_EMBEDDED: "message_file_embedded",
  // public/scripts/events.js:13
  MESSAGE_REASONING_EDITED: "message_reasoning_edited",
  // public/scripts/events.js:14
  MESSAGE_REASONING_DELETED: "message_reasoning_deleted",
  // public/scripts/events.js:15
  MESSAGE_SWIPE_DELETED: "message_swipe_deleted",
  // public/scripts/events.js:16
  MORE_MESSAGES_LOADED: "more_messages_loaded",
  // public/scripts/events.js:17
  IMPERSONATE_READY: "impersonate_ready",
  // public/scripts/events.js:18
  CHAT_CHANGED: "chat_id_changed",
  // public/scripts/events.js:19
  CHAT_LOADED: "chatLoaded",
  // public/scripts/events.js:21
  GENERATION_AFTER_COMMANDS: "GENERATION_AFTER_COMMANDS",
  // public/scripts/events.js:22
  GENERATION_STARTED: "generation_started",
  // public/scripts/events.js:23
  GENERATION_STOPPED: "generation_stopped",
  // public/scripts/events.js:24
  GENERATION_ENDED: "generation_ended",
  // public/scripts/events.js:25
  SD_PROMPT_PROCESSING: "sd_prompt_processing",
  // public/scripts/events.js:26
  EXTENSIONS_FIRST_LOAD: "extensions_first_load",
  // public/scripts/events.js:27
  EXTENSION_SETTINGS_LOADED: "extension_settings_loaded",
  // public/scripts/events.js:28
  SETTINGS_LOADED: "settings_loaded",
  // public/scripts/events.js:29
  SETTINGS_UPDATED: "settings_updated",
  // public/scripts/events.js:30
  GROUP_UPDATED: "group_updated",
  // public/scripts/events.js:31
  MOVABLE_PANELS_RESET: "movable_panels_reset",
  // public/scripts/events.js:32
  SETTINGS_LOADED_BEFORE: "settings_loaded_before",
  // public/scripts/events.js:33
  SETTINGS_LOADED_AFTER: "settings_loaded_after",
  // public/scripts/events.js:34
  CHATCOMPLETION_SOURCE_CHANGED: "chatcompletion_source_changed",
  // public/scripts/events.js:35
  CHATCOMPLETION_MODEL_CHANGED: "chatcompletion_model_changed",
  // public/scripts/events.js:36
  OAI_PRESET_CHANGED_BEFORE: "oai_preset_changed_before",
  // public/scripts/events.js:37
  OAI_PRESET_CHANGED_AFTER: "oai_preset_changed_after",
  // public/scripts/events.js:38
  OAI_PRESET_EXPORT_READY: "oai_preset_export_ready",
  // public/scripts/events.js:39
  OAI_PRESET_IMPORT_READY: "oai_preset_import_ready",
  // public/scripts/events.js:40
  WORLDINFO_SETTINGS_UPDATED: "worldinfo_settings_updated",
  // public/scripts/events.js:41
  WORLDINFO_UPDATED: "worldinfo_updated",
  // public/scripts/events.js:42
  CHARACTER_EDITOR_OPENED: "character_editor_opened",
  // public/scripts/events.js:43
  CHARACTER_EDITED: "character_edited",
  // public/scripts/events.js:44
  CHARACTER_PAGE_LOADED: "character_page_loaded",
  // public/scripts/events.js:45
  CHARACTER_GROUP_OVERLAY_STATE_CHANGE_BEFORE: "character_group_overlay_state_change_before",
  // public/scripts/events.js:46
  CHARACTER_GROUP_OVERLAY_STATE_CHANGE_AFTER: "character_group_overlay_state_change_after",
  // public/scripts/events.js:47
  USER_MESSAGE_RENDERED: "user_message_rendered",
  // public/scripts/events.js:48
  CHARACTER_MESSAGE_RENDERED: "character_message_rendered",
  // public/scripts/events.js:49
  FORCE_SET_BACKGROUND: "force_set_background",
  // public/scripts/events.js:50
  CHAT_DELETED: "chat_deleted",
  // public/scripts/events.js:51
  CHAT_CREATED: "chat_created",
  // public/scripts/events.js:52
  CHAT_RENAMED: "chat_renamed",
  // public/scripts/events.js:53
  GROUP_CHAT_DELETED: "group_chat_deleted",
  // public/scripts/events.js:54
  GROUP_CHAT_CREATED: "group_chat_created",
  // public/scripts/events.js:55
  GENERATE_BEFORE_COMBINE_PROMPTS: "generate_before_combine_prompts",
  // public/scripts/events.js:56
  GENERATE_AFTER_COMBINE_PROMPTS: "generate_after_combine_prompts",
  // public/scripts/events.js:57
  GENERATE_AFTER_DATA: "generate_after_data",
  // public/scripts/events.js:58
  GROUP_MEMBER_DRAFTED: "group_member_drafted",
  // public/scripts/events.js:59
  GROUP_WRAPPER_STARTED: "group_wrapper_started",
  // public/scripts/events.js:60
  GROUP_WRAPPER_FINISHED: "group_wrapper_finished",
  // public/scripts/events.js:61
  WORLD_INFO_ACTIVATED: "world_info_activated",
  // public/scripts/events.js:62
  TEXT_COMPLETION_SETTINGS_READY: "text_completion_settings_ready",
  // public/scripts/events.js:63
  CHAT_COMPLETION_SETTINGS_READY: "chat_completion_settings_ready",
  // public/scripts/events.js:64
  CHAT_COMPLETION_PROMPT_READY: "chat_completion_prompt_ready",
  // public/scripts/events.js:65
  CHARACTER_FIRST_MESSAGE_SELECTED: "character_first_message_selected",
  // public/scripts/events.js:66
  CHARACTER_DELETED: "characterDeleted",
  // public/scripts/events.js:68
  CHARACTER_DUPLICATED: "character_duplicated",
  // public/scripts/events.js:69
  CHARACTER_RENAMED: "character_renamed",
  // public/scripts/events.js:70
  CHARACTER_RENAMED_IN_PAST_CHAT: "character_renamed_in_past_chat",
  // public/scripts/events.js:71
  SMOOTH_STREAM_TOKEN_RECEIVED: "stream_token_received",
  // public/scripts/events.js:73
  STREAM_TOKEN_RECEIVED: "stream_token_received",
  // public/scripts/events.js:74
  STREAM_REASONING_DONE: "stream_reasoning_done",
  // public/scripts/events.js:75
  FILE_ATTACHMENT_DELETED: "file_attachment_deleted",
  // public/scripts/events.js:76
  WORLDINFO_FORCE_ACTIVATE: "worldinfo_force_activate",
  // public/scripts/events.js:77
  OPEN_CHARACTER_LIBRARY: "open_character_library",
  // public/scripts/events.js:78
  ONLINE_STATUS_CHANGED: "online_status_changed",
  // public/scripts/events.js:79
  IMAGE_SWIPED: "image_swiped",
  // public/scripts/events.js:80
  CONNECTION_PROFILE_LOADED: "connection_profile_loaded",
  // public/scripts/events.js:81
  CONNECTION_PROFILE_CREATED: "connection_profile_created",
  // public/scripts/events.js:82
  CONNECTION_PROFILE_DELETED: "connection_profile_deleted",
  // public/scripts/events.js:83
  CONNECTION_PROFILE_UPDATED: "connection_profile_updated",
  // public/scripts/events.js:84
  TOOL_CALLS_PERFORMED: "tool_calls_performed",
  // public/scripts/events.js:85
  TOOL_CALLS_RENDERED: "tool_calls_rendered",
  // public/scripts/events.js:86
  CHARACTER_MANAGEMENT_DROPDOWN: "charManagementDropdown",
  // public/scripts/events.js:87
  SECRET_WRITTEN: "secret_written",
  // public/scripts/events.js:88
  SECRET_DELETED: "secret_deleted",
  // public/scripts/events.js:89
  SECRET_ROTATED: "secret_rotated",
  // public/scripts/events.js:90
  SECRET_EDITED: "secret_edited",
  // public/scripts/events.js:91
  PRESET_CHANGED: "preset_changed",
  // public/scripts/events.js:92
  PRESET_DELETED: "preset_deleted",
  // public/scripts/events.js:93
  PRESET_RENAMED: "preset_renamed",
  // public/scripts/events.js:94
  PRESET_RENAMED_BEFORE: "preset_renamed_before",
  // public/scripts/events.js:95
  MAIN_API_CHANGED: "main_api_changed",
  // public/scripts/events.js:96
  WORLDINFO_ENTRIES_LOADED: "worldinfo_entries_loaded",
  // public/scripts/events.js:97
  WORLDINFO_SCAN_DONE: "worldinfo_scan_done",
  // public/scripts/events.js:98
  MEDIA_ATTACHMENT_DELETED: "media_attachment_deleted",
  // public/scripts/events.js:99
  PERSONA_CHANGED: "persona_changed",
  // public/scripts/events.js:100
  PERSONA_CREATED: "persona_created",
  // public/scripts/events.js:101
  PERSONA_UPDATED: "persona_updated",
  // public/scripts/events.js:102
  PERSONA_RENAMED: "persona_renamed",
  // public/scripts/events.js:103
  PERSONA_DELETED: "persona_deleted",
  // public/scripts/events.js:104
  TTS_JOB_STARTED: "tts_job_started",
  // public/scripts/events.js:105
  TTS_AUDIO_READY: "tts_audio_ready",
  // public/scripts/events.js:106
  TTS_JOB_COMPLETE: "tts_job_complete",
  // public/scripts/events.js:107
  ITEMIZED_PROMPTS_LOADED: "itemized_prompts_loaded",
  // public/scripts/events.js:108
  ITEMIZED_PROMPTS_SAVED: "itemized_prompts_saved",
  // public/scripts/events.js:109
  ITEMIZED_PROMPTS_DELETED: "itemized_prompts_deleted"
  // public/scripts/events.js:110
}, Wy = [
  "main",
  "nsfw",
  "dialogueExamples",
  "jailbreak",
  "chatHistory",
  "worldInfoAfter",
  "worldInfoBefore",
  "enhanceDefinitions",
  "charDescription",
  "charPersonality",
  "scenario",
  "personaDescription",
  "custom UUID"
], Gy = [
  "temperature",
  "temp_openai",
  "frequency_penalty",
  "freq_pen_openai",
  "presence_penalty",
  "pres_pen_openai",
  "top_p",
  "top_p_openai",
  "top_k",
  "top_k_openai",
  "top_a",
  "top_a_openai",
  "min_p",
  "min_p_openai",
  "repetition_penalty",
  "repetition_penalty_openai",
  "seed",
  "n",
  "logit_bias",
  "logprobs",
  "stream",
  "reasoning_effort",
  "verbosity",
  "enable_web_search",
  "request_images",
  "request_image_resolution",
  "request_image_aspect_ratio",
  "temp",
  "temperature_last",
  "tfs",
  "epsilon_cutoff",
  "eta_cutoff",
  "typical_p",
  "typical",
  "rep_pen",
  "rep_pen_range",
  "repetition_penalty_range",
  "repeat_last_n",
  "rep_pen_decay",
  "repetition_decay",
  "rep_pen_slope",
  "no_repeat_ngram_size",
  "penalty_alpha",
  "num_beams",
  "length_penalty",
  "min_length",
  "minimum_message_content_tokens",
  "min_tokens",
  "encoder_rep_pen",
  "encoder_repetition_penalty",
  "freq_pen",
  "presence_pen",
  "skew",
  "do_sample",
  "early_stopping",
  "dynatemp",
  "dynamic_temperature",
  "min_temp",
  "max_temp",
  "dynatemp_low",
  "dynatemp_high",
  "dynatemp_range",
  "dynatemp_min",
  "dynatemp_max",
  "dynatemp_exponent",
  "dynatemp_mode",
  "smoothing_factor",
  "smoothing_curve",
  "dry_allowed_length",
  "dry_multiplier",
  "dry_base",
  "dry_sequence_breakers",
  "dry_penalty_last_n",
  "max_tokens_second",
  "sampler_seed",
  "add_bos_token",
  "stopping_strings",
  "stop",
  "truncation_length",
  "ban_eos_token",
  "ignore_eos",
  "ignore_eos_token",
  "skip_special_tokens",
  "include_reasoning",
  "streaming",
  "mirostat_mode",
  "mirostat",
  "mirostat_tau",
  "mirostat_eta",
  "guidance_scale",
  "negative_prompt",
  "grammar_string",
  "grammar",
  "grammar_retain_state",
  "json_schema",
  "guided_json",
  "json_schema_allow_empty",
  "banned_tokens",
  "global_banned_tokens",
  "send_banned_tokens",
  "custom_token_bans",
  "banned_strings",
  "sampler_priority",
  "samplers",
  "samplers_priorities",
  "sampler_order",
  "xtc_threshold",
  "xtc_probability",
  "nsigma",
  "top_n_sigma",
  "min_keep",
  "adaptive_target",
  "adaptive_decay",
  "spaces_between_special_tokens",
  "speculative_ngram",
  "max_new_tokens",
  "max_tokens",
  "n_predict",
  "num_predict",
  "num_ctx",
  "n_probs",
  "cache_prompt",
  "trim_stop",
  "include_stop_str_in_output",
  "streaming_kobold",
  "use_default_badwordsids",
  "repetition_penalty_slope",
  "repetition_penalty_frequency",
  "repetition_penalty_presence",
  "tail_free_sampling",
  "math1_temp",
  "math1_quad",
  "math1_quad_entropy_scale",
  "streaming_novel",
  "bad_words_ids",
  "order",
  "logit_bias_exp",
  "phrase_rep_pen",
  "mirostat_lr",
  "num_logprobs",
  "generate_until_sentence",
  "use_cache",
  "return_full_text",
  "prefix",
  "preamble",
  "frmtadsnsp",
  "frmtrmblln",
  "frmtrmspch",
  "frmttriminc",
  "trusted_workers",
  "models"
];
let Mf = 0;
function bh(e) {
  return new Ky(e);
}
function Vy(e) {
  const n = fd(e)?.subs ?? [], r = nx(n);
  return {
    is_user: e.role === "user",
    is_system: e.role === "system",
    name: e.speaker?.name,
    send_date: new Date(e.created_at).toISOString(),
    mes: Df(n),
    swipe_id: e.active_variant,
    swipes: e.variants.map((i) => Df(i.subs)),
    extra: r
  };
}
class Ky {
  chatId;
  chatMeta;
  turns;
  extrasByTurnId = /* @__PURE__ */ new Map();
  constructor(t) {
    this.chatId = t.id, this.chatMeta = { ...t.meta }, this.turns = t.turns.map((n, r) => Bi(n, r));
  }
  get length() {
    return this.turns.length;
  }
  snapshot() {
    return {
      id: this.chatId,
      meta: { ...this.chatMeta },
      turns: this.turns.map((t, n) => Bi(t, n))
    };
  }
  messageAt(t) {
    const n = this.turns[t];
    if (n !== void 0)
      return this.projectStoredTurn(n);
  }
  messages() {
    return this.turns.map((t) => this.projectStoredTurn(t));
  }
  pushMessage(t) {
    const n = Hl(t, this.turns.length);
    return this.turns = [...this.turns, n], Fl(t, "extra") && this.extrasByTurnId.set(n.id, t.extra), n;
  }
  updateMessage(t, n) {
    const r = this.turns[t];
    if (r === void 0)
      return;
    const i = { ...this.projectStoredTurn(r), ...n }, o = Hl(i, t, r);
    return this.turns = this.turns.map((c, u) => u === t ? o : c), Fl(n, "extra") ? this.extrasByTurnId.set(o.id, n.extra) : this.extrasByTurnId.has(r.id) && o.id !== r.id && (this.extrasByTurnId.set(o.id, this.extrasByTurnId.get(r.id)), this.extrasByTurnId.delete(r.id)), o;
  }
  deleteMessage(t) {
    if (t < 0 || t >= this.turns.length)
      return;
    const [n] = this.turns.splice(t, 1);
    return n !== void 0 && this.extrasByTurnId.delete(n.id), this.renumberTurns(), n;
  }
  spliceMessages(t, n, ...r) {
    const s = sx(t, this.turns.length), i = Math.max(0, Math.min(n, this.turns.length - s)), o = r.map((u, p) => Hl(u, s + p)), c = this.turns.splice(s, i, ...o);
    return c.forEach((u) => this.extrasByTurnId.delete(u.id)), r.forEach((u, p) => {
      Fl(u, "extra") && this.extrasByTurnId.set(o[p]?.id ?? "", u.extra);
    }), this.renumberTurns(), c.map((u) => Bi(u, u.index));
  }
  projectStoredTurn(t) {
    const n = Vy(t);
    if (!this.extrasByTurnId.has(t.id))
      return n;
    const r = this.extrasByTurnId.get(t.id);
    if (r === void 0) {
      const { extra: s, ...i } = n;
      return i;
    }
    return { ...n, extra: r };
  }
  renumberTurns() {
    this.turns = this.turns.map((t, n) => Bi(t, n));
  }
}
function Hl(e, t, n) {
  const r = Yy(e), s = Date.now(), i = Zy(e.send_date) ?? n?.created_at ?? s, o = n?.variants[0]?.created_at ?? i, u = {
    id: n?.variants[0]?.id ?? Of("st-variant"),
    subs: qy(e),
    meta: n?.variants[0]?.meta ?? {},
    created_at: o
  };
  return {
    id: n?.id ?? Of("st-turn"),
    index: t,
    role: r,
    speaker: typeof e.name == "string" && e.name.length > 0 ? { name: e.name, kind: Xy(r) } : void 0,
    variants: [u],
    active_variant: 0,
    source: Qy(r, n?.source),
    created_at: i,
    edited_at: n === void 0 ? void 0 : s
  };
}
function qy(e) {
  const t = [];
  typeof e.mes == "string" && t.push({ kind: "text", text: e.mes, segment_role: "main" }), e.extra?.reasoning !== void 0 && t.push({ kind: "thinking", text: e.extra.reasoning });
  const n = e.extra?.notes;
  return n !== void 0 && n.forEach((r) => t.push({ kind: "note", text: r })), t;
}
function Yy(e) {
  return e.is_system === !0 ? "system" : e.is_user === !0 ? "user" : "assistant";
}
function Qy(e, t) {
  return e === "system" ? "system" : e === "user" ? "user_input" : t ?? "generation";
}
function Xy(e) {
  return e === "user" ? "user" : e === "system" ? "system" : e === "tool" ? "tool" : "character";
}
function Zy(e) {
  if (e === void 0)
    return;
  const t = Date.parse(e);
  return Number.isFinite(t) ? t : void 0;
}
function Bi(e, t) {
  return {
    ...e,
    index: t,
    speaker: e.speaker === void 0 ? void 0 : { ...e.speaker },
    variants: e.variants.map(Jy)
  };
}
function Jy(e) {
  return {
    ...e,
    meta: { ...e.meta },
    subs: e.subs.map(ex)
  };
}
function ex(e) {
  return { ...e };
}
function Df(e) {
  return e.filter(tx).map((t) => t.text).join(`
`);
}
function tx(e) {
  return e.kind === "text" && (e.segment_role === void 0 || e.segment_role === "main");
}
function nx(e) {
  const t = e.filter((i) => i.kind === "thinking").map((i) => i.text).join(`
`), n = e.flatMap((i) => rx(i)), r = e.filter((i) => i.kind === "note").map((i) => i.text), s = {
    ...t.length > 0 ? { reasoning: t } : {},
    ...n.length > 0 ? { tool_invocations: n } : {},
    ...r.length > 0 ? { notes: r } : {}
  };
  return Object.keys(s).length > 0 ? s : void 0;
}
function rx(e) {
  return e.kind === "tool_call" ? [
    {
      type: "tool_call",
      call_id: e.call_id,
      tool: e.tool,
      arguments: e.arguments
    }
  ] : e.kind === "tool_result" ? [
    {
      type: "tool_result",
      call_id: e.call_id,
      status: e.status,
      result: e.result
    }
  ] : [];
}
function Of(e) {
  return Mf += 1, `${e}-${Mf}`;
}
function sx(e, t) {
  return e < 0 ? Math.max(t + e, 0) : Math.min(e, t);
}
function Fl(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
const Lf = /* @__PURE__ */ new Set(["push", "pop", "splice"]), ax = /* @__PURE__ */ new Set(["mes", "name", "is_user", "is_system", "extra"]);
function ix(e, t = {}) {
  const n = [];
  return new Proxy(n, {
    get(r, s) {
      if (s === "length")
        return e.length;
      if (s === Symbol.iterator)
        return function* () {
          for (let u = 0; u < e.length; u += 1) {
            const p = e.messageAt(u);
            p !== void 0 && (yield zf(e, t, u, p));
          }
        };
      if (Lf.has(s))
        return ox(e, t, s);
      if (typeof s == "string" && $i(s)) {
        const c = Number(s), u = e.messageAt(c);
        return u === void 0 ? void 0 : zf(e, t, c, u);
      }
      const i = e.messages(), o = Reflect.get(i, s, i);
      return typeof o == "function" ? o.bind(i) : o;
    },
    set(r, s, i) {
      if (typeof s == "string" && $i(s)) {
        const o = ux(i), c = Number(s);
        if (c < e.length)
          e.updateMessage(c, cx(o)), t.onEdit?.(c, e.messageAt(c) ?? o);
        else if (c === e.length)
          e.pushMessage(o), t.onPush?.([o]);
        else
          return !1;
        return !0;
      }
      if (s === "length" && typeof i == "number") {
        if (!Number.isInteger(i) || i < 0)
          return !1;
        for (; e.length > i; ) {
          const o = e.length - 1, c = e.messageAt(o);
          c !== void 0 && (e.deleteMessage(o), t.onDelete?.(o, c));
        }
        return !0;
      }
      return !1;
    },
    deleteProperty(r, s) {
      if (typeof s != "string" || !$i(s))
        return !1;
      const i = Number(s);
      if (i >= e.length)
        return !0;
      const o = e.messageAt(i);
      return o !== void 0 && (e.deleteMessage(i), t.onDelete?.(i, o)), !0;
    },
    has(r, s) {
      if (s === "length" || s === Symbol.iterator || Lf.has(s))
        return !0;
      if (typeof s == "string" && $i(s))
        return Number(s) < e.length;
      const i = e.messages();
      return s in i;
    }
  });
}
function ox(e, t, n) {
  return n === "push" ? (...r) => (r.forEach((s) => e.pushMessage(s)), r.length > 0 && t.onPush?.(r), e.length) : n === "pop" ? () => {
    const r = e.length - 1, s = r >= 0 ? e.messageAt(r) : void 0;
    return s !== void 0 && (e.deleteMessage(r), t.onDelete?.(r, s)), s;
  } : (r, s, ...i) => {
    const o = fx(r, e.length), c = s ?? e.length - o, u = e.messages().slice(o, o + c);
    return e.spliceMessages(o, c, ...i), u.forEach((p, h) => {
      t.onDelete?.(o + h, p);
    }), i.forEach((p, h) => {
      t.onEdit?.(o + h, p);
    }), u;
  };
}
function zf(e, t, n, r) {
  const s = { ...r };
  return new Proxy(s, {
    set(i, o, c) {
      if (!ax.has(o))
        return Reflect.set(i, o, c);
      const u = lx(o, c);
      return e.updateMessage(n, u) === void 0 ? !1 : (Reflect.set(i, o, c), t.onEdit?.(n, e.messageAt(n) ?? r), !0);
    }
  });
}
function lx(e, t) {
  if (e === "mes") {
    if (typeof t != "string" && t !== void 0)
      throw new TypeError("ST message mes must be a string");
    return { mes: t };
  }
  if (e === "name") {
    if (typeof t != "string" && t !== void 0)
      throw new TypeError("ST message name must be a string");
    return { name: t };
  }
  if (e === "is_user") {
    if (typeof t != "boolean" && t !== void 0)
      throw new TypeError("ST message is_user must be a boolean");
    return { is_user: t };
  }
  if (e === "is_system") {
    if (typeof t != "boolean" && t !== void 0)
      throw new TypeError("ST message is_system must be a boolean");
    return { is_system: t };
  }
  if (t !== void 0 && !dx(t))
    throw new TypeError("ST message extra must be an object");
  return { extra: t };
}
function cx(e) {
  return {
    mes: e.mes,
    name: e.name,
    is_user: e.is_user,
    is_system: e.is_system,
    extra: e.extra
  };
}
function ux(e) {
  if (typeof e != "object" || e === null)
    throw new TypeError("ST chat messages must be objects");
  return e;
}
function dx(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function $i(e) {
  if (e.length === 0)
    return !1;
  const t = Number(e);
  return Number.isInteger(t) && t >= 0 && t < 2 ** 32 - 1 && String(t) === e;
}
function fx(e, t) {
  return e < 0 ? Math.max(t + e, 0) : Math.min(e, t);
}
function px() {
  const e = /* @__PURE__ */ new Map(), t = {
    eventTypes: Yn,
    on(n, r) {
      return Bf(e, n, r, !1), this;
    },
    once(n, r) {
      return Bf(e, n, r, !0), this;
    },
    off(n, r) {
      const s = n, i = e.get(s);
      if (i === void 0)
        return this;
      const o = i.filter((c) => c.listener !== r);
      return o.length === 0 ? e.delete(s) : e.set(s, o), this;
    },
    emit(n, ...r) {
      const s = n, i = e.get(s);
      if (i === void 0 || i.length === 0)
        return !1;
      const o = [...i];
      for (const c of o)
        c.listener(...r), c.once && t.off(n, c.listener);
      return !0;
    },
    listenerCount(n) {
      return e.get(n)?.length ?? 0;
    }
  };
  return t;
}
function Bf(e, t, n, r) {
  const s = t, i = e.get(s) ?? [];
  e.set(s, [...i, { listener: n, once: r }]);
}
const mx = /{{\s*([A-Za-z0-9_.-]+)\s*}}/g;
function hx(e, t = {}, n = {}) {
  const r = [], s = n.previewLength ?? 80, i = yx(n.now ?? t.now ?? Date.now());
  return { text: e.replace(mx, (c, u) => {
    const p = gx(u, t, n, i);
    return r.push({ name: u, source: p.source, preview: _x(p.value, s) }), p.source === "unknown" ? n.unknownMacro === "empty" ? "" : c : p.value;
  }), trace: r };
}
function gx(e, t, n, r) {
  const s = vx(e, n.overrides, t.overrides, t.dynamic);
  if (s !== void 0)
    return { value: wh(s), source: "dynamic" };
  switch (e) {
    case "user":
      return Cn(t.user);
    case "char":
      return Cn(t.char);
    case "description":
      return Cn(t.description);
    case "personality":
      return Cn(t.personality);
    case "scenario":
      return Cn(t.scenario);
    case "persona":
      return Cn(t.persona);
    case "charDepthPrompt":
      return Cn(t.charDepthPrompt);
    case "creatorNotes":
      return Cn(t.creatorNotes);
    case "mesExamples":
      return Cn(t.mesExamples);
    case "model":
      return Cn(t.model);
    case "date":
      return { value: r.toISOString().slice(0, 10), source: "computed" };
    case "time":
      return { value: r.toISOString().slice(11, 19), source: "computed" };
    default:
      return { value: "", source: "unknown" };
  }
}
function vx(e, ...t) {
  for (const n of t)
    if (n !== void 0 && Object.prototype.hasOwnProperty.call(n, e))
      return n[e];
}
function Cn(e) {
  return e === void 0 ? { value: "", source: "unknown" } : { value: wh(e), source: "context" };
}
function wh(e) {
  return e == null ? "" : String(e);
}
function _x(e, t) {
  return e.length <= t ? e : `${e.slice(0, Math.max(0, t - 1))}…`;
}
function yx(e) {
  return e instanceof Date ? e : new Date(e);
}
function Sh(e) {
  const t = [];
  for (const n of $f(e, [`
`, ";"])) {
    const r = n.trim();
    if (r.length === 0)
      continue;
    if (!r.startsWith("/")) {
      t.push({ type: "text", text: r, raw: n });
      continue;
    }
    const s = $f(r, ["|"]).map((i) => xx(i.trim())).filter(Ex);
    t.push({ type: "pipeline", commands: s, raw: n });
  }
  return { type: "program", body: t };
}
function xx(e) {
  if (!e.startsWith("/"))
    return;
  const t = e.slice(1).trimStart();
  if (t.length === 0)
    return;
  const n = t.search(/\s/u), r = jx(n === -1 ? t : t.slice(0, n)), s = n === -1 ? "" : t.slice(n).trimStart();
  return {
    type: "command",
    name: r,
    args: wx(s).map(bx),
    rawArgs: s,
    raw: e
  };
}
function bx(e) {
  if (e.closure !== void 0)
    return e.closure;
  const t = e.value.indexOf("=");
  return t > 0 ? {
    type: "named",
    key: e.value.slice(0, t),
    value: e.value.slice(t + 1),
    raw: e.raw
  } : { type: "text", value: e.value, raw: e.raw };
}
function wx(e) {
  const t = [];
  let n = 0;
  for (; n < e.length; ) {
    for (; n < e.length && /\s/u.test(e[n] ?? ""); )
      n += 1;
    if (n >= e.length)
      break;
    const r = Nx(e, n);
    if (r !== void 0 && r.argument.body.trim() !== "pipe") {
      t.push({ value: r.argument.body, raw: r.argument.raw, closure: r.argument }), n = r.nextIndex;
      continue;
    }
    const s = Sx(e, n);
    t.push(s.token), n = s.nextIndex;
  }
  return t;
}
function Sx(e, t) {
  let n = t, r = "", s = "";
  for (; n < e.length && !/\s/u.test(e[n] ?? ""); ) {
    const i = e[n] ?? "";
    if (i === '"' || i === "'") {
      const o = kx(e, n, i);
      r += o.value, s += o.raw, n = o.nextIndex;
      continue;
    }
    r += i, s += i, n += 1;
  }
  return { token: { value: r, raw: s }, nextIndex: n };
}
function kx(e, t, n) {
  let r = t + 1, s = "", i = n;
  for (; r < e.length; ) {
    const o = e[r] ?? "";
    if (i += o, r += 1, o === "\\") {
      const c = e[r] ?? "";
      c.length > 0 && (s += c, i += c, r += 1);
      continue;
    }
    if (o === n)
      return { value: s, raw: i, nextIndex: r };
    s += o;
  }
  return { value: s, raw: i, nextIndex: r };
}
function Nx(e, t) {
  const n = e.startsWith("{{", t), r = !n && e[t] === "{";
  if (!n && !r)
    return;
  const s = n ? "{{" : "{", i = n ? "}}" : "}";
  let o = t + s.length, c = 1, u = "";
  for (; o < e.length; ) {
    if (e.startsWith(s, o)) {
      c += 1, u += s, o += s.length;
      continue;
    }
    if (e.startsWith(i, o)) {
      if (c -= 1, c === 0) {
        const p = o + i.length;
        return {
          argument: {
            type: "closure",
            body: u.trim(),
            raw: e.slice(t, p),
            style: n ? "double-brace" : "brace"
          },
          nextIndex: p
        };
      }
      u += i, o += i.length;
      continue;
    }
    u += e[o] ?? "", o += 1;
  }
}
function $f(e, t) {
  const n = [];
  let r, s = 0, i = 0, o = 0;
  for (; o < e.length; ) {
    const c = e[o] ?? "";
    if (r !== void 0) {
      if (c === "\\") {
        o += 2;
        continue;
      }
      c === r && (r = void 0), o += 1;
      continue;
    }
    if (c === '"' || c === "'") {
      r = c, o += 1;
      continue;
    }
    if (c === "{") {
      s += 1, o += 1;
      continue;
    }
    if (c === "}") {
      s = Math.max(0, s - 1), o += 1;
      continue;
    }
    s === 0 && t.includes(c) && (n.push(e.slice(i, o)), i = o + 1), o += 1;
  }
  return n.push(e.slice(i)), n;
}
function jx(e) {
  return e.trim().replace(/^\/+/, "").toLowerCase();
}
function Ex(e) {
  return e !== void 0;
}
function pd(e = {}) {
  const t = e.parent, n = e.globalVariables ?? t?.globalVariables ?? /* @__PURE__ */ new Map(), r = e.globalClosures ?? t?.globalClosures ?? /* @__PURE__ */ new Map(), s = e.localVariables ?? /* @__PURE__ */ new Map(), i = e.closures ?? /* @__PURE__ */ new Map(), o = {
    parent: t,
    variables: n,
    globalVariables: n,
    localVariables: s,
    closures: i,
    globalClosures: r,
    pipe: e.pipe ?? t?.pipe ?? "",
    breakRequested: !1,
    maxIterations: e.maxIterations ?? t?.maxIterations ?? 100,
    getVariable: (c) => s.get(c) ?? t?.getVariable(c) ?? n.get(c),
    setLocalVariable: (c, u) => {
      s.set(c, u);
    },
    setGlobalVariable: (c, u) => {
      n.set(c, u);
    },
    getClosure: (c) => i.get(c) ?? t?.getClosure(c) ?? r.get(c),
    setLocalClosure: (c, u) => {
      i.set(c, u);
    },
    setGlobalClosure: (c, u) => {
      r.set(c, u);
    },
    createChild: () => pd({ parent: o })
  };
  return o;
}
function Cx(e, t, n, r = pd({ globalVariables: t.variables }), s = {}) {
  const i = typeof e == "string" ? Sh(e) : e, o = typeof e == "string" ? e : i.body.map((h) => h.raw).join(`
`), c = [], u = [], p = [];
  for (const h of i.body) {
    if (h.type === "text") {
      const w = Oc(h.text, r.pipe);
      w.length > 0 && (c.push(w), r.pipe = w);
      continue;
    }
    let x = r.pipe, g = !0;
    for (const w of h.commands) {
      r.pipe = x;
      const E = t.invokeSTScriptCommand(Tx(w, x), n, r);
      if (u.push(E), p.push(...E.diagnostics), g = g && E.ok, x = E.output, r.pipe = x, !E.ok && s.stopOnError === !0 || r.breakRequested)
        break;
    }
    if (x.length > 0 && c.push(x), !g && s.stopOnError === !0 || r.breakRequested)
      break;
  }
  return {
    ok: u.every((h) => h.ok) && p.length === 0,
    input: o,
    output: c.join(`
`),
    executions: u,
    diagnostics: p,
    variables: Object.fromEntries(r.globalVariables.entries()),
    state: r
  };
}
function Tx(e, t) {
  const n = e.args.map((r) => Ix(r, t));
  return {
    ...e,
    args: n,
    rawArgs: Ax(n)
  };
}
function Ix(e, t) {
  return e.type === "closure" ? e : e.type === "named" ? { ...e, value: Oc(e.value, t) } : { ...e, value: Oc(e.value, t) };
}
function Oc(e, t) {
  return e.replaceAll("{{pipe}}", t);
}
function Ax(e) {
  return e.map((t) => t.type === "closure" ? t.raw : t.type === "named" ? `${t.key}=${t.value}` : t.value).join(" ");
}
function Px(e, t = /* @__PURE__ */ new Map()) {
  const n = /* @__PURE__ */ new Map(), r = [], s = pd({ globalVariables: t }), c = {
    variables: t,
    diagnostics: r,
    slashCommands: () => {
      const p = /* @__PURE__ */ new Map();
      for (const h of n.values())
        p.set(h.name, {
          name: h.name,
          aliases: h.aliases,
          help: h.metadata.help,
          returns: h.metadata.returns,
          namedArgs: h.metadata.namedArgs,
          unnamedArgs: h.metadata.unnamedArgs
        });
      return [...p.values()].sort((h, x) => h.name.localeCompare(x.name));
    },
    registerSlashCommand: (p, h, x = []) => {
      const g = Wx(x) ? { aliases: x } : x, w = Hf(p), E = (g.aliases ?? []).map(Hf).filter((D) => D.length > 0 && D !== w);
      if (w.length === 0)
        throw new Error("Slash command name must not be empty.");
      const I = { name: w, aliases: E, metadata: g, callback: h };
      n.set(w, I);
      for (const D of E)
        n.set(D, I);
    },
    executeSlashCommands: (p, h = {}) => {
      const x = h.state ?? s, g = Cx(p, u, e(), x, h);
      return r.push(...g.diagnostics), g;
    }
  }, u = {
    variables: t,
    invokeSTScriptCommand: (p, h, x) => {
      const g = n.get(p.name);
      if (g === void 0) {
        const I = Vs("unknown-command", `Unknown slash command: /${p.name}`, p.name);
        return { name: p.name, raw: p.raw, ok: !1, output: "", diagnostics: [I] };
      }
      const w = Hx(g.callback({
        name: g.name,
        args: p.rawArgs,
        argv: p.args.filter(Fx).map((I) => I.value),
        namedArgs: Object.fromEntries(p.args.filter(Ux).map((I) => [I.key, I.value])),
        raw: p.raw,
        context: h,
        variables: t,
        state: x
      })), E = w.diagnostics ?? [];
      return { name: g.name, raw: p.raw, ok: w.ok, output: w.output, diagnostics: E };
    }
  };
  return Rx(c), c;
}
function Rx(e) {
  e.registerSlashCommand("gen", ({ args: t, context: n }) => Ul(n.Generate({ text: t })), {
    help: "Generate a message from text.",
    returns: "generated text"
  }), e.registerSlashCommand("continue", ({ context: t }) => Ul(t.Generate({ text: "[ydltavern fake continue]" }))), e.registerSlashCommand("swipe", ({ context: t }) => Ul(t.Generate({ text: "[ydltavern fake swipe]" }))), e.registerSlashCommand("setvar", ({ args: t, state: n }) => Wl(t, n, "global")), e.registerSlashCommand("getvar", ({ args: t, state: n }) => n.getVariable(t.trim()) ?? ""), e.registerSlashCommand("if", ({ args: t, context: n, state: r }) => Mx(t, n, r)), e.registerSlashCommand("run", ({ argv: t, args: n, context: r, state: s }) => Dx(t, n, r, s)), e.registerSlashCommand("let", ({ args: t, state: n }) => Wl(t, n, "local")), e.registerSlashCommand("var", ({ args: t, state: n }) => Wl(t, n, "global")), e.registerSlashCommand("while", ({ argv: t, args: n, namedArgs: r, context: s, state: i }) => Ox(t, n, r, s, i)), e.registerSlashCommand("break", ({ state: t }) => (t.breakRequested = !0, ""));
}
function Ul(e) {
  return e.message.mes ?? "";
}
function Wl(e, t, n) {
  const r = Lx(e);
  if (r === void 0)
    return {
      ok: !1,
      output: "",
      diagnostics: [Vs(`invalid-${n === "local" ? "let" : "setvar"}`, `Expected /${n === "local" ? "let" : "setvar"} name=value or name value.`, n === "local" ? "let" : "setvar")]
    };
  if (md(r.value)) {
    const s = pl(r.value);
    if (s !== void 0)
      return n === "local" ? t.setLocalClosure(r.name, s) : t.setGlobalClosure(r.name, s), { ok: !0, output: "" };
  }
  return n === "local" ? t.setLocalVariable(r.name, r.value) : t.setGlobalVariable(r.name, r.value), { ok: !0, output: r.value };
}
function Mx(e, t, n) {
  const r = zx(e);
  if (r === void 0)
    return {
      ok: !1,
      output: "",
      diagnostics: [Vs("invalid-if", "Expected /if left == right then ... else ...", "if")]
    };
  const s = Ia(r.left, n), i = Ia(r.right, n), o = s === i ? r.thenCommand : r.elseCommand;
  if (o === void 0 || o.length === 0)
    return { ok: !0, output: "" };
  if (!o.startsWith("/"))
    return { ok: !0, output: o };
  const c = t.executeSlashCommands(o, { state: n });
  return { ok: c.ok, output: c.output, diagnostics: c.diagnostics };
}
function Dx(e, t, n, r) {
  const s = e[0], o = pl(t.trim()) ?? (s === void 0 ? void 0 : r.getClosure(s));
  if (o === void 0)
    return {
      ok: !1,
      output: "",
      diagnostics: [Vs("unknown-run-target", `Unknown /run target: ${t.trim() || "<empty>"}`, "run")]
    };
  const c = r.createChild();
  c.pipe = r.pipe;
  const u = n.executeSlashCommands(o.body, { state: c });
  return r.pipe = u.state.pipe, u.state.breakRequested && (r.breakRequested = !0), { ok: u.ok, output: u.output, diagnostics: u.diagnostics };
}
function Ox(e, t, n, r, s) {
  const i = Gx(t) ?? pl(e.at(-1) ?? ""), o = Vx(n.maxIterations ?? n.max ?? "", s.maxIterations);
  if (i === void 0)
    return { ok: !1, output: "", diagnostics: [Vs("invalid-while", "Expected /while condition { ... }.", "while")] };
  const c = e.filter((x) => !md(x) && !x.startsWith("max=") && !x.startsWith("maxIterations=")).join(" ").trim(), u = [], p = [];
  let h = !0;
  for (let x = 0; x < o; x += 1) {
    if (!Kx(Bx(c, s)))
      return { ok: h, output: u.join(`
`), diagnostics: p };
    const g = s.createChild();
    g.pipe = s.pipe;
    const w = r.executeSlashCommands(i.body, { state: g });
    if (u.push(w.output), p.push(...w.diagnostics), h = h && w.ok, s.pipe = w.state.pipe, w.state.breakRequested)
      return w.state.breakRequested = !1, { ok: h, output: u.filter((E) => E.length > 0).join(`
`), diagnostics: p };
  }
  return {
    ok: !1,
    output: u.filter((x) => x.length > 0).join(`
`),
    diagnostics: [...p, Vs("while-max-iterations", `Exceeded /while maxIterations (${o}).`, "while")]
  };
}
function Lx(e) {
  const t = e.trim();
  if (t.length === 0)
    return;
  const n = t.indexOf("=");
  if (n > 0) {
    const o = t.slice(0, n).trim(), c = t.slice(n + 1).trim();
    return o.length > 0 ? { name: o, value: c } : void 0;
  }
  const r = t.search(/\s/);
  if (r <= 0)
    return;
  const s = t.slice(0, r).trim(), i = t.slice(r).trim();
  return s.length > 0 ? { name: s, value: i } : void 0;
}
function zx(e) {
  const t = /^(.*?)\s*==\s*(.*?)\s+then\s+(.+?)(?:\s+else\s+(.+))?$/iu.exec(e.trim());
  if (t === null)
    return;
  const n = t[1]?.trim() ?? "", r = t[2]?.trim() ?? "", s = t[3]?.trim() ?? "", i = t[4]?.trim();
  if (!(n.length === 0 || r.length === 0 || s.length === 0))
    return { left: n, right: r, thenCommand: s, elseCommand: i };
}
function Ia(e, t) {
  const n = e.trim(), r = $x(n);
  if (r !== n)
    return r;
  if (n === "{{pipe}}")
    return t.pipe;
  const s = n.startsWith("$") ? n.slice(1) : n;
  return t.getVariable(s) ?? n;
}
function Bx(e, t) {
  const n = e.trim();
  if (n.length === 0)
    return "true";
  const r = /^(.*?)\s*(==|!=|<|>|<=|>=)\s*(.*?)$/u.exec(n);
  if (r !== null) {
    const s = Ia(r[1] ?? "", t), i = Ia(r[3] ?? "", t);
    switch (r[2]) {
      case "==":
        return String(s === i);
      case "!=":
        return String(s !== i);
      case "<":
        return String(Number(s) < Number(i));
      case ">":
        return String(Number(s) > Number(i));
      case "<=":
        return String(Number(s) <= Number(i));
      case ">=":
        return String(Number(s) >= Number(i));
      default:
        return "false";
    }
  }
  return Ia(n, t);
}
function $x(e) {
  if (e.length >= 2) {
    const t = e[0], n = e[e.length - 1];
    if (t === '"' && n === '"' || t === "'" && n === "'")
      return e.slice(1, -1);
  }
  return e;
}
function Hx(e) {
  return typeof e == "string" ? { ok: !0, output: e } : e;
}
function Hf(e) {
  return e.trim().replace(/^\/+/, "").toLowerCase();
}
function Vs(e, t, n) {
  return { code: e, message: t, command: n };
}
function Fx(e) {
  return e.type === "text";
}
function Ux(e) {
  return e.type === "named";
}
function Wx(e) {
  return Array.isArray(e);
}
function pl(e) {
  const t = e.trim();
  if (!md(t))
    return;
  const r = Sh(`/run ${t}`).body[0];
  if (r?.type === "pipeline")
    return r.commands[0]?.args.find((s) => s.type === "closure");
}
function Gx(e) {
  const t = /(\{\{[\s\S]*\}\}|\{[\s\S]*\})/u.exec(e);
  return t?.[1] === void 0 ? void 0 : pl(t[1]);
}
function md(e) {
  const t = e.trim();
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("{{") && t.endsWith("}}");
}
function Vx(e, t) {
  const n = Number.parseInt(e, 10);
  return Number.isFinite(n) && n > 0 ? n : t;
}
function Kx(e) {
  const t = e.trim().toLowerCase();
  return t.length > 0 && t !== "0" && t !== "false" && t !== "no" && t !== "null" && t !== "undefined";
}
function qx(e) {
  const t = bh(e.chat), n = px(), r = /* @__PURE__ */ new Map();
  let s = 0, i;
  const o = Px(() => i, r);
  return i = {
    chat: ix(t, e.chatHooks),
    eventSource: n,
    event_types: Yn,
    characters: e.characters ?? [],
    groups: e.groups ?? [],
    extensionSettings: e.extensionSettings ?? {},
    name1: e.name1 ?? "User",
    name2: e.name2 ?? "Assistant",
    this_chid: e.this_chid,
    characterId: e.characterId,
    groupId: e.groupId,
    onlineStatus: e.onlineStatus ?? "no_connection",
    generationStarted: !1,
    variables: r,
    slashDiagnostics: o.diagnostics,
    slashCommands: o.slashCommands,
    registerSlashCommand: o.registerSlashCommand,
    executeSlashCommands: o.executeSlashCommands,
    saveSettingsDebounced: () => {
      s += 1;
    },
    addOneMessage: (c) => {
      t.pushMessage(c);
      const u = t.messageAt(t.length - 1) ?? c;
      return n.emit(Yx("MESSAGE_ADDED", Yn.MESSAGE_RECEIVED), u, t.length - 1), u;
    },
    saveChat: () => ({ ok: !0, turns: t.length }),
    Generate: (c) => {
      const u = Qx(c), p = {
        is_user: !1,
        is_system: !1,
        name: Xx(c) ?? i.name2,
        mes: u,
        send_date: (/* @__PURE__ */ new Date()).toISOString()
      };
      i.generationStarted = !0, n.emit(Yn.GENERATION_STARTED, c ?? {}), n.emit(Yn.STREAM_TOKEN_RECEIVED, u), t.pushMessage(p);
      const h = t.length - 1, x = t.messageAt(h) ?? p;
      return n.emit(Yn.MESSAGE_RECEIVED, x, h), i.generationStarted = !1, n.emit(Yn.GENERATION_ENDED, x, h), { ok: !0, message: x, index: h };
    },
    substituteParams: (c, u) => Ff(i, e, c, u).text,
    substituteParamsTrace: (c, u) => Ff(i, e, c, u)
  }, Object.defineProperty(i.saveSettingsDebounced, "callCount", {
    configurable: !1,
    enumerable: !1,
    get: () => s
  }), {
    getContext: () => i,
    context: i
  };
}
function Yx(e, t) {
  return Object.prototype.hasOwnProperty.call(Yn, e) ? Yn[e] ?? t : t;
}
function Qx(e) {
  return typeof e == "string" ? e : e?.prompt ?? e?.text ?? "[ydltavern fake generation]";
}
function Xx(e) {
  return typeof e == "string" ? void 0 : e?.name;
}
function Ff(e, t, n, r) {
  const s = {
    user: e.name1,
    char: e.name2,
    description: t.description,
    personality: t.personality,
    scenario: t.scenario,
    persona: t.persona,
    charDepthPrompt: t.charDepthPrompt,
    creatorNotes: t.creatorNotes,
    mesExamples: t.mesExamples,
    model: t.model,
    overrides: r
  };
  return hx(n, s, { overrides: r });
}
function Zx(e) {
  const t = kh({
    temperature: e.temperature,
    top_p: e.top_p,
    frequency_penalty: e.frequency_penalty,
    presence_penalty: e.presence_penalty,
    max_tokens: e.max_tokens,
    stream: e.stream,
    stop: e.stop,
    logit_bias: e.logit_bias
  }), n = [];
  return e.top_k !== void 0 && n.push("top_k"), e.min_p !== void 0 && n.push("min_p"), e.repetition_penalty !== void 0 && n.push("repetition_penalty"), {
    request: t,
    diagnostics: {
      unsupportedFields: n,
      unsupportedPassthrough: e.extensions.st_sampler_passthrough
    }
  };
}
function Jx(e) {
  const t = e.model.trim();
  if (t === "")
    throw new TypeError("OpenAI chat request model must be a non-empty string");
  const n = e.sampler === void 0 ? {} : Zx(e.sampler).request;
  return kh({
    ...n,
    model: t,
    messages: e.messages,
    stream: e.stream ?? n.stream
  });
}
function kh(e) {
  const t = {};
  for (const [n, r] of Object.entries(e))
    r !== void 0 && (t[n] = r);
  return t;
}
const e0 = new Set(Wy);
function t0(e, t, n = {}) {
  const r = n.mode ?? "chat", s = [...e].sort(n0), i = [], o = [], c = [], u = [], p = [], h = t.turns.flatMap((g) => r0(g, c));
  let x = !1;
  for (const g of s) {
    if (g.enabled === !1) {
      o.push(g.identifier);
      continue;
    }
    if (i.push(g.identifier), l0(g.identifier) || c.push(`Unknown prompt block identifier: ${g.identifier}`), g.identifier === "chatHistory") {
      Wf(r, h, u, p), x = !0;
      continue;
    }
    g.content.trim() !== "" && (r === "chat" ? u.push({ role: g.role ?? "system", content: g.content }) : p.push(g.content));
  }
  return x || Wf(r, h, u, p), {
    messages: r === "chat" ? u : [],
    text: r === "text" ? p.join(`

`) : "",
    diagnostics: {
      mode: r,
      includedBlocks: i,
      skippedBlocks: o,
      insertedHistoryTurns: h.length,
      warnings: c
    }
  };
}
function n0(e, t) {
  return Uf(e) - Uf(t);
}
function Uf(e) {
  return e.order ?? e.position ?? 0;
}
function Wf(e, t, n, r) {
  if (e === "chat") {
    n.push(...t);
    return;
  }
  t.length > 0 && r.push(t.map(i0).join(`
`));
}
function r0(e, t) {
  if (e.hidden === !0 || e.deleted === !0)
    return [];
  const n = s0(e);
  if (n === void 0)
    return t.push(`Turn ${e.id} has no active variant at index ${e.active_variant}`), [];
  const r = a0(n).trim();
  return r === "" ? [] : [{ role: e.role, content: r }];
}
function s0(e) {
  return e.variants[e.active_variant];
}
function a0(e) {
  return e.subs.filter((t) => t.kind === "text").map((t) => t.text).join(`
`);
}
function i0(e) {
  return `${o0(e.role)}: ${e.content}`;
}
function o0(e) {
  switch (e) {
    case "assistant":
      return "Assistant";
    case "system":
      return "System";
    case "tool":
      return "Tool";
    case "user":
      return "User";
  }
}
function l0(e) {
  return e0.has(e);
}
const Aa = 256, Nh = 6, c0 = 52, u0 = Aa ** Nh, jh = 2 ** c0, d0 = jh * 2, Gf = Aa - 1;
function Eh(e) {
  const t = f0(e, Gf), n = p0(t, Aa, Gf);
  return () => {
    let r = n(Nh), s = u0, i = 0;
    for (; r < jh; )
      r = (r + i) * Aa, s *= Aa, i = n(1);
    for (; r >= d0; )
      r /= 2, s /= 2, i >>>= 1;
    return (r + i) / s;
  };
}
function f0(e, t) {
  const n = [];
  let r = 0;
  for (let s = 0; s < e.length; s += 1) {
    const i = t & s;
    n[i] = t & (r ^= (n[i] ?? 0) * 19) + e.charCodeAt(s);
  }
  return n;
}
function p0(e, t, n) {
  const r = [], s = e.length === 0 ? [0] : e;
  let i = 0, o = 0;
  for (; i < t; )
    r[i] = i, i += 1;
  for (i = 0; i < t; ) {
    const h = r[i] ?? 0;
    o = n & o + (s[i % s.length] ?? 0) + h, r[i] = r[o] ?? 0, r[o] = h, i += 1;
  }
  let c = 0, u = 0;
  const p = (h) => {
    let x = 0;
    for (; h > 0; ) {
      c = n & c + 1;
      const g = r[c] ?? 0;
      u = n & u + g;
      const w = r[u] ?? 0;
      r[c] = w, r[u] = g, x = x * t + (r[n & (r[c] ?? 0) + (r[u] ?? 0)] ?? 0), h -= 1;
    }
    return x;
  };
  return p(t), p;
}
const m0 = "ydltavern-fixture-v1", Lc = "YDLTAVERN_TRIM", h0 = [
  { pattern: /<USER>/g, replacement: "{{user}}" },
  { pattern: /<BOT>/g, replacement: "{{char}}" },
  { pattern: /<GROUP>/g, replacement: "{{group}}" },
  { pattern: /<CHARIFNOTGROUP>/g, replacement: "{{charIfNotGroup}}" },
  // Legacy {{time_UTC-10}} → {{time::UTC-10}} (public/scripts/macros.js:667)
  { pattern: /\{\{\s*time_UTC([+-]\d{1,2})\s*\}\}/g, replacement: "{{time::UTC$1}}" }
], g0 = /\{\{\s*([A-Za-z0-9_/.+-]+)((?::[^}]*)?)\s*\}\}/g;
function v0(e, t = {}) {
  const n = t.maxIterations ?? 5, r = [], s = _0(t);
  let i = e;
  for (const c of h0)
    i = i.replace(c.pattern, c.replacement);
  i = i.replace(/\{\{\s*\/\/[^}]*\}\}/g, () => (r.push({ name: "//", raw: "{{// ...}}", source: "computed", preview: "" }), ""));
  let o = 0;
  for (let c = 0; c < n && i.includes("{{"); c += 1) {
    const u = i;
    if (i = i.replace(g0, (p, h, x) => {
      const w = y0(h, x ?? "", t, s);
      return r.push({ name: h, raw: p, source: w.source, preview: b0(w.value) }), w.source === "unknown" ? t.unknownMacro === "empty" ? "" : p : w.value;
    }), o = c + 1, i === u)
      break;
  }
  return i = i.replace(new RegExp(`[ \\t]*${Lc}[ \\t]*(?:\\r?\\n)+[ \\t]*`, "g"), " ").replace(new RegExp(Lc, "g"), ""), i = i.replace(/\n{3,}/g, `

`), { text: i, trace: r, iterations: o };
}
function _0(e) {
  const t = e.random === void 0 ? Eh(m0) : void 0;
  return {
    rng: e.random ?? t ?? Math.random,
    pickRng: e.pickSeed ?? e.random ?? t ?? Math.random,
    now: w0(e.now ?? Date.now())
  };
}
function y0(e, t, n, r) {
  const s = n.env ?? {}, i = x0(t);
  if (e === "//" || e === "comment")
    return { value: "", source: "computed" };
  if (e === "noop")
    return { value: "", source: "computed" };
  if (e === "newline") {
    const p = i[0] ? Math.max(0, parseInt(i[0], 10) || 0) : 1;
    return { value: `
`.repeat(p), source: "computed" };
  }
  if (e === "space") {
    const p = i[0] ? Math.max(0, parseInt(i[0], 10) || 0) : 1;
    return { value: " ".repeat(p), source: "computed" };
  }
  if (e === "trim")
    return { value: Lc, source: "computed" };
  if (e === "random") {
    const p = i.length > 0 ? i : t ? [t] : [];
    return p.length === 0 ? { value: "", source: "computed" } : { value: String(p[Math.floor(r.rng() * p.length)] ?? ""), source: "computed" };
  }
  if (e === "pick") {
    const p = i.length > 0 ? i : [];
    return p.length === 0 ? { value: "", source: "computed" } : { value: String(p[Math.floor(r.pickRng() * p.length)] ?? ""), source: "computed" };
  }
  if (e === "roll") {
    const p = (i[0] ?? "").toString(), h = p.match(/^(\d+)?d(\d+)$/i);
    if (h) {
      const g = Math.max(1, parseInt(h[1] ?? "1", 10)), w = Math.max(1, parseInt(h[2] ?? "6", 10));
      if (n.random === void 0 && p === "d6")
        return { value: "1", source: "computed" };
      let E = 0;
      for (let I = 0; I < g; I += 1)
        E += Math.floor(r.rng() * w) + 1;
      return { value: String(E), source: "computed" };
    }
    const x = parseInt(p, 10);
    return Number.isFinite(x) && x > 0 ? { value: String(Math.floor(r.rng() * x) + 1), source: "computed" } : { value: "", source: "computed" };
  }
  const o = r.now;
  if (e === "time") {
    if (i[0]?.startsWith("UTC")) {
      const p = parseInt(i[0].slice(3), 10) || 0, h = new Date(o.getTime() + p * 60 * 60 * 1e3);
      return { value: Vf(h), source: "computed" };
    }
    return { value: Vf(o), source: "computed" };
  }
  if (e === "date")
    return { value: S0(o), source: "computed" };
  if (e === "isotime")
    return { value: o.toISOString().slice(11, 16), source: "computed" };
  if (e === "isodate")
    return { value: o.toISOString().slice(0, 10), source: "computed" };
  if (e === "weekday")
    return { value: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][o.getUTCDay()] ?? "", source: "computed" };
  if (e === "datetimeformat") {
    const p = i.join("::") || "YYYY-MM-DD HH:mm:ss";
    return { value: k0(o, p), source: "computed" };
  }
  if (e === "idleDuration" || e === "idle_duration")
    return { value: Tn(s.idleDuration), source: "computed" };
  if (e === "timeDiff") {
    const p = Date.parse(i[0] ?? ""), h = Date.parse(i[1] ?? "");
    return Number.isFinite(p) && Number.isFinite(h) ? { value: String(Math.abs(h - p)), source: "computed" } : { value: "0", source: "computed" };
  }
  if ((e === "getvar" || e === "var") && i.length >= 1) {
    const p = n.localVars?.get(i[0] ?? "");
    return { value: Tn(p), source: "variable" };
  }
  if (e === "setvar" && i.length >= 2)
    return n.localVars?.set(i[0] ?? "", i[1] ?? ""), { value: Tn(i[1]), source: "variable" };
  if (e === "addvar" && i.length >= 2) {
    const p = n.localVars?.get(i[0] ?? ""), h = `${Tn(p)}${Tn(i[1])}`;
    return n.localVars?.set(i[0] ?? "", h), { value: h, source: "variable" };
  }
  if (e === "incvar" && i.length >= 1) {
    const p = Number(n.localVars?.get(i[0] ?? "") ?? 0), h = (Number.isFinite(p) ? p : 0) + 1;
    return n.localVars?.set(i[0] ?? "", h), { value: String(h), source: "variable" };
  }
  if (e === "decvar" && i.length >= 1) {
    const p = Number(n.localVars?.get(i[0] ?? "") ?? 0), h = (Number.isFinite(p) ? p : 0) - 1;
    return n.localVars?.set(i[0] ?? "", h), { value: String(h), source: "variable" };
  }
  if (e === "hasvar" || e === "varexists")
    return { value: n.localVars?.has(i[0] ?? "") ? "true" : "false", source: "variable" };
  if (e === "deletevar" || e === "flushvar")
    return n.localVars?.delete(i[0] ?? ""), { value: "", source: "variable" };
  if (e === "getglobalvar" && i.length >= 1)
    return { value: Tn(n.globalVars?.get(i[0] ?? "")), source: "variable" };
  if (e === "setglobalvar" && i.length >= 2)
    return n.globalVars?.set(i[0] ?? "", i[1] ?? ""), { value: Tn(i[1]), source: "variable" };
  if (e === "addglobalvar" && i.length >= 2) {
    const p = n.globalVars?.get(i[0] ?? ""), h = `${Tn(p)}${Tn(i[1])}`;
    return n.globalVars?.set(i[0] ?? "", h), { value: h, source: "variable" };
  }
  if (e === "incglobalvar" && i.length >= 1) {
    const p = Number(n.globalVars?.get(i[0] ?? "") ?? 0), h = (Number.isFinite(p) ? p : 0) + 1;
    return n.globalVars?.set(i[0] ?? "", h), { value: String(h), source: "variable" };
  }
  if (e === "decglobalvar" && i.length >= 1) {
    const p = Number(n.globalVars?.get(i[0] ?? "") ?? 0), h = (Number.isFinite(p) ? p : 0) - 1;
    return n.globalVars?.set(i[0] ?? "", h), { value: String(h), source: "variable" };
  }
  if (e === "hasglobalvar" || e === "globalvarexists")
    return { value: n.globalVars?.has(i[0] ?? "") ? "true" : "false", source: "variable" };
  if (e === "deleteglobalvar" || e === "flushglobalvar")
    return n.globalVars?.delete(i[0] ?? ""), { value: "", source: "variable" };
  if (e === "hasExtension")
    return { value: n.extensions?.has(i[0] ?? "") ? "true" : "false", source: "control" };
  const u = {
    user: "user",
    char: "char",
    description: "description",
    charDescription: "description",
    personality: "personality",
    charPersonality: "personality",
    scenario: "scenario",
    charScenario: "scenario",
    persona: "persona",
    group: "group",
    charIfNotGroup: "group",
    groupNotMuted: "groupNotMuted",
    notChar: "notChar",
    charPrompt: "charPrompt",
    charInstruction: "charInstruction",
    charDepthPrompt: "charDepthPrompt",
    charCreatorNotes: "creatorNotes",
    creatorNotes: "creatorNotes",
    mesExamples: "mesExamples",
    mesExamplesRaw: "mesExamplesRaw",
    charFirstMessage: "charFirstMessage",
    greeting: "charFirstMessage",
    charVersion: "charVersion",
    version: "charVersion",
    char_version: "charVersion",
    model: "model",
    original: "original",
    isMobile: "isMobile",
    maxPrompt: "maxPrompt",
    maxContext: "maxContext",
    maxResponse: "maxResponse",
    lastMessage: "lastMessage",
    lastMessageId: "lastMessageId",
    lastUserMessage: "lastUserMessage",
    lastCharMessage: "lastCharMessage",
    firstIncludedMessageId: "firstIncludedMessageId",
    firstDisplayedMessageId: "firstDisplayedMessageId",
    lastSwipeId: "lastSwipeId",
    currentSwipeId: "currentSwipeId",
    allChatRange: "allChatRange",
    lastGenerationType: "lastGenerationType",
    instructStoryStringPrefix: "instructStoryStringPrefix",
    instructStoryStringSuffix: "instructStoryStringSuffix",
    instructUserPrefix: "instructUserPrefix",
    instructInput: "instructUserPrefix",
    instructUserSuffix: "instructUserSuffix",
    instructAssistantPrefix: "instructAssistantPrefix",
    instructOutput: "instructAssistantPrefix",
    instructAssistantSuffix: "instructAssistantSuffix",
    instructSeparator: "instructAssistantSuffix",
    instructSystemPrefix: "instructSystemPrefix",
    instructSystemSuffix: "instructSystemSuffix",
    instructFirstAssistantPrefix: "instructFirstAssistantPrefix",
    instructFirstOutputPrefix: "instructFirstAssistantPrefix",
    instructLastAssistantPrefix: "instructLastAssistantPrefix",
    instructLastOutputPrefix: "instructLastAssistantPrefix",
    instructStop: "instructStop",
    instructUserFiller: "instructUserFiller",
    instructSystemInstructionPrefix: "instructSystemInstructionPrefix",
    instructFirstUserPrefix: "instructFirstUserPrefix",
    instructFirstInput: "instructFirstUserPrefix",
    instructLastUserPrefix: "instructLastUserPrefix",
    instructLastInput: "instructLastUserPrefix",
    defaultSystemPrompt: "defaultSystemPrompt",
    instructSystem: "defaultSystemPrompt",
    instructSystemPrompt: "defaultSystemPrompt",
    systemPrompt: "systemPrompt",
    exampleSeparator: "exampleSeparator",
    chatSeparator: "exampleSeparator",
    chatStart: "chatStart"
  }[e];
  if (u !== void 0) {
    const p = s[u];
    return { value: Tn(p), source: "env" };
  }
  return { value: "", source: "unknown" };
}
function x0(e) {
  return e.startsWith("::") ? e.slice(2).split("::") : e.startsWith(":") ? e.slice(1).split(",").map((n) => n.trim()) : [];
}
function Tn(e) {
  return e == null ? "" : String(e);
}
function b0(e) {
  return e.length > 80 ? `${e.slice(0, 79)}…` : e;
}
function w0(e) {
  return e instanceof Date ? e : new Date(e);
}
function Vf(e) {
  return e.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0, timeZone: "UTC" });
}
function S0(e) {
  return e.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}
function k0(e, t) {
  const n = (s, i = 2) => String(s).padStart(i, "0"), r = {
    YYYY: String(e.getUTCFullYear()),
    MMMM: N0[e.getUTCMonth()] ?? "",
    MMM: j0[e.getUTCMonth()] ?? "",
    MM: n(e.getUTCMonth() + 1),
    DD: n(e.getUTCDate()),
    D: String(e.getUTCDate()),
    HH: n(e.getUTCHours()),
    H: String(e.getUTCHours()),
    hh: n(Kf(e.getUTCHours())),
    h: String(Kf(e.getUTCHours())),
    mm: n(e.getUTCMinutes()),
    ss: n(e.getUTCSeconds()),
    A: e.getUTCHours() < 12 ? "AM" : "PM",
    a: e.getUTCHours() < 12 ? "am" : "pm",
    dddd: E0[e.getUTCDay()] ?? "",
    ddd: C0[e.getUTCDay()] ?? ""
  };
  return t.replace(/YYYY|MMMM|MMM|MM|DD|dddd|ddd|HH|H|hh|h|mm|ss|A|a|D/g, (s) => r[s] ?? s);
}
const N0 = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], j0 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], E0 = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], C0 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function Kf(e) {
  const t = e % 12;
  return t === 0 ? 12 : t;
}
const T0 = /{{\s*([A-Za-z0-9_.-]+)\s*}}/g;
function Pa(e, t = {}, n = {}) {
  if (I0(e, t, n))
    return A0(e, t, n);
  const r = [], s = n.previewLength ?? 80, i = D0(n.now ?? t.now ?? Date.now());
  return { text: e.replace(T0, (c, u) => {
    const p = M0(u, t, n, i);
    return r.push({ name: u, source: p.source, preview: Ih(p.value, s) }), p.source === "unknown" ? n.unknownMacro === "empty" ? "" : c : p.value;
  }), trace: r };
}
function I0(e, t, n) {
  return /<USER>|<BOT>|<GROUP>|<CHARIFNOTGROUP>|\{\{\s*(?:\/\/|comment|noop|newline|space|trim|random|pick|roll|isotime|isodate|weekday|datetimeformat|idleDuration|idle_duration|timeDiff|getvar|var|setvar|addvar|incvar|decvar|hasvar|varexists|deletevar|flushvar|getglobalvar|setglobalvar|addglobalvar|incglobalvar|decglobalvar|hasglobalvar|globalvarexists|deleteglobalvar|flushglobalvar|hasExtension|time_UTC|time\s*:|date\s*:)[}:\s]/.test(e) || Hi(t) || Hi(t.dynamic) || Hi(t.overrides) || Hi(n.overrides);
}
function Hi(e) {
  return e === void 0 ? !1 : Object.values(e).some((t) => typeof t == "string" && t.includes("{{"));
}
function A0(e, t, n) {
  const r = v0(e, {
    env: { ...t, ...t.dynamic, ...t.overrides, ...n.overrides },
    now: n.now ?? t.now,
    unknownMacro: n.unknownMacro,
    random: n.random,
    pickSeed: n.pickSeed,
    maxIterations: n.maxIterations
  }), s = n.previewLength ?? 80;
  return {
    text: r.text,
    trace: r.trace.map((i) => ({
      name: i.name,
      source: i.source === "env" ? R0(i.name, t, n) : P0(i.source),
      preview: Ih(i.preview, s)
    }))
  };
}
function P0(e) {
  return e === "variable" || e === "control" ? "computed" : e === "env" ? "dynamic" : e;
}
function R0(e, t, n) {
  return Ch(e, n.overrides, t.overrides, t.dynamic) !== void 0 ? "dynamic" : Object.prototype.hasOwnProperty.call(t, e) ? "context" : "dynamic";
}
function M0(e, t, n, r) {
  const s = Ch(e, n.overrides, t.overrides, t.dynamic);
  if (s !== void 0)
    return { value: Th(s), source: "dynamic" };
  switch (e) {
    case "user":
      return In(t.user);
    case "char":
      return In(t.char);
    case "description":
      return In(t.description);
    case "personality":
      return In(t.personality);
    case "scenario":
      return In(t.scenario);
    case "persona":
      return In(t.persona);
    case "charDepthPrompt":
      return In(t.charDepthPrompt);
    case "creatorNotes":
      return In(t.creatorNotes);
    case "mesExamples":
      return In(t.mesExamples);
    case "model":
      return In(t.model);
    case "date":
      return { value: r.toISOString().slice(0, 10), source: "computed" };
    case "time":
      return { value: r.toISOString().slice(11, 19), source: "computed" };
    default:
      return { value: "", source: "unknown" };
  }
}
function Ch(e, ...t) {
  for (const n of t)
    if (n !== void 0 && Object.prototype.hasOwnProperty.call(n, e))
      return n[e];
}
function In(e) {
  return e === void 0 ? { value: "", source: "unknown" } : { value: Th(e), source: "context" };
}
function Th(e) {
  return e == null ? "" : String(e);
}
function Ih(e, t) {
  return e.length <= t ? e : `${e.slice(0, Math.max(0, t - 1))}…`;
}
function D0(e) {
  return e instanceof Date ? e : new Date(e);
}
const zc = [
  "main",
  "worldInfoBefore",
  "worldInfoAfter",
  "enhanceDefinitions",
  "charDescription",
  "charPersonality",
  "scenario",
  "personaDescription",
  "nsfw",
  "dialogueExamples",
  "chatHistory",
  "jailbreak"
], Ah = /* @__PURE__ */ new Set([
  "worldInfoBefore",
  "worldInfoAfter",
  "enhanceDefinitions",
  "charDescription",
  "charPersonality",
  "scenario",
  "personaDescription",
  "dialogueExamples",
  "chatHistory"
]), Ph = zc.map((e) => ({
  identifier: e,
  content: "",
  marker: Ah.has(e),
  role: "system"
})), O0 = new Set(Ph.map((e) => e.identifier));
function L0(e = {}) {
  const t = Ar(e), n = $0(t?.prompts), r = new Map(n.map((y) => [y.identifier, y])), s = new Map(Ph.map((y) => [y.identifier, y])), i = H0(t?.prompt_order ?? t?.promptOrder), o = i.length > 0 ? i : z0(n), c = Lh(t?.generation_trigger ?? t?.generationTrigger ?? t?.generationTriggers ?? t?.trigger), u = [], p = [], h = [], x = [], g = [], w = [], E = [];
  o.forEach((y, b) => {
    const N = r.get(y.identifier) ?? y.inlinePrompt, l = s.get(y.identifier), d = N ?? l;
    if ((en(y.enabled) ?? en(d?.enabled) ?? !0) === !1) {
      if (y.identifier === "main") {
        x.push(y.identifier), u.push({
          identifier: y.identifier,
          content: "",
          enabled: !1,
          marker: !0,
          order: y.order ?? b,
          source: "anchor",
          anchor: !0
        });
        return;
      }
      h.push(y.identifier);
      return;
    }
    const m = y.generation_trigger ?? d?.generation_trigger;
    if (!U0(m, c)) {
      g.push(y.identifier);
      return;
    }
    if (d === void 0) {
      p.push(y.identifier), E.push(`Unknown prompt identifier: ${y.identifier}`);
      return;
    }
    const v = N !== void 0 ? "input" : i.length > 0 ? "fallback" : "default";
    v === "fallback" && w.push(y.identifier), u.push(B0(d, y, b, v));
  });
  const I = {
    main: qf("main", u, Yf(t, "main")),
    jailbreak: qf("jailbreak", u, Yf(t, "jailbreak"))
  }, D = u;
  return {
    prompts: D,
    collection: D,
    diagnostics: {
      unknownPromptIds: p,
      disabledSkipped: h,
      disabledAnchors: x,
      triggerSkipped: g,
      missingPromptFallbacks: w,
      overrides: I,
      warnings: E
    }
  };
}
function z0(e) {
  const t = zc.map((r, s) => ({
    identifier: r,
    enabled: !0,
    order: s
  })), n = e.filter((r) => !O0.has(r.identifier)).map((r, s) => ({
    identifier: r.identifier,
    enabled: r.enabled,
    order: zc.length + s
  }));
  return [...t, ...n];
}
function B0(e, t, n, r) {
  return hd({
    identifier: e.identifier,
    name: e.name,
    content: e.content,
    enabled: !0,
    marker: en(t.marker) ?? en(e.marker) ?? Ah.has(e.identifier),
    role: t.role ?? e.role,
    injection_position: t.injection_position ?? e.injection_position,
    injection_depth: t.injection_depth ?? e.injection_depth,
    injection_order: t.injection_order ?? e.injection_order,
    forbid_overrides: en(t.forbid_overrides) ?? en(e.forbid_overrides),
    generation_trigger: t.generation_trigger ?? e.generation_trigger,
    order: t.order ?? n,
    source: r
  });
}
function qf(e, t, n) {
  if (n === void 0)
    return { identifier: e, requested: !1, status: "not_requested" };
  const r = t.find((s) => s.identifier === e);
  return r === void 0 ? {
    identifier: e,
    requested: !0,
    status: "missing_prompt",
    reason: `${e} prompt is not present in the effective collection`
  } : r.enabled === !1 ? {
    identifier: e,
    requested: !0,
    status: "blocked_disabled",
    reason: `${e} prompt is disabled`
  } : r.forbid_overrides === !0 ? {
    identifier: e,
    requested: !0,
    status: "blocked_forbidden",
    reason: `${e} prompt forbids overrides`
  } : (r.content = n.includes("{{original}}") ? n.split("{{original}}").join(r.content) : n, { identifier: e, requested: !0, status: "applied" });
}
function $0(e) {
  if (Array.isArray(e))
    return e.flatMap((n) => {
      const r = vo(n);
      return r === void 0 ? [] : [r];
    });
  const t = Ar(e);
  return t === void 0 ? [] : Object.entries(t).flatMap(([n, r]) => {
    const s = Ar(r), i = vo(s === void 0 ? { identifier: n, content: r } : { identifier: n, ...s });
    return i === void 0 ? [] : [i];
  });
}
function vo(e) {
  const t = Ar(e);
  if (t === void 0)
    return;
  const n = yr(t, ["identifier", "id", "prompt_id", "promptId", "name"]);
  if (n === void 0 || n.trim() === "")
    return;
  const r = yr(t, ["content", "prompt", "text", "value", "message"]) ?? yr(t, ["system_prompt"]);
  return hd({
    identifier: n,
    name: yr(t, ["name", "label"]),
    content: r ?? "",
    enabled: en(t.enabled),
    marker: en(t.marker),
    role: Dh(t.role),
    injection_position: Oh(t.injection_position ?? t.injectionPosition),
    injection_depth: Ra(t.injection_depth ?? t.injectionDepth),
    injection_order: Ra(t.injection_order ?? t.injectionOrder),
    forbid_overrides: en(t.forbid_overrides ?? t.forbidOverrides),
    generation_trigger: Rh(t)
  });
}
function H0(e) {
  const t = Gl(e);
  if (t.length > 0)
    return t;
  if (Array.isArray(e))
    for (const r of e) {
      const s = Ar(r), i = Gl(s?.order ?? s?.prompts ?? s?.prompt_order);
      if (i.length > 0)
        return i;
    }
  const n = Ar(e);
  return Gl(n?.order ?? n?.prompts ?? n?.prompt_order);
}
function Gl(e) {
  return Array.isArray(e) ? e.flatMap((t, n) => {
    const r = F0(t, n);
    return r === void 0 ? [] : [r];
  }) : [];
}
function F0(e, t) {
  if (typeof e == "string")
    return { identifier: e, order: t };
  const n = Ar(e);
  if (n === void 0)
    return;
  const r = yr(n, ["identifier", "id", "prompt_id", "promptId", "prompt", "name"]);
  if (r === void 0 || r.trim() === "")
    return;
  const s = vo({ identifier: r, ...n }), i = yr(n, ["content", "text", "value", "message"]) !== void 0;
  return hd({
    identifier: r,
    enabled: en(n.enabled),
    order: Ra(n.order ?? n.position) ?? t,
    marker: en(n.marker),
    role: Dh(n.role),
    injection_position: Oh(n.injection_position ?? n.injectionPosition),
    injection_depth: Ra(n.injection_depth ?? n.injectionDepth),
    injection_order: Ra(n.injection_order ?? n.injectionOrder),
    forbid_overrides: en(n.forbid_overrides ?? n.forbidOverrides),
    generation_trigger: Rh(n),
    inlinePrompt: i ? s : void 0
  });
}
function U0(e, t) {
  if (e === void 0 || e.length === 0)
    return !0;
  if (t === void 0 || t.length === 0)
    return !1;
  const n = new Set(t);
  return e.some((r) => n.has(r));
}
function Yf(e, t) {
  if (e === void 0)
    return;
  const n = Ar(e.overrides), r = Mh(n?.[t]);
  return r !== void 0 ? r : t === "main" ? yr(e, ["main_prompt", "mainPrompt"]) : yr(e, ["jailbreak_prompt", "jailbreakPrompt"]);
}
function Rh(e) {
  return Lh(e.generation_trigger ?? e.generationTrigger ?? e.generation_triggers ?? e.generationTriggers ?? e.triggers ?? e.trigger);
}
function Ar(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e) ? e : void 0;
}
function yr(e, t) {
  for (const n of t) {
    const r = Mh(e[n]);
    if (r !== void 0)
      return r;
  }
}
function Mh(e) {
  return typeof e == "string" ? e : void 0;
}
function Dh(e) {
  return typeof e == "string" && e.trim() !== "" ? e : void 0;
}
function en(e) {
  if (typeof e == "boolean")
    return e;
  if (typeof e == "string") {
    if (e.toLowerCase() === "true")
      return !0;
    if (e.toLowerCase() === "false")
      return !1;
  }
}
function Ra(e) {
  if (typeof e == "number" && Number.isFinite(e))
    return e;
  if (typeof e == "string" && e.trim() !== "") {
    const t = Number(e);
    return Number.isFinite(t) ? t : void 0;
  }
}
function Oh(e) {
  return typeof e == "string" || typeof e == "number" ? e : void 0;
}
function Lh(e) {
  if (e !== void 0) {
    if (typeof e == "string")
      return e.trim() === "" ? [] : [e];
    if (Array.isArray(e))
      return e.flatMap((t) => typeof t == "string" ? [t] : []);
  }
}
function hd(e) {
  const t = {};
  for (const [n, r] of Object.entries(e))
    r !== void 0 && (t[n] = r);
  return t;
}
function W0(e) {
  const t = e.baseOrder ?? 0, n = [], r = [], s = [], i = [], o = [], c = nb(e), u = rb(e.authorNote), p = K0(e, u, c, i), h = [], x = [], g = [
    "Prompt-critical A2 preserves PromptManager prompt/order/injection metadata but does not implement full ST extension prompt semantics.",
    "WI atDepth/outlet buckets are surfaced in diagnostics but not depth-injected into chat history by buildPrompt."
  ], w = J0(e);
  if (w !== void 0) {
    const E = L0(tb(w));
    for (const I of E.collection)
      q0(n, r, s, h, o, I, p, t);
    return Kl(n, r, s, h, x, "instruct", p.instruct?.content, t + 0), Kl(n, r, s, h, x, "authorNote", p.authorNote?.content, t + 60), Kl(n, r, s, h, x, "postHistory", p.postHistory?.content, t + 90), Qf(e, o), {
      blocks: n,
      diagnostics: {
        includedBlocks: r,
        skippedFields: s,
        macroTrace: i,
        warnings: o,
        unsupported: g,
        markerMapping: h,
        promptManager: E.diagnostics,
        knownDeltas: x
      }
    };
  }
  return Rn(n, r, "instruct", p.instruct?.content, t + 0), Rn(n, r, "worldInfoBefore", p.worldInfoBefore?.content, t + 10), Rn(n, r, "personaDescription", p.personaDescription?.content, t + 20), Rn(n, r, "charDescription", p.charDescription?.content, t + 30), Rn(n, r, "charPersonality", p.charPersonality?.content, t + 40), Rn(n, r, "scenario", p.scenario?.content, t + 50), Rn(n, r, "authorNote", p.authorNote?.content, t + 60), Rn(n, r, "worldInfoAfter", p.worldInfoAfter?.content, t + 80), Rn(n, r, "postHistory", p.postHistory?.content, t + 90), Z0(s, p), Qf(e, o), { blocks: n, diagnostics: { includedBlocks: r, skippedFields: s, macroTrace: i, warnings: o, unsupported: g, markerMapping: h, knownDeltas: x } };
}
function Rn(e, t, n, r, s, i = {}) {
  r === void 0 || r.trim() === "" || (e.push(gd({ identifier: n, role: i.role ?? "system", content: r, enabled: !0, order: s, ...i })), t.push(n));
}
const G0 = /* @__PURE__ */ new Set([
  "worldInfoBefore",
  "worldInfoAfter",
  "personaDescription",
  "charDescription",
  "charPersonality",
  "scenario",
  "dialogueExamples",
  "chatHistory",
  "jailbreak"
]), V0 = [
  "instruct",
  "personaDescription",
  "charDescription",
  "charPersonality",
  "scenario",
  "authorNote",
  "postHistory"
];
function K0(e, t, n, r) {
  return {
    worldInfoBefore: Vl(ql(e.worldInfo?.buckets.before), !0),
    worldInfoAfter: Vl(ql(e.worldInfo?.buckets.after), !0),
    personaDescription: Vn(e.persona, !0, n, r),
    charDescription: Vn(e.character?.description, !0, n, r),
    charPersonality: Vn(e.character?.personality, !0, n, r),
    scenario: Vn(e.character?.scenario, !0, n, r),
    dialogueExamples: Vn(e.character?.mesExamples, !0, n, r),
    chatHistory: Vl("", !0),
    jailbreak: Vn(e.jailbreak, !0, n, r),
    instruct: Vn(e.instruct, !1, n, r),
    authorNote: Vn(ql([
      ...t.position === "top" ? [t.content] : [],
      ...e.worldInfo?.buckets.ANTop ?? [],
      ...e.worldInfo?.buckets.ANBottom ?? [],
      ...t.position === "bottom" ? [t.content] : []
    ]), !1, n, r),
    postHistory: Vn(e.postHistory, !1, n, r)
  };
}
function Vl(e, t) {
  return e === void 0 ? void 0 : { content: e, marker: t };
}
function Vn(e, t, n, r) {
  if (e === void 0)
    return;
  const s = Pa(e, n);
  return r.push(...s.trace), { content: s.text, marker: t };
}
function q0(e, t, n, r, s, i, o, c) {
  if (i.enabled === !1)
    return;
  const u = Y0(i.identifier, i.marker), h = (u === void 0 ? void 0 : o[u]?.content) ?? (u === "chatHistory" ? "" : i.content), x = i.identifier === "chatHistory";
  if (h.trim() === "" && !x) {
    u !== void 0 && n.push(u);
    return;
  }
  const g = X0(i.role, s, i.identifier), w = Q0(i, g), E = i.identifier;
  e.push(gd({
    identifier: E,
    role: g ?? "system",
    content: h,
    enabled: !0,
    order: c + i.order,
    ...w
  })), t.push(E), r.push({
    blockIdentifier: E,
    promptIdentifier: i.identifier,
    marker: i.marker,
    source: i.source,
    order: i.order,
    field: u
  });
}
function Kl(e, t, n, r, s, i, o, c) {
  if (s.push(`${i} is emitted as an engine-core internal prompt-critical block because ST PromptManager has no matching marker.`), o === void 0 || o.trim() === "") {
    n.push(String(i));
    return;
  }
  Rn(e, t, i, o, c), r.push({
    blockIdentifier: i,
    promptIdentifier: i,
    marker: !1,
    source: "internal",
    order: c,
    field: String(i)
  });
}
function Y0(e, t) {
  return t && G0.has(e) ? e : void 0;
}
function Q0(e, t) {
  return gd({
    role: t,
    position: typeof e.injection_position == "number" ? e.injection_position : void 0,
    injection_position: e.injection_position,
    injection_depth: e.injection_depth,
    injection_order: e.injection_order
  });
}
function X0(e, t, n) {
  if (e !== void 0) {
    if (e === "system" || e === "user" || e === "assistant" || e === "tool")
      return e;
    t.push(`PromptManager prompt ${n} uses unsupported role ${e}; falling back to system.`);
  }
}
function Z0(e, t) {
  for (const n of V0)
    (t[n] === void 0 || t[n]?.content.trim() === "") && e.push(n);
}
function Qf(e, t) {
  (e.worldInfo?.buckets.atDepth.length ?? 0) > 0 && t.push("WI atDepth bucket produced content; buildPromptCriticalBlocks does not splice it into chat depth."), (e.worldInfo?.buckets.outlet.length ?? 0) > 0 && t.push("WI outlet bucket produced content; engine-core P1 exposes diagnostics only.");
}
function J0(e) {
  const t = eb(e.promptManager ?? e.prompt_manager);
  if (t !== void 0)
    return t;
  if (e.prompts !== void 0 || e.prompt_order !== void 0 || e.promptOrder !== void 0 || e.generationType !== void 0 || e.generation_type !== void 0 || e.main_prompt !== void 0 || e.mainPrompt !== void 0 || e.jailbreak_prompt !== void 0 || e.jailbreakPrompt !== void 0 || e.overrides !== void 0)
    return e;
}
function eb(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e) ? e : void 0;
}
function tb(e) {
  const t = e.generationType ?? e.generation_type;
  return t === void 0 ? e : { ...e, generation_trigger: e.generation_trigger ?? t };
}
function nb(e) {
  return {
    ...e.macroContext,
    user: e.macroContext?.user ?? e.userName,
    char: e.macroContext?.char ?? e.character?.name,
    description: e.macroContext?.description ?? e.character?.description,
    personality: e.macroContext?.personality ?? e.character?.personality,
    scenario: e.macroContext?.scenario ?? e.character?.scenario,
    persona: e.macroContext?.persona ?? e.persona,
    charDepthPrompt: e.macroContext?.charDepthPrompt ?? e.character?.charDepthPrompt,
    creatorNotes: e.macroContext?.creatorNotes ?? e.character?.creatorNotes,
    mesExamples: e.macroContext?.mesExamples ?? e.character?.mesExamples,
    model: e.macroContext?.model ?? e.model
  };
}
function rb(e) {
  return e === void 0 ? { content: "", position: "bottom" } : typeof e == "string" ? { content: e, position: "bottom" } : e;
}
function ql(e) {
  return (e ?? []).filter((t) => t.trim() !== "").join(`
`);
}
function gd(e) {
  const t = {};
  for (const [n, r] of Object.entries(e))
    r !== void 0 && (t[n] = r);
  return t;
}
const sb = new Set(Gy), Qt = {
  temperature: ["temperature", "temp", "temp_openai"],
  top_p: ["top_p", "top_p_openai"],
  top_k: ["top_k", "top_k_openai"],
  min_p: ["min_p", "min_p_openai"],
  repetition_penalty: ["repetition_penalty", "repetition_penalty_openai", "rep_pen"],
  frequency_penalty: ["frequency_penalty", "freq_pen_openai", "freq_pen"],
  presence_penalty: ["presence_penalty", "pres_pen_openai", "presence_pen"],
  max_tokens: ["max_tokens", "max_new_tokens", "n_predict", "num_predict"],
  stream: ["stream", "streaming"],
  stop: ["stop", "stopping_strings"],
  logit_bias: ["logit_bias"]
}, ab = new Set(Object.values(Qt).flatMap((e) => [...e]));
function ib(e) {
  const t = zh(e) ? e : {}, n = {}, r = Kr(t, Qt.temperature), s = Kr(t, Qt.top_p), i = Xf(t, Qt.top_k), o = Kr(t, Qt.min_p), c = Kr(t, Qt.repetition_penalty), u = Kr(t, Qt.frequency_penalty), p = Kr(t, Qt.presence_penalty), h = Xf(t, Qt.max_tokens), x = ob(t, Qt.stream), g = lb(t, Qt.stop), w = cb(t, Qt.logit_bias);
  for (const [E, I] of Object.entries(t))
    sb.has(E) && !ab.has(E) && (n[E] = I);
  return ub({
    temperature: r,
    top_p: s,
    top_k: i,
    min_p: o,
    repetition_penalty: c,
    frequency_penalty: u,
    presence_penalty: p,
    max_tokens: h,
    stream: x,
    stop: g,
    logit_bias: w,
    extensions: {
      st_sampler_passthrough: n
    }
  });
}
function zh(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Kr(e, t) {
  for (const n of t) {
    const r = e[n];
    if (typeof r == "number" && Number.isFinite(r))
      return r;
    if (typeof r == "string" && r.trim() !== "") {
      const s = Number(r);
      if (Number.isFinite(s))
        return s;
    }
  }
}
function Xf(e, t) {
  const n = Kr(e, t);
  return n === void 0 ? void 0 : Math.trunc(n);
}
function ob(e, t) {
  for (const n of t) {
    const r = e[n];
    if (typeof r == "boolean")
      return r;
    if (typeof r == "string") {
      const s = r.trim().toLowerCase();
      if (s === "true")
        return !0;
      if (s === "false")
        return !1;
    }
  }
}
function lb(e, t) {
  for (const n of t) {
    const r = e[n];
    if (typeof r == "string" || Array.isArray(r) && r.every((s) => typeof s == "string"))
      return r;
  }
}
function cb(e, t) {
  for (const n of t) {
    const r = e[n];
    if (!zh(r))
      continue;
    const s = Object.entries(r);
    if (s.every(([, i]) => typeof i == "number" && Number.isFinite(i)))
      return Object.fromEntries(s);
  }
}
function ub(e) {
  const t = {};
  for (const [n, r] of Object.entries(e))
    r !== void 0 && (t[n] = r);
  return t;
}
const db = /^[A-Za-z_][A-Za-z0-9_-]*$/u, fb = ["store", "project", "env"];
function vd(e) {
  const t = e.trim();
  if (t.length === 0)
    return;
  const n = /^secret_ref:([^:]+):(.+)$/u.exec(t);
  if (!n)
    return;
  const r = n[1], s = n[2];
  if (!(r === void 0 || s === void 0 || !mb(r) || !db.test(s)))
    return { scope: r, name: s, ref: `secret_ref:${r}:${s}` };
}
function pb(e) {
  return vd(e) !== void 0;
}
function Bh(e, t = "secret_ref") {
  const n = vd(e);
  if (!n)
    throw new Error(`${t} must be one of secret_ref:store:NAME, secret_ref:project:NAME, or secret_ref:env:NAME with a safe NAME`);
  return n.ref;
}
function mb(e) {
  return fb.includes(e);
}
const Zf = /* @__PURE__ */ new Map([
  [0, "before"],
  [1, "after"],
  [2, "ANTop"],
  [3, "ANBottom"],
  [4, "atDepth"],
  [5, "EMTop"],
  [6, "EMBottom"],
  [7, "outlet"]
]), hb = /* @__PURE__ */ new Map([
  [0, "AND_ANY"],
  [1, "NOT_ALL"],
  [2, "NOT_ANY"],
  [3, "AND_ALL"]
]), gb = /* @__PURE__ */ new Set([
  "before",
  "after",
  "ANTop",
  "ANBottom",
  "atDepth",
  "EMTop",
  "EMBottom",
  "outlet"
]), $h = 4, vb = 8192, _b = "ydltavern-fixture-v1", yb = "normal", Hh = /* @__PURE__ */ new Set([
  "normal",
  "continue",
  "impersonate",
  "swipe",
  "regenerate",
  "quiet"
]), xb = ["triggers", "trigger", "generationTriggers", "generationTrigger", "generationTypes", "generationType", "generation_type"], bb = [
  "matchPersonaDescription",
  "matchCharacterDescription",
  "matchCharacterPersonality",
  "matchCharacterDepthPrompt",
  "matchScenario",
  "matchCreatorNotes"
];
function wb(e) {
  const t = Math.max(0, e.scanDepth ?? 4), n = Math.max(1, e.maxRecursion ?? e.max_recursion ?? e.recursiveScanDepth ?? 1), r = Math.max(0, e.minActivations ?? e.min_activations ?? e.minimumActivations ?? 0), s = e.budget?.type ?? "approxTokens", i = lw(e), o = zb(e), c = e.dryRun === !0 || e.dry_run === !0, u = [], p = ["ST token-level budget alignment is approximated, not tokenizer exact.", "Vector lore is not implemented in engine-core P1."], h = Sb(e), x = Bb(e.runtimeState ?? e.state), g = rp(x), w = [];
  c || Fb(h, x, g, o, w);
  const E = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), D = Fh(e), y = Ab(e);
  let b = Wh(e.chat, t, e.scanData), N = 0, l = 0;
  for (let v = 0; v < n; v += 1) {
    l = v + 1;
    const k = [];
    for (const A of h) {
      if (E.has(A.id))
        continue;
      const z = Uh(A.entry.delay);
      if (z > 0 && o < z) {
        const Z = { reason: `delay active until chatLength ${z}`, code: "delay_active", matchedKeys: [], matchedSecondaryKeys: [] };
        Xt(I, A, Z.reason ?? "delay active", Z.code), w.push(ct(A, !1, Z, v));
        continue;
      }
      const j = sp(g.sticky, A, o);
      if (j !== void 0) {
        const Z = { activated: !0, reason: `sticky active through chatLength ${j.end}`, code: "sticky_active", matchedKeys: [], matchedSecondaryKeys: [] }, le = Pa(Yl(A.entry.content), e.macroContext ?? {}), se = Ql(le.text);
        if (i !== void 0 && A.entry.ignoreBudget !== !0 && N + se > i) {
          const _e = { ...Z, reason: "budget exceeded", code: "budget_exceeded" };
          Xt(I, A, _e.reason ?? "budget exceeded", _e.code), w.push(ct(A, !1, _e, v));
          continue;
        }
        k.push({ candidate: A, match: Z, expanded: le, cost: se, stateActivation: "sticky" });
        continue;
      }
      const $ = sp(g.cooldown, A, o);
      if ($ !== void 0) {
        const Z = { reason: `cooldown active through chatLength ${$.end}`, code: "cooldown_active", matchedKeys: [], matchedSecondaryKeys: [] };
        Xt(I, A, Z.reason ?? "cooldown active", Z.code), w.push(ct(A, !1, Z, v));
        continue;
      }
      const O = ap(A.entry, b, v, D);
      if (!O.activated) {
        Xt(I, A, O.reason ?? "keys did not match", O.code ?? "key_mismatch"), w.push(ct(A, !1, O, v));
        continue;
      }
      if (!Jf(A, y, w, v).passed) {
        Xt(I, A, "probability roll failed", "probability_failed");
        continue;
      }
      const U = Pa(Yl(A.entry.content), e.macroContext ?? {}), V = Ql(U.text);
      if (i !== void 0 && A.entry.ignoreBudget !== !0 && N + V > i) {
        const Z = { ...O, reason: "budget exceeded", code: "budget_exceeded" };
        Xt(I, A, Z.reason, Z.code), w.push(ct(A, !1, Z, v));
        continue;
      }
      k.push({ candidate: A, match: O, expanded: U, cost: V });
    }
    const S = Rb(k, y, w, I, v), C = [];
    let L = N;
    for (const A of S) {
      if (i !== void 0 && A.candidate.entry.ignoreBudget !== !0 && L + A.cost > i) {
        const z = { ...A.match, reason: "budget exceeded", code: "budget_exceeded" };
        Xt(I, A.candidate, z.reason, z.code), w.push(ct(A.candidate, !1, z, v));
        continue;
      }
      L += A.cost, C.push(A);
    }
    const B = Db(C, E, I, w, v, u);
    if (c || Hb(C, g, o), N += C.reduce((A, z) => A + z.cost, 0), B.length === 0)
      break;
    b = `${b}
${B.join(`
`)}`;
  }
  if (r > E.size) {
    const v = Ib(e, t, b);
    if (v !== b) {
      u.push(`WI min activations requested ${r}; expanded scan text from ${b.length} to ${v.length} characters.`), b = v;
      for (const k of h) {
        if (E.size >= r)
          break;
        if (E.has(k.id))
          continue;
        const S = ap(k.entry, b, l, { ...D, minActivationScan: !0 });
        if (!S.activated) {
          Xt(I, k, S.reason ?? "keys did not match", S.code ?? "key_mismatch"), w.push(ct(k, !1, S, l));
          continue;
        }
        if (!Jf(k, y, w, l).passed) {
          Xt(I, k, "probability roll failed", "probability_failed");
          continue;
        }
        const L = Pa(Yl(k.entry.content), e.macroContext ?? {}), B = Ql(L.text);
        if (i !== void 0 && k.entry.ignoreBudget !== !0 && N + B > i) {
          const j = { ...S, reason: "budget exceeded", code: "budget_exceeded" };
          Xt(I, k, j.reason, j.code), w.push(ct(k, !1, j, l));
          continue;
        }
        N += B, I.delete(k.id), w.push(ct(k, !0, S, l));
        const A = Gh(k.entry.position, u), z = {
          id: k.id,
          book: k.bookName,
          comment: k.entry.comment,
          content: L.text,
          position: A,
          order: k.entry.order ?? 0,
          depth: A === "atDepth" ? Vh(k.entry.depth) : k.entry.depth,
          role: A === "atDepth" ? Kh(k.entry, u) : void 0,
          outletName: A === "outlet" ? qh(k.entry) : void 0,
          matchedKeys: S.matchedKeys,
          matchedSecondaryKeys: S.matchedSecondaryKeys,
          reason: S.reason ?? "min activation scan matched",
          code: S.code ?? "min_activation_scan",
          macroTrace: L.trace,
          activationIteration: l
        };
        E.set(k.id, z);
      }
    }
  }
  const d = [...E.values()].sort(Yh), f = rw(d, iw(e)), m = c ? rp(x) : $b(g, o);
  return {
    activated: d,
    skipped: [...I.values()].sort((v, k) => v.id.localeCompare(k.id)),
    buckets: f.buckets,
    diagnostics: {
      scanDepth: t,
      scanTextChars: b.length,
      iterations: l,
      budgetType: s,
      budgetLimit: i,
      usedBudget: N,
      warnings: u,
      unsupported: [...p, ...ow(f.uninserted)],
      uninserted: f.uninserted,
      activationTrace: w,
      routingTrace: f.routingTrace
    },
    nextState: m
  };
}
function Sb(e) {
  const t = [...e.books ?? [], ...e.book === void 0 ? [] : [e.book]], n = [];
  let r = 0;
  for (const s of t)
    for (const i of s.entries ?? []) {
      const o = String(i.uid ?? i.id ?? `${s.name ?? "book"}:${r}`);
      n.push({ entry: i, bookName: s.name, id: o, index: r }), r += 1;
    }
  return n.sort((s, i) => tw(s.entry, i.entry) || s.index - i.index);
}
function Fh(e) {
  const t = _d(e.generationType ?? e.generation_type), n = e.activeCharacterName ?? e.active_character_name ?? e.characterName ?? e.character_name ?? e.charName ?? e.character?.name, r = yn(e.activeCharacterTags ?? e.active_character_tags ?? e.characterTags ?? e.character_tags ?? e.charTags ?? e.character?.tags);
  return {
    generationType: t,
    characterName: n,
    characterTags: r,
    scanFlagTexts: {
      matchPersonaDescription: e.personaDescription ?? e.persona_description ?? e.persona,
      matchCharacterDescription: e.characterDescription ?? e.character_description ?? e.character?.description,
      matchCharacterPersonality: e.characterPersonality ?? e.character_personality ?? e.character?.personality,
      matchCharacterDepthPrompt: e.characterDepthPrompt ?? e.character_depth_prompt ?? e.depthPrompt ?? e.depth_prompt ?? e.character?.depthPrompt ?? e.character?.depth_prompt,
      matchScenario: e.scenario ?? e.character?.scenario,
      matchCreatorNotes: e.creatorNotes ?? e.creator_notes ?? e.character?.creatorNotes ?? e.character?.creator_notes
    }
  };
}
function _d(e) {
  switch (e?.toLowerCase().replace(/[^a-z0-9]/gu, "") ?? yb) {
    case "continue":
    case "continuation":
      return "continue";
    case "impersonate":
    case "impersonation":
      return "impersonate";
    case "swipe":
      return "swipe";
    case "regenerate":
    case "regen":
      return "regenerate";
    case "quiet":
    case "quietprompt":
      return "quiet";
    default:
      return "normal";
  }
}
function kb(e, t) {
  const n = [];
  for (const s of xb)
    n.push(...yn(e[s]));
  n.push(...Nb(e.selectiveLogic));
  const r = n.map(_d).filter((s, i, o) => Hh.has(s) && o.indexOf(s) === i);
  return { matches: r.length === 0 || r.includes(t), triggers: r };
}
function Nb(e) {
  return yn(e).filter((n) => Hh.has(_d(n)) || n.toLowerCase() === "continuation");
}
function jb(e, t, n) {
  const r = e.characterFilter ?? e.character_filter;
  if (r === void 0)
    return !0;
  const s = Ui(t), i = new Set(n.map(Ui)), { names: o, tags: c, exclude: u } = Eb(r);
  if (o.length === 0 && c.length === 0)
    return !0;
  const p = o.length > 0 && s !== void 0 && o.some((g) => Ui(g) === s), h = c.length > 0 && c.some((g) => i.has(Ui(g) ?? "")), x = p || h;
  return u ? !x : x;
}
function Eb(e) {
  if (typeof e == "string" || Array.isArray(e))
    return { names: yn(e), tags: [], exclude: !1 };
  const t = e;
  return {
    names: yn(t.names ?? t.name ?? t.characterNames),
    tags: yn(t.tags ?? t.tag),
    exclude: t.isExclude === !0 || t.exclude === !0
  };
}
function Cb(e) {
  const t = [
    ...yn(e.decorators),
    ...yn(e.decorator),
    ...yn(e.activationDecorator)
  ].map((n) => n.toLowerCase().replace(/[^a-z_]/gu, "")).join(" ");
  if (e.dontActivate === !0 || e.dont_activate === !0 || t.includes("dont_activate") || t.includes("dontactivate"))
    return "dont_activate";
  if (e.activate === !0 || t.includes("activate") || /@@activate\b/iu.test(e.content))
    return /@@dont_activate\b/iu.test(e.content) ? "dont_activate" : "activate";
  if (/@@dont_activate\b/iu.test(e.content))
    return "dont_activate";
}
function Yl(e) {
  return e.replace(/@@(?:dont_activate|activate)\b\s*/giu, "").trim();
}
function Tb(e, t) {
  const n = [];
  for (const r of bb)
    if (e[r] === !0) {
      const s = t[r];
      s !== void 0 && s.trim() !== "" && n.push(s);
    }
  return n.join(`
`);
}
function Ib(e, t, n) {
  const r = Math.max(t, e.chat.turns.length), s = Wh(e.chat, r, e.scanData), i = Fh(e), o = Object.values(i.scanFlagTexts).filter((c) => c !== void 0 && c.trim() !== "");
  return [...new Set([n, s, ...o].filter((c) => c.trim() !== ""))].join(`
`);
}
function ct(e, t, n, r, s) {
  return ta({
    entryId: e.id,
    source: e.bookName,
    activated: t,
    code: n.code ?? (t ? "key_match" : "key_mismatch"),
    reason: n.reason ?? (t ? "activated" : "keys did not match"),
    iteration: r,
    matchedKeys: n.matchedKeys,
    matchedSecondaryKeys: n.matchedSecondaryKeys,
    ...s
  });
}
function Ab(e) {
  const t = e.randomValues ?? e.rngSequence;
  let n = 0;
  const r = e.random === void 0 && t === void 0 ? Eh(_b) : void 0;
  return {
    next() {
      const s = n;
      n += 1;
      const i = t?.[s] ?? e.random?.() ?? r?.() ?? Math.random();
      return { index: s, value: Pb(i) };
    }
  };
}
function Pb(e) {
  return !Number.isFinite(e) || e < 0 ? 0 : e >= 1 ? e === 1 ? 1 : e % 1 : e;
}
function Jf(e, t, n, r) {
  const s = Wb(e.entry.probability);
  if (!(Fc(e.entry.useProbability ?? e.entry.use_probability) === !0) || s >= 100)
    return { passed: !0 };
  const o = t.next(), c = o.value * 100, u = c <= s, p = {
    reason: `probability roll ${c.toFixed(4)} ${u ? "<=" : ">"} ${s}`,
    code: u ? "probability_roll" : "probability_failed",
    matchedKeys: [],
    matchedSecondaryKeys: []
  };
  return n.push(ct(e, u, p, r, { probability: s, roll: c, randomIndex: o.index, randomValue: o.value })), { passed: u };
}
function Rb(e, t, n, r, s) {
  const i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Set();
  for (const u of e) {
    const p = tp(u.candidate.entry.group);
    if (p.length === 0) {
      c.add(u);
      continue;
    }
    for (const h of p)
      i.set(h, [...i.get(h) ?? [], u]), n.push(ct(u.candidate, !0, { ...u.match, code: "group_candidate", reason: `group candidate for ${h}` }, s, {
        group: h,
        score: Bc(u),
        weight: Va(u.candidate.entry)
      }));
  }
  for (const u of e) {
    const p = tp(u.candidate.entry.group);
    p.length !== 0 && p.every((h) => (o.has(h) || o.set(h, Mb(h, i.get(h) ?? [], t, n, r, s)), o.get(h) === u)) && c.add(u);
  }
  return e.filter((u) => c.has(u));
}
function Mb(e, t, n, r, s, i) {
  const o = Lb(t);
  if (o.length === 0)
    return;
  if (o.length === 1)
    return Ob(o[0], e, r, i), o[0];
  let c = o;
  if (c.filter((w) => Fc(w.candidate.entry.useGroupScoring ?? w.candidate.entry.use_group_scoring) === !0).length > 0) {
    const w = Math.max(...c.map(Bc));
    c = c.filter((E) => {
      const I = Bc(E);
      return I === w ? !0 : (Xt(s, E.candidate, `group scoring loser in ${e}`, "group_scoring_loser"), r.push(ct(E.candidate, !1, { ...E.match, code: "group_scoring_loser", reason: `group ${e} score ${I} below max ${w}` }, i, { group: e, score: I, maxScore: w })), !1);
    });
  }
  const p = c.filter((w) => Fc(w.candidate.entry.groupOverride ?? w.candidate.entry.group_override) === !0);
  if (p.length > 0) {
    const w = Math.max(...p.map((D) => D.candidate.entry.order ?? 0)), I = p.filter((D) => (D.candidate.entry.order ?? 0) === w).sort((D, y) => D.candidate.index - y.candidate.index)[0];
    return ep(e, c, I, r, s, i), I;
  }
  const h = c.reduce((w, E) => w + Va(E.candidate.entry), 0);
  let x = c[0], g;
  if (h > 0) {
    g = n.next();
    let w = g.value * h;
    for (const E of c)
      if (w -= Va(E.candidate.entry), w <= 0) {
        x = E;
        break;
      }
  }
  return ep(e, c, x, r, s, i, g), x;
}
function Db(e, t, n, r, s, i) {
  const o = [];
  for (const c of e) {
    const { candidate: u, match: p, expanded: h } = c;
    n.delete(u.id), r.push(ct(u, !0, p, s));
    const x = Gh(u.entry.position, i), g = {
      id: u.id,
      book: u.bookName,
      comment: u.entry.comment,
      content: h.text,
      position: x,
      order: u.entry.order ?? 0,
      depth: x === "atDepth" ? Vh(u.entry.depth) : u.entry.depth,
      role: x === "atDepth" ? Kh(u.entry, i) : void 0,
      outletName: x === "outlet" ? qh(u.entry) : void 0,
      matchedKeys: p.matchedKeys,
      matchedSecondaryKeys: p.matchedSecondaryKeys,
      reason: p.reason ?? "activated",
      code: p.code ?? "key_match",
      macroTrace: h.trace,
      activationIteration: s
    };
    t.set(u.id, g), u.entry.preventRecursion !== !0 && u.entry.excludeRecursion !== !0 && o.push(h.text);
  }
  return o;
}
function ep(e, t, n, r, s, i, o) {
  if (n !== void 0)
    for (const c of t)
      c === n ? r.push(ct(c.candidate, !0, { ...c.match, code: "group_winner", reason: `group ${e} winner` }, i, {
        group: e,
        randomIndex: o?.index,
        randomValue: o?.value,
        weight: Va(c.candidate.entry)
      })) : (Xt(s, c.candidate, `group ${e} loser`, "group_loser"), r.push(ct(c.candidate, !1, { ...c.match, code: "group_loser", reason: `group ${e} loser` }, i, {
        group: e,
        winnerEntryId: n.candidate.id,
        weight: Va(c.candidate.entry)
      })));
}
function Ob(e, t, n, r) {
  e !== void 0 && n.push(ct(e.candidate, !0, { ...e.match, code: "group_winner", reason: `group ${t} winner` }, r, { group: t }));
}
function Lb(e) {
  return [...new Set(e)];
}
function Bc(e) {
  return e.match.matchedKeys.length + e.match.matchedSecondaryKeys.length;
}
function tp(e) {
  return yn(e).map((t) => t.trim()).filter((t, n, r) => t.length > 0 && r.indexOf(t) === n);
}
function Va(e) {
  const t = Number(e.groupWeight ?? e.group_weight ?? 1);
  return Number.isFinite(t) && t > 0 ? t : 1;
}
function zb(e) {
  const t = e.chatLength ?? e.chat_length;
  return Number.isFinite(t) && t !== void 0 ? Math.max(0, Math.floor(t)) : e.chat.turns.filter((n) => n.hidden !== !0 && n.deleted !== !0).length;
}
function Bb(e, t) {
  return {
    sticky: np(e?.sticky),
    cooldown: np(e?.cooldown)
  };
}
function np(e) {
  if (e === void 0)
    return [];
  const t = [];
  for (const n of e) {
    const r = Math.floor(Number(n.start)), s = Math.floor(Number(n.end)), i = n.entryId ?? n.id, o = n.entryHash ?? n.hash;
    !Number.isFinite(r) || !Number.isFinite(s) || i === void 0 && o === void 0 || t.push(ta({ entryId: i, entryHash: o, start: r, end: s, protected: n.protected === !0 }));
  }
  return t;
}
function rp(e) {
  return {
    sticky: e.sticky?.map((t) => ({ ...t })) ?? [],
    cooldown: e.cooldown?.map((t) => ({ ...t })) ?? []
  };
}
function $b(e, t) {
  return {
    sticky: (e.sticky ?? []).filter((n) => n.end >= t),
    cooldown: (e.cooldown ?? []).filter((n) => n.end >= t)
  };
}
function sp(e, t, n) {
  const r = Ro(t.entry);
  return e?.find((s) => s.start <= n && s.end >= n && (s.entryId === t.id || s.entryHash === r));
}
function Hb(e, t, n) {
  const r = [...t.sticky ?? []], s = [...t.cooldown ?? []];
  for (const i of e) {
    if (i.stateActivation === "sticky")
      continue;
    const o = Hc(i.candidate.entry.sticky), c = Hc(i.candidate.entry.cooldown), u = Ro(i.candidate.entry);
    o > 0 && $c(r, { entryId: i.candidate.id, entryHash: u, start: n, end: n + o }), c > 0 && o === 0 && $c(s, { entryId: i.candidate.id, entryHash: u, start: n + 1, end: n + c });
  }
  t.sticky = r, t.cooldown = s;
}
function Fb(e, t, n, r, s) {
  const i = [...n.sticky ?? []].filter((c) => c.end >= r), o = [...n.cooldown ?? []];
  for (const c of t.sticky ?? []) {
    if (c.end >= r || c.protected === !0)
      continue;
    const u = e.find((x) => x.id === c.entryId || Ro(x.entry) === c.entryHash);
    if (u === void 0)
      continue;
    const p = Hc(u.entry.cooldown);
    if (p <= 0)
      continue;
    const h = {
      entryId: u.id,
      entryHash: Ro(u.entry),
      start: c.end + 1,
      end: c.end + p,
      protected: !0
    };
    h.end >= r && $c(o, h), s.push(ct(u, !1, { reason: `sticky expired; protected cooldown until chatLength ${h.end}`, code: "protected_cooldown_transition", matchedKeys: [], matchedSecondaryKeys: [] }, 0));
  }
  n.sticky = i, n.cooldown = o;
}
function $c(e, t) {
  const n = e.findIndex((r) => r.entryId === t.entryId || r.entryHash === t.entryHash);
  n >= 0 ? e[n] = t : e.push(t);
}
function Hc(e) {
  return e === !0 ? 1 : e === !1 || e === void 0 ? 0 : Uh(e);
}
function Uh(e) {
  const t = Number(e ?? 0);
  return !Number.isFinite(t) || t <= 0 ? 0 : Math.floor(t);
}
function Ro(e) {
  return Ub(`${yn(e.key ?? e.keys).join("")}${e.content}`);
}
function Ub(e) {
  let t = 2166136261;
  for (let n = 0; n < e.length; n += 1)
    t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
  return (t >>> 0).toString(16).padStart(8, "0");
}
function Wb(e) {
  const t = Number(e ?? 100);
  return Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : 100;
}
function Fc(e) {
  if (e === void 0)
    return;
  if (typeof e == "boolean")
    return e;
  if (typeof e == "number")
    return e !== 0;
  const t = e.trim().toLowerCase();
  if (["true", "1", "yes", "on"].includes(t))
    return !0;
  if (["false", "0", "no", "off", ""].includes(t))
    return !1;
}
function ap(e, t, n, r) {
  if (e.disable === !0 || e.disabled === !0)
    return { activated: !1, reason: "disabled", code: "disabled", matchedKeys: [], matchedSecondaryKeys: [] };
  const s = Cb(e);
  if (s === "dont_activate")
    return { activated: !1, reason: "decorator @@dont_activate blocked entry", code: "decorator_blocked", matchedKeys: [], matchedSecondaryKeys: [] };
  if (!kb(e, r.generationType).matches)
    return {
      activated: !1,
      reason: `generation trigger mismatch for ${r.generationType}`,
      code: "trigger_mismatch",
      matchedKeys: [],
      matchedSecondaryKeys: []
    };
  if (!jb(e, r.characterName, r.characterTags))
    return {
      activated: !1,
      reason: "character filter mismatch",
      code: "character_filter_mismatch",
      matchedKeys: [],
      matchedSecondaryKeys: []
    };
  if (e.delayUntilRecursion === !0 && n === 0)
    return { activated: !1, reason: "delayUntilRecursion waiting for recursive scan", code: "delay_until_recursion", matchedKeys: [], matchedSecondaryKeys: [] };
  if (typeof e.delayUntilRecursion == "number" && n < e.delayUntilRecursion)
    return { activated: !1, reason: `delayUntilRecursion waiting until iteration ${e.delayUntilRecursion}`, code: "delay_until_recursion", matchedKeys: [], matchedSecondaryKeys: [] };
  if (s === "activate")
    return { activated: !0, reason: "decorator @@activate forced entry", code: "decorator_forced", matchedKeys: [], matchedSecondaryKeys: [] };
  const o = Tb(e, r.scanFlagTexts), c = r.minActivationScan ? t : Yb(t, e.scanDepth ?? e.scan_depth), u = o.length === 0 ? c : `${c}
${o}`, p = e.key ?? e.keys ?? [], h = e.keysecondary ?? e.secondaryKeys ?? [], x = e.caseSensitive ?? e.case_sensitive ?? !1, g = e.matchWholeWords ?? e.match_whole_words ?? !1, w = e.constant === !0 ? [] : ip(p, u, x, g), E = r.minActivationScan ? "min activation scan " : o.length > 0 ? "scan flag match " : "", I = r.minActivationScan ? "min_activation_scan" : o.length > 0 ? "scan_flag_match" : "key_match";
  if (e.constant !== !0 && p.length > 0 && w.length === 0)
    return { activated: !1, reason: `${E}primary keys did not match`.trim(), code: "key_mismatch", matchedKeys: w, matchedSecondaryKeys: [] };
  if (e.constant !== !0 && p.length === 0)
    return { activated: !1, reason: "no primary keys", code: "key_mismatch", matchedKeys: w, matchedSecondaryKeys: [] };
  const D = ip(h, u, x, g), y = Jb(e.logic ?? (ew(e.selectiveLogic) || typeof e.selectiveLogic == "number" ? e.selectiveLogic : void 0));
  return h.length > 0 && !Gb(y, h.length, D.length) ? {
    activated: !1,
    reason: `${E}secondary keys failed ${y}`.trim(),
    code: "key_mismatch",
    matchedKeys: w,
    matchedSecondaryKeys: D
  } : { activated: !0, reason: `${E}${e.constant === !0 ? "constant entry" : "keys matched"}`.trim(), code: I, matchedKeys: w, matchedSecondaryKeys: D };
}
function Gb(e, t, n) {
  switch (e) {
    case "AND_ANY":
      return n > 0;
    case "NOT_ALL":
      return n < t;
    case "NOT_ANY":
      return n === 0;
    case "AND_ALL":
      return n === t;
  }
}
function ip(e, t, n, r) {
  return e.filter((s) => Vb(s, t, n, r));
}
function Vb(e, t, n, r) {
  const s = Kb(e);
  if (s !== void 0)
    return s.test(t);
  const i = n ? "u" : "iu", o = r ? `(?<![\\p{L}\\p{N}_])${op(e)}(?![\\p{L}\\p{N}_])` : op(e);
  return new RegExp(o, i).test(t);
}
function Kb(e) {
  if (!e.startsWith("/"))
    return;
  const t = e.lastIndexOf("/");
  if (t <= 0)
    return;
  const n = e.slice(1, t), r = e.slice(t + 1);
  try {
    return new RegExp(n, r);
  } catch {
    return;
  }
}
function Wh(e, t, n) {
  const r = [];
  n !== void 0 && r.push(...Array.isArray(n) ? n : [n]);
  const s = e.turns.filter((o) => o.hidden !== !0 && o.deleted !== !0), i = t === 0 ? [] : s.slice(-t);
  return r.push(...i.map(qb).filter((o) => o.length > 0)), r.join(`
`);
}
function qb(e) {
  const t = e.variants[e.active_variant];
  if (t === void 0)
    return "";
  const n = t.subs.filter((r) => r.kind === "text").map((r) => r.text).join(`
`).trim();
  return n.length === 0 ? "" : `${e.role}: ${n}`;
}
function Yb(e, t) {
  return t === void 0 || t <= 0 ? e : e.split(`
`).slice(-t).join(`
`);
}
function Gh(e, t) {
  if (typeof e == "number") {
    const n = Zf.get(e);
    return n !== void 0 ? n : (t.push(`Unsupported WI numeric position '${e}' normalized to before.`), "before");
  }
  if (typeof e == "string") {
    if (gb.has(e))
      return e;
    const n = Number(e);
    if (Number.isInteger(n)) {
      const i = Zf.get(n);
      if (i !== void 0)
        return i;
    }
    const r = e.toLowerCase().replace(/[^a-z0-9]/gu, ""), s = Qb.get(r);
    if (s !== void 0)
      return s;
    t.push(`Unsupported WI position '${e}' normalized to before.`);
  }
  return "before";
}
const Qb = /* @__PURE__ */ new Map([
  ["before", "before"],
  ["beforechar", "before"],
  ["beforecharacter", "before"],
  ["after", "after"],
  ["afterchar", "after"],
  ["aftercharacter", "after"],
  ["antop", "ANTop"],
  ["authortop", "ANTop"],
  ["authornotetop", "ANTop"],
  ["anbottom", "ANBottom"],
  ["authorbottom", "ANBottom"],
  ["authornotebottom", "ANBottom"],
  ["atdepth", "atDepth"],
  ["depth", "atDepth"],
  ["emtop", "EMTop"],
  ["exampletop", "EMTop"],
  ["examplestop", "EMTop"],
  ["mesexamplestop", "EMTop"],
  ["embottom", "EMBottom"],
  ["examplebottom", "EMBottom"],
  ["examplesbottom", "EMBottom"],
  ["mesexamplesbottom", "EMBottom"],
  ["outlet", "outlet"]
]);
function Vh(e) {
  return Number.isFinite(e) && e !== void 0 && e >= 0 ? Math.floor(e) : $h;
}
function Kh(e, t) {
  const n = e.role ?? e.depthRole ?? e.depth_role;
  if (n === void 0)
    return "system";
  if (typeof n == "number")
    return Xb.get(n) ?? "system";
  const r = n.toLowerCase().replace(/[^a-z0-9]/gu, ""), s = Zb.get(r);
  return s !== void 0 ? s : (t.push(`Unsupported WI atDepth role '${n}' normalized to system.`), "system");
}
const Xb = /* @__PURE__ */ new Map([
  [0, "system"],
  [1, "user"],
  [2, "assistant"],
  [3, "tool"]
]), Zb = /* @__PURE__ */ new Map([
  ["system", "system"],
  ["sys", "system"],
  ["user", "user"],
  ["human", "user"],
  ["assistant", "assistant"],
  ["char", "assistant"],
  ["character", "assistant"],
  ["model", "assistant"],
  ["tool", "tool"]
]);
function qh(e) {
  const t = e.outletName ?? e.outlet_name ?? e.outlet;
  return t?.trim() === "" || t === void 0 ? "default" : t;
}
function Jb(e) {
  return typeof e == "number" ? hb.get(e) ?? "AND_ANY" : e === "NOT_ALL" || e === "NOT_ANY" || e === "AND_ALL" ? e : "AND_ANY";
}
function ew(e) {
  return e === "AND_ANY" || e === "NOT_ALL" || e === "NOT_ANY" || e === "AND_ALL";
}
function tw(e, t) {
  return (e.order ?? 0) - (t.order ?? 0);
}
function Yh(e, t) {
  return e.order - t.order || e.id.localeCompare(t.id);
}
function nw(e) {
  return e.some((t) => (t.activationIteration ?? 0) > 0 && t.position === "before");
}
function rw(e, t) {
  const n = {
    before: [],
    after: [],
    ANTop: [],
    ANBottom: [],
    atDepth: [],
    EMTop: [],
    EMBottom: [],
    outlet: []
  }, r = [], s = [], i = {}, o = [], c = [], u = e.map((g, w) => ({ entry: g, index: w })).sort((g, w) => Yh(g.entry, w.entry)), p = nw(e), h = p ? e.map((g, w) => ({ entry: g, index: w })).sort((g, w) => (g.entry.activationIteration ?? 0) - (w.entry.activationIteration ?? 0) || g.index - w.index) : u;
  for (const { entry: g } of h) {
    const w = sw(g);
    switch (g.position) {
      case "before":
      case "after":
      case "ANTop":
      case "ANBottom":
        p ? n[g.position].push(g.content) : n[g.position].unshift(g.content);
        break;
      case "EMTop":
      case "EMBottom": {
        p ? n[g.position].push(g.content) : n[g.position].unshift(g.content);
        const I = { position: g.position === "EMTop" ? "before" : "after", content: g.content, entryId: g.id, order: g.order };
        p ? r.push(I) : r.unshift(I), c.push(`WI entry ${g.id} routed to ${g.position}; engine-core reports it but does not splice example messages.`);
        break;
      }
      case "atDepth": {
        p ? n.atDepth.push(g.content) : n.atDepth.unshift(g.content);
        const E = g.depth ?? $h, I = g.role ?? "system", D = `${E}:${I}`;
        let y = s.find((b) => `${b.depth}:${b.role}` === D);
        y === void 0 && (y = { depth: E, role: I, entries: [], content: [] }, p ? s.push(y) : s.unshift(y)), p ? (y.entries.push(w), y.content.push(g.content)) : (y.entries.unshift(w), y.content.unshift(g.content)), c.push(`WI entry ${g.id} routed to atDepth depth=${E} role=${I}; engine-core reports it but does not splice chat history.`);
        break;
      }
      case "outlet": {
        p ? n.outlet.push(g.content) : n.outlet.unshift(g.content);
        const E = g.outletName ?? "default";
        i[E] ??= { entries: [], content: [] }, p ? (i[E].entries.push(w), i[E].content.push(g.content)) : (i[E].entries.unshift(w), i[E].content.unshift(g.content)), c.push(`WI entry ${g.id} routed to outlet '${E}'; engine-core reports it but does not splice final chat messages.`);
        break;
      }
    }
  }
  for (const { entry: g } of u)
    switch (g.position) {
      case "before":
      case "after":
      case "ANTop":
      case "ANBottom":
        o.push(Fi(g, g.position, !0));
        break;
      case "EMTop":
      case "EMBottom": {
        const w = g.position === "EMTop" ? "before" : "after";
        o.push(Fi(g, `examples.${w}`, !1, "EM routing is reported but not spliced into final chat messages."));
        break;
      }
      case "atDepth":
        o.push(Fi(g, "depthEntries", !1, "atDepth routing is reported but not spliced into final chat messages."));
        break;
      case "outlet": {
        const w = g.outletName ?? "default";
        o.push(Fi(g, `outlets.${w}`, !1, "Outlet routing is reported but not spliced into final chat messages."));
        break;
      }
    }
  const x = aw(n.ANTop, t, n.ANBottom);
  return {
    buckets: {
      ...n,
      examples: r,
      em: r,
      depthEntries: s,
      anTop: n.ANTop,
      anBottom: n.ANBottom,
      anPatch: x,
      outlets: i
    },
    routingTrace: o,
    uninserted: c
  };
}
function sw(e) {
  return ta({
    content: e.content,
    entryId: e.id,
    order: e.order,
    source: e.book,
    position: e.position,
    depth: e.depth,
    role: e.role,
    outletName: e.outletName
  });
}
function Fi(e, t, n, r) {
  return ta({
    entryId: e.id,
    source: e.book,
    position: e.position,
    bucket: t,
    order: e.order,
    depth: e.depth,
    role: e.role,
    outletName: e.outletName,
    inserted: n,
    note: r
  });
}
function aw(e, t, n) {
  return ta({
    top: e,
    original: t,
    bottom: n,
    patched: [...e, ...t === void 0 || t.trim() === "" ? [] : [t], ...n].filter((r) => r.trim() !== "").join(`
`)
  });
}
function iw(e) {
  return e.authorNote ?? e.originalAuthorNote ?? e.author_note;
}
function ow(e) {
  return e.length === 0 ? [] : ["WI atDepth/outlet/EM routes are diagnostics/routing output only; engine-core does not splice them into final chat messages."];
}
function Xt(e, t, n, r) {
  e.has(t.id) || e.set(t.id, ta({ id: t.id, book: t.bookName, reason: n, code: r }));
}
function yn(e) {
  return e === void 0 ? [] : typeof e == "number" ? [String(e)] : typeof e == "string" ? e.split(/[|,]/u).map((t) => t.trim()).filter((t) => t.length > 0) : e.map((t) => String(t).trim()).filter((t) => t.length > 0);
}
function Ui(e) {
  const t = e?.trim().toLowerCase();
  return t === void 0 || t === "" ? void 0 : t;
}
function lw(e) {
  if (e.budget?.max !== void 0)
    return e.budget.max;
  const t = e.budget?.percent ?? e.budget?.worldInfoBudget ?? e.budget?.world_info_budget ?? e.worldInfoBudget ?? e.world_info_budget;
  if (t === void 0)
    return;
  const n = e.budget?.maxContext ?? e.budget?.max_context ?? e.budget?.openaiMaxContext ?? e.budget?.openai_max_context ?? e.maxContext ?? e.max_context ?? e.openaiMaxContext ?? e.openai_max_context ?? vb, r = Math.round(t * n / 100) || 1, s = e.budget?.cap ?? e.budget?.worldInfoBudgetCap ?? e.budget?.world_info_budget_cap ?? e.worldInfoBudgetCap ?? e.world_info_budget_cap ?? 0;
  return s > 0 && r > s ? s : r;
}
function Ql(e, t) {
  return Math.ceil(e.length / 3.35);
}
function op(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function ta(e) {
  const t = {};
  for (const [n, r] of Object.entries(e))
    r !== void 0 && (t[n] = r);
  return t;
}
function cw(e, t, n) {
  const r = [];
  if (n.disabledExtensions.has(e))
    return { eligible: !1, reasons: ["user-disabled"] };
  for (const s of t.requires ?? [])
    n.installedExtras.has(s) || r.push(`missing extras module: ${s}`);
  for (const s of t.dependencies ?? [])
    n.installedExtensions.has(s) || r.push(`missing dependency: ${s}`), n.disabledExtensions.has(s) && r.push(`dependency disabled: ${s}`);
  return t.minimum_client_version && !uw(n.clientVersion, t.minimum_client_version) && r.push(`client version ${n.clientVersion} < required ${t.minimum_client_version}`), { eligible: r.length === 0, reasons: r };
}
function uw(e, t) {
  const n = lp(e), r = lp(t);
  for (let s = 0; s < 3; s++) {
    if (n[s] > r[s])
      return !0;
    if (n[s] < r[s])
      return !1;
  }
  return !0;
}
function lp(e) {
  const t = e.replace(/^v/, "").split(/[.-]/).slice(0, 3).map((n) => Number.parseInt(n, 10));
  return [t[0] || 0, t[1] || 0, t[2] || 0];
}
function dw(e) {
  return [...e].sort((t, n) => {
    const r = t.manifest.loading_order ?? 1e3, s = n.manifest.loading_order ?? 1e3;
    return r !== s ? r - s : t.manifest.display_name.localeCompare(n.manifest.display_name);
  });
}
function fw(e) {
  const { id: t, manifest: n, basePath: r, currentLocale: s } = e, i = [];
  n.i18n && s && n.i18n[s] && i.push({
    kind: "add_locale",
    description: `load locale ${s} from ${n.i18n[s]}`,
    data: { locale: s, file: `${r}/${n.i18n[s]}` }
  }), n.js && i.push({
    kind: "add_script",
    description: `inject <script type="module" src="${r}/${n.js}">`,
    data: { src: `${r}/${n.js}`, type: "module" }
  }), n.css && i.push({
    kind: "add_style",
    description: `inject <link rel="stylesheet" href="${r}/${n.css}">`,
    data: { href: `${r}/${n.css}` }
  }), n.generate_interceptor && i.push({
    kind: "register_interceptor",
    description: `expose globalThis.${n.generate_interceptor} as generation interceptor`,
    data: { name: n.generate_interceptor }
  });
  const o = n.hooks?.activate;
  return o && i.push({
    kind: "call_hook",
    description: `call exported '${o}' as activate hook`,
    data: { hook: "activate", export: o }
  }), i.push({
    kind: "mark_active",
    description: `mark extension '${t}' as active`,
    data: { id: t }
  }), { id: t, manifest: n, steps: i };
}
class pw {
  disabled;
  constructor(t = []) {
    this.disabled = new Set(t);
  }
  isDisabled(t) {
    return this.disabled.has(t);
  }
  list() {
    return [...this.disabled];
  }
  disable(t) {
    this.disabled.add(t);
  }
  enable(t) {
    this.disabled.delete(t);
  }
  serialize() {
    return [...this.disabled];
  }
}
function cp(e) {
  const t = dw(e.records), n = [], r = [], s = new Set(e.ctx.installedExtensions);
  for (const i of t) {
    const o = cw(i.id, i.manifest, { ...e.ctx, installedExtensions: s });
    if (!o.eligible) {
      r.push({ id: i.id, reasons: o.reasons });
      continue;
    }
    const c = fw({
      id: i.id,
      manifest: i.manifest,
      basePath: e.basePath(i.id),
      ...e.currentLocale ? { currentLocale: e.currentLocale } : {}
    });
    n.push(c), s.add(i.id);
  }
  return { activated: n, skipped: r, hookFailures: [] };
}
function mw(e) {
  const t = [], n = /* @__PURE__ */ new Set();
  return { sets: e.map((s) => (n.has(s.id) && t.push({
    level: "warning",
    code: "quickReply.set.duplicate",
    message: `Duplicate quick reply set id: ${s.id}`,
    extensionId: "quick-reply"
  }), n.add(s.id), {
    id: s.id,
    name: s.name ?? s.id,
    enabled: s.enabled !== !1,
    items: (s.items ?? []).map((i, o) => hw(i, `${s.id}:${o}`, t)),
    links: [...new Set(s.links ?? [])]
  })), diagnostics: t };
}
function hw(e, t, n) {
  const r = e.id ?? t;
  return (e.message ?? "") === "" && (e.slashCommand ?? "") === "" && n.push({ level: "warning", code: "quickReply.item.empty", message: `Quick reply ${r} has no message or slash command.`, extensionId: "quick-reply" }), {
    id: r,
    label: e.label ?? r,
    message: e.message,
    slashCommand: e.slashCommand,
    enabled: e.enabled !== !1,
    autoExecute: e.autoExecute === !0,
    triggers: [...new Set(e.triggers ?? [])]
  };
}
function gw() {
  return {
    id: "chat_empty",
    meta: {
      title: "New chat",
      source_format: "ydltavern_native"
    },
    turns: []
  };
}
const vw = {
  day: "tomorrow",
  tz: "America/Los_Angeles"
}, _w = {
  events: [
    {
      title: "Product review",
      start: "14:00",
      duration_min: 45,
      attendees: 6
    }
  ]
}, mC = {
  id: "chat_demo_0001",
  meta: {
    title: "Product review prep",
    character_id: "char_demo_aria",
    persona_id: "persona_demo_user",
    source_format: "ydltavern_native"
  },
  turns: [
    {
      id: "turn_user_0001",
      index: 0,
      role: "user",
      speaker: { id: "persona_demo_user", name: "You", kind: "user" },
      active_variant: 0,
      source: "user_input",
      created_at: 17263e8,
      variants: [
        {
          id: "variant_user_0001",
          subs: [
            {
              kind: "text",
              text: "Help me plan tomorrow's product review. Pull the calendar entry and propose an agenda."
            }
          ],
          meta: {},
          created_at: 17263e8
        }
      ]
    },
    {
      id: "turn_assistant_0002",
      index: 1,
      role: "assistant",
      speaker: { id: "char_demo_aria", name: "Aria", kind: "character" },
      active_variant: 0,
      source: "generation",
      created_at: 172630004e4,
      variants: [
        {
          id: "variant_assistant_0002a",
          model: "gpt-4o-mini",
          subs: [
            {
              kind: "thinking",
              text: `I should check the calendar before drafting an agenda. The user said "tomorrow" so I will look up tomorrow's events first, then draft a tight agenda that respects the meeting length.`,
              collapsed_by_default: !0
            },
            {
              kind: "tool_call",
              call_id: "call_cal_001",
              tool: { provider: "calendar", name: "calendar.list_day" },
              arguments: vw
            },
            {
              kind: "tool_result",
              call_id: "call_cal_001",
              status: "ok",
              result: _w
            },
            {
              kind: "text",
              text: `Here's a 45-minute agenda for tomorrow's product review:

1. Status (5m) — release health, blockers
2. Demo (15m) — turn renderer + ST compat layer
3. Discussion (20m) — extension surface tradeoffs
4. Next steps (5m) — owners + dates`
            },
            {
              kind: "note",
              text: "agenda calibrated to 45m; trim discussion if demo runs over."
            }
          ],
          meta: {
            model: "gpt-4o-mini",
            prompt_tokens: 612,
            completion_tokens: 184,
            tokens: 796,
            latency_ms: 1450,
            finish_reason: "stop"
          },
          created_at: 172630004e4
        },
        {
          id: "variant_assistant_0002b",
          model: "gpt-4o-mini",
          subs: [
            {
              kind: "text",
              text: "(alternate variant — empty placeholder; swipe wiring is not implemented yet.)"
            }
          ],
          meta: {
            model: "gpt-4o-mini",
            finish_reason: "placeholder"
          },
          created_at: 172630005e4
        }
      ]
    }
  ]
};
function yd(e) {
  const t = {
    bgPrimary: e.blur_tint_color ?? "rgba(23, 23, 23, 1)",
    bgSecondary: e.chat_tint_color ?? "rgba(23, 23, 23, 1)",
    bgTertiary: e.blur_tint_color ?? "rgba(23, 23, 23, 1)",
    fgPrimary: e.main_text_color ?? "rgb(220, 220, 210)",
    fgSecondary: e.italics_text_color ?? "rgb(145, 145, 145)",
    fgMuted: e.italics_text_color ?? "rgb(145, 145, 145)",
    accentPrimary: e.quote_text_color ?? "rgb(225, 138, 36)",
    accentHover: e.quote_text_color ?? "rgb(225, 138, 36)",
    userBubble: e.user_mes_blur_tint_color ?? "rgba(0, 0, 0, 0.3)",
    assistantBubble: e.bot_mes_blur_tint_color ?? "rgba(60, 60, 60, 0.3)",
    systemBubble: e.italics_text_color ?? "rgb(145, 145, 145)",
    border: e.border_color ?? "rgba(0, 0, 0, 0.5)",
    shadow: e.shadow_color ?? "rgba(0, 0, 0, 0.5)",
    // New ST-aligned tokens
    bodyColor: e.main_text_color ?? "rgb(220, 220, 210)",
    emColor: e.italics_text_color ?? "rgb(145, 145, 145)",
    underlineColor: e.underline_text_color ?? "rgb(188, 231, 207)",
    quoteColor: e.quote_text_color ?? "rgb(225, 138, 36)",
    blurTint: e.blur_tint_color ?? "rgba(23, 23, 23, 1)",
    chatTint: e.chat_tint_color ?? "rgba(23, 23, 23, 1)",
    userMesTint: e.user_mes_blur_tint_color ?? "rgba(0, 0, 0, 0.3)",
    botMesTint: e.bot_mes_blur_tint_color ?? "rgba(60, 60, 60, 0.3)",
    shadowColor: e.shadow_color ?? "rgba(0, 0, 0, 0.5)",
    borderColor: e.border_color ?? "rgba(0, 0, 0, 0.5)",
    blurStrength: e.blur_strength ?? 10,
    fontScale: e.font_scale ?? 1
  }, n = {
    fastUiMode: e.fast_ui_mode ?? !1,
    waifuMode: e.waifuMode ?? !1,
    noShadows: e.noShadows ?? !1,
    avatarStyle: e.avatar_style ?? 0,
    chatDisplay: e.chat_display ?? 0,
    chatWidth: e.chat_width ?? 50,
    timerEnabled: e.timer_enabled ?? !1
  };
  return {
    name: yw(e.name),
    label: e.name,
    tokens: t,
    font: {
      family: '"Noto Sans", "Inter", ui-sans-serif, system-ui, sans-serif',
      sizeBase: `${(e.font_scale ?? 1) * 15}px`,
      sizeSm: `${(e.font_scale ?? 1) * 13}px`,
      sizeLg: `${(e.font_scale ?? 1) * 18}px`
    },
    density: "comfortable",
    flags: n,
    classic: !0
  };
}
function yw(e) {
  return e.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
const wr = {
  name: "dark",
  tokens: {
    bgPrimary: "#0b0d12",
    bgSecondary: "#11141b",
    bgTertiary: "#07080c",
    fgPrimary: "#e7eaf2",
    fgSecondary: "#b6bccd",
    fgMuted: "#7d8499",
    accentPrimary: "#e6b15c",
    accentHover: "#f1c98a",
    userBubble: "#9aa3ff",
    assistantBubble: "#e6b15c",
    systemBubble: "#5ac8d8",
    border: "#232a39",
    shadow: "#0b0d12"
  },
  font: {
    family: '"Noto Sans", "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
    sizeBase: "15px",
    sizeSm: "13px",
    sizeLg: "18px"
  },
  density: "comfortable"
}, xw = {
  name: "light",
  tokens: {
    bgPrimary: "#f8f9fc",
    bgSecondary: "#ffffff",
    bgTertiary: "#f0f2f6",
    fgPrimary: "#1a1d26",
    fgSecondary: "#4a4e5c",
    fgMuted: "#8b90a0",
    accentPrimary: "#c9952e",
    accentHover: "#a87a20",
    userBubble: "#6b74d9",
    assistantBubble: "#c9952e",
    systemBubble: "#1a8a99",
    border: "#d4d8e0",
    shadow: "rgba(0, 0, 0, 0.08)"
  },
  font: {
    family: '"Noto Sans", "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
    sizeBase: "15px",
    sizeSm: "13px",
    sizeLg: "18px"
  },
  density: "comfortable"
}, bw = {
  name: "parchment",
  tokens: {
    bgPrimary: "#f5efe0",
    bgSecondary: "#faf6ed",
    bgTertiary: "#ede5d0",
    fgPrimary: "#2c2416",
    fgSecondary: "#5e5340",
    fgMuted: "#9a8f78",
    accentPrimary: "#a8651e",
    accentHover: "#8a5216",
    userBubble: "#5b4c92",
    assistantBubble: "#a8651e",
    systemBubble: "#3a7a6a",
    border: "#d6cdb8",
    shadow: "rgba(0, 0, 0, 0.06)"
  },
  font: {
    family: '"Noto Sans", "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
    sizeBase: "15px",
    sizeSm: "13px",
    sizeLg: "18px"
  },
  density: "spacious"
}, ww = yd({
  name: "Dark V 1.0",
  blur_strength: 13,
  main_text_color: "rgba(207, 207, 197, 1)",
  italics_text_color: "rgba(145, 145, 145, 1)",
  underline_text_color: "rgba(145, 145, 145, 1)",
  quote_text_color: "rgba(198, 193, 151, 1)",
  blur_tint_color: "rgba(29, 33, 40, 0.9)",
  chat_tint_color: "rgba(29, 33, 40, 0.9)",
  user_mes_blur_tint_color: "rgba(29, 33, 40, 0.9)",
  bot_mes_blur_tint_color: "rgba(29, 33, 40, 0.9)",
  shadow_color: "rgba(0, 0, 0, 0.9)",
  border_color: "rgba(0, 0, 0, 1)",
  font_scale: 1,
  fast_ui_mode: !1,
  waifuMode: !1,
  avatar_style: 0,
  chat_display: 0,
  noShadows: !1,
  chat_width: 55,
  timer_enabled: !1
}), Sw = yd({
  name: "Azure",
  blur_strength: 11,
  main_text_color: "rgba(171, 198, 223, 1)",
  italics_text_color: "rgba(255, 255, 255, 1)",
  underline_text_color: "rgba(188, 231, 207, 1)",
  quote_text_color: "rgba(111, 133, 253, 1)",
  blur_tint_color: "rgba(23, 30, 33, 0.61)",
  chat_tint_color: "rgba(23, 23, 23, 0)",
  user_mes_blur_tint_color: "rgba(0, 28, 174, 0.2)",
  bot_mes_blur_tint_color: "rgba(0, 13, 57, 0.22)",
  shadow_color: "rgba(0, 0, 0, 1)",
  border_color: "rgba(0, 0, 0, 0.5)",
  font_scale: 1,
  fast_ui_mode: !1,
  waifuMode: !1,
  avatar_style: 1,
  chat_display: 1,
  noShadows: !1,
  chat_width: 50,
  timer_enabled: !0
}), kw = yd({
  name: "Celestial Macaron",
  blur_strength: 10,
  main_text_color: "rgba(229, 175, 162, 1)",
  italics_text_color: "rgba(146, 147, 161, 1)",
  underline_text_color: "rgba(157, 215, 198, 1)",
  quote_text_color: "rgba(197, 202, 206, 1)",
  blur_tint_color: "rgba(23, 36, 55, 0.9)",
  chat_tint_color: "rgba(18, 26, 40, 0.9)",
  user_mes_blur_tint_color: "rgba(51, 67, 90, 0.7)",
  bot_mes_blur_tint_color: "rgba(23, 36, 55, 0.75)",
  shadow_color: "rgba(0, 0, 0, 0.3)",
  border_color: "rgba(60, 74, 110, 0.93)",
  font_scale: 1,
  fast_ui_mode: !1,
  waifuMode: !1,
  avatar_style: 0,
  chat_display: 1,
  noShadows: !0,
  chat_width: 58,
  timer_enabled: !0
}), Qh = [
  wr,
  xw,
  bw,
  ww,
  Sw,
  kw
];
function xd(e) {
  return Qh.find((n) => n.name === e) ?? wr;
}
const _t = {
  activePreset: "default",
  streaming: !0,
  bannedTokens: "",
  logitBias: "",
  fastUImode: !1,
  reducedMotion: !1,
  showTimestamps: !1,
  showTokenCounter: !1,
  fontScale: 1,
  chatWidth: 50,
  avatarStyle: 0
}, Uc = {
  themeId: wr.name,
  density: wr.density,
  fontFamily: wr.font.family
}, Wc = {
  temperature: 1,
  topP: 1,
  topK: 0,
  frequencyPenalty: 0,
  presencePenalty: 0,
  maxTokens: 256
}, Mo = {
  provider: "openai",
  model: "gpt-4-turbo",
  secretRef: "secret_ref:store:OPENAI_API_KEY"
}, Gc = {
  contextTemplate: "default",
  storyString: "{{description}}{{personality}}{{scenario}}",
  exampleSeparator: "***",
  chatStart: "",
  instructEnabled: !1,
  instructTemplate: "none",
  instructInputSequence: `<|im_start|>user
`,
  instructOutputSequence: `<|im_start|>assistant
`,
  instructSystemSequence: `<|im_start|>system
`,
  instructStopSequence: "<|im_end|>",
  instructSystemSameAsUser: !0,
  systemPromptEnabled: !0,
  systemPrompt: "",
  postHistoryInstructions: "",
  stopStrings: "",
  reasoningPrefix: "<think>",
  reasoningSuffix: "</think>",
  reasoningAutoCollapse: !1,
  macroEnabled: !0,
  macroNestedRecursive: !0
}, Vc = {
  fitMode: "cover",
  autoSelectByCharacter: !1
}, Xh = {
  id: "persona-default-you",
  name: "You",
  description: "Default user persona.",
  createdAt: (/* @__PURE__ */ new Date(0)).toISOString()
}, Zh = {
  id: "sample-aria",
  name: "Aria",
  description: "Cheerful traveler. Sample character card.",
  personality: "Curious, kind, optimistic.",
  tags: ["fantasy", "sample"],
  createdAt: (/* @__PURE__ */ new Date(0)).toISOString()
}, Jh = {
  id: "wb-empty",
  name: "Untitled World Book",
  enabled: !1,
  entries: [],
  createdAt: (/* @__PURE__ */ new Date(0)).toISOString()
}, eg = {
  id: "bg-default",
  name: "Default",
  url: "",
  folder: "Default"
}, tg = {
  activeCharacterId: Zh.id,
  activePersonaId: Xh.id,
  activeWorldBookId: Jh.id,
  activeBackgroundId: eg.id,
  selectedWorldEntryId: null,
  activeConnectionProfile: null,
  activePreset: _t.activePreset
};
//! Streaming capability invocation over the surface-host postMessage bridge.
//!
//! Returns an AsyncIterable<StreamFrame> that the caller awaits. When the caller
//! is done (or wants to abort), call handle.cancel() to send
//! kernel.v1.capability.cancel and unsubscribe.
let Nw = 1;
function jw() {
  return `sub-${Nw++}-${Date.now()}`;
}
class Ew {
  items = [];
  resolvers = [];
  closed = !1;
  push(t) {
    if (this.closed) return;
    const n = this.resolvers.shift();
    n ? n({ value: t, done: !1 }) : this.items.push(t);
  }
  close() {
    if (!this.closed) {
      this.closed = !0;
      for (const t of this.resolvers) t({ value: void 0, done: !0 });
      this.resolvers.length = 0;
    }
  }
  iter() {
    const t = this;
    return {
      [Symbol.asyncIterator]() {
        return {
          next() {
            const n = t.items.shift();
            return n !== void 0 ? Promise.resolve({ value: n, done: !1 }) : t.closed ? Promise.resolve({ value: void 0, done: !0 }) : new Promise((r) => t.resolvers.push(r));
          },
          return() {
            return t.close(), Promise.resolve({ value: void 0, done: !0 });
          }
        };
      }
    };
  }
}
async function Cw(e, t) {
  const n = Iw();
  if (!n)
    throw new Error("streamCapability requires active session id (set via mount initialProps)");
  const r = rg(), s = await Qc("kernel.v1.capability.stream", {
    capability_id: e,
    input: t
  }), i = s.stream_id ?? s.output?.stream_id;
  if (!i)
    throw new Error("kernel.v1.capability.stream did not return stream_id");
  const o = jw(), c = new Ew();
  let u = !1;
  const p = () => {
    if (!u) {
      if (u = !0, typeof window < "u") {
        window.removeEventListener("message", x);
        try {
          window.parent?.postMessage(
            {
              type: "stream.unsubscribe",
              subscription_id: o,
              session_id: n,
              bridge_token: r.bridgeToken
            },
            r.targetOrigin
          );
        } catch {
        }
      }
      c.close();
    }
  }, h = {
    [Symbol.asyncIterator]() {
      const g = c.iter()[Symbol.asyncIterator]();
      return {
        next: () => g.next(),
        return: async () => (p(), g.return ? g.return() : { value: void 0, done: !0 })
      };
    }
  }, x = (g) => {
    const w = g.data;
    !w || typeof w != "object" || w.subscription_id === o && w.session_id === n && sg(g, w, r) && (w.type === "stream.frame" ? c.push({ kind: w.kind, payload: w.payload }) : w.type === "stream.ended" ? (c.push({ kind: "ended", payload: null }), p()) : w.type === "stream.error" && (c.push({ kind: "error", payload: w.error }), p()));
  };
  return typeof window < "u" && window.parent ? (window.addEventListener("message", x), window.parent.postMessage(
    {
      type: "stream.subscribe",
      id: o,
      subscription_id: o,
      stream_id: i,
      session_id: n,
      bridge_token: r.bridgeToken
    },
    r.targetOrigin
  )) : (c.push({
    kind: "error",
    payload: { code: "no_window", message: "streamCapability requires window.parent" }
  }), p()), {
    streamId: i,
    frames: h,
    async cancel() {
      try {
        await Qc("kernel.v1.capability.cancel", { stream_id: i });
      } catch {
      } finally {
        p();
      }
    }
  };
}
//! Surface-side helper for calling Yggdrasil host RPC methods through the
//! iframe postMessage bridge.
let Tw = 1, Do, Ka, bd, ts, Kc = !1;
const Oo = /* @__PURE__ */ new Map();
let up;
const qc = [
  "targetOrigin",
  "target_origin",
  "bridgeTargetOrigin",
  "bridge_target_origin",
  "hostOrigin",
  "host_origin",
  "rpcTargetOrigin",
  "rpc_target_origin"
], Yc = [
  "bridgeToken",
  "bridge_token",
  "bridgeNonce",
  "bridge_nonce",
  "hostRpcBridgeToken",
  "host_rpc_bridge_token"
];
function ng() {
  typeof window > "u" || up === window || (up = window, window.addEventListener("message", (e) => {
    const t = e.data;
    if (t?.type !== "rpc.result") return;
    const n = Oo.get(t.id);
    n && sg(e, t, n) && (Oo.delete(t.id), t.error ? n.reject(new Error(`${t.error.code}: ${t.error.message}`)) : n.resolve(t.result));
  }));
}
ng();
function Lo(e) {
  Do = e;
}
function Iw() {
  return Do;
}
function wd(e) {
  "targetOrigin" in e && (Ka = e.targetOrigin == null ? void 0 : Lw(e.targetOrigin)), "expectedSource" in e && (bd = e.expectedSource ?? void 0), "bridgeToken" in e && (ts = zw(e.bridgeToken)), !ts && (Ka || e.bridgeToken === void 0) && (ts = lg());
}
function Aw(e) {
  const t = dp(e, qc), n = dp(e, Yc), r = {};
  let s = !1;
  t !== void 0 && (r.targetOrigin = t, s = !0), n !== void 0 && (r.bridgeToken = n, s = !0), s && typeof window < "u" && window.parent && (r.expectedSource = window.parent), s && wd(r);
}
function Pw() {
  Ka = void 0, bd = void 0, ts = void 0, Kc = !1;
}
function rg() {
  ag();
  const e = Ka ?? ig();
  if (!e)
    throw new Error("host RPC unavailable: bridge targetOrigin is not configured");
  const t = bd ?? og();
  if (!t)
    throw new Error("host RPC unavailable: bridge expectedSource is not configured");
  return ts || (ts = lg()), {
    targetOrigin: e,
    expectedSource: t,
    bridgeToken: ts
  };
}
function Rw() {
  if (ag(), Ka) return;
  const e = ig();
  e && wd({
    targetOrigin: e,
    expectedSource: og()
  });
}
function sg(e, t, n) {
  return !(e.source !== n.expectedSource || e.origin !== n.targetOrigin || t.bridge_token !== n.bridgeToken);
}
async function Qc(e, t, n = 3e4) {
  if (typeof window > "u" || !window.parent)
    throw new Error("host RPC unavailable: not running in surface iframe");
  ng();
  const r = rg(), s = `rpc-${Tw++}-${Date.now()}`;
  return new Promise((i, o) => {
    const c = setTimeout(() => {
      Oo.delete(s), o(new Error(`host RPC timeout after ${n}ms (method=${e})`));
    }, n);
    Oo.set(s, {
      resolve: (p) => {
        clearTimeout(c), i(p);
      },
      reject: (p) => {
        clearTimeout(c), o(p);
      },
      targetOrigin: r.targetOrigin,
      expectedSource: r.expectedSource,
      bridgeToken: r.bridgeToken
    });
    const u = {
      type: "rpc.call",
      id: s,
      method: e,
      params: t,
      bridge_token: r.bridgeToken
    };
    Do && (u.session_id = Do), window.parent.postMessage(u, r.targetOrigin);
  });
}
function ag() {
  if (Kc || (Kc = !0, typeof window > "u")) return;
  const e = Mw(), t = Dw(), n = Wi(e, qc) ?? Wi(t, qc), r = Wi(e, Yc) ?? Wi(t, Yc), s = {};
  let i = !1;
  n !== void 0 && (s.targetOrigin = n, i = !0), r !== void 0 && (s.bridgeToken = r, i = !0), i && window.parent && (s.expectedSource = window.parent), i && wd(s);
}
function Mw() {
  try {
    return new URLSearchParams(window.location?.search ?? "");
  } catch {
    return new URLSearchParams();
  }
}
function Dw() {
  try {
    const e = window.location?.hash ?? "", t = e.startsWith("#") ? e.slice(1) : e, n = t.includes("?") ? t.slice(t.indexOf("?") + 1) : t;
    return new URLSearchParams(n.startsWith("?") ? n.slice(1) : n);
  } catch {
    return new URLSearchParams();
  }
}
function ig() {
  if (typeof window > "u" || Ow()) return;
  const e = window.location?.origin;
  return typeof e == "string" && e.length > 0 && e !== "null" ? e : void 0;
}
function og() {
  if (!(typeof window > "u" || !window.parent))
    return window.parent;
}
function Ow() {
  if (typeof window > "u" || !window.parent) return !1;
  try {
    return window.parent !== window;
  } catch {
    return !0;
  }
}
function Lw(e) {
  const t = e.trim();
  if (t.length === 0 || t === "*")
    throw new Error("host RPC bridge targetOrigin must be an explicit origin");
  try {
    const n = typeof window < "u" ? window.location?.href : void 0, r = n ? new URL(t, n) : new URL(t);
    if (r.origin === "null") throw new Error("opaque origin");
    return r.origin;
  } catch {
    throw new Error(`host RPC bridge targetOrigin is invalid: ${t}`);
  }
}
function zw(e) {
  if (e == null) return;
  const t = e.trim();
  return t.length > 0 ? t : void 0;
}
function lg() {
  const e = globalThis.crypto;
  if (e?.randomUUID) return e.randomUUID();
  if (e?.getRandomValues) {
    const t = new Uint8Array(16);
    return e.getRandomValues(t), Array.from(t, (n) => n.toString(16).padStart(2, "0")).join("");
  }
  return `bridge-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function dp(e, t) {
  for (const n of t) {
    const r = e[n];
    if (typeof r == "string" && r.length > 0) return r;
  }
}
function Wi(e, t) {
  for (const n of t) {
    const r = e.get(n);
    if (r !== null && r.length > 0) return r;
  }
}
async function na(e, t) {
  return (await Qc("kernel.v1.capability.invoke", {
    capability_id: e,
    input: t
  })).output;
}
const Bw = "official/secret-store-lab/put_secret", $w = "official/secret-store-lab/list_secrets", Hw = "official/secret-store-lab/delete_secret", Fw = "official/secret-store-lab/health", Uw = "official/secret-store-lab/put_project_secret";
async function Ww(e, t) {
  return await na(Bw, { name: e, value: t });
}
async function Gw(e, t, n) {
  return await na(Uw, { project_id: e, name: t, value: n });
}
async function Vw() {
  return (await na($w, {})).names;
}
async function Kw(e) {
  return (await na(Hw, { name: e })).removed;
}
async function qw() {
  return await na(Fw, {});
}
function Gi(e) {
  return Bh(`secret_ref:store:${e}`);
}
function Yw(e) {
  return Bh(`secret_ref:project:${e}`);
}
function _o(e) {
  if (e.trim().length !== 0 && !pb(e))
    return "Expected secret_ref:store:NAME, secret_ref:project:NAME, or secret_ref:env:NAME with a safe NAME";
}
function Sd(e) {
  if (!(typeof e != "string" || e.trim().length === 0))
    return vd(e)?.ref;
}
function fp(e) {
  switch (e) {
    case "openai":
    case "custom-openai":
      return "OPENAI_API_KEY";
    case "anthropic":
      return "ANTHROPIC_API_KEY";
    case "gemini":
      return "GEMINI_API_KEY";
    case "mistral":
      return "MISTRAL_API_KEY";
    case "deepseek":
      return "DEEPSEEK_API_KEY";
    case "openrouter":
      return "OPENROUTER_API_KEY";
    case "cohere":
      return "COHERE_API_KEY";
    case "groq":
      return "GROQ_API_KEY";
    case "horde":
      return "AI_HORDE_API_KEY";
    case "novelai":
      return "NOVELAI_API_KEY";
    case "mancer":
      return "MANCER_API_KEY";
    case "tabbyapi":
      return "TABBYAPI_KEY";
    default:
      return `${e.toUpperCase().replace(/-/g, "_")}_API_KEY`;
  }
}
const ce = {
  settings: "ydltavern.settings.v2",
  themeSettings: "ydltavern.themeSettings.v1",
  legacyThemeSettings: "ydltavern.themeSettings",
  sampler: "ydltavern.samplerSettings.v1",
  connection: "ydltavern.connectionProfiles.v1",
  formatting: "ydltavern.formattingSettings.v1",
  personas: "ydltavern.personas.v1",
  characters: "ydltavern.characters.v1",
  worldbooks: "ydltavern.worldbooks.v1",
  backgrounds: "ydltavern.backgrounds.v1",
  backgroundDisplay: "ydltavern.backgroundDisplaySettings.v1",
  selection: "ydltavern.selection.v1"
};
function Hn(e, t) {
  try {
    if (typeof localStorage > "u") return t;
    const n = localStorage.getItem(e);
    if (!n) return t;
    const r = JSON.parse(n);
    return Array.isArray(t) ? Array.isArray(r) ? r : t : zo(t) && zo(r) ? { ...t, ...r } : r;
  } catch {
    return t;
  }
}
function yt(e, t) {
  try {
    if (typeof localStorage > "u") return;
    localStorage.setItem(e, JSON.stringify(t));
  } catch {
  }
}
function Qw() {
  try {
    if (typeof localStorage > "u") return;
    const e = localStorage.getItem("ydltavern.settings"), t = localStorage.getItem(ce.settings);
    if (!e || t) return;
    const n = JSON.parse(e), r = {
      activePreset: Xl(n.activePreset, _t.activePreset),
      streaming: ma(n.streaming, _t.streaming),
      bannedTokens: Xl(n.bannedTokens, _t.bannedTokens),
      logitBias: Xl(n.logitBias, _t.logitBias),
      fastUImode: ma(n.fastUImode, _t.fastUImode),
      reducedMotion: ma(n.reducedMotion, _t.reducedMotion),
      showTimestamps: ma(n.showTimestamps, _t.showTimestamps),
      showTokenCounter: ma(n.showTokenCounter, _t.showTokenCounter),
      fontScale: Zl(n.fontScale, _t.fontScale),
      chatWidth: Zl(n.chatWidth, _t.chatWidth),
      avatarStyle: Zl(n.avatarStyle, _t.avatarStyle)
    };
    localStorage.setItem(ce.settings, JSON.stringify(r));
    const s = Hn(ce.selection, tg);
    yt(ce.selection, { ...s, activePreset: r.activePreset });
  } catch {
  }
}
function Xw() {
  return Hn(ce.settings, _t);
}
function Zw() {
  const e = Hn(ce.themeSettings, void 0);
  return e !== void 0 ? { ...Uc, ...e } : Hn(ce.legacyThemeSettings, Uc);
}
function Jw(e) {
  yt(ce.themeSettings, e), yt(ce.legacyThemeSettings, e);
}
function eS() {
  return Hn(ce.sampler, Wc);
}
function tS() {
  const e = Hn(ce.connection, { current: Mo, profiles: {} });
  return cg(e);
}
function pa(e, t) {
  yt(ce.connection, cg({ current: e, profiles: t }));
}
function cg(e) {
  const t = zo(e.current) ? e.current : Mo, n = zo(e.profiles) ? e.profiles : {};
  return {
    current: pp(t),
    profiles: Object.fromEntries(
      Object.entries(n).map(([r, s]) => [r, pp(s)])
    )
  };
}
function pp(e) {
  const t = Sd(e.secretRef);
  return t === void 0 ? { ...e, secretRef: void 0 } : { ...e, secretRef: t };
}
function nS() {
  return Hn(ce.formatting, Gc);
}
function rS() {
  return Hn(ce.backgroundDisplay, Vc);
}
function sS() {
  return ml(ce.characters, [Zh]);
}
function aS() {
  return ml(ce.personas, [Xh]);
}
function iS() {
  return ml(ce.worldbooks, [Jh]);
}
function oS() {
  return ml(ce.backgrounds, [eg]);
}
function lS() {
  return Hn(ce.selection, tg);
}
function ml(e, t) {
  const n = Hn(e, t);
  return n.length > 0 ? n : t;
}
function zo(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Xl(e, t) {
  return typeof e == "string" ? e : t;
}
function ma(e, t) {
  return typeof e == "boolean" ? e : t;
}
function Zl(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
const ug = P.createContext(void 0), dg = /* @__PURE__ */ new Set(["openai", "anthropic", "deepseek", "openrouter"]);
function fg({
  chat: e = gw(),
  showDiagnostics: t = !0,
  sessionId: n,
  projectId: r,
  children: s,
  extensionRecords: i = [],
  extensionActivationContext: o
}) {
  const [c, u] = P.useState(0), [p, h] = P.useState(""), [x, g] = P.useState("settings"), [w, E] = P.useState(!1), [I, D] = P.useState(Zw), [y, b] = P.useState(() => (Qw(), Xw())), [N, l] = P.useState(eS), [d, f] = P.useState(tS), [m, v] = P.useState(nS), [k, S] = P.useState(rS), [C, L] = P.useState(sS), B = !d.current.provider || !d.current.secretRef, [A, z] = P.useState(aS), [j, $] = P.useState(iS), [O, F] = P.useState(oS), [U, V] = P.useState(lS), [Z, le] = P.useState(!1), se = P.useRef(null);
  P.useLayoutEffect(() => (Rw(), Lo(n), () => Lo(void 0)), [n]);
  const _e = P.useMemo(() => {
    const R = xd(I.themeId);
    return {
      ...R,
      font: { ...R.font, family: I.fontFamily },
      density: I.density
    };
  }, [I]), ne = P.useCallback((R) => {
    V(R), yt(ce.selection, R);
  }, []), Y = P.useCallback((R) => {
    V((M) => {
      const _ = { ...M, ...R };
      return yt(ce.selection, _), _;
    });
  }, []), W = P.useCallback((R) => {
    D(R), Jw(R);
  }, []), ae = P.useCallback((R) => {
    b((M) => {
      const _ = { ...M, ...R };
      return yt(ce.settings, _), R.activePreset !== void 0 && Y({ activePreset: R.activePreset }), _;
    });
  }, [Y]), fe = P.useCallback((R) => {
    ae({ activePreset: R });
  }, [ae]), ge = P.useCallback((R) => {
    l((M) => {
      const _ = { ...M, ...R };
      return yt(ce.sampler, _), _;
    });
  }, []), Se = P.useCallback((R) => {
    f((M) => {
      const _ = { ...M, current: { ...M.current, ...R } };
      return pa(_.current, _.profiles), _;
    });
  }, []), xe = P.useCallback((R) => {
    const M = R.trim();
    M.length !== 0 && (f((_) => {
      const T = { ..._, profiles: { ..._.profiles, [M]: _.current } };
      return pa(T.current, T.profiles), T;
    }), Y({ activeConnectionProfile: M }));
  }, [Y]), Te = P.useCallback((R) => {
    f((M) => {
      const _ = M.profiles[R];
      if (_ === void 0) return M;
      const T = { ...M, current: _ };
      return pa(T.current, T.profiles), T;
    }), Y({ activeConnectionProfile: R });
  }, [Y]), et = P.useCallback((R) => {
    f((M) => {
      const { [R]: _, ...T } = M.profiles, H = { ...M, profiles: T };
      return pa(H.current, H.profiles), H;
    }), U.activeConnectionProfile === R && Y({ activeConnectionProfile: null });
  }, [Y, U.activeConnectionProfile]), Ee = P.useCallback((R) => {
    v((M) => {
      const _ = { ...M, ...R };
      return yt(ce.formatting, _), _;
    });
  }, []), pt = P.useCallback((R) => {
    S((M) => {
      const _ = { ...M, fitMode: R };
      return yt(ce.backgroundDisplay, _), _;
    });
  }, []), tt = P.useCallback((R) => {
    S((M) => {
      const _ = { ...M, autoSelectByCharacter: R };
      return yt(ce.backgroundDisplay, _), _;
    });
  }, []), cn = P.useCallback((R) => Y({ activeCharacterId: R }), [Y]), Nn = P.useCallback((R) => Y({ activePersonaId: R }), [Y]), Kt = P.useCallback((R) => Y({ activeWorldBookId: R }), [Y]), Un = P.useCallback((R) => Y({ selectedWorldEntryId: R }), [Y]), un = P.useCallback((R) => Y({ activeBackgroundId: R }), [Y]), Lt = P.useCallback((R) => {
    const M = Kn(), _ = R.id ?? Wr("char"), T = { id: _, name: R.name ?? "New Character", ...R, createdAt: R.createdAt ?? M, updatedAt: R.updatedAt ?? M };
    return L((H) => mt(ce.characters, [...H, T])), Y({ activeCharacterId: _ }), _;
  }, [Y]), qt = P.useCallback((R, M) => {
    L((_) => mt(ce.characters, _.map((T) => T.id === R ? { ...T, ...M, id: R, updatedAt: Kn() } : T)));
  }, []), Hr = P.useCallback((R) => {
    L((M) => {
      const _ = M.filter((T) => T.id !== R);
      return U.activeCharacterId === R && Y({ activeCharacterId: _[0]?.id ?? null }), mt(ce.characters, _);
    });
  }, [Y, U.activeCharacterId]), cr = P.useCallback((R) => {
    const M = C.find((_) => _.id === R);
    return M === void 0 ? null : Lt({ ...M, id: Wr("char"), name: `${M.name} Copy` });
  }, [C, Lt]), jn = P.useCallback((R) => (L((M) => mt(ce.characters, mp(M, R))), Y({ activeCharacterId: R.id }), R.id), [Y]), dn = P.useCallback((R) => C.find((M) => M.id === R) ?? null, [C]), At = P.useCallback((R) => {
    const M = Kn(), _ = R.id ?? Wr("persona"), T = { id: _, name: R.name ?? "New Persona", ...R, createdAt: R.createdAt ?? M, updatedAt: R.updatedAt ?? M };
    return z((H) => mt(ce.personas, [...H, T])), Y({ activePersonaId: _ }), _;
  }, [Y]), ur = P.useCallback((R, M) => {
    z((_) => mt(ce.personas, _.map((T) => T.id === R ? { ...T, ...M, id: R, updatedAt: Kn() } : T)));
  }, []), ms = P.useCallback((R) => {
    z((M) => {
      const _ = M.filter((T) => T.id !== R);
      return U.activePersonaId === R && Y({ activePersonaId: _[0]?.id ?? null }), mt(ce.personas, _);
    });
  }, [Y, U.activePersonaId]), Ci = P.useCallback((R) => (z((M) => mt(ce.personas, mp(M, R))), Y({ activePersonaId: R.id }), R.id), [Y]), la = P.useCallback((R) => {
    const M = Kn(), _ = R.id ?? Wr("wb"), T = { id: _, name: R.name ?? "Untitled World Book", enabled: R.enabled ?? !1, entries: R.entries ?? [], ...R, createdAt: R.createdAt ?? M, updatedAt: R.updatedAt ?? M };
    return $((H) => mt(ce.worldbooks, [...H, T])), Y({ activeWorldBookId: _, selectedWorldEntryId: T.entries[0]?.uid ?? null }), _;
  }, [Y]), Ti = P.useCallback((R, M) => {
    $((_) => mt(ce.worldbooks, _.map((T) => T.id === R ? { ...T, ...M, id: R, updatedAt: Kn() } : T)));
  }, []), hs = P.useCallback((R) => {
    $((M) => {
      const _ = M.filter((T) => T.id !== R);
      return U.activeWorldBookId === R && Y({ activeWorldBookId: _[0]?.id ?? null, selectedWorldEntryId: _[0]?.entries[0]?.uid ?? null }), mt(ce.worldbooks, _);
    });
  }, [Y, U.activeWorldBookId]), dr = P.useCallback((R, M) => {
    const _ = M.uid ?? Wr("wbe"), T = {
      uid: _,
      key: M.key ?? [],
      content: M.content ?? "",
      position: M.position ?? "before_char",
      probability: M.probability ?? 100,
      order: M.order ?? 100,
      enabled: M.enabled ?? !0,
      ...M
    };
    let H = !1;
    return $((ee) => mt(ce.worldbooks, ee.map((re) => re.id !== R ? re : (H = !0, { ...re, entries: [...re.entries, T], updatedAt: Kn() })))), H && Y({ selectedWorldEntryId: _ }), H ? _ : null;
  }, [Y]), Yt = P.useCallback((R, M, _) => {
    $((T) => mt(ce.worldbooks, T.map((H) => H.id === R ? { ...H, entries: H.entries.map((ee) => ee.uid === M ? { ...ee, ..._, uid: M } : ee), updatedAt: Kn() } : H)));
  }, []), fr = P.useCallback((R, M) => {
    $((_) => mt(ce.worldbooks, _.map((T) => {
      if (T.id !== R) return T;
      const H = T.entries.filter((ee) => ee.uid !== M);
      return U.selectedWorldEntryId === M && Y({ selectedWorldEntryId: H[0]?.uid ?? null }), { ...T, entries: H, updatedAt: Kn() };
    })));
  }, [Y, U.selectedWorldEntryId]), ca = P.useCallback((R, M) => {
    const _ = j.find((T) => T.id === R)?.entries.find((T) => T.uid === M);
    return _ === void 0 ? null : dr(R, { ..._, uid: Wr("wbe"), comment: _.comment ? `${_.comment} Copy` : "Copy" });
  }, [dr, j]), ua = P.useCallback((R) => {
    const M = R.id ?? Wr("bg"), _ = { id: M, name: R.name ?? "New Background", url: R.url ?? "", ...R };
    return F((T) => mt(ce.backgrounds, [...T, _])), Y({ activeBackgroundId: M }), M;
  }, [Y]), Ml = P.useCallback((R) => {
    F((M) => {
      const _ = M.filter((T) => T.id !== R);
      return U.activeBackgroundId === R && Y({ activeBackgroundId: _[0]?.id ?? null }), mt(ce.backgrounds, _);
    });
  }, [Y, U.activeBackgroundId]), da = P.useCallback((R = "all") => {
    (R === "all" || R === "sampler") && (l(Wc), yt(ce.sampler, Wc)), (R === "all" || R === "connection") && (f((M) => ({ current: Mo, profiles: M.profiles })), pa(Mo, d.profiles), Y({ activeConnectionProfile: null })), (R === "all" || R === "formatting") && (v(Gc), yt(ce.formatting, Gc), S(Vc), yt(ce.backgroundDisplay, Vc)), (R === "all" || R === "theme") && W(Uc), R === "all" && (b(_t), yt(ce.settings, _t), ne({ ...U, activePreset: _t.activePreset, activeConnectionProfile: null }));
  }, [d.profiles, Y, ne, U, W]), { runtime: gs, ownStore: de } = P.useMemo(() => {
    const R = bh(e);
    return { runtime: qx({
      chat: e,
      chatHooks: {
        onEdit: (_, T) => {
          R.updateMessage(_, { mes: T.mes, name: T.name, is_user: T.is_user, is_system: T.is_system, extra: T.extra }), u((H) => H + 1);
        },
        onPush: (_) => {
          _.forEach((T) => R.pushMessage(T)), u((T) => T + 1);
        },
        onDelete: (_) => {
          R.deleteMessage(_), u((T) => T + 1);
        }
      }
    }), ownStore: R };
  }, [e]), it = gs.getContext(), Dl = de.snapshot(), fn = P.useCallback((R, M) => {
    const _ = de.messageAt(R);
    de.updateMessage(R, {
      mes: M.content,
      extra: {
        ..._?.extra ?? {},
        ...M.reasoning ? { reasoning: M.reasoning } : {},
        ydl_streaming: M.streaming,
        ...M.isError !== void 0 ? { ydl_error: M.isError } : {}
      }
    }), u((T) => T + 1);
  }, [de]), Le = P.useCallback(async (R, M) => {
    try {
      const _ = await na("ydltavern/engine/model.live_call", {
        ...M,
        stream: !1
      }), T = Xc(_), H = eu(_);
      fn(R, {
        content: T,
        reasoning: H,
        streaming: !1,
        isError: !1
      });
    } catch (_) {
      const T = _ instanceof Error ? _.message : String(_);
      fn(R, {
        content: `Error: ${T}`,
        streaming: !1,
        isError: !0
      });
    } finally {
      le(!1);
    }
  }, [fn]), Wn = P.useCallback(async (R, M) => {
    let _ = null, T = "";
    try {
      _ = await Cw("ydltavern/engine/model.live_call.stream", {
        ...M,
        stream: !0
      }), se.current = _, le(!0);
      for await (const H of _.frames) {
        const ee = H.kind;
        if (!(ee === "started" || ee === "progress")) {
          if (ee === "chunk") {
            const re = Zc(H.payload);
            re && (T += re, fn(R, { content: T, streaming: !0 }));
            continue;
          }
          if (ee === "ended" || ee === "final") {
            const re = Jc(H.payload);
            re && (T = re);
            break;
          }
          if (ee === "error") {
            const re = vS(H.payload);
            fn(R, {
              content: T || `Error: ${re}`,
              streaming: !1,
              isError: !T
            });
            return;
          }
          if (ee === "cancelled" || ee === "timeout") {
            fn(R, {
              content: T || `(${ee})`,
              streaming: !1
            });
            return;
          }
        }
      }
      fn(R, { content: T, streaming: !1 });
    } catch (H) {
      const ee = H instanceof Error ? H.message : String(H);
      fn(R, {
        content: T || `Error: ${ee}`,
        streaming: !1,
        isError: !T
      });
    } finally {
      se.current === _ && (se.current = null), le(!1);
    }
  }, [fn]), Ol = P.useCallback(async (R) => {
    if (Z) return;
    const M = (R ?? p).trim();
    if (M.length === 0) return;
    const _ = it.addOneMessage({ is_user: !0, name: it.name1, mes: M });
    if (de.pushMessage(_), h(""), u((ve) => ve + 1), !d.current.provider || !d.current.secretRef) {
      const ve = it.addOneMessage({
        is_system: !0,
        name: "System",
        mes: "Configure an API connection before sending. Open API Connections drawer and set a provider + API key."
      });
      de.pushMessage(ve), u((nt) => nt + 1);
      return;
    }
    if (!fS(d.current.provider)) {
      dg.has("textgen");
      const ve = it.addOneMessage({
        is_system: !0,
        name: "System",
        mes: `Provider "${d.current.provider}" is not supported for live model calls yet. Choose OpenAI, Anthropic, DeepSeek, or OpenRouter.`,
        extra: { ydl_error: !0 }
      });
      de.pushMessage(ve), u((nt) => nt + 1);
      return;
    }
    const T = it.addOneMessage({
      is_user: !1,
      name: it.name2,
      mes: "",
      extra: { ydl_streaming: !0 }
    });
    de.pushMessage(T);
    const H = de.length - 1;
    le(!0), u((ve) => ve + 1);
    const ee = dS(d.current.provider), re = {
      source: ee,
      model: d.current.model || pS(ee),
      messages: cS(de.messages()),
      settings: mS(N, y, d.current, it.name1, it.name2),
      secret_ref: d.current.secretRef
    };
    y.streaming ? await Wn(H, re) : await Le(H, re);
  }, [d.current, it, p, Z, de, N, Le, Wn, y]), Ve = P.useCallback((R) => {
    const M = it.addOneMessage({ is_system: !0, name: "System", mes: R });
    de.pushMessage(M), u((_) => _ + 1);
  }, [it, de]), fa = P.useCallback(() => {
    Ve("[Generate] not yet available. Use Send to get a live assistant reply.");
  }, [Ve]), Ii = P.useCallback(() => {
    _S(de, 0, (R) => ({ ...R, mes: `${R.mes ?? ""} [edited via surface]` })), u((R) => R + 1);
  }, [de]), Ai = P.useCallback(() => {
    Ve("[Swipe reply] not yet available. Use Send to get a live assistant reply.");
  }, [Ve]), Ll = P.useCallback(() => {
    Ve("[Regenerate] not yet available. Use Send to get a live assistant reply.");
  }, [Ve]), zt = P.useCallback(async () => {
    const R = se.current;
    R && (await R.cancel(), se.current = null, le(!1));
  }, []), Gn = P.useCallback(() => {
    Ve("[Continue] is not yet available on this surface.");
  }, [Ve]), Pi = P.useCallback(() => {
    Ve("[Impersonate] is not yet available on this surface.");
  }, [Ve]), Ri = P.useCallback((R, M) => {
    const _ = Gr(de.snapshot(), R);
    _ !== null && (de.updateMessage(_, { mes: M }), u((T) => T + 1));
  }, [de]), Mi = P.useCallback((R) => {
    const M = Gr(de.snapshot(), R);
    M !== null && (de.deleteMessage(M), u((_) => _ + 1));
  }, [de]), vs = P.useCallback((R, M) => {
    const _ = de.snapshot(), T = Gr(_, R);
    if (T === null) return;
    const H = M === "up" ? T - 1 : T + 1;
    if (H < 0 || H >= _.turns.length) return;
    const ee = de.messages(), re = ee[T], ve = ee[H];
    re === void 0 || ve === void 0 || (de.spliceMessages(Math.min(T, H), 2, M === "up" ? re : ve, M === "up" ? ve : re), u((nt) => nt + 1));
  }, [de]), Fr = P.useCallback((R) => {
    const M = Gr(de.snapshot(), R);
    if (M === null) return;
    const _ = de.messageAt(M);
    _ !== void 0 && (navigator.clipboard?.writeText(_.mes ?? "").catch(() => {
    }), de.spliceMessages(M + 1, 0, { ..._, send_date: (/* @__PURE__ */ new Date()).toISOString() }), u((T) => T + 1));
  }, [de]), _s = P.useCallback((R) => {
    const M = Gr(de.snapshot(), R);
    if (M === null) return;
    const _ = de.messageAt(M);
    de.updateMessage(M, { extra: { ..._?.extra ?? {}, ydl_hidden: !0 } }), u((T) => T + 1);
  }, [de]), pn = P.useCallback((R) => {
    const M = Gr(de.snapshot(), R);
    if (M === null) return;
    const _ = de.messageAt(M), { ydl_hidden: T, ...H } = _?.extra ?? {};
    de.updateMessage(M, { extra: H }), u((ee) => ee + 1);
  }, [de]), Ur = P.useCallback((R, M) => {
    const _ = Gr(de.snapshot(), R);
    if (_ === null) return;
    const T = de.messageAt(_), H = T?.swipes ?? [];
    if (T === void 0 || H.length === 0) return;
    const ee = T.swipe_id ?? 0, re = yS(ee + M, H.length);
    de.updateMessage(_, { mes: H[re] ?? T.mes, extra: T.extra }), u((ve) => ve + 1);
  }, [de]), Di = P.useCallback((R) => Ur(R, -1), [Ur]), zl = P.useCallback((R) => Ur(R, 1), [Ur]), Oi = P.useCallback((R) => {
    Ve(`[Regenerate message ${R}] not yet available on this surface.`);
  }, [Ve]), Li = P.useCallback((R) => {
    Ve(`[Branch message ${R}] not yet available on this surface.`);
  }, [Ve]), ys = P.useCallback((R) => {
    Ve(`[Checkpoint message ${R}] not yet available on this surface.`);
  }, [Ve]);
  return /* @__PURE__ */ a.jsx(
    ug.Provider,
    {
      value: {
        runtime: gs,
        liveChat: Dl,
        liveMessages: de.messages(),
        input: p,
        activeDrawer: x,
        showDiagnostics: t,
        sessionId: n,
        projectId: r,
        setInput: h,
        setActiveDrawer: g,
        sendMessage: Ol,
        generateReply: fa,
        editFirstMessage: Ii,
        swipeReply: Ai,
        regenerateReply: Ll,
        settings: y,
        updateSettings: ae,
        setActivePreset: fe,
        needsApiConnection: B,
        theme: _e,
        themeSettings: I,
        setThemeSettings: W,
        mobileDrawerOpen: w,
        setMobileDrawerOpen: E,
        extensionRecords: i,
        extensionActivationContext: o,
        samplerSettings: N,
        updateSamplerSettings: ge,
        connectionSettings: d.current,
        updateConnectionSettings: Se,
        connectionProfiles: d.profiles,
        saveConnectionProfile: xe,
        loadConnectionProfile: Te,
        deleteConnectionProfile: et,
        activeConnectionProfile: U.activeConnectionProfile,
        formattingSettings: m,
        updateFormattingSettings: Ee,
        backgroundDisplaySettings: k,
        setBackgroundFitMode: pt,
        setBackgroundAutoSelect: tt,
        characters: C,
        activeCharacterId: U.activeCharacterId,
        setActiveCharacter: cn,
        createCharacter: Lt,
        updateCharacter: qt,
        deleteCharacter: Hr,
        duplicateCharacter: cr,
        importCharacter: jn,
        exportCharacter: dn,
        personas: A,
        activePersonaId: U.activePersonaId,
        setActivePersona: Nn,
        createPersona: At,
        updatePersona: ur,
        deletePersona: ms,
        importPersona: Ci,
        worldBooks: j,
        activeWorldBookId: U.activeWorldBookId,
        selectedWorldEntryId: U.selectedWorldEntryId,
        setActiveWorldBook: Kt,
        setSelectedWorldEntry: Un,
        createWorldBook: la,
        updateWorldBook: Ti,
        deleteWorldBook: hs,
        createWorldEntry: dr,
        updateWorldEntry: Yt,
        deleteWorldEntry: fr,
        duplicateWorldEntry: ca,
        backgrounds: O,
        activeBackgroundId: U.activeBackgroundId,
        setActiveBackground: un,
        uploadBackground: ua,
        deleteBackground: Ml,
        resetSettings: da,
        isGenerating: Z,
        cancelGeneration: zt,
        continueLastReply: Gn,
        impersonate: Pi,
        editMessage: Ri,
        deleteMessage: Mi,
        moveMessage: vs,
        copyMessage: Fr,
        hideMessage: _s,
        unhideMessage: pn,
        swipeLeft: Di,
        swipeRight: zl,
        regenerateMessage: Oi,
        branchMessage: Li,
        checkpointMessage: ys,
        pushSystemNotice: Ve
      },
      children: s
    }
  );
}
function ft() {
  const e = P.useContext(ug);
  if (e === void 0) throw new Error("useTavern must be used inside <TavernProvider>.");
  return e;
}
function Wr(e) {
  const t = globalThis.crypto?.randomUUID?.();
  return t !== void 0 ? `${e}-${t}` : `${e}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function Kn() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function mt(e, t) {
  return yt(e, t), t;
}
function mp(e, t) {
  return e.findIndex((r) => r.id === t.id) === -1 ? [...e, t] : e.map((r) => r.id === t.id ? t : r);
}
function cS(e) {
  return e.map((t) => ({
    role: uS(t),
    content: t.mes ?? ""
  })).filter((t) => t.content.length > 0 || t.role === "assistant");
}
function uS(e) {
  return e.is_system ? "system" : e.is_user ? "user" : "assistant";
}
function dS(e) {
  switch (e) {
    case "anthropic":
      return "anthropic";
    case "custom-openai":
      return "openai";
    default:
      return e;
  }
}
function fS(e) {
  return dg.has(e);
}
function pS(e) {
  switch (e) {
    case "anthropic":
      return "claude-3-5-haiku-latest";
    case "deepseek":
      return "deepseek-chat";
    case "openrouter":
      return "openai/gpt-4o-mini";
    case "gemini":
      return "gemini-1.5-flash";
    default:
      return "gpt-4o-mini";
  }
}
function mS(e, t, n, r, s) {
  return {
    temp_openai: e.temperature,
    freq_pen_openai: e.frequencyPenalty,
    pres_pen_openai: e.presencePenalty,
    top_p_openai: e.topP,
    top_k: e.topK,
    min_p: e.minP,
    top_a: e.topA,
    repetition_penalty: e.repetitionPenalty,
    openai_max_tokens: e.maxTokens,
    openai_model: n.model,
    stream_openai: !1,
    user_name: r,
    char_name: s,
    logit_bias: hS(t.logitBias),
    stop: gS(t.bannedTokens)
  };
}
function hS(e) {
  const t = e.trim();
  if (t.length !== 0)
    try {
      const n = JSON.parse(t);
      if (!n || typeof n != "object" || Array.isArray(n)) return;
      const r = {};
      for (const [s, i] of Object.entries(n))
        typeof i == "number" && Number.isFinite(i) && (r[s] = i);
      return Object.keys(r).length > 0 ? r : void 0;
    } catch {
      return;
    }
}
function gS(e) {
  const t = e.split(/\r?\n/u).map((n) => n.trim()).filter(Boolean);
  return t.length > 0 ? t : void 0;
}
function Xc(e) {
  if (typeof e == "string") return e;
  if (!e || typeof e != "object") return "(empty response)";
  const t = e;
  if (typeof t.text == "string") return t.text;
  if (typeof t.output == "string") return t.output;
  if (t.output !== void 0) return Xc(t.output);
  if (t.body_shape !== void 0) return Xc(t.body_shape);
  const n = t.choices;
  if (Array.isArray(n)) {
    const i = n[0], o = i?.message;
    if (typeof o?.content == "string") return o.content;
    if (typeof i?.text == "string") return i.text;
  }
  const r = t.content;
  if (Array.isArray(r)) {
    const i = r.map((o) => typeof o == "object" && o !== null && typeof o.text == "string" ? o.text : "").join("");
    if (i) return i;
  } else if (typeof r == "string")
    return r;
  const s = t.candidates;
  if (Array.isArray(s)) {
    const c = s[0]?.content?.parts;
    if (Array.isArray(c)) {
      const u = c.map((p) => typeof p == "object" && p !== null && typeof p.text == "string" ? p.text : "").join("");
      if (u) return u;
    }
  }
  return "(empty response)";
}
function Zc(e) {
  if (typeof e == "string") return e;
  if (!e || typeof e != "object") return "";
  const t = e;
  if (typeof t.text == "string") return t.text;
  if (typeof t.delta == "string") return t.delta;
  if (typeof t.delta_text == "string") return t.delta_text;
  if (t.output !== void 0) return Zc(t.output);
  if (t.frame !== void 0) return Zc(t.frame);
  const n = t.choices;
  if (Array.isArray(n)) {
    const o = n[0], c = o?.delta;
    if (typeof c?.content == "string") return c.content;
    if (typeof o?.text == "string") return o.text;
  }
  const r = t.delta;
  if (r && typeof r == "object" && typeof r.text == "string")
    return r.text;
  const s = t.content;
  if (Array.isArray(s)) {
    const o = s[0];
    if (typeof o?.text == "string") return o.text;
  }
  const i = t.candidates;
  if (Array.isArray(i)) {
    const u = i[0]?.content?.parts;
    if (Array.isArray(u)) {
      const p = u[0];
      if (typeof p?.text == "string") return p.text;
    }
  }
  return "";
}
function Jc(e) {
  if (!e || typeof e != "object") return "";
  const t = e;
  return typeof t.text == "string" ? t.text : t.output !== void 0 ? Jc(t.output) : t.frame !== void 0 ? Jc(t.frame) : "";
}
function vS(e) {
  if (e && typeof e == "object") {
    const t = e;
    if (typeof t.message == "string") return t.message;
    if (typeof t.error == "string") return t.error;
  }
  return "stream error";
}
function eu(e) {
  if (!e || typeof e != "object") return;
  const t = e;
  if (typeof t.reasoning == "string") return t.reasoning;
  if (t.output !== void 0) return eu(t.output);
  if (t.body_shape !== void 0) return eu(t.body_shape);
  const n = t.choices;
  if (Array.isArray(n)) {
    const s = n[0]?.message;
    if (typeof s?.reasoning_content == "string") return s.reasoning_content;
  }
}
function Gr(e, t) {
  if (typeof t == "number") return t >= 0 && t < e.turns.length ? t : null;
  const n = e.turns.findIndex((r) => r.id === t || r.variants.some((s) => s.id === t));
  return n === -1 ? null : n;
}
function _S(e, t, n) {
  const r = e.messageAt(t);
  if (r === void 0) return;
  const s = n(r);
  e.updateMessage(t, { mes: s.mes, name: s.name, is_user: s.is_user, is_system: s.is_system, extra: s.extra });
}
function yS(e, t) {
  return (e % t + t) % t;
}
function xS(e) {
  return /* @__PURE__ */ a.jsxs("div", { id: "nonQRFormItems", className: "composer_toolbar", role: "toolbar", "aria-label": "Composer actions", children: [
    /* @__PURE__ */ a.jsx(
      "button",
      {
        type: "button",
        id: "options_button",
        className: "composer_button mes_button",
        onClick: e.onOptions,
        "aria-label": "Options menu",
        children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-bars", "aria-hidden": "true" })
      }
    ),
    e.onContinue && /* @__PURE__ */ a.jsx(
      "button",
      {
        type: "button",
        id: "mes_continue",
        className: "composer_button mes_button",
        onClick: e.onContinue,
        disabled: e.isGenerating,
        "aria-label": "Continue last response",
        title: "Continue",
        children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-forward", "aria-hidden": "true" })
      }
    ),
    e.onImpersonate && /* @__PURE__ */ a.jsx(
      "button",
      {
        type: "button",
        id: "mes_impersonate",
        className: "composer_button mes_button",
        onClick: e.onImpersonate,
        disabled: e.isGenerating,
        "aria-label": "Impersonate user",
        title: "Impersonate",
        children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-masks-theater", "aria-hidden": "true" })
      }
    )
  ] });
}
function bS({ onStop: e, label: t = "Generating…" }) {
  return /* @__PURE__ */ a.jsxs("div", { className: "streaming_indicator", role: "status", "aria-live": "polite", children: [
    /* @__PURE__ */ a.jsxs("span", { className: "streaming_dots", "aria-hidden": "true", children: [
      /* @__PURE__ */ a.jsx("span", { className: "streaming_dot" }),
      /* @__PURE__ */ a.jsx("span", { className: "streaming_dot" }),
      /* @__PURE__ */ a.jsx("span", { className: "streaming_dot" })
    ] }),
    /* @__PURE__ */ a.jsx("span", { className: "streaming_label", children: t }),
    e && /* @__PURE__ */ a.jsxs(
      "button",
      {
        type: "button",
        id: "mes_stop",
        className: "streaming_stop mes_button",
        onClick: e,
        "aria-label": "Stop generation",
        children: [
          /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-circle-stop", "aria-hidden": "true" }),
          /* @__PURE__ */ a.jsx("span", { children: "Stop" })
        ]
      }
    )
  ] });
}
const wS = 320;
function SS(e) {
  const [t, n] = P.useState(e.initialText ?? ""), r = P.useRef(null), s = P.useCallback(() => {
    const c = r.current;
    c && (c.style.height = "auto", c.style.height = `${Math.min(c.scrollHeight, wS)}px`);
  }, []), i = P.useCallback(async () => {
    if (!t.trim() || e.disabled || e.isGenerating) return;
    const c = t;
    n("");
    const u = r.current;
    u && (u.style.height = "auto"), await e.onSend(c), r.current?.focus();
  }, [t, e.disabled, e.isGenerating, e.onSend]), o = P.useCallback((c) => {
    if (c.key === "Enter" && !c.shiftKey && !c.ctrlKey && !c.metaKey) {
      c.preventDefault(), i();
      return;
    }
    c.key === "Enter" && (c.ctrlKey || c.metaKey) && (c.preventDefault(), i());
  }, [i]);
  return P.useEffect(() => {
    if (!e.isGenerating)
      try {
        r.current?.focus();
      } catch {
      }
  }, [e.isGenerating]), P.useEffect(() => {
    s();
  }, [t, s]), /* @__PURE__ */ a.jsxs(
    "form",
    {
      id: "send_form",
      className: "send_form",
      onSubmit: (c) => {
        c.preventDefault(), i();
      },
      "aria-label": "Send message",
      children: [
        e.isGenerating && /* @__PURE__ */ a.jsx(bS, { onStop: e.onStop }),
        e.needsApiConnection && /* @__PURE__ */ a.jsxs("div", { className: "ydl-api-callout", role: "alert", children: [
          /* @__PURE__ */ a.jsx("span", { className: "ydl-api-callout-text", children: "No API connection configured. Set a provider and key to send messages." }),
          e.onOpenApiConnections && /* @__PURE__ */ a.jsxs(
            "button",
            {
              type: "button",
              className: "menu_button",
              onClick: e.onOpenApiConnections,
              "aria-label": "Open API Connections",
              children: [
                /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-plug", "aria-hidden": "true" }),
                " Open API Connections"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "send_form_row", children: [
          /* @__PURE__ */ a.jsx("div", { id: "leftSendForm", "data-extension-territory": !0, children: /* @__PURE__ */ a.jsx(
            xS,
            {
              onOptions: e.onOptions,
              onContinue: e.onContinue,
              onImpersonate: e.onImpersonate,
              isGenerating: e.isGenerating
            }
          ) }),
          /* @__PURE__ */ a.jsx(
            "textarea",
            {
              ref: r,
              id: "send_textarea",
              className: "send_textarea",
              value: t,
              onChange: (c) => n(c.target.value),
              onKeyDown: o,
              placeholder: e.placeholder ?? "Type a message…",
              rows: 1,
              disabled: e.disabled || e.isGenerating,
              "aria-label": "Message input",
              style: { overflowY: "auto" }
            }
          ),
          /* @__PURE__ */ a.jsx("div", { id: "rightSendForm", "data-extension-territory": !0, children: e.isGenerating ? /* @__PURE__ */ a.jsx(
            "button",
            {
              type: "button",
              id: "send_but",
              className: "send_but composer_stop_button mes_button",
              onClick: e.onStop,
              "aria-label": "Stop generation",
              children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-circle-stop", "aria-hidden": "true" })
            }
          ) : /* @__PURE__ */ a.jsx(
            "button",
            {
              type: "submit",
              id: "send_but",
              className: "send_but mes_button",
              disabled: !t.trim() || e.disabled,
              "aria-label": "Send message",
              children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-paper-plane", "aria-hidden": "true" })
            }
          ) })
        ] })
      ]
    }
  );
}
var pg = { exports: {} }, Gt = {}, mg = { exports: {} }, hg = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(e) {
  function t(O, F) {
    var U = O.length;
    O.push(F);
    e: for (; 0 < U; ) {
      var V = U - 1 >>> 1, Z = O[V];
      if (0 < s(Z, F)) O[V] = F, O[U] = Z, U = V;
      else break e;
    }
  }
  function n(O) {
    return O.length === 0 ? null : O[0];
  }
  function r(O) {
    if (O.length === 0) return null;
    var F = O[0], U = O.pop();
    if (U !== F) {
      O[0] = U;
      e: for (var V = 0, Z = O.length, le = Z >>> 1; V < le; ) {
        var se = 2 * (V + 1) - 1, _e = O[se], ne = se + 1, Y = O[ne];
        if (0 > s(_e, U)) ne < Z && 0 > s(Y, _e) ? (O[V] = Y, O[ne] = U, V = ne) : (O[V] = _e, O[se] = U, V = se);
        else if (ne < Z && 0 > s(Y, U)) O[V] = Y, O[ne] = U, V = ne;
        else break e;
      }
    }
    return F;
  }
  function s(O, F) {
    var U = O.sortIndex - F.sortIndex;
    return U !== 0 ? U : O.id - F.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var i = performance;
    e.unstable_now = function() {
      return i.now();
    };
  } else {
    var o = Date, c = o.now();
    e.unstable_now = function() {
      return o.now() - c;
    };
  }
  var u = [], p = [], h = 1, x = null, g = 3, w = !1, E = !1, I = !1, D = typeof setTimeout == "function" ? setTimeout : null, y = typeof clearTimeout == "function" ? clearTimeout : null, b = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function N(O) {
    for (var F = n(p); F !== null; ) {
      if (F.callback === null) r(p);
      else if (F.startTime <= O) r(p), F.sortIndex = F.expirationTime, t(u, F);
      else break;
      F = n(p);
    }
  }
  function l(O) {
    if (I = !1, N(O), !E) if (n(u) !== null) E = !0, j(d);
    else {
      var F = n(p);
      F !== null && $(l, F.startTime - O);
    }
  }
  function d(O, F) {
    E = !1, I && (I = !1, y(v), v = -1), w = !0;
    var U = g;
    try {
      for (N(F), x = n(u); x !== null && (!(x.expirationTime > F) || O && !C()); ) {
        var V = x.callback;
        if (typeof V == "function") {
          x.callback = null, g = x.priorityLevel;
          var Z = V(x.expirationTime <= F);
          F = e.unstable_now(), typeof Z == "function" ? x.callback = Z : x === n(u) && r(u), N(F);
        } else r(u);
        x = n(u);
      }
      if (x !== null) var le = !0;
      else {
        var se = n(p);
        se !== null && $(l, se.startTime - F), le = !1;
      }
      return le;
    } finally {
      x = null, g = U, w = !1;
    }
  }
  var f = !1, m = null, v = -1, k = 5, S = -1;
  function C() {
    return !(e.unstable_now() - S < k);
  }
  function L() {
    if (m !== null) {
      var O = e.unstable_now();
      S = O;
      var F = !0;
      try {
        F = m(!0, O);
      } finally {
        F ? B() : (f = !1, m = null);
      }
    } else f = !1;
  }
  var B;
  if (typeof b == "function") B = function() {
    b(L);
  };
  else if (typeof MessageChannel < "u") {
    var A = new MessageChannel(), z = A.port2;
    A.port1.onmessage = L, B = function() {
      z.postMessage(null);
    };
  } else B = function() {
    D(L, 0);
  };
  function j(O) {
    m = O, f || (f = !0, B());
  }
  function $(O, F) {
    v = D(function() {
      O(e.unstable_now());
    }, F);
  }
  e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(O) {
    O.callback = null;
  }, e.unstable_continueExecution = function() {
    E || w || (E = !0, j(d));
  }, e.unstable_forceFrameRate = function(O) {
    0 > O || 125 < O ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : k = 0 < O ? Math.floor(1e3 / O) : 5;
  }, e.unstable_getCurrentPriorityLevel = function() {
    return g;
  }, e.unstable_getFirstCallbackNode = function() {
    return n(u);
  }, e.unstable_next = function(O) {
    switch (g) {
      case 1:
      case 2:
      case 3:
        var F = 3;
        break;
      default:
        F = g;
    }
    var U = g;
    g = F;
    try {
      return O();
    } finally {
      g = U;
    }
  }, e.unstable_pauseExecution = function() {
  }, e.unstable_requestPaint = function() {
  }, e.unstable_runWithPriority = function(O, F) {
    switch (O) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        O = 3;
    }
    var U = g;
    g = O;
    try {
      return F();
    } finally {
      g = U;
    }
  }, e.unstable_scheduleCallback = function(O, F, U) {
    var V = e.unstable_now();
    switch (typeof U == "object" && U !== null ? (U = U.delay, U = typeof U == "number" && 0 < U ? V + U : V) : U = V, O) {
      case 1:
        var Z = -1;
        break;
      case 2:
        Z = 250;
        break;
      case 5:
        Z = 1073741823;
        break;
      case 4:
        Z = 1e4;
        break;
      default:
        Z = 5e3;
    }
    return Z = U + Z, O = { id: h++, callback: F, priorityLevel: O, startTime: U, expirationTime: Z, sortIndex: -1 }, U > V ? (O.sortIndex = U, t(p, O), n(u) === null && O === n(p) && (I ? (y(v), v = -1) : I = !0, $(l, U - V))) : (O.sortIndex = Z, t(u, O), E || w || (E = !0, j(d))), O;
  }, e.unstable_shouldYield = C, e.unstable_wrapCallback = function(O) {
    var F = g;
    return function() {
      var U = g;
      g = F;
      try {
        return O.apply(this, arguments);
      } finally {
        g = U;
      }
    };
  };
})(hg);
mg.exports = hg;
var kS = mg.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var NS = P, Wt = kS;
function K(e) {
  for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
  return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var gg = /* @__PURE__ */ new Set(), qa = {};
function us(e, t) {
  Ks(e, t), Ks(e + "Capture", t);
}
function Ks(e, t) {
  for (qa[e] = t, e = 0; e < t.length; e++) gg.add(t[e]);
}
var nr = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), tu = Object.prototype.hasOwnProperty, jS = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, hp = {}, gp = {};
function ES(e) {
  return tu.call(gp, e) ? !0 : tu.call(hp, e) ? !1 : jS.test(e) ? gp[e] = !0 : (hp[e] = !0, !1);
}
function CS(e, t, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof t) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r ? !1 : n !== null ? !n.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
    default:
      return !1;
  }
}
function TS(e, t, n, r) {
  if (t === null || typeof t > "u" || CS(e, t, n, r)) return !0;
  if (r) return !1;
  if (n !== null) switch (n.type) {
    case 3:
      return !t;
    case 4:
      return t === !1;
    case 5:
      return isNaN(t);
    case 6:
      return isNaN(t) || 1 > t;
  }
  return !1;
}
function Tt(e, t, n, r, s, i, o) {
  this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = s, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = i, this.removeEmptyString = o;
}
var dt = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
  dt[e] = new Tt(e, 0, !1, e, null, !1, !1);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
  var t = e[0];
  dt[t] = new Tt(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
  dt[e] = new Tt(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
  dt[e] = new Tt(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
  dt[e] = new Tt(e, 3, !1, e.toLowerCase(), null, !1, !1);
});
["checked", "multiple", "muted", "selected"].forEach(function(e) {
  dt[e] = new Tt(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function(e) {
  dt[e] = new Tt(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function(e) {
  dt[e] = new Tt(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function(e) {
  dt[e] = new Tt(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var kd = /[\-:]([a-z])/g;
function Nd(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
  var t = e.replace(
    kd,
    Nd
  );
  dt[t] = new Tt(t, 1, !1, e, null, !1, !1);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
  var t = e.replace(kd, Nd);
  dt[t] = new Tt(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
  var t = e.replace(kd, Nd);
  dt[t] = new Tt(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function(e) {
  dt[e] = new Tt(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
dt.xlinkHref = new Tt("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
["src", "href", "action", "formAction"].forEach(function(e) {
  dt[e] = new Tt(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function jd(e, t, n, r) {
  var s = dt.hasOwnProperty(t) ? dt[t] : null;
  (s !== null ? s.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (TS(t, n, s, r) && (n = null), r || s === null ? ES(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : s.mustUseProperty ? e[s.propertyName] = n === null ? s.type === 3 ? !1 : "" : n : (t = s.attributeName, r = s.attributeNamespace, n === null ? e.removeAttribute(t) : (s = s.type, n = s === 3 || s === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var ir = NS.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Vi = Symbol.for("react.element"), js = Symbol.for("react.portal"), Es = Symbol.for("react.fragment"), Ed = Symbol.for("react.strict_mode"), nu = Symbol.for("react.profiler"), vg = Symbol.for("react.provider"), _g = Symbol.for("react.context"), Cd = Symbol.for("react.forward_ref"), ru = Symbol.for("react.suspense"), su = Symbol.for("react.suspense_list"), Td = Symbol.for("react.memo"), mr = Symbol.for("react.lazy"), yg = Symbol.for("react.offscreen"), vp = Symbol.iterator;
function ha(e) {
  return e === null || typeof e != "object" ? null : (e = vp && e[vp] || e["@@iterator"], typeof e == "function" ? e : null);
}
var Fe = Object.assign, Jl;
function Na(e) {
  if (Jl === void 0) try {
    throw Error();
  } catch (n) {
    var t = n.stack.trim().match(/\n( *(at )?)/);
    Jl = t && t[1] || "";
  }
  return `
` + Jl + e;
}
var ec = !1;
function tc(e, t) {
  if (!e || ec) return "";
  ec = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t) if (t = function() {
      throw Error();
    }, Object.defineProperty(t.prototype, "props", { set: function() {
      throw Error();
    } }), typeof Reflect == "object" && Reflect.construct) {
      try {
        Reflect.construct(t, []);
      } catch (p) {
        var r = p;
      }
      Reflect.construct(e, [], t);
    } else {
      try {
        t.call();
      } catch (p) {
        r = p;
      }
      e.call(t.prototype);
    }
    else {
      try {
        throw Error();
      } catch (p) {
        r = p;
      }
      e();
    }
  } catch (p) {
    if (p && r && typeof p.stack == "string") {
      for (var s = p.stack.split(`
`), i = r.stack.split(`
`), o = s.length - 1, c = i.length - 1; 1 <= o && 0 <= c && s[o] !== i[c]; ) c--;
      for (; 1 <= o && 0 <= c; o--, c--) if (s[o] !== i[c]) {
        if (o !== 1 || c !== 1)
          do
            if (o--, c--, 0 > c || s[o] !== i[c]) {
              var u = `
` + s[o].replace(" at new ", " at ");
              return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
            }
          while (1 <= o && 0 <= c);
        break;
      }
    }
  } finally {
    ec = !1, Error.prepareStackTrace = n;
  }
  return (e = e ? e.displayName || e.name : "") ? Na(e) : "";
}
function IS(e) {
  switch (e.tag) {
    case 5:
      return Na(e.type);
    case 16:
      return Na("Lazy");
    case 13:
      return Na("Suspense");
    case 19:
      return Na("SuspenseList");
    case 0:
    case 2:
    case 15:
      return e = tc(e.type, !1), e;
    case 11:
      return e = tc(e.type.render, !1), e;
    case 1:
      return e = tc(e.type, !0), e;
    default:
      return "";
  }
}
function au(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case Es:
      return "Fragment";
    case js:
      return "Portal";
    case nu:
      return "Profiler";
    case Ed:
      return "StrictMode";
    case ru:
      return "Suspense";
    case su:
      return "SuspenseList";
  }
  if (typeof e == "object") switch (e.$$typeof) {
    case _g:
      return (e.displayName || "Context") + ".Consumer";
    case vg:
      return (e._context.displayName || "Context") + ".Provider";
    case Cd:
      var t = e.render;
      return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
    case Td:
      return t = e.displayName || null, t !== null ? t : au(e.type) || "Memo";
    case mr:
      t = e._payload, e = e._init;
      try {
        return au(e(t));
      } catch {
      }
  }
  return null;
}
function AS(e) {
  var t = e.type;
  switch (e.tag) {
    case 24:
      return "Cache";
    case 9:
      return (t.displayName || "Context") + ".Consumer";
    case 10:
      return (t._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return e = t.render, e = e.displayName || e.name || "", t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return t;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return au(t);
    case 8:
      return t === Ed ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == "function") return t.displayName || t.name || null;
      if (typeof t == "string") return t;
  }
  return null;
}
function Pr(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return e;
    case "object":
      return e;
    default:
      return "";
  }
}
function xg(e) {
  var t = e.type;
  return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
}
function PS(e) {
  var t = xg(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
  if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
    var s = n.get, i = n.set;
    return Object.defineProperty(e, t, { configurable: !0, get: function() {
      return s.call(this);
    }, set: function(o) {
      r = "" + o, i.call(this, o);
    } }), Object.defineProperty(e, t, { enumerable: n.enumerable }), { getValue: function() {
      return r;
    }, setValue: function(o) {
      r = "" + o;
    }, stopTracking: function() {
      e._valueTracker = null, delete e[t];
    } };
  }
}
function Ki(e) {
  e._valueTracker || (e._valueTracker = PS(e));
}
function bg(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(), r = "";
  return e && (r = xg(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
}
function Bo(e) {
  if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function iu(e, t) {
  var n = t.checked;
  return Fe({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
}
function _p(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
  n = Pr(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
}
function wg(e, t) {
  t = t.checked, t != null && jd(e, "checked", t, !1);
}
function ou(e, t) {
  wg(e, t);
  var n = Pr(t.value), r = t.type;
  if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  t.hasOwnProperty("value") ? lu(e, t.type, n) : t.hasOwnProperty("defaultValue") && lu(e, t.type, Pr(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
}
function yp(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
    t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
  }
  n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
}
function lu(e, t, n) {
  (t !== "number" || Bo(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var ja = Array.isArray;
function zs(e, t, n, r) {
  if (e = e.options, t) {
    t = {};
    for (var s = 0; s < n.length; s++) t["$" + n[s]] = !0;
    for (n = 0; n < e.length; n++) s = t.hasOwnProperty("$" + e[n].value), e[n].selected !== s && (e[n].selected = s), s && r && (e[n].defaultSelected = !0);
  } else {
    for (n = "" + Pr(n), t = null, s = 0; s < e.length; s++) {
      if (e[s].value === n) {
        e[s].selected = !0, r && (e[s].defaultSelected = !0);
        return;
      }
      t !== null || e[s].disabled || (t = e[s]);
    }
    t !== null && (t.selected = !0);
  }
}
function cu(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(K(91));
  return Fe({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
}
function xp(e, t) {
  var n = t.value;
  if (n == null) {
    if (n = t.children, t = t.defaultValue, n != null) {
      if (t != null) throw Error(K(92));
      if (ja(n)) {
        if (1 < n.length) throw Error(K(93));
        n = n[0];
      }
      t = n;
    }
    t == null && (t = ""), n = t;
  }
  e._wrapperState = { initialValue: Pr(n) };
}
function Sg(e, t) {
  var n = Pr(t.value), r = Pr(t.defaultValue);
  n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
}
function bp(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function kg(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function uu(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml" ? kg(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
}
var qi, Ng = function(e) {
  return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, s) {
    MSApp.execUnsafeLocalFunction(function() {
      return e(t, n, r, s);
    });
  } : e;
}(function(e, t) {
  if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
  else {
    for (qi = qi || document.createElement("div"), qi.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = qi.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
    for (; t.firstChild; ) e.appendChild(t.firstChild);
  }
});
function Ya(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var Ma = {
  animationIterationCount: !0,
  aspectRatio: !0,
  borderImageOutset: !0,
  borderImageSlice: !0,
  borderImageWidth: !0,
  boxFlex: !0,
  boxFlexGroup: !0,
  boxOrdinalGroup: !0,
  columnCount: !0,
  columns: !0,
  flex: !0,
  flexGrow: !0,
  flexPositive: !0,
  flexShrink: !0,
  flexNegative: !0,
  flexOrder: !0,
  gridArea: !0,
  gridRow: !0,
  gridRowEnd: !0,
  gridRowSpan: !0,
  gridRowStart: !0,
  gridColumn: !0,
  gridColumnEnd: !0,
  gridColumnSpan: !0,
  gridColumnStart: !0,
  fontWeight: !0,
  lineClamp: !0,
  lineHeight: !0,
  opacity: !0,
  order: !0,
  orphans: !0,
  tabSize: !0,
  widows: !0,
  zIndex: !0,
  zoom: !0,
  fillOpacity: !0,
  floodOpacity: !0,
  stopOpacity: !0,
  strokeDasharray: !0,
  strokeDashoffset: !0,
  strokeMiterlimit: !0,
  strokeOpacity: !0,
  strokeWidth: !0
}, RS = ["Webkit", "ms", "Moz", "O"];
Object.keys(Ma).forEach(function(e) {
  RS.forEach(function(t) {
    t = t + e.charAt(0).toUpperCase() + e.substring(1), Ma[t] = Ma[e];
  });
});
function jg(e, t, n) {
  return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Ma.hasOwnProperty(e) && Ma[e] ? ("" + t).trim() : t + "px";
}
function Eg(e, t) {
  e = e.style;
  for (var n in t) if (t.hasOwnProperty(n)) {
    var r = n.indexOf("--") === 0, s = jg(n, t[n], r);
    n === "float" && (n = "cssFloat"), r ? e.setProperty(n, s) : e[n] = s;
  }
}
var MS = Fe({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
function du(e, t) {
  if (t) {
    if (MS[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(K(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(K(60));
      if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(K(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(K(62));
  }
}
function fu(e, t) {
  if (e.indexOf("-") === -1) return typeof t.is == "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var pu = null;
function Id(e) {
  return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
}
var mu = null, Bs = null, $s = null;
function wp(e) {
  if (e = Si(e)) {
    if (typeof mu != "function") throw Error(K(280));
    var t = e.stateNode;
    t && (t = yl(t), mu(e.stateNode, e.type, t));
  }
}
function Cg(e) {
  Bs ? $s ? $s.push(e) : $s = [e] : Bs = e;
}
function Tg() {
  if (Bs) {
    var e = Bs, t = $s;
    if ($s = Bs = null, wp(e), t) for (e = 0; e < t.length; e++) wp(t[e]);
  }
}
function Ig(e, t) {
  return e(t);
}
function Ag() {
}
var nc = !1;
function Pg(e, t, n) {
  if (nc) return e(t, n);
  nc = !0;
  try {
    return Ig(e, t, n);
  } finally {
    nc = !1, (Bs !== null || $s !== null) && (Ag(), Tg());
  }
}
function Qa(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = yl(n);
  if (r === null) return null;
  n = r[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (n && typeof n != "function") throw Error(K(231, t, typeof n));
  return n;
}
var hu = !1;
if (nr) try {
  var ga = {};
  Object.defineProperty(ga, "passive", { get: function() {
    hu = !0;
  } }), window.addEventListener("test", ga, ga), window.removeEventListener("test", ga, ga);
} catch {
  hu = !1;
}
function DS(e, t, n, r, s, i, o, c, u) {
  var p = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, p);
  } catch (h) {
    this.onError(h);
  }
}
var Da = !1, $o = null, Ho = !1, gu = null, OS = { onError: function(e) {
  Da = !0, $o = e;
} };
function LS(e, t, n, r, s, i, o, c, u) {
  Da = !1, $o = null, DS.apply(OS, arguments);
}
function zS(e, t, n, r, s, i, o, c, u) {
  if (LS.apply(this, arguments), Da) {
    if (Da) {
      var p = $o;
      Da = !1, $o = null;
    } else throw Error(K(198));
    Ho || (Ho = !0, gu = p);
  }
}
function ds(e) {
  var t = e, n = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do
      t = e, t.flags & 4098 && (n = t.return), e = t.return;
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function Rg(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
  }
  return null;
}
function Sp(e) {
  if (ds(e) !== e) throw Error(K(188));
}
function BS(e) {
  var t = e.alternate;
  if (!t) {
    if (t = ds(e), t === null) throw Error(K(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ; ) {
    var s = n.return;
    if (s === null) break;
    var i = s.alternate;
    if (i === null) {
      if (r = s.return, r !== null) {
        n = r;
        continue;
      }
      break;
    }
    if (s.child === i.child) {
      for (i = s.child; i; ) {
        if (i === n) return Sp(s), e;
        if (i === r) return Sp(s), t;
        i = i.sibling;
      }
      throw Error(K(188));
    }
    if (n.return !== r.return) n = s, r = i;
    else {
      for (var o = !1, c = s.child; c; ) {
        if (c === n) {
          o = !0, n = s, r = i;
          break;
        }
        if (c === r) {
          o = !0, r = s, n = i;
          break;
        }
        c = c.sibling;
      }
      if (!o) {
        for (c = i.child; c; ) {
          if (c === n) {
            o = !0, n = i, r = s;
            break;
          }
          if (c === r) {
            o = !0, r = i, n = s;
            break;
          }
          c = c.sibling;
        }
        if (!o) throw Error(K(189));
      }
    }
    if (n.alternate !== r) throw Error(K(190));
  }
  if (n.tag !== 3) throw Error(K(188));
  return n.stateNode.current === n ? e : t;
}
function Mg(e) {
  return e = BS(e), e !== null ? Dg(e) : null;
}
function Dg(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = Dg(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var Og = Wt.unstable_scheduleCallback, kp = Wt.unstable_cancelCallback, $S = Wt.unstable_shouldYield, HS = Wt.unstable_requestPaint, Ge = Wt.unstable_now, FS = Wt.unstable_getCurrentPriorityLevel, Ad = Wt.unstable_ImmediatePriority, Lg = Wt.unstable_UserBlockingPriority, Fo = Wt.unstable_NormalPriority, US = Wt.unstable_LowPriority, zg = Wt.unstable_IdlePriority, hl = null, Bn = null;
function WS(e) {
  if (Bn && typeof Bn.onCommitFiberRoot == "function") try {
    Bn.onCommitFiberRoot(hl, e, void 0, (e.current.flags & 128) === 128);
  } catch {
  }
}
var xn = Math.clz32 ? Math.clz32 : KS, GS = Math.log, VS = Math.LN2;
function KS(e) {
  return e >>>= 0, e === 0 ? 32 : 31 - (GS(e) / VS | 0) | 0;
}
var Yi = 64, Qi = 4194304;
function Ea(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function Uo(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0, s = e.suspendedLanes, i = e.pingedLanes, o = n & 268435455;
  if (o !== 0) {
    var c = o & ~s;
    c !== 0 ? r = Ea(c) : (i &= o, i !== 0 && (r = Ea(i)));
  } else o = n & ~s, o !== 0 ? r = Ea(o) : i !== 0 && (r = Ea(i));
  if (r === 0) return 0;
  if (t !== 0 && t !== r && !(t & s) && (s = r & -r, i = t & -t, s >= i || s === 16 && (i & 4194240) !== 0)) return t;
  if (r & 4 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - xn(t), s = 1 << n, r |= e[n], t &= ~s;
  return r;
}
function qS(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function YS(e, t) {
  for (var n = e.suspendedLanes, r = e.pingedLanes, s = e.expirationTimes, i = e.pendingLanes; 0 < i; ) {
    var o = 31 - xn(i), c = 1 << o, u = s[o];
    u === -1 ? (!(c & n) || c & r) && (s[o] = qS(c, t)) : u <= t && (e.expiredLanes |= c), i &= ~c;
  }
}
function vu(e) {
  return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
}
function Bg() {
  var e = Yi;
  return Yi <<= 1, !(Yi & 4194240) && (Yi = 64), e;
}
function rc(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function bi(e, t, n) {
  e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - xn(t), e[t] = n;
}
function QS(e, t) {
  var n = e.pendingLanes & ~t;
  e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var s = 31 - xn(n), i = 1 << s;
    t[s] = 0, r[s] = -1, e[s] = -1, n &= ~i;
  }
}
function Pd(e, t) {
  var n = e.entangledLanes |= t;
  for (e = e.entanglements; n; ) {
    var r = 31 - xn(n), s = 1 << r;
    s & t | e[r] & t && (e[r] |= t), n &= ~s;
  }
}
var Ce = 0;
function $g(e) {
  return e &= -e, 1 < e ? 4 < e ? e & 268435455 ? 16 : 536870912 : 4 : 1;
}
var Hg, Rd, Fg, Ug, Wg, _u = !1, Xi = [], Sr = null, kr = null, Nr = null, Xa = /* @__PURE__ */ new Map(), Za = /* @__PURE__ */ new Map(), vr = [], XS = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Np(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      Sr = null;
      break;
    case "dragenter":
    case "dragleave":
      kr = null;
      break;
    case "mouseover":
    case "mouseout":
      Nr = null;
      break;
    case "pointerover":
    case "pointerout":
      Xa.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Za.delete(t.pointerId);
  }
}
function va(e, t, n, r, s, i) {
  return e === null || e.nativeEvent !== i ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: i, targetContainers: [s] }, t !== null && (t = Si(t), t !== null && Rd(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, s !== null && t.indexOf(s) === -1 && t.push(s), e);
}
function ZS(e, t, n, r, s) {
  switch (t) {
    case "focusin":
      return Sr = va(Sr, e, t, n, r, s), !0;
    case "dragenter":
      return kr = va(kr, e, t, n, r, s), !0;
    case "mouseover":
      return Nr = va(Nr, e, t, n, r, s), !0;
    case "pointerover":
      var i = s.pointerId;
      return Xa.set(i, va(Xa.get(i) || null, e, t, n, r, s)), !0;
    case "gotpointercapture":
      return i = s.pointerId, Za.set(i, va(Za.get(i) || null, e, t, n, r, s)), !0;
  }
  return !1;
}
function Gg(e) {
  var t = Qr(e.target);
  if (t !== null) {
    var n = ds(t);
    if (n !== null) {
      if (t = n.tag, t === 13) {
        if (t = Rg(n), t !== null) {
          e.blockedOn = t, Wg(e.priority, function() {
            Fg(n);
          });
          return;
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function yo(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = yu(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      pu = r, n.target.dispatchEvent(r), pu = null;
    } else return t = Si(n), t !== null && Rd(t), e.blockedOn = n, !1;
    t.shift();
  }
  return !0;
}
function jp(e, t, n) {
  yo(e) && n.delete(t);
}
function JS() {
  _u = !1, Sr !== null && yo(Sr) && (Sr = null), kr !== null && yo(kr) && (kr = null), Nr !== null && yo(Nr) && (Nr = null), Xa.forEach(jp), Za.forEach(jp);
}
function _a(e, t) {
  e.blockedOn === t && (e.blockedOn = null, _u || (_u = !0, Wt.unstable_scheduleCallback(Wt.unstable_NormalPriority, JS)));
}
function Ja(e) {
  function t(s) {
    return _a(s, e);
  }
  if (0 < Xi.length) {
    _a(Xi[0], e);
    for (var n = 1; n < Xi.length; n++) {
      var r = Xi[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (Sr !== null && _a(Sr, e), kr !== null && _a(kr, e), Nr !== null && _a(Nr, e), Xa.forEach(t), Za.forEach(t), n = 0; n < vr.length; n++) r = vr[n], r.blockedOn === e && (r.blockedOn = null);
  for (; 0 < vr.length && (n = vr[0], n.blockedOn === null); ) Gg(n), n.blockedOn === null && vr.shift();
}
var Hs = ir.ReactCurrentBatchConfig, Wo = !0;
function ek(e, t, n, r) {
  var s = Ce, i = Hs.transition;
  Hs.transition = null;
  try {
    Ce = 1, Md(e, t, n, r);
  } finally {
    Ce = s, Hs.transition = i;
  }
}
function tk(e, t, n, r) {
  var s = Ce, i = Hs.transition;
  Hs.transition = null;
  try {
    Ce = 4, Md(e, t, n, r);
  } finally {
    Ce = s, Hs.transition = i;
  }
}
function Md(e, t, n, r) {
  if (Wo) {
    var s = yu(e, t, n, r);
    if (s === null) pc(e, t, r, Go, n), Np(e, r);
    else if (ZS(s, e, t, n, r)) r.stopPropagation();
    else if (Np(e, r), t & 4 && -1 < XS.indexOf(e)) {
      for (; s !== null; ) {
        var i = Si(s);
        if (i !== null && Hg(i), i = yu(e, t, n, r), i === null && pc(e, t, r, Go, n), i === s) break;
        s = i;
      }
      s !== null && r.stopPropagation();
    } else pc(e, t, r, null, n);
  }
}
var Go = null;
function yu(e, t, n, r) {
  if (Go = null, e = Id(r), e = Qr(e), e !== null) if (t = ds(e), t === null) e = null;
  else if (n = t.tag, n === 13) {
    if (e = Rg(t), e !== null) return e;
    e = null;
  } else if (n === 3) {
    if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
    e = null;
  } else t !== e && (e = null);
  return Go = e, null;
}
function Vg(e) {
  switch (e) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (FS()) {
        case Ad:
          return 1;
        case Lg:
          return 4;
        case Fo:
        case US:
          return 16;
        case zg:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var xr = null, Dd = null, xo = null;
function Kg() {
  if (xo) return xo;
  var e, t = Dd, n = t.length, r, s = "value" in xr ? xr.value : xr.textContent, i = s.length;
  for (e = 0; e < n && t[e] === s[e]; e++) ;
  var o = n - e;
  for (r = 1; r <= o && t[n - r] === s[i - r]; r++) ;
  return xo = s.slice(e, 1 < r ? 1 - r : void 0);
}
function bo(e) {
  var t = e.keyCode;
  return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
}
function Zi() {
  return !0;
}
function Ep() {
  return !1;
}
function Vt(e) {
  function t(n, r, s, i, o) {
    this._reactName = n, this._targetInst = s, this.type = r, this.nativeEvent = i, this.target = o, this.currentTarget = null;
    for (var c in e) e.hasOwnProperty(c) && (n = e[c], this[c] = n ? n(i) : i[c]);
    return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? Zi : Ep, this.isPropagationStopped = Ep, this;
  }
  return Fe(t.prototype, { preventDefault: function() {
    this.defaultPrevented = !0;
    var n = this.nativeEvent;
    n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Zi);
  }, stopPropagation: function() {
    var n = this.nativeEvent;
    n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Zi);
  }, persist: function() {
  }, isPersistent: Zi }), t;
}
var ra = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
  return e.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, Od = Vt(ra), wi = Fe({}, ra, { view: 0, detail: 0 }), nk = Vt(wi), sc, ac, ya, gl = Fe({}, wi, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Ld, button: 0, buttons: 0, relatedTarget: function(e) {
  return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
}, movementX: function(e) {
  return "movementX" in e ? e.movementX : (e !== ya && (ya && e.type === "mousemove" ? (sc = e.screenX - ya.screenX, ac = e.screenY - ya.screenY) : ac = sc = 0, ya = e), sc);
}, movementY: function(e) {
  return "movementY" in e ? e.movementY : ac;
} }), Cp = Vt(gl), rk = Fe({}, gl, { dataTransfer: 0 }), sk = Vt(rk), ak = Fe({}, wi, { relatedTarget: 0 }), ic = Vt(ak), ik = Fe({}, ra, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), ok = Vt(ik), lk = Fe({}, ra, { clipboardData: function(e) {
  return "clipboardData" in e ? e.clipboardData : window.clipboardData;
} }), ck = Vt(lk), uk = Fe({}, ra, { data: 0 }), Tp = Vt(uk), dk = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, fk = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, pk = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function mk(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = pk[e]) ? !!t[e] : !1;
}
function Ld() {
  return mk;
}
var hk = Fe({}, wi, { key: function(e) {
  if (e.key) {
    var t = dk[e.key] || e.key;
    if (t !== "Unidentified") return t;
  }
  return e.type === "keypress" ? (e = bo(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? fk[e.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Ld, charCode: function(e) {
  return e.type === "keypress" ? bo(e) : 0;
}, keyCode: function(e) {
  return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
}, which: function(e) {
  return e.type === "keypress" ? bo(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
} }), gk = Vt(hk), vk = Fe({}, gl, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Ip = Vt(vk), _k = Fe({}, wi, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Ld }), yk = Vt(_k), xk = Fe({}, ra, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), bk = Vt(xk), wk = Fe({}, gl, {
  deltaX: function(e) {
    return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
  },
  deltaY: function(e) {
    return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Sk = Vt(wk), kk = [9, 13, 27, 32], zd = nr && "CompositionEvent" in window, Oa = null;
nr && "documentMode" in document && (Oa = document.documentMode);
var Nk = nr && "TextEvent" in window && !Oa, qg = nr && (!zd || Oa && 8 < Oa && 11 >= Oa), Ap = " ", Pp = !1;
function Yg(e, t) {
  switch (e) {
    case "keyup":
      return kk.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function Qg(e) {
  return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
}
var Cs = !1;
function jk(e, t) {
  switch (e) {
    case "compositionend":
      return Qg(t);
    case "keypress":
      return t.which !== 32 ? null : (Pp = !0, Ap);
    case "textInput":
      return e = t.data, e === Ap && Pp ? null : e;
    default:
      return null;
  }
}
function Ek(e, t) {
  if (Cs) return e === "compositionend" || !zd && Yg(e, t) ? (e = Kg(), xo = Dd = xr = null, Cs = !1, e) : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case "compositionend":
      return qg && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var Ck = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
function Rp(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!Ck[e.type] : t === "textarea";
}
function Xg(e, t, n, r) {
  Cg(r), t = Vo(t, "onChange"), 0 < t.length && (n = new Od("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
}
var La = null, ei = null;
function Tk(e) {
  lv(e, 0);
}
function vl(e) {
  var t = As(e);
  if (bg(t)) return e;
}
function Ik(e, t) {
  if (e === "change") return t;
}
var Zg = !1;
if (nr) {
  var oc;
  if (nr) {
    var lc = "oninput" in document;
    if (!lc) {
      var Mp = document.createElement("div");
      Mp.setAttribute("oninput", "return;"), lc = typeof Mp.oninput == "function";
    }
    oc = lc;
  } else oc = !1;
  Zg = oc && (!document.documentMode || 9 < document.documentMode);
}
function Dp() {
  La && (La.detachEvent("onpropertychange", Jg), ei = La = null);
}
function Jg(e) {
  if (e.propertyName === "value" && vl(ei)) {
    var t = [];
    Xg(t, ei, e, Id(e)), Pg(Tk, t);
  }
}
function Ak(e, t, n) {
  e === "focusin" ? (Dp(), La = t, ei = n, La.attachEvent("onpropertychange", Jg)) : e === "focusout" && Dp();
}
function Pk(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown") return vl(ei);
}
function Rk(e, t) {
  if (e === "click") return vl(t);
}
function Mk(e, t) {
  if (e === "input" || e === "change") return vl(t);
}
function Dk(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var Sn = typeof Object.is == "function" ? Object.is : Dk;
function ti(e, t) {
  if (Sn(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
  var n = Object.keys(e), r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var s = n[r];
    if (!tu.call(t, s) || !Sn(e[s], t[s])) return !1;
  }
  return !0;
}
function Op(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function Lp(e, t) {
  var n = Op(e);
  e = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (r = e + n.textContent.length, e <= t && r >= t) return { node: n, offset: t - e };
      e = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = Op(n);
  }
}
function ev(e, t) {
  return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? ev(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
}
function tv() {
  for (var e = window, t = Bo(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = Bo(e.document);
  }
  return t;
}
function Bd(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
}
function Ok(e) {
  var t = tv(), n = e.focusedElem, r = e.selectionRange;
  if (t !== n && n && n.ownerDocument && ev(n.ownerDocument.documentElement, n)) {
    if (r !== null && Bd(n)) {
      if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
      else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
        e = e.getSelection();
        var s = n.textContent.length, i = Math.min(r.start, s);
        r = r.end === void 0 ? i : Math.min(r.end, s), !e.extend && i > r && (s = r, r = i, i = s), s = Lp(n, i);
        var o = Lp(
          n,
          r
        );
        s && o && (e.rangeCount !== 1 || e.anchorNode !== s.node || e.anchorOffset !== s.offset || e.focusNode !== o.node || e.focusOffset !== o.offset) && (t = t.createRange(), t.setStart(s.node, s.offset), e.removeAllRanges(), i > r ? (e.addRange(t), e.extend(o.node, o.offset)) : (t.setEnd(o.node, o.offset), e.addRange(t)));
      }
    }
    for (t = [], e = n; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++) e = t[n], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
  }
}
var Lk = nr && "documentMode" in document && 11 >= document.documentMode, Ts = null, xu = null, za = null, bu = !1;
function zp(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  bu || Ts == null || Ts !== Bo(r) || (r = Ts, "selectionStart" in r && Bd(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), za && ti(za, r) || (za = r, r = Vo(xu, "onSelect"), 0 < r.length && (t = new Od("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = Ts)));
}
function Ji(e, t) {
  var n = {};
  return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
}
var Is = { animationend: Ji("Animation", "AnimationEnd"), animationiteration: Ji("Animation", "AnimationIteration"), animationstart: Ji("Animation", "AnimationStart"), transitionend: Ji("Transition", "TransitionEnd") }, cc = {}, nv = {};
nr && (nv = document.createElement("div").style, "AnimationEvent" in window || (delete Is.animationend.animation, delete Is.animationiteration.animation, delete Is.animationstart.animation), "TransitionEvent" in window || delete Is.transitionend.transition);
function _l(e) {
  if (cc[e]) return cc[e];
  if (!Is[e]) return e;
  var t = Is[e], n;
  for (n in t) if (t.hasOwnProperty(n) && n in nv) return cc[e] = t[n];
  return e;
}
var rv = _l("animationend"), sv = _l("animationiteration"), av = _l("animationstart"), iv = _l("transitionend"), ov = /* @__PURE__ */ new Map(), Bp = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function Dr(e, t) {
  ov.set(e, t), us(t, [e]);
}
for (var uc = 0; uc < Bp.length; uc++) {
  var dc = Bp[uc], zk = dc.toLowerCase(), Bk = dc[0].toUpperCase() + dc.slice(1);
  Dr(zk, "on" + Bk);
}
Dr(rv, "onAnimationEnd");
Dr(sv, "onAnimationIteration");
Dr(av, "onAnimationStart");
Dr("dblclick", "onDoubleClick");
Dr("focusin", "onFocus");
Dr("focusout", "onBlur");
Dr(iv, "onTransitionEnd");
Ks("onMouseEnter", ["mouseout", "mouseover"]);
Ks("onMouseLeave", ["mouseout", "mouseover"]);
Ks("onPointerEnter", ["pointerout", "pointerover"]);
Ks("onPointerLeave", ["pointerout", "pointerover"]);
us("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
us("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
us("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
us("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
us("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
us("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var Ca = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), $k = new Set("cancel close invalid load scroll toggle".split(" ").concat(Ca));
function $p(e, t, n) {
  var r = e.type || "unknown-event";
  e.currentTarget = n, zS(r, t, void 0, e), e.currentTarget = null;
}
function lv(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n], s = r.event;
    r = r.listeners;
    e: {
      var i = void 0;
      if (t) for (var o = r.length - 1; 0 <= o; o--) {
        var c = r[o], u = c.instance, p = c.currentTarget;
        if (c = c.listener, u !== i && s.isPropagationStopped()) break e;
        $p(s, c, p), i = u;
      }
      else for (o = 0; o < r.length; o++) {
        if (c = r[o], u = c.instance, p = c.currentTarget, c = c.listener, u !== i && s.isPropagationStopped()) break e;
        $p(s, c, p), i = u;
      }
    }
  }
  if (Ho) throw e = gu, Ho = !1, gu = null, e;
}
function Pe(e, t) {
  var n = t[ju];
  n === void 0 && (n = t[ju] = /* @__PURE__ */ new Set());
  var r = e + "__bubble";
  n.has(r) || (cv(t, e, 2, !1), n.add(r));
}
function fc(e, t, n) {
  var r = 0;
  t && (r |= 4), cv(n, e, r, t);
}
var eo = "_reactListening" + Math.random().toString(36).slice(2);
function ni(e) {
  if (!e[eo]) {
    e[eo] = !0, gg.forEach(function(n) {
      n !== "selectionchange" && ($k.has(n) || fc(n, !1, e), fc(n, !0, e));
    });
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[eo] || (t[eo] = !0, fc("selectionchange", !1, t));
  }
}
function cv(e, t, n, r) {
  switch (Vg(t)) {
    case 1:
      var s = ek;
      break;
    case 4:
      s = tk;
      break;
    default:
      s = Md;
  }
  n = s.bind(null, t, n, e), s = void 0, !hu || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (s = !0), r ? s !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: s }) : e.addEventListener(t, n, !0) : s !== void 0 ? e.addEventListener(t, n, { passive: s }) : e.addEventListener(t, n, !1);
}
function pc(e, t, n, r, s) {
  var i = r;
  if (!(t & 1) && !(t & 2) && r !== null) e: for (; ; ) {
    if (r === null) return;
    var o = r.tag;
    if (o === 3 || o === 4) {
      var c = r.stateNode.containerInfo;
      if (c === s || c.nodeType === 8 && c.parentNode === s) break;
      if (o === 4) for (o = r.return; o !== null; ) {
        var u = o.tag;
        if ((u === 3 || u === 4) && (u = o.stateNode.containerInfo, u === s || u.nodeType === 8 && u.parentNode === s)) return;
        o = o.return;
      }
      for (; c !== null; ) {
        if (o = Qr(c), o === null) return;
        if (u = o.tag, u === 5 || u === 6) {
          r = i = o;
          continue e;
        }
        c = c.parentNode;
      }
    }
    r = r.return;
  }
  Pg(function() {
    var p = i, h = Id(n), x = [];
    e: {
      var g = ov.get(e);
      if (g !== void 0) {
        var w = Od, E = e;
        switch (e) {
          case "keypress":
            if (bo(n) === 0) break e;
          case "keydown":
          case "keyup":
            w = gk;
            break;
          case "focusin":
            E = "focus", w = ic;
            break;
          case "focusout":
            E = "blur", w = ic;
            break;
          case "beforeblur":
          case "afterblur":
            w = ic;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            w = Cp;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            w = sk;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            w = yk;
            break;
          case rv:
          case sv:
          case av:
            w = ok;
            break;
          case iv:
            w = bk;
            break;
          case "scroll":
            w = nk;
            break;
          case "wheel":
            w = Sk;
            break;
          case "copy":
          case "cut":
          case "paste":
            w = ck;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            w = Ip;
        }
        var I = (t & 4) !== 0, D = !I && e === "scroll", y = I ? g !== null ? g + "Capture" : null : g;
        I = [];
        for (var b = p, N; b !== null; ) {
          N = b;
          var l = N.stateNode;
          if (N.tag === 5 && l !== null && (N = l, y !== null && (l = Qa(b, y), l != null && I.push(ri(b, l, N)))), D) break;
          b = b.return;
        }
        0 < I.length && (g = new w(g, E, null, n, h), x.push({ event: g, listeners: I }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (g = e === "mouseover" || e === "pointerover", w = e === "mouseout" || e === "pointerout", g && n !== pu && (E = n.relatedTarget || n.fromElement) && (Qr(E) || E[rr])) break e;
        if ((w || g) && (g = h.window === h ? h : (g = h.ownerDocument) ? g.defaultView || g.parentWindow : window, w ? (E = n.relatedTarget || n.toElement, w = p, E = E ? Qr(E) : null, E !== null && (D = ds(E), E !== D || E.tag !== 5 && E.tag !== 6) && (E = null)) : (w = null, E = p), w !== E)) {
          if (I = Cp, l = "onMouseLeave", y = "onMouseEnter", b = "mouse", (e === "pointerout" || e === "pointerover") && (I = Ip, l = "onPointerLeave", y = "onPointerEnter", b = "pointer"), D = w == null ? g : As(w), N = E == null ? g : As(E), g = new I(l, b + "leave", w, n, h), g.target = D, g.relatedTarget = N, l = null, Qr(h) === p && (I = new I(y, b + "enter", E, n, h), I.target = N, I.relatedTarget = D, l = I), D = l, w && E) t: {
            for (I = w, y = E, b = 0, N = I; N; N = xs(N)) b++;
            for (N = 0, l = y; l; l = xs(l)) N++;
            for (; 0 < b - N; ) I = xs(I), b--;
            for (; 0 < N - b; ) y = xs(y), N--;
            for (; b--; ) {
              if (I === y || y !== null && I === y.alternate) break t;
              I = xs(I), y = xs(y);
            }
            I = null;
          }
          else I = null;
          w !== null && Hp(x, g, w, I, !1), E !== null && D !== null && Hp(x, D, E, I, !0);
        }
      }
      e: {
        if (g = p ? As(p) : window, w = g.nodeName && g.nodeName.toLowerCase(), w === "select" || w === "input" && g.type === "file") var d = Ik;
        else if (Rp(g)) if (Zg) d = Mk;
        else {
          d = Pk;
          var f = Ak;
        }
        else (w = g.nodeName) && w.toLowerCase() === "input" && (g.type === "checkbox" || g.type === "radio") && (d = Rk);
        if (d && (d = d(e, p))) {
          Xg(x, d, n, h);
          break e;
        }
        f && f(e, g, p), e === "focusout" && (f = g._wrapperState) && f.controlled && g.type === "number" && lu(g, "number", g.value);
      }
      switch (f = p ? As(p) : window, e) {
        case "focusin":
          (Rp(f) || f.contentEditable === "true") && (Ts = f, xu = p, za = null);
          break;
        case "focusout":
          za = xu = Ts = null;
          break;
        case "mousedown":
          bu = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          bu = !1, zp(x, n, h);
          break;
        case "selectionchange":
          if (Lk) break;
        case "keydown":
        case "keyup":
          zp(x, n, h);
      }
      var m;
      if (zd) e: {
        switch (e) {
          case "compositionstart":
            var v = "onCompositionStart";
            break e;
          case "compositionend":
            v = "onCompositionEnd";
            break e;
          case "compositionupdate":
            v = "onCompositionUpdate";
            break e;
        }
        v = void 0;
      }
      else Cs ? Yg(e, n) && (v = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (v = "onCompositionStart");
      v && (qg && n.locale !== "ko" && (Cs || v !== "onCompositionStart" ? v === "onCompositionEnd" && Cs && (m = Kg()) : (xr = h, Dd = "value" in xr ? xr.value : xr.textContent, Cs = !0)), f = Vo(p, v), 0 < f.length && (v = new Tp(v, e, null, n, h), x.push({ event: v, listeners: f }), m ? v.data = m : (m = Qg(n), m !== null && (v.data = m)))), (m = Nk ? jk(e, n) : Ek(e, n)) && (p = Vo(p, "onBeforeInput"), 0 < p.length && (h = new Tp("onBeforeInput", "beforeinput", null, n, h), x.push({ event: h, listeners: p }), h.data = m));
    }
    lv(x, t);
  });
}
function ri(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function Vo(e, t) {
  for (var n = t + "Capture", r = []; e !== null; ) {
    var s = e, i = s.stateNode;
    s.tag === 5 && i !== null && (s = i, i = Qa(e, n), i != null && r.unshift(ri(e, i, s)), i = Qa(e, t), i != null && r.push(ri(e, i, s))), e = e.return;
  }
  return r;
}
function xs(e) {
  if (e === null) return null;
  do
    e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function Hp(e, t, n, r, s) {
  for (var i = t._reactName, o = []; n !== null && n !== r; ) {
    var c = n, u = c.alternate, p = c.stateNode;
    if (u !== null && u === r) break;
    c.tag === 5 && p !== null && (c = p, s ? (u = Qa(n, i), u != null && o.unshift(ri(n, u, c))) : s || (u = Qa(n, i), u != null && o.push(ri(n, u, c)))), n = n.return;
  }
  o.length !== 0 && e.push({ event: t, listeners: o });
}
var Hk = /\r\n?/g, Fk = /\u0000|\uFFFD/g;
function Fp(e) {
  return (typeof e == "string" ? e : "" + e).replace(Hk, `
`).replace(Fk, "");
}
function to(e, t, n) {
  if (t = Fp(t), Fp(e) !== t && n) throw Error(K(425));
}
function Ko() {
}
var wu = null, Su = null;
function ku(e, t) {
  return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
}
var Nu = typeof setTimeout == "function" ? setTimeout : void 0, Uk = typeof clearTimeout == "function" ? clearTimeout : void 0, Up = typeof Promise == "function" ? Promise : void 0, Wk = typeof queueMicrotask == "function" ? queueMicrotask : typeof Up < "u" ? function(e) {
  return Up.resolve(null).then(e).catch(Gk);
} : Nu;
function Gk(e) {
  setTimeout(function() {
    throw e;
  });
}
function mc(e, t) {
  var n = t, r = 0;
  do {
    var s = n.nextSibling;
    if (e.removeChild(n), s && s.nodeType === 8) if (n = s.data, n === "/$") {
      if (r === 0) {
        e.removeChild(s), Ja(t);
        return;
      }
      r--;
    } else n !== "$" && n !== "$?" && n !== "$!" || r++;
    n = s;
  } while (n);
  Ja(t);
}
function jr(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (t = e.data, t === "$" || t === "$!" || t === "$?") break;
      if (t === "/$") return null;
    }
  }
  return e;
}
function Wp(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (t === 0) return e;
        t--;
      } else n === "/$" && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var sa = Math.random().toString(36).slice(2), Ln = "__reactFiber$" + sa, si = "__reactProps$" + sa, rr = "__reactContainer$" + sa, ju = "__reactEvents$" + sa, Vk = "__reactListeners$" + sa, Kk = "__reactHandles$" + sa;
function Qr(e) {
  var t = e[Ln];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if (t = n[rr] || n[Ln]) {
      if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = Wp(e); e !== null; ) {
        if (n = e[Ln]) return n;
        e = Wp(e);
      }
      return t;
    }
    e = n, n = e.parentNode;
  }
  return null;
}
function Si(e) {
  return e = e[Ln] || e[rr], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
}
function As(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(K(33));
}
function yl(e) {
  return e[si] || null;
}
var Eu = [], Ps = -1;
function Or(e) {
  return { current: e };
}
function De(e) {
  0 > Ps || (e.current = Eu[Ps], Eu[Ps] = null, Ps--);
}
function Ae(e, t) {
  Ps++, Eu[Ps] = e.current, e.current = t;
}
var Rr = {}, St = Or(Rr), Mt = Or(!1), ss = Rr;
function qs(e, t) {
  var n = e.type.contextTypes;
  if (!n) return Rr;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
  var s = {}, i;
  for (i in n) s[i] = t[i];
  return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = s), s;
}
function Dt(e) {
  return e = e.childContextTypes, e != null;
}
function qo() {
  De(Mt), De(St);
}
function Gp(e, t, n) {
  if (St.current !== Rr) throw Error(K(168));
  Ae(St, t), Ae(Mt, n);
}
function uv(e, t, n) {
  var r = e.stateNode;
  if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
  r = r.getChildContext();
  for (var s in r) if (!(s in t)) throw Error(K(108, AS(e) || "Unknown", s));
  return Fe({}, n, r);
}
function Yo(e) {
  return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Rr, ss = St.current, Ae(St, e), Ae(Mt, Mt.current), !0;
}
function Vp(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(K(169));
  n ? (e = uv(e, t, ss), r.__reactInternalMemoizedMergedChildContext = e, De(Mt), De(St), Ae(St, e)) : De(Mt), Ae(Mt, n);
}
var Qn = null, xl = !1, hc = !1;
function dv(e) {
  Qn === null ? Qn = [e] : Qn.push(e);
}
function qk(e) {
  xl = !0, dv(e);
}
function Lr() {
  if (!hc && Qn !== null) {
    hc = !0;
    var e = 0, t = Ce;
    try {
      var n = Qn;
      for (Ce = 1; e < n.length; e++) {
        var r = n[e];
        do
          r = r(!0);
        while (r !== null);
      }
      Qn = null, xl = !1;
    } catch (s) {
      throw Qn !== null && (Qn = Qn.slice(e + 1)), Og(Ad, Lr), s;
    } finally {
      Ce = t, hc = !1;
    }
  }
  return null;
}
var Rs = [], Ms = 0, Qo = null, Xo = 0, Zt = [], Jt = 0, as = null, Xn = 1, Zn = "";
function qr(e, t) {
  Rs[Ms++] = Xo, Rs[Ms++] = Qo, Qo = e, Xo = t;
}
function fv(e, t, n) {
  Zt[Jt++] = Xn, Zt[Jt++] = Zn, Zt[Jt++] = as, as = e;
  var r = Xn;
  e = Zn;
  var s = 32 - xn(r) - 1;
  r &= ~(1 << s), n += 1;
  var i = 32 - xn(t) + s;
  if (30 < i) {
    var o = s - s % 5;
    i = (r & (1 << o) - 1).toString(32), r >>= o, s -= o, Xn = 1 << 32 - xn(t) + s | n << s | r, Zn = i + e;
  } else Xn = 1 << i | n << s | r, Zn = e;
}
function $d(e) {
  e.return !== null && (qr(e, 1), fv(e, 1, 0));
}
function Hd(e) {
  for (; e === Qo; ) Qo = Rs[--Ms], Rs[Ms] = null, Xo = Rs[--Ms], Rs[Ms] = null;
  for (; e === as; ) as = Zt[--Jt], Zt[Jt] = null, Zn = Zt[--Jt], Zt[Jt] = null, Xn = Zt[--Jt], Zt[Jt] = null;
}
var Ft = null, Ht = null, Be = !1, _n = null;
function pv(e, t) {
  var n = tn(5, null, null, 0);
  n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
}
function Kp(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, Ft = e, Ht = jr(t.firstChild), !0) : !1;
    case 6:
      return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, Ft = e, Ht = null, !0) : !1;
    case 13:
      return t = t.nodeType !== 8 ? null : t, t !== null ? (n = as !== null ? { id: Xn, overflow: Zn } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = tn(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, Ft = e, Ht = null, !0) : !1;
    default:
      return !1;
  }
}
function Cu(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function Tu(e) {
  if (Be) {
    var t = Ht;
    if (t) {
      var n = t;
      if (!Kp(e, t)) {
        if (Cu(e)) throw Error(K(418));
        t = jr(n.nextSibling);
        var r = Ft;
        t && Kp(e, t) ? pv(r, n) : (e.flags = e.flags & -4097 | 2, Be = !1, Ft = e);
      }
    } else {
      if (Cu(e)) throw Error(K(418));
      e.flags = e.flags & -4097 | 2, Be = !1, Ft = e;
    }
  }
}
function qp(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
  Ft = e;
}
function no(e) {
  if (e !== Ft) return !1;
  if (!Be) return qp(e), Be = !0, !1;
  var t;
  if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !ku(e.type, e.memoizedProps)), t && (t = Ht)) {
    if (Cu(e)) throw mv(), Error(K(418));
    for (; t; ) pv(e, t), t = jr(t.nextSibling);
  }
  if (qp(e), e.tag === 13) {
    if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(K(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              Ht = jr(e.nextSibling);
              break e;
            }
            t--;
          } else n !== "$" && n !== "$!" && n !== "$?" || t++;
        }
        e = e.nextSibling;
      }
      Ht = null;
    }
  } else Ht = Ft ? jr(e.stateNode.nextSibling) : null;
  return !0;
}
function mv() {
  for (var e = Ht; e; ) e = jr(e.nextSibling);
}
function Ys() {
  Ht = Ft = null, Be = !1;
}
function Fd(e) {
  _n === null ? _n = [e] : _n.push(e);
}
var Yk = ir.ReactCurrentBatchConfig;
function xa(e, t, n) {
  if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
    if (n._owner) {
      if (n = n._owner, n) {
        if (n.tag !== 1) throw Error(K(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(K(147, e));
      var s = r, i = "" + e;
      return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === i ? t.ref : (t = function(o) {
        var c = s.refs;
        o === null ? delete c[i] : c[i] = o;
      }, t._stringRef = i, t);
    }
    if (typeof e != "string") throw Error(K(284));
    if (!n._owner) throw Error(K(290, e));
  }
  return e;
}
function ro(e, t) {
  throw e = Object.prototype.toString.call(t), Error(K(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
}
function Yp(e) {
  var t = e._init;
  return t(e._payload);
}
function hv(e) {
  function t(y, b) {
    if (e) {
      var N = y.deletions;
      N === null ? (y.deletions = [b], y.flags |= 16) : N.push(b);
    }
  }
  function n(y, b) {
    if (!e) return null;
    for (; b !== null; ) t(y, b), b = b.sibling;
    return null;
  }
  function r(y, b) {
    for (y = /* @__PURE__ */ new Map(); b !== null; ) b.key !== null ? y.set(b.key, b) : y.set(b.index, b), b = b.sibling;
    return y;
  }
  function s(y, b) {
    return y = Ir(y, b), y.index = 0, y.sibling = null, y;
  }
  function i(y, b, N) {
    return y.index = N, e ? (N = y.alternate, N !== null ? (N = N.index, N < b ? (y.flags |= 2, b) : N) : (y.flags |= 2, b)) : (y.flags |= 1048576, b);
  }
  function o(y) {
    return e && y.alternate === null && (y.flags |= 2), y;
  }
  function c(y, b, N, l) {
    return b === null || b.tag !== 6 ? (b = wc(N, y.mode, l), b.return = y, b) : (b = s(b, N), b.return = y, b);
  }
  function u(y, b, N, l) {
    var d = N.type;
    return d === Es ? h(y, b, N.props.children, l, N.key) : b !== null && (b.elementType === d || typeof d == "object" && d !== null && d.$$typeof === mr && Yp(d) === b.type) ? (l = s(b, N.props), l.ref = xa(y, b, N), l.return = y, l) : (l = Co(N.type, N.key, N.props, null, y.mode, l), l.ref = xa(y, b, N), l.return = y, l);
  }
  function p(y, b, N, l) {
    return b === null || b.tag !== 4 || b.stateNode.containerInfo !== N.containerInfo || b.stateNode.implementation !== N.implementation ? (b = Sc(N, y.mode, l), b.return = y, b) : (b = s(b, N.children || []), b.return = y, b);
  }
  function h(y, b, N, l, d) {
    return b === null || b.tag !== 7 ? (b = rs(N, y.mode, l, d), b.return = y, b) : (b = s(b, N), b.return = y, b);
  }
  function x(y, b, N) {
    if (typeof b == "string" && b !== "" || typeof b == "number") return b = wc("" + b, y.mode, N), b.return = y, b;
    if (typeof b == "object" && b !== null) {
      switch (b.$$typeof) {
        case Vi:
          return N = Co(b.type, b.key, b.props, null, y.mode, N), N.ref = xa(y, null, b), N.return = y, N;
        case js:
          return b = Sc(b, y.mode, N), b.return = y, b;
        case mr:
          var l = b._init;
          return x(y, l(b._payload), N);
      }
      if (ja(b) || ha(b)) return b = rs(b, y.mode, N, null), b.return = y, b;
      ro(y, b);
    }
    return null;
  }
  function g(y, b, N, l) {
    var d = b !== null ? b.key : null;
    if (typeof N == "string" && N !== "" || typeof N == "number") return d !== null ? null : c(y, b, "" + N, l);
    if (typeof N == "object" && N !== null) {
      switch (N.$$typeof) {
        case Vi:
          return N.key === d ? u(y, b, N, l) : null;
        case js:
          return N.key === d ? p(y, b, N, l) : null;
        case mr:
          return d = N._init, g(
            y,
            b,
            d(N._payload),
            l
          );
      }
      if (ja(N) || ha(N)) return d !== null ? null : h(y, b, N, l, null);
      ro(y, N);
    }
    return null;
  }
  function w(y, b, N, l, d) {
    if (typeof l == "string" && l !== "" || typeof l == "number") return y = y.get(N) || null, c(b, y, "" + l, d);
    if (typeof l == "object" && l !== null) {
      switch (l.$$typeof) {
        case Vi:
          return y = y.get(l.key === null ? N : l.key) || null, u(b, y, l, d);
        case js:
          return y = y.get(l.key === null ? N : l.key) || null, p(b, y, l, d);
        case mr:
          var f = l._init;
          return w(y, b, N, f(l._payload), d);
      }
      if (ja(l) || ha(l)) return y = y.get(N) || null, h(b, y, l, d, null);
      ro(b, l);
    }
    return null;
  }
  function E(y, b, N, l) {
    for (var d = null, f = null, m = b, v = b = 0, k = null; m !== null && v < N.length; v++) {
      m.index > v ? (k = m, m = null) : k = m.sibling;
      var S = g(y, m, N[v], l);
      if (S === null) {
        m === null && (m = k);
        break;
      }
      e && m && S.alternate === null && t(y, m), b = i(S, b, v), f === null ? d = S : f.sibling = S, f = S, m = k;
    }
    if (v === N.length) return n(y, m), Be && qr(y, v), d;
    if (m === null) {
      for (; v < N.length; v++) m = x(y, N[v], l), m !== null && (b = i(m, b, v), f === null ? d = m : f.sibling = m, f = m);
      return Be && qr(y, v), d;
    }
    for (m = r(y, m); v < N.length; v++) k = w(m, y, v, N[v], l), k !== null && (e && k.alternate !== null && m.delete(k.key === null ? v : k.key), b = i(k, b, v), f === null ? d = k : f.sibling = k, f = k);
    return e && m.forEach(function(C) {
      return t(y, C);
    }), Be && qr(y, v), d;
  }
  function I(y, b, N, l) {
    var d = ha(N);
    if (typeof d != "function") throw Error(K(150));
    if (N = d.call(N), N == null) throw Error(K(151));
    for (var f = d = null, m = b, v = b = 0, k = null, S = N.next(); m !== null && !S.done; v++, S = N.next()) {
      m.index > v ? (k = m, m = null) : k = m.sibling;
      var C = g(y, m, S.value, l);
      if (C === null) {
        m === null && (m = k);
        break;
      }
      e && m && C.alternate === null && t(y, m), b = i(C, b, v), f === null ? d = C : f.sibling = C, f = C, m = k;
    }
    if (S.done) return n(
      y,
      m
    ), Be && qr(y, v), d;
    if (m === null) {
      for (; !S.done; v++, S = N.next()) S = x(y, S.value, l), S !== null && (b = i(S, b, v), f === null ? d = S : f.sibling = S, f = S);
      return Be && qr(y, v), d;
    }
    for (m = r(y, m); !S.done; v++, S = N.next()) S = w(m, y, v, S.value, l), S !== null && (e && S.alternate !== null && m.delete(S.key === null ? v : S.key), b = i(S, b, v), f === null ? d = S : f.sibling = S, f = S);
    return e && m.forEach(function(L) {
      return t(y, L);
    }), Be && qr(y, v), d;
  }
  function D(y, b, N, l) {
    if (typeof N == "object" && N !== null && N.type === Es && N.key === null && (N = N.props.children), typeof N == "object" && N !== null) {
      switch (N.$$typeof) {
        case Vi:
          e: {
            for (var d = N.key, f = b; f !== null; ) {
              if (f.key === d) {
                if (d = N.type, d === Es) {
                  if (f.tag === 7) {
                    n(y, f.sibling), b = s(f, N.props.children), b.return = y, y = b;
                    break e;
                  }
                } else if (f.elementType === d || typeof d == "object" && d !== null && d.$$typeof === mr && Yp(d) === f.type) {
                  n(y, f.sibling), b = s(f, N.props), b.ref = xa(y, f, N), b.return = y, y = b;
                  break e;
                }
                n(y, f);
                break;
              } else t(y, f);
              f = f.sibling;
            }
            N.type === Es ? (b = rs(N.props.children, y.mode, l, N.key), b.return = y, y = b) : (l = Co(N.type, N.key, N.props, null, y.mode, l), l.ref = xa(y, b, N), l.return = y, y = l);
          }
          return o(y);
        case js:
          e: {
            for (f = N.key; b !== null; ) {
              if (b.key === f) if (b.tag === 4 && b.stateNode.containerInfo === N.containerInfo && b.stateNode.implementation === N.implementation) {
                n(y, b.sibling), b = s(b, N.children || []), b.return = y, y = b;
                break e;
              } else {
                n(y, b);
                break;
              }
              else t(y, b);
              b = b.sibling;
            }
            b = Sc(N, y.mode, l), b.return = y, y = b;
          }
          return o(y);
        case mr:
          return f = N._init, D(y, b, f(N._payload), l);
      }
      if (ja(N)) return E(y, b, N, l);
      if (ha(N)) return I(y, b, N, l);
      ro(y, N);
    }
    return typeof N == "string" && N !== "" || typeof N == "number" ? (N = "" + N, b !== null && b.tag === 6 ? (n(y, b.sibling), b = s(b, N), b.return = y, y = b) : (n(y, b), b = wc(N, y.mode, l), b.return = y, y = b), o(y)) : n(y, b);
  }
  return D;
}
var Qs = hv(!0), gv = hv(!1), Zo = Or(null), Jo = null, Ds = null, Ud = null;
function Wd() {
  Ud = Ds = Jo = null;
}
function Gd(e) {
  var t = Zo.current;
  De(Zo), e._currentValue = t;
}
function Iu(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate;
    if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
    e = e.return;
  }
}
function Fs(e, t) {
  Jo = e, Ud = Ds = null, e = e.dependencies, e !== null && e.firstContext !== null && (e.lanes & t && (Rt = !0), e.firstContext = null);
}
function an(e) {
  var t = e._currentValue;
  if (Ud !== e) if (e = { context: e, memoizedValue: t, next: null }, Ds === null) {
    if (Jo === null) throw Error(K(308));
    Ds = e, Jo.dependencies = { lanes: 0, firstContext: e };
  } else Ds = Ds.next = e;
  return t;
}
var Xr = null;
function Vd(e) {
  Xr === null ? Xr = [e] : Xr.push(e);
}
function vv(e, t, n, r) {
  var s = t.interleaved;
  return s === null ? (n.next = n, Vd(t)) : (n.next = s.next, s.next = n), t.interleaved = n, sr(e, r);
}
function sr(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
  return n.tag === 3 ? n.stateNode : null;
}
var hr = !1;
function Kd(e) {
  e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function _v(e, t) {
  e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
}
function tr(e, t) {
  return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
}
function Er(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (r = r.shared, ke & 2) {
    var s = r.pending;
    return s === null ? t.next = t : (t.next = s.next, s.next = t), r.pending = t, sr(e, n);
  }
  return s = r.interleaved, s === null ? (t.next = t, Vd(r)) : (t.next = s.next, s.next = t), r.interleaved = t, sr(e, n);
}
function wo(e, t, n) {
  if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
    var r = t.lanes;
    r &= e.pendingLanes, n |= r, t.lanes = n, Pd(e, n);
  }
}
function Qp(e, t) {
  var n = e.updateQueue, r = e.alternate;
  if (r !== null && (r = r.updateQueue, n === r)) {
    var s = null, i = null;
    if (n = n.firstBaseUpdate, n !== null) {
      do {
        var o = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
        i === null ? s = i = o : i = i.next = o, n = n.next;
      } while (n !== null);
      i === null ? s = i = t : i = i.next = t;
    } else s = i = t;
    n = { baseState: r.baseState, firstBaseUpdate: s, lastBaseUpdate: i, shared: r.shared, effects: r.effects }, e.updateQueue = n;
    return;
  }
  e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
}
function el(e, t, n, r) {
  var s = e.updateQueue;
  hr = !1;
  var i = s.firstBaseUpdate, o = s.lastBaseUpdate, c = s.shared.pending;
  if (c !== null) {
    s.shared.pending = null;
    var u = c, p = u.next;
    u.next = null, o === null ? i = p : o.next = p, o = u;
    var h = e.alternate;
    h !== null && (h = h.updateQueue, c = h.lastBaseUpdate, c !== o && (c === null ? h.firstBaseUpdate = p : c.next = p, h.lastBaseUpdate = u));
  }
  if (i !== null) {
    var x = s.baseState;
    o = 0, h = p = u = null, c = i;
    do {
      var g = c.lane, w = c.eventTime;
      if ((r & g) === g) {
        h !== null && (h = h.next = {
          eventTime: w,
          lane: 0,
          tag: c.tag,
          payload: c.payload,
          callback: c.callback,
          next: null
        });
        e: {
          var E = e, I = c;
          switch (g = t, w = n, I.tag) {
            case 1:
              if (E = I.payload, typeof E == "function") {
                x = E.call(w, x, g);
                break e;
              }
              x = E;
              break e;
            case 3:
              E.flags = E.flags & -65537 | 128;
            case 0:
              if (E = I.payload, g = typeof E == "function" ? E.call(w, x, g) : E, g == null) break e;
              x = Fe({}, x, g);
              break e;
            case 2:
              hr = !0;
          }
        }
        c.callback !== null && c.lane !== 0 && (e.flags |= 64, g = s.effects, g === null ? s.effects = [c] : g.push(c));
      } else w = { eventTime: w, lane: g, tag: c.tag, payload: c.payload, callback: c.callback, next: null }, h === null ? (p = h = w, u = x) : h = h.next = w, o |= g;
      if (c = c.next, c === null) {
        if (c = s.shared.pending, c === null) break;
        g = c, c = g.next, g.next = null, s.lastBaseUpdate = g, s.shared.pending = null;
      }
    } while (!0);
    if (h === null && (u = x), s.baseState = u, s.firstBaseUpdate = p, s.lastBaseUpdate = h, t = s.shared.interleaved, t !== null) {
      s = t;
      do
        o |= s.lane, s = s.next;
      while (s !== t);
    } else i === null && (s.shared.lanes = 0);
    os |= o, e.lanes = o, e.memoizedState = x;
  }
}
function Xp(e, t, n) {
  if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
    var r = e[t], s = r.callback;
    if (s !== null) {
      if (r.callback = null, r = n, typeof s != "function") throw Error(K(191, s));
      s.call(r);
    }
  }
}
var ki = {}, $n = Or(ki), ai = Or(ki), ii = Or(ki);
function Zr(e) {
  if (e === ki) throw Error(K(174));
  return e;
}
function qd(e, t) {
  switch (Ae(ii, t), Ae(ai, e), Ae($n, ki), e = t.nodeType, e) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : uu(null, "");
      break;
    default:
      e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = uu(t, e);
  }
  De($n), Ae($n, t);
}
function Xs() {
  De($n), De(ai), De(ii);
}
function yv(e) {
  Zr(ii.current);
  var t = Zr($n.current), n = uu(t, e.type);
  t !== n && (Ae(ai, e), Ae($n, n));
}
function Yd(e) {
  ai.current === e && (De($n), De(ai));
}
var $e = Or(0);
function tl(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (n !== null && (n = n.dehydrated, n === null || n.data === "$?" || n.data === "$!")) return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.flags & 128) return t;
    } else if (t.child !== null) {
      t.child.return = t, t = t.child;
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    t.sibling.return = t.return, t = t.sibling;
  }
  return null;
}
var gc = [];
function Qd() {
  for (var e = 0; e < gc.length; e++) gc[e]._workInProgressVersionPrimary = null;
  gc.length = 0;
}
var So = ir.ReactCurrentDispatcher, vc = ir.ReactCurrentBatchConfig, is = 0, He = null, Qe = null, st = null, nl = !1, Ba = !1, oi = 0, Qk = 0;
function ht() {
  throw Error(K(321));
}
function Xd(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++) if (!Sn(e[n], t[n])) return !1;
  return !0;
}
function Zd(e, t, n, r, s, i) {
  if (is = i, He = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, So.current = e === null || e.memoizedState === null ? eN : tN, e = n(r, s), Ba) {
    i = 0;
    do {
      if (Ba = !1, oi = 0, 25 <= i) throw Error(K(301));
      i += 1, st = Qe = null, t.updateQueue = null, So.current = nN, e = n(r, s);
    } while (Ba);
  }
  if (So.current = rl, t = Qe !== null && Qe.next !== null, is = 0, st = Qe = He = null, nl = !1, t) throw Error(K(300));
  return e;
}
function Jd() {
  var e = oi !== 0;
  return oi = 0, e;
}
function Dn() {
  var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  return st === null ? He.memoizedState = st = e : st = st.next = e, st;
}
function on() {
  if (Qe === null) {
    var e = He.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = Qe.next;
  var t = st === null ? He.memoizedState : st.next;
  if (t !== null) st = t, Qe = e;
  else {
    if (e === null) throw Error(K(310));
    Qe = e, e = { memoizedState: Qe.memoizedState, baseState: Qe.baseState, baseQueue: Qe.baseQueue, queue: Qe.queue, next: null }, st === null ? He.memoizedState = st = e : st = st.next = e;
  }
  return st;
}
function li(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function _c(e) {
  var t = on(), n = t.queue;
  if (n === null) throw Error(K(311));
  n.lastRenderedReducer = e;
  var r = Qe, s = r.baseQueue, i = n.pending;
  if (i !== null) {
    if (s !== null) {
      var o = s.next;
      s.next = i.next, i.next = o;
    }
    r.baseQueue = s = i, n.pending = null;
  }
  if (s !== null) {
    i = s.next, r = r.baseState;
    var c = o = null, u = null, p = i;
    do {
      var h = p.lane;
      if ((is & h) === h) u !== null && (u = u.next = { lane: 0, action: p.action, hasEagerState: p.hasEagerState, eagerState: p.eagerState, next: null }), r = p.hasEagerState ? p.eagerState : e(r, p.action);
      else {
        var x = {
          lane: h,
          action: p.action,
          hasEagerState: p.hasEagerState,
          eagerState: p.eagerState,
          next: null
        };
        u === null ? (c = u = x, o = r) : u = u.next = x, He.lanes |= h, os |= h;
      }
      p = p.next;
    } while (p !== null && p !== i);
    u === null ? o = r : u.next = c, Sn(r, t.memoizedState) || (Rt = !0), t.memoizedState = r, t.baseState = o, t.baseQueue = u, n.lastRenderedState = r;
  }
  if (e = n.interleaved, e !== null) {
    s = e;
    do
      i = s.lane, He.lanes |= i, os |= i, s = s.next;
    while (s !== e);
  } else s === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function yc(e) {
  var t = on(), n = t.queue;
  if (n === null) throw Error(K(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch, s = n.pending, i = t.memoizedState;
  if (s !== null) {
    n.pending = null;
    var o = s = s.next;
    do
      i = e(i, o.action), o = o.next;
    while (o !== s);
    Sn(i, t.memoizedState) || (Rt = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), n.lastRenderedState = i;
  }
  return [i, r];
}
function xv() {
}
function bv(e, t) {
  var n = He, r = on(), s = t(), i = !Sn(r.memoizedState, s);
  if (i && (r.memoizedState = s, Rt = !0), r = r.queue, ef(kv.bind(null, n, r, e), [e]), r.getSnapshot !== t || i || st !== null && st.memoizedState.tag & 1) {
    if (n.flags |= 2048, ci(9, Sv.bind(null, n, r, s, t), void 0, null), at === null) throw Error(K(349));
    is & 30 || wv(n, t, s);
  }
  return s;
}
function wv(e, t, n) {
  e.flags |= 16384, e = { getSnapshot: t, value: n }, t = He.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, He.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
}
function Sv(e, t, n, r) {
  t.value = n, t.getSnapshot = r, Nv(t) && jv(e);
}
function kv(e, t, n) {
  return n(function() {
    Nv(t) && jv(e);
  });
}
function Nv(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !Sn(e, n);
  } catch {
    return !0;
  }
}
function jv(e) {
  var t = sr(e, 1);
  t !== null && bn(t, e, 1, -1);
}
function Zp(e) {
  var t = Dn();
  return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: li, lastRenderedState: e }, t.queue = e, e = e.dispatch = Jk.bind(null, He, e), [t.memoizedState, e];
}
function ci(e, t, n, r) {
  return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = He.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, He.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
}
function Ev() {
  return on().memoizedState;
}
function ko(e, t, n, r) {
  var s = Dn();
  He.flags |= e, s.memoizedState = ci(1 | t, n, void 0, r === void 0 ? null : r);
}
function bl(e, t, n, r) {
  var s = on();
  r = r === void 0 ? null : r;
  var i = void 0;
  if (Qe !== null) {
    var o = Qe.memoizedState;
    if (i = o.destroy, r !== null && Xd(r, o.deps)) {
      s.memoizedState = ci(t, n, i, r);
      return;
    }
  }
  He.flags |= e, s.memoizedState = ci(1 | t, n, i, r);
}
function Jp(e, t) {
  return ko(8390656, 8, e, t);
}
function ef(e, t) {
  return bl(2048, 8, e, t);
}
function Cv(e, t) {
  return bl(4, 2, e, t);
}
function Tv(e, t) {
  return bl(4, 4, e, t);
}
function Iv(e, t) {
  if (typeof t == "function") return e = e(), t(e), function() {
    t(null);
  };
  if (t != null) return e = e(), t.current = e, function() {
    t.current = null;
  };
}
function Av(e, t, n) {
  return n = n != null ? n.concat([e]) : null, bl(4, 4, Iv.bind(null, t, e), n);
}
function tf() {
}
function Pv(e, t) {
  var n = on();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Xd(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
}
function Rv(e, t) {
  var n = on();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Xd(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
}
function Mv(e, t, n) {
  return is & 21 ? (Sn(n, t) || (n = Bg(), He.lanes |= n, os |= n, e.baseState = !0), t) : (e.baseState && (e.baseState = !1, Rt = !0), e.memoizedState = n);
}
function Xk(e, t) {
  var n = Ce;
  Ce = n !== 0 && 4 > n ? n : 4, e(!0);
  var r = vc.transition;
  vc.transition = {};
  try {
    e(!1), t();
  } finally {
    Ce = n, vc.transition = r;
  }
}
function Dv() {
  return on().memoizedState;
}
function Zk(e, t, n) {
  var r = Tr(e);
  if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Ov(e)) Lv(t, n);
  else if (n = vv(e, t, n, r), n !== null) {
    var s = jt();
    bn(n, e, r, s), zv(n, t, r);
  }
}
function Jk(e, t, n) {
  var r = Tr(e), s = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (Ov(e)) Lv(t, s);
  else {
    var i = e.alternate;
    if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null)) try {
      var o = t.lastRenderedState, c = i(o, n);
      if (s.hasEagerState = !0, s.eagerState = c, Sn(c, o)) {
        var u = t.interleaved;
        u === null ? (s.next = s, Vd(t)) : (s.next = u.next, u.next = s), t.interleaved = s;
        return;
      }
    } catch {
    } finally {
    }
    n = vv(e, t, s, r), n !== null && (s = jt(), bn(n, e, r, s), zv(n, t, r));
  }
}
function Ov(e) {
  var t = e.alternate;
  return e === He || t !== null && t === He;
}
function Lv(e, t) {
  Ba = nl = !0;
  var n = e.pending;
  n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
}
function zv(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes;
    r &= e.pendingLanes, n |= r, t.lanes = n, Pd(e, n);
  }
}
var rl = { readContext: an, useCallback: ht, useContext: ht, useEffect: ht, useImperativeHandle: ht, useInsertionEffect: ht, useLayoutEffect: ht, useMemo: ht, useReducer: ht, useRef: ht, useState: ht, useDebugValue: ht, useDeferredValue: ht, useTransition: ht, useMutableSource: ht, useSyncExternalStore: ht, useId: ht, unstable_isNewReconciler: !1 }, eN = { readContext: an, useCallback: function(e, t) {
  return Dn().memoizedState = [e, t === void 0 ? null : t], e;
}, useContext: an, useEffect: Jp, useImperativeHandle: function(e, t, n) {
  return n = n != null ? n.concat([e]) : null, ko(
    4194308,
    4,
    Iv.bind(null, t, e),
    n
  );
}, useLayoutEffect: function(e, t) {
  return ko(4194308, 4, e, t);
}, useInsertionEffect: function(e, t) {
  return ko(4, 2, e, t);
}, useMemo: function(e, t) {
  var n = Dn();
  return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
}, useReducer: function(e, t, n) {
  var r = Dn();
  return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = Zk.bind(null, He, e), [r.memoizedState, e];
}, useRef: function(e) {
  var t = Dn();
  return e = { current: e }, t.memoizedState = e;
}, useState: Zp, useDebugValue: tf, useDeferredValue: function(e) {
  return Dn().memoizedState = e;
}, useTransition: function() {
  var e = Zp(!1), t = e[0];
  return e = Xk.bind(null, e[1]), Dn().memoizedState = e, [t, e];
}, useMutableSource: function() {
}, useSyncExternalStore: function(e, t, n) {
  var r = He, s = Dn();
  if (Be) {
    if (n === void 0) throw Error(K(407));
    n = n();
  } else {
    if (n = t(), at === null) throw Error(K(349));
    is & 30 || wv(r, t, n);
  }
  s.memoizedState = n;
  var i = { value: n, getSnapshot: t };
  return s.queue = i, Jp(kv.bind(
    null,
    r,
    i,
    e
  ), [e]), r.flags |= 2048, ci(9, Sv.bind(null, r, i, n, t), void 0, null), n;
}, useId: function() {
  var e = Dn(), t = at.identifierPrefix;
  if (Be) {
    var n = Zn, r = Xn;
    n = (r & ~(1 << 32 - xn(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = oi++, 0 < n && (t += "H" + n.toString(32)), t += ":";
  } else n = Qk++, t = ":" + t + "r" + n.toString(32) + ":";
  return e.memoizedState = t;
}, unstable_isNewReconciler: !1 }, tN = {
  readContext: an,
  useCallback: Pv,
  useContext: an,
  useEffect: ef,
  useImperativeHandle: Av,
  useInsertionEffect: Cv,
  useLayoutEffect: Tv,
  useMemo: Rv,
  useReducer: _c,
  useRef: Ev,
  useState: function() {
    return _c(li);
  },
  useDebugValue: tf,
  useDeferredValue: function(e) {
    var t = on();
    return Mv(t, Qe.memoizedState, e);
  },
  useTransition: function() {
    var e = _c(li)[0], t = on().memoizedState;
    return [e, t];
  },
  useMutableSource: xv,
  useSyncExternalStore: bv,
  useId: Dv,
  unstable_isNewReconciler: !1
}, nN = { readContext: an, useCallback: Pv, useContext: an, useEffect: ef, useImperativeHandle: Av, useInsertionEffect: Cv, useLayoutEffect: Tv, useMemo: Rv, useReducer: yc, useRef: Ev, useState: function() {
  return yc(li);
}, useDebugValue: tf, useDeferredValue: function(e) {
  var t = on();
  return Qe === null ? t.memoizedState = e : Mv(t, Qe.memoizedState, e);
}, useTransition: function() {
  var e = yc(li)[0], t = on().memoizedState;
  return [e, t];
}, useMutableSource: xv, useSyncExternalStore: bv, useId: Dv, unstable_isNewReconciler: !1 };
function gn(e, t) {
  if (e && e.defaultProps) {
    t = Fe({}, t), e = e.defaultProps;
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
function Au(e, t, n, r) {
  t = e.memoizedState, n = n(r, t), n = n == null ? t : Fe({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
}
var wl = { isMounted: function(e) {
  return (e = e._reactInternals) ? ds(e) === e : !1;
}, enqueueSetState: function(e, t, n) {
  e = e._reactInternals;
  var r = jt(), s = Tr(e), i = tr(r, s);
  i.payload = t, n != null && (i.callback = n), t = Er(e, i, s), t !== null && (bn(t, e, s, r), wo(t, e, s));
}, enqueueReplaceState: function(e, t, n) {
  e = e._reactInternals;
  var r = jt(), s = Tr(e), i = tr(r, s);
  i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Er(e, i, s), t !== null && (bn(t, e, s, r), wo(t, e, s));
}, enqueueForceUpdate: function(e, t) {
  e = e._reactInternals;
  var n = jt(), r = Tr(e), s = tr(n, r);
  s.tag = 2, t != null && (s.callback = t), t = Er(e, s, r), t !== null && (bn(t, e, r, n), wo(t, e, r));
} };
function em(e, t, n, r, s, i, o) {
  return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, o) : t.prototype && t.prototype.isPureReactComponent ? !ti(n, r) || !ti(s, i) : !0;
}
function Bv(e, t, n) {
  var r = !1, s = Rr, i = t.contextType;
  return typeof i == "object" && i !== null ? i = an(i) : (s = Dt(t) ? ss : St.current, r = t.contextTypes, i = (r = r != null) ? qs(e, s) : Rr), t = new t(n, i), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = wl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = s, e.__reactInternalMemoizedMaskedChildContext = i), t;
}
function tm(e, t, n, r) {
  e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && wl.enqueueReplaceState(t, t.state, null);
}
function Pu(e, t, n, r) {
  var s = e.stateNode;
  s.props = n, s.state = e.memoizedState, s.refs = {}, Kd(e);
  var i = t.contextType;
  typeof i == "object" && i !== null ? s.context = an(i) : (i = Dt(t) ? ss : St.current, s.context = qs(e, i)), s.state = e.memoizedState, i = t.getDerivedStateFromProps, typeof i == "function" && (Au(e, t, i, n), s.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof s.getSnapshotBeforeUpdate == "function" || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (t = s.state, typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount(), t !== s.state && wl.enqueueReplaceState(s, s.state, null), el(e, n, s, r), s.state = e.memoizedState), typeof s.componentDidMount == "function" && (e.flags |= 4194308);
}
function Zs(e, t) {
  try {
    var n = "", r = t;
    do
      n += IS(r), r = r.return;
    while (r);
    var s = n;
  } catch (i) {
    s = `
Error generating stack: ` + i.message + `
` + i.stack;
  }
  return { value: e, source: t, stack: s, digest: null };
}
function xc(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function Ru(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function() {
      throw n;
    });
  }
}
var rN = typeof WeakMap == "function" ? WeakMap : Map;
function $v(e, t, n) {
  n = tr(-1, n), n.tag = 3, n.payload = { element: null };
  var r = t.value;
  return n.callback = function() {
    al || (al = !0, Uu = r), Ru(e, t);
  }, n;
}
function Hv(e, t, n) {
  n = tr(-1, n), n.tag = 3;
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var s = t.value;
    n.payload = function() {
      return r(s);
    }, n.callback = function() {
      Ru(e, t);
    };
  }
  var i = e.stateNode;
  return i !== null && typeof i.componentDidCatch == "function" && (n.callback = function() {
    Ru(e, t), typeof r != "function" && (Cr === null ? Cr = /* @__PURE__ */ new Set([this]) : Cr.add(this));
    var o = t.stack;
    this.componentDidCatch(t.value, { componentStack: o !== null ? o : "" });
  }), n;
}
function nm(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new rN();
    var s = /* @__PURE__ */ new Set();
    r.set(t, s);
  } else s = r.get(t), s === void 0 && (s = /* @__PURE__ */ new Set(), r.set(t, s));
  s.has(n) || (s.add(n), e = vN.bind(null, e, t, n), t.then(e, e));
}
function rm(e) {
  do {
    var t;
    if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function sm(e, t, n, r, s) {
  return e.mode & 1 ? (e.flags |= 65536, e.lanes = s, e) : (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = tr(-1, 1), t.tag = 2, Er(n, t, 1))), n.lanes |= 1), e);
}
var sN = ir.ReactCurrentOwner, Rt = !1;
function Nt(e, t, n, r) {
  t.child = e === null ? gv(t, null, n, r) : Qs(t, e.child, n, r);
}
function am(e, t, n, r, s) {
  n = n.render;
  var i = t.ref;
  return Fs(t, s), r = Zd(e, t, n, r, i, s), n = Jd(), e !== null && !Rt ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~s, ar(e, t, s)) : (Be && n && $d(t), t.flags |= 1, Nt(e, t, r, s), t.child);
}
function im(e, t, n, r, s) {
  if (e === null) {
    var i = n.type;
    return typeof i == "function" && !uf(i) && i.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = i, Fv(e, t, i, r, s)) : (e = Co(n.type, null, r, t, t.mode, s), e.ref = t.ref, e.return = t, t.child = e);
  }
  if (i = e.child, !(e.lanes & s)) {
    var o = i.memoizedProps;
    if (n = n.compare, n = n !== null ? n : ti, n(o, r) && e.ref === t.ref) return ar(e, t, s);
  }
  return t.flags |= 1, e = Ir(i, r), e.ref = t.ref, e.return = t, t.child = e;
}
function Fv(e, t, n, r, s) {
  if (e !== null) {
    var i = e.memoizedProps;
    if (ti(i, r) && e.ref === t.ref) if (Rt = !1, t.pendingProps = r = i, (e.lanes & s) !== 0) e.flags & 131072 && (Rt = !0);
    else return t.lanes = e.lanes, ar(e, t, s);
  }
  return Mu(e, t, n, r, s);
}
function Uv(e, t, n) {
  var r = t.pendingProps, s = r.children, i = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden") if (!(t.mode & 1)) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Ae(Ls, Bt), Bt |= n;
  else {
    if (!(n & 1073741824)) return e = i !== null ? i.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, Ae(Ls, Bt), Bt |= e, null;
    t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : n, Ae(Ls, Bt), Bt |= r;
  }
  else i !== null ? (r = i.baseLanes | n, t.memoizedState = null) : r = n, Ae(Ls, Bt), Bt |= r;
  return Nt(e, t, s, n), t.child;
}
function Wv(e, t) {
  var n = t.ref;
  (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
}
function Mu(e, t, n, r, s) {
  var i = Dt(n) ? ss : St.current;
  return i = qs(t, i), Fs(t, s), n = Zd(e, t, n, r, i, s), r = Jd(), e !== null && !Rt ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~s, ar(e, t, s)) : (Be && r && $d(t), t.flags |= 1, Nt(e, t, n, s), t.child);
}
function om(e, t, n, r, s) {
  if (Dt(n)) {
    var i = !0;
    Yo(t);
  } else i = !1;
  if (Fs(t, s), t.stateNode === null) No(e, t), Bv(t, n, r), Pu(t, n, r, s), r = !0;
  else if (e === null) {
    var o = t.stateNode, c = t.memoizedProps;
    o.props = c;
    var u = o.context, p = n.contextType;
    typeof p == "object" && p !== null ? p = an(p) : (p = Dt(n) ? ss : St.current, p = qs(t, p));
    var h = n.getDerivedStateFromProps, x = typeof h == "function" || typeof o.getSnapshotBeforeUpdate == "function";
    x || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (c !== r || u !== p) && tm(t, o, r, p), hr = !1;
    var g = t.memoizedState;
    o.state = g, el(t, r, o, s), u = t.memoizedState, c !== r || g !== u || Mt.current || hr ? (typeof h == "function" && (Au(t, n, h, r), u = t.memoizedState), (c = hr || em(t, n, c, r, g, u, p)) ? (x || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = u), o.props = r, o.state = u, o.context = p, r = c) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
  } else {
    o = t.stateNode, _v(e, t), c = t.memoizedProps, p = t.type === t.elementType ? c : gn(t.type, c), o.props = p, x = t.pendingProps, g = o.context, u = n.contextType, typeof u == "object" && u !== null ? u = an(u) : (u = Dt(n) ? ss : St.current, u = qs(t, u));
    var w = n.getDerivedStateFromProps;
    (h = typeof w == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (c !== x || g !== u) && tm(t, o, r, u), hr = !1, g = t.memoizedState, o.state = g, el(t, r, o, s);
    var E = t.memoizedState;
    c !== x || g !== E || Mt.current || hr ? (typeof w == "function" && (Au(t, n, w, r), E = t.memoizedState), (p = hr || em(t, n, p, r, g, E, u) || !1) ? (h || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, E, u), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(r, E, u)), typeof o.componentDidUpdate == "function" && (t.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || c === e.memoizedProps && g === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && g === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = E), o.props = r, o.state = E, o.context = u, r = p) : (typeof o.componentDidUpdate != "function" || c === e.memoizedProps && g === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && g === e.memoizedState || (t.flags |= 1024), r = !1);
  }
  return Du(e, t, n, r, i, s);
}
function Du(e, t, n, r, s, i) {
  Wv(e, t);
  var o = (t.flags & 128) !== 0;
  if (!r && !o) return s && Vp(t, n, !1), ar(e, t, i);
  r = t.stateNode, sN.current = t;
  var c = o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return t.flags |= 1, e !== null && o ? (t.child = Qs(t, e.child, null, i), t.child = Qs(t, null, c, i)) : Nt(e, t, c, i), t.memoizedState = r.state, s && Vp(t, n, !0), t.child;
}
function Gv(e) {
  var t = e.stateNode;
  t.pendingContext ? Gp(e, t.pendingContext, t.pendingContext !== t.context) : t.context && Gp(e, t.context, !1), qd(e, t.containerInfo);
}
function lm(e, t, n, r, s) {
  return Ys(), Fd(s), t.flags |= 256, Nt(e, t, n, r), t.child;
}
var Ou = { dehydrated: null, treeContext: null, retryLane: 0 };
function Lu(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function Vv(e, t, n) {
  var r = t.pendingProps, s = $e.current, i = !1, o = (t.flags & 128) !== 0, c;
  if ((c = o) || (c = e !== null && e.memoizedState === null ? !1 : (s & 2) !== 0), c ? (i = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (s |= 1), Ae($e, s & 1), e === null)
    return Tu(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? (t.mode & 1 ? e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824 : t.lanes = 1, null) : (o = r.children, e = r.fallback, i ? (r = t.mode, i = t.child, o = { mode: "hidden", children: o }, !(r & 1) && i !== null ? (i.childLanes = 0, i.pendingProps = o) : i = Nl(o, r, 0, null), e = rs(e, r, n, null), i.return = t, e.return = t, i.sibling = e, t.child = i, t.child.memoizedState = Lu(n), t.memoizedState = Ou, e) : nf(t, o));
  if (s = e.memoizedState, s !== null && (c = s.dehydrated, c !== null)) return aN(e, t, o, r, c, s, n);
  if (i) {
    i = r.fallback, o = t.mode, s = e.child, c = s.sibling;
    var u = { mode: "hidden", children: r.children };
    return !(o & 1) && t.child !== s ? (r = t.child, r.childLanes = 0, r.pendingProps = u, t.deletions = null) : (r = Ir(s, u), r.subtreeFlags = s.subtreeFlags & 14680064), c !== null ? i = Ir(c, i) : (i = rs(i, o, n, null), i.flags |= 2), i.return = t, r.return = t, r.sibling = i, t.child = r, r = i, i = t.child, o = e.child.memoizedState, o = o === null ? Lu(n) : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }, i.memoizedState = o, i.childLanes = e.childLanes & ~n, t.memoizedState = Ou, r;
  }
  return i = e.child, e = i.sibling, r = Ir(i, { mode: "visible", children: r.children }), !(t.mode & 1) && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
}
function nf(e, t) {
  return t = Nl({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
}
function so(e, t, n, r) {
  return r !== null && Fd(r), Qs(t, e.child, null, n), e = nf(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
}
function aN(e, t, n, r, s, i, o) {
  if (n)
    return t.flags & 256 ? (t.flags &= -257, r = xc(Error(K(422))), so(e, t, o, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (i = r.fallback, s = t.mode, r = Nl({ mode: "visible", children: r.children }, s, 0, null), i = rs(i, s, o, null), i.flags |= 2, r.return = t, i.return = t, r.sibling = i, t.child = r, t.mode & 1 && Qs(t, e.child, null, o), t.child.memoizedState = Lu(o), t.memoizedState = Ou, i);
  if (!(t.mode & 1)) return so(e, t, o, null);
  if (s.data === "$!") {
    if (r = s.nextSibling && s.nextSibling.dataset, r) var c = r.dgst;
    return r = c, i = Error(K(419)), r = xc(i, r, void 0), so(e, t, o, r);
  }
  if (c = (o & e.childLanes) !== 0, Rt || c) {
    if (r = at, r !== null) {
      switch (o & -o) {
        case 4:
          s = 2;
          break;
        case 16:
          s = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          s = 32;
          break;
        case 536870912:
          s = 268435456;
          break;
        default:
          s = 0;
      }
      s = s & (r.suspendedLanes | o) ? 0 : s, s !== 0 && s !== i.retryLane && (i.retryLane = s, sr(e, s), bn(r, e, s, -1));
    }
    return cf(), r = xc(Error(K(421))), so(e, t, o, r);
  }
  return s.data === "$?" ? (t.flags |= 128, t.child = e.child, t = _N.bind(null, e), s._reactRetry = t, null) : (e = i.treeContext, Ht = jr(s.nextSibling), Ft = t, Be = !0, _n = null, e !== null && (Zt[Jt++] = Xn, Zt[Jt++] = Zn, Zt[Jt++] = as, Xn = e.id, Zn = e.overflow, as = t), t = nf(t, r.children), t.flags |= 4096, t);
}
function cm(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  r !== null && (r.lanes |= t), Iu(e.return, t, n);
}
function bc(e, t, n, r, s) {
  var i = e.memoizedState;
  i === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: s } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = r, i.tail = n, i.tailMode = s);
}
function Kv(e, t, n) {
  var r = t.pendingProps, s = r.revealOrder, i = r.tail;
  if (Nt(e, t, r.children, n), r = $e.current, r & 2) r = r & 1 | 2, t.flags |= 128;
  else {
    if (e !== null && e.flags & 128) e: for (e = t.child; e !== null; ) {
      if (e.tag === 13) e.memoizedState !== null && cm(e, n, t);
      else if (e.tag === 19) cm(e, n, t);
      else if (e.child !== null) {
        e.child.return = e, e = e.child;
        continue;
      }
      if (e === t) break e;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) break e;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
    r &= 1;
  }
  if (Ae($e, r), !(t.mode & 1)) t.memoizedState = null;
  else switch (s) {
    case "forwards":
      for (n = t.child, s = null; n !== null; ) e = n.alternate, e !== null && tl(e) === null && (s = n), n = n.sibling;
      n = s, n === null ? (s = t.child, t.child = null) : (s = n.sibling, n.sibling = null), bc(t, !1, s, n, i);
      break;
    case "backwards":
      for (n = null, s = t.child, t.child = null; s !== null; ) {
        if (e = s.alternate, e !== null && tl(e) === null) {
          t.child = s;
          break;
        }
        e = s.sibling, s.sibling = n, n = s, s = e;
      }
      bc(t, !0, n, null, i);
      break;
    case "together":
      bc(t, !1, null, null, void 0);
      break;
    default:
      t.memoizedState = null;
  }
  return t.child;
}
function No(e, t) {
  !(t.mode & 1) && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
}
function ar(e, t, n) {
  if (e !== null && (t.dependencies = e.dependencies), os |= t.lanes, !(n & t.childLanes)) return null;
  if (e !== null && t.child !== e.child) throw Error(K(153));
  if (t.child !== null) {
    for (e = t.child, n = Ir(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = Ir(e, e.pendingProps), n.return = t;
    n.sibling = null;
  }
  return t.child;
}
function iN(e, t, n) {
  switch (t.tag) {
    case 3:
      Gv(t), Ys();
      break;
    case 5:
      yv(t);
      break;
    case 1:
      Dt(t.type) && Yo(t);
      break;
    case 4:
      qd(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context, s = t.memoizedProps.value;
      Ae(Zo, r._currentValue), r._currentValue = s;
      break;
    case 13:
      if (r = t.memoizedState, r !== null)
        return r.dehydrated !== null ? (Ae($e, $e.current & 1), t.flags |= 128, null) : n & t.child.childLanes ? Vv(e, t, n) : (Ae($e, $e.current & 1), e = ar(e, t, n), e !== null ? e.sibling : null);
      Ae($e, $e.current & 1);
      break;
    case 19:
      if (r = (n & t.childLanes) !== 0, e.flags & 128) {
        if (r) return Kv(e, t, n);
        t.flags |= 128;
      }
      if (s = t.memoizedState, s !== null && (s.rendering = null, s.tail = null, s.lastEffect = null), Ae($e, $e.current), r) break;
      return null;
    case 22:
    case 23:
      return t.lanes = 0, Uv(e, t, n);
  }
  return ar(e, t, n);
}
var qv, zu, Yv, Qv;
qv = function(e, t) {
  for (var n = t.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      n.child.return = n, n = n.child;
      continue;
    }
    if (n === t) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === t) return;
      n = n.return;
    }
    n.sibling.return = n.return, n = n.sibling;
  }
};
zu = function() {
};
Yv = function(e, t, n, r) {
  var s = e.memoizedProps;
  if (s !== r) {
    e = t.stateNode, Zr($n.current);
    var i = null;
    switch (n) {
      case "input":
        s = iu(e, s), r = iu(e, r), i = [];
        break;
      case "select":
        s = Fe({}, s, { value: void 0 }), r = Fe({}, r, { value: void 0 }), i = [];
        break;
      case "textarea":
        s = cu(e, s), r = cu(e, r), i = [];
        break;
      default:
        typeof s.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Ko);
    }
    du(n, r);
    var o;
    n = null;
    for (p in s) if (!r.hasOwnProperty(p) && s.hasOwnProperty(p) && s[p] != null) if (p === "style") {
      var c = s[p];
      for (o in c) c.hasOwnProperty(o) && (n || (n = {}), n[o] = "");
    } else p !== "dangerouslySetInnerHTML" && p !== "children" && p !== "suppressContentEditableWarning" && p !== "suppressHydrationWarning" && p !== "autoFocus" && (qa.hasOwnProperty(p) ? i || (i = []) : (i = i || []).push(p, null));
    for (p in r) {
      var u = r[p];
      if (c = s?.[p], r.hasOwnProperty(p) && u !== c && (u != null || c != null)) if (p === "style") if (c) {
        for (o in c) !c.hasOwnProperty(o) || u && u.hasOwnProperty(o) || (n || (n = {}), n[o] = "");
        for (o in u) u.hasOwnProperty(o) && c[o] !== u[o] && (n || (n = {}), n[o] = u[o]);
      } else n || (i || (i = []), i.push(
        p,
        n
      )), n = u;
      else p === "dangerouslySetInnerHTML" ? (u = u ? u.__html : void 0, c = c ? c.__html : void 0, u != null && c !== u && (i = i || []).push(p, u)) : p === "children" ? typeof u != "string" && typeof u != "number" || (i = i || []).push(p, "" + u) : p !== "suppressContentEditableWarning" && p !== "suppressHydrationWarning" && (qa.hasOwnProperty(p) ? (u != null && p === "onScroll" && Pe("scroll", e), i || c === u || (i = [])) : (i = i || []).push(p, u));
    }
    n && (i = i || []).push("style", n);
    var p = i;
    (t.updateQueue = p) && (t.flags |= 4);
  }
};
Qv = function(e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function ba(e, t) {
  if (!Be) switch (e.tailMode) {
    case "hidden":
      t = e.tail;
      for (var n = null; t !== null; ) t.alternate !== null && (n = t), t = t.sibling;
      n === null ? e.tail = null : n.sibling = null;
      break;
    case "collapsed":
      n = e.tail;
      for (var r = null; n !== null; ) n.alternate !== null && (r = n), n = n.sibling;
      r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
  }
}
function gt(e) {
  var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
  if (t) for (var s = e.child; s !== null; ) n |= s.lanes | s.childLanes, r |= s.subtreeFlags & 14680064, r |= s.flags & 14680064, s.return = e, s = s.sibling;
  else for (s = e.child; s !== null; ) n |= s.lanes | s.childLanes, r |= s.subtreeFlags, r |= s.flags, s.return = e, s = s.sibling;
  return e.subtreeFlags |= r, e.childLanes = n, t;
}
function oN(e, t, n) {
  var r = t.pendingProps;
  switch (Hd(t), t.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return gt(t), null;
    case 1:
      return Dt(t.type) && qo(), gt(t), null;
    case 3:
      return r = t.stateNode, Xs(), De(Mt), De(St), Qd(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (no(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, _n !== null && (Vu(_n), _n = null))), zu(e, t), gt(t), null;
    case 5:
      Yd(t);
      var s = Zr(ii.current);
      if (n = t.type, e !== null && t.stateNode != null) Yv(e, t, n, r, s), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(K(166));
          return gt(t), null;
        }
        if (e = Zr($n.current), no(t)) {
          r = t.stateNode, n = t.type;
          var i = t.memoizedProps;
          switch (r[Ln] = t, r[si] = i, e = (t.mode & 1) !== 0, n) {
            case "dialog":
              Pe("cancel", r), Pe("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              Pe("load", r);
              break;
            case "video":
            case "audio":
              for (s = 0; s < Ca.length; s++) Pe(Ca[s], r);
              break;
            case "source":
              Pe("error", r);
              break;
            case "img":
            case "image":
            case "link":
              Pe(
                "error",
                r
              ), Pe("load", r);
              break;
            case "details":
              Pe("toggle", r);
              break;
            case "input":
              _p(r, i), Pe("invalid", r);
              break;
            case "select":
              r._wrapperState = { wasMultiple: !!i.multiple }, Pe("invalid", r);
              break;
            case "textarea":
              xp(r, i), Pe("invalid", r);
          }
          du(n, i), s = null;
          for (var o in i) if (i.hasOwnProperty(o)) {
            var c = i[o];
            o === "children" ? typeof c == "string" ? r.textContent !== c && (i.suppressHydrationWarning !== !0 && to(r.textContent, c, e), s = ["children", c]) : typeof c == "number" && r.textContent !== "" + c && (i.suppressHydrationWarning !== !0 && to(
              r.textContent,
              c,
              e
            ), s = ["children", "" + c]) : qa.hasOwnProperty(o) && c != null && o === "onScroll" && Pe("scroll", r);
          }
          switch (n) {
            case "input":
              Ki(r), yp(r, i, !0);
              break;
            case "textarea":
              Ki(r), bp(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof i.onClick == "function" && (r.onclick = Ko);
          }
          r = s, t.updateQueue = r, r !== null && (t.flags |= 4);
        } else {
          o = s.nodeType === 9 ? s : s.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = kg(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = o.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = o.createElement(n, { is: r.is }) : (e = o.createElement(n), n === "select" && (o = e, r.multiple ? o.multiple = !0 : r.size && (o.size = r.size))) : e = o.createElementNS(e, n), e[Ln] = t, e[si] = r, qv(e, t, !1, !1), t.stateNode = e;
          e: {
            switch (o = fu(n, r), n) {
              case "dialog":
                Pe("cancel", e), Pe("close", e), s = r;
                break;
              case "iframe":
              case "object":
              case "embed":
                Pe("load", e), s = r;
                break;
              case "video":
              case "audio":
                for (s = 0; s < Ca.length; s++) Pe(Ca[s], e);
                s = r;
                break;
              case "source":
                Pe("error", e), s = r;
                break;
              case "img":
              case "image":
              case "link":
                Pe(
                  "error",
                  e
                ), Pe("load", e), s = r;
                break;
              case "details":
                Pe("toggle", e), s = r;
                break;
              case "input":
                _p(e, r), s = iu(e, r), Pe("invalid", e);
                break;
              case "option":
                s = r;
                break;
              case "select":
                e._wrapperState = { wasMultiple: !!r.multiple }, s = Fe({}, r, { value: void 0 }), Pe("invalid", e);
                break;
              case "textarea":
                xp(e, r), s = cu(e, r), Pe("invalid", e);
                break;
              default:
                s = r;
            }
            du(n, s), c = s;
            for (i in c) if (c.hasOwnProperty(i)) {
              var u = c[i];
              i === "style" ? Eg(e, u) : i === "dangerouslySetInnerHTML" ? (u = u ? u.__html : void 0, u != null && Ng(e, u)) : i === "children" ? typeof u == "string" ? (n !== "textarea" || u !== "") && Ya(e, u) : typeof u == "number" && Ya(e, "" + u) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (qa.hasOwnProperty(i) ? u != null && i === "onScroll" && Pe("scroll", e) : u != null && jd(e, i, u, o));
            }
            switch (n) {
              case "input":
                Ki(e), yp(e, r, !1);
                break;
              case "textarea":
                Ki(e), bp(e);
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + Pr(r.value));
                break;
              case "select":
                e.multiple = !!r.multiple, i = r.value, i != null ? zs(e, !!r.multiple, i, !1) : r.defaultValue != null && zs(
                  e,
                  !!r.multiple,
                  r.defaultValue,
                  !0
                );
                break;
              default:
                typeof s.onClick == "function" && (e.onclick = Ko);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (t.flags |= 4);
        }
        t.ref !== null && (t.flags |= 512, t.flags |= 2097152);
      }
      return gt(t), null;
    case 6:
      if (e && t.stateNode != null) Qv(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(K(166));
        if (n = Zr(ii.current), Zr($n.current), no(t)) {
          if (r = t.stateNode, n = t.memoizedProps, r[Ln] = t, (i = r.nodeValue !== n) && (e = Ft, e !== null)) switch (e.tag) {
            case 3:
              to(r.nodeValue, n, (e.mode & 1) !== 0);
              break;
            case 5:
              e.memoizedProps.suppressHydrationWarning !== !0 && to(r.nodeValue, n, (e.mode & 1) !== 0);
          }
          i && (t.flags |= 4);
        } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[Ln] = t, t.stateNode = r;
      }
      return gt(t), null;
    case 13:
      if (De($e), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
        if (Be && Ht !== null && t.mode & 1 && !(t.flags & 128)) mv(), Ys(), t.flags |= 98560, i = !1;
        else if (i = no(t), r !== null && r.dehydrated !== null) {
          if (e === null) {
            if (!i) throw Error(K(318));
            if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(K(317));
            i[Ln] = t;
          } else Ys(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
          gt(t), i = !1;
        } else _n !== null && (Vu(_n), _n = null), i = !0;
        if (!i) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, t.mode & 1 && (e === null || $e.current & 1 ? Ze === 0 && (Ze = 3) : cf())), t.updateQueue !== null && (t.flags |= 4), gt(t), null);
    case 4:
      return Xs(), zu(e, t), e === null && ni(t.stateNode.containerInfo), gt(t), null;
    case 10:
      return Gd(t.type._context), gt(t), null;
    case 17:
      return Dt(t.type) && qo(), gt(t), null;
    case 19:
      if (De($e), i = t.memoizedState, i === null) return gt(t), null;
      if (r = (t.flags & 128) !== 0, o = i.rendering, o === null) if (r) ba(i, !1);
      else {
        if (Ze !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null; ) {
          if (o = tl(e), o !== null) {
            for (t.flags |= 128, ba(i, !1), r = o.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) i = n, e = r, i.flags &= 14680066, o = i.alternate, o === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = o.childLanes, i.lanes = o.lanes, i.child = o.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = o.memoizedProps, i.memoizedState = o.memoizedState, i.updateQueue = o.updateQueue, i.type = o.type, e = o.dependencies, i.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
            return Ae($e, $e.current & 1 | 2), t.child;
          }
          e = e.sibling;
        }
        i.tail !== null && Ge() > Js && (t.flags |= 128, r = !0, ba(i, !1), t.lanes = 4194304);
      }
      else {
        if (!r) if (e = tl(o), e !== null) {
          if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), ba(i, !0), i.tail === null && i.tailMode === "hidden" && !o.alternate && !Be) return gt(t), null;
        } else 2 * Ge() - i.renderingStartTime > Js && n !== 1073741824 && (t.flags |= 128, r = !0, ba(i, !1), t.lanes = 4194304);
        i.isBackwards ? (o.sibling = t.child, t.child = o) : (n = i.last, n !== null ? n.sibling = o : t.child = o, i.last = o);
      }
      return i.tail !== null ? (t = i.tail, i.rendering = t, i.tail = t.sibling, i.renderingStartTime = Ge(), t.sibling = null, n = $e.current, Ae($e, r ? n & 1 | 2 : n & 1), t) : (gt(t), null);
    case 22:
    case 23:
      return lf(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && t.mode & 1 ? Bt & 1073741824 && (gt(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : gt(t), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(K(156, t.tag));
}
function lN(e, t) {
  switch (Hd(t), t.tag) {
    case 1:
      return Dt(t.type) && qo(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
    case 3:
      return Xs(), De(Mt), De(St), Qd(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
    case 5:
      return Yd(t), null;
    case 13:
      if (De($e), e = t.memoizedState, e !== null && e.dehydrated !== null) {
        if (t.alternate === null) throw Error(K(340));
        Ys();
      }
      return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
    case 19:
      return De($e), null;
    case 4:
      return Xs(), null;
    case 10:
      return Gd(t.type._context), null;
    case 22:
    case 23:
      return lf(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var ao = !1, xt = !1, cN = typeof WeakSet == "function" ? WeakSet : Set, X = null;
function Os(e, t) {
  var n = e.ref;
  if (n !== null) if (typeof n == "function") try {
    n(null);
  } catch (r) {
    We(e, t, r);
  }
  else n.current = null;
}
function Bu(e, t, n) {
  try {
    n();
  } catch (r) {
    We(e, t, r);
  }
}
var um = !1;
function uN(e, t) {
  if (wu = Wo, e = tv(), Bd(e)) {
    if ("selectionStart" in e) var n = { start: e.selectionStart, end: e.selectionEnd };
    else e: {
      n = (n = e.ownerDocument) && n.defaultView || window;
      var r = n.getSelection && n.getSelection();
      if (r && r.rangeCount !== 0) {
        n = r.anchorNode;
        var s = r.anchorOffset, i = r.focusNode;
        r = r.focusOffset;
        try {
          n.nodeType, i.nodeType;
        } catch {
          n = null;
          break e;
        }
        var o = 0, c = -1, u = -1, p = 0, h = 0, x = e, g = null;
        t: for (; ; ) {
          for (var w; x !== n || s !== 0 && x.nodeType !== 3 || (c = o + s), x !== i || r !== 0 && x.nodeType !== 3 || (u = o + r), x.nodeType === 3 && (o += x.nodeValue.length), (w = x.firstChild) !== null; )
            g = x, x = w;
          for (; ; ) {
            if (x === e) break t;
            if (g === n && ++p === s && (c = o), g === i && ++h === r && (u = o), (w = x.nextSibling) !== null) break;
            x = g, g = x.parentNode;
          }
          x = w;
        }
        n = c === -1 || u === -1 ? null : { start: c, end: u };
      } else n = null;
    }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (Su = { focusedElem: e, selectionRange: n }, Wo = !1, X = t; X !== null; ) if (t = X, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, X = e;
  else for (; X !== null; ) {
    t = X;
    try {
      var E = t.alternate;
      if (t.flags & 1024) switch (t.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (E !== null) {
            var I = E.memoizedProps, D = E.memoizedState, y = t.stateNode, b = y.getSnapshotBeforeUpdate(t.elementType === t.type ? I : gn(t.type, I), D);
            y.__reactInternalSnapshotBeforeUpdate = b;
          }
          break;
        case 3:
          var N = t.stateNode.containerInfo;
          N.nodeType === 1 ? N.textContent = "" : N.nodeType === 9 && N.documentElement && N.removeChild(N.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(K(163));
      }
    } catch (l) {
      We(t, t.return, l);
    }
    if (e = t.sibling, e !== null) {
      e.return = t.return, X = e;
      break;
    }
    X = t.return;
  }
  return E = um, um = !1, E;
}
function $a(e, t, n) {
  var r = t.updateQueue;
  if (r = r !== null ? r.lastEffect : null, r !== null) {
    var s = r = r.next;
    do {
      if ((s.tag & e) === e) {
        var i = s.destroy;
        s.destroy = void 0, i !== void 0 && Bu(t, n, i);
      }
      s = s.next;
    } while (s !== r);
  }
}
function Sl(e, t) {
  if (t = t.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
    var n = t = t.next;
    do {
      if ((n.tag & e) === e) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== t);
  }
}
function $u(e) {
  var t = e.ref;
  if (t !== null) {
    var n = e.stateNode;
    switch (e.tag) {
      case 5:
        e = n;
        break;
      default:
        e = n;
    }
    typeof t == "function" ? t(e) : t.current = e;
  }
}
function Xv(e) {
  var t = e.alternate;
  t !== null && (e.alternate = null, Xv(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[Ln], delete t[si], delete t[ju], delete t[Vk], delete t[Kk])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
}
function Zv(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function dm(e) {
  e: for (; ; ) {
    for (; e.sibling === null; ) {
      if (e.return === null || Zv(e.return)) return null;
      e = e.return;
    }
    for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      e.child.return = e, e = e.child;
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function Hu(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Ko));
  else if (r !== 4 && (e = e.child, e !== null)) for (Hu(e, t, n), e = e.sibling; e !== null; ) Hu(e, t, n), e = e.sibling;
}
function Fu(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
  else if (r !== 4 && (e = e.child, e !== null)) for (Fu(e, t, n), e = e.sibling; e !== null; ) Fu(e, t, n), e = e.sibling;
}
var lt = null, vn = !1;
function pr(e, t, n) {
  for (n = n.child; n !== null; ) Jv(e, t, n), n = n.sibling;
}
function Jv(e, t, n) {
  if (Bn && typeof Bn.onCommitFiberUnmount == "function") try {
    Bn.onCommitFiberUnmount(hl, n);
  } catch {
  }
  switch (n.tag) {
    case 5:
      xt || Os(n, t);
    case 6:
      var r = lt, s = vn;
      lt = null, pr(e, t, n), lt = r, vn = s, lt !== null && (vn ? (e = lt, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : lt.removeChild(n.stateNode));
      break;
    case 18:
      lt !== null && (vn ? (e = lt, n = n.stateNode, e.nodeType === 8 ? mc(e.parentNode, n) : e.nodeType === 1 && mc(e, n), Ja(e)) : mc(lt, n.stateNode));
      break;
    case 4:
      r = lt, s = vn, lt = n.stateNode.containerInfo, vn = !0, pr(e, t, n), lt = r, vn = s;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!xt && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
        s = r = r.next;
        do {
          var i = s, o = i.destroy;
          i = i.tag, o !== void 0 && (i & 2 || i & 4) && Bu(n, t, o), s = s.next;
        } while (s !== r);
      }
      pr(e, t, n);
      break;
    case 1:
      if (!xt && (Os(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
        r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
      } catch (c) {
        We(n, t, c);
      }
      pr(e, t, n);
      break;
    case 21:
      pr(e, t, n);
      break;
    case 22:
      n.mode & 1 ? (xt = (r = xt) || n.memoizedState !== null, pr(e, t, n), xt = r) : pr(e, t, n);
      break;
    default:
      pr(e, t, n);
  }
}
function fm(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    n === null && (n = e.stateNode = new cN()), t.forEach(function(r) {
      var s = yN.bind(null, e, r);
      n.has(r) || (n.add(r), r.then(s, s));
    });
  }
}
function hn(e, t) {
  var n = t.deletions;
  if (n !== null) for (var r = 0; r < n.length; r++) {
    var s = n[r];
    try {
      var i = e, o = t, c = o;
      e: for (; c !== null; ) {
        switch (c.tag) {
          case 5:
            lt = c.stateNode, vn = !1;
            break e;
          case 3:
            lt = c.stateNode.containerInfo, vn = !0;
            break e;
          case 4:
            lt = c.stateNode.containerInfo, vn = !0;
            break e;
        }
        c = c.return;
      }
      if (lt === null) throw Error(K(160));
      Jv(i, o, s), lt = null, vn = !1;
      var u = s.alternate;
      u !== null && (u.return = null), s.return = null;
    } catch (p) {
      We(s, t, p);
    }
  }
  if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) e_(t, e), t = t.sibling;
}
function e_(e, t) {
  var n = e.alternate, r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if (hn(t, e), An(e), r & 4) {
        try {
          $a(3, e, e.return), Sl(3, e);
        } catch (I) {
          We(e, e.return, I);
        }
        try {
          $a(5, e, e.return);
        } catch (I) {
          We(e, e.return, I);
        }
      }
      break;
    case 1:
      hn(t, e), An(e), r & 512 && n !== null && Os(n, n.return);
      break;
    case 5:
      if (hn(t, e), An(e), r & 512 && n !== null && Os(n, n.return), e.flags & 32) {
        var s = e.stateNode;
        try {
          Ya(s, "");
        } catch (I) {
          We(e, e.return, I);
        }
      }
      if (r & 4 && (s = e.stateNode, s != null)) {
        var i = e.memoizedProps, o = n !== null ? n.memoizedProps : i, c = e.type, u = e.updateQueue;
        if (e.updateQueue = null, u !== null) try {
          c === "input" && i.type === "radio" && i.name != null && wg(s, i), fu(c, o);
          var p = fu(c, i);
          for (o = 0; o < u.length; o += 2) {
            var h = u[o], x = u[o + 1];
            h === "style" ? Eg(s, x) : h === "dangerouslySetInnerHTML" ? Ng(s, x) : h === "children" ? Ya(s, x) : jd(s, h, x, p);
          }
          switch (c) {
            case "input":
              ou(s, i);
              break;
            case "textarea":
              Sg(s, i);
              break;
            case "select":
              var g = s._wrapperState.wasMultiple;
              s._wrapperState.wasMultiple = !!i.multiple;
              var w = i.value;
              w != null ? zs(s, !!i.multiple, w, !1) : g !== !!i.multiple && (i.defaultValue != null ? zs(
                s,
                !!i.multiple,
                i.defaultValue,
                !0
              ) : zs(s, !!i.multiple, i.multiple ? [] : "", !1));
          }
          s[si] = i;
        } catch (I) {
          We(e, e.return, I);
        }
      }
      break;
    case 6:
      if (hn(t, e), An(e), r & 4) {
        if (e.stateNode === null) throw Error(K(162));
        s = e.stateNode, i = e.memoizedProps;
        try {
          s.nodeValue = i;
        } catch (I) {
          We(e, e.return, I);
        }
      }
      break;
    case 3:
      if (hn(t, e), An(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
        Ja(t.containerInfo);
      } catch (I) {
        We(e, e.return, I);
      }
      break;
    case 4:
      hn(t, e), An(e);
      break;
    case 13:
      hn(t, e), An(e), s = e.child, s.flags & 8192 && (i = s.memoizedState !== null, s.stateNode.isHidden = i, !i || s.alternate !== null && s.alternate.memoizedState !== null || (af = Ge())), r & 4 && fm(e);
      break;
    case 22:
      if (h = n !== null && n.memoizedState !== null, e.mode & 1 ? (xt = (p = xt) || h, hn(t, e), xt = p) : hn(t, e), An(e), r & 8192) {
        if (p = e.memoizedState !== null, (e.stateNode.isHidden = p) && !h && e.mode & 1) for (X = e, h = e.child; h !== null; ) {
          for (x = X = h; X !== null; ) {
            switch (g = X, w = g.child, g.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                $a(4, g, g.return);
                break;
              case 1:
                Os(g, g.return);
                var E = g.stateNode;
                if (typeof E.componentWillUnmount == "function") {
                  r = g, n = g.return;
                  try {
                    t = r, E.props = t.memoizedProps, E.state = t.memoizedState, E.componentWillUnmount();
                  } catch (I) {
                    We(r, n, I);
                  }
                }
                break;
              case 5:
                Os(g, g.return);
                break;
              case 22:
                if (g.memoizedState !== null) {
                  mm(x);
                  continue;
                }
            }
            w !== null ? (w.return = g, X = w) : mm(x);
          }
          h = h.sibling;
        }
        e: for (h = null, x = e; ; ) {
          if (x.tag === 5) {
            if (h === null) {
              h = x;
              try {
                s = x.stateNode, p ? (i = s.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (c = x.stateNode, u = x.memoizedProps.style, o = u != null && u.hasOwnProperty("display") ? u.display : null, c.style.display = jg("display", o));
              } catch (I) {
                We(e, e.return, I);
              }
            }
          } else if (x.tag === 6) {
            if (h === null) try {
              x.stateNode.nodeValue = p ? "" : x.memoizedProps;
            } catch (I) {
              We(e, e.return, I);
            }
          } else if ((x.tag !== 22 && x.tag !== 23 || x.memoizedState === null || x === e) && x.child !== null) {
            x.child.return = x, x = x.child;
            continue;
          }
          if (x === e) break e;
          for (; x.sibling === null; ) {
            if (x.return === null || x.return === e) break e;
            h === x && (h = null), x = x.return;
          }
          h === x && (h = null), x.sibling.return = x.return, x = x.sibling;
        }
      }
      break;
    case 19:
      hn(t, e), An(e), r & 4 && fm(e);
      break;
    case 21:
      break;
    default:
      hn(
        t,
        e
      ), An(e);
  }
}
function An(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (Zv(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(K(160));
      }
      switch (r.tag) {
        case 5:
          var s = r.stateNode;
          r.flags & 32 && (Ya(s, ""), r.flags &= -33);
          var i = dm(e);
          Fu(e, i, s);
          break;
        case 3:
        case 4:
          var o = r.stateNode.containerInfo, c = dm(e);
          Hu(e, c, o);
          break;
        default:
          throw Error(K(161));
      }
    } catch (u) {
      We(e, e.return, u);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function dN(e, t, n) {
  X = e, t_(e);
}
function t_(e, t, n) {
  for (var r = (e.mode & 1) !== 0; X !== null; ) {
    var s = X, i = s.child;
    if (s.tag === 22 && r) {
      var o = s.memoizedState !== null || ao;
      if (!o) {
        var c = s.alternate, u = c !== null && c.memoizedState !== null || xt;
        c = ao;
        var p = xt;
        if (ao = o, (xt = u) && !p) for (X = s; X !== null; ) o = X, u = o.child, o.tag === 22 && o.memoizedState !== null ? hm(s) : u !== null ? (u.return = o, X = u) : hm(s);
        for (; i !== null; ) X = i, t_(i), i = i.sibling;
        X = s, ao = c, xt = p;
      }
      pm(e);
    } else s.subtreeFlags & 8772 && i !== null ? (i.return = s, X = i) : pm(e);
  }
}
function pm(e) {
  for (; X !== null; ) {
    var t = X;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            xt || Sl(5, t);
            break;
          case 1:
            var r = t.stateNode;
            if (t.flags & 4 && !xt) if (n === null) r.componentDidMount();
            else {
              var s = t.elementType === t.type ? n.memoizedProps : gn(t.type, n.memoizedProps);
              r.componentDidUpdate(s, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
            }
            var i = t.updateQueue;
            i !== null && Xp(t, i, r);
            break;
          case 3:
            var o = t.updateQueue;
            if (o !== null) {
              if (n = null, t.child !== null) switch (t.child.tag) {
                case 5:
                  n = t.child.stateNode;
                  break;
                case 1:
                  n = t.child.stateNode;
              }
              Xp(t, o, n);
            }
            break;
          case 5:
            var c = t.stateNode;
            if (n === null && t.flags & 4) {
              n = c;
              var u = t.memoizedProps;
              switch (t.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  u.autoFocus && n.focus();
                  break;
                case "img":
                  u.src && (n.src = u.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (t.memoizedState === null) {
              var p = t.alternate;
              if (p !== null) {
                var h = p.memoizedState;
                if (h !== null) {
                  var x = h.dehydrated;
                  x !== null && Ja(x);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(K(163));
        }
        xt || t.flags & 512 && $u(t);
      } catch (g) {
        We(t, t.return, g);
      }
    }
    if (t === e) {
      X = null;
      break;
    }
    if (n = t.sibling, n !== null) {
      n.return = t.return, X = n;
      break;
    }
    X = t.return;
  }
}
function mm(e) {
  for (; X !== null; ) {
    var t = X;
    if (t === e) {
      X = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      n.return = t.return, X = n;
      break;
    }
    X = t.return;
  }
}
function hm(e) {
  for (; X !== null; ) {
    var t = X;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            Sl(4, t);
          } catch (u) {
            We(t, n, u);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var s = t.return;
            try {
              r.componentDidMount();
            } catch (u) {
              We(t, s, u);
            }
          }
          var i = t.return;
          try {
            $u(t);
          } catch (u) {
            We(t, i, u);
          }
          break;
        case 5:
          var o = t.return;
          try {
            $u(t);
          } catch (u) {
            We(t, o, u);
          }
      }
    } catch (u) {
      We(t, t.return, u);
    }
    if (t === e) {
      X = null;
      break;
    }
    var c = t.sibling;
    if (c !== null) {
      c.return = t.return, X = c;
      break;
    }
    X = t.return;
  }
}
var fN = Math.ceil, sl = ir.ReactCurrentDispatcher, rf = ir.ReactCurrentOwner, sn = ir.ReactCurrentBatchConfig, ke = 0, at = null, Ke = null, ut = 0, Bt = 0, Ls = Or(0), Ze = 0, ui = null, os = 0, kl = 0, sf = 0, Ha = null, Pt = null, af = 0, Js = 1 / 0, qn = null, al = !1, Uu = null, Cr = null, io = !1, br = null, il = 0, Fa = 0, Wu = null, jo = -1, Eo = 0;
function jt() {
  return ke & 6 ? Ge() : jo !== -1 ? jo : jo = Ge();
}
function Tr(e) {
  return e.mode & 1 ? ke & 2 && ut !== 0 ? ut & -ut : Yk.transition !== null ? (Eo === 0 && (Eo = Bg()), Eo) : (e = Ce, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Vg(e.type)), e) : 1;
}
function bn(e, t, n, r) {
  if (50 < Fa) throw Fa = 0, Wu = null, Error(K(185));
  bi(e, n, r), (!(ke & 2) || e !== at) && (e === at && (!(ke & 2) && (kl |= n), Ze === 4 && _r(e, ut)), Ot(e, r), n === 1 && ke === 0 && !(t.mode & 1) && (Js = Ge() + 500, xl && Lr()));
}
function Ot(e, t) {
  var n = e.callbackNode;
  YS(e, t);
  var r = Uo(e, e === at ? ut : 0);
  if (r === 0) n !== null && kp(n), e.callbackNode = null, e.callbackPriority = 0;
  else if (t = r & -r, e.callbackPriority !== t) {
    if (n != null && kp(n), t === 1) e.tag === 0 ? qk(gm.bind(null, e)) : dv(gm.bind(null, e)), Wk(function() {
      !(ke & 6) && Lr();
    }), n = null;
    else {
      switch ($g(r)) {
        case 1:
          n = Ad;
          break;
        case 4:
          n = Lg;
          break;
        case 16:
          n = Fo;
          break;
        case 536870912:
          n = zg;
          break;
        default:
          n = Fo;
      }
      n = c_(n, n_.bind(null, e));
    }
    e.callbackPriority = t, e.callbackNode = n;
  }
}
function n_(e, t) {
  if (jo = -1, Eo = 0, ke & 6) throw Error(K(327));
  var n = e.callbackNode;
  if (Us() && e.callbackNode !== n) return null;
  var r = Uo(e, e === at ? ut : 0);
  if (r === 0) return null;
  if (r & 30 || r & e.expiredLanes || t) t = ol(e, r);
  else {
    t = r;
    var s = ke;
    ke |= 2;
    var i = s_();
    (at !== e || ut !== t) && (qn = null, Js = Ge() + 500, ns(e, t));
    do
      try {
        hN();
        break;
      } catch (c) {
        r_(e, c);
      }
    while (!0);
    Wd(), sl.current = i, ke = s, Ke !== null ? t = 0 : (at = null, ut = 0, t = Ze);
  }
  if (t !== 0) {
    if (t === 2 && (s = vu(e), s !== 0 && (r = s, t = Gu(e, s))), t === 1) throw n = ui, ns(e, 0), _r(e, r), Ot(e, Ge()), n;
    if (t === 6) _r(e, r);
    else {
      if (s = e.current.alternate, !(r & 30) && !pN(s) && (t = ol(e, r), t === 2 && (i = vu(e), i !== 0 && (r = i, t = Gu(e, i))), t === 1)) throw n = ui, ns(e, 0), _r(e, r), Ot(e, Ge()), n;
      switch (e.finishedWork = s, e.finishedLanes = r, t) {
        case 0:
        case 1:
          throw Error(K(345));
        case 2:
          Yr(e, Pt, qn);
          break;
        case 3:
          if (_r(e, r), (r & 130023424) === r && (t = af + 500 - Ge(), 10 < t)) {
            if (Uo(e, 0) !== 0) break;
            if (s = e.suspendedLanes, (s & r) !== r) {
              jt(), e.pingedLanes |= e.suspendedLanes & s;
              break;
            }
            e.timeoutHandle = Nu(Yr.bind(null, e, Pt, qn), t);
            break;
          }
          Yr(e, Pt, qn);
          break;
        case 4:
          if (_r(e, r), (r & 4194240) === r) break;
          for (t = e.eventTimes, s = -1; 0 < r; ) {
            var o = 31 - xn(r);
            i = 1 << o, o = t[o], o > s && (s = o), r &= ~i;
          }
          if (r = s, r = Ge() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * fN(r / 1960)) - r, 10 < r) {
            e.timeoutHandle = Nu(Yr.bind(null, e, Pt, qn), r);
            break;
          }
          Yr(e, Pt, qn);
          break;
        case 5:
          Yr(e, Pt, qn);
          break;
        default:
          throw Error(K(329));
      }
    }
  }
  return Ot(e, Ge()), e.callbackNode === n ? n_.bind(null, e) : null;
}
function Gu(e, t) {
  var n = Ha;
  return e.current.memoizedState.isDehydrated && (ns(e, t).flags |= 256), e = ol(e, t), e !== 2 && (t = Pt, Pt = n, t !== null && Vu(t)), e;
}
function Vu(e) {
  Pt === null ? Pt = e : Pt.push.apply(Pt, e);
}
function pN(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
        var s = n[r], i = s.getSnapshot;
        s = s.value;
        try {
          if (!Sn(i(), s)) return !1;
        } catch {
          return !1;
        }
      }
    }
    if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
    else {
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return !0;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
  }
  return !0;
}
function _r(e, t) {
  for (t &= ~sf, t &= ~kl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
    var n = 31 - xn(t), r = 1 << n;
    e[n] = -1, t &= ~r;
  }
}
function gm(e) {
  if (ke & 6) throw Error(K(327));
  Us();
  var t = Uo(e, 0);
  if (!(t & 1)) return Ot(e, Ge()), null;
  var n = ol(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = vu(e);
    r !== 0 && (t = r, n = Gu(e, r));
  }
  if (n === 1) throw n = ui, ns(e, 0), _r(e, t), Ot(e, Ge()), n;
  if (n === 6) throw Error(K(345));
  return e.finishedWork = e.current.alternate, e.finishedLanes = t, Yr(e, Pt, qn), Ot(e, Ge()), null;
}
function of(e, t) {
  var n = ke;
  ke |= 1;
  try {
    return e(t);
  } finally {
    ke = n, ke === 0 && (Js = Ge() + 500, xl && Lr());
  }
}
function ls(e) {
  br !== null && br.tag === 0 && !(ke & 6) && Us();
  var t = ke;
  ke |= 1;
  var n = sn.transition, r = Ce;
  try {
    if (sn.transition = null, Ce = 1, e) return e();
  } finally {
    Ce = r, sn.transition = n, ke = t, !(ke & 6) && Lr();
  }
}
function lf() {
  Bt = Ls.current, De(Ls);
}
function ns(e, t) {
  e.finishedWork = null, e.finishedLanes = 0;
  var n = e.timeoutHandle;
  if (n !== -1 && (e.timeoutHandle = -1, Uk(n)), Ke !== null) for (n = Ke.return; n !== null; ) {
    var r = n;
    switch (Hd(r), r.tag) {
      case 1:
        r = r.type.childContextTypes, r != null && qo();
        break;
      case 3:
        Xs(), De(Mt), De(St), Qd();
        break;
      case 5:
        Yd(r);
        break;
      case 4:
        Xs();
        break;
      case 13:
        De($e);
        break;
      case 19:
        De($e);
        break;
      case 10:
        Gd(r.type._context);
        break;
      case 22:
      case 23:
        lf();
    }
    n = n.return;
  }
  if (at = e, Ke = e = Ir(e.current, null), ut = Bt = t, Ze = 0, ui = null, sf = kl = os = 0, Pt = Ha = null, Xr !== null) {
    for (t = 0; t < Xr.length; t++) if (n = Xr[t], r = n.interleaved, r !== null) {
      n.interleaved = null;
      var s = r.next, i = n.pending;
      if (i !== null) {
        var o = i.next;
        i.next = s, r.next = o;
      }
      n.pending = r;
    }
    Xr = null;
  }
  return e;
}
function r_(e, t) {
  do {
    var n = Ke;
    try {
      if (Wd(), So.current = rl, nl) {
        for (var r = He.memoizedState; r !== null; ) {
          var s = r.queue;
          s !== null && (s.pending = null), r = r.next;
        }
        nl = !1;
      }
      if (is = 0, st = Qe = He = null, Ba = !1, oi = 0, rf.current = null, n === null || n.return === null) {
        Ze = 1, ui = t, Ke = null;
        break;
      }
      e: {
        var i = e, o = n.return, c = n, u = t;
        if (t = ut, c.flags |= 32768, u !== null && typeof u == "object" && typeof u.then == "function") {
          var p = u, h = c, x = h.tag;
          if (!(h.mode & 1) && (x === 0 || x === 11 || x === 15)) {
            var g = h.alternate;
            g ? (h.updateQueue = g.updateQueue, h.memoizedState = g.memoizedState, h.lanes = g.lanes) : (h.updateQueue = null, h.memoizedState = null);
          }
          var w = rm(o);
          if (w !== null) {
            w.flags &= -257, sm(w, o, c, i, t), w.mode & 1 && nm(i, p, t), t = w, u = p;
            var E = t.updateQueue;
            if (E === null) {
              var I = /* @__PURE__ */ new Set();
              I.add(u), t.updateQueue = I;
            } else E.add(u);
            break e;
          } else {
            if (!(t & 1)) {
              nm(i, p, t), cf();
              break e;
            }
            u = Error(K(426));
          }
        } else if (Be && c.mode & 1) {
          var D = rm(o);
          if (D !== null) {
            !(D.flags & 65536) && (D.flags |= 256), sm(D, o, c, i, t), Fd(Zs(u, c));
            break e;
          }
        }
        i = u = Zs(u, c), Ze !== 4 && (Ze = 2), Ha === null ? Ha = [i] : Ha.push(i), i = o;
        do {
          switch (i.tag) {
            case 3:
              i.flags |= 65536, t &= -t, i.lanes |= t;
              var y = $v(i, u, t);
              Qp(i, y);
              break e;
            case 1:
              c = u;
              var b = i.type, N = i.stateNode;
              if (!(i.flags & 128) && (typeof b.getDerivedStateFromError == "function" || N !== null && typeof N.componentDidCatch == "function" && (Cr === null || !Cr.has(N)))) {
                i.flags |= 65536, t &= -t, i.lanes |= t;
                var l = Hv(i, c, t);
                Qp(i, l);
                break e;
              }
          }
          i = i.return;
        } while (i !== null);
      }
      i_(n);
    } catch (d) {
      t = d, Ke === n && n !== null && (Ke = n = n.return);
      continue;
    }
    break;
  } while (!0);
}
function s_() {
  var e = sl.current;
  return sl.current = rl, e === null ? rl : e;
}
function cf() {
  (Ze === 0 || Ze === 3 || Ze === 2) && (Ze = 4), at === null || !(os & 268435455) && !(kl & 268435455) || _r(at, ut);
}
function ol(e, t) {
  var n = ke;
  ke |= 2;
  var r = s_();
  (at !== e || ut !== t) && (qn = null, ns(e, t));
  do
    try {
      mN();
      break;
    } catch (s) {
      r_(e, s);
    }
  while (!0);
  if (Wd(), ke = n, sl.current = r, Ke !== null) throw Error(K(261));
  return at = null, ut = 0, Ze;
}
function mN() {
  for (; Ke !== null; ) a_(Ke);
}
function hN() {
  for (; Ke !== null && !$S(); ) a_(Ke);
}
function a_(e) {
  var t = l_(e.alternate, e, Bt);
  e.memoizedProps = e.pendingProps, t === null ? i_(e) : Ke = t, rf.current = null;
}
function i_(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (e = t.return, t.flags & 32768) {
      if (n = lN(n, t), n !== null) {
        n.flags &= 32767, Ke = n;
        return;
      }
      if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
      else {
        Ze = 6, Ke = null;
        return;
      }
    } else if (n = oN(n, t, Bt), n !== null) {
      Ke = n;
      return;
    }
    if (t = t.sibling, t !== null) {
      Ke = t;
      return;
    }
    Ke = t = e;
  } while (t !== null);
  Ze === 0 && (Ze = 5);
}
function Yr(e, t, n) {
  var r = Ce, s = sn.transition;
  try {
    sn.transition = null, Ce = 1, gN(e, t, n, r);
  } finally {
    sn.transition = s, Ce = r;
  }
  return null;
}
function gN(e, t, n, r) {
  do
    Us();
  while (br !== null);
  if (ke & 6) throw Error(K(327));
  n = e.finishedWork;
  var s = e.finishedLanes;
  if (n === null) return null;
  if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(K(177));
  e.callbackNode = null, e.callbackPriority = 0;
  var i = n.lanes | n.childLanes;
  if (QS(e, i), e === at && (Ke = at = null, ut = 0), !(n.subtreeFlags & 2064) && !(n.flags & 2064) || io || (io = !0, c_(Fo, function() {
    return Us(), null;
  })), i = (n.flags & 15990) !== 0, n.subtreeFlags & 15990 || i) {
    i = sn.transition, sn.transition = null;
    var o = Ce;
    Ce = 1;
    var c = ke;
    ke |= 4, rf.current = null, uN(e, n), e_(n, e), Ok(Su), Wo = !!wu, Su = wu = null, e.current = n, dN(n), HS(), ke = c, Ce = o, sn.transition = i;
  } else e.current = n;
  if (io && (io = !1, br = e, il = s), i = e.pendingLanes, i === 0 && (Cr = null), WS(n.stateNode), Ot(e, Ge()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) s = t[n], r(s.value, { componentStack: s.stack, digest: s.digest });
  if (al) throw al = !1, e = Uu, Uu = null, e;
  return il & 1 && e.tag !== 0 && Us(), i = e.pendingLanes, i & 1 ? e === Wu ? Fa++ : (Fa = 0, Wu = e) : Fa = 0, Lr(), null;
}
function Us() {
  if (br !== null) {
    var e = $g(il), t = sn.transition, n = Ce;
    try {
      if (sn.transition = null, Ce = 16 > e ? 16 : e, br === null) var r = !1;
      else {
        if (e = br, br = null, il = 0, ke & 6) throw Error(K(331));
        var s = ke;
        for (ke |= 4, X = e.current; X !== null; ) {
          var i = X, o = i.child;
          if (X.flags & 16) {
            var c = i.deletions;
            if (c !== null) {
              for (var u = 0; u < c.length; u++) {
                var p = c[u];
                for (X = p; X !== null; ) {
                  var h = X;
                  switch (h.tag) {
                    case 0:
                    case 11:
                    case 15:
                      $a(8, h, i);
                  }
                  var x = h.child;
                  if (x !== null) x.return = h, X = x;
                  else for (; X !== null; ) {
                    h = X;
                    var g = h.sibling, w = h.return;
                    if (Xv(h), h === p) {
                      X = null;
                      break;
                    }
                    if (g !== null) {
                      g.return = w, X = g;
                      break;
                    }
                    X = w;
                  }
                }
              }
              var E = i.alternate;
              if (E !== null) {
                var I = E.child;
                if (I !== null) {
                  E.child = null;
                  do {
                    var D = I.sibling;
                    I.sibling = null, I = D;
                  } while (I !== null);
                }
              }
              X = i;
            }
          }
          if (i.subtreeFlags & 2064 && o !== null) o.return = i, X = o;
          else e: for (; X !== null; ) {
            if (i = X, i.flags & 2048) switch (i.tag) {
              case 0:
              case 11:
              case 15:
                $a(9, i, i.return);
            }
            var y = i.sibling;
            if (y !== null) {
              y.return = i.return, X = y;
              break e;
            }
            X = i.return;
          }
        }
        var b = e.current;
        for (X = b; X !== null; ) {
          o = X;
          var N = o.child;
          if (o.subtreeFlags & 2064 && N !== null) N.return = o, X = N;
          else e: for (o = b; X !== null; ) {
            if (c = X, c.flags & 2048) try {
              switch (c.tag) {
                case 0:
                case 11:
                case 15:
                  Sl(9, c);
              }
            } catch (d) {
              We(c, c.return, d);
            }
            if (c === o) {
              X = null;
              break e;
            }
            var l = c.sibling;
            if (l !== null) {
              l.return = c.return, X = l;
              break e;
            }
            X = c.return;
          }
        }
        if (ke = s, Lr(), Bn && typeof Bn.onPostCommitFiberRoot == "function") try {
          Bn.onPostCommitFiberRoot(hl, e);
        } catch {
        }
        r = !0;
      }
      return r;
    } finally {
      Ce = n, sn.transition = t;
    }
  }
  return !1;
}
function vm(e, t, n) {
  t = Zs(n, t), t = $v(e, t, 1), e = Er(e, t, 1), t = jt(), e !== null && (bi(e, 1, t), Ot(e, t));
}
function We(e, t, n) {
  if (e.tag === 3) vm(e, e, n);
  else for (; t !== null; ) {
    if (t.tag === 3) {
      vm(t, e, n);
      break;
    } else if (t.tag === 1) {
      var r = t.stateNode;
      if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Cr === null || !Cr.has(r))) {
        e = Zs(n, e), e = Hv(t, e, 1), t = Er(t, e, 1), e = jt(), t !== null && (bi(t, 1, e), Ot(t, e));
        break;
      }
    }
    t = t.return;
  }
}
function vN(e, t, n) {
  var r = e.pingCache;
  r !== null && r.delete(t), t = jt(), e.pingedLanes |= e.suspendedLanes & n, at === e && (ut & n) === n && (Ze === 4 || Ze === 3 && (ut & 130023424) === ut && 500 > Ge() - af ? ns(e, 0) : sf |= n), Ot(e, t);
}
function o_(e, t) {
  t === 0 && (e.mode & 1 ? (t = Qi, Qi <<= 1, !(Qi & 130023424) && (Qi = 4194304)) : t = 1);
  var n = jt();
  e = sr(e, t), e !== null && (bi(e, t, n), Ot(e, n));
}
function _N(e) {
  var t = e.memoizedState, n = 0;
  t !== null && (n = t.retryLane), o_(e, n);
}
function yN(e, t) {
  var n = 0;
  switch (e.tag) {
    case 13:
      var r = e.stateNode, s = e.memoizedState;
      s !== null && (n = s.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(K(314));
  }
  r !== null && r.delete(t), o_(e, n);
}
var l_;
l_ = function(e, t, n) {
  if (e !== null) if (e.memoizedProps !== t.pendingProps || Mt.current) Rt = !0;
  else {
    if (!(e.lanes & n) && !(t.flags & 128)) return Rt = !1, iN(e, t, n);
    Rt = !!(e.flags & 131072);
  }
  else Rt = !1, Be && t.flags & 1048576 && fv(t, Xo, t.index);
  switch (t.lanes = 0, t.tag) {
    case 2:
      var r = t.type;
      No(e, t), e = t.pendingProps;
      var s = qs(t, St.current);
      Fs(t, n), s = Zd(null, t, r, e, s, n);
      var i = Jd();
      return t.flags |= 1, typeof s == "object" && s !== null && typeof s.render == "function" && s.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Dt(r) ? (i = !0, Yo(t)) : i = !1, t.memoizedState = s.state !== null && s.state !== void 0 ? s.state : null, Kd(t), s.updater = wl, t.stateNode = s, s._reactInternals = t, Pu(t, r, e, n), t = Du(null, t, r, !0, i, n)) : (t.tag = 0, Be && i && $d(t), Nt(null, t, s, n), t = t.child), t;
    case 16:
      r = t.elementType;
      e: {
        switch (No(e, t), e = t.pendingProps, s = r._init, r = s(r._payload), t.type = r, s = t.tag = bN(r), e = gn(r, e), s) {
          case 0:
            t = Mu(null, t, r, e, n);
            break e;
          case 1:
            t = om(null, t, r, e, n);
            break e;
          case 11:
            t = am(null, t, r, e, n);
            break e;
          case 14:
            t = im(null, t, r, gn(r.type, e), n);
            break e;
        }
        throw Error(K(
          306,
          r,
          ""
        ));
      }
      return t;
    case 0:
      return r = t.type, s = t.pendingProps, s = t.elementType === r ? s : gn(r, s), Mu(e, t, r, s, n);
    case 1:
      return r = t.type, s = t.pendingProps, s = t.elementType === r ? s : gn(r, s), om(e, t, r, s, n);
    case 3:
      e: {
        if (Gv(t), e === null) throw Error(K(387));
        r = t.pendingProps, i = t.memoizedState, s = i.element, _v(e, t), el(t, r, null, n);
        var o = t.memoizedState;
        if (r = o.element, i.isDehydrated) if (i = { element: r, isDehydrated: !1, cache: o.cache, pendingSuspenseBoundaries: o.pendingSuspenseBoundaries, transitions: o.transitions }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
          s = Zs(Error(K(423)), t), t = lm(e, t, r, n, s);
          break e;
        } else if (r !== s) {
          s = Zs(Error(K(424)), t), t = lm(e, t, r, n, s);
          break e;
        } else for (Ht = jr(t.stateNode.containerInfo.firstChild), Ft = t, Be = !0, _n = null, n = gv(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
        else {
          if (Ys(), r === s) {
            t = ar(e, t, n);
            break e;
          }
          Nt(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return yv(t), e === null && Tu(t), r = t.type, s = t.pendingProps, i = e !== null ? e.memoizedProps : null, o = s.children, ku(r, s) ? o = null : i !== null && ku(r, i) && (t.flags |= 32), Wv(e, t), Nt(e, t, o, n), t.child;
    case 6:
      return e === null && Tu(t), null;
    case 13:
      return Vv(e, t, n);
    case 4:
      return qd(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Qs(t, null, r, n) : Nt(e, t, r, n), t.child;
    case 11:
      return r = t.type, s = t.pendingProps, s = t.elementType === r ? s : gn(r, s), am(e, t, r, s, n);
    case 7:
      return Nt(e, t, t.pendingProps, n), t.child;
    case 8:
      return Nt(e, t, t.pendingProps.children, n), t.child;
    case 12:
      return Nt(e, t, t.pendingProps.children, n), t.child;
    case 10:
      e: {
        if (r = t.type._context, s = t.pendingProps, i = t.memoizedProps, o = s.value, Ae(Zo, r._currentValue), r._currentValue = o, i !== null) if (Sn(i.value, o)) {
          if (i.children === s.children && !Mt.current) {
            t = ar(e, t, n);
            break e;
          }
        } else for (i = t.child, i !== null && (i.return = t); i !== null; ) {
          var c = i.dependencies;
          if (c !== null) {
            o = i.child;
            for (var u = c.firstContext; u !== null; ) {
              if (u.context === r) {
                if (i.tag === 1) {
                  u = tr(-1, n & -n), u.tag = 2;
                  var p = i.updateQueue;
                  if (p !== null) {
                    p = p.shared;
                    var h = p.pending;
                    h === null ? u.next = u : (u.next = h.next, h.next = u), p.pending = u;
                  }
                }
                i.lanes |= n, u = i.alternate, u !== null && (u.lanes |= n), Iu(
                  i.return,
                  n,
                  t
                ), c.lanes |= n;
                break;
              }
              u = u.next;
            }
          } else if (i.tag === 10) o = i.type === t.type ? null : i.child;
          else if (i.tag === 18) {
            if (o = i.return, o === null) throw Error(K(341));
            o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), Iu(o, n, t), o = i.sibling;
          } else o = i.child;
          if (o !== null) o.return = i;
          else for (o = i; o !== null; ) {
            if (o === t) {
              o = null;
              break;
            }
            if (i = o.sibling, i !== null) {
              i.return = o.return, o = i;
              break;
            }
            o = o.return;
          }
          i = o;
        }
        Nt(e, t, s.children, n), t = t.child;
      }
      return t;
    case 9:
      return s = t.type, r = t.pendingProps.children, Fs(t, n), s = an(s), r = r(s), t.flags |= 1, Nt(e, t, r, n), t.child;
    case 14:
      return r = t.type, s = gn(r, t.pendingProps), s = gn(r.type, s), im(e, t, r, s, n);
    case 15:
      return Fv(e, t, t.type, t.pendingProps, n);
    case 17:
      return r = t.type, s = t.pendingProps, s = t.elementType === r ? s : gn(r, s), No(e, t), t.tag = 1, Dt(r) ? (e = !0, Yo(t)) : e = !1, Fs(t, n), Bv(t, r, s), Pu(t, r, s, n), Du(null, t, r, !0, e, n);
    case 19:
      return Kv(e, t, n);
    case 22:
      return Uv(e, t, n);
  }
  throw Error(K(156, t.tag));
};
function c_(e, t) {
  return Og(e, t);
}
function xN(e, t, n, r) {
  this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
}
function tn(e, t, n, r) {
  return new xN(e, t, n, r);
}
function uf(e) {
  return e = e.prototype, !(!e || !e.isReactComponent);
}
function bN(e) {
  if (typeof e == "function") return uf(e) ? 1 : 0;
  if (e != null) {
    if (e = e.$$typeof, e === Cd) return 11;
    if (e === Td) return 14;
  }
  return 2;
}
function Ir(e, t) {
  var n = e.alternate;
  return n === null ? (n = tn(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
}
function Co(e, t, n, r, s, i) {
  var o = 2;
  if (r = e, typeof e == "function") uf(e) && (o = 1);
  else if (typeof e == "string") o = 5;
  else e: switch (e) {
    case Es:
      return rs(n.children, s, i, t);
    case Ed:
      o = 8, s |= 8;
      break;
    case nu:
      return e = tn(12, n, t, s | 2), e.elementType = nu, e.lanes = i, e;
    case ru:
      return e = tn(13, n, t, s), e.elementType = ru, e.lanes = i, e;
    case su:
      return e = tn(19, n, t, s), e.elementType = su, e.lanes = i, e;
    case yg:
      return Nl(n, s, i, t);
    default:
      if (typeof e == "object" && e !== null) switch (e.$$typeof) {
        case vg:
          o = 10;
          break e;
        case _g:
          o = 9;
          break e;
        case Cd:
          o = 11;
          break e;
        case Td:
          o = 14;
          break e;
        case mr:
          o = 16, r = null;
          break e;
      }
      throw Error(K(130, e == null ? e : typeof e, ""));
  }
  return t = tn(o, n, t, s), t.elementType = e, t.type = r, t.lanes = i, t;
}
function rs(e, t, n, r) {
  return e = tn(7, e, r, t), e.lanes = n, e;
}
function Nl(e, t, n, r) {
  return e = tn(22, e, r, t), e.elementType = yg, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
}
function wc(e, t, n) {
  return e = tn(6, e, null, t), e.lanes = n, e;
}
function Sc(e, t, n) {
  return t = tn(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
}
function wN(e, t, n, r, s) {
  this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = rc(0), this.expirationTimes = rc(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = rc(0), this.identifierPrefix = r, this.onRecoverableError = s, this.mutableSourceEagerHydrationData = null;
}
function df(e, t, n, r, s, i, o, c, u) {
  return e = new wN(e, t, n, c, u), t === 1 ? (t = 1, i === !0 && (t |= 8)) : t = 0, i = tn(3, null, null, t), e.current = i, i.stateNode = e, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Kd(i), e;
}
function SN(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return { $$typeof: js, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
}
function u_(e) {
  if (!e) return Rr;
  e = e._reactInternals;
  e: {
    if (ds(e) !== e || e.tag !== 1) throw Error(K(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (Dt(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(K(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (Dt(n)) return uv(e, n, t);
  }
  return t;
}
function d_(e, t, n, r, s, i, o, c, u) {
  return e = df(n, r, !0, e, s, i, o, c, u), e.context = u_(null), n = e.current, r = jt(), s = Tr(n), i = tr(r, s), i.callback = t ?? null, Er(n, i, s), e.current.lanes = s, bi(e, s, r), Ot(e, r), e;
}
function jl(e, t, n, r) {
  var s = t.current, i = jt(), o = Tr(s);
  return n = u_(n), t.context === null ? t.context = n : t.pendingContext = n, t = tr(i, o), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Er(s, t, o), e !== null && (bn(e, s, o, i), wo(e, s, o)), o;
}
function ll(e) {
  if (e = e.current, !e.child) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function _m(e, t) {
  if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function ff(e, t) {
  _m(e, t), (e = e.alternate) && _m(e, t);
}
function kN() {
  return null;
}
var f_ = typeof reportError == "function" ? reportError : function(e) {
  console.error(e);
};
function pf(e) {
  this._internalRoot = e;
}
El.prototype.render = pf.prototype.render = function(e) {
  var t = this._internalRoot;
  if (t === null) throw Error(K(409));
  jl(e, t, null, null);
};
El.prototype.unmount = pf.prototype.unmount = function() {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    ls(function() {
      jl(null, e, null, null);
    }), t[rr] = null;
  }
};
function El(e) {
  this._internalRoot = e;
}
El.prototype.unstable_scheduleHydration = function(e) {
  if (e) {
    var t = Ug();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < vr.length && t !== 0 && t < vr[n].priority; n++) ;
    vr.splice(n, 0, e), n === 0 && Gg(e);
  }
};
function mf(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
}
function Cl(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
}
function ym() {
}
function NN(e, t, n, r, s) {
  if (s) {
    if (typeof r == "function") {
      var i = r;
      r = function() {
        var p = ll(o);
        i.call(p);
      };
    }
    var o = d_(t, r, e, 0, null, !1, !1, "", ym);
    return e._reactRootContainer = o, e[rr] = o.current, ni(e.nodeType === 8 ? e.parentNode : e), ls(), o;
  }
  for (; s = e.lastChild; ) e.removeChild(s);
  if (typeof r == "function") {
    var c = r;
    r = function() {
      var p = ll(u);
      c.call(p);
    };
  }
  var u = df(e, 0, !1, null, null, !1, !1, "", ym);
  return e._reactRootContainer = u, e[rr] = u.current, ni(e.nodeType === 8 ? e.parentNode : e), ls(function() {
    jl(t, u, n, r);
  }), u;
}
function Tl(e, t, n, r, s) {
  var i = n._reactRootContainer;
  if (i) {
    var o = i;
    if (typeof s == "function") {
      var c = s;
      s = function() {
        var u = ll(o);
        c.call(u);
      };
    }
    jl(t, o, e, s);
  } else o = NN(n, t, e, s, r);
  return ll(o);
}
Hg = function(e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = Ea(t.pendingLanes);
        n !== 0 && (Pd(t, n | 1), Ot(t, Ge()), !(ke & 6) && (Js = Ge() + 500, Lr()));
      }
      break;
    case 13:
      ls(function() {
        var r = sr(e, 1);
        if (r !== null) {
          var s = jt();
          bn(r, e, 1, s);
        }
      }), ff(e, 1);
  }
};
Rd = function(e) {
  if (e.tag === 13) {
    var t = sr(e, 134217728);
    if (t !== null) {
      var n = jt();
      bn(t, e, 134217728, n);
    }
    ff(e, 134217728);
  }
};
Fg = function(e) {
  if (e.tag === 13) {
    var t = Tr(e), n = sr(e, t);
    if (n !== null) {
      var r = jt();
      bn(n, e, t, r);
    }
    ff(e, t);
  }
};
Ug = function() {
  return Ce;
};
Wg = function(e, t) {
  var n = Ce;
  try {
    return Ce = e, t();
  } finally {
    Ce = n;
  }
};
mu = function(e, t, n) {
  switch (t) {
    case "input":
      if (ou(e, n), t = n.name, n.type === "radio" && t != null) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var s = yl(r);
            if (!s) throw Error(K(90));
            bg(r), ou(r, s);
          }
        }
      }
      break;
    case "textarea":
      Sg(e, n);
      break;
    case "select":
      t = n.value, t != null && zs(e, !!n.multiple, t, !1);
  }
};
Ig = of;
Ag = ls;
var jN = { usingClientEntryPoint: !1, Events: [Si, As, yl, Cg, Tg, of] }, wa = { findFiberByHostInstance: Qr, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, EN = { bundleType: wa.bundleType, version: wa.version, rendererPackageName: wa.rendererPackageName, rendererConfig: wa.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ir.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
  return e = Mg(e), e === null ? null : e.stateNode;
}, findFiberByHostInstance: wa.findFiberByHostInstance || kN, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var oo = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!oo.isDisabled && oo.supportsFiber) try {
    hl = oo.inject(EN), Bn = oo;
  } catch {
  }
}
Gt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = jN;
Gt.createPortal = function(e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!mf(t)) throw Error(K(200));
  return SN(e, t, null, n);
};
Gt.createRoot = function(e, t) {
  if (!mf(e)) throw Error(K(299));
  var n = !1, r = "", s = f_;
  return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError)), t = df(e, 1, !1, null, null, n, !1, r, s), e[rr] = t.current, ni(e.nodeType === 8 ? e.parentNode : e), new pf(t);
};
Gt.findDOMNode = function(e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function" ? Error(K(188)) : (e = Object.keys(e).join(","), Error(K(268, e)));
  return e = Mg(t), e = e === null ? null : e.stateNode, e;
};
Gt.flushSync = function(e) {
  return ls(e);
};
Gt.hydrate = function(e, t, n) {
  if (!Cl(t)) throw Error(K(200));
  return Tl(null, e, t, !0, n);
};
Gt.hydrateRoot = function(e, t, n) {
  if (!mf(e)) throw Error(K(405));
  var r = n != null && n.hydratedSources || null, s = !1, i = "", o = f_;
  if (n != null && (n.unstable_strictMode === !0 && (s = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (o = n.onRecoverableError)), t = d_(t, null, e, 1, n ?? null, s, !1, i, o), e[rr] = t.current, ni(e), r) for (e = 0; e < r.length; e++) n = r[e], s = n._getVersion, s = s(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, s] : t.mutableSourceEagerHydrationData.push(
    n,
    s
  );
  return new El(t);
};
Gt.render = function(e, t, n) {
  if (!Cl(t)) throw Error(K(200));
  return Tl(null, e, t, !1, n);
};
Gt.unmountComponentAtNode = function(e) {
  if (!Cl(e)) throw Error(K(40));
  return e._reactRootContainer ? (ls(function() {
    Tl(null, null, e, !1, function() {
      e._reactRootContainer = null, e[rr] = null;
    });
  }), !0) : !1;
};
Gt.unstable_batchedUpdates = of;
Gt.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
  if (!Cl(n)) throw Error(K(200));
  if (e == null || e._reactInternals === void 0) throw Error(K(38));
  return Tl(e, t, n, !1, r);
};
Gt.version = "18.3.1-next-f1338f8080-20240426";
function p_() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(p_);
    } catch (e) {
      console.error(e);
    }
}
p_(), pg.exports = Gt;
var m_ = pg.exports;
const CN = /* @__PURE__ */ od(m_), Il = 0, zr = 1, aa = 2, h_ = 4;
function xm(e) {
  return () => e;
}
function TN(e) {
  e();
}
function g_(e, t) {
  return (n) => e(t(n));
}
function bm(e, t) {
  return () => e(t);
}
function IN(e, t) {
  return (n) => e(t, n);
}
function hf(e) {
  return e !== void 0;
}
function AN(...e) {
  return () => {
    e.map(TN);
  };
}
function ia() {
}
function Al(e, t) {
  return t(e), e;
}
function PN(e, t) {
  return t(e);
}
function Oe(...e) {
  return e;
}
function je(e, t) {
  return e(zr, t);
}
function me(e, t) {
  e(Il, t);
}
function gf(e) {
  e(aa);
}
function ze(e) {
  return e(h_);
}
function te(e, t) {
  return je(e, IN(t, Il));
}
function wn(e, t) {
  const n = e(zr, (r) => {
    n(), t(r);
  });
  return n;
}
function wm(e) {
  let t, n;
  return (r) => (s) => {
    t = s, n && clearTimeout(n), n = setTimeout(() => {
      r(t);
    }, e);
  };
}
function v_(e, t) {
  return e === t;
}
function Me(e = v_) {
  let t;
  return (n) => (r) => {
    e(t, r) || (t = r, n(r));
  };
}
function oe(e) {
  return (t) => (n) => {
    e(n) && t(n);
  };
}
function Q(e) {
  return (t) => g_(t, e);
}
function On(e) {
  return (t) => () => {
    t(e);
  };
}
function G(e, ...t) {
  const n = RN(...t);
  return (r, s) => {
    switch (r) {
      case aa:
        gf(e);
        return;
      case zr:
        return je(e, n(s));
    }
  };
}
function zn(e, t) {
  return (n) => (r) => {
    n(t = e(t, r));
  };
}
function cs(e) {
  return (t) => (n) => {
    e > 0 ? e-- : t(n);
  };
}
function Jn(e) {
  let t = null, n;
  return (r) => (s) => {
    t = s, !n && (n = setTimeout(() => {
      n = void 0, r(t);
    }, e));
  };
}
function he(...e) {
  const t = new Array(e.length);
  let n = 0, r = null;
  const s = 2 ** e.length - 1;
  return e.forEach((i, o) => {
    const c = 2 ** o;
    je(i, (u) => {
      const p = n;
      n |= c, t[o] = u, p !== s && n === s && r && (r(), r = null);
    });
  }), (i) => (o) => {
    const c = () => {
      i([o].concat(t));
    };
    n === s ? c() : r = c;
  };
}
function RN(...e) {
  return (t) => e.reduceRight(PN, t);
}
function MN(e) {
  let t, n;
  const r = () => t?.();
  return function(s, i) {
    switch (s) {
      case zr:
        return i ? n === i ? void 0 : (r(), n = i, t = je(e, i), t) : (r(), ia);
      case aa:
        r(), n = null;
        return;
    }
  };
}
function q(e) {
  let t = e;
  const n = we();
  return (r, s) => {
    switch (r) {
      case Il:
        t = s;
        break;
      case zr: {
        s(t);
        break;
      }
      case h_:
        return t;
    }
    return n(r, s);
  };
}
function wt(e, t) {
  return Al(q(t), (n) => te(e, n));
}
function we() {
  const e = [];
  return (t, n) => {
    switch (t) {
      case Il:
        e.slice().forEach((r) => {
          r(n);
        });
        return;
      case aa:
        e.splice(0, e.length);
        return;
      case zr:
        return e.push(n), () => {
          const r = e.indexOf(n);
          r > -1 && e.splice(r, 1);
        };
    }
  };
}
function Ut(e) {
  return Al(we(), (t) => te(e, t));
}
function Ne(e, t = [], { singleton: n } = { singleton: !0 }) {
  return {
    constructor: e,
    dependencies: t,
    id: DN(),
    singleton: n
  };
}
const DN = () => Symbol();
function ON(e) {
  const t = /* @__PURE__ */ new Map(), n = ({ constructor: r, dependencies: s, id: i, singleton: o }) => {
    if (o && t.has(i))
      return t.get(i);
    const c = r(s.map((u) => n(u)));
    return o && t.set(i, c), c;
  };
  return n(e);
}
function qe(...e) {
  const t = we(), n = new Array(e.length);
  let r = 0;
  const s = 2 ** e.length - 1;
  return e.forEach((i, o) => {
    const c = 2 ** o;
    je(i, (u) => {
      n[o] = u, r |= c, r === s && me(t, n);
    });
  }), function(i, o) {
    switch (i) {
      case aa: {
        gf(t);
        return;
      }
      case zr:
        return r === s && o(n), je(t, o);
    }
  };
}
function ie(e, t = v_) {
  return G(e, Me(t));
}
function Ku(...e) {
  return function(t, n) {
    switch (t) {
      case aa:
        return;
      case zr:
        return AN(...e.map((r) => je(r, n)));
    }
  };
}
const Je = {
  /** Detailed debugging information including item measurements */
  DEBUG: 0,
  /** General informational messages */
  INFO: 1,
  /** Warning messages for potential issues */
  WARN: 2,
  /** Error messages for failures (default level) */
  ERROR: 3
}, LN = {
  [Je.DEBUG]: "debug",
  [Je.ERROR]: "error",
  [Je.INFO]: "log",
  [Je.WARN]: "warn"
}, zN = () => typeof globalThis > "u" ? window : globalThis, Br = Ne(
  () => {
    const e = q(Je.ERROR);
    return {
      log: q((t, n, r = Je.INFO) => {
        const s = zN().VIRTUOSO_LOG_LEVEL ?? ze(e);
        r >= s && console[LN[r]](
          "%creact-virtuoso: %c%s %o",
          "color: #0253b3; font-weight: bold",
          "color: initial",
          t,
          n
        );
      }),
      logLevel: e
    };
  },
  [],
  { singleton: !0 }
), qu = /* @__PURE__ */ new WeakMap();
function __(e) {
  return "self" in e ? e.document.documentElement : e;
}
function BN(e) {
  const t = __(e), n = qu.get(t);
  if (n !== void 0)
    return n;
  const r = t.ownerDocument.defaultView.getComputedStyle(t).direction === "rtl";
  return qu.set(t, r), r;
}
function Sm(e) {
  qu.delete(__(e));
}
function y_(e, t) {
  return BN(e) ? -t : t;
}
const Jr = y_;
function km(e, t) {
  return y_(e, t);
}
function fs(e, t, n) {
  return vf(e, t, n).callbackRef;
}
function vf(e, t, n) {
  const r = J.useRef(null);
  let s = (o) => {
  };
  const i = J.useMemo(() => typeof ResizeObserver < "u" ? new ResizeObserver((o) => {
    const c = () => {
      const u = o[0].target;
      u.offsetParent !== null && e(u);
    };
    n ? c() : requestAnimationFrame(c);
  }) : null, [e, n]);
  return s = (o) => {
    o && t ? (i?.observe(o), r.current = o) : (r.current && i?.unobserve(r.current), r.current = null);
  }, { callbackRef: s, ref: r };
}
function $N(e, t, n, r, s, i, o, c, u) {
  const p = J.useCallback(
    (h) => {
      const x = HN(h.children, t, c ? "offsetWidth" : "offsetHeight", s);
      let g = h.parentElement;
      for (; g.dataset.virtuosoScroller === void 0; )
        g = g.parentElement;
      const w = g.lastElementChild.dataset.viewportType === "window";
      let E;
      w && (E = g.ownerDocument.defaultView);
      const I = o ? c ? o.scrollWidth : o.scrollHeight : w ? c ? E.document.documentElement.scrollWidth : E.document.documentElement.scrollHeight : c ? g.scrollWidth : g.scrollHeight, D = o ? c ? o.offsetWidth : o.offsetHeight : w ? c ? E.innerWidth : E.innerHeight : c ? g.offsetWidth : g.offsetHeight, y = o ? c ? Jr(o, o.scrollLeft) : o.scrollTop : w ? c ? Jr(E, E.scrollX || E.document.documentElement.scrollLeft) : E.scrollY || E.document.documentElement.scrollTop : c ? Jr(g, g.scrollLeft) : g.scrollTop;
      r({
        scrollHeight: I,
        scrollTop: Math.max(y, 0),
        viewportHeight: D
      }), i?.(
        c ? Nm("column-gap", getComputedStyle(h).columnGap, s) : Nm("row-gap", getComputedStyle(h).rowGap, s)
      ), x !== null && e(x);
    },
    [e, t, s, i, o, r, c]
  );
  return vf(p, n, u);
}
function HN(e, t, n, r) {
  const s = e.length;
  if (s === 0)
    return null;
  const i = [];
  for (let o = 0; o < s; o++) {
    const c = e.item(o);
    if (c.dataset.index === void 0)
      continue;
    const u = parseInt(c.dataset.index), p = parseFloat(c.dataset.knownSize), h = t(c, n);
    if (h === 0 && r("Zero-sized element, this should not happen", { child: c }, Je.ERROR), h === p)
      continue;
    const x = i[i.length - 1];
    i.length === 0 || x.size !== h || x.endIndex !== u - 1 ? i.push({ endIndex: u, size: h, startIndex: u }) : i[i.length - 1].endIndex++;
  }
  return i;
}
function Nm(e, t, n) {
  return t !== "normal" && t?.endsWith("px") !== !0 && n(`${e} was not resolved to pixel value correctly`, t, Je.WARN), t === "normal" ? 0 : parseInt(t ?? "0", 10);
}
function x_(e, t, n) {
  const r = J.useRef(null), s = J.useCallback(
    (u) => {
      if (!u?.offsetParent)
        return;
      const p = u.getBoundingClientRect(), h = p.width;
      let x, g;
      if (t) {
        const w = t.getBoundingClientRect(), E = p.top - w.top;
        g = w.height - Math.max(0, E), x = E + t.scrollTop;
      } else {
        const w = o.current.ownerDocument.defaultView;
        g = w.innerHeight - Math.max(0, p.top), x = p.top + w.scrollY;
      }
      r.current = {
        listHeight: p.height,
        offsetTop: x,
        visibleHeight: g,
        visibleWidth: h
      }, e(r.current);
    },
    // oxlint-disable-next-line exhaustive-deps
    [e, t]
  ), { callbackRef: i, ref: o } = vf(s, !0, n), c = J.useCallback(() => {
    s(o.current);
  }, [s, o]);
  return J.useEffect(() => {
    if (t) {
      t.addEventListener("scroll", c);
      const p = new ResizeObserver(() => {
        requestAnimationFrame(c);
      });
      return p.observe(t), () => {
        t.removeEventListener("scroll", c), p.unobserve(t);
      };
    }
    const u = o.current?.ownerDocument.defaultView;
    return u?.addEventListener("scroll", c), u?.addEventListener("resize", c), () => {
      u?.removeEventListener("scroll", c), u?.removeEventListener("resize", c);
    };
  }, [c, t, o]), i;
}
const It = Ne(
  () => {
    const e = we(), t = we(), n = q(0), r = we(), s = q(0), i = we(), o = we(), c = q(0), u = q(0), p = q(0), h = q(0), x = we(), g = we(), w = q(!1), E = q(!1), I = q(!1);
    return te(
      G(
        e,
        Q(({ scrollTop: D }) => D)
      ),
      t
    ), te(
      G(
        e,
        Q(({ scrollHeight: D }) => D)
      ),
      o
    ), te(t, s), {
      deviation: n,
      fixedFooterHeight: p,
      fixedHeaderHeight: u,
      footerHeight: h,
      headerHeight: c,
      horizontalDirection: E,
      scrollBy: g,
      // input
      scrollContainerState: e,
      scrollHeight: o,
      scrollingInProgress: w,
      // signals
      scrollTo: x,
      scrollTop: t,
      skipAnimationFrameInResizeObserver: I,
      smoothScrollTargetReached: r,
      // state
      statefulScrollTop: s,
      viewportHeight: i
    };
  },
  [],
  { singleton: !0 }
), di = { lvl: 0 };
function b_(e, t) {
  const n = e.length;
  if (n === 0)
    return [];
  let { index: r, value: s } = t(e[0]);
  const i = [];
  for (let o = 1; o < n; o++) {
    const { index: c, value: u } = t(e[o]);
    i.push({ end: c - 1, start: r, value: s }), r = c, s = u;
  }
  return i.push({ end: 1 / 0, start: r, value: s }), i;
}
function Ie(e) {
  return e === di;
}
function fi(e, t) {
  if (!Ie(e))
    return t === e.k ? e.v : t < e.k ? fi(e.l, t) : fi(e.r, t);
}
function kn(e, t, n = "k") {
  if (Ie(e))
    return [-1 / 0, void 0];
  if (Number(e[n]) === t)
    return [e.k, e.v];
  if (Number(e[n]) < t) {
    const r = kn(e.r, t, n);
    return r[0] === -1 / 0 ? [e.k, e.v] : r;
  }
  return kn(e.l, t, n);
}
function $t(e, t, n) {
  return Ie(e) ? k_(t, n, 1) : t === e.k ? Xe(e, { k: t, v: n }) : t < e.k ? jm(Xe(e, { l: $t(e.l, t, n) })) : jm(Xe(e, { r: $t(e.r, t, n) }));
}
function Ws() {
  return di;
}
function Gs(e, t, n) {
  if (Ie(e))
    return [];
  const r = kn(e, t)[0];
  return FN(Qu(e, r, n));
}
function Yu(e, t) {
  if (Ie(e))
    return di;
  const { k: n, l: r, r: s } = e;
  if (t === n) {
    if (Ie(r))
      return s;
    if (Ie(s))
      return r;
    const [i, o] = S_(r);
    return To(Xe(e, { k: i, l: w_(r), v: o }));
  }
  return t < n ? To(Xe(e, { l: Yu(r, t) })) : To(Xe(e, { r: Yu(s, t) }));
}
function es(e) {
  return Ie(e) ? [] : [...es(e.l), { k: e.k, v: e.v }, ...es(e.r)];
}
function Qu(e, t, n) {
  if (Ie(e))
    return [];
  const { k: r, l: s, r: i, v: o } = e;
  let c = [];
  return r > t && (c = c.concat(Qu(s, t, n))), r >= t && r <= n && c.push({ k: r, v: o }), r <= n && (c = c.concat(Qu(i, t, n))), c;
}
function To(e) {
  const { l: t, lvl: n, r } = e;
  if (r.lvl >= n - 1 && t.lvl >= n - 1)
    return e;
  if (n > r.lvl + 1) {
    if (kc(t))
      return N_(Xe(e, { lvl: n - 1 }));
    if (!Ie(t) && !Ie(t.r))
      return Xe(t.r, {
        l: Xe(t, { r: t.r.l }),
        lvl: n,
        r: Xe(e, {
          l: t.r.r,
          lvl: n - 1
        })
      });
    throw new Error("Unexpected empty nodes");
  }
  if (kc(e))
    return Xu(Xe(e, { lvl: n - 1 }));
  if (!Ie(r) && !Ie(r.l)) {
    const s = r.l, i = kc(s) ? r.lvl - 1 : r.lvl;
    return Xe(s, {
      l: Xe(e, {
        lvl: n - 1,
        r: s.l
      }),
      lvl: s.lvl + 1,
      r: Xu(Xe(r, { l: s.r, lvl: i }))
    });
  }
  throw new Error("Unexpected empty nodes");
}
function Xe(e, t) {
  return k_(
    t.k !== void 0 ? t.k : e.k,
    t.v !== void 0 ? t.v : e.v,
    t.lvl !== void 0 ? t.lvl : e.lvl,
    t.l !== void 0 ? t.l : e.l,
    t.r !== void 0 ? t.r : e.r
  );
}
function w_(e) {
  return Ie(e.r) ? e.l : To(Xe(e, { r: w_(e.r) }));
}
function kc(e) {
  return Ie(e) || e.lvl > e.r.lvl;
}
function S_(e) {
  return Ie(e.r) ? [e.k, e.v] : S_(e.r);
}
function k_(e, t, n, r = di, s = di) {
  return { k: e, l: r, lvl: n, r: s, v: t };
}
function jm(e) {
  return Xu(N_(e));
}
function N_(e) {
  const { l: t } = e;
  return !Ie(t) && t.lvl === e.lvl ? Xe(t, { r: Xe(e, { l: t.r }) }) : e;
}
function Xu(e) {
  const { lvl: t, r: n } = e;
  return !Ie(n) && !Ie(n.r) && n.lvl === t && n.r.lvl === t ? Xe(n, { l: Xe(e, { r: n.l }), lvl: t + 1 }) : e;
}
function FN(e) {
  return b_(e, ({ k: t, v: n }) => ({ index: t, value: n }));
}
function j_(e, t) {
  return !!(e && e.startIndex === t.startIndex && e.endIndex === t.endIndex);
}
function pi(e, t) {
  return !!(e && e[0] === t[0] && e[1] === t[1]);
}
const _f = Ne(
  () => ({ recalcInProgress: q(!1) }),
  [],
  { singleton: !0 }
);
function E_(e, t, n) {
  return e[cl(e, t, n)];
}
function cl(e, t, n, r = 0) {
  let s = e.length - 1;
  for (; r <= s; ) {
    const i = Math.floor((r + s) / 2), o = e[i], c = n(o, t);
    if (c === 0)
      return i;
    if (c === -1) {
      if (s - r < 2)
        return i - 1;
      s = i - 1;
    } else {
      if (s === r)
        return i;
      r = i + 1;
    }
  }
  throw new Error(`Failed binary finding record in array - ${e.join(",")}, searched for ${t}`);
}
function UN(e, t, n, r) {
  const s = cl(e, t, r), i = cl(e, n, r, s);
  return e.slice(s, i + 1);
}
function Mr(e, t) {
  return Math.round(e.getBoundingClientRect()[t]);
}
function Pl(e) {
  return !Ie(e.groupOffsetTree);
}
function yf({ index: e }, t) {
  return t === e ? 0 : t < e ? -1 : 1;
}
function WN() {
  return {
    groupIndices: [],
    groupOffsetTree: Ws(),
    lastIndex: 0,
    lastOffset: 0,
    lastSize: 0,
    offsetTree: [],
    sizeTree: Ws()
  };
}
function GN(e, t) {
  let n = Ie(e) ? 0 : 1 / 0;
  for (const r of t) {
    const { endIndex: s, size: i, startIndex: o } = r;
    if (n = Math.min(n, o), Ie(e)) {
      e = $t(e, 0, i);
      continue;
    }
    const c = Gs(e, o - 1, s + 1);
    if (c.some(ZN(r)))
      continue;
    let u = !1, p = !1;
    for (const { end: h, start: x, value: g } of c)
      u ? (s >= x || i === g) && (e = Yu(e, x)) : (p = g !== i, u = !0), h > s && s >= x && g !== i && (e = $t(e, s + 1, g));
    p && (e = $t(e, o, i));
  }
  return [e, n];
}
function VN(e) {
  return typeof e.groupIndex < "u";
}
function KN({ offset: e }, t) {
  return t === e ? 0 : t < e ? -1 : 1;
}
function mi(e, t, n) {
  if (t.length === 0)
    return 0;
  const { index: r, offset: s, size: i } = E_(t, e, yf), o = e - r, c = i * o + (o - 1) * n + s;
  return c > 0 ? c + n : c;
}
function C_(e, t) {
  if (!Pl(t))
    return e;
  let n = 0;
  for (; t.groupIndices[n] <= e + n; )
    n++;
  return e + n;
}
function T_(e, t, n) {
  if (VN(e))
    return t.groupIndices[e.groupIndex] + 1;
  const r = e.index === "LAST" ? n : e.index;
  let s = C_(r, t);
  return s = Math.max(0, s, Math.min(n, s)), s;
}
function qN(e, t, n, r = 0) {
  return r > 0 && (t = Math.max(t, E_(e, r, yf).offset)), b_(UN(e, t, n, KN), XN);
}
function YN(e, [t, n, r, s]) {
  t.length > 0 && r("received item sizes", t, Je.DEBUG);
  const i = e.sizeTree;
  let o = i, c = 0;
  if (n.length > 0 && Ie(i) && t.length === 2) {
    const g = t[0].size, w = t[1].size;
    o = n.reduce((E, I) => $t($t(E, I, g), I + 1, w), o);
  } else
    [o, c] = GN(o, t);
  if (o === i)
    return e;
  const { lastIndex: u, lastOffset: p, lastSize: h, offsetTree: x } = Zu(e.offsetTree, c, o, s);
  return {
    groupIndices: n,
    groupOffsetTree: n.reduce((g, w) => $t(g, w, mi(w, x, s)), Ws()),
    lastIndex: u,
    lastOffset: p,
    lastSize: h,
    offsetTree: x,
    sizeTree: o
  };
}
function QN(e) {
  return es(e).map(({ k: t, v: n }, r, s) => {
    const i = s[r + 1];
    return { endIndex: i !== void 0 ? i.k - 1 : 1 / 0, size: n, startIndex: t };
  });
}
function Em(e, t) {
  let n = 0, r = 0;
  for (; n < e; )
    n += t[r + 1] - t[r] - 1, r++;
  return r - (n === e ? 0 : 1);
}
function Zu(e, t, n, r) {
  let s = e, i = 0, o = 0, c = 0, u = 0;
  if (t !== 0) {
    u = cl(s, t - 1, yf), c = s[u].offset;
    const p = kn(n, t - 1);
    i = p[0], o = p[1], s.length && s[u].size === kn(n, t)[1] && (u -= 1), s = s.slice(0, u + 1);
  } else
    s = [];
  for (const { start: p, value: h } of Gs(n, t, 1 / 0)) {
    const x = p - i, g = x * o + c + x * r;
    s.push({
      index: p,
      offset: g,
      size: h
    }), i = p, c = g, o = h;
  }
  return {
    lastIndex: i,
    lastOffset: c,
    lastSize: o,
    offsetTree: s
  };
}
function XN(e) {
  return { index: e.index, value: e };
}
function ZN(e) {
  const { endIndex: t, size: n, startIndex: r } = e;
  return (s) => s.start === r && (s.end === t || s.end === 1 / 0) && s.value === n;
}
const JN = {
  offsetHeight: "height",
  offsetWidth: "width"
}, Fn = Ne(
  ([{ log: e }, { recalcInProgress: t }]) => {
    const n = we(), r = we(), s = wt(r, 0), i = we(), o = we(), c = q(0), u = q([]), p = q(void 0), h = q(void 0), x = q(void 0), g = q(void 0), w = q((m, v) => Mr(m, JN[v])), E = q(void 0), I = q(0), D = WN(), y = wt(
      G(n, he(u, e, I), zn(YN, D), Me()),
      D
    ), b = wt(
      G(
        u,
        Me(),
        zn((m, v) => ({ current: v, prev: m.current }), {
          current: [],
          prev: []
        }),
        Q(({ prev: m }) => m)
      ),
      []
    );
    te(
      G(
        u,
        oe((m) => m.length > 0),
        he(y, I),
        Q(([m, v, k]) => {
          const S = m.reduce((C, L, B) => $t(C, L, mi(L, v.offsetTree, k) || B), Ws());
          return {
            ...v,
            groupIndices: m,
            groupOffsetTree: S
          };
        })
      ),
      y
    ), te(
      G(
        r,
        he(y),
        oe(([m, { lastIndex: v }]) => m < v),
        Q(([m, { lastIndex: v, lastSize: k }]) => [
          {
            endIndex: v,
            size: k,
            startIndex: m
          }
        ])
      ),
      n
    ), te(p, h);
    const N = wt(
      G(
        p,
        Q((m) => m === void 0)
      ),
      !0
    );
    te(
      G(
        h,
        oe((m) => m !== void 0 && Ie(ze(y).sizeTree)),
        Q((m) => {
          const v = ze(x), k = ze(u).length > 0;
          return v !== void 0 && v !== 0 ? k ? [
            { endIndex: 0, size: v, startIndex: 0 },
            { endIndex: 1, size: m, startIndex: 1 }
          ] : [] : [{ endIndex: 0, size: m, startIndex: 0 }];
        })
      ),
      n
    ), te(
      G(
        g,
        oe((m) => m !== void 0 && m.length > 0 && Ie(ze(y).sizeTree)),
        Q((m) => {
          const v = [];
          let k = m[0], S = 0;
          for (let C = 1; C < m.length; C++) {
            const L = m[C];
            L !== k && (v.push({
              endIndex: C - 1,
              size: k,
              startIndex: S
            }), k = L, S = C);
          }
          return v.push({
            endIndex: m.length - 1,
            size: k,
            startIndex: S
          }), v;
        })
      ),
      n
    ), te(
      G(
        u,
        he(x, h),
        oe(([, m, v]) => m !== void 0 && v !== void 0),
        Q(([m, v, k]) => {
          const S = [];
          for (let C = 0; C < m.length; C++) {
            const L = m[C], B = m[C + 1];
            S.push({
              startIndex: L,
              endIndex: L,
              size: v
            }), B !== void 0 && S.push({
              startIndex: L + 1,
              endIndex: B - 1,
              size: k
            });
          }
          return S;
        })
      ),
      n
    );
    const l = Ut(
      G(
        n,
        he(y),
        zn(
          ({ sizes: m }, [v, k]) => ({
            changed: k !== m,
            sizes: k
          }),
          { changed: !1, sizes: D }
        ),
        Q((m) => m.changed)
      )
    );
    je(
      G(
        c,
        zn(
          (m, v) => ({ diff: m.prev - v, prev: v }),
          { diff: 0, prev: 0 }
        ),
        Q((m) => m.diff)
      ),
      (m) => {
        const { groupIndices: v } = ze(y);
        if (m > 0)
          me(t, !0), me(i, m + Em(m, v));
        else if (m < 0) {
          const k = ze(b);
          k.length > 0 && (m -= Em(-m, k)), me(o, m);
        }
      }
    ), je(G(c, he(e)), ([m, v]) => {
      m < 0 && v(
        "`firstItemIndex` prop should not be set to less than zero. If you don't know the total count, just use a very high value",
        { firstItemIndex: c },
        Je.ERROR
      );
    });
    const d = Ut(i);
    te(
      G(
        i,
        he(y),
        Q(([m, v]) => {
          const k = v.groupIndices.length > 0, S = [], C = v.lastSize;
          if (k) {
            const L = fi(v.sizeTree, 0);
            let B = 0, A = 0;
            for (; B < m; ) {
              const j = v.groupIndices[A], $ = v.groupIndices.length === A + 1 ? 1 / 0 : v.groupIndices[A + 1] - j - 1;
              S.push({
                endIndex: j,
                size: L,
                startIndex: j
              }), S.push({
                endIndex: j + 1 + $ - 1,
                size: C,
                startIndex: j + 1
              }), A++, B += $ + 1;
            }
            const z = es(v.sizeTree);
            return B !== m && z.shift(), z.reduce(
              (j, { k: $, v: O }) => {
                let F = j.ranges;
                return j.prevSize !== 0 && (F = [
                  ...j.ranges,
                  {
                    endIndex: $ + m - 1,
                    size: j.prevSize,
                    startIndex: j.prevIndex
                  }
                ]), {
                  prevIndex: $ + m,
                  prevSize: O,
                  ranges: F
                };
              },
              {
                prevIndex: m,
                prevSize: 0,
                ranges: S
              }
            ).ranges;
          }
          return es(v.sizeTree).reduce(
            (L, { k: B, v: A }) => ({
              prevIndex: B + m,
              prevSize: A,
              ranges: [...L.ranges, { endIndex: B + m - 1, size: L.prevSize, startIndex: L.prevIndex }]
            }),
            {
              prevIndex: 0,
              prevSize: C,
              ranges: []
            }
          ).ranges;
        })
      ),
      n
    );
    const f = Ut(
      G(
        o,
        he(y, I),
        Q(([m, { offsetTree: v }, k]) => {
          const S = -m;
          return mi(S, v, k);
        })
      )
    );
    return te(
      G(
        o,
        he(y, I),
        Q(([m, v, k]) => {
          if (v.groupIndices.length > 0) {
            if (Ie(v.sizeTree))
              return v;
            let C = Ws();
            const L = ze(b);
            let B = 0, A = 0, z = 0;
            for (; B < -m; ) {
              z = L[A];
              const j = L[A + 1] - z - 1;
              A++, B += j + 1;
            }
            if (C = es(v.sizeTree).reduce((j, { k: $, v: O }) => $t(j, Math.max(0, $ + m), O), C), B !== -m) {
              const j = fi(v.sizeTree, z);
              C = $t(C, 0, j);
              const $ = kn(v.sizeTree, -m + 1)[1];
              C = $t(C, 1, $);
            }
            return {
              ...v,
              sizeTree: C,
              ...Zu(v.offsetTree, 0, C, k)
            };
          }
          const S = es(v.sizeTree).reduce((C, { k: L, v: B }) => $t(C, Math.max(0, L + m), B), Ws());
          return {
            ...v,
            sizeTree: S,
            ...Zu(v.offsetTree, 0, S, k)
          };
        })
      ),
      y
    ), {
      beforeUnshiftWith: d,
      // input
      data: E,
      defaultItemSize: h,
      firstItemIndex: c,
      fixedItemSize: p,
      fixedGroupSize: x,
      gap: I,
      groupIndices: u,
      heightEstimates: g,
      itemSize: w,
      listRefresh: l,
      shiftWith: o,
      shiftWithOffset: f,
      sizeRanges: n,
      // output
      sizes: y,
      statefulTotalCount: s,
      totalCount: r,
      trackItemSizes: N,
      unshiftWith: i
    };
  },
  Oe(Br, _f),
  { singleton: !0 }
);
function ej(e) {
  return e.reduce(
    (t, n) => (t.groupIndices.push(t.totalCount), t.totalCount += n + 1, t),
    {
      groupIndices: [],
      totalCount: 0
    }
  );
}
const I_ = Ne(
  ([{ groupIndices: e, sizes: t, totalCount: n }, { headerHeight: r, scrollTop: s }]) => {
    const i = we(), o = we(), c = Ut(G(i, Q(ej)));
    return te(
      G(
        c,
        Q((u) => u.totalCount)
      ),
      n
    ), te(
      G(
        c,
        Q((u) => u.groupIndices)
      ),
      e
    ), te(
      G(
        qe(s, t, r),
        oe(([u, p]) => Pl(p)),
        Q(([u, p, h]) => kn(p.groupOffsetTree, Math.max(u - h, 0), "v")[0]),
        Me(),
        Q((u) => [u])
      ),
      o
    ), { groupCounts: i, topItemsIndexes: o };
  },
  Oe(Fn, It)
), $r = Ne(
  ([{ log: e }]) => {
    const t = q(!1), n = Ut(
      G(
        t,
        oe((r) => r),
        Me()
      )
    );
    return je(t, (r) => {
      r && ze(e)("props updated", {}, Je.DEBUG);
    }), { didMount: n, propsReady: t };
  },
  Oe(Br),
  { singleton: !0 }
), tj = typeof document < "u" && "scrollBehavior" in document.documentElement.style;
function A_(e) {
  const t = typeof e == "number" ? { index: e } : e;
  return t.align || (t.align = "start"), (!t.behavior || !tj) && (t.behavior = "auto"), t.offset === void 0 && (t.offset = 0), t;
}
const Ni = Ne(
  ([
    { gap: e, listRefresh: t, sizes: n, totalCount: r },
    {
      fixedFooterHeight: s,
      fixedHeaderHeight: i,
      footerHeight: o,
      headerHeight: c,
      scrollingInProgress: u,
      scrollTo: p,
      smoothScrollTargetReached: h,
      viewportHeight: x
    },
    { log: g }
  ]) => {
    const w = we(), E = we(), I = q(0);
    let D = null, y = null, b = null;
    function N() {
      D !== null && (D(), D = null), b !== null && (b(), b = null), y && (clearTimeout(y), y = null), me(u, !1);
    }
    return te(
      G(
        w,
        he(n, x, r, I, c, o, g),
        he(e, i, s),
        Q(
          ([
            [l, d, f, m, v, k, S, C],
            L,
            B,
            A
          ]) => {
            const z = A_(l), { align: j, behavior: $, offset: O } = z, F = m - 1, U = T_(z, d, F);
            let V = mi(U, d.offsetTree, L) + k;
            j === "end" ? (V += B + kn(d.sizeTree, U)[1] - f + A, U === F && (V += S)) : j === "center" ? V += (B + kn(d.sizeTree, U)[1] - f + A) / 2 : V -= v, O !== void 0 && O !== 0 && (V += O);
            const Z = (le) => {
              N(), le ? (C("retrying to scroll to", { location: l }, Je.DEBUG), me(w, l)) : (me(E, !0), C("list did not change, scroll successful", {}, Je.DEBUG));
            };
            if (N(), $ === "smooth") {
              let le = !1;
              b = je(t, (se) => {
                le = le || se;
              }), D = wn(h, () => {
                Z(le);
              });
            } else
              D = wn(G(t, nj(150)), Z);
            return y = setTimeout(() => {
              N();
            }, 1200), me(u, !0), C("scrolling from index to", { behavior: $, index: U, top: V }, Je.DEBUG), { behavior: $, top: V };
          }
        )
      ),
      p
    ), {
      scrollTargetReached: E,
      scrollToIndex: w,
      topListHeight: I
    };
  },
  Oe(Fn, It, Br),
  { singleton: !0 }
);
function nj(e) {
  return (t) => {
    const n = setTimeout(() => {
      t(!1);
    }, e);
    return (r) => {
      r && (t(!0), clearTimeout(n));
    };
  };
}
function xf(e, t) {
  e === 0 ? t() : requestAnimationFrame(() => {
    xf(e - 1, t);
  });
}
function bf(e, t) {
  const n = t - 1;
  return typeof e == "number" ? e : e.index === "LAST" ? n : e.index;
}
const ji = Ne(
  ([{ defaultItemSize: e, listRefresh: t, sizes: n }, { scrollTop: r }, { scrollTargetReached: s, scrollToIndex: i }, { didMount: o }]) => {
    const c = q(!0), u = q(0), p = q(!0);
    return te(
      G(
        o,
        he(u),
        oe(([h, x]) => x !== 0),
        On(!1)
      ),
      c
    ), te(
      G(
        o,
        he(u),
        oe(([h, x]) => x !== 0),
        On(!1)
      ),
      p
    ), je(
      G(
        qe(t, o),
        he(c, n, e, p),
        oe(([[, h], x, { sizeTree: g }, w, E]) => h && (!Ie(g) || hf(w)) && !x && !E),
        he(u)
      ),
      ([, h]) => {
        wn(s, () => {
          me(p, !0);
        }), xf(4, () => {
          wn(r, () => {
            me(c, !0);
          }), me(i, h);
        });
      }
    ), {
      initialItemFinalLocationReached: p,
      initialTopMostItemIndex: u,
      scrolledToInitialItem: c
    };
  },
  Oe(Fn, It, Ni, $r),
  { singleton: !0 }
);
function P_(e, t) {
  return Math.abs(e - t) < 1.01;
}
const hi = "up", Ua = "down", rj = "none", sj = {
  atBottom: !1,
  notAtBottomBecause: "NOT_SHOWING_LAST_ITEM",
  state: {
    offsetBottom: 0,
    scrollHeight: 0,
    scrollTop: 0,
    viewportHeight: 0
  }
}, aj = 0, Ei = Ne(([{ footerHeight: e, headerHeight: t, scrollBy: n, scrollContainerState: r, scrollTop: s, viewportHeight: i }]) => {
  const o = q(!1), c = q(!0), u = we(), p = we(), h = q(4), x = q(aj), g = wt(
    G(
      Ku(G(ie(s), cs(1), On(!0)), G(ie(s), cs(1), On(!1), wm(100))),
      Me()
    ),
    !1
  ), w = wt(
    G(Ku(G(n, On(!0)), G(n, On(!1), wm(200))), Me()),
    !1
  );
  te(
    G(
      qe(ie(s), ie(x)),
      Q(([b, N]) => b <= N),
      Me()
    ),
    c
  ), te(G(c, Jn(50)), p);
  const E = Ut(
    G(
      qe(r, ie(i), ie(t), ie(e), ie(h)),
      zn((b, [{ scrollHeight: N, scrollTop: l }, d, f, m, v]) => {
        const k = l + d - N > -v, S = {
          scrollHeight: N,
          scrollTop: l,
          viewportHeight: d
        };
        if (k) {
          let L, B;
          return l > b.state.scrollTop ? (L = "SCROLLED_DOWN", B = b.state.scrollTop - l) : (L = "SIZE_DECREASED", B = b.state.scrollTop - l || b.scrollTopDelta), {
            atBottom: !0,
            atBottomBecause: L,
            scrollTopDelta: B,
            state: S
          };
        }
        let C;
        return S.scrollHeight > b.state.scrollHeight ? C = "SIZE_INCREASED" : d < b.state.viewportHeight ? C = "VIEWPORT_HEIGHT_DECREASING" : l < b.state.scrollTop ? C = "SCROLLING_UPWARDS" : C = "NOT_FULLY_SCROLLED_TO_LAST_ITEM_BOTTOM", {
          atBottom: !1,
          notAtBottomBecause: C,
          state: S
        };
      }, sj),
      Me((b, N) => b !== void 0 && b.atBottom === N.atBottom)
    )
  ), I = wt(
    G(
      r,
      zn(
        (b, { scrollHeight: N, scrollTop: l, viewportHeight: d }) => {
          if (!P_(b.scrollHeight, N)) {
            const f = N - (l + d) < 1;
            return b.scrollTop !== l && f ? {
              changed: !0,
              jump: b.scrollTop - l,
              scrollHeight: N,
              scrollTop: l
            } : {
              changed: !0,
              jump: 0,
              scrollHeight: N,
              scrollTop: l
            };
          }
          return {
            changed: !1,
            jump: 0,
            scrollHeight: N,
            scrollTop: l
          };
        },
        { changed: !1, jump: 0, scrollHeight: 0, scrollTop: 0 }
      ),
      oe((b) => b.changed),
      Q((b) => b.jump)
    ),
    0
  );
  te(
    G(
      E,
      Q((b) => b.atBottom)
    ),
    o
  ), te(G(o, Jn(50)), u);
  const D = q(Ua);
  te(
    G(
      r,
      Q(({ scrollTop: b }) => b),
      Me(),
      zn(
        (b, N) => ze(w) ? { direction: b.direction, prevScrollTop: N } : { direction: N < b.prevScrollTop ? hi : Ua, prevScrollTop: N },
        { direction: Ua, prevScrollTop: 0 }
      ),
      Q((b) => b.direction)
    ),
    D
  ), te(G(r, Jn(50), On(rj)), D);
  const y = q(0);
  return te(
    G(
      g,
      oe((b) => !b),
      On(0)
    ),
    y
  ), te(
    G(
      s,
      Jn(100),
      he(g),
      oe(([b, N]) => N),
      zn(([b, N], [l]) => [N, l], [0, 0]),
      Q(([b, N]) => N - b)
    ),
    y
  ), {
    atBottomState: E,
    atBottomStateChange: u,
    atBottomThreshold: h,
    atTopStateChange: p,
    atTopThreshold: x,
    isAtBottom: o,
    isAtTop: c,
    isScrolling: g,
    lastJumpDueToItemResize: I,
    scrollDirection: D,
    scrollVelocity: y
  };
}, Oe(It)), gi = "top", vi = "bottom", Cm = "none";
function Tm(e, t, n) {
  return typeof e == "number" ? n === hi && t === gi || n === Ua && t === vi ? e : 0 : n === hi ? t === gi ? e.main : e.reverse : t === vi ? e.main : e.reverse;
}
function Im(e, t) {
  return typeof e == "number" ? e : e[t] ?? 0;
}
const wf = Ne(
  ([{ deviation: e, fixedHeaderHeight: t, headerHeight: n, scrollTop: r, viewportHeight: s }]) => {
    const i = we(), o = q(0), c = q(0), u = q(0), p = wt(
      G(
        qe(
          ie(r),
          ie(s),
          ie(n),
          ie(i, pi),
          ie(u),
          ie(o),
          ie(t),
          ie(e),
          ie(c)
        ),
        Q(
          ([
            h,
            x,
            g,
            [w, E],
            I,
            D,
            y,
            b,
            N
          ]) => {
            const l = h - b, d = D + y, f = Math.max(g - l, 0);
            let m = Cm;
            const v = Im(N, gi), k = Im(N, vi);
            return w -= b, w += g + y, E += g + y, E -= b, w > h + d - v && (m = hi), E < h - f + x + k && (m = Ua), m !== Cm ? [
              Math.max(l - g - Tm(I, gi, m) - v, 0),
              l - f - y + x + Tm(I, vi, m) + k
            ] : null;
          }
        ),
        oe((h) => h !== null),
        Me(pi)
      ),
      [0, 0]
    );
    return {
      increaseViewportBy: c,
      // input
      listBoundary: i,
      overscan: u,
      topListHeight: o,
      // output
      visibleRange: p
    };
  },
  Oe(It),
  { singleton: !0 }
);
function ij(e, t, n) {
  if (Pl(t)) {
    const r = C_(e, t);
    return [
      { index: kn(t.groupOffsetTree, r)[0], offset: 0, size: 0 },
      { data: n?.[0], index: r, offset: 0, size: 0 }
    ];
  }
  return [{ data: n?.[0], index: e, offset: 0, size: 0 }];
}
const Nc = {
  bottom: 0,
  firstItemIndex: 0,
  items: [],
  offsetBottom: 0,
  offsetTop: 0,
  top: 0,
  topItems: [],
  topListHeight: 0,
  totalCount: 0
};
function Io(e, t, n, r, s, i) {
  const { lastIndex: o, lastOffset: c, lastSize: u } = s;
  let p = 0, h = 0;
  if (e.length > 0) {
    p = e[0].offset;
    const I = e[e.length - 1];
    h = I.offset + I.size;
  }
  const x = n - o, g = c + x * u + (x - 1) * r, w = p, E = g - h;
  return {
    bottom: h,
    firstItemIndex: i,
    items: Am(e, s, i),
    offsetBottom: E,
    offsetTop: p,
    top: w,
    topItems: Am(t, s, i),
    topListHeight: t.reduce((I, D) => D.size + I, 0),
    totalCount: n
  };
}
function R_(e, t, n, r, s, i) {
  let o = 0;
  if (n.groupIndices.length > 0)
    for (const h of n.groupIndices) {
      if (h - o >= e)
        break;
      o++;
    }
  const c = e + o, u = bf(t, c), p = Array.from({ length: c }).map((h, x) => ({
    data: i[x + u],
    index: x + u,
    offset: 0,
    size: 0
  }));
  return Io(p, [], c, s, n, r);
}
function Am(e, t, n) {
  if (e.length === 0)
    return [];
  if (!Pl(t))
    return e.map((p) => ({ ...p, index: p.index + n, originalIndex: p.index }));
  const r = e[0].index, s = e[e.length - 1].index, i = [], o = Gs(t.groupOffsetTree, r, s);
  let c, u = 0;
  for (const p of e) {
    (!c || c.end < p.index) && (c = o.shift(), u = t.groupIndices.indexOf(c.start));
    let h;
    p.index === c.start ? h = {
      index: u,
      type: "group"
    } : h = {
      groupIndex: u,
      index: p.index - (u + 1) + n
    }, i.push({
      ...h,
      data: p.data,
      offset: p.offset,
      originalIndex: p.index,
      size: p.size
    });
  }
  return i;
}
function Pm(e, t) {
  return e === void 0 ? 0 : typeof e == "number" ? e : e[t] ?? 0;
}
const ps = Ne(
  ([
    { data: e, firstItemIndex: t, gap: n, sizes: r, totalCount: s },
    i,
    { listBoundary: o, topListHeight: c, visibleRange: u },
    { initialTopMostItemIndex: p, scrolledToInitialItem: h },
    { topListHeight: x },
    g,
    { didMount: w },
    { recalcInProgress: E }
  ]) => {
    const I = q([]), D = q(0), y = we(), b = q(0);
    te(i.topItemsIndexes, I);
    const N = wt(
      G(
        qe(
          w,
          E,
          ie(u, pi),
          ie(s),
          ie(r),
          ie(p),
          h,
          ie(I),
          ie(t),
          ie(n),
          ie(b),
          e
        ),
        oe(([m, v, , k, , , , , , , , S]) => {
          const C = S !== void 0 && S.length !== k;
          return m && !v && !C;
        }),
        Q(
          ([
            ,
            ,
            [m, v],
            k,
            S,
            C,
            L,
            B,
            A,
            z,
            j,
            $
          ]) => {
            const O = S, { offsetTree: F, sizeTree: U } = O, V = ze(D);
            if (k === 0)
              return { ...Nc, totalCount: k };
            if (m === 0 && v === 0)
              return V === 0 ? { ...Nc, totalCount: k } : R_(V, C, S, A, z, $ || []);
            if (Ie(U))
              return V > 0 ? null : Io(
                ij(bf(C, k), O, $),
                [],
                k,
                z,
                O,
                A
              );
            const Z = [];
            if (B.length > 0) {
              const ae = B[0], fe = B[B.length - 1];
              let ge = 0;
              for (const Se of Gs(U, ae, fe)) {
                const xe = Se.value, Te = Math.max(Se.start, ae), et = Math.min(Se.end, fe);
                for (let Ee = Te; Ee <= et; Ee++)
                  Z.push({ data: $?.[Ee], index: Ee, offset: ge, size: xe }), ge += xe;
              }
            }
            if (!L)
              return Io([], Z, k, z, O, A);
            const le = B.length > 0 ? B[B.length - 1] + 1 : 0, se = qN(F, m, v, le);
            if (se.length === 0)
              return null;
            const _e = k - 1, ne = Al([], (ae) => {
              for (const fe of se) {
                const ge = fe.value;
                let Se = ge.offset, xe = fe.start;
                const Te = ge.size;
                if (ge.offset < m) {
                  xe += Math.floor((m - ge.offset + z) / (Te + z));
                  const Ee = xe - fe.start;
                  Se += Ee * Te + Ee * z;
                }
                xe < le && (Se += (le - xe) * Te, xe = le);
                const et = Math.min(fe.end, _e);
                for (let Ee = xe; Ee <= et && !(Se >= v); Ee++)
                  ae.push({ data: $?.[Ee], index: Ee, offset: Se, size: Te }), Se += Te + z;
              }
            }), Y = Pm(j, gi), W = Pm(j, vi);
            if (ne.length > 0 && (Y > 0 || W > 0)) {
              const ae = ne[0], fe = ne[ne.length - 1];
              if (Y > 0 && ae.index > le) {
                const ge = Math.min(Y, ae.index - le), Se = [];
                let xe = ae.offset;
                for (let Te = ae.index - 1; Te >= ae.index - ge; Te--) {
                  const et = Gs(U, Te, Te)[0]?.value ?? ae.size;
                  xe -= et + z, Se.unshift({ data: $?.[Te], index: Te, offset: xe, size: et });
                }
                ne.unshift(...Se);
              }
              if (W > 0 && fe.index < _e) {
                const ge = Math.min(W, _e - fe.index);
                let Se = fe.offset + fe.size + z;
                for (let xe = fe.index + 1; xe <= fe.index + ge; xe++) {
                  const Te = Gs(U, xe, xe)[0]?.value ?? fe.size;
                  ne.push({ data: $?.[xe], index: xe, offset: Se, size: Te }), Se += Te + z;
                }
              }
            }
            return Io(ne, Z, k, z, O, A);
          }
        ),
        //@ts-expect-error filter needs to be fixed
        oe((m) => m !== null),
        Me()
      ),
      Nc
    );
    te(
      G(
        e,
        oe(hf),
        Q((m) => m?.length)
      ),
      s
    ), te(
      G(
        N,
        Q((m) => m.topListHeight)
      ),
      x
    ), te(x, c), te(
      G(
        N,
        Q((m) => [m.top, m.bottom])
      ),
      o
    ), te(
      G(
        N,
        Q((m) => m.items)
      ),
      y
    );
    const l = Ut(
      G(
        N,
        oe(({ items: m }) => m.length > 0),
        he(s, e),
        oe(([{ items: m }, v]) => m[m.length - 1].originalIndex === v - 1),
        Q(([, m, v]) => [m - 1, v]),
        Me(pi),
        Q(([m]) => m)
      )
    ), d = Ut(
      G(
        N,
        Jn(200),
        oe(({ items: m, topItems: v }) => m.length > 0 && m[0].originalIndex === v.length),
        Q(({ items: m }) => m[0].index),
        Me()
      )
    ), f = Ut(
      G(
        N,
        oe(({ items: m }) => m.length > 0),
        Q(({ items: m }) => {
          let v = 0, k = m.length - 1;
          for (; m[v].type === "group" && v < k; )
            v++;
          for (; m[k].type === "group" && k > v; )
            k--;
          return {
            endIndex: m[k].index,
            startIndex: m[v].index
          };
        }),
        Me(j_)
      )
    );
    return {
      endReached: l,
      initialItemCount: D,
      itemsRendered: y,
      listState: N,
      minOverscanItemCount: b,
      rangeChanged: f,
      startReached: d,
      topItemsIndexes: I,
      ...g
    };
  },
  Oe(
    Fn,
    I_,
    wf,
    ji,
    Ni,
    Ei,
    $r,
    _f
  ),
  { singleton: !0 }
), M_ = Ne(
  ([{ fixedFooterHeight: e, fixedHeaderHeight: t, footerHeight: n, headerHeight: r }, { listState: s }]) => {
    const i = we(), o = wt(
      G(
        qe(n, e, r, t, s),
        Q(([c, u, p, h, x]) => c + u + p + h + x.offsetBottom + x.bottom)
      ),
      0
    );
    return te(ie(o), i), { totalListHeight: o, totalListHeightChanged: i };
  },
  Oe(It, ps),
  { singleton: !0 }
), oj = Ne(
  ([{ viewportHeight: e }, { totalListHeight: t }]) => {
    const n = q(!1), r = wt(
      G(
        qe(n, e, t),
        oe(([s]) => s),
        Q(([, s, i]) => Math.max(0, s - i)),
        Jn(0),
        Me()
      ),
      0
    );
    return { alignToBottom: n, paddingTopAddition: r };
  },
  Oe(It, M_),
  { singleton: !0 }
), D_ = Ne(() => ({
  context: q(null)
})), lj = ({
  itemBottom: e,
  itemTop: t,
  locationParams: { align: n, behavior: r, ...s },
  viewportBottom: i,
  viewportTop: o
}) => t < o ? { ...s, align: n ?? "start", ...r !== void 0 ? { behavior: r } : {} } : e > i ? { ...s, align: n ?? "end", ...r !== void 0 ? { behavior: r } : {} } : null, O_ = Ne(
  ([
    { gap: e, sizes: t, totalCount: n },
    { fixedFooterHeight: r, fixedHeaderHeight: s, headerHeight: i, scrollingInProgress: o, scrollTop: c, viewportHeight: u },
    { scrollToIndex: p }
  ]) => {
    const h = we();
    return te(
      G(
        h,
        he(t, u, n, i, s, r, c),
        he(e),
        Q(([[x, g, w, E, I, D, y, b], N]) => {
          const { calculateViewLocation: l = lj, done: d, ...f } = x, m = T_(x, g, E - 1), v = mi(m, g.offsetTree, N) + I + D, k = v + kn(g.sizeTree, m)[1], S = b + D, C = b + w - y, L = l({
            itemBottom: k,
            itemTop: v,
            locationParams: f,
            viewportBottom: C,
            viewportTop: S
          });
          return L !== null ? d && wn(
            G(
              o,
              oe((B) => !B),
              // skips the initial publish of false, and the cleanup call.
              // but if scrollingInProgress is true, we skip the initial publish.
              cs(ze(o) ? 1 : 2)
            ),
            d
          ) : d?.(), L;
        }),
        oe((x) => x !== null)
      ),
      p
    ), {
      scrollIntoView: h
    };
  },
  Oe(Fn, It, Ni, ps, Br),
  { singleton: !0 }
);
function Rm(e) {
  return e === !1 ? !1 : e === "smooth" ? "smooth" : "auto";
}
const cj = (e, t) => typeof e == "function" ? Rm(e(t)) : t && Rm(e), uj = Ne(
  ([
    { listRefresh: e, totalCount: t, fixedItemSize: n, data: r },
    { atBottomState: s, isAtBottom: i },
    { scrollToIndex: o },
    { scrolledToInitialItem: c },
    { didMount: u, propsReady: p },
    { log: h },
    { scrollingInProgress: x },
    { context: g },
    { scrollIntoView: w }
  ]) => {
    const E = q(!1), I = we();
    let D = null;
    function y(d) {
      me(o, {
        align: "end",
        behavior: d,
        index: "LAST"
      });
    }
    je(
      G(
        qe(G(ie(t), cs(1)), u),
        he(ie(E), i, c, x),
        Q(([[d, f], m, v, k, S]) => {
          let C = f && k, L = "auto";
          return C && (L = cj(m, v || S), C = C && L !== !1), { followOutputBehavior: L, shouldFollow: C, totalCount: d };
        }),
        oe(({ shouldFollow: d }) => d)
      ),
      ({ followOutputBehavior: d, totalCount: f }) => {
        D !== null && (D(), D = null), ze(n) !== void 0 ? requestAnimationFrame(() => {
          ze(h)("following output to ", { totalCount: f }, Je.DEBUG), y(d);
        }) : D = wn(e, () => {
          ze(h)("following output to ", { totalCount: f }, Je.DEBUG), y(d), D = null;
        });
      }
    );
    function b(d) {
      const f = wn(s, (m) => {
        d && !m.atBottom && m.notAtBottomBecause === "SIZE_INCREASED" && D === null && (ze(h)("scrolling to bottom due to increased size", {}, Je.DEBUG), y("auto"));
      });
      setTimeout(f, 100);
    }
    je(
      G(
        qe(ie(E), t, p),
        oe(([d, , f]) => d !== !1 && f),
        zn(
          ({ value: d }, [, f]) => ({ refreshed: d === f, value: f }),
          { refreshed: !1, value: 0 }
        ),
        oe(({ refreshed: d }) => d),
        he(E, t)
      ),
      ([, d]) => {
        ze(c) && b(d !== !1);
      }
    ), je(I, () => {
      b(ze(E) !== !1);
    }), je(qe(ie(E), s), ([d, f]) => {
      d !== !1 && !f.atBottom && f.notAtBottomBecause === "VIEWPORT_HEIGHT_DECREASING" && y("auto");
    });
    const N = q(null), l = we();
    return te(
      Ku(
        G(
          ie(r),
          Q((d) => d?.length ?? 0)
        ),
        G(ie(t))
      ),
      l
    ), je(
      G(
        qe(G(l, cs(1)), u),
        he(ie(N), c, x, g),
        Q(([[d, f], m, v, k, S]) => f && v && m?.({ context: S, totalCount: d, scrollingInProgress: k })),
        oe((d) => !!d),
        Jn(0)
      ),
      (d) => {
        D !== null && (D(), D = null), ze(n) !== void 0 ? requestAnimationFrame(() => {
          ze(h)("scrolling into view", {}), me(w, d);
        }) : D = wn(e, () => {
          ze(h)("scrolling into view", {}), me(w, d), D = null;
        });
      }
    ), { autoscrollToBottom: I, followOutput: E, scrollIntoViewOnChange: N };
  },
  Oe(
    Fn,
    Ei,
    Ni,
    ji,
    $r,
    Br,
    It,
    D_,
    O_
  )
), dj = Ne(
  ([{ data: e, firstItemIndex: t, gap: n, sizes: r }, { initialTopMostItemIndex: s }, { initialItemCount: i, listState: o }, { didMount: c }]) => (te(
    G(
      c,
      he(i),
      oe(([, u]) => u !== 0),
      he(s, r, t, n, e),
      Q(([[, u], p, h, x, g, w = []]) => R_(u, p, h, x, g, w))
    ),
    o
  ), {}),
  Oe(Fn, ji, ps, $r),
  { singleton: !0 }
), fj = Ne(
  ([{ didMount: e }, { scrollTo: t }, { listState: n }]) => {
    const r = q(0);
    return je(
      G(
        e,
        he(r),
        oe(([, s]) => s !== 0),
        Q(([, s]) => ({ top: s }))
      ),
      (s) => {
        wn(
          G(
            n,
            cs(1),
            oe((i) => i.items.length > 1)
          ),
          () => {
            requestAnimationFrame(() => {
              me(t, s);
            });
          }
        );
      }
    ), {
      initialScrollTop: r
    };
  },
  Oe($r, It, ps),
  { singleton: !0 }
), L_ = Ne(
  ([{ scrollVelocity: e }]) => {
    const t = q(!1), n = we(), r = q(!1);
    return te(
      G(
        e,
        he(r, t, n),
        oe(([s, i]) => i !== !1 && i !== void 0),
        Q(([s, i, o, c]) => {
          const { enter: u, exit: p } = i;
          if (o) {
            if (p(s, c))
              return !1;
          } else if (u(s, c))
            return !0;
          return o;
        }),
        Me()
      ),
      t
    ), je(
      G(qe(t, e, n), he(r)),
      ([[s, i, o], c]) => {
        s && c !== !1 && c !== void 0 && c.change && c.change(i, o);
      }
    ), { isSeeking: t, scrollSeekConfiguration: r, scrollSeekRangeChanged: n, scrollVelocity: e };
  },
  Oe(Ei),
  { singleton: !0 }
), Sf = Ne(([{ scrollContainerState: e, scrollTo: t }]) => {
  const n = we(), r = we(), s = we(), i = q(!1), o = q(void 0);
  return te(
    G(
      qe(n, r),
      Q(([{ scrollTop: c, viewportHeight: u }, { offsetTop: p, listHeight: h }]) => ({
        scrollHeight: h,
        scrollTop: Math.max(0, c - p),
        viewportHeight: u
      }))
    ),
    e
  ), te(
    G(
      t,
      he(r),
      Q(([c, { offsetTop: u }]) => ({
        ...c,
        top: c.top + u
      }))
    ),
    s
  ), {
    customScrollParent: o,
    // config
    useWindowScroll: i,
    // input
    windowScrollContainerState: n,
    // signals
    windowScrollTo: s,
    windowViewportRect: r
  };
}, Oe(It)), pj = Ne(
  ([
    { sizeRanges: e, sizes: t },
    { headerHeight: n, scrollTop: r },
    { initialTopMostItemIndex: s },
    { didMount: i },
    { useWindowScroll: o, windowScrollContainerState: c, windowViewportRect: u }
  ]) => {
    const p = we(), h = q(void 0), x = q(null), g = q(null);
    return te(c, x), te(u, g), je(
      G(
        p,
        he(t, r, o, x, g, n)
      ),
      ([w, E, I, D, y, b, N]) => {
        const l = QN(E.sizeTree);
        D && y !== null && b !== null && (I = y.scrollTop - b.offsetTop), I -= N, w({ ranges: l, scrollTop: I });
      }
    ), te(G(h, oe(hf), Q(mj)), s), te(
      G(
        i,
        he(h),
        oe(([, w]) => w !== void 0),
        Me(),
        Q(([, w]) => w.ranges)
      ),
      e
    ), {
      getState: p,
      restoreStateFrom: h
    };
  },
  Oe(Fn, It, ji, $r, Sf)
);
function mj(e) {
  return { align: "start", index: 0, offset: e.scrollTop };
}
const hj = Ne(([{ topItemsIndexes: e }]) => {
  const t = q(0);
  return te(
    G(
      t,
      oe((n) => n >= 0),
      Q((n) => Array.from({ length: n }).map((r, s) => s))
    ),
    e
  ), { topItemCount: t };
}, Oe(ps));
function z_(e) {
  let t = !1, n;
  return () => (t || (t = !0, n = e()), n);
}
const gj = z_(() => /iP(ad|od|hone)/i.test(navigator.userAgent) && /WebKit/i.test(navigator.userAgent)), vj = Ne(
  ([
    { deviation: e, scrollBy: t, scrollingInProgress: n, scrollTop: r },
    { isAtBottom: s, isScrolling: i, lastJumpDueToItemResize: o, scrollDirection: c },
    { listState: u },
    { beforeUnshiftWith: p, gap: h, shiftWithOffset: x, sizes: g },
    { log: w },
    { recalcInProgress: E }
  ]) => {
    const I = Ut(
      G(
        u,
        he(o),
        zn(
          ([, y, b, N], [{ bottom: l, items: d, offsetBottom: f, totalCount: m }, v]) => {
            const k = l + f;
            let S = 0;
            return b === m && y.length > 0 && d.length > 0 && (d[0].originalIndex === 0 && y[0].originalIndex === 0 || (S = k - N, S !== 0 && (S += v))), [S, d, m, k];
          },
          [0, [], 0, 0]
        ),
        oe(([y]) => y !== 0),
        he(r, c, n, s, w, E),
        oe(([, y, b, N, , , l]) => !l && !N && y !== 0 && b === hi),
        Q(([[y], , , , , b]) => (b("Upward scrolling compensation", { amount: y }, Je.DEBUG), y))
      )
    );
    function D(y) {
      y > 0 ? (me(t, { behavior: "auto", top: -y }), me(e, 0)) : (me(e, 0), me(t, { behavior: "auto", top: -y }));
    }
    return je(G(I, he(e, i)), ([y, b, N]) => {
      N && gj() ? me(e, b - y) : D(-y);
    }), je(
      G(
        qe(wt(i, !1), e, E),
        oe(([y, b, N]) => !y && !N && b !== 0),
        Q(([y, b]) => b),
        Jn(1)
      ),
      D
    ), te(
      G(
        x,
        Q((y) => ({ top: -y }))
      ),
      t
    ), je(
      G(
        p,
        he(g, h),
        Q(([y, { groupIndices: b, lastSize: N, sizeTree: l }, d]) => {
          function f(C) {
            return C * (N + d);
          }
          if (b.length === 0)
            return f(y);
          let m = 0;
          const v = fi(l, 0);
          let k = 0, S = 0;
          for (; k < y; ) {
            k++, m += v;
            let C = b.length === S + 1 ? 1 / 0 : b[S + 1] - b[S] - 1;
            k + C > y && (m -= v, C = y - k + 1), k += C, m += f(C), S++;
          }
          return m;
        })
      ),
      (y) => {
        me(e, y), requestAnimationFrame(() => {
          me(t, { top: y }), requestAnimationFrame(() => {
            me(e, 0), me(E, !1);
          });
        });
      }
    ), { deviation: e };
  },
  Oe(It, Ei, ps, Fn, Br, _f)
), _j = Ne(
  ([
    e,
    t,
    n,
    r,
    s,
    i,
    o,
    c,
    u,
    p,
    h
  ]) => ({
    ...e,
    ...t,
    ...n,
    ...r,
    ...s,
    ...i,
    ...o,
    ...c,
    ...u,
    ...p,
    ...h
  }),
  Oe(
    wf,
    dj,
    $r,
    L_,
    M_,
    fj,
    oj,
    Sf,
    O_,
    Br,
    D_
  )
), B_ = Ne(
  ([
    {
      data: e,
      defaultItemSize: t,
      firstItemIndex: n,
      fixedItemSize: r,
      fixedGroupSize: s,
      gap: i,
      groupIndices: o,
      heightEstimates: c,
      itemSize: u,
      sizeRanges: p,
      sizes: h,
      statefulTotalCount: x,
      totalCount: g,
      trackItemSizes: w
    },
    { initialItemFinalLocationReached: E, initialTopMostItemIndex: I, scrolledToInitialItem: D },
    y,
    b,
    N,
    l,
    { scrollToIndex: d },
    f,
    { topItemCount: m },
    { groupCounts: v },
    k
  ]) => {
    const { listState: S, minOverscanItemCount: C, topItemsIndexes: L, rangeChanged: B, ...A } = l;
    return te(B, k.scrollSeekRangeChanged), te(
      G(
        k.windowViewportRect,
        Q((z) => z.visibleHeight)
      ),
      y.viewportHeight
    ), {
      data: e,
      defaultItemHeight: t,
      firstItemIndex: n,
      fixedItemHeight: r,
      fixedGroupHeight: s,
      gap: i,
      groupCounts: v,
      heightEstimates: c,
      initialItemFinalLocationReached: E,
      initialTopMostItemIndex: I,
      scrolledToInitialItem: D,
      sizeRanges: p,
      topItemCount: m,
      topItemsIndexes: L,
      // input
      totalCount: g,
      ...N,
      groupIndices: o,
      itemSize: u,
      listState: S,
      minOverscanItemCount: C,
      scrollToIndex: d,
      // output
      statefulTotalCount: x,
      trackItemSizes: w,
      // exported from stateFlagsSystem
      rangeChanged: B,
      ...A,
      // the bag of IO from featureGroup1System
      ...k,
      ...y,
      sizes: h,
      ...b
    };
  },
  Oe(
    Fn,
    ji,
    It,
    pj,
    uj,
    ps,
    Ni,
    vj,
    hj,
    I_,
    _j
  )
);
function yj(e, t) {
  const n = {}, r = {};
  let s = 0;
  const i = e.length;
  for (; s < i; )
    r[e[s]] = 1, s += 1;
  for (const o in t)
    Object.hasOwn(r, o) || (n[o] = t[o]);
  return n;
}
const lo = typeof document < "u" ? J.useLayoutEffect : J.useEffect;
function $_(e, t, n) {
  const r = Object.keys(t.required || {}), s = Object.keys(t.optional || {}), i = Object.keys(t.methods || {}), o = Object.keys(t.events || {}), c = J.createContext({});
  function u(D, y) {
    D.propsReady !== void 0 && me(D.propsReady, !1);
    for (const b of r) {
      const N = D[t.required[b]];
      me(N, y[b]);
    }
    for (const b of s)
      if (b in y) {
        const N = D[t.optional[b]];
        me(N, y[b]);
      }
    D.propsReady !== void 0 && me(D.propsReady, !0);
  }
  function p(D) {
    return i.reduce((y, b) => (y[b] = (N) => {
      const l = D[t.methods[b]];
      me(l, N);
    }, y), {});
  }
  function h(D) {
    return o.reduce((y, b) => (y[b] = MN(D[t.events[b]]), y), {});
  }
  const x = J.forwardRef(function(D, y) {
    const { children: b, ...N } = D, [l] = J.useState(() => Al(ON(e), (m) => {
      u(m, N);
    })), [d] = J.useState(bm(h, l));
    lo(() => {
      for (const m of o)
        m in N && je(d[m], N[m]);
      return () => {
        Object.values(d).map(gf);
      };
    }, [N, d, l]), lo(() => {
      u(l, N);
    }), J.useImperativeHandle(y, xm(p(l)));
    const f = n;
    return /* @__PURE__ */ a.jsx(c.Provider, { value: l, children: n !== void 0 ? /* @__PURE__ */ a.jsx(f, { ...yj([...r, ...s, ...o], N), children: b }) : b });
  }), g = (D) => {
    const y = J.useContext(c);
    return J.useCallback(
      (b) => {
        me(y[D], b);
      },
      [y, D]
    );
  }, w = (D) => {
    const y = J.useContext(c)[D], b = J.useCallback(
      (N) => je(y, N),
      [y]
    );
    return J.useSyncExternalStore(
      b,
      () => ze(y),
      () => ze(y)
    );
  }, E = (D) => {
    const y = J.useContext(c)[D], [b, N] = J.useState(bm(ze, y));
    return lo(
      () => je(y, (l) => {
        l !== b && N(xm(l));
      }),
      [y, b]
    ), b;
  }, I = parseInt(J.version) >= 18 ? w : E;
  return {
    Component: x,
    useEmitter: (D, y) => {
      const b = J.useContext(c)[D];
      lo(() => je(b, y), [y, b]);
    },
    useEmitterValue: I,
    usePublisher: g
  };
}
const H_ = J.createContext(void 0), F_ = J.createContext(void 0), jc = "-webkit-sticky", Mm = "sticky", kf = z_(() => {
  if (typeof document > "u")
    return Mm;
  const e = document.createElement("div");
  return e.style.position = jc, e.style.position === jc ? jc : Mm;
}), U_ = typeof document < "u" ? J.useLayoutEffect : J.useEffect;
function Ec(e) {
  return "self" in e;
}
function xj(e) {
  return "body" in e;
}
function W_(e, t, n, r = ia, s, i) {
  const o = J.useRef(null), c = J.useRef(null), u = J.useRef(null), p = J.useCallback(
    (g) => {
      let w, E, I;
      const D = g.target;
      if (xj(D) || Ec(D)) {
        const b = Ec(D) ? D : D.defaultView;
        I = i === !0 ? Jr(b, b.scrollX) : b.scrollY, w = i === !0 ? b.document.documentElement.scrollWidth : b.document.documentElement.scrollHeight, E = i === !0 ? b.innerWidth : b.innerHeight;
      } else
        I = i === !0 ? Jr(D, D.scrollLeft) : D.scrollTop, w = i === !0 ? D.scrollWidth : D.scrollHeight, E = i === !0 ? D.offsetWidth : D.offsetHeight;
      const y = () => {
        e({
          scrollHeight: w,
          scrollTop: Math.max(I, 0),
          viewportHeight: E
        });
      };
      g.suppressFlushSync === !0 ? y() : CN.flushSync(y), c.current !== null && (I === c.current || I <= 0 || I === w - E) && (c.current = null, t(!0), u.current && (clearTimeout(u.current), u.current = null));
    },
    [e, t, i]
  );
  J.useEffect(() => {
    const g = s || o.current;
    return Sm(g), r(s || o.current), p({ suppressFlushSync: !0, target: g }), g.addEventListener("scroll", p, { passive: !0 }), () => {
      Sm(g), r(null), g.removeEventListener("scroll", p);
    };
  }, [o, p, n, r, s]);
  function h(g) {
    const w = o.current;
    if (!w || (i === !0 ? "offsetWidth" in w && w.offsetWidth === 0 : "offsetHeight" in w && w.offsetHeight === 0))
      return;
    const E = g.behavior === "smooth";
    let I, D, y;
    Ec(w) ? (D = Math.max(
      Mr(w.document.documentElement, i === !0 ? "width" : "height"),
      i === !0 ? w.document.documentElement.scrollWidth : w.document.documentElement.scrollHeight
    ), I = i === !0 ? w.innerWidth : w.innerHeight, y = i === !0 ? Jr(w, w.scrollX) : w.scrollY) : (D = w[i === !0 ? "scrollWidth" : "scrollHeight"], I = Mr(w, i === !0 ? "width" : "height"), y = i === !0 ? Jr(w, w.scrollLeft) : w.scrollTop);
    const b = D - I;
    if (g.top === void 0) {
      w.scrollTo(g);
      return;
    }
    const N = Math.ceil(Math.max(Math.min(b, g.top), 0));
    if (g.top = N, P_(I, D) || N === y) {
      e({ scrollHeight: D, scrollTop: y, viewportHeight: I }), E && t(!0);
      return;
    }
    E ? (c.current = N, u.current && clearTimeout(u.current), u.current = setTimeout(() => {
      u.current = null, c.current = null, t(!0);
    }, 1e3)) : c.current = null, i === !0 && (g = {
      ...g.behavior !== void 0 ? { behavior: g.behavior } : {},
      left: km(w, N)
    }), w.scrollTo(g);
  }
  function x(g) {
    i === !0 && (g = {
      ...g.behavior !== void 0 ? { behavior: g.behavior } : {},
      ...g.top !== void 0 ? { left: km(o.current, g.top) } : {}
    }), o.current.scrollBy(g);
  }
  return { scrollByCallback: x, scrollerRef: o, scrollToCallback: h };
}
function Nf(e) {
  return e;
}
const bj = /* @__PURE__ */ Ne(() => {
  const e = q((c) => `Item ${c}`), t = q((c) => `Group ${c}`), n = q({}), r = q(Nf), s = q("div"), i = q(ia), o = (c, u = null) => wt(
    G(
      n,
      Q((p) => p[c]),
      Me()
    ),
    u
  );
  return {
    components: n,
    computeItemKey: r,
    EmptyPlaceholder: o("EmptyPlaceholder"),
    FooterComponent: o("Footer"),
    GroupComponent: o("Group", "div"),
    groupContent: t,
    HeaderComponent: o("Header"),
    HeaderFooterTag: s,
    ItemComponent: o("Item", "div"),
    itemContent: e,
    ListComponent: o("List", "div"),
    ScrollerComponent: o("Scroller", "div"),
    scrollerRef: i,
    ScrollSeekPlaceholder: o("ScrollSeekPlaceholder"),
    TopItemListComponent: o("TopItemList")
  };
}), wj = /* @__PURE__ */ Ne(
  ([e, t]) => ({ ...e, ...t }),
  Oe(B_, bj)
), Sj = ({ height: e }) => /* @__PURE__ */ a.jsx("div", { style: { height: e } }), kj = { overflowAnchor: "none", position: kf(), zIndex: 1 }, G_ = { overflowAnchor: "none" }, Nj = { ...G_, display: "inline-block", height: "100%" }, Dm = /* @__PURE__ */ J.memo(function({ showTopList: e = !1 }) {
  const t = ue("listState"), n = nn("sizeRanges"), r = ue("useWindowScroll"), s = ue("customScrollParent"), i = nn("windowScrollContainerState"), o = nn("scrollContainerState"), c = s || r ? i : o, u = ue("itemContent"), p = ue("context"), h = ue("groupContent"), x = ue("trackItemSizes"), g = ue("itemSize"), w = ue("log"), E = nn("gap"), I = ue("horizontalDirection"), { callbackRef: D } = $N(
    n,
    g,
    x,
    e ? ia : c,
    w,
    E,
    s,
    I,
    ue("skipAnimationFrameInResizeObserver")
  ), [y, b] = J.useState(0);
  Ef("deviation", (A) => {
    y !== A && b(A);
  });
  const N = ue("EmptyPlaceholder"), l = ue("ScrollSeekPlaceholder") ?? Sj, d = ue("ListComponent"), f = ue("ItemComponent"), m = ue("GroupComponent"), v = ue("computeItemKey"), k = ue("isSeeking"), S = ue("groupIndices").length > 0, C = ue("alignToBottom"), L = ue("initialItemFinalLocationReached"), B = e ? {} : {
    boxSizing: "border-box",
    ...I ? {
      display: "inline-block",
      height: "100%",
      marginInlineStart: y !== 0 ? y : C ? "auto" : 0,
      paddingInlineEnd: t.offsetBottom,
      paddingInlineStart: t.offsetTop,
      whiteSpace: "nowrap"
    } : {
      marginTop: y !== 0 ? y : C ? "auto" : 0,
      paddingBottom: t.offsetBottom,
      paddingTop: t.offsetTop
    },
    ...L ? {} : { visibility: "hidden" }
  };
  return !e && t.totalCount === 0 && N !== null && N !== void 0 ? /* @__PURE__ */ a.jsx(N, { ...bt(N, p) }) : /* @__PURE__ */ a.jsx(
    d,
    {
      ...bt(d, p),
      "data-testid": e ? "virtuoso-top-item-list" : "virtuoso-item-list",
      ref: D,
      style: B,
      children: (e ? t.topItems : t.items).map((A) => {
        const z = A.originalIndex, j = v(z + t.firstItemIndex, A.data, p);
        return k ? /* @__PURE__ */ P.createElement(
          l,
          {
            ...bt(l, p),
            height: A.size,
            index: A.index,
            key: j,
            type: A.type || "item",
            ...A.type === "group" ? {} : { groupIndex: A.groupIndex }
          }
        ) : A.type === "group" ? /* @__PURE__ */ P.createElement(
          m,
          {
            ...bt(m, p),
            "data-index": z,
            "data-item-index": A.index,
            "data-known-size": A.size,
            key: j,
            style: kj
          },
          h(A.index, p)
        ) : /* @__PURE__ */ P.createElement(
          f,
          {
            ...bt(f, p),
            ...Tj(f, A.data),
            "data-index": z,
            "data-item-group-index": A.groupIndex,
            "data-item-index": A.index,
            "data-known-size": A.size,
            key: j,
            style: I ? Nj : G_
          },
          S ? u(A.index, A.groupIndex, A.data, p) : u(A.index, A.data, p)
        );
      })
    }
  );
}), jj = {
  height: "100%",
  outline: "none",
  overflowY: "auto",
  position: "relative",
  WebkitOverflowScrolling: "touch"
}, Ej = {
  outline: "none",
  overflowX: "auto",
  position: "relative"
}, jf = (e) => ({
  height: "100%",
  position: "absolute",
  top: 0,
  width: "100%",
  ...e ? { display: "flex", flexDirection: "column" } : void 0
}), V_ = (e, t, n = 0) => ({
  ...jf(e),
  position: t ? "relative" : "absolute",
  top: t ? -n : 0
}), Cj = {
  position: kf(),
  top: 0,
  width: "100%",
  zIndex: 1
};
function bt(e, t) {
  if (typeof e != "string")
    return { context: t };
}
function Tj(e, t) {
  return { item: typeof e == "string" ? void 0 : t };
}
const Ij = /* @__PURE__ */ J.memo(function() {
  const e = ue("HeaderComponent"), t = nn("headerHeight"), n = ue("HeaderFooterTag"), r = fs(
    J.useMemo(
      () => (i) => {
        t(Mr(i, "height"));
      },
      [t]
    ),
    !0,
    ue("skipAnimationFrameInResizeObserver")
  ), s = ue("context");
  return e != null ? /* @__PURE__ */ a.jsx(n, { ref: r, children: /* @__PURE__ */ a.jsx(e, { ...bt(e, s) }) }) : null;
}), Aj = /* @__PURE__ */ J.memo(function() {
  const e = ue("FooterComponent"), t = nn("footerHeight"), n = ue("HeaderFooterTag"), r = fs(
    J.useMemo(
      () => (i) => {
        t(Mr(i, "height"));
      },
      [t]
    ),
    !0,
    ue("skipAnimationFrameInResizeObserver")
  ), s = ue("context");
  return e != null ? /* @__PURE__ */ a.jsx(n, { ref: r, children: /* @__PURE__ */ a.jsx(e, { ...bt(e, s) }) }) : null;
});
function K_({ useEmitter: e, useEmitterValue: t, usePublisher: n }) {
  return J.memo(function({ children: r, style: s, context: i, ...o }) {
    const c = n("scrollContainerState"), u = t("ScrollerComponent"), p = n("smoothScrollTargetReached"), h = t("scrollerRef"), x = t("horizontalDirection") || !1, { scrollByCallback: g, scrollerRef: w, scrollToCallback: E } = W_(
      c,
      p,
      u,
      h,
      void 0,
      x
    );
    return e("scrollTo", E), e("scrollBy", g), /* @__PURE__ */ a.jsx(
      u,
      {
        "data-testid": "virtuoso-scroller",
        "data-virtuoso-scroller": !0,
        ref: w,
        style: { ...x ? Ej : jj, ...s },
        tabIndex: 0,
        ...o,
        ...bt(u, i),
        children: r
      }
    );
  });
}
function q_({ useEmitter: e, useEmitterValue: t, usePublisher: n }) {
  return J.memo(function({ children: r, style: s, context: i, ...o }) {
    const c = n("windowScrollContainerState"), u = t("ScrollerComponent"), p = n("smoothScrollTargetReached"), h = t("totalListHeight"), x = t("deviation"), g = t("customScrollParent"), w = J.useRef(null), E = t("scrollerRef"), { scrollByCallback: I, scrollerRef: D, scrollToCallback: y } = W_(
      c,
      p,
      u,
      E,
      g
    );
    return U_(() => (D.current = g || w.current?.ownerDocument.defaultView, () => {
      D.current = null;
    }), [D, g]), e("windowScrollTo", y), e("scrollBy", I), /* @__PURE__ */ a.jsx(
      u,
      {
        ref: w,
        "data-virtuoso-scroller": !0,
        style: { position: "relative", ...s, ...h !== 0 ? { height: h + x } : void 0 },
        ...o,
        ...bt(u, i),
        children: r
      }
    );
  });
}
const Pj = ({ children: e }) => {
  const t = J.useContext(H_), n = nn("viewportHeight"), r = nn("fixedItemHeight"), s = ue("alignToBottom"), i = ue("horizontalDirection"), o = J.useMemo(
    () => g_(n, (u) => Mr(u, i ? "width" : "height")),
    [n, i]
  ), c = fs(o, !0, ue("skipAnimationFrameInResizeObserver"));
  return J.useEffect(() => {
    t && (n(t.viewportHeight), r(t.itemHeight));
  }, [t, n, r]), /* @__PURE__ */ a.jsx("div", { "data-viewport-type": "element", ref: c, style: jf(s), children: e });
}, Rj = ({ children: e }) => {
  const t = J.useContext(H_), n = nn("windowViewportRect"), r = nn("fixedItemHeight"), s = ue("customScrollParent"), i = ue("useWindowScroll"), o = ue("topListHeight"), c = x_(
    n,
    s,
    ue("skipAnimationFrameInResizeObserver")
  ), u = ue("alignToBottom");
  return J.useEffect(() => {
    t && (r(t.itemHeight), n({ listHeight: 0, offsetTop: 0, visibleHeight: t.viewportHeight, visibleWidth: 100 }));
  }, [t, n, r]), /* @__PURE__ */ a.jsx("div", { "data-viewport-type": "window", ref: c, style: V_(u, i, o), children: e });
}, Mj = ({ children: e }) => {
  const t = ue("TopItemListComponent") ?? "div", n = ue("headerHeight"), r = { ...Cj, marginTop: `${n}px` }, s = ue("context");
  return /* @__PURE__ */ a.jsx(t, { style: r, ...bt(t, s), children: e });
}, Dj = /* @__PURE__ */ J.memo(function(e) {
  const t = ue("useWindowScroll"), n = ue("topItemsIndexes").length > 0, r = ue("customScrollParent"), s = ue("context");
  return /* @__PURE__ */ a.jsxs(r || t ? zj : Lj, { ...e, context: s, children: [
    n && /* @__PURE__ */ a.jsx(Mj, { children: /* @__PURE__ */ a.jsx(Dm, { showTopList: !0 }) }),
    /* @__PURE__ */ a.jsxs(r || t ? Rj : Pj, { children: [
      /* @__PURE__ */ a.jsx(Ij, {}),
      /* @__PURE__ */ a.jsx(Dm, {}),
      /* @__PURE__ */ a.jsx(Aj, {})
    ] })
  ] });
}), {
  Component: Oj,
  useEmitter: Ef,
  useEmitterValue: ue,
  usePublisher: nn
} = /* @__PURE__ */ $_(
  wj,
  {
    optional: {
      restoreStateFrom: "restoreStateFrom",
      context: "context",
      followOutput: "followOutput",
      scrollIntoViewOnChange: "scrollIntoViewOnChange",
      itemContent: "itemContent",
      groupContent: "groupContent",
      overscan: "overscan",
      increaseViewportBy: "increaseViewportBy",
      minOverscanItemCount: "minOverscanItemCount",
      totalCount: "totalCount",
      groupCounts: "groupCounts",
      topItemCount: "topItemCount",
      firstItemIndex: "firstItemIndex",
      initialTopMostItemIndex: "initialTopMostItemIndex",
      components: "components",
      atBottomThreshold: "atBottomThreshold",
      atTopThreshold: "atTopThreshold",
      computeItemKey: "computeItemKey",
      defaultItemHeight: "defaultItemHeight",
      fixedGroupHeight: "fixedGroupHeight",
      // Must be set above 'fixedItemHeight'
      fixedItemHeight: "fixedItemHeight",
      heightEstimates: "heightEstimates",
      itemSize: "itemSize",
      scrollSeekConfiguration: "scrollSeekConfiguration",
      headerFooterTag: "HeaderFooterTag",
      data: "data",
      initialItemCount: "initialItemCount",
      initialScrollTop: "initialScrollTop",
      alignToBottom: "alignToBottom",
      useWindowScroll: "useWindowScroll",
      customScrollParent: "customScrollParent",
      scrollerRef: "scrollerRef",
      logLevel: "logLevel",
      horizontalDirection: "horizontalDirection",
      skipAnimationFrameInResizeObserver: "skipAnimationFrameInResizeObserver"
    },
    methods: {
      scrollToIndex: "scrollToIndex",
      scrollIntoView: "scrollIntoView",
      scrollTo: "scrollTo",
      scrollBy: "scrollBy",
      autoscrollToBottom: "autoscrollToBottom",
      getState: "getState"
    },
    events: {
      isScrolling: "isScrolling",
      endReached: "endReached",
      startReached: "startReached",
      rangeChanged: "rangeChanged",
      atBottomStateChange: "atBottomStateChange",
      atTopStateChange: "atTopStateChange",
      totalListHeightChanged: "totalListHeightChanged",
      itemsRendered: "itemsRendered",
      groupIndices: "groupIndices"
    }
  },
  Dj
), Lj = /* @__PURE__ */ K_({ useEmitter: Ef, useEmitterValue: ue, usePublisher: nn }), zj = /* @__PURE__ */ q_({ useEmitter: Ef, useEmitterValue: ue, usePublisher: nn }), Y_ = Oj, Bj = /* @__PURE__ */ Ne(() => {
  const e = q((p) => /* @__PURE__ */ a.jsxs("td", { children: [
    "Item $",
    p
  ] })), t = q(null), n = q((p) => /* @__PURE__ */ a.jsxs("td", { colSpan: 1e3, children: [
    "Group ",
    p
  ] })), r = q(null), s = q(null), i = q({}), o = q(Nf), c = q(ia), u = (p, h = null) => wt(
    G(
      i,
      Q((x) => x[p]),
      Me()
    ),
    h
  );
  return {
    components: i,
    computeItemKey: o,
    context: t,
    EmptyPlaceholder: u("EmptyPlaceholder"),
    FillerRow: u("FillerRow"),
    fixedFooterContent: s,
    fixedHeaderContent: r,
    itemContent: e,
    groupContent: n,
    ScrollerComponent: u("Scroller", "div"),
    scrollerRef: c,
    ScrollSeekPlaceholder: u("ScrollSeekPlaceholder"),
    TableBodyComponent: u("TableBody", "tbody"),
    TableComponent: u("Table", "table"),
    TableFooterComponent: u("TableFoot", "tfoot"),
    TableHeadComponent: u("TableHead", "thead"),
    TableRowComponent: u("TableRow", "tr"),
    GroupComponent: u("Group", "tr")
  };
});
Oe(B_, Bj);
kf();
const Om = {
  bottom: 0,
  itemHeight: 0,
  items: [],
  itemWidth: 0,
  offsetBottom: 0,
  offsetTop: 0,
  top: 0
}, $j = {
  bottom: 0,
  itemHeight: 0,
  items: [{ index: 0 }],
  itemWidth: 0,
  offsetBottom: 0,
  offsetTop: 0,
  top: 0
}, { ceil: Lm, floor: ul, max: Wa, min: Cc, round: zm } = Math;
function Bm(e, t, n) {
  return Array.from({ length: t - e + 1 }).map((r, s) => ({ data: n === null ? null : n[s + e], index: s + e }));
}
function Hj(e) {
  return {
    ...$j,
    items: e
  };
}
function co(e, t) {
  return e !== void 0 && e.width === t.width && e.height === t.height;
}
function Fj(e, t) {
  return e !== void 0 && e.column === t.column && e.row === t.row;
}
const Uj = /* @__PURE__ */ Ne(
  ([
    { increaseViewportBy: e, listBoundary: t, overscan: n, visibleRange: r },
    { footerHeight: s, headerHeight: i, scrollBy: o, scrollContainerState: c, scrollTo: u, scrollTop: p, smoothScrollTargetReached: h, viewportHeight: x },
    g,
    w,
    { didMount: E, propsReady: I },
    { customScrollParent: D, useWindowScroll: y, windowScrollContainerState: b, windowScrollTo: N, windowViewportRect: l },
    d
  ]) => {
    const f = q(0), m = q(0), v = q(Om), k = q({ height: 0, width: 0 }), S = q({ height: 0, width: 0 }), C = we(), L = we(), B = q(0), A = q(null), z = q({ column: 0, row: 0 }), j = we(), $ = we(), O = q(!1), F = q(0), U = q(!0), V = q(!1), Z = q(!1);
    je(
      G(
        E,
        he(F),
        oe(([W, ae]) => ae !== 0)
      ),
      () => {
        me(U, !1);
      }
    ), je(
      G(
        qe(E, U, S, k, F, V),
        oe(([W, ae, fe, ge, , Se]) => W && !ae && fe.height !== 0 && ge.height !== 0 && !Se)
      ),
      ([, , , , W]) => {
        me(V, !0), xf(1, () => {
          me(C, W);
        }), wn(G(p), () => {
          me(t, [0, 0]), me(U, !0);
        });
      }
    ), te(
      G(
        $,
        oe((W) => W != null && W.scrollTop > 0),
        On(0)
      ),
      m
    ), je(
      G(
        E,
        he($),
        oe(([, W]) => W != null)
      ),
      ([, W]) => {
        W && (me(k, W.viewport), me(S, W.item), me(z, W.gap), W.scrollTop > 0 && (me(O, !0), wn(G(p, cs(1)), (ae) => {
          me(O, !1);
        }), me(u, { top: W.scrollTop })));
      }
    ), te(
      G(
        k,
        Q(({ height: W }) => W)
      ),
      x
    ), te(
      G(
        qe(
          ie(k, co),
          ie(S, co),
          ie(z, (W, ae) => W !== void 0 && W.column === ae.column && W.row === ae.row),
          ie(p)
        ),
        Q(([W, ae, fe, ge]) => ({
          gap: fe,
          item: ae,
          scrollTop: ge,
          viewport: W
        }))
      ),
      j
    ), te(
      G(
        qe(
          ie(f),
          r,
          ie(z, Fj),
          ie(S, co),
          ie(k, co),
          ie(A),
          ie(m),
          ie(O),
          ie(U),
          ie(F)
        ),
        oe(([, , , , , , , W]) => !W),
        Q(
          ([
            W,
            [ae, fe],
            ge,
            Se,
            xe,
            Te,
            et,
            ,
            Ee,
            pt
          ]) => {
            const { column: tt, row: cn } = ge, { height: Nn, width: Kt } = Se, { width: Un } = xe;
            if (et === 0 && (W === 0 || Un === 0))
              return Om;
            if (Kt === 0) {
              const ur = bf(pt, W), ms = ur + Math.max(et - 1, 0);
              return Hj(Bm(ur, ms, Te));
            }
            const un = Q_(Un, Kt, tt);
            let Lt, qt;
            Ee ? ae === 0 && fe === 0 && et > 0 ? (Lt = 0, qt = et - 1) : (Lt = un * ul((ae + cn) / (Nn + cn)), qt = un * Lm((fe + cn) / (Nn + cn)) - 1, qt = Cc(W - 1, Wa(qt, un - 1)), Lt = Cc(qt, Wa(0, Lt))) : (Lt = 0, qt = -1);
            const Hr = Bm(Lt, qt, Te), { bottom: cr, top: jn } = $m(xe, ge, Se, Hr), dn = Lm(W / un), At = dn * Nn + (dn - 1) * cn - cr;
            return { bottom: cr, itemHeight: Nn, items: Hr, itemWidth: Kt, offsetBottom: At, offsetTop: jn, top: jn };
          }
        )
      ),
      v
    ), te(
      G(
        A,
        oe((W) => W !== null),
        Q((W) => W.length)
      ),
      f
    ), te(
      G(
        qe(k, S, v, z),
        oe(([W, ae, { items: fe }]) => fe.length > 0 && ae.height !== 0 && W.height !== 0),
        Q(([W, ae, { items: fe }, ge]) => {
          const { bottom: Se, top: xe } = $m(W, ge, ae, fe);
          return [xe, Se];
        }),
        Me(pi)
      ),
      t
    );
    const le = q(!1);
    te(
      G(
        p,
        he(le),
        Q(([W, ae]) => ae || W !== 0)
      ),
      le
    );
    const se = Ut(
      G(
        qe(v, f),
        oe(([{ items: W }]) => W.length > 0),
        he(le),
        oe(([[W, ae], fe]) => {
          const ge = W.items[W.items.length - 1].index === ae - 1;
          return (fe || W.bottom > 0 && W.itemHeight > 0 && W.offsetBottom === 0 && W.items.length === ae) && ge;
        }),
        Q(([[, W]]) => W - 1),
        Me()
      )
    ), _e = Ut(
      G(
        ie(v),
        oe(({ items: W }) => W.length > 0 && W[0].index === 0),
        On(0),
        Me()
      )
    ), ne = Ut(
      G(
        ie(v),
        he(O),
        oe(([{ items: W }, ae]) => W.length > 0 && !ae),
        Q(([{ items: W }]) => ({
          endIndex: W[W.length - 1].index,
          startIndex: W[0].index
        })),
        Me(j_),
        Jn(0)
      )
    );
    te(ne, w.scrollSeekRangeChanged), te(
      G(
        C,
        he(k, S, f, z),
        Q(([W, ae, fe, ge, Se]) => {
          const xe = A_(W), { align: Te, behavior: et, offset: Ee } = xe;
          let pt = xe.index;
          pt === "LAST" && (pt = ge - 1), pt = Wa(0, pt, Cc(ge - 1, pt));
          let tt = Ju(ae, Se, fe, pt);
          return Te === "end" ? tt = zm(tt - ae.height + fe.height) : Te === "center" && (tt = zm(tt - ae.height / 2 + fe.height / 2)), Ee !== void 0 && Ee !== 0 && (tt += Ee), { behavior: et, top: tt };
        })
      ),
      u
    );
    const Y = wt(
      G(
        v,
        Q((W) => W.offsetBottom + W.bottom)
      ),
      0
    );
    return te(
      G(
        l,
        Q((W) => ({ height: W.visibleHeight, width: W.visibleWidth }))
      ),
      k
    ), {
      customScrollParent: D,
      // input
      data: A,
      deviation: B,
      footerHeight: s,
      gap: z,
      headerHeight: i,
      increaseViewportBy: e,
      initialItemCount: m,
      itemDimensions: S,
      overscan: n,
      restoreStateFrom: $,
      scrollBy: o,
      scrollContainerState: c,
      scrollHeight: L,
      scrollTo: u,
      scrollToIndex: C,
      scrollTop: p,
      smoothScrollTargetReached: h,
      totalCount: f,
      useWindowScroll: y,
      viewportDimensions: k,
      windowScrollContainerState: b,
      windowScrollTo: N,
      windowViewportRect: l,
      ...w,
      // output
      gridState: v,
      horizontalDirection: Z,
      initialTopMostItemIndex: F,
      totalListHeight: Y,
      ...g,
      endReached: se,
      propsReady: I,
      rangeChanged: ne,
      startReached: _e,
      stateChanged: j,
      stateRestoreInProgress: O,
      ...d
    };
  },
  Oe(wf, It, Ei, L_, $r, Sf, Br)
);
function Q_(e, t, n) {
  return Wa(1, ul((e + n) / (ul(t) + n)));
}
function $m(e, t, n, r) {
  const { height: s } = n;
  if (s === void 0 || r.length === 0)
    return { bottom: 0, top: 0 };
  const i = Ju(e, t, n, r[0].index);
  return { bottom: Ju(e, t, n, r[r.length - 1].index) + s, top: i };
}
function Ju(e, t, n, r) {
  const s = Q_(e.width, n.width, t.column), i = ul(r / s), o = i * n.height + Wa(0, i - 1) * t.row;
  return o > 0 ? o + t.row : o;
}
const Wj = /* @__PURE__ */ Ne(() => {
  const e = q((x) => `Item ${x}`), t = q({}), n = q(null), r = q("virtuoso-grid-item"), s = q("virtuoso-grid-list"), i = q(Nf), o = q("div"), c = q(ia), u = (x, g = null) => wt(
    G(
      t,
      Q((w) => w[x]),
      Me()
    ),
    g
  ), p = q(!1), h = q(!1);
  return te(ie(h), p), {
    components: t,
    computeItemKey: i,
    context: n,
    FooterComponent: u("Footer"),
    HeaderComponent: u("Header"),
    headerFooterTag: o,
    itemClassName: r,
    ItemComponent: u("Item", "div"),
    itemContent: e,
    listClassName: s,
    ListComponent: u("List", "div"),
    readyStateChanged: p,
    reportReadyState: h,
    ScrollerComponent: u("Scroller", "div"),
    scrollerRef: c,
    ScrollSeekPlaceholder: u("ScrollSeekPlaceholder", "div")
  };
}), Gj = /* @__PURE__ */ Ne(
  ([e, t]) => ({ ...e, ...t }),
  Oe(Uj, Wj)
), Vj = /* @__PURE__ */ J.memo(function() {
  const e = Re("gridState"), t = Re("listClassName"), n = Re("itemClassName"), r = Re("itemContent"), s = Re("computeItemKey"), i = Re("isSeeking"), o = rn("scrollHeight"), c = Re("ItemComponent"), u = Re("ListComponent"), p = Re("ScrollSeekPlaceholder"), h = Re("context"), x = rn("itemDimensions"), g = rn("gap"), w = Re("log"), E = Re("stateRestoreInProgress"), I = rn("reportReadyState"), D = fs(
    J.useMemo(
      () => (y) => {
        const b = y.parentElement.parentElement.scrollHeight;
        o(b);
        const N = y.firstChild;
        if (N !== null) {
          const { height: l, width: d } = N.getBoundingClientRect();
          x({ height: l, width: d });
        }
        g({
          column: Hm("column-gap", getComputedStyle(y).columnGap, w),
          row: Hm("row-gap", getComputedStyle(y).rowGap, w)
        });
      },
      [o, x, g, w]
    ),
    !0,
    !1
  );
  return U_(() => {
    e.itemHeight > 0 && e.itemWidth > 0 && I(!0);
  }, [e]), E ? null : /* @__PURE__ */ a.jsx(
    u,
    {
      className: t,
      ref: D,
      ...bt(u, h),
      "data-testid": "virtuoso-item-list",
      style: { paddingBottom: e.offsetBottom, paddingTop: e.offsetTop },
      children: e.items.map((y) => {
        const b = s(y.index, y.data, h);
        return i ? /* @__PURE__ */ a.jsx(
          p,
          {
            ...bt(p, h),
            height: e.itemHeight,
            index: y.index,
            width: e.itemWidth
          },
          b
        ) : /* @__PURE__ */ P.createElement(
          c,
          {
            ...bt(c, h),
            className: n,
            "data-index": y.index,
            key: b
          },
          r(y.index, y.data, h)
        );
      })
    }
  );
}), Kj = J.memo(function() {
  const e = Re("HeaderComponent"), t = rn("headerHeight"), n = Re("headerFooterTag"), r = fs(
    J.useMemo(
      () => (i) => {
        t(Mr(i, "height"));
      },
      [t]
    ),
    !0,
    !1
  ), s = Re("context");
  return e != null ? /* @__PURE__ */ a.jsx(n, { ref: r, children: /* @__PURE__ */ a.jsx(e, { ...bt(e, s) }) }) : null;
}), qj = J.memo(function() {
  const e = Re("FooterComponent"), t = rn("footerHeight"), n = Re("headerFooterTag"), r = fs(
    J.useMemo(
      () => (i) => {
        t(Mr(i, "height"));
      },
      [t]
    ),
    !0,
    !1
  ), s = Re("context");
  return e != null ? /* @__PURE__ */ a.jsx(n, { ref: r, children: /* @__PURE__ */ a.jsx(e, { ...bt(e, s) }) }) : null;
}), Yj = ({ children: e }) => {
  const t = J.useContext(F_), n = rn("itemDimensions"), r = rn("viewportDimensions"), s = fs(
    J.useMemo(
      () => (i) => {
        r(i.getBoundingClientRect());
      },
      [r]
    ),
    !0,
    !1
  );
  return J.useEffect(() => {
    t && (r({ height: t.viewportHeight, width: t.viewportWidth }), n({ height: t.itemHeight, width: t.itemWidth }));
  }, [t, r, n]), /* @__PURE__ */ a.jsx("div", { ref: s, style: jf(!1), children: e });
}, Qj = ({ children: e }) => {
  const t = J.useContext(F_), n = rn("windowViewportRect"), r = rn("itemDimensions"), s = Re("customScrollParent"), i = Re("useWindowScroll"), o = x_(n, s, !1);
  return J.useEffect(() => {
    t && (r({ height: t.itemHeight, width: t.itemWidth }), n({ listHeight: 0, offsetTop: 0, visibleHeight: t.viewportHeight, visibleWidth: t.viewportWidth }));
  }, [t, n, r]), /* @__PURE__ */ a.jsx("div", { ref: o, style: V_(!1, i), children: e });
}, Xj = /* @__PURE__ */ J.memo(function({ ...e }) {
  const t = Re("useWindowScroll"), n = Re("customScrollParent"), r = n || t ? Jj : Zj, s = n || t ? Qj : Yj, i = Re("context");
  return /* @__PURE__ */ a.jsx(r, { ...e, ...bt(r, i), children: /* @__PURE__ */ a.jsxs(s, { children: [
    /* @__PURE__ */ a.jsx(Kj, {}),
    /* @__PURE__ */ a.jsx(Vj, {}),
    /* @__PURE__ */ a.jsx(qj, {})
  ] }) });
}), {
  useEmitter: X_,
  useEmitterValue: Re,
  usePublisher: rn
} = /* @__PURE__ */ $_(
  Gj,
  {
    optional: {
      context: "context",
      totalCount: "totalCount",
      overscan: "overscan",
      itemContent: "itemContent",
      components: "components",
      computeItemKey: "computeItemKey",
      data: "data",
      initialItemCount: "initialItemCount",
      scrollSeekConfiguration: "scrollSeekConfiguration",
      headerFooterTag: "headerFooterTag",
      listClassName: "listClassName",
      itemClassName: "itemClassName",
      useWindowScroll: "useWindowScroll",
      customScrollParent: "customScrollParent",
      scrollerRef: "scrollerRef",
      logLevel: "logLevel",
      restoreStateFrom: "restoreStateFrom",
      initialTopMostItemIndex: "initialTopMostItemIndex",
      increaseViewportBy: "increaseViewportBy"
    },
    methods: {
      scrollTo: "scrollTo",
      scrollBy: "scrollBy",
      scrollToIndex: "scrollToIndex"
    },
    events: {
      isScrolling: "isScrolling",
      endReached: "endReached",
      startReached: "startReached",
      rangeChanged: "rangeChanged",
      atBottomStateChange: "atBottomStateChange",
      atTopStateChange: "atTopStateChange",
      stateChanged: "stateChanged",
      readyStateChanged: "readyStateChanged"
    }
  },
  Xj
), Zj = /* @__PURE__ */ K_({ useEmitter: X_, useEmitterValue: Re, usePublisher: rn }), Jj = /* @__PURE__ */ q_({ useEmitter: X_, useEmitterValue: Re, usePublisher: rn });
function Hm(e, t, n) {
  return t !== "normal" && t?.endsWith("px") !== !0 && n(`${e} was not resolved to pixel value correctly`, t, Je.WARN), t === "normal" ? 0 : parseInt(t ?? "0", 10);
}
var Z_ = { exports: {} };
(function(e) {
  (function() {
    function t(l) {
      var d = {
        omitExtraWLInCodeBlocks: {
          defaultValue: !1,
          describe: "Omit the default extra whiteline added to code blocks",
          type: "boolean"
        },
        noHeaderId: {
          defaultValue: !1,
          describe: "Turn on/off generated header id",
          type: "boolean"
        },
        prefixHeaderId: {
          defaultValue: !1,
          describe: "Add a prefix to the generated header ids. Passing a string will prefix that string to the header id. Setting to true will add a generic 'section-' prefix",
          type: "string"
        },
        rawPrefixHeaderId: {
          defaultValue: !1,
          describe: 'Setting this option to true will prevent showdown from modifying the prefix. This might result in malformed IDs (if, for instance, the " char is used in the prefix)',
          type: "boolean"
        },
        ghCompatibleHeaderId: {
          defaultValue: !1,
          describe: "Generate header ids compatible with github style (spaces are replaced with dashes, a bunch of non alphanumeric chars are removed)",
          type: "boolean"
        },
        rawHeaderId: {
          defaultValue: !1,
          describe: `Remove only spaces, ' and " from generated header ids (including prefixes), replacing them with dashes (-). WARNING: This might result in malformed ids`,
          type: "boolean"
        },
        headerLevelStart: {
          defaultValue: !1,
          describe: "The header blocks level start",
          type: "integer"
        },
        parseImgDimensions: {
          defaultValue: !1,
          describe: "Turn on/off image dimension parsing",
          type: "boolean"
        },
        simplifiedAutoLink: {
          defaultValue: !1,
          describe: "Turn on/off GFM autolink style",
          type: "boolean"
        },
        excludeTrailingPunctuationFromURLs: {
          defaultValue: !1,
          describe: "Excludes trailing punctuation from links generated with autoLinking",
          type: "boolean"
        },
        literalMidWordUnderscores: {
          defaultValue: !1,
          describe: "Parse midword underscores as literal underscores",
          type: "boolean"
        },
        literalMidWordAsterisks: {
          defaultValue: !1,
          describe: "Parse midword asterisks as literal asterisks",
          type: "boolean"
        },
        strikethrough: {
          defaultValue: !1,
          describe: "Turn on/off strikethrough support",
          type: "boolean"
        },
        tables: {
          defaultValue: !1,
          describe: "Turn on/off tables support",
          type: "boolean"
        },
        tablesHeaderId: {
          defaultValue: !1,
          describe: "Add an id to table headers",
          type: "boolean"
        },
        ghCodeBlocks: {
          defaultValue: !0,
          describe: "Turn on/off GFM fenced code blocks support",
          type: "boolean"
        },
        tasklists: {
          defaultValue: !1,
          describe: "Turn on/off GFM tasklist support",
          type: "boolean"
        },
        smoothLivePreview: {
          defaultValue: !1,
          describe: "Prevents weird effects in live previews due to incomplete input",
          type: "boolean"
        },
        smartIndentationFix: {
          defaultValue: !1,
          describe: "Tries to smartly fix indentation in es6 strings",
          type: "boolean"
        },
        disableForced4SpacesIndentedSublists: {
          defaultValue: !1,
          describe: "Disables the requirement of indenting nested sublists by 4 spaces",
          type: "boolean"
        },
        simpleLineBreaks: {
          defaultValue: !1,
          describe: "Parses simple line breaks as <br> (GFM Style)",
          type: "boolean"
        },
        requireSpaceBeforeHeadingText: {
          defaultValue: !1,
          describe: "Makes adding a space between `#` and the header text mandatory (GFM Style)",
          type: "boolean"
        },
        ghMentions: {
          defaultValue: !1,
          describe: "Enables github @mentions",
          type: "boolean"
        },
        ghMentionsLink: {
          defaultValue: "https://github.com/{u}",
          describe: "Changes the link generated by @mentions. Only applies if ghMentions option is enabled.",
          type: "string"
        },
        encodeEmails: {
          defaultValue: !0,
          describe: "Encode e-mail addresses through the use of Character Entities, transforming ASCII e-mail addresses into its equivalent decimal entities",
          type: "boolean"
        },
        openLinksInNewWindow: {
          defaultValue: !1,
          describe: "Open all links in new windows",
          type: "boolean"
        },
        backslashEscapesHTMLTags: {
          defaultValue: !1,
          describe: "Support for HTML Tag escaping. ex: <div>foo</div>",
          type: "boolean"
        },
        emoji: {
          defaultValue: !1,
          describe: "Enable emoji support. Ex: `this is a :smile: emoji`",
          type: "boolean"
        },
        underline: {
          defaultValue: !1,
          describe: "Enable support for underline. Syntax is double or triple underscores: `__underline word__`. With this option enabled, underscores no longer parses into `<em>` and `<strong>`",
          type: "boolean"
        },
        ellipsis: {
          defaultValue: !0,
          describe: "Replaces three dots with the ellipsis unicode character",
          type: "boolean"
        },
        completeHTMLDocument: {
          defaultValue: !1,
          describe: "Outputs a complete html document, including `<html>`, `<head>` and `<body>` tags",
          type: "boolean"
        },
        metadata: {
          defaultValue: !1,
          describe: "Enable support for document metadata (defined at the top of the document between `«««` and `»»»` or between `---` and `---`).",
          type: "boolean"
        },
        splitAdjacentBlockquotes: {
          defaultValue: !1,
          describe: "Split adjacent blockquote blocks",
          type: "boolean"
        }
      };
      if (l === !1)
        return JSON.parse(JSON.stringify(d));
      var f = {};
      for (var m in d)
        d.hasOwnProperty(m) && (f[m] = d[m].defaultValue);
      return f;
    }
    function n() {
      var l = t(!0), d = {};
      for (var f in l)
        l.hasOwnProperty(f) && (d[f] = !0);
      return d;
    }
    var r = {}, s = {}, i = {}, o = t(!0), c = "vanilla", u = {
      github: {
        omitExtraWLInCodeBlocks: !0,
        simplifiedAutoLink: !0,
        excludeTrailingPunctuationFromURLs: !0,
        literalMidWordUnderscores: !0,
        strikethrough: !0,
        tables: !0,
        tablesHeaderId: !0,
        ghCodeBlocks: !0,
        tasklists: !0,
        disableForced4SpacesIndentedSublists: !0,
        simpleLineBreaks: !0,
        requireSpaceBeforeHeadingText: !0,
        ghCompatibleHeaderId: !0,
        ghMentions: !0,
        backslashEscapesHTMLTags: !0,
        emoji: !0,
        splitAdjacentBlockquotes: !0
      },
      original: {
        noHeaderId: !0,
        ghCodeBlocks: !1
      },
      ghost: {
        omitExtraWLInCodeBlocks: !0,
        parseImgDimensions: !0,
        simplifiedAutoLink: !0,
        excludeTrailingPunctuationFromURLs: !0,
        literalMidWordUnderscores: !0,
        strikethrough: !0,
        tables: !0,
        tablesHeaderId: !0,
        ghCodeBlocks: !0,
        tasklists: !0,
        smoothLivePreview: !0,
        simpleLineBreaks: !0,
        requireSpaceBeforeHeadingText: !0,
        ghMentions: !1,
        encodeEmails: !0
      },
      vanilla: t(!0),
      allOn: n()
    };
    r.helper = {}, r.extensions = {}, r.setOption = function(l, d) {
      return o[l] = d, this;
    }, r.getOption = function(l) {
      return o[l];
    }, r.getOptions = function() {
      return o;
    }, r.resetOptions = function() {
      o = t(!0);
    }, r.setFlavor = function(l) {
      if (!u.hasOwnProperty(l))
        throw Error(l + " flavor was not found");
      r.resetOptions();
      var d = u[l];
      c = l;
      for (var f in d)
        d.hasOwnProperty(f) && (o[f] = d[f]);
    }, r.getFlavor = function() {
      return c;
    }, r.getFlavorOptions = function(l) {
      if (u.hasOwnProperty(l))
        return u[l];
    }, r.getDefaultOptions = function(l) {
      return t(l);
    }, r.subParser = function(l, d) {
      if (r.helper.isString(l))
        if (typeof d < "u")
          s[l] = d;
        else {
          if (s.hasOwnProperty(l))
            return s[l];
          throw Error("SubParser named " + l + " not registered!");
        }
    }, r.extension = function(l, d) {
      if (!r.helper.isString(l))
        throw Error("Extension 'name' must be a string");
      if (l = r.helper.stdExtName(l), r.helper.isUndefined(d)) {
        if (!i.hasOwnProperty(l))
          throw Error("Extension named " + l + " is not registered!");
        return i[l];
      } else {
        typeof d == "function" && (d = d()), r.helper.isArray(d) || (d = [d]);
        var f = p(d, l);
        if (f.valid)
          i[l] = d;
        else
          throw Error(f.error);
      }
    }, r.getAllExtensions = function() {
      return i;
    }, r.removeExtension = function(l) {
      delete i[l];
    }, r.resetExtensions = function() {
      i = {};
    };
    function p(l, d) {
      var f = d ? "Error in " + d + " extension->" : "Error in unnamed extension", m = {
        valid: !0,
        error: ""
      };
      r.helper.isArray(l) || (l = [l]);
      for (var v = 0; v < l.length; ++v) {
        var k = f + " sub-extension " + v + ": ", S = l[v];
        if (typeof S != "object")
          return m.valid = !1, m.error = k + "must be an object, but " + typeof S + " given", m;
        if (!r.helper.isString(S.type))
          return m.valid = !1, m.error = k + 'property "type" must be a string, but ' + typeof S.type + " given", m;
        var C = S.type = S.type.toLowerCase();
        if (C === "language" && (C = S.type = "lang"), C === "html" && (C = S.type = "output"), C !== "lang" && C !== "output" && C !== "listener")
          return m.valid = !1, m.error = k + "type " + C + ' is not recognized. Valid values: "lang/language", "output/html" or "listener"', m;
        if (C === "listener") {
          if (r.helper.isUndefined(S.listeners))
            return m.valid = !1, m.error = k + '. Extensions of type "listener" must have a property called "listeners"', m;
        } else if (r.helper.isUndefined(S.filter) && r.helper.isUndefined(S.regex))
          return m.valid = !1, m.error = k + C + ' extensions must define either a "regex" property or a "filter" method', m;
        if (S.listeners) {
          if (typeof S.listeners != "object")
            return m.valid = !1, m.error = k + '"listeners" property must be an object but ' + typeof S.listeners + " given", m;
          for (var L in S.listeners)
            if (S.listeners.hasOwnProperty(L) && typeof S.listeners[L] != "function")
              return m.valid = !1, m.error = k + '"listeners" property must be an hash of [event name]: [callback]. listeners.' + L + " must be a function but " + typeof S.listeners[L] + " given", m;
        }
        if (S.filter) {
          if (typeof S.filter != "function")
            return m.valid = !1, m.error = k + '"filter" must be a function, but ' + typeof S.filter + " given", m;
        } else if (S.regex) {
          if (r.helper.isString(S.regex) && (S.regex = new RegExp(S.regex, "g")), !(S.regex instanceof RegExp))
            return m.valid = !1, m.error = k + '"regex" property must either be a string or a RegExp object, but ' + typeof S.regex + " given", m;
          if (r.helper.isUndefined(S.replace))
            return m.valid = !1, m.error = k + '"regex" extensions must implement a replace string or function', m;
        }
      }
      return m;
    }
    r.validateExtension = function(l) {
      var d = p(l, null);
      return d.valid ? !0 : (console.warn(d.error), !1);
    }, r.hasOwnProperty("helper") || (r.helper = {}), r.helper.isString = function(l) {
      return typeof l == "string" || l instanceof String;
    }, r.helper.isFunction = function(l) {
      var d = {};
      return l && d.toString.call(l) === "[object Function]";
    }, r.helper.isArray = function(l) {
      return Array.isArray(l);
    }, r.helper.isUndefined = function(l) {
      return typeof l > "u";
    }, r.helper.forEach = function(l, d) {
      if (r.helper.isUndefined(l))
        throw new Error("obj param is required");
      if (r.helper.isUndefined(d))
        throw new Error("callback param is required");
      if (!r.helper.isFunction(d))
        throw new Error("callback param must be a function/closure");
      if (typeof l.forEach == "function")
        l.forEach(d);
      else if (r.helper.isArray(l))
        for (var f = 0; f < l.length; f++)
          d(l[f], f, l);
      else if (typeof l == "object")
        for (var m in l)
          l.hasOwnProperty(m) && d(l[m], m, l);
      else
        throw new Error("obj does not seem to be an array or an iterable object");
    }, r.helper.stdExtName = function(l) {
      return l.replace(/[_?*+\/\\.^-]/g, "").replace(/\s/g, "").toLowerCase();
    };
    function h(l, d) {
      var f = d.charCodeAt(0);
      return "¨E" + f + "E";
    }
    r.helper.escapeCharactersCallback = h, r.helper.escapeCharacters = function(l, d, f) {
      var m = "([" + d.replace(/([\[\]\\])/g, "\\$1") + "])";
      f && (m = "\\\\" + m);
      var v = new RegExp(m, "g");
      return l = l.replace(v, h), l;
    }, r.helper.unescapeHTMLEntities = function(l) {
      return l.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
    var x = function(l, d, f, m) {
      var v = m || "", k = v.indexOf("g") > -1, S = new RegExp(d + "|" + f, "g" + v.replace(/g/g, "")), C = new RegExp(d, v.replace(/g/g, "")), L = [], B, A, z, j, $;
      do
        for (B = 0; z = S.exec(l); )
          if (C.test(z[0]))
            B++ || (A = S.lastIndex, j = A - z[0].length);
          else if (B && !--B) {
            $ = z.index + z[0].length;
            var O = {
              left: { start: j, end: A },
              match: { start: A, end: z.index },
              right: { start: z.index, end: $ },
              wholeMatch: { start: j, end: $ }
            };
            if (L.push(O), !k)
              return L;
          }
      while (B && (S.lastIndex = A));
      return L;
    };
    r.helper.matchRecursiveRegExp = function(l, d, f, m) {
      for (var v = x(l, d, f, m), k = [], S = 0; S < v.length; ++S)
        k.push([
          l.slice(v[S].wholeMatch.start, v[S].wholeMatch.end),
          l.slice(v[S].match.start, v[S].match.end),
          l.slice(v[S].left.start, v[S].left.end),
          l.slice(v[S].right.start, v[S].right.end)
        ]);
      return k;
    }, r.helper.replaceRecursiveRegExp = function(l, d, f, m, v) {
      if (!r.helper.isFunction(d)) {
        var k = d;
        d = function() {
          return k;
        };
      }
      var S = x(l, f, m, v), C = l, L = S.length;
      if (L > 0) {
        var B = [];
        S[0].wholeMatch.start !== 0 && B.push(l.slice(0, S[0].wholeMatch.start));
        for (var A = 0; A < L; ++A)
          B.push(
            d(
              l.slice(S[A].wholeMatch.start, S[A].wholeMatch.end),
              l.slice(S[A].match.start, S[A].match.end),
              l.slice(S[A].left.start, S[A].left.end),
              l.slice(S[A].right.start, S[A].right.end)
            )
          ), A < L - 1 && B.push(l.slice(S[A].wholeMatch.end, S[A + 1].wholeMatch.start));
        S[L - 1].wholeMatch.end < l.length && B.push(l.slice(S[L - 1].wholeMatch.end)), C = B.join("");
      }
      return C;
    }, r.helper.regexIndexOf = function(l, d, f) {
      if (!r.helper.isString(l))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      if (!(d instanceof RegExp))
        throw "InvalidArgumentError: second parameter of showdown.helper.regexIndexOf function must be an instance of RegExp";
      var m = l.substring(f || 0).search(d);
      return m >= 0 ? m + (f || 0) : m;
    }, r.helper.splitAtIndex = function(l, d) {
      if (!r.helper.isString(l))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      return [l.substring(0, d), l.substring(d)];
    }, r.helper.encodeEmailAddress = function(l) {
      var d = [
        function(f) {
          return "&#" + f.charCodeAt(0) + ";";
        },
        function(f) {
          return "&#x" + f.charCodeAt(0).toString(16) + ";";
        },
        function(f) {
          return f;
        }
      ];
      return l = l.replace(/./g, function(f) {
        if (f === "@")
          f = d[Math.floor(Math.random() * 2)](f);
        else {
          var m = Math.random();
          f = m > 0.9 ? d[2](f) : m > 0.45 ? d[1](f) : d[0](f);
        }
        return f;
      }), l;
    }, r.helper.padEnd = function(d, f, m) {
      return f = f >> 0, m = String(m || " "), d.length > f ? String(d) : (f = f - d.length, f > m.length && (m += m.repeat(f / m.length)), String(d) + m.slice(0, f));
    }, typeof console > "u" && (console = {
      warn: function(l) {
        alert(l);
      },
      log: function(l) {
        alert(l);
      },
      error: function(l) {
        throw l;
      }
    }), r.helper.regexes = {
      asteriskDashAndColon: /([*_:~])/g
    }, r.helper.emojis = {
      "+1": "👍",
      "-1": "👎",
      100: "💯",
      1234: "🔢",
      "1st_place_medal": "🥇",
      "2nd_place_medal": "🥈",
      "3rd_place_medal": "🥉",
      "8ball": "🎱",
      a: "🅰️",
      ab: "🆎",
      abc: "🔤",
      abcd: "🔡",
      accept: "🉑",
      aerial_tramway: "🚡",
      airplane: "✈️",
      alarm_clock: "⏰",
      alembic: "⚗️",
      alien: "👽",
      ambulance: "🚑",
      amphora: "🏺",
      anchor: "⚓️",
      angel: "👼",
      anger: "💢",
      angry: "😠",
      anguished: "😧",
      ant: "🐜",
      apple: "🍎",
      aquarius: "♒️",
      aries: "♈️",
      arrow_backward: "◀️",
      arrow_double_down: "⏬",
      arrow_double_up: "⏫",
      arrow_down: "⬇️",
      arrow_down_small: "🔽",
      arrow_forward: "▶️",
      arrow_heading_down: "⤵️",
      arrow_heading_up: "⤴️",
      arrow_left: "⬅️",
      arrow_lower_left: "↙️",
      arrow_lower_right: "↘️",
      arrow_right: "➡️",
      arrow_right_hook: "↪️",
      arrow_up: "⬆️",
      arrow_up_down: "↕️",
      arrow_up_small: "🔼",
      arrow_upper_left: "↖️",
      arrow_upper_right: "↗️",
      arrows_clockwise: "🔃",
      arrows_counterclockwise: "🔄",
      art: "🎨",
      articulated_lorry: "🚛",
      artificial_satellite: "🛰",
      astonished: "😲",
      athletic_shoe: "👟",
      atm: "🏧",
      atom_symbol: "⚛️",
      avocado: "🥑",
      b: "🅱️",
      baby: "👶",
      baby_bottle: "🍼",
      baby_chick: "🐤",
      baby_symbol: "🚼",
      back: "🔙",
      bacon: "🥓",
      badminton: "🏸",
      baggage_claim: "🛄",
      baguette_bread: "🥖",
      balance_scale: "⚖️",
      balloon: "🎈",
      ballot_box: "🗳",
      ballot_box_with_check: "☑️",
      bamboo: "🎍",
      banana: "🍌",
      bangbang: "‼️",
      bank: "🏦",
      bar_chart: "📊",
      barber: "💈",
      baseball: "⚾️",
      basketball: "🏀",
      basketball_man: "⛹️",
      basketball_woman: "⛹️&zwj;♀️",
      bat: "🦇",
      bath: "🛀",
      bathtub: "🛁",
      battery: "🔋",
      beach_umbrella: "🏖",
      bear: "🐻",
      bed: "🛏",
      bee: "🐝",
      beer: "🍺",
      beers: "🍻",
      beetle: "🐞",
      beginner: "🔰",
      bell: "🔔",
      bellhop_bell: "🛎",
      bento: "🍱",
      biking_man: "🚴",
      bike: "🚲",
      biking_woman: "🚴&zwj;♀️",
      bikini: "👙",
      biohazard: "☣️",
      bird: "🐦",
      birthday: "🎂",
      black_circle: "⚫️",
      black_flag: "🏴",
      black_heart: "🖤",
      black_joker: "🃏",
      black_large_square: "⬛️",
      black_medium_small_square: "◾️",
      black_medium_square: "◼️",
      black_nib: "✒️",
      black_small_square: "▪️",
      black_square_button: "🔲",
      blonde_man: "👱",
      blonde_woman: "👱&zwj;♀️",
      blossom: "🌼",
      blowfish: "🐡",
      blue_book: "📘",
      blue_car: "🚙",
      blue_heart: "💙",
      blush: "😊",
      boar: "🐗",
      boat: "⛵️",
      bomb: "💣",
      book: "📖",
      bookmark: "🔖",
      bookmark_tabs: "📑",
      books: "📚",
      boom: "💥",
      boot: "👢",
      bouquet: "💐",
      bowing_man: "🙇",
      bow_and_arrow: "🏹",
      bowing_woman: "🙇&zwj;♀️",
      bowling: "🎳",
      boxing_glove: "🥊",
      boy: "👦",
      bread: "🍞",
      bride_with_veil: "👰",
      bridge_at_night: "🌉",
      briefcase: "💼",
      broken_heart: "💔",
      bug: "🐛",
      building_construction: "🏗",
      bulb: "💡",
      bullettrain_front: "🚅",
      bullettrain_side: "🚄",
      burrito: "🌯",
      bus: "🚌",
      business_suit_levitating: "🕴",
      busstop: "🚏",
      bust_in_silhouette: "👤",
      busts_in_silhouette: "👥",
      butterfly: "🦋",
      cactus: "🌵",
      cake: "🍰",
      calendar: "📆",
      call_me_hand: "🤙",
      calling: "📲",
      camel: "🐫",
      camera: "📷",
      camera_flash: "📸",
      camping: "🏕",
      cancer: "♋️",
      candle: "🕯",
      candy: "🍬",
      canoe: "🛶",
      capital_abcd: "🔠",
      capricorn: "♑️",
      car: "🚗",
      card_file_box: "🗃",
      card_index: "📇",
      card_index_dividers: "🗂",
      carousel_horse: "🎠",
      carrot: "🥕",
      cat: "🐱",
      cat2: "🐈",
      cd: "💿",
      chains: "⛓",
      champagne: "🍾",
      chart: "💹",
      chart_with_downwards_trend: "📉",
      chart_with_upwards_trend: "📈",
      checkered_flag: "🏁",
      cheese: "🧀",
      cherries: "🍒",
      cherry_blossom: "🌸",
      chestnut: "🌰",
      chicken: "🐔",
      children_crossing: "🚸",
      chipmunk: "🐿",
      chocolate_bar: "🍫",
      christmas_tree: "🎄",
      church: "⛪️",
      cinema: "🎦",
      circus_tent: "🎪",
      city_sunrise: "🌇",
      city_sunset: "🌆",
      cityscape: "🏙",
      cl: "🆑",
      clamp: "🗜",
      clap: "👏",
      clapper: "🎬",
      classical_building: "🏛",
      clinking_glasses: "🥂",
      clipboard: "📋",
      clock1: "🕐",
      clock10: "🕙",
      clock1030: "🕥",
      clock11: "🕚",
      clock1130: "🕦",
      clock12: "🕛",
      clock1230: "🕧",
      clock130: "🕜",
      clock2: "🕑",
      clock230: "🕝",
      clock3: "🕒",
      clock330: "🕞",
      clock4: "🕓",
      clock430: "🕟",
      clock5: "🕔",
      clock530: "🕠",
      clock6: "🕕",
      clock630: "🕡",
      clock7: "🕖",
      clock730: "🕢",
      clock8: "🕗",
      clock830: "🕣",
      clock9: "🕘",
      clock930: "🕤",
      closed_book: "📕",
      closed_lock_with_key: "🔐",
      closed_umbrella: "🌂",
      cloud: "☁️",
      cloud_with_lightning: "🌩",
      cloud_with_lightning_and_rain: "⛈",
      cloud_with_rain: "🌧",
      cloud_with_snow: "🌨",
      clown_face: "🤡",
      clubs: "♣️",
      cocktail: "🍸",
      coffee: "☕️",
      coffin: "⚰️",
      cold_sweat: "😰",
      comet: "☄️",
      computer: "💻",
      computer_mouse: "🖱",
      confetti_ball: "🎊",
      confounded: "😖",
      confused: "😕",
      congratulations: "㊗️",
      construction: "🚧",
      construction_worker_man: "👷",
      construction_worker_woman: "👷&zwj;♀️",
      control_knobs: "🎛",
      convenience_store: "🏪",
      cookie: "🍪",
      cool: "🆒",
      policeman: "👮",
      copyright: "©️",
      corn: "🌽",
      couch_and_lamp: "🛋",
      couple: "👫",
      couple_with_heart_woman_man: "💑",
      couple_with_heart_man_man: "👨&zwj;❤️&zwj;👨",
      couple_with_heart_woman_woman: "👩&zwj;❤️&zwj;👩",
      couplekiss_man_man: "👨&zwj;❤️&zwj;💋&zwj;👨",
      couplekiss_man_woman: "💏",
      couplekiss_woman_woman: "👩&zwj;❤️&zwj;💋&zwj;👩",
      cow: "🐮",
      cow2: "🐄",
      cowboy_hat_face: "🤠",
      crab: "🦀",
      crayon: "🖍",
      credit_card: "💳",
      crescent_moon: "🌙",
      cricket: "🏏",
      crocodile: "🐊",
      croissant: "🥐",
      crossed_fingers: "🤞",
      crossed_flags: "🎌",
      crossed_swords: "⚔️",
      crown: "👑",
      cry: "😢",
      crying_cat_face: "😿",
      crystal_ball: "🔮",
      cucumber: "🥒",
      cupid: "💘",
      curly_loop: "➰",
      currency_exchange: "💱",
      curry: "🍛",
      custard: "🍮",
      customs: "🛃",
      cyclone: "🌀",
      dagger: "🗡",
      dancer: "💃",
      dancing_women: "👯",
      dancing_men: "👯&zwj;♂️",
      dango: "🍡",
      dark_sunglasses: "🕶",
      dart: "🎯",
      dash: "💨",
      date: "📅",
      deciduous_tree: "🌳",
      deer: "🦌",
      department_store: "🏬",
      derelict_house: "🏚",
      desert: "🏜",
      desert_island: "🏝",
      desktop_computer: "🖥",
      male_detective: "🕵️",
      diamond_shape_with_a_dot_inside: "💠",
      diamonds: "♦️",
      disappointed: "😞",
      disappointed_relieved: "😥",
      dizzy: "💫",
      dizzy_face: "😵",
      do_not_litter: "🚯",
      dog: "🐶",
      dog2: "🐕",
      dollar: "💵",
      dolls: "🎎",
      dolphin: "🐬",
      door: "🚪",
      doughnut: "🍩",
      dove: "🕊",
      dragon: "🐉",
      dragon_face: "🐲",
      dress: "👗",
      dromedary_camel: "🐪",
      drooling_face: "🤤",
      droplet: "💧",
      drum: "🥁",
      duck: "🦆",
      dvd: "📀",
      "e-mail": "📧",
      eagle: "🦅",
      ear: "👂",
      ear_of_rice: "🌾",
      earth_africa: "🌍",
      earth_americas: "🌎",
      earth_asia: "🌏",
      egg: "🥚",
      eggplant: "🍆",
      eight_pointed_black_star: "✴️",
      eight_spoked_asterisk: "✳️",
      electric_plug: "🔌",
      elephant: "🐘",
      email: "✉️",
      end: "🔚",
      envelope_with_arrow: "📩",
      euro: "💶",
      european_castle: "🏰",
      european_post_office: "🏤",
      evergreen_tree: "🌲",
      exclamation: "❗️",
      expressionless: "😑",
      eye: "👁",
      eye_speech_bubble: "👁&zwj;🗨",
      eyeglasses: "👓",
      eyes: "👀",
      face_with_head_bandage: "🤕",
      face_with_thermometer: "🤒",
      fist_oncoming: "👊",
      factory: "🏭",
      fallen_leaf: "🍂",
      family_man_woman_boy: "👪",
      family_man_boy: "👨&zwj;👦",
      family_man_boy_boy: "👨&zwj;👦&zwj;👦",
      family_man_girl: "👨&zwj;👧",
      family_man_girl_boy: "👨&zwj;👧&zwj;👦",
      family_man_girl_girl: "👨&zwj;👧&zwj;👧",
      family_man_man_boy: "👨&zwj;👨&zwj;👦",
      family_man_man_boy_boy: "👨&zwj;👨&zwj;👦&zwj;👦",
      family_man_man_girl: "👨&zwj;👨&zwj;👧",
      family_man_man_girl_boy: "👨&zwj;👨&zwj;👧&zwj;👦",
      family_man_man_girl_girl: "👨&zwj;👨&zwj;👧&zwj;👧",
      family_man_woman_boy_boy: "👨&zwj;👩&zwj;👦&zwj;👦",
      family_man_woman_girl: "👨&zwj;👩&zwj;👧",
      family_man_woman_girl_boy: "👨&zwj;👩&zwj;👧&zwj;👦",
      family_man_woman_girl_girl: "👨&zwj;👩&zwj;👧&zwj;👧",
      family_woman_boy: "👩&zwj;👦",
      family_woman_boy_boy: "👩&zwj;👦&zwj;👦",
      family_woman_girl: "👩&zwj;👧",
      family_woman_girl_boy: "👩&zwj;👧&zwj;👦",
      family_woman_girl_girl: "👩&zwj;👧&zwj;👧",
      family_woman_woman_boy: "👩&zwj;👩&zwj;👦",
      family_woman_woman_boy_boy: "👩&zwj;👩&zwj;👦&zwj;👦",
      family_woman_woman_girl: "👩&zwj;👩&zwj;👧",
      family_woman_woman_girl_boy: "👩&zwj;👩&zwj;👧&zwj;👦",
      family_woman_woman_girl_girl: "👩&zwj;👩&zwj;👧&zwj;👧",
      fast_forward: "⏩",
      fax: "📠",
      fearful: "😨",
      feet: "🐾",
      female_detective: "🕵️&zwj;♀️",
      ferris_wheel: "🎡",
      ferry: "⛴",
      field_hockey: "🏑",
      file_cabinet: "🗄",
      file_folder: "📁",
      film_projector: "📽",
      film_strip: "🎞",
      fire: "🔥",
      fire_engine: "🚒",
      fireworks: "🎆",
      first_quarter_moon: "🌓",
      first_quarter_moon_with_face: "🌛",
      fish: "🐟",
      fish_cake: "🍥",
      fishing_pole_and_fish: "🎣",
      fist_raised: "✊",
      fist_left: "🤛",
      fist_right: "🤜",
      flags: "🎏",
      flashlight: "🔦",
      fleur_de_lis: "⚜️",
      flight_arrival: "🛬",
      flight_departure: "🛫",
      floppy_disk: "💾",
      flower_playing_cards: "🎴",
      flushed: "😳",
      fog: "🌫",
      foggy: "🌁",
      football: "🏈",
      footprints: "👣",
      fork_and_knife: "🍴",
      fountain: "⛲️",
      fountain_pen: "🖋",
      four_leaf_clover: "🍀",
      fox_face: "🦊",
      framed_picture: "🖼",
      free: "🆓",
      fried_egg: "🍳",
      fried_shrimp: "🍤",
      fries: "🍟",
      frog: "🐸",
      frowning: "😦",
      frowning_face: "☹️",
      frowning_man: "🙍&zwj;♂️",
      frowning_woman: "🙍",
      middle_finger: "🖕",
      fuelpump: "⛽️",
      full_moon: "🌕",
      full_moon_with_face: "🌝",
      funeral_urn: "⚱️",
      game_die: "🎲",
      gear: "⚙️",
      gem: "💎",
      gemini: "♊️",
      ghost: "👻",
      gift: "🎁",
      gift_heart: "💝",
      girl: "👧",
      globe_with_meridians: "🌐",
      goal_net: "🥅",
      goat: "🐐",
      golf: "⛳️",
      golfing_man: "🏌️",
      golfing_woman: "🏌️&zwj;♀️",
      gorilla: "🦍",
      grapes: "🍇",
      green_apple: "🍏",
      green_book: "📗",
      green_heart: "💚",
      green_salad: "🥗",
      grey_exclamation: "❕",
      grey_question: "❔",
      grimacing: "😬",
      grin: "😁",
      grinning: "😀",
      guardsman: "💂",
      guardswoman: "💂&zwj;♀️",
      guitar: "🎸",
      gun: "🔫",
      haircut_woman: "💇",
      haircut_man: "💇&zwj;♂️",
      hamburger: "🍔",
      hammer: "🔨",
      hammer_and_pick: "⚒",
      hammer_and_wrench: "🛠",
      hamster: "🐹",
      hand: "✋",
      handbag: "👜",
      handshake: "🤝",
      hankey: "💩",
      hatched_chick: "🐥",
      hatching_chick: "🐣",
      headphones: "🎧",
      hear_no_evil: "🙉",
      heart: "❤️",
      heart_decoration: "💟",
      heart_eyes: "😍",
      heart_eyes_cat: "😻",
      heartbeat: "💓",
      heartpulse: "💗",
      hearts: "♥️",
      heavy_check_mark: "✔️",
      heavy_division_sign: "➗",
      heavy_dollar_sign: "💲",
      heavy_heart_exclamation: "❣️",
      heavy_minus_sign: "➖",
      heavy_multiplication_x: "✖️",
      heavy_plus_sign: "➕",
      helicopter: "🚁",
      herb: "🌿",
      hibiscus: "🌺",
      high_brightness: "🔆",
      high_heel: "👠",
      hocho: "🔪",
      hole: "🕳",
      honey_pot: "🍯",
      horse: "🐴",
      horse_racing: "🏇",
      hospital: "🏥",
      hot_pepper: "🌶",
      hotdog: "🌭",
      hotel: "🏨",
      hotsprings: "♨️",
      hourglass: "⌛️",
      hourglass_flowing_sand: "⏳",
      house: "🏠",
      house_with_garden: "🏡",
      houses: "🏘",
      hugs: "🤗",
      hushed: "😯",
      ice_cream: "🍨",
      ice_hockey: "🏒",
      ice_skate: "⛸",
      icecream: "🍦",
      id: "🆔",
      ideograph_advantage: "🉐",
      imp: "👿",
      inbox_tray: "📥",
      incoming_envelope: "📨",
      tipping_hand_woman: "💁",
      information_source: "ℹ️",
      innocent: "😇",
      interrobang: "⁉️",
      iphone: "📱",
      izakaya_lantern: "🏮",
      jack_o_lantern: "🎃",
      japan: "🗾",
      japanese_castle: "🏯",
      japanese_goblin: "👺",
      japanese_ogre: "👹",
      jeans: "👖",
      joy: "😂",
      joy_cat: "😹",
      joystick: "🕹",
      kaaba: "🕋",
      key: "🔑",
      keyboard: "⌨️",
      keycap_ten: "🔟",
      kick_scooter: "🛴",
      kimono: "👘",
      kiss: "💋",
      kissing: "😗",
      kissing_cat: "😽",
      kissing_closed_eyes: "😚",
      kissing_heart: "😘",
      kissing_smiling_eyes: "😙",
      kiwi_fruit: "🥝",
      koala: "🐨",
      koko: "🈁",
      label: "🏷",
      large_blue_circle: "🔵",
      large_blue_diamond: "🔷",
      large_orange_diamond: "🔶",
      last_quarter_moon: "🌗",
      last_quarter_moon_with_face: "🌜",
      latin_cross: "✝️",
      laughing: "😆",
      leaves: "🍃",
      ledger: "📒",
      left_luggage: "🛅",
      left_right_arrow: "↔️",
      leftwards_arrow_with_hook: "↩️",
      lemon: "🍋",
      leo: "♌️",
      leopard: "🐆",
      level_slider: "🎚",
      libra: "♎️",
      light_rail: "🚈",
      link: "🔗",
      lion: "🦁",
      lips: "👄",
      lipstick: "💄",
      lizard: "🦎",
      lock: "🔒",
      lock_with_ink_pen: "🔏",
      lollipop: "🍭",
      loop: "➿",
      loud_sound: "🔊",
      loudspeaker: "📢",
      love_hotel: "🏩",
      love_letter: "💌",
      low_brightness: "🔅",
      lying_face: "🤥",
      m: "Ⓜ️",
      mag: "🔍",
      mag_right: "🔎",
      mahjong: "🀄️",
      mailbox: "📫",
      mailbox_closed: "📪",
      mailbox_with_mail: "📬",
      mailbox_with_no_mail: "📭",
      man: "👨",
      man_artist: "👨&zwj;🎨",
      man_astronaut: "👨&zwj;🚀",
      man_cartwheeling: "🤸&zwj;♂️",
      man_cook: "👨&zwj;🍳",
      man_dancing: "🕺",
      man_facepalming: "🤦&zwj;♂️",
      man_factory_worker: "👨&zwj;🏭",
      man_farmer: "👨&zwj;🌾",
      man_firefighter: "👨&zwj;🚒",
      man_health_worker: "👨&zwj;⚕️",
      man_in_tuxedo: "🤵",
      man_judge: "👨&zwj;⚖️",
      man_juggling: "🤹&zwj;♂️",
      man_mechanic: "👨&zwj;🔧",
      man_office_worker: "👨&zwj;💼",
      man_pilot: "👨&zwj;✈️",
      man_playing_handball: "🤾&zwj;♂️",
      man_playing_water_polo: "🤽&zwj;♂️",
      man_scientist: "👨&zwj;🔬",
      man_shrugging: "🤷&zwj;♂️",
      man_singer: "👨&zwj;🎤",
      man_student: "👨&zwj;🎓",
      man_teacher: "👨&zwj;🏫",
      man_technologist: "👨&zwj;💻",
      man_with_gua_pi_mao: "👲",
      man_with_turban: "👳",
      tangerine: "🍊",
      mans_shoe: "👞",
      mantelpiece_clock: "🕰",
      maple_leaf: "🍁",
      martial_arts_uniform: "🥋",
      mask: "😷",
      massage_woman: "💆",
      massage_man: "💆&zwj;♂️",
      meat_on_bone: "🍖",
      medal_military: "🎖",
      medal_sports: "🏅",
      mega: "📣",
      melon: "🍈",
      memo: "📝",
      men_wrestling: "🤼&zwj;♂️",
      menorah: "🕎",
      mens: "🚹",
      metal: "🤘",
      metro: "🚇",
      microphone: "🎤",
      microscope: "🔬",
      milk_glass: "🥛",
      milky_way: "🌌",
      minibus: "🚐",
      minidisc: "💽",
      mobile_phone_off: "📴",
      money_mouth_face: "🤑",
      money_with_wings: "💸",
      moneybag: "💰",
      monkey: "🐒",
      monkey_face: "🐵",
      monorail: "🚝",
      moon: "🌔",
      mortar_board: "🎓",
      mosque: "🕌",
      motor_boat: "🛥",
      motor_scooter: "🛵",
      motorcycle: "🏍",
      motorway: "🛣",
      mount_fuji: "🗻",
      mountain: "⛰",
      mountain_biking_man: "🚵",
      mountain_biking_woman: "🚵&zwj;♀️",
      mountain_cableway: "🚠",
      mountain_railway: "🚞",
      mountain_snow: "🏔",
      mouse: "🐭",
      mouse2: "🐁",
      movie_camera: "🎥",
      moyai: "🗿",
      mrs_claus: "🤶",
      muscle: "💪",
      mushroom: "🍄",
      musical_keyboard: "🎹",
      musical_note: "🎵",
      musical_score: "🎼",
      mute: "🔇",
      nail_care: "💅",
      name_badge: "📛",
      national_park: "🏞",
      nauseated_face: "🤢",
      necktie: "👔",
      negative_squared_cross_mark: "❎",
      nerd_face: "🤓",
      neutral_face: "😐",
      new: "🆕",
      new_moon: "🌑",
      new_moon_with_face: "🌚",
      newspaper: "📰",
      newspaper_roll: "🗞",
      next_track_button: "⏭",
      ng: "🆖",
      no_good_man: "🙅&zwj;♂️",
      no_good_woman: "🙅",
      night_with_stars: "🌃",
      no_bell: "🔕",
      no_bicycles: "🚳",
      no_entry: "⛔️",
      no_entry_sign: "🚫",
      no_mobile_phones: "📵",
      no_mouth: "😶",
      no_pedestrians: "🚷",
      no_smoking: "🚭",
      "non-potable_water": "🚱",
      nose: "👃",
      notebook: "📓",
      notebook_with_decorative_cover: "📔",
      notes: "🎶",
      nut_and_bolt: "🔩",
      o: "⭕️",
      o2: "🅾️",
      ocean: "🌊",
      octopus: "🐙",
      oden: "🍢",
      office: "🏢",
      oil_drum: "🛢",
      ok: "🆗",
      ok_hand: "👌",
      ok_man: "🙆&zwj;♂️",
      ok_woman: "🙆",
      old_key: "🗝",
      older_man: "👴",
      older_woman: "👵",
      om: "🕉",
      on: "🔛",
      oncoming_automobile: "🚘",
      oncoming_bus: "🚍",
      oncoming_police_car: "🚔",
      oncoming_taxi: "🚖",
      open_file_folder: "📂",
      open_hands: "👐",
      open_mouth: "😮",
      open_umbrella: "☂️",
      ophiuchus: "⛎",
      orange_book: "📙",
      orthodox_cross: "☦️",
      outbox_tray: "📤",
      owl: "🦉",
      ox: "🐂",
      package: "📦",
      page_facing_up: "📄",
      page_with_curl: "📃",
      pager: "📟",
      paintbrush: "🖌",
      palm_tree: "🌴",
      pancakes: "🥞",
      panda_face: "🐼",
      paperclip: "📎",
      paperclips: "🖇",
      parasol_on_ground: "⛱",
      parking: "🅿️",
      part_alternation_mark: "〽️",
      partly_sunny: "⛅️",
      passenger_ship: "🛳",
      passport_control: "🛂",
      pause_button: "⏸",
      peace_symbol: "☮️",
      peach: "🍑",
      peanuts: "🥜",
      pear: "🍐",
      pen: "🖊",
      pencil2: "✏️",
      penguin: "🐧",
      pensive: "😔",
      performing_arts: "🎭",
      persevere: "😣",
      person_fencing: "🤺",
      pouting_woman: "🙎",
      phone: "☎️",
      pick: "⛏",
      pig: "🐷",
      pig2: "🐖",
      pig_nose: "🐽",
      pill: "💊",
      pineapple: "🍍",
      ping_pong: "🏓",
      pisces: "♓️",
      pizza: "🍕",
      place_of_worship: "🛐",
      plate_with_cutlery: "🍽",
      play_or_pause_button: "⏯",
      point_down: "👇",
      point_left: "👈",
      point_right: "👉",
      point_up: "☝️",
      point_up_2: "👆",
      police_car: "🚓",
      policewoman: "👮&zwj;♀️",
      poodle: "🐩",
      popcorn: "🍿",
      post_office: "🏣",
      postal_horn: "📯",
      postbox: "📮",
      potable_water: "🚰",
      potato: "🥔",
      pouch: "👝",
      poultry_leg: "🍗",
      pound: "💷",
      rage: "😡",
      pouting_cat: "😾",
      pouting_man: "🙎&zwj;♂️",
      pray: "🙏",
      prayer_beads: "📿",
      pregnant_woman: "🤰",
      previous_track_button: "⏮",
      prince: "🤴",
      princess: "👸",
      printer: "🖨",
      purple_heart: "💜",
      purse: "👛",
      pushpin: "📌",
      put_litter_in_its_place: "🚮",
      question: "❓",
      rabbit: "🐰",
      rabbit2: "🐇",
      racehorse: "🐎",
      racing_car: "🏎",
      radio: "📻",
      radio_button: "🔘",
      radioactive: "☢️",
      railway_car: "🚃",
      railway_track: "🛤",
      rainbow: "🌈",
      rainbow_flag: "🏳️&zwj;🌈",
      raised_back_of_hand: "🤚",
      raised_hand_with_fingers_splayed: "🖐",
      raised_hands: "🙌",
      raising_hand_woman: "🙋",
      raising_hand_man: "🙋&zwj;♂️",
      ram: "🐏",
      ramen: "🍜",
      rat: "🐀",
      record_button: "⏺",
      recycle: "♻️",
      red_circle: "🔴",
      registered: "®️",
      relaxed: "☺️",
      relieved: "😌",
      reminder_ribbon: "🎗",
      repeat: "🔁",
      repeat_one: "🔂",
      rescue_worker_helmet: "⛑",
      restroom: "🚻",
      revolving_hearts: "💞",
      rewind: "⏪",
      rhinoceros: "🦏",
      ribbon: "🎀",
      rice: "🍚",
      rice_ball: "🍙",
      rice_cracker: "🍘",
      rice_scene: "🎑",
      right_anger_bubble: "🗯",
      ring: "💍",
      robot: "🤖",
      rocket: "🚀",
      rofl: "🤣",
      roll_eyes: "🙄",
      roller_coaster: "🎢",
      rooster: "🐓",
      rose: "🌹",
      rosette: "🏵",
      rotating_light: "🚨",
      round_pushpin: "📍",
      rowing_man: "🚣",
      rowing_woman: "🚣&zwj;♀️",
      rugby_football: "🏉",
      running_man: "🏃",
      running_shirt_with_sash: "🎽",
      running_woman: "🏃&zwj;♀️",
      sa: "🈂️",
      sagittarius: "♐️",
      sake: "🍶",
      sandal: "👡",
      santa: "🎅",
      satellite: "📡",
      saxophone: "🎷",
      school: "🏫",
      school_satchel: "🎒",
      scissors: "✂️",
      scorpion: "🦂",
      scorpius: "♏️",
      scream: "😱",
      scream_cat: "🙀",
      scroll: "📜",
      seat: "💺",
      secret: "㊙️",
      see_no_evil: "🙈",
      seedling: "🌱",
      selfie: "🤳",
      shallow_pan_of_food: "🥘",
      shamrock: "☘️",
      shark: "🦈",
      shaved_ice: "🍧",
      sheep: "🐑",
      shell: "🐚",
      shield: "🛡",
      shinto_shrine: "⛩",
      ship: "🚢",
      shirt: "👕",
      shopping: "🛍",
      shopping_cart: "🛒",
      shower: "🚿",
      shrimp: "🦐",
      signal_strength: "📶",
      six_pointed_star: "🔯",
      ski: "🎿",
      skier: "⛷",
      skull: "💀",
      skull_and_crossbones: "☠️",
      sleeping: "😴",
      sleeping_bed: "🛌",
      sleepy: "😪",
      slightly_frowning_face: "🙁",
      slightly_smiling_face: "🙂",
      slot_machine: "🎰",
      small_airplane: "🛩",
      small_blue_diamond: "🔹",
      small_orange_diamond: "🔸",
      small_red_triangle: "🔺",
      small_red_triangle_down: "🔻",
      smile: "😄",
      smile_cat: "😸",
      smiley: "😃",
      smiley_cat: "😺",
      smiling_imp: "😈",
      smirk: "😏",
      smirk_cat: "😼",
      smoking: "🚬",
      snail: "🐌",
      snake: "🐍",
      sneezing_face: "🤧",
      snowboarder: "🏂",
      snowflake: "❄️",
      snowman: "⛄️",
      snowman_with_snow: "☃️",
      sob: "😭",
      soccer: "⚽️",
      soon: "🔜",
      sos: "🆘",
      sound: "🔉",
      space_invader: "👾",
      spades: "♠️",
      spaghetti: "🍝",
      sparkle: "❇️",
      sparkler: "🎇",
      sparkles: "✨",
      sparkling_heart: "💖",
      speak_no_evil: "🙊",
      speaker: "🔈",
      speaking_head: "🗣",
      speech_balloon: "💬",
      speedboat: "🚤",
      spider: "🕷",
      spider_web: "🕸",
      spiral_calendar: "🗓",
      spiral_notepad: "🗒",
      spoon: "🥄",
      squid: "🦑",
      stadium: "🏟",
      star: "⭐️",
      star2: "🌟",
      star_and_crescent: "☪️",
      star_of_david: "✡️",
      stars: "🌠",
      station: "🚉",
      statue_of_liberty: "🗽",
      steam_locomotive: "🚂",
      stew: "🍲",
      stop_button: "⏹",
      stop_sign: "🛑",
      stopwatch: "⏱",
      straight_ruler: "📏",
      strawberry: "🍓",
      stuck_out_tongue: "😛",
      stuck_out_tongue_closed_eyes: "😝",
      stuck_out_tongue_winking_eye: "😜",
      studio_microphone: "🎙",
      stuffed_flatbread: "🥙",
      sun_behind_large_cloud: "🌥",
      sun_behind_rain_cloud: "🌦",
      sun_behind_small_cloud: "🌤",
      sun_with_face: "🌞",
      sunflower: "🌻",
      sunglasses: "😎",
      sunny: "☀️",
      sunrise: "🌅",
      sunrise_over_mountains: "🌄",
      surfing_man: "🏄",
      surfing_woman: "🏄&zwj;♀️",
      sushi: "🍣",
      suspension_railway: "🚟",
      sweat: "😓",
      sweat_drops: "💦",
      sweat_smile: "😅",
      sweet_potato: "🍠",
      swimming_man: "🏊",
      swimming_woman: "🏊&zwj;♀️",
      symbols: "🔣",
      synagogue: "🕍",
      syringe: "💉",
      taco: "🌮",
      tada: "🎉",
      tanabata_tree: "🎋",
      taurus: "♉️",
      taxi: "🚕",
      tea: "🍵",
      telephone_receiver: "📞",
      telescope: "🔭",
      tennis: "🎾",
      tent: "⛺️",
      thermometer: "🌡",
      thinking: "🤔",
      thought_balloon: "💭",
      ticket: "🎫",
      tickets: "🎟",
      tiger: "🐯",
      tiger2: "🐅",
      timer_clock: "⏲",
      tipping_hand_man: "💁&zwj;♂️",
      tired_face: "😫",
      tm: "™️",
      toilet: "🚽",
      tokyo_tower: "🗼",
      tomato: "🍅",
      tongue: "👅",
      top: "🔝",
      tophat: "🎩",
      tornado: "🌪",
      trackball: "🖲",
      tractor: "🚜",
      traffic_light: "🚥",
      train: "🚋",
      train2: "🚆",
      tram: "🚊",
      triangular_flag_on_post: "🚩",
      triangular_ruler: "📐",
      trident: "🔱",
      triumph: "😤",
      trolleybus: "🚎",
      trophy: "🏆",
      tropical_drink: "🍹",
      tropical_fish: "🐠",
      truck: "🚚",
      trumpet: "🎺",
      tulip: "🌷",
      tumbler_glass: "🥃",
      turkey: "🦃",
      turtle: "🐢",
      tv: "📺",
      twisted_rightwards_arrows: "🔀",
      two_hearts: "💕",
      two_men_holding_hands: "👬",
      two_women_holding_hands: "👭",
      u5272: "🈹",
      u5408: "🈴",
      u55b6: "🈺",
      u6307: "🈯️",
      u6708: "🈷️",
      u6709: "🈶",
      u6e80: "🈵",
      u7121: "🈚️",
      u7533: "🈸",
      u7981: "🈲",
      u7a7a: "🈳",
      umbrella: "☔️",
      unamused: "😒",
      underage: "🔞",
      unicorn: "🦄",
      unlock: "🔓",
      up: "🆙",
      upside_down_face: "🙃",
      v: "✌️",
      vertical_traffic_light: "🚦",
      vhs: "📼",
      vibration_mode: "📳",
      video_camera: "📹",
      video_game: "🎮",
      violin: "🎻",
      virgo: "♍️",
      volcano: "🌋",
      volleyball: "🏐",
      vs: "🆚",
      vulcan_salute: "🖖",
      walking_man: "🚶",
      walking_woman: "🚶&zwj;♀️",
      waning_crescent_moon: "🌘",
      waning_gibbous_moon: "🌖",
      warning: "⚠️",
      wastebasket: "🗑",
      watch: "⌚️",
      water_buffalo: "🐃",
      watermelon: "🍉",
      wave: "👋",
      wavy_dash: "〰️",
      waxing_crescent_moon: "🌒",
      wc: "🚾",
      weary: "😩",
      wedding: "💒",
      weight_lifting_man: "🏋️",
      weight_lifting_woman: "🏋️&zwj;♀️",
      whale: "🐳",
      whale2: "🐋",
      wheel_of_dharma: "☸️",
      wheelchair: "♿️",
      white_check_mark: "✅",
      white_circle: "⚪️",
      white_flag: "🏳️",
      white_flower: "💮",
      white_large_square: "⬜️",
      white_medium_small_square: "◽️",
      white_medium_square: "◻️",
      white_small_square: "▫️",
      white_square_button: "🔳",
      wilted_flower: "🥀",
      wind_chime: "🎐",
      wind_face: "🌬",
      wine_glass: "🍷",
      wink: "😉",
      wolf: "🐺",
      woman: "👩",
      woman_artist: "👩&zwj;🎨",
      woman_astronaut: "👩&zwj;🚀",
      woman_cartwheeling: "🤸&zwj;♀️",
      woman_cook: "👩&zwj;🍳",
      woman_facepalming: "🤦&zwj;♀️",
      woman_factory_worker: "👩&zwj;🏭",
      woman_farmer: "👩&zwj;🌾",
      woman_firefighter: "👩&zwj;🚒",
      woman_health_worker: "👩&zwj;⚕️",
      woman_judge: "👩&zwj;⚖️",
      woman_juggling: "🤹&zwj;♀️",
      woman_mechanic: "👩&zwj;🔧",
      woman_office_worker: "👩&zwj;💼",
      woman_pilot: "👩&zwj;✈️",
      woman_playing_handball: "🤾&zwj;♀️",
      woman_playing_water_polo: "🤽&zwj;♀️",
      woman_scientist: "👩&zwj;🔬",
      woman_shrugging: "🤷&zwj;♀️",
      woman_singer: "👩&zwj;🎤",
      woman_student: "👩&zwj;🎓",
      woman_teacher: "👩&zwj;🏫",
      woman_technologist: "👩&zwj;💻",
      woman_with_turban: "👳&zwj;♀️",
      womans_clothes: "👚",
      womans_hat: "👒",
      women_wrestling: "🤼&zwj;♀️",
      womens: "🚺",
      world_map: "🗺",
      worried: "😟",
      wrench: "🔧",
      writing_hand: "✍️",
      x: "❌",
      yellow_heart: "💛",
      yen: "💴",
      yin_yang: "☯️",
      yum: "😋",
      zap: "⚡️",
      zipper_mouth_face: "🤐",
      zzz: "💤",
      /* special emojis :P */
      octocat: '<img alt=":octocat:" height="20" width="20" align="absmiddle" src="https://assets-cdn.github.com/images/icons/emoji/octocat.png">',
      showdown: `<span style="font-family: 'Anonymous Pro', monospace; text-decoration: underline; text-decoration-style: dashed; text-decoration-color: #3e8b8a;text-underline-position: under;">S</span>`
    }, r.Converter = function(l) {
      var d = {}, f = [], m = [], v = {}, k = c, S = {
        parsed: {},
        raw: "",
        format: ""
      };
      C();
      function C() {
        l = l || {};
        for (var j in o)
          o.hasOwnProperty(j) && (d[j] = o[j]);
        if (typeof l == "object")
          for (var $ in l)
            l.hasOwnProperty($) && (d[$] = l[$]);
        else
          throw Error("Converter expects the passed parameter to be an object, but " + typeof l + " was passed instead.");
        d.extensions && r.helper.forEach(d.extensions, L);
      }
      function L(j, $) {
        if ($ = $ || null, r.helper.isString(j))
          if (j = r.helper.stdExtName(j), $ = j, r.extensions[j]) {
            console.warn("DEPRECATION WARNING: " + j + " is an old extension that uses a deprecated loading method.Please inform the developer that the extension should be updated!"), B(r.extensions[j], j);
            return;
          } else if (!r.helper.isUndefined(i[j]))
            j = i[j];
          else
            throw Error('Extension "' + j + '" could not be loaded. It was either not found or is not a valid extension.');
        typeof j == "function" && (j = j()), r.helper.isArray(j) || (j = [j]);
        var O = p(j, $);
        if (!O.valid)
          throw Error(O.error);
        for (var F = 0; F < j.length; ++F) {
          switch (j[F].type) {
            case "lang":
              f.push(j[F]);
              break;
            case "output":
              m.push(j[F]);
              break;
          }
          if (j[F].hasOwnProperty("listeners"))
            for (var U in j[F].listeners)
              j[F].listeners.hasOwnProperty(U) && A(U, j[F].listeners[U]);
        }
      }
      function B(j, $) {
        typeof j == "function" && (j = j(new r.Converter())), r.helper.isArray(j) || (j = [j]);
        var O = p(j, $);
        if (!O.valid)
          throw Error(O.error);
        for (var F = 0; F < j.length; ++F)
          switch (j[F].type) {
            case "lang":
              f.push(j[F]);
              break;
            case "output":
              m.push(j[F]);
              break;
            default:
              throw Error("Extension loader error: Type unrecognized!!!");
          }
      }
      function A(j, $) {
        if (!r.helper.isString(j))
          throw Error("Invalid argument in converter.listen() method: name must be a string, but " + typeof j + " given");
        if (typeof $ != "function")
          throw Error("Invalid argument in converter.listen() method: callback must be a function, but " + typeof $ + " given");
        v.hasOwnProperty(j) || (v[j] = []), v[j].push($);
      }
      function z(j) {
        var $ = j.match(/^\s*/)[0].length, O = new RegExp("^\\s{0," + $ + "}", "gm");
        return j.replace(O, "");
      }
      this._dispatch = function($, O, F, U) {
        if (v.hasOwnProperty($))
          for (var V = 0; V < v[$].length; ++V) {
            var Z = v[$][V]($, O, this, F, U);
            Z && typeof Z < "u" && (O = Z);
          }
        return O;
      }, this.listen = function(j, $) {
        return A(j, $), this;
      }, this.makeHtml = function(j) {
        if (!j)
          return j;
        var $ = {
          gHtmlBlocks: [],
          gHtmlMdBlocks: [],
          gHtmlSpans: [],
          gUrls: {},
          gTitles: {},
          gDimensions: {},
          gListLevel: 0,
          hashLinkCounts: {},
          langExtensions: f,
          outputModifiers: m,
          converter: this,
          ghCodeBlocks: [],
          metadata: {
            parsed: {},
            raw: "",
            format: ""
          }
        };
        return j = j.replace(/¨/g, "¨T"), j = j.replace(/\$/g, "¨D"), j = j.replace(/\r\n/g, `
`), j = j.replace(/\r/g, `
`), j = j.replace(/\u00A0/g, "&nbsp;"), d.smartIndentationFix && (j = z(j)), j = `

` + j + `

`, j = r.subParser("detab")(j, d, $), j = j.replace(/^[ \t]+$/mg, ""), r.helper.forEach(f, function(O) {
          j = r.subParser("runExtension")(O, j, d, $);
        }), j = r.subParser("metadata")(j, d, $), j = r.subParser("hashPreCodeTags")(j, d, $), j = r.subParser("githubCodeBlocks")(j, d, $), j = r.subParser("hashHTMLBlocks")(j, d, $), j = r.subParser("hashCodeTags")(j, d, $), j = r.subParser("stripLinkDefinitions")(j, d, $), j = r.subParser("blockGamut")(j, d, $), j = r.subParser("unhashHTMLSpans")(j, d, $), j = r.subParser("unescapeSpecialChars")(j, d, $), j = j.replace(/¨D/g, "$$"), j = j.replace(/¨T/g, "¨"), j = r.subParser("completeHTMLDocument")(j, d, $), r.helper.forEach(m, function(O) {
          j = r.subParser("runExtension")(O, j, d, $);
        }), S = $.metadata, j;
      }, this.makeMarkdown = this.makeMd = function(j, $) {
        if (j = j.replace(/\r\n/g, `
`), j = j.replace(/\r/g, `
`), j = j.replace(/>[ \t]+</, ">¨NBSP;<"), !$)
          if (window && window.document)
            $ = window.document;
          else
            throw new Error("HTMLParser is undefined. If in a webworker or nodejs environment, you need to provide a WHATWG DOM and HTML such as JSDOM");
        var O = $.createElement("div");
        O.innerHTML = j;
        var F = {
          preList: se(O)
        };
        le(O);
        for (var U = O.childNodes, V = "", Z = 0; Z < U.length; Z++)
          V += r.subParser("makeMarkdown.node")(U[Z], F);
        function le(_e) {
          for (var ne = 0; ne < _e.childNodes.length; ++ne) {
            var Y = _e.childNodes[ne];
            Y.nodeType === 3 ? !/\S/.test(Y.nodeValue) && !/^[ ]+$/.test(Y.nodeValue) ? (_e.removeChild(Y), --ne) : (Y.nodeValue = Y.nodeValue.split(`
`).join(" "), Y.nodeValue = Y.nodeValue.replace(/(\s)+/g, "$1")) : Y.nodeType === 1 && le(Y);
          }
        }
        function se(_e) {
          for (var ne = _e.querySelectorAll("pre"), Y = [], W = 0; W < ne.length; ++W)
            if (ne[W].childElementCount === 1 && ne[W].firstChild.tagName.toLowerCase() === "code") {
              var ae = ne[W].firstChild.innerHTML.trim(), fe = ne[W].firstChild.getAttribute("data-language") || "";
              if (fe === "")
                for (var ge = ne[W].firstChild.className.split(" "), Se = 0; Se < ge.length; ++Se) {
                  var xe = ge[Se].match(/^language-(.+)$/);
                  if (xe !== null) {
                    fe = xe[1];
                    break;
                  }
                }
              ae = r.helper.unescapeHTMLEntities(ae), Y.push(ae), ne[W].outerHTML = '<precode language="' + fe + '" precodenum="' + W.toString() + '"></precode>';
            } else
              Y.push(ne[W].innerHTML), ne[W].innerHTML = "", ne[W].setAttribute("prenum", W.toString());
          return Y;
        }
        return V;
      }, this.setOption = function(j, $) {
        d[j] = $;
      }, this.getOption = function(j) {
        return d[j];
      }, this.getOptions = function() {
        return d;
      }, this.addExtension = function(j, $) {
        $ = $ || null, L(j, $);
      }, this.useExtension = function(j) {
        L(j);
      }, this.setFlavor = function(j) {
        if (!u.hasOwnProperty(j))
          throw Error(j + " flavor was not found");
        var $ = u[j];
        k = j;
        for (var O in $)
          $.hasOwnProperty(O) && (d[O] = $[O]);
      }, this.getFlavor = function() {
        return k;
      }, this.removeExtension = function(j) {
        r.helper.isArray(j) || (j = [j]);
        for (var $ = 0; $ < j.length; ++$) {
          for (var O = j[$], F = 0; F < f.length; ++F)
            f[F] === O && f.splice(F, 1);
          for (var U = 0; U < m.length; ++U)
            m[U] === O && m.splice(U, 1);
        }
      }, this.getAllExtensions = function() {
        return {
          language: f,
          output: m
        };
      }, this.getMetadata = function(j) {
        return j ? S.raw : S.parsed;
      }, this.getMetadataFormat = function() {
        return S.format;
      }, this._setMetadataPair = function(j, $) {
        S.parsed[j] = $;
      }, this._setMetadataFormat = function(j) {
        S.format = j;
      }, this._setMetadataRaw = function(j) {
        S.raw = j;
      };
    }, r.subParser("anchors", function(l, d, f) {
      l = f.converter._dispatch("anchors.before", l, d, f);
      var m = function(v, k, S, C, L, B, A) {
        if (r.helper.isUndefined(A) && (A = ""), S = S.toLowerCase(), v.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          C = "";
        else if (!C)
          if (S || (S = k.toLowerCase().replace(/ ?\n/g, " ")), C = "#" + S, !r.helper.isUndefined(f.gUrls[S]))
            C = f.gUrls[S], r.helper.isUndefined(f.gTitles[S]) || (A = f.gTitles[S]);
          else
            return v;
        C = C.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback);
        var z = '<a href="' + C + '"';
        return A !== "" && A !== null && (A = A.replace(/"/g, "&quot;"), A = A.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback), z += ' title="' + A + '"'), d.openLinksInNewWindow && !/^#/.test(C) && (z += ' rel="noopener noreferrer" target="¨E95Eblank"'), z += ">" + k + "</a>", z;
      };
      return l = l.replace(/\[((?:\[[^\]]*]|[^\[\]])*)] ?(?:\n *)?\[(.*?)]()()()()/g, m), l = l.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<([^>]*)>(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        m
      ), l = l.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        m
      ), l = l.replace(/\[([^\[\]]+)]()()()()()/g, m), d.ghMentions && (l = l.replace(/(^|\s)(\\)?(@([a-z\d]+(?:[a-z\d.-]+?[a-z\d]+)*))/gmi, function(v, k, S, C, L) {
        if (S === "\\")
          return k + C;
        if (!r.helper.isString(d.ghMentionsLink))
          throw new Error("ghMentionsLink option must be a string");
        var B = d.ghMentionsLink.replace(/\{u}/g, L), A = "";
        return d.openLinksInNewWindow && (A = ' rel="noopener noreferrer" target="¨E95Eblank"'), k + '<a href="' + B + '"' + A + ">" + C + "</a>";
      })), l = f.converter._dispatch("anchors.after", l, d, f), l;
    });
    var g = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+?\.[^'">\s]+?)()(\1)?(?=\s|$)(?!["<>])/gi, w = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+?)([.!?,()\[\]])?(\1)?(?=\s|$)(?!["<>])/gi, E = /()<(((https?|ftp|dict):\/\/|www\.)[^'">\s]+)()>()/gi, I = /(^|\s)(?:mailto:)?([A-Za-z0-9!#$%&'*+-/=?^_`{|}~.]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)(?=$|\s)/gmi, D = /<()(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi, y = function(l) {
      return function(d, f, m, v, k, S, C) {
        m = m.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback);
        var L = m, B = "", A = "", z = f || "", j = C || "";
        return /^www\./i.test(m) && (m = m.replace(/^www\./i, "http://www.")), l.excludeTrailingPunctuationFromURLs && S && (B = S), l.openLinksInNewWindow && (A = ' rel="noopener noreferrer" target="¨E95Eblank"'), z + '<a href="' + m + '"' + A + ">" + L + "</a>" + B + j;
      };
    }, b = function(l, d) {
      return function(f, m, v) {
        var k = "mailto:";
        return m = m || "", v = r.subParser("unescapeSpecialChars")(v, l, d), l.encodeEmails ? (k = r.helper.encodeEmailAddress(k + v), v = r.helper.encodeEmailAddress(v)) : k = k + v, m + '<a href="' + k + '">' + v + "</a>";
      };
    };
    r.subParser("autoLinks", function(l, d, f) {
      return l = f.converter._dispatch("autoLinks.before", l, d, f), l = l.replace(E, y(d)), l = l.replace(D, b(d, f)), l = f.converter._dispatch("autoLinks.after", l, d, f), l;
    }), r.subParser("simplifiedAutoLinks", function(l, d, f) {
      return d.simplifiedAutoLink && (l = f.converter._dispatch("simplifiedAutoLinks.before", l, d, f), d.excludeTrailingPunctuationFromURLs ? l = l.replace(w, y(d)) : l = l.replace(g, y(d)), l = l.replace(I, b(d, f)), l = f.converter._dispatch("simplifiedAutoLinks.after", l, d, f)), l;
    }), r.subParser("blockGamut", function(l, d, f) {
      return l = f.converter._dispatch("blockGamut.before", l, d, f), l = r.subParser("blockQuotes")(l, d, f), l = r.subParser("headers")(l, d, f), l = r.subParser("horizontalRule")(l, d, f), l = r.subParser("lists")(l, d, f), l = r.subParser("codeBlocks")(l, d, f), l = r.subParser("tables")(l, d, f), l = r.subParser("hashHTMLBlocks")(l, d, f), l = r.subParser("paragraphs")(l, d, f), l = f.converter._dispatch("blockGamut.after", l, d, f), l;
    }), r.subParser("blockQuotes", function(l, d, f) {
      l = f.converter._dispatch("blockQuotes.before", l, d, f), l = l + `

`;
      var m = /(^ {0,3}>[ \t]?.+\n(.+\n)*\n*)+/gm;
      return d.splitAdjacentBlockquotes && (m = /^ {0,3}>[\s\S]*?(?:\n\n)/gm), l = l.replace(m, function(v) {
        return v = v.replace(/^[ \t]*>[ \t]?/gm, ""), v = v.replace(/¨0/g, ""), v = v.replace(/^[ \t]+$/gm, ""), v = r.subParser("githubCodeBlocks")(v, d, f), v = r.subParser("blockGamut")(v, d, f), v = v.replace(/(^|\n)/g, "$1  "), v = v.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function(k, S) {
          var C = S;
          return C = C.replace(/^  /mg, "¨0"), C = C.replace(/¨0/g, ""), C;
        }), r.subParser("hashBlock")(`<blockquote>
` + v + `
</blockquote>`, d, f);
      }), l = f.converter._dispatch("blockQuotes.after", l, d, f), l;
    }), r.subParser("codeBlocks", function(l, d, f) {
      l = f.converter._dispatch("codeBlocks.before", l, d, f), l += "¨0";
      var m = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=¨0))/g;
      return l = l.replace(m, function(v, k, S) {
        var C = k, L = S, B = `
`;
        return C = r.subParser("outdent")(C, d, f), C = r.subParser("encodeCode")(C, d, f), C = r.subParser("detab")(C, d, f), C = C.replace(/^\n+/g, ""), C = C.replace(/\n+$/g, ""), d.omitExtraWLInCodeBlocks && (B = ""), C = "<pre><code>" + C + B + "</code></pre>", r.subParser("hashBlock")(C, d, f) + L;
      }), l = l.replace(/¨0/, ""), l = f.converter._dispatch("codeBlocks.after", l, d, f), l;
    }), r.subParser("codeSpans", function(l, d, f) {
      return l = f.converter._dispatch("codeSpans.before", l, d, f), typeof l > "u" && (l = ""), l = l.replace(
        /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
        function(m, v, k, S) {
          var C = S;
          return C = C.replace(/^([ \t]*)/g, ""), C = C.replace(/[ \t]*$/g, ""), C = r.subParser("encodeCode")(C, d, f), C = v + "<code>" + C + "</code>", C = r.subParser("hashHTMLSpans")(C, d, f), C;
        }
      ), l = f.converter._dispatch("codeSpans.after", l, d, f), l;
    }), r.subParser("completeHTMLDocument", function(l, d, f) {
      if (!d.completeHTMLDocument)
        return l;
      l = f.converter._dispatch("completeHTMLDocument.before", l, d, f);
      var m = "html", v = `<!DOCTYPE HTML>
`, k = "", S = `<meta charset="utf-8">
`, C = "", L = "";
      typeof f.metadata.parsed.doctype < "u" && (v = "<!DOCTYPE " + f.metadata.parsed.doctype + `>
`, m = f.metadata.parsed.doctype.toString().toLowerCase(), (m === "html" || m === "html5") && (S = '<meta charset="utf-8">'));
      for (var B in f.metadata.parsed)
        if (f.metadata.parsed.hasOwnProperty(B))
          switch (B.toLowerCase()) {
            case "doctype":
              break;
            case "title":
              k = "<title>" + f.metadata.parsed.title + `</title>
`;
              break;
            case "charset":
              m === "html" || m === "html5" ? S = '<meta charset="' + f.metadata.parsed.charset + `">
` : S = '<meta name="charset" content="' + f.metadata.parsed.charset + `">
`;
              break;
            case "language":
            case "lang":
              C = ' lang="' + f.metadata.parsed[B] + '"', L += '<meta name="' + B + '" content="' + f.metadata.parsed[B] + `">
`;
              break;
            default:
              L += '<meta name="' + B + '" content="' + f.metadata.parsed[B] + `">
`;
          }
      return l = v + "<html" + C + `>
<head>
` + k + S + L + `</head>
<body>
` + l.trim() + `
</body>
</html>`, l = f.converter._dispatch("completeHTMLDocument.after", l, d, f), l;
    }), r.subParser("detab", function(l, d, f) {
      return l = f.converter._dispatch("detab.before", l, d, f), l = l.replace(/\t(?=\t)/g, "    "), l = l.replace(/\t/g, "¨A¨B"), l = l.replace(/¨B(.+?)¨A/g, function(m, v) {
        for (var k = v, S = 4 - k.length % 4, C = 0; C < S; C++)
          k += " ";
        return k;
      }), l = l.replace(/¨A/g, "    "), l = l.replace(/¨B/g, ""), l = f.converter._dispatch("detab.after", l, d, f), l;
    }), r.subParser("ellipsis", function(l, d, f) {
      return d.ellipsis && (l = f.converter._dispatch("ellipsis.before", l, d, f), l = l.replace(/\.\.\./g, "…"), l = f.converter._dispatch("ellipsis.after", l, d, f)), l;
    }), r.subParser("emoji", function(l, d, f) {
      if (!d.emoji)
        return l;
      l = f.converter._dispatch("emoji.before", l, d, f);
      var m = /:([\S]+?):/g;
      return l = l.replace(m, function(v, k) {
        return r.helper.emojis.hasOwnProperty(k) ? r.helper.emojis[k] : v;
      }), l = f.converter._dispatch("emoji.after", l, d, f), l;
    }), r.subParser("encodeAmpsAndAngles", function(l, d, f) {
      return l = f.converter._dispatch("encodeAmpsAndAngles.before", l, d, f), l = l.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, "&amp;"), l = l.replace(/<(?![a-z\/?$!])/gi, "&lt;"), l = l.replace(/</g, "&lt;"), l = l.replace(/>/g, "&gt;"), l = f.converter._dispatch("encodeAmpsAndAngles.after", l, d, f), l;
    }), r.subParser("encodeBackslashEscapes", function(l, d, f) {
      return l = f.converter._dispatch("encodeBackslashEscapes.before", l, d, f), l = l.replace(/\\(\\)/g, r.helper.escapeCharactersCallback), l = l.replace(/\\([`*_{}\[\]()>#+.!~=|:-])/g, r.helper.escapeCharactersCallback), l = f.converter._dispatch("encodeBackslashEscapes.after", l, d, f), l;
    }), r.subParser("encodeCode", function(l, d, f) {
      return l = f.converter._dispatch("encodeCode.before", l, d, f), l = l.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/([*_{}\[\]\\=~-])/g, r.helper.escapeCharactersCallback), l = f.converter._dispatch("encodeCode.after", l, d, f), l;
    }), r.subParser("escapeSpecialCharsWithinTagAttributes", function(l, d, f) {
      l = f.converter._dispatch("escapeSpecialCharsWithinTagAttributes.before", l, d, f);
      var m = /<\/?[a-z\d_:-]+(?:[\s]+[\s\S]+?)?>/gi, v = /<!(--(?:(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>/gi;
      return l = l.replace(m, function(k) {
        return k.replace(/(.)<\/?code>(?=.)/g, "$1`").replace(/([\\`*_~=|])/g, r.helper.escapeCharactersCallback);
      }), l = l.replace(v, function(k) {
        return k.replace(/([\\`*_~=|])/g, r.helper.escapeCharactersCallback);
      }), l = f.converter._dispatch("escapeSpecialCharsWithinTagAttributes.after", l, d, f), l;
    }), r.subParser("githubCodeBlocks", function(l, d, f) {
      return d.ghCodeBlocks ? (l = f.converter._dispatch("githubCodeBlocks.before", l, d, f), l += "¨0", l = l.replace(/(?:^|\n)(?: {0,3})(```+|~~~+)(?: *)([^\s`~]*)\n([\s\S]*?)\n(?: {0,3})\1/g, function(m, v, k, S) {
        var C = d.omitExtraWLInCodeBlocks ? "" : `
`;
        return S = r.subParser("encodeCode")(S, d, f), S = r.subParser("detab")(S, d, f), S = S.replace(/^\n+/g, ""), S = S.replace(/\n+$/g, ""), S = "<pre><code" + (k ? ' class="' + k + " language-" + k + '"' : "") + ">" + S + C + "</code></pre>", S = r.subParser("hashBlock")(S, d, f), `

¨G` + (f.ghCodeBlocks.push({ text: m, codeblock: S }) - 1) + `G

`;
      }), l = l.replace(/¨0/, ""), f.converter._dispatch("githubCodeBlocks.after", l, d, f)) : l;
    }), r.subParser("hashBlock", function(l, d, f) {
      return l = f.converter._dispatch("hashBlock.before", l, d, f), l = l.replace(/(^\n+|\n+$)/g, ""), l = `

¨K` + (f.gHtmlBlocks.push(l) - 1) + `K

`, l = f.converter._dispatch("hashBlock.after", l, d, f), l;
    }), r.subParser("hashCodeTags", function(l, d, f) {
      l = f.converter._dispatch("hashCodeTags.before", l, d, f);
      var m = function(v, k, S, C) {
        var L = S + r.subParser("encodeCode")(k, d, f) + C;
        return "¨C" + (f.gHtmlSpans.push(L) - 1) + "C";
      };
      return l = r.helper.replaceRecursiveRegExp(l, m, "<code\\b[^>]*>", "</code>", "gim"), l = f.converter._dispatch("hashCodeTags.after", l, d, f), l;
    }), r.subParser("hashElement", function(l, d, f) {
      return function(m, v) {
        var k = v;
        return k = k.replace(/\n\n/g, `
`), k = k.replace(/^\n/, ""), k = k.replace(/\n+$/g, ""), k = `

¨K` + (f.gHtmlBlocks.push(k) - 1) + `K

`, k;
      };
    }), r.subParser("hashHTMLBlocks", function(l, d, f) {
      l = f.converter._dispatch("hashHTMLBlocks.before", l, d, f);
      var m = [
        "pre",
        "div",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "blockquote",
        "table",
        "dl",
        "ol",
        "ul",
        "script",
        "noscript",
        "form",
        "fieldset",
        "iframe",
        "math",
        "style",
        "section",
        "header",
        "footer",
        "nav",
        "article",
        "aside",
        "address",
        "audio",
        "canvas",
        "figure",
        "hgroup",
        "output",
        "video",
        "p"
      ], v = function(j, $, O, F) {
        var U = j;
        return O.search(/\bmarkdown\b/) !== -1 && (U = O + f.converter.makeHtml($) + F), `

¨K` + (f.gHtmlBlocks.push(U) - 1) + `K

`;
      };
      d.backslashEscapesHTMLTags && (l = l.replace(/\\<(\/?[^>]+?)>/g, function(j, $) {
        return "&lt;" + $ + "&gt;";
      }));
      for (var k = 0; k < m.length; ++k)
        for (var S, C = new RegExp("^ {0,3}(<" + m[k] + "\\b[^>]*>)", "im"), L = "<" + m[k] + "\\b[^>]*>", B = "</" + m[k] + ">"; (S = r.helper.regexIndexOf(l, C)) !== -1; ) {
          var A = r.helper.splitAtIndex(l, S), z = r.helper.replaceRecursiveRegExp(A[1], v, L, B, "im");
          if (z === A[1])
            break;
          l = A[0].concat(z);
        }
      return l = l.replace(
        /(\n {0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,
        r.subParser("hashElement")(l, d, f)
      ), l = r.helper.replaceRecursiveRegExp(l, function(j) {
        return `

¨K` + (f.gHtmlBlocks.push(j) - 1) + `K

`;
      }, "^ {0,3}<!--", "-->", "gm"), l = l.replace(
        /(?:\n\n)( {0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,
        r.subParser("hashElement")(l, d, f)
      ), l = f.converter._dispatch("hashHTMLBlocks.after", l, d, f), l;
    }), r.subParser("hashHTMLSpans", function(l, d, f) {
      l = f.converter._dispatch("hashHTMLSpans.before", l, d, f);
      function m(v) {
        return "¨C" + (f.gHtmlSpans.push(v) - 1) + "C";
      }
      return l = l.replace(/<[^>]+?\/>/gi, function(v) {
        return m(v);
      }), l = l.replace(/<([^>]+?)>[\s\S]*?<\/\1>/g, function(v) {
        return m(v);
      }), l = l.replace(/<([^>]+?)\s[^>]+?>[\s\S]*?<\/\1>/g, function(v) {
        return m(v);
      }), l = l.replace(/<[^>]+?>/gi, function(v) {
        return m(v);
      }), l = f.converter._dispatch("hashHTMLSpans.after", l, d, f), l;
    }), r.subParser("unhashHTMLSpans", function(l, d, f) {
      l = f.converter._dispatch("unhashHTMLSpans.before", l, d, f);
      for (var m = 0; m < f.gHtmlSpans.length; ++m) {
        for (var v = f.gHtmlSpans[m], k = 0; /¨C(\d+)C/.test(v); ) {
          var S = RegExp.$1;
          if (v = v.replace("¨C" + S + "C", f.gHtmlSpans[S]), k === 10) {
            console.error("maximum nesting of 10 spans reached!!!");
            break;
          }
          ++k;
        }
        l = l.replace("¨C" + m + "C", v);
      }
      return l = f.converter._dispatch("unhashHTMLSpans.after", l, d, f), l;
    }), r.subParser("hashPreCodeTags", function(l, d, f) {
      l = f.converter._dispatch("hashPreCodeTags.before", l, d, f);
      var m = function(v, k, S, C) {
        var L = S + r.subParser("encodeCode")(k, d, f) + C;
        return `

¨G` + (f.ghCodeBlocks.push({ text: v, codeblock: L }) - 1) + `G

`;
      };
      return l = r.helper.replaceRecursiveRegExp(l, m, "^ {0,3}<pre\\b[^>]*>\\s*<code\\b[^>]*>", "^ {0,3}</code>\\s*</pre>", "gim"), l = f.converter._dispatch("hashPreCodeTags.after", l, d, f), l;
    }), r.subParser("headers", function(l, d, f) {
      l = f.converter._dispatch("headers.before", l, d, f);
      var m = isNaN(parseInt(d.headerLevelStart)) ? 1 : parseInt(d.headerLevelStart), v = d.smoothLivePreview ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm, k = d.smoothLivePreview ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;
      l = l.replace(v, function(L, B) {
        var A = r.subParser("spanGamut")(B, d, f), z = d.noHeaderId ? "" : ' id="' + C(B) + '"', j = m, $ = "<h" + j + z + ">" + A + "</h" + j + ">";
        return r.subParser("hashBlock")($, d, f);
      }), l = l.replace(k, function(L, B) {
        var A = r.subParser("spanGamut")(B, d, f), z = d.noHeaderId ? "" : ' id="' + C(B) + '"', j = m + 1, $ = "<h" + j + z + ">" + A + "</h" + j + ">";
        return r.subParser("hashBlock")($, d, f);
      });
      var S = d.requireSpaceBeforeHeadingText ? /^(#{1,6})[ \t]+(.+?)[ \t]*#*\n+/gm : /^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm;
      l = l.replace(S, function(L, B, A) {
        var z = A;
        d.customizedHeaderId && (z = A.replace(/\s?\{([^{]+?)}\s*$/, ""));
        var j = r.subParser("spanGamut")(z, d, f), $ = d.noHeaderId ? "" : ' id="' + C(A) + '"', O = m - 1 + B.length, F = "<h" + O + $ + ">" + j + "</h" + O + ">";
        return r.subParser("hashBlock")(F, d, f);
      });
      function C(L) {
        var B, A;
        if (d.customizedHeaderId) {
          var z = L.match(/\{([^{]+?)}\s*$/);
          z && z[1] && (L = z[1]);
        }
        return B = L, r.helper.isString(d.prefixHeaderId) ? A = d.prefixHeaderId : d.prefixHeaderId === !0 ? A = "section-" : A = "", d.rawPrefixHeaderId || (B = A + B), d.ghCompatibleHeaderId ? B = B.replace(/ /g, "-").replace(/&amp;/g, "").replace(/¨T/g, "").replace(/¨D/g, "").replace(/[&+$,\/:;=?@"#{}|^¨~\[\]`\\*)(%.!'<>]/g, "").toLowerCase() : d.rawHeaderId ? B = B.replace(/ /g, "-").replace(/&amp;/g, "&").replace(/¨T/g, "¨").replace(/¨D/g, "$").replace(/["']/g, "-").toLowerCase() : B = B.replace(/[^\w]/g, "").toLowerCase(), d.rawPrefixHeaderId && (B = A + B), f.hashLinkCounts[B] ? B = B + "-" + f.hashLinkCounts[B]++ : f.hashLinkCounts[B] = 1, B;
      }
      return l = f.converter._dispatch("headers.after", l, d, f), l;
    }), r.subParser("horizontalRule", function(l, d, f) {
      l = f.converter._dispatch("horizontalRule.before", l, d, f);
      var m = r.subParser("hashBlock")("<hr />", d, f);
      return l = l.replace(/^ {0,2}( ?-){3,}[ \t]*$/gm, m), l = l.replace(/^ {0,2}( ?\*){3,}[ \t]*$/gm, m), l = l.replace(/^ {0,2}( ?_){3,}[ \t]*$/gm, m), l = f.converter._dispatch("horizontalRule.after", l, d, f), l;
    }), r.subParser("images", function(l, d, f) {
      l = f.converter._dispatch("images.before", l, d, f);
      var m = /!\[([^\]]*?)][ \t]*()\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, v = /!\[([^\]]*?)][ \t]*()\([ \t]?<([^>]*)>(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(?:(["'])([^"]*?)\6))?[ \t]?\)/g, k = /!\[([^\]]*?)][ \t]*()\([ \t]?<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, S = /!\[([^\]]*?)] ?(?:\n *)?\[([\s\S]*?)]()()()()()/g, C = /!\[([^\[\]]+)]()()()()()/g;
      function L(A, z, j, $, O, F, U, V) {
        return $ = $.replace(/\s/g, ""), B(A, z, j, $, O, F, U, V);
      }
      function B(A, z, j, $, O, F, U, V) {
        var Z = f.gUrls, le = f.gTitles, se = f.gDimensions;
        if (j = j.toLowerCase(), V || (V = ""), A.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          $ = "";
        else if ($ === "" || $ === null)
          if ((j === "" || j === null) && (j = z.toLowerCase().replace(/ ?\n/g, " ")), $ = "#" + j, !r.helper.isUndefined(Z[j]))
            $ = Z[j], r.helper.isUndefined(le[j]) || (V = le[j]), r.helper.isUndefined(se[j]) || (O = se[j].width, F = se[j].height);
          else
            return A;
        z = z.replace(/"/g, "&quot;").replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback), $ = $.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback);
        var _e = '<img src="' + $ + '" alt="' + z + '"';
        return V && r.helper.isString(V) && (V = V.replace(/"/g, "&quot;").replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback), _e += ' title="' + V + '"'), O && F && (O = O === "*" ? "auto" : O, F = F === "*" ? "auto" : F, _e += ' width="' + O + '"', _e += ' height="' + F + '"'), _e += " />", _e;
      }
      return l = l.replace(S, B), l = l.replace(k, L), l = l.replace(v, B), l = l.replace(m, B), l = l.replace(C, B), l = f.converter._dispatch("images.after", l, d, f), l;
    }), r.subParser("italicsAndBold", function(l, d, f) {
      l = f.converter._dispatch("italicsAndBold.before", l, d, f);
      function m(v, k, S) {
        return k + v + S;
      }
      return d.literalMidWordUnderscores ? (l = l.replace(/\b___(\S[\s\S]*?)___\b/g, function(v, k) {
        return m(k, "<strong><em>", "</em></strong>");
      }), l = l.replace(/\b__(\S[\s\S]*?)__\b/g, function(v, k) {
        return m(k, "<strong>", "</strong>");
      }), l = l.replace(/\b_(\S[\s\S]*?)_\b/g, function(v, k) {
        return m(k, "<em>", "</em>");
      })) : (l = l.replace(/___(\S[\s\S]*?)___/g, function(v, k) {
        return /\S$/.test(k) ? m(k, "<strong><em>", "</em></strong>") : v;
      }), l = l.replace(/__(\S[\s\S]*?)__/g, function(v, k) {
        return /\S$/.test(k) ? m(k, "<strong>", "</strong>") : v;
      }), l = l.replace(/_([^\s_][\s\S]*?)_/g, function(v, k) {
        return /\S$/.test(k) ? m(k, "<em>", "</em>") : v;
      })), d.literalMidWordAsterisks ? (l = l.replace(/([^*]|^)\B\*\*\*(\S[\s\S]*?)\*\*\*\B(?!\*)/g, function(v, k, S) {
        return m(S, k + "<strong><em>", "</em></strong>");
      }), l = l.replace(/([^*]|^)\B\*\*(\S[\s\S]*?)\*\*\B(?!\*)/g, function(v, k, S) {
        return m(S, k + "<strong>", "</strong>");
      }), l = l.replace(/([^*]|^)\B\*(\S[\s\S]*?)\*\B(?!\*)/g, function(v, k, S) {
        return m(S, k + "<em>", "</em>");
      })) : (l = l.replace(/\*\*\*(\S[\s\S]*?)\*\*\*/g, function(v, k) {
        return /\S$/.test(k) ? m(k, "<strong><em>", "</em></strong>") : v;
      }), l = l.replace(/\*\*(\S[\s\S]*?)\*\*/g, function(v, k) {
        return /\S$/.test(k) ? m(k, "<strong>", "</strong>") : v;
      }), l = l.replace(/\*([^\s*][\s\S]*?)\*/g, function(v, k) {
        return /\S$/.test(k) ? m(k, "<em>", "</em>") : v;
      })), l = f.converter._dispatch("italicsAndBold.after", l, d, f), l;
    }), r.subParser("lists", function(l, d, f) {
      function m(S, C) {
        f.gListLevel++, S = S.replace(/\n{2,}$/, `
`), S += "¨0";
        var L = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0| {0,3}([*+-]|\d+[.])[ \t]+))/gm, B = /\n[ \t]*\n(?!¨0)/.test(S);
        return d.disableForced4SpacesIndentedSublists && (L = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0|\2([*+-]|\d+[.])[ \t]+))/gm), S = S.replace(L, function(A, z, j, $, O, F, U) {
          U = U && U.trim() !== "";
          var V = r.subParser("outdent")(O, d, f), Z = "";
          return F && d.tasklists && (Z = ' class="task-list-item" style="list-style-type: none;"', V = V.replace(/^[ \t]*\[(x|X| )?]/m, function() {
            var le = '<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"';
            return U && (le += " checked"), le += ">", le;
          })), V = V.replace(/^([-*+]|\d\.)[ \t]+[\S\n ]*/g, function(le) {
            return "¨A" + le;
          }), z || V.search(/\n{2,}/) > -1 ? (V = r.subParser("githubCodeBlocks")(V, d, f), V = r.subParser("blockGamut")(V, d, f)) : (V = r.subParser("lists")(V, d, f), V = V.replace(/\n$/, ""), V = r.subParser("hashHTMLBlocks")(V, d, f), V = V.replace(/\n\n+/g, `

`), B ? V = r.subParser("paragraphs")(V, d, f) : V = r.subParser("spanGamut")(V, d, f)), V = V.replace("¨A", ""), V = "<li" + Z + ">" + V + `</li>
`, V;
        }), S = S.replace(/¨0/g, ""), f.gListLevel--, C && (S = S.replace(/\s+$/, "")), S;
      }
      function v(S, C) {
        if (C === "ol") {
          var L = S.match(/^ *(\d+)\./);
          if (L && L[1] !== "1")
            return ' start="' + L[1] + '"';
        }
        return "";
      }
      function k(S, C, L) {
        var B = d.disableForced4SpacesIndentedSublists ? /^ ?\d+\.[ \t]/gm : /^ {0,3}\d+\.[ \t]/gm, A = d.disableForced4SpacesIndentedSublists ? /^ ?[*+-][ \t]/gm : /^ {0,3}[*+-][ \t]/gm, z = C === "ul" ? B : A, j = "";
        if (S.search(z) !== -1)
          (function O(F) {
            var U = F.search(z), V = v(S, C);
            U !== -1 ? (j += `

<` + C + V + `>
` + m(F.slice(0, U), !!L) + "</" + C + `>
`, C = C === "ul" ? "ol" : "ul", z = C === "ul" ? B : A, O(F.slice(U))) : j += `

<` + C + V + `>
` + m(F, !!L) + "</" + C + `>
`;
          })(S);
        else {
          var $ = v(S, C);
          j = `

<` + C + $ + `>
` + m(S, !!L) + "</" + C + `>
`;
        }
        return j;
      }
      return l = f.converter._dispatch("lists.before", l, d, f), l += "¨0", f.gListLevel ? l = l.replace(
        /^(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(S, C, L) {
          var B = L.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return k(C, B, !0);
        }
      ) : l = l.replace(
        /(\n\n|^\n?)(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(S, C, L, B) {
          var A = B.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return k(L, A, !1);
        }
      ), l = l.replace(/¨0/, ""), l = f.converter._dispatch("lists.after", l, d, f), l;
    }), r.subParser("metadata", function(l, d, f) {
      if (!d.metadata)
        return l;
      l = f.converter._dispatch("metadata.before", l, d, f);
      function m(v) {
        f.metadata.raw = v, v = v.replace(/&/g, "&amp;").replace(/"/g, "&quot;"), v = v.replace(/\n {4}/g, " "), v.replace(/^([\S ]+): +([\s\S]+?)$/gm, function(k, S, C) {
          return f.metadata.parsed[S] = C, "";
        });
      }
      return l = l.replace(/^\s*«««+(\S*?)\n([\s\S]+?)\n»»»+\n/, function(v, k, S) {
        return m(S), "¨M";
      }), l = l.replace(/^\s*---+(\S*?)\n([\s\S]+?)\n---+\n/, function(v, k, S) {
        return k && (f.metadata.format = k), m(S), "¨M";
      }), l = l.replace(/¨M/g, ""), l = f.converter._dispatch("metadata.after", l, d, f), l;
    }), r.subParser("outdent", function(l, d, f) {
      return l = f.converter._dispatch("outdent.before", l, d, f), l = l.replace(/^(\t|[ ]{1,4})/gm, "¨0"), l = l.replace(/¨0/g, ""), l = f.converter._dispatch("outdent.after", l, d, f), l;
    }), r.subParser("paragraphs", function(l, d, f) {
      l = f.converter._dispatch("paragraphs.before", l, d, f), l = l.replace(/^\n+/g, ""), l = l.replace(/\n+$/g, "");
      for (var m = l.split(/\n{2,}/g), v = [], k = m.length, S = 0; S < k; S++) {
        var C = m[S];
        C.search(/¨(K|G)(\d+)\1/g) >= 0 ? v.push(C) : C.search(/\S/) >= 0 && (C = r.subParser("spanGamut")(C, d, f), C = C.replace(/^([ \t]*)/g, "<p>"), C += "</p>", v.push(C));
      }
      for (k = v.length, S = 0; S < k; S++) {
        for (var L = "", B = v[S], A = !1; /¨(K|G)(\d+)\1/.test(B); ) {
          var z = RegExp.$1, j = RegExp.$2;
          z === "K" ? L = f.gHtmlBlocks[j] : A ? L = r.subParser("encodeCode")(f.ghCodeBlocks[j].text, d, f) : L = f.ghCodeBlocks[j].codeblock, L = L.replace(/\$/g, "$$$$"), B = B.replace(/(\n\n)?¨(K|G)\d+\2(\n\n)?/, L), /^<pre\b[^>]*>\s*<code\b[^>]*>/.test(B) && (A = !0);
        }
        v[S] = B;
      }
      return l = v.join(`
`), l = l.replace(/^\n+/g, ""), l = l.replace(/\n+$/g, ""), f.converter._dispatch("paragraphs.after", l, d, f);
    }), r.subParser("runExtension", function(l, d, f, m) {
      if (l.filter)
        d = l.filter(d, m.converter, f);
      else if (l.regex) {
        var v = l.regex;
        v instanceof RegExp || (v = new RegExp(v, "g")), d = d.replace(v, l.replace);
      }
      return d;
    }), r.subParser("spanGamut", function(l, d, f) {
      return l = f.converter._dispatch("spanGamut.before", l, d, f), l = r.subParser("codeSpans")(l, d, f), l = r.subParser("escapeSpecialCharsWithinTagAttributes")(l, d, f), l = r.subParser("encodeBackslashEscapes")(l, d, f), l = r.subParser("images")(l, d, f), l = r.subParser("anchors")(l, d, f), l = r.subParser("autoLinks")(l, d, f), l = r.subParser("simplifiedAutoLinks")(l, d, f), l = r.subParser("emoji")(l, d, f), l = r.subParser("underline")(l, d, f), l = r.subParser("italicsAndBold")(l, d, f), l = r.subParser("strikethrough")(l, d, f), l = r.subParser("ellipsis")(l, d, f), l = r.subParser("hashHTMLSpans")(l, d, f), l = r.subParser("encodeAmpsAndAngles")(l, d, f), d.simpleLineBreaks ? /\n\n¨K/.test(l) || (l = l.replace(/\n+/g, `<br />
`)) : l = l.replace(/  +\n/g, `<br />
`), l = f.converter._dispatch("spanGamut.after", l, d, f), l;
    }), r.subParser("strikethrough", function(l, d, f) {
      function m(v) {
        return d.simplifiedAutoLink && (v = r.subParser("simplifiedAutoLinks")(v, d, f)), "<del>" + v + "</del>";
      }
      return d.strikethrough && (l = f.converter._dispatch("strikethrough.before", l, d, f), l = l.replace(/(?:~){2}([\s\S]+?)(?:~){2}/g, function(v, k) {
        return m(k);
      }), l = f.converter._dispatch("strikethrough.after", l, d, f)), l;
    }), r.subParser("stripLinkDefinitions", function(l, d, f) {
      var m = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?([^>\s]+)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=¨0))/gm, v = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n\n|(?=¨0)|(?=\n\[))/gm;
      l += "¨0";
      var k = function(S, C, L, B, A, z, j) {
        return C = C.toLowerCase(), l.toLowerCase().split(C).length - 1 < 2 ? S : (L.match(/^data:.+?\/.+?;base64,/) ? f.gUrls[C] = L.replace(/\s/g, "") : f.gUrls[C] = r.subParser("encodeAmpsAndAngles")(L, d, f), z ? z + j : (j && (f.gTitles[C] = j.replace(/"|'/g, "&quot;")), d.parseImgDimensions && B && A && (f.gDimensions[C] = {
          width: B,
          height: A
        }), ""));
      };
      return l = l.replace(v, k), l = l.replace(m, k), l = l.replace(/¨0/, ""), l;
    }), r.subParser("tables", function(l, d, f) {
      if (!d.tables)
        return l;
      var m = /^ {0,3}\|?.+\|.+\n {0,3}\|?[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*:?[ \t]*(?:[-=]){2,}[\s\S]+?(?:\n\n|¨0)/gm, v = /^ {0,3}\|.+\|[ \t]*\n {0,3}\|[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*\n( {0,3}\|.+\|[ \t]*\n)*(?:\n|¨0)/gm;
      function k(A) {
        return /^:[ \t]*--*$/.test(A) ? ' style="text-align:left;"' : /^--*[ \t]*:[ \t]*$/.test(A) ? ' style="text-align:right;"' : /^:[ \t]*--*[ \t]*:$/.test(A) ? ' style="text-align:center;"' : "";
      }
      function S(A, z) {
        var j = "";
        return A = A.trim(), (d.tablesHeaderId || d.tableHeaderId) && (j = ' id="' + A.replace(/ /g, "_").toLowerCase() + '"'), A = r.subParser("spanGamut")(A, d, f), "<th" + j + z + ">" + A + `</th>
`;
      }
      function C(A, z) {
        var j = r.subParser("spanGamut")(A, d, f);
        return "<td" + z + ">" + j + `</td>
`;
      }
      function L(A, z) {
        for (var j = `<table>
<thead>
<tr>
`, $ = A.length, O = 0; O < $; ++O)
          j += A[O];
        for (j += `</tr>
</thead>
<tbody>
`, O = 0; O < z.length; ++O) {
          j += `<tr>
`;
          for (var F = 0; F < $; ++F)
            j += z[O][F];
          j += `</tr>
`;
        }
        return j += `</tbody>
</table>
`, j;
      }
      function B(A) {
        var z, j = A.split(`
`);
        for (z = 0; z < j.length; ++z)
          /^ {0,3}\|/.test(j[z]) && (j[z] = j[z].replace(/^ {0,3}\|/, "")), /\|[ \t]*$/.test(j[z]) && (j[z] = j[z].replace(/\|[ \t]*$/, "")), j[z] = r.subParser("codeSpans")(j[z], d, f);
        var $ = j[0].split("|").map(function(_e) {
          return _e.trim();
        }), O = j[1].split("|").map(function(_e) {
          return _e.trim();
        }), F = [], U = [], V = [], Z = [];
        for (j.shift(), j.shift(), z = 0; z < j.length; ++z)
          j[z].trim() !== "" && F.push(
            j[z].split("|").map(function(_e) {
              return _e.trim();
            })
          );
        if ($.length < O.length)
          return A;
        for (z = 0; z < O.length; ++z)
          V.push(k(O[z]));
        for (z = 0; z < $.length; ++z)
          r.helper.isUndefined(V[z]) && (V[z] = ""), U.push(S($[z], V[z]));
        for (z = 0; z < F.length; ++z) {
          for (var le = [], se = 0; se < U.length; ++se)
            r.helper.isUndefined(F[z][se]), le.push(C(F[z][se], V[se]));
          Z.push(le);
        }
        return L(U, Z);
      }
      return l = f.converter._dispatch("tables.before", l, d, f), l = l.replace(/\\(\|)/g, r.helper.escapeCharactersCallback), l = l.replace(m, B), l = l.replace(v, B), l = f.converter._dispatch("tables.after", l, d, f), l;
    }), r.subParser("underline", function(l, d, f) {
      return d.underline && (l = f.converter._dispatch("underline.before", l, d, f), d.literalMidWordUnderscores ? (l = l.replace(/\b___(\S[\s\S]*?)___\b/g, function(m, v) {
        return "<u>" + v + "</u>";
      }), l = l.replace(/\b__(\S[\s\S]*?)__\b/g, function(m, v) {
        return "<u>" + v + "</u>";
      })) : (l = l.replace(/___(\S[\s\S]*?)___/g, function(m, v) {
        return /\S$/.test(v) ? "<u>" + v + "</u>" : m;
      }), l = l.replace(/__(\S[\s\S]*?)__/g, function(m, v) {
        return /\S$/.test(v) ? "<u>" + v + "</u>" : m;
      })), l = l.replace(/(_)/g, r.helper.escapeCharactersCallback), l = f.converter._dispatch("underline.after", l, d, f)), l;
    }), r.subParser("unescapeSpecialChars", function(l, d, f) {
      return l = f.converter._dispatch("unescapeSpecialChars.before", l, d, f), l = l.replace(/¨E(\d+)E/g, function(m, v) {
        var k = parseInt(v);
        return String.fromCharCode(k);
      }), l = f.converter._dispatch("unescapeSpecialChars.after", l, d, f), l;
    }), r.subParser("makeMarkdown.blockquote", function(l, d) {
      var f = "";
      if (l.hasChildNodes())
        for (var m = l.childNodes, v = m.length, k = 0; k < v; ++k) {
          var S = r.subParser("makeMarkdown.node")(m[k], d);
          S !== "" && (f += S);
        }
      return f = f.trim(), f = "> " + f.split(`
`).join(`
> `), f;
    }), r.subParser("makeMarkdown.codeBlock", function(l, d) {
      var f = l.getAttribute("language"), m = l.getAttribute("precodenum");
      return "```" + f + `
` + d.preList[m] + "\n```";
    }), r.subParser("makeMarkdown.codeSpan", function(l) {
      return "`" + l.innerHTML + "`";
    }), r.subParser("makeMarkdown.emphasis", function(l, d) {
      var f = "";
      if (l.hasChildNodes()) {
        f += "*";
        for (var m = l.childNodes, v = m.length, k = 0; k < v; ++k)
          f += r.subParser("makeMarkdown.node")(m[k], d);
        f += "*";
      }
      return f;
    }), r.subParser("makeMarkdown.header", function(l, d, f) {
      var m = new Array(f + 1).join("#"), v = "";
      if (l.hasChildNodes()) {
        v = m + " ";
        for (var k = l.childNodes, S = k.length, C = 0; C < S; ++C)
          v += r.subParser("makeMarkdown.node")(k[C], d);
      }
      return v;
    }), r.subParser("makeMarkdown.hr", function() {
      return "---";
    }), r.subParser("makeMarkdown.image", function(l) {
      var d = "";
      return l.hasAttribute("src") && (d += "![" + l.getAttribute("alt") + "](", d += "<" + l.getAttribute("src") + ">", l.hasAttribute("width") && l.hasAttribute("height") && (d += " =" + l.getAttribute("width") + "x" + l.getAttribute("height")), l.hasAttribute("title") && (d += ' "' + l.getAttribute("title") + '"'), d += ")"), d;
    }), r.subParser("makeMarkdown.links", function(l, d) {
      var f = "";
      if (l.hasChildNodes() && l.hasAttribute("href")) {
        var m = l.childNodes, v = m.length;
        f = "[";
        for (var k = 0; k < v; ++k)
          f += r.subParser("makeMarkdown.node")(m[k], d);
        f += "](", f += "<" + l.getAttribute("href") + ">", l.hasAttribute("title") && (f += ' "' + l.getAttribute("title") + '"'), f += ")";
      }
      return f;
    }), r.subParser("makeMarkdown.list", function(l, d, f) {
      var m = "";
      if (!l.hasChildNodes())
        return "";
      for (var v = l.childNodes, k = v.length, S = l.getAttribute("start") || 1, C = 0; C < k; ++C)
        if (!(typeof v[C].tagName > "u" || v[C].tagName.toLowerCase() !== "li")) {
          var L = "";
          f === "ol" ? L = S.toString() + ". " : L = "- ", m += L + r.subParser("makeMarkdown.listItem")(v[C], d), ++S;
        }
      return m += `
<!-- -->
`, m.trim();
    }), r.subParser("makeMarkdown.listItem", function(l, d) {
      for (var f = "", m = l.childNodes, v = m.length, k = 0; k < v; ++k)
        f += r.subParser("makeMarkdown.node")(m[k], d);
      return /\n$/.test(f) ? f = f.split(`
`).join(`
    `).replace(/^ {4}$/gm, "").replace(/\n\n+/g, `

`) : f += `
`, f;
    }), r.subParser("makeMarkdown.node", function(l, d, f) {
      f = f || !1;
      var m = "";
      if (l.nodeType === 3)
        return r.subParser("makeMarkdown.txt")(l, d);
      if (l.nodeType === 8)
        return "<!--" + l.data + `-->

`;
      if (l.nodeType !== 1)
        return "";
      var v = l.tagName.toLowerCase();
      switch (v) {
        case "h1":
          f || (m = r.subParser("makeMarkdown.header")(l, d, 1) + `

`);
          break;
        case "h2":
          f || (m = r.subParser("makeMarkdown.header")(l, d, 2) + `

`);
          break;
        case "h3":
          f || (m = r.subParser("makeMarkdown.header")(l, d, 3) + `

`);
          break;
        case "h4":
          f || (m = r.subParser("makeMarkdown.header")(l, d, 4) + `

`);
          break;
        case "h5":
          f || (m = r.subParser("makeMarkdown.header")(l, d, 5) + `

`);
          break;
        case "h6":
          f || (m = r.subParser("makeMarkdown.header")(l, d, 6) + `

`);
          break;
        case "p":
          f || (m = r.subParser("makeMarkdown.paragraph")(l, d) + `

`);
          break;
        case "blockquote":
          f || (m = r.subParser("makeMarkdown.blockquote")(l, d) + `

`);
          break;
        case "hr":
          f || (m = r.subParser("makeMarkdown.hr")(l, d) + `

`);
          break;
        case "ol":
          f || (m = r.subParser("makeMarkdown.list")(l, d, "ol") + `

`);
          break;
        case "ul":
          f || (m = r.subParser("makeMarkdown.list")(l, d, "ul") + `

`);
          break;
        case "precode":
          f || (m = r.subParser("makeMarkdown.codeBlock")(l, d) + `

`);
          break;
        case "pre":
          f || (m = r.subParser("makeMarkdown.pre")(l, d) + `

`);
          break;
        case "table":
          f || (m = r.subParser("makeMarkdown.table")(l, d) + `

`);
          break;
        case "code":
          m = r.subParser("makeMarkdown.codeSpan")(l, d);
          break;
        case "em":
        case "i":
          m = r.subParser("makeMarkdown.emphasis")(l, d);
          break;
        case "strong":
        case "b":
          m = r.subParser("makeMarkdown.strong")(l, d);
          break;
        case "del":
          m = r.subParser("makeMarkdown.strikethrough")(l, d);
          break;
        case "a":
          m = r.subParser("makeMarkdown.links")(l, d);
          break;
        case "img":
          m = r.subParser("makeMarkdown.image")(l, d);
          break;
        default:
          m = l.outerHTML + `

`;
      }
      return m;
    }), r.subParser("makeMarkdown.paragraph", function(l, d) {
      var f = "";
      if (l.hasChildNodes())
        for (var m = l.childNodes, v = m.length, k = 0; k < v; ++k)
          f += r.subParser("makeMarkdown.node")(m[k], d);
      return f = f.trim(), f;
    }), r.subParser("makeMarkdown.pre", function(l, d) {
      var f = l.getAttribute("prenum");
      return "<pre>" + d.preList[f] + "</pre>";
    }), r.subParser("makeMarkdown.strikethrough", function(l, d) {
      var f = "";
      if (l.hasChildNodes()) {
        f += "~~";
        for (var m = l.childNodes, v = m.length, k = 0; k < v; ++k)
          f += r.subParser("makeMarkdown.node")(m[k], d);
        f += "~~";
      }
      return f;
    }), r.subParser("makeMarkdown.strong", function(l, d) {
      var f = "";
      if (l.hasChildNodes()) {
        f += "**";
        for (var m = l.childNodes, v = m.length, k = 0; k < v; ++k)
          f += r.subParser("makeMarkdown.node")(m[k], d);
        f += "**";
      }
      return f;
    }), r.subParser("makeMarkdown.table", function(l, d) {
      var f = "", m = [[], []], v = l.querySelectorAll("thead>tr>th"), k = l.querySelectorAll("tbody>tr"), S, C;
      for (S = 0; S < v.length; ++S) {
        var L = r.subParser("makeMarkdown.tableCell")(v[S], d), B = "---";
        if (v[S].hasAttribute("style")) {
          var A = v[S].getAttribute("style").toLowerCase().replace(/\s/g, "");
          switch (A) {
            case "text-align:left;":
              B = ":---";
              break;
            case "text-align:right;":
              B = "---:";
              break;
            case "text-align:center;":
              B = ":---:";
              break;
          }
        }
        m[0][S] = L.trim(), m[1][S] = B;
      }
      for (S = 0; S < k.length; ++S) {
        var z = m.push([]) - 1, j = k[S].getElementsByTagName("td");
        for (C = 0; C < v.length; ++C) {
          var $ = " ";
          typeof j[C] < "u" && ($ = r.subParser("makeMarkdown.tableCell")(j[C], d)), m[z].push($);
        }
      }
      var O = 3;
      for (S = 0; S < m.length; ++S)
        for (C = 0; C < m[S].length; ++C) {
          var F = m[S][C].length;
          F > O && (O = F);
        }
      for (S = 0; S < m.length; ++S) {
        for (C = 0; C < m[S].length; ++C)
          S === 1 ? m[S][C].slice(-1) === ":" ? m[S][C] = r.helper.padEnd(m[S][C].slice(-1), O - 1, "-") + ":" : m[S][C] = r.helper.padEnd(m[S][C], O, "-") : m[S][C] = r.helper.padEnd(m[S][C], O);
        f += "| " + m[S].join(" | ") + ` |
`;
      }
      return f.trim();
    }), r.subParser("makeMarkdown.tableCell", function(l, d) {
      var f = "";
      if (!l.hasChildNodes())
        return "";
      for (var m = l.childNodes, v = m.length, k = 0; k < v; ++k)
        f += r.subParser("makeMarkdown.node")(m[k], d, !0);
      return f.trim();
    }), r.subParser("makeMarkdown.txt", function(l) {
      var d = l.nodeValue;
      return d = d.replace(/ +/g, " "), d = d.replace(/¨NBSP;/g, " "), d = r.helper.unescapeHTMLEntities(d), d = d.replace(/([*_~|`])/g, "\\$1"), d = d.replace(/^(\s*)>/g, "\\$1>"), d = d.replace(/^#/gm, "\\#"), d = d.replace(/^(\s*)([-=]{3,})(\s*)$/, "$1\\$2$3"), d = d.replace(/^( {0,3}\d+)\./gm, "$1\\."), d = d.replace(/^( {0,3})([+-])/gm, "$1\\$2"), d = d.replace(/]([\s]*)\(/g, "\\]$1\\("), d = d.replace(/^ {0,3}\[([\S \t]*?)]:/gm, "\\[$1]:"), d;
    });
    var N = this;
    e.exports ? e.exports = r : N.showdown = r;
  }).call(wy);
})(Z_);
var eE = Z_.exports;
const tE = /* @__PURE__ */ od(eE);
function nE() {
  return [
    {
      type: "lang",
      regex: /(?<![a-zA-Z0-9_])_(?!_)((?:[^_<>]|<[^>]*>)+?)_(?![a-zA-Z0-9_])/g,
      replace: (e, t) => `<em>${t}</em>`
    }
  ];
}
function rE() {
  return [
    {
      type: "lang",
      filter: (e) => e
    }
  ];
}
function sE() {
  const e = new tE.Converter({
    emoji: !0,
    literalMidWordUnderscores: !0,
    parseImgDimensions: !0,
    tables: !0,
    underline: !0,
    simpleLineBreaks: !0,
    strikethrough: !0,
    disableForced4SpacesIndentedSublists: !0,
    extensions: [...nE()]
  });
  return e.addExtension(rE(), "exclusion"), e;
}
let Tc = null;
function aE() {
  return Tc || (Tc = sE()), Tc;
}
/*! @license DOMPurify 3.4.7 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.7/LICENSE */
function Fm(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function iE(e) {
  if (Array.isArray(e)) return e;
}
function oE(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, s, i, o, c = [], u = !0, p = !1;
    try {
      if (i = (n = n.call(e)).next, t !== 0) for (; !(u = (r = i.call(n)).done) && (c.push(r.value), c.length !== t); u = !0) ;
    } catch (h) {
      p = !0, s = h;
    } finally {
      try {
        if (!u && n.return != null && (o = n.return(), Object(o) !== o)) return;
      } finally {
        if (p) throw s;
      }
    }
    return c;
  }
}
function lE() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function cE(e, t) {
  return iE(e) || oE(e, t) || uE(e, t) || lE();
}
function uE(e, t) {
  if (e) {
    if (typeof e == "string") return Fm(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Fm(e, t) : void 0;
  }
}
const J_ = Object.entries, Um = Object.setPrototypeOf, dE = Object.isFrozen, fE = Object.getPrototypeOf, pE = Object.getOwnPropertyDescriptor;
let Et = Object.freeze, ln = Object.seal, Ns = Object.create, ey = typeof Reflect < "u" && Reflect, ed = ey.apply, td = ey.construct;
Et || (Et = function(t) {
  return t;
});
ln || (ln = function(t) {
  return t;
});
ed || (ed = function(t, n) {
  for (var r = arguments.length, s = new Array(r > 2 ? r - 2 : 0), i = 2; i < r; i++)
    s[i - 2] = arguments[i];
  return t.apply(n, s);
});
td || (td = function(t) {
  for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), s = 1; s < n; s++)
    r[s - 1] = arguments[s];
  return new t(...r);
});
const bs = Ye(Array.prototype.forEach), mE = Ye(Array.prototype.lastIndexOf), Wm = Ye(Array.prototype.pop), ws = Ye(Array.prototype.push), hE = Ye(Array.prototype.splice), kt = Array.isArray, Ta = Ye(String.prototype.toLowerCase), Ic = Ye(String.prototype.toString), Gm = Ye(String.prototype.match), Ss = Ye(String.prototype.replace), Vm = Ye(String.prototype.indexOf), gE = Ye(String.prototype.trim), vE = Ye(Number.prototype.toString), _E = Ye(Boolean.prototype.toString), Km = typeof BigInt > "u" ? null : Ye(BigInt.prototype.toString), qm = typeof Symbol > "u" ? null : Ye(Symbol.prototype.toString), Ue = Ye(Object.prototype.hasOwnProperty), Sa = Ye(Object.prototype.toString), ot = Ye(RegExp.prototype.test), ka = yE(TypeError);
function Ye(e) {
  return function(t) {
    t instanceof RegExp && (t.lastIndex = 0);
    for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), s = 1; s < n; s++)
      r[s - 1] = arguments[s];
    return ed(e, t, r);
  };
}
function yE(e) {
  return function() {
    for (var t = arguments.length, n = new Array(t), r = 0; r < t; r++)
      n[r] = arguments[r];
    return td(e, n);
  };
}
function pe(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Ta;
  if (Um && Um(e, null), !kt(t))
    return e;
  let r = t.length;
  for (; r--; ) {
    let s = t[r];
    if (typeof s == "string") {
      const i = n(s);
      i !== s && (dE(t) || (t[r] = i), s = i);
    }
    e[s] = !0;
  }
  return e;
}
function xE(e) {
  for (let t = 0; t < e.length; t++)
    Ue(e, t) || (e[t] = null);
  return e;
}
function vt(e) {
  const t = Ns(null);
  for (const r of J_(e)) {
    var n = cE(r, 2);
    const s = n[0], i = n[1];
    Ue(e, s) && (kt(i) ? t[s] = xE(i) : i && typeof i == "object" && i.constructor === Object ? t[s] = vt(i) : t[s] = i);
  }
  return t;
}
function bE(e) {
  switch (typeof e) {
    case "string":
      return e;
    case "number":
      return vE(e);
    case "boolean":
      return _E(e);
    case "bigint":
      return Km ? Km(e) : "0";
    case "symbol":
      return qm ? qm(e) : "Symbol()";
    case "undefined":
      return Sa(e);
    case "function":
    case "object": {
      if (e === null)
        return Sa(e);
      const t = e, n = Mn(t, "toString");
      if (typeof n == "function") {
        const r = n(t);
        return typeof r == "string" ? r : Sa(r);
      }
      return Sa(e);
    }
    default:
      return Sa(e);
  }
}
function Mn(e, t) {
  for (; e !== null; ) {
    const r = pE(e, t);
    if (r) {
      if (r.get)
        return Ye(r.get);
      if (typeof r.value == "function")
        return Ye(r.value);
    }
    e = fE(e);
  }
  function n() {
    return null;
  }
  return n;
}
function wE(e) {
  try {
    return ot(e, ""), !0;
  } catch {
    return !1;
  }
}
const Ym = Et(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), Ac = Et(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), Pc = Et(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), SE = Et(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Rc = Et(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), kE = Et(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Qm = Et(["#text"]), Xm = Et(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "command", "commandfor", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns"]), Mc = Et(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), Zm = Et(["accent", "accentunder", "align", "bevelled", "close", "columnalign", "columnlines", "columnspacing", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lquote", "lspace", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), uo = Et(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), NE = ln(/{{[\w\W]*|^[\w\W]*}}/g), jE = ln(/<%[\w\W]*|^[\w\W]*%>/g), EE = ln(/\${[\w\W]*/g), CE = ln(/^data-[\-\w.\u00B7-\uFFFF]+$/), TE = ln(/^aria-[\-\w]+$/), Jm = ln(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), IE = ln(/^(?:\w+script|data):/i), AE = ln(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), PE = ln(/^html$/i), RE = ln(/^[a-z][.\w]*(-[.\w]+)+$/i), Pn = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  // Deprecated
  entityNode: 6,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12
  // Deprecated
}, ME = function() {
  return typeof window > "u" ? null : window;
}, DE = function(t, n) {
  if (typeof t != "object" || typeof t.createPolicy != "function")
    return null;
  let r = null;
  const s = "data-tt-policy-suffix";
  n && n.hasAttribute(s) && (r = n.getAttribute(s));
  const i = "dompurify" + (r ? "#" + r : "");
  try {
    return t.createPolicy(i, {
      createHTML(o) {
        return o;
      },
      createScriptURL(o) {
        return o;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + i + " could not be created."), null;
  }
}, eh = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function ty() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ME();
  const t = (M) => ty(M);
  if (t.version = "3.4.7", t.removed = [], !e || !e.document || e.document.nodeType !== Pn.document || !e.Element)
    return t.isSupported = !1, t;
  let n = e.document;
  const r = n, s = r.currentScript;
  e.DocumentFragment;
  const i = e.HTMLTemplateElement, o = e.Node, c = e.Element, u = e.NodeFilter, p = e.NamedNodeMap;
  p === void 0 && (e.NamedNodeMap || e.MozNamedAttrMap), e.HTMLFormElement;
  const h = e.DOMParser, x = e.trustedTypes, g = c.prototype, w = Mn(g, "cloneNode"), E = Mn(g, "remove"), I = Mn(g, "nextSibling"), D = Mn(g, "childNodes"), y = Mn(g, "parentNode"), b = Mn(g, "shadowRoot"), N = Mn(g, "attributes"), l = o && o.prototype ? Mn(o.prototype, "nodeType") : null, d = o && o.prototype ? Mn(o.prototype, "nodeName") : null;
  if (typeof i == "function") {
    const M = n.createElement("template");
    M.content && M.content.ownerDocument && (n = M.content.ownerDocument);
  }
  let f, m = "";
  const v = n, k = v.implementation, S = v.createNodeIterator, C = v.createDocumentFragment, L = v.getElementsByTagName, B = r.importNode;
  let A = eh();
  t.isSupported = typeof J_ == "function" && typeof y == "function" && k && k.createHTMLDocument !== void 0;
  const z = NE, j = jE, $ = EE, O = CE, F = TE, U = IE, V = AE, Z = RE;
  let le = Jm, se = null;
  const _e = pe({}, [...Ym, ...Ac, ...Pc, ...Rc, ...Qm]);
  let ne = null;
  const Y = pe({}, [...Xm, ...Mc, ...Zm, ...uo]);
  let W = Object.seal(Ns(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), ae = null, fe = null;
  const ge = Object.seal(Ns(null, {
    tagCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    }
  }));
  let Se = !0, xe = !0, Te = !1, et = !0, Ee = !1, pt = !0, tt = !1, cn = !1, Nn = !1, Kt = !1, Un = !1, un = !1, Lt = !0, qt = !1;
  const Hr = "user-content-";
  let cr = !0, jn = !1, dn = {}, At = null;
  const ur = pe({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let ms = null;
  const Ci = pe({}, ["audio", "video", "img", "source", "image", "track"]);
  let la = null;
  const Ti = pe({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), hs = "http://www.w3.org/1998/Math/MathML", dr = "http://www.w3.org/2000/svg", Yt = "http://www.w3.org/1999/xhtml";
  let fr = Yt, ca = !1, ua = null;
  const Ml = pe({}, [hs, dr, Yt], Ic);
  let da = pe({}, ["mi", "mo", "mn", "ms", "mtext"]), gs = pe({}, ["annotation-xml"]);
  const de = pe({}, ["title", "style", "font", "a", "script"]);
  let it = null;
  const Dl = ["application/xhtml+xml", "text/html"], fn = "text/html";
  let Le = null, Wn = null;
  const Ol = n.createElement("form"), Ve = function(_) {
    return _ instanceof RegExp || _ instanceof Function;
  }, fa = function() {
    let _ = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (Wn && Wn === _)
      return;
    (!_ || typeof _ != "object") && (_ = {}), _ = vt(_), it = // eslint-disable-next-line unicorn/prefer-includes
    Dl.indexOf(_.PARSER_MEDIA_TYPE) === -1 ? fn : _.PARSER_MEDIA_TYPE, Le = it === "application/xhtml+xml" ? Ic : Ta, se = Ue(_, "ALLOWED_TAGS") && kt(_.ALLOWED_TAGS) ? pe({}, _.ALLOWED_TAGS, Le) : _e, ne = Ue(_, "ALLOWED_ATTR") && kt(_.ALLOWED_ATTR) ? pe({}, _.ALLOWED_ATTR, Le) : Y, ua = Ue(_, "ALLOWED_NAMESPACES") && kt(_.ALLOWED_NAMESPACES) ? pe({}, _.ALLOWED_NAMESPACES, Ic) : Ml, la = Ue(_, "ADD_URI_SAFE_ATTR") && kt(_.ADD_URI_SAFE_ATTR) ? pe(vt(Ti), _.ADD_URI_SAFE_ATTR, Le) : Ti, ms = Ue(_, "ADD_DATA_URI_TAGS") && kt(_.ADD_DATA_URI_TAGS) ? pe(vt(Ci), _.ADD_DATA_URI_TAGS, Le) : Ci, At = Ue(_, "FORBID_CONTENTS") && kt(_.FORBID_CONTENTS) ? pe({}, _.FORBID_CONTENTS, Le) : ur, ae = Ue(_, "FORBID_TAGS") && kt(_.FORBID_TAGS) ? pe({}, _.FORBID_TAGS, Le) : vt({}), fe = Ue(_, "FORBID_ATTR") && kt(_.FORBID_ATTR) ? pe({}, _.FORBID_ATTR, Le) : vt({}), dn = Ue(_, "USE_PROFILES") ? _.USE_PROFILES && typeof _.USE_PROFILES == "object" ? vt(_.USE_PROFILES) : _.USE_PROFILES : !1, Se = _.ALLOW_ARIA_ATTR !== !1, xe = _.ALLOW_DATA_ATTR !== !1, Te = _.ALLOW_UNKNOWN_PROTOCOLS || !1, et = _.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Ee = _.SAFE_FOR_TEMPLATES || !1, pt = _.SAFE_FOR_XML !== !1, tt = _.WHOLE_DOCUMENT || !1, Kt = _.RETURN_DOM || !1, Un = _.RETURN_DOM_FRAGMENT || !1, un = _.RETURN_TRUSTED_TYPE || !1, Nn = _.FORCE_BODY || !1, Lt = _.SANITIZE_DOM !== !1, qt = _.SANITIZE_NAMED_PROPS || !1, cr = _.KEEP_CONTENT !== !1, jn = _.IN_PLACE || !1, le = wE(_.ALLOWED_URI_REGEXP) ? _.ALLOWED_URI_REGEXP : Jm, fr = typeof _.NAMESPACE == "string" ? _.NAMESPACE : Yt, da = Ue(_, "MATHML_TEXT_INTEGRATION_POINTS") && _.MATHML_TEXT_INTEGRATION_POINTS && typeof _.MATHML_TEXT_INTEGRATION_POINTS == "object" ? vt(_.MATHML_TEXT_INTEGRATION_POINTS) : pe({}, ["mi", "mo", "mn", "ms", "mtext"]), gs = Ue(_, "HTML_INTEGRATION_POINTS") && _.HTML_INTEGRATION_POINTS && typeof _.HTML_INTEGRATION_POINTS == "object" ? vt(_.HTML_INTEGRATION_POINTS) : pe({}, ["annotation-xml"]);
    const T = Ue(_, "CUSTOM_ELEMENT_HANDLING") && _.CUSTOM_ELEMENT_HANDLING && typeof _.CUSTOM_ELEMENT_HANDLING == "object" ? vt(_.CUSTOM_ELEMENT_HANDLING) : Ns(null);
    if (W = Ns(null), Ue(T, "tagNameCheck") && Ve(T.tagNameCheck) && (W.tagNameCheck = T.tagNameCheck), Ue(T, "attributeNameCheck") && Ve(T.attributeNameCheck) && (W.attributeNameCheck = T.attributeNameCheck), Ue(T, "allowCustomizedBuiltInElements") && typeof T.allowCustomizedBuiltInElements == "boolean" && (W.allowCustomizedBuiltInElements = T.allowCustomizedBuiltInElements), Ee && (xe = !1), Un && (Kt = !0), dn && (se = pe({}, Qm), ne = Ns(null), dn.html === !0 && (pe(se, Ym), pe(ne, Xm)), dn.svg === !0 && (pe(se, Ac), pe(ne, Mc), pe(ne, uo)), dn.svgFilters === !0 && (pe(se, Pc), pe(ne, Mc), pe(ne, uo)), dn.mathMl === !0 && (pe(se, Rc), pe(ne, Zm), pe(ne, uo))), ge.tagCheck = null, ge.attributeCheck = null, Ue(_, "ADD_TAGS") && (typeof _.ADD_TAGS == "function" ? ge.tagCheck = _.ADD_TAGS : kt(_.ADD_TAGS) && (se === _e && (se = vt(se)), pe(se, _.ADD_TAGS, Le))), Ue(_, "ADD_ATTR") && (typeof _.ADD_ATTR == "function" ? ge.attributeCheck = _.ADD_ATTR : kt(_.ADD_ATTR) && (ne === Y && (ne = vt(ne)), pe(ne, _.ADD_ATTR, Le))), Ue(_, "ADD_URI_SAFE_ATTR") && kt(_.ADD_URI_SAFE_ATTR) && pe(la, _.ADD_URI_SAFE_ATTR, Le), Ue(_, "FORBID_CONTENTS") && kt(_.FORBID_CONTENTS) && (At === ur && (At = vt(At)), pe(At, _.FORBID_CONTENTS, Le)), Ue(_, "ADD_FORBID_CONTENTS") && kt(_.ADD_FORBID_CONTENTS) && (At === ur && (At = vt(At)), pe(At, _.ADD_FORBID_CONTENTS, Le)), cr && (se["#text"] = !0), tt && pe(se, ["html", "head", "body"]), se.table && (pe(se, ["tbody"]), delete ae.tbody), _.TRUSTED_TYPES_POLICY) {
      if (typeof _.TRUSTED_TYPES_POLICY.createHTML != "function")
        throw ka('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof _.TRUSTED_TYPES_POLICY.createScriptURL != "function")
        throw ka('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      f = _.TRUSTED_TYPES_POLICY, m = f.createHTML("");
    } else
      f === void 0 && (f = DE(x, s)), f !== null && typeof m == "string" && (m = f.createHTML(""));
    (A.uponSanitizeElement.length > 0 || A.uponSanitizeAttribute.length > 0) && se === _e && (se = vt(se)), A.uponSanitizeAttribute.length > 0 && ne === Y && (ne = vt(ne)), Et && Et(_), Wn = _;
  }, Ii = pe({}, [...Ac, ...Pc, ...SE]), Ai = pe({}, [...Rc, ...kE]), Ll = function(_) {
    let T = y(_);
    (!T || !T.tagName) && (T = {
      namespaceURI: fr,
      tagName: "template"
    });
    const H = Ta(_.tagName), ee = Ta(T.tagName);
    return ua[_.namespaceURI] ? _.namespaceURI === dr ? T.namespaceURI === Yt ? H === "svg" : T.namespaceURI === hs ? H === "svg" && (ee === "annotation-xml" || da[ee]) : !!Ii[H] : _.namespaceURI === hs ? T.namespaceURI === Yt ? H === "math" : T.namespaceURI === dr ? H === "math" && gs[ee] : !!Ai[H] : _.namespaceURI === Yt ? T.namespaceURI === dr && !gs[ee] || T.namespaceURI === hs && !da[ee] ? !1 : !Ai[H] && (de[H] || !Ii[H]) : !!(it === "application/xhtml+xml" && ua[_.namespaceURI]) : !1;
  }, zt = function(_) {
    ws(t.removed, {
      element: _
    });
    try {
      y(_).removeChild(_);
    } catch {
      E(_);
    }
  }, Gn = function(_, T) {
    try {
      ws(t.removed, {
        attribute: T.getAttributeNode(_),
        from: T
      });
    } catch {
      ws(t.removed, {
        attribute: null,
        from: T
      });
    }
    if (T.removeAttribute(_), _ === "is")
      if (Kt || Un)
        try {
          zt(T);
        } catch {
        }
      else
        try {
          T.setAttribute(_, "");
        } catch {
        }
  }, Pi = function(_) {
    let T = null, H = null;
    if (Nn)
      _ = "<remove></remove>" + _;
    else {
      const ve = Gm(_, /^[\r\n\t ]+/);
      H = ve && ve[0];
    }
    it === "application/xhtml+xml" && fr === Yt && (_ = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + _ + "</body></html>");
    const ee = f ? f.createHTML(_) : _;
    if (fr === Yt)
      try {
        T = new h().parseFromString(ee, it);
      } catch {
      }
    if (!T || !T.documentElement) {
      T = k.createDocument(fr, "template", null);
      try {
        T.documentElement.innerHTML = ca ? m : ee;
      } catch {
      }
    }
    const re = T.body || T.documentElement;
    return _ && H && re.insertBefore(n.createTextNode(H), re.childNodes[0] || null), fr === Yt ? L.call(T, tt ? "html" : "body")[0] : tt ? T.documentElement : re;
  }, Ri = function(_) {
    return S.call(
      _.ownerDocument || _,
      _,
      // eslint-disable-next-line no-bitwise
      u.SHOW_ELEMENT | u.SHOW_COMMENT | u.SHOW_TEXT | u.SHOW_PROCESSING_INSTRUCTION | u.SHOW_CDATA_SECTION,
      null
    );
  }, Mi = function(_) {
    _.normalize();
    const T = S.call(
      _.ownerDocument || _,
      _,
      // eslint-disable-next-line no-bitwise
      u.SHOW_TEXT | u.SHOW_COMMENT | u.SHOW_CDATA_SECTION | u.SHOW_PROCESSING_INSTRUCTION,
      null
    );
    let H = T.nextNode();
    for (; H; ) {
      let ee = H.data;
      bs([z, j, $], (re) => {
        ee = Ss(ee, re, " ");
      }), H.data = ee, H = T.nextNode();
    }
  }, vs = function(_) {
    const T = d ? d(_) : null;
    return typeof T != "string" || Le(T) !== "form" ? !1 : typeof _.nodeName != "string" || typeof _.textContent != "string" || typeof _.removeChild != "function" || // Realm-safe NamedNodeMap detection: equality against the cached
    // prototype getter. Clobbered .attributes (e.g. <input name="attributes">)
    // makes the direct read diverge from the cached read; a clean form
    // (same-realm OR foreign-realm) has both reads pointing at the same
    // canonical NamedNodeMap.
    _.attributes !== N(_) || typeof _.removeAttribute != "function" || typeof _.setAttribute != "function" || typeof _.namespaceURI != "string" || typeof _.insertBefore != "function" || typeof _.hasChildNodes != "function" || // NodeType clobbering probe. Cached Node.prototype.nodeType getter
    // returns the integer 1 for any Element regardless of realm; direct
    // read on a clobbered form (e.g. <input name="nodeType">) returns
    // the named child element. Cheap addition — nodeType is read from
    // an internal slot, no serialization cost — and removes a residual
    // clobbering surface used by several mXSS / PI / comment branches
    // in _sanitizeElements that compare currentNode.nodeType directly.
    _.nodeType !== l(_) || // HTMLFormElement has [LegacyOverrideBuiltIns]: a descendant named
    // "childNodes" shadows the prototype getter. Direct reads of
    // form.childNodes from a clobbered form return the named child
    // instead of the real NodeList, so any walk that reads it directly
    // skips the form's real children. Compare the direct read to the
    // cached Node.prototype getter — when the form's named-property
    // getter intercepts the read, the two values differ and we flag
    // the form. This catches every clobbering child type (input,
    // select, etc.) regardless of whether the named child happens to
    // carry a numeric .length, which a typeof-based probe would miss
    // (e.g. HTMLSelectElement.length is a defined unsigned-long).
    _.childNodes !== D(_);
  }, Fr = function(_) {
    if (!l || typeof _ != "object" || _ === null)
      return !1;
    try {
      return l(_) === Pn.documentFragment;
    } catch {
      return !1;
    }
  }, _s = function(_) {
    if (!l || typeof _ != "object" || _ === null)
      return !1;
    try {
      return typeof l(_) == "number";
    } catch {
      return !1;
    }
  };
  function pn(M, _, T) {
    bs(M, (H) => {
      H.call(t, _, T, Wn);
    });
  }
  const Ur = function(_) {
    let T = null;
    if (pn(A.beforeSanitizeElements, _, null), vs(_))
      return zt(_), !0;
    const H = Le(_.nodeName);
    if (pn(A.uponSanitizeElement, _, {
      tagName: H,
      allowedTags: se
    }), pt && _.hasChildNodes() && !_s(_.firstElementChild) && ot(/<[/\w!]/g, _.innerHTML) && ot(/<[/\w!]/g, _.textContent) || pt && _.namespaceURI === Yt && H === "style" && _s(_.firstElementChild) || _.nodeType === Pn.progressingInstruction || pt && _.nodeType === Pn.comment && ot(/<[/\w]/g, _.data))
      return zt(_), !0;
    if (ae[H] || !(ge.tagCheck instanceof Function && ge.tagCheck(H)) && !se[H]) {
      if (!ae[H] && Oi(H) && (W.tagNameCheck instanceof RegExp && ot(W.tagNameCheck, H) || W.tagNameCheck instanceof Function && W.tagNameCheck(H)))
        return !1;
      if (cr && !At[H]) {
        const re = y(_), ve = D(_);
        if (ve && re) {
          const nt = ve.length;
          for (let En = nt - 1; En >= 0; --En) {
            const mn = w(ve[En], !0);
            re.insertBefore(mn, I(_));
          }
        }
      }
      return zt(_), !0;
    }
    return (l ? l(_) : _.nodeType) === Pn.element && !Ll(_) || (H === "noscript" || H === "noembed" || H === "noframes") && ot(/<\/no(script|embed|frames)/i, _.innerHTML) ? (zt(_), !0) : (Ee && _.nodeType === Pn.text && (T = _.textContent, bs([z, j, $], (re) => {
      T = Ss(T, re, " ");
    }), _.textContent !== T && (ws(t.removed, {
      element: _.cloneNode()
    }), _.textContent = T)), pn(A.afterSanitizeElements, _, null), !1);
  }, Di = function(_, T, H) {
    if (fe[T] || Lt && (T === "id" || T === "name") && (H in n || H in Ol))
      return !1;
    const ee = ne[T] || ge.attributeCheck instanceof Function && ge.attributeCheck(T, _);
    if (!(xe && !fe[T] && ot(O, T))) {
      if (!(Se && ot(F, T))) {
        if (!ee || fe[T]) {
          if (
            // First condition does a very basic check if a) it's basically a valid custom element tagname AND
            // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
            !(Oi(_) && (W.tagNameCheck instanceof RegExp && ot(W.tagNameCheck, _) || W.tagNameCheck instanceof Function && W.tagNameCheck(_)) && (W.attributeNameCheck instanceof RegExp && ot(W.attributeNameCheck, T) || W.attributeNameCheck instanceof Function && W.attributeNameCheck(T, _)) || // Alternative, second condition checks if it's an `is`-attribute, AND
            // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            T === "is" && W.allowCustomizedBuiltInElements && (W.tagNameCheck instanceof RegExp && ot(W.tagNameCheck, H) || W.tagNameCheck instanceof Function && W.tagNameCheck(H)))
          ) return !1;
        } else if (!la[T]) {
          if (!ot(le, Ss(H, V, ""))) {
            if (!((T === "src" || T === "xlink:href" || T === "href") && _ !== "script" && Vm(H, "data:") === 0 && ms[_])) {
              if (!(Te && !ot(U, Ss(H, V, "")))) {
                if (H)
                  return !1;
              }
            }
          }
        }
      }
    }
    return !0;
  }, zl = pe({}, ["annotation-xml", "color-profile", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "missing-glyph"]), Oi = function(_) {
    return !zl[Ta(_)] && ot(Z, _);
  }, Li = function(_) {
    pn(A.beforeSanitizeAttributes, _, null);
    const T = _.attributes;
    if (!T || vs(_))
      return;
    const H = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: ne,
      forceKeepAttr: void 0
    };
    let ee = T.length;
    for (; ee--; ) {
      const re = T[ee], ve = re.name, nt = re.namespaceURI, En = re.value, mn = Le(ve), Bl = En;
      let rt = ve === "value" ? Bl : gE(Bl);
      if (H.attrName = mn, H.attrValue = rt, H.keepAttr = !0, H.forceKeepAttr = void 0, pn(A.uponSanitizeAttribute, _, H), rt = H.attrValue, qt && (mn === "id" || mn === "name") && Vm(rt, Hr) !== 0 && (Gn(ve, _), rt = Hr + rt), pt && ot(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, rt)) {
        Gn(ve, _);
        continue;
      }
      if (mn === "attributename" && Gm(rt, "href")) {
        Gn(ve, _);
        continue;
      }
      if (H.forceKeepAttr)
        continue;
      if (!H.keepAttr) {
        Gn(ve, _);
        continue;
      }
      if (!et && ot(/\/>/i, rt)) {
        Gn(ve, _);
        continue;
      }
      Ee && bs([z, j, $], (If) => {
        rt = Ss(rt, If, " ");
      });
      const Tf = Le(_.nodeName);
      if (!Di(Tf, mn, rt)) {
        Gn(ve, _);
        continue;
      }
      if (f && typeof x == "object" && typeof x.getAttributeType == "function" && !nt)
        switch (x.getAttributeType(Tf, mn)) {
          case "TrustedHTML": {
            rt = f.createHTML(rt);
            break;
          }
          case "TrustedScriptURL": {
            rt = f.createScriptURL(rt);
            break;
          }
        }
      if (rt !== Bl)
        try {
          nt ? _.setAttributeNS(nt, ve, rt) : _.setAttribute(ve, rt), vs(_) ? zt(_) : Wm(t.removed);
        } catch {
          Gn(ve, _);
        }
    }
    pn(A.afterSanitizeAttributes, _, null);
  }, ys = function(_) {
    let T = null;
    const H = Ri(_);
    for (pn(A.beforeSanitizeShadowDOM, _, null); T = H.nextNode(); )
      if (pn(A.uponSanitizeShadowNode, T, null), Ur(T), Li(T), Fr(T.content) && ys(T.content), (l ? l(T) : T.nodeType) === Pn.element) {
        const re = b ? b(T) : T.shadowRoot;
        Fr(re) && (R(re), ys(re));
      }
    pn(A.afterSanitizeShadowDOM, _, null);
  }, R = function(_) {
    const T = l ? l(_) : _.nodeType;
    if (T === Pn.element) {
      const re = b ? b(_) : _.shadowRoot;
      Fr(re) && (R(re), ys(re));
    }
    const H = D ? D(_) : _.childNodes;
    if (!H)
      return;
    const ee = [];
    bs(H, (re) => {
      ws(ee, re);
    });
    for (const re of ee)
      R(re);
    if (T === Pn.element) {
      const re = d ? d(_) : null;
      if (typeof re == "string" && Le(re) === "template") {
        const ve = _.content;
        Fr(ve) && R(ve);
      }
    }
  };
  return t.sanitize = function(M) {
    let _ = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, T = null, H = null, ee = null, re = null;
    if (ca = !M, ca && (M = "<!-->"), typeof M != "string" && !_s(M) && (M = bE(M), typeof M != "string"))
      throw ka("dirty is not a string, aborting");
    if (!t.isSupported)
      return M;
    if (cn || fa(_), t.removed = [], typeof M == "string" && (jn = !1), jn) {
      const En = d ? d(M) : M.nodeName;
      if (typeof En == "string") {
        const mn = Le(En);
        if (!se[mn] || ae[mn])
          throw ka("root node is forbidden and cannot be sanitized in-place");
      }
      if (vs(M))
        throw ka("root node is clobbered and cannot be sanitized in-place");
      R(M);
    } else if (_s(M))
      T = Pi("<!---->"), H = T.ownerDocument.importNode(M, !0), H.nodeType === Pn.element && H.nodeName === "BODY" || H.nodeName === "HTML" ? T = H : T.appendChild(H), R(H);
    else {
      if (!Kt && !Ee && !tt && // eslint-disable-next-line unicorn/prefer-includes
      M.indexOf("<") === -1)
        return f && un ? f.createHTML(M) : M;
      if (T = Pi(M), !T)
        return Kt ? null : un ? m : "";
    }
    T && Nn && zt(T.firstChild);
    const ve = Ri(jn ? M : T);
    for (; ee = ve.nextNode(); )
      Ur(ee), Li(ee), Fr(ee.content) && ys(ee.content);
    if (jn)
      return Ee && Mi(M), M;
    if (Kt) {
      if (Ee && Mi(T), Un)
        for (re = C.call(T.ownerDocument); T.firstChild; )
          re.appendChild(T.firstChild);
      else
        re = T;
      return (ne.shadowroot || ne.shadowrootmode) && (re = B.call(r, re, !0)), re;
    }
    let nt = tt ? T.outerHTML : T.innerHTML;
    return tt && se["!doctype"] && T.ownerDocument && T.ownerDocument.doctype && T.ownerDocument.doctype.name && ot(PE, T.ownerDocument.doctype.name) && (nt = "<!DOCTYPE " + T.ownerDocument.doctype.name + `>
` + nt), Ee && bs([z, j, $], (En) => {
      nt = Ss(nt, En, " ");
    }), f && un ? f.createHTML(nt) : nt;
  }, t.setConfig = function() {
    let M = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    fa(M), cn = !0;
  }, t.clearConfig = function() {
    Wn = null, cn = !1;
  }, t.isValidAttribute = function(M, _, T) {
    Wn || fa({});
    const H = Le(M), ee = Le(_);
    return Di(H, ee, T);
  }, t.addHook = function(M, _) {
    typeof _ == "function" && ws(A[M], _);
  }, t.removeHook = function(M, _) {
    if (_ !== void 0) {
      const T = mE(A[M], _);
      return T === -1 ? void 0 : hE(A[M], T, 1)[0];
    }
    return Wm(A[M]);
  }, t.removeHooks = function(M) {
    A[M] = [];
  }, t.removeAllHooks = function() {
    A = eh();
  }, t;
}
var nd = ty();
const OE = /^(fa-|note-)/, LE = /* @__PURE__ */ new Set(["monospace"]);
let th = !1;
function zE() {
  th || (th = !0, nd.addHook("afterSanitizeAttributes", (e) => {
    "target" in e && (e.setAttribute("target", "_blank"), e.setAttribute("rel", "noopener noreferrer")), e.nodeName === "IMG" && (e.setAttribute("loading", "lazy"), e.setAttribute("decoding", "async"));
  }), nd.addHook("uponSanitizeAttribute", (e, t, n) => {
    if (n?.MESSAGE_SANITIZE && (t.attrName === "class" && t.attrValue && (t.attrValue = t.attrValue.split(/\s+/).filter(Boolean).map((r) => LE.has(r) || OE.test(r) ? r : `custom-${r}`).join(" ")), t.attrName.startsWith("on") && (t.keepAttr = !1), (t.attrName === "href" || t.attrName === "src") && t.attrValue)) {
      const r = t.attrValue.trim().toLowerCase();
      (r.startsWith("javascript:") || r.startsWith("vbscript:")) && (t.keepAttr = !1);
    }
  }));
}
function BE(e, t = {}) {
  zE();
  const n = {
    RETURN_DOM: !1,
    RETURN_DOM_FRAGMENT: !1,
    RETURN_TRUSTED_TYPE: !1,
    MESSAGE_SANITIZE: !0,
    MESSAGE_ALLOW_SYSTEM_UI: !!t.allowSystemUI,
    ADD_TAGS: ["custom-style"],
    FORBID_TAGS: ["script", "iframe", "object", "embed", "form", "input", "button"],
    FORBID_ATTR: ["srcdoc"],
    ...t.additional
  };
  return nd.sanitize(e, n);
}
const $E = /<custom-style>([\s\S]*?)<\/custom-style>/gi;
function HE(e) {
  return typeof btoa == "function" ? btoa(unescape(encodeURIComponent(e))) : Buffer.from(e, "utf-8").toString("base64");
}
function FE(e) {
  return typeof atob == "function" ? decodeURIComponent(escape(atob(e))) : Buffer.from(e, "base64").toString("utf-8");
}
function UE(e) {
  return e.replace($E, (t, n) => `<custom-style data-encoded="${HE(n)}"></custom-style>`);
}
function WE(e, t = {}) {
  const n = t.prefix ?? "";
  return e.replace(
    /<custom-style[^>]*data-encoded="([^"]*)"[^>]*>[\s\S]*?<\/custom-style>/gi,
    (r, s) => {
      let i;
      try {
        i = FE(s);
      } catch {
        return "";
      }
      return `<style>${n ? i.replace(/(^|\})\s*([^\{\}]+)\s*\{/g, (c, u, p) => {
        const h = p.split(",").map((x) => `${n}${x.trim()}`).join(", ");
        return `${u}${h}{`;
      }) : i}</style>`;
    }
  );
}
const rd = /* @__PURE__ */ new Map(), sd = /* @__PURE__ */ new Map(), ad = /* @__PURE__ */ new Map();
function hC(e, t) {
  return rd.set(e, t), () => rd.delete(e);
}
function gC(e, t) {
  return sd.set(e, t), () => sd.delete(e);
}
function vC(e, t) {
  return ad.set(e, t), () => ad.delete(e);
}
function GE(e, t) {
  for (const n of rd.values())
    try {
      e = n(e, t);
    } catch (r) {
      console.warn("[formatting] preMarkdown hook failed:", r);
    }
  return e;
}
function VE(e, t) {
  for (const n of sd.values())
    try {
      e = n(e, t);
    } catch (r) {
      console.warn("[formatting] preSanitize hook failed:", r);
    }
  return e;
}
function KE(e, t) {
  const n = [];
  for (const r of ad.values())
    try {
      const s = r(e, t);
      typeof s == "function" && n.push(s);
    } catch (s) {
      console.warn("[formatting] postRender hook failed:", s);
    }
  return n;
}
function qE(e, t) {
  if (!e) return "";
  const n = {
    messageId: t.messageId,
    isUser: !!t.isUser,
    isSystem: !!t.isSystem,
    isReasoning: !!t.isReasoning,
    characterName: t.characterName
  };
  let r = e;
  t.isSystem || (r = GE(r, n));
  const s = "QYDL", i = [];
  return t.isSystem || (r = r.replace(/<[^>]+>/g, (o) => o.replace(/"/g, () => (i.push('"'), `${s}${i.length - 1}${s}`)))), r = r.replace(/\\begin\{align\*\}/g, "$$").replace(/\\end\{align\*\}/g, "$$"), t.isSystem || (r = aE().makeHtml(r)), r = r.replace(/<code>([\s\S]*?)<\/code>/g, (o, c) => `<code>${c.replace(/&amp;/g, "&")}</code>`), t.isSystem || (r = r.replace(new RegExp(`${s}(\\d+)${s}`, "g"), (o, c) => i[Number(c)] ?? '"')), t.isSystem || (r = VE(r, n)), r = UE(r), r = BE(r), r = WE(r, { prefix: ".mes_text " }), r;
}
function YE({ avatarUrl: e, mesId: t, timer: n, tokenCount: r }) {
  return /* @__PURE__ */ a.jsxs("div", { className: "mesAvatarWrapper", children: [
    /* @__PURE__ */ a.jsx("div", { className: "avatar", children: e ? /* @__PURE__ */ a.jsx("img", { src: e, alt: "" }) : /* @__PURE__ */ a.jsx("div", { className: "avatar-placeholder" }) }),
    /* @__PURE__ */ a.jsx("div", { className: "mesIDDisplay", children: t }),
    typeof n == "number" && /* @__PURE__ */ a.jsxs("div", { className: "mes_timer", title: "Generation time (ms)", children: [
      n,
      "ms"
    ] }),
    typeof r == "number" && /* @__PURE__ */ a.jsxs("div", { className: "tokenCounterDisplay", title: "Token count", children: [
      r,
      "t"
    ] })
  ] });
}
function QE(e) {
  const [t, n] = P.useState(!1);
  return /* @__PURE__ */ a.jsxs("div", { className: "mes_buttons", children: [
    /* @__PURE__ */ a.jsx(
      "button",
      {
        className: "mes_button extraMesButtonsHint",
        type: "button",
        "aria-label": "More actions",
        title: "Message Actions",
        onClick: () => n((r) => !r),
        children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-ellipsis" })
      }
    ),
    /* @__PURE__ */ a.jsxs("div", { className: `extraMesButtons ${t ? "open" : ""}`, hidden: !t, children: [
      /* @__PURE__ */ a.jsx("button", { className: "mes_button mes_translate", type: "button", onClick: e.onTranslate, "aria-label": "Translate", title: "Translate message", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-language" }) }),
      /* @__PURE__ */ a.jsx("button", { className: "mes_button mes_narrate", type: "button", onClick: e.onNarrate, "aria-label": "Narrate", title: "Narrate", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-bullhorn" }) }),
      /* @__PURE__ */ a.jsx("button", { className: "mes_button mes_hide", type: "button", onClick: e.onHide, "aria-label": "Hide", title: "Exclude message from prompts", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-eye" }) }),
      /* @__PURE__ */ a.jsx("button", { className: "mes_button mes_unhide", type: "button", onClick: e.onUnhide, "aria-label": "Unhide", title: "Include message in prompts", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-eye-slash" }) }),
      /* @__PURE__ */ a.jsx("button", { className: "mes_button mes_create_branch", type: "button", onClick: e.onBranch, "aria-label": "Branch", title: "Create branch", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-code-branch" }) }),
      /* @__PURE__ */ a.jsx("button", { className: "mes_button mes_create_bookmark", type: "button", onClick: e.onCheckpoint, "aria-label": "Checkpoint", title: "Create checkpoint", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-flag-checkered" }) }),
      /* @__PURE__ */ a.jsx("button", { className: "mes_button mes_copy", type: "button", onClick: e.onCopy, "aria-label": "Copy", title: "Copy message", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-copy" }) })
    ] }),
    /* @__PURE__ */ a.jsx(
      "button",
      {
        className: "mes_button mes_bookmark",
        type: "button",
        "aria-label": "Open checkpoint",
        title: "Open checkpoint chat",
        onClick: e.onCheckpoint,
        children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-flag" })
      }
    ),
    /* @__PURE__ */ a.jsx("button", { className: "mes_button mes_edit", type: "button", onClick: e.onEdit, "aria-label": "Edit", title: "Edit", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-pencil" }) }),
    /* @__PURE__ */ a.jsx("span", { className: "mes_buttons_extra", "data-extension-mount-slot": !0 })
  ] });
}
function XE(e) {
  return /* @__PURE__ */ a.jsxs("div", { className: "mes_edit_buttons", children: [
    /* @__PURE__ */ a.jsx("button", { className: "mes_edit_done menu_button", type: "button", onClick: () => e.onDone?.(), "aria-label": "Done", title: "Confirm", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-check" }) }),
    /* @__PURE__ */ a.jsx("button", { className: "mes_edit_copy menu_button", type: "button", onClick: e.onCopy, "aria-label": "Copy", title: "Copy this message", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-copy" }) }),
    /* @__PURE__ */ a.jsx("button", { className: "mes_edit_delete menu_button", type: "button", onClick: e.onDelete, "aria-label": "Delete", title: "Delete this message", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-trash-can" }) }),
    /* @__PURE__ */ a.jsx("button", { className: "mes_edit_up menu_button", type: "button", onClick: e.onMoveUp, "aria-label": "Move up", title: "Move message up", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-chevron-up" }) }),
    /* @__PURE__ */ a.jsx("button", { className: "mes_edit_down menu_button", type: "button", onClick: e.onMoveDown, "aria-label": "Move down", title: "Move message down", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-chevron-down" }) }),
    /* @__PURE__ */ a.jsx("button", { className: "mes_edit_cancel menu_button", type: "button", onClick: e.onCancel, "aria-label": "Cancel", title: "Cancel", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-xmark" }) })
  ] });
}
function ZE({ current: e, total: t, onRight: n }) {
  return /* @__PURE__ */ a.jsxs("div", { className: "swipeRightBlock", children: [
    /* @__PURE__ */ a.jsx(
      "button",
      {
        className: "swipe_right",
        type: "button",
        "aria-label": "Next swipe",
        onClick: n,
        disabled: t === 0,
        children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-chevron-right" })
      }
    ),
    /* @__PURE__ */ a.jsx("div", { className: "swipes-counter", children: t > 0 ? `${e + 1}/${t}` : "" })
  ] });
}
function JE({ reasoning: e, onCopy: t, onEdit: n, onDelete: r, onCloseAll: s, defaultOpen: i }) {
  return /* @__PURE__ */ a.jsxs("details", { className: "mes_reasoning_details", open: i, children: [
    /* @__PURE__ */ a.jsxs("summary", { className: "mes_reasoning_summary", children: [
      /* @__PURE__ */ a.jsx("div", { className: "mes_reasoning_header_block", children: /* @__PURE__ */ a.jsxs("div", { className: "mes_reasoning_header", children: [
        /* @__PURE__ */ a.jsx("span", { className: "mes_reasoning_header_title", children: "Thought for some time" }),
        /* @__PURE__ */ a.jsx("i", { className: "mes_reasoning_arrow fa-solid fa-chevron-up" })
      ] }) }),
      /* @__PURE__ */ a.jsxs("div", { className: "mes_reasoning_actions", children: [
        s && /* @__PURE__ */ a.jsx("button", { className: "mes_reasoning_close_all mes_button", type: "button", onClick: s, "aria-label": "Collapse all reasoning blocks", title: "Collapse all reasoning blocks", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-minimize" }) }),
        t && /* @__PURE__ */ a.jsx("button", { className: "mes_reasoning_copy mes_button", type: "button", onClick: t, "aria-label": "Copy reasoning", title: "Copy reasoning", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-copy" }) }),
        n && /* @__PURE__ */ a.jsx("button", { className: "mes_reasoning_edit mes_button", type: "button", onClick: n, "aria-label": "Edit reasoning", title: "Edit reasoning", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-pencil" }) }),
        r && /* @__PURE__ */ a.jsx("button", { className: "mes_reasoning_delete mes_button", type: "button", onClick: r, "aria-label": "Delete reasoning", title: "Remove reasoning", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-trash-can" }) })
      ] })
    ] }),
    /* @__PURE__ */ a.jsx("div", { className: "mes_reasoning", children: e })
  ] });
}
function e3({ items: e }) {
  return /* @__PURE__ */ a.jsx("div", { className: "mes_media_wrapper", children: e.map((t, n) => t.kind === "image" ? /* @__PURE__ */ a.jsx("img", { src: t.url, alt: t.alt ?? "", className: "mes_media_image" }, n) : /* @__PURE__ */ a.jsxs("a", { href: t.url, className: "mes_media_file", target: "_blank", rel: "noreferrer", children: [
    /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-paperclip" }),
    " ",
    t.alt ?? t.url
  ] }, n)) });
}
function t3(e) {
  const { message: t, editing: n } = e, r = !!t.bookmarkLink, s = P.useRef(null), [i, o] = P.useState(t.text);
  P.useEffect(() => {
    n && o(t.text);
  }, [n, t.text]);
  const c = P.useMemo(() => ({
    messageId: t.mesId,
    isUser: t.isUser,
    isSystem: t.isSystem,
    isReasoning: !1,
    characterName: t.chName
  }), [t.mesId, t.isUser, t.isSystem, t.chName]), u = P.useMemo(
    () => qE(t.text ?? "", c),
    [t.text, c]
  );
  return P.useEffect(() => {
    if (!s.current || n) return;
    const p = KE(s.current, c);
    return () => {
      for (const h of p)
        try {
          h();
        } catch {
        }
    };
  }, [n, u, c]), /* @__PURE__ */ a.jsxs(
    "div",
    {
      className: `mes ${t.isUser ? "is-user" : ""} ${t.isSystem ? "is-system" : ""} ${r ? "has-bookmark" : ""} ${t.isError ? "is-error" : ""}`,
      "data-mesid": t.mesId,
      "data-is-user": t.isUser,
      "data-is-system": t.isSystem,
      "data-is-error": !!t.isError,
      "data-bookmark-link": t.bookmarkLink ?? "",
      children: [
        /* @__PURE__ */ a.jsx(
          YE,
          {
            avatarUrl: t.avatarUrl,
            mesId: t.mesId,
            timer: t.timer,
            tokenCount: t.tokenCount
          }
        ),
        /* @__PURE__ */ a.jsx(
          "button",
          {
            className: "swipe_left",
            type: "button",
            "aria-label": "Previous swipe",
            onClick: e.onSwipeLeft,
            disabled: !t.swipes || t.swipes.current === 0,
            children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-chevron-left" })
          }
        ),
        /* @__PURE__ */ a.jsxs("div", { className: "mes_block", children: [
          /* @__PURE__ */ a.jsxs("div", { className: "ch_name", children: [
            /* @__PURE__ */ a.jsx("div", { className: "flex-container", children: /* @__PURE__ */ a.jsxs("div", { className: "flex-container", children: [
              /* @__PURE__ */ a.jsx("span", { className: "name_text", children: t.chName }),
              /* @__PURE__ */ a.jsx("i", { className: "mes_ghost fa-solid fa-ghost", "aria-hidden": "true", title: "This message is invisible for the AI" }),
              /* @__PURE__ */ a.jsx("small", { className: "timestamp", children: t.timestamp })
            ] }) }),
            !n && /* @__PURE__ */ a.jsx(
              QE,
              {
                isUser: t.isUser,
                isSystem: t.isSystem,
                hasBookmark: r,
                onCopy: e.onCopy,
                onEdit: e.onEdit,
                onDelete: e.onDelete,
                onBranch: e.onBranch,
                onCheckpoint: e.onCheckpoint,
                onTranslate: e.onTranslate,
                onNarrate: e.onNarrate,
                onHide: e.onHide,
                onUnhide: e.onUnhide
              }
            ),
            n && /* @__PURE__ */ a.jsx(
              XE,
              {
                onDone: () => e.onEditDone?.(i),
                onCancel: e.onEditCancel,
                onCopy: e.onCopy,
                onDelete: e.onDelete,
                onMoveUp: e.onMoveUp,
                onMoveDown: e.onMoveDown
              }
            )
          ] }),
          t.reasoning && /* @__PURE__ */ a.jsx(
            JE,
            {
              reasoning: t.reasoning,
              onCopy: () => navigator.clipboard?.writeText(t.reasoning ?? "")
            }
          ),
          !n && /* @__PURE__ */ a.jsx(
            "div",
            {
              className: "mes_text",
              ref: s,
              dangerouslySetInnerHTML: { __html: u }
            }
          ),
          n && /* @__PURE__ */ a.jsx(
            "textarea",
            {
              className: "mes_edit_textarea",
              value: i,
              onChange: (p) => o(p.target.value),
              rows: Math.max(3, i.split(`
`).length),
              "data-testid": "mes-edit-textarea"
            }
          ),
          t.media && t.media.length > 0 && /* @__PURE__ */ a.jsx(e3, { items: t.media }),
          t.bias && /* @__PURE__ */ a.jsx("div", { className: "mes_bias", children: t.bias })
        ] }),
        /* @__PURE__ */ a.jsx(
          ZE,
          {
            current: t.swipes?.current ?? 0,
            total: t.swipes?.total ?? 0,
            onRight: e.onSwipeRight
          }
        )
      ]
    }
  );
}
function n3({
  version: e = "0.0.1-alpha",
  onOpenApiConnections: t,
  onOpenCharacters: n,
  onOpenExtensions: r,
  onTemporaryChat: s,
  onOpenChat: i,
  onPinChat: o,
  onRenameChat: c,
  onDeleteChat: u,
  recentChats: p = []
}) {
  const h = p.length > 0;
  return /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
    /* @__PURE__ */ a.jsxs("div", { className: "welcomePanel", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "welcomeHeaderTitle", children: [
        /* @__PURE__ */ a.jsx("div", { className: "welcomeHeaderLogo", "aria-label": "YdlTavern", children: /* @__PURE__ */ a.jsx("span", { className: "welcomeHeaderLogoText", children: "YdlTavern" }) }),
        /* @__PURE__ */ a.jsx("span", { className: "welcomeHeaderVersionDisplay", children: e }),
        /* @__PURE__ */ a.jsx("div", { className: "mes_button showRecentChats", title: "Show recent chats", "aria-hidden": "true", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-circle-chevron-down fa-fw fa-lg", "aria-hidden": "true" }) }),
        /* @__PURE__ */ a.jsx("div", { className: "mes_button recentChatsSettings", title: "Recent chats settings", "aria-hidden": "true", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-gear fa-fw fa-lg", "aria-hidden": "true" }) }),
        /* @__PURE__ */ a.jsx("div", { className: "mes_button hideRecentChats", title: "Hide recent chats", "aria-hidden": "true", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-circle-xmark fa-fw fa-lg", "aria-hidden": "true" }) })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "welcomeHeader", children: [
        /* @__PURE__ */ a.jsx("div", { className: "recentChatsTitle", children: "Recent Chats" }),
        /* @__PURE__ */ a.jsxs("div", { className: "welcomeShortcuts", children: [
          /* @__PURE__ */ a.jsxs(
            "a",
            {
              className: "welcomeShortcut",
              href: "https://docs.sillytavern.app/",
              target: "_blank",
              rel: "noreferrer",
              title: "SillyTavern Documentation",
              children: [
                /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-question-circle", "aria-hidden": "true" }),
                "Docs"
              ]
            }
          ),
          /* @__PURE__ */ a.jsxs(
            "a",
            {
              className: "welcomeShortcut",
              href: "https://github.com/Youzini-afk/Yggdrasil-Tavern",
              target: "_blank",
              rel: "noreferrer",
              title: "YdlTavern on GitHub",
              children: [
                /* @__PURE__ */ a.jsx("i", { className: "fa-brands fa-github", "aria-hidden": "true" }),
                "GitHub"
              ]
            }
          ),
          /* @__PURE__ */ a.jsxs(
            "a",
            {
              className: "welcomeShortcut",
              href: "https://discord.gg/sillytavern",
              target: "_blank",
              rel: "noreferrer",
              title: "SillyTavern Discord",
              children: [
                /* @__PURE__ */ a.jsx("i", { className: "fa-brands fa-discord", "aria-hidden": "true" }),
                "Discord"
              ]
            }
          ),
          /* @__PURE__ */ a.jsx("span", { className: "welcomeShortcutsSeparator", "aria-hidden": "true", children: "|" }),
          /* @__PURE__ */ a.jsxs(
            "button",
            {
              type: "button",
              className: "openTemporaryChat menu_button menu_button_icon",
              onClick: () => (s ?? n)?.(),
              title: "Start a temporary chat",
              children: [
                /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-comment-dots", "aria-hidden": "true" }),
                "Temporary Chat"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "welcomeRecent", children: /* @__PURE__ */ a.jsx("div", { className: `recentChatList${h ? "" : " recentChatList-empty"}`, children: h ? p.map((x) => /* @__PURE__ */ a.jsxs(
        "div",
        {
          className: "recentChat",
          "data-file": x.id,
          role: "button",
          tabIndex: 0,
          onClick: () => i?.(x.id),
          onKeyDown: (g) => {
            g.key !== "Enter" && g.key !== " " || (g.preventDefault(), i?.(x.id));
          },
          children: [
            /* @__PURE__ */ a.jsx("div", { className: "avatar", children: x.charAvatarUrl ? /* @__PURE__ */ a.jsx("img", { src: x.charAvatarUrl, alt: x.charName ?? x.title ?? x.id }) : /* @__PURE__ */ a.jsx("span", { className: "avatar-placeholder", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-user", "aria-hidden": "true" }) }) }),
            /* @__PURE__ */ a.jsxs("div", { className: "recentChatInfo", children: [
              /* @__PURE__ */ a.jsxs("div", { className: "chatNameContainer", children: [
                /* @__PURE__ */ a.jsxs("div", { className: "chatName", children: [
                  /* @__PURE__ */ a.jsx("strong", { className: "characterName", children: x.charName ?? "Assistant" }),
                  /* @__PURE__ */ a.jsx("span", { children: " – " }),
                  /* @__PURE__ */ a.jsx("span", { children: x.chatName ?? x.title ?? "Temporary Chat" })
                ] }),
                /* @__PURE__ */ a.jsx("small", { className: "chatDate", children: x.dateShort ?? x.updatedAt ?? "" }),
                /* @__PURE__ */ a.jsxs("div", { className: "chatActions", onClick: (g) => g.stopPropagation(), children: [
                  /* @__PURE__ */ a.jsx("button", { type: "button", className: "menu_button menu_button_icon pinChat", onClick: () => o?.(x.id), title: "Pin chat", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-thumbtack fa-fw", "aria-hidden": "true" }) }),
                  /* @__PURE__ */ a.jsx("button", { type: "button", className: "menu_button menu_button_icon renameChat", onClick: () => c?.(x.id), title: "Rename chat", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-pen-to-square fa-fw", "aria-hidden": "true" }) }),
                  /* @__PURE__ */ a.jsx("button", { type: "button", className: "menu_button menu_button_icon deleteChat", onClick: () => u?.(x.id), title: "Delete chat", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-trash fa-fw", "aria-hidden": "true" }) })
                ] })
              ] }),
              /* @__PURE__ */ a.jsxs("div", { className: "chatMessageContainer", children: [
                /* @__PURE__ */ a.jsx("div", { className: "chatMessage", children: x.lastMessage ?? "No messages yet." }),
                /* @__PURE__ */ a.jsxs("div", { className: "chatStats", children: [
                  /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-comment fa-xs", "aria-hidden": "true" }),
                  /* @__PURE__ */ a.jsx("small", { children: x.messageCount ?? 0 }),
                  x.fileSize !== void 0 && /* @__PURE__ */ a.jsx("small", { className: "fileSize", children: x.fileSize })
                ] })
              ] })
            ] })
          ]
        },
        x.id
      )) : /* @__PURE__ */ a.jsx("p", { className: "welcomeEmptyHint", children: "No recent chats yet. Pick a character to start, or import one." }) }) })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "mes mes_welcome_guide is-system", "data-is-system": "true", children: [
      /* @__PURE__ */ a.jsx("div", { className: "mesAvatarWrapper", children: /* @__PURE__ */ a.jsx("div", { className: "avatar", children: /* @__PURE__ */ a.jsx("span", { className: "avatar-placeholder", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-circle-info", "aria-hidden": "true" }) }) }) }),
      /* @__PURE__ */ a.jsxs("div", { className: "mes_block", children: [
        /* @__PURE__ */ a.jsx("div", { className: "ch_name", children: /* @__PURE__ */ a.jsx("span", { className: "name_text", children: "Welcome" }) }),
        /* @__PURE__ */ a.jsxs("div", { className: "mes_text", children: [
          /* @__PURE__ */ a.jsx("h3", { children: "How to start chatting?" }),
          /* @__PURE__ */ a.jsxs("ol", { children: [
            /* @__PURE__ */ a.jsxs("li", { children: [
              "Click",
              " ",
              /* @__PURE__ */ a.jsxs(
                "button",
                {
                  type: "button",
                  className: "menu_button menu_button_icon drawer-opener inline-flex",
                  "data-target": "api-connections",
                  onClick: () => t?.(),
                  children: [
                    /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-plug", "aria-hidden": "true" }),
                    " ",
                    "API Connections"
                  ]
                }
              ),
              " ",
              "and connect to a model provider."
            ] }),
            /* @__PURE__ */ a.jsxs("li", { children: [
              "Click",
              " ",
              /* @__PURE__ */ a.jsxs(
                "button",
                {
                  type: "button",
                  className: "menu_button menu_button_icon drawer-opener inline-flex",
                  "data-target": "characters",
                  onClick: () => n?.(),
                  children: [
                    /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-address-card", "aria-hidden": "true" }),
                    " ",
                    "Character Management"
                  ]
                }
              ),
              " ",
              "and pick or import a character."
            ] }),
            /* @__PURE__ */ a.jsxs("li", { children: [
              "(Optional) Click",
              " ",
              /* @__PURE__ */ a.jsxs(
                "button",
                {
                  type: "button",
                  className: "menu_button menu_button_icon drawer-opener inline-flex",
                  "data-target": "extensions",
                  onClick: () => r?.(),
                  children: [
                    /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-cubes", "aria-hidden": "true" }),
                    " ",
                    "Extensions"
                  ]
                }
              ),
              " ",
              "to enable World Info, Quick Replies, and other tools."
            ] })
          ] }),
          /* @__PURE__ */ a.jsx("p", { className: "welcomeCompatNote", children: "Compatible with SillyTavern resources" }),
          /* @__PURE__ */ a.jsxs("ul", { className: "welcomeCompatList", children: [
            /* @__PURE__ */ a.jsx("li", { children: "Character cards (V1/V2/V3 PNG and JSON)" }),
            /* @__PURE__ */ a.jsx("li", { children: "World Info / Lorebooks" }),
            /* @__PURE__ */ a.jsx("li", { children: "Presets and instruct templates" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const r3 = {
  user: "User",
  assistant: "Assistant",
  system: "System",
  tool: "Tool"
}, s3 = 120;
function nh(e, t, n = s3) {
  const r = t ?? e;
  if (!r) return !0;
  const s = r.scrollTop ?? 0, i = r.scrollHeight ?? 0, o = r.clientHeight ?? 0;
  return i <= o ? !0 : i - s - o <= n;
}
function a3({
  onOpenApiConnections: e,
  onOpenCharacters: t,
  onOpenExtensions: n
} = {}) {
  const s = ft().liveChat.turns;
  return s.length === 0 ? /* @__PURE__ */ a.jsx(
    "div",
    {
      id: "chat",
      className: "ydltavern-message-list ydltavern-message-list-empty",
      children: /* @__PURE__ */ a.jsx(
        n3,
        {
          version: "0.0.1-alpha",
          recentChats: [],
          onOpenApiConnections: e ?? (() => {
          }),
          onOpenCharacters: t ?? (() => {
          }),
          onOpenExtensions: n ?? (() => {
          })
        }
      )
    }
  ) : /* @__PURE__ */ a.jsx(i3, { turns: s });
}
function i3({ turns: e }) {
  const t = ft(), [n, r] = P.useState(null), [s, i] = P.useState(!1), o = P.useRef(null), c = P.useRef(null), u = P.useRef(null), p = P.useRef(t.isGenerating), h = P.useRef(!0);
  P.useEffect(() => {
    const w = c.current;
    if (!w) return;
    const E = w.querySelector('.ydltavern-message-list-virtuoso [data-testid="virtuoso-scroller"]') ?? w.querySelector("[data-virtuoso-scroller]") ?? w.querySelector(".ydltavern-message-list-virtuoso");
    E && (u.current = E);
  }, []);
  const x = P.useCallback(() => {
    const w = nh(c.current, u.current);
    h.current = w, i(!w);
  }, []);
  P.useEffect(() => {
    const w = u.current ?? c.current;
    if (w)
      return w.addEventListener("scroll", x, { passive: !0 }), () => w.removeEventListener("scroll", x);
  }, [x]), P.useEffect(() => {
    const w = t.isGenerating;
    w && !p.current ? (h.current = nh(c.current, u.current), h.current ? o.current?.scrollToIndex({ index: e.length - 1, behavior: "smooth", align: "end" }) : i(!0)) : w && h.current ? o.current?.scrollToIndex({ index: e.length - 1, behavior: "auto", align: "end" }) : !w && p.current && (h.current && o.current?.scrollToIndex({ index: e.length - 1, behavior: "smooth", align: "end" }), i(!1)), p.current = w;
  }, [t.isGenerating, e.length]);
  const g = P.useCallback((w) => {
    const E = e[w];
    if (E === void 0) return /* @__PURE__ */ a.jsx("div", {});
    const I = fd(E), D = I?.subs ?? [], y = E.role === "user", b = E.role === "system", N = t.personas.find((L) => L.id === t.activePersonaId), l = t.characters.find((L) => L.id === t.activeCharacterId), d = D.filter((L) => L.kind === "text").map((L) => L.text).join(`
`), f = D.filter((L) => L.kind === "thinking").map((L) => L.text), m = f.length > 0 ? f.join(`
`) : void 0, v = l3(D), k = E.variants.length, S = t.liveMessages[w], C = !y && !b && S?.extra?.ydl_error === !0;
    return /* @__PURE__ */ a.jsx(
      t3,
      {
        message: {
          mesId: E.id,
          chName: E.speaker?.name ?? (y ? N?.name : l?.name) ?? r3[E.role],
          isUser: y,
          isSystem: b,
          avatarUrl: o3(E, y ? N?.avatarUrl : l?.avatarUrl),
          text: d,
          reasoning: m,
          timestamp: c3(I?.created_at ?? E.created_at),
          tokenCount: I?.meta.tokens,
          timer: I?.meta.latency_ms,
          media: v.length > 0 ? v : void 0,
          swipes: k > 0 ? { current: E.active_variant, total: k } : { current: 0, total: 0 },
          isError: C
        },
        editing: n === E.id,
        onSwipeLeft: () => t.swipeLeft(E.id),
        onSwipeRight: () => t.swipeRight(E.id),
        onEdit: () => r(E.id),
        onEditDone: (L) => {
          t.editMessage(E.id, L), r(null);
        },
        onEditCancel: () => r(null),
        onDelete: () => t.deleteMessage(E.id),
        onCopy: () => t.copyMessage(E.id),
        onBranch: () => t.branchMessage(E.id),
        onCheckpoint: () => t.checkpointMessage(E.id),
        onHide: () => t.hideMessage(E.id),
        onUnhide: () => t.unhideMessage(E.id),
        onMoveUp: () => t.moveMessage(E.id, "up"),
        onMoveDown: () => t.moveMessage(E.id, "down")
      }
    );
  }, [n, t, e]);
  return /* @__PURE__ */ a.jsxs("div", { id: "chat", className: "ydltavern-message-list", ref: c, children: [
    /* @__PURE__ */ a.jsx(
      Y_,
      {
        ref: o,
        className: "ydltavern-message-list-virtuoso",
        totalCount: e.length,
        itemContent: g,
        followOutput: !1,
        overscan: { main: 200, reverse: 200 }
      }
    ),
    s && /* @__PURE__ */ a.jsxs(
      "button",
      {
        type: "button",
        className: "ydl-jump-to-latest",
        onClick: () => {
          o.current?.scrollToIndex({ index: e.length - 1, behavior: "smooth", align: "end" }), i(!1), h.current = !0;
        },
        "aria-label": "Jump to latest message",
        children: [
          /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-arrow-down", "aria-hidden": "true" }),
          " Jump to latest"
        ]
      }
    )
  ] });
}
function o3(e, t) {
  const n = e.speaker?.avatar;
  return Ao(n) ?? t;
}
function l3(e) {
  const t = [];
  for (const n of e) {
    if (n.kind === "image") {
      const r = Ao(n.image_ref);
      r !== void 0 && t.push({ kind: "image", url: r, alt: n.alt ?? n.prompt });
    }
    if (n.kind === "attachment") {
      const r = Ao(n.attachment_ref.asset);
      r !== void 0 && t.push({ kind: "file", url: r, alt: n.attachment_ref.label });
    }
    if (n.kind === "file_embed") {
      const r = Ao(n.file_ref);
      r !== void 0 && t.push({ kind: "file", url: r, alt: n.file_ref.original_path ?? n.file_ref.id });
    }
  }
  return t;
}
function Ao(e) {
  if (e !== void 0) {
    if (e.original_path !== void 0 && /^(blob:|data:|https?:\/\/|\/)/u.test(e.original_path))
      return e.original_path;
    if (typeof e.metadata?.url == "string") return e.metadata.url;
  }
}
function c3(e) {
  return new Date(e).toLocaleString();
}
function u3({ sets: e, onTrigger: t }) {
  const n = e.filter((r) => r.enabled && r.items.length > 0);
  return n.length === 0 ? null : /* @__PURE__ */ a.jsx("section", { className: "tavern-quick-reply-bar", children: n.map((r) => /* @__PURE__ */ a.jsxs("div", { className: "qr-set", "data-set-id": r.id, children: [
    r.name !== r.id ? /* @__PURE__ */ a.jsx("span", { className: "qr-set-label", children: r.name }) : null,
    /* @__PURE__ */ a.jsx("div", { className: "qr-items", role: "group", "aria-label": r.name, children: r.items.map((s) => /* @__PURE__ */ a.jsx(
      "button",
      {
        type: "button",
        className: "qr-button",
        onClick: () => t(s.id),
        title: s.label,
        children: s.label
      },
      s.id
    )) })
  ] }, r.id)) });
}
function d3(e) {
  return {
    "--tavern-bg-primary": e.tokens.bgPrimary,
    "--tavern-bg-secondary": e.tokens.bgSecondary,
    "--tavern-bg-tertiary": e.tokens.bgTertiary,
    "--tavern-fg-primary": e.tokens.fgPrimary,
    "--tavern-fg-secondary": e.tokens.fgSecondary,
    "--tavern-fg-muted": e.tokens.fgMuted,
    "--tavern-accent-primary": e.tokens.accentPrimary,
    "--tavern-accent-hover": e.tokens.accentHover,
    "--tavern-user-bubble": e.tokens.userBubble,
    "--tavern-assistant-bubble": e.tokens.assistantBubble,
    "--tavern-system-bubble": e.tokens.systemBubble,
    "--tavern-border": e.tokens.border,
    "--tavern-shadow": e.tokens.shadow,
    "--tavern-font-family": e.font.family,
    "--tavern-font-size-base": e.font.sizeBase,
    "--tavern-font-size-sm": e.font.sizeSm,
    "--tavern-font-size-lg": e.font.sizeLg,
    "--tavern-density": e.density,
    // ST-aligned tokens (maps from optional fields)
    "--tavern-body-color": e.tokens.bodyColor ?? e.tokens.fgPrimary,
    "--tavern-em-color": e.tokens.emColor ?? e.tokens.fgSecondary,
    "--tavern-underline-color": e.tokens.underlineColor ?? e.tokens.fgSecondary,
    "--tavern-quote-color": e.tokens.quoteColor ?? e.tokens.accentPrimary,
    "--tavern-blur-tint-color": e.tokens.blurTint ?? e.tokens.bgPrimary,
    "--tavern-chat-tint-color": e.tokens.chatTint ?? e.tokens.bgSecondary,
    "--tavern-user-mes-tint": e.tokens.userMesTint ?? e.tokens.userBubble,
    "--tavern-bot-mes-tint": e.tokens.botMesTint ?? e.tokens.assistantBubble,
    "--tavern-shadow-color": e.tokens.shadowColor ?? e.tokens.shadow,
    "--tavern-border-color": e.tokens.borderColor ?? e.tokens.border,
    "--tavern-blur-strength": e.tokens.blurStrength != null ? `${e.tokens.blurStrength}px` : "10px",
    "--tavern-font-scale": e.tokens.fontScale != null ? String(e.tokens.fontScale) : "1"
  };
}
function ny({ theme: e, children: t }) {
  const n = P.useMemo(() => d3(e), [e]);
  return /* @__PURE__ */ a.jsx("div", { className: "tavern-themed-root", style: n, children: t });
}
const f3 = [
  { id: "ai-config", icon: "fa-sliders", label: "AI Response Configuration" },
  { id: "api-connections", icon: "fa-plug", label: "API Connections" },
  { id: "advanced-formatting", icon: "fa-font", label: "Advanced Formatting" },
  { id: "world-info", icon: "fa-book-atlas", label: "World Info / Lorebook" },
  { id: "user-settings", icon: "fa-user-cog", label: "User Settings" },
  { id: "backgrounds", icon: "fa-panorama", label: "Backgrounds" },
  { id: "extensions", icon: "fa-cubes", label: "Extensions" },
  { id: "persona", icon: "fa-face-smile", label: "Persona Management" },
  { id: "characters", icon: "fa-address-card", label: "Character Management" }
];
function p3({ drawers: e }) {
  return /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
    /* @__PURE__ */ a.jsx("div", { className: "top-settings-holder", role: "toolbar", "aria-label": "Tavern top bar", children: f3.map((t) => /* @__PURE__ */ a.jsx(
      "button",
      {
        type: "button",
        className: `drawer-icon ${e.openId === t.id ? "open" : ""}`,
        onClick: () => e.toggle(t.id),
        "aria-label": t.label,
        "aria-pressed": e.openId === t.id,
        children: /* @__PURE__ */ a.jsx("i", { className: `fa-solid ${t.icon}`, "aria-hidden": "true" })
      },
      t.id
    )) }),
    /* @__PURE__ */ a.jsx("div", { id: "extensionsMenu", "data-extension-territory": !0 })
  ] });
}
function m3({ children: e }) {
  return /* @__PURE__ */ a.jsx("main", { id: "sheld", className: "sheld", role: "main", children: e });
}
function ry() {
  const [e, t] = P.useState(null), n = P.useCallback((i) => t(i), []), r = P.useCallback(() => t(null), []), s = P.useCallback(
    (i) => t((o) => o === i ? null : i),
    []
  );
  return { openId: e, open: n, close: r, toggle: s };
}
function or({ id: e, drawers: t, side: n, title: r, children: s }) {
  const i = t.openId === e, o = J.useRef(!1);
  i && (o.current = !0);
  const c = o.current;
  return /* @__PURE__ */ a.jsxs(
    "aside",
    {
      className: `drawer-content drawer-${n} ${i ? "openDrawer" : ""}`,
      "data-drawer-id": e,
      "aria-hidden": !i,
      "aria-labelledby": `drawer-title-${e}`,
      children: [
        /* @__PURE__ */ a.jsxs("header", { className: "drawer-header", children: [
          /* @__PURE__ */ a.jsx("h2", { id: `drawer-title-${e}`, className: "drawer-title", children: r }),
          /* @__PURE__ */ a.jsx(
            "button",
            {
              type: "button",
              className: "drawer-close",
              onClick: t.close,
              "aria-label": "Close drawer",
              children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-xmark", "aria-hidden": "true" })
            }
          )
        ] }),
        /* @__PURE__ */ a.jsx("div", { className: "drawer-body", hidden: !i, "aria-hidden": !i, children: c ? s : null })
      ]
    }
  );
}
const h3 = {
  temperature: 0.8,
  topP: 0.9,
  topK: 40,
  frequencyPenalty: 0,
  presencePenalty: 0,
  maxTokens: 2048
};
function fo({
  label: e,
  value: t,
  min: n,
  max: r,
  step: s,
  onChange: i,
  onCommit: o
}) {
  return /* @__PURE__ */ a.jsxs("label", { className: "settings-field", children: [
    /* @__PURE__ */ a.jsxs("span", { className: "settings-label", children: [
      e,
      /* @__PURE__ */ a.jsx("span", { className: "settings-value-indicator", children: t.toFixed(s < 0.1 ? 2 : 1) })
    ] }),
    /* @__PURE__ */ a.jsx(
      "input",
      {
        className: "settings-slider",
        type: "range",
        min: n,
        max: r,
        step: s,
        value: t,
        onChange: (c) => i(Number.parseFloat(c.target.value)),
        onMouseUp: o,
        onTouchEnd: o
      }
    )
  ] });
}
function sy({ settings: e, onChange: t }) {
  const [n, r] = P.useState(e), s = P.useCallback(() => {
    t(n);
  }, [n, t]), i = P.useCallback((o, c) => {
    r((u) => ({ ...u, [o]: c }));
  }, []);
  return /* @__PURE__ */ a.jsxs("section", { className: "settings-form-section", children: [
    /* @__PURE__ */ a.jsx("h3", { className: "settings-form-title", children: "Sampler" }),
    /* @__PURE__ */ a.jsxs("div", { className: "settings-form-sliders", children: [
      /* @__PURE__ */ a.jsx(
        fo,
        {
          label: "Temperature",
          value: n.temperature,
          min: 0,
          max: 2,
          step: 0.01,
          onChange: (o) => i("temperature", o),
          onCommit: s
        }
      ),
      /* @__PURE__ */ a.jsx(
        fo,
        {
          label: "Top P",
          value: n.topP,
          min: 0,
          max: 1,
          step: 0.01,
          onChange: (o) => i("topP", o),
          onCommit: s
        }
      ),
      /* @__PURE__ */ a.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ a.jsx("span", { className: "settings-label", children: "Top K" }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            className: "settings-input",
            type: "number",
            min: 0,
            max: 500,
            value: n.topK,
            onChange: (o) => i("topK", Number.parseInt(o.target.value, 10) || 0),
            onBlur: s
          }
        )
      ] }),
      /* @__PURE__ */ a.jsx(
        fo,
        {
          label: "Frequency Penalty",
          value: n.frequencyPenalty,
          min: -2,
          max: 2,
          step: 0.01,
          onChange: (o) => i("frequencyPenalty", o),
          onCommit: s
        }
      ),
      /* @__PURE__ */ a.jsx(
        fo,
        {
          label: "Presence Penalty",
          value: n.presencePenalty,
          min: -2,
          max: 2,
          step: 0.01,
          onChange: (o) => i("presencePenalty", o),
          onCommit: s
        }
      ),
      /* @__PURE__ */ a.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ a.jsx("span", { className: "settings-label", children: "Max Tokens" }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            className: "settings-input",
            type: "number",
            min: 1,
            max: 131072,
            step: 1,
            value: n.maxTokens,
            onChange: (o) => i("maxTokens", Number.parseInt(o.target.value, 10) || 2048),
            onBlur: s
          }
        )
      ] })
    ] })
  ] });
}
function ay({ drawers: e }) {
  const t = ft();
  return /* @__PURE__ */ a.jsxs(or, { id: "ai-config", drawers: e, side: "left", title: "AI Response Configuration", children: [
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ a.jsx("h3", { children: "Preset" }) }),
      /* @__PURE__ */ a.jsxs("div", { className: "range-block", children: [
        /* @__PURE__ */ a.jsxs("label", { className: "checkbox_label", children: [
          /* @__PURE__ */ a.jsx("span", { children: "Active preset:" }),
          /* @__PURE__ */ a.jsxs(
            "select",
            {
              className: "text_pole",
              value: t.settings.activePreset,
              onChange: (n) => t.setActivePreset(n.target.value),
              children: [
                /* @__PURE__ */ a.jsx("option", { value: "default", children: "Default" }),
                /* @__PURE__ */ a.jsx("option", { value: "creative", children: "Creative" }),
                /* @__PURE__ */ a.jsx("option", { value: "precise", children: "Precise" }),
                /* @__PURE__ */ a.jsx("option", { value: "custom", children: "Custom..." })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "preset-actions", children: [
          /* @__PURE__ */ a.jsxs("button", { type: "button", className: "menu_button", "aria-label": "Save preset", children: [
            /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-save" }),
            " Save"
          ] }),
          /* @__PURE__ */ a.jsxs("button", { type: "button", className: "menu_button", "aria-label": "Import preset", children: [
            /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-file-import" }),
            " Import"
          ] }),
          /* @__PURE__ */ a.jsxs("button", { type: "button", className: "menu_button", "aria-label": "Export preset", children: [
            /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-file-export" }),
            " Export"
          ] }),
          /* @__PURE__ */ a.jsxs("button", { type: "button", className: "menu_button danger", "aria-label": "Delete preset", children: [
            /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-trash" }),
            " Delete"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ a.jsx("h3", { children: "Sampler" }) }),
      /* @__PURE__ */ a.jsx(
        sy,
        {
          settings: t.samplerSettings,
          onChange: (n) => t.updateSamplerSettings(n)
        }
      )
    ] }),
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ a.jsx("h3", { children: "Streaming" }) }),
      /* @__PURE__ */ a.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "checkbox",
            checked: t.settings?.streaming ?? !0,
            onChange: (n) => {
              t.updateSettings({ streaming: n.target.checked });
            }
          }
        ),
        /* @__PURE__ */ a.jsx("span", { children: "Enable streaming responses" })
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ a.jsx("h3", { children: "Banned Tokens" }),
        /* @__PURE__ */ a.jsx("small", { children: "One per line. Tokens listed here will be excluded from generation." })
      ] }),
      /* @__PURE__ */ a.jsx(
        "textarea",
        {
          className: "textarea_compact",
          rows: 3,
          placeholder: `banned_token_1
banned_token_2`,
          "aria-label": "Banned tokens",
          value: t.settings?.bannedTokens ?? "",
          onChange: (n) => {
            t.updateSettings({ bannedTokens: n.target.value });
          }
        }
      )
    ] }),
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ a.jsx("h3", { children: "Logit Bias" }),
        /* @__PURE__ */ a.jsx("small", { children: 'Token:bias pairs (e.g., "the:-100"). Empty for none.' })
      ] }),
      /* @__PURE__ */ a.jsx(
        "textarea",
        {
          className: "textarea_compact",
          rows: 3,
          placeholder: `token1:-50
token2:100`,
          "aria-label": "Logit bias",
          value: t.settings?.logitBias ?? "",
          onChange: (n) => {
            t.updateSettings({ logitBias: n.target.value });
          }
        }
      )
    ] })
  ] });
}
const g3 = {
  provider: "openai",
  model: "gpt-4o-mini",
  secretRef: "secret_ref:store:OPENAI_API_KEY",
  apiBaseUrl: "",
  stream: !0
}, v3 = [
  "openai",
  "deepseek",
  "anthropic",
  "openrouter",
  "custom"
], rh = /* @__PURE__ */ new Set(["openai", "deepseek", "anthropic", "openrouter"]);
function iy({ settings: e, onChange: t }) {
  const [n, r] = P.useState(e), [s, i] = P.useState(), o = P.useCallback((g = n) => {
    const w = _o(g.secretRef);
    i(w), w === void 0 && t(g);
  }, [n, t]), c = P.useCallback(() => {
    o();
  }, [o]), u = P.useCallback((g, w) => {
    r((E) => ({ ...E, [g]: w }));
  }, []), p = P.useCallback((g) => (w) => {
    const E = w.target.type === "checkbox" ? w.target.checked : w.target.value;
    g === "secretRef" && i(_o(String(E))), u(g, E);
  }, [u]), h = P.useCallback((g) => {
    const w = { ...n, secretRef: g.target.value };
    r(w), i(_o(w.secretRef));
  }, [n]), x = P.useCallback((g) => {
    const w = { ...n, secretRef: g.target.value };
    r(w), o(w);
  }, [n, o]);
  return /* @__PURE__ */ a.jsxs("section", { className: "settings-form-section", children: [
    /* @__PURE__ */ a.jsx("h3", { className: "settings-form-title", children: "Connection" }),
    /* @__PURE__ */ a.jsxs("div", { className: "settings-form-grid", children: [
      /* @__PURE__ */ a.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ a.jsx("span", { className: "settings-label", children: "Provider" }),
        /* @__PURE__ */ a.jsx(
          "select",
          {
            className: "settings-input",
            value: n.provider,
            onChange: p("provider"),
            onBlur: c,
            children: v3.map((g) => /* @__PURE__ */ a.jsxs("option", { value: g, disabled: !rh.has(g), children: [
              g,
              rh.has(g) ? "" : " (unsupported)"
            ] }, g))
          }
        )
      ] }),
      /* @__PURE__ */ a.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ a.jsx("span", { className: "settings-label", children: "Model" }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            className: "settings-input",
            type: "text",
            value: n.model,
            onChange: p("model"),
            onBlur: c,
            placeholder: "gpt-4o-mini"
          }
        )
      ] }),
      /* @__PURE__ */ a.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ a.jsx("span", { className: "settings-label", children: "Secret Ref" }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            className: `settings-input${s ? " settings-input-error" : ""}`,
            type: "text",
            value: n.secretRef,
            onChange: h,
            onBlur: x,
            placeholder: "secret_ref:store:OPENAI_API_KEY"
          }
        ),
        s !== void 0 ? /* @__PURE__ */ a.jsx("span", { className: "settings-field-error", children: s }) : null
      ] }),
      /* @__PURE__ */ a.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ a.jsx("span", { className: "settings-label", children: "API Base URL (not used for live calls)" }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            className: "settings-input",
            type: "text",
            value: n.apiBaseUrl,
            onChange: p("apiBaseUrl"),
            onBlur: c,
            placeholder: "https://api.openai.com/v1"
          }
        ),
        /* @__PURE__ */ a.jsx("span", { className: "settings-help-text", children: "Live provider calls use fixed engine host mappings; this does not override outbound host." })
      ] }),
      /* @__PURE__ */ a.jsxs("label", { className: "settings-field settings-field-row", children: [
        /* @__PURE__ */ a.jsx("span", { className: "settings-label", children: "Stream" }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            className: "settings-checkbox",
            type: "checkbox",
            checked: n.stream,
            onChange: p("stream"),
            onBlur: c
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ a.jsx("div", { className: "settings-form-actions", children: /* @__PURE__ */ a.jsx(
      "button",
      {
        type: "button",
        className: "settings-button",
        disabled: !0,
        title: "Save a profile, then send a message to verify the connection through Yggdrasil.",
        children: "Test after save"
      }
    ) })
  ] });
}
const _3 = [
  {
    label: "Chat completion",
    providers: [
      { value: "openai", label: "OpenAI", requires: ["baseURL", "apiKey", "model"] },
      { value: "anthropic", label: "Anthropic Claude", requires: ["apiKey", "model"] },
      { value: "gemini", label: "Google Gemini", requires: ["apiKey", "model"] },
      { value: "mistral", label: "Mistral", requires: ["apiKey", "model"] },
      { value: "deepseek", label: "DeepSeek", requires: ["apiKey", "model"] },
      { value: "openrouter", label: "OpenRouter", requires: ["apiKey", "model"] },
      { value: "cohere", label: "Cohere", requires: ["apiKey", "model"] },
      { value: "groq", label: "Groq", requires: ["apiKey", "model"] },
      { value: "custom-openai", label: "Custom (OpenAI-compatible)", requires: ["baseURL", "apiKey", "model"] }
    ]
  },
  {
    label: "Text completion",
    providers: [
      { value: "kobold", label: "KoboldAI Classic", requires: ["baseURL"] },
      { value: "koboldcpp", label: "KoboldCPP", requires: ["baseURL"] },
      { value: "textgen-webui", label: "TextGen WebUI", requires: ["baseURL"] },
      { value: "ollama", label: "Ollama", requires: ["baseURL", "model"] },
      { value: "llama-cpp", label: "Llama.cpp Server", requires: ["baseURL"] },
      { value: "horde", label: "AI Horde", requires: ["apiKey", "model"] },
      { value: "novelai", label: "NovelAI", requires: ["apiKey", "model"] },
      { value: "mancer", label: "Mancer", requires: ["apiKey", "baseURL"] },
      { value: "aphrodite", label: "Aphrodite", requires: ["baseURL"] },
      { value: "tabbyapi", label: "TabbyAPI", requires: ["baseURL", "apiKey"] }
    ]
  }
], Dc = /* @__PURE__ */ new Set(["openai", "anthropic", "deepseek", "openrouter"]);
function y3({ drawers: e }) {
  const t = ft(), [n, r] = P.useState(""), s = {
    provider: t.connectionSettings.provider,
    model: t.connectionSettings.model,
    secretRef: t.connectionSettings.secretRef ?? "",
    apiBaseUrl: t.connectionSettings.baseUrl ?? "",
    stream: t.settings.streaming
  }, i = (o) => {
    _o(o.secretRef) === void 0 && (t.updateConnectionSettings({
      provider: o.provider,
      model: o.model,
      secretRef: o.secretRef,
      baseUrl: o.apiBaseUrl
    }), t.updateSettings({ streaming: o.stream }));
  };
  return /* @__PURE__ */ a.jsxs(or, { id: "api-connections", drawers: e, side: "left", title: "API Connections", children: [
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ a.jsx("h3", { children: "Provider" }),
        /* @__PURE__ */ a.jsx("small", { children: "All connections route through Yggdrasil's outbound substrate. Secrets use secret_ref only." })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsx("span", { children: "Active provider:" }),
        /* @__PURE__ */ a.jsx(
          "select",
          {
            className: "text_pole",
            value: t.connectionSettings.provider,
            onChange: (o) => {
              Dc.has(o.target.value) && t.updateConnectionSettings({ provider: o.target.value });
            },
            children: _3.map((o) => /* @__PURE__ */ a.jsx("optgroup", { label: o.label, children: o.providers.map((c) => /* @__PURE__ */ a.jsxs("option", { value: c.value, disabled: !Dc.has(c.value), children: [
              c.label,
              Dc.has(c.value) ? "" : " (unsupported)"
            ] }, c.value)) }, o.label))
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ a.jsx("h3", { children: "Configuration" }) }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsx("span", { children: "Saved profile:" }),
        /* @__PURE__ */ a.jsxs(
          "select",
          {
            className: "text_pole",
            value: t.activeConnectionProfile ?? "",
            onChange: (o) => {
              o.target.value && t.loadConnectionProfile(o.target.value);
            },
            children: [
              /* @__PURE__ */ a.jsx("option", { value: "", children: "— Pick a profile —" }),
              Object.keys(t.connectionProfiles).map((o) => /* @__PURE__ */ a.jsx("option", { value: o, children: o }, o))
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ a.jsx(
        iy,
        {
          settings: s,
          onChange: i
        },
        `${t.activeConnectionProfile ?? "current"}:${t.connectionSettings.provider}:${t.connectionSettings.model}`
      ),
      /* @__PURE__ */ a.jsx("p", { className: "settings-help-text", children: "Custom API base URLs are stored for profile metadata only and are not used for live provider calls." })
    ] }),
    /* @__PURE__ */ a.jsx(
      x3,
      {
        provider: t.connectionSettings.provider,
        currentSecretRef: t.connectionSettings.secretRef ?? "",
        projectId: t.projectId,
        onSecretRefChange: (o) => {
          const c = Sd(o);
          c !== void 0 && t.updateConnectionSettings({ secretRef: c });
        }
      }
    ),
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ a.jsx("h3", { children: "Connection profiles" }),
        /* @__PURE__ */ a.jsx("small", { children: "Save and switch between named connection profiles." })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsx("span", { children: "Profile name:" }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "text",
            className: "text_pole",
            value: n,
            onChange: (o) => r(o.target.value),
            placeholder: "My OpenAI Profile"
          }
        )
      ] }) }),
      /* @__PURE__ */ a.jsxs("div", { className: "preset-actions", children: [
        /* @__PURE__ */ a.jsxs(
          "button",
          {
            type: "button",
            className: "menu_button",
            "aria-label": "Save connection profile",
            onClick: () => {
              t.saveConnectionProfile(n), r("");
            },
            disabled: n.trim().length === 0,
            children: [
              /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-floppy-disk", "aria-hidden": "true" }),
              " Save profile"
            ]
          }
        ),
        /* @__PURE__ */ a.jsxs(
          "button",
          {
            type: "button",
            className: "menu_button",
            "aria-label": "Test connection",
            disabled: !0,
            title: "Save a profile, then send a message to verify the connection.",
            children: [
              /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-plug-circle-check", "aria-hidden": "true" }),
              " Test"
            ]
          }
        ),
        /* @__PURE__ */ a.jsxs(
          "button",
          {
            type: "button",
            className: "menu_button",
            "aria-label": "Delete profile",
            onClick: () => t.deleteConnectionProfile(t.activeConnectionProfile ?? n),
            disabled: (t.activeConnectionProfile ?? n).trim().length === 0,
            children: [
              /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-trash", "aria-hidden": "true" }),
              " Delete"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ a.jsx(b3, { secretRef: t.connectionSettings.secretRef ?? "" })
  ] });
}
function x3({ provider: e, currentSecretRef: t, projectId: n, onSecretRefChange: r }) {
  const s = fp(e), [i, o] = P.useState(t.startsWith("secret_ref:project:") ? "project" : "platform"), [c, u] = P.useState(s), [p, h] = P.useState(""), [x, g] = P.useState([]), [w, E] = P.useState(!1), [I, D] = P.useState({ kind: "idle", message: "" }), [y, b] = P.useState(null), N = async () => {
    try {
      const m = await Vw();
      g(m), b(!0);
    } catch (m) {
      b(!1), D({ kind: "err", message: `secret-store unavailable: ${m.message}` });
    }
  };
  P.useEffect(() => {
    N().catch(() => {
    });
  }, []), P.useEffect(() => {
    u(fp(e));
  }, [e]), P.useEffect(() => {
    o(t.startsWith("secret_ref:project:") ? "project" : "platform");
  }, [t]);
  const l = async () => {
    if (!p.trim() || !c.trim()) return;
    const m = c.trim();
    E(!0), D({ kind: "idle", message: "" });
    try {
      const v = i === "project" ? Yw(m) : Gi(m), k = i === "project" ? await Gw(n, m, p) : await Ww(m, p);
      h(""), D({
        kind: "ok",
        message: k.created ? `Saved ${i} key as ${m}` : `Updated ${i} key ${m}`
      }), r(v), i === "platform" && await N();
    } catch (v) {
      D({ kind: "err", message: v.message });
    } finally {
      E(!1);
    }
  }, d = async (m) => {
    E(!0);
    try {
      await Kw(m), t === Gi(m) && r(""), await N(), D({ kind: "ok", message: `Removed ${m}` });
    } catch (v) {
      D({ kind: "err", message: v.message });
    } finally {
      E(!1);
    }
  }, f = (m) => {
    u(m), r(Gi(m));
  };
  return /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
    /* @__PURE__ */ a.jsxs("header", { className: "drawer-section-header", children: [
      /* @__PURE__ */ a.jsx("h3", { children: "API Key" }),
      /* @__PURE__ */ a.jsx("small", { children: "Stored encrypted in the host secret store. Never sent to model providers except as request headers." })
    ] }),
    y === !1 && /* @__PURE__ */ a.jsxs("div", { className: "connection-status status-error", children: [
      "Secret store unavailable. Verify ",
      /* @__PURE__ */ a.jsx("code", { children: "official/secret-store-lab" }),
      " is loaded in your host profile."
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "range-block", children: [
      /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "radio",
            name: "api-key-scope",
            value: "platform",
            checked: i === "platform",
            onChange: () => o("platform")
          }
        ),
        /* @__PURE__ */ a.jsx("span", { children: "Platform-wide (shared with all projects)" })
      ] }),
      /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "radio",
            name: "api-key-scope",
            value: "project",
            checked: i === "project",
            onChange: () => o("project")
          }
        ),
        /* @__PURE__ */ a.jsx("span", { children: "This project only" })
      ] })
    ] }),
    /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
      /* @__PURE__ */ a.jsx("span", { children: "Secret name:" }),
      /* @__PURE__ */ a.jsx(
        "input",
        {
          type: "text",
          className: "text_pole",
          value: c,
          onChange: (m) => u(m.target.value),
          placeholder: s
        }
      )
    ] }) }),
    /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
      /* @__PURE__ */ a.jsx("span", { children: "API key:" }),
      /* @__PURE__ */ a.jsx(
        "input",
        {
          type: "password",
          className: "text_pole",
          value: p,
          onChange: (m) => h(m.target.value),
          placeholder: "Paste key, then save",
          autoComplete: "off"
        }
      )
    ] }) }),
    /* @__PURE__ */ a.jsx("div", { className: "preset-actions", children: /* @__PURE__ */ a.jsxs(
      "button",
      {
        type: "button",
        className: "menu_button",
        onClick: l,
        disabled: w || !p.trim() || !c.trim(),
        children: [
          /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-floppy-disk", "aria-hidden": "true" }),
          " Save key"
        ]
      }
    ) }),
    x.length > 0 && /* @__PURE__ */ a.jsxs("div", { className: "range-block", children: [
      /* @__PURE__ */ a.jsx("label", { className: "ydl-saved-keys-label", children: /* @__PURE__ */ a.jsx("span", { children: "Saved keys:" }) }),
      /* @__PURE__ */ a.jsx("ul", { className: "ydl-saved-keys-list", children: x.map((m) => {
        const v = Gi(m), k = t === v;
        return /* @__PURE__ */ a.jsxs("li", { className: "ydl-saved-key-row", children: [
          /* @__PURE__ */ a.jsxs("span", { className: "ydl-saved-key-name", children: [
            m,
            " ",
            k && /* @__PURE__ */ a.jsx("em", { children: "(in use)" })
          ] }),
          /* @__PURE__ */ a.jsxs("span", { className: "ydl-saved-key-actions", children: [
            !k && /* @__PURE__ */ a.jsx(
              "button",
              {
                type: "button",
                className: "menu_button menu_button_compact",
                onClick: () => f(m),
                children: "Use"
              }
            ),
            /* @__PURE__ */ a.jsx(
              "button",
              {
                type: "button",
                className: "menu_button menu_button_compact menu_button_danger",
                onClick: () => d(m),
                disabled: w,
                children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-trash", "aria-hidden": "true" })
              }
            )
          ] })
        ] }, m);
      }) })
    ] }),
    I.kind !== "idle" && /* @__PURE__ */ a.jsx("div", { className: `connection-status ${I.kind === "ok" ? "status-ok" : "status-error"}`, children: I.message })
  ] });
}
function b3({ secretRef: e }) {
  const [t, n] = P.useState({ kind: "unknown" });
  P.useEffect(() => {
    qw().then((i) => n({ kind: "ok", keySource: i.key_source, secretCount: i.secret_count })).catch(() => n({ kind: "err" }));
  }, []);
  const r = Sd(e) !== void 0, s = e.startsWith("secret_ref:project:");
  return /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
    /* @__PURE__ */ a.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ a.jsx("h3", { children: "Status" }) }),
    /* @__PURE__ */ a.jsxs("div", { className: "connection-status", children: [
      /* @__PURE__ */ a.jsx(
        "span",
        {
          className: `status-dot ${t.kind === "ok" && r ? "status-dot-ok" : "status-dot-idle"}`,
          "aria-hidden": "true"
        }
      ),
      /* @__PURE__ */ a.jsxs("span", { children: [
        t.kind === "unknown" && "Checking secret store…",
        t.kind === "err" && "Secret store unavailable",
        t.kind === "ok" && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
          "Secret store ready (",
          t.secretCount,
          " stored, key via ",
          t.keySource,
          ").",
          !r && " No API key selected for this profile.",
          r && (s ? " Project API key configured." : " API key configured.")
        ] })
      ] })
    ] })
  ] });
}
const w3 = [
  { value: "none", label: "None (Chat completion)" },
  { value: "chatml", label: "ChatML" },
  { value: "llama3", label: "Llama 3" },
  { value: "alpaca", label: "Alpaca" },
  { value: "vicuna", label: "Vicuna" },
  { value: "mistral", label: "Mistral" },
  { value: "gemma", label: "Gemma" },
  { value: "phi3", label: "Phi-3" },
  { value: "custom", label: "Custom…" }
], S3 = [
  { value: "default", label: "Default" },
  { value: "roleplay", label: "Roleplay" },
  { value: "novel", label: "Novel" },
  { value: "custom", label: "Custom…" }
];
function k3({ drawers: e }) {
  const t = ft(), n = t.formattingSettings;
  return /* @__PURE__ */ a.jsxs(or, { id: "advanced-formatting", drawers: e, side: "left", title: "Advanced Formatting", children: [
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ a.jsx("h3", { children: "Context template" }),
        /* @__PURE__ */ a.jsx("small", { children: "Frames the prompt with story string, examples, jailbreak." })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsx("span", { children: "Active template:" }),
        /* @__PURE__ */ a.jsx(
          "select",
          {
            className: "text_pole",
            value: n.contextTemplate,
            onChange: (r) => t.updateFormattingSettings({ contextTemplate: r.target.value }),
            children: S3.map((r) => /* @__PURE__ */ a.jsx("option", { value: r.value, children: r.label }, r.value))
          }
        )
      ] }) }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsx("span", { children: "Story string:" }),
        /* @__PURE__ */ a.jsx(
          "textarea",
          {
            className: "textarea_compact",
            rows: 4,
            value: n.storyString,
            onChange: (r) => t.updateFormattingSettings({ storyString: r.target.value }),
            placeholder: "{{description}}{{personality}}{{scenario}}",
            "aria-label": "Story string"
          }
        )
      ] }) }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsx("span", { children: "Example separator:" }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "text",
            className: "text_pole",
            value: n.exampleSeparator,
            onChange: (r) => t.updateFormattingSettings({ exampleSeparator: r.target.value }),
            "aria-label": "Example separator"
          }
        )
      ] }) }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsx("span", { children: "Chat start:" }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "text",
            className: "text_pole",
            value: n.chatStart,
            onChange: (r) => t.updateFormattingSettings({ chatStart: r.target.value }),
            "aria-label": "Chat start"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ a.jsx("h3", { children: "Instruct mode" }),
        /* @__PURE__ */ a.jsx("small", { children: "Wraps user/assistant turns with role tokens for instruct-tuned models." })
      ] }),
      /* @__PURE__ */ a.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "checkbox",
            checked: n.instructEnabled,
            onChange: (r) => t.updateFormattingSettings({ instructEnabled: r.target.checked })
          }
        ),
        /* @__PURE__ */ a.jsx("span", { children: "Enable instruct mode" })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsx("span", { children: "Template:" }),
        /* @__PURE__ */ a.jsx(
          "select",
          {
            className: "text_pole",
            value: n.instructTemplate,
            onChange: (r) => t.updateFormattingSettings({ instructTemplate: r.target.value }),
            children: w3.map((r) => /* @__PURE__ */ a.jsx("option", { value: r.value, children: r.label }, r.value))
          }
        )
      ] }) }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsx("span", { children: "Input sequence:" }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "text",
            className: "text_pole",
            value: n.instructInputSequence,
            onChange: (r) => t.updateFormattingSettings({ instructInputSequence: r.target.value }),
            "aria-label": "Input sequence"
          }
        )
      ] }) }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsx("span", { children: "Output sequence:" }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "text",
            className: "text_pole",
            value: n.instructOutputSequence,
            onChange: (r) => t.updateFormattingSettings({ instructOutputSequence: r.target.value }),
            "aria-label": "Output sequence"
          }
        )
      ] }) }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsx("span", { children: "System sequence:" }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "text",
            className: "text_pole",
            value: n.instructSystemSequence,
            onChange: (r) => t.updateFormattingSettings({ instructSystemSequence: r.target.value }),
            "aria-label": "System sequence"
          }
        )
      ] }) }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsx("span", { children: "Stop sequence:" }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "text",
            className: "text_pole",
            value: n.instructStopSequence,
            onChange: (r) => t.updateFormattingSettings({ instructStopSequence: r.target.value }),
            "aria-label": "Stop sequence"
          }
        )
      ] }) }),
      /* @__PURE__ */ a.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "checkbox",
            checked: n.instructSystemSameAsUser,
            onChange: (r) => t.updateFormattingSettings({ instructSystemSameAsUser: r.target.checked })
          }
        ),
        /* @__PURE__ */ a.jsx("span", { children: "System same as user" })
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ a.jsx("h3", { children: "System prompt" }) }),
      /* @__PURE__ */ a.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "checkbox",
            checked: n.systemPromptEnabled,
            onChange: (r) => t.updateFormattingSettings({ systemPromptEnabled: r.target.checked })
          }
        ),
        /* @__PURE__ */ a.jsx("span", { children: "Use system prompt" })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsx("span", { children: "Content:" }),
        /* @__PURE__ */ a.jsx(
          "textarea",
          {
            className: "textarea_compact",
            rows: 6,
            value: n.systemPrompt,
            onChange: (r) => t.updateFormattingSettings({ systemPrompt: r.target.value }),
            placeholder: "You are {{char}}, a fictional character…",
            "aria-label": "System prompt"
          }
        )
      ] }) }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsx("span", { children: "Post-history instructions:" }),
        /* @__PURE__ */ a.jsx(
          "textarea",
          {
            className: "textarea_compact",
            rows: 3,
            value: n.postHistoryInstructions,
            onChange: (r) => t.updateFormattingSettings({ postHistoryInstructions: r.target.value }),
            placeholder: "",
            "aria-label": "Post-history instructions"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ a.jsx("h3", { children: "Stopping strings" }),
        /* @__PURE__ */ a.jsx("small", { children: "One per line. The model stops when any string is generated." })
      ] }),
      /* @__PURE__ */ a.jsx(
        "textarea",
        {
          className: "textarea_compact",
          rows: 4,
          value: n.stopStrings,
          onChange: (r) => t.updateFormattingSettings({ stopStrings: r.target.value }),
          placeholder: `<|endoftext|>
<|im_end|>`,
          "aria-label": "Stop strings"
        }
      )
    ] }),
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ a.jsx("h3", { children: "Reasoning" }),
        /* @__PURE__ */ a.jsx("small", { children: "For models that emit a reasoning block before the response." })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsx("span", { children: "Reasoning prefix:" }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "text",
            className: "text_pole",
            value: n.reasoningPrefix,
            onChange: (r) => t.updateFormattingSettings({ reasoningPrefix: r.target.value }),
            "aria-label": "Reasoning prefix"
          }
        )
      ] }) }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsx("span", { children: "Reasoning suffix:" }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "text",
            className: "text_pole",
            value: n.reasoningSuffix,
            onChange: (r) => t.updateFormattingSettings({ reasoningSuffix: r.target.value }),
            "aria-label": "Reasoning suffix"
          }
        )
      ] }) }),
      /* @__PURE__ */ a.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "checkbox",
            checked: n.reasoningAutoCollapse,
            onChange: (r) => t.updateFormattingSettings({ reasoningAutoCollapse: r.target.checked })
          }
        ),
        /* @__PURE__ */ a.jsx("span", { children: "Auto-collapse reasoning blocks" })
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ a.jsx("h3", { children: "Macros" }) }),
      /* @__PURE__ */ a.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "checkbox",
            checked: n.macroEnabled,
            onChange: (r) => t.updateFormattingSettings({ macroEnabled: r.target.checked })
          }
        ),
        /* @__PURE__ */ a.jsxs("span", { children: [
          "Enable macro substitution (",
          "{{macro}}",
          ")"
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "checkbox",
            checked: n.macroNestedRecursive,
            onChange: (r) => t.updateFormattingSettings({ macroNestedRecursive: r.target.checked })
          }
        ),
        /* @__PURE__ */ a.jsx("span", { children: "Allow nested/recursive macros" })
      ] })
    ] })
  ] });
}
const N3 = [
  { value: "before_char", label: "Before character defs" },
  { value: "after_char", label: "After character defs" },
  { value: "before_an", label: "Before author's note" },
  { value: "after_an", label: "After author's note" },
  { value: "at_depth", label: "At depth" }
];
function oy({ drawers: e }) {
  const t = ft(), n = t.worldBooks.find((o) => o.id === t.activeWorldBookId) ?? t.worldBooks[0], r = n?.entries.find((o) => o.uid === t.selectedWorldEntryId) ?? n?.entries[0], s = (o) => {
    n === void 0 || r === void 0 || t.updateWorldEntry(n.id, r.uid, o);
  }, i = () => {
    n !== void 0 && t.createWorldEntry(n.id, { key: [], content: "" });
  };
  return /* @__PURE__ */ a.jsxs(or, { id: "world-info", drawers: e, side: "left", title: "World Info", children: [
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ a.jsx("h3", { children: "World books" }),
        /* @__PURE__ */ a.jsxs("div", { className: "preset-actions", children: [
          /* @__PURE__ */ a.jsxs(
            "button",
            {
              type: "button",
              className: "menu_button",
              "aria-label": "Create world book",
              onClick: () => {
                const o = t.createWorldBook({ name: "Untitled World Book" });
                t.setActiveWorldBook(o);
              },
              children: [
                /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-plus", "aria-hidden": "true" }),
                " New"
              ]
            }
          ),
          /* @__PURE__ */ a.jsxs("button", { type: "button", className: "menu_button", "aria-label": "Import world book", children: [
            /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-file-import", "aria-hidden": "true" }),
            " Import"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("ul", { className: "worldbook-list", role: "list", children: t.worldBooks.map((o) => /* @__PURE__ */ a.jsxs(
        "li",
        {
          className: `worldbook-row ${n?.id === o.id ? "active" : ""}`,
          children: [
            /* @__PURE__ */ a.jsxs(
              "button",
              {
                type: "button",
                className: "worldbook-row-button",
                onClick: () => {
                  t.setActiveWorldBook(o.id), t.setSelectedWorldEntry(o.entries[0]?.uid ?? null);
                },
                "aria-pressed": n?.id === o.id,
                children: [
                  /* @__PURE__ */ a.jsx(
                    "i",
                    {
                      className: `fa-solid ${o.enabled ? "fa-toggle-on" : "fa-toggle-off"}`,
                      "aria-hidden": "true"
                    }
                  ),
                  /* @__PURE__ */ a.jsx("span", { className: "worldbook-name", children: o.name }),
                  /* @__PURE__ */ a.jsx("span", { className: "worldbook-count", children: o.entries.length })
                ]
              }
            ),
            /* @__PURE__ */ a.jsxs("div", { className: "worldbook-row-actions", children: [
              /* @__PURE__ */ a.jsx(
                "button",
                {
                  type: "button",
                  className: "mes_button",
                  "aria-label": `Edit ${o.name}`,
                  onClick: () => {
                    t.setActiveWorldBook(o.id), t.setSelectedWorldEntry(o.entries[0]?.uid ?? null);
                  },
                  children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-pencil", "aria-hidden": "true" })
                }
              ),
              /* @__PURE__ */ a.jsx("button", { type: "button", className: "mes_button", "aria-label": `Export ${o.name}`, children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-download", "aria-hidden": "true" }) }),
              /* @__PURE__ */ a.jsx(
                "button",
                {
                  type: "button",
                  className: "mes_button danger",
                  "aria-label": `Delete ${o.name}`,
                  onClick: () => t.deleteWorldBook(o.id),
                  children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-trash", "aria-hidden": "true" })
                }
              )
            ] })
          ]
        },
        o.id
      )) })
    ] }),
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ a.jsx("h3", { children: "Entry editor" }),
        /* @__PURE__ */ a.jsxs("small", { children: [
          "Selected book: ",
          /* @__PURE__ */ a.jsx("code", { children: n?.name ?? "None" })
        ] }),
        n !== void 0 && /* @__PURE__ */ a.jsx("div", { className: "preset-actions", children: /* @__PURE__ */ a.jsxs("button", { type: "button", className: "menu_button", "aria-label": "Create world entry", onClick: i, children: [
          /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-plus", "aria-hidden": "true" }),
          " New entry"
        ] }) })
      ] }),
      n === void 0 ? /* @__PURE__ */ a.jsx("p", { className: "drawer-coming-soon", children: "Create a world book to edit entries." }) : r === void 0 ? /* @__PURE__ */ a.jsx("p", { className: "drawer-coming-soon", children: "Create an entry to edit this world book." }) : /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
        /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
          /* @__PURE__ */ a.jsx("span", { children: "Primary keys (comma-separated):" }),
          /* @__PURE__ */ a.jsx(
            "input",
            {
              type: "text",
              className: "text_pole",
              value: r.key.join(", "),
              onChange: (o) => s({ key: sh(o.target.value) }),
              placeholder: "castle, fortress"
            }
          )
        ] }) }),
        /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
          /* @__PURE__ */ a.jsx("span", { children: "Secondary keys (optional):" }),
          /* @__PURE__ */ a.jsx(
            "input",
            {
              type: "text",
              className: "text_pole",
              value: (r.secondaryKey ?? []).join(", "),
              onChange: (o) => s({ secondaryKey: sh(o.target.value) }),
              placeholder: "ancient, ruins"
            }
          )
        ] }) }),
        /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
          /* @__PURE__ */ a.jsx("span", { children: "Content:" }),
          /* @__PURE__ */ a.jsx(
            "textarea",
            {
              className: "textarea_compact",
              rows: 5,
              value: r.content,
              onChange: (o) => s({ content: o.target.value }),
              placeholder: "The castle is an ancient fortress…"
            }
          )
        ] }) }),
        /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
          /* @__PURE__ */ a.jsx("span", { children: "Position:" }),
          /* @__PURE__ */ a.jsx(
            "select",
            {
              className: "text_pole",
              value: r.position,
              onChange: (o) => s({ position: o.target.value }),
              children: N3.map((o) => /* @__PURE__ */ a.jsx("option", { value: o.value, children: o.label }, o.value))
            }
          )
        ] }) }),
        r.position === "at_depth" && /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
          /* @__PURE__ */ a.jsxs("span", { children: [
            "Depth: ",
            /* @__PURE__ */ a.jsx("code", { children: r.depth ?? 4 })
          ] }),
          /* @__PURE__ */ a.jsx(
            "input",
            {
              type: "range",
              min: "0",
              max: "10",
              step: "1",
              value: r.depth ?? 4,
              onChange: (o) => s({ depth: Number(o.target.value) }),
              className: "neo-range-input"
            }
          )
        ] }) }),
        /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
          /* @__PURE__ */ a.jsxs("span", { children: [
            "Scan depth: ",
            /* @__PURE__ */ a.jsx("code", { children: r.scanDepth ?? 1 })
          ] }),
          /* @__PURE__ */ a.jsx(
            "input",
            {
              type: "range",
              min: "1",
              max: "20",
              step: "1",
              value: r.scanDepth ?? 1,
              onChange: (o) => s({ scanDepth: Number(o.target.value) }),
              className: "neo-range-input"
            }
          )
        ] }) }),
        /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
          /* @__PURE__ */ a.jsxs("span", { children: [
            "Probability: ",
            /* @__PURE__ */ a.jsxs("code", { children: [
              r.probability,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ a.jsx(
            "input",
            {
              type: "range",
              min: "0",
              max: "100",
              step: "1",
              value: r.probability,
              onChange: (o) => s({ probability: Number(o.target.value) }),
              className: "neo-range-input"
            }
          )
        ] }) }),
        /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
          /* @__PURE__ */ a.jsxs("span", { children: [
            "Order: ",
            /* @__PURE__ */ a.jsx("code", { children: r.order })
          ] }),
          /* @__PURE__ */ a.jsx(
            "input",
            {
              type: "number",
              className: "text_pole",
              value: r.order,
              onChange: (o) => s({ order: Number(o.target.value) || 0 })
            }
          )
        ] }) }),
        /* @__PURE__ */ a.jsxs("label", { className: "checkbox_label", children: [
          /* @__PURE__ */ a.jsx(
            "input",
            {
              type: "checkbox",
              checked: r.enabled,
              onChange: (o) => s({ enabled: o.target.checked })
            }
          ),
          /* @__PURE__ */ a.jsx("span", { children: "Entry enabled" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "preset-actions", children: [
          /* @__PURE__ */ a.jsxs("button", { type: "button", className: "menu_button", "aria-label": "Save entry", children: [
            /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-floppy-disk", "aria-hidden": "true" }),
            " Save entry"
          ] }),
          /* @__PURE__ */ a.jsxs(
            "button",
            {
              type: "button",
              className: "menu_button",
              "aria-label": "Duplicate entry",
              onClick: () => t.duplicateWorldEntry(n.id, r.uid),
              children: [
                /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-copy", "aria-hidden": "true" }),
                " Duplicate"
              ]
            }
          ),
          /* @__PURE__ */ a.jsxs(
            "button",
            {
              type: "button",
              className: "menu_button danger",
              "aria-label": "Delete entry",
              onClick: () => t.deleteWorldEntry(n.id, r.uid),
              children: [
                /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-trash", "aria-hidden": "true" }),
                " Delete"
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ a.jsx("h3", { children: "Activation diagnostics" }),
        /* @__PURE__ */ a.jsx("small", { children: "Last scan results across active world books." })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "wi-diagnostics", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "wi-diagnostic-row", children: [
          /* @__PURE__ */ a.jsx("span", { children: "Activated entries:" }),
          /* @__PURE__ */ a.jsx("code", { children: "0" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "wi-diagnostic-row", children: [
          /* @__PURE__ */ a.jsx("span", { children: "Budget used:" }),
          /* @__PURE__ */ a.jsx("code", { children: "0 / 0" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "wi-diagnostic-row", children: [
          /* @__PURE__ */ a.jsx("span", { children: "Scan iterations:" }),
          /* @__PURE__ */ a.jsx("code", { children: "0" })
        ] })
      ] })
    ] })
  ] });
}
function sh(e) {
  return e.split(",").map((t) => t.trim()).filter(Boolean);
}
const j3 = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "spacious", label: "Spacious" }
], E3 = [
  { value: '"Inter", ui-sans-serif, system-ui, sans-serif', label: "Inter (Sans)" },
  { value: '"Fraunces", "Iowan Old Style", Georgia, serif', label: "Fraunces (Serif)" },
  { value: '"JetBrains Mono", "SF Mono", Menlo, monospace', label: "JetBrains Mono (Mono)" },
  { value: '"Iowan Old Style", Georgia, serif', label: "Iowan (Serif)" },
  { value: "ui-sans-serif, system-ui, sans-serif", label: "System UI (Sans)" }
];
function C3({
  themeId: e,
  selected: t,
  onSelect: n
}) {
  const r = xd(e);
  return /* @__PURE__ */ a.jsxs(
    "button",
    {
      type: "button",
      className: `theme-card${t ? " theme-card-selected" : ""}`,
      onClick: n,
      "aria-pressed": t,
      children: [
        /* @__PURE__ */ a.jsx(
          "span",
          {
            className: "theme-card-swatch",
            style: {
              background: `linear-gradient(135deg, ${r.tokens.bgPrimary}, ${r.tokens.bgSecondary})`,
              border: `1px solid ${r.tokens.border}`,
              color: r.tokens.fgPrimary
            },
            children: /* @__PURE__ */ a.jsx("span", { className: "theme-card-swatch-text", children: "Aa" })
          }
        ),
        /* @__PURE__ */ a.jsx("span", { className: "theme-card-name", children: r.label ?? r.name })
      ]
    }
  );
}
function ly({ settings: e, onChange: t }) {
  const n = xd(e.themeId), r = P.useCallback((o) => {
    t({ ...e, themeId: o });
  }, [e, t]), s = P.useCallback((o) => {
    t({ ...e, density: o.target.value });
  }, [e, t]), i = P.useCallback((o) => {
    t({ ...e, fontFamily: o.target.value });
  }, [e, t]);
  return /* @__PURE__ */ a.jsxs("section", { className: "settings-form-section", children: [
    /* @__PURE__ */ a.jsx("h3", { className: "settings-form-title", children: "Theme" }),
    /* @__PURE__ */ a.jsxs("div", { className: "settings-field", children: [
      /* @__PURE__ */ a.jsx("span", { className: "settings-label", children: "Color Theme" }),
      /* @__PURE__ */ a.jsx("div", { className: "theme-card-grid", children: Qh.map((o) => /* @__PURE__ */ a.jsx(
        C3,
        {
          themeId: o.name,
          selected: n.name === o.name,
          onSelect: () => r(o.name)
        },
        o.name
      )) })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "settings-form-grid", children: [
      /* @__PURE__ */ a.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ a.jsx("span", { className: "settings-label", children: "Density" }),
        /* @__PURE__ */ a.jsx(
          "select",
          {
            className: "settings-input",
            value: e.density,
            onChange: s,
            children: j3.map((o) => /* @__PURE__ */ a.jsx("option", { value: o.value, children: o.label }, o.value))
          }
        )
      ] }),
      /* @__PURE__ */ a.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ a.jsx("span", { className: "settings-label", children: "Font Family" }),
        /* @__PURE__ */ a.jsx(
          "select",
          {
            className: "settings-input",
            value: e.fontFamily,
            onChange: i,
            children: E3.map((o) => /* @__PURE__ */ a.jsx("option", { value: o.value, children: o.label }, o.value))
          }
        )
      ] })
    ] })
  ] });
}
const cy = {
  themeId: wr.name,
  density: wr.density,
  fontFamily: wr.font.family
};
function uy({ drawers: e }) {
  const t = ft();
  return /* @__PURE__ */ a.jsxs(or, { id: "user-settings", drawers: e, side: "left", title: "User Settings", children: [
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ a.jsx("h3", { children: "Theme" }) }),
      /* @__PURE__ */ a.jsx(
        ly,
        {
          settings: t.themeSettings ?? cy,
          onChange: (n) => {
            t.setThemeSettings(n);
          }
        }
      )
    ] }),
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ a.jsx("h3", { children: "UI Preferences" }) }),
      /* @__PURE__ */ a.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "checkbox",
            checked: t.settings?.fastUImode ?? !1,
            onChange: (n) => t.updateSettings({ fastUImode: n.target.checked })
          }
        ),
        /* @__PURE__ */ a.jsx("span", { children: "Fast UI mode (disable blur effects)" })
      ] }),
      /* @__PURE__ */ a.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "checkbox",
            checked: t.settings?.reducedMotion ?? !1,
            onChange: (n) => t.updateSettings({ reducedMotion: n.target.checked })
          }
        ),
        /* @__PURE__ */ a.jsx("span", { children: "Reduced motion (disable animations)" })
      ] }),
      /* @__PURE__ */ a.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "checkbox",
            checked: t.settings?.showTimestamps ?? !1,
            onChange: (n) => t.updateSettings({ showTimestamps: n.target.checked })
          }
        ),
        /* @__PURE__ */ a.jsx("span", { children: "Show timestamps on messages" })
      ] }),
      /* @__PURE__ */ a.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "checkbox",
            checked: t.settings?.showTokenCounter ?? !1,
            onChange: (n) => t.updateSettings({ showTokenCounter: n.target.checked })
          }
        ),
        /* @__PURE__ */ a.jsx("span", { children: "Show token counter on messages" })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsxs("span", { children: [
          "Font scale: ",
          /* @__PURE__ */ a.jsx("code", { children: t.settings?.fontScale ?? 1 })
        ] }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "range",
            min: "0.6",
            max: "2",
            step: "0.05",
            value: t.settings?.fontScale ?? 1,
            className: "neo-range-input",
            onChange: (n) => t.updateSettings({ fontScale: Number.parseFloat(n.target.value) })
          }
        )
      ] }) }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsxs("span", { children: [
          "Chat width: ",
          /* @__PURE__ */ a.jsxs("code", { children: [
            t.settings?.chatWidth ?? 50,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "range",
            min: "40",
            max: "100",
            step: "5",
            value: t.settings?.chatWidth ?? 50,
            className: "neo-range-input",
            onChange: (n) => t.updateSettings({ chatWidth: Number.parseInt(n.target.value, 10) })
          }
        )
      ] }) }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsx("span", { children: "Avatar style:" }),
        /* @__PURE__ */ a.jsxs(
          "select",
          {
            className: "text_pole",
            value: t.settings?.avatarStyle ?? 0,
            onChange: (n) => t.updateSettings({ avatarStyle: Number.parseInt(n.target.value, 10) }),
            children: [
              /* @__PURE__ */ a.jsx("option", { value: "0", children: "Square (2px radius)" }),
              /* @__PURE__ */ a.jsx("option", { value: "1", children: "Rounded (10px radius)" }),
              /* @__PURE__ */ a.jsx("option", { value: "2", children: "Circle" })
            ]
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ a.jsx("h3", { children: "Persistence" }) }),
      /* @__PURE__ */ a.jsxs("div", { className: "preset-actions", children: [
        /* @__PURE__ */ a.jsxs(
          "button",
          {
            type: "button",
            className: "menu_button",
            "aria-label": "Export settings",
            onClick: () => T3({ settings: t.settings, themeSettings: t.themeSettings }, "ydltavern-settings.json"),
            children: [
              /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-file-export" }),
              " Export"
            ]
          }
        ),
        /* @__PURE__ */ a.jsxs("label", { className: "menu_button", "aria-label": "Import settings", children: [
          /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-file-import" }),
          " Import",
          /* @__PURE__ */ a.jsx(
            "input",
            {
              type: "file",
              accept: "application/json,.json",
              hidden: !0,
              onChange: (n) => {
                const r = n.target.files?.[0];
                r && I3(r, (s) => {
                  s.settings && t.updateSettings(s.settings), s.themeSettings && t.setThemeSettings(s.themeSettings);
                }), n.currentTarget.value = "";
              }
            }
          )
        ] }),
        /* @__PURE__ */ a.jsxs(
          "button",
          {
            type: "button",
            className: "menu_button danger",
            "aria-label": "Reset to defaults",
            onClick: () => t.resetSettings(),
            children: [
              /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-rotate-left" }),
              " Reset"
            ]
          }
        )
      ] })
    ] })
  ] });
}
function T3(e, t) {
  const n = new Blob([JSON.stringify(e, null, 2)], { type: "application/json" }), r = URL.createObjectURL(n), s = document.createElement("a");
  s.href = r, s.download = t, s.click(), URL.revokeObjectURL(r);
}
function I3(e, t) {
  const n = new FileReader();
  n.onload = () => {
    try {
      t(JSON.parse(String(n.result)));
    } catch (r) {
      console.error("[YdlTavern] Failed to import settings", r);
    }
  }, n.readAsText(e);
}
function dy({ drawers: e }) {
  const t = ft(), [n, r] = P.useState(""), [s, i] = P.useState("All"), o = ["All", ...Array.from(new Set(t.backgrounds.map((u) => u.folder ?? "Default")))], c = t.backgrounds.filter(
    (u) => (s === "All" || u.folder === s) && (!n.trim() || u.name.toLowerCase().includes(n.toLowerCase()))
  );
  return /* @__PURE__ */ a.jsxs(or, { id: "backgrounds", drawers: e, side: "left", title: "Backgrounds", children: [
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ a.jsx("h3", { children: "Library" }),
        /* @__PURE__ */ a.jsxs("div", { className: "preset-actions", children: [
          /* @__PURE__ */ a.jsxs("label", { className: "menu_button", "aria-label": "Upload background", children: [
            /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-upload", "aria-hidden": "true" }),
            " Upload",
            /* @__PURE__ */ a.jsx(
              "input",
              {
                type: "file",
                accept: "image/*",
                hidden: !0,
                onChange: (u) => {
                  const p = u.target.files?.[0];
                  p && A3(p, t.uploadBackground), u.currentTarget.value = "";
                }
              }
            )
          ] }),
          /* @__PURE__ */ a.jsxs("button", { type: "button", className: "menu_button", "aria-label": "Open folder on disk", children: [
            /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-folder-open", "aria-hidden": "true" }),
            " Folder"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsx("span", { children: "Folder:" }),
        /* @__PURE__ */ a.jsx("select", { className: "text_pole", value: s, onChange: (u) => i(u.target.value), children: o.map((u) => /* @__PURE__ */ a.jsx("option", { value: u, children: u }, u)) })
      ] }) }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsx(
        "input",
        {
          type: "search",
          className: "text_pole",
          value: n,
          onChange: (u) => r(u.target.value),
          placeholder: "Search backgrounds…",
          "aria-label": "Search backgrounds"
        }
      ) }),
      /* @__PURE__ */ a.jsxs("div", { className: "bg-grid", children: [
        c.length === 0 && /* @__PURE__ */ a.jsx("div", { className: "bg-empty", children: "No backgrounds match this filter." }),
        c.map((u) => /* @__PURE__ */ a.jsxs(
          "button",
          {
            type: "button",
            className: `bg-card ${t.activeBackgroundId === u.id ? "active" : ""}`,
            onClick: () => t.setActiveBackground(u.id),
            "aria-pressed": t.activeBackgroundId === u.id,
            "aria-label": `Use ${u.name}`,
            children: [
              /* @__PURE__ */ a.jsx("div", { className: "bg-card-thumb", children: u.thumbnailUrl ? /* @__PURE__ */ a.jsx("img", { src: u.thumbnailUrl, alt: "" }) : /* @__PURE__ */ a.jsx("div", { className: "bg-card-placeholder", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-image", "aria-hidden": "true" }) }) }),
              /* @__PURE__ */ a.jsx("div", { className: "bg-card-name", children: u.name })
            ]
          },
          u.id
        ))
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ a.jsx("h3", { children: "Display" }) }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsxs("label", { children: [
        /* @__PURE__ */ a.jsx("span", { children: "Fit mode:" }),
        /* @__PURE__ */ a.jsxs(
          "select",
          {
            className: "text_pole",
            value: t.backgroundDisplaySettings.fitMode,
            onChange: (u) => t.setBackgroundFitMode(u.target.value),
            children: [
              /* @__PURE__ */ a.jsx("option", { value: "cover", children: "Cover (fill, may crop)" }),
              /* @__PURE__ */ a.jsx("option", { value: "contain", children: "Contain (fit, may letterbox)" }),
              /* @__PURE__ */ a.jsx("option", { value: "tile", children: "Tile (repeat)" })
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ a.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ a.jsx(
          "input",
          {
            type: "checkbox",
            checked: t.backgroundDisplaySettings.autoSelectByCharacter,
            onChange: (u) => t.setBackgroundAutoSelect(u.target.checked)
          }
        ),
        /* @__PURE__ */ a.jsx("span", { children: "Auto-select background per character" })
      ] })
    ] })
  ] });
}
function A3(e, t) {
  const n = new FileReader();
  n.onload = () => {
    const r = String(n.result);
    t({
      name: e.name.replace(/\.\w+$/, ""),
      url: r,
      thumbnailUrl: r
    });
  }, n.readAsDataURL(e);
}
function fy({
  records: e = [],
  activationContext: t
}) {
  const [n] = P.useState(() => new pw(P3())), [, r] = P.useState(0), s = P.useMemo(() => {
    if (!(e.length === 0 || t === void 0))
      return cp({
        records: e,
        ctx: t,
        basePath: (c) => `/scripts/extensions/${c}`
      });
  }, [e, t]), i = P.useCallback((c) => {
    n.isDisabled(c) ? n.enable(c) : n.disable(c), R3(n.list()), r((u) => u + 1);
  }, [n]), o = P.useMemo(() => {
    if (e.length === 0 || t === void 0) return;
    const c = {
      ...t,
      disabledExtensions: new Set(n.list())
    };
    return cp({
      records: e,
      ctx: c,
      basePath: (u) => `/scripts/extensions/${u}`
    });
  }, [e, t, n]);
  return /* @__PURE__ */ a.jsxs("section", { className: "drawer-panel product-extensions-panel", children: [
    /* @__PURE__ */ a.jsx("h2", { children: "Extensions" }),
    e.length === 0 ? /* @__PURE__ */ a.jsx("div", { className: "panel-row", children: /* @__PURE__ */ a.jsx("span", { children: "No extensions registered. Install extensions to see them here." }) }) : null,
    o && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsxs("div", { className: "extension-summary", children: [
        /* @__PURE__ */ a.jsxs("span", { className: "ext-count-badge ext-activated", children: [
          o.activated.length,
          " activated"
        ] }),
        o.skipped.length > 0 ? /* @__PURE__ */ a.jsxs("span", { className: "ext-count-badge ext-skipped", children: [
          o.skipped.length,
          " skipped"
        ] }) : null
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "extension-list", children: e.map((c) => {
        const u = n.isDisabled(c.id), p = o.skipped.filter((x) => x.id === c.id).flatMap((x) => x.reasons), h = !u && p.length === 0;
        return /* @__PURE__ */ a.jsxs("article", { className: `panel-row ext-row${h ? "" : " ext-row-inactive"}`, children: [
          /* @__PURE__ */ a.jsxs("div", { className: "ext-row-header", children: [
            /* @__PURE__ */ a.jsxs("div", { className: "ext-info", children: [
              /* @__PURE__ */ a.jsx("strong", { className: "ext-id", children: c.id }),
              /* @__PURE__ */ a.jsx("span", { className: "ext-display-name", children: c.manifest.display_name }),
              c.manifest.version ? /* @__PURE__ */ a.jsxs("span", { className: "ext-version", children: [
                "v",
                c.manifest.version
              ] }) : null
            ] }),
            /* @__PURE__ */ a.jsxs("div", { className: "ext-actions", children: [
              /* @__PURE__ */ a.jsx("span", { className: `ext-status${h ? " ext-status-ok" : p.length > 0 ? " ext-status-skipped" : " ext-status-disabled"}`, children: h ? "activated" : p.length > 0 ? "skipped" : "disabled" }),
              /* @__PURE__ */ a.jsx(
                "button",
                {
                  type: "button",
                  className: "ext-toggle",
                  onClick: () => i(c.id),
                  "aria-pressed": !u,
                  children: u ? "Enable" : "Disable"
                }
              )
            ] })
          ] }),
          p.length > 0 ? /* @__PURE__ */ a.jsx("ul", { className: "ext-reasons", children: p.map((x, g) => /* @__PURE__ */ a.jsx("li", { className: "ext-reason", children: x }, g)) }) : null,
          c.manifest.hooks && Object.keys(c.manifest.hooks).length > 0 ? /* @__PURE__ */ a.jsx("div", { className: "ext-hooks", children: Object.entries(c.manifest.hooks).map(([x, g]) => /* @__PURE__ */ a.jsxs("span", { className: "ext-hook-badge", children: [
            x,
            ":",
            g
          ] }, x)) }) : null
        ] }, c.id);
      }) })
    ] }),
    s === void 0 && e.length > 0 && /* @__PURE__ */ a.jsxs("div", { className: "permission-card", children: [
      /* @__PURE__ */ a.jsx("strong", { children: "Activation Context Missing" }),
      /* @__PURE__ */ a.jsx("p", { children: "Extension activation plan cannot be computed without an activation context." })
    ] })
  ] });
}
function P3() {
  try {
    const e = localStorage.getItem("ydltavern.disabledExtensions");
    return e ? JSON.parse(e) : [];
  } catch {
    return [];
  }
}
function R3(e) {
  try {
    localStorage.setItem("ydltavern.disabledExtensions", JSON.stringify(e));
  } catch {
  }
}
function M3({ drawers: e }) {
  const t = ft();
  return /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
    /* @__PURE__ */ a.jsxs("div", { style: { display: "none" }, "aria-hidden": "true", children: [
      /* @__PURE__ */ a.jsx("div", { id: "extensions_settings", "data-extension-territory": !0 }),
      /* @__PURE__ */ a.jsx("div", { id: "extensions_settings2", "data-extension-territory": !0 })
    ] }),
    /* @__PURE__ */ a.jsx(or, { id: "extensions", drawers: e, side: "left", title: "Extensions", children: /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ a.jsx("h3", { children: "Installed" }),
        /* @__PURE__ */ a.jsxs("div", { className: "preset-actions", children: [
          /* @__PURE__ */ a.jsxs("button", { type: "button", className: "menu_button", "aria-label": "Install extension", children: [
            /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-plus" }),
            " Install"
          ] }),
          /* @__PURE__ */ a.jsxs("button", { type: "button", className: "menu_button", "aria-label": "Refresh extensions", children: [
            /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-arrows-rotate" }),
            " Refresh"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ a.jsx(
        fy,
        {
          records: t.extensionRecords,
          activationContext: t.extensionActivationContext
        }
      )
    ] }) })
  ] });
}
const D3 = {
  name: "User",
  description: "",
  avatarUrl: ""
};
function py({ settings: e, onChange: t }) {
  const [n, r] = P.useState(e), s = P.useCallback(() => {
    t(n);
  }, [n, t]), i = P.useCallback((o, c) => {
    r((u) => ({ ...u, [o]: c }));
  }, []);
  return /* @__PURE__ */ a.jsxs("section", { className: "settings-form-section", children: [
    /* @__PURE__ */ a.jsx("h3", { className: "settings-form-title", children: "Persona" }),
    /* @__PURE__ */ a.jsxs("div", { className: "settings-form-grid", children: [
      /* @__PURE__ */ a.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ a.jsx("span", { className: "settings-label", children: "Persona Name" }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            className: "settings-input",
            type: "text",
            value: n.name,
            onChange: (o) => i("name", o.target.value),
            onBlur: s,
            placeholder: "User"
          }
        )
      ] }),
      /* @__PURE__ */ a.jsxs("label", { className: "settings-field settings-field-textarea", children: [
        /* @__PURE__ */ a.jsx("span", { className: "settings-label", children: "Description" }),
        /* @__PURE__ */ a.jsx(
          "textarea",
          {
            className: "settings-textarea",
            value: n.description,
            onChange: (o) => i("description", o.target.value),
            onBlur: s,
            placeholder: "Describe your persona...",
            rows: 4
          }
        )
      ] }),
      /* @__PURE__ */ a.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ a.jsx("span", { className: "settings-label", children: "Avatar URL" }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            className: "settings-input",
            type: "text",
            value: n.avatarUrl,
            onChange: (o) => i("avatarUrl", o.target.value),
            onBlur: s,
            placeholder: "https://example.com/avatar.png"
          }
        )
      ] })
    ] })
  ] });
}
function my({ drawers: e }) {
  const t = ft(), n = t.personas.find((r) => r.id === t.activePersonaId) ?? t.personas[0];
  return /* @__PURE__ */ a.jsxs(or, { id: "persona", drawers: e, side: "left", title: "Persona Management", children: [
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ a.jsx("h3", { children: "Personas" }),
        /* @__PURE__ */ a.jsxs("div", { className: "preset-actions", children: [
          /* @__PURE__ */ a.jsxs(
            "button",
            {
              type: "button",
              className: "menu_button",
              "aria-label": "Create persona",
              onClick: () => {
                const r = t.createPersona({ name: "New Persona" });
                t.setActivePersona(r);
              },
              children: [
                /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-plus", "aria-hidden": "true" }),
                " New"
              ]
            }
          ),
          /* @__PURE__ */ a.jsxs("button", { type: "button", className: "menu_button", "aria-label": "Import persona", children: [
            /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-file-import", "aria-hidden": "true" }),
            " Import"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("ul", { className: "persona-list", role: "list", children: t.personas.map((r) => /* @__PURE__ */ a.jsxs("li", { className: `persona-row ${n?.id === r.id ? "active" : ""}`, children: [
        /* @__PURE__ */ a.jsxs(
          "button",
          {
            type: "button",
            className: "persona-row-button",
            onClick: () => t.setActivePersona(r.id),
            "aria-pressed": n?.id === r.id,
            "aria-label": `Activate persona ${r.name}`,
            children: [
              /* @__PURE__ */ a.jsx("div", { className: "persona-avatar", children: r.avatarUrl ? /* @__PURE__ */ a.jsx("img", { src: r.avatarUrl, alt: "" }) : /* @__PURE__ */ a.jsx("div", { className: "persona-avatar-placeholder", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-user", "aria-hidden": "true" }) }) }),
              /* @__PURE__ */ a.jsxs("div", { className: "persona-meta", children: [
                /* @__PURE__ */ a.jsx("div", { className: "persona-name", children: r.name }),
                r.description && /* @__PURE__ */ a.jsx("div", { className: "persona-description", children: r.description })
              ] }),
              n?.id === r.id && /* @__PURE__ */ a.jsx("span", { className: "persona-active-badge", "aria-label": "Active persona", children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-check", "aria-hidden": "true" }) })
            ]
          }
        ),
        /* @__PURE__ */ a.jsxs("div", { className: "persona-row-actions", children: [
          /* @__PURE__ */ a.jsx("button", { type: "button", className: "mes_button", "aria-label": `Edit ${r.name}`, children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-pencil", "aria-hidden": "true" }) }),
          /* @__PURE__ */ a.jsx(
            "button",
            {
              type: "button",
              className: "mes_button",
              "aria-label": `Delete ${r.name}`,
              onClick: () => t.deletePersona(r.id),
              disabled: t.personas.length <= 1,
              children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-trash", "aria-hidden": "true" })
            }
          )
        ] })
      ] }, r.id)) })
    ] }),
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ a.jsx("h3", { children: "Edit active persona" }) }),
      n ? /* @__PURE__ */ a.jsx(
        py,
        {
          settings: {
            name: n.name,
            description: n.description ?? "",
            avatarUrl: n.avatarUrl ?? ""
          },
          onChange: (r) => t.updatePersona(n.id, r)
        },
        n.id
      ) : /* @__PURE__ */ a.jsx("p", { className: "drawer-coming-soon", children: "Create a persona to edit." })
    ] }),
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ a.jsx("h3", { children: "Persona settings" }) }),
      /* @__PURE__ */ a.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ a.jsx("input", { type: "checkbox", defaultChecked: !0 }),
        /* @__PURE__ */ a.jsx("span", { children: "Show persona name in chat" })
      ] }),
      /* @__PURE__ */ a.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ a.jsx("input", { type: "checkbox" }),
        /* @__PURE__ */ a.jsx("span", { children: "Lock persona to current chat" })
      ] })
    ] })
  ] });
}
function hy({ drawers: e }) {
  const t = ft(), [n, r] = P.useState(""), s = t.characters.find((o) => o.id === t.activeCharacterId), i = t.characters.filter(
    (o) => !n.trim() || o.name.toLowerCase().includes(n.toLowerCase()) || (o.description ?? "").toLowerCase().includes(n.toLowerCase()) || (o.tags ?? []).some((c) => c.toLowerCase().includes(n.toLowerCase()))
  );
  return /* @__PURE__ */ a.jsxs(or, { id: "characters", drawers: e, side: "right", title: "Characters", children: [
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ a.jsx("h3", { children: "Library" }),
        /* @__PURE__ */ a.jsxs("div", { className: "preset-actions", children: [
          /* @__PURE__ */ a.jsxs(
            "button",
            {
              type: "button",
              className: "menu_button",
              "aria-label": "Create character",
              onClick: () => {
                const o = t.createCharacter({ name: "New Character" });
                t.setActiveCharacter(o);
              },
              children: [
                /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-plus", "aria-hidden": "true" }),
                " New"
              ]
            }
          ),
          /* @__PURE__ */ a.jsxs("label", { className: "menu_button", "aria-label": "Import character card", children: [
            /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-file-import", "aria-hidden": "true" }),
            " Import",
            /* @__PURE__ */ a.jsx(
              "input",
              {
                type: "file",
                accept: "application/json,.json",
                hidden: !0,
                onChange: (o) => {
                  const c = o.target.files?.[0];
                  c && L3(c, (u) => t.importCharacter(u)), o.currentTarget.value = "";
                }
              }
            )
          ] }),
          /* @__PURE__ */ a.jsxs(
            "button",
            {
              type: "button",
              className: "menu_button",
              "aria-label": "Create group chat",
              onClick: () => {
                const o = t.createCharacter({ isGroup: !0, name: "New Group", members: [] });
                t.setActiveCharacter(o);
              },
              children: [
                /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-users", "aria-hidden": "true" }),
                " Group"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "range-block", children: /* @__PURE__ */ a.jsx(
        "input",
        {
          type: "search",
          className: "text_pole",
          value: n,
          onChange: (o) => r(o.target.value),
          placeholder: "Search characters or tags…",
          "aria-label": "Search characters"
        }
      ) }),
      /* @__PURE__ */ a.jsxs("ul", { className: "character-list", role: "list", children: [
        i.length === 0 && /* @__PURE__ */ a.jsx("li", { className: "character-empty", children: /* @__PURE__ */ a.jsx("p", { children: "No characters match this search." }) }),
        i.map((o) => /* @__PURE__ */ a.jsxs("li", { className: "character-row", children: [
          /* @__PURE__ */ a.jsxs(
            "button",
            {
              type: "button",
              className: `character-row-button ${t.activeCharacterId === o.id ? "active" : ""}`,
              "aria-label": `Open ${o.name}`,
              "aria-pressed": t.activeCharacterId === o.id,
              onClick: () => t.setActiveCharacter(o.id),
              children: [
                /* @__PURE__ */ a.jsx("div", { className: "character-avatar", children: o.avatarUrl ? /* @__PURE__ */ a.jsx("img", { src: o.avatarUrl, alt: "" }) : /* @__PURE__ */ a.jsx("div", { className: "character-avatar-placeholder", children: /* @__PURE__ */ a.jsx("i", { className: `fa-solid ${o.isGroup ? "fa-users" : "fa-user"}`, "aria-hidden": "true" }) }) }),
                /* @__PURE__ */ a.jsxs("div", { className: "character-meta", children: [
                  /* @__PURE__ */ a.jsx("div", { className: "character-name", children: o.name }),
                  o.description && /* @__PURE__ */ a.jsx("div", { className: "character-description", children: o.description }),
                  o.tags && o.tags.length > 0 && /* @__PURE__ */ a.jsx("div", { className: "character-tags", children: o.tags.map((c) => /* @__PURE__ */ a.jsx("span", { className: "character-tag", children: c }, c)) })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ a.jsxs("div", { className: "character-row-actions", children: [
            /* @__PURE__ */ a.jsx(
              "button",
              {
                type: "button",
                className: "mes_button",
                "aria-label": `Edit ${o.name}`,
                onClick: () => t.setActiveCharacter(o.id),
                children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-pencil", "aria-hidden": "true" })
              }
            ),
            /* @__PURE__ */ a.jsx(
              "button",
              {
                type: "button",
                className: "mes_button",
                "aria-label": `Duplicate ${o.name}`,
                onClick: () => t.duplicateCharacter(o.id),
                children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-copy", "aria-hidden": "true" })
              }
            ),
            /* @__PURE__ */ a.jsx(
              "button",
              {
                type: "button",
                className: "mes_button",
                "aria-label": `Export ${o.name}`,
                onClick: () => {
                  const c = t.exportCharacter(o.id);
                  c && O3(c, `${z3(c.name)}.json`);
                },
                children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-download", "aria-hidden": "true" })
              }
            ),
            /* @__PURE__ */ a.jsx(
              "button",
              {
                type: "button",
                className: "mes_button",
                "aria-label": `Delete ${o.name}`,
                onClick: () => t.deleteCharacter(o.id),
                children: /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-trash", "aria-hidden": "true" })
              }
            )
          ] })
        ] }, o.id))
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ a.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ a.jsx("h3", { children: "Group chat members" }),
        /* @__PURE__ */ a.jsx("small", { children: "Visible when a group chat is active." })
      ] }),
      s?.isGroup ? /* @__PURE__ */ a.jsxs("p", { className: "drawer-coming-soon", children: [
        (s.members ?? []).length,
        " member",
        (s.members ?? []).length === 1 ? "" : "s",
        " in ",
        s.name,
        "."
      ] }) : /* @__PURE__ */ a.jsx("p", { className: "drawer-coming-soon", children: "No active group chat." })
    ] })
  ] });
}
function O3(e, t) {
  const n = new Blob([JSON.stringify(e, null, 2)], { type: "application/json" }), r = URL.createObjectURL(n), s = document.createElement("a");
  s.href = r, s.download = t, s.click(), URL.revokeObjectURL(r);
}
function L3(e, t) {
  const n = new FileReader();
  n.onload = () => {
    try {
      t(JSON.parse(String(n.result)));
    } catch (r) {
      console.error("[YdlTavern] Failed to import character", r);
    }
  }, n.readAsText(e);
}
function z3(e) {
  return e.replace(/[^a-z0-9-_]+/gi, "_").replace(/^_+|_+$/g, "") || "character";
}
function B3() {
  const e = ft(), t = ry(), n = $3(e.extensionRecords);
  P.useEffect(() => {
    e.needsApiConnection && t.open("api-connections");
  }, [e.needsApiConnection, t]), P.useEffect(() => {
    const s = (i) => {
      if (i.key !== "Escape" || !t.openId) return;
      const o = document.activeElement;
      o instanceof HTMLTextAreaElement || o instanceof HTMLInputElement && (o.type === "text" || o.type === "search") || (i.preventDefault(), t.close());
    };
    return window.addEventListener("keydown", s), () => window.removeEventListener("keydown", s);
  }, [t]);
  const r = (s) => {
    s && e.pushSystemNotice("Quick reply is not yet available on this surface.");
  };
  return /* @__PURE__ */ a.jsx(ny, { theme: e.theme, children: /* @__PURE__ */ a.jsxs("div", { className: "ydltavern-surface tavern-shell", "data-drawer-open": t.openId ?? "none", children: [
    /* @__PURE__ */ a.jsx(p3, { drawers: t }),
    /* @__PURE__ */ a.jsxs("div", { className: "drawer-rail drawer-rail-left", children: [
      /* @__PURE__ */ a.jsx(ay, { drawers: t }),
      /* @__PURE__ */ a.jsx(y3, { drawers: t }),
      /* @__PURE__ */ a.jsx(k3, { drawers: t }),
      /* @__PURE__ */ a.jsx(oy, { drawers: t }),
      /* @__PURE__ */ a.jsx(uy, { drawers: t }),
      /* @__PURE__ */ a.jsx(dy, { drawers: t }),
      /* @__PURE__ */ a.jsx(M3, { drawers: t }),
      /* @__PURE__ */ a.jsx(my, { drawers: t })
    ] }),
    /* @__PURE__ */ a.jsxs(m3, { children: [
      /* @__PURE__ */ a.jsx(
        a3,
        {
          onOpenApiConnections: () => t.open("api-connections"),
          onOpenCharacters: () => t.open("characters"),
          onOpenExtensions: () => t.open("extensions")
        }
      ),
      /* @__PURE__ */ a.jsx(u3, { sets: n, onTrigger: r }),
      /* @__PURE__ */ a.jsx(
        SS,
        {
          onSend: (s) => e.sendMessage(s),
          onContinue: () => e.continueLastReply(),
          onImpersonate: () => e.impersonate(),
          onStop: () => e.cancelGeneration(),
          onOptions: () => {
          },
          isGenerating: e.isGenerating,
          needsApiConnection: e.needsApiConnection,
          onOpenApiConnections: () => t.open("api-connections")
        }
      )
    ] }),
    /* @__PURE__ */ a.jsx("div", { id: "movingDivs", "data-extension-territory": !0 }),
    /* @__PURE__ */ a.jsxs("div", { style: { display: "none" }, "aria-hidden": "true", children: [
      /* @__PURE__ */ a.jsx("div", { id: "extensions_settings", "data-extension-territory": !0 }),
      /* @__PURE__ */ a.jsx("div", { id: "extensions_settings2", "data-extension-territory": !0 })
    ] }),
    /* @__PURE__ */ a.jsx("div", { className: "drawer-rail drawer-rail-right", children: /* @__PURE__ */ a.jsx(hy, { drawers: t }) }),
    t.openId && /* @__PURE__ */ a.jsx(
      "button",
      {
        type: "button",
        className: "drawer-backdrop",
        onClick: t.close,
        "aria-label": "Close drawer"
      }
    )
  ] }) });
}
function $3(e) {
  return e.length === 0 ? [] : (e.find((n) => n.id === "quick-reply"), mw([
    {
      id: "demo",
      name: "Demo Set",
      enabled: !0,
      items: [
        { id: "demo_1", label: "Continue", slashCommand: "/continue" },
        { id: "demo_2", label: "Regenerate", slashCommand: "/regenerate" },
        { id: "demo_3", label: "Summarize", slashCommand: "/summarize" }
      ]
    }
  ]).sets.map((n) => ({
    id: n.id,
    name: n.name,
    enabled: n.enabled,
    items: n.items.map((r) => ({ id: r.id, label: r.label }))
  })));
}
function H3({ sub: e }) {
  switch (e.kind) {
    case "text":
      return /* @__PURE__ */ a.jsx("p", { className: "sub sub-text", children: e.text.split(`
`).map((t, n, r) => /* @__PURE__ */ a.jsxs("span", { children: [
        t,
        n < r.length - 1 ? /* @__PURE__ */ a.jsx("br", {}) : null
      ] }, n)) });
    case "thinking":
      return /* @__PURE__ */ a.jsxs("details", { className: "sub sub-thinking", open: e.collapsed_by_default !== !0, children: [
        /* @__PURE__ */ a.jsxs("summary", { children: [
          /* @__PURE__ */ a.jsx("span", { className: "sub-tag", children: "thinking" }),
          /* @__PURE__ */ a.jsx("span", { className: "sub-summary-text", children: "internal reasoning" })
        ] }),
        /* @__PURE__ */ a.jsx("p", { children: e.text })
      ] });
    case "tool_call":
      return /* @__PURE__ */ a.jsxs("div", { className: "sub sub-tool-call", children: [
        /* @__PURE__ */ a.jsxs("header", { children: [
          /* @__PURE__ */ a.jsx("span", { className: "sub-tag tag-tool", children: "tool_call" }),
          /* @__PURE__ */ a.jsxs("span", { className: "tool-name", children: [
            e.tool.provider !== void 0 ? `${e.tool.provider}.` : "",
            e.tool.name
          ] }),
          /* @__PURE__ */ a.jsxs("span", { className: "call-id", children: [
            "#",
            e.call_id
          ] })
        ] }),
        /* @__PURE__ */ a.jsx("pre", { className: "json-block", children: JSON.stringify(e.arguments, null, 2) })
      ] });
    case "tool_result":
      return /* @__PURE__ */ a.jsxs("div", { className: `sub sub-tool-result status-${e.status}`, children: [
        /* @__PURE__ */ a.jsxs("header", { children: [
          /* @__PURE__ */ a.jsx("span", { className: "sub-tag tag-result", children: "tool_result" }),
          /* @__PURE__ */ a.jsx("span", { className: "status-pill", children: e.status }),
          /* @__PURE__ */ a.jsxs("span", { className: "call-id", children: [
            "#",
            e.call_id
          ] })
        ] }),
        /* @__PURE__ */ a.jsx("pre", { className: "json-block", children: JSON.stringify(e.result, null, 2) })
      ] });
    case "note":
      return /* @__PURE__ */ a.jsxs("div", { className: "sub sub-note", children: [
        /* @__PURE__ */ a.jsx("span", { className: "sub-tag tag-note", children: "note" }),
        /* @__PURE__ */ a.jsx("span", { children: e.text })
      ] });
    case "skill_invoke":
    case "agent_step":
    case "image":
    case "audio":
    case "attachment":
    case "file_embed":
      return /* @__PURE__ */ a.jsxs("div", { className: "sub sub-placeholder", children: [
        /* @__PURE__ */ a.jsx("span", { className: "sub-tag tag-stub", children: e.kind }),
        /* @__PURE__ */ a.jsx("span", { children: "not rendered in scaffold" })
      ] });
  }
}
const ah = {
  user: "User",
  assistant: "Assistant",
  system: "System",
  tool: "Tool"
};
function F3({ turn: e }) {
  const t = fd(e), n = e.variants.length, r = e.speaker?.name ?? ah[e.role], s = `${e.active_variant + 1} / ${n}`;
  return /* @__PURE__ */ a.jsxs("article", { className: `turn turn-role-${e.role}`, "data-turn-index": e.index, children: [
    /* @__PURE__ */ a.jsxs("header", { className: "turn-header", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "turn-identity", children: [
        /* @__PURE__ */ a.jsx("span", { className: "turn-role", children: ah[e.role] }),
        /* @__PURE__ */ a.jsx("span", { className: "turn-speaker", children: r })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "turn-meta", children: [
        /* @__PURE__ */ a.jsx("button", { type: "button", className: "swipe swipe-prev", disabled: !0, "aria-label": "Previous variant", children: "‹" }),
        /* @__PURE__ */ a.jsx("span", { className: "swipe-position", title: "active variant / total variants", children: s }),
        /* @__PURE__ */ a.jsx("button", { type: "button", className: "swipe swipe-next", disabled: !0, "aria-label": "Next variant", children: "›" })
      ] })
    ] }),
    t === void 0 ? /* @__PURE__ */ a.jsx("p", { className: "turn-empty", children: "No active variant." }) : /* @__PURE__ */ a.jsx("div", { className: "turn-body", children: t.subs.map((i, o) => /* @__PURE__ */ a.jsx(H3, { sub: i }, `${e.id}-sub-${o}`)) }),
    t !== void 0 && U3(t.meta) ? /* @__PURE__ */ a.jsxs("footer", { className: "turn-footer", children: [
      t.meta.model !== void 0 ? /* @__PURE__ */ a.jsxs("span", { children: [
        "model: ",
        t.meta.model
      ] }) : null,
      t.meta.tokens !== void 0 ? /* @__PURE__ */ a.jsxs("span", { children: [
        "tokens: ",
        t.meta.tokens
      ] }) : null,
      t.meta.latency_ms !== void 0 ? /* @__PURE__ */ a.jsxs("span", { children: [
        "latency: ",
        t.meta.latency_ms,
        "ms"
      ] }) : null,
      t.meta.finish_reason !== void 0 ? /* @__PURE__ */ a.jsxs("span", { children: [
        "finish: ",
        t.meta.finish_reason
      ] }) : null
    ] }) : null
  ] });
}
function U3(e) {
  return e.model !== void 0 || e.tokens !== void 0 || e.latency_ms !== void 0 || e.finish_reason !== void 0;
}
function _C() {
  const { liveChat: e } = ft();
  return /* @__PURE__ */ a.jsx(
    Y_,
    {
      className: "tavern-chat-list",
      data: e.turns,
      itemContent: (t, n) => /* @__PURE__ */ a.jsx(F3, { turn: n }, n.id),
      followOutput: "auto",
      overscan: { main: 200, reverse: 200 }
    }
  );
}
function yC() {
  const e = ft();
  return /* @__PURE__ */ a.jsxs("section", { className: "product-composer", children: [
    /* @__PURE__ */ a.jsx("textarea", { value: e.input, onChange: (t) => e.setInput(t.target.value), onKeyDown: (t) => {
      (t.metaKey || t.ctrlKey) && t.key === "Enter" && e.sendMessage();
    }, placeholder: "Type a message. Ctrl/⌘ + Enter sends." }),
    /* @__PURE__ */ a.jsxs("div", { className: "composer-actions", children: [
      /* @__PURE__ */ a.jsx("button", { type: "button", onClick: () => {
        e.sendMessage();
      }, children: "Send" }),
      /* @__PURE__ */ a.jsx("button", { type: "button", onClick: e.generateReply, children: "Generate" })
    ] })
  ] });
}
function W3() {
  const e = ft();
  return /* @__PURE__ */ a.jsxs("section", { className: "product-control-card", children: [
    /* @__PURE__ */ a.jsx("h3", { children: "Generation" }),
    /* @__PURE__ */ a.jsx("button", { type: "button", onClick: e.generateReply, children: "Generate" }),
    /* @__PURE__ */ a.jsx("button", { type: "button", onClick: e.regenerateReply, children: "Regenerate" }),
    /* @__PURE__ */ a.jsx("button", { type: "button", onClick: e.swipeReply, children: "Swipe" }),
    /* @__PURE__ */ a.jsx("button", { type: "button", onClick: e.editFirstMessage, children: "Edit first" }),
    /* @__PURE__ */ a.jsx("p", { children: "Controls call the live ST context. Real model routing lands later through Yggdrasil public protocol." })
  ] });
}
function xC() {
  return /* @__PURE__ */ a.jsx(W3, {});
}
const Vr = [
  { id: "connection", label: "Connection" },
  { id: "sampler", label: "Sampler" },
  { id: "persona", label: "Persona" },
  { id: "theme", label: "Theme" }
], G3 = () => Rl("ydltavern.connection", g3), V3 = () => Rl("ydltavern.sampler", h3), K3 = () => Rl("ydltavern.persona", D3), q3 = () => Rl("ydltavern.themeSettings", cy);
function Rl(e, t) {
  try {
    const n = localStorage.getItem(e);
    return n ? JSON.parse(n) : t;
  } catch {
    return t;
  }
}
function po(e, t, n = 300) {
  let r;
  return () => {
    clearTimeout(r), r = setTimeout(() => {
      try {
        localStorage.setItem(e, JSON.stringify(t));
      } catch {
      }
    }, n);
  };
}
function Y3({ children: e }) {
  const [t, n] = P.useState("connection"), r = P.useMemo(() => ({
    connection: G3(),
    sampler: V3(),
    persona: K3(),
    theme: q3()
  }), []), [s, i] = P.useState(r.connection), [o, c] = P.useState(r.sampler), [u, p] = P.useState(r.persona), [h, x] = P.useState(r.theme);
  P.useEffect(() => po("ydltavern.connection", s)(), [s]), P.useEffect(() => po("ydltavern.sampler", o)(), [o]), P.useEffect(() => po("ydltavern.persona", u)(), [u]), P.useEffect(() => po("ydltavern.themeSettings", h)(), [h]);
  const g = P.useCallback((w) => {
    const E = Vr.findIndex((I) => I.id === t);
    if (w.key === "ArrowRight") {
      const I = Vr[(E + 1) % Vr.length];
      I && n(I.id);
    } else if (w.key === "ArrowLeft") {
      const I = Vr[(E - 1 + Vr.length) % Vr.length];
      I && n(I.id);
    }
  }, [t]);
  return /* @__PURE__ */ a.jsxs("section", { className: "drawer-panel product-settings-panel", children: [
    /* @__PURE__ */ a.jsx("h2", { children: "Settings" }),
    /* @__PURE__ */ a.jsx("nav", { className: "settings-tabs", role: "tablist", "aria-label": "Settings tabs", onKeyDown: g, children: Vr.map((w) => /* @__PURE__ */ a.jsx(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": t === w.id,
        className: `settings-tab${t === w.id ? " is-active" : ""}`,
        onClick: () => n(w.id),
        children: w.label
      },
      w.id
    )) }),
    /* @__PURE__ */ a.jsxs("div", { className: "settings-tab-content", role: "tabpanel", children: [
      t === "connection" && /* @__PURE__ */ a.jsx(iy, { settings: s, onChange: i }),
      t === "sampler" && /* @__PURE__ */ a.jsx(sy, { settings: o, onChange: c }),
      t === "persona" && /* @__PURE__ */ a.jsx(py, { settings: u, onChange: p }),
      t === "theme" && /* @__PURE__ */ a.jsx(ly, { settings: h, onChange: x }),
      e
    ] })
  ] });
}
const Q3 = [["Character cards", "V1/V2/V3 JSON and PNG metadata import/export"], ["World books", "Lorebook entries, routing, activation diagnostics"], ["Presets", "OpenAI/text/context/instruct/sysprompt shapes"], ["Chats", "JSONL history import/export into Turn model"]];
function bC() {
  return /* @__PURE__ */ a.jsxs("section", { className: "drawer-panel product-assets-panel", children: [
    /* @__PURE__ */ a.jsx("h2", { children: "Assets" }),
    /* @__PURE__ */ a.jsx("div", { className: "drop-zone", children: "Drop ST assets here once host file access is wired." }),
    /* @__PURE__ */ a.jsx("div", { className: "panel-list", children: Q3.map(([e, t]) => /* @__PURE__ */ a.jsxs("article", { className: "panel-row", children: [
      /* @__PURE__ */ a.jsx("strong", { children: e }),
      /* @__PURE__ */ a.jsx("span", { children: t })
    ] }, e)) })
  ] });
}
const X3 = [
  {
    identifier: "main",
    role: "system",
    content: "You are Aria, a meticulous executive assistant. Be concise and propose concrete next steps.",
    order: 0
  },
  {
    identifier: "charDescription",
    role: "system",
    content: "Aria values calendar accuracy and tight agendas.",
    order: 1
  },
  {
    identifier: "chatHistory",
    role: "system",
    content: "",
    order: 2
  }
], Z3 = {
  temperature: 0.7,
  top_p: 0.9,
  top_k: 40,
  max_tokens: 512,
  stream: !1
};
function J3({ chat: e }) {
  const { prompt: t, request: n, sampler: r } = P.useMemo(() => {
    const i = t0(X3, e, { mode: "chat" }), o = ib(Z3), c = Jx({
      model: "gpt-4o-mini",
      messages: i.messages.map((u) => ({
        role: u.role,
        content: u.content
      })),
      sampler: o
    });
    return { prompt: i, request: c, sampler: o };
  }, [e]), s = JSON.stringify(n, null, 2);
  return /* @__PURE__ */ a.jsxs("section", { className: "diag-panel diag-panel-engine", children: [
    /* @__PURE__ */ a.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ a.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/engine-core" }),
      /* @__PURE__ */ a.jsx("h2", { children: "Engine prompt & request preview" }),
      /* @__PURE__ */ a.jsxs("p", { className: "diag-panel-lede", children: [
        /* @__PURE__ */ a.jsx("code", { children: "buildPrompt" }),
        " assembles ST prompt blocks + Turn history;",
        /* @__PURE__ */ a.jsx("code", { children: "buildOpenAIChatRequest" }),
        " shapes the wire payload."
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("dl", { className: "diag-grid", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "diag-cell", children: [
        /* @__PURE__ */ a.jsx("dt", { children: "messages emitted" }),
        /* @__PURE__ */ a.jsx("dd", { className: "value-large", children: t.messages.length })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "diag-cell", children: [
        /* @__PURE__ */ a.jsx("dt", { children: "history turns" }),
        /* @__PURE__ */ a.jsx("dd", { className: "value-large", children: t.diagnostics.insertedHistoryTurns })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "diag-cell", children: [
        /* @__PURE__ */ a.jsx("dt", { children: "blocks included" }),
        /* @__PURE__ */ a.jsx("dd", { children: t.diagnostics.includedBlocks.join(" / ") })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "diag-cell", children: [
        /* @__PURE__ */ a.jsx("dt", { children: "warnings" }),
        /* @__PURE__ */ a.jsx("dd", { children: t.diagnostics.warnings.length === 0 ? "none" : t.diagnostics.warnings.join("; ") })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "diag-cell diag-cell-wide", children: [
        /* @__PURE__ */ a.jsx("dt", { children: "sampler.normalized" }),
        /* @__PURE__ */ a.jsxs("dd", { className: "value-row", children: [
          /* @__PURE__ */ a.jsxs("span", { children: [
            "temp ",
            r.temperature ?? "—"
          ] }),
          /* @__PURE__ */ a.jsxs("span", { children: [
            "top_p ",
            r.top_p ?? "—"
          ] }),
          /* @__PURE__ */ a.jsxs("span", { children: [
            "top_k ",
            r.top_k ?? "—"
          ] }),
          /* @__PURE__ */ a.jsxs("span", { children: [
            "max ",
            r.max_tokens ?? "—"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-payload", children: [
      /* @__PURE__ */ a.jsx("h3", { children: "OpenAI chat request shape" }),
      /* @__PURE__ */ a.jsx("pre", { className: "json-block", children: s }),
      /* @__PURE__ */ a.jsxs("p", { className: "diag-footnote", children: [
        "ST ",
        /* @__PURE__ */ a.jsx("code", { children: "top_k" }),
        " doesn’t cross to the OpenAI surface; engine-core surfaces that via diagnostics rather than silently dropping it."
      ] })
    ] })
  ] });
}
function e1(e, t) {
  if (typeof e != "string")
    return e;
  try {
    const n = JSON.parse(e), r = yi(n);
    if (r === void 0)
      throw new Error(`${t} must be a JSON object`);
    return r;
  } catch (n) {
    throw n instanceof SyntaxError ? new Error(`Invalid ${t}: ${n.message}`) : n;
  }
}
function t1(e) {
  const t = e.trim();
  if (t.length === 0)
    return [];
  if (!t.includes(`
`) && gy(t)) {
    const n = JSON.parse(t);
    if (Array.isArray(n))
      return n.filter(er);
    const r = yi(n);
    if (r === void 0)
      throw new Error("Invalid chat history JSON: top-level value must be an object or array");
    return r;
  }
  return t.split(/\r?\n/u).map((n, r) => {
    try {
      const s = JSON.parse(n), i = yi(s);
      if (i === void 0)
        throw new Error("line is not an object");
      return i;
    } catch (s) {
      const i = s instanceof Error ? s.message : "unknown parse error";
      throw new Error(`Invalid chat history JSONL at line ${r + 1}: ${i}`);
    }
  });
}
function ih(e) {
  try {
    const t = JSON.parse(e);
    return yi(t);
  } catch {
    return;
  }
}
function gy(e) {
  return e.startsWith("{") && e.endsWith("}") || e.startsWith("[") && e.endsWith("]");
}
function vy(e) {
  return e.length > 0 && e.length % 4 === 0 && /^[A-Za-z0-9+/]+={0,2}$/u.test(e);
}
function n1(e) {
  try {
    if (typeof Buffer < "u")
      return Buffer.from(e, "base64").toString("utf8");
  } catch {
    return;
  }
}
function be(e, t) {
  const n = e[t];
  return typeof n == "string" ? n : void 0;
}
function _i(e, t) {
  const n = e[t];
  return typeof n == "number" && Number.isFinite(n) ? n : void 0;
}
function gr(e, t) {
  const n = e[t];
  return typeof n == "boolean" ? n : void 0;
}
function Ga(e, t) {
  return yi(e[t]);
}
function oh(e, t) {
  const n = e[t];
  if (!Array.isArray(n))
    return;
  const r = n.filter((s) => typeof s == "string");
  return r.length === n.length ? r : void 0;
}
function r1(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function er(e) {
  return r1(e) ? Object.values(e).every(Cf) : !1;
}
function Cf(e) {
  return e === null || typeof e == "string" || typeof e == "number" || typeof e == "boolean" ? !0 : Array.isArray(e) ? e.every(Cf) : er(e);
}
function yi(e) {
  return er(e) ? e : void 0;
}
function s1(e) {
  return Cf(e) ? e : null;
}
function a1(e, t) {
  const n = {};
  for (const [r, s] of Object.entries(e))
    t.includes(r) || (n[r] = s);
  return n;
}
const Po = [137, 80, 78, 71, 13, 10, 26, 10];
function i1(e) {
  const t = [];
  if (e instanceof Uint8Array) {
    const s = c1(e, t);
    return {
      ...lh(s.payload, s.format, t),
      preserved: { format: s.format, payload: s.payload },
      diagnostics: t
    };
  }
  const n = e1(e, "character card JSON"), r = o1(n);
  return lh(n, r, t);
}
function lh(e, t, n) {
  const r = Ga(e, "data") ?? e, s = Ga(r, "extensions") ?? Ga(e, "extensions"), i = be(r, "name") ?? be(e, "name");
  return (i === void 0 || i.length === 0) && n.push({ severity: "warning", message: "Character card is missing a name; using Untitled Character.", path: "name" }), {
    kind: "character_card",
    format: t,
    version: l1(e, r),
    name: i && i.length > 0 ? i : "Untitled Character",
    description: be(r, "description") ?? be(e, "description"),
    personality: be(r, "personality") ?? be(e, "personality"),
    scenario: be(r, "scenario") ?? be(e, "scenario"),
    first_mes: be(r, "first_mes") ?? be(e, "first_mes") ?? be(r, "first_message"),
    mes_example: be(r, "mes_example") ?? be(e, "mes_example") ?? be(r, "example_dialogue"),
    creator_notes: be(r, "creator_notes") ?? be(e, "creator_notes") ?? be(r, "creatorcomment"),
    tags: oh(r, "tags") ?? oh(e, "tags"),
    extensions: s,
    preserved: { format: t, payload: e },
    diagnostics: n
  };
}
function o1(e) {
  const t = be(e, "spec"), n = Ga(e, "data"), r = be(e, "spec_version") ?? _i(e, "spec_version")?.toString() ?? (n === void 0 ? void 0 : be(n, "spec_version") ?? _i(n, "spec_version")?.toString());
  return t?.toLowerCase().includes("chara_card_v3") || r === "3" || r?.startsWith("3.") ? "st_v3" : t?.toLowerCase().includes("chara_card_v2") || r === "2" || r?.startsWith("2.") || Ga(e, "data") !== void 0 ? "st_v2" : be(e, "char_name") !== void 0 || be(e, "name") !== void 0 ? "st_v1" : "unknown_json";
}
function l1(e, t) {
  const n = be(e, "spec") ?? be(t, "spec"), r = be(e, "spec_version") ?? _i(e, "spec_version")?.toString() ?? be(t, "spec_version") ?? _i(t, "spec_version")?.toString();
  if (!(n === void 0 && r === void 0))
    return { spec: n, spec_version: r };
}
function c1(e, t) {
  const n = u1(e);
  for (const r of n) {
    const s = d1(r);
    for (const i of s) {
      const o = f1(i);
      if (o !== void 0)
        return { payload: o, format: "png_st" };
    }
  }
  throw t.push({ severity: "warning", message: "PNG parsed successfully but no supported character metadata chunk was found." }), new Error("Invalid character card PNG: no SillyTavern metadata found");
}
function u1(e) {
  p1(e);
  const t = [];
  let n = Po.length;
  for (; n + 8 <= e.length; ) {
    const r = m1(e, n), s = h1(e, n + 4, n + 8), i = n + 8, o = i + r, c = o + 4;
    if (o > e.length || c > e.length)
      throw new Error("Invalid PNG: chunk length exceeds input size");
    const u = e.subarray(i, o);
    if (s === "tEXt") {
      const p = g1(u);
      t.push({ type: s, keyword: p.keyword, text: p.text });
    } else if (s === "iTXt") {
      const p = v1(u);
      p.compressionFlag !== 0 ? t.push({ type: s, keyword: p.keyword, text: "" }) : t.push({ type: s, keyword: p.keyword, text: p.text });
    } else s === "zTXt" && t.push({ type: s, keyword: dl(u).value, text: "" });
    if (n = c, s === "IEND")
      break;
  }
  return t;
}
function d1(e) {
  const t = [], n = e.keyword?.toLowerCase();
  (n === "chara" || n === "ccv3" || n === "character" || n === "metadata") && t.push(e.text);
  const r = e.text.trim();
  return (gy(r) || vy(r)) && t.push(r), t;
}
function f1(e) {
  const t = ih(e);
  if (t !== void 0)
    return t;
  if (vy(e)) {
    const n = n1(e);
    if (n !== void 0)
      return ih(n);
  }
}
function p1(e) {
  if (e.length < Po.length)
    throw new Error("Invalid PNG: input is too short");
  for (let t = 0; t < Po.length; t += 1)
    if (e[t] !== Po[t])
      throw new Error("Invalid PNG: bad signature");
}
function m1(e, t) {
  return (e[t] ?? 0) * 16777216 + ((e[t + 1] ?? 0) << 16) + ((e[t + 2] ?? 0) << 8) + (e[t + 3] ?? 0);
}
function h1(e, t, n) {
  return String.fromCharCode(...e.subarray(t, n));
}
function g1(e) {
  const t = dl(e);
  return { keyword: t.value, text: _y(e.subarray(t.nextOffset)) };
}
function v1(e) {
  const t = dl(e), n = e[t.nextOffset] ?? 0;
  let r = t.nextOffset + 2;
  const s = dl(e.subarray(r));
  r += s.nextOffset;
  const i = _1(e.subarray(r));
  return r += i.nextOffset, { keyword: t.value, compressionFlag: n, text: yy(e.subarray(r)) };
}
function dl(e) {
  const t = e.indexOf(0), n = t === -1 ? e.length : t;
  return { value: _y(e.subarray(0, n)), nextOffset: t === -1 ? e.length : t + 1 };
}
function _1(e) {
  const t = e.indexOf(0), n = t === -1 ? e.length : t;
  return { value: yy(e.subarray(0, n)), nextOffset: t === -1 ? e.length : t + 1 };
}
function _y(e) {
  return new TextDecoder("latin1").decode(e);
}
function yy(e) {
  return new TextDecoder().decode(e);
}
function y1(e) {
  const t = [], n = typeof e == "string" ? t1(e) : e, s = x1(n, t).filter((o) => !gr(o, "is_deleted") && !gr(o, "deleted")).map((o, c) => b1(o, c, t));
  return {
    kind: "chat_history",
    chat: {
      id: id("chat", 0),
      meta: {
        title: er(n) ? be(n, "name") ?? be(n, "title") : void 0,
        character_id: er(n) ? be(n, "character_id") : void 0,
        group_id: er(n) ? be(n, "group_id") : void 0,
        persona_id: er(n) ? be(n, "persona_id") : void 0,
        source_format: "sillytavern_jsonl"
      },
      turns: s
    },
    preserved: { format: "sillytavern_chat", payload: s1(n) },
    diagnostics: t
  };
}
function x1(e, t) {
  let n;
  return er(e) ? n = e.messages ?? e.chat ?? e.data : n = e, Array.isArray(n) ? n.filter((r, s) => {
    const i = er(r);
    return i || t.push({ severity: "warning", message: "Skipping non-object chat message.", path: `messages.${s}` }), i;
  }) : (t.push({ severity: "warning", message: "Chat payload has no message array; returning empty chat." }), []);
}
function b1(e, t, n) {
  const r = gr(e, "is_user") ?? !1, i = gr(e, "is_system") ?? !1 ? "system" : r ? "user" : "assistant", o = be(e, "mes") ?? be(e, "text") ?? be(e, "content") ?? "";
  o.length === 0 && n.push({ severity: "warning", message: "Chat message has empty text.", path: `messages.${t}.mes` });
  const c = w1(be(e, "send_date")) ?? _i(e, "created_at") ?? 0, u = {
    id: id("variant", t),
    subs: [{ kind: "text", text: o }],
    meta: { raw: a1(e, ["mes", "text", "content"]) },
    created_at: c
  };
  return {
    id: id("turn", t),
    index: t,
    role: i,
    speaker: { name: be(e, "name") ?? i, kind: i === "assistant" ? "character" : i === "user" ? "user" : "system" },
    variants: [u],
    active_variant: 0,
    source: "imported",
    hidden: gr(e, "is_hidden") ?? gr(e, "hidden"),
    created_at: c,
    deleted: gr(e, "deleted") ?? gr(e, "is_deleted")
  };
}
function w1(e) {
  if (e === void 0)
    return;
  const t = Date.parse(e);
  return Number.isFinite(t) ? t : void 0;
}
function id(e, t) {
  return `${e}_${t.toString().padStart(6, "0")}`;
}
const S1 = {
  spec: "chara_card_v2",
  spec_version: "2.0",
  data: {
    name: "Aria",
    description: "Meticulous executive assistant. Calendar-first, agenda-driven.",
    personality: "Precise, warm, allergic to vague action items.",
    first_mes: "Morning. What are we trying to ship today?",
    tags: ["assistant", "planning"]
  }
}, k1 = [
  JSON.stringify({
    user_name: "You",
    character_name: "Aria",
    chat_metadata: { tainted: !1 }
  }),
  JSON.stringify({
    name: "You",
    is_user: !0,
    send_date: "2026-05-20T16:00:00.000Z",
    mes: "Pull tomorrow's calendar and draft an agenda."
  }),
  JSON.stringify({
    name: "Aria",
    is_user: !1,
    send_date: "2026-05-20T16:00:42.000Z",
    mes: "On it. 45 minutes, four blocks."
  })
].join(`
`);
function N1() {
  const { card: e, history: t } = P.useMemo(() => ({
    card: i1(S1),
    history: y1(k1)
  }), []);
  return /* @__PURE__ */ a.jsxs("section", { className: "diag-panel diag-panel-importers", children: [
    /* @__PURE__ */ a.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ a.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/importers" }),
      /* @__PURE__ */ a.jsx("h2", { children: "SillyTavern asset roundtrip" }),
      /* @__PURE__ */ a.jsxs("p", { className: "diag-panel-lede", children: [
        "Two tiny inline fixtures fed through ",
        /* @__PURE__ */ a.jsx("code", { children: "importCharacterCard" }),
        " and",
        /* @__PURE__ */ a.jsx("code", { children: "importChatHistory" }),
        "; output is the same Turn / Chat shape the renderer above consumes."
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("dl", { className: "diag-grid", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "diag-cell", children: [
        /* @__PURE__ */ a.jsx("dt", { children: "card.format" }),
        /* @__PURE__ */ a.jsx("dd", { children: /* @__PURE__ */ a.jsx("code", { children: e.format }) })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "diag-cell", children: [
        /* @__PURE__ */ a.jsx("dt", { children: "card.name" }),
        /* @__PURE__ */ a.jsx("dd", { children: e.name })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "diag-cell", children: [
        /* @__PURE__ */ a.jsx("dt", { children: "chat.turns" }),
        /* @__PURE__ */ a.jsx("dd", { className: "value-large", children: t.chat.turns.length })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "diag-cell", children: [
        /* @__PURE__ */ a.jsx("dt", { children: "source_format" }),
        /* @__PURE__ */ a.jsx("dd", { children: /* @__PURE__ */ a.jsx("code", { children: t.chat.meta.source_format ?? "—" }) })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "diag-cell diag-cell-full", children: [
        /* @__PURE__ */ a.jsx("dt", { children: "diagnostics" }),
        /* @__PURE__ */ a.jsx("dd", { children: e.diagnostics.length + t.diagnostics.length === 0 ? "no warnings" : [...e.diagnostics, ...t.diagnostics].map((n) => n.message).join("; ") })
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("p", { className: "diag-footnote", children: [
      "Imported turns carry ",
      /* @__PURE__ */ a.jsx("code", { children: "source: ‘imported’" }),
      " and a",
      /* @__PURE__ */ a.jsx("code", { children: "preserved" }),
      " payload so the original ST blob round-trips losslessly."
    ] })
  ] });
}
const j1 = {
  name: "surface-wi-fixture",
  entries: [
    {
      uid: "wi_surf_01",
      comment: 'Activates on "product" — inserted before instruction.',
      key: ["product"],
      content: "Cross-reference release notes before proposing the agenda.",
      position: "before",
      order: 0
    },
    {
      uid: "wi_surf_02",
      comment: 'Activates on "calendar" — inserted after history.',
      key: ["calendar"],
      content: "The calendar tool returns events in the Los Angeles timezone.",
      position: "after",
      order: 10
    },
    {
      uid: "wi_surf_03",
      comment: 'AuthorNote top — activated by "review".',
      key: ["review"],
      content: "Attendee list: Product, Engineering, Design, QA.",
      position: "ANTop",
      order: 20
    },
    {
      uid: "wi_surf_04",
      comment: 'AuthorNote bottom — activated by "agenda".',
      key: ["agenda"],
      content: "Keep total runtime under 45 minutes unless flagged.",
      position: "ANBottom",
      order: 30
    },
    {
      uid: "wi_surf_05_depth",
      comment: 'atDepth assistant injection preview — activated by "review".',
      key: ["review"],
      content: "Depth reminder: compare the last assistant answer against the agenda.",
      position: "atDepth",
      depth: 1,
      role: "assistant",
      order: 35
    },
    {
      uid: "wi_surf_06_group_a",
      comment: "Seeded group candidate A.",
      key: ["product"],
      content: "Group A: emphasize release risk.",
      position: "before",
      group: "surface-group",
      useProbability: !0,
      probability: 100,
      groupWeight: 1,
      order: 40
    },
    {
      uid: "wi_surf_07_group_b",
      comment: "Seeded group candidate B.",
      key: ["product"],
      content: "Group B: emphasize customer impact.",
      position: "before",
      group: "surface-group",
      useProbability: !0,
      probability: 100,
      groupWeight: 3,
      order: 41
    },
    {
      uid: "wi_surf_08_timed",
      comment: 'Sticky/cooldown preview — activated by "calendar".',
      key: ["calendar"],
      content: "Sticky note: check calendar conflicts before finalizing.",
      position: "after",
      sticky: 2,
      cooldown: 1,
      order: 45
    },
    {
      uid: "wi_surf_09",
      comment: "Disabled entry — should always be skipped.",
      key: ["demo"],
      content: "This content should never appear.",
      disabled: !0,
      position: "before",
      order: 5
    }
  ]
};
function E1(e, t) {
  const n = e.getContext();
  return P.useMemo(() => {
    const r = wb({
      chat: t,
      book: j1,
      scanDepth: 4,
      budget: { type: "characters", max: 2e3 },
      generationType: "normal",
      chatLength: t.turns.length,
      randomValues: [0.72, 0.24, 0.83],
      authorNote: "Always include time-boxed agenda items.",
      macroContext: {
        user: n.name1,
        char: n.name2
      }
    }), s = W0({
      userName: n.name1,
      character: {
        name: n.name2,
        description: "A meticulous executive assistant who values calendar accuracy and tight agendas.",
        personality: "Organized, concise, proactive.",
        scenario: "You are preparing for a product review meeting with cross-functional stakeholders."
      },
      persona: "Focused professional",
      authorNote: "Always include time-boxed agenda items.",
      instruct: "You are {{char}}. {{user}} is your team lead.",
      postHistory: "End every response with a concrete next step.",
      worldInfo: r,
      promptManager: {
        generationType: "normal",
        prompts: [
          { identifier: "main", content: "Surface main prompt for {{char}}.", marker: !1, role: "system" },
          { identifier: "worldInfoBefore", marker: !0, role: "system" },
          { identifier: "personaDescription", marker: !0, role: "system" },
          { identifier: "charDescription", marker: !0, role: "system" },
          { identifier: "scenario", marker: !0, role: "system" },
          { identifier: "worldInfoAfter", marker: !0, role: "system" },
          { identifier: "chatHistory", marker: !0, role: "system" },
          { identifier: "jailbreak", marker: !0, role: "system" }
        ],
        prompt_order: [
          { identifier: "main", enabled: !0 },
          { identifier: "worldInfoBefore", enabled: !0 },
          { identifier: "personaDescription", enabled: !0 },
          { identifier: "charDescription", enabled: !0 },
          { identifier: "scenario", enabled: !0 },
          { identifier: "worldInfoAfter", enabled: !0 },
          { identifier: "chatHistory", enabled: !0 },
          { identifier: "jailbreak", enabled: !0 }
        ]
      }
    }), i = Pa(
      "Hello {{char}}, it is {{time}} and {{user}} needs help.",
      {
        user: n.name1,
        char: n.name2
      }
    ).text;
    return { wi: r, critical: s, macroPreview: i };
  }, [t, n.name1, n.name2]);
}
function C1({ runtime: e, chat: t }) {
  const { wi: n, critical: r, macroPreview: s } = E1(e, t);
  return /* @__PURE__ */ a.jsxs("section", { className: "diag-panel diag-panel-prompt-critical", children: [
    /* @__PURE__ */ a.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ a.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/engine-core" }),
      /* @__PURE__ */ a.jsx("h2", { children: "Prompt-critical & World Info" }),
      /* @__PURE__ */ a.jsxs("p", { className: "diag-panel-lede", children: [
        /* @__PURE__ */ a.jsx("code", { children: "evaluateWorldInfo" }),
        " scans the live Chat;",
        " ",
        /* @__PURE__ */ a.jsx("code", { children: "buildPromptCriticalBlocks" }),
        " assembles character fields, instruct, author notes and WI buckets into ordered system blocks. Macro substitution is traced per field."
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("dl", { className: "diag-grid", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "diag-cell", children: [
        /* @__PURE__ */ a.jsx("dt", { children: "WI activated" }),
        /* @__PURE__ */ a.jsx("dd", { className: "value-large", children: n.activated.length })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "diag-cell", children: [
        /* @__PURE__ */ a.jsx("dt", { children: "WI skipped" }),
        /* @__PURE__ */ a.jsx("dd", { className: "value-large", children: n.skipped.length })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "diag-cell diag-cell-wide", children: [
        /* @__PURE__ */ a.jsx("dt", { children: "prompt manager" }),
        /* @__PURE__ */ a.jsx("dd", { children: r.diagnostics.markerMapping.map((i) => i.promptIdentifier).join(" / ") || "legacy order" })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "diag-cell diag-cell-wide", children: [
        /* @__PURE__ */ a.jsx("dt", { children: "blocks included" }),
        /* @__PURE__ */ a.jsx("dd", { children: r.diagnostics.includedBlocks.join(" / ") || "—" })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "diag-cell diag-cell-wide", children: [
        /* @__PURE__ */ a.jsx("dt", { children: "skipped fields" }),
        /* @__PURE__ */ a.jsx("dd", { children: r.diagnostics.skippedFields.join(" / ") || "—" })
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsx("h3", { children: "PromptManager marker mapping" }),
      r.diagnostics.markerMapping.length === 0 ? /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "No PromptManager mapping; using legacy fallback order." }) : /* @__PURE__ */ a.jsx("ul", { className: "diag-list", children: r.diagnostics.markerMapping.map((i, o) => /* @__PURE__ */ a.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-key", children: i.promptIdentifier }),
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-pos", children: i.marker ? "marker" : i.source }),
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-text", children: String(i.blockIdentifier) }),
        /* @__PURE__ */ a.jsxs("span", { className: "diag-list-meta", children: [
          "order ",
          i.order
        ] })
      ] }, `${i.promptIdentifier}-${o}`)) })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsx("h3", { children: "World Info activated entries" }),
      n.activated.length === 0 ? /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "No activated entries for the current scan depth." }) : /* @__PURE__ */ a.jsx("ul", { className: "diag-list", children: n.activated.map((i) => /* @__PURE__ */ a.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-key", children: i.id }),
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-pos", children: i.position }),
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-text", children: i.content }),
        /* @__PURE__ */ a.jsxs("span", { className: "diag-list-meta", children: [
          "keys: ",
          i.matchedKeys.join(", ") || "—"
        ] })
      ] }, i.id)) })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsx("h3", { children: "World Info skipped entries" }),
      n.skipped.length === 0 ? /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "Nothing skipped." }) : /* @__PURE__ */ a.jsx("ul", { className: "diag-list", children: n.skipped.map((i) => /* @__PURE__ */ a.jsxs("li", { className: "diag-list-item diag-list-item-dim", children: [
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-key", children: i.id }),
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-reason", children: i.reason })
      ] }, i.id)) })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsx("h3", { children: "WI buckets" }),
      /* @__PURE__ */ a.jsx("ul", { className: "diag-list", children: ["before", "after", "atDepth", "ANTop", "ANBottom", "outlet"].map((i) => /* @__PURE__ */ a.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-key", children: i }),
        /* @__PURE__ */ a.jsxs("span", { className: "diag-list-count", children: [
          n.buckets[i].length,
          " entr",
          n.buckets[i].length === 1 ? "y" : "ies"
        ] }),
        n.buckets[i].map((o, c) => /* @__PURE__ */ a.jsx("span", { className: "diag-list-text", children: o }, c))
      ] }, i)) })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsx("h3", { children: "WI routing trace" }),
      /* @__PURE__ */ a.jsx("ul", { className: "diag-list", children: n.diagnostics.routingTrace.map((i, o) => /* @__PURE__ */ a.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-key", children: i.entryId }),
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-pos", children: i.bucket }),
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-text", children: i.inserted ? "inserted into prompt-critical bucket" : i.note || "diagnostic route only" }),
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-meta", children: i.depth !== void 0 ? `depth ${i.depth}` : i.outletName ? `outlet ${i.outletName}` : i.position })
      ] }, `${i.entryId}-${o}`)) })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection diag-split", children: [
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("h3", { children: "atDepth / EM / outlet" }),
        /* @__PURE__ */ a.jsxs("ul", { className: "diag-list", children: [
          n.buckets.depthEntries.map((i) => /* @__PURE__ */ a.jsxs("li", { className: "diag-list-item", children: [
            /* @__PURE__ */ a.jsxs("span", { className: "diag-list-key", children: [
              "depth ",
              i.depth
            ] }),
            /* @__PURE__ */ a.jsx("span", { className: "diag-list-pos", children: i.role }),
            /* @__PURE__ */ a.jsx("span", { className: "diag-list-text", children: i.content })
          ] }, `${i.depth}-${i.role}`)),
          n.buckets.em.map((i, o) => /* @__PURE__ */ a.jsxs("li", { className: "diag-list-item", children: [
            /* @__PURE__ */ a.jsxs("span", { className: "diag-list-key", children: [
              "EM ",
              i.position
            ] }),
            /* @__PURE__ */ a.jsx("span", { className: "diag-list-text", children: i.content })
          ] }, `em-${o}`)),
          Object.entries(n.buckets.outlets).map(([i, o]) => /* @__PURE__ */ a.jsxs("li", { className: "diag-list-item", children: [
            /* @__PURE__ */ a.jsxs("span", { className: "diag-list-key", children: [
              "outlet ",
              i
            ] }),
            /* @__PURE__ */ a.jsx("span", { className: "diag-list-text", children: o.content.join(" / ") })
          ] }, i))
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("h3", { children: "Author Note patch" }),
        /* @__PURE__ */ a.jsx("pre", { className: "diag-code-block", children: n.buckets.anPatch.patched || "—" })
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsx("h3", { children: "WI advanced trace" }),
      /* @__PURE__ */ a.jsx("ul", { className: "diag-list", children: n.diagnostics.activationTrace.filter((i) => ["probability_roll", "probability_failed", "group_candidate", "group_winner", "group_loser", "group_scoring_loser", "sticky_active", "cooldown_active", "delay_active"].includes(i.code)).slice(0, 12).map((i, o) => /* @__PURE__ */ a.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-key", children: i.code }),
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-pos", children: i.entryId }),
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-text", children: i.reason }),
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-meta", children: i.group ? `group ${i.group}` : i.roll !== void 0 ? `roll ${i.roll.toFixed(2)}` : "" })
      ] }, `${i.entryId}-${i.code}-${o}`)) }),
      /* @__PURE__ */ a.jsxs("p", { className: "diag-footnote", children: [
        "nextState sticky: ",
        n.nextState.sticky?.length ?? 0,
        "; cooldown: ",
        n.nextState.cooldown?.length ?? 0
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsx("h3", { children: "Prompt-critical blocks" }),
      /* @__PURE__ */ a.jsx("ul", { className: "diag-list", children: r.blocks.map((i) => /* @__PURE__ */ a.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-key", children: String(i.identifier) }),
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-pos", children: i.role }),
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-text", children: i.content })
      ] }, i.identifier)) })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsx("h3", { children: "Macro trace" }),
      r.diagnostics.macroTrace.length === 0 ? /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "No macros substituted in prompt-critical fields." }) : /* @__PURE__ */ a.jsx("ul", { className: "diag-list", children: r.diagnostics.macroTrace.map((i, o) => /* @__PURE__ */ a.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-key", children: i.name }),
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-pos", children: i.source }),
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-text", children: i.preview })
      ] }, `${i.name}-${o}`)) }),
      /* @__PURE__ */ a.jsxs("p", { className: "diag-footnote", children: [
        "Quick macro preview: ",
        /* @__PURE__ */ a.jsx("code", { children: s })
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsx("h3", { children: "Diagnostics warnings" }),
      [...n.diagnostics.warnings, ...r.diagnostics.warnings].length === 0 ? /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "No warnings." }) : /* @__PURE__ */ a.jsx("ul", { className: "diag-list", children: [...n.diagnostics.warnings, ...r.diagnostics.warnings].map((i, o) => /* @__PURE__ */ a.jsx("li", { className: "diag-list-item diag-list-item-dim", children: /* @__PURE__ */ a.jsx("span", { className: "diag-list-text", children: i }) }, o)) }),
      r.diagnostics.knownDeltas.length > 0 && /* @__PURE__ */ a.jsxs("p", { className: "diag-footnote", children: [
        "Known deltas: ",
        r.diagnostics.knownDeltas.join(" / ")
      ] })
    ] })
  ] });
}
const T1 = `/setvar mood focused
/gen hello world`;
function I1({ runtime: e }) {
  const t = e.getContext(), [n, r] = P.useState(T1), [s, i] = P.useState(null), o = P.useCallback(() => {
    const h = t.executeSlashCommands(n);
    i(h);
  }, [n, t]), c = P.useCallback(
    (h) => {
      h.key === "Enter" && (h.metaKey || h.ctrlKey) && o();
    },
    [o]
  ), u = t.slashCommands(), p = t.slashDiagnostics;
  return /* @__PURE__ */ a.jsxs("section", { className: "diag-panel diag-panel-slash", children: [
    /* @__PURE__ */ a.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ a.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/st-compat · slash" }),
      /* @__PURE__ */ a.jsx("h2", { children: "Slash diagnostics" }),
      /* @__PURE__ */ a.jsxs("p", { className: "diag-panel-lede", children: [
        "A thin diagnostic slice over the live ST context slash host. Input is executed through ",
        /* @__PURE__ */ a.jsx("code", { children: "executeSlashCommands" }),
        "; results, variables, registered commands and diagnostics are surfaced below."
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "slash-input-block", children: [
      /* @__PURE__ */ a.jsx(
        "textarea",
        {
          className: "slash-input",
          rows: 3,
          value: n,
          onChange: (h) => r(h.target.value),
          onKeyDown: c,
          placeholder: "Type slash commands, one per line…",
          "aria-label": "Slash command input"
        }
      ),
      /* @__PURE__ */ a.jsx("button", { type: "button", className: "chat-button chat-button-send", onClick: o, children: "Execute" })
    ] }),
    /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "Press Ctrl/Cmd + Enter to run." }),
    s && /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsx("h3", { children: "Result" }),
      /* @__PURE__ */ a.jsxs("dl", { className: "diag-grid", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "diag-cell", children: [
          /* @__PURE__ */ a.jsx("dt", { children: "ok" }),
          /* @__PURE__ */ a.jsx("dd", { className: s.ok ? "value-ok" : "value-error", children: s.ok ? "true" : "false" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "diag-cell", children: [
          /* @__PURE__ */ a.jsx("dt", { children: "executions" }),
          /* @__PURE__ */ a.jsx("dd", { className: "value-large", children: s.executions.length })
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("h3", { className: "slash-subheading", children: "Execution log" }),
      s.executions.length === 0 ? /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "No commands executed." }) : /* @__PURE__ */ a.jsx("ul", { className: "slash-execution-list", children: s.executions.map((h, x) => /* @__PURE__ */ a.jsxs("li", { className: "slash-execution-item", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "slash-execution-header", children: [
          /* @__PURE__ */ a.jsxs("span", { className: "slash-name", children: [
            "/",
            h.name
          ] }),
          /* @__PURE__ */ a.jsx("span", { className: h.ok ? "slash-ok" : "slash-error", children: h.ok ? "ok" : "error" })
        ] }),
        /* @__PURE__ */ a.jsx("div", { className: "slash-raw", children: h.raw }),
        h.output && /* @__PURE__ */ a.jsx("div", { className: "slash-output", children: h.output }),
        h.diagnostics.length > 0 && /* @__PURE__ */ a.jsx("ul", { className: "slash-diag-list", children: h.diagnostics.map((g, w) => /* @__PURE__ */ a.jsxs("li", { className: "slash-diag-item", children: [
          /* @__PURE__ */ a.jsx("span", { className: "slash-diag-code", children: g.code }),
          /* @__PURE__ */ a.jsx("span", { children: g.message })
        ] }, w)) })
      ] }, x)) }),
      s.output && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
        /* @__PURE__ */ a.jsx("h3", { className: "slash-subheading", children: "Combined output" }),
        /* @__PURE__ */ a.jsx("pre", { className: "json-block", children: s.output })
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsx("h3", { children: "Variables" }),
      t.variables.size === 0 ? /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "No variables set yet — run /setvar to populate." }) : /* @__PURE__ */ a.jsx("ul", { className: "slash-execution-list", children: Array.from(t.variables.entries()).map(([h, x]) => /* @__PURE__ */ a.jsxs("li", { className: "slash-execution-item", children: [
        /* @__PURE__ */ a.jsx("span", { className: "slash-name", children: h }),
        /* @__PURE__ */ a.jsx("span", { className: "slash-output", children: x })
      ] }, h)) })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsxs("h3", { children: [
        "Registered commands (",
        u.length,
        ")"
      ] }),
      /* @__PURE__ */ a.jsx("ul", { className: "diag-list", children: u.map((h) => /* @__PURE__ */ a.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ a.jsxs("span", { className: "diag-list-key", children: [
          "/",
          h.name
        ] }),
        h.aliases.length > 0 && /* @__PURE__ */ a.jsxs("span", { className: "diag-list-meta", children: [
          "aliases: ",
          h.aliases.join(", ")
        ] })
      ] }, h.name)) })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsxs("h3", { children: [
        "Host diagnostics (",
        p.length,
        ")"
      ] }),
      p.length === 0 ? /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "No diagnostics captured yet." }) : /* @__PURE__ */ a.jsx("ul", { className: "slash-execution-list", children: p.map((h, x) => /* @__PURE__ */ a.jsxs("li", { className: "slash-execution-item", children: [
        /* @__PURE__ */ a.jsx("span", { className: "slash-diag-code", children: h.code }),
        /* @__PURE__ */ a.jsx("span", { children: h.message }),
        h.command && /* @__PURE__ */ a.jsxs("span", { className: "diag-list-meta", children: [
          "/",
          h.command
        ] })
      ] }, x)) })
    ] })
  ] });
}
const A1 = [
  "MESSAGE_SENT",
  "MESSAGE_RECEIVED",
  "GENERATION_STARTED",
  "STREAM_TOKEN_RECEIVED",
  "GENERATION_ENDED"
];
function P1({ runtime: e }) {
  const t = e.getContext(), n = t.chat[0], r = typeof n?.mes == "string" ? n.mes : "", s = r.length > 140 ? `${r.slice(0, 137)}…` : r, [i, o] = P.useState([]), c = P.useRef(/* @__PURE__ */ new Map());
  return P.useEffect(() => {
    const u = t.eventSource, p = A1.map((h) => {
      const x = t.event_types[h];
      return x ? [h, x] : void 0;
    }).filter((h) => h !== void 0);
    return p.forEach(([h, x]) => {
      const g = (...w) => {
        o((E) => {
          const I = JSON.stringify(w).slice(0, 180);
          return [
            { type: h, time: (/* @__PURE__ */ new Date()).toLocaleTimeString(), payload: I },
            ...E
          ].slice(0, 10);
        });
      };
      c.current.set(x, g), u.on(x, g);
    }), () => {
      p.forEach(([h, x]) => {
        const g = c.current.get(x);
        g && (u.off(x, g), c.current.delete(x));
      });
    };
  }, [t.eventSource, t.event_types]), /* @__PURE__ */ a.jsxs("section", { className: "diag-panel diag-panel-st", children: [
    /* @__PURE__ */ a.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ a.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/st-compat" }),
      /* @__PURE__ */ a.jsx("h2", { children: "ST compatibility projection" }),
      /* @__PURE__ */ a.jsxs("p", { className: "diag-panel-lede", children: [
        "The Turn-shaped chat projected through the legacy SillyTavern",
        " ",
        /* @__PURE__ */ a.jsx("code", { children: "chat[]" }),
        " / ",
        /* @__PURE__ */ a.jsx("code", { children: "eventSource" }),
        " / ",
        /* @__PURE__ */ a.jsx("code", { children: "getContext()" }),
        " ",
        "surface. This panel is wired to a live runtime — addOneMessage, Generate, and proxy edits are all functional contract-backed operations."
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("dl", { className: "diag-grid", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "diag-cell diag-cell-wide", children: [
        /* @__PURE__ */ a.jsx("dt", { children: "chat.length" }),
        /* @__PURE__ */ a.jsx("dd", { className: "value-large", children: t.chat.length })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "diag-cell diag-cell-wide", children: [
        /* @__PURE__ */ a.jsx("dt", { children: "chat[0].is_user" }),
        /* @__PURE__ */ a.jsx("dd", { children: String(n?.is_user ?? !1) })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "diag-cell diag-cell-full", children: [
        /* @__PURE__ */ a.jsx("dt", { children: "chat[0].mes" }),
        /* @__PURE__ */ a.jsxs("dd", { className: "value-quote", children: [
          "“",
          s,
          "”"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-events", children: [
      /* @__PURE__ */ a.jsx("h3", { children: "Recent events" }),
      i.length === 0 ? /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "No events yet — send a message or run Fake Generate to populate." }) : /* @__PURE__ */ a.jsx("ul", { className: "event-log", children: i.map((u, p) => /* @__PURE__ */ a.jsxs("li", { className: "event-log-item", children: [
        /* @__PURE__ */ a.jsx("span", { className: "event-log-time", children: u.time }),
        /* @__PURE__ */ a.jsx("span", { className: "event-log-type", children: u.type }),
        /* @__PURE__ */ a.jsx("span", { className: "event-log-payload", children: u.payload })
      ] }, `${u.type}-${u.time}-${p}`)) }),
      /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "Listening to MESSAGE_SENT, MESSAGE_RECEIVED, GENERATION_STARTED, STREAM_TOKEN_RECEIVED, GENERATION_ENDED via eventSource." })
    ] })
  ] });
}
function R1() {
  return /* @__PURE__ */ a.jsxs("section", { className: "diag-panel diag-panel-prompt-manager", children: [
    /* @__PURE__ */ a.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ a.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }),
      /* @__PURE__ */ a.jsx("h2", { children: "PromptManager inspector" })
    ] }),
    /* @__PURE__ */ a.jsxs("p", { className: "diag-panel-lede", children: [
      "No compile result yet. The PromptManager inspector surfaces the effective prompt order after compilation — including marker resolution, override application, and generation-trigger filtering. Once the host bridge provides a ",
      /* @__PURE__ */ a.jsx("code", { children: "result" }),
      " prop, ordered prompts, overrides, and diagnostics will appear here."
    ] })
  ] });
}
function M1({ source: e }) {
  const t = e === "input" ? "diag-badge diag-badge-input" : e === "default" ? "diag-badge diag-badge-default" : e === "anchor" ? "diag-badge diag-badge-anchor" : "diag-badge", n = e ?? "unknown";
  return /* @__PURE__ */ a.jsx("span", { className: t, children: n });
}
function D1({
  result: e
}) {
  if (!e) return /* @__PURE__ */ a.jsx(R1, {});
  const { prompts: t, collection: n, diagnostics: r } = e, s = n?.overriddenPrompts ?? [], i = n?.triggerSkipped ?? [], o = r?.warnings ?? [], c = [];
  if (t)
    for (const u of t)
      u.source === "anchor" && u.enabled === !1 && c.push(u.identifier);
  return /* @__PURE__ */ a.jsxs("section", { className: "diag-panel diag-panel-prompt-manager", children: [
    /* @__PURE__ */ a.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ a.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }),
      /* @__PURE__ */ a.jsx("h2", { children: "PromptManager inspector" }),
      /* @__PURE__ */ a.jsx("p", { className: "diag-panel-lede", children: "Compiled prompt order from ST’s PromptManager. Each entry shows identifier, role, marker badge, and source category. Disabled-but-anchored prompts are highlighted; overridden prompts appear with their status." })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsxs("h3", { children: [
        "Effective prompt order",
        t ? /* @__PURE__ */ a.jsxs("span", { className: "diag-list-count", children: [
          " (",
          t.length,
          ")"
        ] }) : null
      ] }),
      !t || t.length === 0 ? /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "No prompts in the compiled order." }) : /* @__PURE__ */ a.jsx("ul", { className: "diag-list", role: "list", "aria-label": "Effective prompt order", children: t.map((u, p) => {
        const h = u.source === "anchor" && u.enabled === !1, x = i.includes(u.identifier), g = [
          "diag-list-item",
          h ? "diag-highlight" : "",
          x ? "diag-trigger-skipped" : ""
        ].filter(Boolean).join(" ");
        return /* @__PURE__ */ a.jsxs("li", { className: g, children: [
          /* @__PURE__ */ a.jsx("span", { className: "diag-list-key", children: u.identifier }),
          u.role ? /* @__PURE__ */ a.jsx("span", { className: "diag-list-pos", children: u.role }) : null,
          u.marker ? /* @__PURE__ */ a.jsx("span", { className: "diag-badge diag-badge-marker", children: "marker" }) : null,
          /* @__PURE__ */ a.jsx(M1, { source: u.source }),
          /* @__PURE__ */ a.jsx("span", { className: "diag-list-text", children: u.content ? u.content.length > 80 ? `${u.content.slice(0, 77)}…` : u.content : "(empty)" }),
          h ? /* @__PURE__ */ a.jsx("span", { className: "diag-list-reason", children: "disabled anchor" }) : null,
          x ? /* @__PURE__ */ a.jsx("span", { className: "diag-list-meta", children: "triggerSkipped" }) : null
        ] }, u.identifier ?? p);
      }) })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsxs("h3", { children: [
        "Override status",
        s.length > 0 ? /* @__PURE__ */ a.jsxs("span", { className: "diag-list-count", children: [
          " (",
          s.length,
          ")"
        ] }) : null
      ] }),
      s.length === 0 ? /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "No prompt overrides applied." }) : /* @__PURE__ */ a.jsx("ul", { className: "diag-list", role: "list", "aria-label": "Prompt overrides", children: s.map((u, p) => /* @__PURE__ */ a.jsxs(
        "li",
        {
          className: `diag-list-item${u.status === "blocked" ? " diag-prompt-blocked" : ""}`,
          children: [
            /* @__PURE__ */ a.jsx("span", { className: "diag-list-key", children: u.identifier }),
            /* @__PURE__ */ a.jsx(
              "span",
              {
                className: u.status === "applied" ? "diag-list-pos" : "diag-list-reason",
                children: u.status
              }
            ),
            u.reason ? /* @__PURE__ */ a.jsx("span", { className: "diag-list-text", children: u.reason }) : null
          ]
        },
        `${u.identifier}-${p}`
      )) })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsxs("h3", { children: [
        "Generation trigger filter",
        i.length > 0 ? /* @__PURE__ */ a.jsxs("span", { className: "diag-list-count", children: [
          " (",
          i.length,
          ")"
        ] }) : null
      ] }),
      i.length === 0 ? /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "No prompts were skipped by the generation trigger filter." }) : /* @__PURE__ */ a.jsx("ul", { className: "diag-list", role: "list", "aria-label": "Trigger-skipped prompts", children: i.map((u) => /* @__PURE__ */ a.jsxs("li", { className: "diag-list-item diag-list-item-dim", children: [
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-key", children: u }),
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-reason", children: "triggerSkipped" })
      ] }, u)) })
    ] }),
    o.length > 0 ? /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsx("h3", { children: "Warnings" }),
      /* @__PURE__ */ a.jsx("ul", { className: "diag-list", role: "list", "aria-label": "Diagnostic warnings", children: o.map((u, p) => /* @__PURE__ */ a.jsx("li", { className: "diag-list-item diag-list-item-dim", children: /* @__PURE__ */ a.jsx("span", { className: "diag-list-text", children: u }) }, p)) })
    ] }) : null
  ] });
}
const O1 = {
  before: "Before",
  after: "After",
  ANTop: "AN Top",
  ANBottom: "AN Bottom",
  atDepth: "At Depth",
  EM: "EM"
};
function L1() {
  return /* @__PURE__ */ a.jsxs("section", { className: "diag-panel diag-panel-world-info", children: [
    /* @__PURE__ */ a.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ a.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }),
      /* @__PURE__ */ a.jsx("h2", { children: "World Info inspector" })
    ] }),
    /* @__PURE__ */ a.jsxs("p", { className: "diag-panel-lede", children: [
      "No routing result yet. The World Info inspector displays activated entries grouped by bucket (before, after, ANTop, ANBottom, atDepth, EM, outlets), author note patch breakdown, and outlet summaries. Once the host bridge provides a ",
      /* @__PURE__ */ a.jsx("code", { children: "result" }),
      " prop, the full routing output will appear here."
    ] })
  ] });
}
function ks(e, t = 120) {
  return e.length <= t ? e : `${e.slice(0, t - 3)}…`;
}
function z1({
  result: e
}) {
  if (!e) return /* @__PURE__ */ a.jsx(L1, {});
  const { buckets: t, anPatch: n } = e, r = [
    "before",
    "after",
    "ANTop",
    "ANBottom",
    "EM"
  ];
  return /* @__PURE__ */ a.jsxs("section", { className: "diag-panel diag-panel-world-info", children: [
    /* @__PURE__ */ a.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ a.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }),
      /* @__PURE__ */ a.jsx("h2", { children: "World Info inspector" }),
      /* @__PURE__ */ a.jsx("p", { className: "diag-panel-lede", children: "Routed World Info entries grouped by insertion bucket. Each entry shows its order and truncated content preview. Author note patches detail how AN content is assembled from top, original, and bottom fragments." })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsx("h3", { children: "Activated entries by bucket" }),
      /* @__PURE__ */ a.jsxs("ul", { className: "diag-bucket-list", role: "list", "aria-label": "World Info buckets", children: [
        r.map((s) => {
          const i = t[s];
          if (!i || i.length === 0) return null;
          const o = O1[s] ?? s, c = i.length;
          return /* @__PURE__ */ a.jsxs("details", { className: "diag-bucket-item", open: !0, children: [
            /* @__PURE__ */ a.jsxs("summary", { className: "diag-bucket-header", role: "button", "aria-label": `${o} bucket`, children: [
              o,
              /* @__PURE__ */ a.jsxs("span", { className: "diag-bucket-count", children: [
                c,
                " entr",
                c === 1 ? "y" : "ies"
              ] })
            ] }),
            /* @__PURE__ */ a.jsx("div", { className: "diag-bucket-body", children: /* @__PURE__ */ a.jsx("ul", { className: "diag-list", role: "list", "aria-label": `${o} entries`, children: i.map((u, p) => /* @__PURE__ */ a.jsxs("li", { className: "diag-list-item", children: [
              /* @__PURE__ */ a.jsx("span", { className: "diag-list-key", children: u.id }),
              /* @__PURE__ */ a.jsxs("span", { className: "diag-list-pos", children: [
                "order ",
                u.order
              ] }),
              /* @__PURE__ */ a.jsx("span", { className: "diag-list-text", children: ks(u.content) })
            ] }, u.id ?? p)) }) })
          ] }, s);
        }),
        t.outlets && Object.keys(t.outlets).length > 0 ? Object.entries(t.outlets).map(([s, i]) => {
          const o = i.entries.length;
          return /* @__PURE__ */ a.jsxs("details", { className: "diag-bucket-item", open: !0, children: [
            /* @__PURE__ */ a.jsxs("summary", { className: "diag-bucket-header", role: "button", "aria-label": `Outlet ${s}`, children: [
              "outlet: ",
              s,
              /* @__PURE__ */ a.jsxs("span", { className: "diag-bucket-count", children: [
                o,
                " entr",
                o === 1 ? "y" : "ies"
              ] })
            ] }),
            /* @__PURE__ */ a.jsx("div", { className: "diag-bucket-body", children: /* @__PURE__ */ a.jsx("ul", { className: "diag-list", role: "list", "aria-label": `Outlet ${s} entries`, children: i.entries.map((c, u) => /* @__PURE__ */ a.jsxs("li", { className: "diag-list-item", children: [
              /* @__PURE__ */ a.jsx("span", { className: "diag-list-key", children: c.id }),
              /* @__PURE__ */ a.jsxs("span", { className: "diag-list-pos", children: [
                "order ",
                c.order
              ] }),
              /* @__PURE__ */ a.jsx("span", { className: "diag-list-text", children: ks(c.content) })
            ] }, c.id ?? u)) }) })
          ] }, `outlet-${s}`);
        }) : /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "No outlet entries routed." }),
        t.atDepth && t.atDepth.length > 0 ? null : /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "No atDepth entries routed." })
      ] })
    ] }),
    n ? /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsx("h3", { children: "Author note patch" }),
      /* @__PURE__ */ a.jsxs("div", { className: "diag-an-patch", "aria-label": "Author note patch breakdown", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "diag-an-patch-row", children: [
          /* @__PURE__ */ a.jsx("span", { className: "diag-an-patch-label", children: "top" }),
          /* @__PURE__ */ a.jsx("span", { className: "diag-list-text", children: ks(n.top, 80) })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "diag-an-patch-row", children: [
          /* @__PURE__ */ a.jsx("span", { className: "diag-an-patch-label", children: "original" }),
          /* @__PURE__ */ a.jsx("span", { className: "diag-list-text", children: ks(n.original, 80) })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "diag-an-patch-row", children: [
          /* @__PURE__ */ a.jsx("span", { className: "diag-an-patch-label", children: "bottom" }),
          /* @__PURE__ */ a.jsx("span", { className: "diag-list-text", children: ks(n.bottom, 80) })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "diag-an-patch-row", children: [
          /* @__PURE__ */ a.jsx("span", { className: "diag-an-patch-label" }),
          /* @__PURE__ */ a.jsx("span", { className: "diag-badge diag-badge-input", children: "→" }),
          /* @__PURE__ */ a.jsx("span", { className: "diag-list-text diag-an-patch-arrow", children: ks(n.patched, 120) })
        ] })
      ] })
    ] }) : null
  ] });
}
function B1() {
  return /* @__PURE__ */ a.jsxs("section", { className: "diag-panel diag-panel-stscript", children: [
    /* @__PURE__ */ a.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ a.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }),
      /* @__PURE__ */ a.jsx("h2", { children: "STScript inspector" })
    ] }),
    /* @__PURE__ */ a.jsxs("p", { className: "diag-panel-lede", children: [
      "No STScript runtime state available yet. The STScript inspector surfaces the command registry (registered commands with aliases), the scope chain (current variables and parent context), recent pipe values, and parser flag status. Connect a runtime via the ",
      /* @__PURE__ */ a.jsx("code", { children: "registry" }),
      ",",
      " ",
      /* @__PURE__ */ a.jsx("code", { children: "scope" }),
      ", ",
      /* @__PURE__ */ a.jsx("code", { children: "pipeHistory" }),
      ", and ",
      /* @__PURE__ */ a.jsx("code", { children: "flags" }),
      " props to populate this panel."
    ] })
  ] });
}
function $1(e) {
  if (e === null) return "null";
  if (e === void 0) return "undefined";
  if (typeof e == "string")
    return e.length > 60 ? `${e.slice(0, 57)}…` : e;
  if (typeof e == "object")
    try {
      const t = JSON.stringify(e);
      return t.length > 60 ? `${t.slice(0, 57)}…` : t;
    } catch {
      return String(e);
    }
  return String(e);
}
function H1(e) {
  if (e === null) return "null";
  if (e === void 0) return "undefined";
  if (typeof e == "string")
    return e.length > 120 ? `${e.slice(0, 117)}…` : e;
  if (typeof e == "object")
    try {
      const t = JSON.stringify(e);
      return t.length > 120 ? `${t.slice(0, 117)}…` : t;
    } catch {
      return String(e);
    }
  return String(e);
}
function xy({ scope: e }) {
  const t = Object.entries(e.variables);
  return /* @__PURE__ */ a.jsxs("div", { className: "diag-scope-card", role: "region", "aria-label": "Scope chain", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "diag-scope-header", children: [
      /* @__PURE__ */ a.jsx("span", { children: "Scope" }),
      /* @__PURE__ */ a.jsxs("span", { className: "diag-scope-depth", children: [
        t.length,
        " variable",
        t.length === 1 ? "" : "s"
      ] })
    ] }),
    t.length === 0 ? /* @__PURE__ */ a.jsx("div", { className: "diag-scope-vars", children: /* @__PURE__ */ a.jsx("span", { className: "diag-scope-var-value", style: { fontStyle: "italic" }, children: "No variables in this scope" }) }) : /* @__PURE__ */ a.jsx("div", { className: "diag-scope-vars", children: t.map(([n, r]) => /* @__PURE__ */ a.jsxs("div", { className: "diag-scope-var", children: [
      /* @__PURE__ */ a.jsx("span", { className: "diag-scope-var-name", children: n }),
      /* @__PURE__ */ a.jsx("span", { className: "diag-scope-var-value", title: String(r), children: $1(r) })
    ] }, n)) }),
    e.parent ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsx("div", { className: "diag-scope-parent", children: "↑ parent scope" }),
      /* @__PURE__ */ a.jsx(xy, { scope: e.parent })
    ] }) : null
  ] });
}
function F1({
  registry: e,
  scope: t,
  pipeHistory: n,
  flags: r
}) {
  return !e && !t && !n && !r ? /* @__PURE__ */ a.jsx(B1, {}) : /* @__PURE__ */ a.jsxs("section", { className: "diag-panel diag-panel-stscript", children: [
    /* @__PURE__ */ a.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ a.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }),
      /* @__PURE__ */ a.jsx("h2", { children: "STScript inspector" }),
      /* @__PURE__ */ a.jsx("p", { className: "diag-panel-lede", children: "STScript runtime state — command registry, scope chain, pipe history, and parser flags." })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsxs("h3", { children: [
        "Command registry",
        e ? /* @__PURE__ */ a.jsxs("span", { className: "diag-list-count", children: [
          " (",
          e.length,
          ")"
        ] }) : null
      ] }),
      !e || e.length === 0 ? /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "No commands registered." }) : /* @__PURE__ */ a.jsx("ul", { className: "diag-list", role: "list", "aria-label": "Registered commands", children: e.map((s, i) => /* @__PURE__ */ a.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "diag-command-row", children: [
          /* @__PURE__ */ a.jsx("span", { className: "diag-command-name", children: s.name }),
          s.aliases && s.aliases.length > 0 ? /* @__PURE__ */ a.jsxs("span", { className: "diag-command-aliases", children: [
            "aliases: ",
            s.aliases.join(", ")
          ] }) : null
        ] }),
        s.helpString ? /* @__PURE__ */ a.jsx("span", { className: "diag-command-help", children: s.helpString }) : null
      ] }, s.name ?? i)) })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsx("h3", { children: "Scope chain" }),
      t ? /* @__PURE__ */ a.jsx(xy, { scope: t }) : /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "No scope state available." })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsxs("h3", { children: [
        "Pipe history",
        n ? /* @__PURE__ */ a.jsxs("span", { className: "diag-list-count", children: [
          " (",
          n.length,
          ")"
        ] }) : null
      ] }),
      !n || n.length === 0 ? /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "No pipe values recorded yet." }) : /* @__PURE__ */ a.jsx("div", { className: "diag-pipe-history", role: "list", "aria-label": "Pipe history", children: n.map((s, i) => /* @__PURE__ */ a.jsxs("div", { className: "diag-pipe-item", role: "listitem", children: [
        "[",
        n.length - 1 - i,
        "] ",
        H1(s)
      ] }, i)) })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsx("h3", { children: "Parser flags" }),
      r ? /* @__PURE__ */ a.jsxs("ul", { className: "diag-flag-list", role: "list", "aria-label": "Parser flags", children: [
        /* @__PURE__ */ a.jsxs(
          "li",
          {
            className: `diag-flag-item${r.STRICT_ESCAPING ? " diag-flag-on" : " diag-flag-off"}`,
            children: [
              /* @__PURE__ */ a.jsx("span", { children: "STRICT_ESCAPING" }),
              /* @__PURE__ */ a.jsx("span", { children: r.STRICT_ESCAPING ? "ON" : "OFF" })
            ]
          }
        ),
        /* @__PURE__ */ a.jsxs(
          "li",
          {
            className: `diag-flag-item${r.REPLACE_GETVAR ? " diag-flag-on" : " diag-flag-off"}`,
            children: [
              /* @__PURE__ */ a.jsx("span", { children: "REPLACE_GETVAR" }),
              /* @__PURE__ */ a.jsx("span", { children: r.REPLACE_GETVAR ? "ON" : "OFF" })
            ]
          }
        )
      ] }) : /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "No parser flags available." })
    ] })
  ] });
}
function U1(e) {
  const t = {};
  for (const n of e)
    for (const r of n.steps) {
      const s = r.kind;
      s && (t[s] = (t[s] ?? 0) + 1);
    }
  return t;
}
function W1() {
  return /* @__PURE__ */ a.jsxs("section", { className: "diag-panel diag-panel-extensions", children: [
    /* @__PURE__ */ a.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ a.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }),
      /* @__PURE__ */ a.jsx("h2", { children: "Extensions inspector" })
    ] }),
    /* @__PURE__ */ a.jsxs("p", { className: "diag-panel-lede", children: [
      "No extension loader state available yet. The Extensions inspector surfaces the activation plan (which extensions were activated or skipped, and why), the disabled extensions store, registered generate interceptors, and a hook dispatch summary. Provide an ",
      /* @__PURE__ */ a.jsx("code", { children: "activationPlan" }),
      " and",
      " ",
      /* @__PURE__ */ a.jsx("code", { children: "disabled" }),
      " prop to populate this panel."
    ] })
  ] });
}
function G1({
  activationPlan: e,
  disabled: t
}) {
  if (!e && !t) return /* @__PURE__ */ a.jsx(W1, {});
  const n = e?.activated ?? [], r = e?.skipped ?? [], s = n.filter((o) => o.manifest.generate_interceptor).map((o) => ({
    id: o.id,
    name: o.manifest.generate_interceptor
  })), i = U1(n);
  return /* @__PURE__ */ a.jsxs("section", { className: "diag-panel diag-panel-extensions", children: [
    /* @__PURE__ */ a.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ a.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }),
      /* @__PURE__ */ a.jsx("h2", { children: "Extensions inspector" }),
      /* @__PURE__ */ a.jsx("p", { className: "diag-panel-lede", children: "Extension loader activation plan and runtime state — which extensions were loaded, skipped, or disabled, and their hook dispatch footprint." })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsxs("h3", { children: [
        "Activated extensions",
        n.length > 0 ? /* @__PURE__ */ a.jsxs("span", { className: "diag-list-count", children: [
          " (",
          n.length,
          ")"
        ] }) : null
      ] }),
      n.length === 0 ? /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "No extensions activated." }) : /* @__PURE__ */ a.jsx("ul", { className: "diag-list", role: "list", "aria-label": "Activated extensions", children: n.map((o) => /* @__PURE__ */ a.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-key", children: o.id }),
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-text", children: o.manifest.display_name }),
        /* @__PURE__ */ a.jsxs("span", { className: "diag-ext-steps", children: [
          o.steps.length,
          " step",
          o.steps.length === 1 ? "" : "s"
        ] }),
        o.manifest.generate_interceptor ? /* @__PURE__ */ a.jsxs("span", { className: "diag-ext-interceptor", children: [
          "interceptor: ",
          o.manifest.generate_interceptor
        ] }) : null
      ] }, o.id)) })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsxs("h3", { children: [
        "Skipped extensions",
        r.length > 0 ? /* @__PURE__ */ a.jsxs("span", { className: "diag-list-count", children: [
          " (",
          r.length,
          ")"
        ] }) : null
      ] }),
      r.length === 0 ? /* @__PURE__ */ a.jsx("p", { className: "diag-footnote", children: "No extensions were skipped." }) : /* @__PURE__ */ a.jsx("ul", { className: "diag-list", role: "list", "aria-label": "Skipped extensions", children: r.map((o) => /* @__PURE__ */ a.jsxs("li", { className: "diag-list-item diag-list-item-dim", children: [
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-key", children: o.id }),
        o.reasons.map((c, u) => /* @__PURE__ */ a.jsx("span", { className: "diag-list-reason", children: c }, u))
      ] }, o.id)) })
    ] }),
    t && t.length > 0 ? /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsxs("h3", { children: [
        "Disabled extensions store",
        /* @__PURE__ */ a.jsxs("span", { className: "diag-list-count", children: [
          " (",
          t.length,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("ul", { className: "diag-list", role: "list", "aria-label": "Disabled extension IDs", children: t.map((o) => /* @__PURE__ */ a.jsx("li", { className: "diag-list-item diag-list-item-dim", children: /* @__PURE__ */ a.jsx("span", { className: "diag-list-key", children: o }) }, o)) })
    ] }) : null,
    s.length > 0 ? /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsxs("h3", { children: [
        "Generate interceptors",
        /* @__PURE__ */ a.jsxs("span", { className: "diag-list-count", children: [
          " (",
          s.length,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("ul", { className: "diag-list", role: "list", "aria-label": "Generate interceptors", children: s.map((o) => /* @__PURE__ */ a.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-key", children: o.id }),
        /* @__PURE__ */ a.jsx("span", { className: "diag-list-text", children: o.name })
      ] }, o.id)) })
    ] }) : null,
    Object.keys(i).length > 0 ? /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsxs("h3", { children: [
        "Hook dispatch summary",
        /* @__PURE__ */ a.jsxs("span", { className: "diag-list-count", children: [
          " ",
          "(",
          Object.keys(i).length,
          " event",
          Object.keys(i).length === 1 ? "" : "s",
          ")"
        ] })
      ] }),
      /* @__PURE__ */ a.jsx(
        "div",
        {
          className: "diag-hook-summary",
          role: "list",
          "aria-label": "Hook dispatch counts per event",
          children: Object.entries(i).sort(([o], [c]) => o.localeCompare(c)).map(([o, c]) => /* @__PURE__ */ a.jsxs("div", { className: "diag-hook-cell", role: "listitem", children: [
            /* @__PURE__ */ a.jsx("span", { className: "diag-hook-event", children: o }),
            /* @__PURE__ */ a.jsx("span", { className: "diag-hook-count", children: c })
          ] }, o))
        }
      )
    ] }) : null
  ] });
}
function V1() {
  return /* @__PURE__ */ a.jsxs("section", { className: "diag-panel diag-panel-connector", children: [
    /* @__PURE__ */ a.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ a.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }),
      /* @__PURE__ */ a.jsx("h2", { children: "Connector inspector" })
    ] }),
    /* @__PURE__ */ a.jsxs("p", { className: "diag-panel-lede", children: [
      "No provider requests captured yet. The Connector inspector displays the request body per source, highlights stripped fields, and surfaces diagnostics notes. Provide a ",
      /* @__PURE__ */ a.jsx("code", { children: "requests" }),
      " array with source, body, and diagnostics to populate this panel."
    ] })
  ] });
}
function K1(e, t = 600) {
  try {
    const n = JSON.stringify(e, null, 2);
    return n.length <= t ? n : `${n.slice(0, t - 3)}…`;
  } catch {
    return String(e);
  }
}
function q1({
  requests: e
}) {
  return !e || e.length === 0 ? /* @__PURE__ */ a.jsx(V1, {}) : /* @__PURE__ */ a.jsxs("section", { className: "diag-panel diag-panel-connector", children: [
    /* @__PURE__ */ a.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ a.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }),
      /* @__PURE__ */ a.jsx("h2", { children: "Connector inspector" }),
      /* @__PURE__ */ a.jsx("p", { className: "diag-panel-lede", children: "Provider request body diff per source. Each entry shows the source name, the pretty-printed JSON payload, fields that were stripped before sending, and any diagnostic notes from the connector." })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ a.jsxs("h3", { children: [
        "Provider requests",
        /* @__PURE__ */ a.jsxs("span", { className: "diag-list-count", children: [
          " (",
          e.length,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("div", { role: "list", "aria-label": "Provider request snapshots", children: e.map((t, n) => /* @__PURE__ */ a.jsxs(
        "details",
        {
          className: "diag-request-card",
          open: n === 0,
          children: [
            /* @__PURE__ */ a.jsx(
              "summary",
              {
                className: "diag-request-header",
                role: "button",
                "aria-label": `Request from ${t.source}`,
                children: /* @__PURE__ */ a.jsx("span", { className: "diag-request-source", children: t.source })
              }
            ),
            /* @__PURE__ */ a.jsxs("div", { className: "diag-request-body", children: [
              t.diagnostics.stripped.length > 0 ? /* @__PURE__ */ a.jsxs(
                "div",
                {
                  className: "diag-subsection",
                  style: { marginBottom: 8 },
                  children: [
                    /* @__PURE__ */ a.jsxs("h3", { children: [
                      "Stripped fields",
                      /* @__PURE__ */ a.jsxs("span", { className: "diag-list-count", children: [
                        " ",
                        "(",
                        t.diagnostics.stripped.length,
                        ")"
                      ] })
                    ] }),
                    /* @__PURE__ */ a.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 }, children: t.diagnostics.stripped.map((r) => /* @__PURE__ */ a.jsx("span", { className: "diag-stripped-tag", children: r }, r)) })
                  ]
                }
              ) : null,
              t.diagnostics.notes.length > 0 ? /* @__PURE__ */ a.jsxs(
                "div",
                {
                  className: "diag-subsection",
                  style: { marginBottom: 8 },
                  children: [
                    /* @__PURE__ */ a.jsx("h3", { children: "Notes" }),
                    /* @__PURE__ */ a.jsx(
                      "ul",
                      {
                        className: "diag-notes-list",
                        role: "list",
                        "aria-label": "Diagnostic notes",
                        children: t.diagnostics.notes.map((r, s) => /* @__PURE__ */ a.jsxs("li", { className: "diag-notes-item", children: [
                          /* @__PURE__ */ a.jsx("span", { className: "diag-notes-bullet", children: "*" }),
                          /* @__PURE__ */ a.jsx("span", { children: r })
                        ] }, s))
                      }
                    )
                  ]
                }
              ) : null,
              /* @__PURE__ */ a.jsxs("div", { className: "diag-subsection", children: [
                /* @__PURE__ */ a.jsx("h3", { children: "Request body" }),
                /* @__PURE__ */ a.jsx("pre", { className: "json-block", children: K1(t.body) })
              ] })
            ] })
          ]
        },
        t.source ?? n
      )) })
    ] })
  ] });
}
function wC() {
  const e = ft();
  return e.showDiagnostics ? /* @__PURE__ */ a.jsxs("section", { className: "drawer-panel product-dev-panel", children: [
    /* @__PURE__ */ a.jsx("h2", { children: "Dev diagnostics" }),
    /* @__PURE__ */ a.jsxs("div", { className: "diag-stack compact", children: [
      /* @__PURE__ */ a.jsx(P1, { runtime: e.runtime }),
      /* @__PURE__ */ a.jsx(J3, { chat: e.liveChat }),
      /* @__PURE__ */ a.jsx(C1, { runtime: e.runtime, chat: e.liveChat }),
      /* @__PURE__ */ a.jsx(I1, { runtime: e.runtime }),
      /* @__PURE__ */ a.jsx(N1, {}),
      /* @__PURE__ */ a.jsx(D1, { result: null }),
      /* @__PURE__ */ a.jsx(z1, { result: null }),
      /* @__PURE__ */ a.jsx(F1, { registry: null, scope: null, pipeHistory: null, flags: null }),
      /* @__PURE__ */ a.jsx(G1, { activationPlan: null, disabled: null }),
      /* @__PURE__ */ a.jsx(q1, { requests: null })
    ] })
  ] }) : /* @__PURE__ */ a.jsxs("section", { className: "drawer-panel", children: [
    /* @__PURE__ */ a.jsx("h2", { children: "Dev diagnostics" }),
    /* @__PURE__ */ a.jsx("p", { children: "Diagnostics are disabled by the host." })
  ] });
}
const Y1 = ["ydltavern-surface", "tavern-surface", "tavern-surface-play"];
function Q1({ chat: e, showDiagnostics: t = !0, className: n, sessionId: r, projectId: s }) {
  return /* @__PURE__ */ a.jsx("div", { className: X1(Y1, n), children: /* @__PURE__ */ a.jsx(fg, { chat: e, showDiagnostics: t, sessionId: r, projectId: s, children: /* @__PURE__ */ a.jsx(B3, {}) }) });
}
function X1(e, t) {
  return t ? [...e, t].join(" ") : e.join(" ");
}
const Z1 = ["ydltavern-surface", "tavern-surface", "tavern-surface-settings"], J1 = ["Connection profiles & secret refs", "Sampler defaults & preset import", "Persona, avatar, theme", "Extension permissions & install"];
function eC({ className: e }) {
  return /* @__PURE__ */ a.jsxs("div", { className: tC(Z1, e), children: [
    /* @__PURE__ */ a.jsx(Y3, {}),
    /* @__PURE__ */ a.jsxs("aside", { className: "placeholder-card compact-card", children: [
      /* @__PURE__ */ a.jsx("span", { className: "placeholder-card-eyebrow", children: "next wiring" }),
      /* @__PURE__ */ a.jsx("ul", { className: "placeholder-list", children: J1.map((t) => /* @__PURE__ */ a.jsx("li", { children: t }, t)) })
    ] })
  ] });
}
function tC(e, t) {
  return t ? [...e, t].join(" ") : e.join(" ");
}
const nC = ["ydltavern-surface", "tavern-surface", "tavern-surface-extensions"], rC = ["Extension loader & sandbox boundary", "Registry, install, version pinning", "STScript / slash command host", "Built-in extensions catalog"];
function sC({ className: e }) {
  const t = [
    {
      id: "token-counter",
      manifest: {
        display_name: "Token analysis and prompt chunk accounting",
        version: "1.0",
        hooks: { activate: "Activate" }
      }
    },
    {
      id: "regex",
      manifest: {
        display_name: "GLOBAL/PRESET/SCOPED text transforms",
        version: "2.1",
        hooks: {}
      }
    },
    {
      id: "quick-reply",
      manifest: {
        display_name: "Quick reply sets and slash triggers",
        version: "1.5",
        hooks: { activate: "Activate", install: "Install" }
      }
    },
    {
      id: "memory",
      manifest: {
        display_name: "Summary insertion and update plans",
        version: "1.0",
        hooks: { activate: "Activate" }
      }
    },
    {
      id: "vectors",
      manifest: {
        display_name: "Retrieval index/query/injection plans",
        version: "0.9",
        hooks: {}
      }
    },
    {
      id: "loader",
      manifest: {
        display_name: "ST-style manifest discovery, permission gate, load plan",
        version: "1.0.0",
        hooks: {}
      }
    }
  ], n = {
    installedExtras: /* @__PURE__ */ new Set(),
    installedExtensions: new Set(t.map((r) => r.id)),
    disabledExtensions: /* @__PURE__ */ new Set(["memory"]),
    clientVersion: "1.13.0"
  };
  return /* @__PURE__ */ a.jsxs("div", { className: aC(nC, e), children: [
    /* @__PURE__ */ a.jsx(fy, { records: t, activationContext: n }),
    /* @__PURE__ */ a.jsxs("aside", { className: "placeholder-card compact-card", children: [
      /* @__PURE__ */ a.jsx("span", { className: "placeholder-card-eyebrow", children: "next wiring" }),
      /* @__PURE__ */ a.jsx("ul", { className: "placeholder-list", children: rC.map((r) => /* @__PURE__ */ a.jsx("li", { children: r }, r)) })
    ] })
  ] });
}
function aC(e, t) {
  return t ? [...e, t].join(" ") : e.join(" ");
}
function oa({
  drawerId: e,
  surfaceClassName: t,
  Drawer: n
}) {
  return function({ className: s, sessionId: i, projectId: o }) {
    return /* @__PURE__ */ a.jsx("div", { className: oC(["ydltavern-surface", "tavern-surface", t], s), children: /* @__PURE__ */ a.jsx(fg, { sessionId: i, projectId: o, children: /* @__PURE__ */ a.jsx(iC, { drawerId: e, Drawer: n }) }) });
  };
}
function iC({
  drawerId: e,
  Drawer: t
}) {
  const n = ft(), r = ry();
  return P.useEffect(() => {
    r.open(e);
  }, [e, r]), /* @__PURE__ */ a.jsx(ny, { theme: n.theme, children: /* @__PURE__ */ a.jsx("div", { className: "tavern-standalone-surface", "data-drawer-open": r.openId ?? "none", children: /* @__PURE__ */ a.jsx(t, { drawers: r }) }) });
}
function oC(e, t) {
  return t ? [...e, t].join(" ") : e.join(" ");
}
const lC = oa({
  drawerId: "characters",
  surfaceClassName: "tavern-surface-characters",
  Drawer: hy
}), cC = oa({
  drawerId: "world-info",
  surfaceClassName: "tavern-surface-world-info",
  Drawer: oy
}), uC = oa({
  drawerId: "persona",
  surfaceClassName: "tavern-surface-persona",
  Drawer: my
}), dC = oa({
  drawerId: "ai-config",
  surfaceClassName: "tavern-surface-ai-response-config",
  Drawer: ay
}), fC = oa({
  drawerId: "user-settings",
  surfaceClassName: "tavern-surface-user-settings",
  Drawer: uy
}), pC = oa({
  drawerId: "backgrounds",
  surfaceClassName: "tavern-surface-backgrounds",
  Drawer: dy
});
var by, ch = m_;
by = ch.createRoot, ch.hydrateRoot;
function lr(e) {
  return (t, n = {}) => {
    const r = mo(n, "sessionId") ?? mo(n, "session_id"), s = mo(n, "projectId") ?? mo(n, "project_id");
    Aw(n), Lo(r);
    const i = by(t);
    return i.render(J.createElement(e, { ...n, sessionId: r, projectId: s })), () => {
      i.unmount(), Lo(void 0), Pw();
    };
  };
}
function mo(e, t) {
  const n = e[t];
  return typeof n == "string" && n.length > 0 ? n : void 0;
}
const SC = lr(Q1), kC = lr(eC), NC = lr(sC), jC = lr(lC), EC = lr(cC), CC = lr(uC), TC = lr(dC), IC = lr(fC), AC = lr(pC);
export {
  ay as AIConfigDrawer,
  y3 as APIConnectionsDrawer,
  k3 as AdvancedFormattingDrawer,
  bC as AssetsPanel,
  Qh as BUILT_IN_THEMES,
  dy as BackgroundsDrawer,
  hy as CharactersDrawer,
  _C as ChatList,
  iy as ConnectionForm,
  q1 as ConnectorInspector,
  wC as DevDiagnosticsPanel,
  or as DrawerShell,
  J3 as EngineCorePreviewPanel,
  M3 as ExtensionsDrawer,
  G1 as ExtensionsInspector,
  fy as ExtensionsPanel,
  W3 as GenerationControls,
  N1 as ImportersPanel,
  yC as MessageComposer,
  a3 as MessageList,
  my as PersonaDrawer,
  py as PersonaForm,
  C1 as PromptCriticalPanel,
  D1 as PromptManagerInspector,
  u3 as QuickReplyBar,
  P1 as STDiagnosticsPanel,
  F1 as STScriptInspector,
  sy as SamplerForm,
  Y3 as SettingsPanel,
  m3 as Sheld,
  I1 as SlashDiagnosticsPanel,
  H3 as SubMessageView,
  xC as SwipeControls,
  dC as TavernAIResponseConfigSurface,
  pC as TavernBackgroundsSurface,
  lC as TavernCharactersSurface,
  sC as TavernExtensionsSurface,
  uC as TavernPersonaSurface,
  Q1 as TavernPlaySurface,
  fg as TavernProvider,
  eC as TavernSettingsSurface,
  B3 as TavernShell,
  fC as TavernUserSettingsSurface,
  cC as TavernWorldInfoSurface,
  ly as ThemeForm,
  ny as ThemedRoot,
  p3 as TopBar,
  F3 as TurnView,
  uy as UserSettingsDrawer,
  n3 as WelcomeScreen,
  oy as WorldInfoDrawer,
  z1 as WorldInfoInspector,
  sE as createConverter,
  gw as createEmptyChat,
  zE as ensureDOMPurifyHooks,
  qE as formatMessage,
  aE as getConverter,
  xd as getThemeById,
  TC as mountTavernAIResponseConfigSurface,
  AC as mountTavernBackgroundsSurface,
  jC as mountTavernCharactersSurface,
  NC as mountTavernExtensionsSurface,
  CC as mountTavernPersonaSurface,
  SC as mountTavernPlaySurface,
  kC as mountTavernSettingsSurface,
  IC as mountTavernUserSettingsSurface,
  EC as mountTavernWorldInfoSurface,
  vC as registerPostRenderHook,
  hC as registerPreMarkdownHook,
  gC as registerPreSanitizeHook,
  mC as sampleChat,
  BE as sanitizeChatHtml,
  ry as useDrawers,
  ft as useTavern
};
//# sourceMappingURL=bundle.mjs.map
