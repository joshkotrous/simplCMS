"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MongoDBLogo } from "@/components/logos";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { testConnection } from "@/app/actions/mongo";
import { connectDbToApplication } from "@/app/actions/setup";
import { useRouter } from "next/navigation";
import { useSetupData } from "../setupContextProvider";
import { SimplCMSPlatformConfiguration } from "@/types/types";

export default function SetupMongoForm({
  platformConfiguration,
}: {
  platformConfiguration: SimplCMSPlatformConfiguration;
}) {
  const router = useRouter();
  const { setupData, setSetupData } = useSetupData();
  const [testSuccessful, setTestSuccessful] = useState(false);
  async function testDBConnection() {
    if (!setupData.database?.mongo?.uri)
      throw new Error("Mongo uri is not configured");
    toast.promise(testConnection(setupData.database?.mongo?.uri), {
      loading: "Testing connection...",
      success: () => {
        setTestSuccessful(true);
        return "Database connection successful.";
      },
      error: () => {
        return "Error connecting to database.";
      },
    });
  }

  async function connectDB() {
    if (
      !platformConfiguration.host?.vercel?.token &&
      !setupData.host?.vercel?.token
    )
      throw new Error("Missing vercel token");
    if (
      !platformConfiguration.host?.vercel?.projectId &&
      !setupData.host?.vercel?.projectId
    )
      throw new Error("No vercel project configured");
    if (
      !platformConfiguration.host?.vercel?.teamId &&
      !setupData.host?.vercel?.teamId
    )
      throw new Error("No vercel team configured");
    if (!setupData.database?.mongo?.uri)
      throw new Error("Mongo uri is not configured");
    if (!setupData.database.provider)
      throw new Error("Database provider not configured");
    toast.promise(
      connectDbToApplication(
        platformConfiguration.host?.vercel?.token! ??
          setupData.host?.vercel?.token,
        platformConfiguration.host?.vercel?.teamId! ??
          setupData.host?.vercel?.teamId,
        platformConfiguration.host?.vercel?.projectId! ??
          setupData.host?.vercel?.projectId,
        setupData.database.provider,
        setupData.database?.mongo?.uri
      ),
      {
        loading: "Connecting database to SimplCMS...",
        success: () => {
          router.push("/");
          return "Database connected successfully.";
        },
        error: () => {
          return "Error connecting database.";
        },
      }
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex w-full justify-center">
          <MongoDBLogo />
        </div>
        Connect your MongoDB to SimplCMS
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          value={setupData.database?.mongo?.uri ?? ""}
          onChange={(e) =>
            setSetupData((prev) => ({
              ...prev,
              database: {
                provider: "MongoDB",
                mongo: { uri: e.target.value },
              },
            }))
          }
          placeholder="Database URI..."
        />
        <Button
          onClick={testDBConnection}
          disabled={
            !setupData.database?.mongo?.uri ||
            setupData.database?.mongo?.uri === ""
          }
          variant="secondary"
          className="w-full"
        >
          Test Connection
        </Button>
        <Button
          onClick={connectDB}
          disabled={
            !setupData.database?.mongo?.uri ||
            setupData.database?.mongo?.uri === "" ||
            !testSuccessful
          }
          className="w-full"
        >
          Connect to MongoDB
        </Button>
      </CardContent>
    </Card>
  );
}
