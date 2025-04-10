import { IBootloader } from '../Bootloader';
import {
  FirmwareWriterPhaseListener,
  FirmwareWriterProgressListener,
} from '../FirmwareWriter';
import { FirmwareFlashType, IMcu, MCU } from '../Types';
import { ISerial } from '../serial/Serial';
import {
  ExitCommand,
  FetchAutoAddressIncrementSupportCommand,
  FetchBufferAccessCommand,
  FetchBufferSizeCommand,
  FetchDeviceTypeCommand,
  FetchExtendedFuseBitsCommand,
  FetchHighFuseBitsCommand,
  FetchLockBitsCommand,
  FetchLowFuseBitsCommand,
  FetchProgramTypeCommand,
  FetchBytesFromMemoryCommand,
  FetchRevisionNumberCommand,
  FetchSignatureCommand,
  FetchSoftwareIdentifierCommand,
  FetchVersionNumberCommand,
  SetAddressCommand,
  SetDeviceTypeCommand,
  EnterProgramModeCommand,
  LeaveProgramModeCommand,
  ClearApplicationSectionOfFlashCommand,
  WriteBytesToMemoryCommand,
} from './CaterinaCommands';
import { concatUint8Array } from '../../../utils/ArrayUtils';
import {
  errorResultOf,
  IEmptyResult,
  IResult,
  isError,
  isSuccessful,
  successResult,
  successResultOf,
} from '../../../types';
import { ICommandResponse } from '../Command';

export class CaterinaBootloader implements IBootloader {
  private readonly serial: ISerial;

  constructor(serial: ISerial) {
    this.serial = serial;
  }

  private async fetchAndCheckBootloaderInformation(
    progress: FirmwareWriterProgressListener
  ): Promise<IResult<{ bufferSize: number }>> {
    progress('Fetching the Software Identifier.');
    const softwareIdentifierResult =
      await new FetchSoftwareIdentifierCommand().writeRequest(this.serial);
    if (isError(softwareIdentifierResult)) {
      return softwareIdentifierResult;
    }
    const softwareIdentifier =
      softwareIdentifierResult.value.response.softwareIdentifier;
    progress(`The software identifier: ${softwareIdentifier}`);
    if (softwareIdentifier !== 'CATERIN') {
      return errorResultOf(
        `The software identifier is not 'CATERIN': ${softwareIdentifier}`
      );
    }

    progress('Fetching the version information.');
    const versionNumberResult =
      await new FetchVersionNumberCommand().writeRequest(this.serial);
    if (isError(versionNumberResult)) {
      return versionNumberResult;
    }
    const versionNumber = versionNumberResult.value.response.versionNumber;
    if (versionNumber !== '?'.charCodeAt(0)) {
      const revisionNumberResult =
        await new FetchRevisionNumberCommand().writeRequest(this.serial);
      if (isError(revisionNumberResult)) {
        return revisionNumberResult;
      }
      const revisionNumber = revisionNumberResult.value.response.revisionNumber;
      progress(`The hardware version: ${versionNumber}.${revisionNumber}`);
    } else {
      progress(
        `The hardware version is unknown: ${String.fromCharCode(versionNumber)}`
      );
    }

    progress('Fetching the program type.');
    const programTypeResult = await new FetchProgramTypeCommand().writeRequest(
      this.serial
    );
    if (isError(programTypeResult)) {
      return programTypeResult;
    }
    const programType = programTypeResult.value.response.programType;
    progress(`The program type: ${programType}`);

    progress('Fetching the auto address increment support.');
    const autoAddressIncrementSupportResult =
      await new FetchAutoAddressIncrementSupportCommand().writeRequest(
        this.serial
      );
    if (isError(autoAddressIncrementSupportResult)) {
      return autoAddressIncrementSupportResult;
    }
    const autoAddressIncrementSupport =
      autoAddressIncrementSupportResult.value.response
        .autoAddressIncrementSupport;
    progress(
      `The auto address increment support: ${autoAddressIncrementSupport}`
    );

    progress('Fetching the buffer access.');
    const bufferAccessResult =
      await new FetchBufferAccessCommand().writeRequest(this.serial);
    if (isError(bufferAccessResult)) {
      return bufferAccessResult;
    }
    const bufferAccess = bufferAccessResult.value.response.bufferAccess;
    if (!bufferAccess) {
      return errorResultOf('The buffer access is not supported.');
    }
    progress('The buffer access is supported.');

    progress('Fetching the buffer size.');
    const bufferSizeResult = await new FetchBufferSizeCommand().writeRequest(
      this.serial
    );
    if (isError(bufferSizeResult)) {
      return bufferSizeResult;
    }
    const bufferSize = bufferSizeResult.value.response.bufferSize;
    progress(`The buffer size: ${bufferSize}`);

    progress('Fetching the device type.');
    const deviceTypeResult = await new FetchDeviceTypeCommand().writeRequest(
      this.serial
    );
    if (isError(deviceTypeResult)) {
      return deviceTypeResult;
    }
    const deviceType = deviceTypeResult.value.response.deviceType;
    progress(`The device type: ${deviceType}`);

    const skipReadBytesResult = await this.serial.skipBytesUntilNonZero(1000);
    if (isError(skipReadBytesResult)) {
      return skipReadBytesResult;
    }

    progress(`Set the device type: ${deviceType}`);
    const setDeviceTypeResult = await new SetDeviceTypeCommand({
      deviceType,
    }).writeRequest(this.serial);
    if (isError(setDeviceTypeResult)) {
      return setDeviceTypeResult;
    }

    progress('Fetching the Extended FUSE Bits.');
    const extendedFuseBitsResult =
      await new FetchExtendedFuseBitsCommand().writeRequest(this.serial);
    if (isError(extendedFuseBitsResult)) {
      return extendedFuseBitsResult;
    }
    const extendedFuseBits =
      extendedFuseBitsResult.value.response.extendedFuseBits;
    progress(`The Extended Fuse Bits: ${extendedFuseBits.toString(16)}`);

    progress('Fetching the Low Fuse Bits.');
    const lowFuseBitsResult = await new FetchLowFuseBitsCommand().writeRequest(
      this.serial
    );
    if (isError(lowFuseBitsResult)) {
      return lowFuseBitsResult;
    }
    const lowFuseBits = lowFuseBitsResult.value.response.lowFuseBits;
    progress(`The Low Fuse Bits: ${lowFuseBits.toString(16)}`);

    progress('Fetching the High Fuse Bits.');
    const highFuseBitsResult =
      await new FetchHighFuseBitsCommand().writeRequest(this.serial);
    if (isError(highFuseBitsResult)) {
      return highFuseBitsResult;
    }
    const highFuseBits = highFuseBitsResult.value.response.highFuseBits;
    progress(`The High Fuse Bits: ${highFuseBits.toString(16)}`);

    progress('Fetching the Lock Bits.');
    const lockBitsResult = await new FetchLockBitsCommand().writeRequest(
      this.serial
    );
    if (isError(lockBitsResult)) {
      return lockBitsResult;
    }
    const lockBits = lockBitsResult.value.response.lockBits;
    progress(`The Lock Bits: ${lockBits.toString(16)}`);

    progress('The caterina bootloader is valid.');

    return successResultOf({
      bufferSize,
    });
  }

  private async fetchSignature(
    progress: FirmwareWriterProgressListener
  ): Promise<IResult<{ signature: number }>> {
    progress('Fetch the signature.');
    const signatureResult = await new FetchSignatureCommand().writeRequest(
      this.serial
    );
    if (isSuccessful(signatureResult)) {
      progress(`The signature: ${signatureResult.value.response.signature}`);
      return successResultOf({
        signature: signatureResult.value.response.signature,
      });
    } else {
      return signatureResult;
    }
  }

  private async initialize(progress: FirmwareWriterProgressListener): Promise<
    IResult<{
      bufferSize: number;
      mcu: IMcu;
    }>
  > {
    progress('Initialize a bootloader.');
    const detectResult =
      await this.fetchAndCheckBootloaderInformation(progress);
    if (isError(detectResult)) {
      progress('Caterina bootloader is not detected.');
      return detectResult;
    }
    const signatureResult = await this.fetchSignature(progress);
    if (isError(signatureResult)) {
      return signatureResult;
    }
    const signature = signatureResult.value.signature;
    if (signature === MCU.atmega32u4.signature) {
      progress('ATmega32u4 detected.');
      return successResultOf({
        mcu: MCU.atmega32u4,
        bufferSize: detectResult.value.bufferSize,
      });
    } else {
      return errorResultOf('Unknown MCU detected.');
    }
  }

  private async setAddress(
    address: number,
    progress: FirmwareWriterProgressListener
  ): Promise<IResult<{ response: ICommandResponse }>> {
    progress(`Set the address: ${address}`);
    return await new SetAddressCommand({ address }).writeRequest(this.serial);
  }

  private async readBytesFromFlashMemory(
    size: number,
    flashType: FirmwareFlashType,
    bufferSize: number,
    progress: FirmwareWriterProgressListener
  ): Promise<IResult<{ bytes: Uint8Array }>> {
    let address = 0;
    const setAddressResult = await this.setAddress(address, progress);
    if (isError(setAddressResult)) {
      return setAddressResult;
    }
    progress(`Start reading ${size} bytes from the memory.`);
    let bytes: Uint8Array = new Uint8Array();
    progress('');
    while (address < size) {
      const readBytesFromMemoryResult = await new FetchBytesFromMemoryCommand({
        flashType,
        bufferSize,
      }).writeRequest(this.serial);
      if (isError(readBytesFromMemoryResult)) {
        return readBytesFromMemoryResult;
      }
      bytes = concatUint8Array(
        bytes,
        readBytesFromMemoryResult.value.response.bytes
      );
      address += readBytesFromMemoryResult.value.response.blockSize;
      progress('.', false);
    }
    progress('Reading bytes from the memory completed.');
    return successResultOf({
      bytes,
    });
  }

  private async verifyBytesAndMemory(
    bytes: Uint8Array,
    bufferSize: number,
    flashType: FirmwareFlashType,
    progress: FirmwareWriterProgressListener
  ): Promise<IEmptyResult> {
    progress(`Start verifying ${bytes.byteLength} bytes against the memory.`);
    const readResult = await this.readBytesFromFlashMemory(
      bytes.byteLength,
      flashType,
      bufferSize,
      progress
    );
    if (isError(readResult)) {
      return readResult;
    }
    const bytesFromMcu = readResult.value.bytes;
    for (let i = 0; i < bytes.byteLength; i++) {
      if (bytes[i] !== bytesFromMcu[i]) {
        return errorResultOf(
          `Verification failed: Position:${i} Local:${bytes[i]} MCU:${bytesFromMcu[i]}`
        );
      }
    }
    progress('Verifying bytes against the memory completed.');
    return successResult();
  }

  private async writeBytesToFlashMemory(
    bytes: Uint8Array,
    bufferSize: number,
    flashType: FirmwareFlashType,
    progress: FirmwareWriterProgressListener
  ): Promise<IEmptyResult> {
    let address = 0;
    const setAddressResult = await this.setAddress(address, progress);
    if (isError(setAddressResult)) {
      return setAddressResult;
    }
    progress(`Start writing ${bytes.byteLength} bytes to the memory.`);
    let blockSize;
    if (flashType === 'flash') {
      blockSize = bufferSize;
    } else if (flashType === 'eeprom') {
      blockSize = 1;
    } else {
      throw new Error(`Unknown flash type: ${flashType}`);
    }
    progress('');
    while (address < bytes.byteLength) {
      if (bytes.byteLength - address < bufferSize) {
        blockSize = bytes.byteLength - address;
      }
      const writeBytesToMemoryResult = await new WriteBytesToMemoryCommand({
        bytes: bytes.slice(address, address + blockSize),
        flashType,
        blockSize,
      }).writeRequest(this.serial);
      if (isError(writeBytesToMemoryResult)) {
        return writeBytesToMemoryResult;
      }
      address += blockSize;
      progress('.', false);
    }
    progress('Writing bytes to the memory completed.');
    return successResult();
  }

  private async exit(): Promise<IResult<{ response: ICommandResponse }>> {
    return await new ExitCommand().writeRequest(this.serial);
  }

  private async enterProgramMode(): Promise<
    IResult<{ response: ICommandResponse }>
  > {
    return await new EnterProgramModeCommand().writeRequest(this.serial);
  }

  private async leaveProgramMode(): Promise<
    IResult<{ response: ICommandResponse }>
  > {
    return await new LeaveProgramModeCommand().writeRequest(this.serial);
  }

  private async clearApplicationSectionOfFlash(
    progress: FirmwareWriterProgressListener
  ): Promise<IResult<{ response: ICommandResponse }>> {
    progress('Clearing the application section of the flash memory.');
    return await new ClearApplicationSectionOfFlashCommand().writeRequest(
      this.serial
    );
  }

  async read(
    size: number = 0,
    progress: FirmwareWriterProgressListener,
    phase: FirmwareWriterPhaseListener
  ): Promise<IResult<{ bytes: Uint8Array }>> {
    try {
      const initializeResult = await this.initialize(progress);
      if (isError(initializeResult)) {
        return initializeResult;
      }
      phase('initialized');
      const mcu = initializeResult.value.mcu;
      const flashMemorySize =
        size === 0 ? mcu.flashMemorySize : Math.min(mcu.flashMemorySize, size);
      const readBytesFromFlashMemoryResult =
        await this.readBytesFromFlashMemory(
          flashMemorySize,
          'flash',
          initializeResult.value.bufferSize,
          progress
        );
      if (isError(readBytesFromFlashMemoryResult)) {
        return readBytesFromFlashMemoryResult;
      }
      phase('read');
      const exitResult = await this.exit();
      if (isError(exitResult)) {
        return exitResult;
      }
      return successResultOf({
        bytes: readBytesFromFlashMemoryResult.value.bytes,
      });
    } finally {
      await this.serial.close();
      phase('closed');
    }
  }

  async verify(
    bytes: Uint8Array,
    progress: FirmwareWriterProgressListener,
    phase: FirmwareWriterPhaseListener
  ): Promise<IEmptyResult> {
    try {
      const initializeResult = await this.initialize(progress);
      if (isError(initializeResult)) {
        return initializeResult;
      }
      phase('initialized');
      const mcu = initializeResult.value.mcu;
      if (mcu.bootAddress < bytes.byteLength) {
        return errorResultOf(
          `Firmware binary file size too large: MCU Boot Address: ${mcu.bootAddress} Firmware Size: ${bytes.byteLength}`
        );
      }
      const verifyResult = await this.verifyBytesAndMemory(
        bytes,
        initializeResult.value.bufferSize,
        'flash',
        progress
      );
      if (isError(verifyResult)) {
        return verifyResult;
      }
      phase('verified');
      const exitResult = await this.exit();
      if (isError(exitResult)) {
        return exitResult;
      }
      return successResult();
    } finally {
      await this.serial.close();
      phase('closed');
    }
  }

  async write(
    flashBytes: Uint8Array,
    eepromBytes: Uint8Array | null,
    progress: FirmwareWriterProgressListener,
    phase: FirmwareWriterPhaseListener
  ): Promise<IEmptyResult> {
    try {
      const initializeResult = await this.initialize(progress);
      if (isError(initializeResult)) {
        return initializeResult;
      }
      phase('initialized');
      const mcu = initializeResult.value.mcu;
      if (mcu.bootAddress < flashBytes.byteLength) {
        return errorResultOf(
          `Firmware flash binary file size too large: MCU Boot Address: ${mcu.bootAddress} Binary Size: ${flashBytes.byteLength}`
        );
      }
      if (eepromBytes) {
        if (mcu.eepromSize < eepromBytes.byteLength) {
          return errorResultOf(
            `Firmware eeprom binary file size too large: EEPROM size: ${mcu.eepromSize} Binary Size: ${eepromBytes.byteLength}`
          );
        }
      }

      const enterProgramModeResult = await this.enterProgramMode();
      if (isError(enterProgramModeResult)) {
        return enterProgramModeResult;
      }

      const clearApplicationSectionOfFlashResult =
        await this.clearApplicationSectionOfFlash(progress);
      if (isError(clearApplicationSectionOfFlashResult)) {
        return clearApplicationSectionOfFlashResult;
      }
      phase('cleared');

      const writeBytesToMemoryResult = await this.writeBytesToFlashMemory(
        flashBytes,
        initializeResult.value.bufferSize,
        'flash',
        progress
      );
      if (isError(writeBytesToMemoryResult)) {
        return writeBytesToMemoryResult;
      }
      phase('wrote');

      const verifyResult = await this.verifyBytesAndMemory(
        flashBytes,
        initializeResult.value.bufferSize,
        'flash',
        progress
      );
      if (isError(verifyResult)) {
        return verifyResult;
      }
      phase('verified');

      if (eepromBytes) {
        const writeBytesToMemoryResult = await this.writeBytesToFlashMemory(
          eepromBytes,
          initializeResult.value.bufferSize,
          'eeprom',
          progress
        );
        if (isError(writeBytesToMemoryResult)) {
          return writeBytesToMemoryResult;
        }
        phase('wrote');

        const verifyResult = await this.verifyBytesAndMemory(
          eepromBytes,
          initializeResult.value.bufferSize,
          'eeprom',
          progress
        );
        if (isError(verifyResult)) {
          return verifyResult;
        }
        phase('verified');
      }

      const leaveProgramModeResult = await this.leaveProgramMode();
      if (isError(leaveProgramModeResult)) {
        return leaveProgramModeResult;
      }

      const exitResult = await this.exit();
      if (isError(exitResult)) {
        return exitResult;
      }
      return successResult();
    } finally {
      await this.serial.close();
      phase('closed');
    }
  }
}
