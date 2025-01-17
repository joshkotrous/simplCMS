"use server";

import { cloudinary } from "@/packages/core/src/cloudinary";

export async function testCloudinaryConnectionAction(url: string) {
  try {
    await cloudinary.testConnection(url);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
