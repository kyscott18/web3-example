import type { HookArg } from "./internal/types";
import { useQueryFactory } from "./internal/useQueryFactory";
import { userRefectchInterval } from "./internal/utils";
import { Currency } from "@/lib/currency";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { CurrencyAmount } from "@uniswap/sdk-core";
import { Address } from "wagmi";

export const useBalance = <TCurrency extends Currency>(
  token: HookArg<TCurrency>,
  address: HookArg<Address>,
): UseQueryResult<CurrencyAmount<TCurrency>> => {
  const queries = useQueryFactory();

  const query = token?.isNative
    ? queries.reverseMirage.erc20Balance({ nativeCurrency: token, address })
    : queries.reverseMirage.erc20BalanceOf({ token, address });

  // TODO: figure out why this is happening
  return useQuery(
    // @ts-ignore
    { ...query, refetchInterval: userRefectchInterval },
  );
};
