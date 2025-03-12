import { getServerEnvVars, simplCms } from "@/packages/core/src/simplCms";
import { MarkdownEditor } from "./textEditor";
import { vercel } from "@/packages/core/src/vercel";

export default async function NewPostPage() {
  const platformConfiguration = getServerEnvVars();
  const media = await simplCms.media.getMedia(
    platformConfiguration.mediaStorage
  );
  const client = await vercel.connect(
    platformConfiguration.host?.vercel?.token!
  );
  const latestDeployment = await vercel.getLatestDeployment({
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
