import type { HookArg } from "./internal/types";
import { getQueryKey } from "./internal/useQueryKey";
import { userRefectchInterval } from "./internal/utils";
import { useChainID } from "./useChain";
import { Token } from "@/lib/currency";
import { allowance } from "@/lib/reverseMirage/token";
import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { objectKeys } from "ts-extras";
import { Address, usePublicClient } from "wagmi";

export const useAllowanceQuery = () => {
  const publicClient = usePublicClient();
  const chainID = useChainID();

  return createQueryKeys("allowance", {
    allowance: (args: Partial<Parameters<typeof allowance>[1]>) => ({
      queryKey: getQueryKey(allowance, args, chainID),
      queryFn: allowance(publicClient, args as Parameters<typeof allowance>[1]),
      // if any of the args are undefined then this is invalid
      enabled: objectKeys(args).some((key) => args[key] === undefined),
      staleTime: Infinity,
      refetchInterval: userRefectchInterval,
    }),
  });
};

export const useQueries = () => {
  const allowanceQuery = useAllowanceQuery();
  return mergeQueryKeys(allowanceQuery);
};

export const useAllowance = <T extends Token>(
  token: HookArg<T>,
  address: HookArg<Address>,
  spender: HookArg<Address>,
) => {
  const queries = useQueries();

  return useQuery(queries.allowance.allowance({ token, address, spender }));
};
