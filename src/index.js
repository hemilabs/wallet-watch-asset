"use strict";

/**
 * @typedef {Object} Provider
 * @property {boolean} [isMetaMask]
 * @property {(args: {method: string, params: any}) => Promise<any>} request
 */

/**
 * @typedef {Object} Token
 * @property {`0x${string}`} address The address of the token.
 * @property {number} chainId The chain id where this token is deployed.
 * @property {number} decimals The number of decimals.
 * @property {string} name The name of the token.
 * @property {string} symbol The symbol for the token.
 * @property {string} [logoURI] A URI to the token logo asset.
 */

/**
 * Helper to let EIP-747 compatible wallets track ERC20 assets.
 *
 * @param {Provider} provider The EIP-1193 provider.
 * @param {`0x${string}`} account The account that will watch the token.
 * @param {Token} token The token to watch (Uniswap Token List format).
 * @param {Storage} [storage] To track already-watched tokens. I.e. localStorage.
 * @return {Promise<true>} The asset was added to the watch list.
 */
async function watchAsset(provider, account, token, storage) {
  const { address, chainId, decimals, logoURI, symbol } = token;

  // The only wallet known so far with EIP-747 support is MetaMask.
  if (!provider.isMetaMask) {
    throw new Error("Wallet not supported");
  }

  const storageKey = `watchedAssets:${account}`;
  const watchedAssets = storage?.getItem(storageKey) || "";
  const tokenId = `${chainId}:${address}|`; // ERC-3770-ish format
  if (watchedAssets.includes(tokenId)) {
    return true;
  }

  const success = await provider.request({
    method: "wallet_watchAsset",
    params: {
      options: { address, decimals, image: logoURI, symbol },
      type: "ERC20",
    },
  });
  if (!success) {
    throw new Error(`${symbol} not added to the wallet's watch list`);
  }

  storage?.setItem(storageKey, watchedAssets.concat(tokenId));
  return true;
}

module.exports = watchAsset;
