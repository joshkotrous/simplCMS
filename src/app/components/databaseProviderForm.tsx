"use client";

import {
  DynamoDBLogo,
  MongoDBLogo,
  SupabaseLogo,
} from "@/app/components/logos";
import { Card, CardContent } from "@/app/components/ui/card";
import Link from "next/link";
import { useSetupData } from "../../../components/setupContextProvider";

export default function DatabaseProviderForm() {
  const { setSetupData } = useSetupData();
  return (
    <div>
      <p>Select a Database Provider</p>
      <div className="grid grid-cols-3 gap-4">
        <Link
          onClick={() =>
            setSetupData((prev) => ({
              ...prev,
              database: { provider: "MongoDB" },
            }))
          }
          href="/setup/mongo"
        >
          <Card className="size-full p-12 flex items-center justify-center cursor-pointer hover:scale-[99%]">
            <CardContent className="p-0 ">
              <MongoDBLogo />
            </CardContent>
          </Card>
        </Link>

        <Card className="size-full p-12 flex items-center justify-center hover:scale-[99%] cursor-pointer bg-zinc-200">
          <CardContent className="p-0">
            <DynamoDBLogo />
          </CardContent>
        </Card>
        <Card className="size-full p-12 flex items-center justify-center hover:scale-[99%] cursor-pointer bg-zinc-200">
          <CardContent className="p-0">
            <SupabaseLogo />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
