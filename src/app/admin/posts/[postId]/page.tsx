import { getPost } from "@/packages/core/src/posts";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: { postId: string };
}) {
  const post = await getPost({ _id: params.postId });
  if (!post) return notFound();
  return (
    <div className="p-4">
      <h2>{post.title}</h2>
      <p>{new Date(post.createdAt).toLocaleDateString()}</p>
      <p>{post.author}</p>
      <p>{post.category}</p>
      <p>{post.subtitle}</p>
      <p>{post.content}</p>
    </div>
  );
}
