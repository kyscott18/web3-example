import { mockERC20Address } from "../../_test/setup";
import { isAddress } from "viem";
import { describe, expect, test } from "vitest";

describe("wagmi", () => {
  test("can deploy the wagmi contract", async () => {
    expect(mockERC20Address).toBeDefined();
    expect(isAddress(mockERC20Address)).toBe(true);
  });
});
