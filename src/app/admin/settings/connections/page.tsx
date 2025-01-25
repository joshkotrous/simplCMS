import { CloudinaryLogo } from "@/components/logos";
import { MongoDBLogo } from "@/components/logos";
import MediaPopover from "@/components/mediaPopover";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cloudinary } from "@/packages/core/src/cloudinary";
import { ImageIcon } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

export default async function ConnectionSettings() {
  const dataBaseProvider = process.env.SIMPLCMS_DB_PROVIDER ?? null;
  const mediaStorageProvider =
    process.env.SIMPLCMS_MEDIA_STORAGE_PROVIDERS ?? null;
  const oauthProviders = process.env.SIMPLCMS_OAUTH_PROVIDERS
    ? process.env.SIMPLCMS_OAUTH_PROVIDERS.split(",")
    : [];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">Database Connection</h3>
        <div className="grid grid-cols-3">
          {dataBaseProvider && (
            <Card className="">
              <CardContent className="p-2 pt-4 flex justify-center items-center flex-col gap-4">
                <MongoDBLogo />
                <span className="font-semibold">{dataBaseProvider}</span>
                <Button className="w-full" variant="destructive">
                  Disconnect
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">Media Storage</h3>
        <div className="grid grid-cols-3">
          {mediaStorageProvider && (
            <Card className="">
              <CardContent className="p-2 pt-4 flex justify-center items-center flex-col gap-4">
                <CloudinaryLogo />
                <span className="font-semibold">{mediaStorageProvider}</span>
                <Button className="w-full" variant="destructive">
                  Disconnect
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">OAuth Providers</h3>
        <div className="grid grid-cols-3">
          {oauthProviders && (
            <div>
              {oauthProviders.map((provider) => (
                <Card key={provider} className="">
                  <CardContent className="p-2 pt-4 flex justify-center items-center flex-col gap-4">
                    <FaGoogle className="size-24" />
                    <span className="font-semibold">Google OAuth</span>
                    <Button className="w-full" variant="destructive">
                      Disconnect
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
