import type { HookArg } from "./internal/types";
import { useQueryGenerator } from "./internal/useQueryFactory";
import { userRefectchInterval } from "./internal/utils";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import {
  Currency,
  CurrencyAmount,
  erc20BalanceOf,
  isNativeCurrency,
  isToken,
  nativeBalance,
} from "reverse-mirage";
import { Address } from "wagmi";

export const useBalance = <TCurrency extends Currency>(
  token: HookArg<TCurrency>,
  address: HookArg<Address>,
) => {
  const balanceQuery = useQueryGenerator(nativeBalance);
  const balanceOfQuery = useQueryGenerator(erc20BalanceOf);

  const query = useQuery({
    ...balanceOfQuery({
      token: token && isToken(token) ? token : undefined,
      address,
    }),
    refetchInterval: userRefectchInterval,
  });

  const nativeQuery = useQuery({
    ...balanceQuery({
      nativeCurrency: token && isNativeCurrency(token) ? token : undefined,
      address,
    }),
    refetchInterval: userRefectchInterval,
  });

  return (
    token && isNativeCurrency(token) ? nativeQuery : query
  ) as UseQueryResult<CurrencyAmount<TCurrency>>;
};
