import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    setupFiles: ["./_test/setup.ts"],
    testTimeout: 10_000,
  },
});
