import { SupportedChainIDs } from "@/lib/types";
import { useChainId } from "wagmi";

export const useChain = (): SupportedChainIDs => {
  const chainNumber = useChainId();
  return chainNumber as SupportedChainIDs;
};
