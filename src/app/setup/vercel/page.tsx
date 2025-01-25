import { GetProjectsResponseBody } from "@vercel/sdk/models/getprojectsop.js";
import SetupVercelForm from "./setupVercelForm";
import { connect, getProjects } from "@/packages/core/src/vercel";
import { redirect } from "next/navigation";

export default async function SetupVercelPage() {
  let projects: GetProjectsResponseBody | null = null;
  if (
    process.env.VERCEL_PROJECT_ID &&
    process.env.SIMPLCMS_HOST_PROVIDER === "vercel" &&
    process.env.VERCEL_TOKEN &&
    process.env.VERCEL_TEAM_ID &&
    process.env.NEXT_PUBLIC_SITE_URL
  ) {
    redirect("/setup/database");
  }
  if (
    process.env.SIMPLCMS_HOST_PROVIDER === "vercel" &&
    process.env.VERCEL_TOKEN &&
    process.env.VERCEL_TEAM_ID &&
    !process.env.VERCEL_PROJECT_ID
  ) {
    const vercel = connect(process.env.VERCEL_TOKEN);
    projects = await getProjects(vercel, process.env.VERCEL_TEAM_ID);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? null;

  return (
    <div className="size-full flex justify-center items-center">
      <SetupVercelForm initialSiteUrl={siteUrl} initialProjects={projects} />
    </div>
  );
}
