import * as fs from "fs/promises";
import * as path from "path";

export async function setLocalEnvVar(
  key: string,
  value: string
): Promise<void> {
  const envPath = path.resolve(process.cwd(), ".env");
  await fs.appendFile(envPath, `${key}=${value}\n`);
}

export * as dev from ".";
