import { Button } from "@/components/ui/button";
import Link from "next/link";
import SetupMongoForm from "./setupMongoDBForm";

export default async function SetupMongo() {
  if (!process.env.SIMPLCMS_HOST_PROVIDER) {
    return (
      <div className="size-full flex flex-col justify-center items-center gap-4 text-foreground">
        <h2 className="font-semibold">
          You must setup a host provider before connecting to a database.
        </h2>
        <Link href="/setup">
          <Button>Setup Host Provider</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="size-full flex justify-center items-center text-foreground">
      <SetupMongoForm />
    </div>
  );
}
