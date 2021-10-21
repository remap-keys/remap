import React, { useState } from 'react';
import './Serial.scss';
import { FirmwareWebSerialImpl } from '../FirmwareWebSerialImpl';
import { IFirmware } from '../Firmware';
import { outputUint8Array } from '../../../utils/ArrayUtils';
import hex from 'intel-hex';

export function Serial() {
  const [file, setFile] = useState<File | null>(null);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files!.length > 0) {
      setFile(event.target.files![0]);
    } else {
      setFile(null);
    }
  };

  const handleFirmwareWriteClick = async () => {
    if (!file) {
      return;
    }
    const parseResult = hex.parse(
      Buffer.from(new Uint8Array(await file.arrayBuffer()))
    );
    const firmware: IFirmware = new FirmwareWebSerialImpl();
    const writeResult = await firmware.write(
      parseResult.data,
      null,
      (message) => {
        console.log(message);
      },
      (error, cause) => {
        console.error(error);
        console.error(cause);
      }
    );
    console.log(writeResult);
  };

  return (
    <div className="serial">
      <h1>WebSerial Test</h1>
      <div className="box">
        <button onClick={handleFirmwareReadClick}>Firmware.read()</button>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFirmwareWriteClick}>Firmware.write()</button>
      </div>
    </div>
  );
}
