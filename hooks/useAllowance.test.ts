import MockERC20 from "../contracts/out/MockERC20.sol/MockERC20.json";
import { Token } from "../lib/currency";
import { wrapper } from "../test";
import { ALICE, BOB } from "../test/constants";
import { mockErc20ABI } from "../test/generated";
import { anvil, publicClient, walletClient } from "../test/utils";
import { useAllowance } from "./useAllowance";
import { renderHook, waitFor } from "@testing-library/react";
import { Fraction } from "@uniswap/sdk-core";
import { Address, Hex, parseEther } from "viem";
import { beforeAll, describe, expect, test } from "vitest";

export let mockERC20Address: Address;
let mockToken: Token;
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

  mockERC20Address = contractAddress!;

  mockToken = new Token(anvil.id, mockERC20Address, 18, "Mock ERC20", "MOCK");

  const approveHash = await walletClient.writeContract({
    abi: mockErc20ABI,
    functionName: "approve",
    address: mockERC20Address,
    args: [BOB, parseEther("2")],
    account: ALICE,
  });
  await publicClient.waitForTransactionReceipt({ hash: approveHash });
});

describe("allowance test", () => {
  test("can read allowance", async () => {
    const { result } = renderHook(() => useAllowance(mockToken, ALICE, BOB), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    await waitFor(() => expect(result.current.data?.equalTo(new Fraction(2))));
  });
});
