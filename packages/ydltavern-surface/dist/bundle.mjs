var by = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function id(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var uh = { exports: {} }, dl = {}, ch = { exports: {} }, ve = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var _i = Symbol.for("react.element"), Sy = Symbol.for("react.portal"), ky = Symbol.for("react.fragment"), Ny = Symbol.for("react.strict_mode"), jy = Symbol.for("react.profiler"), Ey = Symbol.for("react.provider"), Cy = Symbol.for("react.context"), Ty = Symbol.for("react.forward_ref"), Iy = Symbol.for("react.suspense"), Ay = Symbol.for("react.memo"), Py = Symbol.for("react.lazy"), If = Symbol.iterator;
function Ry(e) {
  return e === null || typeof e != "object" ? null : (e = If && e[If] || e["@@iterator"], typeof e == "function" ? e : null);
}
var dh = { isMounted: function() {
  return !1;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, fh = Object.assign, ph = {};
function Xs(e, t, n) {
  this.props = e, this.context = t, this.refs = ph, this.updater = n || dh;
}
Xs.prototype.isReactComponent = {};
Xs.prototype.setState = function(e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, e, t, "setState");
};
Xs.prototype.forceUpdate = function(e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function mh() {
}
mh.prototype = Xs.prototype;
function od(e, t, n) {
  this.props = e, this.context = t, this.refs = ph, this.updater = n || dh;
}
var ld = od.prototype = new mh();
ld.constructor = od;
fh(ld, Xs.prototype);
ld.isPureReactComponent = !0;
var Af = Array.isArray, hh = Object.prototype.hasOwnProperty, ud = { current: null }, gh = { key: !0, ref: !0, __self: !0, __source: !0 };
function vh(e, t, n) {
  var r, s = {}, a = null, o = null;
  if (t != null) for (r in t.ref !== void 0 && (o = t.ref), t.key !== void 0 && (a = "" + t.key), t) hh.call(t, r) && !gh.hasOwnProperty(r) && (s[r] = t[r]);
  var u = arguments.length - 2;
  if (u === 1) s.children = n;
  else if (1 < u) {
    for (var c = Array(u), p = 0; p < u; p++) c[p] = arguments[p + 2];
    s.children = c;
  }
  if (e && e.defaultProps) for (r in u = e.defaultProps, u) s[r] === void 0 && (s[r] = u[r]);
  return { $$typeof: _i, type: e, key: a, ref: o, props: s, _owner: ud.current };
}
function My(e, t) {
  return { $$typeof: _i, type: e.type, key: t, ref: e.ref, props: e.props, _owner: e._owner };
}
function cd(e) {
  return typeof e == "object" && e !== null && e.$$typeof === _i;
}
function Dy(e) {
  var t = { "=": "=0", ":": "=2" };
  return "$" + e.replace(/[=:]/g, function(n) {
    return t[n];
  });
}
var Pf = /\/+/g;
function Bl(e, t) {
  return typeof e == "object" && e !== null && e.key != null ? Dy("" + e.key) : t.toString(36);
}
function mo(e, t, n, r, s) {
  var a = typeof e;
  (a === "undefined" || a === "boolean") && (e = null);
  var o = !1;
  if (e === null) o = !0;
  else switch (a) {
    case "string":
    case "number":
      o = !0;
      break;
    case "object":
      switch (e.$$typeof) {
        case _i:
        case Sy:
          o = !0;
      }
  }
  if (o) return o = e, s = s(o), e = r === "" ? "." + Bl(o, 0) : r, Af(s) ? (n = "", e != null && (n = e.replace(Pf, "$&/") + "/"), mo(s, t, n, "", function(p) {
    return p;
  })) : s != null && (cd(s) && (s = My(s, n + (!s.key || o && o.key === s.key ? "" : ("" + s.key).replace(Pf, "$&/") + "/") + e)), t.push(s)), 1;
  if (o = 0, r = r === "" ? "." : r + ":", Af(e)) for (var u = 0; u < e.length; u++) {
    a = e[u];
    var c = r + Bl(a, u);
    o += mo(a, t, n, c, s);
  }
  else if (c = Ry(e), typeof c == "function") for (e = c.call(e), u = 0; !(a = e.next()).done; ) a = a.value, c = r + Bl(a, u++), o += mo(a, t, n, c, s);
  else if (a === "object") throw t = String(e), Error("Objects are not valid as a React child (found: " + (t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
  return o;
}
function Oi(e, t, n) {
  if (e == null) return e;
  var r = [], s = 0;
  return mo(e, r, "", "", function(a) {
    return t.call(n, a, s++);
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
var jt = { current: null }, ho = { transition: null }, Ly = { ReactCurrentDispatcher: jt, ReactCurrentBatchConfig: ho, ReactCurrentOwner: ud };
function _h() {
  throw Error("act(...) is not supported in production builds of React.");
}
ve.Children = { map: Oi, forEach: function(e, t, n) {
  Oi(e, function() {
    t.apply(this, arguments);
  }, n);
}, count: function(e) {
  var t = 0;
  return Oi(e, function() {
    t++;
  }), t;
}, toArray: function(e) {
  return Oi(e, function(t) {
    return t;
  }) || [];
}, only: function(e) {
  if (!cd(e)) throw Error("React.Children.only expected to receive a single React element child.");
  return e;
} };
ve.Component = Xs;
ve.Fragment = ky;
ve.Profiler = jy;
ve.PureComponent = od;
ve.StrictMode = Ny;
ve.Suspense = Iy;
ve.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ly;
ve.act = _h;
ve.cloneElement = function(e, t, n) {
  if (e == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
  var r = fh({}, e.props), s = e.key, a = e.ref, o = e._owner;
  if (t != null) {
    if (t.ref !== void 0 && (a = t.ref, o = ud.current), t.key !== void 0 && (s = "" + t.key), e.type && e.type.defaultProps) var u = e.type.defaultProps;
    for (c in t) hh.call(t, c) && !gh.hasOwnProperty(c) && (r[c] = t[c] === void 0 && u !== void 0 ? u[c] : t[c]);
  }
  var c = arguments.length - 2;
  if (c === 1) r.children = n;
  else if (1 < c) {
    u = Array(c);
    for (var p = 0; p < c; p++) u[p] = arguments[p + 2];
    r.children = u;
  }
  return { $$typeof: _i, type: e.type, key: s, ref: a, props: r, _owner: o };
};
ve.createContext = function(e) {
  return e = { $$typeof: Cy, _currentValue: e, _currentValue2: e, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, e.Provider = { $$typeof: Ey, _context: e }, e.Consumer = e;
};
ve.createElement = vh;
ve.createFactory = function(e) {
  var t = vh.bind(null, e);
  return t.type = e, t;
};
ve.createRef = function() {
  return { current: null };
};
ve.forwardRef = function(e) {
  return { $$typeof: Ty, render: e };
};
ve.isValidElement = cd;
ve.lazy = function(e) {
  return { $$typeof: Py, _payload: { _status: -1, _result: e }, _init: Oy };
};
ve.memo = function(e, t) {
  return { $$typeof: Ay, type: e, compare: t === void 0 ? null : t };
};
ve.startTransition = function(e) {
  var t = ho.transition;
  ho.transition = {};
  try {
    e();
  } finally {
    ho.transition = t;
  }
};
ve.unstable_act = _h;
ve.useCallback = function(e, t) {
  return jt.current.useCallback(e, t);
};
ve.useContext = function(e) {
  return jt.current.useContext(e);
};
ve.useDebugValue = function() {
};
ve.useDeferredValue = function(e) {
  return jt.current.useDeferredValue(e);
};
ve.useEffect = function(e, t) {
  return jt.current.useEffect(e, t);
};
ve.useId = function() {
  return jt.current.useId();
};
ve.useImperativeHandle = function(e, t, n) {
  return jt.current.useImperativeHandle(e, t, n);
};
ve.useInsertionEffect = function(e, t) {
  return jt.current.useInsertionEffect(e, t);
};
ve.useLayoutEffect = function(e, t) {
  return jt.current.useLayoutEffect(e, t);
};
ve.useMemo = function(e, t) {
  return jt.current.useMemo(e, t);
};
ve.useReducer = function(e, t, n) {
  return jt.current.useReducer(e, t, n);
};
ve.useRef = function(e) {
  return jt.current.useRef(e);
};
ve.useState = function(e) {
  return jt.current.useState(e);
};
ve.useSyncExternalStore = function(e, t, n) {
  return jt.current.useSyncExternalStore(e, t, n);
};
ve.useTransition = function() {
  return jt.current.useTransition();
};
ve.version = "18.3.1";
ch.exports = ve;
var R = ch.exports;
const J = /* @__PURE__ */ id(R);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var zy = R, By = Symbol.for("react.element"), $y = Symbol.for("react.fragment"), Fy = Object.prototype.hasOwnProperty, Hy = zy.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, Uy = { key: !0, ref: !0, __self: !0, __source: !0 };
function yh(e, t, n) {
  var r, s = {}, a = null, o = null;
  n !== void 0 && (a = "" + n), t.key !== void 0 && (a = "" + t.key), t.ref !== void 0 && (o = t.ref);
  for (r in t) Fy.call(t, r) && !Uy.hasOwnProperty(r) && (s[r] = t[r]);
  if (e && e.defaultProps) for (r in t = e.defaultProps, t) s[r] === void 0 && (s[r] = t[r]);
  return { $$typeof: By, type: e, key: a, ref: o, props: s, _owner: Hy.current };
}
dl.Fragment = $y;
dl.jsx = yh;
dl.jsxs = yh;
uh.exports = dl;
var i = uh.exports;
function dd(e) {
  return e.variants[e.active_variant];
}
const Vn = {
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
let Rf = 0;
function xh(e) {
  return new Ky(e);
}
function Vy(e) {
  const n = dd(e)?.subs ?? [], r = n0(n);
  return {
    is_user: e.role === "user",
    is_system: e.role === "system",
    name: e.speaker?.name,
    send_date: new Date(e.created_at).toISOString(),
    mes: Mf(n),
    swipe_id: e.active_variant,
    swipes: e.variants.map((a) => Mf(a.subs)),
    extra: r
  };
}
class Ky {
  chatId;
  chatMeta;
  turns;
  extrasByTurnId = /* @__PURE__ */ new Map();
  constructor(t) {
    this.chatId = t.id, this.chatMeta = { ...t.meta }, this.turns = t.turns.map((n, r) => Li(n, r));
  }
  get length() {
    return this.turns.length;
  }
  snapshot() {
    return {
      id: this.chatId,
      meta: { ...this.chatMeta },
      turns: this.turns.map((t, n) => Li(t, n))
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
    const n = $l(t, this.turns.length);
    return this.turns = [...this.turns, n], Fl(t, "extra") && this.extrasByTurnId.set(n.id, t.extra), n;
  }
  updateMessage(t, n) {
    const r = this.turns[t];
    if (r === void 0)
      return;
    const a = { ...this.projectStoredTurn(r), ...n }, o = $l(a, t, r);
    return this.turns = this.turns.map((u, c) => c === t ? o : u), Fl(n, "extra") ? this.extrasByTurnId.set(o.id, n.extra) : this.extrasByTurnId.has(r.id) && o.id !== r.id && (this.extrasByTurnId.set(o.id, this.extrasByTurnId.get(r.id)), this.extrasByTurnId.delete(r.id)), o;
  }
  deleteMessage(t) {
    if (t < 0 || t >= this.turns.length)
      return;
    const [n] = this.turns.splice(t, 1);
    return n !== void 0 && this.extrasByTurnId.delete(n.id), this.renumberTurns(), n;
  }
  spliceMessages(t, n, ...r) {
    const s = s0(t, this.turns.length), a = Math.max(0, Math.min(n, this.turns.length - s)), o = r.map((c, p) => $l(c, s + p)), u = this.turns.splice(s, a, ...o);
    return u.forEach((c) => this.extrasByTurnId.delete(c.id)), r.forEach((c, p) => {
      Fl(c, "extra") && this.extrasByTurnId.set(o[p]?.id ?? "", c.extra);
    }), this.renumberTurns(), u.map((c) => Li(c, c.index));
  }
  projectStoredTurn(t) {
    const n = Vy(t);
    if (!this.extrasByTurnId.has(t.id))
      return n;
    const r = this.extrasByTurnId.get(t.id);
    if (r === void 0) {
      const { extra: s, ...a } = n;
      return a;
    }
    return { ...n, extra: r };
  }
  renumberTurns() {
    this.turns = this.turns.map((t, n) => Li(t, n));
  }
}
function $l(e, t, n) {
  const r = Yy(e), s = Date.now(), a = Zy(e.send_date) ?? n?.created_at ?? s, o = n?.variants[0]?.created_at ?? a, c = {
    id: n?.variants[0]?.id ?? Df("st-variant"),
    subs: qy(e),
    meta: n?.variants[0]?.meta ?? {},
    created_at: o
  };
  return {
    id: n?.id ?? Df("st-turn"),
    index: t,
    role: r,
    speaker: typeof e.name == "string" && e.name.length > 0 ? { name: e.name, kind: Xy(r) } : void 0,
    variants: [c],
    active_variant: 0,
    source: Qy(r, n?.source),
    created_at: a,
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
function Li(e, t) {
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
    subs: e.subs.map(e0)
  };
}
function e0(e) {
  return { ...e };
}
function Mf(e) {
  return e.filter(t0).map((t) => t.text).join(`
`);
}
function t0(e) {
  return e.kind === "text" && (e.segment_role === void 0 || e.segment_role === "main");
}
function n0(e) {
  const t = e.filter((a) => a.kind === "thinking").map((a) => a.text).join(`
`), n = e.flatMap((a) => r0(a)), r = e.filter((a) => a.kind === "note").map((a) => a.text), s = {
    ...t.length > 0 ? { reasoning: t } : {},
    ...n.length > 0 ? { tool_invocations: n } : {},
    ...r.length > 0 ? { notes: r } : {}
  };
  return Object.keys(s).length > 0 ? s : void 0;
}
function r0(e) {
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
function Df(e) {
  return Rf += 1, `${e}-${Rf}`;
}
function s0(e, t) {
  return e < 0 ? Math.max(t + e, 0) : Math.min(e, t);
}
function Fl(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
const Of = /* @__PURE__ */ new Set(["push", "pop", "splice"]), a0 = /* @__PURE__ */ new Set(["mes", "name", "is_user", "is_system", "extra"]);
function i0(e, t = {}) {
  const n = [];
  return new Proxy(n, {
    get(r, s) {
      if (s === "length")
        return e.length;
      if (s === Symbol.iterator)
        return function* () {
          for (let c = 0; c < e.length; c += 1) {
            const p = e.messageAt(c);
            p !== void 0 && (yield Lf(e, t, c, p));
          }
        };
      if (Of.has(s))
        return o0(e, t, s);
      if (typeof s == "string" && zi(s)) {
        const u = Number(s), c = e.messageAt(u);
        return c === void 0 ? void 0 : Lf(e, t, u, c);
      }
      const a = e.messages(), o = Reflect.get(a, s, a);
      return typeof o == "function" ? o.bind(a) : o;
    },
    set(r, s, a) {
      if (typeof s == "string" && zi(s)) {
        const o = c0(a), u = Number(s);
        if (u < e.length)
          e.updateMessage(u, u0(o)), t.onEdit?.(u, e.messageAt(u) ?? o);
        else if (u === e.length)
          e.pushMessage(o), t.onPush?.([o]);
        else
          return !1;
        return !0;
      }
      if (s === "length" && typeof a == "number") {
        if (!Number.isInteger(a) || a < 0)
          return !1;
        for (; e.length > a; ) {
          const o = e.length - 1, u = e.messageAt(o);
          u !== void 0 && (e.deleteMessage(o), t.onDelete?.(o, u));
        }
        return !0;
      }
      return !1;
    },
    deleteProperty(r, s) {
      if (typeof s != "string" || !zi(s))
        return !1;
      const a = Number(s);
      if (a >= e.length)
        return !0;
      const o = e.messageAt(a);
      return o !== void 0 && (e.deleteMessage(a), t.onDelete?.(a, o)), !0;
    },
    has(r, s) {
      if (s === "length" || s === Symbol.iterator || Of.has(s))
        return !0;
      if (typeof s == "string" && zi(s))
        return Number(s) < e.length;
      const a = e.messages();
      return s in a;
    }
  });
}
function o0(e, t, n) {
  return n === "push" ? (...r) => (r.forEach((s) => e.pushMessage(s)), r.length > 0 && t.onPush?.(r), e.length) : n === "pop" ? () => {
    const r = e.length - 1, s = r >= 0 ? e.messageAt(r) : void 0;
    return s !== void 0 && (e.deleteMessage(r), t.onDelete?.(r, s)), s;
  } : (r, s, ...a) => {
    const o = f0(r, e.length), u = s ?? e.length - o, c = e.messages().slice(o, o + u);
    return e.spliceMessages(o, u, ...a), c.forEach((p, h) => {
      t.onDelete?.(o + h, p);
    }), a.forEach((p, h) => {
      t.onEdit?.(o + h, p);
    }), c;
  };
}
function Lf(e, t, n, r) {
  const s = { ...r };
  return new Proxy(s, {
    set(a, o, u) {
      if (!a0.has(o))
        return Reflect.set(a, o, u);
      const c = l0(o, u);
      return e.updateMessage(n, c) === void 0 ? !1 : (Reflect.set(a, o, u), t.onEdit?.(n, e.messageAt(n) ?? r), !0);
    }
  });
}
function l0(e, t) {
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
  if (t !== void 0 && !d0(t))
    throw new TypeError("ST message extra must be an object");
  return { extra: t };
}
function u0(e) {
  return {
    mes: e.mes,
    name: e.name,
    is_user: e.is_user,
    is_system: e.is_system,
    extra: e.extra
  };
}
function c0(e) {
  if (typeof e != "object" || e === null)
    throw new TypeError("ST chat messages must be objects");
  return e;
}
function d0(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function zi(e) {
  if (e.length === 0)
    return !1;
  const t = Number(e);
  return Number.isInteger(t) && t >= 0 && t < 2 ** 32 - 1 && String(t) === e;
}
function f0(e, t) {
  return e < 0 ? Math.max(t + e, 0) : Math.min(e, t);
}
function p0() {
  const e = /* @__PURE__ */ new Map(), t = {
    eventTypes: Vn,
    on(n, r) {
      return zf(e, n, r, !1), this;
    },
    once(n, r) {
      return zf(e, n, r, !0), this;
    },
    off(n, r) {
      const s = n, a = e.get(s);
      if (a === void 0)
        return this;
      const o = a.filter((u) => u.listener !== r);
      return o.length === 0 ? e.delete(s) : e.set(s, o), this;
    },
    emit(n, ...r) {
      const s = n, a = e.get(s);
      if (a === void 0 || a.length === 0)
        return !1;
      const o = [...a];
      for (const u of o)
        u.listener(...r), u.once && t.off(n, u.listener);
      return !0;
    },
    listenerCount(n) {
      return e.get(n)?.length ?? 0;
    }
  };
  return t;
}
function zf(e, t, n, r) {
  const s = t, a = e.get(s) ?? [];
  e.set(s, [...a, { listener: n, once: r }]);
}
const m0 = /{{\s*([A-Za-z0-9_.-]+)\s*}}/g;
function h0(e, t = {}, n = {}) {
  const r = [], s = n.previewLength ?? 80, a = y0(n.now ?? t.now ?? Date.now());
  return { text: e.replace(m0, (u, c) => {
    const p = g0(c, t, n, a);
    return r.push({ name: c, source: p.source, preview: _0(p.value, s) }), p.source === "unknown" ? n.unknownMacro === "empty" ? "" : u : p.value;
  }), trace: r };
}
function g0(e, t, n, r) {
  const s = v0(e, n.overrides, t.overrides, t.dynamic);
  if (s !== void 0)
    return { value: wh(s), source: "dynamic" };
  switch (e) {
    case "user":
      return jn(t.user);
    case "char":
      return jn(t.char);
    case "description":
      return jn(t.description);
    case "personality":
      return jn(t.personality);
    case "scenario":
      return jn(t.scenario);
    case "persona":
      return jn(t.persona);
    case "charDepthPrompt":
      return jn(t.charDepthPrompt);
    case "creatorNotes":
      return jn(t.creatorNotes);
    case "mesExamples":
      return jn(t.mesExamples);
    case "model":
      return jn(t.model);
    case "date":
      return { value: r.toISOString().slice(0, 10), source: "computed" };
    case "time":
      return { value: r.toISOString().slice(11, 19), source: "computed" };
    default:
      return { value: "", source: "unknown" };
  }
}
function v0(e, ...t) {
  for (const n of t)
    if (n !== void 0 && Object.prototype.hasOwnProperty.call(n, e))
      return n[e];
}
function jn(e) {
  return e === void 0 ? { value: "", source: "unknown" } : { value: wh(e), source: "context" };
}
function wh(e) {
  return e == null ? "" : String(e);
}
function _0(e, t) {
  return e.length <= t ? e : `${e.slice(0, Math.max(0, t - 1))}…`;
}
function y0(e) {
  return e instanceof Date ? e : new Date(e);
}
function bh(e) {
  const t = [];
  for (const n of Bf(e, [`
`, ";"])) {
    const r = n.trim();
    if (r.length === 0)
      continue;
    if (!r.startsWith("/")) {
      t.push({ type: "text", text: r, raw: n });
      continue;
    }
    const s = Bf(r, ["|"]).map((a) => x0(a.trim())).filter(E0);
    t.push({ type: "pipeline", commands: s, raw: n });
  }
  return { type: "program", body: t };
}
function x0(e) {
  if (!e.startsWith("/"))
    return;
  const t = e.slice(1).trimStart();
  if (t.length === 0)
    return;
  const n = t.search(/\s/u), r = j0(n === -1 ? t : t.slice(0, n)), s = n === -1 ? "" : t.slice(n).trimStart();
  return {
    type: "command",
    name: r,
    args: b0(s).map(w0),
    rawArgs: s,
    raw: e
  };
}
function w0(e) {
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
function b0(e) {
  const t = [];
  let n = 0;
  for (; n < e.length; ) {
    for (; n < e.length && /\s/u.test(e[n] ?? ""); )
      n += 1;
    if (n >= e.length)
      break;
    const r = N0(e, n);
    if (r !== void 0 && r.argument.body.trim() !== "pipe") {
      t.push({ value: r.argument.body, raw: r.argument.raw, closure: r.argument }), n = r.nextIndex;
      continue;
    }
    const s = S0(e, n);
    t.push(s.token), n = s.nextIndex;
  }
  return t;
}
function S0(e, t) {
  let n = t, r = "", s = "";
  for (; n < e.length && !/\s/u.test(e[n] ?? ""); ) {
    const a = e[n] ?? "";
    if (a === '"' || a === "'") {
      const o = k0(e, n, a);
      r += o.value, s += o.raw, n = o.nextIndex;
      continue;
    }
    r += a, s += a, n += 1;
  }
  return { token: { value: r, raw: s }, nextIndex: n };
}
function k0(e, t, n) {
  let r = t + 1, s = "", a = n;
  for (; r < e.length; ) {
    const o = e[r] ?? "";
    if (a += o, r += 1, o === "\\") {
      const u = e[r] ?? "";
      u.length > 0 && (s += u, a += u, r += 1);
      continue;
    }
    if (o === n)
      return { value: s, raw: a, nextIndex: r };
    s += o;
  }
  return { value: s, raw: a, nextIndex: r };
}
function N0(e, t) {
  const n = e.startsWith("{{", t), r = !n && e[t] === "{";
  if (!n && !r)
    return;
  const s = n ? "{{" : "{", a = n ? "}}" : "}";
  let o = t + s.length, u = 1, c = "";
  for (; o < e.length; ) {
    if (e.startsWith(s, o)) {
      u += 1, c += s, o += s.length;
      continue;
    }
    if (e.startsWith(a, o)) {
      if (u -= 1, u === 0) {
        const p = o + a.length;
        return {
          argument: {
            type: "closure",
            body: c.trim(),
            raw: e.slice(t, p),
            style: n ? "double-brace" : "brace"
          },
          nextIndex: p
        };
      }
      c += a, o += a.length;
      continue;
    }
    c += e[o] ?? "", o += 1;
  }
}
function Bf(e, t) {
  const n = [];
  let r, s = 0, a = 0, o = 0;
  for (; o < e.length; ) {
    const u = e[o] ?? "";
    if (r !== void 0) {
      if (u === "\\") {
        o += 2;
        continue;
      }
      u === r && (r = void 0), o += 1;
      continue;
    }
    if (u === '"' || u === "'") {
      r = u, o += 1;
      continue;
    }
    if (u === "{") {
      s += 1, o += 1;
      continue;
    }
    if (u === "}") {
      s = Math.max(0, s - 1), o += 1;
      continue;
    }
    s === 0 && t.includes(u) && (n.push(e.slice(a, o)), a = o + 1), o += 1;
  }
  return n.push(e.slice(a)), n;
}
function j0(e) {
  return e.trim().replace(/^\/+/, "").toLowerCase();
}
function E0(e) {
  return e !== void 0;
}
function fd(e = {}) {
  const t = e.parent, n = e.globalVariables ?? t?.globalVariables ?? /* @__PURE__ */ new Map(), r = e.globalClosures ?? t?.globalClosures ?? /* @__PURE__ */ new Map(), s = e.localVariables ?? /* @__PURE__ */ new Map(), a = e.closures ?? /* @__PURE__ */ new Map(), o = {
    parent: t,
    variables: n,
    globalVariables: n,
    localVariables: s,
    closures: a,
    globalClosures: r,
    pipe: e.pipe ?? t?.pipe ?? "",
    breakRequested: !1,
    maxIterations: e.maxIterations ?? t?.maxIterations ?? 100,
    getVariable: (u) => s.get(u) ?? t?.getVariable(u) ?? n.get(u),
    setLocalVariable: (u, c) => {
      s.set(u, c);
    },
    setGlobalVariable: (u, c) => {
      n.set(u, c);
    },
    getClosure: (u) => a.get(u) ?? t?.getClosure(u) ?? r.get(u),
    setLocalClosure: (u, c) => {
      a.set(u, c);
    },
    setGlobalClosure: (u, c) => {
      r.set(u, c);
    },
    createChild: () => fd({ parent: o })
  };
  return o;
}
function C0(e, t, n, r = fd({ globalVariables: t.variables }), s = {}) {
  const a = typeof e == "string" ? bh(e) : e, o = typeof e == "string" ? e : a.body.map((h) => h.raw).join(`
`), u = [], c = [], p = [];
  for (const h of a.body) {
    if (h.type === "text") {
      const w = Du(h.text, r.pipe);
      w.length > 0 && (u.push(w), r.pipe = w);
      continue;
    }
    let b = r.pipe, g = !0;
    for (const w of h.commands) {
      r.pipe = b;
      const E = t.invokeSTScriptCommand(T0(w, b), n, r);
      if (c.push(E), p.push(...E.diagnostics), g = g && E.ok, b = E.output, r.pipe = b, !E.ok && s.stopOnError === !0 || r.breakRequested)
        break;
    }
    if (b.length > 0 && u.push(b), !g && s.stopOnError === !0 || r.breakRequested)
      break;
  }
  return {
    ok: c.every((h) => h.ok) && p.length === 0,
    input: o,
    output: u.join(`
`),
    executions: c,
    diagnostics: p,
    variables: Object.fromEntries(r.globalVariables.entries()),
    state: r
  };
}
function T0(e, t) {
  const n = e.args.map((r) => I0(r, t));
  return {
    ...e,
    args: n,
    rawArgs: A0(n)
  };
}
function I0(e, t) {
  return e.type === "closure" ? e : e.type === "named" ? { ...e, value: Du(e.value, t) } : { ...e, value: Du(e.value, t) };
}
function Du(e, t) {
  return e.replaceAll("{{pipe}}", t);
}
function A0(e) {
  return e.map((t) => t.type === "closure" ? t.raw : t.type === "named" ? `${t.key}=${t.value}` : t.value).join(" ");
}
function P0(e, t = /* @__PURE__ */ new Map()) {
  const n = /* @__PURE__ */ new Map(), r = [], s = fd({ globalVariables: t }), u = {
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
      return [...p.values()].sort((h, b) => h.name.localeCompare(b.name));
    },
    registerSlashCommand: (p, h, b = []) => {
      const g = W0(b) ? { aliases: b } : b, w = $f(p), E = (g.aliases ?? []).map($f).filter((D) => D.length > 0 && D !== w);
      if (w.length === 0)
        throw new Error("Slash command name must not be empty.");
      const A = { name: w, aliases: E, metadata: g, callback: h };
      n.set(w, A);
      for (const D of E)
        n.set(D, A);
    },
    executeSlashCommands: (p, h = {}) => {
      const b = h.state ?? s, g = C0(p, c, e(), b, h);
      return r.push(...g.diagnostics), g;
    }
  }, c = {
    variables: t,
    invokeSTScriptCommand: (p, h, b) => {
      const g = n.get(p.name);
      if (g === void 0) {
        const A = Us("unknown-command", `Unknown slash command: /${p.name}`, p.name);
        return { name: p.name, raw: p.raw, ok: !1, output: "", diagnostics: [A] };
      }
      const w = F0(g.callback({
        name: g.name,
        args: p.rawArgs,
        argv: p.args.filter(H0).map((A) => A.value),
        namedArgs: Object.fromEntries(p.args.filter(U0).map((A) => [A.key, A.value])),
        raw: p.raw,
        context: h,
        variables: t,
        state: b
      })), E = w.diagnostics ?? [];
      return { name: g.name, raw: p.raw, ok: w.ok, output: w.output, diagnostics: E };
    }
  };
  return R0(u), u;
}
function R0(e) {
  e.registerSlashCommand("gen", ({ args: t, context: n }) => Hl(n.Generate({ text: t })), {
    help: "Generate a message from text.",
    returns: "generated text"
  }), e.registerSlashCommand("continue", ({ context: t }) => Hl(t.Generate({ text: "[ydltavern fake continue]" }))), e.registerSlashCommand("swipe", ({ context: t }) => Hl(t.Generate({ text: "[ydltavern fake swipe]" }))), e.registerSlashCommand("setvar", ({ args: t, state: n }) => Ul(t, n, "global")), e.registerSlashCommand("getvar", ({ args: t, state: n }) => n.getVariable(t.trim()) ?? ""), e.registerSlashCommand("if", ({ args: t, context: n, state: r }) => M0(t, n, r)), e.registerSlashCommand("run", ({ argv: t, args: n, context: r, state: s }) => D0(t, n, r, s)), e.registerSlashCommand("let", ({ args: t, state: n }) => Ul(t, n, "local")), e.registerSlashCommand("var", ({ args: t, state: n }) => Ul(t, n, "global")), e.registerSlashCommand("while", ({ argv: t, args: n, namedArgs: r, context: s, state: a }) => O0(t, n, r, s, a)), e.registerSlashCommand("break", ({ state: t }) => (t.breakRequested = !0, ""));
}
function Hl(e) {
  return e.message.mes ?? "";
}
function Ul(e, t, n) {
  const r = L0(e);
  if (r === void 0)
    return {
      ok: !1,
      output: "",
      diagnostics: [Us(`invalid-${n === "local" ? "let" : "setvar"}`, `Expected /${n === "local" ? "let" : "setvar"} name=value or name value.`, n === "local" ? "let" : "setvar")]
    };
  if (pd(r.value)) {
    const s = fl(r.value);
    if (s !== void 0)
      return n === "local" ? t.setLocalClosure(r.name, s) : t.setGlobalClosure(r.name, s), { ok: !0, output: "" };
  }
  return n === "local" ? t.setLocalVariable(r.name, r.value) : t.setGlobalVariable(r.name, r.value), { ok: !0, output: r.value };
}
function M0(e, t, n) {
  const r = z0(e);
  if (r === void 0)
    return {
      ok: !1,
      output: "",
      diagnostics: [Us("invalid-if", "Expected /if left == right then ... else ...", "if")]
    };
  const s = Ca(r.left, n), a = Ca(r.right, n), o = s === a ? r.thenCommand : r.elseCommand;
  if (o === void 0 || o.length === 0)
    return { ok: !0, output: "" };
  if (!o.startsWith("/"))
    return { ok: !0, output: o };
  const u = t.executeSlashCommands(o, { state: n });
  return { ok: u.ok, output: u.output, diagnostics: u.diagnostics };
}
function D0(e, t, n, r) {
  const s = e[0], o = fl(t.trim()) ?? (s === void 0 ? void 0 : r.getClosure(s));
  if (o === void 0)
    return {
      ok: !1,
      output: "",
      diagnostics: [Us("unknown-run-target", `Unknown /run target: ${t.trim() || "<empty>"}`, "run")]
    };
  const u = r.createChild();
  u.pipe = r.pipe;
  const c = n.executeSlashCommands(o.body, { state: u });
  return r.pipe = c.state.pipe, c.state.breakRequested && (r.breakRequested = !0), { ok: c.ok, output: c.output, diagnostics: c.diagnostics };
}
function O0(e, t, n, r, s) {
  const a = G0(t) ?? fl(e.at(-1) ?? ""), o = V0(n.maxIterations ?? n.max ?? "", s.maxIterations);
  if (a === void 0)
    return { ok: !1, output: "", diagnostics: [Us("invalid-while", "Expected /while condition { ... }.", "while")] };
  const u = e.filter((b) => !pd(b) && !b.startsWith("max=") && !b.startsWith("maxIterations=")).join(" ").trim(), c = [], p = [];
  let h = !0;
  for (let b = 0; b < o; b += 1) {
    if (!K0(B0(u, s)))
      return { ok: h, output: c.join(`
`), diagnostics: p };
    const g = s.createChild();
    g.pipe = s.pipe;
    const w = r.executeSlashCommands(a.body, { state: g });
    if (c.push(w.output), p.push(...w.diagnostics), h = h && w.ok, s.pipe = w.state.pipe, w.state.breakRequested)
      return w.state.breakRequested = !1, { ok: h, output: c.filter((E) => E.length > 0).join(`
`), diagnostics: p };
  }
  return {
    ok: !1,
    output: c.filter((b) => b.length > 0).join(`
`),
    diagnostics: [...p, Us("while-max-iterations", `Exceeded /while maxIterations (${o}).`, "while")]
  };
}
function L0(e) {
  const t = e.trim();
  if (t.length === 0)
    return;
  const n = t.indexOf("=");
  if (n > 0) {
    const o = t.slice(0, n).trim(), u = t.slice(n + 1).trim();
    return o.length > 0 ? { name: o, value: u } : void 0;
  }
  const r = t.search(/\s/);
  if (r <= 0)
    return;
  const s = t.slice(0, r).trim(), a = t.slice(r).trim();
  return s.length > 0 ? { name: s, value: a } : void 0;
}
function z0(e) {
  const t = /^(.*?)\s*==\s*(.*?)\s+then\s+(.+?)(?:\s+else\s+(.+))?$/iu.exec(e.trim());
  if (t === null)
    return;
  const n = t[1]?.trim() ?? "", r = t[2]?.trim() ?? "", s = t[3]?.trim() ?? "", a = t[4]?.trim();
  if (!(n.length === 0 || r.length === 0 || s.length === 0))
    return { left: n, right: r, thenCommand: s, elseCommand: a };
}
function Ca(e, t) {
  const n = e.trim(), r = $0(n);
  if (r !== n)
    return r;
  if (n === "{{pipe}}")
    return t.pipe;
  const s = n.startsWith("$") ? n.slice(1) : n;
  return t.getVariable(s) ?? n;
}
function B0(e, t) {
  const n = e.trim();
  if (n.length === 0)
    return "true";
  const r = /^(.*?)\s*(==|!=|<|>|<=|>=)\s*(.*?)$/u.exec(n);
  if (r !== null) {
    const s = Ca(r[1] ?? "", t), a = Ca(r[3] ?? "", t);
    switch (r[2]) {
      case "==":
        return String(s === a);
      case "!=":
        return String(s !== a);
      case "<":
        return String(Number(s) < Number(a));
      case ">":
        return String(Number(s) > Number(a));
      case "<=":
        return String(Number(s) <= Number(a));
      case ">=":
        return String(Number(s) >= Number(a));
      default:
        return "false";
    }
  }
  return Ca(n, t);
}
function $0(e) {
  if (e.length >= 2) {
    const t = e[0], n = e[e.length - 1];
    if (t === '"' && n === '"' || t === "'" && n === "'")
      return e.slice(1, -1);
  }
  return e;
}
function F0(e) {
  return typeof e == "string" ? { ok: !0, output: e } : e;
}
function $f(e) {
  return e.trim().replace(/^\/+/, "").toLowerCase();
}
function Us(e, t, n) {
  return { code: e, message: t, command: n };
}
function H0(e) {
  return e.type === "text";
}
function U0(e) {
  return e.type === "named";
}
function W0(e) {
  return Array.isArray(e);
}
function fl(e) {
  const t = e.trim();
  if (!pd(t))
    return;
  const r = bh(`/run ${t}`).body[0];
  if (r?.type === "pipeline")
    return r.commands[0]?.args.find((s) => s.type === "closure");
}
function G0(e) {
  const t = /(\{\{[\s\S]*\}\}|\{[\s\S]*\})/u.exec(e);
  return t?.[1] === void 0 ? void 0 : fl(t[1]);
}
function pd(e) {
  const t = e.trim();
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("{{") && t.endsWith("}}");
}
function V0(e, t) {
  const n = Number.parseInt(e, 10);
  return Number.isFinite(n) && n > 0 ? n : t;
}
function K0(e) {
  const t = e.trim().toLowerCase();
  return t.length > 0 && t !== "0" && t !== "false" && t !== "no" && t !== "null" && t !== "undefined";
}
function q0(e) {
  const t = xh(e.chat), n = p0(), r = /* @__PURE__ */ new Map();
  let s = 0, a;
  const o = P0(() => a, r);
  return a = {
    chat: i0(t, e.chatHooks),
    eventSource: n,
    event_types: Vn,
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
    addOneMessage: (u) => {
      t.pushMessage(u);
      const c = t.messageAt(t.length - 1) ?? u;
      return n.emit(Y0("MESSAGE_ADDED", Vn.MESSAGE_RECEIVED), c, t.length - 1), c;
    },
    saveChat: () => ({ ok: !0, turns: t.length }),
    Generate: (u) => {
      const c = Q0(u), p = {
        is_user: !1,
        is_system: !1,
        name: X0(u) ?? a.name2,
        mes: c,
        send_date: (/* @__PURE__ */ new Date()).toISOString()
      };
      a.generationStarted = !0, n.emit(Vn.GENERATION_STARTED, u ?? {}), n.emit(Vn.STREAM_TOKEN_RECEIVED, c), t.pushMessage(p);
      const h = t.length - 1, b = t.messageAt(h) ?? p;
      return n.emit(Vn.MESSAGE_RECEIVED, b, h), a.generationStarted = !1, n.emit(Vn.GENERATION_ENDED, b, h), { ok: !0, message: b, index: h };
    },
    substituteParams: (u, c) => Ff(a, e, u, c).text,
    substituteParamsTrace: (u, c) => Ff(a, e, u, c)
  }, Object.defineProperty(a.saveSettingsDebounced, "callCount", {
    configurable: !1,
    enumerable: !1,
    get: () => s
  }), {
    getContext: () => a,
    context: a
  };
}
function Y0(e, t) {
  return Object.prototype.hasOwnProperty.call(Vn, e) ? Vn[e] ?? t : t;
}
function Q0(e) {
  return typeof e == "string" ? e : e?.prompt ?? e?.text ?? "[ydltavern fake generation]";
}
function X0(e) {
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
  return h0(n, s, { overrides: r });
}
function Z0(e) {
  const t = Sh({
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
function J0(e) {
  const t = e.model.trim();
  if (t === "")
    throw new TypeError("OpenAI chat request model must be a non-empty string");
  const n = e.sampler === void 0 ? {} : Z0(e.sampler).request;
  return Sh({
    ...n,
    model: t,
    messages: e.messages,
    stream: e.stream ?? n.stream
  });
}
function Sh(e) {
  const t = {};
  for (const [n, r] of Object.entries(e))
    r !== void 0 && (t[n] = r);
  return t;
}
const ex = new Set(Wy);
function tx(e, t, n = {}) {
  const r = n.mode ?? "chat", s = [...e].sort(nx), a = [], o = [], u = [], c = [], p = [], h = t.turns.flatMap((g) => rx(g, u));
  let b = !1;
  for (const g of s) {
    if (g.enabled === !1) {
      o.push(g.identifier);
      continue;
    }
    if (a.push(g.identifier), lx(g.identifier) || u.push(`Unknown prompt block identifier: ${g.identifier}`), g.identifier === "chatHistory") {
      Uf(r, h, c, p), b = !0;
      continue;
    }
    g.content.trim() !== "" && (r === "chat" ? c.push({ role: g.role ?? "system", content: g.content }) : p.push(g.content));
  }
  return b || Uf(r, h, c, p), {
    messages: r === "chat" ? c : [],
    text: r === "text" ? p.join(`

`) : "",
    diagnostics: {
      mode: r,
      includedBlocks: a,
      skippedBlocks: o,
      insertedHistoryTurns: h.length,
      warnings: u
    }
  };
}
function nx(e, t) {
  return Hf(e) - Hf(t);
}
function Hf(e) {
  return e.order ?? e.position ?? 0;
}
function Uf(e, t, n, r) {
  if (e === "chat") {
    n.push(...t);
    return;
  }
  t.length > 0 && r.push(t.map(ix).join(`
`));
}
function rx(e, t) {
  if (e.hidden === !0 || e.deleted === !0)
    return [];
  const n = sx(e);
  if (n === void 0)
    return t.push(`Turn ${e.id} has no active variant at index ${e.active_variant}`), [];
  const r = ax(n).trim();
  return r === "" ? [] : [{ role: e.role, content: r }];
}
function sx(e) {
  return e.variants[e.active_variant];
}
function ax(e) {
  return e.subs.filter((t) => t.kind === "text").map((t) => t.text).join(`
`);
}
function ix(e) {
  return `${ox(e.role)}: ${e.content}`;
}
function ox(e) {
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
function lx(e) {
  return ex.has(e);
}
const Ta = 256, kh = 6, ux = 52, cx = Ta ** kh, Nh = 2 ** ux, dx = Nh * 2, Wf = Ta - 1;
function jh(e) {
  const t = fx(e, Wf), n = px(t, Ta, Wf);
  return () => {
    let r = n(kh), s = cx, a = 0;
    for (; r < Nh; )
      r = (r + a) * Ta, s *= Ta, a = n(1);
    for (; r >= dx; )
      r /= 2, s /= 2, a >>>= 1;
    return (r + a) / s;
  };
}
function fx(e, t) {
  const n = [];
  let r = 0;
  for (let s = 0; s < e.length; s += 1) {
    const a = t & s;
    n[a] = t & (r ^= (n[a] ?? 0) * 19) + e.charCodeAt(s);
  }
  return n;
}
function px(e, t, n) {
  const r = [], s = e.length === 0 ? [0] : e;
  let a = 0, o = 0;
  for (; a < t; )
    r[a] = a, a += 1;
  for (a = 0; a < t; ) {
    const h = r[a] ?? 0;
    o = n & o + (s[a % s.length] ?? 0) + h, r[a] = r[o] ?? 0, r[o] = h, a += 1;
  }
  let u = 0, c = 0;
  const p = (h) => {
    let b = 0;
    for (; h > 0; ) {
      u = n & u + 1;
      const g = r[u] ?? 0;
      c = n & c + g;
      const w = r[c] ?? 0;
      r[u] = w, r[c] = g, b = b * t + (r[n & (r[u] ?? 0) + (r[c] ?? 0)] ?? 0), h -= 1;
    }
    return b;
  };
  return p(t), p;
}
const mx = "ydltavern-fixture-v1", Ou = "YDLTAVERN_TRIM", hx = [
  { pattern: /<USER>/g, replacement: "{{user}}" },
  { pattern: /<BOT>/g, replacement: "{{char}}" },
  { pattern: /<GROUP>/g, replacement: "{{group}}" },
  { pattern: /<CHARIFNOTGROUP>/g, replacement: "{{charIfNotGroup}}" },
  // Legacy {{time_UTC-10}} → {{time::UTC-10}} (public/scripts/macros.js:667)
  { pattern: /\{\{\s*time_UTC([+-]\d{1,2})\s*\}\}/g, replacement: "{{time::UTC$1}}" }
], gx = /\{\{\s*([A-Za-z0-9_/.+-]+)((?::[^}]*)?)\s*\}\}/g;
function vx(e, t = {}) {
  const n = t.maxIterations ?? 5, r = [], s = _x(t);
  let a = e;
  for (const u of hx)
    a = a.replace(u.pattern, u.replacement);
  a = a.replace(/\{\{\s*\/\/[^}]*\}\}/g, () => (r.push({ name: "//", raw: "{{// ...}}", source: "computed", preview: "" }), ""));
  let o = 0;
  for (let u = 0; u < n && a.includes("{{"); u += 1) {
    const c = a;
    if (a = a.replace(gx, (p, h, b) => {
      const w = yx(h, b ?? "", t, s);
      return r.push({ name: h, raw: p, source: w.source, preview: wx(w.value) }), w.source === "unknown" ? t.unknownMacro === "empty" ? "" : p : w.value;
    }), o = u + 1, a === c)
      break;
  }
  return a = a.replace(new RegExp(`[ \\t]*${Ou}[ \\t]*(?:\\r?\\n)+[ \\t]*`, "g"), " ").replace(new RegExp(Ou, "g"), ""), a = a.replace(/\n{3,}/g, `

`), { text: a, trace: r, iterations: o };
}
function _x(e) {
  const t = e.random === void 0 ? jh(mx) : void 0;
  return {
    rng: e.random ?? t ?? Math.random,
    pickRng: e.pickSeed ?? e.random ?? t ?? Math.random,
    now: bx(e.now ?? Date.now())
  };
}
function yx(e, t, n, r) {
  const s = n.env ?? {}, a = xx(t);
  if (e === "//" || e === "comment")
    return { value: "", source: "computed" };
  if (e === "noop")
    return { value: "", source: "computed" };
  if (e === "newline") {
    const p = a[0] ? Math.max(0, parseInt(a[0], 10) || 0) : 1;
    return { value: `
`.repeat(p), source: "computed" };
  }
  if (e === "space") {
    const p = a[0] ? Math.max(0, parseInt(a[0], 10) || 0) : 1;
    return { value: " ".repeat(p), source: "computed" };
  }
  if (e === "trim")
    return { value: Ou, source: "computed" };
  if (e === "random") {
    const p = a.length > 0 ? a : t ? [t] : [];
    return p.length === 0 ? { value: "", source: "computed" } : { value: String(p[Math.floor(r.rng() * p.length)] ?? ""), source: "computed" };
  }
  if (e === "pick") {
    const p = a.length > 0 ? a : [];
    return p.length === 0 ? { value: "", source: "computed" } : { value: String(p[Math.floor(r.pickRng() * p.length)] ?? ""), source: "computed" };
  }
  if (e === "roll") {
    const p = (a[0] ?? "").toString(), h = p.match(/^(\d+)?d(\d+)$/i);
    if (h) {
      const g = Math.max(1, parseInt(h[1] ?? "1", 10)), w = Math.max(1, parseInt(h[2] ?? "6", 10));
      if (n.random === void 0 && p === "d6")
        return { value: "1", source: "computed" };
      let E = 0;
      for (let A = 0; A < g; A += 1)
        E += Math.floor(r.rng() * w) + 1;
      return { value: String(E), source: "computed" };
    }
    const b = parseInt(p, 10);
    return Number.isFinite(b) && b > 0 ? { value: String(Math.floor(r.rng() * b) + 1), source: "computed" } : { value: "", source: "computed" };
  }
  const o = r.now;
  if (e === "time") {
    if (a[0]?.startsWith("UTC")) {
      const p = parseInt(a[0].slice(3), 10) || 0, h = new Date(o.getTime() + p * 60 * 60 * 1e3);
      return { value: Gf(h), source: "computed" };
    }
    return { value: Gf(o), source: "computed" };
  }
  if (e === "date")
    return { value: Sx(o), source: "computed" };
  if (e === "isotime")
    return { value: o.toISOString().slice(11, 16), source: "computed" };
  if (e === "isodate")
    return { value: o.toISOString().slice(0, 10), source: "computed" };
  if (e === "weekday")
    return { value: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][o.getUTCDay()] ?? "", source: "computed" };
  if (e === "datetimeformat") {
    const p = a.join("::") || "YYYY-MM-DD HH:mm:ss";
    return { value: kx(o, p), source: "computed" };
  }
  if (e === "idleDuration" || e === "idle_duration")
    return { value: En(s.idleDuration), source: "computed" };
  if (e === "timeDiff") {
    const p = Date.parse(a[0] ?? ""), h = Date.parse(a[1] ?? "");
    return Number.isFinite(p) && Number.isFinite(h) ? { value: String(Math.abs(h - p)), source: "computed" } : { value: "0", source: "computed" };
  }
  if ((e === "getvar" || e === "var") && a.length >= 1) {
    const p = n.localVars?.get(a[0] ?? "");
    return { value: En(p), source: "variable" };
  }
  if (e === "setvar" && a.length >= 2)
    return n.localVars?.set(a[0] ?? "", a[1] ?? ""), { value: En(a[1]), source: "variable" };
  if (e === "addvar" && a.length >= 2) {
    const p = n.localVars?.get(a[0] ?? ""), h = `${En(p)}${En(a[1])}`;
    return n.localVars?.set(a[0] ?? "", h), { value: h, source: "variable" };
  }
  if (e === "incvar" && a.length >= 1) {
    const p = Number(n.localVars?.get(a[0] ?? "") ?? 0), h = (Number.isFinite(p) ? p : 0) + 1;
    return n.localVars?.set(a[0] ?? "", h), { value: String(h), source: "variable" };
  }
  if (e === "decvar" && a.length >= 1) {
    const p = Number(n.localVars?.get(a[0] ?? "") ?? 0), h = (Number.isFinite(p) ? p : 0) - 1;
    return n.localVars?.set(a[0] ?? "", h), { value: String(h), source: "variable" };
  }
  if (e === "hasvar" || e === "varexists")
    return { value: n.localVars?.has(a[0] ?? "") ? "true" : "false", source: "variable" };
  if (e === "deletevar" || e === "flushvar")
    return n.localVars?.delete(a[0] ?? ""), { value: "", source: "variable" };
  if (e === "getglobalvar" && a.length >= 1)
    return { value: En(n.globalVars?.get(a[0] ?? "")), source: "variable" };
  if (e === "setglobalvar" && a.length >= 2)
    return n.globalVars?.set(a[0] ?? "", a[1] ?? ""), { value: En(a[1]), source: "variable" };
  if (e === "addglobalvar" && a.length >= 2) {
    const p = n.globalVars?.get(a[0] ?? ""), h = `${En(p)}${En(a[1])}`;
    return n.globalVars?.set(a[0] ?? "", h), { value: h, source: "variable" };
  }
  if (e === "incglobalvar" && a.length >= 1) {
    const p = Number(n.globalVars?.get(a[0] ?? "") ?? 0), h = (Number.isFinite(p) ? p : 0) + 1;
    return n.globalVars?.set(a[0] ?? "", h), { value: String(h), source: "variable" };
  }
  if (e === "decglobalvar" && a.length >= 1) {
    const p = Number(n.globalVars?.get(a[0] ?? "") ?? 0), h = (Number.isFinite(p) ? p : 0) - 1;
    return n.globalVars?.set(a[0] ?? "", h), { value: String(h), source: "variable" };
  }
  if (e === "hasglobalvar" || e === "globalvarexists")
    return { value: n.globalVars?.has(a[0] ?? "") ? "true" : "false", source: "variable" };
  if (e === "deleteglobalvar" || e === "flushglobalvar")
    return n.globalVars?.delete(a[0] ?? ""), { value: "", source: "variable" };
  if (e === "hasExtension")
    return { value: n.extensions?.has(a[0] ?? "") ? "true" : "false", source: "control" };
  const c = {
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
  if (c !== void 0) {
    const p = s[c];
    return { value: En(p), source: "env" };
  }
  return { value: "", source: "unknown" };
}
function xx(e) {
  return e.startsWith("::") ? e.slice(2).split("::") : e.startsWith(":") ? e.slice(1).split(",").map((n) => n.trim()) : [];
}
function En(e) {
  return e == null ? "" : String(e);
}
function wx(e) {
  return e.length > 80 ? `${e.slice(0, 79)}…` : e;
}
function bx(e) {
  return e instanceof Date ? e : new Date(e);
}
function Gf(e) {
  return e.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: !0, timeZone: "UTC" });
}
function Sx(e) {
  return e.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}
function kx(e, t) {
  const n = (s, a = 2) => String(s).padStart(a, "0"), r = {
    YYYY: String(e.getUTCFullYear()),
    MMMM: Nx[e.getUTCMonth()] ?? "",
    MMM: jx[e.getUTCMonth()] ?? "",
    MM: n(e.getUTCMonth() + 1),
    DD: n(e.getUTCDate()),
    D: String(e.getUTCDate()),
    HH: n(e.getUTCHours()),
    H: String(e.getUTCHours()),
    hh: n(Vf(e.getUTCHours())),
    h: String(Vf(e.getUTCHours())),
    mm: n(e.getUTCMinutes()),
    ss: n(e.getUTCSeconds()),
    A: e.getUTCHours() < 12 ? "AM" : "PM",
    a: e.getUTCHours() < 12 ? "am" : "pm",
    dddd: Ex[e.getUTCDay()] ?? "",
    ddd: Cx[e.getUTCDay()] ?? ""
  };
  return t.replace(/YYYY|MMMM|MMM|MM|DD|dddd|ddd|HH|H|hh|h|mm|ss|A|a|D/g, (s) => r[s] ?? s);
}
const Nx = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], jx = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], Ex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], Cx = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function Vf(e) {
  const t = e % 12;
  return t === 0 ? 12 : t;
}
const Tx = /{{\s*([A-Za-z0-9_.-]+)\s*}}/g;
function Ia(e, t = {}, n = {}) {
  if (Ix(e, t, n))
    return Ax(e, t, n);
  const r = [], s = n.previewLength ?? 80, a = Dx(n.now ?? t.now ?? Date.now());
  return { text: e.replace(Tx, (u, c) => {
    const p = Mx(c, t, n, a);
    return r.push({ name: c, source: p.source, preview: Th(p.value, s) }), p.source === "unknown" ? n.unknownMacro === "empty" ? "" : u : p.value;
  }), trace: r };
}
function Ix(e, t, n) {
  return /<USER>|<BOT>|<GROUP>|<CHARIFNOTGROUP>|\{\{\s*(?:\/\/|comment|noop|newline|space|trim|random|pick|roll|isotime|isodate|weekday|datetimeformat|idleDuration|idle_duration|timeDiff|getvar|var|setvar|addvar|incvar|decvar|hasvar|varexists|deletevar|flushvar|getglobalvar|setglobalvar|addglobalvar|incglobalvar|decglobalvar|hasglobalvar|globalvarexists|deleteglobalvar|flushglobalvar|hasExtension|time_UTC|time\s*:|date\s*:)[}:\s]/.test(e) || Bi(t) || Bi(t.dynamic) || Bi(t.overrides) || Bi(n.overrides);
}
function Bi(e) {
  return e === void 0 ? !1 : Object.values(e).some((t) => typeof t == "string" && t.includes("{{"));
}
function Ax(e, t, n) {
  const r = vx(e, {
    env: { ...t, ...t.dynamic, ...t.overrides, ...n.overrides },
    now: n.now ?? t.now,
    unknownMacro: n.unknownMacro,
    random: n.random,
    pickSeed: n.pickSeed,
    maxIterations: n.maxIterations
  }), s = n.previewLength ?? 80;
  return {
    text: r.text,
    trace: r.trace.map((a) => ({
      name: a.name,
      source: a.source === "env" ? Rx(a.name, t, n) : Px(a.source),
      preview: Th(a.preview, s)
    }))
  };
}
function Px(e) {
  return e === "variable" || e === "control" ? "computed" : e === "env" ? "dynamic" : e;
}
function Rx(e, t, n) {
  return Eh(e, n.overrides, t.overrides, t.dynamic) !== void 0 ? "dynamic" : Object.prototype.hasOwnProperty.call(t, e) ? "context" : "dynamic";
}
function Mx(e, t, n, r) {
  const s = Eh(e, n.overrides, t.overrides, t.dynamic);
  if (s !== void 0)
    return { value: Ch(s), source: "dynamic" };
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
function Eh(e, ...t) {
  for (const n of t)
    if (n !== void 0 && Object.prototype.hasOwnProperty.call(n, e))
      return n[e];
}
function Cn(e) {
  return e === void 0 ? { value: "", source: "unknown" } : { value: Ch(e), source: "context" };
}
function Ch(e) {
  return e == null ? "" : String(e);
}
function Th(e, t) {
  return e.length <= t ? e : `${e.slice(0, Math.max(0, t - 1))}…`;
}
function Dx(e) {
  return e instanceof Date ? e : new Date(e);
}
const Lu = [
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
], Ih = /* @__PURE__ */ new Set([
  "worldInfoBefore",
  "worldInfoAfter",
  "enhanceDefinitions",
  "charDescription",
  "charPersonality",
  "scenario",
  "personaDescription",
  "dialogueExamples",
  "chatHistory"
]), Ah = Lu.map((e) => ({
  identifier: e,
  content: "",
  marker: Ih.has(e),
  role: "system"
})), Ox = new Set(Ah.map((e) => e.identifier));
function Lx(e = {}) {
  const t = Cr(e), n = $x(t?.prompts), r = new Map(n.map((_) => [_.identifier, _])), s = new Map(Ah.map((_) => [_.identifier, _])), a = Fx(t?.prompt_order ?? t?.promptOrder), o = a.length > 0 ? a : zx(n), u = Oh(t?.generation_trigger ?? t?.generationTrigger ?? t?.generationTriggers ?? t?.trigger), c = [], p = [], h = [], b = [], g = [], w = [], E = [];
  o.forEach((_, x) => {
    const N = r.get(_.identifier) ?? _.inlinePrompt, l = s.get(_.identifier), f = N ?? l;
    if ((en(_.enabled) ?? en(f?.enabled) ?? !0) === !1) {
      if (_.identifier === "main") {
        b.push(_.identifier), c.push({
          identifier: _.identifier,
          content: "",
          enabled: !1,
          marker: !0,
          order: _.order ?? x,
          source: "anchor",
          anchor: !0
        });
        return;
      }
      h.push(_.identifier);
      return;
    }
    const m = _.generation_trigger ?? f?.generation_trigger;
    if (!Ux(m, u)) {
      g.push(_.identifier);
      return;
    }
    if (f === void 0) {
      p.push(_.identifier), E.push(`Unknown prompt identifier: ${_.identifier}`);
      return;
    }
    const v = N !== void 0 ? "input" : a.length > 0 ? "fallback" : "default";
    v === "fallback" && w.push(_.identifier), c.push(Bx(f, _, x, v));
  });
  const A = {
    main: Kf("main", c, qf(t, "main")),
    jailbreak: Kf("jailbreak", c, qf(t, "jailbreak"))
  }, D = c;
  return {
    prompts: D,
    collection: D,
    diagnostics: {
      unknownPromptIds: p,
      disabledSkipped: h,
      disabledAnchors: b,
      triggerSkipped: g,
      missingPromptFallbacks: w,
      overrides: A,
      warnings: E
    }
  };
}
function zx(e) {
  const t = Lu.map((r, s) => ({
    identifier: r,
    enabled: !0,
    order: s
  })), n = e.filter((r) => !Ox.has(r.identifier)).map((r, s) => ({
    identifier: r.identifier,
    enabled: r.enabled,
    order: Lu.length + s
  }));
  return [...t, ...n];
}
function Bx(e, t, n, r) {
  return md({
    identifier: e.identifier,
    name: e.name,
    content: e.content,
    enabled: !0,
    marker: en(t.marker) ?? en(e.marker) ?? Ih.has(e.identifier),
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
function Kf(e, t, n) {
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
function $x(e) {
  if (Array.isArray(e))
    return e.flatMap((n) => {
      const r = go(n);
      return r === void 0 ? [] : [r];
    });
  const t = Cr(e);
  return t === void 0 ? [] : Object.entries(t).flatMap(([n, r]) => {
    const s = Cr(r), a = go(s === void 0 ? { identifier: n, content: r } : { identifier: n, ...s });
    return a === void 0 ? [] : [a];
  });
}
function go(e) {
  const t = Cr(e);
  if (t === void 0)
    return;
  const n = gr(t, ["identifier", "id", "prompt_id", "promptId", "name"]);
  if (n === void 0 || n.trim() === "")
    return;
  const r = gr(t, ["content", "prompt", "text", "value", "message"]) ?? gr(t, ["system_prompt"]);
  return md({
    identifier: n,
    name: gr(t, ["name", "label"]),
    content: r ?? "",
    enabled: en(t.enabled),
    marker: en(t.marker),
    role: Mh(t.role),
    injection_position: Dh(t.injection_position ?? t.injectionPosition),
    injection_depth: Aa(t.injection_depth ?? t.injectionDepth),
    injection_order: Aa(t.injection_order ?? t.injectionOrder),
    forbid_overrides: en(t.forbid_overrides ?? t.forbidOverrides),
    generation_trigger: Ph(t)
  });
}
function Fx(e) {
  const t = Wl(e);
  if (t.length > 0)
    return t;
  if (Array.isArray(e))
    for (const r of e) {
      const s = Cr(r), a = Wl(s?.order ?? s?.prompts ?? s?.prompt_order);
      if (a.length > 0)
        return a;
    }
  const n = Cr(e);
  return Wl(n?.order ?? n?.prompts ?? n?.prompt_order);
}
function Wl(e) {
  return Array.isArray(e) ? e.flatMap((t, n) => {
    const r = Hx(t, n);
    return r === void 0 ? [] : [r];
  }) : [];
}
function Hx(e, t) {
  if (typeof e == "string")
    return { identifier: e, order: t };
  const n = Cr(e);
  if (n === void 0)
    return;
  const r = gr(n, ["identifier", "id", "prompt_id", "promptId", "prompt", "name"]);
  if (r === void 0 || r.trim() === "")
    return;
  const s = go({ identifier: r, ...n }), a = gr(n, ["content", "text", "value", "message"]) !== void 0;
  return md({
    identifier: r,
    enabled: en(n.enabled),
    order: Aa(n.order ?? n.position) ?? t,
    marker: en(n.marker),
    role: Mh(n.role),
    injection_position: Dh(n.injection_position ?? n.injectionPosition),
    injection_depth: Aa(n.injection_depth ?? n.injectionDepth),
    injection_order: Aa(n.injection_order ?? n.injectionOrder),
    forbid_overrides: en(n.forbid_overrides ?? n.forbidOverrides),
    generation_trigger: Ph(n),
    inlinePrompt: a ? s : void 0
  });
}
function Ux(e, t) {
  if (e === void 0 || e.length === 0)
    return !0;
  if (t === void 0 || t.length === 0)
    return !1;
  const n = new Set(t);
  return e.some((r) => n.has(r));
}
function qf(e, t) {
  if (e === void 0)
    return;
  const n = Cr(e.overrides), r = Rh(n?.[t]);
  return r !== void 0 ? r : t === "main" ? gr(e, ["main_prompt", "mainPrompt"]) : gr(e, ["jailbreak_prompt", "jailbreakPrompt"]);
}
function Ph(e) {
  return Oh(e.generation_trigger ?? e.generationTrigger ?? e.generation_triggers ?? e.generationTriggers ?? e.triggers ?? e.trigger);
}
function Cr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e) ? e : void 0;
}
function gr(e, t) {
  for (const n of t) {
    const r = Rh(e[n]);
    if (r !== void 0)
      return r;
  }
}
function Rh(e) {
  return typeof e == "string" ? e : void 0;
}
function Mh(e) {
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
function Aa(e) {
  if (typeof e == "number" && Number.isFinite(e))
    return e;
  if (typeof e == "string" && e.trim() !== "") {
    const t = Number(e);
    return Number.isFinite(t) ? t : void 0;
  }
}
function Dh(e) {
  return typeof e == "string" || typeof e == "number" ? e : void 0;
}
function Oh(e) {
  if (e !== void 0) {
    if (typeof e == "string")
      return e.trim() === "" ? [] : [e];
    if (Array.isArray(e))
      return e.flatMap((t) => typeof t == "string" ? [t] : []);
  }
}
function md(e) {
  const t = {};
  for (const [n, r] of Object.entries(e))
    r !== void 0 && (t[n] = r);
  return t;
}
function Wx(e) {
  const t = e.baseOrder ?? 0, n = [], r = [], s = [], a = [], o = [], u = nw(e), c = rw(e.authorNote), p = Kx(e, c, u, a), h = [], b = [], g = [
    "Prompt-critical A2 preserves PromptManager prompt/order/injection metadata but does not implement full ST extension prompt semantics.",
    "WI atDepth/outlet buckets are surfaced in diagnostics but not depth-injected into chat history by buildPrompt."
  ], w = Jx(e);
  if (w !== void 0) {
    const E = Lx(tw(w));
    for (const A of E.collection)
      qx(n, r, s, h, o, A, p, t);
    return Vl(n, r, s, h, b, "instruct", p.instruct?.content, t + 0), Vl(n, r, s, h, b, "authorNote", p.authorNote?.content, t + 60), Vl(n, r, s, h, b, "postHistory", p.postHistory?.content, t + 90), Yf(e, o), {
      blocks: n,
      diagnostics: {
        includedBlocks: r,
        skippedFields: s,
        macroTrace: a,
        warnings: o,
        unsupported: g,
        markerMapping: h,
        promptManager: E.diagnostics,
        knownDeltas: b
      }
    };
  }
  return In(n, r, "instruct", p.instruct?.content, t + 0), In(n, r, "worldInfoBefore", p.worldInfoBefore?.content, t + 10), In(n, r, "personaDescription", p.personaDescription?.content, t + 20), In(n, r, "charDescription", p.charDescription?.content, t + 30), In(n, r, "charPersonality", p.charPersonality?.content, t + 40), In(n, r, "scenario", p.scenario?.content, t + 50), In(n, r, "authorNote", p.authorNote?.content, t + 60), In(n, r, "worldInfoAfter", p.worldInfoAfter?.content, t + 80), In(n, r, "postHistory", p.postHistory?.content, t + 90), Zx(s, p), Yf(e, o), { blocks: n, diagnostics: { includedBlocks: r, skippedFields: s, macroTrace: a, warnings: o, unsupported: g, markerMapping: h, knownDeltas: b } };
}
function In(e, t, n, r, s, a = {}) {
  r === void 0 || r.trim() === "" || (e.push(hd({ identifier: n, role: a.role ?? "system", content: r, enabled: !0, order: s, ...a })), t.push(n));
}
const Gx = /* @__PURE__ */ new Set([
  "worldInfoBefore",
  "worldInfoAfter",
  "personaDescription",
  "charDescription",
  "charPersonality",
  "scenario",
  "dialogueExamples",
  "chatHistory",
  "jailbreak"
]), Vx = [
  "instruct",
  "personaDescription",
  "charDescription",
  "charPersonality",
  "scenario",
  "authorNote",
  "postHistory"
];
function Kx(e, t, n, r) {
  return {
    worldInfoBefore: Gl(Kl(e.worldInfo?.buckets.before), !0),
    worldInfoAfter: Gl(Kl(e.worldInfo?.buckets.after), !0),
    personaDescription: Un(e.persona, !0, n, r),
    charDescription: Un(e.character?.description, !0, n, r),
    charPersonality: Un(e.character?.personality, !0, n, r),
    scenario: Un(e.character?.scenario, !0, n, r),
    dialogueExamples: Un(e.character?.mesExamples, !0, n, r),
    chatHistory: Gl("", !0),
    jailbreak: Un(e.jailbreak, !0, n, r),
    instruct: Un(e.instruct, !1, n, r),
    authorNote: Un(Kl([
      ...t.position === "top" ? [t.content] : [],
      ...e.worldInfo?.buckets.ANTop ?? [],
      ...e.worldInfo?.buckets.ANBottom ?? [],
      ...t.position === "bottom" ? [t.content] : []
    ]), !1, n, r),
    postHistory: Un(e.postHistory, !1, n, r)
  };
}
function Gl(e, t) {
  return e === void 0 ? void 0 : { content: e, marker: t };
}
function Un(e, t, n, r) {
  if (e === void 0)
    return;
  const s = Ia(e, n);
  return r.push(...s.trace), { content: s.text, marker: t };
}
function qx(e, t, n, r, s, a, o, u) {
  if (a.enabled === !1)
    return;
  const c = Yx(a.identifier, a.marker), h = (c === void 0 ? void 0 : o[c]?.content) ?? (c === "chatHistory" ? "" : a.content), b = a.identifier === "chatHistory";
  if (h.trim() === "" && !b) {
    c !== void 0 && n.push(c);
    return;
  }
  const g = Xx(a.role, s, a.identifier), w = Qx(a, g), E = a.identifier;
  e.push(hd({
    identifier: E,
    role: g ?? "system",
    content: h,
    enabled: !0,
    order: u + a.order,
    ...w
  })), t.push(E), r.push({
    blockIdentifier: E,
    promptIdentifier: a.identifier,
    marker: a.marker,
    source: a.source,
    order: a.order,
    field: c
  });
}
function Vl(e, t, n, r, s, a, o, u) {
  if (s.push(`${a} is emitted as an engine-core internal prompt-critical block because ST PromptManager has no matching marker.`), o === void 0 || o.trim() === "") {
    n.push(String(a));
    return;
  }
  In(e, t, a, o, u), r.push({
    blockIdentifier: a,
    promptIdentifier: a,
    marker: !1,
    source: "internal",
    order: u,
    field: String(a)
  });
}
function Yx(e, t) {
  return t && Gx.has(e) ? e : void 0;
}
function Qx(e, t) {
  return hd({
    role: t,
    position: typeof e.injection_position == "number" ? e.injection_position : void 0,
    injection_position: e.injection_position,
    injection_depth: e.injection_depth,
    injection_order: e.injection_order
  });
}
function Xx(e, t, n) {
  if (e !== void 0) {
    if (e === "system" || e === "user" || e === "assistant" || e === "tool")
      return e;
    t.push(`PromptManager prompt ${n} uses unsupported role ${e}; falling back to system.`);
  }
}
function Zx(e, t) {
  for (const n of Vx)
    (t[n] === void 0 || t[n]?.content.trim() === "") && e.push(n);
}
function Yf(e, t) {
  (e.worldInfo?.buckets.atDepth.length ?? 0) > 0 && t.push("WI atDepth bucket produced content; buildPromptCriticalBlocks does not splice it into chat depth."), (e.worldInfo?.buckets.outlet.length ?? 0) > 0 && t.push("WI outlet bucket produced content; engine-core P1 exposes diagnostics only.");
}
function Jx(e) {
  const t = ew(e.promptManager ?? e.prompt_manager);
  if (t !== void 0)
    return t;
  if (e.prompts !== void 0 || e.prompt_order !== void 0 || e.promptOrder !== void 0 || e.generationType !== void 0 || e.generation_type !== void 0 || e.main_prompt !== void 0 || e.mainPrompt !== void 0 || e.jailbreak_prompt !== void 0 || e.jailbreakPrompt !== void 0 || e.overrides !== void 0)
    return e;
}
function ew(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e) ? e : void 0;
}
function tw(e) {
  const t = e.generationType ?? e.generation_type;
  return t === void 0 ? e : { ...e, generation_trigger: e.generation_trigger ?? t };
}
function nw(e) {
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
function rw(e) {
  return e === void 0 ? { content: "", position: "bottom" } : typeof e == "string" ? { content: e, position: "bottom" } : e;
}
function Kl(e) {
  return (e ?? []).filter((t) => t.trim() !== "").join(`
`);
}
function hd(e) {
  const t = {};
  for (const [n, r] of Object.entries(e))
    r !== void 0 && (t[n] = r);
  return t;
}
const sw = new Set(Gy), Qt = {
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
}, aw = new Set(Object.values(Qt).flatMap((e) => [...e]));
function iw(e) {
  const t = Lh(e) ? e : {}, n = {}, r = Ur(t, Qt.temperature), s = Ur(t, Qt.top_p), a = Qf(t, Qt.top_k), o = Ur(t, Qt.min_p), u = Ur(t, Qt.repetition_penalty), c = Ur(t, Qt.frequency_penalty), p = Ur(t, Qt.presence_penalty), h = Qf(t, Qt.max_tokens), b = ow(t, Qt.stream), g = lw(t, Qt.stop), w = uw(t, Qt.logit_bias);
  for (const [E, A] of Object.entries(t))
    sw.has(E) && !aw.has(E) && (n[E] = A);
  return cw({
    temperature: r,
    top_p: s,
    top_k: a,
    min_p: o,
    repetition_penalty: u,
    frequency_penalty: c,
    presence_penalty: p,
    max_tokens: h,
    stream: b,
    stop: g,
    logit_bias: w,
    extensions: {
      st_sampler_passthrough: n
    }
  });
}
function Lh(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Ur(e, t) {
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
function Qf(e, t) {
  const n = Ur(e, t);
  return n === void 0 ? void 0 : Math.trunc(n);
}
function ow(e, t) {
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
function lw(e, t) {
  for (const n of t) {
    const r = e[n];
    if (typeof r == "string" || Array.isArray(r) && r.every((s) => typeof s == "string"))
      return r;
  }
}
function uw(e, t) {
  for (const n of t) {
    const r = e[n];
    if (!Lh(r))
      continue;
    const s = Object.entries(r);
    if (s.every(([, a]) => typeof a == "number" && Number.isFinite(a)))
      return Object.fromEntries(s);
  }
}
function cw(e) {
  const t = {};
  for (const [n, r] of Object.entries(e))
    r !== void 0 && (t[n] = r);
  return t;
}
const dw = /^[A-Za-z_][A-Za-z0-9_-]*$/u, fw = ["store", "project", "env"];
function gd(e) {
  const t = e.trim();
  if (t.length === 0)
    return;
  const n = /^secret_ref:([^:]+):(.+)$/u.exec(t);
  if (!n)
    return;
  const r = n[1], s = n[2];
  if (!(r === void 0 || s === void 0 || !mw(r) || !dw.test(s)))
    return { scope: r, name: s, ref: `secret_ref:${r}:${s}` };
}
function pw(e) {
  return gd(e) !== void 0;
}
function zh(e, t = "secret_ref") {
  const n = gd(e);
  if (!n)
    throw new Error(`${t} must be one of secret_ref:store:NAME, secret_ref:project:NAME, or secret_ref:env:NAME with a safe NAME`);
  return n.ref;
}
function mw(e) {
  return fw.includes(e);
}
const Xf = /* @__PURE__ */ new Map([
  [0, "before"],
  [1, "after"],
  [2, "ANTop"],
  [3, "ANBottom"],
  [4, "atDepth"],
  [5, "EMTop"],
  [6, "EMBottom"],
  [7, "outlet"]
]), hw = /* @__PURE__ */ new Map([
  [0, "AND_ANY"],
  [1, "NOT_ALL"],
  [2, "NOT_ANY"],
  [3, "AND_ALL"]
]), gw = /* @__PURE__ */ new Set([
  "before",
  "after",
  "ANTop",
  "ANBottom",
  "atDepth",
  "EMTop",
  "EMBottom",
  "outlet"
]), Bh = 4, vw = 8192, _w = "ydltavern-fixture-v1", yw = "normal", $h = /* @__PURE__ */ new Set([
  "normal",
  "continue",
  "impersonate",
  "swipe",
  "regenerate",
  "quiet"
]), xw = ["triggers", "trigger", "generationTriggers", "generationTrigger", "generationTypes", "generationType", "generation_type"], ww = [
  "matchPersonaDescription",
  "matchCharacterDescription",
  "matchCharacterPersonality",
  "matchCharacterDepthPrompt",
  "matchScenario",
  "matchCreatorNotes"
];
function bw(e) {
  const t = Math.max(0, e.scanDepth ?? 4), n = Math.max(1, e.maxRecursion ?? e.max_recursion ?? e.recursiveScanDepth ?? 1), r = Math.max(0, e.minActivations ?? e.min_activations ?? e.minimumActivations ?? 0), s = e.budget?.type ?? "approxTokens", a = lb(e), o = zw(e), u = e.dryRun === !0 || e.dry_run === !0, c = [], p = ["ST token-level budget alignment is approximated, not tokenizer exact.", "Vector lore is not implemented in engine-core P1."], h = Sw(e), b = Bw(e.runtimeState ?? e.state), g = np(b), w = [];
  u || Hw(h, b, g, o, w);
  const E = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), D = Fh(e), _ = Aw(e);
  let x = Uh(e.chat, t, e.scanData), N = 0, l = 0;
  for (let v = 0; v < n; v += 1) {
    l = v + 1;
    const k = [];
    for (const P of h) {
      if (E.has(P.id))
        continue;
      const z = Hh(P.entry.delay);
      if (z > 0 && o < z) {
        const Z = { reason: `delay active until chatLength ${z}`, code: "delay_active", matchedKeys: [], matchedSecondaryKeys: [] };
        Xt(A, P, Z.reason ?? "delay active", Z.code), w.push(lt(P, !1, Z, v));
        continue;
      }
      const j = rp(g.sticky, P, o);
      if (j !== void 0) {
        const Z = { activated: !0, reason: `sticky active through chatLength ${j.end}`, code: "sticky_active", matchedKeys: [], matchedSecondaryKeys: [] }, oe = Ia(ql(P.entry.content), e.macroContext ?? {}), ne = Yl(oe.text);
        if (a !== void 0 && P.entry.ignoreBudget !== !0 && N + ne > a) {
          const _e = { ...Z, reason: "budget exceeded", code: "budget_exceeded" };
          Xt(A, P, _e.reason ?? "budget exceeded", _e.code), w.push(lt(P, !1, _e, v));
          continue;
        }
        k.push({ candidate: P, match: Z, expanded: oe, cost: ne, stateActivation: "sticky" });
        continue;
      }
      const $ = rp(g.cooldown, P, o);
      if ($ !== void 0) {
        const Z = { reason: `cooldown active through chatLength ${$.end}`, code: "cooldown_active", matchedKeys: [], matchedSecondaryKeys: [] };
        Xt(A, P, Z.reason ?? "cooldown active", Z.code), w.push(lt(P, !1, Z, v));
        continue;
      }
      const O = sp(P.entry, x, v, D);
      if (!O.activated) {
        Xt(A, P, O.reason ?? "keys did not match", O.code ?? "key_mismatch"), w.push(lt(P, !1, O, v));
        continue;
      }
      if (!Zf(P, _, w, v).passed) {
        Xt(A, P, "probability roll failed", "probability_failed");
        continue;
      }
      const H = Ia(ql(P.entry.content), e.macroContext ?? {}), G = Yl(H.text);
      if (a !== void 0 && P.entry.ignoreBudget !== !0 && N + G > a) {
        const Z = { ...O, reason: "budget exceeded", code: "budget_exceeded" };
        Xt(A, P, Z.reason, Z.code), w.push(lt(P, !1, Z, v));
        continue;
      }
      k.push({ candidate: P, match: O, expanded: H, cost: G });
    }
    const S = Rw(k, _, w, A, v), C = [];
    let L = N;
    for (const P of S) {
      if (a !== void 0 && P.candidate.entry.ignoreBudget !== !0 && L + P.cost > a) {
        const z = { ...P.match, reason: "budget exceeded", code: "budget_exceeded" };
        Xt(A, P.candidate, z.reason, z.code), w.push(lt(P.candidate, !1, z, v));
        continue;
      }
      L += P.cost, C.push(P);
    }
    const B = Dw(C, E, A, w, v, c);
    if (u || Fw(C, g, o), N += C.reduce((P, z) => P + z.cost, 0), B.length === 0)
      break;
    x = `${x}
${B.join(`
`)}`;
  }
  if (r > E.size) {
    const v = Iw(e, t, x);
    if (v !== x) {
      c.push(`WI min activations requested ${r}; expanded scan text from ${x.length} to ${v.length} characters.`), x = v;
      for (const k of h) {
        if (E.size >= r)
          break;
        if (E.has(k.id))
          continue;
        const S = sp(k.entry, x, l, { ...D, minActivationScan: !0 });
        if (!S.activated) {
          Xt(A, k, S.reason ?? "keys did not match", S.code ?? "key_mismatch"), w.push(lt(k, !1, S, l));
          continue;
        }
        if (!Zf(k, _, w, l).passed) {
          Xt(A, k, "probability roll failed", "probability_failed");
          continue;
        }
        const L = Ia(ql(k.entry.content), e.macroContext ?? {}), B = Yl(L.text);
        if (a !== void 0 && k.entry.ignoreBudget !== !0 && N + B > a) {
          const j = { ...S, reason: "budget exceeded", code: "budget_exceeded" };
          Xt(A, k, j.reason, j.code), w.push(lt(k, !1, j, l));
          continue;
        }
        N += B, A.delete(k.id), w.push(lt(k, !0, S, l));
        const P = Wh(k.entry.position, c), z = {
          id: k.id,
          book: k.bookName,
          comment: k.entry.comment,
          content: L.text,
          position: P,
          order: k.entry.order ?? 0,
          depth: P === "atDepth" ? Gh(k.entry.depth) : k.entry.depth,
          role: P === "atDepth" ? Vh(k.entry, c) : void 0,
          outletName: P === "outlet" ? Kh(k.entry) : void 0,
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
  const f = [...E.values()].sort(qh), d = rb(f, ib(e)), m = u ? np(b) : $w(g, o);
  return {
    activated: f,
    skipped: [...A.values()].sort((v, k) => v.id.localeCompare(k.id)),
    buckets: d.buckets,
    diagnostics: {
      scanDepth: t,
      scanTextChars: x.length,
      iterations: l,
      budgetType: s,
      budgetLimit: a,
      usedBudget: N,
      warnings: c,
      unsupported: [...p, ...ob(d.uninserted)],
      uninserted: d.uninserted,
      activationTrace: w,
      routingTrace: d.routingTrace
    },
    nextState: m
  };
}
function Sw(e) {
  const t = [...e.books ?? [], ...e.book === void 0 ? [] : [e.book]], n = [];
  let r = 0;
  for (const s of t)
    for (const a of s.entries ?? []) {
      const o = String(a.uid ?? a.id ?? `${s.name ?? "book"}:${r}`);
      n.push({ entry: a, bookName: s.name, id: o, index: r }), r += 1;
    }
  return n.sort((s, a) => tb(s.entry, a.entry) || s.index - a.index);
}
function Fh(e) {
  const t = vd(e.generationType ?? e.generation_type), n = e.activeCharacterName ?? e.active_character_name ?? e.characterName ?? e.character_name ?? e.charName ?? e.character?.name, r = _n(e.activeCharacterTags ?? e.active_character_tags ?? e.characterTags ?? e.character_tags ?? e.charTags ?? e.character?.tags);
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
function vd(e) {
  switch (e?.toLowerCase().replace(/[^a-z0-9]/gu, "") ?? yw) {
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
function kw(e, t) {
  const n = [];
  for (const s of xw)
    n.push(..._n(e[s]));
  n.push(...Nw(e.selectiveLogic));
  const r = n.map(vd).filter((s, a, o) => $h.has(s) && o.indexOf(s) === a);
  return { matches: r.length === 0 || r.includes(t), triggers: r };
}
function Nw(e) {
  return _n(e).filter((n) => $h.has(vd(n)) || n.toLowerCase() === "continuation");
}
function jw(e, t, n) {
  const r = e.characterFilter ?? e.character_filter;
  if (r === void 0)
    return !0;
  const s = Fi(t), a = new Set(n.map(Fi)), { names: o, tags: u, exclude: c } = Ew(r);
  if (o.length === 0 && u.length === 0)
    return !0;
  const p = o.length > 0 && s !== void 0 && o.some((g) => Fi(g) === s), h = u.length > 0 && u.some((g) => a.has(Fi(g) ?? "")), b = p || h;
  return c ? !b : b;
}
function Ew(e) {
  if (typeof e == "string" || Array.isArray(e))
    return { names: _n(e), tags: [], exclude: !1 };
  const t = e;
  return {
    names: _n(t.names ?? t.name ?? t.characterNames),
    tags: _n(t.tags ?? t.tag),
    exclude: t.isExclude === !0 || t.exclude === !0
  };
}
function Cw(e) {
  const t = [
    ..._n(e.decorators),
    ..._n(e.decorator),
    ..._n(e.activationDecorator)
  ].map((n) => n.toLowerCase().replace(/[^a-z_]/gu, "")).join(" ");
  if (e.dontActivate === !0 || e.dont_activate === !0 || t.includes("dont_activate") || t.includes("dontactivate"))
    return "dont_activate";
  if (e.activate === !0 || t.includes("activate") || /@@activate\b/iu.test(e.content))
    return /@@dont_activate\b/iu.test(e.content) ? "dont_activate" : "activate";
  if (/@@dont_activate\b/iu.test(e.content))
    return "dont_activate";
}
function ql(e) {
  return e.replace(/@@(?:dont_activate|activate)\b\s*/giu, "").trim();
}
function Tw(e, t) {
  const n = [];
  for (const r of ww)
    if (e[r] === !0) {
      const s = t[r];
      s !== void 0 && s.trim() !== "" && n.push(s);
    }
  return n.join(`
`);
}
function Iw(e, t, n) {
  const r = Math.max(t, e.chat.turns.length), s = Uh(e.chat, r, e.scanData), a = Fh(e), o = Object.values(a.scanFlagTexts).filter((u) => u !== void 0 && u.trim() !== "");
  return [...new Set([n, s, ...o].filter((u) => u.trim() !== ""))].join(`
`);
}
function lt(e, t, n, r, s) {
  return Zs({
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
function Aw(e) {
  const t = e.randomValues ?? e.rngSequence;
  let n = 0;
  const r = e.random === void 0 && t === void 0 ? jh(_w) : void 0;
  return {
    next() {
      const s = n;
      n += 1;
      const a = t?.[s] ?? e.random?.() ?? r?.() ?? Math.random();
      return { index: s, value: Pw(a) };
    }
  };
}
function Pw(e) {
  return !Number.isFinite(e) || e < 0 ? 0 : e >= 1 ? e === 1 ? 1 : e % 1 : e;
}
function Zf(e, t, n, r) {
  const s = Ww(e.entry.probability);
  if (!(Fu(e.entry.useProbability ?? e.entry.use_probability) === !0) || s >= 100)
    return { passed: !0 };
  const o = t.next(), u = o.value * 100, c = u <= s, p = {
    reason: `probability roll ${u.toFixed(4)} ${c ? "<=" : ">"} ${s}`,
    code: c ? "probability_roll" : "probability_failed",
    matchedKeys: [],
    matchedSecondaryKeys: []
  };
  return n.push(lt(e, c, p, r, { probability: s, roll: u, randomIndex: o.index, randomValue: o.value })), { passed: c };
}
function Rw(e, t, n, r, s) {
  const a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
  for (const c of e) {
    const p = ep(c.candidate.entry.group);
    if (p.length === 0) {
      u.add(c);
      continue;
    }
    for (const h of p)
      a.set(h, [...a.get(h) ?? [], c]), n.push(lt(c.candidate, !0, { ...c.match, code: "group_candidate", reason: `group candidate for ${h}` }, s, {
        group: h,
        score: zu(c),
        weight: Wa(c.candidate.entry)
      }));
  }
  for (const c of e) {
    const p = ep(c.candidate.entry.group);
    p.length !== 0 && p.every((h) => (o.has(h) || o.set(h, Mw(h, a.get(h) ?? [], t, n, r, s)), o.get(h) === c)) && u.add(c);
  }
  return e.filter((c) => u.has(c));
}
function Mw(e, t, n, r, s, a) {
  const o = Lw(t);
  if (o.length === 0)
    return;
  if (o.length === 1)
    return Ow(o[0], e, r, a), o[0];
  let u = o;
  if (u.filter((w) => Fu(w.candidate.entry.useGroupScoring ?? w.candidate.entry.use_group_scoring) === !0).length > 0) {
    const w = Math.max(...u.map(zu));
    u = u.filter((E) => {
      const A = zu(E);
      return A === w ? !0 : (Xt(s, E.candidate, `group scoring loser in ${e}`, "group_scoring_loser"), r.push(lt(E.candidate, !1, { ...E.match, code: "group_scoring_loser", reason: `group ${e} score ${A} below max ${w}` }, a, { group: e, score: A, maxScore: w })), !1);
    });
  }
  const p = u.filter((w) => Fu(w.candidate.entry.groupOverride ?? w.candidate.entry.group_override) === !0);
  if (p.length > 0) {
    const w = Math.max(...p.map((D) => D.candidate.entry.order ?? 0)), A = p.filter((D) => (D.candidate.entry.order ?? 0) === w).sort((D, _) => D.candidate.index - _.candidate.index)[0];
    return Jf(e, u, A, r, s, a), A;
  }
  const h = u.reduce((w, E) => w + Wa(E.candidate.entry), 0);
  let b = u[0], g;
  if (h > 0) {
    g = n.next();
    let w = g.value * h;
    for (const E of u)
      if (w -= Wa(E.candidate.entry), w <= 0) {
        b = E;
        break;
      }
  }
  return Jf(e, u, b, r, s, a, g), b;
}
function Dw(e, t, n, r, s, a) {
  const o = [];
  for (const u of e) {
    const { candidate: c, match: p, expanded: h } = u;
    n.delete(c.id), r.push(lt(c, !0, p, s));
    const b = Wh(c.entry.position, a), g = {
      id: c.id,
      book: c.bookName,
      comment: c.entry.comment,
      content: h.text,
      position: b,
      order: c.entry.order ?? 0,
      depth: b === "atDepth" ? Gh(c.entry.depth) : c.entry.depth,
      role: b === "atDepth" ? Vh(c.entry, a) : void 0,
      outletName: b === "outlet" ? Kh(c.entry) : void 0,
      matchedKeys: p.matchedKeys,
      matchedSecondaryKeys: p.matchedSecondaryKeys,
      reason: p.reason ?? "activated",
      code: p.code ?? "key_match",
      macroTrace: h.trace,
      activationIteration: s
    };
    t.set(c.id, g), c.entry.preventRecursion !== !0 && c.entry.excludeRecursion !== !0 && o.push(h.text);
  }
  return o;
}
function Jf(e, t, n, r, s, a, o) {
  if (n !== void 0)
    for (const u of t)
      u === n ? r.push(lt(u.candidate, !0, { ...u.match, code: "group_winner", reason: `group ${e} winner` }, a, {
        group: e,
        randomIndex: o?.index,
        randomValue: o?.value,
        weight: Wa(u.candidate.entry)
      })) : (Xt(s, u.candidate, `group ${e} loser`, "group_loser"), r.push(lt(u.candidate, !1, { ...u.match, code: "group_loser", reason: `group ${e} loser` }, a, {
        group: e,
        winnerEntryId: n.candidate.id,
        weight: Wa(u.candidate.entry)
      })));
}
function Ow(e, t, n, r) {
  e !== void 0 && n.push(lt(e.candidate, !0, { ...e.match, code: "group_winner", reason: `group ${t} winner` }, r, { group: t }));
}
function Lw(e) {
  return [...new Set(e)];
}
function zu(e) {
  return e.match.matchedKeys.length + e.match.matchedSecondaryKeys.length;
}
function ep(e) {
  return _n(e).map((t) => t.trim()).filter((t, n, r) => t.length > 0 && r.indexOf(t) === n);
}
function Wa(e) {
  const t = Number(e.groupWeight ?? e.group_weight ?? 1);
  return Number.isFinite(t) && t > 0 ? t : 1;
}
function zw(e) {
  const t = e.chatLength ?? e.chat_length;
  return Number.isFinite(t) && t !== void 0 ? Math.max(0, Math.floor(t)) : e.chat.turns.filter((n) => n.hidden !== !0 && n.deleted !== !0).length;
}
function Bw(e, t) {
  return {
    sticky: tp(e?.sticky),
    cooldown: tp(e?.cooldown)
  };
}
function tp(e) {
  if (e === void 0)
    return [];
  const t = [];
  for (const n of e) {
    const r = Math.floor(Number(n.start)), s = Math.floor(Number(n.end)), a = n.entryId ?? n.id, o = n.entryHash ?? n.hash;
    !Number.isFinite(r) || !Number.isFinite(s) || a === void 0 && o === void 0 || t.push(Zs({ entryId: a, entryHash: o, start: r, end: s, protected: n.protected === !0 }));
  }
  return t;
}
function np(e) {
  return {
    sticky: e.sticky?.map((t) => ({ ...t })) ?? [],
    cooldown: e.cooldown?.map((t) => ({ ...t })) ?? []
  };
}
function $w(e, t) {
  return {
    sticky: (e.sticky ?? []).filter((n) => n.end >= t),
    cooldown: (e.cooldown ?? []).filter((n) => n.end >= t)
  };
}
function rp(e, t, n) {
  const r = Po(t.entry);
  return e?.find((s) => s.start <= n && s.end >= n && (s.entryId === t.id || s.entryHash === r));
}
function Fw(e, t, n) {
  const r = [...t.sticky ?? []], s = [...t.cooldown ?? []];
  for (const a of e) {
    if (a.stateActivation === "sticky")
      continue;
    const o = $u(a.candidate.entry.sticky), u = $u(a.candidate.entry.cooldown), c = Po(a.candidate.entry);
    o > 0 && Bu(r, { entryId: a.candidate.id, entryHash: c, start: n, end: n + o }), u > 0 && o === 0 && Bu(s, { entryId: a.candidate.id, entryHash: c, start: n + 1, end: n + u });
  }
  t.sticky = r, t.cooldown = s;
}
function Hw(e, t, n, r, s) {
  const a = [...n.sticky ?? []].filter((u) => u.end >= r), o = [...n.cooldown ?? []];
  for (const u of t.sticky ?? []) {
    if (u.end >= r || u.protected === !0)
      continue;
    const c = e.find((b) => b.id === u.entryId || Po(b.entry) === u.entryHash);
    if (c === void 0)
      continue;
    const p = $u(c.entry.cooldown);
    if (p <= 0)
      continue;
    const h = {
      entryId: c.id,
      entryHash: Po(c.entry),
      start: u.end + 1,
      end: u.end + p,
      protected: !0
    };
    h.end >= r && Bu(o, h), s.push(lt(c, !1, { reason: `sticky expired; protected cooldown until chatLength ${h.end}`, code: "protected_cooldown_transition", matchedKeys: [], matchedSecondaryKeys: [] }, 0));
  }
  n.sticky = a, n.cooldown = o;
}
function Bu(e, t) {
  const n = e.findIndex((r) => r.entryId === t.entryId || r.entryHash === t.entryHash);
  n >= 0 ? e[n] = t : e.push(t);
}
function $u(e) {
  return e === !0 ? 1 : e === !1 || e === void 0 ? 0 : Hh(e);
}
function Hh(e) {
  const t = Number(e ?? 0);
  return !Number.isFinite(t) || t <= 0 ? 0 : Math.floor(t);
}
function Po(e) {
  return Uw(`${_n(e.key ?? e.keys).join("")}${e.content}`);
}
function Uw(e) {
  let t = 2166136261;
  for (let n = 0; n < e.length; n += 1)
    t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
  return (t >>> 0).toString(16).padStart(8, "0");
}
function Ww(e) {
  const t = Number(e ?? 100);
  return Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : 100;
}
function Fu(e) {
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
function sp(e, t, n, r) {
  if (e.disable === !0 || e.disabled === !0)
    return { activated: !1, reason: "disabled", code: "disabled", matchedKeys: [], matchedSecondaryKeys: [] };
  const s = Cw(e);
  if (s === "dont_activate")
    return { activated: !1, reason: "decorator @@dont_activate blocked entry", code: "decorator_blocked", matchedKeys: [], matchedSecondaryKeys: [] };
  if (!kw(e, r.generationType).matches)
    return {
      activated: !1,
      reason: `generation trigger mismatch for ${r.generationType}`,
      code: "trigger_mismatch",
      matchedKeys: [],
      matchedSecondaryKeys: []
    };
  if (!jw(e, r.characterName, r.characterTags))
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
  const o = Tw(e, r.scanFlagTexts), u = r.minActivationScan ? t : Yw(t, e.scanDepth ?? e.scan_depth), c = o.length === 0 ? u : `${u}
${o}`, p = e.key ?? e.keys ?? [], h = e.keysecondary ?? e.secondaryKeys ?? [], b = e.caseSensitive ?? e.case_sensitive ?? !1, g = e.matchWholeWords ?? e.match_whole_words ?? !1, w = e.constant === !0 ? [] : ap(p, c, b, g), E = r.minActivationScan ? "min activation scan " : o.length > 0 ? "scan flag match " : "", A = r.minActivationScan ? "min_activation_scan" : o.length > 0 ? "scan_flag_match" : "key_match";
  if (e.constant !== !0 && p.length > 0 && w.length === 0)
    return { activated: !1, reason: `${E}primary keys did not match`.trim(), code: "key_mismatch", matchedKeys: w, matchedSecondaryKeys: [] };
  if (e.constant !== !0 && p.length === 0)
    return { activated: !1, reason: "no primary keys", code: "key_mismatch", matchedKeys: w, matchedSecondaryKeys: [] };
  const D = ap(h, c, b, g), _ = Jw(e.logic ?? (eb(e.selectiveLogic) || typeof e.selectiveLogic == "number" ? e.selectiveLogic : void 0));
  return h.length > 0 && !Gw(_, h.length, D.length) ? {
    activated: !1,
    reason: `${E}secondary keys failed ${_}`.trim(),
    code: "key_mismatch",
    matchedKeys: w,
    matchedSecondaryKeys: D
  } : { activated: !0, reason: `${E}${e.constant === !0 ? "constant entry" : "keys matched"}`.trim(), code: A, matchedKeys: w, matchedSecondaryKeys: D };
}
function Gw(e, t, n) {
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
function ap(e, t, n, r) {
  return e.filter((s) => Vw(s, t, n, r));
}
function Vw(e, t, n, r) {
  const s = Kw(e);
  if (s !== void 0)
    return s.test(t);
  const a = n ? "u" : "iu", o = r ? `(?<![\\p{L}\\p{N}_])${ip(e)}(?![\\p{L}\\p{N}_])` : ip(e);
  return new RegExp(o, a).test(t);
}
function Kw(e) {
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
function Uh(e, t, n) {
  const r = [];
  n !== void 0 && r.push(...Array.isArray(n) ? n : [n]);
  const s = e.turns.filter((o) => o.hidden !== !0 && o.deleted !== !0), a = t === 0 ? [] : s.slice(-t);
  return r.push(...a.map(qw).filter((o) => o.length > 0)), r.join(`
`);
}
function qw(e) {
  const t = e.variants[e.active_variant];
  if (t === void 0)
    return "";
  const n = t.subs.filter((r) => r.kind === "text").map((r) => r.text).join(`
`).trim();
  return n.length === 0 ? "" : `${e.role}: ${n}`;
}
function Yw(e, t) {
  return t === void 0 || t <= 0 ? e : e.split(`
`).slice(-t).join(`
`);
}
function Wh(e, t) {
  if (typeof e == "number") {
    const n = Xf.get(e);
    return n !== void 0 ? n : (t.push(`Unsupported WI numeric position '${e}' normalized to before.`), "before");
  }
  if (typeof e == "string") {
    if (gw.has(e))
      return e;
    const n = Number(e);
    if (Number.isInteger(n)) {
      const a = Xf.get(n);
      if (a !== void 0)
        return a;
    }
    const r = e.toLowerCase().replace(/[^a-z0-9]/gu, ""), s = Qw.get(r);
    if (s !== void 0)
      return s;
    t.push(`Unsupported WI position '${e}' normalized to before.`);
  }
  return "before";
}
const Qw = /* @__PURE__ */ new Map([
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
function Gh(e) {
  return Number.isFinite(e) && e !== void 0 && e >= 0 ? Math.floor(e) : Bh;
}
function Vh(e, t) {
  const n = e.role ?? e.depthRole ?? e.depth_role;
  if (n === void 0)
    return "system";
  if (typeof n == "number")
    return Xw.get(n) ?? "system";
  const r = n.toLowerCase().replace(/[^a-z0-9]/gu, ""), s = Zw.get(r);
  return s !== void 0 ? s : (t.push(`Unsupported WI atDepth role '${n}' normalized to system.`), "system");
}
const Xw = /* @__PURE__ */ new Map([
  [0, "system"],
  [1, "user"],
  [2, "assistant"],
  [3, "tool"]
]), Zw = /* @__PURE__ */ new Map([
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
function Kh(e) {
  const t = e.outletName ?? e.outlet_name ?? e.outlet;
  return t?.trim() === "" || t === void 0 ? "default" : t;
}
function Jw(e) {
  return typeof e == "number" ? hw.get(e) ?? "AND_ANY" : e === "NOT_ALL" || e === "NOT_ANY" || e === "AND_ALL" ? e : "AND_ANY";
}
function eb(e) {
  return e === "AND_ANY" || e === "NOT_ALL" || e === "NOT_ANY" || e === "AND_ALL";
}
function tb(e, t) {
  return (e.order ?? 0) - (t.order ?? 0);
}
function qh(e, t) {
  return e.order - t.order || e.id.localeCompare(t.id);
}
function nb(e) {
  return e.some((t) => (t.activationIteration ?? 0) > 0 && t.position === "before");
}
function rb(e, t) {
  const n = {
    before: [],
    after: [],
    ANTop: [],
    ANBottom: [],
    atDepth: [],
    EMTop: [],
    EMBottom: [],
    outlet: []
  }, r = [], s = [], a = {}, o = [], u = [], c = e.map((g, w) => ({ entry: g, index: w })).sort((g, w) => qh(g.entry, w.entry)), p = nb(e), h = p ? e.map((g, w) => ({ entry: g, index: w })).sort((g, w) => (g.entry.activationIteration ?? 0) - (w.entry.activationIteration ?? 0) || g.index - w.index) : c;
  for (const { entry: g } of h) {
    const w = sb(g);
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
        const A = { position: g.position === "EMTop" ? "before" : "after", content: g.content, entryId: g.id, order: g.order };
        p ? r.push(A) : r.unshift(A), u.push(`WI entry ${g.id} routed to ${g.position}; engine-core reports it but does not splice example messages.`);
        break;
      }
      case "atDepth": {
        p ? n.atDepth.push(g.content) : n.atDepth.unshift(g.content);
        const E = g.depth ?? Bh, A = g.role ?? "system", D = `${E}:${A}`;
        let _ = s.find((x) => `${x.depth}:${x.role}` === D);
        _ === void 0 && (_ = { depth: E, role: A, entries: [], content: [] }, p ? s.push(_) : s.unshift(_)), p ? (_.entries.push(w), _.content.push(g.content)) : (_.entries.unshift(w), _.content.unshift(g.content)), u.push(`WI entry ${g.id} routed to atDepth depth=${E} role=${A}; engine-core reports it but does not splice chat history.`);
        break;
      }
      case "outlet": {
        p ? n.outlet.push(g.content) : n.outlet.unshift(g.content);
        const E = g.outletName ?? "default";
        a[E] ??= { entries: [], content: [] }, p ? (a[E].entries.push(w), a[E].content.push(g.content)) : (a[E].entries.unshift(w), a[E].content.unshift(g.content)), u.push(`WI entry ${g.id} routed to outlet '${E}'; engine-core reports it but does not splice final chat messages.`);
        break;
      }
    }
  }
  for (const { entry: g } of c)
    switch (g.position) {
      case "before":
      case "after":
      case "ANTop":
      case "ANBottom":
        o.push($i(g, g.position, !0));
        break;
      case "EMTop":
      case "EMBottom": {
        const w = g.position === "EMTop" ? "before" : "after";
        o.push($i(g, `examples.${w}`, !1, "EM routing is reported but not spliced into final chat messages."));
        break;
      }
      case "atDepth":
        o.push($i(g, "depthEntries", !1, "atDepth routing is reported but not spliced into final chat messages."));
        break;
      case "outlet": {
        const w = g.outletName ?? "default";
        o.push($i(g, `outlets.${w}`, !1, "Outlet routing is reported but not spliced into final chat messages."));
        break;
      }
    }
  const b = ab(n.ANTop, t, n.ANBottom);
  return {
    buckets: {
      ...n,
      examples: r,
      em: r,
      depthEntries: s,
      anTop: n.ANTop,
      anBottom: n.ANBottom,
      anPatch: b,
      outlets: a
    },
    routingTrace: o,
    uninserted: u
  };
}
function sb(e) {
  return Zs({
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
function $i(e, t, n, r) {
  return Zs({
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
function ab(e, t, n) {
  return Zs({
    top: e,
    original: t,
    bottom: n,
    patched: [...e, ...t === void 0 || t.trim() === "" ? [] : [t], ...n].filter((r) => r.trim() !== "").join(`
`)
  });
}
function ib(e) {
  return e.authorNote ?? e.originalAuthorNote ?? e.author_note;
}
function ob(e) {
  return e.length === 0 ? [] : ["WI atDepth/outlet/EM routes are diagnostics/routing output only; engine-core does not splice them into final chat messages."];
}
function Xt(e, t, n, r) {
  e.has(t.id) || e.set(t.id, Zs({ id: t.id, book: t.bookName, reason: n, code: r }));
}
function _n(e) {
  return e === void 0 ? [] : typeof e == "number" ? [String(e)] : typeof e == "string" ? e.split(/[|,]/u).map((t) => t.trim()).filter((t) => t.length > 0) : e.map((t) => String(t).trim()).filter((t) => t.length > 0);
}
function Fi(e) {
  const t = e?.trim().toLowerCase();
  return t === void 0 || t === "" ? void 0 : t;
}
function lb(e) {
  if (e.budget?.max !== void 0)
    return e.budget.max;
  const t = e.budget?.percent ?? e.budget?.worldInfoBudget ?? e.budget?.world_info_budget ?? e.worldInfoBudget ?? e.world_info_budget;
  if (t === void 0)
    return;
  const n = e.budget?.maxContext ?? e.budget?.max_context ?? e.budget?.openaiMaxContext ?? e.budget?.openai_max_context ?? e.maxContext ?? e.max_context ?? e.openaiMaxContext ?? e.openai_max_context ?? vw, r = Math.round(t * n / 100) || 1, s = e.budget?.cap ?? e.budget?.worldInfoBudgetCap ?? e.budget?.world_info_budget_cap ?? e.worldInfoBudgetCap ?? e.world_info_budget_cap ?? 0;
  return s > 0 && r > s ? s : r;
}
function Yl(e, t) {
  return Math.ceil(e.length / 3.35);
}
function ip(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Zs(e) {
  const t = {};
  for (const [n, r] of Object.entries(e))
    r !== void 0 && (t[n] = r);
  return t;
}
function ub(e, t, n) {
  const r = [];
  if (n.disabledExtensions.has(e))
    return { eligible: !1, reasons: ["user-disabled"] };
  for (const s of t.requires ?? [])
    n.installedExtras.has(s) || r.push(`missing extras module: ${s}`);
  for (const s of t.dependencies ?? [])
    n.installedExtensions.has(s) || r.push(`missing dependency: ${s}`), n.disabledExtensions.has(s) && r.push(`dependency disabled: ${s}`);
  return t.minimum_client_version && !cb(n.clientVersion, t.minimum_client_version) && r.push(`client version ${n.clientVersion} < required ${t.minimum_client_version}`), { eligible: r.length === 0, reasons: r };
}
function cb(e, t) {
  const n = op(e), r = op(t);
  for (let s = 0; s < 3; s++) {
    if (n[s] > r[s])
      return !0;
    if (n[s] < r[s])
      return !1;
  }
  return !0;
}
function op(e) {
  const t = e.replace(/^v/, "").split(/[.-]/).slice(0, 3).map((n) => Number.parseInt(n, 10));
  return [t[0] || 0, t[1] || 0, t[2] || 0];
}
function db(e) {
  return [...e].sort((t, n) => {
    const r = t.manifest.loading_order ?? 1e3, s = n.manifest.loading_order ?? 1e3;
    return r !== s ? r - s : t.manifest.display_name.localeCompare(n.manifest.display_name);
  });
}
function fb(e) {
  const { id: t, manifest: n, basePath: r, currentLocale: s } = e, a = [];
  n.i18n && s && n.i18n[s] && a.push({
    kind: "add_locale",
    description: `load locale ${s} from ${n.i18n[s]}`,
    data: { locale: s, file: `${r}/${n.i18n[s]}` }
  }), n.js && a.push({
    kind: "add_script",
    description: `inject <script type="module" src="${r}/${n.js}">`,
    data: { src: `${r}/${n.js}`, type: "module" }
  }), n.css && a.push({
    kind: "add_style",
    description: `inject <link rel="stylesheet" href="${r}/${n.css}">`,
    data: { href: `${r}/${n.css}` }
  }), n.generate_interceptor && a.push({
    kind: "register_interceptor",
    description: `expose globalThis.${n.generate_interceptor} as generation interceptor`,
    data: { name: n.generate_interceptor }
  });
  const o = n.hooks?.activate;
  return o && a.push({
    kind: "call_hook",
    description: `call exported '${o}' as activate hook`,
    data: { hook: "activate", export: o }
  }), a.push({
    kind: "mark_active",
    description: `mark extension '${t}' as active`,
    data: { id: t }
  }), { id: t, manifest: n, steps: a };
}
class pb {
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
function lp(e) {
  const t = db(e.records), n = [], r = [], s = new Set(e.ctx.installedExtensions);
  for (const a of t) {
    const o = ub(a.id, a.manifest, { ...e.ctx, installedExtensions: s });
    if (!o.eligible) {
      r.push({ id: a.id, reasons: o.reasons });
      continue;
    }
    const u = fb({
      id: a.id,
      manifest: a.manifest,
      basePath: e.basePath(a.id),
      ...e.currentLocale ? { currentLocale: e.currentLocale } : {}
    });
    n.push(u), s.add(a.id);
  }
  return { activated: n, skipped: r, hookFailures: [] };
}
function mb(e) {
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
    items: (s.items ?? []).map((a, o) => hb(a, `${s.id}:${o}`, t)),
    links: [...new Set(s.links ?? [])]
  })), diagnostics: t };
}
function hb(e, t, n) {
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
const gb = {
  day: "tomorrow",
  tz: "America/Los_Angeles"
}, vb = {
  events: [
    {
      title: "Product review",
      start: "14:00",
      duration_min: 45,
      attendees: 6
    }
  ]
}, Yh = {
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
              arguments: gb
            },
            {
              kind: "tool_result",
              call_id: "call_cal_001",
              status: "ok",
              result: vb
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
function _d(e) {
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
    name: _b(e.name),
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
function _b(e) {
  return e.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
const yr = {
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
}, yb = {
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
}, xb = {
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
}, wb = _d({
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
}), bb = _d({
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
}), Sb = _d({
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
  yr,
  yb,
  xb,
  wb,
  bb,
  Sb
];
function yd(e) {
  return Qh.find((n) => n.name === e) ?? yr;
}
const ht = {
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
}, Hu = {
  themeId: yr.name,
  density: yr.density,
  fontFamily: yr.font.family
}, Uu = {
  temperature: 1,
  topP: 1,
  topK: 0,
  frequencyPenalty: 0,
  presencePenalty: 0,
  maxTokens: 256
}, Ro = {
  provider: "openai",
  model: "gpt-4-turbo",
  secretRef: "secret_ref:store:OPENAI_API_KEY"
}, Wu = {
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
}, Gu = {
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
  activePreset: ht.activePreset
};
//! Streaming capability invocation over the surface-host postMessage bridge.
//!
//! Returns an AsyncIterable<StreamFrame> that the caller awaits. When the caller
//! is done (or wants to abort), call handle.cancel() to send
//! kernel.v1.capability.cancel and unsubscribe.
let kb = 1;
function Nb() {
  return `sub-${kb++}-${Date.now()}`;
}
class jb {
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
async function Eb(e, t) {
  const n = Tb();
  if (!n)
    throw new Error("streamCapability requires active session id (set via mount initialProps)");
  const r = rg(), s = await Yu("kernel.v1.capability.stream", {
    capability_id: e,
    input: t
  }), a = s.stream_id ?? s.output?.stream_id;
  if (!a)
    throw new Error("kernel.v1.capability.stream did not return stream_id");
  const o = Nb(), u = new jb();
  let c = !1;
  const p = () => {
    if (!c) {
      if (c = !0, typeof window < "u") {
        window.removeEventListener("message", b);
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
      u.close();
    }
  }, h = {
    [Symbol.asyncIterator]() {
      const g = u.iter()[Symbol.asyncIterator]();
      return {
        next: () => g.next(),
        return: async () => (p(), g.return ? g.return() : { value: void 0, done: !0 })
      };
    }
  }, b = (g) => {
    const w = g.data;
    !w || typeof w != "object" || w.subscription_id === o && w.session_id === n && sg(g, w, r) && (w.type === "stream.frame" ? u.push({ kind: w.kind, payload: w.payload }) : w.type === "stream.ended" ? (u.push({ kind: "ended", payload: null }), p()) : w.type === "stream.error" && (u.push({ kind: "error", payload: w.error }), p()));
  };
  return typeof window < "u" && window.parent ? (window.addEventListener("message", b), window.parent.postMessage(
    {
      type: "stream.subscribe",
      id: o,
      subscription_id: o,
      stream_id: a,
      session_id: n,
      bridge_token: r.bridgeToken
    },
    r.targetOrigin
  )) : (u.push({
    kind: "error",
    payload: { code: "no_window", message: "streamCapability requires window.parent" }
  }), p()), {
    streamId: a,
    frames: h,
    async cancel() {
      try {
        await Yu("kernel.v1.capability.cancel", { stream_id: a });
      } catch {
      } finally {
        p();
      }
    }
  };
}
//! Surface-side helper for calling Yggdrasil host RPC methods through the
//! iframe postMessage bridge.
let Cb = 1, Mo, Ga, xd, Zr, Vu = !1;
const Do = /* @__PURE__ */ new Map();
let up;
const Ku = [
  "targetOrigin",
  "target_origin",
  "bridgeTargetOrigin",
  "bridge_target_origin",
  "hostOrigin",
  "host_origin",
  "rpcTargetOrigin",
  "rpc_target_origin"
], qu = [
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
    const n = Do.get(t.id);
    n && sg(e, t, n) && (Do.delete(t.id), t.error ? n.reject(new Error(`${t.error.code}: ${t.error.message}`)) : n.resolve(t.result));
  }));
}
ng();
function Oo(e) {
  Mo = e;
}
function Tb() {
  return Mo;
}
function wd(e) {
  "targetOrigin" in e && (Ga = e.targetOrigin == null ? void 0 : Ob(e.targetOrigin)), "expectedSource" in e && (xd = e.expectedSource ?? void 0), "bridgeToken" in e && (Zr = Lb(e.bridgeToken)), !Zr && (Ga || e.bridgeToken === void 0) && (Zr = lg());
}
function Ib(e) {
  const t = cp(e, Ku), n = cp(e, qu), r = {};
  let s = !1;
  t !== void 0 && (r.targetOrigin = t, s = !0), n !== void 0 && (r.bridgeToken = n, s = !0), s && typeof window < "u" && window.parent && (r.expectedSource = window.parent), s && wd(r);
}
function Ab() {
  Ga = void 0, xd = void 0, Zr = void 0, Vu = !1;
}
function rg() {
  ag();
  const e = Ga ?? ig();
  if (!e)
    throw new Error("host RPC unavailable: bridge targetOrigin is not configured");
  const t = xd ?? og();
  if (!t)
    throw new Error("host RPC unavailable: bridge expectedSource is not configured");
  return Zr || (Zr = lg()), {
    targetOrigin: e,
    expectedSource: t,
    bridgeToken: Zr
  };
}
function Pb() {
  if (ag(), Ga) return;
  const e = ig();
  e && wd({
    targetOrigin: e,
    expectedSource: og()
  });
}
function sg(e, t, n) {
  return !(e.source !== n.expectedSource || e.origin !== n.targetOrigin || t.bridge_token !== n.bridgeToken);
}
async function Yu(e, t, n = 3e4) {
  if (typeof window > "u" || !window.parent)
    throw new Error("host RPC unavailable: not running in surface iframe");
  ng();
  const r = rg(), s = `rpc-${Cb++}-${Date.now()}`;
  return new Promise((a, o) => {
    const u = setTimeout(() => {
      Do.delete(s), o(new Error(`host RPC timeout after ${n}ms (method=${e})`));
    }, n);
    Do.set(s, {
      resolve: (p) => {
        clearTimeout(u), a(p);
      },
      reject: (p) => {
        clearTimeout(u), o(p);
      },
      targetOrigin: r.targetOrigin,
      expectedSource: r.expectedSource,
      bridgeToken: r.bridgeToken
    });
    const c = {
      type: "rpc.call",
      id: s,
      method: e,
      params: t,
      bridge_token: r.bridgeToken
    };
    Mo && (c.session_id = Mo), window.parent.postMessage(c, r.targetOrigin);
  });
}
function ag() {
  if (Vu || (Vu = !0, typeof window > "u")) return;
  const e = Rb(), t = Mb(), n = Hi(e, Ku) ?? Hi(t, Ku), r = Hi(e, qu) ?? Hi(t, qu), s = {};
  let a = !1;
  n !== void 0 && (s.targetOrigin = n, a = !0), r !== void 0 && (s.bridgeToken = r, a = !0), a && window.parent && (s.expectedSource = window.parent), a && wd(s);
}
function Rb() {
  try {
    return new URLSearchParams(window.location?.search ?? "");
  } catch {
    return new URLSearchParams();
  }
}
function Mb() {
  try {
    const e = window.location?.hash ?? "", t = e.startsWith("#") ? e.slice(1) : e, n = t.includes("?") ? t.slice(t.indexOf("?") + 1) : t;
    return new URLSearchParams(n.startsWith("?") ? n.slice(1) : n);
  } catch {
    return new URLSearchParams();
  }
}
function ig() {
  if (typeof window > "u" || Db()) return;
  const e = window.location?.origin;
  return typeof e == "string" && e.length > 0 && e !== "null" ? e : void 0;
}
function og() {
  if (!(typeof window > "u" || !window.parent))
    return window.parent;
}
function Db() {
  if (typeof window > "u" || !window.parent) return !1;
  try {
    return window.parent !== window;
  } catch {
    return !0;
  }
}
function Ob(e) {
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
function Lb(e) {
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
function cp(e, t) {
  for (const n of t) {
    const r = e[n];
    if (typeof r == "string" && r.length > 0) return r;
  }
}
function Hi(e, t) {
  for (const n of t) {
    const r = e.get(n);
    if (r !== null && r.length > 0) return r;
  }
}
async function Js(e, t) {
  return (await Yu("kernel.v1.capability.invoke", {
    capability_id: e,
    input: t
  })).output;
}
const zb = "official/secret-store-lab/put_secret", Bb = "official/secret-store-lab/list_secrets", $b = "official/secret-store-lab/delete_secret", Fb = "official/secret-store-lab/health", Hb = "official/secret-store-lab/put_project_secret";
async function Ub(e, t) {
  return await Js(zb, { name: e, value: t });
}
async function Wb(e, t, n) {
  return await Js(Hb, { project_id: e, name: t, value: n });
}
async function Gb() {
  return (await Js(Bb, {})).names;
}
async function Vb(e) {
  return (await Js($b, { name: e })).removed;
}
async function Kb() {
  return await Js(Fb, {});
}
function Ui(e) {
  return zh(`secret_ref:store:${e}`);
}
function qb(e) {
  return zh(`secret_ref:project:${e}`);
}
function vo(e) {
  if (e.trim().length !== 0 && !pw(e))
    return "Expected secret_ref:store:NAME, secret_ref:project:NAME, or secret_ref:env:NAME with a safe NAME";
}
function bd(e) {
  if (!(typeof e != "string" || e.trim().length === 0))
    return gd(e)?.ref;
}
function dp(e) {
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
const le = {
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
function Ln(e, t) {
  try {
    if (typeof localStorage > "u") return t;
    const n = localStorage.getItem(e);
    if (!n) return t;
    const r = JSON.parse(n);
    return Array.isArray(t) ? Array.isArray(r) ? r : t : Lo(t) && Lo(r) ? { ...t, ...r } : r;
  } catch {
    return t;
  }
}
function gt(e, t) {
  try {
    if (typeof localStorage > "u") return;
    localStorage.setItem(e, JSON.stringify(t));
  } catch {
  }
}
function Yb() {
  try {
    if (typeof localStorage > "u") return;
    const e = localStorage.getItem("ydltavern.settings"), t = localStorage.getItem(le.settings);
    if (!e || t) return;
    const n = JSON.parse(e), r = {
      activePreset: Ql(n.activePreset, ht.activePreset),
      streaming: pa(n.streaming, ht.streaming),
      bannedTokens: Ql(n.bannedTokens, ht.bannedTokens),
      logitBias: Ql(n.logitBias, ht.logitBias),
      fastUImode: pa(n.fastUImode, ht.fastUImode),
      reducedMotion: pa(n.reducedMotion, ht.reducedMotion),
      showTimestamps: pa(n.showTimestamps, ht.showTimestamps),
      showTokenCounter: pa(n.showTokenCounter, ht.showTokenCounter),
      fontScale: Xl(n.fontScale, ht.fontScale),
      chatWidth: Xl(n.chatWidth, ht.chatWidth),
      avatarStyle: Xl(n.avatarStyle, ht.avatarStyle)
    };
    localStorage.setItem(le.settings, JSON.stringify(r));
    const s = Ln(le.selection, tg);
    gt(le.selection, { ...s, activePreset: r.activePreset });
  } catch {
  }
}
function Qb() {
  return Ln(le.settings, ht);
}
function Xb() {
  const e = Ln(le.themeSettings, void 0);
  return e !== void 0 ? { ...Hu, ...e } : Ln(le.legacyThemeSettings, Hu);
}
function Zb(e) {
  gt(le.themeSettings, e), gt(le.legacyThemeSettings, e);
}
function Jb() {
  return Ln(le.sampler, Uu);
}
function eS() {
  const e = Ln(le.connection, { current: Ro, profiles: {} });
  return ug(e);
}
function fa(e, t) {
  gt(le.connection, ug({ current: e, profiles: t }));
}
function ug(e) {
  const t = Lo(e.current) ? e.current : Ro, n = Lo(e.profiles) ? e.profiles : {};
  return {
    current: fp(t),
    profiles: Object.fromEntries(
      Object.entries(n).map(([r, s]) => [r, fp(s)])
    )
  };
}
function fp(e) {
  const t = bd(e.secretRef);
  return t === void 0 ? { ...e, secretRef: void 0 } : { ...e, secretRef: t };
}
function tS() {
  return Ln(le.formatting, Wu);
}
function nS() {
  return Ln(le.backgroundDisplay, Gu);
}
function rS() {
  return pl(le.characters, [Zh]);
}
function sS() {
  return pl(le.personas, [Xh]);
}
function aS() {
  return pl(le.worldbooks, [Jh]);
}
function iS() {
  return pl(le.backgrounds, [eg]);
}
function oS() {
  return Ln(le.selection, tg);
}
function pl(e, t) {
  const n = Ln(e, t);
  return n.length > 0 ? n : t;
}
function Lo(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Ql(e, t) {
  return typeof e == "string" ? e : t;
}
function pa(e, t) {
  return typeof e == "boolean" ? e : t;
}
function Xl(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
const cg = R.createContext(void 0), dg = /* @__PURE__ */ new Set(["openai", "anthropic", "deepseek", "openrouter"]);
function fg({
  chat: e = Yh,
  showDiagnostics: t = !0,
  sessionId: n,
  projectId: r,
  children: s,
  extensionRecords: a = [],
  extensionActivationContext: o
}) {
  const [u, c] = R.useState(0), [p, h] = R.useState(""), [b, g] = R.useState("settings"), [w, E] = R.useState(!1), [A, D] = R.useState(Xb), [_, x] = R.useState(() => (Yb(), Qb())), [N, l] = R.useState(Jb), [f, d] = R.useState(eS), [m, v] = R.useState(tS), [k, S] = R.useState(nS), [C, L] = R.useState(rS), B = !f.current.provider || !f.current.secretRef, [P, z] = R.useState(sS), [j, $] = R.useState(aS), [O, F] = R.useState(iS), [H, G] = R.useState(oS), [Z, oe] = R.useState(!1), ne = R.useRef(null);
  R.useLayoutEffect(() => (Pb(), Oo(n), () => Oo(void 0)), [n]);
  const _e = R.useMemo(() => {
    const T = yd(A.themeId);
    return {
      ...T,
      font: { ...T.font, family: A.fontFamily },
      density: A.density
    };
  }, [A]), te = R.useCallback((T) => {
    G(T), gt(le.selection, T);
  }, []), Y = R.useCallback((T) => {
    G((y) => {
      const I = { ...y, ...T };
      return gt(le.selection, I), I;
    });
  }, []), U = R.useCallback((T) => {
    D(T), Zb(T);
  }, []), re = R.useCallback((T) => {
    x((y) => {
      const I = { ...y, ...T };
      return gt(le.settings, I), T.activePreset !== void 0 && Y({ activePreset: T.activePreset }), I;
    });
  }, [Y]), de = R.useCallback((T) => {
    re({ activePreset: T });
  }, [re]), ge = R.useCallback((T) => {
    l((y) => {
      const I = { ...y, ...T };
      return gt(le.sampler, I), I;
    });
  }, []), be = R.useCallback((T) => {
    d((y) => {
      const I = { ...y, current: { ...y.current, ...T } };
      return fa(I.current, I.profiles), I;
    });
  }, []), ye = R.useCallback((T) => {
    const y = T.trim();
    y.length !== 0 && (d((I) => {
      const M = { ...I, profiles: { ...I.profiles, [y]: I.current } };
      return fa(M.current, M.profiles), M;
    }), Y({ activeConnectionProfile: y }));
  }, [Y]), Ce = R.useCallback((T) => {
    d((y) => {
      const I = y.profiles[T];
      if (I === void 0) return y;
      const M = { ...y, current: I };
      return fa(M.current, M.profiles), M;
    }), Y({ activeConnectionProfile: T });
  }, [Y]), et = R.useCallback((T) => {
    d((y) => {
      const { [T]: I, ...M } = y.profiles, q = { ...y, profiles: M };
      return fa(q.current, q.profiles), q;
    }), H.activeConnectionProfile === T && Y({ activeConnectionProfile: null });
  }, [Y, H.activeConnectionProfile]), je = R.useCallback((T) => {
    v((y) => {
      const I = { ...y, ...T };
      return gt(le.formatting, I), I;
    });
  }, []), dt = R.useCallback((T) => {
    S((y) => {
      const I = { ...y, fitMode: T };
      return gt(le.backgroundDisplay, I), I;
    });
  }, []), tt = R.useCallback((T) => {
    S((y) => {
      const I = { ...y, autoSelectByCharacter: T };
      return gt(le.backgroundDisplay, I), I;
    });
  }, []), un = R.useCallback((T) => Y({ activeCharacterId: T }), [Y]), kn = R.useCallback((T) => Y({ activePersonaId: T }), [Y]), Kt = R.useCallback((T) => Y({ activeWorldBookId: T }), [Y]), Bn = R.useCallback((T) => Y({ selectedWorldEntryId: T }), [Y]), cn = R.useCallback((T) => Y({ activeBackgroundId: T }), [Y]), Lt = R.useCallback((T) => {
    const y = Wn(), I = T.id ?? $r("char"), M = { id: I, name: T.name ?? "New Character", ...T, createdAt: T.createdAt ?? y, updatedAt: T.updatedAt ?? y };
    return L((q) => ft(le.characters, [...q, M])), Y({ activeCharacterId: I }), I;
  }, [Y]), qt = R.useCallback((T, y) => {
    L((I) => ft(le.characters, I.map((M) => M.id === T ? { ...M, ...y, id: T, updatedAt: Wn() } : M)));
  }, []), zr = R.useCallback((T) => {
    L((y) => {
      const I = y.filter((M) => M.id !== T);
      return H.activeCharacterId === T && Y({ activeCharacterId: I[0]?.id ?? null }), ft(le.characters, I);
    });
  }, [Y, H.activeCharacterId]), ir = R.useCallback((T) => {
    const y = C.find((I) => I.id === T);
    return y === void 0 ? null : Lt({ ...y, id: $r("char"), name: `${y.name} Copy` });
  }, [C, Lt]), Nn = R.useCallback((T) => (L((y) => ft(le.characters, pp(y, T))), Y({ activeCharacterId: T.id }), T.id), [Y]), dn = R.useCallback((T) => C.find((y) => y.id === T) ?? null, [C]), Tt = R.useCallback((T) => {
    const y = Wn(), I = T.id ?? $r("persona"), M = { id: I, name: T.name ?? "New Persona", ...T, createdAt: T.createdAt ?? y, updatedAt: T.updatedAt ?? y };
    return z((q) => ft(le.personas, [...q, M])), Y({ activePersonaId: I }), I;
  }, [Y]), or = R.useCallback((T, y) => {
    z((I) => ft(le.personas, I.map((M) => M.id === T ? { ...M, ...y, id: T, updatedAt: Wn() } : M)));
  }, []), ds = R.useCallback((T) => {
    z((y) => {
      const I = y.filter((M) => M.id !== T);
      return H.activePersonaId === T && Y({ activePersonaId: I[0]?.id ?? null }), ft(le.personas, I);
    });
  }, [Y, H.activePersonaId]), ji = R.useCallback((T) => (z((y) => ft(le.personas, pp(y, T))), Y({ activePersonaId: T.id }), T.id), [Y]), aa = R.useCallback((T) => {
    const y = Wn(), I = T.id ?? $r("wb"), M = { id: I, name: T.name ?? "Untitled World Book", enabled: T.enabled ?? !1, entries: T.entries ?? [], ...T, createdAt: T.createdAt ?? y, updatedAt: T.updatedAt ?? y };
    return $((q) => ft(le.worldbooks, [...q, M])), Y({ activeWorldBookId: I, selectedWorldEntryId: M.entries[0]?.uid ?? null }), I;
  }, [Y]), Ei = R.useCallback((T, y) => {
    $((I) => ft(le.worldbooks, I.map((M) => M.id === T ? { ...M, ...y, id: T, updatedAt: Wn() } : M)));
  }, []), fs = R.useCallback((T) => {
    $((y) => {
      const I = y.filter((M) => M.id !== T);
      return H.activeWorldBookId === T && Y({ activeWorldBookId: I[0]?.id ?? null, selectedWorldEntryId: I[0]?.entries[0]?.uid ?? null }), ft(le.worldbooks, I);
    });
  }, [Y, H.activeWorldBookId]), lr = R.useCallback((T, y) => {
    const I = y.uid ?? $r("wbe"), M = {
      uid: I,
      key: y.key ?? [],
      content: y.content ?? "",
      position: y.position ?? "before_char",
      probability: y.probability ?? 100,
      order: y.order ?? 100,
      enabled: y.enabled ?? !0,
      ...y
    };
    let q = !1;
    return $((se) => ft(le.worldbooks, se.map((fe) => fe.id !== T ? fe : (q = !0, { ...fe, entries: [...fe.entries, M], updatedAt: Wn() })))), q && Y({ selectedWorldEntryId: I }), q ? I : null;
  }, [Y]), Yt = R.useCallback((T, y, I) => {
    $((M) => ft(le.worldbooks, M.map((q) => q.id === T ? { ...q, entries: q.entries.map((se) => se.uid === y ? { ...se, ...I, uid: y } : se), updatedAt: Wn() } : q)));
  }, []), ur = R.useCallback((T, y) => {
    $((I) => ft(le.worldbooks, I.map((M) => {
      if (M.id !== T) return M;
      const q = M.entries.filter((se) => se.uid !== y);
      return H.selectedWorldEntryId === y && Y({ selectedWorldEntryId: q[0]?.uid ?? null }), { ...M, entries: q, updatedAt: Wn() };
    })));
  }, [Y, H.selectedWorldEntryId]), ia = R.useCallback((T, y) => {
    const I = j.find((M) => M.id === T)?.entries.find((M) => M.uid === y);
    return I === void 0 ? null : lr(T, { ...I, uid: $r("wbe"), comment: I.comment ? `${I.comment} Copy` : "Copy" });
  }, [lr, j]), oa = R.useCallback((T) => {
    const y = T.id ?? $r("bg"), I = { id: y, name: T.name ?? "New Background", url: T.url ?? "", ...T };
    return F((M) => ft(le.backgrounds, [...M, I])), Y({ activeBackgroundId: y }), y;
  }, [Y]), Rl = R.useCallback((T) => {
    F((y) => {
      const I = y.filter((M) => M.id !== T);
      return H.activeBackgroundId === T && Y({ activeBackgroundId: I[0]?.id ?? null }), ft(le.backgrounds, I);
    });
  }, [Y, H.activeBackgroundId]), la = R.useCallback((T = "all") => {
    (T === "all" || T === "sampler") && (l(Uu), gt(le.sampler, Uu)), (T === "all" || T === "connection") && (d((y) => ({ current: Ro, profiles: y.profiles })), fa(Ro, f.profiles), Y({ activeConnectionProfile: null })), (T === "all" || T === "formatting") && (v(Wu), gt(le.formatting, Wu), S(Gu), gt(le.backgroundDisplay, Gu)), (T === "all" || T === "theme") && U(Hu), T === "all" && (x(ht), gt(le.settings, ht), te({ ...H, activePreset: ht.activePreset, activeConnectionProfile: null }));
  }, [f.profiles, Y, te, H, U]), { runtime: ps, ownStore: ce } = R.useMemo(() => {
    const T = xh(e);
    return { runtime: q0({
      chat: e,
      chatHooks: {
        onEdit: (I, M) => {
          T.updateMessage(I, { mes: M.mes, name: M.name, is_user: M.is_user, is_system: M.is_system, extra: M.extra }), c((q) => q + 1);
        },
        onPush: (I) => {
          I.forEach((M) => T.pushMessage(M)), c((M) => M + 1);
        },
        onDelete: (I) => {
          T.deleteMessage(I), c((M) => M + 1);
        }
      }
    }), ownStore: T };
  }, [e]), at = ps.getContext(), Ml = ce.snapshot(), fn = R.useCallback((T, y) => {
    const I = ce.messageAt(T);
    ce.updateMessage(T, {
      mes: y.content,
      extra: {
        ...I?.extra ?? {},
        ...y.reasoning ? { reasoning: y.reasoning } : {},
        ydl_streaming: y.streaming,
        ...y.isError !== void 0 ? { ydl_error: y.isError } : {}
      }
    }), c((M) => M + 1);
  }, [ce]), He = R.useCallback(async (T, y) => {
    try {
      const I = await Js("ydltavern/engine/model.live_call", {
        ...y,
        stream: !1
      }), M = Qu(I), q = Ju(I);
      fn(T, {
        content: M,
        reasoning: q,
        streaming: !1,
        isError: !1
      });
    } catch (I) {
      const M = I instanceof Error ? I.message : String(I);
      fn(T, {
        content: `Error: ${M}`,
        streaming: !1,
        isError: !0
      });
    } finally {
      oe(!1);
    }
  }, [fn]), $n = R.useCallback(async (T, y) => {
    let I = null, M = "";
    try {
      I = await Eb("ydltavern/engine/model.live_call.stream", {
        ...y,
        stream: !0
      }), ne.current = I, oe(!0);
      for await (const q of I.frames) {
        const se = q.kind;
        if (!(se === "started" || se === "progress")) {
          if (se === "chunk") {
            const fe = Xu(q.payload);
            fe && (M += fe, fn(T, { content: M, streaming: !0 }));
            continue;
          }
          if (se === "ended" || se === "final") {
            const fe = Zu(q.payload);
            fe && (M = fe);
            break;
          }
          if (se === "error") {
            const fe = gS(q.payload);
            fn(T, {
              content: M || `Error: ${fe}`,
              streaming: !1,
              isError: !M
            });
            return;
          }
          if (se === "cancelled" || se === "timeout") {
            fn(T, {
              content: M || `(${se})`,
              streaming: !1
            });
            return;
          }
        }
      }
      fn(T, { content: M, streaming: !1 });
    } catch (q) {
      const se = q instanceof Error ? q.message : String(q);
      fn(T, {
        content: M || `Error: ${se}`,
        streaming: !1,
        isError: !M
      });
    } finally {
      ne.current === I && (ne.current = null), oe(!1);
    }
  }, [fn]), Dl = R.useCallback(async (T) => {
    if (Z) return;
    const y = (T ?? p).trim();
    if (y.length === 0) return;
    const I = at.addOneMessage({ is_user: !0, name: at.name1, mes: y });
    if (ce.pushMessage(I), h(""), c((Te) => Te + 1), !f.current.provider || !f.current.secretRef) {
      const Te = at.addOneMessage({
        is_system: !0,
        name: "System",
        mes: "Configure an API connection before sending. Open API Connections drawer and set a provider + API key."
      });
      ce.pushMessage(Te), c((It) => It + 1);
      return;
    }
    if (!dS(f.current.provider)) {
      dg.has("textgen");
      const Te = at.addOneMessage({
        is_system: !0,
        name: "System",
        mes: `Provider "${f.current.provider}" is not supported for live model calls yet. Choose OpenAI, Anthropic, DeepSeek, or OpenRouter.`,
        extra: { ydl_error: !0 }
      });
      ce.pushMessage(Te), c((It) => It + 1);
      return;
    }
    const M = at.addOneMessage({
      is_user: !1,
      name: at.name2,
      mes: "",
      extra: { ydl_streaming: !0 }
    });
    ce.pushMessage(M);
    const q = ce.length - 1;
    oe(!0), c((Te) => Te + 1);
    const se = cS(f.current.provider), fe = {
      source: se,
      model: f.current.model || fS(se),
      messages: lS(ce.messages()),
      settings: pS(N, _, f.current, at.name1, at.name2),
      secret_ref: f.current.secretRef
    };
    _.streaming ? await $n(q, fe) : await He(q, fe);
  }, [f.current, at, p, Z, ce, N, He, $n, _]), Ve = R.useCallback((T) => {
    const y = at.addOneMessage({ is_system: !0, name: "System", mes: T });
    ce.pushMessage(y), c((I) => I + 1);
  }, [at, ce]), ua = R.useCallback(() => {
    Ve("[Generate] not yet available. Use Send to get a live assistant reply.");
  }, [Ve]), Ci = R.useCallback(() => {
    vS(ce, 0, (T) => ({ ...T, mes: `${T.mes ?? ""} [edited via surface]` })), c((T) => T + 1);
  }, [ce]), Ti = R.useCallback(() => {
    Ve("[Swipe reply] not yet available. Use Send to get a live assistant reply.");
  }, [Ve]), Ol = R.useCallback(() => {
    Ve("[Regenerate] not yet available. Use Send to get a live assistant reply.");
  }, [Ve]), zt = R.useCallback(async () => {
    const T = ne.current;
    T && (await T.cancel(), ne.current = null, oe(!1));
  }, []), Fn = R.useCallback(() => {
    Ve("[Continue] is not yet available on this surface.");
  }, [Ve]), Ii = R.useCallback(() => {
    Ve("[Impersonate] is not yet available on this surface.");
  }, [Ve]), Ai = R.useCallback((T, y) => {
    const I = Fr(ce.snapshot(), T);
    I !== null && (ce.updateMessage(I, { mes: y }), c((M) => M + 1));
  }, [ce]), Pi = R.useCallback((T) => {
    const y = Fr(ce.snapshot(), T);
    y !== null && (ce.deleteMessage(y), c((I) => I + 1));
  }, [ce]), ca = R.useCallback((T, y) => {
    const I = ce.snapshot(), M = Fr(I, T);
    if (M === null) return;
    const q = y === "up" ? M - 1 : M + 1;
    if (q < 0 || q >= I.turns.length) return;
    const se = ce.messages(), fe = se[M], Te = se[q];
    fe === void 0 || Te === void 0 || (ce.spliceMessages(Math.min(M, q), 2, y === "up" ? fe : Te, y === "up" ? Te : fe), c((It) => It + 1));
  }, [ce]), ms = R.useCallback((T) => {
    const y = Fr(ce.snapshot(), T);
    if (y === null) return;
    const I = ce.messageAt(y);
    I !== void 0 && (navigator.clipboard?.writeText(I.mes ?? "").catch(() => {
    }), ce.spliceMessages(y + 1, 0, { ...I, send_date: (/* @__PURE__ */ new Date()).toISOString() }), c((M) => M + 1));
  }, [ce]), pn = R.useCallback((T) => {
    const y = Fr(ce.snapshot(), T);
    if (y === null) return;
    const I = ce.messageAt(y);
    ce.updateMessage(y, { extra: { ...I?.extra ?? {}, ydl_hidden: !0 } }), c((M) => M + 1);
  }, [ce]), Ri = R.useCallback((T) => {
    const y = Fr(ce.snapshot(), T);
    if (y === null) return;
    const I = ce.messageAt(y), { ydl_hidden: M, ...q } = I?.extra ?? {};
    ce.updateMessage(y, { extra: q }), c((se) => se + 1);
  }, [ce]), Br = R.useCallback((T, y) => {
    const I = Fr(ce.snapshot(), T);
    if (I === null) return;
    const M = ce.messageAt(I), q = M?.swipes ?? [];
    if (M === void 0 || q.length === 0) return;
    const se = M.swipe_id ?? 0, fe = _S(se + y, q.length);
    ce.updateMessage(I, { mes: q[fe] ?? M.mes, extra: M.extra }), c((Te) => Te + 1);
  }, [ce]), Ll = R.useCallback((T) => Br(T, -1), [Br]), Mi = R.useCallback((T) => Br(T, 1), [Br]), Di = R.useCallback((T) => {
    Ve(`[Regenerate message ${T}] not yet available on this surface.`);
  }, [Ve]), da = R.useCallback((T) => {
    Ve(`[Branch message ${T}] not yet available on this surface.`);
  }, [Ve]), hs = R.useCallback((T) => {
    Ve(`[Checkpoint message ${T}] not yet available on this surface.`);
  }, [Ve]);
  return /* @__PURE__ */ i.jsx(
    cg.Provider,
    {
      value: {
        runtime: ps,
        liveChat: Ml,
        liveMessages: ce.messages(),
        input: p,
        activeDrawer: b,
        showDiagnostics: t,
        sessionId: n,
        projectId: r,
        setInput: h,
        setActiveDrawer: g,
        sendMessage: Dl,
        generateReply: ua,
        editFirstMessage: Ci,
        swipeReply: Ti,
        regenerateReply: Ol,
        settings: _,
        updateSettings: re,
        setActivePreset: de,
        needsApiConnection: B,
        theme: _e,
        themeSettings: A,
        setThemeSettings: U,
        mobileDrawerOpen: w,
        setMobileDrawerOpen: E,
        extensionRecords: a,
        extensionActivationContext: o,
        samplerSettings: N,
        updateSamplerSettings: ge,
        connectionSettings: f.current,
        updateConnectionSettings: be,
        connectionProfiles: f.profiles,
        saveConnectionProfile: ye,
        loadConnectionProfile: Ce,
        deleteConnectionProfile: et,
        activeConnectionProfile: H.activeConnectionProfile,
        formattingSettings: m,
        updateFormattingSettings: je,
        backgroundDisplaySettings: k,
        setBackgroundFitMode: dt,
        setBackgroundAutoSelect: tt,
        characters: C,
        activeCharacterId: H.activeCharacterId,
        setActiveCharacter: un,
        createCharacter: Lt,
        updateCharacter: qt,
        deleteCharacter: zr,
        duplicateCharacter: ir,
        importCharacter: Nn,
        exportCharacter: dn,
        personas: P,
        activePersonaId: H.activePersonaId,
        setActivePersona: kn,
        createPersona: Tt,
        updatePersona: or,
        deletePersona: ds,
        importPersona: ji,
        worldBooks: j,
        activeWorldBookId: H.activeWorldBookId,
        selectedWorldEntryId: H.selectedWorldEntryId,
        setActiveWorldBook: Kt,
        setSelectedWorldEntry: Bn,
        createWorldBook: aa,
        updateWorldBook: Ei,
        deleteWorldBook: fs,
        createWorldEntry: lr,
        updateWorldEntry: Yt,
        deleteWorldEntry: ur,
        duplicateWorldEntry: ia,
        backgrounds: O,
        activeBackgroundId: H.activeBackgroundId,
        setActiveBackground: cn,
        uploadBackground: oa,
        deleteBackground: Rl,
        resetSettings: la,
        isGenerating: Z,
        cancelGeneration: zt,
        continueLastReply: Fn,
        impersonate: Ii,
        editMessage: Ai,
        deleteMessage: Pi,
        moveMessage: ca,
        copyMessage: ms,
        hideMessage: pn,
        unhideMessage: Ri,
        swipeLeft: Ll,
        swipeRight: Mi,
        regenerateMessage: Di,
        branchMessage: da,
        checkpointMessage: hs,
        pushSystemNotice: Ve
      },
      children: s
    }
  );
}
function wt() {
  const e = R.useContext(cg);
  if (e === void 0) throw new Error("useTavern must be used inside <TavernProvider>.");
  return e;
}
function $r(e) {
  const t = globalThis.crypto?.randomUUID?.();
  return t !== void 0 ? `${e}-${t}` : `${e}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function Wn() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function ft(e, t) {
  return gt(e, t), t;
}
function pp(e, t) {
  return e.findIndex((r) => r.id === t.id) === -1 ? [...e, t] : e.map((r) => r.id === t.id ? t : r);
}
function lS(e) {
  return e.map((t) => ({
    role: uS(t),
    content: t.mes ?? ""
  })).filter((t) => t.content.length > 0 || t.role === "assistant");
}
function uS(e) {
  return e.is_system ? "system" : e.is_user ? "user" : "assistant";
}
function cS(e) {
  switch (e) {
    case "anthropic":
      return "anthropic";
    case "custom-openai":
      return "openai";
    default:
      return e;
  }
}
function dS(e) {
  return dg.has(e);
}
function fS(e) {
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
function pS(e, t, n, r, s) {
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
    logit_bias: mS(t.logitBias),
    stop: hS(t.bannedTokens)
  };
}
function mS(e) {
  const t = e.trim();
  if (t.length !== 0)
    try {
      const n = JSON.parse(t);
      if (!n || typeof n != "object" || Array.isArray(n)) return;
      const r = {};
      for (const [s, a] of Object.entries(n))
        typeof a == "number" && Number.isFinite(a) && (r[s] = a);
      return Object.keys(r).length > 0 ? r : void 0;
    } catch {
      return;
    }
}
function hS(e) {
  const t = e.split(/\r?\n/u).map((n) => n.trim()).filter(Boolean);
  return t.length > 0 ? t : void 0;
}
function Qu(e) {
  if (typeof e == "string") return e;
  if (!e || typeof e != "object") return "(empty response)";
  const t = e;
  if (typeof t.text == "string") return t.text;
  if (typeof t.output == "string") return t.output;
  if (t.output !== void 0) return Qu(t.output);
  if (t.body_shape !== void 0) return Qu(t.body_shape);
  const n = t.choices;
  if (Array.isArray(n)) {
    const a = n[0], o = a?.message;
    if (typeof o?.content == "string") return o.content;
    if (typeof a?.text == "string") return a.text;
  }
  const r = t.content;
  if (Array.isArray(r)) {
    const a = r.map((o) => typeof o == "object" && o !== null && typeof o.text == "string" ? o.text : "").join("");
    if (a) return a;
  } else if (typeof r == "string")
    return r;
  const s = t.candidates;
  if (Array.isArray(s)) {
    const u = s[0]?.content?.parts;
    if (Array.isArray(u)) {
      const c = u.map((p) => typeof p == "object" && p !== null && typeof p.text == "string" ? p.text : "").join("");
      if (c) return c;
    }
  }
  return "(empty response)";
}
function Xu(e) {
  if (typeof e == "string") return e;
  if (!e || typeof e != "object") return "";
  const t = e;
  if (typeof t.text == "string") return t.text;
  if (typeof t.delta == "string") return t.delta;
  if (typeof t.delta_text == "string") return t.delta_text;
  if (t.output !== void 0) return Xu(t.output);
  if (t.frame !== void 0) return Xu(t.frame);
  const n = t.choices;
  if (Array.isArray(n)) {
    const o = n[0], u = o?.delta;
    if (typeof u?.content == "string") return u.content;
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
  const a = t.candidates;
  if (Array.isArray(a)) {
    const c = a[0]?.content?.parts;
    if (Array.isArray(c)) {
      const p = c[0];
      if (typeof p?.text == "string") return p.text;
    }
  }
  return "";
}
function Zu(e) {
  if (!e || typeof e != "object") return "";
  const t = e;
  return typeof t.text == "string" ? t.text : t.output !== void 0 ? Zu(t.output) : t.frame !== void 0 ? Zu(t.frame) : "";
}
function gS(e) {
  if (e && typeof e == "object") {
    const t = e;
    if (typeof t.message == "string") return t.message;
    if (typeof t.error == "string") return t.error;
  }
  return "stream error";
}
function Ju(e) {
  if (!e || typeof e != "object") return;
  const t = e;
  if (typeof t.reasoning == "string") return t.reasoning;
  if (t.output !== void 0) return Ju(t.output);
  if (t.body_shape !== void 0) return Ju(t.body_shape);
  const n = t.choices;
  if (Array.isArray(n)) {
    const s = n[0]?.message;
    if (typeof s?.reasoning_content == "string") return s.reasoning_content;
  }
}
function Fr(e, t) {
  if (typeof t == "number") return t >= 0 && t < e.turns.length ? t : null;
  const n = e.turns.findIndex((r) => r.id === t || r.variants.some((s) => s.id === t));
  return n === -1 ? null : n;
}
function vS(e, t, n) {
  const r = e.messageAt(t);
  if (r === void 0) return;
  const s = n(r);
  e.updateMessage(t, { mes: s.mes, name: s.name, is_user: s.is_user, is_system: s.is_system, extra: s.extra });
}
function _S(e, t) {
  return (e % t + t) % t;
}
function yS(e) {
  return /* @__PURE__ */ i.jsxs("div", { id: "nonQRFormItems", className: "composer_toolbar", role: "toolbar", "aria-label": "Composer actions", children: [
    /* @__PURE__ */ i.jsx(
      "button",
      {
        type: "button",
        id: "options_button",
        className: "composer_button mes_button",
        onClick: e.onOptions,
        "aria-label": "Options menu",
        children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-bars", "aria-hidden": "true" })
      }
    ),
    e.onContinue && /* @__PURE__ */ i.jsx(
      "button",
      {
        type: "button",
        id: "mes_continue",
        className: "composer_button mes_button",
        onClick: e.onContinue,
        disabled: e.isGenerating,
        "aria-label": "Continue last response",
        title: "Continue",
        children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-forward", "aria-hidden": "true" })
      }
    ),
    e.onImpersonate && /* @__PURE__ */ i.jsx(
      "button",
      {
        type: "button",
        id: "mes_impersonate",
        className: "composer_button mes_button",
        onClick: e.onImpersonate,
        disabled: e.isGenerating,
        "aria-label": "Impersonate user",
        title: "Impersonate",
        children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-masks-theater", "aria-hidden": "true" })
      }
    )
  ] });
}
function xS({ onStop: e, label: t = "Generating…" }) {
  return /* @__PURE__ */ i.jsxs("div", { className: "streaming_indicator", role: "status", "aria-live": "polite", children: [
    /* @__PURE__ */ i.jsxs("span", { className: "streaming_dots", "aria-hidden": "true", children: [
      /* @__PURE__ */ i.jsx("span", { className: "streaming_dot" }),
      /* @__PURE__ */ i.jsx("span", { className: "streaming_dot" }),
      /* @__PURE__ */ i.jsx("span", { className: "streaming_dot" })
    ] }),
    /* @__PURE__ */ i.jsx("span", { className: "streaming_label", children: t }),
    e && /* @__PURE__ */ i.jsxs(
      "button",
      {
        type: "button",
        id: "mes_stop",
        className: "streaming_stop mes_button",
        onClick: e,
        "aria-label": "Stop generation",
        children: [
          /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-circle-stop", "aria-hidden": "true" }),
          /* @__PURE__ */ i.jsx("span", { children: "Stop" })
        ]
      }
    )
  ] });
}
const wS = 320;
function bS(e) {
  const [t, n] = R.useState(e.initialText ?? ""), r = R.useRef(null), s = R.useCallback(() => {
    const u = r.current;
    u && (u.style.height = "auto", u.style.height = `${Math.min(u.scrollHeight, wS)}px`);
  }, []), a = R.useCallback(async () => {
    if (!t.trim() || e.disabled || e.isGenerating) return;
    const u = t;
    n("");
    const c = r.current;
    c && (c.style.height = "auto"), await e.onSend(u), r.current?.focus();
  }, [t, e.disabled, e.isGenerating, e.onSend]), o = R.useCallback((u) => {
    if (u.key === "Enter" && !u.shiftKey && !u.ctrlKey && !u.metaKey) {
      u.preventDefault(), a();
      return;
    }
    u.key === "Enter" && (u.ctrlKey || u.metaKey) && (u.preventDefault(), a());
  }, [a]);
  return R.useEffect(() => {
    if (!e.isGenerating)
      try {
        r.current?.focus();
      } catch {
      }
  }, [e.isGenerating]), R.useEffect(() => {
    s();
  }, [t, s]), /* @__PURE__ */ i.jsxs(
    "form",
    {
      id: "send_form",
      className: "send_form",
      onSubmit: (u) => {
        u.preventDefault(), a();
      },
      "aria-label": "Send message",
      children: [
        e.isGenerating && /* @__PURE__ */ i.jsx(xS, { onStop: e.onStop }),
        e.needsApiConnection && /* @__PURE__ */ i.jsxs("div", { className: "ydl-api-callout", role: "alert", children: [
          /* @__PURE__ */ i.jsx("span", { className: "ydl-api-callout-text", children: "No API connection configured. Set a provider and key to send messages." }),
          e.onOpenApiConnections && /* @__PURE__ */ i.jsxs(
            "button",
            {
              type: "button",
              className: "menu_button",
              onClick: e.onOpenApiConnections,
              "aria-label": "Open API Connections",
              children: [
                /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-plug", "aria-hidden": "true" }),
                " Open API Connections"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ i.jsxs("div", { className: "send_form_row", children: [
          /* @__PURE__ */ i.jsx("div", { id: "leftSendForm", "data-extension-territory": !0, children: /* @__PURE__ */ i.jsx(
            yS,
            {
              onOptions: e.onOptions,
              onContinue: e.onContinue,
              onImpersonate: e.onImpersonate,
              isGenerating: e.isGenerating
            }
          ) }),
          /* @__PURE__ */ i.jsx(
            "textarea",
            {
              ref: r,
              id: "send_textarea",
              className: "send_textarea",
              value: t,
              onChange: (u) => n(u.target.value),
              onKeyDown: o,
              placeholder: e.placeholder ?? "Type a message…",
              rows: 1,
              disabled: e.disabled || e.isGenerating,
              "aria-label": "Message input",
              style: { overflowY: "auto" }
            }
          ),
          /* @__PURE__ */ i.jsx("div", { id: "rightSendForm", "data-extension-territory": !0, children: e.isGenerating ? /* @__PURE__ */ i.jsx(
            "button",
            {
              type: "button",
              id: "send_but",
              className: "send_but composer_stop_button mes_button",
              onClick: e.onStop,
              "aria-label": "Stop generation",
              children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-circle-stop", "aria-hidden": "true" })
            }
          ) : /* @__PURE__ */ i.jsx(
            "button",
            {
              type: "submit",
              id: "send_but",
              className: "send_but mes_button",
              disabled: !t.trim() || e.disabled,
              "aria-label": "Send message",
              children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-paper-plane", "aria-hidden": "true" })
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
    var H = O.length;
    O.push(F);
    e: for (; 0 < H; ) {
      var G = H - 1 >>> 1, Z = O[G];
      if (0 < s(Z, F)) O[G] = F, O[H] = Z, H = G;
      else break e;
    }
  }
  function n(O) {
    return O.length === 0 ? null : O[0];
  }
  function r(O) {
    if (O.length === 0) return null;
    var F = O[0], H = O.pop();
    if (H !== F) {
      O[0] = H;
      e: for (var G = 0, Z = O.length, oe = Z >>> 1; G < oe; ) {
        var ne = 2 * (G + 1) - 1, _e = O[ne], te = ne + 1, Y = O[te];
        if (0 > s(_e, H)) te < Z && 0 > s(Y, _e) ? (O[G] = Y, O[te] = H, G = te) : (O[G] = _e, O[ne] = H, G = ne);
        else if (te < Z && 0 > s(Y, H)) O[G] = Y, O[te] = H, G = te;
        else break e;
      }
    }
    return F;
  }
  function s(O, F) {
    var H = O.sortIndex - F.sortIndex;
    return H !== 0 ? H : O.id - F.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var a = performance;
    e.unstable_now = function() {
      return a.now();
    };
  } else {
    var o = Date, u = o.now();
    e.unstable_now = function() {
      return o.now() - u;
    };
  }
  var c = [], p = [], h = 1, b = null, g = 3, w = !1, E = !1, A = !1, D = typeof setTimeout == "function" ? setTimeout : null, _ = typeof clearTimeout == "function" ? clearTimeout : null, x = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function N(O) {
    for (var F = n(p); F !== null; ) {
      if (F.callback === null) r(p);
      else if (F.startTime <= O) r(p), F.sortIndex = F.expirationTime, t(c, F);
      else break;
      F = n(p);
    }
  }
  function l(O) {
    if (A = !1, N(O), !E) if (n(c) !== null) E = !0, j(f);
    else {
      var F = n(p);
      F !== null && $(l, F.startTime - O);
    }
  }
  function f(O, F) {
    E = !1, A && (A = !1, _(v), v = -1), w = !0;
    var H = g;
    try {
      for (N(F), b = n(c); b !== null && (!(b.expirationTime > F) || O && !C()); ) {
        var G = b.callback;
        if (typeof G == "function") {
          b.callback = null, g = b.priorityLevel;
          var Z = G(b.expirationTime <= F);
          F = e.unstable_now(), typeof Z == "function" ? b.callback = Z : b === n(c) && r(c), N(F);
        } else r(c);
        b = n(c);
      }
      if (b !== null) var oe = !0;
      else {
        var ne = n(p);
        ne !== null && $(l, ne.startTime - F), oe = !1;
      }
      return oe;
    } finally {
      b = null, g = H, w = !1;
    }
  }
  var d = !1, m = null, v = -1, k = 5, S = -1;
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
        F ? B() : (d = !1, m = null);
      }
    } else d = !1;
  }
  var B;
  if (typeof x == "function") B = function() {
    x(L);
  };
  else if (typeof MessageChannel < "u") {
    var P = new MessageChannel(), z = P.port2;
    P.port1.onmessage = L, B = function() {
      z.postMessage(null);
    };
  } else B = function() {
    D(L, 0);
  };
  function j(O) {
    m = O, d || (d = !0, B());
  }
  function $(O, F) {
    v = D(function() {
      O(e.unstable_now());
    }, F);
  }
  e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(O) {
    O.callback = null;
  }, e.unstable_continueExecution = function() {
    E || w || (E = !0, j(f));
  }, e.unstable_forceFrameRate = function(O) {
    0 > O || 125 < O ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : k = 0 < O ? Math.floor(1e3 / O) : 5;
  }, e.unstable_getCurrentPriorityLevel = function() {
    return g;
  }, e.unstable_getFirstCallbackNode = function() {
    return n(c);
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
    var H = g;
    g = F;
    try {
      return O();
    } finally {
      g = H;
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
    var H = g;
    g = O;
    try {
      return F();
    } finally {
      g = H;
    }
  }, e.unstable_scheduleCallback = function(O, F, H) {
    var G = e.unstable_now();
    switch (typeof H == "object" && H !== null ? (H = H.delay, H = typeof H == "number" && 0 < H ? G + H : G) : H = G, O) {
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
    return Z = H + Z, O = { id: h++, callback: F, priorityLevel: O, startTime: H, expirationTime: Z, sortIndex: -1 }, H > G ? (O.sortIndex = H, t(p, O), n(c) === null && O === n(p) && (A ? (_(v), v = -1) : A = !0, $(l, H - G))) : (O.sortIndex = Z, t(c, O), E || w || (E = !0, j(f))), O;
  }, e.unstable_shouldYield = C, e.unstable_wrapCallback = function(O) {
    var F = g;
    return function() {
      var H = g;
      g = F;
      try {
        return O.apply(this, arguments);
      } finally {
        g = H;
      }
    };
  };
})(hg);
mg.exports = hg;
var SS = mg.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var kS = R, Wt = SS;
function V(e) {
  for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
  return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var gg = /* @__PURE__ */ new Set(), Va = {};
function os(e, t) {
  Ws(e, t), Ws(e + "Capture", t);
}
function Ws(e, t) {
  for (Va[e] = t, e = 0; e < t.length; e++) gg.add(t[e]);
}
var Jn = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), ec = Object.prototype.hasOwnProperty, NS = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, mp = {}, hp = {};
function jS(e) {
  return ec.call(hp, e) ? !0 : ec.call(mp, e) ? !1 : NS.test(e) ? hp[e] = !0 : (mp[e] = !0, !1);
}
function ES(e, t, n, r) {
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
function CS(e, t, n, r) {
  if (t === null || typeof t > "u" || ES(e, t, n, r)) return !0;
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
function Et(e, t, n, r, s, a, o) {
  this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = s, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = a, this.removeEmptyString = o;
}
var ct = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
  ct[e] = new Et(e, 0, !1, e, null, !1, !1);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
  var t = e[0];
  ct[t] = new Et(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
  ct[e] = new Et(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
  ct[e] = new Et(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
  ct[e] = new Et(e, 3, !1, e.toLowerCase(), null, !1, !1);
});
["checked", "multiple", "muted", "selected"].forEach(function(e) {
  ct[e] = new Et(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function(e) {
  ct[e] = new Et(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function(e) {
  ct[e] = new Et(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function(e) {
  ct[e] = new Et(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var Sd = /[\-:]([a-z])/g;
function kd(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
  var t = e.replace(
    Sd,
    kd
  );
  ct[t] = new Et(t, 1, !1, e, null, !1, !1);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
  var t = e.replace(Sd, kd);
  ct[t] = new Et(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
  var t = e.replace(Sd, kd);
  ct[t] = new Et(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function(e) {
  ct[e] = new Et(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
ct.xlinkHref = new Et("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
["src", "href", "action", "formAction"].forEach(function(e) {
  ct[e] = new Et(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function Nd(e, t, n, r) {
  var s = ct.hasOwnProperty(t) ? ct[t] : null;
  (s !== null ? s.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (CS(t, n, s, r) && (n = null), r || s === null ? jS(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : s.mustUseProperty ? e[s.propertyName] = n === null ? s.type === 3 ? !1 : "" : n : (t = s.attributeName, r = s.attributeNamespace, n === null ? e.removeAttribute(t) : (s = s.type, n = s === 3 || s === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var rr = kS.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Wi = Symbol.for("react.element"), Ss = Symbol.for("react.portal"), ks = Symbol.for("react.fragment"), jd = Symbol.for("react.strict_mode"), tc = Symbol.for("react.profiler"), vg = Symbol.for("react.provider"), _g = Symbol.for("react.context"), Ed = Symbol.for("react.forward_ref"), nc = Symbol.for("react.suspense"), rc = Symbol.for("react.suspense_list"), Cd = Symbol.for("react.memo"), dr = Symbol.for("react.lazy"), yg = Symbol.for("react.offscreen"), gp = Symbol.iterator;
function ma(e) {
  return e === null || typeof e != "object" ? null : (e = gp && e[gp] || e["@@iterator"], typeof e == "function" ? e : null);
}
var Fe = Object.assign, Zl;
function Sa(e) {
  if (Zl === void 0) try {
    throw Error();
  } catch (n) {
    var t = n.stack.trim().match(/\n( *(at )?)/);
    Zl = t && t[1] || "";
  }
  return `
` + Zl + e;
}
var Jl = !1;
function eu(e, t) {
  if (!e || Jl) return "";
  Jl = !0;
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
`), a = r.stack.split(`
`), o = s.length - 1, u = a.length - 1; 1 <= o && 0 <= u && s[o] !== a[u]; ) u--;
      for (; 1 <= o && 0 <= u; o--, u--) if (s[o] !== a[u]) {
        if (o !== 1 || u !== 1)
          do
            if (o--, u--, 0 > u || s[o] !== a[u]) {
              var c = `
` + s[o].replace(" at new ", " at ");
              return e.displayName && c.includes("<anonymous>") && (c = c.replace("<anonymous>", e.displayName)), c;
            }
          while (1 <= o && 0 <= u);
        break;
      }
    }
  } finally {
    Jl = !1, Error.prepareStackTrace = n;
  }
  return (e = e ? e.displayName || e.name : "") ? Sa(e) : "";
}
function TS(e) {
  switch (e.tag) {
    case 5:
      return Sa(e.type);
    case 16:
      return Sa("Lazy");
    case 13:
      return Sa("Suspense");
    case 19:
      return Sa("SuspenseList");
    case 0:
    case 2:
    case 15:
      return e = eu(e.type, !1), e;
    case 11:
      return e = eu(e.type.render, !1), e;
    case 1:
      return e = eu(e.type, !0), e;
    default:
      return "";
  }
}
function sc(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case ks:
      return "Fragment";
    case Ss:
      return "Portal";
    case tc:
      return "Profiler";
    case jd:
      return "StrictMode";
    case nc:
      return "Suspense";
    case rc:
      return "SuspenseList";
  }
  if (typeof e == "object") switch (e.$$typeof) {
    case _g:
      return (e.displayName || "Context") + ".Consumer";
    case vg:
      return (e._context.displayName || "Context") + ".Provider";
    case Ed:
      var t = e.render;
      return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
    case Cd:
      return t = e.displayName || null, t !== null ? t : sc(e.type) || "Memo";
    case dr:
      t = e._payload, e = e._init;
      try {
        return sc(e(t));
      } catch {
      }
  }
  return null;
}
function IS(e) {
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
      return sc(t);
    case 8:
      return t === jd ? "StrictMode" : "Mode";
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
function Tr(e) {
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
function AS(e) {
  var t = xg(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
  if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
    var s = n.get, a = n.set;
    return Object.defineProperty(e, t, { configurable: !0, get: function() {
      return s.call(this);
    }, set: function(o) {
      r = "" + o, a.call(this, o);
    } }), Object.defineProperty(e, t, { enumerable: n.enumerable }), { getValue: function() {
      return r;
    }, setValue: function(o) {
      r = "" + o;
    }, stopTracking: function() {
      e._valueTracker = null, delete e[t];
    } };
  }
}
function Gi(e) {
  e._valueTracker || (e._valueTracker = AS(e));
}
function wg(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(), r = "";
  return e && (r = xg(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
}
function zo(e) {
  if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function ac(e, t) {
  var n = t.checked;
  return Fe({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
}
function vp(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
  n = Tr(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
}
function bg(e, t) {
  t = t.checked, t != null && Nd(e, "checked", t, !1);
}
function ic(e, t) {
  bg(e, t);
  var n = Tr(t.value), r = t.type;
  if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  t.hasOwnProperty("value") ? oc(e, t.type, n) : t.hasOwnProperty("defaultValue") && oc(e, t.type, Tr(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
}
function _p(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
    t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
  }
  n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
}
function oc(e, t, n) {
  (t !== "number" || zo(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var ka = Array.isArray;
function Ds(e, t, n, r) {
  if (e = e.options, t) {
    t = {};
    for (var s = 0; s < n.length; s++) t["$" + n[s]] = !0;
    for (n = 0; n < e.length; n++) s = t.hasOwnProperty("$" + e[n].value), e[n].selected !== s && (e[n].selected = s), s && r && (e[n].defaultSelected = !0);
  } else {
    for (n = "" + Tr(n), t = null, s = 0; s < e.length; s++) {
      if (e[s].value === n) {
        e[s].selected = !0, r && (e[s].defaultSelected = !0);
        return;
      }
      t !== null || e[s].disabled || (t = e[s]);
    }
    t !== null && (t.selected = !0);
  }
}
function lc(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(V(91));
  return Fe({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
}
function yp(e, t) {
  var n = t.value;
  if (n == null) {
    if (n = t.children, t = t.defaultValue, n != null) {
      if (t != null) throw Error(V(92));
      if (ka(n)) {
        if (1 < n.length) throw Error(V(93));
        n = n[0];
      }
      t = n;
    }
    t == null && (t = ""), n = t;
  }
  e._wrapperState = { initialValue: Tr(n) };
}
function Sg(e, t) {
  var n = Tr(t.value), r = Tr(t.defaultValue);
  n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
}
function xp(e) {
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
function uc(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml" ? kg(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
}
var Vi, Ng = function(e) {
  return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, s) {
    MSApp.execUnsafeLocalFunction(function() {
      return e(t, n, r, s);
    });
  } : e;
}(function(e, t) {
  if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
  else {
    for (Vi = Vi || document.createElement("div"), Vi.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Vi.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
    for (; t.firstChild; ) e.appendChild(t.firstChild);
  }
});
function Ka(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var Pa = {
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
}, PS = ["Webkit", "ms", "Moz", "O"];
Object.keys(Pa).forEach(function(e) {
  PS.forEach(function(t) {
    t = t + e.charAt(0).toUpperCase() + e.substring(1), Pa[t] = Pa[e];
  });
});
function jg(e, t, n) {
  return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Pa.hasOwnProperty(e) && Pa[e] ? ("" + t).trim() : t + "px";
}
function Eg(e, t) {
  e = e.style;
  for (var n in t) if (t.hasOwnProperty(n)) {
    var r = n.indexOf("--") === 0, s = jg(n, t[n], r);
    n === "float" && (n = "cssFloat"), r ? e.setProperty(n, s) : e[n] = s;
  }
}
var RS = Fe({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
function cc(e, t) {
  if (t) {
    if (RS[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(V(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(V(60));
      if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(V(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(V(62));
  }
}
function dc(e, t) {
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
var fc = null;
function Td(e) {
  return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
}
var pc = null, Os = null, Ls = null;
function wp(e) {
  if (e = wi(e)) {
    if (typeof pc != "function") throw Error(V(280));
    var t = e.stateNode;
    t && (t = _l(t), pc(e.stateNode, e.type, t));
  }
}
function Cg(e) {
  Os ? Ls ? Ls.push(e) : Ls = [e] : Os = e;
}
function Tg() {
  if (Os) {
    var e = Os, t = Ls;
    if (Ls = Os = null, wp(e), t) for (e = 0; e < t.length; e++) wp(t[e]);
  }
}
function Ig(e, t) {
  return e(t);
}
function Ag() {
}
var tu = !1;
function Pg(e, t, n) {
  if (tu) return e(t, n);
  tu = !0;
  try {
    return Ig(e, t, n);
  } finally {
    tu = !1, (Os !== null || Ls !== null) && (Ag(), Tg());
  }
}
function qa(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = _l(n);
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
  if (n && typeof n != "function") throw Error(V(231, t, typeof n));
  return n;
}
var mc = !1;
if (Jn) try {
  var ha = {};
  Object.defineProperty(ha, "passive", { get: function() {
    mc = !0;
  } }), window.addEventListener("test", ha, ha), window.removeEventListener("test", ha, ha);
} catch {
  mc = !1;
}
function MS(e, t, n, r, s, a, o, u, c) {
  var p = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, p);
  } catch (h) {
    this.onError(h);
  }
}
var Ra = !1, Bo = null, $o = !1, hc = null, DS = { onError: function(e) {
  Ra = !0, Bo = e;
} };
function OS(e, t, n, r, s, a, o, u, c) {
  Ra = !1, Bo = null, MS.apply(DS, arguments);
}
function LS(e, t, n, r, s, a, o, u, c) {
  if (OS.apply(this, arguments), Ra) {
    if (Ra) {
      var p = Bo;
      Ra = !1, Bo = null;
    } else throw Error(V(198));
    $o || ($o = !0, hc = p);
  }
}
function ls(e) {
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
function bp(e) {
  if (ls(e) !== e) throw Error(V(188));
}
function zS(e) {
  var t = e.alternate;
  if (!t) {
    if (t = ls(e), t === null) throw Error(V(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ; ) {
    var s = n.return;
    if (s === null) break;
    var a = s.alternate;
    if (a === null) {
      if (r = s.return, r !== null) {
        n = r;
        continue;
      }
      break;
    }
    if (s.child === a.child) {
      for (a = s.child; a; ) {
        if (a === n) return bp(s), e;
        if (a === r) return bp(s), t;
        a = a.sibling;
      }
      throw Error(V(188));
    }
    if (n.return !== r.return) n = s, r = a;
    else {
      for (var o = !1, u = s.child; u; ) {
        if (u === n) {
          o = !0, n = s, r = a;
          break;
        }
        if (u === r) {
          o = !0, r = s, n = a;
          break;
        }
        u = u.sibling;
      }
      if (!o) {
        for (u = a.child; u; ) {
          if (u === n) {
            o = !0, n = a, r = s;
            break;
          }
          if (u === r) {
            o = !0, r = a, n = s;
            break;
          }
          u = u.sibling;
        }
        if (!o) throw Error(V(189));
      }
    }
    if (n.alternate !== r) throw Error(V(190));
  }
  if (n.tag !== 3) throw Error(V(188));
  return n.stateNode.current === n ? e : t;
}
function Mg(e) {
  return e = zS(e), e !== null ? Dg(e) : null;
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
var Og = Wt.unstable_scheduleCallback, Sp = Wt.unstable_cancelCallback, BS = Wt.unstable_shouldYield, $S = Wt.unstable_requestPaint, Ge = Wt.unstable_now, FS = Wt.unstable_getCurrentPriorityLevel, Id = Wt.unstable_ImmediatePriority, Lg = Wt.unstable_UserBlockingPriority, Fo = Wt.unstable_NormalPriority, HS = Wt.unstable_LowPriority, zg = Wt.unstable_IdlePriority, ml = null, Dn = null;
function US(e) {
  if (Dn && typeof Dn.onCommitFiberRoot == "function") try {
    Dn.onCommitFiberRoot(ml, e, void 0, (e.current.flags & 128) === 128);
  } catch {
  }
}
var yn = Math.clz32 ? Math.clz32 : VS, WS = Math.log, GS = Math.LN2;
function VS(e) {
  return e >>>= 0, e === 0 ? 32 : 31 - (WS(e) / GS | 0) | 0;
}
var Ki = 64, qi = 4194304;
function Na(e) {
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
function Ho(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0, s = e.suspendedLanes, a = e.pingedLanes, o = n & 268435455;
  if (o !== 0) {
    var u = o & ~s;
    u !== 0 ? r = Na(u) : (a &= o, a !== 0 && (r = Na(a)));
  } else o = n & ~s, o !== 0 ? r = Na(o) : a !== 0 && (r = Na(a));
  if (r === 0) return 0;
  if (t !== 0 && t !== r && !(t & s) && (s = r & -r, a = t & -t, s >= a || s === 16 && (a & 4194240) !== 0)) return t;
  if (r & 4 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - yn(t), s = 1 << n, r |= e[n], t &= ~s;
  return r;
}
function KS(e, t) {
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
function qS(e, t) {
  for (var n = e.suspendedLanes, r = e.pingedLanes, s = e.expirationTimes, a = e.pendingLanes; 0 < a; ) {
    var o = 31 - yn(a), u = 1 << o, c = s[o];
    c === -1 ? (!(u & n) || u & r) && (s[o] = KS(u, t)) : c <= t && (e.expiredLanes |= u), a &= ~u;
  }
}
function gc(e) {
  return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
}
function Bg() {
  var e = Ki;
  return Ki <<= 1, !(Ki & 4194240) && (Ki = 64), e;
}
function nu(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function yi(e, t, n) {
  e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - yn(t), e[t] = n;
}
function YS(e, t) {
  var n = e.pendingLanes & ~t;
  e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var s = 31 - yn(n), a = 1 << s;
    t[s] = 0, r[s] = -1, e[s] = -1, n &= ~a;
  }
}
function Ad(e, t) {
  var n = e.entangledLanes |= t;
  for (e = e.entanglements; n; ) {
    var r = 31 - yn(n), s = 1 << r;
    s & t | e[r] & t && (e[r] |= t), n &= ~s;
  }
}
var Ee = 0;
function $g(e) {
  return e &= -e, 1 < e ? 4 < e ? e & 268435455 ? 16 : 536870912 : 4 : 1;
}
var Fg, Pd, Hg, Ug, Wg, vc = !1, Yi = [], xr = null, wr = null, br = null, Ya = /* @__PURE__ */ new Map(), Qa = /* @__PURE__ */ new Map(), mr = [], QS = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function kp(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      xr = null;
      break;
    case "dragenter":
    case "dragleave":
      wr = null;
      break;
    case "mouseover":
    case "mouseout":
      br = null;
      break;
    case "pointerover":
    case "pointerout":
      Ya.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Qa.delete(t.pointerId);
  }
}
function ga(e, t, n, r, s, a) {
  return e === null || e.nativeEvent !== a ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: a, targetContainers: [s] }, t !== null && (t = wi(t), t !== null && Pd(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, s !== null && t.indexOf(s) === -1 && t.push(s), e);
}
function XS(e, t, n, r, s) {
  switch (t) {
    case "focusin":
      return xr = ga(xr, e, t, n, r, s), !0;
    case "dragenter":
      return wr = ga(wr, e, t, n, r, s), !0;
    case "mouseover":
      return br = ga(br, e, t, n, r, s), !0;
    case "pointerover":
      var a = s.pointerId;
      return Ya.set(a, ga(Ya.get(a) || null, e, t, n, r, s)), !0;
    case "gotpointercapture":
      return a = s.pointerId, Qa.set(a, ga(Qa.get(a) || null, e, t, n, r, s)), !0;
  }
  return !1;
}
function Gg(e) {
  var t = Kr(e.target);
  if (t !== null) {
    var n = ls(t);
    if (n !== null) {
      if (t = n.tag, t === 13) {
        if (t = Rg(n), t !== null) {
          e.blockedOn = t, Wg(e.priority, function() {
            Hg(n);
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
function _o(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = _c(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      fc = r, n.target.dispatchEvent(r), fc = null;
    } else return t = wi(n), t !== null && Pd(t), e.blockedOn = n, !1;
    t.shift();
  }
  return !0;
}
function Np(e, t, n) {
  _o(e) && n.delete(t);
}
function ZS() {
  vc = !1, xr !== null && _o(xr) && (xr = null), wr !== null && _o(wr) && (wr = null), br !== null && _o(br) && (br = null), Ya.forEach(Np), Qa.forEach(Np);
}
function va(e, t) {
  e.blockedOn === t && (e.blockedOn = null, vc || (vc = !0, Wt.unstable_scheduleCallback(Wt.unstable_NormalPriority, ZS)));
}
function Xa(e) {
  function t(s) {
    return va(s, e);
  }
  if (0 < Yi.length) {
    va(Yi[0], e);
    for (var n = 1; n < Yi.length; n++) {
      var r = Yi[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (xr !== null && va(xr, e), wr !== null && va(wr, e), br !== null && va(br, e), Ya.forEach(t), Qa.forEach(t), n = 0; n < mr.length; n++) r = mr[n], r.blockedOn === e && (r.blockedOn = null);
  for (; 0 < mr.length && (n = mr[0], n.blockedOn === null); ) Gg(n), n.blockedOn === null && mr.shift();
}
var zs = rr.ReactCurrentBatchConfig, Uo = !0;
function JS(e, t, n, r) {
  var s = Ee, a = zs.transition;
  zs.transition = null;
  try {
    Ee = 1, Rd(e, t, n, r);
  } finally {
    Ee = s, zs.transition = a;
  }
}
function ek(e, t, n, r) {
  var s = Ee, a = zs.transition;
  zs.transition = null;
  try {
    Ee = 4, Rd(e, t, n, r);
  } finally {
    Ee = s, zs.transition = a;
  }
}
function Rd(e, t, n, r) {
  if (Uo) {
    var s = _c(e, t, n, r);
    if (s === null) fu(e, t, r, Wo, n), kp(e, r);
    else if (XS(s, e, t, n, r)) r.stopPropagation();
    else if (kp(e, r), t & 4 && -1 < QS.indexOf(e)) {
      for (; s !== null; ) {
        var a = wi(s);
        if (a !== null && Fg(a), a = _c(e, t, n, r), a === null && fu(e, t, r, Wo, n), a === s) break;
        s = a;
      }
      s !== null && r.stopPropagation();
    } else fu(e, t, r, null, n);
  }
}
var Wo = null;
function _c(e, t, n, r) {
  if (Wo = null, e = Td(r), e = Kr(e), e !== null) if (t = ls(e), t === null) e = null;
  else if (n = t.tag, n === 13) {
    if (e = Rg(t), e !== null) return e;
    e = null;
  } else if (n === 3) {
    if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
    e = null;
  } else t !== e && (e = null);
  return Wo = e, null;
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
        case Id:
          return 1;
        case Lg:
          return 4;
        case Fo:
        case HS:
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
var vr = null, Md = null, yo = null;
function Kg() {
  if (yo) return yo;
  var e, t = Md, n = t.length, r, s = "value" in vr ? vr.value : vr.textContent, a = s.length;
  for (e = 0; e < n && t[e] === s[e]; e++) ;
  var o = n - e;
  for (r = 1; r <= o && t[n - r] === s[a - r]; r++) ;
  return yo = s.slice(e, 1 < r ? 1 - r : void 0);
}
function xo(e) {
  var t = e.keyCode;
  return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
}
function Qi() {
  return !0;
}
function jp() {
  return !1;
}
function Vt(e) {
  function t(n, r, s, a, o) {
    this._reactName = n, this._targetInst = s, this.type = r, this.nativeEvent = a, this.target = o, this.currentTarget = null;
    for (var u in e) e.hasOwnProperty(u) && (n = e[u], this[u] = n ? n(a) : a[u]);
    return this.isDefaultPrevented = (a.defaultPrevented != null ? a.defaultPrevented : a.returnValue === !1) ? Qi : jp, this.isPropagationStopped = jp, this;
  }
  return Fe(t.prototype, { preventDefault: function() {
    this.defaultPrevented = !0;
    var n = this.nativeEvent;
    n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Qi);
  }, stopPropagation: function() {
    var n = this.nativeEvent;
    n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Qi);
  }, persist: function() {
  }, isPersistent: Qi }), t;
}
var ea = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
  return e.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, Dd = Vt(ea), xi = Fe({}, ea, { view: 0, detail: 0 }), tk = Vt(xi), ru, su, _a, hl = Fe({}, xi, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Od, button: 0, buttons: 0, relatedTarget: function(e) {
  return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
}, movementX: function(e) {
  return "movementX" in e ? e.movementX : (e !== _a && (_a && e.type === "mousemove" ? (ru = e.screenX - _a.screenX, su = e.screenY - _a.screenY) : su = ru = 0, _a = e), ru);
}, movementY: function(e) {
  return "movementY" in e ? e.movementY : su;
} }), Ep = Vt(hl), nk = Fe({}, hl, { dataTransfer: 0 }), rk = Vt(nk), sk = Fe({}, xi, { relatedTarget: 0 }), au = Vt(sk), ak = Fe({}, ea, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), ik = Vt(ak), ok = Fe({}, ea, { clipboardData: function(e) {
  return "clipboardData" in e ? e.clipboardData : window.clipboardData;
} }), lk = Vt(ok), uk = Fe({}, ea, { data: 0 }), Cp = Vt(uk), ck = {
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
}, dk = {
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
}, fk = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function pk(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = fk[e]) ? !!t[e] : !1;
}
function Od() {
  return pk;
}
var mk = Fe({}, xi, { key: function(e) {
  if (e.key) {
    var t = ck[e.key] || e.key;
    if (t !== "Unidentified") return t;
  }
  return e.type === "keypress" ? (e = xo(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? dk[e.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Od, charCode: function(e) {
  return e.type === "keypress" ? xo(e) : 0;
}, keyCode: function(e) {
  return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
}, which: function(e) {
  return e.type === "keypress" ? xo(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
} }), hk = Vt(mk), gk = Fe({}, hl, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Tp = Vt(gk), vk = Fe({}, xi, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Od }), _k = Vt(vk), yk = Fe({}, ea, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), xk = Vt(yk), wk = Fe({}, hl, {
  deltaX: function(e) {
    return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
  },
  deltaY: function(e) {
    return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), bk = Vt(wk), Sk = [9, 13, 27, 32], Ld = Jn && "CompositionEvent" in window, Ma = null;
Jn && "documentMode" in document && (Ma = document.documentMode);
var kk = Jn && "TextEvent" in window && !Ma, qg = Jn && (!Ld || Ma && 8 < Ma && 11 >= Ma), Ip = " ", Ap = !1;
function Yg(e, t) {
  switch (e) {
    case "keyup":
      return Sk.indexOf(t.keyCode) !== -1;
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
var Ns = !1;
function Nk(e, t) {
  switch (e) {
    case "compositionend":
      return Qg(t);
    case "keypress":
      return t.which !== 32 ? null : (Ap = !0, Ip);
    case "textInput":
      return e = t.data, e === Ip && Ap ? null : e;
    default:
      return null;
  }
}
function jk(e, t) {
  if (Ns) return e === "compositionend" || !Ld && Yg(e, t) ? (e = Kg(), yo = Md = vr = null, Ns = !1, e) : null;
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
var Ek = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
function Pp(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!Ek[e.type] : t === "textarea";
}
function Xg(e, t, n, r) {
  Cg(r), t = Go(t, "onChange"), 0 < t.length && (n = new Dd("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
}
var Da = null, Za = null;
function Ck(e) {
  lv(e, 0);
}
function gl(e) {
  var t = Cs(e);
  if (wg(t)) return e;
}
function Tk(e, t) {
  if (e === "change") return t;
}
var Zg = !1;
if (Jn) {
  var iu;
  if (Jn) {
    var ou = "oninput" in document;
    if (!ou) {
      var Rp = document.createElement("div");
      Rp.setAttribute("oninput", "return;"), ou = typeof Rp.oninput == "function";
    }
    iu = ou;
  } else iu = !1;
  Zg = iu && (!document.documentMode || 9 < document.documentMode);
}
function Mp() {
  Da && (Da.detachEvent("onpropertychange", Jg), Za = Da = null);
}
function Jg(e) {
  if (e.propertyName === "value" && gl(Za)) {
    var t = [];
    Xg(t, Za, e, Td(e)), Pg(Ck, t);
  }
}
function Ik(e, t, n) {
  e === "focusin" ? (Mp(), Da = t, Za = n, Da.attachEvent("onpropertychange", Jg)) : e === "focusout" && Mp();
}
function Ak(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown") return gl(Za);
}
function Pk(e, t) {
  if (e === "click") return gl(t);
}
function Rk(e, t) {
  if (e === "input" || e === "change") return gl(t);
}
function Mk(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var bn = typeof Object.is == "function" ? Object.is : Mk;
function Ja(e, t) {
  if (bn(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
  var n = Object.keys(e), r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var s = n[r];
    if (!ec.call(t, s) || !bn(e[s], t[s])) return !1;
  }
  return !0;
}
function Dp(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function Op(e, t) {
  var n = Dp(e);
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
    n = Dp(n);
  }
}
function ev(e, t) {
  return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? ev(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
}
function tv() {
  for (var e = window, t = zo(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = zo(e.document);
  }
  return t;
}
function zd(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
}
function Dk(e) {
  var t = tv(), n = e.focusedElem, r = e.selectionRange;
  if (t !== n && n && n.ownerDocument && ev(n.ownerDocument.documentElement, n)) {
    if (r !== null && zd(n)) {
      if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
      else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
        e = e.getSelection();
        var s = n.textContent.length, a = Math.min(r.start, s);
        r = r.end === void 0 ? a : Math.min(r.end, s), !e.extend && a > r && (s = r, r = a, a = s), s = Op(n, a);
        var o = Op(
          n,
          r
        );
        s && o && (e.rangeCount !== 1 || e.anchorNode !== s.node || e.anchorOffset !== s.offset || e.focusNode !== o.node || e.focusOffset !== o.offset) && (t = t.createRange(), t.setStart(s.node, s.offset), e.removeAllRanges(), a > r ? (e.addRange(t), e.extend(o.node, o.offset)) : (t.setEnd(o.node, o.offset), e.addRange(t)));
      }
    }
    for (t = [], e = n; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++) e = t[n], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
  }
}
var Ok = Jn && "documentMode" in document && 11 >= document.documentMode, js = null, yc = null, Oa = null, xc = !1;
function Lp(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  xc || js == null || js !== zo(r) || (r = js, "selectionStart" in r && zd(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), Oa && Ja(Oa, r) || (Oa = r, r = Go(yc, "onSelect"), 0 < r.length && (t = new Dd("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = js)));
}
function Xi(e, t) {
  var n = {};
  return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
}
var Es = { animationend: Xi("Animation", "AnimationEnd"), animationiteration: Xi("Animation", "AnimationIteration"), animationstart: Xi("Animation", "AnimationStart"), transitionend: Xi("Transition", "TransitionEnd") }, lu = {}, nv = {};
Jn && (nv = document.createElement("div").style, "AnimationEvent" in window || (delete Es.animationend.animation, delete Es.animationiteration.animation, delete Es.animationstart.animation), "TransitionEvent" in window || delete Es.transitionend.transition);
function vl(e) {
  if (lu[e]) return lu[e];
  if (!Es[e]) return e;
  var t = Es[e], n;
  for (n in t) if (t.hasOwnProperty(n) && n in nv) return lu[e] = t[n];
  return e;
}
var rv = vl("animationend"), sv = vl("animationiteration"), av = vl("animationstart"), iv = vl("transitionend"), ov = /* @__PURE__ */ new Map(), zp = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function Pr(e, t) {
  ov.set(e, t), os(t, [e]);
}
for (var uu = 0; uu < zp.length; uu++) {
  var cu = zp[uu], Lk = cu.toLowerCase(), zk = cu[0].toUpperCase() + cu.slice(1);
  Pr(Lk, "on" + zk);
}
Pr(rv, "onAnimationEnd");
Pr(sv, "onAnimationIteration");
Pr(av, "onAnimationStart");
Pr("dblclick", "onDoubleClick");
Pr("focusin", "onFocus");
Pr("focusout", "onBlur");
Pr(iv, "onTransitionEnd");
Ws("onMouseEnter", ["mouseout", "mouseover"]);
Ws("onMouseLeave", ["mouseout", "mouseover"]);
Ws("onPointerEnter", ["pointerout", "pointerover"]);
Ws("onPointerLeave", ["pointerout", "pointerover"]);
os("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
os("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
os("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
os("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
os("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
os("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var ja = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Bk = new Set("cancel close invalid load scroll toggle".split(" ").concat(ja));
function Bp(e, t, n) {
  var r = e.type || "unknown-event";
  e.currentTarget = n, LS(r, t, void 0, e), e.currentTarget = null;
}
function lv(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n], s = r.event;
    r = r.listeners;
    e: {
      var a = void 0;
      if (t) for (var o = r.length - 1; 0 <= o; o--) {
        var u = r[o], c = u.instance, p = u.currentTarget;
        if (u = u.listener, c !== a && s.isPropagationStopped()) break e;
        Bp(s, u, p), a = c;
      }
      else for (o = 0; o < r.length; o++) {
        if (u = r[o], c = u.instance, p = u.currentTarget, u = u.listener, c !== a && s.isPropagationStopped()) break e;
        Bp(s, u, p), a = c;
      }
    }
  }
  if ($o) throw e = hc, $o = !1, hc = null, e;
}
function Pe(e, t) {
  var n = t[Nc];
  n === void 0 && (n = t[Nc] = /* @__PURE__ */ new Set());
  var r = e + "__bubble";
  n.has(r) || (uv(t, e, 2, !1), n.add(r));
}
function du(e, t, n) {
  var r = 0;
  t && (r |= 4), uv(n, e, r, t);
}
var Zi = "_reactListening" + Math.random().toString(36).slice(2);
function ei(e) {
  if (!e[Zi]) {
    e[Zi] = !0, gg.forEach(function(n) {
      n !== "selectionchange" && (Bk.has(n) || du(n, !1, e), du(n, !0, e));
    });
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[Zi] || (t[Zi] = !0, du("selectionchange", !1, t));
  }
}
function uv(e, t, n, r) {
  switch (Vg(t)) {
    case 1:
      var s = JS;
      break;
    case 4:
      s = ek;
      break;
    default:
      s = Rd;
  }
  n = s.bind(null, t, n, e), s = void 0, !mc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (s = !0), r ? s !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: s }) : e.addEventListener(t, n, !0) : s !== void 0 ? e.addEventListener(t, n, { passive: s }) : e.addEventListener(t, n, !1);
}
function fu(e, t, n, r, s) {
  var a = r;
  if (!(t & 1) && !(t & 2) && r !== null) e: for (; ; ) {
    if (r === null) return;
    var o = r.tag;
    if (o === 3 || o === 4) {
      var u = r.stateNode.containerInfo;
      if (u === s || u.nodeType === 8 && u.parentNode === s) break;
      if (o === 4) for (o = r.return; o !== null; ) {
        var c = o.tag;
        if ((c === 3 || c === 4) && (c = o.stateNode.containerInfo, c === s || c.nodeType === 8 && c.parentNode === s)) return;
        o = o.return;
      }
      for (; u !== null; ) {
        if (o = Kr(u), o === null) return;
        if (c = o.tag, c === 5 || c === 6) {
          r = a = o;
          continue e;
        }
        u = u.parentNode;
      }
    }
    r = r.return;
  }
  Pg(function() {
    var p = a, h = Td(n), b = [];
    e: {
      var g = ov.get(e);
      if (g !== void 0) {
        var w = Dd, E = e;
        switch (e) {
          case "keypress":
            if (xo(n) === 0) break e;
          case "keydown":
          case "keyup":
            w = hk;
            break;
          case "focusin":
            E = "focus", w = au;
            break;
          case "focusout":
            E = "blur", w = au;
            break;
          case "beforeblur":
          case "afterblur":
            w = au;
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
            w = Ep;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            w = rk;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            w = _k;
            break;
          case rv:
          case sv:
          case av:
            w = ik;
            break;
          case iv:
            w = xk;
            break;
          case "scroll":
            w = tk;
            break;
          case "wheel":
            w = bk;
            break;
          case "copy":
          case "cut":
          case "paste":
            w = lk;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            w = Tp;
        }
        var A = (t & 4) !== 0, D = !A && e === "scroll", _ = A ? g !== null ? g + "Capture" : null : g;
        A = [];
        for (var x = p, N; x !== null; ) {
          N = x;
          var l = N.stateNode;
          if (N.tag === 5 && l !== null && (N = l, _ !== null && (l = qa(x, _), l != null && A.push(ti(x, l, N)))), D) break;
          x = x.return;
        }
        0 < A.length && (g = new w(g, E, null, n, h), b.push({ event: g, listeners: A }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (g = e === "mouseover" || e === "pointerover", w = e === "mouseout" || e === "pointerout", g && n !== fc && (E = n.relatedTarget || n.fromElement) && (Kr(E) || E[er])) break e;
        if ((w || g) && (g = h.window === h ? h : (g = h.ownerDocument) ? g.defaultView || g.parentWindow : window, w ? (E = n.relatedTarget || n.toElement, w = p, E = E ? Kr(E) : null, E !== null && (D = ls(E), E !== D || E.tag !== 5 && E.tag !== 6) && (E = null)) : (w = null, E = p), w !== E)) {
          if (A = Ep, l = "onMouseLeave", _ = "onMouseEnter", x = "mouse", (e === "pointerout" || e === "pointerover") && (A = Tp, l = "onPointerLeave", _ = "onPointerEnter", x = "pointer"), D = w == null ? g : Cs(w), N = E == null ? g : Cs(E), g = new A(l, x + "leave", w, n, h), g.target = D, g.relatedTarget = N, l = null, Kr(h) === p && (A = new A(_, x + "enter", E, n, h), A.target = N, A.relatedTarget = D, l = A), D = l, w && E) t: {
            for (A = w, _ = E, x = 0, N = A; N; N = gs(N)) x++;
            for (N = 0, l = _; l; l = gs(l)) N++;
            for (; 0 < x - N; ) A = gs(A), x--;
            for (; 0 < N - x; ) _ = gs(_), N--;
            for (; x--; ) {
              if (A === _ || _ !== null && A === _.alternate) break t;
              A = gs(A), _ = gs(_);
            }
            A = null;
          }
          else A = null;
          w !== null && $p(b, g, w, A, !1), E !== null && D !== null && $p(b, D, E, A, !0);
        }
      }
      e: {
        if (g = p ? Cs(p) : window, w = g.nodeName && g.nodeName.toLowerCase(), w === "select" || w === "input" && g.type === "file") var f = Tk;
        else if (Pp(g)) if (Zg) f = Rk;
        else {
          f = Ak;
          var d = Ik;
        }
        else (w = g.nodeName) && w.toLowerCase() === "input" && (g.type === "checkbox" || g.type === "radio") && (f = Pk);
        if (f && (f = f(e, p))) {
          Xg(b, f, n, h);
          break e;
        }
        d && d(e, g, p), e === "focusout" && (d = g._wrapperState) && d.controlled && g.type === "number" && oc(g, "number", g.value);
      }
      switch (d = p ? Cs(p) : window, e) {
        case "focusin":
          (Pp(d) || d.contentEditable === "true") && (js = d, yc = p, Oa = null);
          break;
        case "focusout":
          Oa = yc = js = null;
          break;
        case "mousedown":
          xc = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          xc = !1, Lp(b, n, h);
          break;
        case "selectionchange":
          if (Ok) break;
        case "keydown":
        case "keyup":
          Lp(b, n, h);
      }
      var m;
      if (Ld) e: {
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
      else Ns ? Yg(e, n) && (v = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (v = "onCompositionStart");
      v && (qg && n.locale !== "ko" && (Ns || v !== "onCompositionStart" ? v === "onCompositionEnd" && Ns && (m = Kg()) : (vr = h, Md = "value" in vr ? vr.value : vr.textContent, Ns = !0)), d = Go(p, v), 0 < d.length && (v = new Cp(v, e, null, n, h), b.push({ event: v, listeners: d }), m ? v.data = m : (m = Qg(n), m !== null && (v.data = m)))), (m = kk ? Nk(e, n) : jk(e, n)) && (p = Go(p, "onBeforeInput"), 0 < p.length && (h = new Cp("onBeforeInput", "beforeinput", null, n, h), b.push({ event: h, listeners: p }), h.data = m));
    }
    lv(b, t);
  });
}
function ti(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function Go(e, t) {
  for (var n = t + "Capture", r = []; e !== null; ) {
    var s = e, a = s.stateNode;
    s.tag === 5 && a !== null && (s = a, a = qa(e, n), a != null && r.unshift(ti(e, a, s)), a = qa(e, t), a != null && r.push(ti(e, a, s))), e = e.return;
  }
  return r;
}
function gs(e) {
  if (e === null) return null;
  do
    e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function $p(e, t, n, r, s) {
  for (var a = t._reactName, o = []; n !== null && n !== r; ) {
    var u = n, c = u.alternate, p = u.stateNode;
    if (c !== null && c === r) break;
    u.tag === 5 && p !== null && (u = p, s ? (c = qa(n, a), c != null && o.unshift(ti(n, c, u))) : s || (c = qa(n, a), c != null && o.push(ti(n, c, u)))), n = n.return;
  }
  o.length !== 0 && e.push({ event: t, listeners: o });
}
var $k = /\r\n?/g, Fk = /\u0000|\uFFFD/g;
function Fp(e) {
  return (typeof e == "string" ? e : "" + e).replace($k, `
`).replace(Fk, "");
}
function Ji(e, t, n) {
  if (t = Fp(t), Fp(e) !== t && n) throw Error(V(425));
}
function Vo() {
}
var wc = null, bc = null;
function Sc(e, t) {
  return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
}
var kc = typeof setTimeout == "function" ? setTimeout : void 0, Hk = typeof clearTimeout == "function" ? clearTimeout : void 0, Hp = typeof Promise == "function" ? Promise : void 0, Uk = typeof queueMicrotask == "function" ? queueMicrotask : typeof Hp < "u" ? function(e) {
  return Hp.resolve(null).then(e).catch(Wk);
} : kc;
function Wk(e) {
  setTimeout(function() {
    throw e;
  });
}
function pu(e, t) {
  var n = t, r = 0;
  do {
    var s = n.nextSibling;
    if (e.removeChild(n), s && s.nodeType === 8) if (n = s.data, n === "/$") {
      if (r === 0) {
        e.removeChild(s), Xa(t);
        return;
      }
      r--;
    } else n !== "$" && n !== "$?" && n !== "$!" || r++;
    n = s;
  } while (n);
  Xa(t);
}
function Sr(e) {
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
function Up(e) {
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
var ta = Math.random().toString(36).slice(2), Rn = "__reactFiber$" + ta, ni = "__reactProps$" + ta, er = "__reactContainer$" + ta, Nc = "__reactEvents$" + ta, Gk = "__reactListeners$" + ta, Vk = "__reactHandles$" + ta;
function Kr(e) {
  var t = e[Rn];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if (t = n[er] || n[Rn]) {
      if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = Up(e); e !== null; ) {
        if (n = e[Rn]) return n;
        e = Up(e);
      }
      return t;
    }
    e = n, n = e.parentNode;
  }
  return null;
}
function wi(e) {
  return e = e[Rn] || e[er], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
}
function Cs(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(V(33));
}
function _l(e) {
  return e[ni] || null;
}
var jc = [], Ts = -1;
function Rr(e) {
  return { current: e };
}
function De(e) {
  0 > Ts || (e.current = jc[Ts], jc[Ts] = null, Ts--);
}
function Ae(e, t) {
  Ts++, jc[Ts] = e.current, e.current = t;
}
var Ir = {}, xt = Rr(Ir), Mt = Rr(!1), ts = Ir;
function Gs(e, t) {
  var n = e.type.contextTypes;
  if (!n) return Ir;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
  var s = {}, a;
  for (a in n) s[a] = t[a];
  return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = s), s;
}
function Dt(e) {
  return e = e.childContextTypes, e != null;
}
function Ko() {
  De(Mt), De(xt);
}
function Wp(e, t, n) {
  if (xt.current !== Ir) throw Error(V(168));
  Ae(xt, t), Ae(Mt, n);
}
function cv(e, t, n) {
  var r = e.stateNode;
  if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
  r = r.getChildContext();
  for (var s in r) if (!(s in t)) throw Error(V(108, IS(e) || "Unknown", s));
  return Fe({}, n, r);
}
function qo(e) {
  return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Ir, ts = xt.current, Ae(xt, e), Ae(Mt, Mt.current), !0;
}
function Gp(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(V(169));
  n ? (e = cv(e, t, ts), r.__reactInternalMemoizedMergedChildContext = e, De(Mt), De(xt), Ae(xt, e)) : De(Mt), Ae(Mt, n);
}
var Kn = null, yl = !1, mu = !1;
function dv(e) {
  Kn === null ? Kn = [e] : Kn.push(e);
}
function Kk(e) {
  yl = !0, dv(e);
}
function Mr() {
  if (!mu && Kn !== null) {
    mu = !0;
    var e = 0, t = Ee;
    try {
      var n = Kn;
      for (Ee = 1; e < n.length; e++) {
        var r = n[e];
        do
          r = r(!0);
        while (r !== null);
      }
      Kn = null, yl = !1;
    } catch (s) {
      throw Kn !== null && (Kn = Kn.slice(e + 1)), Og(Id, Mr), s;
    } finally {
      Ee = t, mu = !1;
    }
  }
  return null;
}
var Is = [], As = 0, Yo = null, Qo = 0, Zt = [], Jt = 0, ns = null, qn = 1, Yn = "";
function Wr(e, t) {
  Is[As++] = Qo, Is[As++] = Yo, Yo = e, Qo = t;
}
function fv(e, t, n) {
  Zt[Jt++] = qn, Zt[Jt++] = Yn, Zt[Jt++] = ns, ns = e;
  var r = qn;
  e = Yn;
  var s = 32 - yn(r) - 1;
  r &= ~(1 << s), n += 1;
  var a = 32 - yn(t) + s;
  if (30 < a) {
    var o = s - s % 5;
    a = (r & (1 << o) - 1).toString(32), r >>= o, s -= o, qn = 1 << 32 - yn(t) + s | n << s | r, Yn = a + e;
  } else qn = 1 << a | n << s | r, Yn = e;
}
function Bd(e) {
  e.return !== null && (Wr(e, 1), fv(e, 1, 0));
}
function $d(e) {
  for (; e === Yo; ) Yo = Is[--As], Is[As] = null, Qo = Is[--As], Is[As] = null;
  for (; e === ns; ) ns = Zt[--Jt], Zt[Jt] = null, Yn = Zt[--Jt], Zt[Jt] = null, qn = Zt[--Jt], Zt[Jt] = null;
}
var Ht = null, Ft = null, ze = !1, vn = null;
function pv(e, t) {
  var n = tn(5, null, null, 0);
  n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
}
function Vp(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, Ht = e, Ft = Sr(t.firstChild), !0) : !1;
    case 6:
      return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, Ht = e, Ft = null, !0) : !1;
    case 13:
      return t = t.nodeType !== 8 ? null : t, t !== null ? (n = ns !== null ? { id: qn, overflow: Yn } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = tn(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, Ht = e, Ft = null, !0) : !1;
    default:
      return !1;
  }
}
function Ec(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function Cc(e) {
  if (ze) {
    var t = Ft;
    if (t) {
      var n = t;
      if (!Vp(e, t)) {
        if (Ec(e)) throw Error(V(418));
        t = Sr(n.nextSibling);
        var r = Ht;
        t && Vp(e, t) ? pv(r, n) : (e.flags = e.flags & -4097 | 2, ze = !1, Ht = e);
      }
    } else {
      if (Ec(e)) throw Error(V(418));
      e.flags = e.flags & -4097 | 2, ze = !1, Ht = e;
    }
  }
}
function Kp(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
  Ht = e;
}
function eo(e) {
  if (e !== Ht) return !1;
  if (!ze) return Kp(e), ze = !0, !1;
  var t;
  if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Sc(e.type, e.memoizedProps)), t && (t = Ft)) {
    if (Ec(e)) throw mv(), Error(V(418));
    for (; t; ) pv(e, t), t = Sr(t.nextSibling);
  }
  if (Kp(e), e.tag === 13) {
    if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(V(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              Ft = Sr(e.nextSibling);
              break e;
            }
            t--;
          } else n !== "$" && n !== "$!" && n !== "$?" || t++;
        }
        e = e.nextSibling;
      }
      Ft = null;
    }
  } else Ft = Ht ? Sr(e.stateNode.nextSibling) : null;
  return !0;
}
function mv() {
  for (var e = Ft; e; ) e = Sr(e.nextSibling);
}
function Vs() {
  Ft = Ht = null, ze = !1;
}
function Fd(e) {
  vn === null ? vn = [e] : vn.push(e);
}
var qk = rr.ReactCurrentBatchConfig;
function ya(e, t, n) {
  if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
    if (n._owner) {
      if (n = n._owner, n) {
        if (n.tag !== 1) throw Error(V(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(V(147, e));
      var s = r, a = "" + e;
      return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === a ? t.ref : (t = function(o) {
        var u = s.refs;
        o === null ? delete u[a] : u[a] = o;
      }, t._stringRef = a, t);
    }
    if (typeof e != "string") throw Error(V(284));
    if (!n._owner) throw Error(V(290, e));
  }
  return e;
}
function to(e, t) {
  throw e = Object.prototype.toString.call(t), Error(V(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
}
function qp(e) {
  var t = e._init;
  return t(e._payload);
}
function hv(e) {
  function t(_, x) {
    if (e) {
      var N = _.deletions;
      N === null ? (_.deletions = [x], _.flags |= 16) : N.push(x);
    }
  }
  function n(_, x) {
    if (!e) return null;
    for (; x !== null; ) t(_, x), x = x.sibling;
    return null;
  }
  function r(_, x) {
    for (_ = /* @__PURE__ */ new Map(); x !== null; ) x.key !== null ? _.set(x.key, x) : _.set(x.index, x), x = x.sibling;
    return _;
  }
  function s(_, x) {
    return _ = Er(_, x), _.index = 0, _.sibling = null, _;
  }
  function a(_, x, N) {
    return _.index = N, e ? (N = _.alternate, N !== null ? (N = N.index, N < x ? (_.flags |= 2, x) : N) : (_.flags |= 2, x)) : (_.flags |= 1048576, x);
  }
  function o(_) {
    return e && _.alternate === null && (_.flags |= 2), _;
  }
  function u(_, x, N, l) {
    return x === null || x.tag !== 6 ? (x = wu(N, _.mode, l), x.return = _, x) : (x = s(x, N), x.return = _, x);
  }
  function c(_, x, N, l) {
    var f = N.type;
    return f === ks ? h(_, x, N.props.children, l, N.key) : x !== null && (x.elementType === f || typeof f == "object" && f !== null && f.$$typeof === dr && qp(f) === x.type) ? (l = s(x, N.props), l.ref = ya(_, x, N), l.return = _, l) : (l = Eo(N.type, N.key, N.props, null, _.mode, l), l.ref = ya(_, x, N), l.return = _, l);
  }
  function p(_, x, N, l) {
    return x === null || x.tag !== 4 || x.stateNode.containerInfo !== N.containerInfo || x.stateNode.implementation !== N.implementation ? (x = bu(N, _.mode, l), x.return = _, x) : (x = s(x, N.children || []), x.return = _, x);
  }
  function h(_, x, N, l, f) {
    return x === null || x.tag !== 7 ? (x = es(N, _.mode, l, f), x.return = _, x) : (x = s(x, N), x.return = _, x);
  }
  function b(_, x, N) {
    if (typeof x == "string" && x !== "" || typeof x == "number") return x = wu("" + x, _.mode, N), x.return = _, x;
    if (typeof x == "object" && x !== null) {
      switch (x.$$typeof) {
        case Wi:
          return N = Eo(x.type, x.key, x.props, null, _.mode, N), N.ref = ya(_, null, x), N.return = _, N;
        case Ss:
          return x = bu(x, _.mode, N), x.return = _, x;
        case dr:
          var l = x._init;
          return b(_, l(x._payload), N);
      }
      if (ka(x) || ma(x)) return x = es(x, _.mode, N, null), x.return = _, x;
      to(_, x);
    }
    return null;
  }
  function g(_, x, N, l) {
    var f = x !== null ? x.key : null;
    if (typeof N == "string" && N !== "" || typeof N == "number") return f !== null ? null : u(_, x, "" + N, l);
    if (typeof N == "object" && N !== null) {
      switch (N.$$typeof) {
        case Wi:
          return N.key === f ? c(_, x, N, l) : null;
        case Ss:
          return N.key === f ? p(_, x, N, l) : null;
        case dr:
          return f = N._init, g(
            _,
            x,
            f(N._payload),
            l
          );
      }
      if (ka(N) || ma(N)) return f !== null ? null : h(_, x, N, l, null);
      to(_, N);
    }
    return null;
  }
  function w(_, x, N, l, f) {
    if (typeof l == "string" && l !== "" || typeof l == "number") return _ = _.get(N) || null, u(x, _, "" + l, f);
    if (typeof l == "object" && l !== null) {
      switch (l.$$typeof) {
        case Wi:
          return _ = _.get(l.key === null ? N : l.key) || null, c(x, _, l, f);
        case Ss:
          return _ = _.get(l.key === null ? N : l.key) || null, p(x, _, l, f);
        case dr:
          var d = l._init;
          return w(_, x, N, d(l._payload), f);
      }
      if (ka(l) || ma(l)) return _ = _.get(N) || null, h(x, _, l, f, null);
      to(x, l);
    }
    return null;
  }
  function E(_, x, N, l) {
    for (var f = null, d = null, m = x, v = x = 0, k = null; m !== null && v < N.length; v++) {
      m.index > v ? (k = m, m = null) : k = m.sibling;
      var S = g(_, m, N[v], l);
      if (S === null) {
        m === null && (m = k);
        break;
      }
      e && m && S.alternate === null && t(_, m), x = a(S, x, v), d === null ? f = S : d.sibling = S, d = S, m = k;
    }
    if (v === N.length) return n(_, m), ze && Wr(_, v), f;
    if (m === null) {
      for (; v < N.length; v++) m = b(_, N[v], l), m !== null && (x = a(m, x, v), d === null ? f = m : d.sibling = m, d = m);
      return ze && Wr(_, v), f;
    }
    for (m = r(_, m); v < N.length; v++) k = w(m, _, v, N[v], l), k !== null && (e && k.alternate !== null && m.delete(k.key === null ? v : k.key), x = a(k, x, v), d === null ? f = k : d.sibling = k, d = k);
    return e && m.forEach(function(C) {
      return t(_, C);
    }), ze && Wr(_, v), f;
  }
  function A(_, x, N, l) {
    var f = ma(N);
    if (typeof f != "function") throw Error(V(150));
    if (N = f.call(N), N == null) throw Error(V(151));
    for (var d = f = null, m = x, v = x = 0, k = null, S = N.next(); m !== null && !S.done; v++, S = N.next()) {
      m.index > v ? (k = m, m = null) : k = m.sibling;
      var C = g(_, m, S.value, l);
      if (C === null) {
        m === null && (m = k);
        break;
      }
      e && m && C.alternate === null && t(_, m), x = a(C, x, v), d === null ? f = C : d.sibling = C, d = C, m = k;
    }
    if (S.done) return n(
      _,
      m
    ), ze && Wr(_, v), f;
    if (m === null) {
      for (; !S.done; v++, S = N.next()) S = b(_, S.value, l), S !== null && (x = a(S, x, v), d === null ? f = S : d.sibling = S, d = S);
      return ze && Wr(_, v), f;
    }
    for (m = r(_, m); !S.done; v++, S = N.next()) S = w(m, _, v, S.value, l), S !== null && (e && S.alternate !== null && m.delete(S.key === null ? v : S.key), x = a(S, x, v), d === null ? f = S : d.sibling = S, d = S);
    return e && m.forEach(function(L) {
      return t(_, L);
    }), ze && Wr(_, v), f;
  }
  function D(_, x, N, l) {
    if (typeof N == "object" && N !== null && N.type === ks && N.key === null && (N = N.props.children), typeof N == "object" && N !== null) {
      switch (N.$$typeof) {
        case Wi:
          e: {
            for (var f = N.key, d = x; d !== null; ) {
              if (d.key === f) {
                if (f = N.type, f === ks) {
                  if (d.tag === 7) {
                    n(_, d.sibling), x = s(d, N.props.children), x.return = _, _ = x;
                    break e;
                  }
                } else if (d.elementType === f || typeof f == "object" && f !== null && f.$$typeof === dr && qp(f) === d.type) {
                  n(_, d.sibling), x = s(d, N.props), x.ref = ya(_, d, N), x.return = _, _ = x;
                  break e;
                }
                n(_, d);
                break;
              } else t(_, d);
              d = d.sibling;
            }
            N.type === ks ? (x = es(N.props.children, _.mode, l, N.key), x.return = _, _ = x) : (l = Eo(N.type, N.key, N.props, null, _.mode, l), l.ref = ya(_, x, N), l.return = _, _ = l);
          }
          return o(_);
        case Ss:
          e: {
            for (d = N.key; x !== null; ) {
              if (x.key === d) if (x.tag === 4 && x.stateNode.containerInfo === N.containerInfo && x.stateNode.implementation === N.implementation) {
                n(_, x.sibling), x = s(x, N.children || []), x.return = _, _ = x;
                break e;
              } else {
                n(_, x);
                break;
              }
              else t(_, x);
              x = x.sibling;
            }
            x = bu(N, _.mode, l), x.return = _, _ = x;
          }
          return o(_);
        case dr:
          return d = N._init, D(_, x, d(N._payload), l);
      }
      if (ka(N)) return E(_, x, N, l);
      if (ma(N)) return A(_, x, N, l);
      to(_, N);
    }
    return typeof N == "string" && N !== "" || typeof N == "number" ? (N = "" + N, x !== null && x.tag === 6 ? (n(_, x.sibling), x = s(x, N), x.return = _, _ = x) : (n(_, x), x = wu(N, _.mode, l), x.return = _, _ = x), o(_)) : n(_, x);
  }
  return D;
}
var Ks = hv(!0), gv = hv(!1), Xo = Rr(null), Zo = null, Ps = null, Hd = null;
function Ud() {
  Hd = Ps = Zo = null;
}
function Wd(e) {
  var t = Xo.current;
  De(Xo), e._currentValue = t;
}
function Tc(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate;
    if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
    e = e.return;
  }
}
function Bs(e, t) {
  Zo = e, Hd = Ps = null, e = e.dependencies, e !== null && e.firstContext !== null && (e.lanes & t && (Rt = !0), e.firstContext = null);
}
function an(e) {
  var t = e._currentValue;
  if (Hd !== e) if (e = { context: e, memoizedValue: t, next: null }, Ps === null) {
    if (Zo === null) throw Error(V(308));
    Ps = e, Zo.dependencies = { lanes: 0, firstContext: e };
  } else Ps = Ps.next = e;
  return t;
}
var qr = null;
function Gd(e) {
  qr === null ? qr = [e] : qr.push(e);
}
function vv(e, t, n, r) {
  var s = t.interleaved;
  return s === null ? (n.next = n, Gd(t)) : (n.next = s.next, s.next = n), t.interleaved = n, tr(e, r);
}
function tr(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
  return n.tag === 3 ? n.stateNode : null;
}
var fr = !1;
function Vd(e) {
  e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function _v(e, t) {
  e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
}
function Zn(e, t) {
  return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
}
function kr(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (r = r.shared, Se & 2) {
    var s = r.pending;
    return s === null ? t.next = t : (t.next = s.next, s.next = t), r.pending = t, tr(e, n);
  }
  return s = r.interleaved, s === null ? (t.next = t, Gd(r)) : (t.next = s.next, s.next = t), r.interleaved = t, tr(e, n);
}
function wo(e, t, n) {
  if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
    var r = t.lanes;
    r &= e.pendingLanes, n |= r, t.lanes = n, Ad(e, n);
  }
}
function Yp(e, t) {
  var n = e.updateQueue, r = e.alternate;
  if (r !== null && (r = r.updateQueue, n === r)) {
    var s = null, a = null;
    if (n = n.firstBaseUpdate, n !== null) {
      do {
        var o = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
        a === null ? s = a = o : a = a.next = o, n = n.next;
      } while (n !== null);
      a === null ? s = a = t : a = a.next = t;
    } else s = a = t;
    n = { baseState: r.baseState, firstBaseUpdate: s, lastBaseUpdate: a, shared: r.shared, effects: r.effects }, e.updateQueue = n;
    return;
  }
  e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
}
function Jo(e, t, n, r) {
  var s = e.updateQueue;
  fr = !1;
  var a = s.firstBaseUpdate, o = s.lastBaseUpdate, u = s.shared.pending;
  if (u !== null) {
    s.shared.pending = null;
    var c = u, p = c.next;
    c.next = null, o === null ? a = p : o.next = p, o = c;
    var h = e.alternate;
    h !== null && (h = h.updateQueue, u = h.lastBaseUpdate, u !== o && (u === null ? h.firstBaseUpdate = p : u.next = p, h.lastBaseUpdate = c));
  }
  if (a !== null) {
    var b = s.baseState;
    o = 0, h = p = c = null, u = a;
    do {
      var g = u.lane, w = u.eventTime;
      if ((r & g) === g) {
        h !== null && (h = h.next = {
          eventTime: w,
          lane: 0,
          tag: u.tag,
          payload: u.payload,
          callback: u.callback,
          next: null
        });
        e: {
          var E = e, A = u;
          switch (g = t, w = n, A.tag) {
            case 1:
              if (E = A.payload, typeof E == "function") {
                b = E.call(w, b, g);
                break e;
              }
              b = E;
              break e;
            case 3:
              E.flags = E.flags & -65537 | 128;
            case 0:
              if (E = A.payload, g = typeof E == "function" ? E.call(w, b, g) : E, g == null) break e;
              b = Fe({}, b, g);
              break e;
            case 2:
              fr = !0;
          }
        }
        u.callback !== null && u.lane !== 0 && (e.flags |= 64, g = s.effects, g === null ? s.effects = [u] : g.push(u));
      } else w = { eventTime: w, lane: g, tag: u.tag, payload: u.payload, callback: u.callback, next: null }, h === null ? (p = h = w, c = b) : h = h.next = w, o |= g;
      if (u = u.next, u === null) {
        if (u = s.shared.pending, u === null) break;
        g = u, u = g.next, g.next = null, s.lastBaseUpdate = g, s.shared.pending = null;
      }
    } while (!0);
    if (h === null && (c = b), s.baseState = c, s.firstBaseUpdate = p, s.lastBaseUpdate = h, t = s.shared.interleaved, t !== null) {
      s = t;
      do
        o |= s.lane, s = s.next;
      while (s !== t);
    } else a === null && (s.shared.lanes = 0);
    ss |= o, e.lanes = o, e.memoizedState = b;
  }
}
function Qp(e, t, n) {
  if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
    var r = e[t], s = r.callback;
    if (s !== null) {
      if (r.callback = null, r = n, typeof s != "function") throw Error(V(191, s));
      s.call(r);
    }
  }
}
var bi = {}, On = Rr(bi), ri = Rr(bi), si = Rr(bi);
function Yr(e) {
  if (e === bi) throw Error(V(174));
  return e;
}
function Kd(e, t) {
  switch (Ae(si, t), Ae(ri, e), Ae(On, bi), e = t.nodeType, e) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : uc(null, "");
      break;
    default:
      e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = uc(t, e);
  }
  De(On), Ae(On, t);
}
function qs() {
  De(On), De(ri), De(si);
}
function yv(e) {
  Yr(si.current);
  var t = Yr(On.current), n = uc(t, e.type);
  t !== n && (Ae(ri, e), Ae(On, n));
}
function qd(e) {
  ri.current === e && (De(On), De(ri));
}
var Be = Rr(0);
function el(e) {
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
var hu = [];
function Yd() {
  for (var e = 0; e < hu.length; e++) hu[e]._workInProgressVersionPrimary = null;
  hu.length = 0;
}
var bo = rr.ReactCurrentDispatcher, gu = rr.ReactCurrentBatchConfig, rs = 0, $e = null, Qe = null, rt = null, tl = !1, La = !1, ai = 0, Yk = 0;
function pt() {
  throw Error(V(321));
}
function Qd(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++) if (!bn(e[n], t[n])) return !1;
  return !0;
}
function Xd(e, t, n, r, s, a) {
  if (rs = a, $e = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, bo.current = e === null || e.memoizedState === null ? Jk : eN, e = n(r, s), La) {
    a = 0;
    do {
      if (La = !1, ai = 0, 25 <= a) throw Error(V(301));
      a += 1, rt = Qe = null, t.updateQueue = null, bo.current = tN, e = n(r, s);
    } while (La);
  }
  if (bo.current = nl, t = Qe !== null && Qe.next !== null, rs = 0, rt = Qe = $e = null, tl = !1, t) throw Error(V(300));
  return e;
}
function Zd() {
  var e = ai !== 0;
  return ai = 0, e;
}
function An() {
  var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  return rt === null ? $e.memoizedState = rt = e : rt = rt.next = e, rt;
}
function on() {
  if (Qe === null) {
    var e = $e.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = Qe.next;
  var t = rt === null ? $e.memoizedState : rt.next;
  if (t !== null) rt = t, Qe = e;
  else {
    if (e === null) throw Error(V(310));
    Qe = e, e = { memoizedState: Qe.memoizedState, baseState: Qe.baseState, baseQueue: Qe.baseQueue, queue: Qe.queue, next: null }, rt === null ? $e.memoizedState = rt = e : rt = rt.next = e;
  }
  return rt;
}
function ii(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function vu(e) {
  var t = on(), n = t.queue;
  if (n === null) throw Error(V(311));
  n.lastRenderedReducer = e;
  var r = Qe, s = r.baseQueue, a = n.pending;
  if (a !== null) {
    if (s !== null) {
      var o = s.next;
      s.next = a.next, a.next = o;
    }
    r.baseQueue = s = a, n.pending = null;
  }
  if (s !== null) {
    a = s.next, r = r.baseState;
    var u = o = null, c = null, p = a;
    do {
      var h = p.lane;
      if ((rs & h) === h) c !== null && (c = c.next = { lane: 0, action: p.action, hasEagerState: p.hasEagerState, eagerState: p.eagerState, next: null }), r = p.hasEagerState ? p.eagerState : e(r, p.action);
      else {
        var b = {
          lane: h,
          action: p.action,
          hasEagerState: p.hasEagerState,
          eagerState: p.eagerState,
          next: null
        };
        c === null ? (u = c = b, o = r) : c = c.next = b, $e.lanes |= h, ss |= h;
      }
      p = p.next;
    } while (p !== null && p !== a);
    c === null ? o = r : c.next = u, bn(r, t.memoizedState) || (Rt = !0), t.memoizedState = r, t.baseState = o, t.baseQueue = c, n.lastRenderedState = r;
  }
  if (e = n.interleaved, e !== null) {
    s = e;
    do
      a = s.lane, $e.lanes |= a, ss |= a, s = s.next;
    while (s !== e);
  } else s === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function _u(e) {
  var t = on(), n = t.queue;
  if (n === null) throw Error(V(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch, s = n.pending, a = t.memoizedState;
  if (s !== null) {
    n.pending = null;
    var o = s = s.next;
    do
      a = e(a, o.action), o = o.next;
    while (o !== s);
    bn(a, t.memoizedState) || (Rt = !0), t.memoizedState = a, t.baseQueue === null && (t.baseState = a), n.lastRenderedState = a;
  }
  return [a, r];
}
function xv() {
}
function wv(e, t) {
  var n = $e, r = on(), s = t(), a = !bn(r.memoizedState, s);
  if (a && (r.memoizedState = s, Rt = !0), r = r.queue, Jd(kv.bind(null, n, r, e), [e]), r.getSnapshot !== t || a || rt !== null && rt.memoizedState.tag & 1) {
    if (n.flags |= 2048, oi(9, Sv.bind(null, n, r, s, t), void 0, null), st === null) throw Error(V(349));
    rs & 30 || bv(n, t, s);
  }
  return s;
}
function bv(e, t, n) {
  e.flags |= 16384, e = { getSnapshot: t, value: n }, t = $e.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, $e.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
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
    return !bn(e, n);
  } catch {
    return !0;
  }
}
function jv(e) {
  var t = tr(e, 1);
  t !== null && xn(t, e, 1, -1);
}
function Xp(e) {
  var t = An();
  return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: ii, lastRenderedState: e }, t.queue = e, e = e.dispatch = Zk.bind(null, $e, e), [t.memoizedState, e];
}
function oi(e, t, n, r) {
  return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = $e.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, $e.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
}
function Ev() {
  return on().memoizedState;
}
function So(e, t, n, r) {
  var s = An();
  $e.flags |= e, s.memoizedState = oi(1 | t, n, void 0, r === void 0 ? null : r);
}
function xl(e, t, n, r) {
  var s = on();
  r = r === void 0 ? null : r;
  var a = void 0;
  if (Qe !== null) {
    var o = Qe.memoizedState;
    if (a = o.destroy, r !== null && Qd(r, o.deps)) {
      s.memoizedState = oi(t, n, a, r);
      return;
    }
  }
  $e.flags |= e, s.memoizedState = oi(1 | t, n, a, r);
}
function Zp(e, t) {
  return So(8390656, 8, e, t);
}
function Jd(e, t) {
  return xl(2048, 8, e, t);
}
function Cv(e, t) {
  return xl(4, 2, e, t);
}
function Tv(e, t) {
  return xl(4, 4, e, t);
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
  return n = n != null ? n.concat([e]) : null, xl(4, 4, Iv.bind(null, t, e), n);
}
function ef() {
}
function Pv(e, t) {
  var n = on();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Qd(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
}
function Rv(e, t) {
  var n = on();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Qd(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
}
function Mv(e, t, n) {
  return rs & 21 ? (bn(n, t) || (n = Bg(), $e.lanes |= n, ss |= n, e.baseState = !0), t) : (e.baseState && (e.baseState = !1, Rt = !0), e.memoizedState = n);
}
function Qk(e, t) {
  var n = Ee;
  Ee = n !== 0 && 4 > n ? n : 4, e(!0);
  var r = gu.transition;
  gu.transition = {};
  try {
    e(!1), t();
  } finally {
    Ee = n, gu.transition = r;
  }
}
function Dv() {
  return on().memoizedState;
}
function Xk(e, t, n) {
  var r = jr(e);
  if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Ov(e)) Lv(t, n);
  else if (n = vv(e, t, n, r), n !== null) {
    var s = kt();
    xn(n, e, r, s), zv(n, t, r);
  }
}
function Zk(e, t, n) {
  var r = jr(e), s = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (Ov(e)) Lv(t, s);
  else {
    var a = e.alternate;
    if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
      var o = t.lastRenderedState, u = a(o, n);
      if (s.hasEagerState = !0, s.eagerState = u, bn(u, o)) {
        var c = t.interleaved;
        c === null ? (s.next = s, Gd(t)) : (s.next = c.next, c.next = s), t.interleaved = s;
        return;
      }
    } catch {
    } finally {
    }
    n = vv(e, t, s, r), n !== null && (s = kt(), xn(n, e, r, s), zv(n, t, r));
  }
}
function Ov(e) {
  var t = e.alternate;
  return e === $e || t !== null && t === $e;
}
function Lv(e, t) {
  La = tl = !0;
  var n = e.pending;
  n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
}
function zv(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes;
    r &= e.pendingLanes, n |= r, t.lanes = n, Ad(e, n);
  }
}
var nl = { readContext: an, useCallback: pt, useContext: pt, useEffect: pt, useImperativeHandle: pt, useInsertionEffect: pt, useLayoutEffect: pt, useMemo: pt, useReducer: pt, useRef: pt, useState: pt, useDebugValue: pt, useDeferredValue: pt, useTransition: pt, useMutableSource: pt, useSyncExternalStore: pt, useId: pt, unstable_isNewReconciler: !1 }, Jk = { readContext: an, useCallback: function(e, t) {
  return An().memoizedState = [e, t === void 0 ? null : t], e;
}, useContext: an, useEffect: Zp, useImperativeHandle: function(e, t, n) {
  return n = n != null ? n.concat([e]) : null, So(
    4194308,
    4,
    Iv.bind(null, t, e),
    n
  );
}, useLayoutEffect: function(e, t) {
  return So(4194308, 4, e, t);
}, useInsertionEffect: function(e, t) {
  return So(4, 2, e, t);
}, useMemo: function(e, t) {
  var n = An();
  return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
}, useReducer: function(e, t, n) {
  var r = An();
  return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = Xk.bind(null, $e, e), [r.memoizedState, e];
}, useRef: function(e) {
  var t = An();
  return e = { current: e }, t.memoizedState = e;
}, useState: Xp, useDebugValue: ef, useDeferredValue: function(e) {
  return An().memoizedState = e;
}, useTransition: function() {
  var e = Xp(!1), t = e[0];
  return e = Qk.bind(null, e[1]), An().memoizedState = e, [t, e];
}, useMutableSource: function() {
}, useSyncExternalStore: function(e, t, n) {
  var r = $e, s = An();
  if (ze) {
    if (n === void 0) throw Error(V(407));
    n = n();
  } else {
    if (n = t(), st === null) throw Error(V(349));
    rs & 30 || bv(r, t, n);
  }
  s.memoizedState = n;
  var a = { value: n, getSnapshot: t };
  return s.queue = a, Zp(kv.bind(
    null,
    r,
    a,
    e
  ), [e]), r.flags |= 2048, oi(9, Sv.bind(null, r, a, n, t), void 0, null), n;
}, useId: function() {
  var e = An(), t = st.identifierPrefix;
  if (ze) {
    var n = Yn, r = qn;
    n = (r & ~(1 << 32 - yn(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = ai++, 0 < n && (t += "H" + n.toString(32)), t += ":";
  } else n = Yk++, t = ":" + t + "r" + n.toString(32) + ":";
  return e.memoizedState = t;
}, unstable_isNewReconciler: !1 }, eN = {
  readContext: an,
  useCallback: Pv,
  useContext: an,
  useEffect: Jd,
  useImperativeHandle: Av,
  useInsertionEffect: Cv,
  useLayoutEffect: Tv,
  useMemo: Rv,
  useReducer: vu,
  useRef: Ev,
  useState: function() {
    return vu(ii);
  },
  useDebugValue: ef,
  useDeferredValue: function(e) {
    var t = on();
    return Mv(t, Qe.memoizedState, e);
  },
  useTransition: function() {
    var e = vu(ii)[0], t = on().memoizedState;
    return [e, t];
  },
  useMutableSource: xv,
  useSyncExternalStore: wv,
  useId: Dv,
  unstable_isNewReconciler: !1
}, tN = { readContext: an, useCallback: Pv, useContext: an, useEffect: Jd, useImperativeHandle: Av, useInsertionEffect: Cv, useLayoutEffect: Tv, useMemo: Rv, useReducer: _u, useRef: Ev, useState: function() {
  return _u(ii);
}, useDebugValue: ef, useDeferredValue: function(e) {
  var t = on();
  return Qe === null ? t.memoizedState = e : Mv(t, Qe.memoizedState, e);
}, useTransition: function() {
  var e = _u(ii)[0], t = on().memoizedState;
  return [e, t];
}, useMutableSource: xv, useSyncExternalStore: wv, useId: Dv, unstable_isNewReconciler: !1 };
function hn(e, t) {
  if (e && e.defaultProps) {
    t = Fe({}, t), e = e.defaultProps;
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
function Ic(e, t, n, r) {
  t = e.memoizedState, n = n(r, t), n = n == null ? t : Fe({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
}
var wl = { isMounted: function(e) {
  return (e = e._reactInternals) ? ls(e) === e : !1;
}, enqueueSetState: function(e, t, n) {
  e = e._reactInternals;
  var r = kt(), s = jr(e), a = Zn(r, s);
  a.payload = t, n != null && (a.callback = n), t = kr(e, a, s), t !== null && (xn(t, e, s, r), wo(t, e, s));
}, enqueueReplaceState: function(e, t, n) {
  e = e._reactInternals;
  var r = kt(), s = jr(e), a = Zn(r, s);
  a.tag = 1, a.payload = t, n != null && (a.callback = n), t = kr(e, a, s), t !== null && (xn(t, e, s, r), wo(t, e, s));
}, enqueueForceUpdate: function(e, t) {
  e = e._reactInternals;
  var n = kt(), r = jr(e), s = Zn(n, r);
  s.tag = 2, t != null && (s.callback = t), t = kr(e, s, r), t !== null && (xn(t, e, r, n), wo(t, e, r));
} };
function Jp(e, t, n, r, s, a, o) {
  return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Ja(n, r) || !Ja(s, a) : !0;
}
function Bv(e, t, n) {
  var r = !1, s = Ir, a = t.contextType;
  return typeof a == "object" && a !== null ? a = an(a) : (s = Dt(t) ? ts : xt.current, r = t.contextTypes, a = (r = r != null) ? Gs(e, s) : Ir), t = new t(n, a), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = wl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = s, e.__reactInternalMemoizedMaskedChildContext = a), t;
}
function em(e, t, n, r) {
  e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && wl.enqueueReplaceState(t, t.state, null);
}
function Ac(e, t, n, r) {
  var s = e.stateNode;
  s.props = n, s.state = e.memoizedState, s.refs = {}, Vd(e);
  var a = t.contextType;
  typeof a == "object" && a !== null ? s.context = an(a) : (a = Dt(t) ? ts : xt.current, s.context = Gs(e, a)), s.state = e.memoizedState, a = t.getDerivedStateFromProps, typeof a == "function" && (Ic(e, t, a, n), s.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof s.getSnapshotBeforeUpdate == "function" || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (t = s.state, typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount(), t !== s.state && wl.enqueueReplaceState(s, s.state, null), Jo(e, n, s, r), s.state = e.memoizedState), typeof s.componentDidMount == "function" && (e.flags |= 4194308);
}
function Ys(e, t) {
  try {
    var n = "", r = t;
    do
      n += TS(r), r = r.return;
    while (r);
    var s = n;
  } catch (a) {
    s = `
Error generating stack: ` + a.message + `
` + a.stack;
  }
  return { value: e, source: t, stack: s, digest: null };
}
function yu(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function Pc(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function() {
      throw n;
    });
  }
}
var nN = typeof WeakMap == "function" ? WeakMap : Map;
function $v(e, t, n) {
  n = Zn(-1, n), n.tag = 3, n.payload = { element: null };
  var r = t.value;
  return n.callback = function() {
    sl || (sl = !0, Hc = r), Pc(e, t);
  }, n;
}
function Fv(e, t, n) {
  n = Zn(-1, n), n.tag = 3;
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var s = t.value;
    n.payload = function() {
      return r(s);
    }, n.callback = function() {
      Pc(e, t);
    };
  }
  var a = e.stateNode;
  return a !== null && typeof a.componentDidCatch == "function" && (n.callback = function() {
    Pc(e, t), typeof r != "function" && (Nr === null ? Nr = /* @__PURE__ */ new Set([this]) : Nr.add(this));
    var o = t.stack;
    this.componentDidCatch(t.value, { componentStack: o !== null ? o : "" });
  }), n;
}
function tm(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new nN();
    var s = /* @__PURE__ */ new Set();
    r.set(t, s);
  } else s = r.get(t), s === void 0 && (s = /* @__PURE__ */ new Set(), r.set(t, s));
  s.has(n) || (s.add(n), e = gN.bind(null, e, t, n), t.then(e, e));
}
function nm(e) {
  do {
    var t;
    if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function rm(e, t, n, r, s) {
  return e.mode & 1 ? (e.flags |= 65536, e.lanes = s, e) : (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Zn(-1, 1), t.tag = 2, kr(n, t, 1))), n.lanes |= 1), e);
}
var rN = rr.ReactCurrentOwner, Rt = !1;
function St(e, t, n, r) {
  t.child = e === null ? gv(t, null, n, r) : Ks(t, e.child, n, r);
}
function sm(e, t, n, r, s) {
  n = n.render;
  var a = t.ref;
  return Bs(t, s), r = Xd(e, t, n, r, a, s), n = Zd(), e !== null && !Rt ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~s, nr(e, t, s)) : (ze && n && Bd(t), t.flags |= 1, St(e, t, r, s), t.child);
}
function am(e, t, n, r, s) {
  if (e === null) {
    var a = n.type;
    return typeof a == "function" && !uf(a) && a.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = a, Hv(e, t, a, r, s)) : (e = Eo(n.type, null, r, t, t.mode, s), e.ref = t.ref, e.return = t, t.child = e);
  }
  if (a = e.child, !(e.lanes & s)) {
    var o = a.memoizedProps;
    if (n = n.compare, n = n !== null ? n : Ja, n(o, r) && e.ref === t.ref) return nr(e, t, s);
  }
  return t.flags |= 1, e = Er(a, r), e.ref = t.ref, e.return = t, t.child = e;
}
function Hv(e, t, n, r, s) {
  if (e !== null) {
    var a = e.memoizedProps;
    if (Ja(a, r) && e.ref === t.ref) if (Rt = !1, t.pendingProps = r = a, (e.lanes & s) !== 0) e.flags & 131072 && (Rt = !0);
    else return t.lanes = e.lanes, nr(e, t, s);
  }
  return Rc(e, t, n, r, s);
}
function Uv(e, t, n) {
  var r = t.pendingProps, s = r.children, a = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden") if (!(t.mode & 1)) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Ae(Ms, Bt), Bt |= n;
  else {
    if (!(n & 1073741824)) return e = a !== null ? a.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, Ae(Ms, Bt), Bt |= e, null;
    t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = a !== null ? a.baseLanes : n, Ae(Ms, Bt), Bt |= r;
  }
  else a !== null ? (r = a.baseLanes | n, t.memoizedState = null) : r = n, Ae(Ms, Bt), Bt |= r;
  return St(e, t, s, n), t.child;
}
function Wv(e, t) {
  var n = t.ref;
  (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
}
function Rc(e, t, n, r, s) {
  var a = Dt(n) ? ts : xt.current;
  return a = Gs(t, a), Bs(t, s), n = Xd(e, t, n, r, a, s), r = Zd(), e !== null && !Rt ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~s, nr(e, t, s)) : (ze && r && Bd(t), t.flags |= 1, St(e, t, n, s), t.child);
}
function im(e, t, n, r, s) {
  if (Dt(n)) {
    var a = !0;
    qo(t);
  } else a = !1;
  if (Bs(t, s), t.stateNode === null) ko(e, t), Bv(t, n, r), Ac(t, n, r, s), r = !0;
  else if (e === null) {
    var o = t.stateNode, u = t.memoizedProps;
    o.props = u;
    var c = o.context, p = n.contextType;
    typeof p == "object" && p !== null ? p = an(p) : (p = Dt(n) ? ts : xt.current, p = Gs(t, p));
    var h = n.getDerivedStateFromProps, b = typeof h == "function" || typeof o.getSnapshotBeforeUpdate == "function";
    b || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (u !== r || c !== p) && em(t, o, r, p), fr = !1;
    var g = t.memoizedState;
    o.state = g, Jo(t, r, o, s), c = t.memoizedState, u !== r || g !== c || Mt.current || fr ? (typeof h == "function" && (Ic(t, n, h, r), c = t.memoizedState), (u = fr || Jp(t, n, u, r, g, c, p)) ? (b || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = c), o.props = r, o.state = c, o.context = p, r = u) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
  } else {
    o = t.stateNode, _v(e, t), u = t.memoizedProps, p = t.type === t.elementType ? u : hn(t.type, u), o.props = p, b = t.pendingProps, g = o.context, c = n.contextType, typeof c == "object" && c !== null ? c = an(c) : (c = Dt(n) ? ts : xt.current, c = Gs(t, c));
    var w = n.getDerivedStateFromProps;
    (h = typeof w == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (u !== b || g !== c) && em(t, o, r, c), fr = !1, g = t.memoizedState, o.state = g, Jo(t, r, o, s);
    var E = t.memoizedState;
    u !== b || g !== E || Mt.current || fr ? (typeof w == "function" && (Ic(t, n, w, r), E = t.memoizedState), (p = fr || Jp(t, n, p, r, g, E, c) || !1) ? (h || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, E, c), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(r, E, c)), typeof o.componentDidUpdate == "function" && (t.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || u === e.memoizedProps && g === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && g === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = E), o.props = r, o.state = E, o.context = c, r = p) : (typeof o.componentDidUpdate != "function" || u === e.memoizedProps && g === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && g === e.memoizedState || (t.flags |= 1024), r = !1);
  }
  return Mc(e, t, n, r, a, s);
}
function Mc(e, t, n, r, s, a) {
  Wv(e, t);
  var o = (t.flags & 128) !== 0;
  if (!r && !o) return s && Gp(t, n, !1), nr(e, t, a);
  r = t.stateNode, rN.current = t;
  var u = o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return t.flags |= 1, e !== null && o ? (t.child = Ks(t, e.child, null, a), t.child = Ks(t, null, u, a)) : St(e, t, u, a), t.memoizedState = r.state, s && Gp(t, n, !0), t.child;
}
function Gv(e) {
  var t = e.stateNode;
  t.pendingContext ? Wp(e, t.pendingContext, t.pendingContext !== t.context) : t.context && Wp(e, t.context, !1), Kd(e, t.containerInfo);
}
function om(e, t, n, r, s) {
  return Vs(), Fd(s), t.flags |= 256, St(e, t, n, r), t.child;
}
var Dc = { dehydrated: null, treeContext: null, retryLane: 0 };
function Oc(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function Vv(e, t, n) {
  var r = t.pendingProps, s = Be.current, a = !1, o = (t.flags & 128) !== 0, u;
  if ((u = o) || (u = e !== null && e.memoizedState === null ? !1 : (s & 2) !== 0), u ? (a = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (s |= 1), Ae(Be, s & 1), e === null)
    return Cc(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? (t.mode & 1 ? e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824 : t.lanes = 1, null) : (o = r.children, e = r.fallback, a ? (r = t.mode, a = t.child, o = { mode: "hidden", children: o }, !(r & 1) && a !== null ? (a.childLanes = 0, a.pendingProps = o) : a = kl(o, r, 0, null), e = es(e, r, n, null), a.return = t, e.return = t, a.sibling = e, t.child = a, t.child.memoizedState = Oc(n), t.memoizedState = Dc, e) : tf(t, o));
  if (s = e.memoizedState, s !== null && (u = s.dehydrated, u !== null)) return sN(e, t, o, r, u, s, n);
  if (a) {
    a = r.fallback, o = t.mode, s = e.child, u = s.sibling;
    var c = { mode: "hidden", children: r.children };
    return !(o & 1) && t.child !== s ? (r = t.child, r.childLanes = 0, r.pendingProps = c, t.deletions = null) : (r = Er(s, c), r.subtreeFlags = s.subtreeFlags & 14680064), u !== null ? a = Er(u, a) : (a = es(a, o, n, null), a.flags |= 2), a.return = t, r.return = t, r.sibling = a, t.child = r, r = a, a = t.child, o = e.child.memoizedState, o = o === null ? Oc(n) : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }, a.memoizedState = o, a.childLanes = e.childLanes & ~n, t.memoizedState = Dc, r;
  }
  return a = e.child, e = a.sibling, r = Er(a, { mode: "visible", children: r.children }), !(t.mode & 1) && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
}
function tf(e, t) {
  return t = kl({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
}
function no(e, t, n, r) {
  return r !== null && Fd(r), Ks(t, e.child, null, n), e = tf(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
}
function sN(e, t, n, r, s, a, o) {
  if (n)
    return t.flags & 256 ? (t.flags &= -257, r = yu(Error(V(422))), no(e, t, o, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (a = r.fallback, s = t.mode, r = kl({ mode: "visible", children: r.children }, s, 0, null), a = es(a, s, o, null), a.flags |= 2, r.return = t, a.return = t, r.sibling = a, t.child = r, t.mode & 1 && Ks(t, e.child, null, o), t.child.memoizedState = Oc(o), t.memoizedState = Dc, a);
  if (!(t.mode & 1)) return no(e, t, o, null);
  if (s.data === "$!") {
    if (r = s.nextSibling && s.nextSibling.dataset, r) var u = r.dgst;
    return r = u, a = Error(V(419)), r = yu(a, r, void 0), no(e, t, o, r);
  }
  if (u = (o & e.childLanes) !== 0, Rt || u) {
    if (r = st, r !== null) {
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
      s = s & (r.suspendedLanes | o) ? 0 : s, s !== 0 && s !== a.retryLane && (a.retryLane = s, tr(e, s), xn(r, e, s, -1));
    }
    return lf(), r = yu(Error(V(421))), no(e, t, o, r);
  }
  return s.data === "$?" ? (t.flags |= 128, t.child = e.child, t = vN.bind(null, e), s._reactRetry = t, null) : (e = a.treeContext, Ft = Sr(s.nextSibling), Ht = t, ze = !0, vn = null, e !== null && (Zt[Jt++] = qn, Zt[Jt++] = Yn, Zt[Jt++] = ns, qn = e.id, Yn = e.overflow, ns = t), t = tf(t, r.children), t.flags |= 4096, t);
}
function lm(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  r !== null && (r.lanes |= t), Tc(e.return, t, n);
}
function xu(e, t, n, r, s) {
  var a = e.memoizedState;
  a === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: s } : (a.isBackwards = t, a.rendering = null, a.renderingStartTime = 0, a.last = r, a.tail = n, a.tailMode = s);
}
function Kv(e, t, n) {
  var r = t.pendingProps, s = r.revealOrder, a = r.tail;
  if (St(e, t, r.children, n), r = Be.current, r & 2) r = r & 1 | 2, t.flags |= 128;
  else {
    if (e !== null && e.flags & 128) e: for (e = t.child; e !== null; ) {
      if (e.tag === 13) e.memoizedState !== null && lm(e, n, t);
      else if (e.tag === 19) lm(e, n, t);
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
  if (Ae(Be, r), !(t.mode & 1)) t.memoizedState = null;
  else switch (s) {
    case "forwards":
      for (n = t.child, s = null; n !== null; ) e = n.alternate, e !== null && el(e) === null && (s = n), n = n.sibling;
      n = s, n === null ? (s = t.child, t.child = null) : (s = n.sibling, n.sibling = null), xu(t, !1, s, n, a);
      break;
    case "backwards":
      for (n = null, s = t.child, t.child = null; s !== null; ) {
        if (e = s.alternate, e !== null && el(e) === null) {
          t.child = s;
          break;
        }
        e = s.sibling, s.sibling = n, n = s, s = e;
      }
      xu(t, !0, n, null, a);
      break;
    case "together":
      xu(t, !1, null, null, void 0);
      break;
    default:
      t.memoizedState = null;
  }
  return t.child;
}
function ko(e, t) {
  !(t.mode & 1) && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
}
function nr(e, t, n) {
  if (e !== null && (t.dependencies = e.dependencies), ss |= t.lanes, !(n & t.childLanes)) return null;
  if (e !== null && t.child !== e.child) throw Error(V(153));
  if (t.child !== null) {
    for (e = t.child, n = Er(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = Er(e, e.pendingProps), n.return = t;
    n.sibling = null;
  }
  return t.child;
}
function aN(e, t, n) {
  switch (t.tag) {
    case 3:
      Gv(t), Vs();
      break;
    case 5:
      yv(t);
      break;
    case 1:
      Dt(t.type) && qo(t);
      break;
    case 4:
      Kd(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context, s = t.memoizedProps.value;
      Ae(Xo, r._currentValue), r._currentValue = s;
      break;
    case 13:
      if (r = t.memoizedState, r !== null)
        return r.dehydrated !== null ? (Ae(Be, Be.current & 1), t.flags |= 128, null) : n & t.child.childLanes ? Vv(e, t, n) : (Ae(Be, Be.current & 1), e = nr(e, t, n), e !== null ? e.sibling : null);
      Ae(Be, Be.current & 1);
      break;
    case 19:
      if (r = (n & t.childLanes) !== 0, e.flags & 128) {
        if (r) return Kv(e, t, n);
        t.flags |= 128;
      }
      if (s = t.memoizedState, s !== null && (s.rendering = null, s.tail = null, s.lastEffect = null), Ae(Be, Be.current), r) break;
      return null;
    case 22:
    case 23:
      return t.lanes = 0, Uv(e, t, n);
  }
  return nr(e, t, n);
}
var qv, Lc, Yv, Qv;
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
Lc = function() {
};
Yv = function(e, t, n, r) {
  var s = e.memoizedProps;
  if (s !== r) {
    e = t.stateNode, Yr(On.current);
    var a = null;
    switch (n) {
      case "input":
        s = ac(e, s), r = ac(e, r), a = [];
        break;
      case "select":
        s = Fe({}, s, { value: void 0 }), r = Fe({}, r, { value: void 0 }), a = [];
        break;
      case "textarea":
        s = lc(e, s), r = lc(e, r), a = [];
        break;
      default:
        typeof s.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Vo);
    }
    cc(n, r);
    var o;
    n = null;
    for (p in s) if (!r.hasOwnProperty(p) && s.hasOwnProperty(p) && s[p] != null) if (p === "style") {
      var u = s[p];
      for (o in u) u.hasOwnProperty(o) && (n || (n = {}), n[o] = "");
    } else p !== "dangerouslySetInnerHTML" && p !== "children" && p !== "suppressContentEditableWarning" && p !== "suppressHydrationWarning" && p !== "autoFocus" && (Va.hasOwnProperty(p) ? a || (a = []) : (a = a || []).push(p, null));
    for (p in r) {
      var c = r[p];
      if (u = s?.[p], r.hasOwnProperty(p) && c !== u && (c != null || u != null)) if (p === "style") if (u) {
        for (o in u) !u.hasOwnProperty(o) || c && c.hasOwnProperty(o) || (n || (n = {}), n[o] = "");
        for (o in c) c.hasOwnProperty(o) && u[o] !== c[o] && (n || (n = {}), n[o] = c[o]);
      } else n || (a || (a = []), a.push(
        p,
        n
      )), n = c;
      else p === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, u = u ? u.__html : void 0, c != null && u !== c && (a = a || []).push(p, c)) : p === "children" ? typeof c != "string" && typeof c != "number" || (a = a || []).push(p, "" + c) : p !== "suppressContentEditableWarning" && p !== "suppressHydrationWarning" && (Va.hasOwnProperty(p) ? (c != null && p === "onScroll" && Pe("scroll", e), a || u === c || (a = [])) : (a = a || []).push(p, c));
    }
    n && (a = a || []).push("style", n);
    var p = a;
    (t.updateQueue = p) && (t.flags |= 4);
  }
};
Qv = function(e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function xa(e, t) {
  if (!ze) switch (e.tailMode) {
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
function mt(e) {
  var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
  if (t) for (var s = e.child; s !== null; ) n |= s.lanes | s.childLanes, r |= s.subtreeFlags & 14680064, r |= s.flags & 14680064, s.return = e, s = s.sibling;
  else for (s = e.child; s !== null; ) n |= s.lanes | s.childLanes, r |= s.subtreeFlags, r |= s.flags, s.return = e, s = s.sibling;
  return e.subtreeFlags |= r, e.childLanes = n, t;
}
function iN(e, t, n) {
  var r = t.pendingProps;
  switch ($d(t), t.tag) {
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
      return mt(t), null;
    case 1:
      return Dt(t.type) && Ko(), mt(t), null;
    case 3:
      return r = t.stateNode, qs(), De(Mt), De(xt), Yd(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (eo(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, vn !== null && (Gc(vn), vn = null))), Lc(e, t), mt(t), null;
    case 5:
      qd(t);
      var s = Yr(si.current);
      if (n = t.type, e !== null && t.stateNode != null) Yv(e, t, n, r, s), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(V(166));
          return mt(t), null;
        }
        if (e = Yr(On.current), eo(t)) {
          r = t.stateNode, n = t.type;
          var a = t.memoizedProps;
          switch (r[Rn] = t, r[ni] = a, e = (t.mode & 1) !== 0, n) {
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
              for (s = 0; s < ja.length; s++) Pe(ja[s], r);
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
              vp(r, a), Pe("invalid", r);
              break;
            case "select":
              r._wrapperState = { wasMultiple: !!a.multiple }, Pe("invalid", r);
              break;
            case "textarea":
              yp(r, a), Pe("invalid", r);
          }
          cc(n, a), s = null;
          for (var o in a) if (a.hasOwnProperty(o)) {
            var u = a[o];
            o === "children" ? typeof u == "string" ? r.textContent !== u && (a.suppressHydrationWarning !== !0 && Ji(r.textContent, u, e), s = ["children", u]) : typeof u == "number" && r.textContent !== "" + u && (a.suppressHydrationWarning !== !0 && Ji(
              r.textContent,
              u,
              e
            ), s = ["children", "" + u]) : Va.hasOwnProperty(o) && u != null && o === "onScroll" && Pe("scroll", r);
          }
          switch (n) {
            case "input":
              Gi(r), _p(r, a, !0);
              break;
            case "textarea":
              Gi(r), xp(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof a.onClick == "function" && (r.onclick = Vo);
          }
          r = s, t.updateQueue = r, r !== null && (t.flags |= 4);
        } else {
          o = s.nodeType === 9 ? s : s.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = kg(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = o.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = o.createElement(n, { is: r.is }) : (e = o.createElement(n), n === "select" && (o = e, r.multiple ? o.multiple = !0 : r.size && (o.size = r.size))) : e = o.createElementNS(e, n), e[Rn] = t, e[ni] = r, qv(e, t, !1, !1), t.stateNode = e;
          e: {
            switch (o = dc(n, r), n) {
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
                for (s = 0; s < ja.length; s++) Pe(ja[s], e);
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
                vp(e, r), s = ac(e, r), Pe("invalid", e);
                break;
              case "option":
                s = r;
                break;
              case "select":
                e._wrapperState = { wasMultiple: !!r.multiple }, s = Fe({}, r, { value: void 0 }), Pe("invalid", e);
                break;
              case "textarea":
                yp(e, r), s = lc(e, r), Pe("invalid", e);
                break;
              default:
                s = r;
            }
            cc(n, s), u = s;
            for (a in u) if (u.hasOwnProperty(a)) {
              var c = u[a];
              a === "style" ? Eg(e, c) : a === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, c != null && Ng(e, c)) : a === "children" ? typeof c == "string" ? (n !== "textarea" || c !== "") && Ka(e, c) : typeof c == "number" && Ka(e, "" + c) : a !== "suppressContentEditableWarning" && a !== "suppressHydrationWarning" && a !== "autoFocus" && (Va.hasOwnProperty(a) ? c != null && a === "onScroll" && Pe("scroll", e) : c != null && Nd(e, a, c, o));
            }
            switch (n) {
              case "input":
                Gi(e), _p(e, r, !1);
                break;
              case "textarea":
                Gi(e), xp(e);
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + Tr(r.value));
                break;
              case "select":
                e.multiple = !!r.multiple, a = r.value, a != null ? Ds(e, !!r.multiple, a, !1) : r.defaultValue != null && Ds(
                  e,
                  !!r.multiple,
                  r.defaultValue,
                  !0
                );
                break;
              default:
                typeof s.onClick == "function" && (e.onclick = Vo);
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
      return mt(t), null;
    case 6:
      if (e && t.stateNode != null) Qv(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(V(166));
        if (n = Yr(si.current), Yr(On.current), eo(t)) {
          if (r = t.stateNode, n = t.memoizedProps, r[Rn] = t, (a = r.nodeValue !== n) && (e = Ht, e !== null)) switch (e.tag) {
            case 3:
              Ji(r.nodeValue, n, (e.mode & 1) !== 0);
              break;
            case 5:
              e.memoizedProps.suppressHydrationWarning !== !0 && Ji(r.nodeValue, n, (e.mode & 1) !== 0);
          }
          a && (t.flags |= 4);
        } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[Rn] = t, t.stateNode = r;
      }
      return mt(t), null;
    case 13:
      if (De(Be), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
        if (ze && Ft !== null && t.mode & 1 && !(t.flags & 128)) mv(), Vs(), t.flags |= 98560, a = !1;
        else if (a = eo(t), r !== null && r.dehydrated !== null) {
          if (e === null) {
            if (!a) throw Error(V(318));
            if (a = t.memoizedState, a = a !== null ? a.dehydrated : null, !a) throw Error(V(317));
            a[Rn] = t;
          } else Vs(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
          mt(t), a = !1;
        } else vn !== null && (Gc(vn), vn = null), a = !0;
        if (!a) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, t.mode & 1 && (e === null || Be.current & 1 ? Ze === 0 && (Ze = 3) : lf())), t.updateQueue !== null && (t.flags |= 4), mt(t), null);
    case 4:
      return qs(), Lc(e, t), e === null && ei(t.stateNode.containerInfo), mt(t), null;
    case 10:
      return Wd(t.type._context), mt(t), null;
    case 17:
      return Dt(t.type) && Ko(), mt(t), null;
    case 19:
      if (De(Be), a = t.memoizedState, a === null) return mt(t), null;
      if (r = (t.flags & 128) !== 0, o = a.rendering, o === null) if (r) xa(a, !1);
      else {
        if (Ze !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null; ) {
          if (o = el(e), o !== null) {
            for (t.flags |= 128, xa(a, !1), r = o.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) a = n, e = r, a.flags &= 14680066, o = a.alternate, o === null ? (a.childLanes = 0, a.lanes = e, a.child = null, a.subtreeFlags = 0, a.memoizedProps = null, a.memoizedState = null, a.updateQueue = null, a.dependencies = null, a.stateNode = null) : (a.childLanes = o.childLanes, a.lanes = o.lanes, a.child = o.child, a.subtreeFlags = 0, a.deletions = null, a.memoizedProps = o.memoizedProps, a.memoizedState = o.memoizedState, a.updateQueue = o.updateQueue, a.type = o.type, e = o.dependencies, a.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
            return Ae(Be, Be.current & 1 | 2), t.child;
          }
          e = e.sibling;
        }
        a.tail !== null && Ge() > Qs && (t.flags |= 128, r = !0, xa(a, !1), t.lanes = 4194304);
      }
      else {
        if (!r) if (e = el(o), e !== null) {
          if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), xa(a, !0), a.tail === null && a.tailMode === "hidden" && !o.alternate && !ze) return mt(t), null;
        } else 2 * Ge() - a.renderingStartTime > Qs && n !== 1073741824 && (t.flags |= 128, r = !0, xa(a, !1), t.lanes = 4194304);
        a.isBackwards ? (o.sibling = t.child, t.child = o) : (n = a.last, n !== null ? n.sibling = o : t.child = o, a.last = o);
      }
      return a.tail !== null ? (t = a.tail, a.rendering = t, a.tail = t.sibling, a.renderingStartTime = Ge(), t.sibling = null, n = Be.current, Ae(Be, r ? n & 1 | 2 : n & 1), t) : (mt(t), null);
    case 22:
    case 23:
      return of(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && t.mode & 1 ? Bt & 1073741824 && (mt(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : mt(t), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(V(156, t.tag));
}
function oN(e, t) {
  switch ($d(t), t.tag) {
    case 1:
      return Dt(t.type) && Ko(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
    case 3:
      return qs(), De(Mt), De(xt), Yd(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
    case 5:
      return qd(t), null;
    case 13:
      if (De(Be), e = t.memoizedState, e !== null && e.dehydrated !== null) {
        if (t.alternate === null) throw Error(V(340));
        Vs();
      }
      return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
    case 19:
      return De(Be), null;
    case 4:
      return qs(), null;
    case 10:
      return Wd(t.type._context), null;
    case 22:
    case 23:
      return of(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var ro = !1, vt = !1, lN = typeof WeakSet == "function" ? WeakSet : Set, X = null;
function Rs(e, t) {
  var n = e.ref;
  if (n !== null) if (typeof n == "function") try {
    n(null);
  } catch (r) {
    We(e, t, r);
  }
  else n.current = null;
}
function zc(e, t, n) {
  try {
    n();
  } catch (r) {
    We(e, t, r);
  }
}
var um = !1;
function uN(e, t) {
  if (wc = Uo, e = tv(), zd(e)) {
    if ("selectionStart" in e) var n = { start: e.selectionStart, end: e.selectionEnd };
    else e: {
      n = (n = e.ownerDocument) && n.defaultView || window;
      var r = n.getSelection && n.getSelection();
      if (r && r.rangeCount !== 0) {
        n = r.anchorNode;
        var s = r.anchorOffset, a = r.focusNode;
        r = r.focusOffset;
        try {
          n.nodeType, a.nodeType;
        } catch {
          n = null;
          break e;
        }
        var o = 0, u = -1, c = -1, p = 0, h = 0, b = e, g = null;
        t: for (; ; ) {
          for (var w; b !== n || s !== 0 && b.nodeType !== 3 || (u = o + s), b !== a || r !== 0 && b.nodeType !== 3 || (c = o + r), b.nodeType === 3 && (o += b.nodeValue.length), (w = b.firstChild) !== null; )
            g = b, b = w;
          for (; ; ) {
            if (b === e) break t;
            if (g === n && ++p === s && (u = o), g === a && ++h === r && (c = o), (w = b.nextSibling) !== null) break;
            b = g, g = b.parentNode;
          }
          b = w;
        }
        n = u === -1 || c === -1 ? null : { start: u, end: c };
      } else n = null;
    }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (bc = { focusedElem: e, selectionRange: n }, Uo = !1, X = t; X !== null; ) if (t = X, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, X = e;
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
            var A = E.memoizedProps, D = E.memoizedState, _ = t.stateNode, x = _.getSnapshotBeforeUpdate(t.elementType === t.type ? A : hn(t.type, A), D);
            _.__reactInternalSnapshotBeforeUpdate = x;
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
          throw Error(V(163));
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
function za(e, t, n) {
  var r = t.updateQueue;
  if (r = r !== null ? r.lastEffect : null, r !== null) {
    var s = r = r.next;
    do {
      if ((s.tag & e) === e) {
        var a = s.destroy;
        s.destroy = void 0, a !== void 0 && zc(t, n, a);
      }
      s = s.next;
    } while (s !== r);
  }
}
function bl(e, t) {
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
function Bc(e) {
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
  t !== null && (e.alternate = null, Xv(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[Rn], delete t[ni], delete t[Nc], delete t[Gk], delete t[Vk])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
}
function Zv(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function cm(e) {
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
function $c(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Vo));
  else if (r !== 4 && (e = e.child, e !== null)) for ($c(e, t, n), e = e.sibling; e !== null; ) $c(e, t, n), e = e.sibling;
}
function Fc(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
  else if (r !== 4 && (e = e.child, e !== null)) for (Fc(e, t, n), e = e.sibling; e !== null; ) Fc(e, t, n), e = e.sibling;
}
var ot = null, gn = !1;
function cr(e, t, n) {
  for (n = n.child; n !== null; ) Jv(e, t, n), n = n.sibling;
}
function Jv(e, t, n) {
  if (Dn && typeof Dn.onCommitFiberUnmount == "function") try {
    Dn.onCommitFiberUnmount(ml, n);
  } catch {
  }
  switch (n.tag) {
    case 5:
      vt || Rs(n, t);
    case 6:
      var r = ot, s = gn;
      ot = null, cr(e, t, n), ot = r, gn = s, ot !== null && (gn ? (e = ot, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : ot.removeChild(n.stateNode));
      break;
    case 18:
      ot !== null && (gn ? (e = ot, n = n.stateNode, e.nodeType === 8 ? pu(e.parentNode, n) : e.nodeType === 1 && pu(e, n), Xa(e)) : pu(ot, n.stateNode));
      break;
    case 4:
      r = ot, s = gn, ot = n.stateNode.containerInfo, gn = !0, cr(e, t, n), ot = r, gn = s;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!vt && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
        s = r = r.next;
        do {
          var a = s, o = a.destroy;
          a = a.tag, o !== void 0 && (a & 2 || a & 4) && zc(n, t, o), s = s.next;
        } while (s !== r);
      }
      cr(e, t, n);
      break;
    case 1:
      if (!vt && (Rs(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
        r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
      } catch (u) {
        We(n, t, u);
      }
      cr(e, t, n);
      break;
    case 21:
      cr(e, t, n);
      break;
    case 22:
      n.mode & 1 ? (vt = (r = vt) || n.memoizedState !== null, cr(e, t, n), vt = r) : cr(e, t, n);
      break;
    default:
      cr(e, t, n);
  }
}
function dm(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    n === null && (n = e.stateNode = new lN()), t.forEach(function(r) {
      var s = _N.bind(null, e, r);
      n.has(r) || (n.add(r), r.then(s, s));
    });
  }
}
function mn(e, t) {
  var n = t.deletions;
  if (n !== null) for (var r = 0; r < n.length; r++) {
    var s = n[r];
    try {
      var a = e, o = t, u = o;
      e: for (; u !== null; ) {
        switch (u.tag) {
          case 5:
            ot = u.stateNode, gn = !1;
            break e;
          case 3:
            ot = u.stateNode.containerInfo, gn = !0;
            break e;
          case 4:
            ot = u.stateNode.containerInfo, gn = !0;
            break e;
        }
        u = u.return;
      }
      if (ot === null) throw Error(V(160));
      Jv(a, o, s), ot = null, gn = !1;
      var c = s.alternate;
      c !== null && (c.return = null), s.return = null;
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
      if (mn(t, e), Tn(e), r & 4) {
        try {
          za(3, e, e.return), bl(3, e);
        } catch (A) {
          We(e, e.return, A);
        }
        try {
          za(5, e, e.return);
        } catch (A) {
          We(e, e.return, A);
        }
      }
      break;
    case 1:
      mn(t, e), Tn(e), r & 512 && n !== null && Rs(n, n.return);
      break;
    case 5:
      if (mn(t, e), Tn(e), r & 512 && n !== null && Rs(n, n.return), e.flags & 32) {
        var s = e.stateNode;
        try {
          Ka(s, "");
        } catch (A) {
          We(e, e.return, A);
        }
      }
      if (r & 4 && (s = e.stateNode, s != null)) {
        var a = e.memoizedProps, o = n !== null ? n.memoizedProps : a, u = e.type, c = e.updateQueue;
        if (e.updateQueue = null, c !== null) try {
          u === "input" && a.type === "radio" && a.name != null && bg(s, a), dc(u, o);
          var p = dc(u, a);
          for (o = 0; o < c.length; o += 2) {
            var h = c[o], b = c[o + 1];
            h === "style" ? Eg(s, b) : h === "dangerouslySetInnerHTML" ? Ng(s, b) : h === "children" ? Ka(s, b) : Nd(s, h, b, p);
          }
          switch (u) {
            case "input":
              ic(s, a);
              break;
            case "textarea":
              Sg(s, a);
              break;
            case "select":
              var g = s._wrapperState.wasMultiple;
              s._wrapperState.wasMultiple = !!a.multiple;
              var w = a.value;
              w != null ? Ds(s, !!a.multiple, w, !1) : g !== !!a.multiple && (a.defaultValue != null ? Ds(
                s,
                !!a.multiple,
                a.defaultValue,
                !0
              ) : Ds(s, !!a.multiple, a.multiple ? [] : "", !1));
          }
          s[ni] = a;
        } catch (A) {
          We(e, e.return, A);
        }
      }
      break;
    case 6:
      if (mn(t, e), Tn(e), r & 4) {
        if (e.stateNode === null) throw Error(V(162));
        s = e.stateNode, a = e.memoizedProps;
        try {
          s.nodeValue = a;
        } catch (A) {
          We(e, e.return, A);
        }
      }
      break;
    case 3:
      if (mn(t, e), Tn(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
        Xa(t.containerInfo);
      } catch (A) {
        We(e, e.return, A);
      }
      break;
    case 4:
      mn(t, e), Tn(e);
      break;
    case 13:
      mn(t, e), Tn(e), s = e.child, s.flags & 8192 && (a = s.memoizedState !== null, s.stateNode.isHidden = a, !a || s.alternate !== null && s.alternate.memoizedState !== null || (sf = Ge())), r & 4 && dm(e);
      break;
    case 22:
      if (h = n !== null && n.memoizedState !== null, e.mode & 1 ? (vt = (p = vt) || h, mn(t, e), vt = p) : mn(t, e), Tn(e), r & 8192) {
        if (p = e.memoizedState !== null, (e.stateNode.isHidden = p) && !h && e.mode & 1) for (X = e, h = e.child; h !== null; ) {
          for (b = X = h; X !== null; ) {
            switch (g = X, w = g.child, g.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                za(4, g, g.return);
                break;
              case 1:
                Rs(g, g.return);
                var E = g.stateNode;
                if (typeof E.componentWillUnmount == "function") {
                  r = g, n = g.return;
                  try {
                    t = r, E.props = t.memoizedProps, E.state = t.memoizedState, E.componentWillUnmount();
                  } catch (A) {
                    We(r, n, A);
                  }
                }
                break;
              case 5:
                Rs(g, g.return);
                break;
              case 22:
                if (g.memoizedState !== null) {
                  pm(b);
                  continue;
                }
            }
            w !== null ? (w.return = g, X = w) : pm(b);
          }
          h = h.sibling;
        }
        e: for (h = null, b = e; ; ) {
          if (b.tag === 5) {
            if (h === null) {
              h = b;
              try {
                s = b.stateNode, p ? (a = s.style, typeof a.setProperty == "function" ? a.setProperty("display", "none", "important") : a.display = "none") : (u = b.stateNode, c = b.memoizedProps.style, o = c != null && c.hasOwnProperty("display") ? c.display : null, u.style.display = jg("display", o));
              } catch (A) {
                We(e, e.return, A);
              }
            }
          } else if (b.tag === 6) {
            if (h === null) try {
              b.stateNode.nodeValue = p ? "" : b.memoizedProps;
            } catch (A) {
              We(e, e.return, A);
            }
          } else if ((b.tag !== 22 && b.tag !== 23 || b.memoizedState === null || b === e) && b.child !== null) {
            b.child.return = b, b = b.child;
            continue;
          }
          if (b === e) break e;
          for (; b.sibling === null; ) {
            if (b.return === null || b.return === e) break e;
            h === b && (h = null), b = b.return;
          }
          h === b && (h = null), b.sibling.return = b.return, b = b.sibling;
        }
      }
      break;
    case 19:
      mn(t, e), Tn(e), r & 4 && dm(e);
      break;
    case 21:
      break;
    default:
      mn(
        t,
        e
      ), Tn(e);
  }
}
function Tn(e) {
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
        throw Error(V(160));
      }
      switch (r.tag) {
        case 5:
          var s = r.stateNode;
          r.flags & 32 && (Ka(s, ""), r.flags &= -33);
          var a = cm(e);
          Fc(e, a, s);
          break;
        case 3:
        case 4:
          var o = r.stateNode.containerInfo, u = cm(e);
          $c(e, u, o);
          break;
        default:
          throw Error(V(161));
      }
    } catch (c) {
      We(e, e.return, c);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function cN(e, t, n) {
  X = e, t_(e);
}
function t_(e, t, n) {
  for (var r = (e.mode & 1) !== 0; X !== null; ) {
    var s = X, a = s.child;
    if (s.tag === 22 && r) {
      var o = s.memoizedState !== null || ro;
      if (!o) {
        var u = s.alternate, c = u !== null && u.memoizedState !== null || vt;
        u = ro;
        var p = vt;
        if (ro = o, (vt = c) && !p) for (X = s; X !== null; ) o = X, c = o.child, o.tag === 22 && o.memoizedState !== null ? mm(s) : c !== null ? (c.return = o, X = c) : mm(s);
        for (; a !== null; ) X = a, t_(a), a = a.sibling;
        X = s, ro = u, vt = p;
      }
      fm(e);
    } else s.subtreeFlags & 8772 && a !== null ? (a.return = s, X = a) : fm(e);
  }
}
function fm(e) {
  for (; X !== null; ) {
    var t = X;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            vt || bl(5, t);
            break;
          case 1:
            var r = t.stateNode;
            if (t.flags & 4 && !vt) if (n === null) r.componentDidMount();
            else {
              var s = t.elementType === t.type ? n.memoizedProps : hn(t.type, n.memoizedProps);
              r.componentDidUpdate(s, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
            }
            var a = t.updateQueue;
            a !== null && Qp(t, a, r);
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
              Qp(t, o, n);
            }
            break;
          case 5:
            var u = t.stateNode;
            if (n === null && t.flags & 4) {
              n = u;
              var c = t.memoizedProps;
              switch (t.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  c.autoFocus && n.focus();
                  break;
                case "img":
                  c.src && (n.src = c.src);
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
                  var b = h.dehydrated;
                  b !== null && Xa(b);
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
            throw Error(V(163));
        }
        vt || t.flags & 512 && Bc(t);
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
function pm(e) {
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
function mm(e) {
  for (; X !== null; ) {
    var t = X;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            bl(4, t);
          } catch (c) {
            We(t, n, c);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var s = t.return;
            try {
              r.componentDidMount();
            } catch (c) {
              We(t, s, c);
            }
          }
          var a = t.return;
          try {
            Bc(t);
          } catch (c) {
            We(t, a, c);
          }
          break;
        case 5:
          var o = t.return;
          try {
            Bc(t);
          } catch (c) {
            We(t, o, c);
          }
      }
    } catch (c) {
      We(t, t.return, c);
    }
    if (t === e) {
      X = null;
      break;
    }
    var u = t.sibling;
    if (u !== null) {
      u.return = t.return, X = u;
      break;
    }
    X = t.return;
  }
}
var dN = Math.ceil, rl = rr.ReactCurrentDispatcher, nf = rr.ReactCurrentOwner, sn = rr.ReactCurrentBatchConfig, Se = 0, st = null, Ke = null, ut = 0, Bt = 0, Ms = Rr(0), Ze = 0, li = null, ss = 0, Sl = 0, rf = 0, Ba = null, Pt = null, sf = 0, Qs = 1 / 0, Gn = null, sl = !1, Hc = null, Nr = null, so = !1, _r = null, al = 0, $a = 0, Uc = null, No = -1, jo = 0;
function kt() {
  return Se & 6 ? Ge() : No !== -1 ? No : No = Ge();
}
function jr(e) {
  return e.mode & 1 ? Se & 2 && ut !== 0 ? ut & -ut : qk.transition !== null ? (jo === 0 && (jo = Bg()), jo) : (e = Ee, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Vg(e.type)), e) : 1;
}
function xn(e, t, n, r) {
  if (50 < $a) throw $a = 0, Uc = null, Error(V(185));
  yi(e, n, r), (!(Se & 2) || e !== st) && (e === st && (!(Se & 2) && (Sl |= n), Ze === 4 && hr(e, ut)), Ot(e, r), n === 1 && Se === 0 && !(t.mode & 1) && (Qs = Ge() + 500, yl && Mr()));
}
function Ot(e, t) {
  var n = e.callbackNode;
  qS(e, t);
  var r = Ho(e, e === st ? ut : 0);
  if (r === 0) n !== null && Sp(n), e.callbackNode = null, e.callbackPriority = 0;
  else if (t = r & -r, e.callbackPriority !== t) {
    if (n != null && Sp(n), t === 1) e.tag === 0 ? Kk(hm.bind(null, e)) : dv(hm.bind(null, e)), Uk(function() {
      !(Se & 6) && Mr();
    }), n = null;
    else {
      switch ($g(r)) {
        case 1:
          n = Id;
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
      n = u_(n, n_.bind(null, e));
    }
    e.callbackPriority = t, e.callbackNode = n;
  }
}
function n_(e, t) {
  if (No = -1, jo = 0, Se & 6) throw Error(V(327));
  var n = e.callbackNode;
  if ($s() && e.callbackNode !== n) return null;
  var r = Ho(e, e === st ? ut : 0);
  if (r === 0) return null;
  if (r & 30 || r & e.expiredLanes || t) t = il(e, r);
  else {
    t = r;
    var s = Se;
    Se |= 2;
    var a = s_();
    (st !== e || ut !== t) && (Gn = null, Qs = Ge() + 500, Jr(e, t));
    do
      try {
        mN();
        break;
      } catch (u) {
        r_(e, u);
      }
    while (!0);
    Ud(), rl.current = a, Se = s, Ke !== null ? t = 0 : (st = null, ut = 0, t = Ze);
  }
  if (t !== 0) {
    if (t === 2 && (s = gc(e), s !== 0 && (r = s, t = Wc(e, s))), t === 1) throw n = li, Jr(e, 0), hr(e, r), Ot(e, Ge()), n;
    if (t === 6) hr(e, r);
    else {
      if (s = e.current.alternate, !(r & 30) && !fN(s) && (t = il(e, r), t === 2 && (a = gc(e), a !== 0 && (r = a, t = Wc(e, a))), t === 1)) throw n = li, Jr(e, 0), hr(e, r), Ot(e, Ge()), n;
      switch (e.finishedWork = s, e.finishedLanes = r, t) {
        case 0:
        case 1:
          throw Error(V(345));
        case 2:
          Gr(e, Pt, Gn);
          break;
        case 3:
          if (hr(e, r), (r & 130023424) === r && (t = sf + 500 - Ge(), 10 < t)) {
            if (Ho(e, 0) !== 0) break;
            if (s = e.suspendedLanes, (s & r) !== r) {
              kt(), e.pingedLanes |= e.suspendedLanes & s;
              break;
            }
            e.timeoutHandle = kc(Gr.bind(null, e, Pt, Gn), t);
            break;
          }
          Gr(e, Pt, Gn);
          break;
        case 4:
          if (hr(e, r), (r & 4194240) === r) break;
          for (t = e.eventTimes, s = -1; 0 < r; ) {
            var o = 31 - yn(r);
            a = 1 << o, o = t[o], o > s && (s = o), r &= ~a;
          }
          if (r = s, r = Ge() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * dN(r / 1960)) - r, 10 < r) {
            e.timeoutHandle = kc(Gr.bind(null, e, Pt, Gn), r);
            break;
          }
          Gr(e, Pt, Gn);
          break;
        case 5:
          Gr(e, Pt, Gn);
          break;
        default:
          throw Error(V(329));
      }
    }
  }
  return Ot(e, Ge()), e.callbackNode === n ? n_.bind(null, e) : null;
}
function Wc(e, t) {
  var n = Ba;
  return e.current.memoizedState.isDehydrated && (Jr(e, t).flags |= 256), e = il(e, t), e !== 2 && (t = Pt, Pt = n, t !== null && Gc(t)), e;
}
function Gc(e) {
  Pt === null ? Pt = e : Pt.push.apply(Pt, e);
}
function fN(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
        var s = n[r], a = s.getSnapshot;
        s = s.value;
        try {
          if (!bn(a(), s)) return !1;
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
function hr(e, t) {
  for (t &= ~rf, t &= ~Sl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
    var n = 31 - yn(t), r = 1 << n;
    e[n] = -1, t &= ~r;
  }
}
function hm(e) {
  if (Se & 6) throw Error(V(327));
  $s();
  var t = Ho(e, 0);
  if (!(t & 1)) return Ot(e, Ge()), null;
  var n = il(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = gc(e);
    r !== 0 && (t = r, n = Wc(e, r));
  }
  if (n === 1) throw n = li, Jr(e, 0), hr(e, t), Ot(e, Ge()), n;
  if (n === 6) throw Error(V(345));
  return e.finishedWork = e.current.alternate, e.finishedLanes = t, Gr(e, Pt, Gn), Ot(e, Ge()), null;
}
function af(e, t) {
  var n = Se;
  Se |= 1;
  try {
    return e(t);
  } finally {
    Se = n, Se === 0 && (Qs = Ge() + 500, yl && Mr());
  }
}
function as(e) {
  _r !== null && _r.tag === 0 && !(Se & 6) && $s();
  var t = Se;
  Se |= 1;
  var n = sn.transition, r = Ee;
  try {
    if (sn.transition = null, Ee = 1, e) return e();
  } finally {
    Ee = r, sn.transition = n, Se = t, !(Se & 6) && Mr();
  }
}
function of() {
  Bt = Ms.current, De(Ms);
}
function Jr(e, t) {
  e.finishedWork = null, e.finishedLanes = 0;
  var n = e.timeoutHandle;
  if (n !== -1 && (e.timeoutHandle = -1, Hk(n)), Ke !== null) for (n = Ke.return; n !== null; ) {
    var r = n;
    switch ($d(r), r.tag) {
      case 1:
        r = r.type.childContextTypes, r != null && Ko();
        break;
      case 3:
        qs(), De(Mt), De(xt), Yd();
        break;
      case 5:
        qd(r);
        break;
      case 4:
        qs();
        break;
      case 13:
        De(Be);
        break;
      case 19:
        De(Be);
        break;
      case 10:
        Wd(r.type._context);
        break;
      case 22:
      case 23:
        of();
    }
    n = n.return;
  }
  if (st = e, Ke = e = Er(e.current, null), ut = Bt = t, Ze = 0, li = null, rf = Sl = ss = 0, Pt = Ba = null, qr !== null) {
    for (t = 0; t < qr.length; t++) if (n = qr[t], r = n.interleaved, r !== null) {
      n.interleaved = null;
      var s = r.next, a = n.pending;
      if (a !== null) {
        var o = a.next;
        a.next = s, r.next = o;
      }
      n.pending = r;
    }
    qr = null;
  }
  return e;
}
function r_(e, t) {
  do {
    var n = Ke;
    try {
      if (Ud(), bo.current = nl, tl) {
        for (var r = $e.memoizedState; r !== null; ) {
          var s = r.queue;
          s !== null && (s.pending = null), r = r.next;
        }
        tl = !1;
      }
      if (rs = 0, rt = Qe = $e = null, La = !1, ai = 0, nf.current = null, n === null || n.return === null) {
        Ze = 1, li = t, Ke = null;
        break;
      }
      e: {
        var a = e, o = n.return, u = n, c = t;
        if (t = ut, u.flags |= 32768, c !== null && typeof c == "object" && typeof c.then == "function") {
          var p = c, h = u, b = h.tag;
          if (!(h.mode & 1) && (b === 0 || b === 11 || b === 15)) {
            var g = h.alternate;
            g ? (h.updateQueue = g.updateQueue, h.memoizedState = g.memoizedState, h.lanes = g.lanes) : (h.updateQueue = null, h.memoizedState = null);
          }
          var w = nm(o);
          if (w !== null) {
            w.flags &= -257, rm(w, o, u, a, t), w.mode & 1 && tm(a, p, t), t = w, c = p;
            var E = t.updateQueue;
            if (E === null) {
              var A = /* @__PURE__ */ new Set();
              A.add(c), t.updateQueue = A;
            } else E.add(c);
            break e;
          } else {
            if (!(t & 1)) {
              tm(a, p, t), lf();
              break e;
            }
            c = Error(V(426));
          }
        } else if (ze && u.mode & 1) {
          var D = nm(o);
          if (D !== null) {
            !(D.flags & 65536) && (D.flags |= 256), rm(D, o, u, a, t), Fd(Ys(c, u));
            break e;
          }
        }
        a = c = Ys(c, u), Ze !== 4 && (Ze = 2), Ba === null ? Ba = [a] : Ba.push(a), a = o;
        do {
          switch (a.tag) {
            case 3:
              a.flags |= 65536, t &= -t, a.lanes |= t;
              var _ = $v(a, c, t);
              Yp(a, _);
              break e;
            case 1:
              u = c;
              var x = a.type, N = a.stateNode;
              if (!(a.flags & 128) && (typeof x.getDerivedStateFromError == "function" || N !== null && typeof N.componentDidCatch == "function" && (Nr === null || !Nr.has(N)))) {
                a.flags |= 65536, t &= -t, a.lanes |= t;
                var l = Fv(a, u, t);
                Yp(a, l);
                break e;
              }
          }
          a = a.return;
        } while (a !== null);
      }
      i_(n);
    } catch (f) {
      t = f, Ke === n && n !== null && (Ke = n = n.return);
      continue;
    }
    break;
  } while (!0);
}
function s_() {
  var e = rl.current;
  return rl.current = nl, e === null ? nl : e;
}
function lf() {
  (Ze === 0 || Ze === 3 || Ze === 2) && (Ze = 4), st === null || !(ss & 268435455) && !(Sl & 268435455) || hr(st, ut);
}
function il(e, t) {
  var n = Se;
  Se |= 2;
  var r = s_();
  (st !== e || ut !== t) && (Gn = null, Jr(e, t));
  do
    try {
      pN();
      break;
    } catch (s) {
      r_(e, s);
    }
  while (!0);
  if (Ud(), Se = n, rl.current = r, Ke !== null) throw Error(V(261));
  return st = null, ut = 0, Ze;
}
function pN() {
  for (; Ke !== null; ) a_(Ke);
}
function mN() {
  for (; Ke !== null && !BS(); ) a_(Ke);
}
function a_(e) {
  var t = l_(e.alternate, e, Bt);
  e.memoizedProps = e.pendingProps, t === null ? i_(e) : Ke = t, nf.current = null;
}
function i_(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (e = t.return, t.flags & 32768) {
      if (n = oN(n, t), n !== null) {
        n.flags &= 32767, Ke = n;
        return;
      }
      if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
      else {
        Ze = 6, Ke = null;
        return;
      }
    } else if (n = iN(n, t, Bt), n !== null) {
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
function Gr(e, t, n) {
  var r = Ee, s = sn.transition;
  try {
    sn.transition = null, Ee = 1, hN(e, t, n, r);
  } finally {
    sn.transition = s, Ee = r;
  }
  return null;
}
function hN(e, t, n, r) {
  do
    $s();
  while (_r !== null);
  if (Se & 6) throw Error(V(327));
  n = e.finishedWork;
  var s = e.finishedLanes;
  if (n === null) return null;
  if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(V(177));
  e.callbackNode = null, e.callbackPriority = 0;
  var a = n.lanes | n.childLanes;
  if (YS(e, a), e === st && (Ke = st = null, ut = 0), !(n.subtreeFlags & 2064) && !(n.flags & 2064) || so || (so = !0, u_(Fo, function() {
    return $s(), null;
  })), a = (n.flags & 15990) !== 0, n.subtreeFlags & 15990 || a) {
    a = sn.transition, sn.transition = null;
    var o = Ee;
    Ee = 1;
    var u = Se;
    Se |= 4, nf.current = null, uN(e, n), e_(n, e), Dk(bc), Uo = !!wc, bc = wc = null, e.current = n, cN(n), $S(), Se = u, Ee = o, sn.transition = a;
  } else e.current = n;
  if (so && (so = !1, _r = e, al = s), a = e.pendingLanes, a === 0 && (Nr = null), US(n.stateNode), Ot(e, Ge()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) s = t[n], r(s.value, { componentStack: s.stack, digest: s.digest });
  if (sl) throw sl = !1, e = Hc, Hc = null, e;
  return al & 1 && e.tag !== 0 && $s(), a = e.pendingLanes, a & 1 ? e === Uc ? $a++ : ($a = 0, Uc = e) : $a = 0, Mr(), null;
}
function $s() {
  if (_r !== null) {
    var e = $g(al), t = sn.transition, n = Ee;
    try {
      if (sn.transition = null, Ee = 16 > e ? 16 : e, _r === null) var r = !1;
      else {
        if (e = _r, _r = null, al = 0, Se & 6) throw Error(V(331));
        var s = Se;
        for (Se |= 4, X = e.current; X !== null; ) {
          var a = X, o = a.child;
          if (X.flags & 16) {
            var u = a.deletions;
            if (u !== null) {
              for (var c = 0; c < u.length; c++) {
                var p = u[c];
                for (X = p; X !== null; ) {
                  var h = X;
                  switch (h.tag) {
                    case 0:
                    case 11:
                    case 15:
                      za(8, h, a);
                  }
                  var b = h.child;
                  if (b !== null) b.return = h, X = b;
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
              var E = a.alternate;
              if (E !== null) {
                var A = E.child;
                if (A !== null) {
                  E.child = null;
                  do {
                    var D = A.sibling;
                    A.sibling = null, A = D;
                  } while (A !== null);
                }
              }
              X = a;
            }
          }
          if (a.subtreeFlags & 2064 && o !== null) o.return = a, X = o;
          else e: for (; X !== null; ) {
            if (a = X, a.flags & 2048) switch (a.tag) {
              case 0:
              case 11:
              case 15:
                za(9, a, a.return);
            }
            var _ = a.sibling;
            if (_ !== null) {
              _.return = a.return, X = _;
              break e;
            }
            X = a.return;
          }
        }
        var x = e.current;
        for (X = x; X !== null; ) {
          o = X;
          var N = o.child;
          if (o.subtreeFlags & 2064 && N !== null) N.return = o, X = N;
          else e: for (o = x; X !== null; ) {
            if (u = X, u.flags & 2048) try {
              switch (u.tag) {
                case 0:
                case 11:
                case 15:
                  bl(9, u);
              }
            } catch (f) {
              We(u, u.return, f);
            }
            if (u === o) {
              X = null;
              break e;
            }
            var l = u.sibling;
            if (l !== null) {
              l.return = u.return, X = l;
              break e;
            }
            X = u.return;
          }
        }
        if (Se = s, Mr(), Dn && typeof Dn.onPostCommitFiberRoot == "function") try {
          Dn.onPostCommitFiberRoot(ml, e);
        } catch {
        }
        r = !0;
      }
      return r;
    } finally {
      Ee = n, sn.transition = t;
    }
  }
  return !1;
}
function gm(e, t, n) {
  t = Ys(n, t), t = $v(e, t, 1), e = kr(e, t, 1), t = kt(), e !== null && (yi(e, 1, t), Ot(e, t));
}
function We(e, t, n) {
  if (e.tag === 3) gm(e, e, n);
  else for (; t !== null; ) {
    if (t.tag === 3) {
      gm(t, e, n);
      break;
    } else if (t.tag === 1) {
      var r = t.stateNode;
      if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Nr === null || !Nr.has(r))) {
        e = Ys(n, e), e = Fv(t, e, 1), t = kr(t, e, 1), e = kt(), t !== null && (yi(t, 1, e), Ot(t, e));
        break;
      }
    }
    t = t.return;
  }
}
function gN(e, t, n) {
  var r = e.pingCache;
  r !== null && r.delete(t), t = kt(), e.pingedLanes |= e.suspendedLanes & n, st === e && (ut & n) === n && (Ze === 4 || Ze === 3 && (ut & 130023424) === ut && 500 > Ge() - sf ? Jr(e, 0) : rf |= n), Ot(e, t);
}
function o_(e, t) {
  t === 0 && (e.mode & 1 ? (t = qi, qi <<= 1, !(qi & 130023424) && (qi = 4194304)) : t = 1);
  var n = kt();
  e = tr(e, t), e !== null && (yi(e, t, n), Ot(e, n));
}
function vN(e) {
  var t = e.memoizedState, n = 0;
  t !== null && (n = t.retryLane), o_(e, n);
}
function _N(e, t) {
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
      throw Error(V(314));
  }
  r !== null && r.delete(t), o_(e, n);
}
var l_;
l_ = function(e, t, n) {
  if (e !== null) if (e.memoizedProps !== t.pendingProps || Mt.current) Rt = !0;
  else {
    if (!(e.lanes & n) && !(t.flags & 128)) return Rt = !1, aN(e, t, n);
    Rt = !!(e.flags & 131072);
  }
  else Rt = !1, ze && t.flags & 1048576 && fv(t, Qo, t.index);
  switch (t.lanes = 0, t.tag) {
    case 2:
      var r = t.type;
      ko(e, t), e = t.pendingProps;
      var s = Gs(t, xt.current);
      Bs(t, n), s = Xd(null, t, r, e, s, n);
      var a = Zd();
      return t.flags |= 1, typeof s == "object" && s !== null && typeof s.render == "function" && s.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Dt(r) ? (a = !0, qo(t)) : a = !1, t.memoizedState = s.state !== null && s.state !== void 0 ? s.state : null, Vd(t), s.updater = wl, t.stateNode = s, s._reactInternals = t, Ac(t, r, e, n), t = Mc(null, t, r, !0, a, n)) : (t.tag = 0, ze && a && Bd(t), St(null, t, s, n), t = t.child), t;
    case 16:
      r = t.elementType;
      e: {
        switch (ko(e, t), e = t.pendingProps, s = r._init, r = s(r._payload), t.type = r, s = t.tag = xN(r), e = hn(r, e), s) {
          case 0:
            t = Rc(null, t, r, e, n);
            break e;
          case 1:
            t = im(null, t, r, e, n);
            break e;
          case 11:
            t = sm(null, t, r, e, n);
            break e;
          case 14:
            t = am(null, t, r, hn(r.type, e), n);
            break e;
        }
        throw Error(V(
          306,
          r,
          ""
        ));
      }
      return t;
    case 0:
      return r = t.type, s = t.pendingProps, s = t.elementType === r ? s : hn(r, s), Rc(e, t, r, s, n);
    case 1:
      return r = t.type, s = t.pendingProps, s = t.elementType === r ? s : hn(r, s), im(e, t, r, s, n);
    case 3:
      e: {
        if (Gv(t), e === null) throw Error(V(387));
        r = t.pendingProps, a = t.memoizedState, s = a.element, _v(e, t), Jo(t, r, null, n);
        var o = t.memoizedState;
        if (r = o.element, a.isDehydrated) if (a = { element: r, isDehydrated: !1, cache: o.cache, pendingSuspenseBoundaries: o.pendingSuspenseBoundaries, transitions: o.transitions }, t.updateQueue.baseState = a, t.memoizedState = a, t.flags & 256) {
          s = Ys(Error(V(423)), t), t = om(e, t, r, n, s);
          break e;
        } else if (r !== s) {
          s = Ys(Error(V(424)), t), t = om(e, t, r, n, s);
          break e;
        } else for (Ft = Sr(t.stateNode.containerInfo.firstChild), Ht = t, ze = !0, vn = null, n = gv(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
        else {
          if (Vs(), r === s) {
            t = nr(e, t, n);
            break e;
          }
          St(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return yv(t), e === null && Cc(t), r = t.type, s = t.pendingProps, a = e !== null ? e.memoizedProps : null, o = s.children, Sc(r, s) ? o = null : a !== null && Sc(r, a) && (t.flags |= 32), Wv(e, t), St(e, t, o, n), t.child;
    case 6:
      return e === null && Cc(t), null;
    case 13:
      return Vv(e, t, n);
    case 4:
      return Kd(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Ks(t, null, r, n) : St(e, t, r, n), t.child;
    case 11:
      return r = t.type, s = t.pendingProps, s = t.elementType === r ? s : hn(r, s), sm(e, t, r, s, n);
    case 7:
      return St(e, t, t.pendingProps, n), t.child;
    case 8:
      return St(e, t, t.pendingProps.children, n), t.child;
    case 12:
      return St(e, t, t.pendingProps.children, n), t.child;
    case 10:
      e: {
        if (r = t.type._context, s = t.pendingProps, a = t.memoizedProps, o = s.value, Ae(Xo, r._currentValue), r._currentValue = o, a !== null) if (bn(a.value, o)) {
          if (a.children === s.children && !Mt.current) {
            t = nr(e, t, n);
            break e;
          }
        } else for (a = t.child, a !== null && (a.return = t); a !== null; ) {
          var u = a.dependencies;
          if (u !== null) {
            o = a.child;
            for (var c = u.firstContext; c !== null; ) {
              if (c.context === r) {
                if (a.tag === 1) {
                  c = Zn(-1, n & -n), c.tag = 2;
                  var p = a.updateQueue;
                  if (p !== null) {
                    p = p.shared;
                    var h = p.pending;
                    h === null ? c.next = c : (c.next = h.next, h.next = c), p.pending = c;
                  }
                }
                a.lanes |= n, c = a.alternate, c !== null && (c.lanes |= n), Tc(
                  a.return,
                  n,
                  t
                ), u.lanes |= n;
                break;
              }
              c = c.next;
            }
          } else if (a.tag === 10) o = a.type === t.type ? null : a.child;
          else if (a.tag === 18) {
            if (o = a.return, o === null) throw Error(V(341));
            o.lanes |= n, u = o.alternate, u !== null && (u.lanes |= n), Tc(o, n, t), o = a.sibling;
          } else o = a.child;
          if (o !== null) o.return = a;
          else for (o = a; o !== null; ) {
            if (o === t) {
              o = null;
              break;
            }
            if (a = o.sibling, a !== null) {
              a.return = o.return, o = a;
              break;
            }
            o = o.return;
          }
          a = o;
        }
        St(e, t, s.children, n), t = t.child;
      }
      return t;
    case 9:
      return s = t.type, r = t.pendingProps.children, Bs(t, n), s = an(s), r = r(s), t.flags |= 1, St(e, t, r, n), t.child;
    case 14:
      return r = t.type, s = hn(r, t.pendingProps), s = hn(r.type, s), am(e, t, r, s, n);
    case 15:
      return Hv(e, t, t.type, t.pendingProps, n);
    case 17:
      return r = t.type, s = t.pendingProps, s = t.elementType === r ? s : hn(r, s), ko(e, t), t.tag = 1, Dt(r) ? (e = !0, qo(t)) : e = !1, Bs(t, n), Bv(t, r, s), Ac(t, r, s, n), Mc(null, t, r, !0, e, n);
    case 19:
      return Kv(e, t, n);
    case 22:
      return Uv(e, t, n);
  }
  throw Error(V(156, t.tag));
};
function u_(e, t) {
  return Og(e, t);
}
function yN(e, t, n, r) {
  this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
}
function tn(e, t, n, r) {
  return new yN(e, t, n, r);
}
function uf(e) {
  return e = e.prototype, !(!e || !e.isReactComponent);
}
function xN(e) {
  if (typeof e == "function") return uf(e) ? 1 : 0;
  if (e != null) {
    if (e = e.$$typeof, e === Ed) return 11;
    if (e === Cd) return 14;
  }
  return 2;
}
function Er(e, t) {
  var n = e.alternate;
  return n === null ? (n = tn(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
}
function Eo(e, t, n, r, s, a) {
  var o = 2;
  if (r = e, typeof e == "function") uf(e) && (o = 1);
  else if (typeof e == "string") o = 5;
  else e: switch (e) {
    case ks:
      return es(n.children, s, a, t);
    case jd:
      o = 8, s |= 8;
      break;
    case tc:
      return e = tn(12, n, t, s | 2), e.elementType = tc, e.lanes = a, e;
    case nc:
      return e = tn(13, n, t, s), e.elementType = nc, e.lanes = a, e;
    case rc:
      return e = tn(19, n, t, s), e.elementType = rc, e.lanes = a, e;
    case yg:
      return kl(n, s, a, t);
    default:
      if (typeof e == "object" && e !== null) switch (e.$$typeof) {
        case vg:
          o = 10;
          break e;
        case _g:
          o = 9;
          break e;
        case Ed:
          o = 11;
          break e;
        case Cd:
          o = 14;
          break e;
        case dr:
          o = 16, r = null;
          break e;
      }
      throw Error(V(130, e == null ? e : typeof e, ""));
  }
  return t = tn(o, n, t, s), t.elementType = e, t.type = r, t.lanes = a, t;
}
function es(e, t, n, r) {
  return e = tn(7, e, r, t), e.lanes = n, e;
}
function kl(e, t, n, r) {
  return e = tn(22, e, r, t), e.elementType = yg, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
}
function wu(e, t, n) {
  return e = tn(6, e, null, t), e.lanes = n, e;
}
function bu(e, t, n) {
  return t = tn(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
}
function wN(e, t, n, r, s) {
  this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = nu(0), this.expirationTimes = nu(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = nu(0), this.identifierPrefix = r, this.onRecoverableError = s, this.mutableSourceEagerHydrationData = null;
}
function cf(e, t, n, r, s, a, o, u, c) {
  return e = new wN(e, t, n, u, c), t === 1 ? (t = 1, a === !0 && (t |= 8)) : t = 0, a = tn(3, null, null, t), e.current = a, a.stateNode = e, a.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Vd(a), e;
}
function bN(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return { $$typeof: Ss, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
}
function c_(e) {
  if (!e) return Ir;
  e = e._reactInternals;
  e: {
    if (ls(e) !== e || e.tag !== 1) throw Error(V(170));
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
    throw Error(V(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (Dt(n)) return cv(e, n, t);
  }
  return t;
}
function d_(e, t, n, r, s, a, o, u, c) {
  return e = cf(n, r, !0, e, s, a, o, u, c), e.context = c_(null), n = e.current, r = kt(), s = jr(n), a = Zn(r, s), a.callback = t ?? null, kr(n, a, s), e.current.lanes = s, yi(e, s, r), Ot(e, r), e;
}
function Nl(e, t, n, r) {
  var s = t.current, a = kt(), o = jr(s);
  return n = c_(n), t.context === null ? t.context = n : t.pendingContext = n, t = Zn(a, o), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = kr(s, t, o), e !== null && (xn(e, s, o, a), wo(e, s, o)), o;
}
function ol(e) {
  if (e = e.current, !e.child) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function vm(e, t) {
  if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function df(e, t) {
  vm(e, t), (e = e.alternate) && vm(e, t);
}
function SN() {
  return null;
}
var f_ = typeof reportError == "function" ? reportError : function(e) {
  console.error(e);
};
function ff(e) {
  this._internalRoot = e;
}
jl.prototype.render = ff.prototype.render = function(e) {
  var t = this._internalRoot;
  if (t === null) throw Error(V(409));
  Nl(e, t, null, null);
};
jl.prototype.unmount = ff.prototype.unmount = function() {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    as(function() {
      Nl(null, e, null, null);
    }), t[er] = null;
  }
};
function jl(e) {
  this._internalRoot = e;
}
jl.prototype.unstable_scheduleHydration = function(e) {
  if (e) {
    var t = Ug();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < mr.length && t !== 0 && t < mr[n].priority; n++) ;
    mr.splice(n, 0, e), n === 0 && Gg(e);
  }
};
function pf(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
}
function El(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
}
function _m() {
}
function kN(e, t, n, r, s) {
  if (s) {
    if (typeof r == "function") {
      var a = r;
      r = function() {
        var p = ol(o);
        a.call(p);
      };
    }
    var o = d_(t, r, e, 0, null, !1, !1, "", _m);
    return e._reactRootContainer = o, e[er] = o.current, ei(e.nodeType === 8 ? e.parentNode : e), as(), o;
  }
  for (; s = e.lastChild; ) e.removeChild(s);
  if (typeof r == "function") {
    var u = r;
    r = function() {
      var p = ol(c);
      u.call(p);
    };
  }
  var c = cf(e, 0, !1, null, null, !1, !1, "", _m);
  return e._reactRootContainer = c, e[er] = c.current, ei(e.nodeType === 8 ? e.parentNode : e), as(function() {
    Nl(t, c, n, r);
  }), c;
}
function Cl(e, t, n, r, s) {
  var a = n._reactRootContainer;
  if (a) {
    var o = a;
    if (typeof s == "function") {
      var u = s;
      s = function() {
        var c = ol(o);
        u.call(c);
      };
    }
    Nl(t, o, e, s);
  } else o = kN(n, t, e, s, r);
  return ol(o);
}
Fg = function(e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = Na(t.pendingLanes);
        n !== 0 && (Ad(t, n | 1), Ot(t, Ge()), !(Se & 6) && (Qs = Ge() + 500, Mr()));
      }
      break;
    case 13:
      as(function() {
        var r = tr(e, 1);
        if (r !== null) {
          var s = kt();
          xn(r, e, 1, s);
        }
      }), df(e, 1);
  }
};
Pd = function(e) {
  if (e.tag === 13) {
    var t = tr(e, 134217728);
    if (t !== null) {
      var n = kt();
      xn(t, e, 134217728, n);
    }
    df(e, 134217728);
  }
};
Hg = function(e) {
  if (e.tag === 13) {
    var t = jr(e), n = tr(e, t);
    if (n !== null) {
      var r = kt();
      xn(n, e, t, r);
    }
    df(e, t);
  }
};
Ug = function() {
  return Ee;
};
Wg = function(e, t) {
  var n = Ee;
  try {
    return Ee = e, t();
  } finally {
    Ee = n;
  }
};
pc = function(e, t, n) {
  switch (t) {
    case "input":
      if (ic(e, n), t = n.name, n.type === "radio" && t != null) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var s = _l(r);
            if (!s) throw Error(V(90));
            wg(r), ic(r, s);
          }
        }
      }
      break;
    case "textarea":
      Sg(e, n);
      break;
    case "select":
      t = n.value, t != null && Ds(e, !!n.multiple, t, !1);
  }
};
Ig = af;
Ag = as;
var NN = { usingClientEntryPoint: !1, Events: [wi, Cs, _l, Cg, Tg, af] }, wa = { findFiberByHostInstance: Kr, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, jN = { bundleType: wa.bundleType, version: wa.version, rendererPackageName: wa.rendererPackageName, rendererConfig: wa.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: rr.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
  return e = Mg(e), e === null ? null : e.stateNode;
}, findFiberByHostInstance: wa.findFiberByHostInstance || SN, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var ao = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!ao.isDisabled && ao.supportsFiber) try {
    ml = ao.inject(jN), Dn = ao;
  } catch {
  }
}
Gt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = NN;
Gt.createPortal = function(e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!pf(t)) throw Error(V(200));
  return bN(e, t, null, n);
};
Gt.createRoot = function(e, t) {
  if (!pf(e)) throw Error(V(299));
  var n = !1, r = "", s = f_;
  return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError)), t = cf(e, 1, !1, null, null, n, !1, r, s), e[er] = t.current, ei(e.nodeType === 8 ? e.parentNode : e), new ff(t);
};
Gt.findDOMNode = function(e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function" ? Error(V(188)) : (e = Object.keys(e).join(","), Error(V(268, e)));
  return e = Mg(t), e = e === null ? null : e.stateNode, e;
};
Gt.flushSync = function(e) {
  return as(e);
};
Gt.hydrate = function(e, t, n) {
  if (!El(t)) throw Error(V(200));
  return Cl(null, e, t, !0, n);
};
Gt.hydrateRoot = function(e, t, n) {
  if (!pf(e)) throw Error(V(405));
  var r = n != null && n.hydratedSources || null, s = !1, a = "", o = f_;
  if (n != null && (n.unstable_strictMode === !0 && (s = !0), n.identifierPrefix !== void 0 && (a = n.identifierPrefix), n.onRecoverableError !== void 0 && (o = n.onRecoverableError)), t = d_(t, null, e, 1, n ?? null, s, !1, a, o), e[er] = t.current, ei(e), r) for (e = 0; e < r.length; e++) n = r[e], s = n._getVersion, s = s(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, s] : t.mutableSourceEagerHydrationData.push(
    n,
    s
  );
  return new jl(t);
};
Gt.render = function(e, t, n) {
  if (!El(t)) throw Error(V(200));
  return Cl(null, e, t, !1, n);
};
Gt.unmountComponentAtNode = function(e) {
  if (!El(e)) throw Error(V(40));
  return e._reactRootContainer ? (as(function() {
    Cl(null, null, e, !1, function() {
      e._reactRootContainer = null, e[er] = null;
    });
  }), !0) : !1;
};
Gt.unstable_batchedUpdates = af;
Gt.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
  if (!El(n)) throw Error(V(200));
  if (e == null || e._reactInternals === void 0) throw Error(V(38));
  return Cl(e, t, n, !1, r);
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
const EN = /* @__PURE__ */ id(m_), Tl = 0, Dr = 1, na = 2, h_ = 4;
function ym(e) {
  return () => e;
}
function CN(e) {
  e();
}
function g_(e, t) {
  return (n) => e(t(n));
}
function xm(e, t) {
  return () => e(t);
}
function TN(e, t) {
  return (n) => e(t, n);
}
function mf(e) {
  return e !== void 0;
}
function IN(...e) {
  return () => {
    e.map(CN);
  };
}
function ra() {
}
function Il(e, t) {
  return t(e), e;
}
function AN(e, t) {
  return t(e);
}
function Oe(...e) {
  return e;
}
function Ne(e, t) {
  return e(Dr, t);
}
function me(e, t) {
  e(Tl, t);
}
function hf(e) {
  e(na);
}
function Le(e) {
  return e(h_);
}
function ee(e, t) {
  return Ne(e, TN(t, Tl));
}
function wn(e, t) {
  const n = e(Dr, (r) => {
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
function ie(e) {
  return (t) => (n) => {
    e(n) && t(n);
  };
}
function Q(e) {
  return (t) => g_(t, e);
}
function Pn(e) {
  return (t) => () => {
    t(e);
  };
}
function W(e, ...t) {
  const n = PN(...t);
  return (r, s) => {
    switch (r) {
      case na:
        hf(e);
        return;
      case Dr:
        return Ne(e, n(s));
    }
  };
}
function Mn(e, t) {
  return (n) => (r) => {
    n(t = e(t, r));
  };
}
function is(e) {
  return (t) => (n) => {
    e > 0 ? e-- : t(n);
  };
}
function Qn(e) {
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
  return e.forEach((a, o) => {
    const u = 2 ** o;
    Ne(a, (c) => {
      const p = n;
      n |= u, t[o] = c, p !== s && n === s && r && (r(), r = null);
    });
  }), (a) => (o) => {
    const u = () => {
      a([o].concat(t));
    };
    n === s ? u() : r = u;
  };
}
function PN(...e) {
  return (t) => e.reduceRight(AN, t);
}
function RN(e) {
  let t, n;
  const r = () => t?.();
  return function(s, a) {
    switch (s) {
      case Dr:
        return a ? n === a ? void 0 : (r(), n = a, t = Ne(e, a), t) : (r(), ra);
      case na:
        r(), n = null;
        return;
    }
  };
}
function K(e) {
  let t = e;
  const n = we();
  return (r, s) => {
    switch (r) {
      case Tl:
        t = s;
        break;
      case Dr: {
        s(t);
        break;
      }
      case h_:
        return t;
    }
    return n(r, s);
  };
}
function yt(e, t) {
  return Il(K(t), (n) => ee(e, n));
}
function we() {
  const e = [];
  return (t, n) => {
    switch (t) {
      case Tl:
        e.slice().forEach((r) => {
          r(n);
        });
        return;
      case na:
        e.splice(0, e.length);
        return;
      case Dr:
        return e.push(n), () => {
          const r = e.indexOf(n);
          r > -1 && e.splice(r, 1);
        };
    }
  };
}
function Ut(e) {
  return Il(we(), (t) => ee(e, t));
}
function ke(e, t = [], { singleton: n } = { singleton: !0 }) {
  return {
    constructor: e,
    dependencies: t,
    id: MN(),
    singleton: n
  };
}
const MN = () => Symbol();
function DN(e) {
  const t = /* @__PURE__ */ new Map(), n = ({ constructor: r, dependencies: s, id: a, singleton: o }) => {
    if (o && t.has(a))
      return t.get(a);
    const u = r(s.map((c) => n(c)));
    return o && t.set(a, u), u;
  };
  return n(e);
}
function qe(...e) {
  const t = we(), n = new Array(e.length);
  let r = 0;
  const s = 2 ** e.length - 1;
  return e.forEach((a, o) => {
    const u = 2 ** o;
    Ne(a, (c) => {
      n[o] = c, r |= u, r === s && me(t, n);
    });
  }), function(a, o) {
    switch (a) {
      case na: {
        hf(t);
        return;
      }
      case Dr:
        return r === s && o(n), Ne(t, o);
    }
  };
}
function ae(e, t = v_) {
  return W(e, Me(t));
}
function Vc(...e) {
  return function(t, n) {
    switch (t) {
      case na:
        return;
      case Dr:
        return IN(...e.map((r) => Ne(r, n)));
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
}, ON = {
  [Je.DEBUG]: "debug",
  [Je.ERROR]: "error",
  [Je.INFO]: "log",
  [Je.WARN]: "warn"
}, LN = () => typeof globalThis > "u" ? window : globalThis, Or = ke(
  () => {
    const e = K(Je.ERROR);
    return {
      log: K((t, n, r = Je.INFO) => {
        const s = LN().VIRTUOSO_LOG_LEVEL ?? Le(e);
        r >= s && console[ON[r]](
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
), Kc = /* @__PURE__ */ new WeakMap();
function __(e) {
  return "self" in e ? e.document.documentElement : e;
}
function zN(e) {
  const t = __(e), n = Kc.get(t);
  if (n !== void 0)
    return n;
  const r = t.ownerDocument.defaultView.getComputedStyle(t).direction === "rtl";
  return Kc.set(t, r), r;
}
function bm(e) {
  Kc.delete(__(e));
}
function y_(e, t) {
  return zN(e) ? -t : t;
}
const Qr = y_;
function Sm(e, t) {
  return y_(e, t);
}
function us(e, t, n) {
  return gf(e, t, n).callbackRef;
}
function gf(e, t, n) {
  const r = J.useRef(null);
  let s = (o) => {
  };
  const a = J.useMemo(() => typeof ResizeObserver < "u" ? new ResizeObserver((o) => {
    const u = () => {
      const c = o[0].target;
      c.offsetParent !== null && e(c);
    };
    n ? u() : requestAnimationFrame(u);
  }) : null, [e, n]);
  return s = (o) => {
    o && t ? (a?.observe(o), r.current = o) : (r.current && a?.unobserve(r.current), r.current = null);
  }, { callbackRef: s, ref: r };
}
function BN(e, t, n, r, s, a, o, u, c) {
  const p = J.useCallback(
    (h) => {
      const b = $N(h.children, t, u ? "offsetWidth" : "offsetHeight", s);
      let g = h.parentElement;
      for (; g.dataset.virtuosoScroller === void 0; )
        g = g.parentElement;
      const w = g.lastElementChild.dataset.viewportType === "window";
      let E;
      w && (E = g.ownerDocument.defaultView);
      const A = o ? u ? o.scrollWidth : o.scrollHeight : w ? u ? E.document.documentElement.scrollWidth : E.document.documentElement.scrollHeight : u ? g.scrollWidth : g.scrollHeight, D = o ? u ? o.offsetWidth : o.offsetHeight : w ? u ? E.innerWidth : E.innerHeight : u ? g.offsetWidth : g.offsetHeight, _ = o ? u ? Qr(o, o.scrollLeft) : o.scrollTop : w ? u ? Qr(E, E.scrollX || E.document.documentElement.scrollLeft) : E.scrollY || E.document.documentElement.scrollTop : u ? Qr(g, g.scrollLeft) : g.scrollTop;
      r({
        scrollHeight: A,
        scrollTop: Math.max(_, 0),
        viewportHeight: D
      }), a?.(
        u ? km("column-gap", getComputedStyle(h).columnGap, s) : km("row-gap", getComputedStyle(h).rowGap, s)
      ), b !== null && e(b);
    },
    [e, t, s, a, o, r, u]
  );
  return gf(p, n, c);
}
function $N(e, t, n, r) {
  const s = e.length;
  if (s === 0)
    return null;
  const a = [];
  for (let o = 0; o < s; o++) {
    const u = e.item(o);
    if (u.dataset.index === void 0)
      continue;
    const c = parseInt(u.dataset.index), p = parseFloat(u.dataset.knownSize), h = t(u, n);
    if (h === 0 && r("Zero-sized element, this should not happen", { child: u }, Je.ERROR), h === p)
      continue;
    const b = a[a.length - 1];
    a.length === 0 || b.size !== h || b.endIndex !== c - 1 ? a.push({ endIndex: c, size: h, startIndex: c }) : a[a.length - 1].endIndex++;
  }
  return a;
}
function km(e, t, n) {
  return t !== "normal" && t?.endsWith("px") !== !0 && n(`${e} was not resolved to pixel value correctly`, t, Je.WARN), t === "normal" ? 0 : parseInt(t ?? "0", 10);
}
function x_(e, t, n) {
  const r = J.useRef(null), s = J.useCallback(
    (c) => {
      if (!c?.offsetParent)
        return;
      const p = c.getBoundingClientRect(), h = p.width;
      let b, g;
      if (t) {
        const w = t.getBoundingClientRect(), E = p.top - w.top;
        g = w.height - Math.max(0, E), b = E + t.scrollTop;
      } else {
        const w = o.current.ownerDocument.defaultView;
        g = w.innerHeight - Math.max(0, p.top), b = p.top + w.scrollY;
      }
      r.current = {
        listHeight: p.height,
        offsetTop: b,
        visibleHeight: g,
        visibleWidth: h
      }, e(r.current);
    },
    // oxlint-disable-next-line exhaustive-deps
    [e, t]
  ), { callbackRef: a, ref: o } = gf(s, !0, n), u = J.useCallback(() => {
    s(o.current);
  }, [s, o]);
  return J.useEffect(() => {
    if (t) {
      t.addEventListener("scroll", u);
      const p = new ResizeObserver(() => {
        requestAnimationFrame(u);
      });
      return p.observe(t), () => {
        t.removeEventListener("scroll", u), p.unobserve(t);
      };
    }
    const c = o.current?.ownerDocument.defaultView;
    return c?.addEventListener("scroll", u), c?.addEventListener("resize", u), () => {
      c?.removeEventListener("scroll", u), c?.removeEventListener("resize", u);
    };
  }, [u, t, o]), a;
}
const Ct = ke(
  () => {
    const e = we(), t = we(), n = K(0), r = we(), s = K(0), a = we(), o = we(), u = K(0), c = K(0), p = K(0), h = K(0), b = we(), g = we(), w = K(!1), E = K(!1), A = K(!1);
    return ee(
      W(
        e,
        Q(({ scrollTop: D }) => D)
      ),
      t
    ), ee(
      W(
        e,
        Q(({ scrollHeight: D }) => D)
      ),
      o
    ), ee(t, s), {
      deviation: n,
      fixedFooterHeight: p,
      fixedHeaderHeight: c,
      footerHeight: h,
      headerHeight: u,
      horizontalDirection: E,
      scrollBy: g,
      // input
      scrollContainerState: e,
      scrollHeight: o,
      scrollingInProgress: w,
      // signals
      scrollTo: b,
      scrollTop: t,
      skipAnimationFrameInResizeObserver: A,
      smoothScrollTargetReached: r,
      // state
      statefulScrollTop: s,
      viewportHeight: a
    };
  },
  [],
  { singleton: !0 }
), ui = { lvl: 0 };
function w_(e, t) {
  const n = e.length;
  if (n === 0)
    return [];
  let { index: r, value: s } = t(e[0]);
  const a = [];
  for (let o = 1; o < n; o++) {
    const { index: u, value: c } = t(e[o]);
    a.push({ end: u - 1, start: r, value: s }), r = u, s = c;
  }
  return a.push({ end: 1 / 0, start: r, value: s }), a;
}
function Ie(e) {
  return e === ui;
}
function ci(e, t) {
  if (!Ie(e))
    return t === e.k ? e.v : t < e.k ? ci(e.l, t) : ci(e.r, t);
}
function Sn(e, t, n = "k") {
  if (Ie(e))
    return [-1 / 0, void 0];
  if (Number(e[n]) === t)
    return [e.k, e.v];
  if (Number(e[n]) < t) {
    const r = Sn(e.r, t, n);
    return r[0] === -1 / 0 ? [e.k, e.v] : r;
  }
  return Sn(e.l, t, n);
}
function $t(e, t, n) {
  return Ie(e) ? k_(t, n, 1) : t === e.k ? Xe(e, { k: t, v: n }) : t < e.k ? Nm(Xe(e, { l: $t(e.l, t, n) })) : Nm(Xe(e, { r: $t(e.r, t, n) }));
}
function Fs() {
  return ui;
}
function Hs(e, t, n) {
  if (Ie(e))
    return [];
  const r = Sn(e, t)[0];
  return FN(Yc(e, r, n));
}
function qc(e, t) {
  if (Ie(e))
    return ui;
  const { k: n, l: r, r: s } = e;
  if (t === n) {
    if (Ie(r))
      return s;
    if (Ie(s))
      return r;
    const [a, o] = S_(r);
    return Co(Xe(e, { k: a, l: b_(r), v: o }));
  }
  return t < n ? Co(Xe(e, { l: qc(r, t) })) : Co(Xe(e, { r: qc(s, t) }));
}
function Xr(e) {
  return Ie(e) ? [] : [...Xr(e.l), { k: e.k, v: e.v }, ...Xr(e.r)];
}
function Yc(e, t, n) {
  if (Ie(e))
    return [];
  const { k: r, l: s, r: a, v: o } = e;
  let u = [];
  return r > t && (u = u.concat(Yc(s, t, n))), r >= t && r <= n && u.push({ k: r, v: o }), r <= n && (u = u.concat(Yc(a, t, n))), u;
}
function Co(e) {
  const { l: t, lvl: n, r } = e;
  if (r.lvl >= n - 1 && t.lvl >= n - 1)
    return e;
  if (n > r.lvl + 1) {
    if (Su(t))
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
  if (Su(e))
    return Qc(Xe(e, { lvl: n - 1 }));
  if (!Ie(r) && !Ie(r.l)) {
    const s = r.l, a = Su(s) ? r.lvl - 1 : r.lvl;
    return Xe(s, {
      l: Xe(e, {
        lvl: n - 1,
        r: s.l
      }),
      lvl: s.lvl + 1,
      r: Qc(Xe(r, { l: s.r, lvl: a }))
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
function b_(e) {
  return Ie(e.r) ? e.l : Co(Xe(e, { r: b_(e.r) }));
}
function Su(e) {
  return Ie(e) || e.lvl > e.r.lvl;
}
function S_(e) {
  return Ie(e.r) ? [e.k, e.v] : S_(e.r);
}
function k_(e, t, n, r = ui, s = ui) {
  return { k: e, l: r, lvl: n, r: s, v: t };
}
function Nm(e) {
  return Qc(N_(e));
}
function N_(e) {
  const { l: t } = e;
  return !Ie(t) && t.lvl === e.lvl ? Xe(t, { r: Xe(e, { l: t.r }) }) : e;
}
function Qc(e) {
  const { lvl: t, r: n } = e;
  return !Ie(n) && !Ie(n.r) && n.lvl === t && n.r.lvl === t ? Xe(n, { l: Xe(e, { r: n.l }), lvl: t + 1 }) : e;
}
function FN(e) {
  return w_(e, ({ k: t, v: n }) => ({ index: t, value: n }));
}
function j_(e, t) {
  return !!(e && e.startIndex === t.startIndex && e.endIndex === t.endIndex);
}
function di(e, t) {
  return !!(e && e[0] === t[0] && e[1] === t[1]);
}
const vf = ke(
  () => ({ recalcInProgress: K(!1) }),
  [],
  { singleton: !0 }
);
function E_(e, t, n) {
  return e[ll(e, t, n)];
}
function ll(e, t, n, r = 0) {
  let s = e.length - 1;
  for (; r <= s; ) {
    const a = Math.floor((r + s) / 2), o = e[a], u = n(o, t);
    if (u === 0)
      return a;
    if (u === -1) {
      if (s - r < 2)
        return a - 1;
      s = a - 1;
    } else {
      if (s === r)
        return a;
      r = a + 1;
    }
  }
  throw new Error(`Failed binary finding record in array - ${e.join(",")}, searched for ${t}`);
}
function HN(e, t, n, r) {
  const s = ll(e, t, r), a = ll(e, n, r, s);
  return e.slice(s, a + 1);
}
function Ar(e, t) {
  return Math.round(e.getBoundingClientRect()[t]);
}
function Al(e) {
  return !Ie(e.groupOffsetTree);
}
function _f({ index: e }, t) {
  return t === e ? 0 : t < e ? -1 : 1;
}
function UN() {
  return {
    groupIndices: [],
    groupOffsetTree: Fs(),
    lastIndex: 0,
    lastOffset: 0,
    lastSize: 0,
    offsetTree: [],
    sizeTree: Fs()
  };
}
function WN(e, t) {
  let n = Ie(e) ? 0 : 1 / 0;
  for (const r of t) {
    const { endIndex: s, size: a, startIndex: o } = r;
    if (n = Math.min(n, o), Ie(e)) {
      e = $t(e, 0, a);
      continue;
    }
    const u = Hs(e, o - 1, s + 1);
    if (u.some(XN(r)))
      continue;
    let c = !1, p = !1;
    for (const { end: h, start: b, value: g } of u)
      c ? (s >= b || a === g) && (e = qc(e, b)) : (p = g !== a, c = !0), h > s && s >= b && g !== a && (e = $t(e, s + 1, g));
    p && (e = $t(e, o, a));
  }
  return [e, n];
}
function GN(e) {
  return typeof e.groupIndex < "u";
}
function VN({ offset: e }, t) {
  return t === e ? 0 : t < e ? -1 : 1;
}
function fi(e, t, n) {
  if (t.length === 0)
    return 0;
  const { index: r, offset: s, size: a } = E_(t, e, _f), o = e - r, u = a * o + (o - 1) * n + s;
  return u > 0 ? u + n : u;
}
function C_(e, t) {
  if (!Al(t))
    return e;
  let n = 0;
  for (; t.groupIndices[n] <= e + n; )
    n++;
  return e + n;
}
function T_(e, t, n) {
  if (GN(e))
    return t.groupIndices[e.groupIndex] + 1;
  const r = e.index === "LAST" ? n : e.index;
  let s = C_(r, t);
  return s = Math.max(0, s, Math.min(n, s)), s;
}
function KN(e, t, n, r = 0) {
  return r > 0 && (t = Math.max(t, E_(e, r, _f).offset)), w_(HN(e, t, n, VN), QN);
}
function qN(e, [t, n, r, s]) {
  t.length > 0 && r("received item sizes", t, Je.DEBUG);
  const a = e.sizeTree;
  let o = a, u = 0;
  if (n.length > 0 && Ie(a) && t.length === 2) {
    const g = t[0].size, w = t[1].size;
    o = n.reduce((E, A) => $t($t(E, A, g), A + 1, w), o);
  } else
    [o, u] = WN(o, t);
  if (o === a)
    return e;
  const { lastIndex: c, lastOffset: p, lastSize: h, offsetTree: b } = Xc(e.offsetTree, u, o, s);
  return {
    groupIndices: n,
    groupOffsetTree: n.reduce((g, w) => $t(g, w, fi(w, b, s)), Fs()),
    lastIndex: c,
    lastOffset: p,
    lastSize: h,
    offsetTree: b,
    sizeTree: o
  };
}
function YN(e) {
  return Xr(e).map(({ k: t, v: n }, r, s) => {
    const a = s[r + 1];
    return { endIndex: a !== void 0 ? a.k - 1 : 1 / 0, size: n, startIndex: t };
  });
}
function jm(e, t) {
  let n = 0, r = 0;
  for (; n < e; )
    n += t[r + 1] - t[r] - 1, r++;
  return r - (n === e ? 0 : 1);
}
function Xc(e, t, n, r) {
  let s = e, a = 0, o = 0, u = 0, c = 0;
  if (t !== 0) {
    c = ll(s, t - 1, _f), u = s[c].offset;
    const p = Sn(n, t - 1);
    a = p[0], o = p[1], s.length && s[c].size === Sn(n, t)[1] && (c -= 1), s = s.slice(0, c + 1);
  } else
    s = [];
  for (const { start: p, value: h } of Hs(n, t, 1 / 0)) {
    const b = p - a, g = b * o + u + b * r;
    s.push({
      index: p,
      offset: g,
      size: h
    }), a = p, u = g, o = h;
  }
  return {
    lastIndex: a,
    lastOffset: u,
    lastSize: o,
    offsetTree: s
  };
}
function QN(e) {
  return { index: e.index, value: e };
}
function XN(e) {
  const { endIndex: t, size: n, startIndex: r } = e;
  return (s) => s.start === r && (s.end === t || s.end === 1 / 0) && s.value === n;
}
const ZN = {
  offsetHeight: "height",
  offsetWidth: "width"
}, zn = ke(
  ([{ log: e }, { recalcInProgress: t }]) => {
    const n = we(), r = we(), s = yt(r, 0), a = we(), o = we(), u = K(0), c = K([]), p = K(void 0), h = K(void 0), b = K(void 0), g = K(void 0), w = K((m, v) => Ar(m, ZN[v])), E = K(void 0), A = K(0), D = UN(), _ = yt(
      W(n, he(c, e, A), Mn(qN, D), Me()),
      D
    ), x = yt(
      W(
        c,
        Me(),
        Mn((m, v) => ({ current: v, prev: m.current }), {
          current: [],
          prev: []
        }),
        Q(({ prev: m }) => m)
      ),
      []
    );
    ee(
      W(
        c,
        ie((m) => m.length > 0),
        he(_, A),
        Q(([m, v, k]) => {
          const S = m.reduce((C, L, B) => $t(C, L, fi(L, v.offsetTree, k) || B), Fs());
          return {
            ...v,
            groupIndices: m,
            groupOffsetTree: S
          };
        })
      ),
      _
    ), ee(
      W(
        r,
        he(_),
        ie(([m, { lastIndex: v }]) => m < v),
        Q(([m, { lastIndex: v, lastSize: k }]) => [
          {
            endIndex: v,
            size: k,
            startIndex: m
          }
        ])
      ),
      n
    ), ee(p, h);
    const N = yt(
      W(
        p,
        Q((m) => m === void 0)
      ),
      !0
    );
    ee(
      W(
        h,
        ie((m) => m !== void 0 && Ie(Le(_).sizeTree)),
        Q((m) => {
          const v = Le(b), k = Le(c).length > 0;
          return v !== void 0 && v !== 0 ? k ? [
            { endIndex: 0, size: v, startIndex: 0 },
            { endIndex: 1, size: m, startIndex: 1 }
          ] : [] : [{ endIndex: 0, size: m, startIndex: 0 }];
        })
      ),
      n
    ), ee(
      W(
        g,
        ie((m) => m !== void 0 && m.length > 0 && Ie(Le(_).sizeTree)),
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
    ), ee(
      W(
        c,
        he(b, h),
        ie(([, m, v]) => m !== void 0 && v !== void 0),
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
      W(
        n,
        he(_),
        Mn(
          ({ sizes: m }, [v, k]) => ({
            changed: k !== m,
            sizes: k
          }),
          { changed: !1, sizes: D }
        ),
        Q((m) => m.changed)
      )
    );
    Ne(
      W(
        u,
        Mn(
          (m, v) => ({ diff: m.prev - v, prev: v }),
          { diff: 0, prev: 0 }
        ),
        Q((m) => m.diff)
      ),
      (m) => {
        const { groupIndices: v } = Le(_);
        if (m > 0)
          me(t, !0), me(a, m + jm(m, v));
        else if (m < 0) {
          const k = Le(x);
          k.length > 0 && (m -= jm(-m, k)), me(o, m);
        }
      }
    ), Ne(W(u, he(e)), ([m, v]) => {
      m < 0 && v(
        "`firstItemIndex` prop should not be set to less than zero. If you don't know the total count, just use a very high value",
        { firstItemIndex: u },
        Je.ERROR
      );
    });
    const f = Ut(a);
    ee(
      W(
        a,
        he(_),
        Q(([m, v]) => {
          const k = v.groupIndices.length > 0, S = [], C = v.lastSize;
          if (k) {
            const L = ci(v.sizeTree, 0);
            let B = 0, P = 0;
            for (; B < m; ) {
              const j = v.groupIndices[P], $ = v.groupIndices.length === P + 1 ? 1 / 0 : v.groupIndices[P + 1] - j - 1;
              S.push({
                endIndex: j,
                size: L,
                startIndex: j
              }), S.push({
                endIndex: j + 1 + $ - 1,
                size: C,
                startIndex: j + 1
              }), P++, B += $ + 1;
            }
            const z = Xr(v.sizeTree);
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
          return Xr(v.sizeTree).reduce(
            (L, { k: B, v: P }) => ({
              prevIndex: B + m,
              prevSize: P,
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
    const d = Ut(
      W(
        o,
        he(_, A),
        Q(([m, { offsetTree: v }, k]) => {
          const S = -m;
          return fi(S, v, k);
        })
      )
    );
    return ee(
      W(
        o,
        he(_, A),
        Q(([m, v, k]) => {
          if (v.groupIndices.length > 0) {
            if (Ie(v.sizeTree))
              return v;
            let C = Fs();
            const L = Le(x);
            let B = 0, P = 0, z = 0;
            for (; B < -m; ) {
              z = L[P];
              const j = L[P + 1] - z - 1;
              P++, B += j + 1;
            }
            if (C = Xr(v.sizeTree).reduce((j, { k: $, v: O }) => $t(j, Math.max(0, $ + m), O), C), B !== -m) {
              const j = ci(v.sizeTree, z);
              C = $t(C, 0, j);
              const $ = Sn(v.sizeTree, -m + 1)[1];
              C = $t(C, 1, $);
            }
            return {
              ...v,
              sizeTree: C,
              ...Xc(v.offsetTree, 0, C, k)
            };
          }
          const S = Xr(v.sizeTree).reduce((C, { k: L, v: B }) => $t(C, Math.max(0, L + m), B), Fs());
          return {
            ...v,
            sizeTree: S,
            ...Xc(v.offsetTree, 0, S, k)
          };
        })
      ),
      _
    ), {
      beforeUnshiftWith: f,
      // input
      data: E,
      defaultItemSize: h,
      firstItemIndex: u,
      fixedItemSize: p,
      fixedGroupSize: b,
      gap: A,
      groupIndices: c,
      heightEstimates: g,
      itemSize: w,
      listRefresh: l,
      shiftWith: o,
      shiftWithOffset: d,
      sizeRanges: n,
      // output
      sizes: _,
      statefulTotalCount: s,
      totalCount: r,
      trackItemSizes: N,
      unshiftWith: a
    };
  },
  Oe(Or, vf),
  { singleton: !0 }
);
function JN(e) {
  return e.reduce(
    (t, n) => (t.groupIndices.push(t.totalCount), t.totalCount += n + 1, t),
    {
      groupIndices: [],
      totalCount: 0
    }
  );
}
const I_ = ke(
  ([{ groupIndices: e, sizes: t, totalCount: n }, { headerHeight: r, scrollTop: s }]) => {
    const a = we(), o = we(), u = Ut(W(a, Q(JN)));
    return ee(
      W(
        u,
        Q((c) => c.totalCount)
      ),
      n
    ), ee(
      W(
        u,
        Q((c) => c.groupIndices)
      ),
      e
    ), ee(
      W(
        qe(s, t, r),
        ie(([c, p]) => Al(p)),
        Q(([c, p, h]) => Sn(p.groupOffsetTree, Math.max(c - h, 0), "v")[0]),
        Me(),
        Q((c) => [c])
      ),
      o
    ), { groupCounts: a, topItemsIndexes: o };
  },
  Oe(zn, Ct)
), Lr = ke(
  ([{ log: e }]) => {
    const t = K(!1), n = Ut(
      W(
        t,
        ie((r) => r),
        Me()
      )
    );
    return Ne(t, (r) => {
      r && Le(e)("props updated", {}, Je.DEBUG);
    }), { didMount: n, propsReady: t };
  },
  Oe(Or),
  { singleton: !0 }
), ej = typeof document < "u" && "scrollBehavior" in document.documentElement.style;
function A_(e) {
  const t = typeof e == "number" ? { index: e } : e;
  return t.align || (t.align = "start"), (!t.behavior || !ej) && (t.behavior = "auto"), t.offset === void 0 && (t.offset = 0), t;
}
const Si = ke(
  ([
    { gap: e, listRefresh: t, sizes: n, totalCount: r },
    {
      fixedFooterHeight: s,
      fixedHeaderHeight: a,
      footerHeight: o,
      headerHeight: u,
      scrollingInProgress: c,
      scrollTo: p,
      smoothScrollTargetReached: h,
      viewportHeight: b
    },
    { log: g }
  ]) => {
    const w = we(), E = we(), A = K(0);
    let D = null, _ = null, x = null;
    function N() {
      D !== null && (D(), D = null), x !== null && (x(), x = null), _ && (clearTimeout(_), _ = null), me(c, !1);
    }
    return ee(
      W(
        w,
        he(n, b, r, A, u, o, g),
        he(e, a, s),
        Q(
          ([
            [l, f, d, m, v, k, S, C],
            L,
            B,
            P
          ]) => {
            const z = A_(l), { align: j, behavior: $, offset: O } = z, F = m - 1, H = T_(z, f, F);
            let G = fi(H, f.offsetTree, L) + k;
            j === "end" ? (G += B + Sn(f.sizeTree, H)[1] - d + P, H === F && (G += S)) : j === "center" ? G += (B + Sn(f.sizeTree, H)[1] - d + P) / 2 : G -= v, O !== void 0 && O !== 0 && (G += O);
            const Z = (oe) => {
              N(), oe ? (C("retrying to scroll to", { location: l }, Je.DEBUG), me(w, l)) : (me(E, !0), C("list did not change, scroll successful", {}, Je.DEBUG));
            };
            if (N(), $ === "smooth") {
              let oe = !1;
              x = Ne(t, (ne) => {
                oe = oe || ne;
              }), D = wn(h, () => {
                Z(oe);
              });
            } else
              D = wn(W(t, tj(150)), Z);
            return _ = setTimeout(() => {
              N();
            }, 1200), me(c, !0), C("scrolling from index to", { behavior: $, index: H, top: G }, Je.DEBUG), { behavior: $, top: G };
          }
        )
      ),
      p
    ), {
      scrollTargetReached: E,
      scrollToIndex: w,
      topListHeight: A
    };
  },
  Oe(zn, Ct, Or),
  { singleton: !0 }
);
function tj(e) {
  return (t) => {
    const n = setTimeout(() => {
      t(!1);
    }, e);
    return (r) => {
      r && (t(!0), clearTimeout(n));
    };
  };
}
function yf(e, t) {
  e === 0 ? t() : requestAnimationFrame(() => {
    yf(e - 1, t);
  });
}
function xf(e, t) {
  const n = t - 1;
  return typeof e == "number" ? e : e.index === "LAST" ? n : e.index;
}
const ki = ke(
  ([{ defaultItemSize: e, listRefresh: t, sizes: n }, { scrollTop: r }, { scrollTargetReached: s, scrollToIndex: a }, { didMount: o }]) => {
    const u = K(!0), c = K(0), p = K(!0);
    return ee(
      W(
        o,
        he(c),
        ie(([h, b]) => b !== 0),
        Pn(!1)
      ),
      u
    ), ee(
      W(
        o,
        he(c),
        ie(([h, b]) => b !== 0),
        Pn(!1)
      ),
      p
    ), Ne(
      W(
        qe(t, o),
        he(u, n, e, p),
        ie(([[, h], b, { sizeTree: g }, w, E]) => h && (!Ie(g) || mf(w)) && !b && !E),
        he(c)
      ),
      ([, h]) => {
        wn(s, () => {
          me(p, !0);
        }), yf(4, () => {
          wn(r, () => {
            me(u, !0);
          }), me(a, h);
        });
      }
    ), {
      initialItemFinalLocationReached: p,
      initialTopMostItemIndex: c,
      scrolledToInitialItem: u
    };
  },
  Oe(zn, Ct, Si, Lr),
  { singleton: !0 }
);
function P_(e, t) {
  return Math.abs(e - t) < 1.01;
}
const pi = "up", Fa = "down", nj = "none", rj = {
  atBottom: !1,
  notAtBottomBecause: "NOT_SHOWING_LAST_ITEM",
  state: {
    offsetBottom: 0,
    scrollHeight: 0,
    scrollTop: 0,
    viewportHeight: 0
  }
}, sj = 0, Ni = ke(([{ footerHeight: e, headerHeight: t, scrollBy: n, scrollContainerState: r, scrollTop: s, viewportHeight: a }]) => {
  const o = K(!1), u = K(!0), c = we(), p = we(), h = K(4), b = K(sj), g = yt(
    W(
      Vc(W(ae(s), is(1), Pn(!0)), W(ae(s), is(1), Pn(!1), wm(100))),
      Me()
    ),
    !1
  ), w = yt(
    W(Vc(W(n, Pn(!0)), W(n, Pn(!1), wm(200))), Me()),
    !1
  );
  ee(
    W(
      qe(ae(s), ae(b)),
      Q(([x, N]) => x <= N),
      Me()
    ),
    u
  ), ee(W(u, Qn(50)), p);
  const E = Ut(
    W(
      qe(r, ae(a), ae(t), ae(e), ae(h)),
      Mn((x, [{ scrollHeight: N, scrollTop: l }, f, d, m, v]) => {
        const k = l + f - N > -v, S = {
          scrollHeight: N,
          scrollTop: l,
          viewportHeight: f
        };
        if (k) {
          let L, B;
          return l > x.state.scrollTop ? (L = "SCROLLED_DOWN", B = x.state.scrollTop - l) : (L = "SIZE_DECREASED", B = x.state.scrollTop - l || x.scrollTopDelta), {
            atBottom: !0,
            atBottomBecause: L,
            scrollTopDelta: B,
            state: S
          };
        }
        let C;
        return S.scrollHeight > x.state.scrollHeight ? C = "SIZE_INCREASED" : f < x.state.viewportHeight ? C = "VIEWPORT_HEIGHT_DECREASING" : l < x.state.scrollTop ? C = "SCROLLING_UPWARDS" : C = "NOT_FULLY_SCROLLED_TO_LAST_ITEM_BOTTOM", {
          atBottom: !1,
          notAtBottomBecause: C,
          state: S
        };
      }, rj),
      Me((x, N) => x !== void 0 && x.atBottom === N.atBottom)
    )
  ), A = yt(
    W(
      r,
      Mn(
        (x, { scrollHeight: N, scrollTop: l, viewportHeight: f }) => {
          if (!P_(x.scrollHeight, N)) {
            const d = N - (l + f) < 1;
            return x.scrollTop !== l && d ? {
              changed: !0,
              jump: x.scrollTop - l,
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
      ie((x) => x.changed),
      Q((x) => x.jump)
    ),
    0
  );
  ee(
    W(
      E,
      Q((x) => x.atBottom)
    ),
    o
  ), ee(W(o, Qn(50)), c);
  const D = K(Fa);
  ee(
    W(
      r,
      Q(({ scrollTop: x }) => x),
      Me(),
      Mn(
        (x, N) => Le(w) ? { direction: x.direction, prevScrollTop: N } : { direction: N < x.prevScrollTop ? pi : Fa, prevScrollTop: N },
        { direction: Fa, prevScrollTop: 0 }
      ),
      Q((x) => x.direction)
    ),
    D
  ), ee(W(r, Qn(50), Pn(nj)), D);
  const _ = K(0);
  return ee(
    W(
      g,
      ie((x) => !x),
      Pn(0)
    ),
    _
  ), ee(
    W(
      s,
      Qn(100),
      he(g),
      ie(([x, N]) => N),
      Mn(([x, N], [l]) => [N, l], [0, 0]),
      Q(([x, N]) => N - x)
    ),
    _
  ), {
    atBottomState: E,
    atBottomStateChange: c,
    atBottomThreshold: h,
    atTopStateChange: p,
    atTopThreshold: b,
    isAtBottom: o,
    isAtTop: u,
    isScrolling: g,
    lastJumpDueToItemResize: A,
    scrollDirection: D,
    scrollVelocity: _
  };
}, Oe(Ct)), mi = "top", hi = "bottom", Em = "none";
function Cm(e, t, n) {
  return typeof e == "number" ? n === pi && t === mi || n === Fa && t === hi ? e : 0 : n === pi ? t === mi ? e.main : e.reverse : t === hi ? e.main : e.reverse;
}
function Tm(e, t) {
  return typeof e == "number" ? e : e[t] ?? 0;
}
const wf = ke(
  ([{ deviation: e, fixedHeaderHeight: t, headerHeight: n, scrollTop: r, viewportHeight: s }]) => {
    const a = we(), o = K(0), u = K(0), c = K(0), p = yt(
      W(
        qe(
          ae(r),
          ae(s),
          ae(n),
          ae(a, di),
          ae(c),
          ae(o),
          ae(t),
          ae(e),
          ae(u)
        ),
        Q(
          ([
            h,
            b,
            g,
            [w, E],
            A,
            D,
            _,
            x,
            N
          ]) => {
            const l = h - x, f = D + _, d = Math.max(g - l, 0);
            let m = Em;
            const v = Tm(N, mi), k = Tm(N, hi);
            return w -= x, w += g + _, E += g + _, E -= x, w > h + f - v && (m = pi), E < h - d + b + k && (m = Fa), m !== Em ? [
              Math.max(l - g - Cm(A, mi, m) - v, 0),
              l - d - _ + b + Cm(A, hi, m) + k
            ] : null;
          }
        ),
        ie((h) => h !== null),
        Me(di)
      ),
      [0, 0]
    );
    return {
      increaseViewportBy: u,
      // input
      listBoundary: a,
      overscan: c,
      topListHeight: o,
      // output
      visibleRange: p
    };
  },
  Oe(Ct),
  { singleton: !0 }
);
function aj(e, t, n) {
  if (Al(t)) {
    const r = C_(e, t);
    return [
      { index: Sn(t.groupOffsetTree, r)[0], offset: 0, size: 0 },
      { data: n?.[0], index: r, offset: 0, size: 0 }
    ];
  }
  return [{ data: n?.[0], index: e, offset: 0, size: 0 }];
}
const ku = {
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
function To(e, t, n, r, s, a) {
  const { lastIndex: o, lastOffset: u, lastSize: c } = s;
  let p = 0, h = 0;
  if (e.length > 0) {
    p = e[0].offset;
    const A = e[e.length - 1];
    h = A.offset + A.size;
  }
  const b = n - o, g = u + b * c + (b - 1) * r, w = p, E = g - h;
  return {
    bottom: h,
    firstItemIndex: a,
    items: Im(e, s, a),
    offsetBottom: E,
    offsetTop: p,
    top: w,
    topItems: Im(t, s, a),
    topListHeight: t.reduce((A, D) => D.size + A, 0),
    totalCount: n
  };
}
function R_(e, t, n, r, s, a) {
  let o = 0;
  if (n.groupIndices.length > 0)
    for (const h of n.groupIndices) {
      if (h - o >= e)
        break;
      o++;
    }
  const u = e + o, c = xf(t, u), p = Array.from({ length: u }).map((h, b) => ({
    data: a[b + c],
    index: b + c,
    offset: 0,
    size: 0
  }));
  return To(p, [], u, s, n, r);
}
function Im(e, t, n) {
  if (e.length === 0)
    return [];
  if (!Al(t))
    return e.map((p) => ({ ...p, index: p.index + n, originalIndex: p.index }));
  const r = e[0].index, s = e[e.length - 1].index, a = [], o = Hs(t.groupOffsetTree, r, s);
  let u, c = 0;
  for (const p of e) {
    (!u || u.end < p.index) && (u = o.shift(), c = t.groupIndices.indexOf(u.start));
    let h;
    p.index === u.start ? h = {
      index: c,
      type: "group"
    } : h = {
      groupIndex: c,
      index: p.index - (c + 1) + n
    }, a.push({
      ...h,
      data: p.data,
      offset: p.offset,
      originalIndex: p.index,
      size: p.size
    });
  }
  return a;
}
function Am(e, t) {
  return e === void 0 ? 0 : typeof e == "number" ? e : e[t] ?? 0;
}
const cs = ke(
  ([
    { data: e, firstItemIndex: t, gap: n, sizes: r, totalCount: s },
    a,
    { listBoundary: o, topListHeight: u, visibleRange: c },
    { initialTopMostItemIndex: p, scrolledToInitialItem: h },
    { topListHeight: b },
    g,
    { didMount: w },
    { recalcInProgress: E }
  ]) => {
    const A = K([]), D = K(0), _ = we(), x = K(0);
    ee(a.topItemsIndexes, A);
    const N = yt(
      W(
        qe(
          w,
          E,
          ae(c, di),
          ae(s),
          ae(r),
          ae(p),
          h,
          ae(A),
          ae(t),
          ae(n),
          ae(x),
          e
        ),
        ie(([m, v, , k, , , , , , , , S]) => {
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
            P,
            z,
            j,
            $
          ]) => {
            const O = S, { offsetTree: F, sizeTree: H } = O, G = Le(D);
            if (k === 0)
              return { ...ku, totalCount: k };
            if (m === 0 && v === 0)
              return G === 0 ? { ...ku, totalCount: k } : R_(G, C, S, P, z, $ || []);
            if (Ie(H))
              return G > 0 ? null : To(
                aj(xf(C, k), O, $),
                [],
                k,
                z,
                O,
                P
              );
            const Z = [];
            if (B.length > 0) {
              const re = B[0], de = B[B.length - 1];
              let ge = 0;
              for (const be of Hs(H, re, de)) {
                const ye = be.value, Ce = Math.max(be.start, re), et = Math.min(be.end, de);
                for (let je = Ce; je <= et; je++)
                  Z.push({ data: $?.[je], index: je, offset: ge, size: ye }), ge += ye;
              }
            }
            if (!L)
              return To([], Z, k, z, O, P);
            const oe = B.length > 0 ? B[B.length - 1] + 1 : 0, ne = KN(F, m, v, oe);
            if (ne.length === 0)
              return null;
            const _e = k - 1, te = Il([], (re) => {
              for (const de of ne) {
                const ge = de.value;
                let be = ge.offset, ye = de.start;
                const Ce = ge.size;
                if (ge.offset < m) {
                  ye += Math.floor((m - ge.offset + z) / (Ce + z));
                  const je = ye - de.start;
                  be += je * Ce + je * z;
                }
                ye < oe && (be += (oe - ye) * Ce, ye = oe);
                const et = Math.min(de.end, _e);
                for (let je = ye; je <= et && !(be >= v); je++)
                  re.push({ data: $?.[je], index: je, offset: be, size: Ce }), be += Ce + z;
              }
            }), Y = Am(j, mi), U = Am(j, hi);
            if (te.length > 0 && (Y > 0 || U > 0)) {
              const re = te[0], de = te[te.length - 1];
              if (Y > 0 && re.index > oe) {
                const ge = Math.min(Y, re.index - oe), be = [];
                let ye = re.offset;
                for (let Ce = re.index - 1; Ce >= re.index - ge; Ce--) {
                  const et = Hs(H, Ce, Ce)[0]?.value ?? re.size;
                  ye -= et + z, be.unshift({ data: $?.[Ce], index: Ce, offset: ye, size: et });
                }
                te.unshift(...be);
              }
              if (U > 0 && de.index < _e) {
                const ge = Math.min(U, _e - de.index);
                let be = de.offset + de.size + z;
                for (let ye = de.index + 1; ye <= de.index + ge; ye++) {
                  const Ce = Hs(H, ye, ye)[0]?.value ?? de.size;
                  te.push({ data: $?.[ye], index: ye, offset: be, size: Ce }), be += Ce + z;
                }
              }
            }
            return To(te, Z, k, z, O, P);
          }
        ),
        //@ts-expect-error filter needs to be fixed
        ie((m) => m !== null),
        Me()
      ),
      ku
    );
    ee(
      W(
        e,
        ie(mf),
        Q((m) => m?.length)
      ),
      s
    ), ee(
      W(
        N,
        Q((m) => m.topListHeight)
      ),
      b
    ), ee(b, u), ee(
      W(
        N,
        Q((m) => [m.top, m.bottom])
      ),
      o
    ), ee(
      W(
        N,
        Q((m) => m.items)
      ),
      _
    );
    const l = Ut(
      W(
        N,
        ie(({ items: m }) => m.length > 0),
        he(s, e),
        ie(([{ items: m }, v]) => m[m.length - 1].originalIndex === v - 1),
        Q(([, m, v]) => [m - 1, v]),
        Me(di),
        Q(([m]) => m)
      )
    ), f = Ut(
      W(
        N,
        Qn(200),
        ie(({ items: m, topItems: v }) => m.length > 0 && m[0].originalIndex === v.length),
        Q(({ items: m }) => m[0].index),
        Me()
      )
    ), d = Ut(
      W(
        N,
        ie(({ items: m }) => m.length > 0),
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
      itemsRendered: _,
      listState: N,
      minOverscanItemCount: x,
      rangeChanged: d,
      startReached: f,
      topItemsIndexes: A,
      ...g
    };
  },
  Oe(
    zn,
    I_,
    wf,
    ki,
    Si,
    Ni,
    Lr,
    vf
  ),
  { singleton: !0 }
), M_ = ke(
  ([{ fixedFooterHeight: e, fixedHeaderHeight: t, footerHeight: n, headerHeight: r }, { listState: s }]) => {
    const a = we(), o = yt(
      W(
        qe(n, e, r, t, s),
        Q(([u, c, p, h, b]) => u + c + p + h + b.offsetBottom + b.bottom)
      ),
      0
    );
    return ee(ae(o), a), { totalListHeight: o, totalListHeightChanged: a };
  },
  Oe(Ct, cs),
  { singleton: !0 }
), ij = ke(
  ([{ viewportHeight: e }, { totalListHeight: t }]) => {
    const n = K(!1), r = yt(
      W(
        qe(n, e, t),
        ie(([s]) => s),
        Q(([, s, a]) => Math.max(0, s - a)),
        Qn(0),
        Me()
      ),
      0
    );
    return { alignToBottom: n, paddingTopAddition: r };
  },
  Oe(Ct, M_),
  { singleton: !0 }
), D_ = ke(() => ({
  context: K(null)
})), oj = ({
  itemBottom: e,
  itemTop: t,
  locationParams: { align: n, behavior: r, ...s },
  viewportBottom: a,
  viewportTop: o
}) => t < o ? { ...s, align: n ?? "start", ...r !== void 0 ? { behavior: r } : {} } : e > a ? { ...s, align: n ?? "end", ...r !== void 0 ? { behavior: r } : {} } : null, O_ = ke(
  ([
    { gap: e, sizes: t, totalCount: n },
    { fixedFooterHeight: r, fixedHeaderHeight: s, headerHeight: a, scrollingInProgress: o, scrollTop: u, viewportHeight: c },
    { scrollToIndex: p }
  ]) => {
    const h = we();
    return ee(
      W(
        h,
        he(t, c, n, a, s, r, u),
        he(e),
        Q(([[b, g, w, E, A, D, _, x], N]) => {
          const { calculateViewLocation: l = oj, done: f, ...d } = b, m = T_(b, g, E - 1), v = fi(m, g.offsetTree, N) + A + D, k = v + Sn(g.sizeTree, m)[1], S = x + D, C = x + w - _, L = l({
            itemBottom: k,
            itemTop: v,
            locationParams: d,
            viewportBottom: C,
            viewportTop: S
          });
          return L !== null ? f && wn(
            W(
              o,
              ie((B) => !B),
              // skips the initial publish of false, and the cleanup call.
              // but if scrollingInProgress is true, we skip the initial publish.
              is(Le(o) ? 1 : 2)
            ),
            f
          ) : f?.(), L;
        }),
        ie((b) => b !== null)
      ),
      p
    ), {
      scrollIntoView: h
    };
  },
  Oe(zn, Ct, Si, cs, Or),
  { singleton: !0 }
);
function Pm(e) {
  return e === !1 ? !1 : e === "smooth" ? "smooth" : "auto";
}
const lj = (e, t) => typeof e == "function" ? Pm(e(t)) : t && Pm(e), uj = ke(
  ([
    { listRefresh: e, totalCount: t, fixedItemSize: n, data: r },
    { atBottomState: s, isAtBottom: a },
    { scrollToIndex: o },
    { scrolledToInitialItem: u },
    { didMount: c, propsReady: p },
    { log: h },
    { scrollingInProgress: b },
    { context: g },
    { scrollIntoView: w }
  ]) => {
    const E = K(!1), A = we();
    let D = null;
    function _(f) {
      me(o, {
        align: "end",
        behavior: f,
        index: "LAST"
      });
    }
    Ne(
      W(
        qe(W(ae(t), is(1)), c),
        he(ae(E), a, u, b),
        Q(([[f, d], m, v, k, S]) => {
          let C = d && k, L = "auto";
          return C && (L = lj(m, v || S), C = C && L !== !1), { followOutputBehavior: L, shouldFollow: C, totalCount: f };
        }),
        ie(({ shouldFollow: f }) => f)
      ),
      ({ followOutputBehavior: f, totalCount: d }) => {
        D !== null && (D(), D = null), Le(n) !== void 0 ? requestAnimationFrame(() => {
          Le(h)("following output to ", { totalCount: d }, Je.DEBUG), _(f);
        }) : D = wn(e, () => {
          Le(h)("following output to ", { totalCount: d }, Je.DEBUG), _(f), D = null;
        });
      }
    );
    function x(f) {
      const d = wn(s, (m) => {
        f && !m.atBottom && m.notAtBottomBecause === "SIZE_INCREASED" && D === null && (Le(h)("scrolling to bottom due to increased size", {}, Je.DEBUG), _("auto"));
      });
      setTimeout(d, 100);
    }
    Ne(
      W(
        qe(ae(E), t, p),
        ie(([f, , d]) => f !== !1 && d),
        Mn(
          ({ value: f }, [, d]) => ({ refreshed: f === d, value: d }),
          { refreshed: !1, value: 0 }
        ),
        ie(({ refreshed: f }) => f),
        he(E, t)
      ),
      ([, f]) => {
        Le(u) && x(f !== !1);
      }
    ), Ne(A, () => {
      x(Le(E) !== !1);
    }), Ne(qe(ae(E), s), ([f, d]) => {
      f !== !1 && !d.atBottom && d.notAtBottomBecause === "VIEWPORT_HEIGHT_DECREASING" && _("auto");
    });
    const N = K(null), l = we();
    return ee(
      Vc(
        W(
          ae(r),
          Q((f) => f?.length ?? 0)
        ),
        W(ae(t))
      ),
      l
    ), Ne(
      W(
        qe(W(l, is(1)), c),
        he(ae(N), u, b, g),
        Q(([[f, d], m, v, k, S]) => d && v && m?.({ context: S, totalCount: f, scrollingInProgress: k })),
        ie((f) => !!f),
        Qn(0)
      ),
      (f) => {
        D !== null && (D(), D = null), Le(n) !== void 0 ? requestAnimationFrame(() => {
          Le(h)("scrolling into view", {}), me(w, f);
        }) : D = wn(e, () => {
          Le(h)("scrolling into view", {}), me(w, f), D = null;
        });
      }
    ), { autoscrollToBottom: A, followOutput: E, scrollIntoViewOnChange: N };
  },
  Oe(
    zn,
    Ni,
    Si,
    ki,
    Lr,
    Or,
    Ct,
    D_,
    O_
  )
), cj = ke(
  ([{ data: e, firstItemIndex: t, gap: n, sizes: r }, { initialTopMostItemIndex: s }, { initialItemCount: a, listState: o }, { didMount: u }]) => (ee(
    W(
      u,
      he(a),
      ie(([, c]) => c !== 0),
      he(s, r, t, n, e),
      Q(([[, c], p, h, b, g, w = []]) => R_(c, p, h, b, g, w))
    ),
    o
  ), {}),
  Oe(zn, ki, cs, Lr),
  { singleton: !0 }
), dj = ke(
  ([{ didMount: e }, { scrollTo: t }, { listState: n }]) => {
    const r = K(0);
    return Ne(
      W(
        e,
        he(r),
        ie(([, s]) => s !== 0),
        Q(([, s]) => ({ top: s }))
      ),
      (s) => {
        wn(
          W(
            n,
            is(1),
            ie((a) => a.items.length > 1)
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
  Oe(Lr, Ct, cs),
  { singleton: !0 }
), L_ = ke(
  ([{ scrollVelocity: e }]) => {
    const t = K(!1), n = we(), r = K(!1);
    return ee(
      W(
        e,
        he(r, t, n),
        ie(([s, a]) => a !== !1 && a !== void 0),
        Q(([s, a, o, u]) => {
          const { enter: c, exit: p } = a;
          if (o) {
            if (p(s, u))
              return !1;
          } else if (c(s, u))
            return !0;
          return o;
        }),
        Me()
      ),
      t
    ), Ne(
      W(qe(t, e, n), he(r)),
      ([[s, a, o], u]) => {
        s && u !== !1 && u !== void 0 && u.change && u.change(a, o);
      }
    ), { isSeeking: t, scrollSeekConfiguration: r, scrollSeekRangeChanged: n, scrollVelocity: e };
  },
  Oe(Ni),
  { singleton: !0 }
), bf = ke(([{ scrollContainerState: e, scrollTo: t }]) => {
  const n = we(), r = we(), s = we(), a = K(!1), o = K(void 0);
  return ee(
    W(
      qe(n, r),
      Q(([{ scrollTop: u, viewportHeight: c }, { offsetTop: p, listHeight: h }]) => ({
        scrollHeight: h,
        scrollTop: Math.max(0, u - p),
        viewportHeight: c
      }))
    ),
    e
  ), ee(
    W(
      t,
      he(r),
      Q(([u, { offsetTop: c }]) => ({
        ...u,
        top: u.top + c
      }))
    ),
    s
  ), {
    customScrollParent: o,
    // config
    useWindowScroll: a,
    // input
    windowScrollContainerState: n,
    // signals
    windowScrollTo: s,
    windowViewportRect: r
  };
}, Oe(Ct)), fj = ke(
  ([
    { sizeRanges: e, sizes: t },
    { headerHeight: n, scrollTop: r },
    { initialTopMostItemIndex: s },
    { didMount: a },
    { useWindowScroll: o, windowScrollContainerState: u, windowViewportRect: c }
  ]) => {
    const p = we(), h = K(void 0), b = K(null), g = K(null);
    return ee(u, b), ee(c, g), Ne(
      W(
        p,
        he(t, r, o, b, g, n)
      ),
      ([w, E, A, D, _, x, N]) => {
        const l = YN(E.sizeTree);
        D && _ !== null && x !== null && (A = _.scrollTop - x.offsetTop), A -= N, w({ ranges: l, scrollTop: A });
      }
    ), ee(W(h, ie(mf), Q(pj)), s), ee(
      W(
        a,
        he(h),
        ie(([, w]) => w !== void 0),
        Me(),
        Q(([, w]) => w.ranges)
      ),
      e
    ), {
      getState: p,
      restoreStateFrom: h
    };
  },
  Oe(zn, Ct, ki, Lr, bf)
);
function pj(e) {
  return { align: "start", index: 0, offset: e.scrollTop };
}
const mj = ke(([{ topItemsIndexes: e }]) => {
  const t = K(0);
  return ee(
    W(
      t,
      ie((n) => n >= 0),
      Q((n) => Array.from({ length: n }).map((r, s) => s))
    ),
    e
  ), { topItemCount: t };
}, Oe(cs));
function z_(e) {
  let t = !1, n;
  return () => (t || (t = !0, n = e()), n);
}
const hj = z_(() => /iP(ad|od|hone)/i.test(navigator.userAgent) && /WebKit/i.test(navigator.userAgent)), gj = ke(
  ([
    { deviation: e, scrollBy: t, scrollingInProgress: n, scrollTop: r },
    { isAtBottom: s, isScrolling: a, lastJumpDueToItemResize: o, scrollDirection: u },
    { listState: c },
    { beforeUnshiftWith: p, gap: h, shiftWithOffset: b, sizes: g },
    { log: w },
    { recalcInProgress: E }
  ]) => {
    const A = Ut(
      W(
        c,
        he(o),
        Mn(
          ([, _, x, N], [{ bottom: l, items: f, offsetBottom: d, totalCount: m }, v]) => {
            const k = l + d;
            let S = 0;
            return x === m && _.length > 0 && f.length > 0 && (f[0].originalIndex === 0 && _[0].originalIndex === 0 || (S = k - N, S !== 0 && (S += v))), [S, f, m, k];
          },
          [0, [], 0, 0]
        ),
        ie(([_]) => _ !== 0),
        he(r, u, n, s, w, E),
        ie(([, _, x, N, , , l]) => !l && !N && _ !== 0 && x === pi),
        Q(([[_], , , , , x]) => (x("Upward scrolling compensation", { amount: _ }, Je.DEBUG), _))
      )
    );
    function D(_) {
      _ > 0 ? (me(t, { behavior: "auto", top: -_ }), me(e, 0)) : (me(e, 0), me(t, { behavior: "auto", top: -_ }));
    }
    return Ne(W(A, he(e, a)), ([_, x, N]) => {
      N && hj() ? me(e, x - _) : D(-_);
    }), Ne(
      W(
        qe(yt(a, !1), e, E),
        ie(([_, x, N]) => !_ && !N && x !== 0),
        Q(([_, x]) => x),
        Qn(1)
      ),
      D
    ), ee(
      W(
        b,
        Q((_) => ({ top: -_ }))
      ),
      t
    ), Ne(
      W(
        p,
        he(g, h),
        Q(([_, { groupIndices: x, lastSize: N, sizeTree: l }, f]) => {
          function d(C) {
            return C * (N + f);
          }
          if (x.length === 0)
            return d(_);
          let m = 0;
          const v = ci(l, 0);
          let k = 0, S = 0;
          for (; k < _; ) {
            k++, m += v;
            let C = x.length === S + 1 ? 1 / 0 : x[S + 1] - x[S] - 1;
            k + C > _ && (m -= v, C = _ - k + 1), k += C, m += d(C), S++;
          }
          return m;
        })
      ),
      (_) => {
        me(e, _), requestAnimationFrame(() => {
          me(t, { top: _ }), requestAnimationFrame(() => {
            me(e, 0), me(E, !1);
          });
        });
      }
    ), { deviation: e };
  },
  Oe(Ct, Ni, cs, zn, Or, vf)
), vj = ke(
  ([
    e,
    t,
    n,
    r,
    s,
    a,
    o,
    u,
    c,
    p,
    h
  ]) => ({
    ...e,
    ...t,
    ...n,
    ...r,
    ...s,
    ...a,
    ...o,
    ...u,
    ...c,
    ...p,
    ...h
  }),
  Oe(
    wf,
    cj,
    Lr,
    L_,
    M_,
    dj,
    ij,
    bf,
    O_,
    Or,
    D_
  )
), B_ = ke(
  ([
    {
      data: e,
      defaultItemSize: t,
      firstItemIndex: n,
      fixedItemSize: r,
      fixedGroupSize: s,
      gap: a,
      groupIndices: o,
      heightEstimates: u,
      itemSize: c,
      sizeRanges: p,
      sizes: h,
      statefulTotalCount: b,
      totalCount: g,
      trackItemSizes: w
    },
    { initialItemFinalLocationReached: E, initialTopMostItemIndex: A, scrolledToInitialItem: D },
    _,
    x,
    N,
    l,
    { scrollToIndex: f },
    d,
    { topItemCount: m },
    { groupCounts: v },
    k
  ]) => {
    const { listState: S, minOverscanItemCount: C, topItemsIndexes: L, rangeChanged: B, ...P } = l;
    return ee(B, k.scrollSeekRangeChanged), ee(
      W(
        k.windowViewportRect,
        Q((z) => z.visibleHeight)
      ),
      _.viewportHeight
    ), {
      data: e,
      defaultItemHeight: t,
      firstItemIndex: n,
      fixedItemHeight: r,
      fixedGroupHeight: s,
      gap: a,
      groupCounts: v,
      heightEstimates: u,
      initialItemFinalLocationReached: E,
      initialTopMostItemIndex: A,
      scrolledToInitialItem: D,
      sizeRanges: p,
      topItemCount: m,
      topItemsIndexes: L,
      // input
      totalCount: g,
      ...N,
      groupIndices: o,
      itemSize: c,
      listState: S,
      minOverscanItemCount: C,
      scrollToIndex: f,
      // output
      statefulTotalCount: b,
      trackItemSizes: w,
      // exported from stateFlagsSystem
      rangeChanged: B,
      ...P,
      // the bag of IO from featureGroup1System
      ...k,
      ..._,
      sizes: h,
      ...x
    };
  },
  Oe(
    zn,
    ki,
    Ct,
    fj,
    uj,
    cs,
    Si,
    gj,
    mj,
    I_,
    vj
  )
);
function _j(e, t) {
  const n = {}, r = {};
  let s = 0;
  const a = e.length;
  for (; s < a; )
    r[e[s]] = 1, s += 1;
  for (const o in t)
    Object.hasOwn(r, o) || (n[o] = t[o]);
  return n;
}
const io = typeof document < "u" ? J.useLayoutEffect : J.useEffect;
function $_(e, t, n) {
  const r = Object.keys(t.required || {}), s = Object.keys(t.optional || {}), a = Object.keys(t.methods || {}), o = Object.keys(t.events || {}), u = J.createContext({});
  function c(D, _) {
    D.propsReady !== void 0 && me(D.propsReady, !1);
    for (const x of r) {
      const N = D[t.required[x]];
      me(N, _[x]);
    }
    for (const x of s)
      if (x in _) {
        const N = D[t.optional[x]];
        me(N, _[x]);
      }
    D.propsReady !== void 0 && me(D.propsReady, !0);
  }
  function p(D) {
    return a.reduce((_, x) => (_[x] = (N) => {
      const l = D[t.methods[x]];
      me(l, N);
    }, _), {});
  }
  function h(D) {
    return o.reduce((_, x) => (_[x] = RN(D[t.events[x]]), _), {});
  }
  const b = J.forwardRef(function(D, _) {
    const { children: x, ...N } = D, [l] = J.useState(() => Il(DN(e), (m) => {
      c(m, N);
    })), [f] = J.useState(xm(h, l));
    io(() => {
      for (const m of o)
        m in N && Ne(f[m], N[m]);
      return () => {
        Object.values(f).map(hf);
      };
    }, [N, f, l]), io(() => {
      c(l, N);
    }), J.useImperativeHandle(_, ym(p(l)));
    const d = n;
    return /* @__PURE__ */ i.jsx(u.Provider, { value: l, children: n !== void 0 ? /* @__PURE__ */ i.jsx(d, { ..._j([...r, ...s, ...o], N), children: x }) : x });
  }), g = (D) => {
    const _ = J.useContext(u);
    return J.useCallback(
      (x) => {
        me(_[D], x);
      },
      [_, D]
    );
  }, w = (D) => {
    const _ = J.useContext(u)[D], x = J.useCallback(
      (N) => Ne(_, N),
      [_]
    );
    return J.useSyncExternalStore(
      x,
      () => Le(_),
      () => Le(_)
    );
  }, E = (D) => {
    const _ = J.useContext(u)[D], [x, N] = J.useState(xm(Le, _));
    return io(
      () => Ne(_, (l) => {
        l !== x && N(ym(l));
      }),
      [_, x]
    ), x;
  }, A = parseInt(J.version) >= 18 ? w : E;
  return {
    Component: b,
    useEmitter: (D, _) => {
      const x = J.useContext(u)[D];
      io(() => Ne(x, _), [_, x]);
    },
    useEmitterValue: A,
    usePublisher: g
  };
}
const F_ = J.createContext(void 0), H_ = J.createContext(void 0), Nu = "-webkit-sticky", Rm = "sticky", Sf = z_(() => {
  if (typeof document > "u")
    return Rm;
  const e = document.createElement("div");
  return e.style.position = Nu, e.style.position === Nu ? Nu : Rm;
}), U_ = typeof document < "u" ? J.useLayoutEffect : J.useEffect;
function ju(e) {
  return "self" in e;
}
function yj(e) {
  return "body" in e;
}
function W_(e, t, n, r = ra, s, a) {
  const o = J.useRef(null), u = J.useRef(null), c = J.useRef(null), p = J.useCallback(
    (g) => {
      let w, E, A;
      const D = g.target;
      if (yj(D) || ju(D)) {
        const x = ju(D) ? D : D.defaultView;
        A = a === !0 ? Qr(x, x.scrollX) : x.scrollY, w = a === !0 ? x.document.documentElement.scrollWidth : x.document.documentElement.scrollHeight, E = a === !0 ? x.innerWidth : x.innerHeight;
      } else
        A = a === !0 ? Qr(D, D.scrollLeft) : D.scrollTop, w = a === !0 ? D.scrollWidth : D.scrollHeight, E = a === !0 ? D.offsetWidth : D.offsetHeight;
      const _ = () => {
        e({
          scrollHeight: w,
          scrollTop: Math.max(A, 0),
          viewportHeight: E
        });
      };
      g.suppressFlushSync === !0 ? _() : EN.flushSync(_), u.current !== null && (A === u.current || A <= 0 || A === w - E) && (u.current = null, t(!0), c.current && (clearTimeout(c.current), c.current = null));
    },
    [e, t, a]
  );
  J.useEffect(() => {
    const g = s || o.current;
    return bm(g), r(s || o.current), p({ suppressFlushSync: !0, target: g }), g.addEventListener("scroll", p, { passive: !0 }), () => {
      bm(g), r(null), g.removeEventListener("scroll", p);
    };
  }, [o, p, n, r, s]);
  function h(g) {
    const w = o.current;
    if (!w || (a === !0 ? "offsetWidth" in w && w.offsetWidth === 0 : "offsetHeight" in w && w.offsetHeight === 0))
      return;
    const E = g.behavior === "smooth";
    let A, D, _;
    ju(w) ? (D = Math.max(
      Ar(w.document.documentElement, a === !0 ? "width" : "height"),
      a === !0 ? w.document.documentElement.scrollWidth : w.document.documentElement.scrollHeight
    ), A = a === !0 ? w.innerWidth : w.innerHeight, _ = a === !0 ? Qr(w, w.scrollX) : w.scrollY) : (D = w[a === !0 ? "scrollWidth" : "scrollHeight"], A = Ar(w, a === !0 ? "width" : "height"), _ = a === !0 ? Qr(w, w.scrollLeft) : w.scrollTop);
    const x = D - A;
    if (g.top === void 0) {
      w.scrollTo(g);
      return;
    }
    const N = Math.ceil(Math.max(Math.min(x, g.top), 0));
    if (g.top = N, P_(A, D) || N === _) {
      e({ scrollHeight: D, scrollTop: _, viewportHeight: A }), E && t(!0);
      return;
    }
    E ? (u.current = N, c.current && clearTimeout(c.current), c.current = setTimeout(() => {
      c.current = null, u.current = null, t(!0);
    }, 1e3)) : u.current = null, a === !0 && (g = {
      ...g.behavior !== void 0 ? { behavior: g.behavior } : {},
      left: Sm(w, N)
    }), w.scrollTo(g);
  }
  function b(g) {
    a === !0 && (g = {
      ...g.behavior !== void 0 ? { behavior: g.behavior } : {},
      ...g.top !== void 0 ? { left: Sm(o.current, g.top) } : {}
    }), o.current.scrollBy(g);
  }
  return { scrollByCallback: b, scrollerRef: o, scrollToCallback: h };
}
function kf(e) {
  return e;
}
const xj = /* @__PURE__ */ ke(() => {
  const e = K((u) => `Item ${u}`), t = K((u) => `Group ${u}`), n = K({}), r = K(kf), s = K("div"), a = K(ra), o = (u, c = null) => yt(
    W(
      n,
      Q((p) => p[u]),
      Me()
    ),
    c
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
    scrollerRef: a,
    ScrollSeekPlaceholder: o("ScrollSeekPlaceholder"),
    TopItemListComponent: o("TopItemList")
  };
}), wj = /* @__PURE__ */ ke(
  ([e, t]) => ({ ...e, ...t }),
  Oe(B_, xj)
), bj = ({ height: e }) => /* @__PURE__ */ i.jsx("div", { style: { height: e } }), Sj = { overflowAnchor: "none", position: Sf(), zIndex: 1 }, G_ = { overflowAnchor: "none" }, kj = { ...G_, display: "inline-block", height: "100%" }, Mm = /* @__PURE__ */ J.memo(function({ showTopList: e = !1 }) {
  const t = ue("listState"), n = nn("sizeRanges"), r = ue("useWindowScroll"), s = ue("customScrollParent"), a = nn("windowScrollContainerState"), o = nn("scrollContainerState"), u = s || r ? a : o, c = ue("itemContent"), p = ue("context"), h = ue("groupContent"), b = ue("trackItemSizes"), g = ue("itemSize"), w = ue("log"), E = nn("gap"), A = ue("horizontalDirection"), { callbackRef: D } = BN(
    n,
    g,
    b,
    e ? ra : u,
    w,
    E,
    s,
    A,
    ue("skipAnimationFrameInResizeObserver")
  ), [_, x] = J.useState(0);
  jf("deviation", (P) => {
    _ !== P && x(P);
  });
  const N = ue("EmptyPlaceholder"), l = ue("ScrollSeekPlaceholder") ?? bj, f = ue("ListComponent"), d = ue("ItemComponent"), m = ue("GroupComponent"), v = ue("computeItemKey"), k = ue("isSeeking"), S = ue("groupIndices").length > 0, C = ue("alignToBottom"), L = ue("initialItemFinalLocationReached"), B = e ? {} : {
    boxSizing: "border-box",
    ...A ? {
      display: "inline-block",
      height: "100%",
      marginInlineStart: _ !== 0 ? _ : C ? "auto" : 0,
      paddingInlineEnd: t.offsetBottom,
      paddingInlineStart: t.offsetTop,
      whiteSpace: "nowrap"
    } : {
      marginTop: _ !== 0 ? _ : C ? "auto" : 0,
      paddingBottom: t.offsetBottom,
      paddingTop: t.offsetTop
    },
    ...L ? {} : { visibility: "hidden" }
  };
  return !e && t.totalCount === 0 && N !== null && N !== void 0 ? /* @__PURE__ */ i.jsx(N, { ..._t(N, p) }) : /* @__PURE__ */ i.jsx(
    f,
    {
      ..._t(f, p),
      "data-testid": e ? "virtuoso-top-item-list" : "virtuoso-item-list",
      ref: D,
      style: B,
      children: (e ? t.topItems : t.items).map((P) => {
        const z = P.originalIndex, j = v(z + t.firstItemIndex, P.data, p);
        return k ? /* @__PURE__ */ R.createElement(
          l,
          {
            ..._t(l, p),
            height: P.size,
            index: P.index,
            key: j,
            type: P.type || "item",
            ...P.type === "group" ? {} : { groupIndex: P.groupIndex }
          }
        ) : P.type === "group" ? /* @__PURE__ */ R.createElement(
          m,
          {
            ..._t(m, p),
            "data-index": z,
            "data-item-index": P.index,
            "data-known-size": P.size,
            key: j,
            style: Sj
          },
          h(P.index, p)
        ) : /* @__PURE__ */ R.createElement(
          d,
          {
            ..._t(d, p),
            ...Cj(d, P.data),
            "data-index": z,
            "data-item-group-index": P.groupIndex,
            "data-item-index": P.index,
            "data-known-size": P.size,
            key: j,
            style: A ? kj : G_
          },
          S ? c(P.index, P.groupIndex, P.data, p) : c(P.index, P.data, p)
        );
      })
    }
  );
}), Nj = {
  height: "100%",
  outline: "none",
  overflowY: "auto",
  position: "relative",
  WebkitOverflowScrolling: "touch"
}, jj = {
  outline: "none",
  overflowX: "auto",
  position: "relative"
}, Nf = (e) => ({
  height: "100%",
  position: "absolute",
  top: 0,
  width: "100%",
  ...e ? { display: "flex", flexDirection: "column" } : void 0
}), V_ = (e, t, n = 0) => ({
  ...Nf(e),
  position: t ? "relative" : "absolute",
  top: t ? -n : 0
}), Ej = {
  position: Sf(),
  top: 0,
  width: "100%",
  zIndex: 1
};
function _t(e, t) {
  if (typeof e != "string")
    return { context: t };
}
function Cj(e, t) {
  return { item: typeof e == "string" ? void 0 : t };
}
const Tj = /* @__PURE__ */ J.memo(function() {
  const e = ue("HeaderComponent"), t = nn("headerHeight"), n = ue("HeaderFooterTag"), r = us(
    J.useMemo(
      () => (a) => {
        t(Ar(a, "height"));
      },
      [t]
    ),
    !0,
    ue("skipAnimationFrameInResizeObserver")
  ), s = ue("context");
  return e != null ? /* @__PURE__ */ i.jsx(n, { ref: r, children: /* @__PURE__ */ i.jsx(e, { ..._t(e, s) }) }) : null;
}), Ij = /* @__PURE__ */ J.memo(function() {
  const e = ue("FooterComponent"), t = nn("footerHeight"), n = ue("HeaderFooterTag"), r = us(
    J.useMemo(
      () => (a) => {
        t(Ar(a, "height"));
      },
      [t]
    ),
    !0,
    ue("skipAnimationFrameInResizeObserver")
  ), s = ue("context");
  return e != null ? /* @__PURE__ */ i.jsx(n, { ref: r, children: /* @__PURE__ */ i.jsx(e, { ..._t(e, s) }) }) : null;
});
function K_({ useEmitter: e, useEmitterValue: t, usePublisher: n }) {
  return J.memo(function({ children: r, style: s, context: a, ...o }) {
    const u = n("scrollContainerState"), c = t("ScrollerComponent"), p = n("smoothScrollTargetReached"), h = t("scrollerRef"), b = t("horizontalDirection") || !1, { scrollByCallback: g, scrollerRef: w, scrollToCallback: E } = W_(
      u,
      p,
      c,
      h,
      void 0,
      b
    );
    return e("scrollTo", E), e("scrollBy", g), /* @__PURE__ */ i.jsx(
      c,
      {
        "data-testid": "virtuoso-scroller",
        "data-virtuoso-scroller": !0,
        ref: w,
        style: { ...b ? jj : Nj, ...s },
        tabIndex: 0,
        ...o,
        ..._t(c, a),
        children: r
      }
    );
  });
}
function q_({ useEmitter: e, useEmitterValue: t, usePublisher: n }) {
  return J.memo(function({ children: r, style: s, context: a, ...o }) {
    const u = n("windowScrollContainerState"), c = t("ScrollerComponent"), p = n("smoothScrollTargetReached"), h = t("totalListHeight"), b = t("deviation"), g = t("customScrollParent"), w = J.useRef(null), E = t("scrollerRef"), { scrollByCallback: A, scrollerRef: D, scrollToCallback: _ } = W_(
      u,
      p,
      c,
      E,
      g
    );
    return U_(() => (D.current = g || w.current?.ownerDocument.defaultView, () => {
      D.current = null;
    }), [D, g]), e("windowScrollTo", _), e("scrollBy", A), /* @__PURE__ */ i.jsx(
      c,
      {
        ref: w,
        "data-virtuoso-scroller": !0,
        style: { position: "relative", ...s, ...h !== 0 ? { height: h + b } : void 0 },
        ...o,
        ..._t(c, a),
        children: r
      }
    );
  });
}
const Aj = ({ children: e }) => {
  const t = J.useContext(F_), n = nn("viewportHeight"), r = nn("fixedItemHeight"), s = ue("alignToBottom"), a = ue("horizontalDirection"), o = J.useMemo(
    () => g_(n, (c) => Ar(c, a ? "width" : "height")),
    [n, a]
  ), u = us(o, !0, ue("skipAnimationFrameInResizeObserver"));
  return J.useEffect(() => {
    t && (n(t.viewportHeight), r(t.itemHeight));
  }, [t, n, r]), /* @__PURE__ */ i.jsx("div", { "data-viewport-type": "element", ref: u, style: Nf(s), children: e });
}, Pj = ({ children: e }) => {
  const t = J.useContext(F_), n = nn("windowViewportRect"), r = nn("fixedItemHeight"), s = ue("customScrollParent"), a = ue("useWindowScroll"), o = ue("topListHeight"), u = x_(
    n,
    s,
    ue("skipAnimationFrameInResizeObserver")
  ), c = ue("alignToBottom");
  return J.useEffect(() => {
    t && (r(t.itemHeight), n({ listHeight: 0, offsetTop: 0, visibleHeight: t.viewportHeight, visibleWidth: 100 }));
  }, [t, n, r]), /* @__PURE__ */ i.jsx("div", { "data-viewport-type": "window", ref: u, style: V_(c, a, o), children: e });
}, Rj = ({ children: e }) => {
  const t = ue("TopItemListComponent") ?? "div", n = ue("headerHeight"), r = { ...Ej, marginTop: `${n}px` }, s = ue("context");
  return /* @__PURE__ */ i.jsx(t, { style: r, ..._t(t, s), children: e });
}, Mj = /* @__PURE__ */ J.memo(function(e) {
  const t = ue("useWindowScroll"), n = ue("topItemsIndexes").length > 0, r = ue("customScrollParent"), s = ue("context");
  return /* @__PURE__ */ i.jsxs(r || t ? Lj : Oj, { ...e, context: s, children: [
    n && /* @__PURE__ */ i.jsx(Rj, { children: /* @__PURE__ */ i.jsx(Mm, { showTopList: !0 }) }),
    /* @__PURE__ */ i.jsxs(r || t ? Pj : Aj, { children: [
      /* @__PURE__ */ i.jsx(Tj, {}),
      /* @__PURE__ */ i.jsx(Mm, {}),
      /* @__PURE__ */ i.jsx(Ij, {})
    ] })
  ] });
}), {
  Component: Dj,
  useEmitter: jf,
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
  Mj
), Oj = /* @__PURE__ */ K_({ useEmitter: jf, useEmitterValue: ue, usePublisher: nn }), Lj = /* @__PURE__ */ q_({ useEmitter: jf, useEmitterValue: ue, usePublisher: nn }), Y_ = Dj, zj = /* @__PURE__ */ ke(() => {
  const e = K((p) => /* @__PURE__ */ i.jsxs("td", { children: [
    "Item $",
    p
  ] })), t = K(null), n = K((p) => /* @__PURE__ */ i.jsxs("td", { colSpan: 1e3, children: [
    "Group ",
    p
  ] })), r = K(null), s = K(null), a = K({}), o = K(kf), u = K(ra), c = (p, h = null) => yt(
    W(
      a,
      Q((b) => b[p]),
      Me()
    ),
    h
  );
  return {
    components: a,
    computeItemKey: o,
    context: t,
    EmptyPlaceholder: c("EmptyPlaceholder"),
    FillerRow: c("FillerRow"),
    fixedFooterContent: s,
    fixedHeaderContent: r,
    itemContent: e,
    groupContent: n,
    ScrollerComponent: c("Scroller", "div"),
    scrollerRef: u,
    ScrollSeekPlaceholder: c("ScrollSeekPlaceholder"),
    TableBodyComponent: c("TableBody", "tbody"),
    TableComponent: c("Table", "table"),
    TableFooterComponent: c("TableFoot", "tfoot"),
    TableHeadComponent: c("TableHead", "thead"),
    TableRowComponent: c("TableRow", "tr"),
    GroupComponent: c("Group", "tr")
  };
});
Oe(B_, zj);
Sf();
const Dm = {
  bottom: 0,
  itemHeight: 0,
  items: [],
  itemWidth: 0,
  offsetBottom: 0,
  offsetTop: 0,
  top: 0
}, Bj = {
  bottom: 0,
  itemHeight: 0,
  items: [{ index: 0 }],
  itemWidth: 0,
  offsetBottom: 0,
  offsetTop: 0,
  top: 0
}, { ceil: Om, floor: ul, max: Ha, min: Eu, round: Lm } = Math;
function zm(e, t, n) {
  return Array.from({ length: t - e + 1 }).map((r, s) => ({ data: n === null ? null : n[s + e], index: s + e }));
}
function $j(e) {
  return {
    ...Bj,
    items: e
  };
}
function oo(e, t) {
  return e !== void 0 && e.width === t.width && e.height === t.height;
}
function Fj(e, t) {
  return e !== void 0 && e.column === t.column && e.row === t.row;
}
const Hj = /* @__PURE__ */ ke(
  ([
    { increaseViewportBy: e, listBoundary: t, overscan: n, visibleRange: r },
    { footerHeight: s, headerHeight: a, scrollBy: o, scrollContainerState: u, scrollTo: c, scrollTop: p, smoothScrollTargetReached: h, viewportHeight: b },
    g,
    w,
    { didMount: E, propsReady: A },
    { customScrollParent: D, useWindowScroll: _, windowScrollContainerState: x, windowScrollTo: N, windowViewportRect: l },
    f
  ]) => {
    const d = K(0), m = K(0), v = K(Dm), k = K({ height: 0, width: 0 }), S = K({ height: 0, width: 0 }), C = we(), L = we(), B = K(0), P = K(null), z = K({ column: 0, row: 0 }), j = we(), $ = we(), O = K(!1), F = K(0), H = K(!0), G = K(!1), Z = K(!1);
    Ne(
      W(
        E,
        he(F),
        ie(([U, re]) => re !== 0)
      ),
      () => {
        me(H, !1);
      }
    ), Ne(
      W(
        qe(E, H, S, k, F, G),
        ie(([U, re, de, ge, , be]) => U && !re && de.height !== 0 && ge.height !== 0 && !be)
      ),
      ([, , , , U]) => {
        me(G, !0), yf(1, () => {
          me(C, U);
        }), wn(W(p), () => {
          me(t, [0, 0]), me(H, !0);
        });
      }
    ), ee(
      W(
        $,
        ie((U) => U != null && U.scrollTop > 0),
        Pn(0)
      ),
      m
    ), Ne(
      W(
        E,
        he($),
        ie(([, U]) => U != null)
      ),
      ([, U]) => {
        U && (me(k, U.viewport), me(S, U.item), me(z, U.gap), U.scrollTop > 0 && (me(O, !0), wn(W(p, is(1)), (re) => {
          me(O, !1);
        }), me(c, { top: U.scrollTop })));
      }
    ), ee(
      W(
        k,
        Q(({ height: U }) => U)
      ),
      b
    ), ee(
      W(
        qe(
          ae(k, oo),
          ae(S, oo),
          ae(z, (U, re) => U !== void 0 && U.column === re.column && U.row === re.row),
          ae(p)
        ),
        Q(([U, re, de, ge]) => ({
          gap: de,
          item: re,
          scrollTop: ge,
          viewport: U
        }))
      ),
      j
    ), ee(
      W(
        qe(
          ae(d),
          r,
          ae(z, Fj),
          ae(S, oo),
          ae(k, oo),
          ae(P),
          ae(m),
          ae(O),
          ae(H),
          ae(F)
        ),
        ie(([, , , , , , , U]) => !U),
        Q(
          ([
            U,
            [re, de],
            ge,
            be,
            ye,
            Ce,
            et,
            ,
            je,
            dt
          ]) => {
            const { column: tt, row: un } = ge, { height: kn, width: Kt } = be, { width: Bn } = ye;
            if (et === 0 && (U === 0 || Bn === 0))
              return Dm;
            if (Kt === 0) {
              const or = xf(dt, U), ds = or + Math.max(et - 1, 0);
              return $j(zm(or, ds, Ce));
            }
            const cn = Q_(Bn, Kt, tt);
            let Lt, qt;
            je ? re === 0 && de === 0 && et > 0 ? (Lt = 0, qt = et - 1) : (Lt = cn * ul((re + un) / (kn + un)), qt = cn * Om((de + un) / (kn + un)) - 1, qt = Eu(U - 1, Ha(qt, cn - 1)), Lt = Eu(qt, Ha(0, Lt))) : (Lt = 0, qt = -1);
            const zr = zm(Lt, qt, Ce), { bottom: ir, top: Nn } = Bm(ye, ge, be, zr), dn = Om(U / cn), Tt = dn * kn + (dn - 1) * un - ir;
            return { bottom: ir, itemHeight: kn, items: zr, itemWidth: Kt, offsetBottom: Tt, offsetTop: Nn, top: Nn };
          }
        )
      ),
      v
    ), ee(
      W(
        P,
        ie((U) => U !== null),
        Q((U) => U.length)
      ),
      d
    ), ee(
      W(
        qe(k, S, v, z),
        ie(([U, re, { items: de }]) => de.length > 0 && re.height !== 0 && U.height !== 0),
        Q(([U, re, { items: de }, ge]) => {
          const { bottom: be, top: ye } = Bm(U, ge, re, de);
          return [ye, be];
        }),
        Me(di)
      ),
      t
    );
    const oe = K(!1);
    ee(
      W(
        p,
        he(oe),
        Q(([U, re]) => re || U !== 0)
      ),
      oe
    );
    const ne = Ut(
      W(
        qe(v, d),
        ie(([{ items: U }]) => U.length > 0),
        he(oe),
        ie(([[U, re], de]) => {
          const ge = U.items[U.items.length - 1].index === re - 1;
          return (de || U.bottom > 0 && U.itemHeight > 0 && U.offsetBottom === 0 && U.items.length === re) && ge;
        }),
        Q(([[, U]]) => U - 1),
        Me()
      )
    ), _e = Ut(
      W(
        ae(v),
        ie(({ items: U }) => U.length > 0 && U[0].index === 0),
        Pn(0),
        Me()
      )
    ), te = Ut(
      W(
        ae(v),
        he(O),
        ie(([{ items: U }, re]) => U.length > 0 && !re),
        Q(([{ items: U }]) => ({
          endIndex: U[U.length - 1].index,
          startIndex: U[0].index
        })),
        Me(j_),
        Qn(0)
      )
    );
    ee(te, w.scrollSeekRangeChanged), ee(
      W(
        C,
        he(k, S, d, z),
        Q(([U, re, de, ge, be]) => {
          const ye = A_(U), { align: Ce, behavior: et, offset: je } = ye;
          let dt = ye.index;
          dt === "LAST" && (dt = ge - 1), dt = Ha(0, dt, Eu(ge - 1, dt));
          let tt = Zc(re, be, de, dt);
          return Ce === "end" ? tt = Lm(tt - re.height + de.height) : Ce === "center" && (tt = Lm(tt - re.height / 2 + de.height / 2)), je !== void 0 && je !== 0 && (tt += je), { behavior: et, top: tt };
        })
      ),
      c
    );
    const Y = yt(
      W(
        v,
        Q((U) => U.offsetBottom + U.bottom)
      ),
      0
    );
    return ee(
      W(
        l,
        Q((U) => ({ height: U.visibleHeight, width: U.visibleWidth }))
      ),
      k
    ), {
      customScrollParent: D,
      // input
      data: P,
      deviation: B,
      footerHeight: s,
      gap: z,
      headerHeight: a,
      increaseViewportBy: e,
      initialItemCount: m,
      itemDimensions: S,
      overscan: n,
      restoreStateFrom: $,
      scrollBy: o,
      scrollContainerState: u,
      scrollHeight: L,
      scrollTo: c,
      scrollToIndex: C,
      scrollTop: p,
      smoothScrollTargetReached: h,
      totalCount: d,
      useWindowScroll: _,
      viewportDimensions: k,
      windowScrollContainerState: x,
      windowScrollTo: N,
      windowViewportRect: l,
      ...w,
      // output
      gridState: v,
      horizontalDirection: Z,
      initialTopMostItemIndex: F,
      totalListHeight: Y,
      ...g,
      endReached: ne,
      propsReady: A,
      rangeChanged: te,
      startReached: _e,
      stateChanged: j,
      stateRestoreInProgress: O,
      ...f
    };
  },
  Oe(wf, Ct, Ni, L_, Lr, bf, Or)
);
function Q_(e, t, n) {
  return Ha(1, ul((e + n) / (ul(t) + n)));
}
function Bm(e, t, n, r) {
  const { height: s } = n;
  if (s === void 0 || r.length === 0)
    return { bottom: 0, top: 0 };
  const a = Zc(e, t, n, r[0].index);
  return { bottom: Zc(e, t, n, r[r.length - 1].index) + s, top: a };
}
function Zc(e, t, n, r) {
  const s = Q_(e.width, n.width, t.column), a = ul(r / s), o = a * n.height + Ha(0, a - 1) * t.row;
  return o > 0 ? o + t.row : o;
}
const Uj = /* @__PURE__ */ ke(() => {
  const e = K((b) => `Item ${b}`), t = K({}), n = K(null), r = K("virtuoso-grid-item"), s = K("virtuoso-grid-list"), a = K(kf), o = K("div"), u = K(ra), c = (b, g = null) => yt(
    W(
      t,
      Q((w) => w[b]),
      Me()
    ),
    g
  ), p = K(!1), h = K(!1);
  return ee(ae(h), p), {
    components: t,
    computeItemKey: a,
    context: n,
    FooterComponent: c("Footer"),
    HeaderComponent: c("Header"),
    headerFooterTag: o,
    itemClassName: r,
    ItemComponent: c("Item", "div"),
    itemContent: e,
    listClassName: s,
    ListComponent: c("List", "div"),
    readyStateChanged: p,
    reportReadyState: h,
    ScrollerComponent: c("Scroller", "div"),
    scrollerRef: u,
    ScrollSeekPlaceholder: c("ScrollSeekPlaceholder", "div")
  };
}), Wj = /* @__PURE__ */ ke(
  ([e, t]) => ({ ...e, ...t }),
  Oe(Hj, Uj)
), Gj = /* @__PURE__ */ J.memo(function() {
  const e = Re("gridState"), t = Re("listClassName"), n = Re("itemClassName"), r = Re("itemContent"), s = Re("computeItemKey"), a = Re("isSeeking"), o = rn("scrollHeight"), u = Re("ItemComponent"), c = Re("ListComponent"), p = Re("ScrollSeekPlaceholder"), h = Re("context"), b = rn("itemDimensions"), g = rn("gap"), w = Re("log"), E = Re("stateRestoreInProgress"), A = rn("reportReadyState"), D = us(
    J.useMemo(
      () => (_) => {
        const x = _.parentElement.parentElement.scrollHeight;
        o(x);
        const N = _.firstChild;
        if (N !== null) {
          const { height: l, width: f } = N.getBoundingClientRect();
          b({ height: l, width: f });
        }
        g({
          column: $m("column-gap", getComputedStyle(_).columnGap, w),
          row: $m("row-gap", getComputedStyle(_).rowGap, w)
        });
      },
      [o, b, g, w]
    ),
    !0,
    !1
  );
  return U_(() => {
    e.itemHeight > 0 && e.itemWidth > 0 && A(!0);
  }, [e]), E ? null : /* @__PURE__ */ i.jsx(
    c,
    {
      className: t,
      ref: D,
      ..._t(c, h),
      "data-testid": "virtuoso-item-list",
      style: { paddingBottom: e.offsetBottom, paddingTop: e.offsetTop },
      children: e.items.map((_) => {
        const x = s(_.index, _.data, h);
        return a ? /* @__PURE__ */ i.jsx(
          p,
          {
            ..._t(p, h),
            height: e.itemHeight,
            index: _.index,
            width: e.itemWidth
          },
          x
        ) : /* @__PURE__ */ R.createElement(
          u,
          {
            ..._t(u, h),
            className: n,
            "data-index": _.index,
            key: x
          },
          r(_.index, _.data, h)
        );
      })
    }
  );
}), Vj = J.memo(function() {
  const e = Re("HeaderComponent"), t = rn("headerHeight"), n = Re("headerFooterTag"), r = us(
    J.useMemo(
      () => (a) => {
        t(Ar(a, "height"));
      },
      [t]
    ),
    !0,
    !1
  ), s = Re("context");
  return e != null ? /* @__PURE__ */ i.jsx(n, { ref: r, children: /* @__PURE__ */ i.jsx(e, { ..._t(e, s) }) }) : null;
}), Kj = J.memo(function() {
  const e = Re("FooterComponent"), t = rn("footerHeight"), n = Re("headerFooterTag"), r = us(
    J.useMemo(
      () => (a) => {
        t(Ar(a, "height"));
      },
      [t]
    ),
    !0,
    !1
  ), s = Re("context");
  return e != null ? /* @__PURE__ */ i.jsx(n, { ref: r, children: /* @__PURE__ */ i.jsx(e, { ..._t(e, s) }) }) : null;
}), qj = ({ children: e }) => {
  const t = J.useContext(H_), n = rn("itemDimensions"), r = rn("viewportDimensions"), s = us(
    J.useMemo(
      () => (a) => {
        r(a.getBoundingClientRect());
      },
      [r]
    ),
    !0,
    !1
  );
  return J.useEffect(() => {
    t && (r({ height: t.viewportHeight, width: t.viewportWidth }), n({ height: t.itemHeight, width: t.itemWidth }));
  }, [t, r, n]), /* @__PURE__ */ i.jsx("div", { ref: s, style: Nf(!1), children: e });
}, Yj = ({ children: e }) => {
  const t = J.useContext(H_), n = rn("windowViewportRect"), r = rn("itemDimensions"), s = Re("customScrollParent"), a = Re("useWindowScroll"), o = x_(n, s, !1);
  return J.useEffect(() => {
    t && (r({ height: t.itemHeight, width: t.itemWidth }), n({ listHeight: 0, offsetTop: 0, visibleHeight: t.viewportHeight, visibleWidth: t.viewportWidth }));
  }, [t, n, r]), /* @__PURE__ */ i.jsx("div", { ref: o, style: V_(!1, a), children: e });
}, Qj = /* @__PURE__ */ J.memo(function({ ...e }) {
  const t = Re("useWindowScroll"), n = Re("customScrollParent"), r = n || t ? Zj : Xj, s = n || t ? Yj : qj, a = Re("context");
  return /* @__PURE__ */ i.jsx(r, { ...e, ..._t(r, a), children: /* @__PURE__ */ i.jsxs(s, { children: [
    /* @__PURE__ */ i.jsx(Vj, {}),
    /* @__PURE__ */ i.jsx(Gj, {}),
    /* @__PURE__ */ i.jsx(Kj, {})
  ] }) });
}), {
  useEmitter: X_,
  useEmitterValue: Re,
  usePublisher: rn
} = /* @__PURE__ */ $_(
  Wj,
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
  Qj
), Xj = /* @__PURE__ */ K_({ useEmitter: X_, useEmitterValue: Re, usePublisher: rn }), Zj = /* @__PURE__ */ q_({ useEmitter: X_, useEmitterValue: Re, usePublisher: rn });
function $m(e, t, n) {
  return t !== "normal" && t?.endsWith("px") !== !0 && n(`${e} was not resolved to pixel value correctly`, t, Je.WARN), t === "normal" ? 0 : parseInt(t ?? "0", 10);
}
var Z_ = { exports: {} };
(function(e) {
  (function() {
    function t(l) {
      var f = {
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
        return JSON.parse(JSON.stringify(f));
      var d = {};
      for (var m in f)
        f.hasOwnProperty(m) && (d[m] = f[m].defaultValue);
      return d;
    }
    function n() {
      var l = t(!0), f = {};
      for (var d in l)
        l.hasOwnProperty(d) && (f[d] = !0);
      return f;
    }
    var r = {}, s = {}, a = {}, o = t(!0), u = "vanilla", c = {
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
    r.helper = {}, r.extensions = {}, r.setOption = function(l, f) {
      return o[l] = f, this;
    }, r.getOption = function(l) {
      return o[l];
    }, r.getOptions = function() {
      return o;
    }, r.resetOptions = function() {
      o = t(!0);
    }, r.setFlavor = function(l) {
      if (!c.hasOwnProperty(l))
        throw Error(l + " flavor was not found");
      r.resetOptions();
      var f = c[l];
      u = l;
      for (var d in f)
        f.hasOwnProperty(d) && (o[d] = f[d]);
    }, r.getFlavor = function() {
      return u;
    }, r.getFlavorOptions = function(l) {
      if (c.hasOwnProperty(l))
        return c[l];
    }, r.getDefaultOptions = function(l) {
      return t(l);
    }, r.subParser = function(l, f) {
      if (r.helper.isString(l))
        if (typeof f < "u")
          s[l] = f;
        else {
          if (s.hasOwnProperty(l))
            return s[l];
          throw Error("SubParser named " + l + " not registered!");
        }
    }, r.extension = function(l, f) {
      if (!r.helper.isString(l))
        throw Error("Extension 'name' must be a string");
      if (l = r.helper.stdExtName(l), r.helper.isUndefined(f)) {
        if (!a.hasOwnProperty(l))
          throw Error("Extension named " + l + " is not registered!");
        return a[l];
      } else {
        typeof f == "function" && (f = f()), r.helper.isArray(f) || (f = [f]);
        var d = p(f, l);
        if (d.valid)
          a[l] = f;
        else
          throw Error(d.error);
      }
    }, r.getAllExtensions = function() {
      return a;
    }, r.removeExtension = function(l) {
      delete a[l];
    }, r.resetExtensions = function() {
      a = {};
    };
    function p(l, f) {
      var d = f ? "Error in " + f + " extension->" : "Error in unnamed extension", m = {
        valid: !0,
        error: ""
      };
      r.helper.isArray(l) || (l = [l]);
      for (var v = 0; v < l.length; ++v) {
        var k = d + " sub-extension " + v + ": ", S = l[v];
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
      var f = p(l, null);
      return f.valid ? !0 : (console.warn(f.error), !1);
    }, r.hasOwnProperty("helper") || (r.helper = {}), r.helper.isString = function(l) {
      return typeof l == "string" || l instanceof String;
    }, r.helper.isFunction = function(l) {
      var f = {};
      return l && f.toString.call(l) === "[object Function]";
    }, r.helper.isArray = function(l) {
      return Array.isArray(l);
    }, r.helper.isUndefined = function(l) {
      return typeof l > "u";
    }, r.helper.forEach = function(l, f) {
      if (r.helper.isUndefined(l))
        throw new Error("obj param is required");
      if (r.helper.isUndefined(f))
        throw new Error("callback param is required");
      if (!r.helper.isFunction(f))
        throw new Error("callback param must be a function/closure");
      if (typeof l.forEach == "function")
        l.forEach(f);
      else if (r.helper.isArray(l))
        for (var d = 0; d < l.length; d++)
          f(l[d], d, l);
      else if (typeof l == "object")
        for (var m in l)
          l.hasOwnProperty(m) && f(l[m], m, l);
      else
        throw new Error("obj does not seem to be an array or an iterable object");
    }, r.helper.stdExtName = function(l) {
      return l.replace(/[_?*+\/\\.^-]/g, "").replace(/\s/g, "").toLowerCase();
    };
    function h(l, f) {
      var d = f.charCodeAt(0);
      return "¨E" + d + "E";
    }
    r.helper.escapeCharactersCallback = h, r.helper.escapeCharacters = function(l, f, d) {
      var m = "([" + f.replace(/([\[\]\\])/g, "\\$1") + "])";
      d && (m = "\\\\" + m);
      var v = new RegExp(m, "g");
      return l = l.replace(v, h), l;
    }, r.helper.unescapeHTMLEntities = function(l) {
      return l.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
    var b = function(l, f, d, m) {
      var v = m || "", k = v.indexOf("g") > -1, S = new RegExp(f + "|" + d, "g" + v.replace(/g/g, "")), C = new RegExp(f, v.replace(/g/g, "")), L = [], B, P, z, j, $;
      do
        for (B = 0; z = S.exec(l); )
          if (C.test(z[0]))
            B++ || (P = S.lastIndex, j = P - z[0].length);
          else if (B && !--B) {
            $ = z.index + z[0].length;
            var O = {
              left: { start: j, end: P },
              match: { start: P, end: z.index },
              right: { start: z.index, end: $ },
              wholeMatch: { start: j, end: $ }
            };
            if (L.push(O), !k)
              return L;
          }
      while (B && (S.lastIndex = P));
      return L;
    };
    r.helper.matchRecursiveRegExp = function(l, f, d, m) {
      for (var v = b(l, f, d, m), k = [], S = 0; S < v.length; ++S)
        k.push([
          l.slice(v[S].wholeMatch.start, v[S].wholeMatch.end),
          l.slice(v[S].match.start, v[S].match.end),
          l.slice(v[S].left.start, v[S].left.end),
          l.slice(v[S].right.start, v[S].right.end)
        ]);
      return k;
    }, r.helper.replaceRecursiveRegExp = function(l, f, d, m, v) {
      if (!r.helper.isFunction(f)) {
        var k = f;
        f = function() {
          return k;
        };
      }
      var S = b(l, d, m, v), C = l, L = S.length;
      if (L > 0) {
        var B = [];
        S[0].wholeMatch.start !== 0 && B.push(l.slice(0, S[0].wholeMatch.start));
        for (var P = 0; P < L; ++P)
          B.push(
            f(
              l.slice(S[P].wholeMatch.start, S[P].wholeMatch.end),
              l.slice(S[P].match.start, S[P].match.end),
              l.slice(S[P].left.start, S[P].left.end),
              l.slice(S[P].right.start, S[P].right.end)
            )
          ), P < L - 1 && B.push(l.slice(S[P].wholeMatch.end, S[P + 1].wholeMatch.start));
        S[L - 1].wholeMatch.end < l.length && B.push(l.slice(S[L - 1].wholeMatch.end)), C = B.join("");
      }
      return C;
    }, r.helper.regexIndexOf = function(l, f, d) {
      if (!r.helper.isString(l))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      if (!(f instanceof RegExp))
        throw "InvalidArgumentError: second parameter of showdown.helper.regexIndexOf function must be an instance of RegExp";
      var m = l.substring(d || 0).search(f);
      return m >= 0 ? m + (d || 0) : m;
    }, r.helper.splitAtIndex = function(l, f) {
      if (!r.helper.isString(l))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      return [l.substring(0, f), l.substring(f)];
    }, r.helper.encodeEmailAddress = function(l) {
      var f = [
        function(d) {
          return "&#" + d.charCodeAt(0) + ";";
        },
        function(d) {
          return "&#x" + d.charCodeAt(0).toString(16) + ";";
        },
        function(d) {
          return d;
        }
      ];
      return l = l.replace(/./g, function(d) {
        if (d === "@")
          d = f[Math.floor(Math.random() * 2)](d);
        else {
          var m = Math.random();
          d = m > 0.9 ? f[2](d) : m > 0.45 ? f[1](d) : f[0](d);
        }
        return d;
      }), l;
    }, r.helper.padEnd = function(f, d, m) {
      return d = d >> 0, m = String(m || " "), f.length > d ? String(f) : (d = d - f.length, d > m.length && (m += m.repeat(d / m.length)), String(f) + m.slice(0, d));
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
      var f = {}, d = [], m = [], v = {}, k = u, S = {
        parsed: {},
        raw: "",
        format: ""
      };
      C();
      function C() {
        l = l || {};
        for (var j in o)
          o.hasOwnProperty(j) && (f[j] = o[j]);
        if (typeof l == "object")
          for (var $ in l)
            l.hasOwnProperty($) && (f[$] = l[$]);
        else
          throw Error("Converter expects the passed parameter to be an object, but " + typeof l + " was passed instead.");
        f.extensions && r.helper.forEach(f.extensions, L);
      }
      function L(j, $) {
        if ($ = $ || null, r.helper.isString(j))
          if (j = r.helper.stdExtName(j), $ = j, r.extensions[j]) {
            console.warn("DEPRECATION WARNING: " + j + " is an old extension that uses a deprecated loading method.Please inform the developer that the extension should be updated!"), B(r.extensions[j], j);
            return;
          } else if (!r.helper.isUndefined(a[j]))
            j = a[j];
          else
            throw Error('Extension "' + j + '" could not be loaded. It was either not found or is not a valid extension.');
        typeof j == "function" && (j = j()), r.helper.isArray(j) || (j = [j]);
        var O = p(j, $);
        if (!O.valid)
          throw Error(O.error);
        for (var F = 0; F < j.length; ++F) {
          switch (j[F].type) {
            case "lang":
              d.push(j[F]);
              break;
            case "output":
              m.push(j[F]);
              break;
          }
          if (j[F].hasOwnProperty("listeners"))
            for (var H in j[F].listeners)
              j[F].listeners.hasOwnProperty(H) && P(H, j[F].listeners[H]);
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
              d.push(j[F]);
              break;
            case "output":
              m.push(j[F]);
              break;
            default:
              throw Error("Extension loader error: Type unrecognized!!!");
          }
      }
      function P(j, $) {
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
      this._dispatch = function($, O, F, H) {
        if (v.hasOwnProperty($))
          for (var G = 0; G < v[$].length; ++G) {
            var Z = v[$][G]($, O, this, F, H);
            Z && typeof Z < "u" && (O = Z);
          }
        return O;
      }, this.listen = function(j, $) {
        return P(j, $), this;
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
          langExtensions: d,
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
`), j = j.replace(/\u00A0/g, "&nbsp;"), f.smartIndentationFix && (j = z(j)), j = `

` + j + `

`, j = r.subParser("detab")(j, f, $), j = j.replace(/^[ \t]+$/mg, ""), r.helper.forEach(d, function(O) {
          j = r.subParser("runExtension")(O, j, f, $);
        }), j = r.subParser("metadata")(j, f, $), j = r.subParser("hashPreCodeTags")(j, f, $), j = r.subParser("githubCodeBlocks")(j, f, $), j = r.subParser("hashHTMLBlocks")(j, f, $), j = r.subParser("hashCodeTags")(j, f, $), j = r.subParser("stripLinkDefinitions")(j, f, $), j = r.subParser("blockGamut")(j, f, $), j = r.subParser("unhashHTMLSpans")(j, f, $), j = r.subParser("unescapeSpecialChars")(j, f, $), j = j.replace(/¨D/g, "$$"), j = j.replace(/¨T/g, "¨"), j = r.subParser("completeHTMLDocument")(j, f, $), r.helper.forEach(m, function(O) {
          j = r.subParser("runExtension")(O, j, f, $);
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
          preList: ne(O)
        };
        oe(O);
        for (var H = O.childNodes, G = "", Z = 0; Z < H.length; Z++)
          G += r.subParser("makeMarkdown.node")(H[Z], F);
        function oe(_e) {
          for (var te = 0; te < _e.childNodes.length; ++te) {
            var Y = _e.childNodes[te];
            Y.nodeType === 3 ? !/\S/.test(Y.nodeValue) && !/^[ ]+$/.test(Y.nodeValue) ? (_e.removeChild(Y), --te) : (Y.nodeValue = Y.nodeValue.split(`
`).join(" "), Y.nodeValue = Y.nodeValue.replace(/(\s)+/g, "$1")) : Y.nodeType === 1 && oe(Y);
          }
        }
        function ne(_e) {
          for (var te = _e.querySelectorAll("pre"), Y = [], U = 0; U < te.length; ++U)
            if (te[U].childElementCount === 1 && te[U].firstChild.tagName.toLowerCase() === "code") {
              var re = te[U].firstChild.innerHTML.trim(), de = te[U].firstChild.getAttribute("data-language") || "";
              if (de === "")
                for (var ge = te[U].firstChild.className.split(" "), be = 0; be < ge.length; ++be) {
                  var ye = ge[be].match(/^language-(.+)$/);
                  if (ye !== null) {
                    de = ye[1];
                    break;
                  }
                }
              re = r.helper.unescapeHTMLEntities(re), Y.push(re), te[U].outerHTML = '<precode language="' + de + '" precodenum="' + U.toString() + '"></precode>';
            } else
              Y.push(te[U].innerHTML), te[U].innerHTML = "", te[U].setAttribute("prenum", U.toString());
          return Y;
        }
        return G;
      }, this.setOption = function(j, $) {
        f[j] = $;
      }, this.getOption = function(j) {
        return f[j];
      }, this.getOptions = function() {
        return f;
      }, this.addExtension = function(j, $) {
        $ = $ || null, L(j, $);
      }, this.useExtension = function(j) {
        L(j);
      }, this.setFlavor = function(j) {
        if (!c.hasOwnProperty(j))
          throw Error(j + " flavor was not found");
        var $ = c[j];
        k = j;
        for (var O in $)
          $.hasOwnProperty(O) && (f[O] = $[O]);
      }, this.getFlavor = function() {
        return k;
      }, this.removeExtension = function(j) {
        r.helper.isArray(j) || (j = [j]);
        for (var $ = 0; $ < j.length; ++$) {
          for (var O = j[$], F = 0; F < d.length; ++F)
            d[F] === O && d.splice(F, 1);
          for (var H = 0; H < m.length; ++H)
            m[H] === O && m.splice(H, 1);
        }
      }, this.getAllExtensions = function() {
        return {
          language: d,
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
    }, r.subParser("anchors", function(l, f, d) {
      l = d.converter._dispatch("anchors.before", l, f, d);
      var m = function(v, k, S, C, L, B, P) {
        if (r.helper.isUndefined(P) && (P = ""), S = S.toLowerCase(), v.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          C = "";
        else if (!C)
          if (S || (S = k.toLowerCase().replace(/ ?\n/g, " ")), C = "#" + S, !r.helper.isUndefined(d.gUrls[S]))
            C = d.gUrls[S], r.helper.isUndefined(d.gTitles[S]) || (P = d.gTitles[S]);
          else
            return v;
        C = C.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback);
        var z = '<a href="' + C + '"';
        return P !== "" && P !== null && (P = P.replace(/"/g, "&quot;"), P = P.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback), z += ' title="' + P + '"'), f.openLinksInNewWindow && !/^#/.test(C) && (z += ' rel="noopener noreferrer" target="¨E95Eblank"'), z += ">" + k + "</a>", z;
      };
      return l = l.replace(/\[((?:\[[^\]]*]|[^\[\]])*)] ?(?:\n *)?\[(.*?)]()()()()/g, m), l = l.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<([^>]*)>(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        m
      ), l = l.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        m
      ), l = l.replace(/\[([^\[\]]+)]()()()()()/g, m), f.ghMentions && (l = l.replace(/(^|\s)(\\)?(@([a-z\d]+(?:[a-z\d.-]+?[a-z\d]+)*))/gmi, function(v, k, S, C, L) {
        if (S === "\\")
          return k + C;
        if (!r.helper.isString(f.ghMentionsLink))
          throw new Error("ghMentionsLink option must be a string");
        var B = f.ghMentionsLink.replace(/\{u}/g, L), P = "";
        return f.openLinksInNewWindow && (P = ' rel="noopener noreferrer" target="¨E95Eblank"'), k + '<a href="' + B + '"' + P + ">" + C + "</a>";
      })), l = d.converter._dispatch("anchors.after", l, f, d), l;
    });
    var g = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+?\.[^'">\s]+?)()(\1)?(?=\s|$)(?!["<>])/gi, w = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+?)([.!?,()\[\]])?(\1)?(?=\s|$)(?!["<>])/gi, E = /()<(((https?|ftp|dict):\/\/|www\.)[^'">\s]+)()>()/gi, A = /(^|\s)(?:mailto:)?([A-Za-z0-9!#$%&'*+-/=?^_`{|}~.]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)(?=$|\s)/gmi, D = /<()(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi, _ = function(l) {
      return function(f, d, m, v, k, S, C) {
        m = m.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback);
        var L = m, B = "", P = "", z = d || "", j = C || "";
        return /^www\./i.test(m) && (m = m.replace(/^www\./i, "http://www.")), l.excludeTrailingPunctuationFromURLs && S && (B = S), l.openLinksInNewWindow && (P = ' rel="noopener noreferrer" target="¨E95Eblank"'), z + '<a href="' + m + '"' + P + ">" + L + "</a>" + B + j;
      };
    }, x = function(l, f) {
      return function(d, m, v) {
        var k = "mailto:";
        return m = m || "", v = r.subParser("unescapeSpecialChars")(v, l, f), l.encodeEmails ? (k = r.helper.encodeEmailAddress(k + v), v = r.helper.encodeEmailAddress(v)) : k = k + v, m + '<a href="' + k + '">' + v + "</a>";
      };
    };
    r.subParser("autoLinks", function(l, f, d) {
      return l = d.converter._dispatch("autoLinks.before", l, f, d), l = l.replace(E, _(f)), l = l.replace(D, x(f, d)), l = d.converter._dispatch("autoLinks.after", l, f, d), l;
    }), r.subParser("simplifiedAutoLinks", function(l, f, d) {
      return f.simplifiedAutoLink && (l = d.converter._dispatch("simplifiedAutoLinks.before", l, f, d), f.excludeTrailingPunctuationFromURLs ? l = l.replace(w, _(f)) : l = l.replace(g, _(f)), l = l.replace(A, x(f, d)), l = d.converter._dispatch("simplifiedAutoLinks.after", l, f, d)), l;
    }), r.subParser("blockGamut", function(l, f, d) {
      return l = d.converter._dispatch("blockGamut.before", l, f, d), l = r.subParser("blockQuotes")(l, f, d), l = r.subParser("headers")(l, f, d), l = r.subParser("horizontalRule")(l, f, d), l = r.subParser("lists")(l, f, d), l = r.subParser("codeBlocks")(l, f, d), l = r.subParser("tables")(l, f, d), l = r.subParser("hashHTMLBlocks")(l, f, d), l = r.subParser("paragraphs")(l, f, d), l = d.converter._dispatch("blockGamut.after", l, f, d), l;
    }), r.subParser("blockQuotes", function(l, f, d) {
      l = d.converter._dispatch("blockQuotes.before", l, f, d), l = l + `

`;
      var m = /(^ {0,3}>[ \t]?.+\n(.+\n)*\n*)+/gm;
      return f.splitAdjacentBlockquotes && (m = /^ {0,3}>[\s\S]*?(?:\n\n)/gm), l = l.replace(m, function(v) {
        return v = v.replace(/^[ \t]*>[ \t]?/gm, ""), v = v.replace(/¨0/g, ""), v = v.replace(/^[ \t]+$/gm, ""), v = r.subParser("githubCodeBlocks")(v, f, d), v = r.subParser("blockGamut")(v, f, d), v = v.replace(/(^|\n)/g, "$1  "), v = v.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function(k, S) {
          var C = S;
          return C = C.replace(/^  /mg, "¨0"), C = C.replace(/¨0/g, ""), C;
        }), r.subParser("hashBlock")(`<blockquote>
` + v + `
</blockquote>`, f, d);
      }), l = d.converter._dispatch("blockQuotes.after", l, f, d), l;
    }), r.subParser("codeBlocks", function(l, f, d) {
      l = d.converter._dispatch("codeBlocks.before", l, f, d), l += "¨0";
      var m = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=¨0))/g;
      return l = l.replace(m, function(v, k, S) {
        var C = k, L = S, B = `
`;
        return C = r.subParser("outdent")(C, f, d), C = r.subParser("encodeCode")(C, f, d), C = r.subParser("detab")(C, f, d), C = C.replace(/^\n+/g, ""), C = C.replace(/\n+$/g, ""), f.omitExtraWLInCodeBlocks && (B = ""), C = "<pre><code>" + C + B + "</code></pre>", r.subParser("hashBlock")(C, f, d) + L;
      }), l = l.replace(/¨0/, ""), l = d.converter._dispatch("codeBlocks.after", l, f, d), l;
    }), r.subParser("codeSpans", function(l, f, d) {
      return l = d.converter._dispatch("codeSpans.before", l, f, d), typeof l > "u" && (l = ""), l = l.replace(
        /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
        function(m, v, k, S) {
          var C = S;
          return C = C.replace(/^([ \t]*)/g, ""), C = C.replace(/[ \t]*$/g, ""), C = r.subParser("encodeCode")(C, f, d), C = v + "<code>" + C + "</code>", C = r.subParser("hashHTMLSpans")(C, f, d), C;
        }
      ), l = d.converter._dispatch("codeSpans.after", l, f, d), l;
    }), r.subParser("completeHTMLDocument", function(l, f, d) {
      if (!f.completeHTMLDocument)
        return l;
      l = d.converter._dispatch("completeHTMLDocument.before", l, f, d);
      var m = "html", v = `<!DOCTYPE HTML>
`, k = "", S = `<meta charset="utf-8">
`, C = "", L = "";
      typeof d.metadata.parsed.doctype < "u" && (v = "<!DOCTYPE " + d.metadata.parsed.doctype + `>
`, m = d.metadata.parsed.doctype.toString().toLowerCase(), (m === "html" || m === "html5") && (S = '<meta charset="utf-8">'));
      for (var B in d.metadata.parsed)
        if (d.metadata.parsed.hasOwnProperty(B))
          switch (B.toLowerCase()) {
            case "doctype":
              break;
            case "title":
              k = "<title>" + d.metadata.parsed.title + `</title>
`;
              break;
            case "charset":
              m === "html" || m === "html5" ? S = '<meta charset="' + d.metadata.parsed.charset + `">
` : S = '<meta name="charset" content="' + d.metadata.parsed.charset + `">
`;
              break;
            case "language":
            case "lang":
              C = ' lang="' + d.metadata.parsed[B] + '"', L += '<meta name="' + B + '" content="' + d.metadata.parsed[B] + `">
`;
              break;
            default:
              L += '<meta name="' + B + '" content="' + d.metadata.parsed[B] + `">
`;
          }
      return l = v + "<html" + C + `>
<head>
` + k + S + L + `</head>
<body>
` + l.trim() + `
</body>
</html>`, l = d.converter._dispatch("completeHTMLDocument.after", l, f, d), l;
    }), r.subParser("detab", function(l, f, d) {
      return l = d.converter._dispatch("detab.before", l, f, d), l = l.replace(/\t(?=\t)/g, "    "), l = l.replace(/\t/g, "¨A¨B"), l = l.replace(/¨B(.+?)¨A/g, function(m, v) {
        for (var k = v, S = 4 - k.length % 4, C = 0; C < S; C++)
          k += " ";
        return k;
      }), l = l.replace(/¨A/g, "    "), l = l.replace(/¨B/g, ""), l = d.converter._dispatch("detab.after", l, f, d), l;
    }), r.subParser("ellipsis", function(l, f, d) {
      return f.ellipsis && (l = d.converter._dispatch("ellipsis.before", l, f, d), l = l.replace(/\.\.\./g, "…"), l = d.converter._dispatch("ellipsis.after", l, f, d)), l;
    }), r.subParser("emoji", function(l, f, d) {
      if (!f.emoji)
        return l;
      l = d.converter._dispatch("emoji.before", l, f, d);
      var m = /:([\S]+?):/g;
      return l = l.replace(m, function(v, k) {
        return r.helper.emojis.hasOwnProperty(k) ? r.helper.emojis[k] : v;
      }), l = d.converter._dispatch("emoji.after", l, f, d), l;
    }), r.subParser("encodeAmpsAndAngles", function(l, f, d) {
      return l = d.converter._dispatch("encodeAmpsAndAngles.before", l, f, d), l = l.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, "&amp;"), l = l.replace(/<(?![a-z\/?$!])/gi, "&lt;"), l = l.replace(/</g, "&lt;"), l = l.replace(/>/g, "&gt;"), l = d.converter._dispatch("encodeAmpsAndAngles.after", l, f, d), l;
    }), r.subParser("encodeBackslashEscapes", function(l, f, d) {
      return l = d.converter._dispatch("encodeBackslashEscapes.before", l, f, d), l = l.replace(/\\(\\)/g, r.helper.escapeCharactersCallback), l = l.replace(/\\([`*_{}\[\]()>#+.!~=|:-])/g, r.helper.escapeCharactersCallback), l = d.converter._dispatch("encodeBackslashEscapes.after", l, f, d), l;
    }), r.subParser("encodeCode", function(l, f, d) {
      return l = d.converter._dispatch("encodeCode.before", l, f, d), l = l.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/([*_{}\[\]\\=~-])/g, r.helper.escapeCharactersCallback), l = d.converter._dispatch("encodeCode.after", l, f, d), l;
    }), r.subParser("escapeSpecialCharsWithinTagAttributes", function(l, f, d) {
      l = d.converter._dispatch("escapeSpecialCharsWithinTagAttributes.before", l, f, d);
      var m = /<\/?[a-z\d_:-]+(?:[\s]+[\s\S]+?)?>/gi, v = /<!(--(?:(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>/gi;
      return l = l.replace(m, function(k) {
        return k.replace(/(.)<\/?code>(?=.)/g, "$1`").replace(/([\\`*_~=|])/g, r.helper.escapeCharactersCallback);
      }), l = l.replace(v, function(k) {
        return k.replace(/([\\`*_~=|])/g, r.helper.escapeCharactersCallback);
      }), l = d.converter._dispatch("escapeSpecialCharsWithinTagAttributes.after", l, f, d), l;
    }), r.subParser("githubCodeBlocks", function(l, f, d) {
      return f.ghCodeBlocks ? (l = d.converter._dispatch("githubCodeBlocks.before", l, f, d), l += "¨0", l = l.replace(/(?:^|\n)(?: {0,3})(```+|~~~+)(?: *)([^\s`~]*)\n([\s\S]*?)\n(?: {0,3})\1/g, function(m, v, k, S) {
        var C = f.omitExtraWLInCodeBlocks ? "" : `
`;
        return S = r.subParser("encodeCode")(S, f, d), S = r.subParser("detab")(S, f, d), S = S.replace(/^\n+/g, ""), S = S.replace(/\n+$/g, ""), S = "<pre><code" + (k ? ' class="' + k + " language-" + k + '"' : "") + ">" + S + C + "</code></pre>", S = r.subParser("hashBlock")(S, f, d), `

¨G` + (d.ghCodeBlocks.push({ text: m, codeblock: S }) - 1) + `G

`;
      }), l = l.replace(/¨0/, ""), d.converter._dispatch("githubCodeBlocks.after", l, f, d)) : l;
    }), r.subParser("hashBlock", function(l, f, d) {
      return l = d.converter._dispatch("hashBlock.before", l, f, d), l = l.replace(/(^\n+|\n+$)/g, ""), l = `

¨K` + (d.gHtmlBlocks.push(l) - 1) + `K

`, l = d.converter._dispatch("hashBlock.after", l, f, d), l;
    }), r.subParser("hashCodeTags", function(l, f, d) {
      l = d.converter._dispatch("hashCodeTags.before", l, f, d);
      var m = function(v, k, S, C) {
        var L = S + r.subParser("encodeCode")(k, f, d) + C;
        return "¨C" + (d.gHtmlSpans.push(L) - 1) + "C";
      };
      return l = r.helper.replaceRecursiveRegExp(l, m, "<code\\b[^>]*>", "</code>", "gim"), l = d.converter._dispatch("hashCodeTags.after", l, f, d), l;
    }), r.subParser("hashElement", function(l, f, d) {
      return function(m, v) {
        var k = v;
        return k = k.replace(/\n\n/g, `
`), k = k.replace(/^\n/, ""), k = k.replace(/\n+$/g, ""), k = `

¨K` + (d.gHtmlBlocks.push(k) - 1) + `K

`, k;
      };
    }), r.subParser("hashHTMLBlocks", function(l, f, d) {
      l = d.converter._dispatch("hashHTMLBlocks.before", l, f, d);
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
        var H = j;
        return O.search(/\bmarkdown\b/) !== -1 && (H = O + d.converter.makeHtml($) + F), `

¨K` + (d.gHtmlBlocks.push(H) - 1) + `K

`;
      };
      f.backslashEscapesHTMLTags && (l = l.replace(/\\<(\/?[^>]+?)>/g, function(j, $) {
        return "&lt;" + $ + "&gt;";
      }));
      for (var k = 0; k < m.length; ++k)
        for (var S, C = new RegExp("^ {0,3}(<" + m[k] + "\\b[^>]*>)", "im"), L = "<" + m[k] + "\\b[^>]*>", B = "</" + m[k] + ">"; (S = r.helper.regexIndexOf(l, C)) !== -1; ) {
          var P = r.helper.splitAtIndex(l, S), z = r.helper.replaceRecursiveRegExp(P[1], v, L, B, "im");
          if (z === P[1])
            break;
          l = P[0].concat(z);
        }
      return l = l.replace(
        /(\n {0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,
        r.subParser("hashElement")(l, f, d)
      ), l = r.helper.replaceRecursiveRegExp(l, function(j) {
        return `

¨K` + (d.gHtmlBlocks.push(j) - 1) + `K

`;
      }, "^ {0,3}<!--", "-->", "gm"), l = l.replace(
        /(?:\n\n)( {0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,
        r.subParser("hashElement")(l, f, d)
      ), l = d.converter._dispatch("hashHTMLBlocks.after", l, f, d), l;
    }), r.subParser("hashHTMLSpans", function(l, f, d) {
      l = d.converter._dispatch("hashHTMLSpans.before", l, f, d);
      function m(v) {
        return "¨C" + (d.gHtmlSpans.push(v) - 1) + "C";
      }
      return l = l.replace(/<[^>]+?\/>/gi, function(v) {
        return m(v);
      }), l = l.replace(/<([^>]+?)>[\s\S]*?<\/\1>/g, function(v) {
        return m(v);
      }), l = l.replace(/<([^>]+?)\s[^>]+?>[\s\S]*?<\/\1>/g, function(v) {
        return m(v);
      }), l = l.replace(/<[^>]+?>/gi, function(v) {
        return m(v);
      }), l = d.converter._dispatch("hashHTMLSpans.after", l, f, d), l;
    }), r.subParser("unhashHTMLSpans", function(l, f, d) {
      l = d.converter._dispatch("unhashHTMLSpans.before", l, f, d);
      for (var m = 0; m < d.gHtmlSpans.length; ++m) {
        for (var v = d.gHtmlSpans[m], k = 0; /¨C(\d+)C/.test(v); ) {
          var S = RegExp.$1;
          if (v = v.replace("¨C" + S + "C", d.gHtmlSpans[S]), k === 10) {
            console.error("maximum nesting of 10 spans reached!!!");
            break;
          }
          ++k;
        }
        l = l.replace("¨C" + m + "C", v);
      }
      return l = d.converter._dispatch("unhashHTMLSpans.after", l, f, d), l;
    }), r.subParser("hashPreCodeTags", function(l, f, d) {
      l = d.converter._dispatch("hashPreCodeTags.before", l, f, d);
      var m = function(v, k, S, C) {
        var L = S + r.subParser("encodeCode")(k, f, d) + C;
        return `

¨G` + (d.ghCodeBlocks.push({ text: v, codeblock: L }) - 1) + `G

`;
      };
      return l = r.helper.replaceRecursiveRegExp(l, m, "^ {0,3}<pre\\b[^>]*>\\s*<code\\b[^>]*>", "^ {0,3}</code>\\s*</pre>", "gim"), l = d.converter._dispatch("hashPreCodeTags.after", l, f, d), l;
    }), r.subParser("headers", function(l, f, d) {
      l = d.converter._dispatch("headers.before", l, f, d);
      var m = isNaN(parseInt(f.headerLevelStart)) ? 1 : parseInt(f.headerLevelStart), v = f.smoothLivePreview ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm, k = f.smoothLivePreview ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;
      l = l.replace(v, function(L, B) {
        var P = r.subParser("spanGamut")(B, f, d), z = f.noHeaderId ? "" : ' id="' + C(B) + '"', j = m, $ = "<h" + j + z + ">" + P + "</h" + j + ">";
        return r.subParser("hashBlock")($, f, d);
      }), l = l.replace(k, function(L, B) {
        var P = r.subParser("spanGamut")(B, f, d), z = f.noHeaderId ? "" : ' id="' + C(B) + '"', j = m + 1, $ = "<h" + j + z + ">" + P + "</h" + j + ">";
        return r.subParser("hashBlock")($, f, d);
      });
      var S = f.requireSpaceBeforeHeadingText ? /^(#{1,6})[ \t]+(.+?)[ \t]*#*\n+/gm : /^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm;
      l = l.replace(S, function(L, B, P) {
        var z = P;
        f.customizedHeaderId && (z = P.replace(/\s?\{([^{]+?)}\s*$/, ""));
        var j = r.subParser("spanGamut")(z, f, d), $ = f.noHeaderId ? "" : ' id="' + C(P) + '"', O = m - 1 + B.length, F = "<h" + O + $ + ">" + j + "</h" + O + ">";
        return r.subParser("hashBlock")(F, f, d);
      });
      function C(L) {
        var B, P;
        if (f.customizedHeaderId) {
          var z = L.match(/\{([^{]+?)}\s*$/);
          z && z[1] && (L = z[1]);
        }
        return B = L, r.helper.isString(f.prefixHeaderId) ? P = f.prefixHeaderId : f.prefixHeaderId === !0 ? P = "section-" : P = "", f.rawPrefixHeaderId || (B = P + B), f.ghCompatibleHeaderId ? B = B.replace(/ /g, "-").replace(/&amp;/g, "").replace(/¨T/g, "").replace(/¨D/g, "").replace(/[&+$,\/:;=?@"#{}|^¨~\[\]`\\*)(%.!'<>]/g, "").toLowerCase() : f.rawHeaderId ? B = B.replace(/ /g, "-").replace(/&amp;/g, "&").replace(/¨T/g, "¨").replace(/¨D/g, "$").replace(/["']/g, "-").toLowerCase() : B = B.replace(/[^\w]/g, "").toLowerCase(), f.rawPrefixHeaderId && (B = P + B), d.hashLinkCounts[B] ? B = B + "-" + d.hashLinkCounts[B]++ : d.hashLinkCounts[B] = 1, B;
      }
      return l = d.converter._dispatch("headers.after", l, f, d), l;
    }), r.subParser("horizontalRule", function(l, f, d) {
      l = d.converter._dispatch("horizontalRule.before", l, f, d);
      var m = r.subParser("hashBlock")("<hr />", f, d);
      return l = l.replace(/^ {0,2}( ?-){3,}[ \t]*$/gm, m), l = l.replace(/^ {0,2}( ?\*){3,}[ \t]*$/gm, m), l = l.replace(/^ {0,2}( ?_){3,}[ \t]*$/gm, m), l = d.converter._dispatch("horizontalRule.after", l, f, d), l;
    }), r.subParser("images", function(l, f, d) {
      l = d.converter._dispatch("images.before", l, f, d);
      var m = /!\[([^\]]*?)][ \t]*()\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, v = /!\[([^\]]*?)][ \t]*()\([ \t]?<([^>]*)>(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(?:(["'])([^"]*?)\6))?[ \t]?\)/g, k = /!\[([^\]]*?)][ \t]*()\([ \t]?<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, S = /!\[([^\]]*?)] ?(?:\n *)?\[([\s\S]*?)]()()()()()/g, C = /!\[([^\[\]]+)]()()()()()/g;
      function L(P, z, j, $, O, F, H, G) {
        return $ = $.replace(/\s/g, ""), B(P, z, j, $, O, F, H, G);
      }
      function B(P, z, j, $, O, F, H, G) {
        var Z = d.gUrls, oe = d.gTitles, ne = d.gDimensions;
        if (j = j.toLowerCase(), G || (G = ""), P.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          $ = "";
        else if ($ === "" || $ === null)
          if ((j === "" || j === null) && (j = z.toLowerCase().replace(/ ?\n/g, " ")), $ = "#" + j, !r.helper.isUndefined(Z[j]))
            $ = Z[j], r.helper.isUndefined(oe[j]) || (G = oe[j]), r.helper.isUndefined(ne[j]) || (O = ne[j].width, F = ne[j].height);
          else
            return P;
        z = z.replace(/"/g, "&quot;").replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback), $ = $.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback);
        var _e = '<img src="' + $ + '" alt="' + z + '"';
        return G && r.helper.isString(G) && (G = G.replace(/"/g, "&quot;").replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback), _e += ' title="' + G + '"'), O && F && (O = O === "*" ? "auto" : O, F = F === "*" ? "auto" : F, _e += ' width="' + O + '"', _e += ' height="' + F + '"'), _e += " />", _e;
      }
      return l = l.replace(S, B), l = l.replace(k, L), l = l.replace(v, B), l = l.replace(m, B), l = l.replace(C, B), l = d.converter._dispatch("images.after", l, f, d), l;
    }), r.subParser("italicsAndBold", function(l, f, d) {
      l = d.converter._dispatch("italicsAndBold.before", l, f, d);
      function m(v, k, S) {
        return k + v + S;
      }
      return f.literalMidWordUnderscores ? (l = l.replace(/\b___(\S[\s\S]*?)___\b/g, function(v, k) {
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
      })), f.literalMidWordAsterisks ? (l = l.replace(/([^*]|^)\B\*\*\*(\S[\s\S]*?)\*\*\*\B(?!\*)/g, function(v, k, S) {
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
      })), l = d.converter._dispatch("italicsAndBold.after", l, f, d), l;
    }), r.subParser("lists", function(l, f, d) {
      function m(S, C) {
        d.gListLevel++, S = S.replace(/\n{2,}$/, `
`), S += "¨0";
        var L = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0| {0,3}([*+-]|\d+[.])[ \t]+))/gm, B = /\n[ \t]*\n(?!¨0)/.test(S);
        return f.disableForced4SpacesIndentedSublists && (L = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0|\2([*+-]|\d+[.])[ \t]+))/gm), S = S.replace(L, function(P, z, j, $, O, F, H) {
          H = H && H.trim() !== "";
          var G = r.subParser("outdent")(O, f, d), Z = "";
          return F && f.tasklists && (Z = ' class="task-list-item" style="list-style-type: none;"', G = G.replace(/^[ \t]*\[(x|X| )?]/m, function() {
            var oe = '<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"';
            return H && (oe += " checked"), oe += ">", oe;
          })), G = G.replace(/^([-*+]|\d\.)[ \t]+[\S\n ]*/g, function(oe) {
            return "¨A" + oe;
          }), z || G.search(/\n{2,}/) > -1 ? (G = r.subParser("githubCodeBlocks")(G, f, d), G = r.subParser("blockGamut")(G, f, d)) : (G = r.subParser("lists")(G, f, d), G = G.replace(/\n$/, ""), G = r.subParser("hashHTMLBlocks")(G, f, d), G = G.replace(/\n\n+/g, `

`), B ? G = r.subParser("paragraphs")(G, f, d) : G = r.subParser("spanGamut")(G, f, d)), G = G.replace("¨A", ""), G = "<li" + Z + ">" + G + `</li>
`, G;
        }), S = S.replace(/¨0/g, ""), d.gListLevel--, C && (S = S.replace(/\s+$/, "")), S;
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
        var B = f.disableForced4SpacesIndentedSublists ? /^ ?\d+\.[ \t]/gm : /^ {0,3}\d+\.[ \t]/gm, P = f.disableForced4SpacesIndentedSublists ? /^ ?[*+-][ \t]/gm : /^ {0,3}[*+-][ \t]/gm, z = C === "ul" ? B : P, j = "";
        if (S.search(z) !== -1)
          (function O(F) {
            var H = F.search(z), G = v(S, C);
            H !== -1 ? (j += `

<` + C + G + `>
` + m(F.slice(0, H), !!L) + "</" + C + `>
`, C = C === "ul" ? "ol" : "ul", z = C === "ul" ? B : P, O(F.slice(H))) : j += `

<` + C + G + `>
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
      return l = d.converter._dispatch("lists.before", l, f, d), l += "¨0", d.gListLevel ? l = l.replace(
        /^(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(S, C, L) {
          var B = L.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return k(C, B, !0);
        }
      ) : l = l.replace(
        /(\n\n|^\n?)(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(S, C, L, B) {
          var P = B.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return k(L, P, !1);
        }
      ), l = l.replace(/¨0/, ""), l = d.converter._dispatch("lists.after", l, f, d), l;
    }), r.subParser("metadata", function(l, f, d) {
      if (!f.metadata)
        return l;
      l = d.converter._dispatch("metadata.before", l, f, d);
      function m(v) {
        d.metadata.raw = v, v = v.replace(/&/g, "&amp;").replace(/"/g, "&quot;"), v = v.replace(/\n {4}/g, " "), v.replace(/^([\S ]+): +([\s\S]+?)$/gm, function(k, S, C) {
          return d.metadata.parsed[S] = C, "";
        });
      }
      return l = l.replace(/^\s*«««+(\S*?)\n([\s\S]+?)\n»»»+\n/, function(v, k, S) {
        return m(S), "¨M";
      }), l = l.replace(/^\s*---+(\S*?)\n([\s\S]+?)\n---+\n/, function(v, k, S) {
        return k && (d.metadata.format = k), m(S), "¨M";
      }), l = l.replace(/¨M/g, ""), l = d.converter._dispatch("metadata.after", l, f, d), l;
    }), r.subParser("outdent", function(l, f, d) {
      return l = d.converter._dispatch("outdent.before", l, f, d), l = l.replace(/^(\t|[ ]{1,4})/gm, "¨0"), l = l.replace(/¨0/g, ""), l = d.converter._dispatch("outdent.after", l, f, d), l;
    }), r.subParser("paragraphs", function(l, f, d) {
      l = d.converter._dispatch("paragraphs.before", l, f, d), l = l.replace(/^\n+/g, ""), l = l.replace(/\n+$/g, "");
      for (var m = l.split(/\n{2,}/g), v = [], k = m.length, S = 0; S < k; S++) {
        var C = m[S];
        C.search(/¨(K|G)(\d+)\1/g) >= 0 ? v.push(C) : C.search(/\S/) >= 0 && (C = r.subParser("spanGamut")(C, f, d), C = C.replace(/^([ \t]*)/g, "<p>"), C += "</p>", v.push(C));
      }
      for (k = v.length, S = 0; S < k; S++) {
        for (var L = "", B = v[S], P = !1; /¨(K|G)(\d+)\1/.test(B); ) {
          var z = RegExp.$1, j = RegExp.$2;
          z === "K" ? L = d.gHtmlBlocks[j] : P ? L = r.subParser("encodeCode")(d.ghCodeBlocks[j].text, f, d) : L = d.ghCodeBlocks[j].codeblock, L = L.replace(/\$/g, "$$$$"), B = B.replace(/(\n\n)?¨(K|G)\d+\2(\n\n)?/, L), /^<pre\b[^>]*>\s*<code\b[^>]*>/.test(B) && (P = !0);
        }
        v[S] = B;
      }
      return l = v.join(`
`), l = l.replace(/^\n+/g, ""), l = l.replace(/\n+$/g, ""), d.converter._dispatch("paragraphs.after", l, f, d);
    }), r.subParser("runExtension", function(l, f, d, m) {
      if (l.filter)
        f = l.filter(f, m.converter, d);
      else if (l.regex) {
        var v = l.regex;
        v instanceof RegExp || (v = new RegExp(v, "g")), f = f.replace(v, l.replace);
      }
      return f;
    }), r.subParser("spanGamut", function(l, f, d) {
      return l = d.converter._dispatch("spanGamut.before", l, f, d), l = r.subParser("codeSpans")(l, f, d), l = r.subParser("escapeSpecialCharsWithinTagAttributes")(l, f, d), l = r.subParser("encodeBackslashEscapes")(l, f, d), l = r.subParser("images")(l, f, d), l = r.subParser("anchors")(l, f, d), l = r.subParser("autoLinks")(l, f, d), l = r.subParser("simplifiedAutoLinks")(l, f, d), l = r.subParser("emoji")(l, f, d), l = r.subParser("underline")(l, f, d), l = r.subParser("italicsAndBold")(l, f, d), l = r.subParser("strikethrough")(l, f, d), l = r.subParser("ellipsis")(l, f, d), l = r.subParser("hashHTMLSpans")(l, f, d), l = r.subParser("encodeAmpsAndAngles")(l, f, d), f.simpleLineBreaks ? /\n\n¨K/.test(l) || (l = l.replace(/\n+/g, `<br />
`)) : l = l.replace(/  +\n/g, `<br />
`), l = d.converter._dispatch("spanGamut.after", l, f, d), l;
    }), r.subParser("strikethrough", function(l, f, d) {
      function m(v) {
        return f.simplifiedAutoLink && (v = r.subParser("simplifiedAutoLinks")(v, f, d)), "<del>" + v + "</del>";
      }
      return f.strikethrough && (l = d.converter._dispatch("strikethrough.before", l, f, d), l = l.replace(/(?:~){2}([\s\S]+?)(?:~){2}/g, function(v, k) {
        return m(k);
      }), l = d.converter._dispatch("strikethrough.after", l, f, d)), l;
    }), r.subParser("stripLinkDefinitions", function(l, f, d) {
      var m = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?([^>\s]+)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=¨0))/gm, v = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n\n|(?=¨0)|(?=\n\[))/gm;
      l += "¨0";
      var k = function(S, C, L, B, P, z, j) {
        return C = C.toLowerCase(), l.toLowerCase().split(C).length - 1 < 2 ? S : (L.match(/^data:.+?\/.+?;base64,/) ? d.gUrls[C] = L.replace(/\s/g, "") : d.gUrls[C] = r.subParser("encodeAmpsAndAngles")(L, f, d), z ? z + j : (j && (d.gTitles[C] = j.replace(/"|'/g, "&quot;")), f.parseImgDimensions && B && P && (d.gDimensions[C] = {
          width: B,
          height: P
        }), ""));
      };
      return l = l.replace(v, k), l = l.replace(m, k), l = l.replace(/¨0/, ""), l;
    }), r.subParser("tables", function(l, f, d) {
      if (!f.tables)
        return l;
      var m = /^ {0,3}\|?.+\|.+\n {0,3}\|?[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*:?[ \t]*(?:[-=]){2,}[\s\S]+?(?:\n\n|¨0)/gm, v = /^ {0,3}\|.+\|[ \t]*\n {0,3}\|[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*\n( {0,3}\|.+\|[ \t]*\n)*(?:\n|¨0)/gm;
      function k(P) {
        return /^:[ \t]*--*$/.test(P) ? ' style="text-align:left;"' : /^--*[ \t]*:[ \t]*$/.test(P) ? ' style="text-align:right;"' : /^:[ \t]*--*[ \t]*:$/.test(P) ? ' style="text-align:center;"' : "";
      }
      function S(P, z) {
        var j = "";
        return P = P.trim(), (f.tablesHeaderId || f.tableHeaderId) && (j = ' id="' + P.replace(/ /g, "_").toLowerCase() + '"'), P = r.subParser("spanGamut")(P, f, d), "<th" + j + z + ">" + P + `</th>
`;
      }
      function C(P, z) {
        var j = r.subParser("spanGamut")(P, f, d);
        return "<td" + z + ">" + j + `</td>
`;
      }
      function L(P, z) {
        for (var j = `<table>
<thead>
<tr>
`, $ = P.length, O = 0; O < $; ++O)
          j += P[O];
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
      function B(P) {
        var z, j = P.split(`
`);
        for (z = 0; z < j.length; ++z)
          /^ {0,3}\|/.test(j[z]) && (j[z] = j[z].replace(/^ {0,3}\|/, "")), /\|[ \t]*$/.test(j[z]) && (j[z] = j[z].replace(/\|[ \t]*$/, "")), j[z] = r.subParser("codeSpans")(j[z], f, d);
        var $ = j[0].split("|").map(function(_e) {
          return _e.trim();
        }), O = j[1].split("|").map(function(_e) {
          return _e.trim();
        }), F = [], H = [], G = [], Z = [];
        for (j.shift(), j.shift(), z = 0; z < j.length; ++z)
          j[z].trim() !== "" && F.push(
            j[z].split("|").map(function(_e) {
              return _e.trim();
            })
          );
        if ($.length < O.length)
          return P;
        for (z = 0; z < O.length; ++z)
          G.push(k(O[z]));
        for (z = 0; z < $.length; ++z)
          r.helper.isUndefined(G[z]) && (G[z] = ""), H.push(S($[z], G[z]));
        for (z = 0; z < F.length; ++z) {
          for (var oe = [], ne = 0; ne < H.length; ++ne)
            r.helper.isUndefined(F[z][ne]), oe.push(C(F[z][ne], G[ne]));
          Z.push(oe);
        }
        return L(H, Z);
      }
      return l = d.converter._dispatch("tables.before", l, f, d), l = l.replace(/\\(\|)/g, r.helper.escapeCharactersCallback), l = l.replace(m, B), l = l.replace(v, B), l = d.converter._dispatch("tables.after", l, f, d), l;
    }), r.subParser("underline", function(l, f, d) {
      return f.underline && (l = d.converter._dispatch("underline.before", l, f, d), f.literalMidWordUnderscores ? (l = l.replace(/\b___(\S[\s\S]*?)___\b/g, function(m, v) {
        return "<u>" + v + "</u>";
      }), l = l.replace(/\b__(\S[\s\S]*?)__\b/g, function(m, v) {
        return "<u>" + v + "</u>";
      })) : (l = l.replace(/___(\S[\s\S]*?)___/g, function(m, v) {
        return /\S$/.test(v) ? "<u>" + v + "</u>" : m;
      }), l = l.replace(/__(\S[\s\S]*?)__/g, function(m, v) {
        return /\S$/.test(v) ? "<u>" + v + "</u>" : m;
      })), l = l.replace(/(_)/g, r.helper.escapeCharactersCallback), l = d.converter._dispatch("underline.after", l, f, d)), l;
    }), r.subParser("unescapeSpecialChars", function(l, f, d) {
      return l = d.converter._dispatch("unescapeSpecialChars.before", l, f, d), l = l.replace(/¨E(\d+)E/g, function(m, v) {
        var k = parseInt(v);
        return String.fromCharCode(k);
      }), l = d.converter._dispatch("unescapeSpecialChars.after", l, f, d), l;
    }), r.subParser("makeMarkdown.blockquote", function(l, f) {
      var d = "";
      if (l.hasChildNodes())
        for (var m = l.childNodes, v = m.length, k = 0; k < v; ++k) {
          var S = r.subParser("makeMarkdown.node")(m[k], f);
          S !== "" && (d += S);
        }
      return d = d.trim(), d = "> " + d.split(`
`).join(`
> `), d;
    }), r.subParser("makeMarkdown.codeBlock", function(l, f) {
      var d = l.getAttribute("language"), m = l.getAttribute("precodenum");
      return "```" + d + `
` + f.preList[m] + "\n```";
    }), r.subParser("makeMarkdown.codeSpan", function(l) {
      return "`" + l.innerHTML + "`";
    }), r.subParser("makeMarkdown.emphasis", function(l, f) {
      var d = "";
      if (l.hasChildNodes()) {
        d += "*";
        for (var m = l.childNodes, v = m.length, k = 0; k < v; ++k)
          d += r.subParser("makeMarkdown.node")(m[k], f);
        d += "*";
      }
      return d;
    }), r.subParser("makeMarkdown.header", function(l, f, d) {
      var m = new Array(d + 1).join("#"), v = "";
      if (l.hasChildNodes()) {
        v = m + " ";
        for (var k = l.childNodes, S = k.length, C = 0; C < S; ++C)
          v += r.subParser("makeMarkdown.node")(k[C], f);
      }
      return v;
    }), r.subParser("makeMarkdown.hr", function() {
      return "---";
    }), r.subParser("makeMarkdown.image", function(l) {
      var f = "";
      return l.hasAttribute("src") && (f += "![" + l.getAttribute("alt") + "](", f += "<" + l.getAttribute("src") + ">", l.hasAttribute("width") && l.hasAttribute("height") && (f += " =" + l.getAttribute("width") + "x" + l.getAttribute("height")), l.hasAttribute("title") && (f += ' "' + l.getAttribute("title") + '"'), f += ")"), f;
    }), r.subParser("makeMarkdown.links", function(l, f) {
      var d = "";
      if (l.hasChildNodes() && l.hasAttribute("href")) {
        var m = l.childNodes, v = m.length;
        d = "[";
        for (var k = 0; k < v; ++k)
          d += r.subParser("makeMarkdown.node")(m[k], f);
        d += "](", d += "<" + l.getAttribute("href") + ">", l.hasAttribute("title") && (d += ' "' + l.getAttribute("title") + '"'), d += ")";
      }
      return d;
    }), r.subParser("makeMarkdown.list", function(l, f, d) {
      var m = "";
      if (!l.hasChildNodes())
        return "";
      for (var v = l.childNodes, k = v.length, S = l.getAttribute("start") || 1, C = 0; C < k; ++C)
        if (!(typeof v[C].tagName > "u" || v[C].tagName.toLowerCase() !== "li")) {
          var L = "";
          d === "ol" ? L = S.toString() + ". " : L = "- ", m += L + r.subParser("makeMarkdown.listItem")(v[C], f), ++S;
        }
      return m += `
<!-- -->
`, m.trim();
    }), r.subParser("makeMarkdown.listItem", function(l, f) {
      for (var d = "", m = l.childNodes, v = m.length, k = 0; k < v; ++k)
        d += r.subParser("makeMarkdown.node")(m[k], f);
      return /\n$/.test(d) ? d = d.split(`
`).join(`
    `).replace(/^ {4}$/gm, "").replace(/\n\n+/g, `

`) : d += `
`, d;
    }), r.subParser("makeMarkdown.node", function(l, f, d) {
      d = d || !1;
      var m = "";
      if (l.nodeType === 3)
        return r.subParser("makeMarkdown.txt")(l, f);
      if (l.nodeType === 8)
        return "<!--" + l.data + `-->

`;
      if (l.nodeType !== 1)
        return "";
      var v = l.tagName.toLowerCase();
      switch (v) {
        case "h1":
          d || (m = r.subParser("makeMarkdown.header")(l, f, 1) + `

`);
          break;
        case "h2":
          d || (m = r.subParser("makeMarkdown.header")(l, f, 2) + `

`);
          break;
        case "h3":
          d || (m = r.subParser("makeMarkdown.header")(l, f, 3) + `

`);
          break;
        case "h4":
          d || (m = r.subParser("makeMarkdown.header")(l, f, 4) + `

`);
          break;
        case "h5":
          d || (m = r.subParser("makeMarkdown.header")(l, f, 5) + `

`);
          break;
        case "h6":
          d || (m = r.subParser("makeMarkdown.header")(l, f, 6) + `

`);
          break;
        case "p":
          d || (m = r.subParser("makeMarkdown.paragraph")(l, f) + `

`);
          break;
        case "blockquote":
          d || (m = r.subParser("makeMarkdown.blockquote")(l, f) + `

`);
          break;
        case "hr":
          d || (m = r.subParser("makeMarkdown.hr")(l, f) + `

`);
          break;
        case "ol":
          d || (m = r.subParser("makeMarkdown.list")(l, f, "ol") + `

`);
          break;
        case "ul":
          d || (m = r.subParser("makeMarkdown.list")(l, f, "ul") + `

`);
          break;
        case "precode":
          d || (m = r.subParser("makeMarkdown.codeBlock")(l, f) + `

`);
          break;
        case "pre":
          d || (m = r.subParser("makeMarkdown.pre")(l, f) + `

`);
          break;
        case "table":
          d || (m = r.subParser("makeMarkdown.table")(l, f) + `

`);
          break;
        case "code":
          m = r.subParser("makeMarkdown.codeSpan")(l, f);
          break;
        case "em":
        case "i":
          m = r.subParser("makeMarkdown.emphasis")(l, f);
          break;
        case "strong":
        case "b":
          m = r.subParser("makeMarkdown.strong")(l, f);
          break;
        case "del":
          m = r.subParser("makeMarkdown.strikethrough")(l, f);
          break;
        case "a":
          m = r.subParser("makeMarkdown.links")(l, f);
          break;
        case "img":
          m = r.subParser("makeMarkdown.image")(l, f);
          break;
        default:
          m = l.outerHTML + `

`;
      }
      return m;
    }), r.subParser("makeMarkdown.paragraph", function(l, f) {
      var d = "";
      if (l.hasChildNodes())
        for (var m = l.childNodes, v = m.length, k = 0; k < v; ++k)
          d += r.subParser("makeMarkdown.node")(m[k], f);
      return d = d.trim(), d;
    }), r.subParser("makeMarkdown.pre", function(l, f) {
      var d = l.getAttribute("prenum");
      return "<pre>" + f.preList[d] + "</pre>";
    }), r.subParser("makeMarkdown.strikethrough", function(l, f) {
      var d = "";
      if (l.hasChildNodes()) {
        d += "~~";
        for (var m = l.childNodes, v = m.length, k = 0; k < v; ++k)
          d += r.subParser("makeMarkdown.node")(m[k], f);
        d += "~~";
      }
      return d;
    }), r.subParser("makeMarkdown.strong", function(l, f) {
      var d = "";
      if (l.hasChildNodes()) {
        d += "**";
        for (var m = l.childNodes, v = m.length, k = 0; k < v; ++k)
          d += r.subParser("makeMarkdown.node")(m[k], f);
        d += "**";
      }
      return d;
    }), r.subParser("makeMarkdown.table", function(l, f) {
      var d = "", m = [[], []], v = l.querySelectorAll("thead>tr>th"), k = l.querySelectorAll("tbody>tr"), S, C;
      for (S = 0; S < v.length; ++S) {
        var L = r.subParser("makeMarkdown.tableCell")(v[S], f), B = "---";
        if (v[S].hasAttribute("style")) {
          var P = v[S].getAttribute("style").toLowerCase().replace(/\s/g, "");
          switch (P) {
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
          typeof j[C] < "u" && ($ = r.subParser("makeMarkdown.tableCell")(j[C], f)), m[z].push($);
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
        d += "| " + m[S].join(" | ") + ` |
`;
      }
      return d.trim();
    }), r.subParser("makeMarkdown.tableCell", function(l, f) {
      var d = "";
      if (!l.hasChildNodes())
        return "";
      for (var m = l.childNodes, v = m.length, k = 0; k < v; ++k)
        d += r.subParser("makeMarkdown.node")(m[k], f, !0);
      return d.trim();
    }), r.subParser("makeMarkdown.txt", function(l) {
      var f = l.nodeValue;
      return f = f.replace(/ +/g, " "), f = f.replace(/¨NBSP;/g, " "), f = r.helper.unescapeHTMLEntities(f), f = f.replace(/([*_~|`])/g, "\\$1"), f = f.replace(/^(\s*)>/g, "\\$1>"), f = f.replace(/^#/gm, "\\#"), f = f.replace(/^(\s*)([-=]{3,})(\s*)$/, "$1\\$2$3"), f = f.replace(/^( {0,3}\d+)\./gm, "$1\\."), f = f.replace(/^( {0,3})([+-])/gm, "$1\\$2"), f = f.replace(/]([\s]*)\(/g, "\\]$1\\("), f = f.replace(/^ {0,3}\[([\S \t]*?)]:/gm, "\\[$1]:"), f;
    });
    var N = this;
    e.exports ? e.exports = r : N.showdown = r;
  }).call(by);
})(Z_);
var Jj = Z_.exports;
const eE = /* @__PURE__ */ id(Jj);
function tE() {
  return [
    {
      type: "lang",
      regex: /(?<![a-zA-Z0-9_])_(?!_)((?:[^_<>]|<[^>]*>)+?)_(?![a-zA-Z0-9_])/g,
      replace: (e, t) => `<em>${t}</em>`
    }
  ];
}
function nE() {
  return [
    {
      type: "lang",
      filter: (e) => e
    }
  ];
}
function rE() {
  const e = new eE.Converter({
    emoji: !0,
    literalMidWordUnderscores: !0,
    parseImgDimensions: !0,
    tables: !0,
    underline: !0,
    simpleLineBreaks: !0,
    strikethrough: !0,
    disableForced4SpacesIndentedSublists: !0,
    extensions: [...tE()]
  });
  return e.addExtension(nE(), "exclusion"), e;
}
let Cu = null;
function sE() {
  return Cu || (Cu = rE()), Cu;
}
/*! @license DOMPurify 3.4.5 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.5/LICENSE */
function Fm(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function aE(e) {
  if (Array.isArray(e)) return e;
}
function iE(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, s, a, o, u = [], c = !0, p = !1;
    try {
      if (a = (n = n.call(e)).next, t !== 0) for (; !(c = (r = a.call(n)).done) && (u.push(r.value), u.length !== t); c = !0) ;
    } catch (h) {
      p = !0, s = h;
    } finally {
      try {
        if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
      } finally {
        if (p) throw s;
      }
    }
    return u;
  }
}
function oE() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function lE(e, t) {
  return aE(e) || iE(e, t) || uE(e, t) || oE();
}
function uE(e, t) {
  if (e) {
    if (typeof e == "string") return Fm(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Fm(e, t) : void 0;
  }
}
const J_ = Object.entries, Hm = Object.setPrototypeOf, cE = Object.isFrozen, dE = Object.getPrototypeOf, fE = Object.getOwnPropertyDescriptor;
let Nt = Object.freeze, ln = Object.seal, bs = Object.create, ey = typeof Reflect < "u" && Reflect, Jc = ey.apply, ed = ey.construct;
Nt || (Nt = function(t) {
  return t;
});
ln || (ln = function(t) {
  return t;
});
Jc || (Jc = function(t, n) {
  for (var r = arguments.length, s = new Array(r > 2 ? r - 2 : 0), a = 2; a < r; a++)
    s[a - 2] = arguments[a];
  return t.apply(n, s);
});
ed || (ed = function(t) {
  for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), s = 1; s < n; s++)
    r[s - 1] = arguments[s];
  return new t(...r);
});
const vs = Ye(Array.prototype.forEach), pE = Ye(Array.prototype.lastIndexOf), Um = Ye(Array.prototype.pop), _s = Ye(Array.prototype.push), mE = Ye(Array.prototype.splice), bt = Array.isArray, Ea = Ye(String.prototype.toLowerCase), Tu = Ye(String.prototype.toString), Wm = Ye(String.prototype.match), ys = Ye(String.prototype.replace), Gm = Ye(String.prototype.indexOf), hE = Ye(String.prototype.trim), gE = Ye(Number.prototype.toString), vE = Ye(Boolean.prototype.toString), Vm = typeof BigInt > "u" ? null : Ye(BigInt.prototype.toString), Km = typeof Symbol > "u" ? null : Ye(Symbol.prototype.toString), Ue = Ye(Object.prototype.hasOwnProperty), ba = Ye(Object.prototype.toString), it = Ye(RegExp.prototype.test), lo = _E(TypeError);
function Ye(e) {
  return function(t) {
    t instanceof RegExp && (t.lastIndex = 0);
    for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), s = 1; s < n; s++)
      r[s - 1] = arguments[s];
    return Jc(e, t, r);
  };
}
function _E(e) {
  return function() {
    for (var t = arguments.length, n = new Array(t), r = 0; r < t; r++)
      n[r] = arguments[r];
    return ed(e, n);
  };
}
function pe(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Ea;
  if (Hm && Hm(e, null), !bt(t))
    return e;
  let r = t.length;
  for (; r--; ) {
    let s = t[r];
    if (typeof s == "string") {
      const a = n(s);
      a !== s && (cE(t) || (t[r] = a), s = a);
    }
    e[s] = !0;
  }
  return e;
}
function yE(e) {
  for (let t = 0; t < e.length; t++)
    Ue(e, t) || (e[t] = null);
  return e;
}
function At(e) {
  const t = bs(null);
  for (const r of J_(e)) {
    var n = lE(r, 2);
    const s = n[0], a = n[1];
    Ue(e, s) && (bt(a) ? t[s] = yE(a) : a && typeof a == "object" && a.constructor === Object ? t[s] = At(a) : t[s] = a);
  }
  return t;
}
function xE(e) {
  switch (typeof e) {
    case "string":
      return e;
    case "number":
      return gE(e);
    case "boolean":
      return vE(e);
    case "bigint":
      return Vm ? Vm(e) : "0";
    case "symbol":
      return Km ? Km(e) : "Symbol()";
    case "undefined":
      return ba(e);
    case "function":
    case "object": {
      if (e === null)
        return ba(e);
      const t = e, n = Vr(t, "toString");
      if (typeof n == "function") {
        const r = n(t);
        return typeof r == "string" ? r : ba(r);
      }
      return ba(e);
    }
    default:
      return ba(e);
  }
}
function Vr(e, t) {
  for (; e !== null; ) {
    const r = fE(e, t);
    if (r) {
      if (r.get)
        return Ye(r.get);
      if (typeof r.value == "function")
        return Ye(r.value);
    }
    e = dE(e);
  }
  function n() {
    return null;
  }
  return n;
}
function wE(e) {
  try {
    return it(e, ""), !0;
  } catch {
    return !1;
  }
}
const qm = Nt(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), Iu = Nt(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), Au = Nt(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), bE = Nt(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Pu = Nt(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), SE = Nt(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Ym = Nt(["#text"]), Qm = Nt(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "command", "commandfor", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns"]), Ru = Nt(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), Xm = Nt(["accent", "accentunder", "align", "bevelled", "close", "columnalign", "columnlines", "columnspacing", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lquote", "lspace", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), uo = Nt(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), kE = ln(/{{[\w\W]*|^[\w\W]*}}/g), NE = ln(/<%[\w\W]*|^[\w\W]*%>/g), jE = ln(/\${[\w\W]*/g), EE = ln(/^data-[\-\w.\u00B7-\uFFFF]+$/), CE = ln(/^aria-[\-\w]+$/), Zm = ln(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), TE = ln(/^(?:\w+script|data):/i), IE = ln(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), AE = ln(/^html$/i), PE = ln(/^[a-z][.\w]*(-[.\w]+)+$/i), xs = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, RE = function() {
  return typeof window > "u" ? null : window;
}, ME = function(t, n) {
  if (typeof t != "object" || typeof t.createPolicy != "function")
    return null;
  let r = null;
  const s = "data-tt-policy-suffix";
  n && n.hasAttribute(s) && (r = n.getAttribute(s));
  const a = "dompurify" + (r ? "#" + r : "");
  try {
    return t.createPolicy(a, {
      createHTML(o) {
        return o;
      },
      createScriptURL(o) {
        return o;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + a + " could not be created."), null;
  }
}, Jm = function() {
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
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : RE();
  const t = (T) => ty(T);
  if (t.version = "3.4.5", t.removed = [], !e || !e.document || e.document.nodeType !== xs.document || !e.Element)
    return t.isSupported = !1, t;
  let n = e.document;
  const r = n, s = r.currentScript, a = e.DocumentFragment, o = e.HTMLTemplateElement, u = e.Node, c = e.Element, p = e.NodeFilter, h = e.NamedNodeMap, b = h === void 0 ? e.NamedNodeMap || e.MozNamedAttrMap : h, g = e.HTMLFormElement, w = e.DOMParser, E = e.trustedTypes, A = c.prototype, D = Vr(A, "cloneNode"), _ = Vr(A, "remove"), x = Vr(A, "nextSibling"), N = Vr(A, "childNodes"), l = Vr(A, "parentNode"), f = u && u.prototype ? Vr(u.prototype, "nodeType") : null;
  if (typeof o == "function") {
    const T = n.createElement("template");
    T.content && T.content.ownerDocument && (n = T.content.ownerDocument);
  }
  let d, m = "";
  const v = n, k = v.implementation, S = v.createNodeIterator, C = v.createDocumentFragment, L = v.getElementsByTagName, B = r.importNode;
  let P = Jm();
  t.isSupported = typeof J_ == "function" && typeof l == "function" && k && k.createHTMLDocument !== void 0;
  const z = kE, j = NE, $ = jE, O = EE, F = CE, H = TE, G = IE, Z = PE;
  let oe = Zm, ne = null;
  const _e = pe({}, [...qm, ...Iu, ...Au, ...Pu, ...Ym]);
  let te = null;
  const Y = pe({}, [...Qm, ...Ru, ...Xm, ...uo]);
  let U = Object.seal(bs(null, {
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
  })), re = null, de = null;
  const ge = Object.seal(bs(null, {
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
  let be = !0, ye = !0, Ce = !1, et = !0, je = !1, dt = !0, tt = !1, un = !1, kn = !1, Kt = !1, Bn = !1, cn = !1, Lt = !0, qt = !1;
  const zr = "user-content-";
  let ir = !0, Nn = !1, dn = {}, Tt = null;
  const or = pe({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let ds = null;
  const ji = pe({}, ["audio", "video", "img", "source", "image", "track"]);
  let aa = null;
  const Ei = pe({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), fs = "http://www.w3.org/1998/Math/MathML", lr = "http://www.w3.org/2000/svg", Yt = "http://www.w3.org/1999/xhtml";
  let ur = Yt, ia = !1, oa = null;
  const Rl = pe({}, [fs, lr, Yt], Tu);
  let la = pe({}, ["mi", "mo", "mn", "ms", "mtext"]), ps = pe({}, ["annotation-xml"]);
  const ce = pe({}, ["title", "style", "font", "a", "script"]);
  let at = null;
  const Ml = ["application/xhtml+xml", "text/html"], fn = "text/html";
  let He = null, $n = null;
  const Dl = n.createElement("form"), Ve = function(y) {
    return y instanceof RegExp || y instanceof Function;
  }, ua = function() {
    let y = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if ($n && $n === y)
      return;
    (!y || typeof y != "object") && (y = {}), y = At(y), at = // eslint-disable-next-line unicorn/prefer-includes
    Ml.indexOf(y.PARSER_MEDIA_TYPE) === -1 ? fn : y.PARSER_MEDIA_TYPE, He = at === "application/xhtml+xml" ? Tu : Ea, ne = Ue(y, "ALLOWED_TAGS") && bt(y.ALLOWED_TAGS) ? pe({}, y.ALLOWED_TAGS, He) : _e, te = Ue(y, "ALLOWED_ATTR") && bt(y.ALLOWED_ATTR) ? pe({}, y.ALLOWED_ATTR, He) : Y, oa = Ue(y, "ALLOWED_NAMESPACES") && bt(y.ALLOWED_NAMESPACES) ? pe({}, y.ALLOWED_NAMESPACES, Tu) : Rl, aa = Ue(y, "ADD_URI_SAFE_ATTR") && bt(y.ADD_URI_SAFE_ATTR) ? pe(At(Ei), y.ADD_URI_SAFE_ATTR, He) : Ei, ds = Ue(y, "ADD_DATA_URI_TAGS") && bt(y.ADD_DATA_URI_TAGS) ? pe(At(ji), y.ADD_DATA_URI_TAGS, He) : ji, Tt = Ue(y, "FORBID_CONTENTS") && bt(y.FORBID_CONTENTS) ? pe({}, y.FORBID_CONTENTS, He) : or, re = Ue(y, "FORBID_TAGS") && bt(y.FORBID_TAGS) ? pe({}, y.FORBID_TAGS, He) : At({}), de = Ue(y, "FORBID_ATTR") && bt(y.FORBID_ATTR) ? pe({}, y.FORBID_ATTR, He) : At({}), dn = Ue(y, "USE_PROFILES") ? y.USE_PROFILES && typeof y.USE_PROFILES == "object" ? At(y.USE_PROFILES) : y.USE_PROFILES : !1, be = y.ALLOW_ARIA_ATTR !== !1, ye = y.ALLOW_DATA_ATTR !== !1, Ce = y.ALLOW_UNKNOWN_PROTOCOLS || !1, et = y.ALLOW_SELF_CLOSE_IN_ATTR !== !1, je = y.SAFE_FOR_TEMPLATES || !1, dt = y.SAFE_FOR_XML !== !1, tt = y.WHOLE_DOCUMENT || !1, Kt = y.RETURN_DOM || !1, Bn = y.RETURN_DOM_FRAGMENT || !1, cn = y.RETURN_TRUSTED_TYPE || !1, kn = y.FORCE_BODY || !1, Lt = y.SANITIZE_DOM !== !1, qt = y.SANITIZE_NAMED_PROPS || !1, ir = y.KEEP_CONTENT !== !1, Nn = y.IN_PLACE || !1, oe = wE(y.ALLOWED_URI_REGEXP) ? y.ALLOWED_URI_REGEXP : Zm, ur = typeof y.NAMESPACE == "string" ? y.NAMESPACE : Yt, la = Ue(y, "MATHML_TEXT_INTEGRATION_POINTS") && y.MATHML_TEXT_INTEGRATION_POINTS && typeof y.MATHML_TEXT_INTEGRATION_POINTS == "object" ? At(y.MATHML_TEXT_INTEGRATION_POINTS) : pe({}, ["mi", "mo", "mn", "ms", "mtext"]), ps = Ue(y, "HTML_INTEGRATION_POINTS") && y.HTML_INTEGRATION_POINTS && typeof y.HTML_INTEGRATION_POINTS == "object" ? At(y.HTML_INTEGRATION_POINTS) : pe({}, ["annotation-xml"]);
    const I = Ue(y, "CUSTOM_ELEMENT_HANDLING") && y.CUSTOM_ELEMENT_HANDLING && typeof y.CUSTOM_ELEMENT_HANDLING == "object" ? At(y.CUSTOM_ELEMENT_HANDLING) : bs(null);
    if (U = bs(null), Ue(I, "tagNameCheck") && Ve(I.tagNameCheck) && (U.tagNameCheck = I.tagNameCheck), Ue(I, "attributeNameCheck") && Ve(I.attributeNameCheck) && (U.attributeNameCheck = I.attributeNameCheck), Ue(I, "allowCustomizedBuiltInElements") && typeof I.allowCustomizedBuiltInElements == "boolean" && (U.allowCustomizedBuiltInElements = I.allowCustomizedBuiltInElements), je && (ye = !1), Bn && (Kt = !0), dn && (ne = pe({}, Ym), te = bs(null), dn.html === !0 && (pe(ne, qm), pe(te, Qm)), dn.svg === !0 && (pe(ne, Iu), pe(te, Ru), pe(te, uo)), dn.svgFilters === !0 && (pe(ne, Au), pe(te, Ru), pe(te, uo)), dn.mathMl === !0 && (pe(ne, Pu), pe(te, Xm), pe(te, uo))), ge.tagCheck = null, ge.attributeCheck = null, Ue(y, "ADD_TAGS") && (typeof y.ADD_TAGS == "function" ? ge.tagCheck = y.ADD_TAGS : bt(y.ADD_TAGS) && (ne === _e && (ne = At(ne)), pe(ne, y.ADD_TAGS, He))), Ue(y, "ADD_ATTR") && (typeof y.ADD_ATTR == "function" ? ge.attributeCheck = y.ADD_ATTR : bt(y.ADD_ATTR) && (te === Y && (te = At(te)), pe(te, y.ADD_ATTR, He))), Ue(y, "ADD_URI_SAFE_ATTR") && bt(y.ADD_URI_SAFE_ATTR) && pe(aa, y.ADD_URI_SAFE_ATTR, He), Ue(y, "FORBID_CONTENTS") && bt(y.FORBID_CONTENTS) && (Tt === or && (Tt = At(Tt)), pe(Tt, y.FORBID_CONTENTS, He)), Ue(y, "ADD_FORBID_CONTENTS") && bt(y.ADD_FORBID_CONTENTS) && (Tt === or && (Tt = At(Tt)), pe(Tt, y.ADD_FORBID_CONTENTS, He)), ir && (ne["#text"] = !0), tt && pe(ne, ["html", "head", "body"]), ne.table && (pe(ne, ["tbody"]), delete re.tbody), y.TRUSTED_TYPES_POLICY) {
      if (typeof y.TRUSTED_TYPES_POLICY.createHTML != "function")
        throw lo('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof y.TRUSTED_TYPES_POLICY.createScriptURL != "function")
        throw lo('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      d = y.TRUSTED_TYPES_POLICY, m = d.createHTML("");
    } else
      d === void 0 && (d = ME(E, s)), d !== null && typeof m == "string" && (m = d.createHTML(""));
    Nt && Nt(y), $n = y;
  }, Ci = pe({}, [...Iu, ...Au, ...bE]), Ti = pe({}, [...Pu, ...SE]), Ol = function(y) {
    let I = l(y);
    (!I || !I.tagName) && (I = {
      namespaceURI: ur,
      tagName: "template"
    });
    const M = Ea(y.tagName), q = Ea(I.tagName);
    return oa[y.namespaceURI] ? y.namespaceURI === lr ? I.namespaceURI === Yt ? M === "svg" : I.namespaceURI === fs ? M === "svg" && (q === "annotation-xml" || la[q]) : !!Ci[M] : y.namespaceURI === fs ? I.namespaceURI === Yt ? M === "math" : I.namespaceURI === lr ? M === "math" && ps[q] : !!Ti[M] : y.namespaceURI === Yt ? I.namespaceURI === lr && !ps[q] || I.namespaceURI === fs && !la[q] ? !1 : !Ti[M] && (ce[M] || !Ci[M]) : !!(at === "application/xhtml+xml" && oa[y.namespaceURI]) : !1;
  }, zt = function(y) {
    _s(t.removed, {
      element: y
    });
    try {
      l(y).removeChild(y);
    } catch {
      _(y);
    }
  }, Fn = function(y, I) {
    try {
      _s(t.removed, {
        attribute: I.getAttributeNode(y),
        from: I
      });
    } catch {
      _s(t.removed, {
        attribute: null,
        from: I
      });
    }
    if (I.removeAttribute(y), y === "is")
      if (Kt || Bn)
        try {
          zt(I);
        } catch {
        }
      else
        try {
          I.setAttribute(y, "");
        } catch {
        }
  }, Ii = function(y) {
    let I = null, M = null;
    if (kn)
      y = "<remove></remove>" + y;
    else {
      const fe = Wm(y, /^[\r\n\t ]+/);
      M = fe && fe[0];
    }
    at === "application/xhtml+xml" && ur === Yt && (y = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + y + "</body></html>");
    const q = d ? d.createHTML(y) : y;
    if (ur === Yt)
      try {
        I = new w().parseFromString(q, at);
      } catch {
      }
    if (!I || !I.documentElement) {
      I = k.createDocument(ur, "template", null);
      try {
        I.documentElement.innerHTML = ia ? m : q;
      } catch {
      }
    }
    const se = I.body || I.documentElement;
    return y && M && se.insertBefore(n.createTextNode(M), se.childNodes[0] || null), ur === Yt ? L.call(I, tt ? "html" : "body")[0] : tt ? I.documentElement : se;
  }, Ai = function(y) {
    return S.call(
      y.ownerDocument || y,
      y,
      // eslint-disable-next-line no-bitwise
      p.SHOW_ELEMENT | p.SHOW_COMMENT | p.SHOW_TEXT | p.SHOW_PROCESSING_INSTRUCTION | p.SHOW_CDATA_SECTION,
      null
    );
  }, Pi = function(y) {
    y.normalize();
    const I = S.call(
      y.ownerDocument || y,
      y,
      // eslint-disable-next-line no-bitwise
      p.SHOW_TEXT | p.SHOW_COMMENT | p.SHOW_CDATA_SECTION | p.SHOW_PROCESSING_INSTRUCTION,
      null
    );
    let M = I.nextNode();
    for (; M; ) {
      let q = M.data;
      vs([z, j, $], (se) => {
        q = ys(q, se, " ");
      }), M.data = q, M = I.nextNode();
    }
  }, ca = function(y) {
    return y instanceof g && (typeof y.nodeName != "string" || typeof y.textContent != "string" || typeof y.removeChild != "function" || !(y.attributes instanceof b) || typeof y.removeAttribute != "function" || typeof y.setAttribute != "function" || typeof y.namespaceURI != "string" || typeof y.insertBefore != "function" || typeof y.hasChildNodes != "function");
  }, ms = function(y) {
    if (!f || typeof y != "object" || y === null)
      return !1;
    try {
      return typeof f(y) == "number";
    } catch {
      return !1;
    }
  };
  function pn(T, y, I) {
    vs(T, (M) => {
      M.call(t, y, I, $n);
    });
  }
  const Ri = function(y) {
    let I = null;
    if (pn(P.beforeSanitizeElements, y, null), ca(y))
      return zt(y), !0;
    const M = He(y.nodeName);
    if (pn(P.uponSanitizeElement, y, {
      tagName: M,
      allowedTags: ne
    }), dt && y.hasChildNodes() && !ms(y.firstElementChild) && it(/<[/\w!]/g, y.innerHTML) && it(/<[/\w!]/g, y.textContent) || dt && y.namespaceURI === Yt && M === "style" && ms(y.firstElementChild) || y.nodeType === xs.progressingInstruction || dt && y.nodeType === xs.comment && it(/<[/\w]/g, y.data))
      return zt(y), !0;
    if (re[M] || !(ge.tagCheck instanceof Function && ge.tagCheck(M)) && !ne[M]) {
      if (!re[M] && Mi(M) && (U.tagNameCheck instanceof RegExp && it(U.tagNameCheck, M) || U.tagNameCheck instanceof Function && U.tagNameCheck(M)))
        return !1;
      if (ir && !Tt[M]) {
        const q = l(y) || y.parentNode, se = N(y) || y.childNodes;
        if (se && q) {
          const fe = se.length;
          for (let Te = fe - 1; Te >= 0; --Te) {
            const It = D(se[Te], !0);
            q.insertBefore(It, x(y));
          }
        }
      }
      return zt(y), !0;
    }
    return y instanceof c && !Ol(y) || (M === "noscript" || M === "noembed" || M === "noframes") && it(/<\/no(script|embed|frames)/i, y.innerHTML) ? (zt(y), !0) : (je && y.nodeType === xs.text && (I = y.textContent, vs([z, j, $], (q) => {
      I = ys(I, q, " ");
    }), y.textContent !== I && (_s(t.removed, {
      element: y.cloneNode()
    }), y.textContent = I)), pn(P.afterSanitizeElements, y, null), !1);
  }, Br = function(y, I, M) {
    if (de[I] || Lt && (I === "id" || I === "name") && (M in n || M in Dl))
      return !1;
    const q = te[I] || ge.attributeCheck instanceof Function && ge.attributeCheck(I, y);
    if (!(ye && !de[I] && it(O, I))) {
      if (!(be && it(F, I))) {
        if (!q || de[I]) {
          if (
            // First condition does a very basic check if a) it's basically a valid custom element tagname AND
            // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
            !(Mi(y) && (U.tagNameCheck instanceof RegExp && it(U.tagNameCheck, y) || U.tagNameCheck instanceof Function && U.tagNameCheck(y)) && (U.attributeNameCheck instanceof RegExp && it(U.attributeNameCheck, I) || U.attributeNameCheck instanceof Function && U.attributeNameCheck(I, y)) || // Alternative, second condition checks if it's an `is`-attribute, AND
            // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            I === "is" && U.allowCustomizedBuiltInElements && (U.tagNameCheck instanceof RegExp && it(U.tagNameCheck, M) || U.tagNameCheck instanceof Function && U.tagNameCheck(M)))
          ) return !1;
        } else if (!aa[I]) {
          if (!it(oe, ys(M, G, ""))) {
            if (!((I === "src" || I === "xlink:href" || I === "href") && y !== "script" && Gm(M, "data:") === 0 && ds[y])) {
              if (!(Ce && !it(H, ys(M, G, "")))) {
                if (M)
                  return !1;
              }
            }
          }
        }
      }
    }
    return !0;
  }, Ll = pe({}, ["annotation-xml", "color-profile", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "missing-glyph"]), Mi = function(y) {
    return !Ll[Ea(y)] && it(Z, y);
  }, Di = function(y) {
    pn(P.beforeSanitizeAttributes, y, null);
    const I = y.attributes;
    if (!I || ca(y))
      return;
    const M = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: te,
      forceKeepAttr: void 0
    };
    let q = I.length;
    for (; q--; ) {
      const se = I[q], fe = se.name, Te = se.namespaceURI, It = se.value, Hn = He(fe), zl = It;
      let nt = fe === "value" ? zl : hE(zl);
      if (M.attrName = Hn, M.attrValue = nt, M.keepAttr = !0, M.forceKeepAttr = void 0, pn(P.uponSanitizeAttribute, y, M), nt = M.attrValue, qt && (Hn === "id" || Hn === "name") && Gm(nt, zr) !== 0 && (Fn(fe, y), nt = zr + nt), dt && it(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, nt)) {
        Fn(fe, y);
        continue;
      }
      if (Hn === "attributename" && Wm(nt, "href")) {
        Fn(fe, y);
        continue;
      }
      if (M.forceKeepAttr)
        continue;
      if (!M.keepAttr) {
        Fn(fe, y);
        continue;
      }
      if (!et && it(/\/>/i, nt)) {
        Fn(fe, y);
        continue;
      }
      je && vs([z, j, $], (Tf) => {
        nt = ys(nt, Tf, " ");
      });
      const Cf = He(y.nodeName);
      if (!Br(Cf, Hn, nt)) {
        Fn(fe, y);
        continue;
      }
      if (d && typeof E == "object" && typeof E.getAttributeType == "function" && !Te)
        switch (E.getAttributeType(Cf, Hn)) {
          case "TrustedHTML": {
            nt = d.createHTML(nt);
            break;
          }
          case "TrustedScriptURL": {
            nt = d.createScriptURL(nt);
            break;
          }
        }
      if (nt !== zl)
        try {
          Te ? y.setAttributeNS(Te, fe, nt) : y.setAttribute(fe, nt), ca(y) ? zt(y) : Um(t.removed);
        } catch {
          Fn(fe, y);
        }
    }
    pn(P.afterSanitizeAttributes, y, null);
  }, da = function(y) {
    let I = null;
    const M = Ai(y);
    for (pn(P.beforeSanitizeShadowDOM, y, null); I = M.nextNode(); )
      pn(P.uponSanitizeShadowNode, I, null), Ri(I), Di(I), I.content instanceof a && da(I.content);
    pn(P.afterSanitizeShadowDOM, y, null);
  }, hs = function(y) {
    if (y.nodeType === xs.element && y.shadowRoot instanceof a) {
      const q = y.shadowRoot;
      hs(q), da(q);
    }
    const I = y.childNodes;
    if (!I)
      return;
    const M = [];
    vs(I, (q) => {
      _s(M, q);
    });
    for (const q of M)
      hs(q);
  };
  return t.sanitize = function(T) {
    let y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, I = null, M = null, q = null, se = null;
    if (ia = !T, ia && (T = "<!-->"), typeof T != "string" && !ms(T) && (T = xE(T), typeof T != "string"))
      throw lo("dirty is not a string, aborting");
    if (!t.isSupported)
      return T;
    if (un || ua(y), t.removed = [], typeof T == "string" && (Nn = !1), Nn) {
      const It = T.nodeName;
      if (typeof It == "string") {
        const Hn = He(It);
        if (!ne[Hn] || re[Hn])
          throw lo("root node is forbidden and cannot be sanitized in-place");
      }
      hs(T);
    } else if (ms(T))
      I = Ii("<!---->"), M = I.ownerDocument.importNode(T, !0), M.nodeType === xs.element && M.nodeName === "BODY" || M.nodeName === "HTML" ? I = M : I.appendChild(M), hs(M);
    else {
      if (!Kt && !je && !tt && // eslint-disable-next-line unicorn/prefer-includes
      T.indexOf("<") === -1)
        return d && cn ? d.createHTML(T) : T;
      if (I = Ii(T), !I)
        return Kt ? null : cn ? m : "";
    }
    I && kn && zt(I.firstChild);
    const fe = Ai(Nn ? T : I);
    for (; q = fe.nextNode(); )
      Ri(q), Di(q), q.content instanceof a && da(q.content);
    if (Nn)
      return je && Pi(T), T;
    if (Kt) {
      if (je && Pi(I), Bn)
        for (se = C.call(I.ownerDocument); I.firstChild; )
          se.appendChild(I.firstChild);
      else
        se = I;
      return (te.shadowroot || te.shadowrootmode) && (se = B.call(r, se, !0)), se;
    }
    let Te = tt ? I.outerHTML : I.innerHTML;
    return tt && ne["!doctype"] && I.ownerDocument && I.ownerDocument.doctype && I.ownerDocument.doctype.name && it(AE, I.ownerDocument.doctype.name) && (Te = "<!DOCTYPE " + I.ownerDocument.doctype.name + `>
` + Te), je && vs([z, j, $], (It) => {
      Te = ys(Te, It, " ");
    }), d && cn ? d.createHTML(Te) : Te;
  }, t.setConfig = function() {
    let T = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    ua(T), un = !0;
  }, t.clearConfig = function() {
    $n = null, un = !1;
  }, t.isValidAttribute = function(T, y, I) {
    $n || ua({});
    const M = He(T), q = He(y);
    return Br(M, q, I);
  }, t.addHook = function(T, y) {
    typeof y == "function" && _s(P[T], y);
  }, t.removeHook = function(T, y) {
    if (y !== void 0) {
      const I = pE(P[T], y);
      return I === -1 ? void 0 : mE(P[T], I, 1)[0];
    }
    return Um(P[T]);
  }, t.removeHooks = function(T) {
    P[T] = [];
  }, t.removeAllHooks = function() {
    P = Jm();
  }, t;
}
var td = ty();
const DE = /^(fa-|note-)/, OE = /* @__PURE__ */ new Set(["monospace"]);
let eh = !1;
function LE() {
  eh || (eh = !0, td.addHook("afterSanitizeAttributes", (e) => {
    "target" in e && (e.setAttribute("target", "_blank"), e.setAttribute("rel", "noopener noreferrer")), e.nodeName === "IMG" && (e.setAttribute("loading", "lazy"), e.setAttribute("decoding", "async"));
  }), td.addHook("uponSanitizeAttribute", (e, t, n) => {
    if (n?.MESSAGE_SANITIZE && (t.attrName === "class" && t.attrValue && (t.attrValue = t.attrValue.split(/\s+/).filter(Boolean).map((r) => OE.has(r) || DE.test(r) ? r : `custom-${r}`).join(" ")), t.attrName.startsWith("on") && (t.keepAttr = !1), (t.attrName === "href" || t.attrName === "src") && t.attrValue)) {
      const r = t.attrValue.trim().toLowerCase();
      (r.startsWith("javascript:") || r.startsWith("vbscript:")) && (t.keepAttr = !1);
    }
  }));
}
function zE(e, t = {}) {
  LE();
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
  return td.sanitize(e, n);
}
const BE = /<custom-style>([\s\S]*?)<\/custom-style>/gi;
function $E(e) {
  return typeof btoa == "function" ? btoa(unescape(encodeURIComponent(e))) : Buffer.from(e, "utf-8").toString("base64");
}
function FE(e) {
  return typeof atob == "function" ? decodeURIComponent(escape(atob(e))) : Buffer.from(e, "base64").toString("utf-8");
}
function HE(e) {
  return e.replace(BE, (t, n) => `<custom-style data-encoded="${$E(n)}"></custom-style>`);
}
function UE(e, t = {}) {
  const n = t.prefix ?? "";
  return e.replace(
    /<custom-style[^>]*data-encoded="([^"]*)"[^>]*>[\s\S]*?<\/custom-style>/gi,
    (r, s) => {
      let a;
      try {
        a = FE(s);
      } catch {
        return "";
      }
      return `<style>${n ? a.replace(/(^|\})\s*([^\{\}]+)\s*\{/g, (u, c, p) => {
        const h = p.split(",").map((b) => `${n}${b.trim()}`).join(", ");
        return `${c}${h}{`;
      }) : a}</style>`;
    }
  );
}
const nd = /* @__PURE__ */ new Map(), rd = /* @__PURE__ */ new Map(), sd = /* @__PURE__ */ new Map();
function dC(e, t) {
  return nd.set(e, t), () => nd.delete(e);
}
function fC(e, t) {
  return rd.set(e, t), () => rd.delete(e);
}
function pC(e, t) {
  return sd.set(e, t), () => sd.delete(e);
}
function WE(e, t) {
  for (const n of nd.values())
    try {
      e = n(e, t);
    } catch (r) {
      console.warn("[formatting] preMarkdown hook failed:", r);
    }
  return e;
}
function GE(e, t) {
  for (const n of rd.values())
    try {
      e = n(e, t);
    } catch (r) {
      console.warn("[formatting] preSanitize hook failed:", r);
    }
  return e;
}
function VE(e, t) {
  const n = [];
  for (const r of sd.values())
    try {
      const s = r(e, t);
      typeof s == "function" && n.push(s);
    } catch (s) {
      console.warn("[formatting] postRender hook failed:", s);
    }
  return n;
}
function KE(e, t) {
  if (!e) return "";
  const n = {
    messageId: t.messageId,
    isUser: !!t.isUser,
    isSystem: !!t.isSystem,
    isReasoning: !!t.isReasoning,
    characterName: t.characterName
  };
  let r = e;
  t.isSystem || (r = WE(r, n));
  const s = "QYDL", a = [];
  return t.isSystem || (r = r.replace(/<[^>]+>/g, (o) => o.replace(/"/g, () => (a.push('"'), `${s}${a.length - 1}${s}`)))), r = r.replace(/\\begin\{align\*\}/g, "$$").replace(/\\end\{align\*\}/g, "$$"), t.isSystem || (r = sE().makeHtml(r)), r = r.replace(/<code>([\s\S]*?)<\/code>/g, (o, u) => `<code>${u.replace(/&amp;/g, "&")}</code>`), t.isSystem || (r = r.replace(new RegExp(`${s}(\\d+)${s}`, "g"), (o, u) => a[Number(u)] ?? '"')), t.isSystem || (r = GE(r, n)), r = HE(r), r = zE(r), r = UE(r, { prefix: ".mes_text " }), r;
}
function qE({ avatarUrl: e, mesId: t, timer: n, tokenCount: r }) {
  return /* @__PURE__ */ i.jsxs("div", { className: "mesAvatarWrapper", children: [
    /* @__PURE__ */ i.jsx("div", { className: "avatar", children: e ? /* @__PURE__ */ i.jsx("img", { src: e, alt: "" }) : /* @__PURE__ */ i.jsx("div", { className: "avatar-placeholder" }) }),
    /* @__PURE__ */ i.jsx("div", { className: "mesIDDisplay", children: t }),
    typeof n == "number" && /* @__PURE__ */ i.jsxs("div", { className: "mes_timer", title: "Generation time (ms)", children: [
      n,
      "ms"
    ] }),
    typeof r == "number" && /* @__PURE__ */ i.jsxs("div", { className: "tokenCounterDisplay", title: "Token count", children: [
      r,
      "t"
    ] })
  ] });
}
function YE(e) {
  const [t, n] = R.useState(!1);
  return /* @__PURE__ */ i.jsxs("div", { className: "mes_buttons", children: [
    /* @__PURE__ */ i.jsx(
      "button",
      {
        className: "mes_button extraMesButtonsHint",
        type: "button",
        "aria-label": "More actions",
        title: "Message Actions",
        onClick: () => n((r) => !r),
        children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-ellipsis" })
      }
    ),
    /* @__PURE__ */ i.jsxs("div", { className: `extraMesButtons ${t ? "open" : ""}`, hidden: !t, children: [
      /* @__PURE__ */ i.jsx("button", { className: "mes_button mes_translate", type: "button", onClick: e.onTranslate, "aria-label": "Translate", title: "Translate message", children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-language" }) }),
      /* @__PURE__ */ i.jsx("button", { className: "mes_button mes_narrate", type: "button", onClick: e.onNarrate, "aria-label": "Narrate", title: "Narrate", children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-bullhorn" }) }),
      /* @__PURE__ */ i.jsx("button", { className: "mes_button mes_hide", type: "button", onClick: e.onHide, "aria-label": "Hide", title: "Exclude message from prompts", children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-eye" }) }),
      /* @__PURE__ */ i.jsx("button", { className: "mes_button mes_unhide", type: "button", onClick: e.onUnhide, "aria-label": "Unhide", title: "Include message in prompts", children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-eye-slash" }) }),
      /* @__PURE__ */ i.jsx("button", { className: "mes_button mes_create_branch", type: "button", onClick: e.onBranch, "aria-label": "Branch", title: "Create branch", children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-code-branch" }) }),
      /* @__PURE__ */ i.jsx("button", { className: "mes_button mes_create_bookmark", type: "button", onClick: e.onCheckpoint, "aria-label": "Checkpoint", title: "Create checkpoint", children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-flag-checkered" }) }),
      /* @__PURE__ */ i.jsx("button", { className: "mes_button mes_copy", type: "button", onClick: e.onCopy, "aria-label": "Copy", title: "Copy message", children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-copy" }) })
    ] }),
    /* @__PURE__ */ i.jsx(
      "button",
      {
        className: "mes_button mes_bookmark",
        type: "button",
        "aria-label": "Open checkpoint",
        title: "Open checkpoint chat",
        onClick: e.onCheckpoint,
        children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-flag" })
      }
    ),
    /* @__PURE__ */ i.jsx("button", { className: "mes_button mes_edit", type: "button", onClick: e.onEdit, "aria-label": "Edit", title: "Edit", children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-pencil" }) }),
    /* @__PURE__ */ i.jsx("span", { className: "mes_buttons_extra", "data-extension-mount-slot": !0 })
  ] });
}
function QE(e) {
  return /* @__PURE__ */ i.jsxs("div", { className: "mes_edit_buttons", children: [
    /* @__PURE__ */ i.jsx("button", { className: "mes_edit_done menu_button", type: "button", onClick: () => e.onDone?.(), "aria-label": "Done", title: "Confirm", children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-check" }) }),
    /* @__PURE__ */ i.jsx("button", { className: "mes_edit_copy menu_button", type: "button", onClick: e.onCopy, "aria-label": "Copy", title: "Copy this message", children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-copy" }) }),
    /* @__PURE__ */ i.jsx("button", { className: "mes_edit_delete menu_button", type: "button", onClick: e.onDelete, "aria-label": "Delete", title: "Delete this message", children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-trash-can" }) }),
    /* @__PURE__ */ i.jsx("button", { className: "mes_edit_up menu_button", type: "button", onClick: e.onMoveUp, "aria-label": "Move up", title: "Move message up", children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-chevron-up" }) }),
    /* @__PURE__ */ i.jsx("button", { className: "mes_edit_down menu_button", type: "button", onClick: e.onMoveDown, "aria-label": "Move down", title: "Move message down", children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-chevron-down" }) }),
    /* @__PURE__ */ i.jsx("button", { className: "mes_edit_cancel menu_button", type: "button", onClick: e.onCancel, "aria-label": "Cancel", title: "Cancel", children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-xmark" }) })
  ] });
}
function XE({ current: e, total: t, onRight: n }) {
  return /* @__PURE__ */ i.jsxs("div", { className: "swipeRightBlock", children: [
    /* @__PURE__ */ i.jsx(
      "button",
      {
        className: "swipe_right",
        type: "button",
        "aria-label": "Next swipe",
        onClick: n,
        disabled: t === 0,
        children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-chevron-right" })
      }
    ),
    /* @__PURE__ */ i.jsx("div", { className: "swipes-counter", children: t > 0 ? `${e + 1}/${t}` : "" })
  ] });
}
function ZE({ reasoning: e, onCopy: t, onEdit: n, onDelete: r, onCloseAll: s, defaultOpen: a }) {
  return /* @__PURE__ */ i.jsxs("details", { className: "mes_reasoning_details", open: a, children: [
    /* @__PURE__ */ i.jsxs("summary", { className: "mes_reasoning_summary", children: [
      /* @__PURE__ */ i.jsx("div", { className: "mes_reasoning_header_block", children: /* @__PURE__ */ i.jsxs("div", { className: "mes_reasoning_header", children: [
        /* @__PURE__ */ i.jsx("span", { className: "mes_reasoning_header_title", children: "Thought for some time" }),
        /* @__PURE__ */ i.jsx("i", { className: "mes_reasoning_arrow fa-solid fa-chevron-up" })
      ] }) }),
      /* @__PURE__ */ i.jsxs("div", { className: "mes_reasoning_actions", children: [
        s && /* @__PURE__ */ i.jsx("button", { className: "mes_reasoning_close_all mes_button", type: "button", onClick: s, "aria-label": "Collapse all reasoning blocks", title: "Collapse all reasoning blocks", children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-minimize" }) }),
        t && /* @__PURE__ */ i.jsx("button", { className: "mes_reasoning_copy mes_button", type: "button", onClick: t, "aria-label": "Copy reasoning", title: "Copy reasoning", children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-copy" }) }),
        n && /* @__PURE__ */ i.jsx("button", { className: "mes_reasoning_edit mes_button", type: "button", onClick: n, "aria-label": "Edit reasoning", title: "Edit reasoning", children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-pencil" }) }),
        r && /* @__PURE__ */ i.jsx("button", { className: "mes_reasoning_delete mes_button", type: "button", onClick: r, "aria-label": "Delete reasoning", title: "Remove reasoning", children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-trash-can" }) })
      ] })
    ] }),
    /* @__PURE__ */ i.jsx("div", { className: "mes_reasoning", children: e })
  ] });
}
function JE({ items: e }) {
  return /* @__PURE__ */ i.jsx("div", { className: "mes_media_wrapper", children: e.map((t, n) => t.kind === "image" ? /* @__PURE__ */ i.jsx("img", { src: t.url, alt: t.alt ?? "", className: "mes_media_image" }, n) : /* @__PURE__ */ i.jsxs("a", { href: t.url, className: "mes_media_file", target: "_blank", rel: "noreferrer", children: [
    /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-paperclip" }),
    " ",
    t.alt ?? t.url
  ] }, n)) });
}
function e3(e) {
  const { message: t, editing: n } = e, r = !!t.bookmarkLink, s = R.useRef(null), [a, o] = R.useState(t.text);
  R.useEffect(() => {
    n && o(t.text);
  }, [n, t.text]);
  const u = R.useMemo(() => ({
    messageId: t.mesId,
    isUser: t.isUser,
    isSystem: t.isSystem,
    isReasoning: !1,
    characterName: t.chName
  }), [t.mesId, t.isUser, t.isSystem, t.chName]), c = R.useMemo(
    () => KE(t.text ?? "", u),
    [t.text, u]
  );
  return R.useEffect(() => {
    if (!s.current || n) return;
    const p = VE(s.current, u);
    return () => {
      for (const h of p)
        try {
          h();
        } catch {
        }
    };
  }, [n, c, u]), /* @__PURE__ */ i.jsxs(
    "div",
    {
      className: `mes ${t.isUser ? "is-user" : ""} ${t.isSystem ? "is-system" : ""} ${r ? "has-bookmark" : ""} ${t.isError ? "is-error" : ""}`,
      "data-mesid": t.mesId,
      "data-is-user": t.isUser,
      "data-is-system": t.isSystem,
      "data-is-error": !!t.isError,
      "data-bookmark-link": t.bookmarkLink ?? "",
      children: [
        /* @__PURE__ */ i.jsx(
          qE,
          {
            avatarUrl: t.avatarUrl,
            mesId: t.mesId,
            timer: t.timer,
            tokenCount: t.tokenCount
          }
        ),
        /* @__PURE__ */ i.jsx(
          "button",
          {
            className: "swipe_left",
            type: "button",
            "aria-label": "Previous swipe",
            onClick: e.onSwipeLeft,
            disabled: !t.swipes || t.swipes.current === 0,
            children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-chevron-left" })
          }
        ),
        /* @__PURE__ */ i.jsxs("div", { className: "mes_block", children: [
          /* @__PURE__ */ i.jsxs("div", { className: "ch_name", children: [
            /* @__PURE__ */ i.jsx("div", { className: "flex-container", children: /* @__PURE__ */ i.jsxs("div", { className: "flex-container", children: [
              /* @__PURE__ */ i.jsx("span", { className: "name_text", children: t.chName }),
              /* @__PURE__ */ i.jsx("i", { className: "mes_ghost fa-solid fa-ghost", "aria-hidden": "true", title: "This message is invisible for the AI" }),
              /* @__PURE__ */ i.jsx("small", { className: "timestamp", children: t.timestamp })
            ] }) }),
            !n && /* @__PURE__ */ i.jsx(
              YE,
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
            n && /* @__PURE__ */ i.jsx(
              QE,
              {
                onDone: () => e.onEditDone?.(a),
                onCancel: e.onEditCancel,
                onCopy: e.onCopy,
                onDelete: e.onDelete,
                onMoveUp: e.onMoveUp,
                onMoveDown: e.onMoveDown
              }
            )
          ] }),
          t.reasoning && /* @__PURE__ */ i.jsx(
            ZE,
            {
              reasoning: t.reasoning,
              onCopy: () => navigator.clipboard?.writeText(t.reasoning ?? "")
            }
          ),
          !n && /* @__PURE__ */ i.jsx(
            "div",
            {
              className: "mes_text",
              ref: s,
              dangerouslySetInnerHTML: { __html: c }
            }
          ),
          n && /* @__PURE__ */ i.jsx(
            "textarea",
            {
              className: "mes_edit_textarea",
              value: a,
              onChange: (p) => o(p.target.value),
              rows: Math.max(3, a.split(`
`).length),
              "data-testid": "mes-edit-textarea"
            }
          ),
          t.media && t.media.length > 0 && /* @__PURE__ */ i.jsx(JE, { items: t.media }),
          t.bias && /* @__PURE__ */ i.jsx("div", { className: "mes_bias", children: t.bias })
        ] }),
        /* @__PURE__ */ i.jsx(
          XE,
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
const t3 = {
  user: "User",
  assistant: "Assistant",
  system: "System",
  tool: "Tool"
}, n3 = 120;
function th(e, t, n = n3) {
  const r = t ?? e;
  if (!r) return !0;
  const s = r.scrollTop ?? 0, a = r.scrollHeight ?? 0, o = r.clientHeight ?? 0;
  return a <= o ? !0 : a - s - o <= n;
}
function r3() {
  const e = wt(), t = e.liveChat.turns, [n, r] = R.useState(null), [s, a] = R.useState(!1), o = R.useRef(null), u = R.useRef(null), c = R.useRef(null), p = R.useRef(e.isGenerating), h = R.useRef(!0);
  R.useEffect(() => {
    const w = u.current;
    if (!w) return;
    const E = w.querySelector('.ydltavern-message-list-virtuoso [data-testid="virtuoso-scroller"]') ?? w.querySelector("[data-virtuoso-scroller]") ?? w.querySelector(".ydltavern-message-list-virtuoso");
    E && (c.current = E);
  }, []);
  const b = R.useCallback(() => {
    const w = th(u.current, c.current);
    h.current = w, a(!w);
  }, []);
  R.useEffect(() => {
    const w = c.current ?? u.current;
    if (w)
      return w.addEventListener("scroll", b, { passive: !0 }), () => w.removeEventListener("scroll", b);
  }, [b]), R.useEffect(() => {
    const w = e.isGenerating;
    w && !p.current ? (h.current = th(u.current, c.current), h.current ? o.current?.scrollToIndex({ index: t.length - 1, behavior: "smooth", align: "end" }) : a(!0)) : w && h.current ? o.current?.scrollToIndex({ index: t.length - 1, behavior: "auto", align: "end" }) : !w && p.current && (h.current && o.current?.scrollToIndex({ index: t.length - 1, behavior: "smooth", align: "end" }), a(!1)), p.current = w;
  }, [e.isGenerating, t.length]);
  const g = R.useCallback((w) => {
    const E = t[w];
    if (E === void 0) return /* @__PURE__ */ i.jsx("div", {});
    const A = dd(E), D = A?.subs ?? [], _ = E.role === "user", x = E.role === "system", N = e.personas.find((L) => L.id === e.activePersonaId), l = e.characters.find((L) => L.id === e.activeCharacterId), f = D.filter((L) => L.kind === "text").map((L) => L.text).join(`
`), d = D.filter((L) => L.kind === "thinking").map((L) => L.text), m = d.length > 0 ? d.join(`
`) : void 0, v = a3(D), k = E.variants.length, S = e.liveMessages[w], C = !_ && !x && S?.extra?.ydl_error === !0;
    return /* @__PURE__ */ i.jsx(
      e3,
      {
        message: {
          mesId: E.id,
          chName: E.speaker?.name ?? (_ ? N?.name : l?.name) ?? t3[E.role],
          isUser: _,
          isSystem: x,
          avatarUrl: s3(E, _ ? N?.avatarUrl : l?.avatarUrl),
          text: f,
          reasoning: m,
          timestamp: i3(A?.created_at ?? E.created_at),
          tokenCount: A?.meta.tokens,
          timer: A?.meta.latency_ms,
          media: v.length > 0 ? v : void 0,
          swipes: k > 0 ? { current: E.active_variant, total: k } : { current: 0, total: 0 },
          isError: C
        },
        editing: n === E.id,
        onSwipeLeft: () => e.swipeLeft(E.id),
        onSwipeRight: () => e.swipeRight(E.id),
        onEdit: () => r(E.id),
        onEditDone: (L) => {
          e.editMessage(E.id, L), r(null);
        },
        onEditCancel: () => r(null),
        onDelete: () => e.deleteMessage(E.id),
        onCopy: () => e.copyMessage(E.id),
        onBranch: () => e.branchMessage(E.id),
        onCheckpoint: () => e.checkpointMessage(E.id),
        onHide: () => e.hideMessage(E.id),
        onUnhide: () => e.unhideMessage(E.id),
        onMoveUp: () => e.moveMessage(E.id, "up"),
        onMoveDown: () => e.moveMessage(E.id, "down")
      }
    );
  }, [n, e, t]);
  return /* @__PURE__ */ i.jsxs("div", { id: "chat", className: "ydltavern-message-list", ref: u, children: [
    /* @__PURE__ */ i.jsx(
      Y_,
      {
        ref: o,
        className: "ydltavern-message-list-virtuoso",
        totalCount: t.length,
        itemContent: g,
        followOutput: !1,
        overscan: { main: 200, reverse: 200 }
      }
    ),
    s && /* @__PURE__ */ i.jsxs(
      "button",
      {
        type: "button",
        className: "ydl-jump-to-latest",
        onClick: () => {
          o.current?.scrollToIndex({ index: t.length - 1, behavior: "smooth", align: "end" }), a(!1), h.current = !0;
        },
        "aria-label": "Jump to latest message",
        children: [
          /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-arrow-down", "aria-hidden": "true" }),
          " Jump to latest"
        ]
      }
    )
  ] });
}
function s3(e, t) {
  const n = e.speaker?.avatar;
  return Io(n) ?? t;
}
function a3(e) {
  const t = [];
  for (const n of e) {
    if (n.kind === "image") {
      const r = Io(n.image_ref);
      r !== void 0 && t.push({ kind: "image", url: r, alt: n.alt ?? n.prompt });
    }
    if (n.kind === "attachment") {
      const r = Io(n.attachment_ref.asset);
      r !== void 0 && t.push({ kind: "file", url: r, alt: n.attachment_ref.label });
    }
    if (n.kind === "file_embed") {
      const r = Io(n.file_ref);
      r !== void 0 && t.push({ kind: "file", url: r, alt: n.file_ref.original_path ?? n.file_ref.id });
    }
  }
  return t;
}
function Io(e) {
  if (e !== void 0) {
    if (e.original_path !== void 0 && /^(blob:|data:|https?:\/\/|\/)/u.test(e.original_path))
      return e.original_path;
    if (typeof e.metadata?.url == "string") return e.metadata.url;
  }
}
function i3(e) {
  return new Date(e).toLocaleString();
}
function o3({ sets: e, onTrigger: t }) {
  const n = e.filter((r) => r.enabled && r.items.length > 0);
  return n.length === 0 ? null : /* @__PURE__ */ i.jsx("section", { className: "tavern-quick-reply-bar", children: n.map((r) => /* @__PURE__ */ i.jsxs("div", { className: "qr-set", "data-set-id": r.id, children: [
    r.name !== r.id ? /* @__PURE__ */ i.jsx("span", { className: "qr-set-label", children: r.name }) : null,
    /* @__PURE__ */ i.jsx("div", { className: "qr-items", role: "group", "aria-label": r.name, children: r.items.map((s) => /* @__PURE__ */ i.jsx(
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
function l3(e) {
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
    "--tavern-blur-tint": e.tokens.blurTint ?? e.tokens.bgPrimary,
    "--tavern-chat-tint": e.tokens.chatTint ?? e.tokens.bgSecondary,
    "--tavern-user-mes-tint": e.tokens.userMesTint ?? e.tokens.userBubble,
    "--tavern-bot-mes-tint": e.tokens.botMesTint ?? e.tokens.assistantBubble,
    "--tavern-shadow-color": e.tokens.shadowColor ?? e.tokens.shadow,
    "--tavern-border-color": e.tokens.borderColor ?? e.tokens.border,
    "--tavern-blur-strength": e.tokens.blurStrength != null ? `${e.tokens.blurStrength}px` : "10px",
    "--tavern-font-scale": e.tokens.fontScale != null ? String(e.tokens.fontScale) : "1"
  };
}
function ny({ theme: e, children: t }) {
  const n = R.useMemo(() => l3(e), [e]);
  return /* @__PURE__ */ i.jsx("div", { className: "tavern-themed-root", style: n, children: t });
}
const u3 = [
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
function c3({ drawers: e }) {
  return /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsx("div", { className: "top-settings-holder", role: "toolbar", "aria-label": "Tavern top bar", children: u3.map((t) => /* @__PURE__ */ i.jsx(
      "button",
      {
        type: "button",
        className: `drawer-icon ${e.openId === t.id ? "open" : ""}`,
        onClick: () => e.toggle(t.id),
        "aria-label": t.label,
        "aria-pressed": e.openId === t.id,
        children: /* @__PURE__ */ i.jsx("i", { className: `fa-solid ${t.icon}`, "aria-hidden": "true" })
      },
      t.id
    )) }),
    /* @__PURE__ */ i.jsx("div", { id: "extensionsMenu", "data-extension-territory": !0 })
  ] });
}
function d3({ children: e }) {
  return /* @__PURE__ */ i.jsx("main", { id: "sheld", className: "sheld", role: "main", children: e });
}
function ry() {
  const [e, t] = R.useState(null), n = R.useCallback((a) => t(a), []), r = R.useCallback(() => t(null), []), s = R.useCallback(
    (a) => t((o) => o === a ? null : a),
    []
  );
  return { openId: e, open: n, close: r, toggle: s };
}
function sr({ id: e, drawers: t, side: n, title: r, children: s }) {
  const a = t.openId === e, o = J.useRef(!1);
  a && (o.current = !0);
  const u = o.current;
  return /* @__PURE__ */ i.jsxs(
    "aside",
    {
      className: `drawer-content drawer-${n} ${a ? "openDrawer" : ""}`,
      "data-drawer-id": e,
      "aria-hidden": !a,
      "aria-labelledby": `drawer-title-${e}`,
      children: [
        /* @__PURE__ */ i.jsxs("header", { className: "drawer-header", children: [
          /* @__PURE__ */ i.jsx("h2", { id: `drawer-title-${e}`, className: "drawer-title", children: r }),
          /* @__PURE__ */ i.jsx(
            "button",
            {
              type: "button",
              className: "drawer-close",
              onClick: t.close,
              "aria-label": "Close drawer",
              children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-xmark", "aria-hidden": "true" })
            }
          )
        ] }),
        /* @__PURE__ */ i.jsx("div", { className: "drawer-body", hidden: !a, "aria-hidden": !a, children: u ? s : null })
      ]
    }
  );
}
const f3 = {
  temperature: 0.8,
  topP: 0.9,
  topK: 40,
  frequencyPenalty: 0,
  presencePenalty: 0,
  maxTokens: 2048
};
function co({
  label: e,
  value: t,
  min: n,
  max: r,
  step: s,
  onChange: a,
  onCommit: o
}) {
  return /* @__PURE__ */ i.jsxs("label", { className: "settings-field", children: [
    /* @__PURE__ */ i.jsxs("span", { className: "settings-label", children: [
      e,
      /* @__PURE__ */ i.jsx("span", { className: "settings-value-indicator", children: t.toFixed(s < 0.1 ? 2 : 1) })
    ] }),
    /* @__PURE__ */ i.jsx(
      "input",
      {
        className: "settings-slider",
        type: "range",
        min: n,
        max: r,
        step: s,
        value: t,
        onChange: (u) => a(Number.parseFloat(u.target.value)),
        onMouseUp: o,
        onTouchEnd: o
      }
    )
  ] });
}
function sy({ settings: e, onChange: t }) {
  const [n, r] = R.useState(e), s = R.useCallback(() => {
    t(n);
  }, [n, t]), a = R.useCallback((o, u) => {
    r((c) => ({ ...c, [o]: u }));
  }, []);
  return /* @__PURE__ */ i.jsxs("section", { className: "settings-form-section", children: [
    /* @__PURE__ */ i.jsx("h3", { className: "settings-form-title", children: "Sampler" }),
    /* @__PURE__ */ i.jsxs("div", { className: "settings-form-sliders", children: [
      /* @__PURE__ */ i.jsx(
        co,
        {
          label: "Temperature",
          value: n.temperature,
          min: 0,
          max: 2,
          step: 0.01,
          onChange: (o) => a("temperature", o),
          onCommit: s
        }
      ),
      /* @__PURE__ */ i.jsx(
        co,
        {
          label: "Top P",
          value: n.topP,
          min: 0,
          max: 1,
          step: 0.01,
          onChange: (o) => a("topP", o),
          onCommit: s
        }
      ),
      /* @__PURE__ */ i.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ i.jsx("span", { className: "settings-label", children: "Top K" }),
        /* @__PURE__ */ i.jsx(
          "input",
          {
            className: "settings-input",
            type: "number",
            min: 0,
            max: 500,
            value: n.topK,
            onChange: (o) => a("topK", Number.parseInt(o.target.value, 10) || 0),
            onBlur: s
          }
        )
      ] }),
      /* @__PURE__ */ i.jsx(
        co,
        {
          label: "Frequency Penalty",
          value: n.frequencyPenalty,
          min: -2,
          max: 2,
          step: 0.01,
          onChange: (o) => a("frequencyPenalty", o),
          onCommit: s
        }
      ),
      /* @__PURE__ */ i.jsx(
        co,
        {
          label: "Presence Penalty",
          value: n.presencePenalty,
          min: -2,
          max: 2,
          step: 0.01,
          onChange: (o) => a("presencePenalty", o),
          onCommit: s
        }
      ),
      /* @__PURE__ */ i.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ i.jsx("span", { className: "settings-label", children: "Max Tokens" }),
        /* @__PURE__ */ i.jsx(
          "input",
          {
            className: "settings-input",
            type: "number",
            min: 1,
            max: 131072,
            step: 1,
            value: n.maxTokens,
            onChange: (o) => a("maxTokens", Number.parseInt(o.target.value, 10) || 2048),
            onBlur: s
          }
        )
      ] })
    ] })
  ] });
}
function ay({ drawers: e }) {
  const t = wt();
  return /* @__PURE__ */ i.jsxs(sr, { id: "ai-config", drawers: e, side: "left", title: "AI Response Configuration", children: [
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ i.jsx("h3", { children: "Preset" }) }),
      /* @__PURE__ */ i.jsxs("div", { className: "range-block", children: [
        /* @__PURE__ */ i.jsxs("label", { className: "checkbox_label", children: [
          /* @__PURE__ */ i.jsx("span", { children: "Active preset:" }),
          /* @__PURE__ */ i.jsxs(
            "select",
            {
              className: "text_pole",
              value: t.settings.activePreset,
              onChange: (n) => t.setActivePreset(n.target.value),
              children: [
                /* @__PURE__ */ i.jsx("option", { value: "default", children: "Default" }),
                /* @__PURE__ */ i.jsx("option", { value: "creative", children: "Creative" }),
                /* @__PURE__ */ i.jsx("option", { value: "precise", children: "Precise" }),
                /* @__PURE__ */ i.jsx("option", { value: "custom", children: "Custom..." })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ i.jsxs("div", { className: "preset-actions", children: [
          /* @__PURE__ */ i.jsxs("button", { type: "button", className: "menu_button", "aria-label": "Save preset", children: [
            /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-save" }),
            " Save"
          ] }),
          /* @__PURE__ */ i.jsxs("button", { type: "button", className: "menu_button", "aria-label": "Import preset", children: [
            /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-file-import" }),
            " Import"
          ] }),
          /* @__PURE__ */ i.jsxs("button", { type: "button", className: "menu_button", "aria-label": "Export preset", children: [
            /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-file-export" }),
            " Export"
          ] }),
          /* @__PURE__ */ i.jsxs("button", { type: "button", className: "menu_button danger", "aria-label": "Delete preset", children: [
            /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-trash" }),
            " Delete"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ i.jsx("h3", { children: "Sampler" }) }),
      /* @__PURE__ */ i.jsx(
        sy,
        {
          settings: t.samplerSettings,
          onChange: (n) => t.updateSamplerSettings(n)
        }
      )
    ] }),
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ i.jsx("h3", { children: "Streaming" }) }),
      /* @__PURE__ */ i.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ i.jsx(
          "input",
          {
            type: "checkbox",
            checked: t.settings?.streaming ?? !0,
            onChange: (n) => {
              t.updateSettings({ streaming: n.target.checked });
            }
          }
        ),
        /* @__PURE__ */ i.jsx("span", { children: "Enable streaming responses" })
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ i.jsx("h3", { children: "Banned Tokens" }),
        /* @__PURE__ */ i.jsx("small", { children: "One per line. Tokens listed here will be excluded from generation." })
      ] }),
      /* @__PURE__ */ i.jsx(
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
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ i.jsx("h3", { children: "Logit Bias" }),
        /* @__PURE__ */ i.jsx("small", { children: 'Token:bias pairs (e.g., "the:-100"). Empty for none.' })
      ] }),
      /* @__PURE__ */ i.jsx(
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
const p3 = {
  provider: "openai",
  model: "gpt-4o-mini",
  secretRef: "secret_ref:store:OPENAI_API_KEY",
  apiBaseUrl: "",
  stream: !0
}, m3 = [
  "openai",
  "deepseek",
  "anthropic",
  "openrouter",
  "custom"
], nh = /* @__PURE__ */ new Set(["openai", "deepseek", "anthropic", "openrouter"]);
function iy({ settings: e, onChange: t }) {
  const [n, r] = R.useState(e), [s, a] = R.useState(), o = R.useCallback((g = n) => {
    const w = vo(g.secretRef);
    a(w), w === void 0 && t(g);
  }, [n, t]), u = R.useCallback(() => {
    o();
  }, [o]), c = R.useCallback((g, w) => {
    r((E) => ({ ...E, [g]: w }));
  }, []), p = R.useCallback((g) => (w) => {
    const E = w.target.type === "checkbox" ? w.target.checked : w.target.value;
    g === "secretRef" && a(vo(String(E))), c(g, E);
  }, [c]), h = R.useCallback((g) => {
    const w = { ...n, secretRef: g.target.value };
    r(w), a(vo(w.secretRef));
  }, [n]), b = R.useCallback((g) => {
    const w = { ...n, secretRef: g.target.value };
    r(w), o(w);
  }, [n, o]);
  return /* @__PURE__ */ i.jsxs("section", { className: "settings-form-section", children: [
    /* @__PURE__ */ i.jsx("h3", { className: "settings-form-title", children: "Connection" }),
    /* @__PURE__ */ i.jsxs("div", { className: "settings-form-grid", children: [
      /* @__PURE__ */ i.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ i.jsx("span", { className: "settings-label", children: "Provider" }),
        /* @__PURE__ */ i.jsx(
          "select",
          {
            className: "settings-input",
            value: n.provider,
            onChange: p("provider"),
            onBlur: u,
            children: m3.map((g) => /* @__PURE__ */ i.jsxs("option", { value: g, disabled: !nh.has(g), children: [
              g,
              nh.has(g) ? "" : " (unsupported)"
            ] }, g))
          }
        )
      ] }),
      /* @__PURE__ */ i.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ i.jsx("span", { className: "settings-label", children: "Model" }),
        /* @__PURE__ */ i.jsx(
          "input",
          {
            className: "settings-input",
            type: "text",
            value: n.model,
            onChange: p("model"),
            onBlur: u,
            placeholder: "gpt-4o-mini"
          }
        )
      ] }),
      /* @__PURE__ */ i.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ i.jsx("span", { className: "settings-label", children: "Secret Ref" }),
        /* @__PURE__ */ i.jsx(
          "input",
          {
            className: `settings-input${s ? " settings-input-error" : ""}`,
            type: "text",
            value: n.secretRef,
            onChange: h,
            onBlur: b,
            placeholder: "secret_ref:store:OPENAI_API_KEY"
          }
        ),
        s !== void 0 ? /* @__PURE__ */ i.jsx("span", { className: "settings-field-error", children: s }) : null
      ] }),
      /* @__PURE__ */ i.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ i.jsx("span", { className: "settings-label", children: "API Base URL (not used for live calls)" }),
        /* @__PURE__ */ i.jsx(
          "input",
          {
            className: "settings-input",
            type: "text",
            value: n.apiBaseUrl,
            onChange: p("apiBaseUrl"),
            onBlur: u,
            placeholder: "https://api.openai.com/v1"
          }
        ),
        /* @__PURE__ */ i.jsx("span", { className: "settings-help-text", children: "Live provider calls use fixed engine host mappings; this does not override outbound host." })
      ] }),
      /* @__PURE__ */ i.jsxs("label", { className: "settings-field settings-field-row", children: [
        /* @__PURE__ */ i.jsx("span", { className: "settings-label", children: "Stream" }),
        /* @__PURE__ */ i.jsx(
          "input",
          {
            className: "settings-checkbox",
            type: "checkbox",
            checked: n.stream,
            onChange: p("stream"),
            onBlur: u
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ i.jsx("div", { className: "settings-form-actions", children: /* @__PURE__ */ i.jsx(
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
const h3 = [
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
], Mu = /* @__PURE__ */ new Set(["openai", "anthropic", "deepseek", "openrouter"]);
function g3({ drawers: e }) {
  const t = wt(), [n, r] = R.useState(""), s = {
    provider: t.connectionSettings.provider,
    model: t.connectionSettings.model,
    secretRef: t.connectionSettings.secretRef ?? "",
    apiBaseUrl: t.connectionSettings.baseUrl ?? "",
    stream: t.settings.streaming
  }, a = (o) => {
    vo(o.secretRef) === void 0 && (t.updateConnectionSettings({
      provider: o.provider,
      model: o.model,
      secretRef: o.secretRef,
      baseUrl: o.apiBaseUrl
    }), t.updateSettings({ streaming: o.stream }));
  };
  return /* @__PURE__ */ i.jsxs(sr, { id: "api-connections", drawers: e, side: "left", title: "API Connections", children: [
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ i.jsx("h3", { children: "Provider" }),
        /* @__PURE__ */ i.jsx("small", { children: "All connections route through Yggdrasil's outbound substrate. Secrets use secret_ref only." })
      ] }),
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsx("span", { children: "Active provider:" }),
        /* @__PURE__ */ i.jsx(
          "select",
          {
            className: "text_pole",
            value: t.connectionSettings.provider,
            onChange: (o) => {
              Mu.has(o.target.value) && t.updateConnectionSettings({ provider: o.target.value });
            },
            children: h3.map((o) => /* @__PURE__ */ i.jsx("optgroup", { label: o.label, children: o.providers.map((u) => /* @__PURE__ */ i.jsxs("option", { value: u.value, disabled: !Mu.has(u.value), children: [
              u.label,
              Mu.has(u.value) ? "" : " (unsupported)"
            ] }, u.value)) }, o.label))
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ i.jsx("h3", { children: "Configuration" }) }),
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsx("span", { children: "Saved profile:" }),
        /* @__PURE__ */ i.jsxs(
          "select",
          {
            className: "text_pole",
            value: t.activeConnectionProfile ?? "",
            onChange: (o) => {
              o.target.value && t.loadConnectionProfile(o.target.value);
            },
            children: [
              /* @__PURE__ */ i.jsx("option", { value: "", children: "— Pick a profile —" }),
              Object.keys(t.connectionProfiles).map((o) => /* @__PURE__ */ i.jsx("option", { value: o, children: o }, o))
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ i.jsx(
        iy,
        {
          settings: s,
          onChange: a
        },
        `${t.activeConnectionProfile ?? "current"}:${t.connectionSettings.provider}:${t.connectionSettings.model}`
      ),
      /* @__PURE__ */ i.jsx("p", { className: "settings-help-text", children: "Custom API base URLs are stored for profile metadata only and are not used for live provider calls." })
    ] }),
    /* @__PURE__ */ i.jsx(
      v3,
      {
        provider: t.connectionSettings.provider,
        currentSecretRef: t.connectionSettings.secretRef ?? "",
        projectId: t.projectId,
        onSecretRefChange: (o) => {
          const u = bd(o);
          u !== void 0 && t.updateConnectionSettings({ secretRef: u });
        }
      }
    ),
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ i.jsx("h3", { children: "Connection profiles" }),
        /* @__PURE__ */ i.jsx("small", { children: "Save and switch between named connection profiles." })
      ] }),
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsx("span", { children: "Profile name:" }),
        /* @__PURE__ */ i.jsx(
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
      /* @__PURE__ */ i.jsxs("div", { className: "preset-actions", children: [
        /* @__PURE__ */ i.jsxs(
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
              /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-floppy-disk", "aria-hidden": "true" }),
              " Save profile"
            ]
          }
        ),
        /* @__PURE__ */ i.jsxs(
          "button",
          {
            type: "button",
            className: "menu_button",
            "aria-label": "Test connection",
            disabled: !0,
            title: "Save a profile, then send a message to verify the connection.",
            children: [
              /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-plug-circle-check", "aria-hidden": "true" }),
              " Test"
            ]
          }
        ),
        /* @__PURE__ */ i.jsxs(
          "button",
          {
            type: "button",
            className: "menu_button",
            "aria-label": "Delete profile",
            onClick: () => t.deleteConnectionProfile(t.activeConnectionProfile ?? n),
            disabled: (t.activeConnectionProfile ?? n).trim().length === 0,
            children: [
              /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-trash", "aria-hidden": "true" }),
              " Delete"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ i.jsx(_3, { secretRef: t.connectionSettings.secretRef ?? "" })
  ] });
}
function v3({ provider: e, currentSecretRef: t, projectId: n, onSecretRefChange: r }) {
  const s = dp(e), [a, o] = R.useState(t.startsWith("secret_ref:project:") ? "project" : "platform"), [u, c] = R.useState(s), [p, h] = R.useState(""), [b, g] = R.useState([]), [w, E] = R.useState(!1), [A, D] = R.useState({ kind: "idle", message: "" }), [_, x] = R.useState(null), N = async () => {
    try {
      const m = await Gb();
      g(m), x(!0);
    } catch (m) {
      x(!1), D({ kind: "err", message: `secret-store unavailable: ${m.message}` });
    }
  };
  R.useEffect(() => {
    N().catch(() => {
    });
  }, []), R.useEffect(() => {
    c(dp(e));
  }, [e]), R.useEffect(() => {
    o(t.startsWith("secret_ref:project:") ? "project" : "platform");
  }, [t]);
  const l = async () => {
    if (!p.trim() || !u.trim()) return;
    const m = u.trim();
    E(!0), D({ kind: "idle", message: "" });
    try {
      const v = a === "project" ? qb(m) : Ui(m), k = a === "project" ? await Wb(n, m, p) : await Ub(m, p);
      h(""), D({
        kind: "ok",
        message: k.created ? `Saved ${a} key as ${m}` : `Updated ${a} key ${m}`
      }), r(v), a === "platform" && await N();
    } catch (v) {
      D({ kind: "err", message: v.message });
    } finally {
      E(!1);
    }
  }, f = async (m) => {
    E(!0);
    try {
      await Vb(m), t === Ui(m) && r(""), await N(), D({ kind: "ok", message: `Removed ${m}` });
    } catch (v) {
      D({ kind: "err", message: v.message });
    } finally {
      E(!1);
    }
  }, d = (m) => {
    c(m), r(Ui(m));
  };
  return /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
    /* @__PURE__ */ i.jsxs("header", { className: "drawer-section-header", children: [
      /* @__PURE__ */ i.jsx("h3", { children: "API Key" }),
      /* @__PURE__ */ i.jsx("small", { children: "Stored encrypted in the host secret store. Never sent to model providers except as request headers." })
    ] }),
    _ === !1 && /* @__PURE__ */ i.jsxs("div", { className: "connection-status status-error", children: [
      "Secret store unavailable. Verify ",
      /* @__PURE__ */ i.jsx("code", { children: "official/secret-store-lab" }),
      " is loaded in your host profile."
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "range-block", children: [
      /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsx(
          "input",
          {
            type: "radio",
            name: "api-key-scope",
            value: "platform",
            checked: a === "platform",
            onChange: () => o("platform")
          }
        ),
        /* @__PURE__ */ i.jsx("span", { children: "Platform-wide (shared with all projects)" })
      ] }),
      /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsx(
          "input",
          {
            type: "radio",
            name: "api-key-scope",
            value: "project",
            checked: a === "project",
            onChange: () => o("project")
          }
        ),
        /* @__PURE__ */ i.jsx("span", { children: "This project only" })
      ] })
    ] }),
    /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
      /* @__PURE__ */ i.jsx("span", { children: "Secret name:" }),
      /* @__PURE__ */ i.jsx(
        "input",
        {
          type: "text",
          className: "text_pole",
          value: u,
          onChange: (m) => c(m.target.value),
          placeholder: s
        }
      )
    ] }) }),
    /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
      /* @__PURE__ */ i.jsx("span", { children: "API key:" }),
      /* @__PURE__ */ i.jsx(
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
    /* @__PURE__ */ i.jsx("div", { className: "preset-actions", children: /* @__PURE__ */ i.jsxs(
      "button",
      {
        type: "button",
        className: "menu_button",
        onClick: l,
        disabled: w || !p.trim() || !u.trim(),
        children: [
          /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-floppy-disk", "aria-hidden": "true" }),
          " Save key"
        ]
      }
    ) }),
    b.length > 0 && /* @__PURE__ */ i.jsxs("div", { className: "range-block", children: [
      /* @__PURE__ */ i.jsx("label", { className: "ydl-saved-keys-label", children: /* @__PURE__ */ i.jsx("span", { children: "Saved keys:" }) }),
      /* @__PURE__ */ i.jsx("ul", { className: "ydl-saved-keys-list", children: b.map((m) => {
        const v = Ui(m), k = t === v;
        return /* @__PURE__ */ i.jsxs("li", { className: "ydl-saved-key-row", children: [
          /* @__PURE__ */ i.jsxs("span", { className: "ydl-saved-key-name", children: [
            m,
            " ",
            k && /* @__PURE__ */ i.jsx("em", { children: "(in use)" })
          ] }),
          /* @__PURE__ */ i.jsxs("span", { className: "ydl-saved-key-actions", children: [
            !k && /* @__PURE__ */ i.jsx(
              "button",
              {
                type: "button",
                className: "menu_button menu_button_compact",
                onClick: () => d(m),
                children: "Use"
              }
            ),
            /* @__PURE__ */ i.jsx(
              "button",
              {
                type: "button",
                className: "menu_button menu_button_compact menu_button_danger",
                onClick: () => f(m),
                disabled: w,
                children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-trash", "aria-hidden": "true" })
              }
            )
          ] })
        ] }, m);
      }) })
    ] }),
    A.kind !== "idle" && /* @__PURE__ */ i.jsx("div", { className: `connection-status ${A.kind === "ok" ? "status-ok" : "status-error"}`, children: A.message })
  ] });
}
function _3({ secretRef: e }) {
  const [t, n] = R.useState({ kind: "unknown" });
  R.useEffect(() => {
    Kb().then((a) => n({ kind: "ok", keySource: a.key_source, secretCount: a.secret_count })).catch(() => n({ kind: "err" }));
  }, []);
  const r = bd(e) !== void 0, s = e.startsWith("secret_ref:project:");
  return /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
    /* @__PURE__ */ i.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ i.jsx("h3", { children: "Status" }) }),
    /* @__PURE__ */ i.jsxs("div", { className: "connection-status", children: [
      /* @__PURE__ */ i.jsx(
        "span",
        {
          className: `status-dot ${t.kind === "ok" && r ? "status-dot-ok" : "status-dot-idle"}`,
          "aria-hidden": "true"
        }
      ),
      /* @__PURE__ */ i.jsxs("span", { children: [
        t.kind === "unknown" && "Checking secret store…",
        t.kind === "err" && "Secret store unavailable",
        t.kind === "ok" && /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
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
const y3 = [
  { value: "none", label: "None (Chat completion)" },
  { value: "chatml", label: "ChatML" },
  { value: "llama3", label: "Llama 3" },
  { value: "alpaca", label: "Alpaca" },
  { value: "vicuna", label: "Vicuna" },
  { value: "mistral", label: "Mistral" },
  { value: "gemma", label: "Gemma" },
  { value: "phi3", label: "Phi-3" },
  { value: "custom", label: "Custom…" }
], x3 = [
  { value: "default", label: "Default" },
  { value: "roleplay", label: "Roleplay" },
  { value: "novel", label: "Novel" },
  { value: "custom", label: "Custom…" }
];
function w3({ drawers: e }) {
  const t = wt(), n = t.formattingSettings;
  return /* @__PURE__ */ i.jsxs(sr, { id: "advanced-formatting", drawers: e, side: "left", title: "Advanced Formatting", children: [
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ i.jsx("h3", { children: "Context template" }),
        /* @__PURE__ */ i.jsx("small", { children: "Frames the prompt with story string, examples, jailbreak." })
      ] }),
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsx("span", { children: "Active template:" }),
        /* @__PURE__ */ i.jsx(
          "select",
          {
            className: "text_pole",
            value: n.contextTemplate,
            onChange: (r) => t.updateFormattingSettings({ contextTemplate: r.target.value }),
            children: x3.map((r) => /* @__PURE__ */ i.jsx("option", { value: r.value, children: r.label }, r.value))
          }
        )
      ] }) }),
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsx("span", { children: "Story string:" }),
        /* @__PURE__ */ i.jsx(
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
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsx("span", { children: "Example separator:" }),
        /* @__PURE__ */ i.jsx(
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
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsx("span", { children: "Chat start:" }),
        /* @__PURE__ */ i.jsx(
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
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ i.jsx("h3", { children: "Instruct mode" }),
        /* @__PURE__ */ i.jsx("small", { children: "Wraps user/assistant turns with role tokens for instruct-tuned models." })
      ] }),
      /* @__PURE__ */ i.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ i.jsx(
          "input",
          {
            type: "checkbox",
            checked: n.instructEnabled,
            onChange: (r) => t.updateFormattingSettings({ instructEnabled: r.target.checked })
          }
        ),
        /* @__PURE__ */ i.jsx("span", { children: "Enable instruct mode" })
      ] }),
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsx("span", { children: "Template:" }),
        /* @__PURE__ */ i.jsx(
          "select",
          {
            className: "text_pole",
            value: n.instructTemplate,
            onChange: (r) => t.updateFormattingSettings({ instructTemplate: r.target.value }),
            children: y3.map((r) => /* @__PURE__ */ i.jsx("option", { value: r.value, children: r.label }, r.value))
          }
        )
      ] }) }),
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsx("span", { children: "Input sequence:" }),
        /* @__PURE__ */ i.jsx(
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
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsx("span", { children: "Output sequence:" }),
        /* @__PURE__ */ i.jsx(
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
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsx("span", { children: "System sequence:" }),
        /* @__PURE__ */ i.jsx(
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
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsx("span", { children: "Stop sequence:" }),
        /* @__PURE__ */ i.jsx(
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
      /* @__PURE__ */ i.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ i.jsx(
          "input",
          {
            type: "checkbox",
            checked: n.instructSystemSameAsUser,
            onChange: (r) => t.updateFormattingSettings({ instructSystemSameAsUser: r.target.checked })
          }
        ),
        /* @__PURE__ */ i.jsx("span", { children: "System same as user" })
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ i.jsx("h3", { children: "System prompt" }) }),
      /* @__PURE__ */ i.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ i.jsx(
          "input",
          {
            type: "checkbox",
            checked: n.systemPromptEnabled,
            onChange: (r) => t.updateFormattingSettings({ systemPromptEnabled: r.target.checked })
          }
        ),
        /* @__PURE__ */ i.jsx("span", { children: "Use system prompt" })
      ] }),
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsx("span", { children: "Content:" }),
        /* @__PURE__ */ i.jsx(
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
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsx("span", { children: "Post-history instructions:" }),
        /* @__PURE__ */ i.jsx(
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
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ i.jsx("h3", { children: "Stopping strings" }),
        /* @__PURE__ */ i.jsx("small", { children: "One per line. The model stops when any string is generated." })
      ] }),
      /* @__PURE__ */ i.jsx(
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
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ i.jsx("h3", { children: "Reasoning" }),
        /* @__PURE__ */ i.jsx("small", { children: "For models that emit a reasoning block before the response." })
      ] }),
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsx("span", { children: "Reasoning prefix:" }),
        /* @__PURE__ */ i.jsx(
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
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsx("span", { children: "Reasoning suffix:" }),
        /* @__PURE__ */ i.jsx(
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
      /* @__PURE__ */ i.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ i.jsx(
          "input",
          {
            type: "checkbox",
            checked: n.reasoningAutoCollapse,
            onChange: (r) => t.updateFormattingSettings({ reasoningAutoCollapse: r.target.checked })
          }
        ),
        /* @__PURE__ */ i.jsx("span", { children: "Auto-collapse reasoning blocks" })
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ i.jsx("h3", { children: "Macros" }) }),
      /* @__PURE__ */ i.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ i.jsx(
          "input",
          {
            type: "checkbox",
            checked: n.macroEnabled,
            onChange: (r) => t.updateFormattingSettings({ macroEnabled: r.target.checked })
          }
        ),
        /* @__PURE__ */ i.jsxs("span", { children: [
          "Enable macro substitution (",
          "{{macro}}",
          ")"
        ] })
      ] }),
      /* @__PURE__ */ i.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ i.jsx(
          "input",
          {
            type: "checkbox",
            checked: n.macroNestedRecursive,
            onChange: (r) => t.updateFormattingSettings({ macroNestedRecursive: r.target.checked })
          }
        ),
        /* @__PURE__ */ i.jsx("span", { children: "Allow nested/recursive macros" })
      ] })
    ] })
  ] });
}
const b3 = [
  { value: "before_char", label: "Before character defs" },
  { value: "after_char", label: "After character defs" },
  { value: "before_an", label: "Before author's note" },
  { value: "after_an", label: "After author's note" },
  { value: "at_depth", label: "At depth" }
];
function oy({ drawers: e }) {
  const t = wt(), n = t.worldBooks.find((o) => o.id === t.activeWorldBookId) ?? t.worldBooks[0], r = n?.entries.find((o) => o.uid === t.selectedWorldEntryId) ?? n?.entries[0], s = (o) => {
    n === void 0 || r === void 0 || t.updateWorldEntry(n.id, r.uid, o);
  }, a = () => {
    n !== void 0 && t.createWorldEntry(n.id, { key: [], content: "" });
  };
  return /* @__PURE__ */ i.jsxs(sr, { id: "world-info", drawers: e, side: "left", title: "World Info", children: [
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ i.jsx("h3", { children: "World books" }),
        /* @__PURE__ */ i.jsxs("div", { className: "preset-actions", children: [
          /* @__PURE__ */ i.jsxs(
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
                /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-plus", "aria-hidden": "true" }),
                " New"
              ]
            }
          ),
          /* @__PURE__ */ i.jsxs("button", { type: "button", className: "menu_button", "aria-label": "Import world book", children: [
            /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-file-import", "aria-hidden": "true" }),
            " Import"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ i.jsx("ul", { className: "worldbook-list", role: "list", children: t.worldBooks.map((o) => /* @__PURE__ */ i.jsxs(
        "li",
        {
          className: `worldbook-row ${n?.id === o.id ? "active" : ""}`,
          children: [
            /* @__PURE__ */ i.jsxs(
              "button",
              {
                type: "button",
                className: "worldbook-row-button",
                onClick: () => {
                  t.setActiveWorldBook(o.id), t.setSelectedWorldEntry(o.entries[0]?.uid ?? null);
                },
                "aria-pressed": n?.id === o.id,
                children: [
                  /* @__PURE__ */ i.jsx(
                    "i",
                    {
                      className: `fa-solid ${o.enabled ? "fa-toggle-on" : "fa-toggle-off"}`,
                      "aria-hidden": "true"
                    }
                  ),
                  /* @__PURE__ */ i.jsx("span", { className: "worldbook-name", children: o.name }),
                  /* @__PURE__ */ i.jsx("span", { className: "worldbook-count", children: o.entries.length })
                ]
              }
            ),
            /* @__PURE__ */ i.jsxs("div", { className: "worldbook-row-actions", children: [
              /* @__PURE__ */ i.jsx(
                "button",
                {
                  type: "button",
                  className: "mes_button",
                  "aria-label": `Edit ${o.name}`,
                  onClick: () => {
                    t.setActiveWorldBook(o.id), t.setSelectedWorldEntry(o.entries[0]?.uid ?? null);
                  },
                  children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-pencil", "aria-hidden": "true" })
                }
              ),
              /* @__PURE__ */ i.jsx("button", { type: "button", className: "mes_button", "aria-label": `Export ${o.name}`, children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-download", "aria-hidden": "true" }) }),
              /* @__PURE__ */ i.jsx(
                "button",
                {
                  type: "button",
                  className: "mes_button danger",
                  "aria-label": `Delete ${o.name}`,
                  onClick: () => t.deleteWorldBook(o.id),
                  children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-trash", "aria-hidden": "true" })
                }
              )
            ] })
          ]
        },
        o.id
      )) })
    ] }),
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ i.jsx("h3", { children: "Entry editor" }),
        /* @__PURE__ */ i.jsxs("small", { children: [
          "Selected book: ",
          /* @__PURE__ */ i.jsx("code", { children: n?.name ?? "None" })
        ] }),
        n !== void 0 && /* @__PURE__ */ i.jsx("div", { className: "preset-actions", children: /* @__PURE__ */ i.jsxs("button", { type: "button", className: "menu_button", "aria-label": "Create world entry", onClick: a, children: [
          /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-plus", "aria-hidden": "true" }),
          " New entry"
        ] }) })
      ] }),
      n === void 0 ? /* @__PURE__ */ i.jsx("p", { className: "drawer-coming-soon", children: "Create a world book to edit entries." }) : r === void 0 ? /* @__PURE__ */ i.jsx("p", { className: "drawer-coming-soon", children: "Create an entry to edit this world book." }) : /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
        /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
          /* @__PURE__ */ i.jsx("span", { children: "Primary keys (comma-separated):" }),
          /* @__PURE__ */ i.jsx(
            "input",
            {
              type: "text",
              className: "text_pole",
              value: r.key.join(", "),
              onChange: (o) => s({ key: rh(o.target.value) }),
              placeholder: "castle, fortress"
            }
          )
        ] }) }),
        /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
          /* @__PURE__ */ i.jsx("span", { children: "Secondary keys (optional):" }),
          /* @__PURE__ */ i.jsx(
            "input",
            {
              type: "text",
              className: "text_pole",
              value: (r.secondaryKey ?? []).join(", "),
              onChange: (o) => s({ secondaryKey: rh(o.target.value) }),
              placeholder: "ancient, ruins"
            }
          )
        ] }) }),
        /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
          /* @__PURE__ */ i.jsx("span", { children: "Content:" }),
          /* @__PURE__ */ i.jsx(
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
        /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
          /* @__PURE__ */ i.jsx("span", { children: "Position:" }),
          /* @__PURE__ */ i.jsx(
            "select",
            {
              className: "text_pole",
              value: r.position,
              onChange: (o) => s({ position: o.target.value }),
              children: b3.map((o) => /* @__PURE__ */ i.jsx("option", { value: o.value, children: o.label }, o.value))
            }
          )
        ] }) }),
        r.position === "at_depth" && /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
          /* @__PURE__ */ i.jsxs("span", { children: [
            "Depth: ",
            /* @__PURE__ */ i.jsx("code", { children: r.depth ?? 4 })
          ] }),
          /* @__PURE__ */ i.jsx(
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
        /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
          /* @__PURE__ */ i.jsxs("span", { children: [
            "Scan depth: ",
            /* @__PURE__ */ i.jsx("code", { children: r.scanDepth ?? 1 })
          ] }),
          /* @__PURE__ */ i.jsx(
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
        /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
          /* @__PURE__ */ i.jsxs("span", { children: [
            "Probability: ",
            /* @__PURE__ */ i.jsxs("code", { children: [
              r.probability,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ i.jsx(
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
        /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
          /* @__PURE__ */ i.jsxs("span", { children: [
            "Order: ",
            /* @__PURE__ */ i.jsx("code", { children: r.order })
          ] }),
          /* @__PURE__ */ i.jsx(
            "input",
            {
              type: "number",
              className: "text_pole",
              value: r.order,
              onChange: (o) => s({ order: Number(o.target.value) || 0 })
            }
          )
        ] }) }),
        /* @__PURE__ */ i.jsxs("label", { className: "checkbox_label", children: [
          /* @__PURE__ */ i.jsx(
            "input",
            {
              type: "checkbox",
              checked: r.enabled,
              onChange: (o) => s({ enabled: o.target.checked })
            }
          ),
          /* @__PURE__ */ i.jsx("span", { children: "Entry enabled" })
        ] }),
        /* @__PURE__ */ i.jsxs("div", { className: "preset-actions", children: [
          /* @__PURE__ */ i.jsxs("button", { type: "button", className: "menu_button", "aria-label": "Save entry", children: [
            /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-floppy-disk", "aria-hidden": "true" }),
            " Save entry"
          ] }),
          /* @__PURE__ */ i.jsxs(
            "button",
            {
              type: "button",
              className: "menu_button",
              "aria-label": "Duplicate entry",
              onClick: () => t.duplicateWorldEntry(n.id, r.uid),
              children: [
                /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-copy", "aria-hidden": "true" }),
                " Duplicate"
              ]
            }
          ),
          /* @__PURE__ */ i.jsxs(
            "button",
            {
              type: "button",
              className: "menu_button danger",
              "aria-label": "Delete entry",
              onClick: () => t.deleteWorldEntry(n.id, r.uid),
              children: [
                /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-trash", "aria-hidden": "true" }),
                " Delete"
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ i.jsx("h3", { children: "Activation diagnostics" }),
        /* @__PURE__ */ i.jsx("small", { children: "Last scan results across active world books." })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "wi-diagnostics", children: [
        /* @__PURE__ */ i.jsxs("div", { className: "wi-diagnostic-row", children: [
          /* @__PURE__ */ i.jsx("span", { children: "Activated entries:" }),
          /* @__PURE__ */ i.jsx("code", { children: "0" })
        ] }),
        /* @__PURE__ */ i.jsxs("div", { className: "wi-diagnostic-row", children: [
          /* @__PURE__ */ i.jsx("span", { children: "Budget used:" }),
          /* @__PURE__ */ i.jsx("code", { children: "0 / 0" })
        ] }),
        /* @__PURE__ */ i.jsxs("div", { className: "wi-diagnostic-row", children: [
          /* @__PURE__ */ i.jsx("span", { children: "Scan iterations:" }),
          /* @__PURE__ */ i.jsx("code", { children: "0" })
        ] })
      ] })
    ] })
  ] });
}
function rh(e) {
  return e.split(",").map((t) => t.trim()).filter(Boolean);
}
const S3 = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "spacious", label: "Spacious" }
], k3 = [
  { value: '"Inter", ui-sans-serif, system-ui, sans-serif', label: "Inter (Sans)" },
  { value: '"Fraunces", "Iowan Old Style", Georgia, serif', label: "Fraunces (Serif)" },
  { value: '"JetBrains Mono", "SF Mono", Menlo, monospace', label: "JetBrains Mono (Mono)" },
  { value: '"Iowan Old Style", Georgia, serif', label: "Iowan (Serif)" },
  { value: "ui-sans-serif, system-ui, sans-serif", label: "System UI (Sans)" }
];
function N3({
  themeId: e,
  selected: t,
  onSelect: n
}) {
  const r = yd(e);
  return /* @__PURE__ */ i.jsxs(
    "button",
    {
      type: "button",
      className: `theme-card${t ? " theme-card-selected" : ""}`,
      onClick: n,
      "aria-pressed": t,
      children: [
        /* @__PURE__ */ i.jsx(
          "span",
          {
            className: "theme-card-swatch",
            style: {
              background: `linear-gradient(135deg, ${r.tokens.bgPrimary}, ${r.tokens.bgSecondary})`,
              border: `1px solid ${r.tokens.border}`,
              color: r.tokens.fgPrimary
            },
            children: /* @__PURE__ */ i.jsx("span", { className: "theme-card-swatch-text", children: "Aa" })
          }
        ),
        /* @__PURE__ */ i.jsx("span", { className: "theme-card-name", children: r.label ?? r.name })
      ]
    }
  );
}
function ly({ settings: e, onChange: t }) {
  const n = yd(e.themeId), r = R.useCallback((o) => {
    t({ ...e, themeId: o });
  }, [e, t]), s = R.useCallback((o) => {
    t({ ...e, density: o.target.value });
  }, [e, t]), a = R.useCallback((o) => {
    t({ ...e, fontFamily: o.target.value });
  }, [e, t]);
  return /* @__PURE__ */ i.jsxs("section", { className: "settings-form-section", children: [
    /* @__PURE__ */ i.jsx("h3", { className: "settings-form-title", children: "Theme" }),
    /* @__PURE__ */ i.jsxs("div", { className: "settings-field", children: [
      /* @__PURE__ */ i.jsx("span", { className: "settings-label", children: "Color Theme" }),
      /* @__PURE__ */ i.jsx("div", { className: "theme-card-grid", children: Qh.map((o) => /* @__PURE__ */ i.jsx(
        N3,
        {
          themeId: o.name,
          selected: n.name === o.name,
          onSelect: () => r(o.name)
        },
        o.name
      )) })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "settings-form-grid", children: [
      /* @__PURE__ */ i.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ i.jsx("span", { className: "settings-label", children: "Density" }),
        /* @__PURE__ */ i.jsx(
          "select",
          {
            className: "settings-input",
            value: e.density,
            onChange: s,
            children: S3.map((o) => /* @__PURE__ */ i.jsx("option", { value: o.value, children: o.label }, o.value))
          }
        )
      ] }),
      /* @__PURE__ */ i.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ i.jsx("span", { className: "settings-label", children: "Font Family" }),
        /* @__PURE__ */ i.jsx(
          "select",
          {
            className: "settings-input",
            value: e.fontFamily,
            onChange: a,
            children: k3.map((o) => /* @__PURE__ */ i.jsx("option", { value: o.value, children: o.label }, o.value))
          }
        )
      ] })
    ] })
  ] });
}
const uy = {
  themeId: yr.name,
  density: yr.density,
  fontFamily: yr.font.family
};
function cy({ drawers: e }) {
  const t = wt();
  return /* @__PURE__ */ i.jsxs(sr, { id: "user-settings", drawers: e, side: "left", title: "User Settings", children: [
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ i.jsx("h3", { children: "Theme" }) }),
      /* @__PURE__ */ i.jsx(
        ly,
        {
          settings: t.themeSettings ?? uy,
          onChange: (n) => {
            t.setThemeSettings(n);
          }
        }
      )
    ] }),
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ i.jsx("h3", { children: "UI Preferences" }) }),
      /* @__PURE__ */ i.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ i.jsx(
          "input",
          {
            type: "checkbox",
            checked: t.settings?.fastUImode ?? !1,
            onChange: (n) => t.updateSettings({ fastUImode: n.target.checked })
          }
        ),
        /* @__PURE__ */ i.jsx("span", { children: "Fast UI mode (disable blur effects)" })
      ] }),
      /* @__PURE__ */ i.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ i.jsx(
          "input",
          {
            type: "checkbox",
            checked: t.settings?.reducedMotion ?? !1,
            onChange: (n) => t.updateSettings({ reducedMotion: n.target.checked })
          }
        ),
        /* @__PURE__ */ i.jsx("span", { children: "Reduced motion (disable animations)" })
      ] }),
      /* @__PURE__ */ i.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ i.jsx(
          "input",
          {
            type: "checkbox",
            checked: t.settings?.showTimestamps ?? !1,
            onChange: (n) => t.updateSettings({ showTimestamps: n.target.checked })
          }
        ),
        /* @__PURE__ */ i.jsx("span", { children: "Show timestamps on messages" })
      ] }),
      /* @__PURE__ */ i.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ i.jsx(
          "input",
          {
            type: "checkbox",
            checked: t.settings?.showTokenCounter ?? !1,
            onChange: (n) => t.updateSettings({ showTokenCounter: n.target.checked })
          }
        ),
        /* @__PURE__ */ i.jsx("span", { children: "Show token counter on messages" })
      ] }),
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsxs("span", { children: [
          "Font scale: ",
          /* @__PURE__ */ i.jsx("code", { children: t.settings?.fontScale ?? 1 })
        ] }),
        /* @__PURE__ */ i.jsx(
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
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsxs("span", { children: [
          "Chat width: ",
          /* @__PURE__ */ i.jsxs("code", { children: [
            t.settings?.chatWidth ?? 50,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ i.jsx(
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
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsx("span", { children: "Avatar style:" }),
        /* @__PURE__ */ i.jsxs(
          "select",
          {
            className: "text_pole",
            value: t.settings?.avatarStyle ?? 0,
            onChange: (n) => t.updateSettings({ avatarStyle: Number.parseInt(n.target.value, 10) }),
            children: [
              /* @__PURE__ */ i.jsx("option", { value: "0", children: "Square (2px radius)" }),
              /* @__PURE__ */ i.jsx("option", { value: "1", children: "Rounded (10px radius)" }),
              /* @__PURE__ */ i.jsx("option", { value: "2", children: "Circle" })
            ]
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ i.jsx("h3", { children: "Persistence" }) }),
      /* @__PURE__ */ i.jsxs("div", { className: "preset-actions", children: [
        /* @__PURE__ */ i.jsxs(
          "button",
          {
            type: "button",
            className: "menu_button",
            "aria-label": "Export settings",
            onClick: () => j3({ settings: t.settings, themeSettings: t.themeSettings }, "ydltavern-settings.json"),
            children: [
              /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-file-export" }),
              " Export"
            ]
          }
        ),
        /* @__PURE__ */ i.jsxs("label", { className: "menu_button", "aria-label": "Import settings", children: [
          /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-file-import" }),
          " Import",
          /* @__PURE__ */ i.jsx(
            "input",
            {
              type: "file",
              accept: "application/json,.json",
              hidden: !0,
              onChange: (n) => {
                const r = n.target.files?.[0];
                r && E3(r, (s) => {
                  s.settings && t.updateSettings(s.settings), s.themeSettings && t.setThemeSettings(s.themeSettings);
                }), n.currentTarget.value = "";
              }
            }
          )
        ] }),
        /* @__PURE__ */ i.jsxs(
          "button",
          {
            type: "button",
            className: "menu_button danger",
            "aria-label": "Reset to defaults",
            onClick: () => t.resetSettings(),
            children: [
              /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-rotate-left" }),
              " Reset"
            ]
          }
        )
      ] })
    ] })
  ] });
}
function j3(e, t) {
  const n = new Blob([JSON.stringify(e, null, 2)], { type: "application/json" }), r = URL.createObjectURL(n), s = document.createElement("a");
  s.href = r, s.download = t, s.click(), URL.revokeObjectURL(r);
}
function E3(e, t) {
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
  const t = wt(), [n, r] = R.useState(""), [s, a] = R.useState("All"), o = ["All", ...Array.from(new Set(t.backgrounds.map((c) => c.folder ?? "Default")))], u = t.backgrounds.filter(
    (c) => (s === "All" || c.folder === s) && (!n.trim() || c.name.toLowerCase().includes(n.toLowerCase()))
  );
  return /* @__PURE__ */ i.jsxs(sr, { id: "backgrounds", drawers: e, side: "left", title: "Backgrounds", children: [
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ i.jsx("h3", { children: "Library" }),
        /* @__PURE__ */ i.jsxs("div", { className: "preset-actions", children: [
          /* @__PURE__ */ i.jsxs("label", { className: "menu_button", "aria-label": "Upload background", children: [
            /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-upload", "aria-hidden": "true" }),
            " Upload",
            /* @__PURE__ */ i.jsx(
              "input",
              {
                type: "file",
                accept: "image/*",
                hidden: !0,
                onChange: (c) => {
                  const p = c.target.files?.[0];
                  p && C3(p, t.uploadBackground), c.currentTarget.value = "";
                }
              }
            )
          ] }),
          /* @__PURE__ */ i.jsxs("button", { type: "button", className: "menu_button", "aria-label": "Open folder on disk", children: [
            /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-folder-open", "aria-hidden": "true" }),
            " Folder"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsx("span", { children: "Folder:" }),
        /* @__PURE__ */ i.jsx("select", { className: "text_pole", value: s, onChange: (c) => a(c.target.value), children: o.map((c) => /* @__PURE__ */ i.jsx("option", { value: c, children: c }, c)) })
      ] }) }),
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsx(
        "input",
        {
          type: "search",
          className: "text_pole",
          value: n,
          onChange: (c) => r(c.target.value),
          placeholder: "Search backgrounds…",
          "aria-label": "Search backgrounds"
        }
      ) }),
      /* @__PURE__ */ i.jsxs("div", { className: "bg-grid", children: [
        u.length === 0 && /* @__PURE__ */ i.jsx("div", { className: "bg-empty", children: "No backgrounds match this filter." }),
        u.map((c) => /* @__PURE__ */ i.jsxs(
          "button",
          {
            type: "button",
            className: `bg-card ${t.activeBackgroundId === c.id ? "active" : ""}`,
            onClick: () => t.setActiveBackground(c.id),
            "aria-pressed": t.activeBackgroundId === c.id,
            "aria-label": `Use ${c.name}`,
            children: [
              /* @__PURE__ */ i.jsx("div", { className: "bg-card-thumb", children: c.thumbnailUrl ? /* @__PURE__ */ i.jsx("img", { src: c.thumbnailUrl, alt: "" }) : /* @__PURE__ */ i.jsx("div", { className: "bg-card-placeholder", children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-image", "aria-hidden": "true" }) }) }),
              /* @__PURE__ */ i.jsx("div", { className: "bg-card-name", children: c.name })
            ]
          },
          c.id
        ))
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ i.jsx("h3", { children: "Display" }) }),
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsxs("label", { children: [
        /* @__PURE__ */ i.jsx("span", { children: "Fit mode:" }),
        /* @__PURE__ */ i.jsxs(
          "select",
          {
            className: "text_pole",
            value: t.backgroundDisplaySettings.fitMode,
            onChange: (c) => t.setBackgroundFitMode(c.target.value),
            children: [
              /* @__PURE__ */ i.jsx("option", { value: "cover", children: "Cover (fill, may crop)" }),
              /* @__PURE__ */ i.jsx("option", { value: "contain", children: "Contain (fit, may letterbox)" }),
              /* @__PURE__ */ i.jsx("option", { value: "tile", children: "Tile (repeat)" })
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ i.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ i.jsx(
          "input",
          {
            type: "checkbox",
            checked: t.backgroundDisplaySettings.autoSelectByCharacter,
            onChange: (c) => t.setBackgroundAutoSelect(c.target.checked)
          }
        ),
        /* @__PURE__ */ i.jsx("span", { children: "Auto-select background per character" })
      ] })
    ] })
  ] });
}
function C3(e, t) {
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
  const [n] = R.useState(() => new pb(T3())), [, r] = R.useState(0), s = R.useMemo(() => {
    if (!(e.length === 0 || t === void 0))
      return lp({
        records: e,
        ctx: t,
        basePath: (u) => `/scripts/extensions/${u}`
      });
  }, [e, t]), a = R.useCallback((u) => {
    n.isDisabled(u) ? n.enable(u) : n.disable(u), I3(n.list()), r((c) => c + 1);
  }, [n]), o = R.useMemo(() => {
    if (e.length === 0 || t === void 0) return;
    const u = {
      ...t,
      disabledExtensions: new Set(n.list())
    };
    return lp({
      records: e,
      ctx: u,
      basePath: (c) => `/scripts/extensions/${c}`
    });
  }, [e, t, n]);
  return /* @__PURE__ */ i.jsxs("section", { className: "drawer-panel product-extensions-panel", children: [
    /* @__PURE__ */ i.jsx("h2", { children: "Extensions" }),
    e.length === 0 ? /* @__PURE__ */ i.jsx("div", { className: "panel-row", children: /* @__PURE__ */ i.jsx("span", { children: "No extensions registered. Install extensions to see them here." }) }) : null,
    o && /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
      /* @__PURE__ */ i.jsxs("div", { className: "extension-summary", children: [
        /* @__PURE__ */ i.jsxs("span", { className: "ext-count-badge ext-activated", children: [
          o.activated.length,
          " activated"
        ] }),
        o.skipped.length > 0 ? /* @__PURE__ */ i.jsxs("span", { className: "ext-count-badge ext-skipped", children: [
          o.skipped.length,
          " skipped"
        ] }) : null
      ] }),
      /* @__PURE__ */ i.jsx("div", { className: "extension-list", children: e.map((u) => {
        const c = n.isDisabled(u.id), p = o.skipped.filter((b) => b.id === u.id).flatMap((b) => b.reasons), h = !c && p.length === 0;
        return /* @__PURE__ */ i.jsxs("article", { className: `panel-row ext-row${h ? "" : " ext-row-inactive"}`, children: [
          /* @__PURE__ */ i.jsxs("div", { className: "ext-row-header", children: [
            /* @__PURE__ */ i.jsxs("div", { className: "ext-info", children: [
              /* @__PURE__ */ i.jsx("strong", { className: "ext-id", children: u.id }),
              /* @__PURE__ */ i.jsx("span", { className: "ext-display-name", children: u.manifest.display_name }),
              u.manifest.version ? /* @__PURE__ */ i.jsxs("span", { className: "ext-version", children: [
                "v",
                u.manifest.version
              ] }) : null
            ] }),
            /* @__PURE__ */ i.jsxs("div", { className: "ext-actions", children: [
              /* @__PURE__ */ i.jsx("span", { className: `ext-status${h ? " ext-status-ok" : p.length > 0 ? " ext-status-skipped" : " ext-status-disabled"}`, children: h ? "activated" : p.length > 0 ? "skipped" : "disabled" }),
              /* @__PURE__ */ i.jsx(
                "button",
                {
                  type: "button",
                  className: "ext-toggle",
                  onClick: () => a(u.id),
                  "aria-pressed": !c,
                  children: c ? "Enable" : "Disable"
                }
              )
            ] })
          ] }),
          p.length > 0 ? /* @__PURE__ */ i.jsx("ul", { className: "ext-reasons", children: p.map((b, g) => /* @__PURE__ */ i.jsx("li", { className: "ext-reason", children: b }, g)) }) : null,
          u.manifest.hooks && Object.keys(u.manifest.hooks).length > 0 ? /* @__PURE__ */ i.jsx("div", { className: "ext-hooks", children: Object.entries(u.manifest.hooks).map(([b, g]) => /* @__PURE__ */ i.jsxs("span", { className: "ext-hook-badge", children: [
            b,
            ":",
            g
          ] }, b)) }) : null
        ] }, u.id);
      }) })
    ] }),
    s === void 0 && e.length > 0 && /* @__PURE__ */ i.jsxs("div", { className: "permission-card", children: [
      /* @__PURE__ */ i.jsx("strong", { children: "Activation Context Missing" }),
      /* @__PURE__ */ i.jsx("p", { children: "Extension activation plan cannot be computed without an activation context." })
    ] })
  ] });
}
function T3() {
  try {
    const e = localStorage.getItem("ydltavern.disabledExtensions");
    return e ? JSON.parse(e) : [];
  } catch {
    return [];
  }
}
function I3(e) {
  try {
    localStorage.setItem("ydltavern.disabledExtensions", JSON.stringify(e));
  } catch {
  }
}
function A3({ drawers: e }) {
  const t = wt();
  return /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsxs("div", { style: { display: "none" }, "aria-hidden": "true", children: [
      /* @__PURE__ */ i.jsx("div", { id: "extensions_settings", "data-extension-territory": !0 }),
      /* @__PURE__ */ i.jsx("div", { id: "extensions_settings2", "data-extension-territory": !0 })
    ] }),
    /* @__PURE__ */ i.jsx(sr, { id: "extensions", drawers: e, side: "left", title: "Extensions", children: /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ i.jsx("h3", { children: "Installed" }),
        /* @__PURE__ */ i.jsxs("div", { className: "preset-actions", children: [
          /* @__PURE__ */ i.jsxs("button", { type: "button", className: "menu_button", "aria-label": "Install extension", children: [
            /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-plus" }),
            " Install"
          ] }),
          /* @__PURE__ */ i.jsxs("button", { type: "button", className: "menu_button", "aria-label": "Refresh extensions", children: [
            /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-arrows-rotate" }),
            " Refresh"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ i.jsx(
        fy,
        {
          records: t.extensionRecords,
          activationContext: t.extensionActivationContext
        }
      )
    ] }) })
  ] });
}
const P3 = {
  name: "User",
  description: "",
  avatarUrl: ""
};
function py({ settings: e, onChange: t }) {
  const [n, r] = R.useState(e), s = R.useCallback(() => {
    t(n);
  }, [n, t]), a = R.useCallback((o, u) => {
    r((c) => ({ ...c, [o]: u }));
  }, []);
  return /* @__PURE__ */ i.jsxs("section", { className: "settings-form-section", children: [
    /* @__PURE__ */ i.jsx("h3", { className: "settings-form-title", children: "Persona" }),
    /* @__PURE__ */ i.jsxs("div", { className: "settings-form-grid", children: [
      /* @__PURE__ */ i.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ i.jsx("span", { className: "settings-label", children: "Persona Name" }),
        /* @__PURE__ */ i.jsx(
          "input",
          {
            className: "settings-input",
            type: "text",
            value: n.name,
            onChange: (o) => a("name", o.target.value),
            onBlur: s,
            placeholder: "User"
          }
        )
      ] }),
      /* @__PURE__ */ i.jsxs("label", { className: "settings-field settings-field-textarea", children: [
        /* @__PURE__ */ i.jsx("span", { className: "settings-label", children: "Description" }),
        /* @__PURE__ */ i.jsx(
          "textarea",
          {
            className: "settings-textarea",
            value: n.description,
            onChange: (o) => a("description", o.target.value),
            onBlur: s,
            placeholder: "Describe your persona...",
            rows: 4
          }
        )
      ] }),
      /* @__PURE__ */ i.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ i.jsx("span", { className: "settings-label", children: "Avatar URL" }),
        /* @__PURE__ */ i.jsx(
          "input",
          {
            className: "settings-input",
            type: "text",
            value: n.avatarUrl,
            onChange: (o) => a("avatarUrl", o.target.value),
            onBlur: s,
            placeholder: "https://example.com/avatar.png"
          }
        )
      ] })
    ] })
  ] });
}
function my({ drawers: e }) {
  const t = wt(), n = t.personas.find((r) => r.id === t.activePersonaId) ?? t.personas[0];
  return /* @__PURE__ */ i.jsxs(sr, { id: "persona", drawers: e, side: "left", title: "Persona Management", children: [
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ i.jsx("h3", { children: "Personas" }),
        /* @__PURE__ */ i.jsxs("div", { className: "preset-actions", children: [
          /* @__PURE__ */ i.jsxs(
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
                /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-plus", "aria-hidden": "true" }),
                " New"
              ]
            }
          ),
          /* @__PURE__ */ i.jsxs("button", { type: "button", className: "menu_button", "aria-label": "Import persona", children: [
            /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-file-import", "aria-hidden": "true" }),
            " Import"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ i.jsx("ul", { className: "persona-list", role: "list", children: t.personas.map((r) => /* @__PURE__ */ i.jsxs("li", { className: `persona-row ${n?.id === r.id ? "active" : ""}`, children: [
        /* @__PURE__ */ i.jsxs(
          "button",
          {
            type: "button",
            className: "persona-row-button",
            onClick: () => t.setActivePersona(r.id),
            "aria-pressed": n?.id === r.id,
            "aria-label": `Activate persona ${r.name}`,
            children: [
              /* @__PURE__ */ i.jsx("div", { className: "persona-avatar", children: r.avatarUrl ? /* @__PURE__ */ i.jsx("img", { src: r.avatarUrl, alt: "" }) : /* @__PURE__ */ i.jsx("div", { className: "persona-avatar-placeholder", children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-user", "aria-hidden": "true" }) }) }),
              /* @__PURE__ */ i.jsxs("div", { className: "persona-meta", children: [
                /* @__PURE__ */ i.jsx("div", { className: "persona-name", children: r.name }),
                r.description && /* @__PURE__ */ i.jsx("div", { className: "persona-description", children: r.description })
              ] }),
              n?.id === r.id && /* @__PURE__ */ i.jsx("span", { className: "persona-active-badge", "aria-label": "Active persona", children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-check", "aria-hidden": "true" }) })
            ]
          }
        ),
        /* @__PURE__ */ i.jsxs("div", { className: "persona-row-actions", children: [
          /* @__PURE__ */ i.jsx("button", { type: "button", className: "mes_button", "aria-label": `Edit ${r.name}`, children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-pencil", "aria-hidden": "true" }) }),
          /* @__PURE__ */ i.jsx(
            "button",
            {
              type: "button",
              className: "mes_button",
              "aria-label": `Delete ${r.name}`,
              onClick: () => t.deletePersona(r.id),
              disabled: t.personas.length <= 1,
              children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-trash", "aria-hidden": "true" })
            }
          )
        ] })
      ] }, r.id)) })
    ] }),
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ i.jsx("h3", { children: "Edit active persona" }) }),
      n ? /* @__PURE__ */ i.jsx(
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
      ) : /* @__PURE__ */ i.jsx("p", { className: "drawer-coming-soon", children: "Create a persona to edit." })
    ] }),
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsx("header", { className: "drawer-section-header", children: /* @__PURE__ */ i.jsx("h3", { children: "Persona settings" }) }),
      /* @__PURE__ */ i.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ i.jsx("input", { type: "checkbox", defaultChecked: !0 }),
        /* @__PURE__ */ i.jsx("span", { children: "Show persona name in chat" })
      ] }),
      /* @__PURE__ */ i.jsxs("label", { className: "checkbox_label", children: [
        /* @__PURE__ */ i.jsx("input", { type: "checkbox" }),
        /* @__PURE__ */ i.jsx("span", { children: "Lock persona to current chat" })
      ] })
    ] })
  ] });
}
function hy({ drawers: e }) {
  const t = wt(), [n, r] = R.useState(""), s = t.characters.find((o) => o.id === t.activeCharacterId), a = t.characters.filter(
    (o) => !n.trim() || o.name.toLowerCase().includes(n.toLowerCase()) || (o.description ?? "").toLowerCase().includes(n.toLowerCase()) || (o.tags ?? []).some((u) => u.toLowerCase().includes(n.toLowerCase()))
  );
  return /* @__PURE__ */ i.jsxs(sr, { id: "characters", drawers: e, side: "right", title: "Characters", children: [
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ i.jsx("h3", { children: "Library" }),
        /* @__PURE__ */ i.jsxs("div", { className: "preset-actions", children: [
          /* @__PURE__ */ i.jsxs(
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
                /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-plus", "aria-hidden": "true" }),
                " New"
              ]
            }
          ),
          /* @__PURE__ */ i.jsxs("label", { className: "menu_button", "aria-label": "Import character card", children: [
            /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-file-import", "aria-hidden": "true" }),
            " Import",
            /* @__PURE__ */ i.jsx(
              "input",
              {
                type: "file",
                accept: "application/json,.json",
                hidden: !0,
                onChange: (o) => {
                  const u = o.target.files?.[0];
                  u && M3(u, (c) => t.importCharacter(c)), o.currentTarget.value = "";
                }
              }
            )
          ] }),
          /* @__PURE__ */ i.jsxs(
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
                /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-users", "aria-hidden": "true" }),
                " Group"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ i.jsx("div", { className: "range-block", children: /* @__PURE__ */ i.jsx(
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
      /* @__PURE__ */ i.jsxs("ul", { className: "character-list", role: "list", children: [
        a.length === 0 && /* @__PURE__ */ i.jsx("li", { className: "character-empty", children: /* @__PURE__ */ i.jsx("p", { children: "No characters match this search." }) }),
        a.map((o) => /* @__PURE__ */ i.jsxs("li", { className: "character-row", children: [
          /* @__PURE__ */ i.jsxs(
            "button",
            {
              type: "button",
              className: `character-row-button ${t.activeCharacterId === o.id ? "active" : ""}`,
              "aria-label": `Open ${o.name}`,
              "aria-pressed": t.activeCharacterId === o.id,
              onClick: () => t.setActiveCharacter(o.id),
              children: [
                /* @__PURE__ */ i.jsx("div", { className: "character-avatar", children: o.avatarUrl ? /* @__PURE__ */ i.jsx("img", { src: o.avatarUrl, alt: "" }) : /* @__PURE__ */ i.jsx("div", { className: "character-avatar-placeholder", children: /* @__PURE__ */ i.jsx("i", { className: `fa-solid ${o.isGroup ? "fa-users" : "fa-user"}`, "aria-hidden": "true" }) }) }),
                /* @__PURE__ */ i.jsxs("div", { className: "character-meta", children: [
                  /* @__PURE__ */ i.jsx("div", { className: "character-name", children: o.name }),
                  o.description && /* @__PURE__ */ i.jsx("div", { className: "character-description", children: o.description }),
                  o.tags && o.tags.length > 0 && /* @__PURE__ */ i.jsx("div", { className: "character-tags", children: o.tags.map((u) => /* @__PURE__ */ i.jsx("span", { className: "character-tag", children: u }, u)) })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ i.jsxs("div", { className: "character-row-actions", children: [
            /* @__PURE__ */ i.jsx(
              "button",
              {
                type: "button",
                className: "mes_button",
                "aria-label": `Edit ${o.name}`,
                onClick: () => t.setActiveCharacter(o.id),
                children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-pencil", "aria-hidden": "true" })
              }
            ),
            /* @__PURE__ */ i.jsx(
              "button",
              {
                type: "button",
                className: "mes_button",
                "aria-label": `Duplicate ${o.name}`,
                onClick: () => t.duplicateCharacter(o.id),
                children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-copy", "aria-hidden": "true" })
              }
            ),
            /* @__PURE__ */ i.jsx(
              "button",
              {
                type: "button",
                className: "mes_button",
                "aria-label": `Export ${o.name}`,
                onClick: () => {
                  const u = t.exportCharacter(o.id);
                  u && R3(u, `${D3(u.name)}.json`);
                },
                children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-download", "aria-hidden": "true" })
              }
            ),
            /* @__PURE__ */ i.jsx(
              "button",
              {
                type: "button",
                className: "mes_button",
                "aria-label": `Delete ${o.name}`,
                onClick: () => t.deleteCharacter(o.id),
                children: /* @__PURE__ */ i.jsx("i", { className: "fa-solid fa-trash", "aria-hidden": "true" })
              }
            )
          ] })
        ] }, o.id))
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("section", { className: "drawer-section", children: [
      /* @__PURE__ */ i.jsxs("header", { className: "drawer-section-header", children: [
        /* @__PURE__ */ i.jsx("h3", { children: "Group chat members" }),
        /* @__PURE__ */ i.jsx("small", { children: "Visible when a group chat is active." })
      ] }),
      s?.isGroup ? /* @__PURE__ */ i.jsxs("p", { className: "drawer-coming-soon", children: [
        (s.members ?? []).length,
        " member",
        (s.members ?? []).length === 1 ? "" : "s",
        " in ",
        s.name,
        "."
      ] }) : /* @__PURE__ */ i.jsx("p", { className: "drawer-coming-soon", children: "No active group chat." })
    ] })
  ] });
}
function R3(e, t) {
  const n = new Blob([JSON.stringify(e, null, 2)], { type: "application/json" }), r = URL.createObjectURL(n), s = document.createElement("a");
  s.href = r, s.download = t, s.click(), URL.revokeObjectURL(r);
}
function M3(e, t) {
  const n = new FileReader();
  n.onload = () => {
    try {
      t(JSON.parse(String(n.result)));
    } catch (r) {
      console.error("[YdlTavern] Failed to import character", r);
    }
  }, n.readAsText(e);
}
function D3(e) {
  return e.replace(/[^a-z0-9-_]+/gi, "_").replace(/^_+|_+$/g, "") || "character";
}
function O3() {
  const e = wt(), t = ry(), n = L3(e.extensionRecords);
  R.useEffect(() => {
    e.needsApiConnection && t.open("api-connections");
  }, [e.needsApiConnection, t]), R.useEffect(() => {
    const s = (a) => {
      if (a.key !== "Escape" || !t.openId) return;
      const o = document.activeElement;
      o instanceof HTMLTextAreaElement || o instanceof HTMLInputElement && (o.type === "text" || o.type === "search") || (a.preventDefault(), t.close());
    };
    return window.addEventListener("keydown", s), () => window.removeEventListener("keydown", s);
  }, [t]);
  const r = (s) => {
    s && e.pushSystemNotice("Quick reply is not yet available on this surface.");
  };
  return /* @__PURE__ */ i.jsx(ny, { theme: e.theme, children: /* @__PURE__ */ i.jsxs("div", { className: "ydltavern-surface tavern-shell", "data-drawer-open": t.openId ?? "none", children: [
    /* @__PURE__ */ i.jsx(c3, { drawers: t }),
    /* @__PURE__ */ i.jsxs("div", { className: "drawer-rail drawer-rail-left", children: [
      /* @__PURE__ */ i.jsx(ay, { drawers: t }),
      /* @__PURE__ */ i.jsx(g3, { drawers: t }),
      /* @__PURE__ */ i.jsx(w3, { drawers: t }),
      /* @__PURE__ */ i.jsx(oy, { drawers: t }),
      /* @__PURE__ */ i.jsx(cy, { drawers: t }),
      /* @__PURE__ */ i.jsx(dy, { drawers: t }),
      /* @__PURE__ */ i.jsx(A3, { drawers: t }),
      /* @__PURE__ */ i.jsx(my, { drawers: t })
    ] }),
    /* @__PURE__ */ i.jsxs(d3, { children: [
      /* @__PURE__ */ i.jsx(r3, {}),
      /* @__PURE__ */ i.jsx(o3, { sets: n, onTrigger: r }),
      /* @__PURE__ */ i.jsx(
        bS,
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
    /* @__PURE__ */ i.jsx("div", { id: "movingDivs", "data-extension-territory": !0 }),
    /* @__PURE__ */ i.jsxs("div", { style: { display: "none" }, "aria-hidden": "true", children: [
      /* @__PURE__ */ i.jsx("div", { id: "extensions_settings", "data-extension-territory": !0 }),
      /* @__PURE__ */ i.jsx("div", { id: "extensions_settings2", "data-extension-territory": !0 })
    ] }),
    /* @__PURE__ */ i.jsx("div", { className: "drawer-rail drawer-rail-right", children: /* @__PURE__ */ i.jsx(hy, { drawers: t }) }),
    t.openId && /* @__PURE__ */ i.jsx(
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
function L3(e) {
  return e.length === 0 ? [] : (e.find((n) => n.id === "quick-reply"), mb([
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
function z3({ sub: e }) {
  switch (e.kind) {
    case "text":
      return /* @__PURE__ */ i.jsx("p", { className: "sub sub-text", children: e.text.split(`
`).map((t, n, r) => /* @__PURE__ */ i.jsxs("span", { children: [
        t,
        n < r.length - 1 ? /* @__PURE__ */ i.jsx("br", {}) : null
      ] }, n)) });
    case "thinking":
      return /* @__PURE__ */ i.jsxs("details", { className: "sub sub-thinking", open: e.collapsed_by_default !== !0, children: [
        /* @__PURE__ */ i.jsxs("summary", { children: [
          /* @__PURE__ */ i.jsx("span", { className: "sub-tag", children: "thinking" }),
          /* @__PURE__ */ i.jsx("span", { className: "sub-summary-text", children: "internal reasoning" })
        ] }),
        /* @__PURE__ */ i.jsx("p", { children: e.text })
      ] });
    case "tool_call":
      return /* @__PURE__ */ i.jsxs("div", { className: "sub sub-tool-call", children: [
        /* @__PURE__ */ i.jsxs("header", { children: [
          /* @__PURE__ */ i.jsx("span", { className: "sub-tag tag-tool", children: "tool_call" }),
          /* @__PURE__ */ i.jsxs("span", { className: "tool-name", children: [
            e.tool.provider !== void 0 ? `${e.tool.provider}.` : "",
            e.tool.name
          ] }),
          /* @__PURE__ */ i.jsxs("span", { className: "call-id", children: [
            "#",
            e.call_id
          ] })
        ] }),
        /* @__PURE__ */ i.jsx("pre", { className: "json-block", children: JSON.stringify(e.arguments, null, 2) })
      ] });
    case "tool_result":
      return /* @__PURE__ */ i.jsxs("div", { className: `sub sub-tool-result status-${e.status}`, children: [
        /* @__PURE__ */ i.jsxs("header", { children: [
          /* @__PURE__ */ i.jsx("span", { className: "sub-tag tag-result", children: "tool_result" }),
          /* @__PURE__ */ i.jsx("span", { className: "status-pill", children: e.status }),
          /* @__PURE__ */ i.jsxs("span", { className: "call-id", children: [
            "#",
            e.call_id
          ] })
        ] }),
        /* @__PURE__ */ i.jsx("pre", { className: "json-block", children: JSON.stringify(e.result, null, 2) })
      ] });
    case "note":
      return /* @__PURE__ */ i.jsxs("div", { className: "sub sub-note", children: [
        /* @__PURE__ */ i.jsx("span", { className: "sub-tag tag-note", children: "note" }),
        /* @__PURE__ */ i.jsx("span", { children: e.text })
      ] });
    case "skill_invoke":
    case "agent_step":
    case "image":
    case "audio":
    case "attachment":
    case "file_embed":
      return /* @__PURE__ */ i.jsxs("div", { className: "sub sub-placeholder", children: [
        /* @__PURE__ */ i.jsx("span", { className: "sub-tag tag-stub", children: e.kind }),
        /* @__PURE__ */ i.jsx("span", { children: "not rendered in scaffold" })
      ] });
  }
}
const sh = {
  user: "User",
  assistant: "Assistant",
  system: "System",
  tool: "Tool"
};
function B3({ turn: e }) {
  const t = dd(e), n = e.variants.length, r = e.speaker?.name ?? sh[e.role], s = `${e.active_variant + 1} / ${n}`;
  return /* @__PURE__ */ i.jsxs("article", { className: `turn turn-role-${e.role}`, "data-turn-index": e.index, children: [
    /* @__PURE__ */ i.jsxs("header", { className: "turn-header", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "turn-identity", children: [
        /* @__PURE__ */ i.jsx("span", { className: "turn-role", children: sh[e.role] }),
        /* @__PURE__ */ i.jsx("span", { className: "turn-speaker", children: r })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "turn-meta", children: [
        /* @__PURE__ */ i.jsx("button", { type: "button", className: "swipe swipe-prev", disabled: !0, "aria-label": "Previous variant", children: "‹" }),
        /* @__PURE__ */ i.jsx("span", { className: "swipe-position", title: "active variant / total variants", children: s }),
        /* @__PURE__ */ i.jsx("button", { type: "button", className: "swipe swipe-next", disabled: !0, "aria-label": "Next variant", children: "›" })
      ] })
    ] }),
    t === void 0 ? /* @__PURE__ */ i.jsx("p", { className: "turn-empty", children: "No active variant." }) : /* @__PURE__ */ i.jsx("div", { className: "turn-body", children: t.subs.map((a, o) => /* @__PURE__ */ i.jsx(z3, { sub: a }, `${e.id}-sub-${o}`)) }),
    t !== void 0 && $3(t.meta) ? /* @__PURE__ */ i.jsxs("footer", { className: "turn-footer", children: [
      t.meta.model !== void 0 ? /* @__PURE__ */ i.jsxs("span", { children: [
        "model: ",
        t.meta.model
      ] }) : null,
      t.meta.tokens !== void 0 ? /* @__PURE__ */ i.jsxs("span", { children: [
        "tokens: ",
        t.meta.tokens
      ] }) : null,
      t.meta.latency_ms !== void 0 ? /* @__PURE__ */ i.jsxs("span", { children: [
        "latency: ",
        t.meta.latency_ms,
        "ms"
      ] }) : null,
      t.meta.finish_reason !== void 0 ? /* @__PURE__ */ i.jsxs("span", { children: [
        "finish: ",
        t.meta.finish_reason
      ] }) : null
    ] }) : null
  ] });
}
function $3(e) {
  return e.model !== void 0 || e.tokens !== void 0 || e.latency_ms !== void 0 || e.finish_reason !== void 0;
}
function mC() {
  const { liveChat: e } = wt();
  return /* @__PURE__ */ i.jsx(
    Y_,
    {
      className: "tavern-chat-list",
      data: e.turns,
      itemContent: (t, n) => /* @__PURE__ */ i.jsx(B3, { turn: n }, n.id),
      followOutput: "auto",
      overscan: { main: 200, reverse: 200 }
    }
  );
}
function hC() {
  const e = wt();
  return /* @__PURE__ */ i.jsxs("section", { className: "product-composer", children: [
    /* @__PURE__ */ i.jsx("textarea", { value: e.input, onChange: (t) => e.setInput(t.target.value), onKeyDown: (t) => {
      (t.metaKey || t.ctrlKey) && t.key === "Enter" && e.sendMessage();
    }, placeholder: "Type a message. Ctrl/⌘ + Enter sends." }),
    /* @__PURE__ */ i.jsxs("div", { className: "composer-actions", children: [
      /* @__PURE__ */ i.jsx("button", { type: "button", onClick: () => {
        e.sendMessage();
      }, children: "Send" }),
      /* @__PURE__ */ i.jsx("button", { type: "button", onClick: e.generateReply, children: "Generate" })
    ] })
  ] });
}
function F3() {
  const e = wt();
  return /* @__PURE__ */ i.jsxs("section", { className: "product-control-card", children: [
    /* @__PURE__ */ i.jsx("h3", { children: "Generation" }),
    /* @__PURE__ */ i.jsx("button", { type: "button", onClick: e.generateReply, children: "Generate" }),
    /* @__PURE__ */ i.jsx("button", { type: "button", onClick: e.regenerateReply, children: "Regenerate" }),
    /* @__PURE__ */ i.jsx("button", { type: "button", onClick: e.swipeReply, children: "Swipe" }),
    /* @__PURE__ */ i.jsx("button", { type: "button", onClick: e.editFirstMessage, children: "Edit first" }),
    /* @__PURE__ */ i.jsx("p", { children: "Controls call the live ST context. Real model routing lands later through Yggdrasil public protocol." })
  ] });
}
function gC() {
  return /* @__PURE__ */ i.jsx(F3, {});
}
const Hr = [
  { id: "connection", label: "Connection" },
  { id: "sampler", label: "Sampler" },
  { id: "persona", label: "Persona" },
  { id: "theme", label: "Theme" }
], H3 = () => Pl("ydltavern.connection", p3), U3 = () => Pl("ydltavern.sampler", f3), W3 = () => Pl("ydltavern.persona", P3), G3 = () => Pl("ydltavern.themeSettings", uy);
function Pl(e, t) {
  try {
    const n = localStorage.getItem(e);
    return n ? JSON.parse(n) : t;
  } catch {
    return t;
  }
}
function fo(e, t, n = 300) {
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
function V3({ children: e }) {
  const [t, n] = R.useState("connection"), r = R.useMemo(() => ({
    connection: H3(),
    sampler: U3(),
    persona: W3(),
    theme: G3()
  }), []), [s, a] = R.useState(r.connection), [o, u] = R.useState(r.sampler), [c, p] = R.useState(r.persona), [h, b] = R.useState(r.theme);
  R.useEffect(() => fo("ydltavern.connection", s)(), [s]), R.useEffect(() => fo("ydltavern.sampler", o)(), [o]), R.useEffect(() => fo("ydltavern.persona", c)(), [c]), R.useEffect(() => fo("ydltavern.themeSettings", h)(), [h]);
  const g = R.useCallback((w) => {
    const E = Hr.findIndex((A) => A.id === t);
    if (w.key === "ArrowRight") {
      const A = Hr[(E + 1) % Hr.length];
      A && n(A.id);
    } else if (w.key === "ArrowLeft") {
      const A = Hr[(E - 1 + Hr.length) % Hr.length];
      A && n(A.id);
    }
  }, [t]);
  return /* @__PURE__ */ i.jsxs("section", { className: "drawer-panel product-settings-panel", children: [
    /* @__PURE__ */ i.jsx("h2", { children: "Settings" }),
    /* @__PURE__ */ i.jsx("nav", { className: "settings-tabs", role: "tablist", "aria-label": "Settings tabs", onKeyDown: g, children: Hr.map((w) => /* @__PURE__ */ i.jsx(
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
    /* @__PURE__ */ i.jsxs("div", { className: "settings-tab-content", role: "tabpanel", children: [
      t === "connection" && /* @__PURE__ */ i.jsx(iy, { settings: s, onChange: a }),
      t === "sampler" && /* @__PURE__ */ i.jsx(sy, { settings: o, onChange: u }),
      t === "persona" && /* @__PURE__ */ i.jsx(py, { settings: c, onChange: p }),
      t === "theme" && /* @__PURE__ */ i.jsx(ly, { settings: h, onChange: b }),
      e
    ] })
  ] });
}
const K3 = [["Character cards", "V1/V2/V3 JSON and PNG metadata import/export"], ["World books", "Lorebook entries, routing, activation diagnostics"], ["Presets", "OpenAI/text/context/instruct/sysprompt shapes"], ["Chats", "JSONL history import/export into Turn model"]];
function vC() {
  return /* @__PURE__ */ i.jsxs("section", { className: "drawer-panel product-assets-panel", children: [
    /* @__PURE__ */ i.jsx("h2", { children: "Assets" }),
    /* @__PURE__ */ i.jsx("div", { className: "drop-zone", children: "Drop ST assets here once host file access is wired." }),
    /* @__PURE__ */ i.jsx("div", { className: "panel-list", children: K3.map(([e, t]) => /* @__PURE__ */ i.jsxs("article", { className: "panel-row", children: [
      /* @__PURE__ */ i.jsx("strong", { children: e }),
      /* @__PURE__ */ i.jsx("span", { children: t })
    ] }, e)) })
  ] });
}
const q3 = [
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
], Y3 = {
  temperature: 0.7,
  top_p: 0.9,
  top_k: 40,
  max_tokens: 512,
  stream: !1
};
function Q3({ chat: e }) {
  const { prompt: t, request: n, sampler: r } = R.useMemo(() => {
    const a = tx(q3, e, { mode: "chat" }), o = iw(Y3), u = J0({
      model: "gpt-4o-mini",
      messages: a.messages.map((c) => ({
        role: c.role,
        content: c.content
      })),
      sampler: o
    });
    return { prompt: a, request: u, sampler: o };
  }, [e]), s = JSON.stringify(n, null, 2);
  return /* @__PURE__ */ i.jsxs("section", { className: "diag-panel diag-panel-engine", children: [
    /* @__PURE__ */ i.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ i.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/engine-core" }),
      /* @__PURE__ */ i.jsx("h2", { children: "Engine prompt & request preview" }),
      /* @__PURE__ */ i.jsxs("p", { className: "diag-panel-lede", children: [
        /* @__PURE__ */ i.jsx("code", { children: "buildPrompt" }),
        " assembles ST prompt blocks + Turn history;",
        /* @__PURE__ */ i.jsx("code", { children: "buildOpenAIChatRequest" }),
        " shapes the wire payload."
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("dl", { className: "diag-grid", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "diag-cell", children: [
        /* @__PURE__ */ i.jsx("dt", { children: "messages emitted" }),
        /* @__PURE__ */ i.jsx("dd", { className: "value-large", children: t.messages.length })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "diag-cell", children: [
        /* @__PURE__ */ i.jsx("dt", { children: "history turns" }),
        /* @__PURE__ */ i.jsx("dd", { className: "value-large", children: t.diagnostics.insertedHistoryTurns })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "diag-cell", children: [
        /* @__PURE__ */ i.jsx("dt", { children: "blocks included" }),
        /* @__PURE__ */ i.jsx("dd", { children: t.diagnostics.includedBlocks.join(" / ") })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "diag-cell", children: [
        /* @__PURE__ */ i.jsx("dt", { children: "warnings" }),
        /* @__PURE__ */ i.jsx("dd", { children: t.diagnostics.warnings.length === 0 ? "none" : t.diagnostics.warnings.join("; ") })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "diag-cell diag-cell-wide", children: [
        /* @__PURE__ */ i.jsx("dt", { children: "sampler.normalized" }),
        /* @__PURE__ */ i.jsxs("dd", { className: "value-row", children: [
          /* @__PURE__ */ i.jsxs("span", { children: [
            "temp ",
            r.temperature ?? "—"
          ] }),
          /* @__PURE__ */ i.jsxs("span", { children: [
            "top_p ",
            r.top_p ?? "—"
          ] }),
          /* @__PURE__ */ i.jsxs("span", { children: [
            "top_k ",
            r.top_k ?? "—"
          ] }),
          /* @__PURE__ */ i.jsxs("span", { children: [
            "max ",
            r.max_tokens ?? "—"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-payload", children: [
      /* @__PURE__ */ i.jsx("h3", { children: "OpenAI chat request shape" }),
      /* @__PURE__ */ i.jsx("pre", { className: "json-block", children: s }),
      /* @__PURE__ */ i.jsxs("p", { className: "diag-footnote", children: [
        "ST ",
        /* @__PURE__ */ i.jsx("code", { children: "top_k" }),
        " doesn’t cross to the OpenAI surface; engine-core surfaces that via diagnostics rather than silently dropping it."
      ] })
    ] })
  ] });
}
function X3(e, t) {
  if (typeof e != "string")
    return e;
  try {
    const n = JSON.parse(e), r = vi(n);
    if (r === void 0)
      throw new Error(`${t} must be a JSON object`);
    return r;
  } catch (n) {
    throw n instanceof SyntaxError ? new Error(`Invalid ${t}: ${n.message}`) : n;
  }
}
function Z3(e) {
  const t = e.trim();
  if (t.length === 0)
    return [];
  if (!t.includes(`
`) && gy(t)) {
    const n = JSON.parse(t);
    if (Array.isArray(n))
      return n.filter(Xn);
    const r = vi(n);
    if (r === void 0)
      throw new Error("Invalid chat history JSON: top-level value must be an object or array");
    return r;
  }
  return t.split(/\r?\n/u).map((n, r) => {
    try {
      const s = JSON.parse(n), a = vi(s);
      if (a === void 0)
        throw new Error("line is not an object");
      return a;
    } catch (s) {
      const a = s instanceof Error ? s.message : "unknown parse error";
      throw new Error(`Invalid chat history JSONL at line ${r + 1}: ${a}`);
    }
  });
}
function ah(e) {
  try {
    const t = JSON.parse(e);
    return vi(t);
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
function J3(e) {
  try {
    if (typeof Buffer < "u")
      return Buffer.from(e, "base64").toString("utf8");
  } catch {
    return;
  }
}
function xe(e, t) {
  const n = e[t];
  return typeof n == "string" ? n : void 0;
}
function gi(e, t) {
  const n = e[t];
  return typeof n == "number" && Number.isFinite(n) ? n : void 0;
}
function pr(e, t) {
  const n = e[t];
  return typeof n == "boolean" ? n : void 0;
}
function Ua(e, t) {
  return vi(e[t]);
}
function ih(e, t) {
  const n = e[t];
  if (!Array.isArray(n))
    return;
  const r = n.filter((s) => typeof s == "string");
  return r.length === n.length ? r : void 0;
}
function e1(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Xn(e) {
  return e1(e) ? Object.values(e).every(Ef) : !1;
}
function Ef(e) {
  return e === null || typeof e == "string" || typeof e == "number" || typeof e == "boolean" ? !0 : Array.isArray(e) ? e.every(Ef) : Xn(e);
}
function vi(e) {
  return Xn(e) ? e : void 0;
}
function t1(e) {
  return Ef(e) ? e : null;
}
function n1(e, t) {
  const n = {};
  for (const [r, s] of Object.entries(e))
    t.includes(r) || (n[r] = s);
  return n;
}
const Ao = [137, 80, 78, 71, 13, 10, 26, 10];
function r1(e) {
  const t = [];
  if (e instanceof Uint8Array) {
    const s = i1(e, t);
    return {
      ...oh(s.payload, s.format, t),
      preserved: { format: s.format, payload: s.payload },
      diagnostics: t
    };
  }
  const n = X3(e, "character card JSON"), r = s1(n);
  return oh(n, r, t);
}
function oh(e, t, n) {
  const r = Ua(e, "data") ?? e, s = Ua(r, "extensions") ?? Ua(e, "extensions"), a = xe(r, "name") ?? xe(e, "name");
  return (a === void 0 || a.length === 0) && n.push({ severity: "warning", message: "Character card is missing a name; using Untitled Character.", path: "name" }), {
    kind: "character_card",
    format: t,
    version: a1(e, r),
    name: a && a.length > 0 ? a : "Untitled Character",
    description: xe(r, "description") ?? xe(e, "description"),
    personality: xe(r, "personality") ?? xe(e, "personality"),
    scenario: xe(r, "scenario") ?? xe(e, "scenario"),
    first_mes: xe(r, "first_mes") ?? xe(e, "first_mes") ?? xe(r, "first_message"),
    mes_example: xe(r, "mes_example") ?? xe(e, "mes_example") ?? xe(r, "example_dialogue"),
    creator_notes: xe(r, "creator_notes") ?? xe(e, "creator_notes") ?? xe(r, "creatorcomment"),
    tags: ih(r, "tags") ?? ih(e, "tags"),
    extensions: s,
    preserved: { format: t, payload: e },
    diagnostics: n
  };
}
function s1(e) {
  const t = xe(e, "spec"), n = Ua(e, "data"), r = xe(e, "spec_version") ?? gi(e, "spec_version")?.toString() ?? (n === void 0 ? void 0 : xe(n, "spec_version") ?? gi(n, "spec_version")?.toString());
  return t?.toLowerCase().includes("chara_card_v3") || r === "3" || r?.startsWith("3.") ? "st_v3" : t?.toLowerCase().includes("chara_card_v2") || r === "2" || r?.startsWith("2.") || Ua(e, "data") !== void 0 ? "st_v2" : xe(e, "char_name") !== void 0 || xe(e, "name") !== void 0 ? "st_v1" : "unknown_json";
}
function a1(e, t) {
  const n = xe(e, "spec") ?? xe(t, "spec"), r = xe(e, "spec_version") ?? gi(e, "spec_version")?.toString() ?? xe(t, "spec_version") ?? gi(t, "spec_version")?.toString();
  if (!(n === void 0 && r === void 0))
    return { spec: n, spec_version: r };
}
function i1(e, t) {
  const n = o1(e);
  for (const r of n) {
    const s = l1(r);
    for (const a of s) {
      const o = u1(a);
      if (o !== void 0)
        return { payload: o, format: "png_st" };
    }
  }
  throw t.push({ severity: "warning", message: "PNG parsed successfully but no supported character metadata chunk was found." }), new Error("Invalid character card PNG: no SillyTavern metadata found");
}
function o1(e) {
  c1(e);
  const t = [];
  let n = Ao.length;
  for (; n + 8 <= e.length; ) {
    const r = d1(e, n), s = f1(e, n + 4, n + 8), a = n + 8, o = a + r, u = o + 4;
    if (o > e.length || u > e.length)
      throw new Error("Invalid PNG: chunk length exceeds input size");
    const c = e.subarray(a, o);
    if (s === "tEXt") {
      const p = p1(c);
      t.push({ type: s, keyword: p.keyword, text: p.text });
    } else if (s === "iTXt") {
      const p = m1(c);
      p.compressionFlag !== 0 ? t.push({ type: s, keyword: p.keyword, text: "" }) : t.push({ type: s, keyword: p.keyword, text: p.text });
    } else s === "zTXt" && t.push({ type: s, keyword: cl(c).value, text: "" });
    if (n = u, s === "IEND")
      break;
  }
  return t;
}
function l1(e) {
  const t = [], n = e.keyword?.toLowerCase();
  (n === "chara" || n === "ccv3" || n === "character" || n === "metadata") && t.push(e.text);
  const r = e.text.trim();
  return (gy(r) || vy(r)) && t.push(r), t;
}
function u1(e) {
  const t = ah(e);
  if (t !== void 0)
    return t;
  if (vy(e)) {
    const n = J3(e);
    if (n !== void 0)
      return ah(n);
  }
}
function c1(e) {
  if (e.length < Ao.length)
    throw new Error("Invalid PNG: input is too short");
  for (let t = 0; t < Ao.length; t += 1)
    if (e[t] !== Ao[t])
      throw new Error("Invalid PNG: bad signature");
}
function d1(e, t) {
  return (e[t] ?? 0) * 16777216 + ((e[t + 1] ?? 0) << 16) + ((e[t + 2] ?? 0) << 8) + (e[t + 3] ?? 0);
}
function f1(e, t, n) {
  return String.fromCharCode(...e.subarray(t, n));
}
function p1(e) {
  const t = cl(e);
  return { keyword: t.value, text: _y(e.subarray(t.nextOffset)) };
}
function m1(e) {
  const t = cl(e), n = e[t.nextOffset] ?? 0;
  let r = t.nextOffset + 2;
  const s = cl(e.subarray(r));
  r += s.nextOffset;
  const a = h1(e.subarray(r));
  return r += a.nextOffset, { keyword: t.value, compressionFlag: n, text: yy(e.subarray(r)) };
}
function cl(e) {
  const t = e.indexOf(0), n = t === -1 ? e.length : t;
  return { value: _y(e.subarray(0, n)), nextOffset: t === -1 ? e.length : t + 1 };
}
function h1(e) {
  const t = e.indexOf(0), n = t === -1 ? e.length : t;
  return { value: yy(e.subarray(0, n)), nextOffset: t === -1 ? e.length : t + 1 };
}
function _y(e) {
  return new TextDecoder("latin1").decode(e);
}
function yy(e) {
  return new TextDecoder().decode(e);
}
function g1(e) {
  const t = [], n = typeof e == "string" ? Z3(e) : e, s = v1(n, t).filter((o) => !pr(o, "is_deleted") && !pr(o, "deleted")).map((o, u) => _1(o, u, t));
  return {
    kind: "chat_history",
    chat: {
      id: ad("chat", 0),
      meta: {
        title: Xn(n) ? xe(n, "name") ?? xe(n, "title") : void 0,
        character_id: Xn(n) ? xe(n, "character_id") : void 0,
        group_id: Xn(n) ? xe(n, "group_id") : void 0,
        persona_id: Xn(n) ? xe(n, "persona_id") : void 0,
        source_format: "sillytavern_jsonl"
      },
      turns: s
    },
    preserved: { format: "sillytavern_chat", payload: t1(n) },
    diagnostics: t
  };
}
function v1(e, t) {
  let n;
  return Xn(e) ? n = e.messages ?? e.chat ?? e.data : n = e, Array.isArray(n) ? n.filter((r, s) => {
    const a = Xn(r);
    return a || t.push({ severity: "warning", message: "Skipping non-object chat message.", path: `messages.${s}` }), a;
  }) : (t.push({ severity: "warning", message: "Chat payload has no message array; returning empty chat." }), []);
}
function _1(e, t, n) {
  const r = pr(e, "is_user") ?? !1, a = pr(e, "is_system") ?? !1 ? "system" : r ? "user" : "assistant", o = xe(e, "mes") ?? xe(e, "text") ?? xe(e, "content") ?? "";
  o.length === 0 && n.push({ severity: "warning", message: "Chat message has empty text.", path: `messages.${t}.mes` });
  const u = y1(xe(e, "send_date")) ?? gi(e, "created_at") ?? 0, c = {
    id: ad("variant", t),
    subs: [{ kind: "text", text: o }],
    meta: { raw: n1(e, ["mes", "text", "content"]) },
    created_at: u
  };
  return {
    id: ad("turn", t),
    index: t,
    role: a,
    speaker: { name: xe(e, "name") ?? a, kind: a === "assistant" ? "character" : a === "user" ? "user" : "system" },
    variants: [c],
    active_variant: 0,
    source: "imported",
    hidden: pr(e, "is_hidden") ?? pr(e, "hidden"),
    created_at: u,
    deleted: pr(e, "deleted") ?? pr(e, "is_deleted")
  };
}
function y1(e) {
  if (e === void 0)
    return;
  const t = Date.parse(e);
  return Number.isFinite(t) ? t : void 0;
}
function ad(e, t) {
  return `${e}_${t.toString().padStart(6, "0")}`;
}
const x1 = {
  spec: "chara_card_v2",
  spec_version: "2.0",
  data: {
    name: "Aria",
    description: "Meticulous executive assistant. Calendar-first, agenda-driven.",
    personality: "Precise, warm, allergic to vague action items.",
    first_mes: "Morning. What are we trying to ship today?",
    tags: ["assistant", "planning"]
  }
}, w1 = [
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
function b1() {
  const { card: e, history: t } = R.useMemo(() => ({
    card: r1(x1),
    history: g1(w1)
  }), []);
  return /* @__PURE__ */ i.jsxs("section", { className: "diag-panel diag-panel-importers", children: [
    /* @__PURE__ */ i.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ i.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/importers" }),
      /* @__PURE__ */ i.jsx("h2", { children: "SillyTavern asset roundtrip" }),
      /* @__PURE__ */ i.jsxs("p", { className: "diag-panel-lede", children: [
        "Two tiny inline fixtures fed through ",
        /* @__PURE__ */ i.jsx("code", { children: "importCharacterCard" }),
        " and",
        /* @__PURE__ */ i.jsx("code", { children: "importChatHistory" }),
        "; output is the same Turn / Chat shape the renderer above consumes."
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("dl", { className: "diag-grid", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "diag-cell", children: [
        /* @__PURE__ */ i.jsx("dt", { children: "card.format" }),
        /* @__PURE__ */ i.jsx("dd", { children: /* @__PURE__ */ i.jsx("code", { children: e.format }) })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "diag-cell", children: [
        /* @__PURE__ */ i.jsx("dt", { children: "card.name" }),
        /* @__PURE__ */ i.jsx("dd", { children: e.name })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "diag-cell", children: [
        /* @__PURE__ */ i.jsx("dt", { children: "chat.turns" }),
        /* @__PURE__ */ i.jsx("dd", { className: "value-large", children: t.chat.turns.length })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "diag-cell", children: [
        /* @__PURE__ */ i.jsx("dt", { children: "source_format" }),
        /* @__PURE__ */ i.jsx("dd", { children: /* @__PURE__ */ i.jsx("code", { children: t.chat.meta.source_format ?? "—" }) })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "diag-cell diag-cell-full", children: [
        /* @__PURE__ */ i.jsx("dt", { children: "diagnostics" }),
        /* @__PURE__ */ i.jsx("dd", { children: e.diagnostics.length + t.diagnostics.length === 0 ? "no warnings" : [...e.diagnostics, ...t.diagnostics].map((n) => n.message).join("; ") })
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("p", { className: "diag-footnote", children: [
      "Imported turns carry ",
      /* @__PURE__ */ i.jsx("code", { children: "source: ‘imported’" }),
      " and a",
      /* @__PURE__ */ i.jsx("code", { children: "preserved" }),
      " payload so the original ST blob round-trips losslessly."
    ] })
  ] });
}
const S1 = {
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
function k1(e, t) {
  const n = e.getContext();
  return R.useMemo(() => {
    const r = bw({
      chat: t,
      book: S1,
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
    }), s = Wx({
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
    }), a = Ia(
      "Hello {{char}}, it is {{time}} and {{user}} needs help.",
      {
        user: n.name1,
        char: n.name2
      }
    ).text;
    return { wi: r, critical: s, macroPreview: a };
  }, [t, n.name1, n.name2]);
}
function N1({ runtime: e, chat: t }) {
  const { wi: n, critical: r, macroPreview: s } = k1(e, t);
  return /* @__PURE__ */ i.jsxs("section", { className: "diag-panel diag-panel-prompt-critical", children: [
    /* @__PURE__ */ i.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ i.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/engine-core" }),
      /* @__PURE__ */ i.jsx("h2", { children: "Prompt-critical & World Info" }),
      /* @__PURE__ */ i.jsxs("p", { className: "diag-panel-lede", children: [
        /* @__PURE__ */ i.jsx("code", { children: "evaluateWorldInfo" }),
        " scans the live Chat;",
        " ",
        /* @__PURE__ */ i.jsx("code", { children: "buildPromptCriticalBlocks" }),
        " assembles character fields, instruct, author notes and WI buckets into ordered system blocks. Macro substitution is traced per field."
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("dl", { className: "diag-grid", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "diag-cell", children: [
        /* @__PURE__ */ i.jsx("dt", { children: "WI activated" }),
        /* @__PURE__ */ i.jsx("dd", { className: "value-large", children: n.activated.length })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "diag-cell", children: [
        /* @__PURE__ */ i.jsx("dt", { children: "WI skipped" }),
        /* @__PURE__ */ i.jsx("dd", { className: "value-large", children: n.skipped.length })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "diag-cell diag-cell-wide", children: [
        /* @__PURE__ */ i.jsx("dt", { children: "prompt manager" }),
        /* @__PURE__ */ i.jsx("dd", { children: r.diagnostics.markerMapping.map((a) => a.promptIdentifier).join(" / ") || "legacy order" })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "diag-cell diag-cell-wide", children: [
        /* @__PURE__ */ i.jsx("dt", { children: "blocks included" }),
        /* @__PURE__ */ i.jsx("dd", { children: r.diagnostics.includedBlocks.join(" / ") || "—" })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "diag-cell diag-cell-wide", children: [
        /* @__PURE__ */ i.jsx("dt", { children: "skipped fields" }),
        /* @__PURE__ */ i.jsx("dd", { children: r.diagnostics.skippedFields.join(" / ") || "—" })
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsx("h3", { children: "PromptManager marker mapping" }),
      r.diagnostics.markerMapping.length === 0 ? /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "No PromptManager mapping; using legacy fallback order." }) : /* @__PURE__ */ i.jsx("ul", { className: "diag-list", children: r.diagnostics.markerMapping.map((a, o) => /* @__PURE__ */ i.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-key", children: a.promptIdentifier }),
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-pos", children: a.marker ? "marker" : a.source }),
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-text", children: String(a.blockIdentifier) }),
        /* @__PURE__ */ i.jsxs("span", { className: "diag-list-meta", children: [
          "order ",
          a.order
        ] })
      ] }, `${a.promptIdentifier}-${o}`)) })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsx("h3", { children: "World Info activated entries" }),
      n.activated.length === 0 ? /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "No activated entries for the current scan depth." }) : /* @__PURE__ */ i.jsx("ul", { className: "diag-list", children: n.activated.map((a) => /* @__PURE__ */ i.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-key", children: a.id }),
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-pos", children: a.position }),
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-text", children: a.content }),
        /* @__PURE__ */ i.jsxs("span", { className: "diag-list-meta", children: [
          "keys: ",
          a.matchedKeys.join(", ") || "—"
        ] })
      ] }, a.id)) })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsx("h3", { children: "World Info skipped entries" }),
      n.skipped.length === 0 ? /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "Nothing skipped." }) : /* @__PURE__ */ i.jsx("ul", { className: "diag-list", children: n.skipped.map((a) => /* @__PURE__ */ i.jsxs("li", { className: "diag-list-item diag-list-item-dim", children: [
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-key", children: a.id }),
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-reason", children: a.reason })
      ] }, a.id)) })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsx("h3", { children: "WI buckets" }),
      /* @__PURE__ */ i.jsx("ul", { className: "diag-list", children: ["before", "after", "atDepth", "ANTop", "ANBottom", "outlet"].map((a) => /* @__PURE__ */ i.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-key", children: a }),
        /* @__PURE__ */ i.jsxs("span", { className: "diag-list-count", children: [
          n.buckets[a].length,
          " entr",
          n.buckets[a].length === 1 ? "y" : "ies"
        ] }),
        n.buckets[a].map((o, u) => /* @__PURE__ */ i.jsx("span", { className: "diag-list-text", children: o }, u))
      ] }, a)) })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsx("h3", { children: "WI routing trace" }),
      /* @__PURE__ */ i.jsx("ul", { className: "diag-list", children: n.diagnostics.routingTrace.map((a, o) => /* @__PURE__ */ i.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-key", children: a.entryId }),
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-pos", children: a.bucket }),
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-text", children: a.inserted ? "inserted into prompt-critical bucket" : a.note || "diagnostic route only" }),
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-meta", children: a.depth !== void 0 ? `depth ${a.depth}` : a.outletName ? `outlet ${a.outletName}` : a.position })
      ] }, `${a.entryId}-${o}`)) })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection diag-split", children: [
      /* @__PURE__ */ i.jsxs("div", { children: [
        /* @__PURE__ */ i.jsx("h3", { children: "atDepth / EM / outlet" }),
        /* @__PURE__ */ i.jsxs("ul", { className: "diag-list", children: [
          n.buckets.depthEntries.map((a) => /* @__PURE__ */ i.jsxs("li", { className: "diag-list-item", children: [
            /* @__PURE__ */ i.jsxs("span", { className: "diag-list-key", children: [
              "depth ",
              a.depth
            ] }),
            /* @__PURE__ */ i.jsx("span", { className: "diag-list-pos", children: a.role }),
            /* @__PURE__ */ i.jsx("span", { className: "diag-list-text", children: a.content })
          ] }, `${a.depth}-${a.role}`)),
          n.buckets.em.map((a, o) => /* @__PURE__ */ i.jsxs("li", { className: "diag-list-item", children: [
            /* @__PURE__ */ i.jsxs("span", { className: "diag-list-key", children: [
              "EM ",
              a.position
            ] }),
            /* @__PURE__ */ i.jsx("span", { className: "diag-list-text", children: a.content })
          ] }, `em-${o}`)),
          Object.entries(n.buckets.outlets).map(([a, o]) => /* @__PURE__ */ i.jsxs("li", { className: "diag-list-item", children: [
            /* @__PURE__ */ i.jsxs("span", { className: "diag-list-key", children: [
              "outlet ",
              a
            ] }),
            /* @__PURE__ */ i.jsx("span", { className: "diag-list-text", children: o.content.join(" / ") })
          ] }, a))
        ] })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { children: [
        /* @__PURE__ */ i.jsx("h3", { children: "Author Note patch" }),
        /* @__PURE__ */ i.jsx("pre", { className: "diag-code-block", children: n.buckets.anPatch.patched || "—" })
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsx("h3", { children: "WI advanced trace" }),
      /* @__PURE__ */ i.jsx("ul", { className: "diag-list", children: n.diagnostics.activationTrace.filter((a) => ["probability_roll", "probability_failed", "group_candidate", "group_winner", "group_loser", "group_scoring_loser", "sticky_active", "cooldown_active", "delay_active"].includes(a.code)).slice(0, 12).map((a, o) => /* @__PURE__ */ i.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-key", children: a.code }),
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-pos", children: a.entryId }),
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-text", children: a.reason }),
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-meta", children: a.group ? `group ${a.group}` : a.roll !== void 0 ? `roll ${a.roll.toFixed(2)}` : "" })
      ] }, `${a.entryId}-${a.code}-${o}`)) }),
      /* @__PURE__ */ i.jsxs("p", { className: "diag-footnote", children: [
        "nextState sticky: ",
        n.nextState.sticky?.length ?? 0,
        "; cooldown: ",
        n.nextState.cooldown?.length ?? 0
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsx("h3", { children: "Prompt-critical blocks" }),
      /* @__PURE__ */ i.jsx("ul", { className: "diag-list", children: r.blocks.map((a) => /* @__PURE__ */ i.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-key", children: String(a.identifier) }),
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-pos", children: a.role }),
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-text", children: a.content })
      ] }, a.identifier)) })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsx("h3", { children: "Macro trace" }),
      r.diagnostics.macroTrace.length === 0 ? /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "No macros substituted in prompt-critical fields." }) : /* @__PURE__ */ i.jsx("ul", { className: "diag-list", children: r.diagnostics.macroTrace.map((a, o) => /* @__PURE__ */ i.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-key", children: a.name }),
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-pos", children: a.source }),
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-text", children: a.preview })
      ] }, `${a.name}-${o}`)) }),
      /* @__PURE__ */ i.jsxs("p", { className: "diag-footnote", children: [
        "Quick macro preview: ",
        /* @__PURE__ */ i.jsx("code", { children: s })
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsx("h3", { children: "Diagnostics warnings" }),
      [...n.diagnostics.warnings, ...r.diagnostics.warnings].length === 0 ? /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "No warnings." }) : /* @__PURE__ */ i.jsx("ul", { className: "diag-list", children: [...n.diagnostics.warnings, ...r.diagnostics.warnings].map((a, o) => /* @__PURE__ */ i.jsx("li", { className: "diag-list-item diag-list-item-dim", children: /* @__PURE__ */ i.jsx("span", { className: "diag-list-text", children: a }) }, o)) }),
      r.diagnostics.knownDeltas.length > 0 && /* @__PURE__ */ i.jsxs("p", { className: "diag-footnote", children: [
        "Known deltas: ",
        r.diagnostics.knownDeltas.join(" / ")
      ] })
    ] })
  ] });
}
const j1 = `/setvar mood focused
/gen hello world`;
function E1({ runtime: e }) {
  const t = e.getContext(), [n, r] = R.useState(j1), [s, a] = R.useState(null), o = R.useCallback(() => {
    const h = t.executeSlashCommands(n);
    a(h);
  }, [n, t]), u = R.useCallback(
    (h) => {
      h.key === "Enter" && (h.metaKey || h.ctrlKey) && o();
    },
    [o]
  ), c = t.slashCommands(), p = t.slashDiagnostics;
  return /* @__PURE__ */ i.jsxs("section", { className: "diag-panel diag-panel-slash", children: [
    /* @__PURE__ */ i.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ i.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/st-compat · slash" }),
      /* @__PURE__ */ i.jsx("h2", { children: "Slash diagnostics" }),
      /* @__PURE__ */ i.jsxs("p", { className: "diag-panel-lede", children: [
        "A thin diagnostic slice over the live ST context slash host. Input is executed through ",
        /* @__PURE__ */ i.jsx("code", { children: "executeSlashCommands" }),
        "; results, variables, registered commands and diagnostics are surfaced below."
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "slash-input-block", children: [
      /* @__PURE__ */ i.jsx(
        "textarea",
        {
          className: "slash-input",
          rows: 3,
          value: n,
          onChange: (h) => r(h.target.value),
          onKeyDown: u,
          placeholder: "Type slash commands, one per line…",
          "aria-label": "Slash command input"
        }
      ),
      /* @__PURE__ */ i.jsx("button", { type: "button", className: "chat-button chat-button-send", onClick: o, children: "Execute" })
    ] }),
    /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "Press Ctrl/Cmd + Enter to run." }),
    s && /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsx("h3", { children: "Result" }),
      /* @__PURE__ */ i.jsxs("dl", { className: "diag-grid", children: [
        /* @__PURE__ */ i.jsxs("div", { className: "diag-cell", children: [
          /* @__PURE__ */ i.jsx("dt", { children: "ok" }),
          /* @__PURE__ */ i.jsx("dd", { className: s.ok ? "value-ok" : "value-error", children: s.ok ? "true" : "false" })
        ] }),
        /* @__PURE__ */ i.jsxs("div", { className: "diag-cell", children: [
          /* @__PURE__ */ i.jsx("dt", { children: "executions" }),
          /* @__PURE__ */ i.jsx("dd", { className: "value-large", children: s.executions.length })
        ] })
      ] }),
      /* @__PURE__ */ i.jsx("h3", { className: "slash-subheading", children: "Execution log" }),
      s.executions.length === 0 ? /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "No commands executed." }) : /* @__PURE__ */ i.jsx("ul", { className: "slash-execution-list", children: s.executions.map((h, b) => /* @__PURE__ */ i.jsxs("li", { className: "slash-execution-item", children: [
        /* @__PURE__ */ i.jsxs("div", { className: "slash-execution-header", children: [
          /* @__PURE__ */ i.jsxs("span", { className: "slash-name", children: [
            "/",
            h.name
          ] }),
          /* @__PURE__ */ i.jsx("span", { className: h.ok ? "slash-ok" : "slash-error", children: h.ok ? "ok" : "error" })
        ] }),
        /* @__PURE__ */ i.jsx("div", { className: "slash-raw", children: h.raw }),
        h.output && /* @__PURE__ */ i.jsx("div", { className: "slash-output", children: h.output }),
        h.diagnostics.length > 0 && /* @__PURE__ */ i.jsx("ul", { className: "slash-diag-list", children: h.diagnostics.map((g, w) => /* @__PURE__ */ i.jsxs("li", { className: "slash-diag-item", children: [
          /* @__PURE__ */ i.jsx("span", { className: "slash-diag-code", children: g.code }),
          /* @__PURE__ */ i.jsx("span", { children: g.message })
        ] }, w)) })
      ] }, b)) }),
      s.output && /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
        /* @__PURE__ */ i.jsx("h3", { className: "slash-subheading", children: "Combined output" }),
        /* @__PURE__ */ i.jsx("pre", { className: "json-block", children: s.output })
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsx("h3", { children: "Variables" }),
      t.variables.size === 0 ? /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "No variables set yet — run /setvar to populate." }) : /* @__PURE__ */ i.jsx("ul", { className: "slash-execution-list", children: Array.from(t.variables.entries()).map(([h, b]) => /* @__PURE__ */ i.jsxs("li", { className: "slash-execution-item", children: [
        /* @__PURE__ */ i.jsx("span", { className: "slash-name", children: h }),
        /* @__PURE__ */ i.jsx("span", { className: "slash-output", children: b })
      ] }, h)) })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsxs("h3", { children: [
        "Registered commands (",
        c.length,
        ")"
      ] }),
      /* @__PURE__ */ i.jsx("ul", { className: "diag-list", children: c.map((h) => /* @__PURE__ */ i.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ i.jsxs("span", { className: "diag-list-key", children: [
          "/",
          h.name
        ] }),
        h.aliases.length > 0 && /* @__PURE__ */ i.jsxs("span", { className: "diag-list-meta", children: [
          "aliases: ",
          h.aliases.join(", ")
        ] })
      ] }, h.name)) })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsxs("h3", { children: [
        "Host diagnostics (",
        p.length,
        ")"
      ] }),
      p.length === 0 ? /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "No diagnostics captured yet." }) : /* @__PURE__ */ i.jsx("ul", { className: "slash-execution-list", children: p.map((h, b) => /* @__PURE__ */ i.jsxs("li", { className: "slash-execution-item", children: [
        /* @__PURE__ */ i.jsx("span", { className: "slash-diag-code", children: h.code }),
        /* @__PURE__ */ i.jsx("span", { children: h.message }),
        h.command && /* @__PURE__ */ i.jsxs("span", { className: "diag-list-meta", children: [
          "/",
          h.command
        ] })
      ] }, b)) })
    ] })
  ] });
}
const C1 = [
  "MESSAGE_SENT",
  "MESSAGE_RECEIVED",
  "GENERATION_STARTED",
  "STREAM_TOKEN_RECEIVED",
  "GENERATION_ENDED"
];
function T1({ runtime: e }) {
  const t = e.getContext(), n = t.chat[0], r = typeof n?.mes == "string" ? n.mes : "", s = r.length > 140 ? `${r.slice(0, 137)}…` : r, [a, o] = R.useState([]), u = R.useRef(/* @__PURE__ */ new Map());
  return R.useEffect(() => {
    const c = t.eventSource, p = C1.map((h) => {
      const b = t.event_types[h];
      return b ? [h, b] : void 0;
    }).filter((h) => h !== void 0);
    return p.forEach(([h, b]) => {
      const g = (...w) => {
        o((E) => {
          const A = JSON.stringify(w).slice(0, 180);
          return [
            { type: h, time: (/* @__PURE__ */ new Date()).toLocaleTimeString(), payload: A },
            ...E
          ].slice(0, 10);
        });
      };
      u.current.set(b, g), c.on(b, g);
    }), () => {
      p.forEach(([h, b]) => {
        const g = u.current.get(b);
        g && (c.off(b, g), u.current.delete(b));
      });
    };
  }, [t.eventSource, t.event_types]), /* @__PURE__ */ i.jsxs("section", { className: "diag-panel diag-panel-st", children: [
    /* @__PURE__ */ i.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ i.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/st-compat" }),
      /* @__PURE__ */ i.jsx("h2", { children: "ST compatibility projection" }),
      /* @__PURE__ */ i.jsxs("p", { className: "diag-panel-lede", children: [
        "The Turn-shaped chat projected through the legacy SillyTavern",
        " ",
        /* @__PURE__ */ i.jsx("code", { children: "chat[]" }),
        " / ",
        /* @__PURE__ */ i.jsx("code", { children: "eventSource" }),
        " / ",
        /* @__PURE__ */ i.jsx("code", { children: "getContext()" }),
        " ",
        "surface. This panel is wired to a live runtime — addOneMessage, Generate, and proxy edits are all functional contract-backed operations."
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("dl", { className: "diag-grid", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "diag-cell diag-cell-wide", children: [
        /* @__PURE__ */ i.jsx("dt", { children: "chat.length" }),
        /* @__PURE__ */ i.jsx("dd", { className: "value-large", children: t.chat.length })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "diag-cell diag-cell-wide", children: [
        /* @__PURE__ */ i.jsx("dt", { children: "chat[0].is_user" }),
        /* @__PURE__ */ i.jsx("dd", { children: String(n?.is_user ?? !1) })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "diag-cell diag-cell-full", children: [
        /* @__PURE__ */ i.jsx("dt", { children: "chat[0].mes" }),
        /* @__PURE__ */ i.jsxs("dd", { className: "value-quote", children: [
          "“",
          s,
          "”"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-events", children: [
      /* @__PURE__ */ i.jsx("h3", { children: "Recent events" }),
      a.length === 0 ? /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "No events yet — send a message or run Fake Generate to populate." }) : /* @__PURE__ */ i.jsx("ul", { className: "event-log", children: a.map((c, p) => /* @__PURE__ */ i.jsxs("li", { className: "event-log-item", children: [
        /* @__PURE__ */ i.jsx("span", { className: "event-log-time", children: c.time }),
        /* @__PURE__ */ i.jsx("span", { className: "event-log-type", children: c.type }),
        /* @__PURE__ */ i.jsx("span", { className: "event-log-payload", children: c.payload })
      ] }, `${c.type}-${c.time}-${p}`)) }),
      /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "Listening to MESSAGE_SENT, MESSAGE_RECEIVED, GENERATION_STARTED, STREAM_TOKEN_RECEIVED, GENERATION_ENDED via eventSource." })
    ] })
  ] });
}
function I1() {
  return /* @__PURE__ */ i.jsxs("section", { className: "diag-panel diag-panel-prompt-manager", children: [
    /* @__PURE__ */ i.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ i.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }),
      /* @__PURE__ */ i.jsx("h2", { children: "PromptManager inspector" })
    ] }),
    /* @__PURE__ */ i.jsxs("p", { className: "diag-panel-lede", children: [
      "No compile result yet. The PromptManager inspector surfaces the effective prompt order after compilation — including marker resolution, override application, and generation-trigger filtering. Once the host bridge provides a ",
      /* @__PURE__ */ i.jsx("code", { children: "result" }),
      " prop, ordered prompts, overrides, and diagnostics will appear here."
    ] })
  ] });
}
function A1({ source: e }) {
  const t = e === "input" ? "diag-badge diag-badge-input" : e === "default" ? "diag-badge diag-badge-default" : e === "anchor" ? "diag-badge diag-badge-anchor" : "diag-badge", n = e ?? "unknown";
  return /* @__PURE__ */ i.jsx("span", { className: t, children: n });
}
function P1({
  result: e
}) {
  if (!e) return /* @__PURE__ */ i.jsx(I1, {});
  const { prompts: t, collection: n, diagnostics: r } = e, s = n?.overriddenPrompts ?? [], a = n?.triggerSkipped ?? [], o = r?.warnings ?? [], u = [];
  if (t)
    for (const c of t)
      c.source === "anchor" && c.enabled === !1 && u.push(c.identifier);
  return /* @__PURE__ */ i.jsxs("section", { className: "diag-panel diag-panel-prompt-manager", children: [
    /* @__PURE__ */ i.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ i.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }),
      /* @__PURE__ */ i.jsx("h2", { children: "PromptManager inspector" }),
      /* @__PURE__ */ i.jsx("p", { className: "diag-panel-lede", children: "Compiled prompt order from ST’s PromptManager. Each entry shows identifier, role, marker badge, and source category. Disabled-but-anchored prompts are highlighted; overridden prompts appear with their status." })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsxs("h3", { children: [
        "Effective prompt order",
        t ? /* @__PURE__ */ i.jsxs("span", { className: "diag-list-count", children: [
          " (",
          t.length,
          ")"
        ] }) : null
      ] }),
      !t || t.length === 0 ? /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "No prompts in the compiled order." }) : /* @__PURE__ */ i.jsx("ul", { className: "diag-list", role: "list", "aria-label": "Effective prompt order", children: t.map((c, p) => {
        const h = c.source === "anchor" && c.enabled === !1, b = a.includes(c.identifier), g = [
          "diag-list-item",
          h ? "diag-highlight" : "",
          b ? "diag-trigger-skipped" : ""
        ].filter(Boolean).join(" ");
        return /* @__PURE__ */ i.jsxs("li", { className: g, children: [
          /* @__PURE__ */ i.jsx("span", { className: "diag-list-key", children: c.identifier }),
          c.role ? /* @__PURE__ */ i.jsx("span", { className: "diag-list-pos", children: c.role }) : null,
          c.marker ? /* @__PURE__ */ i.jsx("span", { className: "diag-badge diag-badge-marker", children: "marker" }) : null,
          /* @__PURE__ */ i.jsx(A1, { source: c.source }),
          /* @__PURE__ */ i.jsx("span", { className: "diag-list-text", children: c.content ? c.content.length > 80 ? `${c.content.slice(0, 77)}…` : c.content : "(empty)" }),
          h ? /* @__PURE__ */ i.jsx("span", { className: "diag-list-reason", children: "disabled anchor" }) : null,
          b ? /* @__PURE__ */ i.jsx("span", { className: "diag-list-meta", children: "triggerSkipped" }) : null
        ] }, c.identifier ?? p);
      }) })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsxs("h3", { children: [
        "Override status",
        s.length > 0 ? /* @__PURE__ */ i.jsxs("span", { className: "diag-list-count", children: [
          " (",
          s.length,
          ")"
        ] }) : null
      ] }),
      s.length === 0 ? /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "No prompt overrides applied." }) : /* @__PURE__ */ i.jsx("ul", { className: "diag-list", role: "list", "aria-label": "Prompt overrides", children: s.map((c, p) => /* @__PURE__ */ i.jsxs(
        "li",
        {
          className: `diag-list-item${c.status === "blocked" ? " diag-prompt-blocked" : ""}`,
          children: [
            /* @__PURE__ */ i.jsx("span", { className: "diag-list-key", children: c.identifier }),
            /* @__PURE__ */ i.jsx(
              "span",
              {
                className: c.status === "applied" ? "diag-list-pos" : "diag-list-reason",
                children: c.status
              }
            ),
            c.reason ? /* @__PURE__ */ i.jsx("span", { className: "diag-list-text", children: c.reason }) : null
          ]
        },
        `${c.identifier}-${p}`
      )) })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsxs("h3", { children: [
        "Generation trigger filter",
        a.length > 0 ? /* @__PURE__ */ i.jsxs("span", { className: "diag-list-count", children: [
          " (",
          a.length,
          ")"
        ] }) : null
      ] }),
      a.length === 0 ? /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "No prompts were skipped by the generation trigger filter." }) : /* @__PURE__ */ i.jsx("ul", { className: "diag-list", role: "list", "aria-label": "Trigger-skipped prompts", children: a.map((c) => /* @__PURE__ */ i.jsxs("li", { className: "diag-list-item diag-list-item-dim", children: [
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-key", children: c }),
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-reason", children: "triggerSkipped" })
      ] }, c)) })
    ] }),
    o.length > 0 ? /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsx("h3", { children: "Warnings" }),
      /* @__PURE__ */ i.jsx("ul", { className: "diag-list", role: "list", "aria-label": "Diagnostic warnings", children: o.map((c, p) => /* @__PURE__ */ i.jsx("li", { className: "diag-list-item diag-list-item-dim", children: /* @__PURE__ */ i.jsx("span", { className: "diag-list-text", children: c }) }, p)) })
    ] }) : null
  ] });
}
const R1 = {
  before: "Before",
  after: "After",
  ANTop: "AN Top",
  ANBottom: "AN Bottom",
  atDepth: "At Depth",
  EM: "EM"
};
function M1() {
  return /* @__PURE__ */ i.jsxs("section", { className: "diag-panel diag-panel-world-info", children: [
    /* @__PURE__ */ i.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ i.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }),
      /* @__PURE__ */ i.jsx("h2", { children: "World Info inspector" })
    ] }),
    /* @__PURE__ */ i.jsxs("p", { className: "diag-panel-lede", children: [
      "No routing result yet. The World Info inspector displays activated entries grouped by bucket (before, after, ANTop, ANBottom, atDepth, EM, outlets), author note patch breakdown, and outlet summaries. Once the host bridge provides a ",
      /* @__PURE__ */ i.jsx("code", { children: "result" }),
      " prop, the full routing output will appear here."
    ] })
  ] });
}
function ws(e, t = 120) {
  return e.length <= t ? e : `${e.slice(0, t - 3)}…`;
}
function D1({
  result: e
}) {
  if (!e) return /* @__PURE__ */ i.jsx(M1, {});
  const { buckets: t, anPatch: n } = e, r = [
    "before",
    "after",
    "ANTop",
    "ANBottom",
    "EM"
  ];
  return /* @__PURE__ */ i.jsxs("section", { className: "diag-panel diag-panel-world-info", children: [
    /* @__PURE__ */ i.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ i.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }),
      /* @__PURE__ */ i.jsx("h2", { children: "World Info inspector" }),
      /* @__PURE__ */ i.jsx("p", { className: "diag-panel-lede", children: "Routed World Info entries grouped by insertion bucket. Each entry shows its order and truncated content preview. Author note patches detail how AN content is assembled from top, original, and bottom fragments." })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsx("h3", { children: "Activated entries by bucket" }),
      /* @__PURE__ */ i.jsxs("ul", { className: "diag-bucket-list", role: "list", "aria-label": "World Info buckets", children: [
        r.map((s) => {
          const a = t[s];
          if (!a || a.length === 0) return null;
          const o = R1[s] ?? s, u = a.length;
          return /* @__PURE__ */ i.jsxs("details", { className: "diag-bucket-item", open: !0, children: [
            /* @__PURE__ */ i.jsxs("summary", { className: "diag-bucket-header", role: "button", "aria-label": `${o} bucket`, children: [
              o,
              /* @__PURE__ */ i.jsxs("span", { className: "diag-bucket-count", children: [
                u,
                " entr",
                u === 1 ? "y" : "ies"
              ] })
            ] }),
            /* @__PURE__ */ i.jsx("div", { className: "diag-bucket-body", children: /* @__PURE__ */ i.jsx("ul", { className: "diag-list", role: "list", "aria-label": `${o} entries`, children: a.map((c, p) => /* @__PURE__ */ i.jsxs("li", { className: "diag-list-item", children: [
              /* @__PURE__ */ i.jsx("span", { className: "diag-list-key", children: c.id }),
              /* @__PURE__ */ i.jsxs("span", { className: "diag-list-pos", children: [
                "order ",
                c.order
              ] }),
              /* @__PURE__ */ i.jsx("span", { className: "diag-list-text", children: ws(c.content) })
            ] }, c.id ?? p)) }) })
          ] }, s);
        }),
        t.outlets && Object.keys(t.outlets).length > 0 ? Object.entries(t.outlets).map(([s, a]) => {
          const o = a.entries.length;
          return /* @__PURE__ */ i.jsxs("details", { className: "diag-bucket-item", open: !0, children: [
            /* @__PURE__ */ i.jsxs("summary", { className: "diag-bucket-header", role: "button", "aria-label": `Outlet ${s}`, children: [
              "outlet: ",
              s,
              /* @__PURE__ */ i.jsxs("span", { className: "diag-bucket-count", children: [
                o,
                " entr",
                o === 1 ? "y" : "ies"
              ] })
            ] }),
            /* @__PURE__ */ i.jsx("div", { className: "diag-bucket-body", children: /* @__PURE__ */ i.jsx("ul", { className: "diag-list", role: "list", "aria-label": `Outlet ${s} entries`, children: a.entries.map((u, c) => /* @__PURE__ */ i.jsxs("li", { className: "diag-list-item", children: [
              /* @__PURE__ */ i.jsx("span", { className: "diag-list-key", children: u.id }),
              /* @__PURE__ */ i.jsxs("span", { className: "diag-list-pos", children: [
                "order ",
                u.order
              ] }),
              /* @__PURE__ */ i.jsx("span", { className: "diag-list-text", children: ws(u.content) })
            ] }, u.id ?? c)) }) })
          ] }, `outlet-${s}`);
        }) : /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "No outlet entries routed." }),
        t.atDepth && t.atDepth.length > 0 ? null : /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "No atDepth entries routed." })
      ] })
    ] }),
    n ? /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsx("h3", { children: "Author note patch" }),
      /* @__PURE__ */ i.jsxs("div", { className: "diag-an-patch", "aria-label": "Author note patch breakdown", children: [
        /* @__PURE__ */ i.jsxs("div", { className: "diag-an-patch-row", children: [
          /* @__PURE__ */ i.jsx("span", { className: "diag-an-patch-label", children: "top" }),
          /* @__PURE__ */ i.jsx("span", { className: "diag-list-text", children: ws(n.top, 80) })
        ] }),
        /* @__PURE__ */ i.jsxs("div", { className: "diag-an-patch-row", children: [
          /* @__PURE__ */ i.jsx("span", { className: "diag-an-patch-label", children: "original" }),
          /* @__PURE__ */ i.jsx("span", { className: "diag-list-text", children: ws(n.original, 80) })
        ] }),
        /* @__PURE__ */ i.jsxs("div", { className: "diag-an-patch-row", children: [
          /* @__PURE__ */ i.jsx("span", { className: "diag-an-patch-label", children: "bottom" }),
          /* @__PURE__ */ i.jsx("span", { className: "diag-list-text", children: ws(n.bottom, 80) })
        ] }),
        /* @__PURE__ */ i.jsxs("div", { className: "diag-an-patch-row", children: [
          /* @__PURE__ */ i.jsx("span", { className: "diag-an-patch-label" }),
          /* @__PURE__ */ i.jsx("span", { className: "diag-badge diag-badge-input", children: "→" }),
          /* @__PURE__ */ i.jsx("span", { className: "diag-list-text diag-an-patch-arrow", children: ws(n.patched, 120) })
        ] })
      ] })
    ] }) : null
  ] });
}
function O1() {
  return /* @__PURE__ */ i.jsxs("section", { className: "diag-panel diag-panel-stscript", children: [
    /* @__PURE__ */ i.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ i.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }),
      /* @__PURE__ */ i.jsx("h2", { children: "STScript inspector" })
    ] }),
    /* @__PURE__ */ i.jsxs("p", { className: "diag-panel-lede", children: [
      "No STScript runtime state available yet. The STScript inspector surfaces the command registry (registered commands with aliases), the scope chain (current variables and parent context), recent pipe values, and parser flag status. Connect a runtime via the ",
      /* @__PURE__ */ i.jsx("code", { children: "registry" }),
      ",",
      " ",
      /* @__PURE__ */ i.jsx("code", { children: "scope" }),
      ", ",
      /* @__PURE__ */ i.jsx("code", { children: "pipeHistory" }),
      ", and ",
      /* @__PURE__ */ i.jsx("code", { children: "flags" }),
      " props to populate this panel."
    ] })
  ] });
}
function L1(e) {
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
function z1(e) {
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
  return /* @__PURE__ */ i.jsxs("div", { className: "diag-scope-card", role: "region", "aria-label": "Scope chain", children: [
    /* @__PURE__ */ i.jsxs("div", { className: "diag-scope-header", children: [
      /* @__PURE__ */ i.jsx("span", { children: "Scope" }),
      /* @__PURE__ */ i.jsxs("span", { className: "diag-scope-depth", children: [
        t.length,
        " variable",
        t.length === 1 ? "" : "s"
      ] })
    ] }),
    t.length === 0 ? /* @__PURE__ */ i.jsx("div", { className: "diag-scope-vars", children: /* @__PURE__ */ i.jsx("span", { className: "diag-scope-var-value", style: { fontStyle: "italic" }, children: "No variables in this scope" }) }) : /* @__PURE__ */ i.jsx("div", { className: "diag-scope-vars", children: t.map(([n, r]) => /* @__PURE__ */ i.jsxs("div", { className: "diag-scope-var", children: [
      /* @__PURE__ */ i.jsx("span", { className: "diag-scope-var-name", children: n }),
      /* @__PURE__ */ i.jsx("span", { className: "diag-scope-var-value", title: String(r), children: L1(r) })
    ] }, n)) }),
    e.parent ? /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
      /* @__PURE__ */ i.jsx("div", { className: "diag-scope-parent", children: "↑ parent scope" }),
      /* @__PURE__ */ i.jsx(xy, { scope: e.parent })
    ] }) : null
  ] });
}
function B1({
  registry: e,
  scope: t,
  pipeHistory: n,
  flags: r
}) {
  return !e && !t && !n && !r ? /* @__PURE__ */ i.jsx(O1, {}) : /* @__PURE__ */ i.jsxs("section", { className: "diag-panel diag-panel-stscript", children: [
    /* @__PURE__ */ i.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ i.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }),
      /* @__PURE__ */ i.jsx("h2", { children: "STScript inspector" }),
      /* @__PURE__ */ i.jsx("p", { className: "diag-panel-lede", children: "STScript runtime state — command registry, scope chain, pipe history, and parser flags." })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsxs("h3", { children: [
        "Command registry",
        e ? /* @__PURE__ */ i.jsxs("span", { className: "diag-list-count", children: [
          " (",
          e.length,
          ")"
        ] }) : null
      ] }),
      !e || e.length === 0 ? /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "No commands registered." }) : /* @__PURE__ */ i.jsx("ul", { className: "diag-list", role: "list", "aria-label": "Registered commands", children: e.map((s, a) => /* @__PURE__ */ i.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ i.jsxs("div", { className: "diag-command-row", children: [
          /* @__PURE__ */ i.jsx("span", { className: "diag-command-name", children: s.name }),
          s.aliases && s.aliases.length > 0 ? /* @__PURE__ */ i.jsxs("span", { className: "diag-command-aliases", children: [
            "aliases: ",
            s.aliases.join(", ")
          ] }) : null
        ] }),
        s.helpString ? /* @__PURE__ */ i.jsx("span", { className: "diag-command-help", children: s.helpString }) : null
      ] }, s.name ?? a)) })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsx("h3", { children: "Scope chain" }),
      t ? /* @__PURE__ */ i.jsx(xy, { scope: t }) : /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "No scope state available." })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsxs("h3", { children: [
        "Pipe history",
        n ? /* @__PURE__ */ i.jsxs("span", { className: "diag-list-count", children: [
          " (",
          n.length,
          ")"
        ] }) : null
      ] }),
      !n || n.length === 0 ? /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "No pipe values recorded yet." }) : /* @__PURE__ */ i.jsx("div", { className: "diag-pipe-history", role: "list", "aria-label": "Pipe history", children: n.map((s, a) => /* @__PURE__ */ i.jsxs("div", { className: "diag-pipe-item", role: "listitem", children: [
        "[",
        n.length - 1 - a,
        "] ",
        z1(s)
      ] }, a)) })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsx("h3", { children: "Parser flags" }),
      r ? /* @__PURE__ */ i.jsxs("ul", { className: "diag-flag-list", role: "list", "aria-label": "Parser flags", children: [
        /* @__PURE__ */ i.jsxs(
          "li",
          {
            className: `diag-flag-item${r.STRICT_ESCAPING ? " diag-flag-on" : " diag-flag-off"}`,
            children: [
              /* @__PURE__ */ i.jsx("span", { children: "STRICT_ESCAPING" }),
              /* @__PURE__ */ i.jsx("span", { children: r.STRICT_ESCAPING ? "ON" : "OFF" })
            ]
          }
        ),
        /* @__PURE__ */ i.jsxs(
          "li",
          {
            className: `diag-flag-item${r.REPLACE_GETVAR ? " diag-flag-on" : " diag-flag-off"}`,
            children: [
              /* @__PURE__ */ i.jsx("span", { children: "REPLACE_GETVAR" }),
              /* @__PURE__ */ i.jsx("span", { children: r.REPLACE_GETVAR ? "ON" : "OFF" })
            ]
          }
        )
      ] }) : /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "No parser flags available." })
    ] })
  ] });
}
function $1(e) {
  const t = {};
  for (const n of e)
    for (const r of n.steps) {
      const s = r.kind;
      s && (t[s] = (t[s] ?? 0) + 1);
    }
  return t;
}
function F1() {
  return /* @__PURE__ */ i.jsxs("section", { className: "diag-panel diag-panel-extensions", children: [
    /* @__PURE__ */ i.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ i.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }),
      /* @__PURE__ */ i.jsx("h2", { children: "Extensions inspector" })
    ] }),
    /* @__PURE__ */ i.jsxs("p", { className: "diag-panel-lede", children: [
      "No extension loader state available yet. The Extensions inspector surfaces the activation plan (which extensions were activated or skipped, and why), the disabled extensions store, registered generate interceptors, and a hook dispatch summary. Provide an ",
      /* @__PURE__ */ i.jsx("code", { children: "activationPlan" }),
      " and",
      " ",
      /* @__PURE__ */ i.jsx("code", { children: "disabled" }),
      " prop to populate this panel."
    ] })
  ] });
}
function H1({
  activationPlan: e,
  disabled: t
}) {
  if (!e && !t) return /* @__PURE__ */ i.jsx(F1, {});
  const n = e?.activated ?? [], r = e?.skipped ?? [], s = n.filter((o) => o.manifest.generate_interceptor).map((o) => ({
    id: o.id,
    name: o.manifest.generate_interceptor
  })), a = $1(n);
  return /* @__PURE__ */ i.jsxs("section", { className: "diag-panel diag-panel-extensions", children: [
    /* @__PURE__ */ i.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ i.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }),
      /* @__PURE__ */ i.jsx("h2", { children: "Extensions inspector" }),
      /* @__PURE__ */ i.jsx("p", { className: "diag-panel-lede", children: "Extension loader activation plan and runtime state — which extensions were loaded, skipped, or disabled, and their hook dispatch footprint." })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsxs("h3", { children: [
        "Activated extensions",
        n.length > 0 ? /* @__PURE__ */ i.jsxs("span", { className: "diag-list-count", children: [
          " (",
          n.length,
          ")"
        ] }) : null
      ] }),
      n.length === 0 ? /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "No extensions activated." }) : /* @__PURE__ */ i.jsx("ul", { className: "diag-list", role: "list", "aria-label": "Activated extensions", children: n.map((o) => /* @__PURE__ */ i.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-key", children: o.id }),
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-text", children: o.manifest.display_name }),
        /* @__PURE__ */ i.jsxs("span", { className: "diag-ext-steps", children: [
          o.steps.length,
          " step",
          o.steps.length === 1 ? "" : "s"
        ] }),
        o.manifest.generate_interceptor ? /* @__PURE__ */ i.jsxs("span", { className: "diag-ext-interceptor", children: [
          "interceptor: ",
          o.manifest.generate_interceptor
        ] }) : null
      ] }, o.id)) })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsxs("h3", { children: [
        "Skipped extensions",
        r.length > 0 ? /* @__PURE__ */ i.jsxs("span", { className: "diag-list-count", children: [
          " (",
          r.length,
          ")"
        ] }) : null
      ] }),
      r.length === 0 ? /* @__PURE__ */ i.jsx("p", { className: "diag-footnote", children: "No extensions were skipped." }) : /* @__PURE__ */ i.jsx("ul", { className: "diag-list", role: "list", "aria-label": "Skipped extensions", children: r.map((o) => /* @__PURE__ */ i.jsxs("li", { className: "diag-list-item diag-list-item-dim", children: [
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-key", children: o.id }),
        o.reasons.map((u, c) => /* @__PURE__ */ i.jsx("span", { className: "diag-list-reason", children: u }, c))
      ] }, o.id)) })
    ] }),
    t && t.length > 0 ? /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsxs("h3", { children: [
        "Disabled extensions store",
        /* @__PURE__ */ i.jsxs("span", { className: "diag-list-count", children: [
          " (",
          t.length,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ i.jsx("ul", { className: "diag-list", role: "list", "aria-label": "Disabled extension IDs", children: t.map((o) => /* @__PURE__ */ i.jsx("li", { className: "diag-list-item diag-list-item-dim", children: /* @__PURE__ */ i.jsx("span", { className: "diag-list-key", children: o }) }, o)) })
    ] }) : null,
    s.length > 0 ? /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsxs("h3", { children: [
        "Generate interceptors",
        /* @__PURE__ */ i.jsxs("span", { className: "diag-list-count", children: [
          " (",
          s.length,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ i.jsx("ul", { className: "diag-list", role: "list", "aria-label": "Generate interceptors", children: s.map((o) => /* @__PURE__ */ i.jsxs("li", { className: "diag-list-item", children: [
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-key", children: o.id }),
        /* @__PURE__ */ i.jsx("span", { className: "diag-list-text", children: o.name })
      ] }, o.id)) })
    ] }) : null,
    Object.keys(a).length > 0 ? /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsxs("h3", { children: [
        "Hook dispatch summary",
        /* @__PURE__ */ i.jsxs("span", { className: "diag-list-count", children: [
          " ",
          "(",
          Object.keys(a).length,
          " event",
          Object.keys(a).length === 1 ? "" : "s",
          ")"
        ] })
      ] }),
      /* @__PURE__ */ i.jsx(
        "div",
        {
          className: "diag-hook-summary",
          role: "list",
          "aria-label": "Hook dispatch counts per event",
          children: Object.entries(a).sort(([o], [u]) => o.localeCompare(u)).map(([o, u]) => /* @__PURE__ */ i.jsxs("div", { className: "diag-hook-cell", role: "listitem", children: [
            /* @__PURE__ */ i.jsx("span", { className: "diag-hook-event", children: o }),
            /* @__PURE__ */ i.jsx("span", { className: "diag-hook-count", children: u })
          ] }, o))
        }
      )
    ] }) : null
  ] });
}
function U1() {
  return /* @__PURE__ */ i.jsxs("section", { className: "diag-panel diag-panel-connector", children: [
    /* @__PURE__ */ i.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ i.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }),
      /* @__PURE__ */ i.jsx("h2", { children: "Connector inspector" })
    ] }),
    /* @__PURE__ */ i.jsxs("p", { className: "diag-panel-lede", children: [
      "No provider requests captured yet. The Connector inspector displays the request body per source, highlights stripped fields, and surfaces diagnostics notes. Provide a ",
      /* @__PURE__ */ i.jsx("code", { children: "requests" }),
      " array with source, body, and diagnostics to populate this panel."
    ] })
  ] });
}
function W1(e, t = 600) {
  try {
    const n = JSON.stringify(e, null, 2);
    return n.length <= t ? n : `${n.slice(0, t - 3)}…`;
  } catch {
    return String(e);
  }
}
function G1({
  requests: e
}) {
  return !e || e.length === 0 ? /* @__PURE__ */ i.jsx(U1, {}) : /* @__PURE__ */ i.jsxs("section", { className: "diag-panel diag-panel-connector", children: [
    /* @__PURE__ */ i.jsxs("header", { className: "diag-panel-header", children: [
      /* @__PURE__ */ i.jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }),
      /* @__PURE__ */ i.jsx("h2", { children: "Connector inspector" }),
      /* @__PURE__ */ i.jsx("p", { className: "diag-panel-lede", children: "Provider request body diff per source. Each entry shows the source name, the pretty-printed JSON payload, fields that were stripped before sending, and any diagnostic notes from the connector." })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
      /* @__PURE__ */ i.jsxs("h3", { children: [
        "Provider requests",
        /* @__PURE__ */ i.jsxs("span", { className: "diag-list-count", children: [
          " (",
          e.length,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ i.jsx("div", { role: "list", "aria-label": "Provider request snapshots", children: e.map((t, n) => /* @__PURE__ */ i.jsxs(
        "details",
        {
          className: "diag-request-card",
          open: n === 0,
          children: [
            /* @__PURE__ */ i.jsx(
              "summary",
              {
                className: "diag-request-header",
                role: "button",
                "aria-label": `Request from ${t.source}`,
                children: /* @__PURE__ */ i.jsx("span", { className: "diag-request-source", children: t.source })
              }
            ),
            /* @__PURE__ */ i.jsxs("div", { className: "diag-request-body", children: [
              t.diagnostics.stripped.length > 0 ? /* @__PURE__ */ i.jsxs(
                "div",
                {
                  className: "diag-subsection",
                  style: { marginBottom: 8 },
                  children: [
                    /* @__PURE__ */ i.jsxs("h3", { children: [
                      "Stripped fields",
                      /* @__PURE__ */ i.jsxs("span", { className: "diag-list-count", children: [
                        " ",
                        "(",
                        t.diagnostics.stripped.length,
                        ")"
                      ] })
                    ] }),
                    /* @__PURE__ */ i.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 }, children: t.diagnostics.stripped.map((r) => /* @__PURE__ */ i.jsx("span", { className: "diag-stripped-tag", children: r }, r)) })
                  ]
                }
              ) : null,
              t.diagnostics.notes.length > 0 ? /* @__PURE__ */ i.jsxs(
                "div",
                {
                  className: "diag-subsection",
                  style: { marginBottom: 8 },
                  children: [
                    /* @__PURE__ */ i.jsx("h3", { children: "Notes" }),
                    /* @__PURE__ */ i.jsx(
                      "ul",
                      {
                        className: "diag-notes-list",
                        role: "list",
                        "aria-label": "Diagnostic notes",
                        children: t.diagnostics.notes.map((r, s) => /* @__PURE__ */ i.jsxs("li", { className: "diag-notes-item", children: [
                          /* @__PURE__ */ i.jsx("span", { className: "diag-notes-bullet", children: "*" }),
                          /* @__PURE__ */ i.jsx("span", { children: r })
                        ] }, s))
                      }
                    )
                  ]
                }
              ) : null,
              /* @__PURE__ */ i.jsxs("div", { className: "diag-subsection", children: [
                /* @__PURE__ */ i.jsx("h3", { children: "Request body" }),
                /* @__PURE__ */ i.jsx("pre", { className: "json-block", children: W1(t.body) })
              ] })
            ] })
          ]
        },
        t.source ?? n
      )) })
    ] })
  ] });
}
function _C() {
  const e = wt();
  return e.showDiagnostics ? /* @__PURE__ */ i.jsxs("section", { className: "drawer-panel product-dev-panel", children: [
    /* @__PURE__ */ i.jsx("h2", { children: "Dev diagnostics" }),
    /* @__PURE__ */ i.jsxs("div", { className: "diag-stack compact", children: [
      /* @__PURE__ */ i.jsx(T1, { runtime: e.runtime }),
      /* @__PURE__ */ i.jsx(Q3, { chat: e.liveChat }),
      /* @__PURE__ */ i.jsx(N1, { runtime: e.runtime, chat: e.liveChat }),
      /* @__PURE__ */ i.jsx(E1, { runtime: e.runtime }),
      /* @__PURE__ */ i.jsx(b1, {}),
      /* @__PURE__ */ i.jsx(P1, { result: null }),
      /* @__PURE__ */ i.jsx(D1, { result: null }),
      /* @__PURE__ */ i.jsx(B1, { registry: null, scope: null, pipeHistory: null, flags: null }),
      /* @__PURE__ */ i.jsx(H1, { activationPlan: null, disabled: null }),
      /* @__PURE__ */ i.jsx(G1, { requests: null })
    ] })
  ] }) : /* @__PURE__ */ i.jsxs("section", { className: "drawer-panel", children: [
    /* @__PURE__ */ i.jsx("h2", { children: "Dev diagnostics" }),
    /* @__PURE__ */ i.jsx("p", { children: "Diagnostics are disabled by the host." })
  ] });
}
const V1 = ["ydltavern-surface", "tavern-surface", "tavern-surface-play"];
function K1({ chat: e = Yh, showDiagnostics: t = !0, className: n, sessionId: r, projectId: s }) {
  return /* @__PURE__ */ i.jsx("div", { className: q1(V1, n), children: /* @__PURE__ */ i.jsx(fg, { chat: e, showDiagnostics: t, sessionId: r, projectId: s, children: /* @__PURE__ */ i.jsx(O3, {}) }) });
}
function q1(e, t) {
  return t ? [...e, t].join(" ") : e.join(" ");
}
const Y1 = ["ydltavern-surface", "tavern-surface", "tavern-surface-settings"], Q1 = ["Connection profiles & secret refs", "Sampler defaults & preset import", "Persona, avatar, theme", "Extension permissions & install"];
function X1({ className: e }) {
  return /* @__PURE__ */ i.jsxs("div", { className: Z1(Y1, e), children: [
    /* @__PURE__ */ i.jsx(V3, {}),
    /* @__PURE__ */ i.jsxs("aside", { className: "placeholder-card compact-card", children: [
      /* @__PURE__ */ i.jsx("span", { className: "placeholder-card-eyebrow", children: "next wiring" }),
      /* @__PURE__ */ i.jsx("ul", { className: "placeholder-list", children: Q1.map((t) => /* @__PURE__ */ i.jsx("li", { children: t }, t)) })
    ] })
  ] });
}
function Z1(e, t) {
  return t ? [...e, t].join(" ") : e.join(" ");
}
const J1 = ["ydltavern-surface", "tavern-surface", "tavern-surface-extensions"], eC = ["Extension loader & sandbox boundary", "Registry, install, version pinning", "STScript / slash command host", "Built-in extensions catalog"];
function tC({ className: e }) {
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
  return /* @__PURE__ */ i.jsxs("div", { className: nC(J1, e), children: [
    /* @__PURE__ */ i.jsx(fy, { records: t, activationContext: n }),
    /* @__PURE__ */ i.jsxs("aside", { className: "placeholder-card compact-card", children: [
      /* @__PURE__ */ i.jsx("span", { className: "placeholder-card-eyebrow", children: "next wiring" }),
      /* @__PURE__ */ i.jsx("ul", { className: "placeholder-list", children: eC.map((r) => /* @__PURE__ */ i.jsx("li", { children: r }, r)) })
    ] })
  ] });
}
function nC(e, t) {
  return t ? [...e, t].join(" ") : e.join(" ");
}
function sa({
  drawerId: e,
  surfaceClassName: t,
  Drawer: n
}) {
  return function({ className: s, sessionId: a, projectId: o }) {
    return /* @__PURE__ */ i.jsx("div", { className: sC(["ydltavern-surface", "tavern-surface", t], s), children: /* @__PURE__ */ i.jsx(fg, { sessionId: a, projectId: o, children: /* @__PURE__ */ i.jsx(rC, { drawerId: e, Drawer: n }) }) });
  };
}
function rC({
  drawerId: e,
  Drawer: t
}) {
  const n = wt(), r = ry();
  return R.useEffect(() => {
    r.open(e);
  }, [e, r]), /* @__PURE__ */ i.jsx(ny, { theme: n.theme, children: /* @__PURE__ */ i.jsx("div", { className: "tavern-standalone-surface", "data-drawer-open": r.openId ?? "none", children: /* @__PURE__ */ i.jsx(t, { drawers: r }) }) });
}
function sC(e, t) {
  return t ? [...e, t].join(" ") : e.join(" ");
}
const aC = sa({
  drawerId: "characters",
  surfaceClassName: "tavern-surface-characters",
  Drawer: hy
}), iC = sa({
  drawerId: "world-info",
  surfaceClassName: "tavern-surface-world-info",
  Drawer: oy
}), oC = sa({
  drawerId: "persona",
  surfaceClassName: "tavern-surface-persona",
  Drawer: my
}), lC = sa({
  drawerId: "ai-config",
  surfaceClassName: "tavern-surface-ai-response-config",
  Drawer: ay
}), uC = sa({
  drawerId: "user-settings",
  surfaceClassName: "tavern-surface-user-settings",
  Drawer: cy
}), cC = sa({
  drawerId: "backgrounds",
  surfaceClassName: "tavern-surface-backgrounds",
  Drawer: dy
});
var wy, lh = m_;
wy = lh.createRoot, lh.hydrateRoot;
function ar(e) {
  return (t, n = {}) => {
    const r = po(n, "sessionId") ?? po(n, "session_id"), s = po(n, "projectId") ?? po(n, "project_id");
    Ib(n), Oo(r);
    const a = wy(t);
    return a.render(J.createElement(e, { ...n, sessionId: r, projectId: s })), () => {
      a.unmount(), Oo(void 0), Ab();
    };
  };
}
function po(e, t) {
  const n = e[t];
  return typeof n == "string" && n.length > 0 ? n : void 0;
}
const yC = ar(K1), xC = ar(X1), wC = ar(tC), bC = ar(aC), SC = ar(iC), kC = ar(oC), NC = ar(lC), jC = ar(uC), EC = ar(cC);
export {
  ay as AIConfigDrawer,
  g3 as APIConnectionsDrawer,
  w3 as AdvancedFormattingDrawer,
  vC as AssetsPanel,
  Qh as BUILT_IN_THEMES,
  dy as BackgroundsDrawer,
  hy as CharactersDrawer,
  mC as ChatList,
  iy as ConnectionForm,
  G1 as ConnectorInspector,
  _C as DevDiagnosticsPanel,
  sr as DrawerShell,
  Q3 as EngineCorePreviewPanel,
  A3 as ExtensionsDrawer,
  H1 as ExtensionsInspector,
  fy as ExtensionsPanel,
  F3 as GenerationControls,
  b1 as ImportersPanel,
  hC as MessageComposer,
  r3 as MessageList,
  my as PersonaDrawer,
  py as PersonaForm,
  N1 as PromptCriticalPanel,
  P1 as PromptManagerInspector,
  o3 as QuickReplyBar,
  T1 as STDiagnosticsPanel,
  B1 as STScriptInspector,
  sy as SamplerForm,
  V3 as SettingsPanel,
  d3 as Sheld,
  E1 as SlashDiagnosticsPanel,
  z3 as SubMessageView,
  gC as SwipeControls,
  lC as TavernAIResponseConfigSurface,
  cC as TavernBackgroundsSurface,
  aC as TavernCharactersSurface,
  tC as TavernExtensionsSurface,
  oC as TavernPersonaSurface,
  K1 as TavernPlaySurface,
  fg as TavernProvider,
  X1 as TavernSettingsSurface,
  O3 as TavernShell,
  uC as TavernUserSettingsSurface,
  iC as TavernWorldInfoSurface,
  ly as ThemeForm,
  ny as ThemedRoot,
  c3 as TopBar,
  B3 as TurnView,
  cy as UserSettingsDrawer,
  oy as WorldInfoDrawer,
  D1 as WorldInfoInspector,
  rE as createConverter,
  LE as ensureDOMPurifyHooks,
  KE as formatMessage,
  sE as getConverter,
  yd as getThemeById,
  NC as mountTavernAIResponseConfigSurface,
  EC as mountTavernBackgroundsSurface,
  bC as mountTavernCharactersSurface,
  wC as mountTavernExtensionsSurface,
  kC as mountTavernPersonaSurface,
  yC as mountTavernPlaySurface,
  xC as mountTavernSettingsSurface,
  jC as mountTavernUserSettingsSurface,
  SC as mountTavernWorldInfoSurface,
  pC as registerPostRenderHook,
  dC as registerPreMarkdownHook,
  fC as registerPreSanitizeHook,
  Yh as sampleChat,
  zE as sanitizeChatHtml,
  ry as useDrawers,
  wt as useTavern
};
//# sourceMappingURL=bundle.mjs.map
