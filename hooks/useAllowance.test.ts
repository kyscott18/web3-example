import { wrapper } from "../test";
import { ALICE, BOB } from "../test/constants";
import { mockERC20 } from "../test/setup";
import { useAllowance } from "./useAllowance";
import { renderHook, waitFor } from "@testing-library/react";
import { Fraction } from "@uniswap/sdk-core";
import { describe, expect, test } from "vitest";

describe("allowance test", () => {
  test("can read allowance", async () => {
    const { result } = renderHook(() => useAllowance(mockERC20, ALICE, BOB), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    await waitFor(() => expect(result.current.data?.equalTo(new Fraction(2))));
  });
});
