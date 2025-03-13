import { getPost } from "@/posts";
import { notFound } from "next/navigation";
import PostDisplay from "../../../components/postDisplay";
import { getServerEnvVars, simplCms } from "@/index";
import { SimplCMSMedia } from "@/types/types";

export default async function PostPage(props: { params: { postId: string } }) {
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
  return (
    <div className="p-4">
      <PostDisplay media={media} post={post} />
    </div>
  );
}
