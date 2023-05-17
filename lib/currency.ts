import { SupportedChainIDs } from "./types";
import { Token as UniswapToken } from "@uniswap/sdk-core";
import { NativeCurrency as UniswapNativeCurrency } from "@uniswap/sdk-core";
import invariant from "tiny-invariant";

export class Token extends UniswapToken {
  public readonly logoURI?: string;

  public constructor(
    chainId: number,
    address: string,
    decimals: number,
    symbol: string,
    name: string,
    logoURI?: string,
  ) {
    super(chainId, address, decimals, symbol, name);

    this.logoURI = logoURI;
  }
}

export const WETH9: { [chainId in SupportedChainIDs]: Token } = {
  [11155111]: new Token(
    11155111,
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    18,
    "WSEP",
    "Wrapped Sepolia Ether",
  ),
};

export class NativeCurrency extends UniswapNativeCurrency {
  public readonly logoURI?: string;

  public constructor(
    chainId: number,
    decimals: number,
    symbol: string,
    name: string,
    logoURI?: string,
  ) {
    super(chainId, decimals, symbol, name);

    this.logoURI = logoURI;
  }

  public get wrapped(): Token {
    const weth9 = WETH9[this.chainId as SupportedChainIDs];
    invariant(!!weth9, "WRAPPED");
    return weth9;
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId;
  }
}

export type Currency = Token | NativeCurrency;
