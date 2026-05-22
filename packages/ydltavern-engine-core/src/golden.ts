export type GoldenCompareMode = 'exact' | 'whitespace' | 'structure';

export interface GoldenCompareResult {
  readonly pass: boolean;
  readonly mode: GoldenCompareMode;
  readonly actual: string;
  readonly expected: string;
  readonly message?: string;
}

export function normalizeJson(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalizeJson);
  }
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entryValue]) => [key, normalizeJson(entryValue)]),
    );
  }
  return value;
}

export function normalizeText(value: string): string {
  return value
    .replace(/\r\n?/gu, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}

export function compareGolden(actual: unknown, expected: unknown, mode: GoldenCompareMode = 'exact'): GoldenCompareResult {
  const actualNormalized = comparable(actual, mode);
  const expectedNormalized = comparable(expected, mode);
  const pass = actualNormalized === expectedNormalized;
  return {
    pass,
    mode,
    actual: actualNormalized,
    expected: expectedNormalized,
    message: pass ? undefined : `Golden mismatch in ${mode} mode`,
  };
}

function comparable(value: unknown, mode: GoldenCompareMode): string {
  switch (mode) {
    case 'exact':
      return typeof value === 'string' ? value : stableStringify(normalizeJson(value));
    case 'whitespace':
      return normalizeText(typeof value === 'string' ? value : stableStringify(normalizeJson(value))).replace(/\s+/gu, ' ');
    case 'structure':
      return stableStringify(structureOf(value));
  }
}

function structureOf(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(structureOf);
  }
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entryValue]) => [key, structureOf(entryValue)]),
    );
  }
  if (value === null) {
    return 'null';
  }
  return typeof value;
}

function stableStringify(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
