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

export async function deleteMediaAction(media: SimplCMSMedia) {
  const platformConfiguration = getServerEnvVars();
  await simplCms.media.deleteMedia(media, platformConfiguration.mediaStorage);
}

export async function updateMediaNameAction(
  media: SimplCMSMedia,
  newName: string
): Promise<SimplCMSMedia> {
  try {
    const platformConfiguration = getServerEnvVars();
    const mediaStorage = platformConfiguration.mediaStorage;

    if (!mediaStorage) {
      throw new Error("Media storage configuration not found");
    }

    let updatedMedia: SimplCMSMedia;

    // Update the media name based on the source
    if (media.source === "AWS S3") {
      updatedMedia = await s3.updateS3MediaName(media, newName, mediaStorage);
    } else if (media.source === "Cloudinary") {
      updatedMedia = await cloudinary.updateCloudinaryMediaName(
        media,
        newName,
        mediaStorage
      );
    } else {
      throw new Error(`Unsupported media source: ${media.source}`);
    }

    return updatedMedia;
  } catch (error) {
    console.error("Error updating media name:", error);
    throw error;
  }
}
