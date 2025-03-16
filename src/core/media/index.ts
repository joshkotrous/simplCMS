import {
  MediaStorageProvider,
  SimplCMSMedia,
  SimplCMSMediaStorageConfiguration,
} from "@/types";
import { s3 } from "../providers/s3";
import { simplCms } from "@/index";

export async function getMedia(
  mediaStorageConfiguration: SimplCMSMediaStorageConfiguration
): Promise<SimplCMSMedia[]> {
  if (Array.isArray(mediaStorageConfiguration)) {
    for (const config of mediaStorageConfiguration) {
      switch (config.provider) {
        case "Cloudinary":
          const cloudinaryMedia =
            await simplCms.providers.cloudinary.getMedia();
          return cloudinaryMedia;

        case "AWS S3":
          if (!config?.s3) throw new Error("S3 is not configured");
          const s3Media = await simplCms.providers.s3.getMedia(config?.s3);
          return s3Media;
      }
    }
  }
  throw new Error("Invalid media storage configuration");
}

export async function uploadMedia(
  files: File[],
  mediaStorageConfiguration: SimplCMSMediaStorageConfiguration
): Promise<SimplCMSMedia[]> {
  try {
    if (files.length === 0) {
      throw new Error("No files provided");
    }

    // Check if configuration is skipped or null
    if (
      !mediaStorageConfiguration ||
      ("skipped" in mediaStorageConfiguration &&
        mediaStorageConfiguration.skipped)
    ) {
      return [];
    }

    // Handle array configuration
    const configArray = Array.isArray(mediaStorageConfiguration)
      ? mediaStorageConfiguration.filter(Boolean) // Filter out null values
      : [mediaStorageConfiguration];

    if (configArray.length === 0) {
      throw new Error("No valid media storage configuration provided");
    }

    // Array to store all uploaded media
    const uploadedMedia: SimplCMSMedia[] = [];

    // Process each configuration
    const uploadPromises = configArray.map(async (config) => {
      // Skip if config is null or has 'skipped' property
      if (!config || "skipped" in config) {
        return;
      }

      // Type guard to check if we have a valid configuration object
      if (!("provider" in config)) {
        return;
      }

      const provider = config.provider || "Cloudinary"; // Default to Cloudinary if not specified

      if (provider === "Cloudinary" && config.cloudinary) {
        try {
          // Upload to Cloudinary
          // Note: Assuming cloudinary.uploadFiles returns SimplCMSMedia objects
          const cloudinaryResult =
            await simplCms.providers.cloudinary.uploadFiles(files);

          // If uploadFiles returns SimplCMSMedia array directly
          if (Array.isArray(cloudinaryResult)) {
            uploadedMedia.push(...cloudinaryResult);
          }
        } catch (error) {
          console.error("Error uploading to Cloudinary:", error);
        }
      } else if (provider === "AWS S3" && config.s3) {
        try {
          // Upload to S3
          const s3Result = await simplCms.providers.s3.uploadFiles(
            config.s3,
            files as unknown as Blob[]
          );

          // Transform S3 upload results to SimplCMSMedia format
          const s3Media = s3Result.map((item: { key: string; url: string }) => {
            // Extract filename from key
            const fileName = item.key.split("/").pop() || item.key;

            // Determine media type based on file extension
            const fileExtension =
              fileName.split(".").pop()?.toLowerCase() || "";
            const videoExtensions = [
              "mp4",
              "mov",
              "avi",
              "webm",
              "mkv",
              "flv",
              "wmv",
              "m4v",
            ];
            const isVideo = videoExtensions.includes(fileExtension);

            return {
              id: item.key,
              name: fileName,
              url: item.url,
              type: isVideo ? "video" : ("image" as "image" | "video"),
              source: "AWS S3" as const,
            };
          });

          uploadedMedia.push(...s3Media);
        } catch (error) {
          console.error("Error uploading to S3:", error);
        }
      }
    });

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    return uploadedMedia;
  } catch (error) {
    console.error("Server upload error:", error);
    throw error;
  }
}

export async function deleteMedia(
  media: SimplCMSMedia,
  mediaStorageConfiguration: SimplCMSMediaStorageConfiguration
): Promise<void> {
  try {
    if (media.source === "AWS S3") {
      await s3.deleteMedia(media, mediaStorageConfiguration);
    } else if (media.source === "Cloudinary") {
      await simplCms.providers.cloudinary.deleteCloudinaryMedia(
        media,
        mediaStorageConfiguration
      );
    } else {
      throw new Error(`Unsupported media source: ${media.source}`);
    }
  } catch (error: any) {
    console.error("Error deleting media:", error);
    throw error;
  }
}

export const media = {
  getMedia,
  uploadMedia,
  deleteMedia,
};
