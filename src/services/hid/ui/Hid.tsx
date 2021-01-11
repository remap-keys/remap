import { WebHid } from '../web-hid';
import React, { useEffect, useState } from 'react';
import './Hid.scss';
import {
  DynamicKeymapGetKeycodeCommand,
  DynamicKeymapReadBufferCommand,
} from '../commands';
import { IKeyboard } from '../hid';
import KeycodeArray from '../assets/keycodes.json';

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
  const [layer2, setLayer2] = useState<number>(0);
  const [rowCount, setRowCount] = useState<number>(0);
  const [columnCount, setColumnCount] = useState<number>(0);
  const [bufferOffset, setBufferOffset] = useState<number>(0);
  const [bufferSize, setBufferSize] = useState<number>(28);

  useEffect(() => {
    webHid
      .detectKeyboards()
      .then((keyboards) => setConnectedKeyboards(keyboards));
  }, [webHid]);

  useEffect(() => {
    webHid.setConnectionEventHandler({
      connect: (connectedKeyboard) => {
        const newConnectedKeyboards = [...connectedKeyboards];
        newConnectedKeyboards.push(connectedKeyboard);
        setConnectedKeyboards(newConnectedKeyboards);
      },
      disconnect: (disconnectedKeyboard) => {
        const newConnectedKeyboards = connectedKeyboards.filter(
          (x) => x !== disconnectedKeyboard
        );
        setConnectedKeyboards(newConnectedKeyboards);
      },
    });
  }, []);

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
    if (keyboard) {
      const result = await keyboard.fetchLayerCount();
      if (result.success) {
        setLayerCount(result.layerCount!);
      } else {
        setMessage(result.error!);
        console.log(result.cause);
      }
    } else {
      setMessage('No any keyboards opened.');
    }
  };

  const handleVendorIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVendorId(event.target.value);
  };

  const handleProductIdChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProductId(event.target.value);
  };

  const handleUseFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUseFilter(event.target.checked);
  };

  const handleGetConnectedKeyboardsClick = async () => {
    const keyboards = await webHid.detectKeyboards();
    setConnectedKeyboards(keyboards);
    setSelectedKeyboardValue(0);
  };

  const handleSelectedKeyboardValue = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedKeyboardValue(Number(event.target.value));
  };

  const handleOpenClick = async () => {
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

  const handleLayerChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLayer(Number(event.target.value));
  };

  const handleLayer2Change = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLayer2(Number(event.target.value));
  };

  const handleRowChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRow(Number(event.target.value));
  };

  const handleRowCountChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowCount(Number(event.target.value));
  };

  const handleColumnChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setColumn(Number(event.target.value));
  };

  const handleColumnCountChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setColumnCount(Number(event.target.value));
  };

  const handleCodeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCode(Number(event.target.value));
  };

  const handleBufferOffsetChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBufferOffset(Number(event.target.value));
  };

  const handleBufferSizeChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBufferSize(Number(event.target.value));
  };

  const handleFetchKeymapClick = async () => {
    if (keyboard) {
      const fetchKeymapResult = await keyboard.fetchKeymaps(
        layer2,
        rowCount,
        columnCount
      );
      if (fetchKeymapResult.success) {
        console.log(fetchKeymapResult.keymap);
      } else {
        setMessage(fetchKeymapResult.error!);
        console.log(fetchKeymapResult.cause);
      }
    } else {
      setMessage('No any keyboard opened.');
    }
  };

  const handleDynamicKeymapGetKeycodeClick = async () => {
    const command = new DynamicKeymapGetKeycodeCommand(
      {
        layer,
        row,
        column,
      },
      async (result) => {
        if (result.success) {
          console.log(result.response!.code);
          setCode(result.response!.code);
        } else {
          setMessage(result.error!);
          console.log(result.cause);
        }
      }
    );
    await keyboard!.enqueue(command);
  };

  const handleDynamicKeymapSetKeycodeClick = async () => {
    const result = await keyboard!.updateKeymap(layer, row, column, code);
    if (!result.success) {
      setMessage(result.error!);
      console.log(result.cause);
    }
  };

  const handleReadBufferClick = async () => {
    const command = new DynamicKeymapReadBufferCommand(
      {
        offset: bufferOffset,
        size: bufferSize,
      },
      async (result) => {
        console.log(result);
      }
    );
    await keyboard!.enqueue(command);
  };

  return (
    <div className="hid">
      <h1>WebHid Test</h1>
      <div className="box">
        <button onClick={handleGetConnectedKeyboardsClick}>
          Get connected keyboards
        </button>
        <select
          value={selectedKeyboardValue}
          onChange={handleSelectedKeyboardValue}
        >
          {connectedKeyboards.map((k, i) => {
            return (
              <option key={i} value={i}>
                {k.getInformation().productName}
              </option>
            );
          })}
        </select>
        <button onClick={handleOpenClick}>Open</button>
      </div>
      <div className="box">
        <input
          type="checkbox"
          id="useFilter"
          checked={useFilter}
          onChange={handleUseFilterChange}
        />
        <label htmlFor="useFilter">Use filter</label>
        <label htmlFor="vendorId">Vendor ID: </label>
        0x
        <input
          type="text"
          id="vendorId"
          value={vendorId}
          onChange={handleVendorIdChange}
        />
        <label htmlFor="productId">Product ID: </label>
        0x
        <input
          type="text"
          id="productId"
          value={productId}
          onChange={handleProductIdChange}
        />
        <button onClick={handleConnectClick}>Connect and open</button>
      </div>
      <div className="box">
        <span>Product Name: {productName}</span>
        <button onClick={handleCloseClick}>Close</button>
      </div>
      <div className="box">
        <button onClick={handleDynamicKeymapGetLayerCount}>
          Get layer count
        </button>
        Layers: {layerCount}
      </div>
      <div className="box">
        <label htmlFor="layer">Layer</label>
        <input
          type="number"
          id="layer"
          min={0}
          max={Math.max(layerCount - 1, 0)}
          value={layer}
          onChange={handleLayerChange}
        />
        <label htmlFor="row">Row</label>
        <input
          type="number"
          id="row"
          min={0}
          value={row}
          onChange={handleRowChange}
        />
        <label htmlFor="column">Column</label>
        <input
          type="number"
          id="column"
          min={0}
          value={column}
          onChange={handleColumnChange}
        />
        <select value={code} onChange={handleCodeChange}>
          {KeycodeArray.map((keycode) => {
            return (
              <option key={keycode.code} value={keycode.code}>
                {keycode.name.long}
              </option>
            );
          })}
        </select>
        <button onClick={handleDynamicKeymapGetKeycodeClick}>
          Get keycode
        </button>
        <button onClick={handleDynamicKeymapSetKeycodeClick}>
          Set keycode
        </button>
      </div>
      <div className="box">
        <label htmlFor="layer2">Layer</label>
        <input
          type="number"
          id="layer2"
          min={0}
          max={layerCount}
          value={layer2}
          onChange={handleLayer2Change}
        />
        <label htmlFor="rowCount">Row count</label>
        <input
          type="number"
          id="rowCount"
          min={0}
          value={rowCount}
          onChange={handleRowCountChange}
        />
        <label htmlFor="columnCount">Column count</label>
        <input
          type="number"
          id="columnCount"
          min={0}
          value={columnCount}
          onChange={handleColumnCountChange}
        />
        <button onClick={handleFetchKeymapClick}>Fetch keymap</button>
      </div>
      <div className="box">
        <label htmlFor="bufferOffset">Offset</label>
        <input
          type="number"
          id="bufferOffset"
          min={0}
          value={bufferOffset}
          onChange={handleBufferOffsetChange}
        />
        <label htmlFor="bufferSize">Size</label>
        <input
          type="number"
          id="bufferSize"
          min={0}
          value={bufferSize}
          onChange={handleBufferSizeChange}
        />
        <button onClick={handleReadBufferClick}>Read buffer</button>
      </div>
      <div className="box">
        <label htmlFor="Test">Test</label>
        <input type="text" style={{ width: '300px' }} />
      </div>
      <div>{message}</div>
    </div>
  );
};

export default Hid;
