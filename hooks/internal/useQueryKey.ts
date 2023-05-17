import { useChain } from "../useChain";
import { SupportedChainIDs } from "@/lib/types";

export const useQueryKey = <TArgs extends unknown[]>(
  reads:
    | [
        ...{
          [I in keyof TArgs]: {
            // rome-ignore lint/suspicious/noExplicitAny: i dont care
            get: (publicClient: any, args: TArgs[I]) => any;
            args: TArgs[I];
          };
        },
      ]
    | undefined,
) => {
  const chainId = useChain();

  return getQueryKey(reads ? reads : [], chainId);
};

export const getQueryKey = <TArgs extends unknown[]>(
  reads: [
    ...{
      [I in keyof TArgs]: {
        // rome-ignore lint/suspicious/noExplicitAny: i dont care
        get: (publicClient: any, args: TArgs[I]) => any;
        args: TArgs[I];
      };
    },
  ],
  chainID: SupportedChainIDs,
) => {
  return [
    {
      chainID,
      reads: reads.map((r) => ({
        name: r.get.name,
        args: r.args,
      })),
    },
  ] as const;
};
