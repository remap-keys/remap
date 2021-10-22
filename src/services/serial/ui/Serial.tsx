import React, { useEffect, useState } from 'react';
import './Serial.scss';
import { FirmwareWriterWebSerialImpl } from '../FirmwareWriterWebSerialImpl';
import { IFirmwareWriter } from '../FirmwareWriter';
import { outputUint8Array } from '../../../utils/ArrayUtils';
import hex from 'intel-hex';

export function Serial() {
  const [file, setFile] = useState<File | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const logsRef = React.createRef<HTMLTextAreaElement>();

  useEffect(() => {
    logsRef.current!.scrollTop = logsRef.current!.scrollHeight;
  });

  const handleFirmwareReadClick = async () => {
    const firmware: IFirmwareWriter = new FirmwareWriterWebSerialImpl();
    const readResult = await firmware.read(
      0,
      // eslint-disable-next-line no-unused-vars
      (message, lineBreak: boolean = true) => {
        console.log(message);
        if (lineBreak) {
          setLogs((prevState) => [...prevState, message]);
        } else {
          setLogs((prevState) => [
            ...prevState.slice(0, prevState.length - 1),
            `${prevState[prevState.length - 1]}${message}`,
          ]);
        }
      },
      (phase) => {
        console.log(phase);
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
    const firmware: IFirmwareWriter = new FirmwareWriterWebSerialImpl();
    const writeResult = await firmware.write(
      parseResult.data,
      null,
      (message, lineBreak: boolean = true) => {
        console.log(message);
        if (lineBreak) {
          setLogs((prevState) => [...prevState, message]);
        } else {
          setLogs((prevState) => [
            ...prevState.slice(0, prevState.length - 1),
            `${prevState[prevState.length - 1]}${message}`,
          ]);
        }
      },
      (phase) => {
        console.log(phase);
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
        <textarea
          ref={logsRef}
          rows={4}
          value={`${logs.join('\n')}`}
          readOnly
        />
      </div>
    </div>
  );
}
