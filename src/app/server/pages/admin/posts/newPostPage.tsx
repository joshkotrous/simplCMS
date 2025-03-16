"use server";
import { simplcms } from "@/core";
import { MarkdownEditor } from "../../../../client/components/textEditor";

export default async function NewPostPage() {
  const platformConfiguration = simplcms.platform.getPlatformConfiguration();
  const media = await simplcms.media.getMedia(
    platformConfiguration.mediaStorage
  );
  const client = await simplcms.providers.vercel.connect(
    platformConfiguration.host?.vercel?.token!
  );
  const latestDeployment = await simplcms.providers.vercel.getLatestDeployment({
    vercel: client,
    projectId: platformConfiguration.host?.vercel?.projectId!,
    teamId: platformConfiguration.host?.vercel?.teamId!,
  });
  return (
    <div className="p-4 h-full overflow-auto space-y-8">
      <h2 className="text-3xl font-bold">New Post</h2>
      <div className="flex justify-center">
        <div className="w-[44rem]">
          <MarkdownEditor latestDeployment={latestDeployment} media={media} />
        </div>
      </div>
    </div>
  );
}
