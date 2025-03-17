"use server";

import { simplcms } from "../../../../core";

export async function testCloudinaryConnectionAction(url: string) {
  try {
    await simplcms.providers.cloudinary.testConnection(url);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
