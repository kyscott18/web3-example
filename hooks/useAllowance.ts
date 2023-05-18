import type { HookArg } from "./internal/types";
import { getQueryKey } from "./internal/useQueryKey";
import { useChainID } from "./useChain";
import { Token } from "@/lib/currency";
import { allowance, balance } from "@/lib/reverseMirage/token";
import { createQueryKeyStore } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { objectKeys } from "ts-extras";
import { Address, usePublicClient } from "wagmi";

export const useQueryFactory = () => {
  const publicClient = usePublicClient();
  const chainID = useChainID();

  const queries = { allowance, balance } as const;

  const queryGen =
    <TArgs extends object, TRet extends unknown>(
      read: (_publicClient: typeof publicClient, args: TArgs) => TRet,
    ) =>
    (args: Partial<TArgs>) =>
      ({
        queryKey: getQueryKey(read, args, chainID),
        queryFn: () => read(publicClient, args as TArgs),
        enabled: Object.keys(args).some(
          (key) => args[key as keyof Partial<TArgs>] === undefined,
        ),
        staleTime: Infinity,
      }) as const;

  const reverseMirage = objectKeys(queries).reduce((acc, cur) => {
    const read = queries[cur];
    return {
      ...acc,
      [cur]: queryGen(read),
    };
  }, {} as {
    [query in keyof typeof queries]: ReturnType<
      typeof queryGen<
        Parameters<typeof queries[query]>[1],
        ReturnType<typeof queries[query]>
      >
    >;
  });

  // TODO: add query context for refetch interval

  return useMemo(
    () =>
      createQueryKeyStore({
        reverseMirage,
      }),
    [chainID],
  );
};

export const useAllowance = <T extends Token>(
  token: HookArg<T>,
  address: HookArg<Address>,
  spender: HookArg<Address>,
) => {
  const queries = useQueryFactory();

  return useQuery(queries.reverseMirage.allowance({ token, address, spender }));
};
