import { forkBlockNumber } from "./constants";
import { setBlockNumber, testClient } from "./utils";
import { afterAll } from "vitest";

afterAll(async () => {
  // Reset the anvil instance to the same state it was in before the tests started.
  await Promise.all([
    setBlockNumber(forkBlockNumber),
    testClient.setAutomine(false),
    testClient.setIntervalMining({ interval: 1 }),
  ]);
});
