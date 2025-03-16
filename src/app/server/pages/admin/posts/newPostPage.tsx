"use server";
import { getServerEnvVars } from "@/core/platform";
import { MarkdownEditor } from "../../../../client/components/textEditor";
import { simplCms } from "@/index";

export default async function NewPostPage() {
  const platformConfiguration = getServerEnvVars();
  const media = await simplCms.media.getMedia(
    platformConfiguration.mediaStorage
  );
  const client = await simplCms.providers.vercel.connect(
    platformConfiguration.host?.vercel?.token!
  );
  const latestDeployment = await simplCms.providers.vercel.getLatestDeployment({
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
