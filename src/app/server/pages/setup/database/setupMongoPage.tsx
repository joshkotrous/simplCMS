"use server";
import SetupMongoForm from "@/app/client/components/setupMongoDBForm";
import { simplcms } from "@/core";

export default async function SetupMongoPage() {
  const platformConfiguration = simplcms.platform.getPlatformConfiguration();
  return (
    <div className="size-full flex justify-center items-center text-foreground">
      <SetupMongoForm platformConfiguration={platformConfiguration} />
    </div>
  );
}
