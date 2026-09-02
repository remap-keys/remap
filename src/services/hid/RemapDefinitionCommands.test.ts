import {
  ID_REMAP_GET_DEFINITION_CHUNK,
  ID_REMAP_GET_DEFINITION_SIZE,
  REMAP_DEFINITION_CHUNK_MAX_SIZE,
  RemapGetDefinitionChunkCommand,
  RemapGetDefinitionSizeCommand,
} from './RemapDefinitionCommands';

describe('RemapGetDefinitionSizeCommand', () => {
  function makeCommand() {
    return new RemapGetDefinitionSizeCommand({}, async () => {});
  }

  test('createReport sends only the command id byte', () => {
    const cmd = makeCommand();
    const report = cmd.createReport();
    expect(report[0]).toBe(ID_REMAP_GET_DEFINITION_SIZE);
    expect(ID_REMAP_GET_DEFINITION_SIZE).toBe(0x96);
  });

  test('createResponse decodes the total size as big-endian uint32', () => {
    const cmd = makeCommand();
    // [0x96, 0x00, 0x00, 0x04, 0x56, ...] → 1110
    const response = new Uint8Array([0x96, 0x00, 0x00, 0x04, 0x56, 0x00]);
    expect(cmd.createResponse(response)).toEqual({ totalSize: 1110 });
  });

  test('createResponse handles a top-bit-set uint32 without becoming negative', () => {
    const cmd = makeCommand();
    // 0x80000001 = 2147483649 as unsigned; JS <<24 would produce -2147483647
    const response = new Uint8Array([0x96, 0x80, 0x00, 0x00, 0x01]);
    expect(cmd.createResponse(response).totalSize).toBe(0x80000001);
  });

  test('isSameRequest accepts only echoes with id 0x96', () => {
    const cmd = makeCommand();
    expect(cmd.isSameRequest(new Uint8Array([0x96, 0, 0, 0]))).toBe(true);
    expect(cmd.isSameRequest(new Uint8Array([0x97, 0, 0, 0]))).toBe(false);
    expect(cmd.isSameRequest(new Uint8Array([0xff, 0, 0, 0]))).toBe(false);
  });
});

describe('RemapGetDefinitionChunkCommand', () => {
  function makeCommand(offset: number, requestedSize: number) {
    return new RemapGetDefinitionChunkCommand(
      { offset, requestedSize },
      async () => {}
    );
  }

  test('exposes REMAP_DEFINITION_CHUNK_MAX_SIZE as 28', () => {
    expect(REMAP_DEFINITION_CHUNK_MAX_SIZE).toBe(28);
  });

  test('createReport encodes offset as big-endian uint16 and requested size as byte', () => {
    const cmd = makeCommand(0x1234, 20);
    const report = cmd.createReport();
    expect(report[0]).toBe(ID_REMAP_GET_DEFINITION_CHUNK);
    expect(report[0]).toBe(0x97);
    expect(report[1]).toBe(0x12); // offset high
    expect(report[2]).toBe(0x34); // offset low
    expect(report[3]).toBe(20);
  });

  test('createReport encodes zero offset correctly', () => {
    const cmd = makeCommand(0, REMAP_DEFINITION_CHUNK_MAX_SIZE);
    const report = cmd.createReport();
    expect(report[1]).toBe(0x00);
    expect(report[2]).toBe(0x00);
    expect(report[3]).toBe(28);
  });

  test('createResponse extracts offset, actualSize, and data slice', () => {
    const cmd = makeCommand(0x0100, 28);
    // [0x97, 0x01, 0x00, 5, 'H','e','l','l','o', ...]
    const response = new Uint8Array([
      0x97, 0x01, 0x00, 5, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0, 0, 0,
    ]);
    const parsed = cmd.createResponse(response);
    expect(parsed.offset).toBe(0x0100);
    expect(parsed.actualSize).toBe(5);
    expect(Array.from(parsed.data)).toEqual([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
    expect(new TextDecoder().decode(parsed.data)).toBe('Hello');
  });

  test('createResponse handles zero actualSize (EOF marker)', () => {
    const cmd = makeCommand(0x1000, 28);
    const response = new Uint8Array([0x97, 0x10, 0x00, 0, 0, 0]);
    const parsed = cmd.createResponse(response);
    expect(parsed.actualSize).toBe(0);
    expect(parsed.data.length).toBe(0);
  });

  test('isSameRequest matches only responses with the same offset echo', () => {
    const cmd = makeCommand(0x0042, 28);
    expect(cmd.isSameRequest(new Uint8Array([0x97, 0x00, 0x42, 5, 0]))).toBe(
      true
    );
    expect(cmd.isSameRequest(new Uint8Array([0x97, 0x00, 0x43, 5, 0]))).toBe(
      false
    );
    expect(cmd.isSameRequest(new Uint8Array([0x96, 0x00, 0x42, 5, 0]))).toBe(
      false
    );
  });
});

export {};
