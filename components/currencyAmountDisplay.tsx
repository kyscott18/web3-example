import { Currency } from "@/lib/currency";
import { CurrencyAmount } from "@uniswap/sdk-core";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

export default function CurrencyAmountDisplay({
  amount,
}: { amount: CurrencyAmount<Currency> }) {
  const num = Number(amount.toSignificant(6));

  // [newest, oldest]
  const [from, setFrom] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    from[0] !== num && setFrom([num, from[0]]);
  }, [num]);

  return (
    <CountUp start={from[1]} end={from[0]} duration={2.5} decimals={5}>
      {({ countUpRef }) => (
        <p className="p2">
          <span className="p2" ref={countUpRef} />
        </p>
      )}
    </CountUp>
  );
}
