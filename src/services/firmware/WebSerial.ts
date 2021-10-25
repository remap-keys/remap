import { ISerial, ISerialReadBytesResult } from './Serial';
import { IErrorHandler, IResult } from './Types';
import { encodeStringToBytes } from '../../utils/StringUtils';

export class WebSerial implements ISerial {
  private chunkSize: number;
  private connected: boolean;
  // eslint-disable-next-line no-undef
  private serialPort: SerialPort | undefined;
  // eslint-disable-next-line no-undef
  private reader: ReadableStreamDefaultReader | null = null;
  private receivedBytesBuffer: number[];

  constructor(chunkSize: number) {
    this.chunkSize = chunkSize;
    this.connected = false;
    this.receivedBytesBuffer = [];
  }

  open(
    baudRate: number,
    bufferSize: number,
    errorHandler: IErrorHandler
  ): Promise<IResult> {
    // eslint-disable-next-line no-unused-vars
    return new Promise<IResult>((resolve, reject) => {
      this.openPort(baudRate, bufferSize)
        .then((result) => {
          if (!result.success) {
            resolve(result);
          } else {
            resolve({ success: true });
            return this.start(errorHandler);
          }
        })
        .catch((reason) => {
          errorHandler(`Opening serial port failed: ${reason}`, reason);
        });
    });
  }

  private async openPort(
    baudRate: number = 115200,
    bufferSize: number
  ): Promise<IResult> {
    let serialPort;
    try {
      serialPort = await navigator.serial.requestPort();
      await serialPort.open({
        baudRate,
        bufferSize,
      });
      this.connected = true;
      this.serialPort = serialPort;
      return {
        success: true,
      };
    } catch (e) {
      console.error(e);
      if (serialPort) {
        try {
          await serialPort.close();
        } catch (_) {
          // Ignore the exception.
        }
      }
      return {
        success: false,
        error: `Opening the serial port failed: ${e}`,
        cause: e,
      };
    }
  }

  private async start(errorHandler: IErrorHandler): Promise<void> {
    if (!this.serialPort) {
      errorHandler('Starting failed because there is no serial port.');
      return;
    }
    while (this.serialPort.readable) {
      this.reader = this.serialPort.readable.getReader();
      try {
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await this.reader.read();
          if (value) {
            // console.log(`Received bytes: ${value.byteLength} bytes.`);
            this.receivedBytesBuffer = this.receivedBytesBuffer.concat(
              Array.from(value)
            );
          }
          if (done) {
            // console.log(`Received bytes done: ${done}`);
            if (this.reader) {
              this.reader.releaseLock();
            }
            // break;
            return;
          }
        }
      } catch (e) {
        console.error(e);
        errorHandler(`Receiving bytes failed: ${e}`, e);
        return;
      } finally {
        if (this.reader) {
          this.reader.releaseLock();
        }
      }
    }
  }

  async readBytes(
    size: number,
    timeout: number
  ): Promise<ISerialReadBytesResult> {
    let count = 0;
    while (this.receivedBytesBuffer.length < size && count < timeout) {
      await this.sleep(1);
      count += 1;
    }
    if (timeout <= count) {
      return {
        success: false,
        error: 'Reading bytes was timeout.',
      };
    }
    const result = this.receivedBytesBuffer.slice(0, size);
    this.receivedBytesBuffer = this.receivedBytesBuffer.slice(size);
    return {
      success: true,
      bytes: Uint8Array.from(result),
    };
  }

  async skipBytesUntilNonZero(timeout: number): Promise<IResult> {
    let readResult;
    do {
      readResult = await this.readBytes(1, timeout);
      if (!readResult.success) {
        return {
          success: false,
          error: readResult.error,
        };
      }
    } while (readResult.bytes![0] !== 0);
    return { success: true };
  }

  async writeString(message: string): Promise<IResult> {
    return await this.writeBytes(encodeStringToBytes(message));
  }

  async writeBytes(bytes: Uint8Array): Promise<IResult> {
    if (!this.serialPort) {
      return {
        success: false,
        error: 'Writing bytes failed because there is no serial port.',
      };
    }
    if (!this.serialPort.writable) {
      return {
        success: false,
        error:
          'Writing bytes failed because the writable object is unavailable.',
      };
    }
    let current = 0;
    const writer = this.serialPort.writable.getWriter();
    while (current < bytes.length) {
      await writer.write(bytes.slice(current, current + this.chunkSize));
      current = current + this.chunkSize;
    }
    writer.releaseLock();
    return {
      success: true,
    };
  }

  async close(): Promise<void> {
    if (this.reader) {
      try {
        await this.reader.cancel();
        this.reader.releaseLock();
      } catch (e) {
        console.error(e);
      } finally {
        this.reader = null;
      }
    }
    if (this.serialPort) {
      try {
        await this.serialPort.close();
        this.serialPort = undefined;
        this.connected = false;
      } catch (e) {
        console.error(e);
      }
    }
  }

  private async sleep(ms: number): Promise<void> {
    // eslint-disable-next-line no-unused-vars
    return new Promise<void>((resolve, reject) => {
      setTimeout(resolve, ms);
    });
  }
}
