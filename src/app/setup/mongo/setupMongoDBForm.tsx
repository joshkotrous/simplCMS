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
import { Label } from "@/components/ui/label";

export default function SetupMongoForm({
  platformConfiguration,
}: {
  platformConfiguration: SimplCMSPlatformConfiguration;
}) {
  const router = useRouter();
  const { setupData, setSetupData } = useSetupData();
  const [testSuccessful, setTestSuccessful] = useState(false);
  const [dbName, setDbName] = useState("simplCms");

  const updateUriWithDbName = (uri: string, dbName: string): string => {
    if (!uri) return uri;

    const baseUri = uri.replace(/\/([^/?]+)(?=[/?]|$)/, "");

    if (baseUri.includes("?")) {
      return baseUri.replace("?", `/${dbName}?`);
    } else {
      return `${baseUri}/${dbName}`;
    }
  };

  const handleUriChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUri = e.target.value;
    const uriWithDbName = updateUriWithDbName(newUri, dbName);

    setSetupData((prev) => ({
      ...prev,
      database: {
        provider: "MongoDB",
        mongo: { uri: uriWithDbName },
      },
    }));
  };

  const handleDbNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDbName = e.target.value;
    setDbName(newDbName);

    if (setupData.database?.mongo?.uri) {
      const baseUri = setupData.database.mongo.uri.replace(
        /\/([^/?]*)?(\?|$)/,
        "/$2"
      );
      const updatedUri = updateUriWithDbName(baseUri, newDbName);

      setSetupData((prev) => ({
        ...prev,
        database: {
          provider: "MongoDB",
          mongo: { uri: updatedUri },
        },
      }));
    }
  };

  async function testDBConnection() {
    if (!setupData.database?.mongo?.uri)
      throw new Error("Mongo uri is not configured");

    const uriToTest = updateUriWithDbName(setupData.database.mongo.uri, dbName);

    toast.promise(testConnection(uriToTest), {
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

    // Make sure URI has database name before connecting
    const uriToConnect = updateUriWithDbName(
      setupData.database.mongo.uri,
      dbName
    );

    toast.promise(
      connectDbToApplication(
        platformConfiguration.host?.vercel?.token! ??
          setupData.host?.vercel?.token,
        platformConfiguration.host?.vercel?.teamId! ??
          setupData.host?.vercel?.teamId,
        platformConfiguration.host?.vercel?.projectId! ??
          setupData.host?.vercel?.projectId,
        setupData.database.provider,
        uriToConnect
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

  // Display the current connection string with sensitive parts masked
  const displayUri = setupData.database?.mongo?.uri
    ? setupData.database.mongo.uri.replace(
        /(mongodb:\/\/)([^@]+)@/,
        "$1***:***@"
      )
    : "";

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex w-full justify-center">
          <MongoDBLogo />
        </div>
        Connect your MongoDB to SimplCMS
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mongodb-uri">MongoDB Connection URI</Label>
          <Input
            id="mongodb-uri"
            value={
              setupData.database?.mongo?.uri
                ? setupData.database.mongo.uri.replace(
                    /\/([^/?]*)?(\?|$)/,
                    "/$2"
                  )
                : ""
            }
            onChange={handleUriChange}
            placeholder="mongodb://username:password@hostname:port/"
          />
          <p className="text-xs text-muted-foreground">
            Your connection URI format should look like:
            mongodb://username:password@hostname:port/
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="db-name">Database Name</Label>
          <Input
            id="db-name"
            value={dbName}
            onChange={handleDbNameChange}
            placeholder="Database name"
          />
          <p className="text-xs text-muted-foreground">
            This is the name of your MongoDB database (default: simplCms)
          </p>
        </div>

        <Button
          onClick={testDBConnection}
          disabled={
            !setupData.database?.mongo?.uri ||
            setupData.database?.mongo?.uri === "" ||
            !dbName
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
            !dbName ||
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
