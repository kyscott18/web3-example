import { HookArg } from "./internal/types";
import { useQueryFactory } from "./internal/useQueryFactory";
import { userRefectchInterval } from "./internal/utils";
import { Currency } from "@/lib/currency";
import { useQueries } from "@tanstack/react-query";
import { Address } from "viem";

export const useBalances = (
  tokens: HookArg<readonly Currency[]>,
  address: HookArg<Address>,
) => {
  const queries = useQueryFactory();

  return useQueries({
    queries: tokens
      ? tokens.map((t) => {
          const query = t?.isNative
            ? queries.reverseMirage.balance({ nativeCurrency: t, address })
            : queries.reverseMirage.balanceOf({ token: t, address });

          return {
            ...query,
            refetchInterval: userRefectchInterval,
          };
        })
      : [],
  });
};
