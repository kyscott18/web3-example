import type { Currency } from "@/src/lib/currency";
import { clsx } from "clsx";
import Image from "next/image";

export default function CurrencyIcon({
  currency,
  size,
  className,
}: {
  currency: Currency;
  size: number;
  className?: string;
}) {
  return currency.logoURI ? (
    <Image
      className={clsx("flex overflow-hidden rounded-[50%]", className)}
      height={size}
      width={size}
      src={currency.logoURI}
      alt="token icon"
    />
  ) : (
    <div className="border-1 flex overflow-hidden rounded-[100%] border-dashed border-gray-200" />
  );
}
