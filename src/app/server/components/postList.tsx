"use server";
import { Post } from "../../../../types/types";
import { simplcms } from "../../../core";
import Link from "next/link";

export default async function PostList() {
  const platformConfiguration = simplcms.platform.getPlatformConfiguration();
  let publishedPosts: Post[] = [];
  if (platformConfiguration.database) {
    const allPosts = await simplcms.posts.getAllPosts();
    publishedPosts = allPosts.filter((post) => !post.draft);
  }
  return (
    <div>
      {publishedPosts.map((post) => (
        <Link key={post._id} href={`/blog/${post.slug}`}>
          <div className="flex flex-col gap-4 border-b pb-2">
            <div className="space-y-1">
              <div className="w-full flex justify-between items-center">
                <h2 className="leading-none text-3xl">{post.title}</h2>
                <p>{post.createdAt.toLocaleDateString()}</p>
              </div>
              <div>{post.author}</div>
              <div className="text-zinc-400">{post.subtitle}</div>
            </div>

            <div className="bg-zinc-800 w-fit px-2 rounded-md">
              {post.category}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
