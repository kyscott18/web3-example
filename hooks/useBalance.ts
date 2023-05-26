import type { HookArg } from "./internal/types";
import { useQueryGenerator } from "./internal/useQueryFactory";
import { userRefectchInterval } from "./internal/utils";
import { Currency } from "@/lib/currency";
import { erc20Balance, erc20BalanceOf } from "@/lib/reverseMirage/token";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { CurrencyAmount } from "@uniswap/sdk-core";
import { Address } from "wagmi";

export const useBalance = <TCurrency extends Currency>(
  token: HookArg<TCurrency>,
  address: HookArg<Address>,
) => {
  const balanceQuery = useQueryGenerator(erc20Balance);
  const balanceOfQuery = useQueryGenerator(erc20BalanceOf);

  const query = useQuery({
    ...balanceOfQuery({ token: token?.isToken ? token : undefined, address }),
    refetchInterval: userRefectchInterval,
  });

  const nativeQuery = useQuery({
    ...balanceQuery({
      nativeCurrency: token?.isNative ? token : undefined,
      address,
    }),
    refetchInterval: userRefectchInterval,
  });

  return (token?.isNative ? nativeQuery : query) as UseQueryResult<
    CurrencyAmount<TCurrency>
  >;
};
