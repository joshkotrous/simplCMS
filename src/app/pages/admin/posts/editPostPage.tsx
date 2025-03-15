import { getPost } from "@/posts";
import { notFound } from "next/navigation";
import { vercel } from "@/providers/vercel";
import { SimplCMSMedia } from "@/types";
import EditPostDisplay from "@/app/components/editPostDisplay";
import { getServerEnvVars } from "@/core/platform";
import { simplCms } from "@/index";

export default async function EditPostPage(props: {
  params: { postId: string };
}) {
  const params = props.params;
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

  if (
    !platformConfiguration.host?.vercel?.token ||
    !platformConfiguration.host?.vercel?.projectId ||
    !platformConfiguration.host?.vercel?.teamId
  ) {
    throw new Error("Vercel is not configured");
  }

  const client = await vercel.connect(
    platformConfiguration.host?.vercel?.token
  );
  const latestDeployment = await vercel.getLatestDeployment({
    vercel: client,
    projectId: platformConfiguration.host?.vercel?.projectId,
    teamId: platformConfiguration.host?.vercel?.teamId,
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
