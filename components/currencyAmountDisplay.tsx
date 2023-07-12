import { whatDecimalSeparator, whatSeparator } from "@/utils/format";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Currency, CurrencyAmount } from "reverse-mirage";

const decimalSeparator = whatDecimalSeparator();
const separator = whatSeparator();

export default function CurrencyAmountDisplay({
  amount,
}: { amount: CurrencyAmount<Currency> }) {
  const num = Number(amount.amount);

  // [newest, oldest]
  const [from, setFrom] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    from[0] !== num && setFrom([num, from[0]]);
  }, [num]);

  return (
    <CountUp
      start={from[1]}
      end={from[0]}
      duration={2.5}
      decimals={5}
      decimal={decimalSeparator}
      separator={separator}
      className="p2"
    />
  );
}
