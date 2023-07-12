import { HookArg } from "./internal/types";
import { useFastClient } from "./internal/useFastClient";
import { useQueryGenerator } from "./internal/useQueryFactory";
import { BeetStage, TxToast, toaster } from "@/components/beet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  Currency,
  CurrencyAmount,
  NativeCurrency,
  Token,
  erc20BalanceOf,
  erc20Transfer,
  isNativeCurrency,
  nativeBalance,
  nativeTransfer,
} from "reverse-mirage";
import { getAddress } from "viem";
import { Address } from "wagmi";
import { prepareSendTransaction, sendTransaction } from "wagmi/actions";
import { prepareWriteContract, writeContract } from "wagmi/actions";

export const useTransfer = (
  amount: HookArg<CurrencyAmount<Currency>>,
  to: HookArg<Address>,
) => {
  const queryClient = useQueryClient();
  const balanceQuery = useQueryGenerator(nativeBalance);
  const balanceOfQuery = useQueryGenerator(erc20BalanceOf);
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
      let transaction: Awaited<ReturnType<typeof sendTransaction>>;

      if (isNativeCurrency(amount.currency)) {
        const request = await prepareSendTransaction({
          ...nativeTransfer({
            to,
            amount: amount as CurrencyAmount<NativeCurrency>,
          }),
        });

        transaction = await sendTransaction(request);
      } else {
        const request = await prepareWriteContract({
          ...erc20Transfer({
            to,
            amount: amount as CurrencyAmount<Token>,
          }),
        });

        transaction = await writeContract(request);
      }

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
        isNativeCurrency(input.amount.currency)
          ? queryClient.invalidateQueries({
              queryKey: balanceQuery({
                nativeCurrency: input.amount.currency,
                address: getAddress(data.from),
              }).queryKey,
            })
          : queryClient.invalidateQueries({
              queryKey: balanceOfQuery({
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
