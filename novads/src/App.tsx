import React, { useEffect, useState } from 'react';
import axios from "axios";

const App: React.FC = () => {
  const [inputType, setInputType] = useState('text');
  const [mode, setMode] = useState('ecb');
  const [key, setKey] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [initVector, setInitVector] = useState('');
  const [fileType, setFileType] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [result, setResult] = useState<number[]>();
  const [resultShow, setResultShow] = useState<string>('')
  const [duration, setDuration] = useState<number | null>(null);

  /* TEXT CONVERTER */
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
      if (charCode >= 0 && charCode <= 256) {
        const char = String.fromCharCode(charCode);
        text += char;
      }
    }
    return text;
  };

  /* FILE CONVERTER */
  const fileToBinaryArray = (file: File): Promise<number[]> => {
    return new Promise<number[]>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target) {
          const buffer = new Uint8Array(event.target.result as ArrayBuffer)
          const binaryArray: number[] = [];

          buffer.forEach(byte => {
            const binaryString = byte.toString(2).padStart(8, '0');
            for (let i = 0; i < binaryString.length; i++) {
              binaryArray.push(Number(binaryString[i]));
            }
          });

          resolve(binaryArray);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = (event) => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsArrayBuffer(file);
    });
  };

  /* uint8 Array CONVERTER*/
  const binaryArrayToUint8Array = (binaryArray: number[]): Uint8Array => {
    const byteLength = binaryArray.length / 8;
    const uint8Array = new Uint8Array(byteLength);

    for (let i = 0; i < binaryArray.length; i++) {
      const byteIndex = Math.floor(i / 8);
      const bitOffset = i % 8;

      if (binaryArray[i] === 1) {
        uint8Array[byteIndex] |= (1 << (7 - bitOffset));
      }
    }

    return uint8Array;
  };

  /* ENCRYPTION AND DECRYPTION HANDLER FUNCTION*/
  const handleEncrypt = async () =>  {
    let requestData: any;
    if (key.length !== 16) {
      setResultShow("Failed to Encrypt")
      alert('Key must be 16 characters long.');
      return;
    }

    if ((mode === 'cbc' || mode === 'cfb' || mode === 'ofb') && (initVector.length !== 16)) {
      setResultShow("Failed to Encrypt")
      alert('Initialization vector must be 16 characters long for CBC, CFB, and OFB modes.');
      return;
    }

    if (inputType === 'text') {
      requestData = {
        'text-array': textToBinary(text),
        'key-array': textToBinary(key),
        'encrypt': true
      };
    }
    else {
      if (file) {
        requestData = {
          'text-array': await fileToBinaryArray(file),
          'key-array': textToBinary(key),
          'encrypt': true
        };
      }
    }

    if ((mode === 'cbc' || mode === 'cfb' || mode === 'ofb')) {
      requestData['init-vector'] = textToBinary(initVector)
    }

    try {
      setResultShow("Encrypting, please wait a minute...")
      const startTime = new Date().getTime();
      const response = await axios.post('http://localhost:8080/api/' + mode, requestData);
      const endTime = new Date().getTime();

      setDuration(endTime - startTime);
      if (inputType === 'text') {
        setResult(response.data['result-array']);
        setResultShow(btoa(binaryToText(response.data['result-array'])))
      }
      else {
        setResult(response.data['result-array']);
        if (response.data['result-array'].length > 2000) {
          setResultShow("Please view the file instead")
        }
        else {
          setResultShow(btoa(binaryToText(response.data['result-array'])))
        }
      }
    } catch (error) {
      setResultShow('Failed to Encrypt');
    }
  }

  const handleDecrypt = async () =>  {
    let requestData: any;
    if (key.length !== 16) {
      setResultShow("Failed to Decrypt")
      alert('Key must be 16 characters long.');
      return;
    }

    if ((mode === 'cbc' || mode === 'cfb' || mode === 'ofb') && (key.length !== 16 || initVector.length !== 16)) {
      setResultShow("Failed to Decrypt")
      alert('Initialization vector must be 16 characters long for CBC, CFB, and OFB modes.');
      return;
    }

    if (inputType === 'text') {
      requestData = {
        'text-array': textToBinary(atob(text)),
        'key-array': textToBinary(key),
        'encrypt': false
      };
    }
    else {
      if (file) {
        requestData = {
          'text-array': await fileToBinaryArray(file),
          'key-array': textToBinary(key),
          'encrypt': false
        };
      }
    }

    if ((mode === 'cbc' || mode === 'cfb' || mode === 'ofb')) {
      requestData['init-vector'] = textToBinary(initVector)
    }

    try {
      setResultShow("Decrypting, please wait a minute...")
      const startTime = new Date().getTime();
      const response = await axios.post('http://localhost:8080/api/' + mode, requestData);
      const endTime = new Date().getTime();

      setDuration(endTime - startTime);
      if (inputType === 'text') {
        setResult(response.data['result-array']);
        setResultShow(binaryToText(response.data['result-array']))
      }
      else {
        setResult(response.data['result-array']);
        if (response.data['result-array'].length > 2000) {
          setResultShow("Please view the file instead")
        }
        else {
          setResultShow(btoa(binaryToText(response.data['result-array'])))
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setResultShow('Failed to Decrypt');
    }
  };

  /* CHANGE HANDLER FUNCTION */
  const handleInputTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInputType(event.target.value);
  };

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setFileType(file.type)
      setFileName(file.name)
      setFile(file)
    }
  };

  const handleDownload = () => {
    if (!result) {
      alert('No result to download. Please encrypt or decrypt first.');
      return;
    }

    let content = binaryArrayToUint8Array(result);

    if (fileType != '') {
      const blob = new Blob([content as Uint8Array], { type: fileType });
      const downloadFile = new File([blob], fileName, { type: fileType } )
      const element = document.createElement('a');
      element.href = URL.createObjectURL(downloadFile)
      element.download = `result-${fileName}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    else {
      const downloadFile = new Blob([content], { type: "application/octet-stream" })
      const element = document.createElement('a');
      element.href = URL.createObjectURL(downloadFile)
      element.download = `result-${fileName}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };


  return (
    <div className="container mx-auto px-4 py-8 bg-gray-800 text-gray-200 h-max">
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
            value={initVector}
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
            onClick={handleDownload}
          >
            Download Result
          </button>
        </div>
      </div>

      <div className="flex flex-col mb-4">
        Duration: {duration ?? 0} ms
        <label htmlFor="ciphertext" className="mb-2 text-lg">
          Result:
        </label>
        <div className="w-full">
          <pre className="whitespace-pre-wrap overflow-x-auto break-words">
            {resultShow}
          </pre>
      </div>
      </div>
    </div>
  );
}

export default App;
