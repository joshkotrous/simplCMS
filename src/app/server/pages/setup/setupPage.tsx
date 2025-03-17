"use server";
import SetupForm from "../../../client/components/setupForm";
import { simplcms } from "../../../../core";

export default async function SetupPage() {
  const platformConfiguration = simplcms.platform.getPlatformConfiguration();
  return (
    <div className="size-full flex justify-center items-center">
      <SetupForm serverConfiguration={platformConfiguration} />
    </div>
  );
}
