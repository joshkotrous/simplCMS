"use server";
import { Button } from "../../../../client/components/ui/button";
import Link from "next/link";
import PostsList from "../../../../client/components/postsList";
import { simplcms } from "../../../../../core";
export default async function DraftsPage() {
  const posts = await simplcms.posts.getAllPosts();
  const draftPosts = posts.filter((post) => post.draft);
  return (
    <div className="flex flex-col h-full">
      <div className="w-full flex justify-between items-center p-4">
        <h2 className="text-3xl font-bold">Posts</h2>
        <Link href="/admin/posts/new">
          <Button>New Post</Button>
        </Link>
      </div>
      <div className="flex-1 overflow-hidden">
        <PostsList posts={draftPosts} />
      </div>
    </div>
  );
}
