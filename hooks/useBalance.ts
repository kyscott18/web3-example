import type { HookArg } from "./internal/types";
import { useQueryKey } from "./internal/useQueryKey";
import { userRefectchInterval } from "./internal/utils";
import { SepoliaEther } from "@/constants";
import { Token } from "@/lib/currency";
import { balance, balanceOf } from "@/lib/reverseMirage/token";
import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";
import { Address, usePublicClient } from "wagmi";

export const useBalance = (address: HookArg<Address>) => {
  const publicClient = usePublicClient();

  const queryKey = useQueryKey(
    address
      ? [{ get: balance, args: { nativeCurrency: SepoliaEther, address } }]
      : undefined,
  );

  return useQuery({
    queryKey,
    queryFn: async () => {
      invariant(address);

      const result = await balance(publicClient, {
        nativeCurrency: SepoliaEther,
        address,
      });

      return result;
    },
    staleTime: Infinity,
    refetchInterval: userRefectchInterval,
    enabled: !!address,
  });
};

export const useBalanceOf = (
  token: HookArg<Token>,
  address: HookArg<Address>,
) => {
  const publicClient = usePublicClient();

  const queryKey = useQueryKey(
    token && address
      ? [{ get: balanceOf, args: { token, address } }]
      : undefined,
  );

  return useQuery({
    queryKey,
    queryFn: async () => {
      invariant(token && address);

      const result = await balanceOf(publicClient, { token, address });

      return result;
    },
    staleTime: Infinity,
    refetchInterval: userRefectchInterval,
    enabled: !!token && !!address,
  });
};
