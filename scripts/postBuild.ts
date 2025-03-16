import { execSync } from "child_process";
import { copyFileSync, mkdirSync } from "fs";

mkdirSync("dist/client", { recursive: true });
mkdirSync("dist/server", { recursive: true });

execSync(
  "npx tailwindcss -i ./src/app/globals.css -o ./dist/client/globals.css"
);

copyFileSync("tailwind.config.ts", "dist/client/tailwind.config.ts");
