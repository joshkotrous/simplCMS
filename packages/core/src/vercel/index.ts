import { getEnvironment } from "@/lib/utils";
import { Vercel } from "@vercel/sdk";
import { GetProjectsResponseBody } from "@vercel/sdk/models/getprojectsop.js";
import { dev } from "../dev";
import { GetTeamsResponseBody } from "@vercel/sdk/models/getteamsop.js";
import {
  CreateDeploymentResponseBody,
  Target,
} from "@vercel/sdk/models/createdeploymentop.js";
import { Deployments } from "@vercel/sdk/models/getdeploymentsop.js";

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

export async function getUserTeams(
  vercel: Vercel
): Promise<GetTeamsResponseBody> {
  try {
    const teams = await vercel.teams.getTeams({});
    return teams;
  } catch (error) {
    console.log(`Could not get teams from vercel ${error}`);
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

export async function triggerDeployment({
  vercel,
  projectId,
  teamId,
  name = "Production Deployment",
  target = "production",
}: {
  vercel: Vercel;
  projectId: string;
  teamId: string;
  name?: string;
  target?: "production" | "preview" | "staging";
}): Promise<CreateDeploymentResponseBody> {
  try {
    const deployment = await vercel.deployments.createDeployment({
      teamId,
      requestBody: {
        name,
        project: projectId,
        target: target as Target,
        withLatestCommit: true,
      },
    });
    return deployment;
  } catch (error) {
    console.error(`Could not trigger deployment: ${error}`);
    throw error;
  }
}

export async function triggerRedeploy({
  vercel,
  projectId,
  teamId,
  deploymentId,
  name = "Production Deployment",
  target = "production",
}: {
  vercel: Vercel;
  projectId: string;
  teamId: string;
  deploymentId?: string;
  name?: string;
  target?: "production" | "preview" | "staging";
}): Promise<CreateDeploymentResponseBody> {
  try {
    const deployment = await vercel.deployments.createDeployment({
      teamId,
      requestBody: {
        name,
        project: projectId,
        target: target as Target,
        deploymentId,
        withLatestCommit: !deploymentId,
      },
    });
    return deployment;
  } catch (error) {
    console.error(`Could not trigger deployment: ${error}`);
    throw error;
  }
}

export async function getLatestDeployment({
  vercel,
  projectId,
  teamId,
}: {
  vercel: Vercel;
  projectId: string;
  teamId: string;
}): Promise<Deployments | null> {
  try {
    const deployments = await vercel.deployments.getDeployments({
      teamId,
      projectId,
      target: "production",
      limit: 1,
      from: Date.now(),
    });

    if (!deployments?.deployments?.[0]) {
      return null;
    }

    return deployments.deployments[0];
  } catch (error) {
    console.error(`Could not get latest deployment: ${error}`);
    throw error;
  }
}

export async function getRunningDeployments({
  vercel,
  projectId,
  teamId,
}: {
  vercel: Vercel;
  projectId: string;
  teamId: string;
}) {
  try {
    const deployments = await vercel.deployments.getDeployments({
      teamId,
      projectId,
      state: "BUILDING",
    });

    return deployments.deployments || [];
  } catch (error) {
    console.error(`Could not get running deployments: ${error}`);
    throw error;
  }
}

export async function getDeploymentById({
  vercel,
  deploymentId,
  teamId,
}: {
  vercel: Vercel;
  deploymentId: string;
  teamId: string;
}) {
  try {
    const deployment = await vercel.deployments.getDeployment({
      teamId,
      idOrUrl: deploymentId,
    });
    return deployment;
  } catch (error) {
    console.error(`Could not get deployment ${deploymentId}: ${error}`);
    throw error;
  }
}

export * as vercel from ".";
