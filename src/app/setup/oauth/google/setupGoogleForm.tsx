"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FaGoogle } from "react-icons/fa";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setupGoogleOauth } from "@/app/actions/setup";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSetupData } from "../../setupContextProvider";
export default function SetupGoogleOauthForm({ siteUrl }: { siteUrl: string }) {
  const { setupData } = useSetupData();
  const [formData, setFormData] = useState({ clientId: "", clientSecret: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const redirectUrl = `${siteUrl}/api/auth/callback/google`;
  async function setup() {
    if (!setupData.vercelTeam) throw new Error("Vercel team is mising");
    if (!setupData.vercelProject) throw new Error("Vercel project is missing");
    if (!siteUrl) throw new Error("No site URL configured");
    setLoading(true);
    toast.promise(
      setupGoogleOauth(
        setupData.vercelToken,
        setupData.vercelTeam.id,
        setupData.vercelProject.id,
        formData.clientId,
        formData.clientSecret,
        siteUrl
      ),
      {
        loading: "Connecting Google OAuth...",
        success: () => {
          router.push("/setup/redeploy");
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
        <CardContent className=" flex flex-col items-center justify-center gap-4 text-nowrap">
          <div className="grid grid-cols-[1fr_15rem] items-center gap-1 gap-y-2">
            <span className="flex justify-end">Homepage:</span>
            <div className="relative border w-full grid grid-cols-[80%_1fr] items-center overflow-hidden p-1 rounded-md gap-1">
              <span className="overflow-hidden">{siteUrl}</span>
              <Copy className=" right-0 size-4" />
            </div>
            <span className="flex justify-end">Redirect:</span>
            <div className="relative border w-full grid grid-cols-[80%_1fr] items-center overflow-hidden p-1 rounded-md gap-1">
              <span className="overflow-hidden">{redirectUrl}</span>
              <Copy className=" right-0 size-4" />
            </div>
          </div>
          <Input
            value={formData.clientId}
            onChange={(e) =>
              setFormData({ ...formData, clientId: e.target.value })
            }
            placeholder="Google OAuth client id..."
          />
          <Input
            onChange={(e) =>
              setFormData({ ...formData, clientSecret: e.target.value })
            }
            type="password"
            placeholder="Google OAuth client secret..."
          />
          <Button
            onClick={setup || loading}
            disabled={formData.clientId === "" || formData.clientSecret === ""}
            className="w-full"
          >
            Connect Google OAuth
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
