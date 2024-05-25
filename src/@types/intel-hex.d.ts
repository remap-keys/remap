declare module 'intel-hex' {
  interface ParseResult {
    data: Buffer;
    startSegmentAddress: number;
    starLinearAddress: number;
  }

  export function parse(
    data: Buffer | string,
    bufferSize?: number,
  ): ParseResult;
}
