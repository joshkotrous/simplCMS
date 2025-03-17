import {
  CloudinaryMedia,
  SimplCMSMedia,
  SimplCMSMediaStorageConfiguration,
} from "../../../types/types";
import { v2 as cloudinarySDK } from "cloudinary";

function parseCloudinaryUrl(cloudinaryUrl: string) {
  try {
    if (!cloudinaryUrl.startsWith("cloudinary://")) {
      throw new Error("Invalid Cloudinary URL format");
    }

    const parsedUrl = new URL(cloudinaryUrl);

    const apiKey = parsedUrl.username;
    const apiSecret = parsedUrl.password;
    const cloudName = parsedUrl.hostname;

    if (!apiKey || !apiSecret || !cloudName) {
      throw new Error("Missing required components in the Cloudinary URL");
    }

    return { apiKey, apiSecret, cloudName };
  } catch (error) {
    console.error("Error parsing Cloudinary URL: ", error);
    throw error;
  }
}

export async function testConnection(url?: string) {
  try {
    if (url) {
      const { apiKey, apiSecret, cloudName } = parseCloudinaryUrl(url);
      cloudinarySDK.config({
        api_key: apiKey,
        api_secret: apiSecret,
        cloud_name: cloudName,
      });
    } else {
      console.warn("URL not provided. Connecting with CLOUDINARY_URL.");
      cloudinarySDK.config();
    }
    await cloudinarySDK.api.ping();
  } catch (error) {
    console.error(`Could not connect to Cloudinary: ${error}`);
    throw error;
  }
}

export async function getMedia(
  resourceType?: "image" | "video"
): Promise<SimplCMSMedia[]> {
  try {
    // Configure cloudinary
    cloudinarySDK.config();

    // Fetch resources from Cloudinary
    const result = await cloudinarySDK.api.resources({
      resource_type: resourceType,
    });

    // Transform Cloudinary resources to match SimplCMSMedia schema
    const mediaItems = result.resources.map((resource: CloudinaryMedia) => {
      return {
        id: resource.asset_id,
        name: resource.display_name,
        url: resource.secure_url,
        type: resource.resource_type === "video" ? "video" : "image",
        source: "Cloudinary" as const,
      };
    });

    return mediaItems;
  } catch (error) {
    const _error = error as { error: { message: string } };
    console.error(
      "Error fetching media from Cloudinary:",
      _error.error.message
    );
    throw error;
  }
}
export async function uploadFiles(files: Blob[]): Promise<void> {
  try {
    cloudinarySDK.config();

    const uploadPromises = files.map(async (blob) => {
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");

      await cloudinarySDK.uploader.upload(`data:image/jpeg;base64,${base64}`, {
        resource_type: "auto",
      });
    });

    await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading files to Cloudinary:", error);
    throw error;
  }
}

export async function deleteCloudinaryMedia(
  media: SimplCMSMedia,
  mediaStorageConfiguration: SimplCMSMediaStorageConfiguration
): Promise<void> {
  // Find Cloudinary configuration in the media storage configuration
  if (!Array.isArray(mediaStorageConfiguration)) {
    throw new Error("Invalid media storage configuration");
  }

  const cloudinaryConfigEntry = mediaStorageConfiguration.find(
    (config) => config.provider === "Cloudinary"
  );

  if (!cloudinaryConfigEntry || !cloudinaryConfigEntry.cloudinary) {
    throw new Error("Cloudinary configuration not found");
  }

  const cloudinaryConfig = cloudinaryConfigEntry.cloudinary;

  // Validate Cloudinary configuration
  if (!cloudinaryConfig.uri) {
    throw new Error("Cloudinary config is missing URI");
  }

  // Configure Cloudinary with the credentials from the URI
  const { apiKey, apiSecret, cloudName } = parseCloudinaryUrl(
    cloudinaryConfig.uri
  );
  cloudinarySDK.config({
    api_key: apiKey,
    api_secret: apiSecret,
    cloud_name: cloudName,
  });

  try {
    // Extract the public ID from the media URL
    // Cloudinary URLs typically look like:
    // https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
    const url = new URL(media.url);
    const pathParts = url.pathname.split("/");

    // The public ID is usually after 'upload' and may include a version prefix
    let publicIdWithExtension = "";
    const uploadIndex = pathParts.findIndex((part) => part === "upload");

    if (uploadIndex !== -1 && uploadIndex < pathParts.length - 1) {
      // Get everything after 'upload', but skip the version part if present
      const afterUpload = pathParts.slice(uploadIndex + 1).join("/");

      // If there's a version prefix (v1234567890), skip it
      if (afterUpload.startsWith("v") && /^v\d+\//.test(afterUpload)) {
        publicIdWithExtension = afterUpload.replace(/^v\d+\//, "");
      } else {
        publicIdWithExtension = afterUpload;
      }
    } else {
      // Fall back to using the asset ID
      publicIdWithExtension = media.id;
    }

    // Remove file extension if present
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "");

    // Determine resource type based on media type
    const resourceType = media.type === "video" ? "video" : "image";

    // Delete the resource
    await cloudinarySDK.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("Error deleting media from Cloudinary:", error);
    throw error;
  }
}

export async function updateCloudinaryMediaName(
  media: SimplCMSMedia,
  newName: string,
  mediaStorageConfiguration: SimplCMSMediaStorageConfiguration
): Promise<SimplCMSMedia> {
  // Find Cloudinary configuration in the media storage configuration
  if (!Array.isArray(mediaStorageConfiguration)) {
    throw new Error("Invalid media storage configuration");
  }

  const cloudinaryConfigEntry = mediaStorageConfiguration.find(
    (config) => config.provider === "Cloudinary"
  );

  if (!cloudinaryConfigEntry || !cloudinaryConfigEntry.cloudinary) {
    throw new Error("Cloudinary configuration not found");
  }

  const cloudinaryConfig = cloudinaryConfigEntry.cloudinary;

  // Validate Cloudinary configuration
  if (!cloudinaryConfig.uri) {
    throw new Error("Cloudinary config is missing URI");
  }

  // Configure Cloudinary with the credentials from the URI
  const { apiKey, apiSecret, cloudName } = parseCloudinaryUrl(
    cloudinaryConfig.uri
  );

  cloudinarySDK.config({
    api_key: apiKey,
    api_secret: apiSecret,
    cloud_name: cloudName,
  });

  try {
    // Extract the public ID from the media URL
    // Cloudinary URLs typically look like:
    // https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
    const url = new URL(media.url);
    const pathParts = url.pathname.split("/");

    // The public ID is usually after 'upload' and may include a version prefix
    let publicIdWithExtension = "";
    const uploadIndex = pathParts.findIndex((part) => part === "upload");

    if (uploadIndex !== -1 && uploadIndex < pathParts.length - 1) {
      // Get everything after 'upload', but skip the version part if present
      const afterUpload = pathParts.slice(uploadIndex + 1).join("/");
      // If there's a version prefix (v1234567890), skip it
      if (afterUpload.startsWith("v") && /^v\d+\//.test(afterUpload)) {
        publicIdWithExtension = afterUpload.replace(/^v\d+\//, "");
      } else {
        publicIdWithExtension = afterUpload;
      }
    } else {
      // Fall back to using the asset ID
      publicIdWithExtension = media.id;
    }

    // Remove file extension if present
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "");

    // Get file extension from the original name
    const fileExtMatch = media.name.match(/\.[^/.]+$/);
    const fileExt = fileExtMatch ? fileExtMatch[0] : "";

    // Determine resource type based on media type
    const resourceType = media.type === "video" ? "video" : "image";

    // Add extension to new name if it doesn't have one
    const finalNewName =
      !newName.includes(".") && fileExt ? `${newName}${fileExt}` : newName;

    // Update the media metadata/context to include the new display name
    // Using add_context method to update the display name
    await cloudinarySDK.uploader.add_context(
      `display_name=${finalNewName}`,
      [publicId],
      {
        resource_type: resourceType,
      }
    );

    // Update the media object with the new name
    // Note: The URL remains the same as the public_id hasn't changed
    // Since we're only changing metadata, the actual asset on Cloudinary is unchanged
    // In production, you may need to fetch the updated media list to confirm changes
    return {
      ...media,
      name: finalNewName,
    };
  } catch (error) {
    console.error("Error updating media name in Cloudinary:", error);
    throw error;
  }
}

export const cloudinary = {
  testConnection,
  getMedia,
  uploadFiles,
  deleteCloudinaryMedia,
  updateCloudinaryMediaName,
};
