import { wrapper } from "../test";
import { ALICE, mockERC20 } from "../test/constants";
import { useBalance } from "./useBalance";
import { renderHook, waitFor } from "@testing-library/react";
import {
  currencyAmountEqualTo,
  makeCurrencyAmountFromString,
} from "reverse-mirage";
import { describe, expect, test } from "vitest";

describe("balance test", () => {
  test("can read balance", async () => {
    const { result } = renderHook(() => useBalance(mockERC20, ALICE), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeTruthy();
    expect(
      currencyAmountEqualTo(
        result.current.data!,
        makeCurrencyAmountFromString(mockERC20, ".75"),
      ),
    ).toBe(true);
  });
});
