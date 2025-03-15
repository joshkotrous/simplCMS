"use client";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { FaGoogle } from "react-icons/fa";
import { Copy } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { setupGoogleOauth } from "@/app/serverActions/simplCms/setup";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSetupData } from "./setupContextProvider";

export default function SetupGoogleOauthForm({ siteUrl }: { siteUrl: string }) {
  const { setupData, setSetupData } = useSetupData();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const redirectUrl = `${siteUrl}/api/auth/callback/google`;

  const googleOAuth = setupData.oauth?.find(
    (provider) => provider.provider === "Google"
  );

  const handleClientIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newClientId = e.target.value;

    setSetupData((prev) => {
      const updatedOauth = [...(prev.oauth || [])];

      const googleIndex = updatedOauth.findIndex(
        (item) => item.provider === "Google"
      );

      if (googleIndex >= 0) {
        updatedOauth[googleIndex] = {
          ...updatedOauth[googleIndex],
          provider: "Google",
          google: {
            clientId: newClientId,
            clientSecret:
              updatedOauth[googleIndex].google?.clientSecret || null,
          },
        };
      } else {
        updatedOauth.push({
          provider: "Google",
          google: {
            clientId: newClientId,
            clientSecret: null,
          },
        });
      }

      return {
        ...prev,
        oauth: updatedOauth,
      };
    });
  };

  const handleClientSecretChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newClientSecret = e.target.value;

    setSetupData((prev) => {
      const updatedOauth = [...(prev.oauth || [])];

      const googleIndex = updatedOauth.findIndex(
        (item) => item.provider === "Google"
      );

      if (googleIndex >= 0) {
        updatedOauth[googleIndex] = {
          ...updatedOauth[googleIndex],
          provider: "Google",
          google: {
            clientId: updatedOauth[googleIndex].google?.clientId || null,
            clientSecret: newClientSecret,
          },
        };
      } else {
        updatedOauth.push({
          provider: "Google",
          google: {
            clientId: null,
            clientSecret: newClientSecret,
          },
        });
      }

      return {
        ...prev,
        oauth: updatedOauth,
      };
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  async function setup() {
    if (!setupData.host?.vercel?.token)
      throw new Error("Vercel token is missing");
    if (!setupData.host?.vercel?.teamId)
      throw new Error("Vercel team is missing");
    if (!setupData.host.vercel.projectId)
      throw new Error("Vercel project is missing");
    if (!siteUrl) throw new Error("No site URL configured");

    setLoading(true);

    const clientId = googleOAuth?.google?.clientId || "";
    const clientSecret = googleOAuth?.google?.clientSecret || "";

    toast.promise(
      setupGoogleOauth(
        setupData.host?.vercel?.token,
        setupData.host.vercel.teamId,
        setupData.host.vercel.projectId,
        clientId,
        clientSecret,
        siteUrl
      ),
      {
        loading: "Connecting Google OAuth...",
        success: () => {
          router.push("/setup");
          setLoading(false);
          return "Successfully connected Google OAuth.";
        },
        error: () => {
          setLoading(false);
          return "Error connecting Google OAuth.";
        },
      }
    );
  }

  return (
    <div className="size-full flex justify-center items-center text-foreground">
      <Card>
        <CardHeader className="gap-4">
          <div className="w-full flex justify-center">
            <FaGoogle className="size-16" />
          </div>
          <h2 className="flex w-full justify-center text-xl font-bold">
            Setup Google OAuth
          </h2>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 text-nowrap">
          <div className="grid grid-cols-[1fr_15rem] items-center gap-1 gap-y-2">
            <span className="flex justify-end">Homepage:</span>
            <div className="relative border border-zinc-400 w-full grid grid-cols-[80%_1fr] items-center overflow-hidden p-1 rounded-md gap-1">
              <span className="overflow-hidden">{siteUrl}</span>
              <Button
                variant="ghost"
                size="icon"
                className="p-0"
                onClick={() => copyToClipboard(siteUrl)}
              >
                <Copy className="size-4" />
              </Button>
            </div>
            <span className="flex justify-end">Redirect:</span>
            <div className="relative border border-zinc-400 w-full grid grid-cols-[80%_1fr] items-center overflow-hidden p-1 rounded-md gap-1">
              <span className="overflow-hidden">{redirectUrl}</span>
              <Button
                variant="ghost"
                size="icon"
                className="p-0"
                onClick={() => copyToClipboard(redirectUrl)}
              >
                <Copy className="size-4" />
              </Button>
            </div>
          </div>
          <Input
            value={googleOAuth?.google?.clientId || ""}
            onChange={handleClientIdChange}
            placeholder="Google OAuth client id..."
          />
          <Input
            value={googleOAuth?.google?.clientSecret || ""}
            onChange={handleClientSecretChange}
            type="password"
            placeholder="Google OAuth client secret..."
          />
          <Button
            onClick={setup}
            disabled={
              loading ||
              !googleOAuth?.google?.clientId ||
              !googleOAuth?.google?.clientSecret
            }
            className="w-full"
          >
            Connect Google OAuth
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
