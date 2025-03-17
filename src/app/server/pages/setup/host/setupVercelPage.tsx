"use server";
import SetupVercelForm from "../../../../client/components/setupVercelForm";
import { simplcms } from "../../../../../core";
export default async function SetupVercelPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : null;
  const platformConfiguration = simplcms.platform.getPlatformConfiguration();
  return (
    <div className="size-full flex justify-center items-center">
      <SetupVercelForm
        platformConfiguration={platformConfiguration}
        initialSiteUrl={siteUrl}
      />
    </div>
  );
}
