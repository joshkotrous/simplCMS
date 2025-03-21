"use server";

import { simplcms } from "../../..";
import {
  SimplCMSMedia,
  SimplCMSMediaStorageConfiguration,
} from "../../../../types/types";
export async function uploadMediaAction(
  files: File[]
): Promise<SimplCMSMedia[]> {
  const platformConfiguration = simplcms.platform.getPlatformConfiguration();
  try {
    const uploadedMedia = await simplcms.media.uploadMedia(
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
  const platformConfiguration = simplcms.platform.getPlatformConfiguration();
  await simplcms.media.deleteMedia(media, platformConfiguration.mediaStorage);
}

export async function updateMediaNameAction(
  media: SimplCMSMedia,
  newName: string
): Promise<SimplCMSMedia> {
  try {
    const platformConfiguration = simplcms.platform.getPlatformConfiguration();
    const mediaStorage = platformConfiguration.mediaStorage;

    if (!mediaStorage) {
      throw new Error("Media storage configuration not found");
    }

    let updatedMedia: SimplCMSMedia;

    // Update the media name based on the source
    if (media.source === "AWS S3") {
      updatedMedia = await simplcms.providers.s3.updateMediaName(
        media,
        newName,
        mediaStorage
      );
    } else if (media.source === "Cloudinary") {
      updatedMedia =
        await simplcms.providers.cloudinary.updateCloudinaryMediaName(
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
