import type { Currency, Token } from "@uniswap/sdk-core";
import type { TokenInfo, TokenList } from "@uniswap/token-lists";
import { getAddress } from "viem";

/**
 * Token instances created from token info on a token list.
 */
export class WrappedTokenInfo implements Token {
  readonly isNative = false as const;
  readonly isToken = true as const;
  readonly list?: TokenList;
  readonly tokenInfo: TokenInfo;

  private _checksummedAddress: string;

  constructor(tokenInfo: TokenInfo, list?: TokenList) {
    this.tokenInfo = tokenInfo;
    this.list = list;
    const checksummedAddress = getAddress(this.tokenInfo.address);
    if (!checksummedAddress) {
      throw new Error(`Invalid token address: ${this.tokenInfo.address}`);
    }
    this._checksummedAddress = checksummedAddress;
  }

  get address(): string {
    return this._checksummedAddress;
  }

  get chainId(): number {
    return this.tokenInfo.chainId;
  }

  get decimals(): number {
    return this.tokenInfo.decimals;
  }

  get name(): string {
    return this.tokenInfo.name;
  }

  get symbol(): string {
    return this.tokenInfo.symbol;
  }

  get logoURI(): string | undefined {
    return this.tokenInfo.logoURI;
  }

  equals(other: Currency): boolean {
    return (
      other.chainId === this.chainId &&
      other.isToken &&
      other.address.toLowerCase() === this.address.toLowerCase()
    );
  }

  sortsBefore(other: Token): boolean {
    if (this.equals(other)) throw new Error("Addresses should not be equal");
    return this.address.toLowerCase() < other.address.toLowerCase();
  }

  get wrapped(): Token {
    return this;
  }
}
