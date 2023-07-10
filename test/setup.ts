import MockERC20 from "../contracts/out/MockERC20.sol/MockERC20.json";
import { Token } from "../lib/currency";
import { ALICE, BOB, forkBlockNumber, forkUrl } from "./constants";
import { mockErc20ABI } from "./generated";
import { anvil, publicClient, testClient, walletClient } from "./utils";
import invariant from "tiny-invariant";
import { Hex, parseEther } from "viem";
import { afterAll, beforeAll } from "vitest";

export let mockERC20: Token;

beforeAll(async () => {
  const deployHash = await walletClient.deployContract({
    account: ALICE,
    abi: mockErc20ABI,
    bytecode: MockERC20.bytecode.object as Hex,
    args: ["Mock ERC20", "MOCK", 18],
  });

  const { contractAddress } = await publicClient.waitForTransactionReceipt({
    hash: deployHash,
  });

  invariant(contractAddress);
  mockERC20 = new Token(anvil.id, contractAddress, 18, "Mock ERC20", "MOCK");

  const mintHash = await walletClient.writeContract({
    abi: mockErc20ABI,
    functionName: "mint",
    address: contractAddress,
    args: [ALICE, parseEther("1")],
  });
  await publicClient.waitForTransactionReceipt({ hash: mintHash });

  const transferHash = await walletClient.writeContract({
    abi: mockErc20ABI,
    functionName: "transfer",
    address: contractAddress,
    args: [BOB, parseEther("0.25")],
  });
  await publicClient.waitForTransactionReceipt({ hash: transferHash });

  const approveHash = await walletClient.writeContract({
    abi: mockErc20ABI,
    functionName: "approve",
    address: contractAddress,
    args: [BOB, parseEther("2")],
  });
  await publicClient.waitForTransactionReceipt({ hash: approveHash });
});

afterAll(async () => {
  // Reset the anvil instance to the same state it was in before the tests started.
  await testClient.reset({
    jsonRpcUrl: forkUrl,
    blockNumber: forkBlockNumber,
  });
});
