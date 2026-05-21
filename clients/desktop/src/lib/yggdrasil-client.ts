const DEFAULT_HOST_URL = "http://127.0.0.1:8787";

type JsonRpcSuccess<T> = {
  jsonrpc: "2.0";
  id: string;
  result: T;
};

type JsonRpcError = {
  jsonrpc: "2.0";
  id: string | null;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
};

type JsonRpcResponse<T> = JsonRpcSuccess<T> | JsonRpcError;

export type RpcOptions = {
  hostUrl?: string;
};

export type SubscribeEventsOptions = {
  hostUrl?: string;
  afterSequence?: number;
  onEvent: (ev: unknown) => void;
  onError?: (err: unknown) => void;
};

export async function rpc<T = unknown>(
  method: string,
  params?: unknown,
  opts?: RpcOptions
): Promise<T> {
  const hostUrl = resolveHostUrl(opts?.hostUrl);
  const id = createRequestId();
  const response = await fetch(`${hostUrl}/rpc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id,
      method,
      params
    })
  });

  if (!response.ok) {
    throw new Error(`Yggdrasil RPC request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as JsonRpcResponse<T>;

  if (isJsonRpcError(payload)) {
    throw new Error(`Yggdrasil RPC error ${payload.error.code}: ${payload.error.message}`);
  }

  return payload.result;
}

export function subscribeEvents(opts: SubscribeEventsOptions): () => void {
  const hostUrl = resolveHostUrl(opts.hostUrl);
  const url = new URL("/events", hostUrl);

  if (opts.afterSequence !== undefined) {
    url.searchParams.set("after_sequence", String(opts.afterSequence));
  }

  const source = new EventSource(url.toString());

  source.onmessage = (event: MessageEvent<string>) => {
    try {
      opts.onEvent(JSON.parse(event.data) as unknown);
    } catch (err: unknown) {
      opts.onError?.(err);
    }
  };

  source.onerror = (event: Event) => {
    opts.onError?.(event);
  };

  return () => {
    source.close();
  };
}

function resolveHostUrl(hostUrl?: string): string {
  const configuredHostUrl = import.meta.env.VITE_YGG_HOST_URL as string | undefined;
  return trimTrailingSlash(hostUrl ?? configuredHostUrl ?? DEFAULT_HOST_URL);
}

function trimTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function createRequestId(): string {
  const timestamp = Date.now().toString(36);
  const random = crypto.getRandomValues(new Uint32Array(2));
  const randomHex = Array.from(random, (part) => part.toString(16).padStart(8, "0")).join("");
  return `${timestamp}-${randomHex}`;
}

function isJsonRpcError<T>(payload: JsonRpcResponse<T>): payload is JsonRpcError {
  return "error" in payload;
}
