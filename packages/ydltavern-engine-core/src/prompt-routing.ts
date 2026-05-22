import type { PromptMessage } from './prompt.js';
import type { WorldInfoBuckets, WorldInfoDepthBucket, WorldInfoExampleBucketEntry, WorldInfoOutletBucket } from './world-info.js';

export type PromptRoutingRoute = 'atDepth' | 'em' | 'outlet' | 'authorNote';

export interface PromptRoutingDiagnostic {
  readonly route: PromptRoutingRoute;
  readonly bucket: string;
  readonly inserted: boolean;
  readonly entryId?: string;
  readonly depth?: number;
  readonly role?: PromptMessage['role'];
  readonly outletName?: string;
  readonly content: string;
  readonly note?: string;
}

export interface PromptRoutingResult {
  readonly diagnostics: readonly PromptRoutingDiagnostic[];
  readonly messagesPreview: readonly PromptMessage[];
}

export interface BuildRoutedMessagesPreviewOptions {
  readonly includeAuthorNote?: boolean;
  readonly includeExamples?: boolean;
  readonly includeDepthEntries?: boolean;
  readonly includeOutlets?: boolean;
}

export function buildPromptRoutingDiagnostics(buckets: WorldInfoBuckets): readonly PromptRoutingDiagnostic[] {
  return [
    ...authorNoteDiagnostics(buckets),
    ...depthDiagnostics(buckets.depthEntries, buckets.atDepth),
    ...exampleDiagnostics(buckets.em.length > 0 ? buckets.em : buckets.examples),
    ...outletDiagnostics(buckets.outlets, buckets.outlet),
  ];
}

export function buildRoutedMessagesPreview(
  messages: readonly PromptMessage[],
  buckets: WorldInfoBuckets,
  options: BuildRoutedMessagesPreviewOptions = {},
): readonly PromptMessage[] {
  const includeAuthorNote = options.includeAuthorNote ?? true;
  const includeExamples = options.includeExamples ?? true;
  const includeDepthEntries = options.includeDepthEntries ?? true;
  const includeOutlets = options.includeOutlets ?? true;
  const preview = [...messages];

  if (includeDepthEntries) {
    for (const bucket of buckets.depthEntries) {
      for (const entry of bucket.entries) {
        const depth = entry.depth ?? bucket.depth;
        const index = Math.max(0, preview.length - depth);
        preview.splice(index, 0, { role: (entry.role ?? bucket.role) as PromptMessage['role'], content: entry.content });
      }
    }
    if (buckets.depthEntries.length === 0) {
      for (const content of buckets.atDepth) {
        const index = Math.max(0, preview.length - 4);
        preview.splice(index, 0, { role: 'system', content });
      }
    }
  }

  if (includeExamples) {
    const examples = buckets.em.length > 0 ? buckets.em : buckets.examples;
    for (const example of examples) {
      const message = { role: 'system' as const, content: example.content };
      if (example.position === 'before') {
        preview.unshift(message);
      } else {
        preview.push(message);
      }
    }
  }

  if (includeAuthorNote && buckets.anPatch.patched.trim() !== '') {
    preview.push({ role: 'system', content: buckets.anPatch.patched });
  }

  if (includeOutlets) {
    for (const [name, outlet] of Object.entries(buckets.outlets)) {
      for (const entry of outlet.entries) {
        preview.push({ role: 'system', content: `[outlet:${entry.outletName ?? name}]\n${entry.content}` });
      }
    }
    if (Object.keys(buckets.outlets).length === 0) {
      for (const content of buckets.outlet) {
        preview.push({ role: 'system', content: `[outlet:default]\n${content}` });
      }
    }
  }

  return preview;
}

export function routePromptMessages(
  messages: readonly PromptMessage[],
  buckets: WorldInfoBuckets,
  options: BuildRoutedMessagesPreviewOptions = {},
): PromptRoutingResult {
  return {
    diagnostics: buildPromptRoutingDiagnostics(buckets),
    messagesPreview: buildRoutedMessagesPreview(messages, buckets, options),
  };
}

function authorNoteDiagnostics(buckets: WorldInfoBuckets): readonly PromptRoutingDiagnostic[] {
  const diagnostics: PromptRoutingDiagnostic[] = [];
  for (const content of buckets.anPatch.top) {
    diagnostics.push({ route: 'authorNote', bucket: 'anPatch.top', inserted: true, content });
  }
  if (buckets.anPatch.original !== undefined && buckets.anPatch.original.trim() !== '') {
    diagnostics.push({ route: 'authorNote', bucket: 'anPatch.original', inserted: true, content: buckets.anPatch.original });
  }
  for (const content of buckets.anPatch.bottom) {
    diagnostics.push({ route: 'authorNote', bucket: 'anPatch.bottom', inserted: true, content });
  }
  return diagnostics;
}

function depthDiagnostics(depthEntries: readonly WorldInfoDepthBucket[], legacyAtDepth: readonly string[]): readonly PromptRoutingDiagnostic[] {
  if (depthEntries.length === 0) {
    return legacyAtDepth.map((content): PromptRoutingDiagnostic => ({
      route: 'atDepth',
      bucket: 'atDepth',
      inserted: false,
      depth: 4,
      role: 'system',
      content,
      note: 'legacy atDepth content has no entry metadata',
    }));
  }
  return depthEntries.flatMap((bucket) => bucket.entries.map((entry): PromptRoutingDiagnostic => ({
    route: 'atDepth',
    bucket: `depthEntries.${bucket.depth}.${bucket.role}`,
    inserted: false,
    entryId: entry.entryId,
    depth: entry.depth ?? bucket.depth,
    role: (entry.role ?? bucket.role) as PromptMessage['role'],
    content: entry.content,
    note: 'preview-only route; buildPrompt API is unchanged',
  })));
}

function exampleDiagnostics(examples: readonly WorldInfoExampleBucketEntry[]): readonly PromptRoutingDiagnostic[] {
  return examples.map((entry): PromptRoutingDiagnostic => ({
    route: 'em',
    bucket: `em.${entry.position}`,
    inserted: false,
    entryId: entry.entryId,
    content: entry.content,
    note: 'example-message route is reported for preview only',
  }));
}

function outletDiagnostics(outlets: Readonly<Record<string, WorldInfoOutletBucket>>, legacyOutlet: readonly string[]): readonly PromptRoutingDiagnostic[] {
  const entries = Object.entries(outlets).flatMap(([name, outlet]) => outlet.entries.map((entry): PromptRoutingDiagnostic => ({
    route: 'outlet',
    bucket: `outlets.${name}`,
    inserted: false,
    entryId: entry.entryId,
    outletName: entry.outletName ?? name,
    content: entry.content,
    note: 'outlet route is reported for preview only',
  })));
  if (entries.length > 0) {
    return entries;
  }
  return legacyOutlet.map((content): PromptRoutingDiagnostic => ({
    route: 'outlet',
    bucket: 'outlet',
    inserted: false,
    outletName: 'default',
    content,
    note: 'legacy outlet content has no entry metadata',
  }));
}
