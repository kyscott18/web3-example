import { warn } from "console";

export const poolId = Number(process.env.VITEST_POOL_ID ?? 1);
export const localHttpUrl = `http://127.0.0.1:8545/${poolId}`;
export const localWsUrl = `ws://127.0.0.1:8545/${poolId}`;

export let forkUrl: string;
if (process.env.VITE_ANVIL_FORK_URL) {
  forkUrl = process.env.VITE_ANVIL_FORK_URL;
} else {
  forkUrl = "https://cloudflare-eth.com";
  warn(`\`VITE_ANVIL_FORK_URL\` not found. Falling back to \`${forkUrl}\`.`);
}

export const forkBlockNumber = 16280770n;

export const blockTime = 1;
