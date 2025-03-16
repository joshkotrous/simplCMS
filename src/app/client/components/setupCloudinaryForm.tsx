"use client";
import { Button } from "@/app/client/components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/client/components/ui/card";
import { CloudinaryLogo } from "@/app/client/components/logos";
import { Input } from "@/app/client/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { testCloudinaryConnectionAction } from "@/core/serverActions/providers/cloudinary";
import { connectMediaStorageToApplication } from "@/core/serverActions/simplcms/setup";
import { useRouter } from "next/navigation";
import {
  SimplCMSMediaStorageConfiguration,
  SimplCMSPlatformConfiguration,
} from "@/types";
import { useSetupData } from "./setupContextProvider";

// Define a type for a Cloudinary provider configuration
type CloudinaryProviderConfig = {
  provider: "Cloudinary";
  cloudinary?: {
    uri: string | null;
  };
};

export default function SetupCloudinaryForm({
  platformConfiguration,
}: {
  platformConfiguration: SimplCMSPlatformConfiguration;
}) {
  const router = useRouter();
  const { setupData, setSetupData } = useSetupData();
  const [testSuccessful, setTestSuccessful] = useState(false);

  // Get Cloudinary configuration with proper type checking
  let cloudinaryConnection: CloudinaryProviderConfig | undefined = undefined;

  // Check platform configuration
  if (platformConfiguration.mediaStorage) {
    if (Array.isArray(platformConfiguration.mediaStorage)) {
      const found = platformConfiguration.mediaStorage.find(
        (item) => item.provider === "Cloudinary"
      );
      if (found && found.provider === "Cloudinary") {
        cloudinaryConnection = {
          provider: "Cloudinary",
          cloudinary: found.cloudinary,
        };
      }
    }
  }

  // If not found, check setup data
  if (!cloudinaryConnection && setupData.mediaStorage) {
    if (Array.isArray(setupData.mediaStorage)) {
      const found = setupData.mediaStorage.find(
        (item) => item.provider === "Cloudinary"
      );
      if (found && found.provider === "Cloudinary") {
        cloudinaryConnection = {
          provider: "Cloudinary",
          cloudinary: found.cloudinary,
        };
      }
    }
  }

  const handleUriChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUri = e.target.value;
    setSetupData((prev) => {
      let updatedMediaStorage;

      // Handle the existing mediaStorage based on its type
      if (prev.mediaStorage) {
        if (Array.isArray(prev.mediaStorage)) {
          // Create a copy of the array
          const mediaStorageArray = [...prev.mediaStorage];

          // Find Cloudinary in the array if it exists
          const cloudinaryIndex = mediaStorageArray.findIndex(
            (item) => item.provider === "Cloudinary"
          );

          if (cloudinaryIndex >= 0) {
            // Update existing Cloudinary configuration
            mediaStorageArray[cloudinaryIndex] = {
              ...mediaStorageArray[cloudinaryIndex],
              provider: "Cloudinary" as const, // Use const assertion
              cloudinary: { uri: newUri },
            };
          } else {
            // Add new Cloudinary configuration
            mediaStorageArray.push({
              provider: "Cloudinary" as const, // Use const assertion
              cloudinary: { uri: newUri },
            });
          }

          updatedMediaStorage = mediaStorageArray;
        } else {
          // It was an object with skipped property, now convert to array with Cloudinary
          updatedMediaStorage = [
            {
              provider: "Cloudinary" as const, // Use const assertion
              cloudinary: { uri: newUri },
            },
          ];
        }
      } else {
        // No existing mediaStorage, create a new array
        updatedMediaStorage = [
          {
            provider: "Cloudinary" as const, // Use const assertion
            cloudinary: { uri: newUri },
          },
        ];
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
      testCloudinaryConnectionAction(cloudinaryConnection.cloudinary.uri),
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
          setupData.host?.vercel?.token!,
        platformConfiguration.host?.vercel?.projectId! ??
          setupData.host?.vercel?.projectId!,
        platformConfiguration.host?.vercel?.teamId! ??
          setupData.host?.vercel?.teamId!,
        "Cloudinary",
        {
          cloudinary: {
            url: cloudinaryConnection.cloudinary.uri,
          },
        }
      ),
      {
        loading: "Connecting Cloudinary to SimplCMS...",
        success: () => {
          router.push("/setup");
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
            cloudinaryConnection.cloudinary.uri === ""
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
            cloudinaryConnection.cloudinary.uri === "" ||
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
