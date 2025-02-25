import { getServerEnvVars } from "@/packages/core/src/simplCms";
import SetupS3Form from "./setupS3Form";
export default async function SetupS3Page() {
  const platformConfiguration = getServerEnvVars();
  return (
    <div className="size-full flex justify-center items-center text-foreground">
      <SetupS3Form platformConfiguration={platformConfiguration} />
    </div>
  );
}
