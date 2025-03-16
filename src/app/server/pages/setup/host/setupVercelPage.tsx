"use server";
import SetupVercelForm from "@/app/client/components/setupVercelForm";
import { simplcms } from "@/core";
export default async function SetupVercelPage() {
  const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.NEXT_PUBLIC_SITE_URL ?? null;
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
