import AsyncButton from "@/components/asyncButton";
import { Beet } from "@/components/beet";
import ConnectButton from "@/components/connectButton";
import CurrencyInfo from "@/components/currencyInfo";
import { SepoliaEther } from "@/constants";
import { useBalance } from "@/hooks/useBalance";
import { useTransfer } from "@/hooks/useTransfer";
import { CurrencyAmount } from "@uniswap/sdk-core";
import invariant from "tiny-invariant";
import { parseEther } from "viem";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected, address } = useAccount();

  const balanceQuery = useBalance(address);

  const transferMutation = useTransfer(
    CurrencyAmount.fromRawAmount(SepoliaEther, parseEther("0.01").toString()),
    "0x59A6AbC89C158ef88d5872CaB4aC3B08474883D9",
  );

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
            <div className="w-full items-center justify-between flex">
              <CurrencyInfo currency={SepoliaEther} size={18} />
              <div className="flex gap-2">
                {balanceQuery.data ? (
                  <div className="bg-gray-200 rounded-lg h-8 w-12 flex flex-col items-center justify-center overflow-clip px-1">
                    <p className="p2">{balanceQuery.data?.toSignificant(2)}</p>
                  </div>
                ) : (
                  <div className="bg-gray-200 rounded-lg h-8 w-12 animate-pulse" />
                )}
                <AsyncButton
                  className="h-8"
                  disabled={
                    !balanceQuery.data ||
                    !balanceQuery.data.greaterThan(
                      parseEther("0.01").toString(),
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
          </>
        )}
      </div>
    </main>
  );
}
