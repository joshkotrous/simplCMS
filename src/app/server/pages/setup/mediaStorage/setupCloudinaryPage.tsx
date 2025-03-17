"use server";
import SetupCloudinaryForm from "../../../../client/components/setupCloudinaryForm";
import { simplcms } from "../../../../../core";
export default async function SetupCloudinaryPage() {
  const platformConfiguration = simplcms.platform.getPlatformConfiguration();
  return (
    <div className="size-full flex justify-center items-center text-foreground">
      <SetupCloudinaryForm platformConfiguration={platformConfiguration} />
    </div>
  );
}
