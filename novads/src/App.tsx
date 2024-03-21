import React, { useState } from 'react';
import axios from "axios";

const App: React.FC = () => {
  const [inputType, setInputType] = useState('text');
  const [mode, setMode] = useState('ecb');
  const [key, setKey] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState('');
  const [initVector, setInitVector] = useState('');

  const handleEncrypt = () => {
    if ((mode === 'cbc' || mode === 'cfb' || mode === 'ofb') && (key.length !== 16 || initVector.length !== 16)) {
      alert('Key and initialization vector must be 16 characters long for CBC, CFB, and OFB modes.');
      return;
    }

    let requestData: any = {
      'text-array': textToBinary(text),
      'key-array': textToBinary(key),
      'init-vector': textToBinary(initVector),
      'encrypt': true
    };


    if (!(mode === 'cbc' || mode === 'cfb' || mode === 'ofb')) {
      delete requestData['init-vector'];
    }

    axios.post('http://localhost:8080/api/' + mode, requestData)
      .then(response => {
        const resultText = binaryToText(response.data.ResultBitArray);
        setResult(resultText);
        console.log(response.data.ResultBitArray);
      })
      .catch(error => {
        console.error('Error:', error);
        setResult('Failed to encrypt');
      });
      console.log(requestData)
    };

  const handleDecrypt = () => {
    if ((mode === 'cbc' || mode === 'cfb' || mode === 'ofb') && (key.length !== 16 || initVector.length !== 16)) {
      alert('Key and initialization vector must be 16 characters long for CBC, CFB, and OFB modes.');
      return;
    }

    let requestData: any = {
      'text-array': textToBinary(text),
      'key-array': textToBinary(key),
      'init-vector': textToBinary(initVector),
      'encrypt': false
    };

    if (!(mode === 'cbc' || mode === 'cfb' || mode === 'ofb')) {
      delete requestData['init-vector'];
    }


    axios.post('http://localhost:8080/api/' + mode, requestData)
    .then(response => {
        const resultText = binaryToText(response.data.ResultBitArray);
        setResult(resultText);
      })
      .catch(error => {
        console.error('Error:', error);
        setResult('Failed to decrypt');
      });
      console.log(requestData);
  };

  const handleInputTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInputType(event.target.value);
  };

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const textToBinary = (text: string): number[] => {
    const binaryArray: number[] = [];
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const binaryString = charCode.toString(2);
      const paddedBinaryString = binaryString.padStart(8, '0');
      const binaryIntegers = paddedBinaryString.split('').map(Number);
      binaryArray.push(...binaryIntegers);
    }
    return binaryArray;
  };

  const binaryToText = (binaryArray: number[]): string => {
    let text = '';
    for (let i = 0; i < binaryArray.length; i += 8) {
      const byte = binaryArray.slice(i, i + 8).join('');
      const charCode = parseInt(byte, 2);
      const char = String.fromCharCode(charCode);
      text += char;
    }
    return text;
  };



  return (
    <div className="container mx-auto px-4 py-8 bg-gray-800 text-gray-200 h-[43.453rem]">
      <h1 className="text-3xl font-bold mb-6">Welcome to Nova DS!</h1>

      <div className="flex flex-col mb-4">
        <label htmlFor="inputtype" className="mb-2 text-lg">
          Input type
        </label>
        <select
          id="inputtype"
          className="border p-2 rounded-md bg-gray-700 focus:ring-blue-500 focus:ring-opacity-50"
          value={inputType}
          onChange={handleInputTypeChange}
        >
          <option value="text">text</option>
          <option value="file">file</option>
        </select>
      </div>

      <div className="flex flex-col mb-4">
        <label htmlFor="cipher" className="mb-2 text-lg">
          Mode
        </label>
        <select
          id="cipher"
          className="border p-2 rounded-md bg-gray-700 focus:ring-blue-500 focus:ring-opacity-50"
          onChange={handleModeChange}
        >
          <option value="ecb">ECB</option>
          <option value="cbc">CBC</option>
          <option value="cfb">CFB</option>
          <option value="ofb">OFB</option>
          <option value="counter">Counter</option>
        </select>
      </div>

      {inputType === 'text' ? (
        <div className="flex flex-col mb-4">
          <label htmlFor="text" className="mb-2 text-lg">
            Text
          </label>
          <input
            type="text"
            id="text"
            className="border p-2 rounded-md bg-gray-700 focus:ring-blue-500 focus:ring-opacity-50"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      ) : (
        <div className="flex flex-col mb-4">
          <label htmlFor="file" className="mb-2 text-lg">
            File
          </label>
          <input
            type="file"
            id="file"
            className="border p-2 rounded-md bg-gray-700 focus:ring-blue-500 focus:ring-opacity-50"
            onChange={handleFileChange}
          />
        </div>
      )}

      <div className="flex flex-col mb-4">
        <label htmlFor="key" className="mb-2 text-lg">
          Key
        </label>
        <input
          type="text"
          id="key"
          className="border p-2 rounded-md bg-gray-700 focus:ring-blue-500 focus:ring-opacity-50"
          onChange={(e) => setKey(e.target.value)}
        />
      </div>

      {mode === 'cbc' || mode === 'cfb' || mode === 'ofb' ? (
        <div className="flex flex-col mb-4">
          <label htmlFor="initVector" className="mb-2 text-lg">
            Initialization Vector
          </label>
          <input
            type="text"
            id="initVector"
            className="border p-2 rounded-md bg-gray-700 focus:ring-blue-500 focus:ring-opacity-50"
            onChange={(e) => setInitVector(e.target.value)}
          />
        </div>
      ) : null}

      <div className="flex justify-between items-center mb-4">
        <div>
          <button
            className="bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-900 active:ring-blue-800 active:ring-opacity-50 mr-2"
            onClick={handleEncrypt}
          >
            Encrypt
          </button>
          <button
            className="bg-blue-400 text-white py-2 px-4 rounded-md hover:bg-blue-500 active:ring-blue-600 active:ring-opacity-50"
            onClick={handleDecrypt}
          >
            Decrypt
          </button>
        </div>
        <div>
          <button
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 active:ring-green-600 active:ring-opacity-50"
          >
            Download Result
          </button>
        </div>
      </div>

      <div className="flex flex-col mb-4">
        <label htmlFor="ciphertext" className="mb-2 text-lg">
          Result: {result}
        </label>
        no result yet
      </div>
    </div>
  );
}

export default App;
