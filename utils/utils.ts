import crypto from "crypto";

export function getEnvironment(): "dev" | "prod" {
  if (!process.env.NODE_ENV) throw new Error("NODE_ENV not configured");
  if (process.env.NODE_ENV === "development") return "dev";
  if (process.env.NODE_ENV === "production") return "prod";
  throw new Error("Unsupported NODE_ENV");
}

export function generateSecret(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}
