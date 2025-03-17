"use server";
import SetupGoogleOauthForm from "../../../../client/components/setupGoogleForm";

export default async function SetupGoogleOauthPage() {
  const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.NEXT_PUBLIC_SITE_URL ?? null;
  if (!siteUrl) throw new Error("Could not get site url");
  return (
    <div className="size-full flex justify-center items-center text-foreground">
      <SetupGoogleOauthForm siteUrl={siteUrl} />
    </div>
  );
}
