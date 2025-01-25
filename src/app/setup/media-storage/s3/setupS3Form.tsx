"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AWSS3Logo } from "@/components/logos";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { testCloudinaryConnectionAction } from "@/app/actions/cloudinary";
import { connectMediaStorageToApplication } from "@/app/actions/setup";
import { useRouter } from "next/navigation";

export default function SetupS3Form() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [testSuccessful, setTestSuccessful] = useState(false);
  async function testConnection() {
    toast.promise(testCloudinaryConnectionAction(url), {
      loading: "Testing Cloudinary connection...",
      success: () => {
        setTestSuccessful(true);
        return "Successfully connected to Cloudinary.";
      },
      error: () => {
        return "Error connecting to Cloudinary.";
      },
    });
  }

  async function connectCloudinary() {
    toast.promise(connectMediaStorageToApplication("Cloudinary", url), {
      loading: "Connecting Cloudinary to SimplCMS...",
      success: () => {
        router.push("/setup/oauth");
        return "Successfully connected Cloudinary";
      },
      error: () => {
        return "Error connecting Cloudinary";
      },
    });
  }

  return (
    <Card>
      <CardHeader className="gap-4 text-center">
        <div className="flex w-full justify-center">
          <AWSS3Logo />
        </div>
        Connect AWS S3 to SimplCMS
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="AWS region..."
        />
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Bucket name..."
        />
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Access key id..."
        />
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Secret access key..."
        />
        <Button
          onClick={testConnection}
          disabled={!url || url === ""}
          variant="secondary"
          className="w-full"
        >
          Test Connection
        </Button>
        <Button
          onClick={connectCloudinary}
          disabled={!url || url === "" || !testSuccessful}
          className="w-full"
        >
          Connect to AWS S3
        </Button>
      </CardContent>
    </Card>
  );
}
