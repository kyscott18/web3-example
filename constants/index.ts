import { NativeCurrency } from "@/lib/currency";
import { SupportedChainIDs } from "@/lib/types";

export const SepoliaEther = new NativeCurrency(
  11155111,
  18,
  "SEP",
  "Sepolia Ether",
  "/eth.png",
);

export const ArbitrumGoerliEther = new NativeCurrency(
  421613,
  18,
  "AGOR",
  "Arbitrum Goerli Ether",
  "/eth.png",
);

export const GoerliEther = new NativeCurrency(
  5,
  18,
  "ETH",
  "Goerli Ether",
  "/eth.png",
);

export const config: {
  [chain in SupportedChainIDs]: {
    nativeCurrency: NativeCurrency;
  };
} = {
  5: { nativeCurrency: GoerliEther },
  11155111: { nativeCurrency: SepoliaEther },
};
