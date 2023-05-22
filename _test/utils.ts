import { forkUrl, localHttpUrl, localWsUrl } from "./constants";
import { createPublicClient, createTestClient, http } from "viem";
import { Chain, localhost, mainnet } from "viem/chains";

export const anvilChain = {
  ...localhost,
  id: 1,
  contracts: mainnet.contracts,
  rpcUrls: {
    default: {
      http: [localHttpUrl],
      webSocket: [localWsUrl],
    },
    public: {
      http: [localHttpUrl],
      webSocket: [localWsUrl],
    },
  },
} as const satisfies Chain;

export const httpClient = createPublicClient({
  batch: {
    multicall: process.env.VITE_BATCH_MULTICALL === "true",
  },
  chain: anvilChain,
  pollingInterval: 1_000,
  transport: http(localHttpUrl),
});

export const publicClient = httpClient;

export const testClient = createTestClient({
  chain: anvilChain,
  mode: "anvil",
  transport: http(localHttpUrl),
});

export async function setBlockNumber(blockNumber: bigint) {
  await testClient.reset({
    blockNumber,
    jsonRpcUrl: forkUrl,
  });
}
