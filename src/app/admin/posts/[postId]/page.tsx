import { getPost } from "@/packages/core/src/posts";
import { notFound } from "next/navigation";
import PostDisplay from "./postDisplay";
import { getServerEnvVars, simplCms } from "@/packages/core/src/simplCms";

export default async function PostPage(props: {
  params: Promise<{ postId: string }>;
}) {
  const params = await props.params;
  const post = await getPost({ _id: params.postId });
  if (!post) return notFound();
  const platformConfiguration = getServerEnvVars();
  const media = await simplCms.media.getMedia(
    platformConfiguration.mediaStorage
  );
  return (
    <div className="p-4">
      <PostDisplay media={media} post={post} />
    </div>
  );
}
