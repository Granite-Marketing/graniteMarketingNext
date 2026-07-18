import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
  },
  resolve: {
    // Mirrors tsconfig.json's "paths": { "@/*": ["./*"] } exactly.
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
