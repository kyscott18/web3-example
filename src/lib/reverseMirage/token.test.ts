import MockERC20 from "../../../contracts/out/MockERC20.sol/MockERC20.json";
import { ALICE, BOB } from "../../_test/constants";
import { mockErc20ABI } from "../../_test/generated";
import { publicClient, walletClient } from "../../_test/utils";
import {
  erc20Allowance,
  erc20BalanceOf,
  erc20Decimals,
  erc20GetToken,
  erc20Name,
  erc20Symbol,
  erc20TotalSupply,
} from "./token";
import { readAndParse } from "./utils";
import { Fraction } from "@uniswap/sdk-core";
import { Address, Hex, getAddress, isAddress, parseEther } from "viem";
import { beforeAll, describe, expect, test } from "vitest";

export let mockERC20Address: Address;
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

  const mintHash = await walletClient.writeContract({
    abi: mockErc20ABI,
    functionName: "mint",
    address: mockERC20Address,
    args: [ALICE, parseEther("1")],
    account: ALICE,
  });
  await publicClient.waitForTransactionReceipt({ hash: mintHash });

  const transferHash = await walletClient.writeContract({
    abi: mockErc20ABI,
    functionName: "transfer",
    address: mockERC20Address,
    args: [BOB, parseEther("0.25")],
    account: ALICE,
  });
  await publicClient.waitForTransactionReceipt({ hash: transferHash });

  const approveHash = await walletClient.writeContract({
    abi: mockErc20ABI,
    functionName: "approve",
    address: mockERC20Address,
    args: [BOB, parseEther("2")],
    account: ALICE,
  });
  await publicClient.waitForTransactionReceipt({ hash: approveHash });
});

describe("token", () => {
  test("can deploy the token contract", async () => {
    expect(mockERC20Address).toBeDefined();
    expect(isAddress(mockERC20Address)).toBe(true);
  });

  test("can read name", async () => {
    const name = await readAndParse(
      erc20Name(publicClient, { token: { address: mockERC20Address } }),
    );

    expect(name).toBe("Mock ERC20");
  });

  test("can read symbol", async () => {
    const symbol = await readAndParse(
      erc20Symbol(publicClient, { token: { address: mockERC20Address } }),
    );

    expect(symbol).toBe("MOCK");
  });

  test("can read decimals", async () => {
    const decimals = await readAndParse(
      erc20Decimals(publicClient, { token: { address: mockERC20Address } }),
    );

    expect(decimals).toBe(18);
  });

  test("can read balance", async () => {
    const token = await readAndParse(
      erc20GetToken(publicClient, {
        token: { address: mockERC20Address, chainId: 1 },
      }),
    );

    const balanceOfALICE = await readAndParse(
      erc20BalanceOf(publicClient, { token, address: ALICE }),
    );
    expect(balanceOfALICE.equalTo(new Fraction(3, 4)));

    const balanceOfBOB = await readAndParse(
      erc20BalanceOf(publicClient, { token, address: BOB }),
    );
    expect(balanceOfBOB.equalTo(new Fraction(1, 4)));
  });

  test("can read allowance", async () => {
    const token = await readAndParse(
      erc20GetToken(publicClient, {
        token: { address: mockERC20Address, chainId: 1 },
      }),
    );

    const allowance = await readAndParse(
      erc20Allowance(publicClient, { token, address: ALICE, spender: BOB }),
    );
    expect(allowance.equalTo(2));
  });

  test("can read totalSupply", async () => {
    const token = await readAndParse(
      erc20GetToken(publicClient, {
        token: { address: mockERC20Address, chainId: 1 },
      }),
    );

    const totalSupply = await readAndParse(
      erc20TotalSupply(publicClient, { token }),
    );
    expect(totalSupply.equalTo(1));
  });

  test("can get token", async () => {
    const token = await readAndParse(
      erc20GetToken(publicClient, {
        token: { address: mockERC20Address, chainId: 1 },
      }),
    );

    expect(token.address).toBe(getAddress(mockERC20Address));
    expect(token.chainId).toBe(1);
    expect(token.name).toBe("Mock ERC20");
    expect(token.symbol).toBe("MOCK");
    expect(token.decimals).toBe(18);
  });
});
