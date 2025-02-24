import { getServerEnvVars } from "@/packages/core/src/simplCms";
import SetupCloudinaryForm from "./setupCloudinaryForm";

export default async function SetupCloudinaryPage() {
  const platformConfiguration = getServerEnvVars();
  return (
    <div className="size-full flex justify-center items-center text-foreground">
      <SetupCloudinaryForm platformConfiguration={platformConfiguration} />
    </div>
  );
}
