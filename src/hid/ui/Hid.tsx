import { WebHid } from '../web-hid';
import { useState } from 'react';
import './Hid.scss';
import { DynamicKeymapGetLayerCountCommand } from '../commands';
import { IKeyboard } from '../hid';

const Hid = () => {
  const [webHid] = useState<WebHid>(new WebHid());
  const [message, setMessage] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [vendorId, setVendorId] = useState<string>('5954');
  const [productId, setProductId] = useState<string>('1');
  const [useFilter, setUseFilter] = useState<boolean>(false);
  const [authorizedKeyboards, setAuthorizedKeyboards] = useState<IKeyboard[]>([]);
  const [selectedKeyboardValue, setSelectedKeyboardValue] = useState<number>(0);

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
      setProductName(webHid.getKeyboard()!.getInformation().productName);
    } else {
      setMessage(result.error!);
      console.log(result.cause);
    }
  };

  const handleCloseClick = async () => {
    await webHid.close();
    setProductName('');
    setMessage('');
  };

  const handleDynamicKeymapGetLayerCount = async () => {
    const command = new DynamicKeymapGetLayerCountCommand(
      {},
      async (result) => {
        if (result.success) {
          setMessage(String(result.response!.value));
        } else {
          setMessage(result.error!);
        }
      }
    );
    const result = await webHid.enqueue(command);
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

  const handleGetAuthorizedKeyboardsClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const keyboards = await webHid.detectKeyboards();
    setAuthorizedKeyboards(keyboards);
    setSelectedKeyboardValue(0);
  };

  const handleSelectedKeyboardValue = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKeyboardValue(Number(event.target.value));
  };

  const handleOpenClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const keyboard = authorizedKeyboards[selectedKeyboardValue];
    const result = await webHid.open(keyboard);
    if (result.success) {
      setProductName(webHid.getKeyboard()!.getInformation().productName);
    } else {
      setMessage(result.error!);
      console.log(result.cause);
    }
  };

  return (
    <div>
      <h1>WebHid Test</h1>
      <div className='box'>
        <button onClick={handleGetAuthorizedKeyboardsClick}>Get authorized keyboards</button>
        <select value={selectedKeyboardValue} onChange={handleSelectedKeyboardValue}>
          {authorizedKeyboards.map((k, i) => {
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
        <button onClick={handleConnectClick}>Connect</button>
      </div>
      <div className='box'>
        <button onClick={handleCloseClick}>Close</button>
      </div>
      <div className='box'>
        <button onClick={handleDynamicKeymapGetLayerCount}>DynamicKeymapGetLayerCount</button>
      </div>
      <div>Product Name: {productName}</div>
      <div>{message}</div>
    </div>
  );
};

export default Hid;
