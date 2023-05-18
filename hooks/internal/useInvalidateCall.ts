import { useChainID } from "../useChain";
import { getQueryKey } from "./useQueryKey";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export const useInvalidateCall = () => {
  const queryClient = useQueryClient();
  const chainId = useChainID();

  return useCallback(
    <TArgs extends object>(
      // rome-ignore lint/suspicious/noExplicitAny: i dont care
      get: (publicClient: any, args: TArgs) => any,
      args: TArgs,
    ) => {
      const queryKey = getQueryKey(get, args, chainId);
      if (args)
        return queryClient.invalidateQueries({
          queryKey: queryKey,
        });
    },
    [queryClient, chainId],
  );
};
