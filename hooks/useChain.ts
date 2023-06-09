import { SupportedChainIDs } from "@/lib/types";
import { useChainId } from "wagmi";

export const useChainID = (): SupportedChainIDs => {
  const chainNumber = useChainId();
  return chainNumber as SupportedChainIDs;
};
