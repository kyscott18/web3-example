import { NativeCurrency, Token } from "../currency";
import { ReverseMirage } from "./types";
import { CurrencyAmount } from "@uniswap/sdk-core";
import { getAddress } from "viem";
import { Address, PublicClient, erc20ABI } from "wagmi";

export const erc20Balance = (
  publicClient: PublicClient,
  args: { nativeCurrency: NativeCurrency; address: Address },
) => {
  return {
    read: () => publicClient.getBalance({ address: args.address }),
    parse: (data) =>
      CurrencyAmount.fromRawAmount(args.nativeCurrency, data.toString()),
  } satisfies ReverseMirage<bigint>;
};

export const erc20BalanceOf = (
  publicClient: PublicClient,
  args: { token: Token; address: Address },
) => {
  return {
    read: () =>
      publicClient.readContract({
        abi: erc20ABI,
        address: args.token.address as Address,
        functionName: "balanceOf",
        args: [args.address],
      }),
    parse: (data) => CurrencyAmount.fromRawAmount(args.token, data.toString()),
  } satisfies ReverseMirage<bigint>;
};

export const erc20Allowance = (
  publicClient: PublicClient,
  args: { token: Token; address: Address; spender: Address },
) => {
  return {
    read: () =>
      publicClient.readContract({
        abi: erc20ABI,
        address: getAddress(args.token.address),
        functionName: "allowance",
        args: [args.address, args.spender],
      }),
    parse: (data) => CurrencyAmount.fromRawAmount(args.token, data.toString()),
  } satisfies ReverseMirage<bigint>;
};

export const erc20TotalSupply = (
  publicClient: PublicClient,
  args: { token: Token },
) => {
  return {
    read: () =>
      publicClient.readContract({
        abi: erc20ABI,
        address: getAddress(args.token.address),
        functionName: "totalSupply",
      }),
    parse: (data) => CurrencyAmount.fromRawAmount(args.token, data.toString()),
  } satisfies ReverseMirage<bigint>;
};

export const erc20Name = (
  publicClient: PublicClient,
  args: { token: Pick<Token, "address"> },
) => {
  return {
    read: () =>
      publicClient.readContract({
        abi: erc20ABI,
        address: getAddress(args.token.address),
        functionName: "name",
      }),
    parse: (data) => data,
  } satisfies ReverseMirage<string>;
};

export const erc20Symbol = (
  publicClient: PublicClient,
  args: { token: Pick<Token, "address"> },
) => {
  return {
    read: () =>
      publicClient.readContract({
        abi: erc20ABI,
        address: getAddress(args.token.address),
        functionName: "symbol",
      }),
    parse: (data: string) => data,
  } satisfies ReverseMirage<string>;
};

export const erc20Decimals = (
  publicClient: PublicClient,
  args: { token: Pick<Token, "address"> },
) => {
  return {
    read: () =>
      publicClient.readContract({
        abi: erc20ABI,
        address: getAddress(args.token.address),
        functionName: "decimals",
      }),
    parse: (data) => data,
  } satisfies ReverseMirage<number>;
};

export const erc20GetToken = (
  publicClient: PublicClient,
  args: { token: Pick<Token, "address" | "chainId"> },
) => {
  return {
    read: () =>
      Promise.all([
        erc20Name(publicClient, args).read(),
        erc20Symbol(publicClient, args).read(),
        erc20Decimals(publicClient, args).read(),
      ]),
    parse: (data) =>
      new Token(
        args.token.chainId,
        args.token.address,
        data[2],
        data[1],
        data[0],
      ),
  } satisfies ReverseMirage<[string, string, number]>;
};
