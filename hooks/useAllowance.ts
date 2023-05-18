import type { HookArg } from "./internal/types";
import { useQueryKey } from "./internal/useQueryKey";
import { userRefectchInterval } from "./internal/utils";
import { allowance } from "@/lib/reverseMirage/token";
import { useQuery } from "@tanstack/react-query";
import type { Token } from "@uniswap/sdk-core";
import invariant from "tiny-invariant";
import { Address, usePublicClient } from "wagmi";

export const useAllowance = <T extends Token>(
  token: HookArg<T>,
  address: HookArg<Address>,
  spender: HookArg<Address>,
) => {
  const publicClient = usePublicClient();

  const queryKey = useQueryKey(
    allowance,
    token && address && spender ? { token, address, spender } : undefined,
  );

  return useQuery({
    queryKey,
    queryFn: () => {
      invariant(token && address && spender);

      return allowance(publicClient, { token, address, spender });
    },
    staleTime: Infinity,
    enabled: !!token && !!address && !!spender,
    refetchInterval: userRefectchInterval,
  });
};
