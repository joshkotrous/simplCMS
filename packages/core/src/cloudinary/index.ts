import { CloudinaryMedia } from "@/types/types";
import { v2 as cloudinary } from "cloudinary";

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
      cloudinary.config({
        api_key: apiKey,
        api_secret: apiSecret,
        cloud_name: cloudName,
      });
    } else {
      console.warn("URL not provided. Connecting with CLOUDINARY_URL.");
      cloudinary.config();
    }
    await cloudinary.api.ping();
  } catch (error) {
    console.error(`Could not connect to Cloudinary: ${error}`);
    throw error;
  }
}

export async function getMedia(
  resourceType?: "image" | "video"
): Promise<CloudinaryMedia[]> {
  try {
    cloudinary.config();
    const result = await cloudinary.api.resources({
      resource_type: resourceType,
    });
    return JSON.parse(JSON.stringify(result.resources));
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
    cloudinary.config();

    const uploadPromises = files.map(async (blob) => {
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");

      await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64}`, {
        resource_type: "auto",
      });
    });

    await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading files to Cloudinary:", error);
    throw error;
  }
}

export * as cloudinary from ".";
