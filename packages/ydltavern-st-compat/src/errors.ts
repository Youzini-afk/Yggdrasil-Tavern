export class YdlTavernNotImplementedError extends Error {
  public readonly code: string;

  public readonly source: string;

  public constructor(source: string, code = 'ERR_YDLTAVERN_NOT_IMPLEMENTED') {
    super(`${source} is not implemented in the YdlTavern ST compatibility runtime`);
    this.name = 'YdlTavernNotImplementedError';
    this.code = code;
    this.source = source;
  }
}
