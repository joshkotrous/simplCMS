import * as fs from "fs/promises";
import * as path from "path";

export async function setLocalEnvVar(
  key: string,
  value: string
): Promise<void> {
  // Validate key: only allow valid environment variable name characters
  if (!key || !/^[A-Za-z0-9_]+$/.test(key)) {
    throw new Error("Invalid environment variable key. Only letters, numbers, and underscores are allowed.");
  }
  
  // Sanitize value: replace any newlines which could break the .env file format
  const sanitizedValue = value.replace(/\n/g, "");
  
  const envPath = path.resolve(process.cwd(), ".env");
  await fs.appendFile(envPath, `${key}=${sanitizedValue}\n`);
}

export * as dev from ".";