import { WebHid } from '../web-hid';
import { useState } from 'react';
import './Hid.scss';
import { DynamicKeymapGetLayerCountCommand } from '../commands';

const Hid = () => {
  const [webHid] = useState<WebHid>(new WebHid());
  const [message, setMessage] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [vendorId, setVendorId] = useState<string>('5954');
  const [productId, setProductId] = useState<string>('1');

  const handleConnectClick = async () => {
    const result = await webHid.connect({
      vendorId: parseInt(vendorId, 16),
      productId: parseInt(productId, 16),
    });
    if (result.success) {
      setProductName(webHid.getKeyboard()!.getInformation().productName);
    } else {
      setMessage(result.error!);
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

  return (
    <div>
      <h1>WebHid Test</h1>
      <div>
        <label htmlFor='vendorId'>Vendor ID: 0x</label>
        <input type='text' id='vendorId' value={vendorId} onChange={handleVendorIdChange} />
        <label htmlFor='productId'>Product ID: 0x</label>
        <input type='text' id='productId' value={productId} onChange={handleProductIdChange} />
        <button onClick={handleConnectClick}>Connect</button>
        <button onClick={handleCloseClick}>Close</button>
      </div>
      <div>
        <button onClick={handleDynamicKeymapGetLayerCount}>DynamicKeymapGetLayerCount</button>
      </div>
      <div>Product Name: {productName}</div>
      <div>{message}</div>
    </div>
  );
};

export default Hid;
