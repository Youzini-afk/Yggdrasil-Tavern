import { PACKAGE_ID, createStubMeta } from "../types.js";
const CAPABILITY_ID = `${PACKAGE_ID}/diagnostics`;
export const createDiagnosticsHandlers = (counters) => ({
    [CAPABILITY_ID]: () => ({
        meta: createStubMeta(CAPABILITY_ID),
        diagnostics: {
            status: "ok",
            mode: "skeleton",
            counters: {
                total_invocations: counters.total,
                by_capability: { ...counters.byCapability },
            },
            network_enabled: false,
            filesystem_writes_enabled: false,
        },
    }),
});
//# sourceMappingURL=diagnostics.js.map