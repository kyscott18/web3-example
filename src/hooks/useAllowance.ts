import type { HookArg } from "./internal/types";
import { useQueryGenerator } from "./internal/useQueryFactory";
import { userRefectchInterval } from "./internal/utils";
import { Token } from "@/src/lib/currency";
import { erc20Allowance } from "@/src/lib/reverseMirage/token";
import { useQuery } from "@tanstack/react-query";
import { Address } from "wagmi";

export const useAllowance = <T extends Token>(
  token: HookArg<T>,
  address: HookArg<Address>,
  spender: HookArg<Address>,
) => {
  const allowanceQuery = useQueryGenerator(erc20Allowance);

  return useQuery({
    ...allowanceQuery({ token, address, spender }),
    refetchInterval: userRefectchInterval,
  });
};