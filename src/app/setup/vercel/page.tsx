import SetupVercelForm from "./setupVercelForm";
import { getServerEnvVars } from "@/packages/core/src/simplCms";

export default async function SetupVercelPage() {
  const siteUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
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
