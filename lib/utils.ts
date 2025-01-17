// import { vercel } from "@/packages/core/src/vercel";
import crypto from "crypto";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function getEnvironment(): "dev" | "prod" {
  if (!process.env.NODE_ENV) throw new Error("NODE_ENV not configured");
  if (process.env.NODE_ENV === "development") return "dev";
  if (process.env.NODE_ENV === "production") return "prod";
  throw new Error("Unsupported NODE_ENV");
}

export function generateSecret(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

// export function getEnvVars() {
//   const { projectId, teamId, token } = vercel.getVercelEnvVars();
// }

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSiteUrl() {
  if (!process.env.NODE_PUBLIC_SITE_URL)
    throw new Error("NODE_PUBLIC_SITE_URL not configured");

  const siteUrl = process.env.NODE_PUBLIC_SITE_URL;
  return { siteUrl };
}
