"use client";
import { Card, CardContent, CardHeader } from "./ui/card";
import { MongoDBLogo } from "./logos";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { testConnection } from "../../../core/serverActions/providers/mongo";
import { useRouter } from "next/navigation";
import { SimplCMSPlatformConfiguration } from "../../../types/types";
import { Label } from "./ui/label";
import { useSetupData } from "./setupContextProvider";
import { connectDbToApplication } from "../../../core/serverActions/simplcms/setup";

export default function SetupMongoForm({
  platformConfiguration,
}: {
  platformConfiguration: SimplCMSPlatformConfiguration;
}) {
  const router = useRouter();
  const { setupData, setSetupData } = useSetupData();
  const [testSuccessful, setTestSuccessful] = useState(false);
  const [dbName, setDbName] = useState("simplcms");

  const updateUriWithDbName = (uri: string, dbName: string): string => {
    if (!uri || !dbName) return uri;

    // Parse the URI into components
    try {
      const url = new URL(uri);

      // Check if the path already contains a database name
      // MongoDB URI path will be empty or start with / followed by the database name
      const pathSegments = url.pathname.split("/").filter(Boolean);

      if (pathSegments.length > 0) {
        // Database name is already present, replace it
        url.pathname = "/" + dbName;
      } else {
        // No database name, add it
        url.pathname = "/" + dbName;
      }

      return url.toString();
    } catch (e) {
      // Handle URIs that aren't standard URLs
      // For connection strings like mongodb://user:pass@host:port

      // Match for checking if there's already a database name in the URI
      const dbNamePattern = /mongodb(\+srv)?:\/\/[^/]+(\/([^/?]+))?/;
      const match = uri.match(dbNamePattern);

      if (match && match[3]) {
        // Database name exists, replace it
        return uri.replace(
          dbNamePattern,
          `mongodb$1://${uri.split("://")[1].split("/")[0]}/${dbName}`
        );
      }

      // No database name found, add it
      if (uri.includes("?")) {
        // If there are query parameters, insert dbName before them
        const [base, query] = uri.split("?");
        return `${base}/${dbName}?${query}`;
      } else {
        // No query parameters, simply append dbName
        return `${uri}/${dbName}`;
      }
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
          router.push("/admin/setup");
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
            This is the name of your MongoDB database (default: simplcms)
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
