import { AWSS3Logo, CloudinaryLogo, VercelLogo } from "@/components/logos";
import { MongoDBLogo } from "@/components/logos";
import MediaPopover from "@/components/mediaPopover";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cloudinary } from "@/packages/core/src/cloudinary";
import { getServerEnvVars } from "@/packages/core/src/simplCms";
import { vercel } from "@/packages/core/src/vercel";
import { ImageIcon } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

export default async function ConnectionSettings() {
  const platformConfiguration = getServerEnvVars();
  const client = await vercel.connect(
    platformConfiguration.host?.vercel?.token!
  );
  const project = await vercel.getProjectById({
    vercel: client,
    projectId: platformConfiguration.host?.vercel?.projectId!,
    teamId: platformConfiguration.host?.vercel?.teamId!,
  });
  const team = await vercel.getTeamById({
    vercel: client,
    teamId: platformConfiguration.host?.vercel?.teamId!,
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">Host</h3>
        <div className="grid grid-cols-3">
          {platformConfiguration.host && (
            <Card className="size-fit">
              <CardContent className="p-2 pt-4 flex justify-center items-center flex-col gap-4">
                <VercelLogo />
                <div className="flex flex-col gap-2">
                  <span className=" text-nowrap">
                    Connected Team: {team.name}
                  </span>
                  <span className="text-nowrap">
                    Connected Project: {project.name}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">Database Connection</h3>
        <div className="grid grid-cols-3">
          {platformConfiguration.database && (
            <Card className="">
              <CardContent className="p-2 pt-4 flex justify-center items-center flex-col gap-4">
                <MongoDBLogo />
                <span className="font-semibold">
                  {platformConfiguration.database.provider}
                </span>
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
          {platformConfiguration.mediaStorage &&
            (Array.isArray(platformConfiguration.mediaStorage)
              ? // Handle array case
                platformConfiguration.mediaStorage.map((media, index) => (
                  <Card key={index} className="">
                    <CardContent className="p-2 pt-4 flex justify-center items-center flex-col gap-4">
                      {media.provider === "Cloudinary" && <CloudinaryLogo />}
                      {media.provider === "AWS S3" && <AWSS3Logo />}
                      <span className="font-semibold">
                        {media.provider || "Cloudinary"}
                      </span>
                      <span className="font-semibold">
                        {media.s3?.bucketName}
                      </span>
                      <Button className="w-full" variant="destructive">
                        Disconnect
                      </Button>
                    </CardContent>
                  </Card>
                ))
              : // Handle {skipped: true} case
                platformConfiguration.mediaStorage.skipped && (
                  <Card className="">
                    <CardContent className="p-2 pt-4 flex justify-center items-center flex-col gap-4">
                      <ImageIcon className="size-24" />
                      <span className="font-semibold">
                        Media Storage Skipped
                      </span>
                      <Button className="w-full" variant="outline">
                        Configure Media Storage
                      </Button>
                    </CardContent>
                  </Card>
                ))}
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">OAuth Providers</h3>
        <div className="grid grid-cols-3">
          {platformConfiguration.oauth && (
            <div>
              {platformConfiguration.oauth.map((provider) => (
                <Card key={provider.provider} className="">
                  <CardContent className="p-2 pt-4 flex justify-center items-center flex-col gap-4">
                    <FaGoogle className="size-24" />
                    <span className="font-semibold">
                      {provider.provider} OAuth
                    </span>
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
