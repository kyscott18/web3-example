import { ALICE, localHttpUrl, localWsUrl } from "./constants";
import { MockConnector } from "@wagmi/core/connectors/mock";
import {
  createPublicClient,
  createTestClient,
  createWalletClient,
  http,
} from "viem";
import { Chain, localhost, mainnet } from "viem/chains";
import {
  Connector,
  CreateConfigParameters,
  PublicClient,
  WebSocketPublicClient,
  createConfig,
} from "wagmi";

export const anvil = {
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

export const testClient = createTestClient({
  chain: anvil,
  mode: "anvil",
  transport: http(),
});

export const publicClient = createPublicClient({
  chain: anvil,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: anvil,
  transport: http(),
  account: ALICE,
});

type Config = Partial<CreateConfigParameters>;

export function setupConfig(config: Config = {}) {
  return createConfig<PublicClient, WebSocketPublicClient>({
    connectors: [
      new MockConnector({
        options: {
          walletClient: walletClient,
        },
      }),
    ] as unknown as Connector[],
    publicClient: () => publicClient,
    ...config,
  });
}
