"use server";

import {
  addEnvToProject,
  connect,
  getProjects,
} from "@/packages/core/src/vercel";
import {
  GetProjectsProjects,
  GetProjectsResponseBody,
} from "@vercel/sdk/models/getprojectsop.js";

export async function getProjectsAction(
  apiKey: string,
  teamId: string
): Promise<GetProjectsResponseBody> {
  try {
    const vercel = connect(apiKey);
    const projects = await getProjects(vercel, teamId);
    return projects;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function connectProject(
  project: GetProjectsProjects,
  apiKey: string
): Promise<void> {
  try {
    const vercel = connect(apiKey);
    await addEnvToProject({
      vercel,
      projectId: project.id,
      key: "VERCEL_TOKEN",
      value: apiKey,
      teamId: project.accountId,
      type: "encrypted",
      target: ["production"],
    });
    await addEnvToProject({
      vercel,
      projectId: project.id,
      key: "VERCEL_TEAM_ID",
      value: project.accountId,
      teamId: project.accountId,
      type: "plain",
      target: ["production"],
    });

    await addEnvToProject({
      vercel,
      projectId: project.id,
      key: "VERCEL_PROJECT_ID",
      value: project.id,
      teamId: project.accountId,
      type: "plain",
      target: ["production"],
    });
    await addEnvToProject({
      vercel,
      projectId: project.id,
      key: "SIMPLCMS_HOST_PROVIDER",
      value: "vercel",
      teamId: project.accountId,
      type: "plain",
      target: ["production"],
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export * as vercelActions from ".";
