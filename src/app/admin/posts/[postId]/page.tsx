import { getPost } from "@/packages/core/src/posts";
import { notFound } from "next/navigation";
import PostDisplay from "./postDisplay";

export default async function PostPage({
  params,
}: {
  params: { postId: string };
}) {
  const post = await getPost({ _id: params.postId });
  if (!post) return notFound();
  return (
    <div className="p-4">
      <PostDisplay post={post} />
    </div>
  );
}
