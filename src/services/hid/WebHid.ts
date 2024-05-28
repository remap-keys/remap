import {
  ICommand,
  IConnectParams,
  IKeyboard,
  IHid,
  IDeviceInformation,
  IResult,
  IConnectResult,
  IConnectionEventHandler,
  IFetchKeymapResult,
  IFetchLayerCountResult,
  IKeymap,
  IFetchBrightnessResult,
  IFetchBacklightEffectResult,
  IFetchRGBLightColorResult,
  IFetchRGBLightEffectSpeedResult,
  IFetchRGBLightEffectResult,
  IFetchSwitchMatrixStateResult,
  IFetchLayoutOptionsResult,
  IGetMacroCountResult,
  IGetMacroBufferSizeResult,
  IFetchMacroBufferResult,
  IFetchViaProtocolVersionResult,
  ICustomKeycode,
  IFetchEncodersKeymapsResult,
  IEncoderKeymaps,
} from './Hid';
import { KeycodeList } from './KeycodeList';
import {
  BacklightGetValueCommand,
  BacklightSaveCommand,
  BacklightSetValueCommand,
  BacklightValueId,
  BleMicroProStoreKeymapPersistentlyCommand,
  DynamicKeymapGetEncoderCommand,
  DynamicKeymapGetLayerCountCommand,
  DynamicKeymapMacroGetBufferCommand,
  DynamicKeymapMacroGetBufferSizeCommand,
  DynamicKeymapMacroGetCountCommand,
  DynamicKeymapMacroSetBufferCommand,
  DynamicKeymapReadBufferCommand,
  DynamicKeymapResetCommand,
  DynamicKeymapSetEncoderCommand,
  DynamicKeymapSetKeycodeCommand,
  GetLayoutOptionsCommand,
  GetProtocolVersionCommand,
  IDynamicKeymapGetEncoderResponse,
  IDynamicKeymapMacroGetBufferResponse,
  IDynamicKeymapMacroSetBufferResponse,
  IDynamicKeymapReadBufferResponse,
  ISwitchLayerStateResponse,
  RgbLightGetValueCommand,
  RgbLightSaveCommand,
  RgbLightSetValueCommand,
  RgbLightValueId,
  SetLayoutOptionsCommand,
  SwitchMatrixStateCommand,
} from './Commands';
import {
  IKeycodeCompositionFactory,
  KeycodeCompositionFactory,
} from './Composition';
import { concatUint8Array, outputUint8Array } from '../../utils/ArrayUtils';
import { KeyboardLabelLang } from '../labellang/KeyLabelLangs';

export class Keyboard implements IKeyboard {
  private readonly hid: IHid;
  private readonly device: HIDDevice;
  private commandQueue: ICommand[];

  constructor(hid: IHid, device: HIDDevice) {
    this.hid = hid;
    this.commandQueue = [];
    this.device = device;
  }

  getHid(): IHid {
    return this.hid;
  }

  getInformation(): IDeviceInformation {
    return {
      vendorId: this.device.vendorId!,
      productId: this.device.productId!,
      productName: this.device.productName!,
    };
  }

  isOpened(): boolean {
    return this.device.opened!;
  }

  async close(): Promise<void> {
    try {
      this.getDevice().removeEventListener(
        'inputreport',
        this.handleInputReport
      );
      await this.device.close();
    } catch (error) {
      console.log(error);
      // Ignore.
    }
  }

  getDevice(): HIDDevice {
    return this.device;
  }

  isSameDevice(target: IKeyboard): boolean {
    if (target === null) {
      return false;
    }
    return this.device === target.getDevice();
  }

  async open(): Promise<IResult> {
    if (this.isOpened()) {
      return {
        success: false,
        error: 'The keyboard already connected and opened.',
      };
    }
    const device = this.getDevice();
    try {
      await device.open();
      device.addEventListener('inputreport', this.handleInputReport);
    } catch (error) {
      return {
        success: false,
        error: 'The device cannot be opened.',
        cause: error,
      };
    }
    return {
      success: true,
    };
  }

  handleInputReport = async (e: any): Promise<void> => {
    outputUint8Array('Received data', new Uint8Array(e.data.buffer));
    if (this.commandQueue.length > 0) {
      const command = this.commandQueue[0];
      if (command!.canHandleInputReport(e)) {
        await command!.handleInputReport(e);
        this.commandQueue.shift();
        if (this.commandQueue.length > 0) {
          await this.commandQueue[0].sendReport(this.getDevice());
          return;
        }
      } else {
        // FIXME: 2021/01/16 For Windows:
        // If command.canHandleInputReport === false, Windows Chrome might return duplicate response.
        // The response should be ignored, and should wait a next response.
        console.warn('Duplicate response was handled. Ignore.');
      }
    } else {
      console.log(
        'Bytes received but the command queue is empty. Close the keyboard.'
      );
      this.hid.close(this);
    }
  };

  async enqueue(command: ICommand): Promise<IResult> {
    if (this.isOpened()) {
      this.commandQueue.push(command);
      if (this.commandQueue.length === 1) {
        await this.commandQueue[0].sendReport(this.getDevice());
      }
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: 'Not connected or opened.',
      };
    }
  }

  async fetchEncodersKeymaps(
    layer: number,
    encoderIds: number[],
    labelLang: KeyboardLabelLang,
    customKeycodes: ICustomKeycode[] | undefined
  ): Promise<IFetchEncodersKeymapsResult> {
    const commandResults: Promise<IDynamicKeymapGetEncoderResponse>[] = [];
    encoderIds.forEach((encoderId) => {
      [true, false].forEach((clockwise) => {
        commandResults.push(
          new Promise<IDynamicKeymapGetEncoderResponse>((resolve, reject) => {
            const command = new DynamicKeymapGetEncoderCommand(
              {
                layer,
                encoderId,
                clockwise,
              },
              async (result) => {
                if (result.success) {
                  resolve(result.response!);
                } else {
                  console.error(result.cause!);
                  reject(result.error!);
                }
              }
            );
            return this.enqueue(command);
          })
        );
      });
    });
    try {
      const responses =
        await Promise.all<IDynamicKeymapGetEncoderResponse>(commandResults);
      const keymap: IEncoderKeymaps = {};
      let i = 0;
      encoderIds.forEach((encoderId) => {
        const clockwiseResponse = responses[i++];
        const counterclockwiseResponse = responses[i++];
        keymap[encoderId] = {
          clockwise: KeycodeList.getKeymap(
            clockwiseResponse.code!,
            labelLang,
            customKeycodes
          ),
          counterclockwise: KeycodeList.getKeymap(
            counterclockwiseResponse.code!,
            labelLang,
            customKeycodes
          ),
        };
      });
      return {
        success: true,
        keymap,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: 'Fetching encoders keymaps failed.',
        cause: error,
      };
    }
  }

  async fetchKeymaps(
    layer: number,
    rowCount: number,
    columnCount: number,
    labelLang: KeyboardLabelLang,
    customKeycodes: ICustomKeycode[] | undefined
  ): Promise<IFetchKeymapResult> {
    const totalSize = rowCount * columnCount * 2;
    let offset = layer * totalSize;
    const commandResults: Promise<IDynamicKeymapReadBufferResponse>[] = [];
    let remainingSize = totalSize;
    do {
      let size: number;
      if (28 < remainingSize) {
        size = 28;
        remainingSize = remainingSize - 28;
      } else {
        size = remainingSize;
        remainingSize = 0;
      }
      commandResults.push(
        new Promise<IDynamicKeymapReadBufferResponse>((resolve, reject) => {
          const command = new DynamicKeymapReadBufferCommand(
            {
              offset,
              size,
            },
            async (result) => {
              if (result.success) {
                resolve(result.response!);
              } else {
                console.log(result.cause!);
                reject(result.error!);
              }
            }
          );
          return this.enqueue(command);
        })
      );
      offset = offset + 28;
    } while (remainingSize !== 0);
    try {
      const responses =
        await Promise.all<IDynamicKeymapReadBufferResponse>(commandResults);
      let row = 0;
      let column = 0;
      const keymapMap: { [pos: string]: IKeymap } = {};
      responses.forEach((response) => {
        if (rowCount === row) {
          return;
        }
        const buffer = response.buffer;
        if (buffer.length % 2 !== 0) {
          throw new Error(`Invalid buffer size: ${buffer.length}`);
        }
        for (let i = 0; i < buffer.length; i += 2) {
          const code = (buffer[i] << 8) | buffer[i + 1];
          const keymap = KeycodeList.getKeymap(code, labelLang, customKeycodes);
          keymapMap[`${row},${column}`] = keymap;
          column = column + 1;
          if (columnCount === column) {
            column = 0;
            row = row + 1;
          }
          if (rowCount === row) {
            break;
          }
        }
      });
      return {
        success: true,
        keymap: keymapMap,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: 'Fetching keymaps failed.',
        cause: error,
      };
    }
  }

  fetchLayerCount(): Promise<IFetchLayerCountResult> {
    return new Promise<IFetchLayerCountResult>((resolve) => {
      const command = new DynamicKeymapGetLayerCountCommand(
        {},
        async (result) => {
          if (result.success) {
            resolve({
              success: true,
              layerCount: result.response!.value,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  fetchViaProtocolVersion(): Promise<IFetchViaProtocolVersionResult> {
    return new Promise<IFetchViaProtocolVersionResult>((resolve) => {
      const command = new GetProtocolVersionCommand({}, async (result) => {
        if (result.success) {
          resolve({
            success: true,
            viaProtocolVersion: result.response!.protocolVersion,
          });
        } else {
          resolve({
            success: false,
            error: result.error,
            cause: result.cause,
          });
        }
      });
      return this.enqueue(command);
    });
  }

  updateKeymap(
    layer: number,
    row: number,
    column: number,
    code: number
  ): Promise<IResult> {
    return new Promise<IResult>((resolve) => {
      const command = new DynamicKeymapSetKeycodeCommand(
        {
          layer,
          row,
          column,
          code,
        },
        async (result) => {
          if (result.success) {
            resolve({
              success: true,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  updateEncoderKeymap(
    layer: number,
    encoderId: number,
    clockwise: boolean,
    code: number
  ): Promise<IResult> {
    return new Promise<IResult>((resolve) => {
      const command = new DynamicKeymapSetEncoderCommand(
        {
          layer,
          encoderId,
          clockwise,
          code,
        },
        async (result) => {
          if (result.success) {
            resolve({
              success: true,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  fetchBacklightBrightness(): Promise<IFetchBrightnessResult> {
    return new Promise<IFetchBrightnessResult>((resolve) => {
      const command = new BacklightGetValueCommand(
        {
          valueId: BacklightValueId.id_qmk_backlight_brightness,
        },
        async (result) => {
          if (result.success) {
            resolve({
              success: true,
              brightness: result.response!.value,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  fetchBacklightEffect(): Promise<IFetchBacklightEffectResult> {
    return new Promise<IFetchBacklightEffectResult>((resolve) => {
      const command = new BacklightGetValueCommand(
        {
          valueId: BacklightValueId.id_qmk_backlight_effect,
        },
        async (result) => {
          if (result.success) {
            resolve({
              success: true,
              isBreathing: result.response!.value !== 0,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  fetchRGBLightBrightness(): Promise<IFetchBrightnessResult> {
    return new Promise<IFetchBrightnessResult>((resolve) => {
      const command = new RgbLightGetValueCommand(
        {
          valueId: RgbLightValueId.id_qmk_rgblight_brightness,
        },
        async (result) => {
          if (result.success) {
            resolve({
              success: true,
              brightness: result.response!.value1,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  fetchRGBLightColor(): Promise<IFetchRGBLightColorResult> {
    return new Promise<IFetchRGBLightColorResult>((resolve) => {
      const command = new RgbLightGetValueCommand(
        {
          valueId: RgbLightValueId.id_qmk_rgblight_color,
        },
        async (result) => {
          if (result.success) {
            resolve({
              success: true,
              hue: result.response!.value1,
              sat: result.response!.value2,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  fetchRGBLightEffect(): Promise<IFetchRGBLightEffectResult> {
    return new Promise<IFetchRGBLightEffectResult>((resolve) => {
      const command = new RgbLightGetValueCommand(
        {
          valueId: RgbLightValueId.id_qmk_rgblight_effect,
        },
        async (result) => {
          if (result.success) {
            resolve({
              success: true,
              mode: result.response!.value1,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  fetchRGBLightEffectSpeed(): Promise<IFetchRGBLightEffectSpeedResult> {
    return new Promise<IFetchRGBLightEffectSpeedResult>((resolve) => {
      const command = new RgbLightGetValueCommand(
        {
          valueId: RgbLightValueId.id_qmk_rgblight_effect_speed,
        },
        async (result) => {
          if (result.success) {
            resolve({
              success: true,
              speed: result.response!.value1,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  private sendUpdateAndSaveBacklightSettingCommands(
    updateCommand: Promise<IResult>
  ): Promise<IResult> {
    return updateCommand.then((result) => {
      return new Promise<IResult>((resolve) => {
        if (!result.success) {
          resolve(result);
          return;
        }
        const saveCommand = new BacklightSaveCommand({}, async (result) => {
          if (result.success) {
            resolve({
              success: true,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        });
        return this.enqueue(saveCommand);
      });
    });
  }

  updateBacklightBrightness(brightness: number): Promise<IResult> {
    return this.sendUpdateAndSaveBacklightSettingCommands(
      new Promise<IResult>((resolve) => {
        const command = new BacklightSetValueCommand(
          {
            valueId: BacklightValueId.id_qmk_backlight_brightness,
            value: brightness,
          },
          async (result) => {
            if (result.success) {
              resolve({
                success: true,
              });
            } else {
              resolve({
                success: false,
                error: result.error,
                cause: result.cause,
              });
            }
          }
        );
        return this.enqueue(command);
      })
    );
  }

  updateBacklightEffect(isBreathing: boolean): Promise<IResult> {
    return this.sendUpdateAndSaveBacklightSettingCommands(
      new Promise<IResult>((resolve) => {
        const command = new BacklightSetValueCommand(
          {
            valueId: BacklightValueId.id_qmk_backlight_effect,
            value: isBreathing ? 1 : 0,
          },
          async (result) => {
            if (result.success) {
              resolve({
                success: true,
              });
            } else {
              resolve({
                success: false,
                error: result.error,
                cause: result.cause,
              });
            }
          }
        );
        return this.enqueue(command);
      })
    );
  }

  private sendUpdateAndSaveRgbLightSettingCommands(
    updateCommand: Promise<IResult>
  ): Promise<IResult> {
    return updateCommand.then((result) => {
      return new Promise<IResult>((resolve) => {
        if (!result.success) {
          resolve(result);
          return;
        }
        const saveCommand = new RgbLightSaveCommand({}, async (result) => {
          if (result.success) {
            resolve({
              success: true,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        });
        return this.enqueue(saveCommand);
      });
    });
  }

  updateRGBLightBrightness(brightness: number): Promise<IResult> {
    return this.sendUpdateAndSaveRgbLightSettingCommands(
      new Promise<IResult>((resolve) => {
        const command = new RgbLightSetValueCommand(
          {
            valueId: RgbLightValueId.id_qmk_rgblight_brightness,
            value1: brightness,
            value2: 0,
          },
          async (result) => {
            if (result.success) {
              resolve({
                success: true,
              });
            } else {
              resolve({
                success: false,
                error: result.error,
                cause: result.cause,
              });
            }
          }
        );
        return this.enqueue(command);
      })
    );
  }

  updateRGBLightColor(hue: number, sat: number): Promise<IResult> {
    return this.sendUpdateAndSaveRgbLightSettingCommands(
      new Promise<IResult>((resolve) => {
        const command = new RgbLightSetValueCommand(
          {
            valueId: RgbLightValueId.id_qmk_rgblight_color,
            value1: hue,
            value2: sat,
          },
          async (result) => {
            if (result.success) {
              resolve({
                success: true,
              });
            } else {
              resolve({
                success: false,
                error: result.error,
                cause: result.cause,
              });
            }
          }
        );
        return this.enqueue(command);
      })
    );
  }

  async updateRGBLightEffect(mode: number): Promise<IResult> {
    return this.sendUpdateAndSaveRgbLightSettingCommands(
      new Promise<IResult>((resolve) => {
        const updateCommand = new RgbLightSetValueCommand(
          {
            valueId: RgbLightValueId.id_qmk_rgblight_effect,
            value1: mode,
            value2: 0,
          },
          async (result) => {
            if (result.success) {
              resolve({
                success: true,
              });
            } else {
              resolve({
                success: false,
                error: result.error,
                cause: result.cause,
              });
            }
          }
        );
        return this.enqueue(updateCommand);
      })
    );
  }

  updateRGBLightEffectSpeed(speed: number): Promise<IResult> {
    return this.sendUpdateAndSaveRgbLightSettingCommands(
      new Promise<IResult>((resolve) => {
        const command = new RgbLightSetValueCommand(
          {
            valueId: RgbLightValueId.id_qmk_rgblight_effect_speed,
            value1: speed,
            value2: 0,
          },
          async (result) => {
            if (result.success) {
              resolve({
                success: true,
              });
            } else {
              resolve({
                success: false,
                error: result.error,
                cause: result.cause,
              });
            }
          }
        );
        return this.enqueue(command);
      })
    );
  }

  resetDynamicKeymap(): Promise<IResult> {
    return new Promise<IResult>((resolve) => {
      const command = new DynamicKeymapResetCommand({}, async (result) => {
        if (result.success) {
          resolve({
            success: true,
          });
        } else {
          resolve({
            success: false,
            error: result.error,
            cause: result.cause,
          });
        }
      });
      return this.enqueue(command);
    });
  }

  storeKeymapPersistentlyForBleMicroPro(): Promise<IResult> {
    return new Promise<IResult>((resolve) => {
      const command = new BleMicroProStoreKeymapPersistentlyCommand(
        {},
        async (result) => {
          if (result.success) {
            if (result.response!.resultCode === 0x00) {
              resolve({
                success: true,
              });
            } else {
              resolve({
                success: false,
                error: `Storing keymap persistently for BLE Micro Pro failed: ${
                  result.response!.resultCode
                }`,
              });
            }
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  getMacroCount(): Promise<IGetMacroCountResult> {
    return new Promise<IGetMacroCountResult>((resolve) => {
      const command = new DynamicKeymapMacroGetCountCommand(
        {},
        async (result) => {
          if (result.success) {
            resolve({
              success: true,
              count: result.response!.count,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  async fetchSwitchMatrixState(
    rows: number,
    cols: number
  ): Promise<IFetchSwitchMatrixStateResult> {
    try {
      const rowByteLength = Math.ceil(cols / 8);
      const requestRowCount = Math.floor(28 / rowByteLength);
      let states: Uint8Array = new Uint8Array(0);
      for (let offset = 0; offset < rows; offset += requestRowCount) {
        const requestSize = Math.min(
          rows * rowByteLength - states.length,
          rowByteLength * requestRowCount
        );
        const response = await this.executeSwitchMatrixStateCommand(offset);
        const state = response.state;
        states = concatUint8Array(states, state.slice(0, requestSize));
      }
      return {
        success: true,
        state: states,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: 'Fetching keymaps failed.',
        cause: error,
      };
    }
  }

  private async executeSwitchMatrixStateCommand(
    offset: number
  ): Promise<ISwitchLayerStateResponse> {
    return new Promise<ISwitchLayerStateResponse>((resolve, reject) => {
      const command = new SwitchMatrixStateCommand(
        {
          offset,
        },
        async (result) => {
          if (result.success) {
            resolve(result.response!);
          } else {
            console.log(result.cause!);
            reject(result.error!);
          }
        }
      );
      return this.enqueue(command);
    });
  }

  fetchLayoutOptions(): Promise<IFetchLayoutOptionsResult> {
    return new Promise<IFetchLayoutOptionsResult>((resolve) => {
      const command = new GetLayoutOptionsCommand({}, async (result) => {
        if (result.success) {
          resolve({
            success: true,
            value: result.response!.value,
          });
        } else {
          resolve({
            success: false,
            error: result.error,
            cause: result.cause,
          });
        }
      });
      return this.enqueue(command);
    });
  }

  updateLayoutOptions(value: number): Promise<IResult> {
    return new Promise<IResult>((resolve) => {
      const command = new SetLayoutOptionsCommand({ value }, async (result) => {
        if (result.success) {
          resolve({
            success: true,
          });
        } else {
          resolve({
            success: false,
            error: result.error,
            cause: result.cause,
          });
        }
      });
      return this.enqueue(command);
    });
  }

  getMacroBufferSize(): Promise<IGetMacroBufferSizeResult> {
    return new Promise<IGetMacroBufferSizeResult>((resolve) => {
      const command = new DynamicKeymapMacroGetBufferSizeCommand(
        {},
        async (result) => {
          if (result.success) {
            resolve({
              success: true,
              bufferSize: result.response!.bufferSize,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  async fetchMacroBuffer(bufferSize: number): Promise<IFetchMacroBufferResult> {
    let offset = 0;
    const commandResults: Promise<IDynamicKeymapMacroGetBufferResponse>[] = [];
    let remainingSize = bufferSize;
    do {
      let size: number;
      if (28 < remainingSize) {
        size = 28;
        remainingSize = remainingSize - 28;
      } else {
        size = remainingSize;
        remainingSize = 0;
      }
      commandResults.push(
        new Promise<IDynamicKeymapMacroGetBufferResponse>((resolve, reject) => {
          const command = new DynamicKeymapMacroGetBufferCommand(
            {
              offset,
              size,
            },
            async (result) => {
              if (result.success) {
                resolve(result.response!);
              } else {
                console.log(result.cause!);
                reject(result.error!);
              }
            }
          );
          return this.enqueue(command);
        })
      );
      offset = offset + 28;
    } while (remainingSize !== 0);
    try {
      const responses =
        await Promise.all<IDynamicKeymapMacroGetBufferResponse>(commandResults);
      const buffer = new Uint8Array(bufferSize);
      let pos = 0;
      responses.forEach((response) => {
        if (bufferSize <= pos + 28) {
          buffer.set(response.buffer.slice(0, bufferSize - pos), pos);
        } else {
          buffer.set(response.buffer.slice(0, 28), pos);
        }
        pos += 28;
      });
      return {
        success: true,
        buffer,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: 'Fetching macro buffer failed.',
        cause: error,
      };
    }
  }

  async updateMacroBuffer(
    offset: number,
    buffer: Uint8Array
  ): Promise<IResult> {
    let pos = 0;
    const commandResults: Promise<IDynamicKeymapMacroSetBufferResponse>[] = [];
    let remainingSize = buffer.length;
    do {
      let size: number;
      if (28 < remainingSize) {
        size = 28;
        remainingSize = remainingSize - 28;
      } else {
        size = remainingSize;
        remainingSize = 0;
      }
      commandResults.push(
        new Promise<IDynamicKeymapMacroSetBufferResponse>((resolve, reject) => {
          const command = new DynamicKeymapMacroSetBufferCommand(
            {
              offset: offset + pos,
              size,
              buffer: buffer.slice(pos, pos + size),
            },
            async (result) => {
              if (result.success) {
                resolve(result.response!);
              } else {
                console.log(result.cause!);
                reject(result.error!);
              }
            }
          );
          return this.enqueue(command);
        })
      );
      pos = pos + 28;
    } while (remainingSize !== 0);
    try {
      await Promise.all<IDynamicKeymapMacroSetBufferResponse>(commandResults);
      return {
        success: true,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: 'Fetching macro buffer failed.',
        cause: error,
      };
    }
  }
}

export interface ICommandRequest {}

export interface ICommandResponse {}

export interface ICommandResult<T> {
  success: boolean;
  response?: T;
  error?: string;
  cause?: any;
}

export interface ICommandResponseHandler<T extends ICommandResponse> {
  // eslint-disable-next-line
  (result: ICommandResult<T>): Promise<void>;
}

export class WebHid implements IHid {
  private handler?: IConnectionEventHandler;

  async detectKeyboards(): Promise<IKeyboard[]> {
    const devices = await navigator.hid.getDevices();
    return devices
      .filter((device: HIDDevice) => {
        const collectionInfo = device.collections![0];
        return (
          collectionInfo &&
          collectionInfo.usage === 0x61 &&
          collectionInfo.usagePage === 0xff60
        );
      })
      .map((device: HIDDevice) => {
        return new Keyboard(this, device);
      });
  }

  async connect(connectParams?: IConnectParams): Promise<IConnectResult> {
    let device;
    try {
      let devices;
      if (connectParams) {
        devices = await navigator.hid.requestDevice({
          filters: [
            {
              vendorId: connectParams.vendorId,
              productId: connectParams.productId,
              usagePage: 0xff60,
              usage: 0x61,
            },
          ],
        });
      } else {
        devices = await navigator.hid.requestDevice({
          filters: [
            {
              usagePage: 0xff60,
              usage: 0x61,
            },
          ],
        });
      }
      device = devices[0];
    } catch (error) {
      return {
        success: false,
        error: 'The connection failed.',
        cause: error,
      };
    }
    if (device === undefined) {
      return {
        success: false,
        error: 'No device was selected.',
      };
    }
    return {
      success: true,
      keyboard: new Keyboard(this, device),
    };
  }

  checkViaSupportedDevice(device: any): boolean {
    const collection = device.collections[0];
    if (collection) {
      return collection.usage === 0x61 && collection.usagePage === 0xff60;
    } else {
      return false;
    }
  }

  setConnectionEventHandler(handler: IConnectionEventHandler): void {
    (navigator as any).hid.addEventListener('connect', (e: any) => {
      if (this.checkViaSupportedDevice(e.device)) {
        handler.connect(new Keyboard(this, e.device));
      }
    });
    (navigator as any).hid.addEventListener('disconnect', (e: any) => {
      if (this.checkViaSupportedDevice(e.device)) {
        handler.disconnect(new Keyboard(this, e.device));
      }
    });
    this.handler = handler;
  }

  close(keyboard: IKeyboard): void {
    this.handler!.close(keyboard);
  }

  createKeycodeCompositionFactory(code: number): IKeycodeCompositionFactory {
    return new KeycodeCompositionFactory(code, 'en-us');
  }
}
