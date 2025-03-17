"use server";
import { notFound } from "next/navigation";
import PostDisplay from "../../../../client/components/postDisplay";
import { SimplCMSMedia } from "../../../../../types/types";

import { simplcms } from "../../../../../core";

export default async function PostPage(props: { params: { postId: string } }) {
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
  return (
    <div className="p-4">
      <PostDisplay media={media} post={post} />
    </div>
  );
}
