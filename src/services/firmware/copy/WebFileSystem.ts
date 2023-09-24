import { IBootloader, IBootloaderReadResult } from '../Bootloader';
import {
  FirmwareWriterPhaseListener,
  FirmwareWriterProgressListener,
} from '../FirmwareWriter';
import { IResult } from '../Types';

export class WebFileSystem implements IBootloader {
  private directoryHandle: any | undefined;

  constructor() {
    this.directoryHandle = undefined;
  }

  async open(): Promise<IResult> {
    try {
      this.directoryHandle = await window.showDirectoryPicker({
        mode: 'readwrite',
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: `Opening a directory failed: ${error}`,
        cause: error,
      };
    }
  }

  async read(
    // eslint-disable-next-line no-unused-vars
    size: number,
    // eslint-disable-next-line no-unused-vars
    progress: FirmwareWriterProgressListener,
    // eslint-disable-next-line no-unused-vars
    phase: FirmwareWriterPhaseListener
  ): Promise<IBootloaderReadResult> {
    throw new Error('This method never be called.');
  }

  async verify(
    // eslint-disable-next-line no-unused-vars
    bytes: Uint8Array,
    // eslint-disable-next-line no-unused-vars
    progress: FirmwareWriterProgressListener,
    // eslint-disable-next-line no-unused-vars
    phase: FirmwareWriterPhaseListener
  ): Promise<IResult> {
    throw new Error('This method never be called.');
  }

  async write(
    flashBytes: Uint8Array,
    // eslint-disable-next-line no-unused-vars
    eepromBytes: Uint8Array | null,
    progress: FirmwareWriterProgressListener,
    phase: FirmwareWriterPhaseListener
  ): Promise<IResult> {
    if (this.directoryHandle === undefined) {
      throw new Error('A target directory is not opened.');
    }
    try {
      progress('Start writing firmware to a file.');
      const fileHandle = await this.directoryHandle.getFileHandle(
        'firmware.uf2',
        { create: true }
      );
      const writable = await fileHandle.createWritable();
      await writable.write(flashBytes);
      await writable.close();
      progress('Writing firmware to a file is completed.');
      phase('wrote');
      this.directoryHandle = undefined;
      phase('closed');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: `Writing firmware to a file failed: ${error}`,
        cause: error,
      };
    }
  }
}
