// variables-shim.mjs: Replaces ST's variables.js
let _variables = {};

export function getVariableMacros() {
  return [];
}

export function setVariable(name, value) {
  _variables[name] = value;
}

export function getVariable(name) {
  return _variables[name];
}

export function getVariableChain() {
  return [];
}

export function listVariables() {
  return Object.keys(_variables);
}

export function clearVariables() {
  _variables = {};
}
