"use server";
import SetupCloudinaryForm from "@/app/client/components/setupCloudinaryForm";
import { getServerEnvVars } from "@/core/platform";

export default async function SetupCloudinaryPage() {
  const platformConfiguration = getServerEnvVars();
  return (
    <div className="size-full flex justify-center items-center text-foreground">
      <SetupCloudinaryForm platformConfiguration={platformConfiguration} />
    </div>
  );
}
