// utils/pageScanner.ts
import { PageInfo } from "@/types/types";
import fs from "fs";
import path from "path";

export function scanPages(pagesDir: string = "src/app"): PageInfo[] {
  const pages: PageInfo[] = [];

  function scanDirectory(currentPath: string, basePath: string = "") {
    const entries = fs.readdirSync(currentPath);

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry);
      const stats = fs.statSync(fullPath);

      // Skip node_modules, .next, and other special directories
      if (
        entry.startsWith(".") ||
        entry === "node_modules" ||
        entry === "api"
      ) {
        continue;
      }

      if (stats.isDirectory()) {
        // Recursively scan subdirectories
        scanDirectory(fullPath, path.join(basePath, entry));
      } else {
        // Check if it's a page file
        if (
          entry === "page.tsx" ||
          entry === "page.jsx" ||
          entry === "page.js"
        ) {
          const route = basePath.replace(/\\/g, "/");
          pages.push({
            route: route || "/", // Root path if empty
            filePath: fullPath,
            type: "static",
            lastModified: stats.mtime,
          });
        }
      }
    }
  }

  scanDirectory(pagesDir);
  return pages;
}
