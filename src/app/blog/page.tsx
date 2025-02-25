import { posts } from "@/packages/core/src/posts";
import PostList from "./postList";
import { getServerEnvVars } from "@/packages/core/src/simplCms";
import { Post } from "@/types/types";

export default async function BlogPage() {
  const platformConfiguration = getServerEnvVars();
  let publishedPosts: Post[] = [];
  if (platformConfiguration.database) {
    const allPosts = await posts.getAllPosts();
    publishedPosts = allPosts.filter((post) => !post.draft);
  }

  return (
    <div className="bg-background size-full text-foreground p-4">
      <div className="mx-auto container max-w-5xl">
        <h1 className="text-4xl font-bold">Blog</h1>
        <PostList posts={publishedPosts} />
      </div>
    </div>
  );
}
