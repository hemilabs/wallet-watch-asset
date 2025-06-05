interface Provider {
  isMetaMask?: boolean;
  request(args: { method: string; params: any }): Promise<any>;
}

interface Token {
  address: `0x${string}`;
  chainId: number;
  decimals: number;
  logoURI?: string;
  name: string;
  symbol: string;
}

declare function watchAsset(
  provider: Provider,
  account: `0x${string}`,
  token: Token,
  storage?: Storage,
): Promise<true>;

export = watchAsset;
