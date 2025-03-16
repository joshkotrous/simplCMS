"use server";
import SetupMongoForm from "@/app/client/components/setupMongoDBForm";
import { Button } from "@/app/client/components/ui/button";
import { getServerEnvVars } from "@/core/platform";
import Link from "next/link";

export default async function SetupMongo() {
  const platformConfiguration = getServerEnvVars();
  return (
    <div className="size-full flex justify-center items-center text-foreground">
      <SetupMongoForm platformConfiguration={platformConfiguration} />
    </div>
  );
}
