"use server";

import { getVercelEnvVars, vercel } from "@/packages/core/src/vercel";

export async function connectDbToApplication(provider: "MongoDB", uri: string) {
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
  } catch (error) {
    console.error(error);
    throw error;
  }
}
