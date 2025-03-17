"use server";

import { simplcms } from "../../../../core";

import { CreateDeploymentResponseBody } from "@vercel/sdk/models/createdeploymentop.js";
import { GetDeploymentResponseBody } from "@vercel/sdk/models/getdeploymentop.js";
import { Deployments } from "@vercel/sdk/models/getdeploymentsop.js";
import {
  GetProjectsProjects,
  GetProjectsResponseBody,
} from "@vercel/sdk/models/getprojectsop.js";
import { GetTeamsResponseBody } from "@vercel/sdk/models/getteamsop.js";

export async function getProjectsAction(
  apiKey: string,
  teamId: string
): Promise<GetProjectsResponseBody> {
  try {
    const vercel = simplcms.providers.vercel.connect(apiKey);
    const projects = await simplcms.providers.vercel.getProjects(
      vercel,
      teamId
    );
    return projects;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function addEnvVar(
  apiKey: string,
  projectId: string,
  teamId: string,
  params: {
    key: string;
    value: string;
    type: "system" | "encrypted" | "plain" | "sensitive" | "secret";
    target: ("production" | "preview" | "development")[];
  }
) {
  try {
    const vercel = simplcms.providers.vercel.connect(apiKey);
    await simplcms.providers.vercel.addEnvToProject({
      vercel,
      projectId: projectId,
      key: params.key,
      value: params.value,
      teamId: teamId,
      type: params.type,
      target: params.target,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function connectProject(
  projectId: string,
  teamId: string,
  apiKey: string
): Promise<void> {
  try {
    const vercel = simplcms.providers.vercel.connect(apiKey);
    await simplcms.providers.vercel.addEnvToProject({
      vercel,
      projectId: projectId,
      key: "VERCEL_TOKEN",
      value: apiKey,
      teamId: teamId,
      type: "encrypted",
      target: ["production"],
    });
    await simplcms.providers.vercel.addEnvToProject({
      vercel,
      projectId: projectId,
      key: "VERCEL_TEAM_ID",
      value: teamId,
      teamId: teamId,
      type: "plain",
      target: ["production"],
    });

    await simplcms.providers.vercel.addEnvToProject({
      vercel,
      projectId: projectId,
      key: "VERCEL_PROJECT_ID",
      value: projectId,
      teamId: teamId,
      type: "plain",
      target: ["production"],
    });
    await simplcms.providers.vercel.addEnvToProject({
      vercel,
      projectId: projectId,
      key: "SIMPLCMS_HOST_PROVIDER",
      value: "Vercel",
      teamId: teamId,
      type: "plain",
      target: ["production"],
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTeams(apiKey: string): Promise<GetTeamsResponseBody> {
  try {
    const vercel = simplcms.providers.vercel.connect(apiKey);
    const teams = simplcms.providers.vercel.getUserTeams(vercel);
    return teams;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getLatestDeploymentAction(
  vercelToken: string,
  projectId: string,
  teamId: string
): Promise<Deployments | null> {
  try {
    const vercel = simplcms.providers.vercel.connect(vercelToken);
    const deployment = await simplcms.providers.vercel.getLatestDeployment({
      vercel,
      projectId,
      teamId,
    });
    return deployment;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function triggerRedeployAction(
  deploymentId: string,
  vercelToken?: string,
  projectId?: string,
  teamId?: string
): Promise<CreateDeploymentResponseBody> {
  try {
    const platformConfiguration = simplcms.platform.getPlatformConfiguration();
    if (!vercelToken) {
      if (!platformConfiguration.host?.vercel?.token)
        throw new Error("Vercel token is not configured");
      vercelToken = platformConfiguration.host?.vercel?.token;
    }
    if (!projectId) {
      if (!platformConfiguration.host?.vercel?.projectId)
        throw new Error("Project id is not configured");
      projectId = platformConfiguration.host?.vercel?.projectId;
    }
    if (!teamId) {
      if (!platformConfiguration.host?.vercel?.teamId)
        throw new Error("Team id is not configured");
      teamId = platformConfiguration.host?.vercel?.teamId;
    }
    const vercel = simplcms.providers.vercel.connect(vercelToken);
    const deployment = await simplcms.providers.vercel.triggerRedeploy({
      vercel,
      projectId,
      teamId,
      deploymentId,
    });
    return deployment;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getDeploymentAction(
  deploymentId: string,
  vercelToken?: string,
  teamId?: string
): Promise<GetDeploymentResponseBody> {
  try {
    const platformConfiguration = simplcms.platform.getPlatformConfiguration();
    if (!vercelToken) {
      if (!platformConfiguration.host?.vercel?.token)
        throw new Error("Vercel token is not configured");
      vercelToken = platformConfiguration.host?.vercel?.token;
    }
    if (!teamId) {
      if (!platformConfiguration.host?.vercel?.teamId)
        throw new Error("Team id is not configured");
      teamId = platformConfiguration.host?.vercel?.teamId;
    }
    const vercel = simplcms.providers.vercel.connect(vercelToken);
    const deployment = await simplcms.providers.vercel.getDeploymentById({
      vercel,
      deploymentId,
      teamId,
    });
    return deployment;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
