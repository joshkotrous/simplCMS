import SetupForm from "@/app/components/setupForm";
import { getServerEnvVars } from "@/core/platform";

export default async function SetupPage() {
  const platformConfiguration = getServerEnvVars();
  return (
    <div className="size-full flex justify-center items-center">
      <SetupForm serverConfiguration={platformConfiguration} />
    </div>
  );
}
