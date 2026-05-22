import readline from "node:readline";

import { assetHandlers } from "./capabilities/asset.js";
import { describeHandlers } from "./capabilities/describe.js";
import { createDiagnosticsHandlers } from "./capabilities/diagnostics.js";
import { extensionHandlers } from "./capabilities/extensions.js";
import { modelHandlers } from "./capabilities/model.js";
import { presetHandlers } from "./capabilities/preset.js";
import { scriptHandlers } from "./capabilities/script.js";
import { turnHandlers } from "./capabilities/turn.js";
import { worldInfoHandlers } from "./capabilities/world-info.js";
import { PACKAGE_ID, PROTOCOL_VERSION, type HandlerRecord, type InvocationCounters, type JsonValue } from "./types.js";

interface JsonRpcRequest {
  jsonrpc?: "2.0";
  id?: string | number | null;
  method?: string;
  params?: Record<string, unknown>;
}

interface CapabilityInvokeParams {
  capability_id?: string;
  input?: unknown;
}

interface SdkModule {
  serveSubprocessPackage?: (options: {
    onHandshake?: (params: Record<string, unknown>) => JsonValue | Promise<JsonValue>;
    onInvoke: (params: CapabilityInvokeParams) => JsonValue | Promise<JsonValue>;
  }) => void;
}

const counters: InvocationCounters = {
  total: 0,
  byCapability: {},
};

const handlers: HandlerRecord = {
  ...describeHandlers,
  ...presetHandlers,
  ...worldInfoHandlers,
  ...turnHandlers,
  ...assetHandlers,
  ...scriptHandlers,
  ...extensionHandlers,
  ...modelHandlers,
  ...createDiagnosticsHandlers(counters),
};

const toJsonValue = (value: unknown): JsonValue => value as JsonValue;

const handshake = (): JsonValue => ({
  ready: true,
  package_id: PACKAGE_ID,
  package_protocol_version: PROTOCOL_VERSION,
  mode: "phase3-contract-slice",
  capabilities: Object.keys(handlers).sort(),
});

const invoke = async (params: CapabilityInvokeParams): Promise<JsonValue> => {
  const capabilityId = params.capability_id;
  if (!capabilityId) {
    throw new Error("missing capability_id");
  }

  const handler = handlers[capabilityId];
  if (!handler) {
    throw new Error(`unknown capability: ${capabilityId}`);
  }

  counters.total += 1;
  counters.byCapability[capabilityId] = (counters.byCapability[capabilityId] ?? 0) + 1;

  return toJsonValue(await handler(params.input));
};

const respond = (id: JsonRpcRequest["id"], payload: Record<string, JsonValue>): void => {
  process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, ...payload })}\n`);
};

const serveFallback = (): void => {
  const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });

  rl.on("line", (line) => {
    void (async () => {
      let request: JsonRpcRequest;
      try {
        request = JSON.parse(line) as JsonRpcRequest;
      } catch (error) {
        respond(null, { error: { code: "invalid_json", message: String(error) } });
        return;
      }

      try {
        if (request.method === "package.handshake") {
          respond(request.id, { result: handshake() });
          return;
        }

        if (request.method === "capability.invoke") {
          const output = await invoke((request.params ?? {}) as CapabilityInvokeParams);
          respond(request.id, { result: { output } });
          return;
        }

        respond(request.id, { error: { code: "unknown_method", message: request.method ?? "<missing>" } });
      } catch (error) {
        respond(request.id, { error: { code: "package_error", message: String(error) } });
      }
    })();
  });

  rl.on("close", () => {
    process.exitCode = 0;
  });
};

const main = async (): Promise<void> => {
  if (process.env["YDLTAVERN_ENGINE_FORCE_FALLBACK"] !== "1") {
    try {
      const sdk = (await import("@yggdrasil/subprocess")) as unknown as SdkModule;
      if (typeof sdk.serveSubprocessPackage === "function") {
        sdk.serveSubprocessPackage({
          onHandshake: () => handshake(),
          onInvoke: (params: CapabilityInvokeParams) => invoke(params),
        });
        return;
      }
    } catch {
      // Fall back to the self-contained JSON-RPC stdio loop when the SDK package is not installed yet.
    }
  }

  serveFallback();
};

void main();
