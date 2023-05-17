import { useChain } from "../useChain";
import { getQueryKey } from "./useQueryKey";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export const useInvalidateCall = () => {
  const queryClient = useQueryClient();
  const chainId = useChain();

  return useCallback(
    <TArgs extends unknown>(
      // rome-ignore lint/suspicious/noExplicitAny: i dont care
      get: (publicClient: any, args: TArgs) => any,
      args: TArgs,
    ) => {
      const queryKey = getQueryKey([{ get, args }], chainId);
      if (args)
        return queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey === queryKey ? true : false;
          },
        });
    },
    [queryClient, chainId],
  );
};
