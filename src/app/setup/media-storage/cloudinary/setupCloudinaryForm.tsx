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
import { SimplCMSPlatformConfiguration } from "@/types/types";

export default function SetupCloudinaryForm({
  platformConfiguration,
}: {
  platformConfiguration: SimplCMSPlatformConfiguration;
}) {
  const router = useRouter();
  const { setupData, setSetupData } = useSetupData();
  const [testSuccessful, setTestSuccessful] = useState(false);

  const cloudinaryConnection =
    platformConfiguration.mediaStorage?.find(
      (item) => item.provider === "Cloudinary"
    ) ?? setupData.mediaStorage?.find((item) => item.provider === "Cloudinary");

  const handleUriChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUri = e.target.value;

    setSetupData((prev) => {
      const updatedMediaStorage = [...(prev.mediaStorage || [])];

      const cloudinaryIndex = updatedMediaStorage.findIndex(
        (item) => item.provider === "Cloudinary"
      );

      if (cloudinaryIndex >= 0) {
        updatedMediaStorage[cloudinaryIndex] = {
          ...updatedMediaStorage[cloudinaryIndex],
          provider: "Cloudinary",
          cloudinary: { uri: newUri },
        };
      } else {
        updatedMediaStorage.push({
          provider: "Cloudinary",
          cloudinary: { uri: newUri },
        });
      }

      return {
        ...prev,
        mediaStorage: updatedMediaStorage,
      };
    });
  };

  async function testConnection() {
    if (!cloudinaryConnection || !cloudinaryConnection.cloudinary?.uri)
      throw new Error("Cloudinary is not configured");
    toast.promise(
      testCloudinaryConnectionAction(cloudinaryConnection?.cloudinary?.uri),
      {
        loading: "Testing Cloudinary connection...",
        success: () => {
          setTestSuccessful(true);
          return "Successfully connected to Cloudinary.";
        },
        error: () => {
          return "Error connecting to Cloudinary.";
        },
      }
    );
  }

  async function connectCloudinary() {
    if (
      !platformConfiguration.host?.vercel?.token &&
      !setupData.host?.vercel?.token
    )
      throw new Error("Vercel token is missing");
    if (
      !platformConfiguration.host?.vercel?.projectId &&
      !setupData.host?.vercel?.projectId
    )
      throw new Error("Vercel project is missing");
    if (
      !platformConfiguration.host?.vercel?.teamId &&
      !setupData.host?.vercel?.teamId
    )
      throw new Error("Vercel team is missing");
    if (!cloudinaryConnection?.cloudinary?.uri)
      throw new Error("Cloudinary uri is not configured");
    toast.promise(
      connectMediaStorageToApplication(
        platformConfiguration.host?.vercel?.token! ??
          setupData.host?.vercel?.token,
        platformConfiguration.host?.vercel?.projectId! ??
          setupData.host?.vercel?.projectId,
        platformConfiguration.host?.vercel?.teamId! ?? // Fixed: was using projectId again
          setupData.host?.vercel?.teamId,
        "Cloudinary",
        cloudinaryConnection?.cloudinary?.uri
      ),
      {
        loading: "Connecting Cloudinary to SimplCMS...",
        success: () => {
          router.push("/");
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
          value={cloudinaryConnection?.cloudinary?.uri ?? ""}
          onChange={handleUriChange}
          placeholder="Cloudinary connection url..."
        />
        <Button
          onClick={testConnection}
          disabled={
            !cloudinaryConnection?.cloudinary?.uri ||
            cloudinaryConnection?.cloudinary?.uri === ""
          }
          variant="secondary"
          className="w-full"
        >
          Test Connection
        </Button>
        <Button
          onClick={connectCloudinary}
          disabled={
            !cloudinaryConnection?.cloudinary?.uri ||
            cloudinaryConnection?.cloudinary?.uri === "" ||
            !testSuccessful
          }
          className="w-full"
        >
          Connect to Cloudinary
        </Button>
      </CardContent>
    </Card>
  );
}
