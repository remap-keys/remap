import {
  FirmwareType,
  ID_REMAP_IDENTIFY,
  REMAP_COMMAND_ID_OFFSET,
  REMAP_MAGIC,
  RemapIdentifyCommand,
} from './FirmwareDetection';

describe('FirmwareDetection', () => {
  describe('constants', () => {
    test('ID_REMAP_IDENTIFY is 0x80', () => {
      expect(ID_REMAP_IDENTIFY).toBe(0x80);
    });

    test('REMAP_COMMAND_ID_OFFSET is 0x80', () => {
      expect(REMAP_COMMAND_ID_OFFSET).toBe(0x80);
    });

    test('REMAP_MAGIC spells "RMP" in ASCII', () => {
      expect(REMAP_MAGIC).toEqual([0x52, 0x4d, 0x50]);
      expect(String.fromCharCode(...REMAP_MAGIC)).toBe('RMP');
    });
  });

  describe('RemapIdentifyCommand', () => {
    function makeCommand() {
      return new RemapIdentifyCommand({}, async () => {});
    }

    test('createReport sends only the identify byte', () => {
      const cmd = makeCommand();
      const report = cmd.createReport();
      expect(report[0]).toBe(ID_REMAP_IDENTIFY);
    });

    test('createResponse detects REMAP firmware from RMP magic', () => {
      const cmd = makeCommand();
      // [0x80, 'R', 'M', 'P', 0x00, 0x01, ...]
      const response = new Uint8Array([
        0x80, 0x52, 0x4d, 0x50, 0x00, 0x01, 0x00, 0x00,
      ]);
      const result = cmd.createResponse(response);
      expect(result.firmwareType).toBe(FirmwareType.REMAP);
      expect(result.remapProtocolVersion).toBe(0x0001);
    });

    test('createResponse decodes the protocol version as big-endian uint16', () => {
      const cmd = makeCommand();
      const response = new Uint8Array([
        0x80, 0x52, 0x4d, 0x50, 0x12, 0x34, 0x00, 0x00,
      ]);
      const result = cmd.createResponse(response);
      expect(result.remapProtocolVersion).toBe(0x1234);
    });

    test('createResponse treats id_unhandled (0xFF) as VIA firmware', () => {
      const cmd = makeCommand();
      const response = new Uint8Array([0xff, 0x00, 0x00, 0x00]);
      const result = cmd.createResponse(response);
      expect(result.firmwareType).toBe(FirmwareType.VIA);
      expect(result.remapProtocolVersion).toBeUndefined();
    });

    test('createResponse treats a partial/garbled 0x80 response as VIA (magic mismatch)', () => {
      const cmd = makeCommand();
      // First byte matches but magic does not — do not claim REMAP.
      const response = new Uint8Array([0x80, 0x00, 0x00, 0x00, 0x00, 0x00]);
      const result = cmd.createResponse(response);
      expect(result.firmwareType).toBe(FirmwareType.VIA);
    });

    test('isSameRequest accepts REMAP identify echo (0x80)', () => {
      const cmd = makeCommand();
      expect(cmd.isSameRequest(new Uint8Array([0x80, 0, 0, 0]))).toBe(true);
    });

    test('isSameRequest accepts id_unhandled (0xFF) from VIA firmware', () => {
      const cmd = makeCommand();
      expect(cmd.isSameRequest(new Uint8Array([0xff, 0, 0, 0]))).toBe(true);
    });

    test('isSameRequest rejects unrelated command echoes', () => {
      const cmd = makeCommand();
      expect(cmd.isSameRequest(new Uint8Array([0x01, 0, 0, 0]))).toBe(false);
      expect(cmd.isSameRequest(new Uint8Array([0x11, 0, 0, 0]))).toBe(false);
    });
  });
});

export {};
