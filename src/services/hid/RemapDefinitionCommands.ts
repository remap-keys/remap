import { ICommandRequest, ICommandResponse } from './WebHid';
import { AbstractCommand } from './Commands';

/**
 * Commands used to fetch the keyboard definition JSON embedded in REMAP
 * firmware. These command ids live in the REMAP-native `0x80–0xEF` range
 * and are therefore never subject to `commandIdOffset` — they are sent
 * as-is on REMAP firmware only.
 */

export const ID_REMAP_GET_DEFINITION_SIZE = 0x96;
export const ID_REMAP_GET_DEFINITION_CHUNK = 0x97;

/**
 * Maximum number of JSON bytes the firmware can return in a single chunk
 * response. The raw HID buffer is 32 bytes and the chunk response uses the
 * first 4 for header (id, offset_hi, offset_lo, actual_size), leaving 28
 * bytes for payload.
 */
export const REMAP_DEFINITION_CHUNK_MAX_SIZE = 28;

export interface IRemapGetDefinitionSizeRequest extends ICommandRequest {}

export interface IRemapGetDefinitionSizeResponse extends ICommandResponse {
  /** Total number of bytes in the embedded JSON, as a 32-bit big-endian value. */
  totalSize: number;
}

/**
 * Sends `[0x96, ...]` and parses the response `[0x96, b3, b2, b1, b0, ...]`
 * where `b3..b0` form a big-endian uint32 total size.
 */
export class RemapGetDefinitionSizeCommand extends AbstractCommand<
  IRemapGetDefinitionSizeRequest,
  IRemapGetDefinitionSizeResponse
> {
  createReport(): Uint8Array {
    return new Uint8Array([ID_REMAP_GET_DEFINITION_SIZE]);
  }

  createResponse(resultArray: Uint8Array): IRemapGetDefinitionSizeResponse {
    const totalSize =
      (resultArray[1] << 24) |
      (resultArray[2] << 16) |
      (resultArray[3] << 8) |
      resultArray[4];
    // Force unsigned interpretation in case the top bit is set.
    return { totalSize: totalSize >>> 0 };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    return resultArray[0] === ID_REMAP_GET_DEFINITION_SIZE;
  }
}

export interface IRemapGetDefinitionChunkRequest extends ICommandRequest {
  /** Byte offset into the embedded JSON, 0-based, uint16 big-endian on the wire. */
  offset: number;
  /** Number of bytes requested (1 to REMAP_DEFINITION_CHUNK_MAX_SIZE). */
  requestedSize: number;
}

export interface IRemapGetDefinitionChunkResponse extends ICommandResponse {
  offset: number;
  /** Number of bytes actually returned by the firmware. */
  actualSize: number;
  data: Uint8Array;
}

/**
 * Sends `[0x97, offset_hi, offset_lo, requested_size, ...]` and parses the
 * response `[0x97, offset_hi, offset_lo, actual_size, ...JSON bytes]`. EOF
 * is signalled by `offset + actualSize >= totalSize`; the caller decides
 * when to stop.
 */
export class RemapGetDefinitionChunkCommand extends AbstractCommand<
  IRemapGetDefinitionChunkRequest,
  IRemapGetDefinitionChunkResponse
> {
  createReport(): Uint8Array {
    const { offset, requestedSize } = this.getRequest();
    return new Uint8Array([
      ID_REMAP_GET_DEFINITION_CHUNK,
      (offset >> 8) & 0xff,
      offset & 0xff,
      requestedSize & 0xff,
    ]);
  }

  createResponse(resultArray: Uint8Array): IRemapGetDefinitionChunkResponse {
    const offset = (resultArray[1] << 8) | resultArray[2];
    const actualSize = resultArray[3];
    const data = resultArray.slice(4, 4 + actualSize);
    return { offset, actualSize, data };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    const { offset } = this.getRequest();
    return (
      resultArray[0] === ID_REMAP_GET_DEFINITION_CHUNK &&
      resultArray[1] === ((offset >> 8) & 0xff) &&
      resultArray[2] === (offset & 0xff)
    );
  }
}
