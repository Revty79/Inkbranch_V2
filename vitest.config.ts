import { resolve } from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "server-only": resolve(__dirname, "tests/stubs/server-only.ts")
    }
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react"
  },
  test: {
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    environment: "node"
  }
});
