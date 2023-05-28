import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    setupFiles: ["./src/_test/setup.ts"],
    testTimeout: 10_000,
  },
});
