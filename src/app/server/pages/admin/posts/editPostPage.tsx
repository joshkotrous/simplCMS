"use server";
import { notFound } from "next/navigation";
import { SimplCMSMedia } from "../../../../../../types/types";
import EditPostDisplay from "../../../../client/components/editPostDisplay";
import { simplcms } from "../../../../../core";

export default async function EditPostPage(props: {
  params: { postId: string };
}) {
  const params = props.params;
  const post = await simplcms.posts.getPost({ _id: params.postId });
  if (!post) return notFound();
  const platformConfiguration = simplcms.platform.getPlatformConfiguration();
  let media: SimplCMSMedia[] = [];
  if (
    platformConfiguration.mediaStorage &&
    !("skipped" in platformConfiguration.mediaStorage)
  ) {
    media = await simplcms.media.getMedia(platformConfiguration.mediaStorage);
  }

  if (
    !platformConfiguration.host?.vercel?.token ||
    !platformConfiguration.host?.vercel?.projectId ||
    !platformConfiguration.host?.vercel?.teamId
  ) {
    throw new Error("Vercel is not configured");
  }

  const client = await simplcms.providers.vercel.connect(
    platformConfiguration.host?.vercel?.token
  );
  const latestDeployment = await simplcms.providers.vercel.getLatestDeployment({
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
