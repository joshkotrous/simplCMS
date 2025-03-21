"use server";
import SetupGoogleOauthForm from "../../../../client/components/setupGoogleForm";

export default async function SetupGoogleOauthPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : null;
  if (!siteUrl) throw new Error("Could not get site url");
  return (
    <div className="size-full flex justify-center items-center text-simplcms-foreground">
      <SetupGoogleOauthForm siteUrl={siteUrl} />
    </div>
  );
}
