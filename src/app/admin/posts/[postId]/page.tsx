import { getPost } from "@/packages/core/src/posts";
import { notFound } from "next/navigation";
import PostDisplay from "./postDisplay";

export default async function PostPage(props: {
  params: Promise<{ postId: string }>;
}) {
  const params = await props.params;
  const post = await getPost({ _id: params.postId });
  if (!post) return notFound();
  return (
    <div className="p-4">
      <PostDisplay post={post} />
    </div>
  );
}
