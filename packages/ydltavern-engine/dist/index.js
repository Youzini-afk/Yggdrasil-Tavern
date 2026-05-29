import readline from "node:readline";
import { assetHandlers } from "./capabilities/asset.js";
import { deepPortHandlers } from "./capabilities/deep-port.js";
import { describeHandlers } from "./capabilities/describe.js";
import { createDiagnosticsHandlers } from "./capabilities/diagnostics.js";
import { extensionHandlers } from "./capabilities/extensions.js";
import { modelLiveCallHandlers } from "./capabilities/model-live-call.js";
import { modelLiveRealtimeHandlers } from "./capabilities/model-live-realtime.js";
import { modelHandlers } from "./capabilities/model.js";
import { presetHandlers } from "./capabilities/preset.js";
import { scriptHandlers } from "./capabilities/script.js";
import { turnHandlers } from "./capabilities/turn.js";
import { worldInfoHandlers } from "./capabilities/world-info.js";
import { PACKAGE_ID, PROTOCOL_VERSION } from "./types.js";
const kernelBindings = {};
const counters = {
    total: 0,
    byCapability: {},
};
const handlers = {
    ...describeHandlers,
    ...presetHandlers,
    ...worldInfoHandlers,
    ...turnHandlers,
    ...assetHandlers,
    ...scriptHandlers,
    ...extensionHandlers,
    ...modelHandlers,
    ...modelLiveCallHandlers,
    ...modelLiveRealtimeHandlers,
    ...deepPortHandlers,
    ...createDiagnosticsHandlers(counters),
};
const toJsonValue = (value) => value;
const handshake = () => ({
    ready: true,
    package_id: PACKAGE_ID,
    package_protocol_version: PROTOCOL_VERSION,
    mode: "phase3-contract-slice",
    capabilities: Object.keys(handlers).sort(),
});
const invoke = async (params, context) => {
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
    return toJsonValue(await handler(params.input, context));
};
const respond = (id, payload) => {
    process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, ...payload })}\n`);
};
const serveFallback = () => {
    const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
    rl.on("line", (line) => {
        void (async () => {
            let request;
            try {
                request = JSON.parse(line);
            }
            catch (error) {
                respond(null, { error: { code: "invalid_json", message: String(error) } });
                return;
            }
            try {
                if (request.method === "package.handshake") {
                    Object.assign(kernelBindings, request.params?.bindings ?? {});
                    respond(request.id, { result: handshake() });
                    return;
                }
                if (request.method === "capability.invoke") {
                    const output = await invoke((request.params ?? {}));
                    respond(request.id, { result: { output } });
                    return;
                }
                respond(request.id, { error: { code: "unknown_method", message: request.method ?? "<missing>" } });
            }
            catch (error) {
                respond(request.id, { error: { code: "package_error", message: String(error) } });
            }
        })();
    });
    rl.on("close", () => {
        process.exitCode = 0;
    });
};
const main = async () => {
    if (process.env["YDLTAVERN_ENGINE_FORCE_FALLBACK"] !== "1") {
        try {
            const sdk = (await import("@yggdrasil/subprocess"));
            if (typeof sdk.serveSubprocessPackage === "function") {
                sdk.serveSubprocessPackage({
                    onHandshake: (params) => {
                        Object.assign(kernelBindings, params.bindings ?? {});
                        return handshake();
                    },
                    onInvoke: (params, context) => invoke(params, context),
                });
                return;
            }
        }
        catch {
            // Fall back to the self-contained JSON-RPC stdio loop when the SDK package is not installed yet.
        }
    }
    serveFallback();
};
void main();
//# sourceMappingURL=index.js.map