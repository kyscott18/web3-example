import { useChainID } from "../useChain";
import { SupportedChainIDs } from "@/lib/types";
import { useMemo } from "react";

export const useQueryKey = <TArgs extends object>(
  // rome-ignore lint/suspicious/noExplicitAny: dont need
  get: (publicClient: any, args: TArgs) => any,
  args: TArgs | undefined,
) => {
  const chainID = useChainID();

  return useMemo(() => getQueryKey(get, args, chainID), [get, args, chainID]);
};

export const getQueryKey = <TArgs extends object>(
  // rome-ignore lint/suspicious/noExplicitAny: dont need
  get: (publicClient: any, args: TArgs) => any,
  args: TArgs | undefined,
  chainID: SupportedChainIDs,
) => {
  return [
    {
      chainID,
      read: {
        name: get.name,
        args,
      },
    },
  ] as const;
};
