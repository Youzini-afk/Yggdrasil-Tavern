import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { URL } from 'node:url';

import type { HuggingFaceTokenizerSource } from './huggingface-adapter.js';

/**
 * Minimal kernel client interface a fetcher needs.
 * Mirrors the same shape used by `model.live_call` capabilities so the
 * fetcher can run inside any subprocess-style YdlTavern engine package.
 */
export interface KernelClientFetchHook {
  sendKernelRequest<T = unknown>(method: string, params: unknown): Promise<T>;
}

export interface FetchHFTokenizerOptions {
  /** Where to load the tokenizer from. */
  source: 'hf-hub' | 'url';
  /**
   * For source='hf-hub': huggingface model id, e.g. 'mistralai/Mistral-7B-Instruct-v0.3'.
   */
  modelId?: string;
  /** Branch/tag/commit. Default 'main'. */
  revision?: string;
  /** For source='url': the absolute URL to tokenizer.json. */
  url?: string;
  /**
   * Optional SHA-256 of tokenizer.json contents.
   * If provided and mismatch, fetch fails.
   */
  expectedSha256?: string;
  /** Kernel client used to perform the network fetch via Yggdrasil. */
  kernelClient: KernelClientFetchHook;
  /**
   * Capability id of the calling capability — required by Yggdrasil
   * outbound dispatch for namespace verification.
   */
  capabilityId: string;
  /**
   * Cache key. Default derived from modelId+revision or url.
   */
  cacheKey?: string;
  /**
   * Optional secret_ref for private HF repos (HF_TOKEN).
   * Caller's package manifest must declare this in permissions.secret_refs.
   */
  hfTokenSecretRef?: string;
  /**
   * Optional separate URL for tokenizer_config.json.
   * If undefined and source='hf-hub', the fetcher will also fetch
   * /resolve/{revision}/tokenizer_config.json (best-effort; missing config is fine).
   */
  tokenizerConfigUrl?: string;
  /** Request timeout in ms. Default 30000. */
  timeoutMs?: number;
}

export interface FetchHFTokenizerResult extends HuggingFaceTokenizerSource {
  readonly source: HuggingFaceTokenizerSource['tokenizerJson'] extends never ? never : 'hf-hub' | 'url';
  readonly modelId?: string;
  readonly revision?: string;
  readonly url: string;
  readonly sha256: string;
  readonly bytes: number;
  readonly tokenizerConfigBytes?: number;
}

export class FetcherLRU<K, V> {
  private cache = new Map<K, V>();

  constructor(private capacity: number = 16) {}

  get(key: K): V | undefined {
    const v = this.cache.get(key);
    if (v !== undefined) {
      this.cache.delete(key);
      this.cache.set(key, v);
    }
    return v;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const first = this.cache.keys().next().value;
      if (first !== undefined) this.cache.delete(first);
    }
  }

  clear(): void { this.cache.clear(); }

  size(): number { return this.cache.size; }
}

interface OutboundExecuteResponse {
  readonly status?: string;
  readonly body_shape?: unknown;
  readonly body?: unknown;
  readonly body_text?: unknown;
  readonly executor_kind?: string;
}

interface RequestTarget {
  readonly url: string;
  readonly destinationHost: string;
  readonly path: string;
}

const DEFAULT_TIMEOUT_MS = 30_000;
const defaultCache = new FetcherLRU<string, FetchHFTokenizerResult>(16);

export async function fetchHuggingFaceTokenizer(
  options: FetchHFTokenizerOptions,
): Promise<FetchHFTokenizerResult> {
  const revision = options.revision ?? 'main';
  const target = buildTokenizerTarget(options, revision);
  const cacheKey = options.cacheKey ?? defaultCacheKey(options, revision, target.url);
  const cached = defaultCache.get(cacheKey);
  if (cached) {
    validateExpectedSha256(cached.sha256, options.expectedSha256, target.url);
    return cached;
  }

  const tokenizerResponse = await executeJsonGet(options, target);
  if (tokenizerResponse.status !== 'ok') {
    throw new Error(
      `Failed to fetch HuggingFace tokenizer.json from ${target.url}: status=${tokenizerResponse.status ?? 'unknown'} executor_kind=${tokenizerResponse.executor_kind ?? 'unknown'}`,
    );
  }

  const tokenizerJson = parseJsonBody(tokenizerResponse, 'tokenizer.json', true);
  const canonicalTokenizerJson = JSON.stringify(tokenizerJson);
  const sha256 = sha256Hex(canonicalTokenizerJson);
  validateExpectedSha256(sha256, options.expectedSha256, target.url);

  const configResult = await fetchTokenizerConfigBestEffort(options, revision);
  const result: FetchHFTokenizerResult = omitUndefined({
    source: options.source,
    modelId: options.source === 'hf-hub' ? options.modelId : undefined,
    revision: options.source === 'hf-hub' ? revision : undefined,
    url: target.url,
    sha256,
    bytes: Buffer.byteLength(canonicalTokenizerJson, 'utf8'),
    tokenizerJson,
    tokenizerConfig: configResult?.json,
    tokenizerConfigBytes: configResult?.bytes,
  });

  defaultCache.set(cacheKey, result);
  return result;
}

function buildTokenizerTarget(options: FetchHFTokenizerOptions, revision: string): RequestTarget {
  if (options.source === 'hf-hub') {
    const modelId = requireNonEmpty(options.modelId, 'modelId is required for source=hf-hub');
    return hfHubTarget(modelId, revision, 'tokenizer.json');
  }
  return absoluteUrlTarget(requireNonEmpty(options.url, 'url is required for source=url'));
}

function hfHubTarget(modelId: string, revision: string, fileName: string): RequestTarget {
  const url = new URL('https:' + '//huggingface.co');
  const modelPath = modelId.split('/').map(encodeURIComponent).join('/');
  const revisionPath = revision.split('/').map(encodeURIComponent).join('/');
  url.pathname = `/${modelPath}/resolve/${revisionPath}/${fileName}`;
  return absoluteUrlTarget(url.toString());
}

function absoluteUrlTarget(urlValue: string): RequestTarget {
  let parsed: URL;
  try {
    parsed = new URL(urlValue);
  } catch (error) {
    throw new Error(`Invalid tokenizer URL: ${stringifyError(error)}`);
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`Invalid tokenizer URL protocol: ${parsed.protocol}`);
  }
  return {
    url: parsed.toString(),
    destinationHost: parsed.host,
    path: `${parsed.pathname}${parsed.search}`,
  };
}

function defaultCacheKey(options: FetchHFTokenizerOptions, revision: string, url: string): string {
  if (options.source === 'hf-hub') {
    const modelId = requireNonEmpty(options.modelId, 'modelId is required for source=hf-hub');
    return `hf:${modelId}@${revision}`;
  }
  return `url:${sha256Hex(url)}`;
}

async function executeJsonGet(
  options: FetchHFTokenizerOptions,
  target: RequestTarget,
): Promise<OutboundExecuteResponse> {
  const secretHeaders = options.hfTokenSecretRef
    ? { Authorization: { secret_ref: options.hfTokenSecretRef, scheme: 'bearer' } }
    : {};
  const response = await options.kernelClient.sendKernelRequest<OutboundExecuteResponse>('kernel.v1.outbound.execute', omitUndefined({
    capability_id: options.capabilityId,
    destination_host: target.destinationHost,
    method: 'GET',
    path: target.path,
    purpose: `ydltavern.tokenizer.fetch:${options.source}`,
    secret_refs: options.hfTokenSecretRef ? [options.hfTokenSecretRef] : undefined,
    secret_headers: secretHeaders,
    static_headers: { accept: 'application/json' },
    timeout_ms: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  }));
  return response ?? {};
}

async function fetchTokenizerConfigBestEffort(
  options: FetchHFTokenizerOptions,
  revision: string,
): Promise<{ readonly json: unknown; readonly bytes: number } | undefined> {
  const configTarget = buildTokenizerConfigTarget(options, revision);
  if (!configTarget) return undefined;

  try {
    const response = await executeJsonGet(options, configTarget);
    if (response.status !== 'ok') return undefined;
    const json = parseJsonBody(response, 'tokenizer_config.json', false);
    return { json, bytes: Buffer.byteLength(JSON.stringify(json), 'utf8') };
  } catch {
    return undefined;
  }
}

function buildTokenizerConfigTarget(options: FetchHFTokenizerOptions, revision: string): RequestTarget | undefined {
  if (options.tokenizerConfigUrl) return absoluteUrlTarget(options.tokenizerConfigUrl);
  if (options.source !== 'hf-hub') return undefined;
  const modelId = requireNonEmpty(options.modelId, 'modelId is required for source=hf-hub');
  return hfHubTarget(modelId, revision, 'tokenizer_config.json');
}

function parseJsonBody(
  response: OutboundExecuteResponse,
  label: string,
  requireModelField: boolean,
): Record<string, unknown> {
  const body = response.body_shape ?? response.body ?? response.body_text;
  let parsed: unknown;
  if (typeof body === 'string') {
    try {
      parsed = JSON.parse(body) as unknown;
    } catch (error) {
      throw new Error(`Malformed HuggingFace ${label}: body is not valid JSON (${stringifyError(error)})`);
    }
  } else {
    parsed = body;
  }

  if (!isJsonRecord(parsed)) {
    throw new Error(`Malformed HuggingFace ${label}: expected a JSON object`);
  }
  if (requireModelField && !('model' in parsed)) {
    throw new Error(`Malformed HuggingFace ${label}: missing required model field`);
  }
  return parsed;
}

function validateExpectedSha256(actual: string, expected: string | undefined, url: string): void {
  if (expected !== undefined && actual.toLowerCase() !== expected.toLowerCase()) {
    throw new Error(`HuggingFace tokenizer.json SHA-256 mismatch for ${url}: expected=${expected} actual=${actual}`);
  }
}

function sha256Hex(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function requireNonEmpty(value: string | undefined, message: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) throw new Error(message);
  return value;
}

function isJsonRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function omitUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as T;
}

function stringifyError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return JSON.stringify(error);
}
