import { posts } from "@/packages/core/src/posts";
import PostList from "./postList";

export default async function BlogPage() {
  const allPosts = await posts.getAllPosts();

  const publishedPosts = allPosts.filter((post) => !post.draft);
  return (
    <div className="bg-background size-full text-foreground p-4">
      <div className="mx-auto container max-w-5xl">
        <h1 className="text-4xl font-bold">Blog</h1>
        <PostList posts={publishedPosts} />
      </div>
    </div>
  );
}
