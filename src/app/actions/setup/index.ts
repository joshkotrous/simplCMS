"use server";

import { getVercelEnvVars, vercel } from "@/packages/core/src/vercel";
import { defaultHomePageConfig, generateSecret } from "@/lib/utils";
import {
  AWSS3Config,
  createPageSchema,
  MediaStorageProvider,
} from "@/types/types";
import { simplCms } from "@/packages/core/src/simplCms";

export async function connectDbToApplication(
  vercelToken: string,
  vercelTeamId: string,
  vercelProjectId: string,
  provider: "MongoDB" | "DynamoDB",
  uri: string
): Promise<void> {
  try {
    const client = vercel.connect(vercelToken);
    try {
      vercel.addEnvToProject({
        vercel: client,
        key: "MONGO_URI",
        value: uri,
        projectId: vercelProjectId,
        teamId: vercelTeamId,
        type: "encrypted",
        target: ["production"],
      });
      vercel.addEnvToProject({
        vercel: client,
        key: "SIMPLCMS_DB_PROVIDER",
        value: provider,
        projectId: vercelProjectId,
        teamId: vercelTeamId,
        type: "encrypted",
        target: ["production"],
      });
    } catch (error) {
      console.error("Could not add vercel env vars");
    }

    const pageConfig = createPageSchema.parse(defaultHomePageConfig);
    await simplCms.pages.createPage(pageConfig);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function setupGoogleOauth(
  vercelToken: string,
  vercelTeamId: string,
  vercelProjectId: string,
  clientId: string,
  clientSecret: string,
  siteUrl: string
): Promise<void> {
  try {
    const client = vercel.connect(vercelToken);
    const nextAuthSecret = generateSecret();
    vercel.addEnvToProject({
      vercel: client,
      key: "GOOGLE_OAUTH_CLIENT_ID",
      value: clientId,
      projectId: vercelProjectId,
      teamId: vercelTeamId,
      type: "encrypted",
      target: ["production"],
    });
    vercel.addEnvToProject({
      vercel: client,
      key: "GOOGLE_OAUTH_CLIENT_SECRET",
      value: clientSecret,
      projectId: vercelProjectId,
      teamId: vercelTeamId,
      type: "encrypted",
      target: ["production"],
    });
    vercel.addEnvToProject({
      vercel: client,
      key: "SIMPLCMS_OAUTH_PROVIDERS",
      value: "Google",
      projectId: vercelProjectId,
      teamId: vercelTeamId,
      type: "plain",
      target: ["production"],
    });
    vercel.addEnvToProject({
      vercel: client,
      key: "NEXTAUTH_URL",
      value: siteUrl,
      projectId: vercelProjectId,
      teamId: vercelTeamId,
      type: "plain",
      target: ["production"],
    });
    vercel.addEnvToProject({
      vercel: client,
      key: "NEXTAUTH_SECRET",
      value: nextAuthSecret,
      projectId: vercelProjectId,
      teamId: vercelTeamId,
      type: "plain",
      target: ["production"],
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function connectMediaStorageToApplication(
  vercelToken: string,
  vercelProjectId: string,
  vercelTeamId: string,
  provider: MediaStorageProvider,
  config: {
    cloudinary?: {
      url: string;
    };
    s3?: AWSS3Config;
  }
) {
  try {
    const client = vercel.connect(vercelToken);
    vercel.addEnvToProject({
      vercel: client,
      key: "SIMPLCMS_MEDIA_STORAGE_PROVIDERS",
      value: provider,
      projectId: vercelProjectId,
      teamId: vercelTeamId,
      type: "plain",
      target: ["production"],
    });
    switch (provider) {
      case "Cloudinary":
        if (!config.cloudinary?.url)
          throw new Error("Cloudinary url not provided");

        vercel.addEnvToProject({
          vercel: client,
          key: "CLOUDINARY_URL",
          value: config.cloudinary?.url,
          projectId: vercelProjectId,
          teamId: vercelTeamId,
          type: "plain",
          target: ["production"],
        });
        break;

      case "AWS S3":
        if (!config.s3?.region)
          throw new Error("Config is missing bucket region");
        if (!config.s3?.accessKeyId)
          throw new Error("Config is missing access key id");
        if (!config.s3?.accessSecretKey)
          throw new Error("Config is missing access key secret");

        if (!config.s3?.bucketName)
          throw new Error("Config is missing bucket name");

        vercel.addEnvToProject({
          vercel: client,
          key: "AWS_S3_BUCKET_REGION",
          value: config.s3?.region,
          projectId: vercelProjectId,
          teamId: vercelTeamId,
          type: "plain",
          target: ["production"],
        });
        vercel.addEnvToProject({
          vercel: client,
          key: "AWS_S3_BUCKET_NAME",
          value: config.s3?.bucketName,
          projectId: vercelProjectId,
          teamId: vercelTeamId,
          type: "plain",
          target: ["production"],
        });
        vercel.addEnvToProject({
          vercel: client,
          key: "AWS_S3_ACCESS_KEY_ID",
          value: config.s3?.accessKeyId,
          projectId: vercelProjectId,
          teamId: vercelTeamId,
          type: "plain",
          target: ["production"],
        });
        vercel.addEnvToProject({
          vercel: client,
          key: "AWS_S3_ACCESS_KEY_SECRET",
          value: config.s3?.accessSecretKey,
          projectId: vercelProjectId,
          teamId: vercelTeamId,
          type: "plain",
          target: ["production"],
        });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
