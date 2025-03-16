import { defineConfig } from "tsup";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { execSync } from "child_process";

export default defineConfig((options) => {
  return [
    {
      name: "server-utils",
      entry: ["src/index.ts"],
      format: ["cjs", "esm"],
      outDir: "./dist",
      dts: { resolve: true },
      sourcemap: true,
      splitting: false,
      clean: true,
      shims: false,
      bundle: false,
      treeshake: true,
      platform: "node",
      external: ["react", "react-dom", "next"],
      esbuildOptions(options) {
        options.banner = { js: 'import "./globals.css";' };
      },
    },
    {
      name: "client-components",
      entry: ["src/app/client/index.ts"],
      format: ["cjs", "esm"],
      outDir: "./dist/client",
      dts: { resolve: true },
      sourcemap: true,
      splitting: false,
      clean: false,
      shims: false,
      bundle: false, // Change to true
      treeshake: true,
      platform: "browser",
      external: [
        "react",
        "react-dom",
        "next",
        "fs",
        "path",
        "crypto",
        "fs/promises",
        "os",
        "child_process",
        "util",
      ],
      esbuildOptions(options) {
        // This ensures the directive is at the very top
        options.banner = { js: '"use client";' };
        // Add CSS import separately to ensure directive is first
        options.footer = { js: 'import "../globals.css";' };
      },
      async onSuccess() {
        // Same as before
        const distDir = "dist/client";
        const filesToCopy = ["./tailwind.config.ts", "./postcss.config.js"];
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
        try {
          console.log("Building Tailwind CSS...");
          execSync(
            "npx tailwindcss -i ./src/app/globals.css -o ./dist/client/globals.css",
            { stdio: "inherit" }
          );
          console.log("✅ Tailwind CSS built successfully.");
        } catch (error) {
          console.error("❌ Tailwind CSS build failed:", error);
        }
      },
    },
    {
      name: "server-components",
      entry: ["src/app/server/index.ts"],
      format: ["cjs", "esm"],
      outDir: "./dist/server",
      dts: { resolve: true },
      sourcemap: true,
      splitting: false,
      clean: false,
      shims: false,
      bundle: false, // Change to true
      treeshake: true,
      platform: "node",
      external: ["react", "react-dom", "next"],
      esbuildOptions(options) {
        // This ensures the directive is at the very top
        options.banner = { js: '"use server";' };
        // Add CSS import separately to ensure directive is first
        options.footer = { js: 'import "../globals.css";' };
      },
      async onSuccess() {
        // Same as before
        const distDir = "dist/server";
        const filesToCopy = ["./tailwind.config.ts", "./postcss.config.js"];
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
        try {
          console.log("Building Tailwind CSS...");
          execSync(
            "npx tailwindcss -i ./src/app/globals.css -o ./dist/server/globals.css",
            { stdio: "inherit" }
          );
          console.log("✅ Tailwind CSS built successfully.");
        } catch (error) {
          console.error("❌ Tailwind CSS build failed:", error);
        }
      },
    },
  ];
});
