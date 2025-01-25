import { GetProjectsResponseBody } from "@vercel/sdk/models/getprojectsop.js";
import SetupVercelForm from "./setupVercelForm";
import { connect, getProjects } from "@/packages/core/src/vercel";
import { redirect } from "next/navigation";

export default async function SetupVercelPage() {
  const siteUrl =
    process.env.VERCEL_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? null;

  return (
    <div className="size-full flex justify-center items-center">
      <SetupVercelForm initialSiteUrl={siteUrl} />
    </div>
  );
}
