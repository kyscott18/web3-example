import { wrapper } from "../test";
import { ALICE, BOB, mockERC20 } from "../test/constants";
import { useAllowance } from "./useAllowance";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";

describe("allowance test", () => {
  test("can read allowance", async () => {
    const { result } = renderHook(() => useAllowance(mockERC20, ALICE, BOB), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);
    expect(result.current.data).toBeTruthy();
    expect(result.current.data!.equalTo("2000000000000000000")).toBe(true);
  });
});
