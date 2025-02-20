"use server";

import { getVercelEnvVars, vercel } from "@/packages/core/src/vercel";
import { generateSecret } from "@/lib/utils";
import { MediaStorageProvider } from "@/types/types";

export async function connectDbToApplication(
  vercelToken: string,
  vercelTeamId: string,
  vercelProjectId: string,
  provider: "MongoDB",
  uri: string
): Promise<void> {
  try {
    const client = vercel.connect(vercelToken);
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
      key: "SIMPL_CMS_OAUTH_PROVIDERS",
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
  url: string
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
    vercel.addEnvToProject({
      vercel: client,
      key: "CLOUDINARY_URL",
      value: url,
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
