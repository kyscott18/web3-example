import AsyncButton from "./asyncButton";
import { Beet } from "./beet";
import CurrencyAmountDisplay from "./currencyAmountDisplay";
import CurrencyInfo from "./currencyInfo";
import { useTransfer } from "@/src/hooks/useTransfer";
import { Currency } from "@/src/lib/currency";
import { UseQueryResult } from "@tanstack/react-query";
import { CurrencyAmount } from "@uniswap/sdk-core";
import invariant from "tiny-invariant";
import { parseEther } from "viem";

export default function CurrencyAmountRow({
  currency,
  currencyAmountQuery,
}: {
  currency: Currency;
  currencyAmountQuery: UseQueryResult<CurrencyAmount<Currency>>;
}) {
  const transferMutation = useTransfer(
    CurrencyAmount.fromRawAmount(currency, parseEther("0.001").toString()),
    "0x59A6AbC89C158ef88d5872CaB4aC3B08474883D9",
  );

  return (
    <div className="w-full items-center justify-between flex">
      <CurrencyInfo currency={currency} size={18} />
      <div className="flex gap-2">
        {currencyAmountQuery.data ? (
          <div className="bg-gray-200 rounded-lg h-8 w-30 w-full flex flex-col items-center justify-center overflow-clip px-1">
            <CurrencyAmountDisplay amount={currencyAmountQuery.data} />
          </div>
        ) : (
          <div className="bg-gray-200 rounded-lg h-8 w-30 animate-pulse" />
        )}
        <AsyncButton
          className="h-8"
          disabled={
            !currencyAmountQuery.data ||
            !currencyAmountQuery.data.greaterThan(
              parseEther("0.001").toString(),
            ) ||
            transferMutation.status !== "success"
          }
          onClick={async () => {
            invariant(transferMutation.status === "success");
            await Beet(transferMutation.data);
          }}
        >
          Transfer
        </AsyncButton>
      </div>
    </div>
  );
}
