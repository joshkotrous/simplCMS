import { defineConfig } from "tsup";
import fs from "fs";
import path from "path";

// Function to collect all client components
function getClientComponents() {
  const clientDir = path.resolve(__dirname, "src/app/client/components");
  if (!fs.existsSync(clientDir)) return [];

  return fs
    .readdirSync(clientDir)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => `simplcms/client/${file.replace(".tsx", "")}`);
}

export default defineConfig([
  // 🟢 Client Bundle
  {
    entry: {
      index: "src/app/client/index.ts",
    },
    outDir: "dist/client",
    format: ["esm", "cjs"],
    dts: true,
    splitting: true,
    clean: true,
    esbuildOptions(options) {
      options.banner = {
        js: '"use client";',
      };
    },
  },
  // 🔴 Server Bundle (EXCLUDE client components)
  {
    entry: {
      index: "src/app/server/index.ts",
    },
    outDir: "dist/server",
    format: ["esm", "cjs"],
    dts: true,
    splitting: true,
    clean: true,
    external: [
      "simplcms/client", // ✅ Prevents TSUP from bundling Client Components
      ...getClientComponents(), // ✅ Ensures no Client Components are bundled inside Server
    ],
    esbuildOptions(options) {
      options.banner = {
        js: '"use server";',
      };
    },
  },
  // 🔵 Shared Utilities Bundle
  {
    entry: {
      index: "src/core/lib/utils.ts",
    },
    outDir: "dist/shared",
    format: ["esm", "cjs"],
    dts: true,
    splitting: false,
    clean: false,
  },
]);
