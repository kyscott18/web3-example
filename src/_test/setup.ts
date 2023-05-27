import { accounts, forkBlockNumber, localHttpUrl } from "./constants";
import { anvilChain, setBlockNumber, testClient } from "./utils";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { afterAll, beforeAll } from "vitest";
import { erc20ABI } from "wagmi";

beforeAll(async () => {
  const client = createWalletClient({
    account: privateKeyToAccount(accounts[0].privateKey),
    chain: anvilChain,
    pollingInterval: 1_000,
    transport: http(localHttpUrl),
  });
  await client.deployContract({
    abi: erc20ABI,
  });
});

afterAll(async () => {
  // Reset the anvil instance to the same state it was in before the tests started.
  await Promise.all([
    setBlockNumber(forkBlockNumber),
    testClient.setAutomine(false),
    testClient.setIntervalMining({ interval: 1 }),
  ]);
});
