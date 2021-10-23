import { AbstractBootloader, IBootloaderReadResult } from '../Bootloader';
import {
  FirmwareWriterPhaseListener,
  FirmwareWriterProgressListener,
} from '../FirmwareWriter';
import { FirmwareFlashType, IMcu, IResult, MCU } from '../Types';
import { ISerial } from '../Serial';
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

export class CaterinaBootloader extends AbstractBootloader {
  constructor(serial: ISerial) {
    super(serial);
  }

  private async fetchAndCheckBootloaderInformation(
    progress: FirmwareWriterProgressListener
  ): Promise<{
    success: boolean;
    error?: string;
    cause?: any;
    bufferSize?: number;
  }> {
    progress('Fetching the Software Identifier.');
    const softwareIdentifierResult = await new FetchSoftwareIdentifierCommand().writeRequest(
      this.serial
    );
    if (!softwareIdentifierResult.success) {
      return softwareIdentifierResult;
    }
    const softwareIdentifier = softwareIdentifierResult.response!
      .softwareIdentifier;
    progress(`The software identifier: ${softwareIdentifier}`);
    if (softwareIdentifier !== 'CATERIN') {
      return {
        success: false,
        error: `The software identifier is not 'CATERIN': ${softwareIdentifier}`,
      };
    }

    progress('Fetching the version information.');
    const versionNumberResult = await new FetchVersionNumberCommand().writeRequest(
      this.serial
    );
    if (!versionNumberResult.success) {
      return versionNumberResult;
    }
    const versionNumber = versionNumberResult.response!.versionNumber;
    if (versionNumber !== '?'.charCodeAt(0)) {
      const revisionNumberResult = await new FetchRevisionNumberCommand().writeRequest(
        this.serial
      );
      if (!revisionNumberResult.success) {
        return revisionNumberResult;
      }
      const revisionNumber = revisionNumberResult.response!.revisionNumber;
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
    if (!programTypeResult.success) {
      return programTypeResult;
    }
    const programType = programTypeResult.response!.programType;
    progress(`The program type: ${programType}`);

    progress('Fetching the auto address increment support.');
    const autoAddressIncrementSupportResult = await new FetchAutoAddressIncrementSupportCommand().writeRequest(
      this.serial
    );
    if (!autoAddressIncrementSupportResult.success) {
      return autoAddressIncrementSupportResult;
    }
    const autoAddressIncrementSupport = autoAddressIncrementSupportResult.response!
      .autoAddressIncrementSupport;
    progress(
      `The auto address increment support: ${autoAddressIncrementSupport}`
    );

    progress('Fetching the buffer access.');
    const bufferAccessResult = await new FetchBufferAccessCommand().writeRequest(
      this.serial
    );
    if (!bufferAccessResult.success) {
      return bufferAccessResult;
    }
    const bufferAccess = bufferAccessResult.response!.bufferAccess;
    if (!bufferAccess) {
      return {
        success: false,
        error: 'The buffer access is not supported.',
      };
    }
    progress('The buffer access is supported.');

    progress('Fetching the buffer size.');
    const bufferSizeResult = await new FetchBufferSizeCommand().writeRequest(
      this.serial
    );
    if (!bufferSizeResult.success) {
      return bufferSizeResult;
    }
    const bufferSize = bufferSizeResult.response!.bufferSize;
    progress(`The buffer size: ${bufferSize}`);

    progress('Fetching the device type.');
    const deviceTypeResult = await new FetchDeviceTypeCommand().writeRequest(
      this.serial
    );
    if (!deviceTypeResult.success) {
      return deviceTypeResult;
    }
    const deviceType = deviceTypeResult.response!.deviceType;
    progress(`The device type: ${deviceType}`);

    const skipReadBytesResult = await this.serial.skipBytesUntilNonZero(1000);
    if (!skipReadBytesResult.success) {
      return skipReadBytesResult;
    }

    progress(`Set the device type: ${deviceType}`);
    const setDeviceTypeResult = await new SetDeviceTypeCommand({
      deviceType,
    }).writeRequest(this.serial);
    if (!setDeviceTypeResult.success) {
      return setDeviceTypeResult;
    }

    progress('Fetching the Extended FUSE Bits.');
    const extendedFuseBitsResult = await new FetchExtendedFuseBitsCommand().writeRequest(
      this.serial
    );
    if (!extendedFuseBitsResult.success) {
      return extendedFuseBitsResult;
    }
    const extendedFuseBits = extendedFuseBitsResult.response!.extendedFuseBits;
    progress(`The Extended Fuse Bits: ${extendedFuseBits.toString(16)}`);

    progress('Fetching the Low Fuse Bits.');
    const lowFuseBitsResult = await new FetchLowFuseBitsCommand().writeRequest(
      this.serial
    );
    if (!lowFuseBitsResult.success) {
      return lowFuseBitsResult;
    }
    const lowFuseBits = lowFuseBitsResult.response!.lowFuseBits;
    progress(`The Low Fuse Bits: ${lowFuseBits.toString(16)}`);

    progress('Fetching the High Fuse Bits.');
    const highFuseBitsResult = await new FetchHighFuseBitsCommand().writeRequest(
      this.serial
    );
    if (!highFuseBitsResult.success) {
      return highFuseBitsResult;
    }
    const highFuseBits = highFuseBitsResult.response!.highFuseBits;
    progress(`The High Fuse Bits: ${highFuseBits.toString(16)}`);

    progress('Fetching the Lock Bits.');
    const lockBitsResult = await new FetchLockBitsCommand().writeRequest(
      this.serial
    );
    if (!lockBitsResult.success) {
      return lockBitsResult;
    }
    const lockBits = lockBitsResult.response!.lockBits;
    progress(`The Lock Bits: ${lockBits.toString(16)}`);

    progress('The caterina bootloader is valid.');

    return {
      success: true,
      bufferSize,
    };
  }

  private async fetchSignature(
    progress: FirmwareWriterProgressListener
  ): Promise<{ success: boolean; signature?: number; error?: string }> {
    progress('Fetch the signature.');
    const signatureResult = await new FetchSignatureCommand().writeRequest(
      this.serial
    );
    if (signatureResult.success) {
      progress(`The signature: ${signatureResult.response!.signature}`);
      return {
        success: true,
        signature: signatureResult.response!.signature,
      };
    } else {
      return signatureResult;
    }
  }

  private async initialize(
    progress: FirmwareWriterProgressListener
  ): Promise<{
    success: boolean;
    error?: string;
    cause?: any;
    bufferSize?: number;
    mcu?: IMcu;
  }> {
    progress('Initialize a bootloader.');
    const detectResult = await this.fetchAndCheckBootloaderInformation(
      progress
    );
    if (!detectResult.success) {
      progress('Caterina bootloader is not detected.');
      return detectResult;
    }
    const signatureResult = await this.fetchSignature(progress);
    if (!signatureResult.success) {
      return signatureResult;
    }
    const signature = signatureResult.signature!;
    if (signature === MCU.atmega32u4.signature) {
      progress('ATmega32u4 detected.');
      return {
        success: true,
        mcu: MCU.atmega32u4,
        bufferSize: detectResult.bufferSize,
      };
    } else {
      return {
        success: false,
        error: 'Unknown MCU detected.',
      };
    }
  }

  private async setAddress(
    address: number,
    progress: FirmwareWriterProgressListener
  ): Promise<IResult> {
    progress(`Set the address: ${address}`);
    return await new SetAddressCommand({ address }).writeRequest(this.serial);
  }

  private async readBytesFromFlashMemory(
    size: number,
    flashType: FirmwareFlashType,
    bufferSize: number,
    progress: FirmwareWriterProgressListener
  ): Promise<IBootloaderReadResult> {
    let address = 0;
    const setAddressResult = await this.setAddress(address, progress);
    if (!setAddressResult.success) {
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
      if (!readBytesFromMemoryResult.success) {
        return readBytesFromMemoryResult;
      }
      bytes = concatUint8Array(
        bytes,
        readBytesFromMemoryResult.response!.bytes
      );
      address += readBytesFromMemoryResult.response!.blockSize;
      progress('.', false);
    }
    progress('Reading bytes from the memory completed.');
    return {
      success: true,
      bytes,
    };
  }

  private async verifyBytesAndMemory(
    bytes: Uint8Array,
    bufferSize: number,
    flashType: FirmwareFlashType,
    progress: FirmwareWriterProgressListener
  ): Promise<IResult> {
    progress(`Start verifying ${bytes.byteLength} bytes against the memory.`);
    const readResult = await this.readBytesFromFlashMemory(
      bytes.byteLength,
      flashType,
      bufferSize,
      progress
    );
    if (!readResult.success) {
      return readResult;
    }
    const bytesFromMcu = readResult.bytes!;
    for (let i = 0; i < bytes.byteLength; i++) {
      if (bytes[i] !== bytesFromMcu[i]) {
        return {
          success: false,
          error: `Verification failed: Position:${i} Local:${bytes[i]} MCU:${bytesFromMcu[i]}`,
        };
      }
    }
    progress('Verifying bytes against the memory completed.');
    return {
      success: true,
    };
  }

  private async writeBytesToFlashMemory(
    bytes: Uint8Array,
    bufferSize: number,
    flashType: FirmwareFlashType,
    progress: FirmwareWriterProgressListener
  ): Promise<IResult> {
    let address = 0;
    const setAddressResult = await this.setAddress(address, progress);
    if (!setAddressResult.success) {
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
      if (!writeBytesToMemoryResult.success) {
        return writeBytesToMemoryResult;
      }
      address += blockSize;
      progress('.', false);
    }
    progress('Writing bytes to the memory completed.');
    return {
      success: true,
    };
  }

  private async exit(): Promise<IResult> {
    return await new ExitCommand().writeRequest(this.serial);
  }

  private async enterProgramMode(): Promise<IResult> {
    return await new EnterProgramModeCommand().writeRequest(this.serial);
  }

  private async leaveProgramMode(): Promise<IResult> {
    return await new LeaveProgramModeCommand().writeRequest(this.serial);
  }

  private async clearApplicationSectionOfFlash(
    progress: FirmwareWriterProgressListener
  ): Promise<IResult> {
    progress('Clearing the application section of the flash memory.');
    return await new ClearApplicationSectionOfFlashCommand().writeRequest(
      this.serial
    );
  }

  async read(
    size: number = 0,
    progress: FirmwareWriterProgressListener,
    phase: FirmwareWriterPhaseListener
  ): Promise<IBootloaderReadResult> {
    try {
      const initializeResult = await this.initialize(progress);
      if (!initializeResult.success) {
        return initializeResult;
      }
      phase('initialized');
      const mcu = initializeResult.mcu!;
      const flashMemorySize =
        size === 0 ? mcu.flashMemorySize : Math.min(mcu.flashMemorySize, size);
      const readBytesFromFlashMemoryResult = await this.readBytesFromFlashMemory(
        flashMemorySize,
        'flash',
        initializeResult.bufferSize!,
        progress
      );
      if (!readBytesFromFlashMemoryResult.success) {
        return readBytesFromFlashMemoryResult;
      }
      phase('read');
      const exitResult = await this.exit();
      if (!exitResult.success) {
        return exitResult;
      }
      return {
        success: true,
        bytes: readBytesFromFlashMemoryResult.bytes!,
      };
    } finally {
      await this.serial.close();
      phase('closed');
    }
  }

  async verify(
    bytes: Uint8Array,
    progress: FirmwareWriterProgressListener,
    phase: FirmwareWriterPhaseListener
  ): Promise<IResult> {
    try {
      const initializeResult = await this.initialize(progress);
      if (!initializeResult.success) {
        return initializeResult;
      }
      phase('initialized');
      const mcu = initializeResult.mcu!;
      if (mcu.bootAddress < bytes.byteLength) {
        return {
          success: false,
          error: `Firmware binary file size too large: MCU Boot Address: ${mcu.bootAddress} Firmware Size: ${bytes.byteLength}`,
        };
      }
      const verifyResult = await this.verifyBytesAndMemory(
        bytes,
        initializeResult.bufferSize!,
        'flash',
        progress
      );
      if (!verifyResult.success) {
        return verifyResult;
      }
      phase('verified');
      const exitResult = await this.exit();
      if (!exitResult.success) {
        return exitResult;
      }
      return {
        success: true,
      };
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
  ): Promise<IResult> {
    try {
      const initializeResult = await this.initialize(progress);
      if (!initializeResult.success) {
        return initializeResult;
      }
      phase('initialized');
      const mcu = initializeResult.mcu!;
      if (mcu.bootAddress < flashBytes.byteLength) {
        return {
          success: false,
          error: `Firmware flash binary file size too large: MCU Boot Address: ${mcu.bootAddress} Binary Size: ${flashBytes.byteLength}`,
        };
      }
      if (eepromBytes) {
        if (mcu.eepromSize < eepromBytes.byteLength) {
          return {
            success: false,
            error: `Firmware eeprom binary file size too large: EEPROM size: ${mcu.eepromSize} Binary Size: ${eepromBytes.byteLength}`,
          };
        }
      }

      const enterProgramModeResult = await this.enterProgramMode();
      if (!enterProgramModeResult.success) {
        return enterProgramModeResult;
      }

      const clearApplicationSectionOfFlashResult = await this.clearApplicationSectionOfFlash(
        progress
      );
      if (!clearApplicationSectionOfFlashResult.success) {
        return clearApplicationSectionOfFlashResult;
      }
      phase('cleared');

      const writeBytesToMemoryResult = await this.writeBytesToFlashMemory(
        flashBytes,
        initializeResult.bufferSize!,
        'flash',
        progress
      );
      if (!writeBytesToMemoryResult.success) {
        return writeBytesToMemoryResult;
      }
      phase('wrote');

      const verifyResult = await this.verifyBytesAndMemory(
        flashBytes,
        initializeResult.bufferSize!,
        'flash',
        progress
      );
      if (!verifyResult.success) {
        return verifyResult;
      }
      phase('verified');

      if (eepromBytes) {
        const writeBytesToMemoryResult = await this.writeBytesToFlashMemory(
          eepromBytes,
          initializeResult.bufferSize!,
          'eeprom',
          progress
        );
        if (!writeBytesToMemoryResult.success) {
          return writeBytesToMemoryResult;
        }
        phase('wrote');

        const verifyResult = await this.verifyBytesAndMemory(
          eepromBytes,
          initializeResult.bufferSize!,
          'eeprom',
          progress
        );
        if (!verifyResult.success) {
          return verifyResult;
        }
        phase('verified');
      }

      const leaveProgramModeResult = await this.leaveProgramMode();
      if (!leaveProgramModeResult.success) {
        return leaveProgramModeResult;
      }

      const exitResult = await this.exit();
      if (!exitResult.success) {
        return exitResult;
      }
      return {
        success: true,
      };
    } finally {
      await this.serial.close();
      phase('closed');
    }
  }
}
