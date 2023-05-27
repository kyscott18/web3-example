import MockERC20 from "../../contracts/out/MockERC20.sol/MockERC20.json";
import { ALICE, forkBlockNumber, forkUrl } from "./constants";
import { mockErc20ABI } from "./generated";
import { publicClient, testClient, walletClient } from "./utils";
import { Address, Hex } from "viem";
import { afterAll, beforeAll } from "vitest";

export let mockERC20Address: Address;
beforeAll(async () => {
  // const client = createWalletClient({
  //   account: privateKeyToAccount(accounts[0].privateKey),
  //   chain: anvil,
  //   pollingInterval: 1_000,
  //   transport: http(localHttpUrl),
  // });
  // const a = await client.deployContract({
  //   abi: mockErc20ABI,
  //   bytecode: MockERC20.bytecode.object as Hex,
  //   args: ["Cuh coin", "CUH", 18],
  // });
  // console.log(a);
  const hash = await walletClient.deployContract({
    account: ALICE,
    abi: mockErc20ABI,
    bytecode: MockERC20.bytecode.object as Hex,
    args: ["Mock ERC20", "MOCK", 18],
  });

  const receipt = await publicClient.waitForTransactionReceipt({
    hash,
  });

  mockERC20Address = receipt.contractAddress!;
});

afterAll(async () => {
  // Reset the anvil instance to the same state it was in before the tests started.
  await testClient.reset({
    jsonRpcUrl: forkUrl,
    blockNumber: forkBlockNumber,
  });
});
