import { wrapper } from "../test";
import { ALICE, mockERC20 } from "../test/constants";
import { useBalance } from "./useBalance";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";

describe("balance test", () => {
  test("can read balance", async () => {
    const { result } = renderHook(() => useBalance(mockERC20, ALICE), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeTruthy();
    expect(result.current.data!.equalTo("750000000000000000")).toBe(true);
  });
});
