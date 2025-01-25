"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CloudinaryLogo } from "@/components/logos";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { testCloudinaryConnectionAction } from "@/app/actions/cloudinary";
import { connectMediaStorageToApplication } from "@/app/actions/setup";
import { useRouter } from "next/navigation";
import { useSetupData } from "../../setupContextProvider";

export default function SetupCloudinaryForm() {
  const router = useRouter();
  const { setupData } = useSetupData();
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
    if (!setupData.vercelProject) throw new Error("Vercel project is missing");
    if (!setupData.vercelTeam) throw new Error("Vercel team is missing");
    toast.promise(
      connectMediaStorageToApplication(
        setupData.vercelToken,
        setupData.vercelProject.id,
        setupData.vercelTeam.id,
        "Cloudinary",
        url
      ),
      {
        loading: "Connecting Cloudinary to SimplCMS...",
        success: () => {
          router.push("/setup/oauth");
          return "Successfully connected Cloudinary";
        },
        error: () => {
          return "Error connecting Cloudinary";
        },
      }
    );
  }

  return (
    <Card>
      <CardHeader className="gap-4 text-center">
        <div className="flex w-full justify-center">
          <CloudinaryLogo />
        </div>
        Connect Cloudinary to SimplCMS
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Cloudinary connection url..."
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
          Connect to Cloudinary
        </Button>
      </CardContent>
    </Card>
  );
}
