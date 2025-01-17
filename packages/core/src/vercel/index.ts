import { getEnvironment } from "@/lib/utils";
import { Vercel } from "@vercel/sdk";
import { GetProjectsResponseBody } from "@vercel/sdk/models/getprojectsop.js";
import { dev } from "../dev";

export function connect(apiKey: string): Vercel {
  try {
    const _vercel = new Vercel({ bearerToken: apiKey });
    return _vercel;
  } catch (error) {
    console.error(`Could not initialize Vercel client: ${error}`);
    throw error;
  }
}

export async function getProjects(
  vercel: Vercel,
  teamId: string
): Promise<GetProjectsResponseBody> {
  try {
    const projects = await vercel.projects.getProjects({ teamId: teamId });
    return projects;
  } catch (error) {
    console.error(`Could not get vercel projects ${error}`);
    throw error;
  }
}

export async function addEnvToProject({
  vercel,
  projectId,
  key,
  value,
  teamId,
  type = "plain",
  target = ["development", "preview", "production"],
}: {
  vercel: Vercel;
  projectId: string;
  key: string;
  value: string;
  teamId: string;
  type: "system" | "encrypted" | "plain" | "sensitive" | "secret";
  target: ("production" | "preview" | "development")[];
}) {
  try {
    const env = getEnvironment();
    if (env === "prod") {
      await vercel.projects.createProjectEnv({
        idOrName: projectId,
        teamId: teamId,
        requestBody: {
          key: key,
          value: value,
          type: type,
          target: target,
        },
      });
    } else {
      console.warn("Dev mode enabled. Setting local env var.");
      dev.setLocalEnvVar(key, value);
    }
  } catch (error) {
    console.error(`Could not add environment variable to project: ${error}`);
    throw error;
  }
}

export function getVercelToken() {
  if (!process.env.VERCEL_TOKEN)
    throw new Error("VERCEL_TOKEN not configured.");
  return process.env.VERCEL_TOKEN;
}

export function getVercelEnvVars() {
  const token = getVercelToken();
  if (!process.env.VERCEL_TEAM_ID)
    throw new Error("VERCEL_TEAM_ID is not configured.");
  if (!process.env.VERCEL_PROJECT_ID)
    throw new Error("VERCEL_PROJECT_ID is not configured.");
  const teamId = process.env.VERCEL_TEAM_ID;
  const projectId = process.env.VERCEL_PROJECT_ID;
  return { token, teamId, projectId };
}

export * as vercel from ".";
