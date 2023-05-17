import ConnectButton from "@/components/connectButton";
import CurrencyInfo from "@/components/currencyInfo";
import { SepoliaEther } from "@/constants";
import { useBalance } from "@/hooks/useBalance";
import { Inter } from "next/font/google";
import { useAccount } from "wagmi";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { isConnected, address } = useAccount();

  const balanceQuery = useBalance(address);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center w-full ${inter.className} px-3`}
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
              {balanceQuery.data ? (
                <div className="bg-gray-200 rounded-lg h-8 w-12 flex flex-col items-center justify-center overflow-ellipsis">
                  <p className="p2">{balanceQuery.data?.toSignificant()}</p>
                </div>
              ) : (
                <div className="bg-gray-200 rounded-lg h-8 w-12 animate-pulse" />
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
