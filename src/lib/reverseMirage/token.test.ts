import MockERC20 from "../../../contracts/out/MockERC20.sol/MockERC20.json";
import { ALICE } from "../../_test/constants";
import { mockErc20ABI } from "../../_test/generated";
import { publicClient, walletClient } from "../../_test/utils";
import { erc20Decimals, erc20GetToken, erc20Name, erc20Symbol } from "./token";
import { readAndParse } from "./utils";
import { Address, Hex, getAddress, isAddress } from "viem";
import { beforeAll, describe, expect, test } from "vitest";

export let mockERC20Address: Address;
beforeAll(async () => {
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
