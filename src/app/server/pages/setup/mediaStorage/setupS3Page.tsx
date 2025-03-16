"use server";
import SetupS3Form from "@/app/client/components/setupS3Form";
import { getServerEnvVars } from "@/core/platform";

export default async function SetupS3Page() {
  const platformConfiguration = getServerEnvVars();
  return (
    <div className="size-full flex justify-center items-center text-foreground">
      <SetupS3Form platformConfiguration={platformConfiguration} />
    </div>
  );
}
