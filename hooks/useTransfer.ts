import { HookArg } from "./internal/types";
import { useFastClient } from "./internal/useFastClient";
import { useQueryFactory } from "./internal/useQueryFactory";
import { BeetStage, TxToast, toaster } from "@/components/beet";
import { Currency } from "@/lib/currency";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CurrencyAmount } from "@uniswap/sdk-core";
import { useMemo } from "react";
import { getAddress } from "viem";
import { Address } from "wagmi";
import { prepareSendTransaction, sendTransaction } from "wagmi/actions";

export const useTransfer = (
  amount: HookArg<CurrencyAmount<Currency>>,
  to: HookArg<Address>,
) => {
  const queryClient = useQueryClient();
  const queries = useQueryFactory();
  const client = useFastClient();

  const title = "Transfer";

  const mutate = useMutation({
    mutationFn: async ({
      amount,
      to,
      toast,
    }: {
      amount: CurrencyAmount<Currency>;
      to: Address;
    } & {
      toast: TxToast;
    }) => {
      const request = await prepareSendTransaction({
        to,
        value: BigInt(amount.quotient.toString()),
      });

      const transaction = await sendTransaction(request);

      toaster.txPending({ ...toast, hash: transaction.hash });

      const start = Date.now();

      const tx = await client.waitForTransactionReceipt(transaction);

      console.log(Date.now() - start);
      return tx;
    },
    onMutate: ({ toast }) => toaster.txSending(toast),
    onError: (_, { toast }) => toaster.txError(toast),
    onSuccess: async (data, input) => {
      toaster.txSuccess({ ...input.toast, receipt: data });

      await Promise.all([
        input.amount.currency.isNative
          ? queryClient.invalidateQueries({
              queryKey: queries.reverseMirage.erc20Balance({
                nativeCurrency: input.amount.currency,
                address: getAddress(data.from),
              }).queryKey,
            })
          : queryClient.invalidateQueries({
              queryKey: queries.reverseMirage.erc20BalanceOf({
                token: input.amount.currency,
                address: getAddress(data.from),
              }).queryKey,
            }),
      ]);
    },
  });

  return useMemo(() => {
    if (!amount || !to) return { status: "error" } as const;

    return {
      status: "success",
      data: [
        {
          title,
          parallelTxs: [
            {
              title,
              description: title,
              callback: (toast: TxToast) =>
                mutate.mutateAsync({
                  amount,
                  to,
                  toast,
                }),
            },
          ],
        },
      ],
    } as const satisfies { data: readonly BeetStage[]; status: "success" };
  }, [to, amount, mutate]);
};
