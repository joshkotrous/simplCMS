import { getPost } from "@/packages/core/src/posts";
import { notFound } from "next/navigation";
import PostDisplay from "./postDisplay";
import { getServerEnvVars, simplCms } from "@/packages/core/src/simplCms";
import { SimplCMSMedia } from "@/types/types";

export default async function PostPage(props: {
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
  return (
    <div className="p-4">
      <PostDisplay media={media} post={post} />
    </div>
  );
}
