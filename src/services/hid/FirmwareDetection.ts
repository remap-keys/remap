import {
  ICommandRequest,
  ICommandResponse,
  ICommandResponseHandler,
} from './WebHid';
import { AbstractCommand } from './Commands';

/**
 * Firmware kind reported by RemapIdentifyCommand.
 *
 * - `VIA`   — Standard VIA-compatible firmware (default; no offset applied).
 * - `REMAP` — Remap-native firmware that answers the identify command with
 *             the RMP magic. All VIA-equivalent command IDs are shifted by
 *             `REMAP_COMMAND_ID_OFFSET` on this firmware.
 */
export const FirmwareType = {
  VIA: 'VIA',
  REMAP: 'REMAP',
} as const;
// eslint-disable-next-line no-redeclare
export type FirmwareType = (typeof FirmwareType)[keyof typeof FirmwareType];

/**
 * REMAP firmware identifies itself by responding to command id `0x80` with
 * these three ASCII magic bytes ('R', 'M', 'P') followed by a 16-bit
 * big-endian REMAP protocol version.
 */
export const ID_REMAP_IDENTIFY = 0x80;
export const REMAP_MAGIC: readonly [number, number, number] = [
  0x52, // 'R'
  0x4d, // 'M'
  0x50, // 'P'
];

/**
 * All VIA-equivalent command IDs are shifted by this offset when talking to
 * REMAP firmware, so that REMAP occupies the `0x80–0xEF` range and never
 * collides with VIA's `0x00–0x7F` range.
 */
export const REMAP_COMMAND_ID_OFFSET = 0x80;

/**
 * VIA's `id_unhandled` sentinel byte — returned as the first byte when the
 * firmware does not know a command. VIA firmware will return this in
 * response to an `ID_REMAP_IDENTIFY` request.
 */
const ID_UNHANDLED = 0xff;

export interface IRemapIdentifyRequest extends ICommandRequest {}

export interface IRemapIdentifyResponse extends ICommandResponse {
  firmwareType: FirmwareType;
  /** Only present when `firmwareType === REMAP`. Big-endian uint16. */
  remapProtocolVersion?: number;
}

/**
 * Sends the REMAP identify probe. This command is intentionally *not*
 * subject to `commandIdOffset` — its purpose is to determine the offset
 * itself. On REMAP firmware the response is `[0x80, 'R', 'M', 'P', vh, vl,
 * ...]`; on VIA firmware it is `[0xFF, ...]` (id_unhandled).
 */
export class RemapIdentifyCommand extends AbstractCommand<
  IRemapIdentifyRequest,
  IRemapIdentifyResponse
> {
  createReport(): Uint8Array {
    return new Uint8Array([ID_REMAP_IDENTIFY]);
  }

  createResponse(resultArray: Uint8Array): IRemapIdentifyResponse {
    if (
      resultArray[0] === ID_REMAP_IDENTIFY &&
      resultArray[1] === REMAP_MAGIC[0] &&
      resultArray[2] === REMAP_MAGIC[1] &&
      resultArray[3] === REMAP_MAGIC[2]
    ) {
      const remapProtocolVersion = (resultArray[4] << 8) | resultArray[5];
      return {
        firmwareType: FirmwareType.REMAP,
        remapProtocolVersion,
      };
    }
    return { firmwareType: FirmwareType.VIA };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    return (
      resultArray[0] === ID_REMAP_IDENTIFY || resultArray[0] === ID_UNHANDLED
    );
  }
}

export interface IDetectFirmwareResult {
  success: boolean;
  error?: string;
  cause?: any;
  firmwareType?: FirmwareType;
  remapProtocolVersion?: number;
}

export function buildResponseHandler(
  resolve: (result: IDetectFirmwareResult) => void
): ICommandResponseHandler<IRemapIdentifyResponse> {
  return async (result) => {
    if (result.success) {
      resolve({
        success: true,
        firmwareType: result.response!.firmwareType,
        remapProtocolVersion: result.response!.remapProtocolVersion,
      });
    } else {
      resolve({
        success: false,
        error: result.error,
        cause: result.cause,
      });
    }
  };
}
