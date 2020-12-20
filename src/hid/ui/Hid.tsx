import { WebHid } from '../web-hid';
import React, { useEffect, useState } from 'react';
import './Hid.scss';
import {
  DynamicKeymapGetKeycodeCommand,
  DynamicKeymapGetLayerCountCommand,
  DynamicKeymapSetKeycodeCommand
} from '../commands';
import { IKeyboard } from '../hid';
import { keycodeArray, keycodeToNameMap } from '../keycode';

const Hid = () => {
  const [webHid] = useState<WebHid>(new WebHid());
  const [keyboard, setKeyboard] = useState<IKeyboard | undefined>(undefined);
  const [message, setMessage] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [vendorId, setVendorId] = useState<string>('5954');
  const [productId, setProductId] = useState<string>('1');
  const [useFilter, setUseFilter] = useState<boolean>(false);
  const [connectedKeyboards, setConnectedKeyboards] = useState<IKeyboard[]>([]);
  const [selectedKeyboardValue, setSelectedKeyboardValue] = useState<number>(0);
  const [layerCount, setLayerCount] = useState<number>(0);
  const [layer, setLayer] = useState<number>(0);
  const [row, setRow] = useState<number>(0);
  const [column, setColumn] = useState<number>(0);
  const [code, setCode] = useState<number>(0);

  useEffect(() => {
    webHid.detectKeyboards()
      .then(keyboards => setConnectedKeyboards(keyboards));
  }, [webHid]);

  useEffect(() => {
    webHid.setConnectionEventHandler({
      connect: connectedKeyboard => {
        const newConnectedKeyboards = [...connectedKeyboards];
        const found = newConnectedKeyboards.find(x => x.equals(connectedKeyboard));
        if (!found) {
          newConnectedKeyboards.push(connectedKeyboard);
        }
        setConnectedKeyboards(newConnectedKeyboards);
      },
      disconnect: disconnectedKeyboard => {
        const newConnectedKeyboards = connectedKeyboards.filter(x => !x.equals(disconnectedKeyboard));
        setConnectedKeyboards(newConnectedKeyboards);
      }
    });
  }, [webHid, connectedKeyboards]);

  const handleConnectClick = async () => {
    let result;
    if (useFilter) {
      result = await webHid.connect({
        vendorId: parseInt(vendorId, 16),
        productId: parseInt(productId, 16),
      });
    } else {
      result = await webHid.connect();
    }
    if (result.success) {
      await result.keyboard!.open();
      setKeyboard(result.keyboard);
      setProductName(result.keyboard!.getInformation().productName);
    } else {
      setMessage(result.error!);
      console.log(result.cause);
    }
  };

  const handleCloseClick = async () => {
    if (keyboard) {
      await keyboard.close();
      setKeyboard(undefined);
    }
    setProductName('');
    setMessage('');
  };

  const handleDynamicKeymapGetLayerCount = async () => {
    const command = new DynamicKeymapGetLayerCountCommand(
      {},
      async (result) => {
        if (result.success) {
          setLayerCount(result.response!.value);
        } else {
          setMessage(result.error!);
        }
      }
    );
    const result = await keyboard!.enqueue(command);
    if (!result.success) {
      setMessage(result.error!);
    }
  };

  const handleVendorIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVendorId(event.target.value);
  };

  const handleProductIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProductId(event.target.value);
  };

  const handleUseFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseFilter(event.target.checked);
  };

  const handleGetConnectedKeyboardsClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const keyboards = await webHid.detectKeyboards();
    setConnectedKeyboards(keyboards);
    setSelectedKeyboardValue(0);
  };

  const handleSelectedKeyboardValue = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKeyboardValue(Number(event.target.value));
  };

  const handleOpenClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const keyboard = connectedKeyboards[selectedKeyboardValue];
    const result = await keyboard.open();
    if (result.success) {
      setKeyboard(keyboard);
      setProductName(keyboard.getInformation().productName);
    } else {
      setMessage(result.error!);
      console.log(result.cause);
    }
  };

  const handleLayerChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLayer(Number(event.target.value));
  };

  const handleRowChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setRow(Number(event.target.value));
  };

  const handleColumnChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setColumn(Number(event.target.value));
  };

  const handleCodeChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCode(Number(event.target.value));
  };

  const handleDynamicKeymapGetKeycodeClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const command = new DynamicKeymapGetKeycodeCommand({
      layer,
      row,
      column
    }, async (result) => {
      if (result.success) {
        console.log(result.response!.code);
        setCode(result.response!.code);
      } else {
        setMessage(result.error!);
        console.log(result.cause);
      }
    });
    await keyboard!.enqueue(command);
  };

  const handleDynamicKeymapSetKeycodeClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const command = new DynamicKeymapSetKeycodeCommand({
      layer,
      row,
      column,
      code,
    }, async (result) => {
      if (result.success) {
        setCode(result.response!.code);
      } else {
        setMessage(result.error!);
        console.log(result.cause);
      }
    });
    await keyboard!.enqueue(command);
  };

  return (
    <div>
      <h1>WebHid Test</h1>
      <div className='box'>
        <button onClick={handleGetConnectedKeyboardsClick}>Get connected keyboards</button>
        <select value={selectedKeyboardValue} onChange={handleSelectedKeyboardValue}>
          {connectedKeyboards.map((k, i) => {
            return <option key={i} value={i}>
              {k.getInformation().productName}
            </option>;
          })}
        </select>
        <button onClick={handleOpenClick}>Open</button>
      </div>
      <div className='box'>
        <input type='checkbox' id='useFilter' checked={useFilter} onChange={handleUseFilterChange} />
        <label htmlFor='useFilter'>Use filter</label>
        <label htmlFor='vendorId'>Vendor ID: </label>
        0x<input type='text' id='vendorId' value={vendorId} onChange={handleVendorIdChange} />
        <label htmlFor='productId'>Product ID: </label>
        0x<input type='text' id='productId' value={productId} onChange={handleProductIdChange} />
        <button onClick={handleConnectClick}>Connect and open</button>
      </div>
      <div className='box'>
        <span>Product Name: {productName}</span>
        <button onClick={handleCloseClick}>Close</button>
      </div>
      <div className='box'>
        <button onClick={handleDynamicKeymapGetLayerCount}>Get layer count</button>
        Layers: {layerCount}
      </div>
      <div className='box'>
        <label htmlFor='layer'>Layer</label>
        <input type='number' id='layer' min={0} max={Math.max(layerCount - 1, 0)} value={layer} onChange={handleLayerChange} />
        <label htmlFor='row'>Row</label>
        <input type='number' id='row' min={0} value={row} onChange={handleRowChange} />
        <label htmlFor='column'>Column</label>
        <input type='number' id='column' min={0} value={column} onChange={handleColumnChange} />
        <select value={code} onChange={handleCodeChange}>
          {keycodeArray.map(keycode => {
            return <option key={keycode.code} value={keycode.code}>{keycode.name.short}</option>;
          })}
        </select>
        <button onClick={handleDynamicKeymapGetKeycodeClick}>Get keycode</button>
        <button onClick={handleDynamicKeymapSetKeycodeClick}>Set keycode</button>
      </div>
      <div className='box'>
        <label htmlFor='Test'>Test</label>
        <input type='text' style={{ width: '300px' }} />
      </div>
      <div>{message}</div>
    </div>
  );
};

export default Hid;
