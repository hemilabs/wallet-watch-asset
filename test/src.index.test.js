"use strict";

const { test } = require("node:test");
const assert = require("node:assert").strict;

const watchAsset = require("../src/index");

/** @type {`0x${string}`} */
const mockAddress = "0x1234567890123456789012345678901234567890";
const mockToken = {
  address: mockAddress,
  chainId: 1,
  decimals: 18,
  logoURI: "https://example.com/logo.png",
  name: "Test Token",
  symbol: "TEST",
};

/** @type {`0x${string}`} */
const mockAccount = "0x9876543210987654321098765432109876543210";

class MockStorage {
  constructor(initialData = "") {
    this.data = initialData;
  }
  getItem() {
    return this.data;
  }
  setItem(key, value) {
    this.data = value;
    return null;
  }

  // Required Storage interface methods
  clear() {}
  key() {
    return null;
  }
  removeItem() {}
  get length() {
    return 0;
  }
}

test("Calls wallet_watchAsset if asset not in storage", async function () {
  // Mock provider that returns success
  const mockProvider = {
    isMetaMask: true,
    async request({ method, params }) {
      assert.equal(method, "wallet_watchAsset");
      assert.deepEqual(params, {
        options: {
          address: mockToken.address,
          decimals: mockToken.decimals,
          image: mockToken.logoURI,
          symbol: mockToken.symbol,
        },
        type: "ERC20",
      });
      return true;
    },
  };

  const mockStorage = new MockStorage("");
  const result = await watchAsset(
    mockProvider,
    mockAccount,
    mockToken,
    mockStorage,
  );
  assert.equal(result, true);
});

test("Does not call wallet_watchAsset if asset already in storage", async function () {
  let requestCalled = false;

  const mockProvider = {
    isMetaMask: true,
    async request() {
      requestCalled = true;
      return true;
    },
  };

  const mockStorage = new MockStorage(
    `${mockToken.chainId}:${mockToken.address}|`,
  );
  const result = await watchAsset(
    mockProvider,
    mockAccount,
    mockToken,
    mockStorage,
  );
  assert.equal(result, true);
  assert.equal(requestCalled, false);
});

test("Throws error for non-MetaMask provider", async function () {
  const mockProvider = {
    request: async () => true,
  };

  await assert.rejects(
    () => watchAsset(mockProvider, mockAccount, mockToken, undefined),
    { message: "Wallet not supported" },
  );
});

test("Throws error when wallet rejects", async function () {
  const mockProvider = {
    isMetaMask: true,
    request: async () => false,
  };

  await assert.rejects(
    () => watchAsset(mockProvider, mockAccount, mockToken, undefined),
    { message: `${mockToken.symbol} not added to the wallet's watch list` },
  );
});
