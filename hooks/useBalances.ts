import { HookArg } from "./internal/types";
import { getQueryKey } from "./internal/useQueryKey";
import { userRefectchInterval } from "./internal/utils";
import { useChainID } from "./useChain";
import { Currency } from "@/lib/currency";
import { balance, balanceOf } from "@/lib/reverseMirage/token";
import { useQueries } from "@tanstack/react-query";
import { Address } from "viem";
import { usePublicClient } from "wagmi";

export const useBalances = (
  tokens: HookArg<readonly Currency[]>,
  address: HookArg<Address>,
) => {
  const publicClient = usePublicClient();
  const chainID = useChainID();

  return useQueries({
    queries: tokens
      ? tokens.map((t) => {
          const nativeQueryKey = getQueryKey(
            balance,
            address && t.isNative ? { nativeCurrency: t, address } : undefined,
            chainID,
          );
          const queryKey = getQueryKey(
            balanceOf,
            address && t.isToken ? { token: t, address } : undefined,
            chainID,
          );

          return {
            queryKey: t.isNative ? nativeQueryKey : queryKey,
            queryFn: () =>
              t.isNative
                ? balance(publicClient, {
                    nativeCurrency: t,
                    address: address!,
                  })
                : balanceOf(publicClient, { token: t, address: address! }),
            enabled: !!address,
            refetchInterval: userRefectchInterval,
            staleTime: Infinity,
          };
        })
      : [],
  });
};
