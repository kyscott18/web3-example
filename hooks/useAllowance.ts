import type { HookArg } from "./internal/types";
import { getQueryKey } from "./internal/useQueryKey";
import { useChainID } from "./useChain";
import { Token } from "@/lib/currency";
import { allowance, balance } from "@/lib/reverseMirage/token";
import { createQueryKeyStore } from "@lukemorales/query-key-factory";
import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { objectKeys } from "ts-extras";
import { Address, usePublicClient } from "wagmi";

export const useQueryFactory = () => {
  const publicClient = usePublicClient();
  const chainID = useChainID();

  const queries = { allowance } as const;

  const rm = {
    allowance: (args: Partial<Parameters<typeof allowance>[1]>) => ({
      queryKey: getQueryKey(allowance, args, chainID),
      queryFn: () =>
        allowance(publicClient, args as Parameters<typeof allowance>[1]),
      enabled: objectKeys(args).some((key) => args[key] === undefined),
      staleTime: Infinity,
      context: undefined,
    }),
  } as const satisfies {
    [query in keyof typeof queries]: (
      args: Partial<Parameters<typeof queries[query]>[1]>,
    ) => UseQueryOptions<
      ReturnType<typeof queries[query]>,
      Error,
      ReturnType<typeof queries[query]>,
      QueryKey
    >;
  };

  // TODO: add query context for refetch interval
  const reverseMirage = objectKeys(queries).reduce(
    (acc, cur) => {
      const read = queries[cur];

      return {
        ...acc,
        [cur]: (args) =>
          ({
            queryKey: getQueryKey(read, args, chainID),
            queryFn: () =>
              read(publicClient, args as Parameters<typeof read>[1]),
            enabled: objectKeys(args).some((key) => args[key] === undefined),
            staleTime: Infinity,
          }) as const,
      } as const;
    },
    // {} as {
    //   [query in keyof typeof queries]: NonNullable<
    //     Parameters<typeof createQueryKeyStore>[0][string]
    //   >[string];
    // },
    {} as {
      [query in keyof typeof queries]: (
        args: Partial<Parameters<typeof queries[query]>[1]>,
      ) => Omit<
        UseQueryOptions<ReturnType<typeof queries[query]>>,
        "queryKey"
      > & { queryKey: QueryKey };
    },
  );

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
