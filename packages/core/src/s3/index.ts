import {
  AWSS3Config,
  SimplCMSMedia,
  SimplCMSMediaStorageConfiguration,
} from "@/types/types";
import {
  S3Client,
  ListObjectsV2Command,
  HeadBucketCommand,
  ListObjectsV2CommandOutput,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export async function testS3Connection(
  config: AWSS3Config
): Promise<ListObjectsV2CommandOutput> {
  try {
    // Create an S3 client
    if (!config.region) throw new Error("Config is missing region");
    if (!config.accessKeyId)
      throw new Error("Config is missing access key id`");
    if (!config.accessSecretKey)
      throw new Error("Config is missing secret access key`");
    const s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.accessSecretKey,
      },
    });

    // First, check if the bucket exists and is accessible
    try {
      await s3Client.send(
        new HeadBucketCommand({ Bucket: config.bucketName! })
      );
    } catch (error: any) {
      throw error;
    }

    // If we get here, the bucket exists and is accessible
    // Let's try to list objects to further confirm access
    const listCommand = new ListObjectsV2Command({
      Bucket: config.bucketName!,
      MaxKeys: 1, // We only need to check if we can list, not get all objects
    });

    const listResult = await s3Client.send(listCommand);

    return listResult;
  } catch (error: any) {
    throw error;
  }
}

export async function getMedia(
  config: AWSS3Config,
  prefix: string = "",
  maxItems: number = 1000
): Promise<SimplCMSMedia[]> {
  try {
    // Validate config
    if (!config.region) throw new Error("Config is missing region");
    if (!config.accessKeyId) throw new Error("Config is missing access key id");
    if (!config.accessSecretKey)
      throw new Error("Config is missing secret access key");
    if (!config.bucketName) throw new Error("Config is missing bucket name");

    // Create an S3 client
    const s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.accessSecretKey,
      },
    });

    // List objects in the bucket with the given prefix
    const listCommand = new ListObjectsV2Command({
      Bucket: config.bucketName,
      Prefix: prefix,
      MaxKeys: maxItems,
    });

    const result: SimplCMSMedia[] = [];
    let isTruncated = true;
    let continuationToken: string | undefined;

    // Handle pagination if there are more objects than maxItems
    while (isTruncated && result.length < maxItems) {
      const listResult = await s3Client.send(
        new ListObjectsV2Command({
          Bucket: config.bucketName,
          Prefix: prefix,
          MaxKeys: maxItems - result.length,
          ContinuationToken: continuationToken,
        })
      );

      // Process the contents
      if (listResult.Contents) {
        for (const item of listResult.Contents) {
          if (item.Key) {
            // Skip folder objects (keys ending with /)
            if (item.Key.endsWith("/") && item.Size === 0) {
              continue;
            }

            // Extract filename from key
            const fileName = item.Key.split("/").pop() || item.Key;

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

            // Create the URL for the S3 object
            const url = `https://${config.bucketName}.s3.${
              config.region
            }.amazonaws.com/${encodeURIComponent(item.Key)}`;

            // Create a SimplCMSMedia object
            result.push({
              id: item.Key,
              name: fileName,
              url: url,
              type: isVideo ? "video" : "image",
              source: "AWS S3",
            });
          }
        }
      }

      // Check if there are more objects to fetch
      isTruncated = listResult.IsTruncated || false;
      continuationToken = listResult.NextContinuationToken;

      // Stop if we've reached the maximum number of items
      if (result.length >= maxItems) {
        break;
      }
    }

    return result;
  } catch (error: any) {
    console.error("Error fetching media from S3:", error);
    throw error;
  }
}

export async function uploadFiles(
  config: AWSS3Config,
  files: Blob[]
): Promise<{ key: string; url: string }[]> {
  try {
    // Validate config
    if (!config.region) throw new Error("Config is missing region");
    if (!config.accessKeyId) throw new Error("Config is missing access key id");
    if (!config.accessSecretKey)
      throw new Error("Config is missing secret access key");
    if (!config.bucketName) throw new Error("Config is missing bucket name");

    // Create an S3 client
    const s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.accessSecretKey,
      },
    });

    // Create upload promises for each file
    const uploadPromises = files.map(async (blob, index) => {
      // Generate a unique file name
      const fileName = `file-${uuidv4()}`;

      // Create key path
      const key = fileName;

      // Convert blob to array buffer for upload
      const arrayBuffer = await blob.arrayBuffer();

      // Detect content type or use default
      const contentType = blob.type || "application/octet-stream";

      // Make sure bucket name is a string
      if (typeof config.bucketName !== "string") {
        throw new Error("Bucket name must be a string");
      }

      // Create the upload command
      const uploadCommand = new PutObjectCommand({
        Bucket: config.bucketName,
        Key: key,
        Body: Buffer.from(arrayBuffer),
        ContentType: contentType,
      });

      // Execute the upload
      await s3Client.send(uploadCommand);

      // Return the key and generated URL
      return {
        key,
        url: `https://${config.bucketName}.s3.${
          config.region
        }.amazonaws.com/${encodeURIComponent(key)}`,
      };
    });

    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);

    return results;
  } catch (error: any) {
    console.error("Error uploading files to S3:", error);
    throw error;
  }
}

export async function deleteS3Media(
  media: SimplCMSMedia,
  mediaStorageConfiguration: SimplCMSMediaStorageConfiguration
): Promise<void> {
  // Find S3 configuration in the media storage configuration
  if (!Array.isArray(mediaStorageConfiguration)) {
    throw new Error("Invalid media storage configuration");
  }

  const s3ConfigEntry = mediaStorageConfiguration.find(
    (config) => config.provider === "AWS S3"
  );

  if (!s3ConfigEntry || !s3ConfigEntry.s3) {
    throw new Error("AWS S3 configuration not found");
  }

  const s3Config = s3ConfigEntry.s3;

  // Validate S3 configuration
  if (!s3Config.region) throw new Error("S3 config is missing region");
  if (!s3Config.accessKeyId)
    throw new Error("S3 config is missing access key id");
  if (!s3Config.accessSecretKey)
    throw new Error("S3 config is missing secret access key");
  if (!s3Config.bucketName) throw new Error("S3 config is missing bucket name");

  // Create an S3 client
  const s3Client = new S3Client({
    region: s3Config.region,
    credentials: {
      accessKeyId: s3Config.accessKeyId,
      secretAccessKey: s3Config.accessSecretKey,
    },
  });

  // Extract the key from the media object
  // The id field is the full key in S3
  const key = media.id;

  // Create delete command
  const deleteCommand = new DeleteObjectCommand({
    Bucket: s3Config.bucketName,
    Key: key,
  });

  // Execute the delete command
  await s3Client.send(deleteCommand);
}

export * as s3 from ".";
