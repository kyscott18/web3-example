import CurrencyIcon from "./currencyIcon";
import type { Currency } from "@/lib/currency";
import { clsx } from "clsx";

export default function CurrencyInfo({
  currency,
  size,
}: {
  currency: Currency;
  size?: number;
}) {
  return (
    <div className={clsx("flex items-center", "space-x-2")}>
      <CurrencyIcon currency={currency} size={size ?? 32} />
      <div className="">
        <p className="p1">{currency.symbol}</p>
      </div>
    </div>
  );
}
