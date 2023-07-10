import { ALICE, BOB } from "../../test/constants";
import { mockERC20 } from "../../test/setup";
import { publicClient } from "../../test/utils";
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
import { getAddress, isAddress } from "viem";
import { describe, expect, test } from "vitest";

describe("token", () => {
  test("can deploy the token contract", async () => {
    expect(mockERC20.address).toBeDefined();
    expect(isAddress(mockERC20.address)).toBe(true);
  });

  test("can read name", async () => {
    const name = await readAndParse(
      erc20Name(publicClient, { token: mockERC20 }),
    );

    expect(name).toBe("Mock ERC20");
  });

  test("can read symbol", async () => {
    const symbol = await readAndParse(
      erc20Symbol(publicClient, { token: mockERC20 }),
    );

    expect(symbol).toBe("MOCK");
  });

  test("can read decimals", async () => {
    const decimals = await readAndParse(
      erc20Decimals(publicClient, { token: mockERC20 }),
    );

    expect(decimals).toBe(18);
  });

  test("can read balance", async () => {
    const token = await readAndParse(
      erc20GetToken(publicClient, {
        token: mockERC20,
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
        token: mockERC20,
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
        token: mockERC20,
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
        token: mockERC20,
      }),
    );

    expect(token.address).toBe(getAddress(mockERC20.address));
    expect(token.chainId).toBe(1);
    expect(token.name).toBe("Mock ERC20");
    expect(token.symbol).toBe("MOCK");
    expect(token.decimals).toBe(18);
  });
});
