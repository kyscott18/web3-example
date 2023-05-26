import { useChainID } from "../useChain";
import { getQueryKey } from "./useQueryKey";
import { PublicClient, usePublicClient } from "wagmi";

export const useQueryGenerator = <TArgs extends object, TRet extends unknown>(
  read: (publicClient: PublicClient, args: TArgs) => TRet,
) => {
  const publicClient = usePublicClient();
  const chainID = useChainID();

  return (args: Partial<TArgs>) =>
    ({
      queryKey: getQueryKey(read, args, chainID),
      queryFn: () => read(publicClient, args as TArgs),
      enabled: !Object.keys(args).some(
        (key) => args[key as keyof Partial<TArgs>] === undefined,
      ),
      staleTime: Infinity,
    }) as const;
};
