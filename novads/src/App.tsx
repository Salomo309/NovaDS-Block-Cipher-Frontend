import React from 'react';

const App: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-800 text-gray-200 h-[43.453rem]">
      <h1 className="text-3xl font-bold mb-6">Welcome to CipherWeb!</h1>

      <div className="flex flex-col mb-4">
        <label htmlFor="inputtype" className="mb-2 text-lg">
          Input type
        </label>
        <select
          id="inputtype"
          className="border p-2 rounded-md bg-gray-700 focus:ring-blue-500 focus:ring-opacity-50"
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
        >
          <option value="vigenere">ECB</option>
          <option value="autokeyvigenere">CBC</option>
          <option value="extendedvigenere">CFB</option>
          <option value="playfair">OFB</option>
          <option value="affine">Counter</option>
        </select>
      </div>

      <div className="flex flex-col mb-4">
        <label htmlFor="key" className="mb-2 text-lg">
          Key
        </label>
        <input
          type="text"
          id="key"
          className="border p-2 rounded-md bg-gray-700 focus:ring-blue-500 focus:ring-opacity-50"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <button
            className="bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-900 active:ring-blue-800 active:ring-opacity-50 mr-2"
          >
            Encrypt
          </button>
          <button
            className="bg-blue-400 text-white py-2 px-4 rounded-md hover:bg-blue-500 active:ring-blue-600 active:ring-opacity-50"
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
          Result:
        </label>
        no result yet
      </div>
    </div>
  );
}

export default App;
