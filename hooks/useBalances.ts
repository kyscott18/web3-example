import { HookArg } from "./internal/types";
import { useQueryGenerator } from "./internal/useQueryFactory";
import { userRefectchInterval } from "./internal/utils";
import { Currency } from "@/lib/currency";
import { erc20Balance, erc20BalanceOf } from "@/lib/reverseMirage/token";
import { useQueries } from "@tanstack/react-query";
import { Address } from "viem";

export const useBalances = (
  tokens: HookArg<readonly Currency[]>,
  address: HookArg<Address>,
) => {
  const balanceQuery = useQueryGenerator(erc20Balance);
  const balanceOfQuery = useQueryGenerator(erc20BalanceOf);

  return useQueries({
    queries: tokens
      ? tokens.map((t) => {
          const query = t.isNative
            ? balanceQuery({ nativeCurrency: t, address })
            : balanceOfQuery({ token: t, address });

          return {
            ...query,
            refetchInterval: userRefectchInterval,
          };
        })
      : [],
  });
};
