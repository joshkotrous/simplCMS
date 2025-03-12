import { getServerEnvVars } from "@/packages/core/src/simplCms";
import SetupForm from "../setupForm";

export default async function SetupPage() {
  const platformConfiguration = getServerEnvVars();
  return (
    <div className="size-full flex justify-center items-center">
      <SetupForm serverConfiguration={platformConfiguration} />
    </div>
  );
}
