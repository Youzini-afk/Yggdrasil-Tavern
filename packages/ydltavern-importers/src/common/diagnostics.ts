export type ImportDiagnosticSeverity = 'warning';

export interface ImportDiagnostic {
  readonly severity: ImportDiagnosticSeverity;
  readonly message: string;
  readonly path?: string;
}
