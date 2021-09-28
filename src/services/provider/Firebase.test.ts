import { FirebaseProvider } from './Firebase';

describe('FirebaseProvider', () => {
  test('createFirmwareFilename', () => {
    const keyboardName = 'keyboard-name-1';
    const firmwareFile = new File([], 'firmware-file-1.hex');
    const timestamp = 12345;
    const actual = FirebaseProvider.createFirmwareFilename(
      keyboardName,
      firmwareFile,
      timestamp
    );
    expect(actual).toEqual('keyboard-name-1-12345.hex');
  });
});
