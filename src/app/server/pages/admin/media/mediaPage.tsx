"use server";
import { MediaGrid } from "../../../../client/components/mediaGrid";
import { simplcms } from "../../../../../core";

export default async function AdminMediaPage() {
  const platformConfiguration = simplcms.platform.getPlatformConfiguration();
  const media = await simplcms.media.getMedia(
    platformConfiguration.mediaStorage
  );
  return (
    <div className="container mx-auto p-6 space-y-8">
      <MediaGrid media={media} />
    </div>
  );
}
