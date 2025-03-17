"use server";
import { Button } from "../../../../client/components/ui/button";
import PostsList from "../../../../client/components/postsList";
import Link from "next/link";
import { simplcms } from "../../../../../core";
export default async function PostsPage() {
  const posts = await simplcms.posts.getAllPosts();
  const publishedPosts = posts.filter((post) => !post.draft);

  return (
    <div className="flex flex-col h-full">
      <div className="w-full flex justify-between items-center p-4">
        <h2 className="text-3xl font-bold">Posts</h2>
        <Link href="/admin/posts/new">
          <Button>New Post</Button>
        </Link>
      </div>
      <div className="flex-1 overflow-hidden">
        <PostsList posts={publishedPosts} />
      </div>
    </div>
  );
}
