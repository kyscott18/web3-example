import { useChainID } from "../useChain";
import { SupportedChainIDs } from "@/lib/types";

export const useQueryKey = <TArgs extends object>(
  // rome-ignore lint/suspicious/noExplicitAny: dont need
  get: (publicClient: any, args: TArgs) => any,
  args: TArgs | undefined,
) => {
  const chainId = useChainID();

  return args ? getQueryKey(get, args, chainId) : [];
};

export const getQueryKey = <TArgs extends object>(
  // rome-ignore lint/suspicious/noExplicitAny: dont need
  get: (publicClient: any, args: TArgs) => any,
  args: TArgs,
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
