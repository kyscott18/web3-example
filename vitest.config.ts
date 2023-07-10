import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["**/*.test.ts"],
    // setupFiles: ["./test/setup.ts"],
    testTimeout: 10_000,
    globals: true,
    globalSetup: ["./test/globalSetup.ts"],
  },
});
