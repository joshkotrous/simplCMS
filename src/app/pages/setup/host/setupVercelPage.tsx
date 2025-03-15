import SetupVercelForm from "@/app/components/setupVercelForm";
import { getServerEnvVars } from "@/core/platform";

export default async function SetupVercelPage() {
  const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.NEXT_PUBLIC_SITE_URL ?? null;
  const platformConfiguration = getServerEnvVars();
  return (
    <div className="size-full flex justify-center items-center">
      <SetupVercelForm
        platformConfiguration={platformConfiguration}
        initialSiteUrl={siteUrl}
      />
    </div>
  );
}
