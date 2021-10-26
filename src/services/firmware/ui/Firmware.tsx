import React, { useEffect, useState } from 'react';
import './Firmware.scss';
import { FirmwareWriterWebApiImpl } from '../FirmwareWriterWebApiImpl';
import { IFirmwareWriter, IFirmwareWriterPhase } from '../FirmwareWriter';
import { outputUint8Array } from '../../../utils/ArrayUtils';
import hex from 'intel-hex';
import { IFirmware } from '../../storage/Storage';

export function Firmware() {
  const [file, setFile] = useState<File | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [phase, setPhase] = useState<IFirmwareWriterPhase | null>(null);

  const logsRef = React.createRef<HTMLTextAreaElement>();

  useEffect(() => {
    logsRef.current!.scrollTop = logsRef.current!.scrollHeight;
  });

  const handleFirmwareReadClick = async () => {
    const firmware: IFirmware = {
      mcu_type: 'atmega32u4',
      bootloader_type: 'caterina',
      flash_support: true,
      name: 'name1',
      created_at: new Date(),
      sourceCodeUrl: '',
      description: '',
      hash: '',
      filename: '',
    };
    const firmwareWriter: IFirmwareWriter = new FirmwareWriterWebApiImpl();
    const readResult = await firmwareWriter.read(
      firmware,
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

  const handleFirmwareWriteToCaterinaClick = async () => {
    if (!file) {
      return;
    }
    const firmware: IFirmware = {
      mcu_type: 'atmega32u4',
      bootloader_type: 'caterina',
      flash_support: true,
      name: 'name1',
      created_at: new Date(),
      sourceCodeUrl: '',
      description: '',
      hash: '',
      filename: '',
    };
    const parseResult = hex.parse(
      Buffer.from(new Uint8Array(await file.arrayBuffer()))
    );
    const firmwareWriter: IFirmwareWriter = new FirmwareWriterWebApiImpl();
    const writeResult = await firmwareWriter.write(
      firmware,
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

  const handleFirmwareWriteToDfuClick = async () => {
    if (!file) {
      return;
    }
    const firmware: IFirmware = {
      bootloader_type: 'dfu',
      flash_support: true,
      name: 'name1',
      created_at: new Date(),
      sourceCodeUrl: '',
      description: '',
      hash: '',
      filename: '',
    };
    const parseResult = hex.parse(
      Buffer.from(new Uint8Array(await file.arrayBuffer()))
    );
    const firmwareWriter: IFirmwareWriter = new FirmwareWriterWebApiImpl();
    const writeResult = await firmwareWriter.write(
      firmware,
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
        setPhase(phase);
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
      <h1>Web API Test</h1>
      <div className="box">
        <button onClick={handleFirmwareReadClick}>Firmware.read()</button>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFirmwareWriteToCaterinaClick}>
          Firmware.write() by Caterina
        </button>
        <button onClick={handleFirmwareWriteToDfuClick}>
          Firmware.write() by DFU
        </button>
      </div>
      <div className="box">
        <textarea
          ref={logsRef}
          rows={10}
          value={`${logs.join('\n')}`}
          readOnly
        />
        <div>Phase: {phase || '(null)'}</div>
      </div>
    </div>
  );
}
