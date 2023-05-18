import { HookArg } from "./internal/types";
import { useInvalidateCall } from "./internal/useInvalidateCall";
import { BeetStage, TxToast, toaster } from "@/components/beet";
import { NativeCurrency } from "@/lib/currency";
import { balance } from "@/lib/reverseMirage/token";
import { useMutation } from "@tanstack/react-query";
import { CurrencyAmount } from "@uniswap/sdk-core";
import { useMemo } from "react";
import { getAddress } from "viem";
import { Address } from "wagmi";
import {
  prepareSendTransaction,
  sendTransaction,
  waitForTransaction,
} from "wagmi/actions";

export const useTransfer = (
  amount: HookArg<CurrencyAmount<NativeCurrency>>,
  to: HookArg<Address>,
) => {
  const invalidate = useInvalidateCall();

  const title = "Transfer";

  const mutate = useMutation({
    mutationFn: async ({
      amount,
      to,
      toast,
    }: {
      amount: CurrencyAmount<NativeCurrency>;
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

      return await waitForTransaction(transaction);
    },
    onMutate: ({ toast }) => toaster.txSending(toast),
    onError: (_, { toast }) => toaster.txError(toast),
    onSuccess: async (data, input) => {
      toaster.txSuccess({ ...input.toast, receipt: data });
      invalidate(balance, {
        nativeCurrency: input.amount.currency,
        address: getAddress(data.from),
      });
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
