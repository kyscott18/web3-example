import type { HookArg } from "./internal/types";
import { useQueryKey } from "./internal/useQueryKey";
import { userRefectchInterval } from "./internal/utils";
import { Currency } from "@/lib/currency";
import { balance, balanceOf } from "@/lib/reverseMirage/token";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { CurrencyAmount } from "@uniswap/sdk-core";
import invariant from "tiny-invariant";
import { Address, usePublicClient } from "wagmi";

export const useBalance = <TCurrency extends Currency>(
  token: HookArg<TCurrency>,
  address: HookArg<Address>,
): UseQueryResult<CurrencyAmount<TCurrency>> => {
  const publicClient = usePublicClient();

  const nativeQueryKey = useQueryKey(balance, {
    nativeCurrency: token?.isNative ? token : undefined,
    address,
  });

  const queryKey = useQueryKey(balanceOf, {
    token: token?.isToken ? token : undefined,
    address,
  });

  return useQuery({
    queryKey: token?.isNative ? nativeQueryKey : queryKey,
    queryFn: async () => {
      invariant(address && token);

      if (token.isNative) {
        return balance(publicClient, { nativeCurrency: token, address });
      } else {
        return balanceOf(publicClient, { token, address });
      }
    },
    staleTime: Infinity,
    refetchInterval: userRefectchInterval,
    enabled: !!address && !!token,
  });
};
