import React from 'react';
import './Serial.scss';
import { FirmwareWebSerialImpl } from '../FirmwareWebSerialImpl';
import { IFirmware } from '../Firmware';
import { outputUint8Array } from '../../../utils/ArrayUtils';

export function Serial() {
  const handleFirmwareReadClick = async () => {
    const firmware: IFirmware = new FirmwareWebSerialImpl();
    const readResult = await firmware.read(
      0,
      // eslint-disable-next-line no-unused-vars
      (message, lineBreak?: boolean) => {
        console.log(message);
      },
      (error, cause) => {
        console.error(error);
        console.error(cause);
      }
    );
    if (readResult.success) {
      console.log(readResult.bytes!.byteLength);
      outputUint8Array('Firmware Bytes', readResult.bytes!);
    } else {
      console.error(readResult);
    }
  };

  return (
    <div className="serial">
      <h1>WebSerial Test</h1>
      <div className="box">
        <button onClick={handleFirmwareReadClick}>Firmware.read()</button>
      </div>
    </div>
  );
}
