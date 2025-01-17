import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSiteUrl() {
  if (!process.env.NODE_PUBLIC_SITE_URL)
    throw new Error("NODE_PUBLIC_SITE_URL not configured");

  const siteUrl = process.env.NODE_PUBLIC_SITE_URL;
  return { siteUrl };
}
