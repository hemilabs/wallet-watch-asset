# wallet-watch-asset

A JavaScript library for adding ERC20 tokens to EIP-747 compatible wallets like MetaMask. This package provides a simple way to help users track new tokens in their wallet.

## Installation

```bash
npm install wallet-watch-asset
```

## Usage

The library provides a simple function to add an ERC20 token to a user's wallet watch list:

```javascript
const watchAsset = require("wallet-watch-asset");

// Example token (in Uniswap Token List format)
const token = {
  address: "0x1234567890123456789012345678901234567890",
  chainId: 1,
  decimals: 18,
  name: "My Token",
  symbol: "MTK",
  logoURI: "https://example.com/token-logo.png", // optional
};

// Using with MetaMask or other EIP-1193 provider
try {
  const success = await watchAsset(
    window.ethereum, // provider
    "0xUserAddress", // user's account
    token,
    localStorage, // optional, to track already-watched tokens
  );

  if (success) {
    console.log("Token added to watch list!");
  }
} catch (error) {
  console.error("Failed to add token:", error);
}
```

## API

### `watchAsset(provider, account, token, storage?)`

Helps EIP-747 compatible wallets track ERC20 assets.

#### Parameters

- `provider` (Provider): An EIP-1193 compatible provider (e.g., `window.ethereum`)

  - Must have a `request` method
  - `isMetaMask` property is checked to ensure compatibility

- `account` (string): The Ethereum address that will watch the token (must be in the format `0x...`)

- `token` (Token): The token to watch (follows Uniswap Token List format)

  - `address` (string): The token contract address (must be in the format `0x...`)
  - `chainId` (number): The chain ID where the token is deployed
  - `decimals` (number): The number of decimals for the token
  - `name` (string): The name of the token
  - `symbol` (string): The symbol for the token
  - `logoURI` (string, optional): A URI to the token logo asset

- `storage` (Storage, optional): Storage interface to track already-watched tokens (e.g., `localStorage`)

#### Returns

- `Promise<true>`: Resolves to `true` when the asset is successfully added to the watch list

#### Throws

- Throws an error if the wallet doesn't support EIP-747 or if the token addition fails
