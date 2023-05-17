import { Token } from "../currency";
import { CurrencyAmount, NativeCurrency } from "@uniswap/sdk-core";
import { getAddress } from "viem";
import { Address, PublicClient, erc20ABI } from "wagmi";

export const balance = async (
  publicClient: PublicClient,
  args: { nativeCurrency: NativeCurrency; address: Address },
) => {
  const data = await publicClient.getBalance({ address: args.address });

  return CurrencyAmount.fromRawAmount(args.nativeCurrency, data.toString());
};

export const balanceOf = async (
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

export const allowance = async (
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

export const totalSupply = async (
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

export const name = async (
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

export const symbol = async (
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

export const decimals = async (
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

export const getToken = async (
  publicClient: PublicClient,
  args: { token: Pick<Token, "address" | "chainId"> },
) => {
  const data = await Promise.all([
    name(publicClient, args),
    symbol(publicClient, args),
    decimals(publicClient, args),
  ]);

  return new Token(
    args.token.chainId,
    args.token.address,
    data[2],
    data[1],
    data[0],
  );
};
