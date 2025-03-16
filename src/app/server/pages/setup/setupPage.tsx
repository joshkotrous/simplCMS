"use server";
import SetupForm from "@/app/client/components/setupForm";
import { getServerEnvVars } from "@/core/platform";

export default async function SetupPage() {
  const platformConfiguration = getServerEnvVars();
  return (
    <div className="size-full flex justify-center items-center">
      <SetupForm serverConfiguration={platformConfiguration} />
    </div>
  );
}
