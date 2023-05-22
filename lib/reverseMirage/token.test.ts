import { wagmiContractConfig } from "../../_test/abis";
import { publicClient } from "../../_test/utils";
import { describe, expect, test } from "vitest";

describe("wagmi", () => {
  test("default", async () => {
    expect(
      await publicClient.readContract({
        ...wagmiContractConfig,
        functionName: "balanceOf",
        args: ["0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC"],
      }),
    ).toEqual(3n);
  });
});
