import type { HookArg } from "./internal/types";
import { useQueryGenerator } from "./internal/useQueryFactory";
import { userRefectchInterval } from "./internal/utils";
import { useQuery } from "@tanstack/react-query";
import { Token, erc20Allowance } from "reverse-mirage";
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
