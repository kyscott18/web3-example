import { forkBlockNumber, forkUrl } from "./constants";
import { testClient } from "./utils";
import { afterAll } from "vitest";

afterAll(async () => {
  // Reset the anvil instance to the same state it was in before the tests started.
  await testClient.reset({
    jsonRpcUrl: forkUrl,
    blockNumber: forkBlockNumber,
  });
});
