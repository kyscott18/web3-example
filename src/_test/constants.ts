export const localHttpUrl = "http://127.0.0.1:8545";
export const localWsUrl = "ws://127.0.0.1:8545";

export const forkBlockNumber = BigInt(
  Number(process.env.VITE_ANVIL_BLOCK_NUMBER!),
);

export const forkUrl = process.env.VITE_ANVIL_FORK_URL!;

export const blockTime = Number(process.env.VITE_ANVIL_BLOCK_TIME!);
