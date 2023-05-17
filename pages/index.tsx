import ConnectButton from "@/components/connectButton";
import { Inter } from "next/font/google";
import { useAccount } from "wagmi";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center w-full ${inter.className} px-3`}
    >
      <div className="w-full max-w-md flex flex-col border-2 border-gray-200 rounded-xl bg-white p-4 gap-4">
        <div className="w-full flex gap-1">
          <ConnectButton />
        </div>
        {isConnected && <div className=" w-full border-b-2 border-gray-200" />}
      </div>
    </main>
  );
}
