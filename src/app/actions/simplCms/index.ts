"use server";

import { simplCms } from "@/packages/core/src/simplCms";

export async function initSiteConfig() {
  try {
    await simplCms.initSiteConfig();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
