"use server";

import { getVercelEnvVars, vercel } from "@/packages/core/src/vercel";
import { generateSecret } from "@/lib/utils";

export async function connectDbToApplication(
  provider: "MongoDB",
  uri: string
): Promise<void> {
  try {
    const { token, teamId, projectId } = getVercelEnvVars();
    const client = vercel.connect(token);
    vercel.addEnvToProject({
      vercel: client,
      key: "MONGO_URI",
      value: uri,
      projectId: projectId,
      teamId: teamId,
      type: "encrypted",
      target: ["production"],
    });
    vercel.addEnvToProject({
      vercel: client,
      key: "SIMPLCMS_DB_PROVIDER",
      value: provider,
      projectId: projectId,
      teamId: teamId,
      type: "encrypted",
      target: ["production"],
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function setupGoogleOauth(
  clientId: string,
  clientSecret: string,
  siteUrl: string
): Promise<void> {
  try {
    const { token, teamId, projectId } = getVercelEnvVars();
    const client = vercel.connect(token);
    const nextAuthSecret = generateSecret();
    vercel.addEnvToProject({
      vercel: client,
      key: "GOOGLE_OAUTH_CLIENT_ID",
      value: clientId,
      projectId: projectId,
      teamId: teamId,
      type: "encrypted",
      target: ["production"],
    });
    vercel.addEnvToProject({
      vercel: client,
      key: "GOOGLE_OAUTH_CLIENT_SECRET",
      value: clientSecret,
      projectId: projectId,
      teamId: teamId,
      type: "encrypted",
      target: ["production"],
    });
    vercel.addEnvToProject({
      vercel: client,
      key: "SIMPL_CMS_OAUTH_PROVIDERS",
      value: "Google",
      projectId: projectId,
      teamId: teamId,
      type: "plain",
      target: ["production"],
    });
    vercel.addEnvToProject({
      vercel: client,
      key: "NEXTAUTH_URL",
      value: siteUrl,
      projectId: projectId,
      teamId: teamId,
      type: "plain",
      target: ["production"],
    });
    vercel.addEnvToProject({
      vercel: client,
      key: "NEXTAUTH_SECRET",
      value: nextAuthSecret,
      projectId: projectId,
      teamId: teamId,
      type: "plain",
      target: ["production"],
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function connectMediaStorageToApplication(
  provider: "Cloudinary",
  url: string
) {
  try {
    const { token, teamId, projectId } = getVercelEnvVars();
    const client = vercel.connect(token);

    vercel.addEnvToProject({
      vercel: client,
      key: "SIMPLCMS_MEDIA_STORAGE_PROVIDERS",
      value: provider,
      projectId: projectId,
      teamId: teamId,
      type: "plain",
      target: ["production"],
    });
    vercel.addEnvToProject({
      vercel: client,
      key: "CLOUDINARY_URL",
      value: url,
      projectId: projectId,
      teamId: teamId,
      type: "plain",
      target: ["production"],
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
