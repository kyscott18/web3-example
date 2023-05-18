import ConnectButton from "@/components/connectButton";
import CurrencyAmountRow from "@/components/currencyAmountRow";
import { useEnvironment } from "@/contexts/environment";
import { useBalanceOf } from "@/hooks/useBalance";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected, address } = useAccount();
  const { nativeCurrency } = useEnvironment();
  const wrappedNative = nativeCurrency.wrapped;

  const balanceQueryNative = useBalanceOf(nativeCurrency, address);
  const balanceQueryWrapped = useBalanceOf(wrappedNative, address);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center w-full font-mono px-3`}
    >
      <div className="w-full max-w-md flex flex-col border-2 border-gray-200 rounded-xl bg-white p-4 gap-4">
        <div className="w-full flex gap-1">
          <ConnectButton />
        </div>
        {isConnected && (
          <>
            <div className=" w-full border-b-2 border-gray-200" />
            <CurrencyAmountRow
              currency={nativeCurrency}
              currencyAmountQuery={balanceQueryNative}
            />
            <CurrencyAmountRow
              currency={wrappedNative}
              currencyAmountQuery={balanceQueryWrapped}
            />
          </>
        )}
      </div>
    </main>
  );
}
