"use client";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { AWSS3Logo } from "@/app/components/logos";
import { Input } from "@/app/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { connectMediaStorageToApplication } from "@/app/serverActions/simplCms/setup";
import { useRouter } from "next/navigation";
import { useSetupData } from "../../../../components/setupContextProvider";
import { SimplCMSPlatformConfiguration } from "@/types/types";
import { testS3ConnectionAction } from "@/app/serverActions/providers/s3";

type S3ProviderConfig = {
  provider: "AWS S3";
  s3?: {
    region: string | null;
    accessKeyId: string | null;
    accessSecretKey: string | null;
    bucketName: string | null;
  };
};

export default function SetupS3Form({
  platformConfiguration,
}: {
  platformConfiguration: SimplCMSPlatformConfiguration;
}) {
  const router = useRouter();
  const { setupData, setSetupData } = useSetupData();
  const [testSuccessful, setTestSuccessful] = useState(false);

  // Get S3 configuration with proper type checking
  let s3Connection: S3ProviderConfig | undefined = undefined;

  // Check platform configuration
  if (platformConfiguration.mediaStorage) {
    if (Array.isArray(platformConfiguration.mediaStorage)) {
      const found = platformConfiguration.mediaStorage.find(
        (item) => item.provider === "AWS S3"
      );
      if (found && found.provider === "AWS S3") {
        s3Connection = {
          provider: "AWS S3",
          s3: found.s3,
        };
      }
    }
  }

  // If not found, check setup data
  if (!s3Connection && setupData.mediaStorage) {
    if (Array.isArray(setupData.mediaStorage)) {
      const found = setupData.mediaStorage.find(
        (item) => item.provider === "AWS S3"
      );
      if (found && found.provider === "AWS S3") {
        s3Connection = {
          provider: "AWS S3",
          s3: found.s3,
        };
      }
    }
  }

  const handleS3FieldChange = (
    field: "bucketName" | "region" | "accessKeyId" | "accessSecretKey",
    value: string
  ) => {
    setSetupData((prev) => {
      let updatedMediaStorage;

      // Handle the existing mediaStorage based on its type
      if (prev.mediaStorage) {
        if (Array.isArray(prev.mediaStorage)) {
          // Create a copy of the array
          const mediaStorageArray = [...prev.mediaStorage];

          // Find S3 in the array if it exists
          const s3Index = mediaStorageArray.findIndex(
            (item) => item.provider === "AWS S3"
          );

          if (s3Index >= 0) {
            // Update existing S3 configuration
            const existingS3 = mediaStorageArray[s3Index].s3 || {
              bucketName: null,
              region: null,
              accessKeyId: null,
              accessSecretKey: null,
            };

            mediaStorageArray[s3Index] = {
              ...mediaStorageArray[s3Index],
              provider: "AWS S3" as const,
              s3: {
                ...existingS3,
                [field]: value || null,
              },
            };
          } else {
            // Add new S3 configuration
            mediaStorageArray.push({
              provider: "AWS S3" as const,
              s3: {
                bucketName: field === "bucketName" ? value : null,
                region: field === "region" ? value : null,
                accessKeyId: field === "accessKeyId" ? value : null,
                accessSecretKey: field === "accessSecretKey" ? value : null,
              },
            });
          }

          updatedMediaStorage = mediaStorageArray;
        } else {
          // It was an object with skipped property, now convert to array with S3
          updatedMediaStorage = [
            {
              provider: "AWS S3" as const,
              s3: {
                bucketName: field === "bucketName" ? value : null,
                region: field === "region" ? value : null,
                accessKeyId: field === "accessKeyId" ? value : null,
                accessSecretKey: field === "accessSecretKey" ? value : null,
              },
            },
          ];
        }
      } else {
        // No existing mediaStorage, create a new array
        updatedMediaStorage = [
          {
            provider: "AWS S3" as const,
            s3: {
              bucketName: field === "bucketName" ? value : null,
              region: field === "region" ? value : null,
              accessKeyId: field === "accessKeyId" ? value : null,
              accessSecretKey: field === "accessSecretKey" ? value : null,
            },
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
    if (!s3Connection || !s3Connection.s3)
      throw new Error("AWS S3 is not configured");
    const { region, bucketName, accessKeyId, accessSecretKey } =
      s3Connection.s3;
    if (!region || !bucketName || !accessKeyId || !accessSecretKey)
      throw new Error("AWS S3 configuration is incomplete");

    toast.promise(testS3ConnectionAction(s3Connection.s3), {
      loading: "Testing AWS S3 connection...",
      success: () => {
        setTestSuccessful(true);
        return "Successfully connected to AWS S3.";
      },
      error: () => {
        return "Error connecting to AWS S3.";
      },
    });
  }

  async function connectS3() {
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
    if (!s3Connection?.s3) throw new Error("AWS S3 is not configured");
    const { region, bucketName, accessKeyId, accessSecretKey } =
      s3Connection.s3;
    if (!region || !bucketName || !accessKeyId || !accessSecretKey)
      throw new Error("AWS S3 configuration is incomplete");

    // You need to serialize the S3 config to pass to the action
    toast.promise(
      connectMediaStorageToApplication(
        platformConfiguration.host?.vercel?.token! ??
          setupData.host?.vercel?.token!,
        platformConfiguration.host?.vercel?.projectId! ??
          setupData.host?.vercel?.projectId!,
        platformConfiguration.host?.vercel?.teamId! ??
          setupData.host?.vercel?.teamId!,
        "AWS S3",
        {
          s3: s3Connection.s3,
        }
      ),
      {
        loading: "Connecting AWS S3 to SimplCMS...",
        success: () => {
          router.push("/setup");
          return "Successfully connected AWS S3";
        },
        error: () => {
          return "Error connecting AWS S3";
        },
      }
    );
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
          value={s3Connection?.s3?.region || ""}
          onChange={(e) => handleS3FieldChange("region", e.target.value)}
          placeholder="AWS region..."
        />
        <Input
          value={s3Connection?.s3?.bucketName || ""}
          onChange={(e) => handleS3FieldChange("bucketName", e.target.value)}
          placeholder="Bucket name..."
        />
        <Input
          value={s3Connection?.s3?.accessKeyId || ""}
          onChange={(e) => handleS3FieldChange("accessKeyId", e.target.value)}
          placeholder="Access key id..."
        />
        <Input
          value={s3Connection?.s3?.accessSecretKey || ""}
          onChange={(e) =>
            handleS3FieldChange("accessSecretKey", e.target.value)
          }
          placeholder="Secret access key..."
          type="password"
        />
        <Button
          onClick={testConnection}
          disabled={
            !s3Connection?.s3?.region ||
            !s3Connection?.s3?.bucketName ||
            !s3Connection?.s3?.accessKeyId ||
            !s3Connection?.s3?.accessSecretKey
          }
          variant="secondary"
          className="w-full"
        >
          Test Connection
        </Button>
        <Button
          onClick={connectS3}
          disabled={
            !s3Connection?.s3?.region ||
            !s3Connection?.s3?.bucketName ||
            !s3Connection?.s3?.accessKeyId ||
            !s3Connection?.s3?.accessSecretKey ||
            !testSuccessful
          }
          className="w-full"
        >
          Connect to AWS S3
        </Button>
      </CardContent>
    </Card>
  );
}
