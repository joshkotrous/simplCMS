import { defineConfig } from "tsup";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  splitting: false,
  clean: true,
  shims: true,
  external: ["react", "react-dom", "next"],
  onSuccess: async () => {
    const filesToCopy = [
      "tailwind.config.js",
      "postcss.config.js",
      "next.config.js",
    ];
    const distDir = "dist";

    filesToCopy.forEach((file) => {
      const srcPath = join(__dirname, file);
      const destPath = join(__dirname, distDir, file);

      if (existsSync(srcPath)) {
        if (!existsSync(dirname(destPath))) {
          mkdirSync(dirname(destPath), { recursive: true });
        }
        copyFileSync(srcPath, destPath);
        console.log(`Copied ${file} to ${distDir}`);
      }
    });

    return Promise.resolve(); // Ensures TypeScript compatibility
  },
});
