import { NativeCurrency, Token } from "../currency";
import { CurrencyAmount } from "@uniswap/sdk-core";
import { getAddress } from "viem";
import { Address, PublicClient, erc20ABI } from "wagmi";

export type ReverseMirage<TArgs extends object, TRet extends unknown> = (
  publicClient: PublicClient,
  args: TArgs,
) => Promise<TRet> | TRet;

export const erc20Balance = async (
  publicClient: PublicClient,
  args: { nativeCurrency: NativeCurrency; address: Address },
) => {
  const data = await publicClient.getBalance({ address: args.address });

  return CurrencyAmount.fromRawAmount(args.nativeCurrency, data.toString());
};

export const erc20BalanceOf = async (
  publicClient: PublicClient,
  args: { token: Token; address: Address },
) => {
  const data = await publicClient.readContract({
    abi: erc20ABI,
    address: args.token.address as Address,
    functionName: "balanceOf",
    args: [args.address],
  });

  return CurrencyAmount.fromRawAmount(args.token, data.toString());
};

export const erc20Allowance = async (
  publicClient: PublicClient,
  args: { token: Token; address: Address; spender: Address },
) => {
  const data = await publicClient.readContract({
    abi: erc20ABI,
    address: getAddress(args.token.address),
    functionName: "allowance",
    args: [args.address, args.spender],
  });

  return CurrencyAmount.fromRawAmount(args.token, data.toString());
};

export const erc20TotalSupply = async (
  publicClient: PublicClient,
  args: { token: Token },
) => {
  const data = await publicClient.readContract({
    abi: erc20ABI,
    address: getAddress(args.token.address),
    functionName: "totalSupply",
  });

  return CurrencyAmount.fromRawAmount(args.token, data.toString());
};

export const erc20Name = async (
  publicClient: PublicClient,
  args: { token: Pick<Token, "address"> },
) => {
  const data = await publicClient.readContract({
    abi: erc20ABI,
    address: getAddress(args.token.address),
    functionName: "name",
  });

  return data;
};

export const erc20Symbol = async (
  publicClient: PublicClient,
  args: { token: Pick<Token, "address"> },
) => {
  const data = await publicClient.readContract({
    abi: erc20ABI,
    address: getAddress(args.token.address),
    functionName: "symbol",
  });

  return data;
};

export const erc20Decimals = async (
  publicClient: PublicClient,
  args: { token: Pick<Token, "address"> },
) => {
  const data = await publicClient.readContract({
    abi: erc20ABI,
    address: getAddress(args.token.address),
    functionName: "decimals",
  });

  return data;
};

export const erc20GetToken = async (
  publicClient: PublicClient,
  args: { token: Pick<Token, "address" | "chainId"> },
) => {
  const data = await Promise.all([
    erc20Name(publicClient, args),
    erc20Symbol(publicClient, args),
    erc20Decimals(publicClient, args),
  ]);

  return new Token(
    args.token.chainId,
    args.token.address,
    data[2],
    data[1],
    data[0],
  );
};
