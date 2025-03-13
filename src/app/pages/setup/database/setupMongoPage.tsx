import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import SetupMongoForm from "./setupMongoDBForm";
import { getServerEnvVars } from "@/index";

export default async function SetupMongo() {
  const platformConfiguration = getServerEnvVars();
  return (
    <div className="size-full flex justify-center items-center text-foreground">
      <SetupMongoForm platformConfiguration={platformConfiguration} />
    </div>
  );
}
