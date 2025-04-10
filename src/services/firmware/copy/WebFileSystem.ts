import {
  errorResultOf,
  IEmptyResult,
  IResult,
  successResult,
} from '../../../types';
import { IBootloader } from '../Bootloader';
import {
  FirmwareWriterPhaseListener,
  FirmwareWriterProgressListener,
} from '../FirmwareWriter';

export class WebFileSystem implements IBootloader {
  private directoryHandle: any | undefined;

  constructor() {
    this.directoryHandle = undefined;
  }

  async open(): Promise<IEmptyResult> {
    try {
      this.directoryHandle = await window.showDirectoryPicker({
        mode: 'readwrite',
      });
      return successResult();
    } catch (error) {
      return errorResultOf(`Opening a directory failed: ${error}`, error);
    }
  }

  async read(
    _size: number,
    _progress: FirmwareWriterProgressListener,
    _phase: FirmwareWriterPhaseListener
  ): Promise<IResult<{ bytes: Uint8Array }>> {
    throw new Error('This method never be called.');
  }

  async verify(
    _bytes: Uint8Array,
    _progress: FirmwareWriterProgressListener,
    _phase: FirmwareWriterPhaseListener
  ): Promise<IEmptyResult> {
    throw new Error('This method never be called.');
  }

  async write(
    flashBytes: Uint8Array,
    _eepromBytes: Uint8Array | null,
    progress: FirmwareWriterProgressListener,
    phase: FirmwareWriterPhaseListener
  ): Promise<IEmptyResult> {
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
      return successResult();
    } catch (error) {
      return errorResultOf(
        `Writing firmware to a file failed: ${error}`,
        error
      );
    }
  }
}
