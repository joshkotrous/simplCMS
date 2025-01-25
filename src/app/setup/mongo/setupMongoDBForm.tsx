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

export default function SetupMongoForm() {
  const router = useRouter();
  const [uri, setUri] = useState("");
  const [testSuccessful, setTestSuccessful] = useState(false);
  async function testDBConnection() {
    toast.promise(testConnection(uri), {
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
    toast.promise(connectDbToApplication("MongoDB", uri), {
      loading: "Connecting database to SimplCMS...",
      success: () => {
        router.push("/setup/media-storage");
        return "Database connected successfully.";
      },
      error: () => {
        return "Error connecting database.";
      },
    });
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
          value={uri}
          onChange={(e) => setUri(e.target.value)}
          placeholder="Database URI..."
        />
        <Button
          onClick={testDBConnection}
          disabled={!uri || uri === ""}
          variant="secondary"
          className="w-full"
        >
          Test Connection
        </Button>
        <Button
          onClick={connectDB}
          disabled={!uri || uri === "" || !testSuccessful}
          className="w-full"
        >
          Connect to MongoDB
        </Button>
      </CardContent>
    </Card>
  );
}
