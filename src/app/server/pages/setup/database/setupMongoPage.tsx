"use server";
import SetupMongoForm from "../../../../client/components/setupMongoDBForm";
import { simplcms } from "../../../../../core";

export default async function SetupMongoPage() {
  const platformConfiguration = simplcms.platform.getPlatformConfiguration();
  return (
    <div className="size-full flex justify-center items-center text-simplcms-foreground">
      <SetupMongoForm platformConfiguration={platformConfiguration} />
    </div>
  );
}
