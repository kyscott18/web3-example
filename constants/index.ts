import { NativeCurrency, SupportedChainIDs, Token } from "@/lib/types";

const WrappedSepoliaEther = {
  chainID: 11155111,
  address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  decimals: 18,
  name: "Wrapped Sepolia Ether",
  symbol: "WSEP",
  logoURI: "/eth.png",
} as const satisfies Token;

const SepoliaEther = {
  chainID: 11155111,
  decimals: 18,
  name: "Sepolia Ether",
  symbol: "SEP",
  logoURI: "/eth.png",
} as const satisfies NativeCurrency;

const WrappedGoerliEther = {
  chainID: 5,
  address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  decimals: 18,
  name: "Wrapped Goerli Ether",
  symbol: "WETH",
  logoURI: "/eth.png",
} as const satisfies Token;

const GoerliEther = {
  chainID: 5,
  decimals: 18,
  name: "Goerli Ether",
  symbol: "ETH",
  logoURI: "/eth.png",
} as const satisfies NativeCurrency;

export const config: {
  [chain in SupportedChainIDs]: {
    nativeCurrency: NativeCurrency;
    wrappedNative: Token;
  };
} = {
  5: { nativeCurrency: GoerliEther, wrappedNative: WrappedGoerliEther },
  11155111: {
    nativeCurrency: SepoliaEther,
    wrappedNative: WrappedSepoliaEther,
  },
};
