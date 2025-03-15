import MediaPopover from "@/app/components/mediaPopover";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { cloudinary } from "@/providers/cloudinary";
import { ImageIcon } from "lucide-react";
import { InitSiteConfig } from "../../../components/initSiteConfig";
import { CloudinaryMedia, SiteConfig } from "@/types";
import { getServerEnvVars } from "@/core/platform";
import { simplCms } from "@/index";

export default async function SiteSettings() {
  let siteConfig: SiteConfig | null = null;
  const platformConfiguration = getServerEnvVars();
  const media = await simplCms.media.getMedia(
    platformConfiguration.mediaStorage
  );

  if (platformConfiguration.database) {
    siteConfig = await simplCms.getSiteConfig();
  }
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">Configuration</h3>
        <InitSiteConfig siteConfig={siteConfig} />
        <div>{JSON.stringify(siteConfig)}</div>
      </div>
      <Separator />
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">Logo</h3>
        <div className="">
          <div className="w-fit h-40 p-4 border rounded-md border-dashed border-zinc-400 text-zinc-400 flex flex-col justify-center items-center gap-4">
            <div className="space-x-2 flex gap-1 items-center text-nowrap">
              <ImageIcon className="size-4" /> No Logo Configured
            </div>
            <MediaPopover media={media}>
              <Button>Select Logo</Button>
            </MediaPopover>
          </div>
        </div>
      </div>
      <Separator />
    </div>
  );
}
