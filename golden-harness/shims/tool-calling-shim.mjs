// tool-calling-shim.mjs: Replaces ST's tool-calling.js
export class ToolManager {
  static parseToolCalls() {}
  static registerTool() {}
  static canPerformToolCalls() { return false; }
  static getToolDefinitions() { return []; }
  static executeTool() { return Promise.resolve(''); }
}
