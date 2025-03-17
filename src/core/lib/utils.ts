import { Page } from "../../../types/types";
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

export function getSiteUrl() {
  if (!process.env.NODE_PUBLIC_SITE_URL)
    throw new Error("NODE_PUBLIC_SITE_URL not configured");

  const siteUrl = process.env.NODE_PUBLIC_SITE_URL;
  return { siteUrl };
}

export const defaultHomePageConfig: Page = {
  _id: "",
  createdAt: new Date(),
  publishedAt: new Date(),
  updatedAt: new Date(),
  status: "published",
  elements: [
    {
      type: "h1",
      content: "SimplCms",
      children: [],
      attributes: null,
      styles: [
        { property: "textAlign", value: "center" },
        { property: "fontSize", value: "64px" },
        { property: "fontWeight", value: "bold" },
      ],
    },
    {
      type: "p",
      content: null,
      children: [
        {
          type: "",
          content: "Go to the",
          children: [],
        },
        {
          type: "a",
          content: " dashboard ",
          attributes: [{ name: "href", value: "/admin" }],
          children: [],
          styles: [
            { property: "alignContent", value: "center" },
            { property: "fontWeight", value: "bold" },
          ],
        },
        {
          type: "",
          content: "to edit this page",
          children: [],
          styles: [{ property: "alignContent", value: "center" }],
        },
      ],
      attributes: null,
      styles: [{ property: "textAlign", value: "center" }],
    },
  ],
  metadata: {
    description: "Page",
    keywords: [""],
    ogImage: "",
    title: "Page",
  },
  route: "/",
};
