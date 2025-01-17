"use server";

import { cloudinary } from "@/packages/core/src/cloudinary";

export async function uploadToCloudinary(files: File[]) {
  try {
    if (files.length === 0) {
      throw new Error("No files provided");
    }

    await cloudinary.uploadFiles(files);
    return { success: true };
  } catch (error) {
    console.error("Server upload error:", error);
    throw error;
  }
}
