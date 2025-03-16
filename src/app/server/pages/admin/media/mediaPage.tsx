"use server";
import { MediaGrid } from "../../../../client/components/mediaGrid";
import { getServerEnvVars } from "@/core/platform";
import { simplCms } from "@/index";

export default async function AdminMediaPage() {
  const platformConfiguration = getServerEnvVars();
  const media = await simplCms.media.getMedia(
    platformConfiguration.mediaStorage
  );
  return (
    <div className="container mx-auto p-6 space-y-8">
      <MediaGrid media={media} />
    </div>
  );
}
