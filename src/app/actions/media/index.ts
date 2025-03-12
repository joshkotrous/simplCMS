"use server";

import { cloudinary } from "@/packages/core/src/cloudinary";
import { s3 } from "@/packages/core/src/s3";
import { getServerEnvVars, simplCms } from "@/packages/core/src/simplCms";
import {
  SimplCMSMedia,
  SimplCMSMediaStorageConfiguration,
} from "@/types/types";
export async function uploadMediaAction(
  files: File[]
): Promise<SimplCMSMedia[]> {
  const platformConfiguration = getServerEnvVars();
  try {
    const uploadedMedia = await simplCms.media.uploadMedia(
      files,
      platformConfiguration.mediaStorage
    );
    return uploadedMedia;
  } catch (error) {
    console.error("Server upload error:", error);
    throw error;
  }
}
