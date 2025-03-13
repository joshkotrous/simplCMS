import { getPost } from "@/packages/core/src/posts";
import { notFound } from "next/navigation";
import EditPostDisplay from "./editPostDisplay";
import { getServerEnvVars, simplCms } from "@/packages/core/src/simplCms";
import { vercel } from "@/packages/core/src/vercel";
import { SimplCMSMedia } from "@/types/types";

export default async function EditPostPage(props: {
  params: Promise<{ postId: string }>;
}) {
  const params = await props.params;
  const post = await getPost({ _id: params.postId });
  if (!post) return notFound();
  const platformConfiguration = getServerEnvVars();
  let media: SimplCMSMedia[] = [];
  if (
    platformConfiguration.mediaStorage &&
    !("skipped" in platformConfiguration.mediaStorage)
  ) {
    media = await simplCms.media.getMedia(platformConfiguration.mediaStorage);
  }

  const client = await vercel.connect(
    platformConfiguration.host?.vercel?.token!
  );
  const latestDeployment = await vercel.getLatestDeployment({
    vercel: client,
    projectId: platformConfiguration.host?.vercel?.projectId!,
    teamId: platformConfiguration.host?.vercel?.teamId!,
  });
  return (
    <div className="p-4">
      <EditPostDisplay
        latestDeployment={latestDeployment}
        media={media}
        post={post}
      />
    </div>
  );
}
