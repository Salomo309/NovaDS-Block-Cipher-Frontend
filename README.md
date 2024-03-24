# NovaDS Modern Block Cipher
> Frontend side of NovaDS Modern Block Cipher Web. NovaDS Modern Block Cipher is a modern encryption and decryption tool that provides various block cipher modes such as ECB, CBC, CFB, OFB, and Counter. It offers both text and file encryption and decryption functionalities.

## Features

- Support for multiple block cipher modes: ECB, CBC, CFB, OFB, and Counter.
- Encrypt and decrypt both text and files.
- User-friendly interface for inputting text or selecting files.
- Key and initialization vector input for CBC, CFB, and OFB modes.
- Downloadable encrypted or decrypted results.

## Usage

1. Select the input type (text or file).
2. Choose the encryption mode (ECB, CBC, CFB, OFB, or Counter).
3. Input the text to encrypt or select the file to encrypt/decrypt.
4. Enter the encryption key (must be 16 characters long for CBC, CFB, and OFB modes).
5. If using CBC, CFB, or OFB modes, provide the initialization vector (IV) of 16 characters.
6. Click the "Encrypt" or "Decrypt" button to perform the operation.
7. Download the encrypted or decrypted result.

## Installation and How To Compile

Clone the repository:<br />
```
git clone https://github.com/Salomo309/NovaDS-Block-Cipher-Frontend.git
```
Navigate to the project directory and install dependencies (cd novads)
```
cd novads
```

Run the program
```
npm i
npm start
```
Access the application in your web browser at `http://localhost:3000`.<br />
Don't forget to run the backend side also. Further explanation on how to run the backend development server stated on [this repository](https://github.com/GoDillonAudris512/NovaDS-Block-Cipher-Backend)

## Technologies Used

- ReactTS (Frontend)
- Golang (Backend)

## Team Members

| NIM      | Name                           |
| -------- | ------------------------------ |
| 13521062 | Go Dillon Audris               |
| 13521063 | Salomo Reinhart Gregory Manalu |
