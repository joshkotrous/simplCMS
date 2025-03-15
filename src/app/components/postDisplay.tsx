"use client";

import * as postActions from "@/app/serverActions/simplCms/post";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { Input } from "@/app/components/ui/input";
import { Post, SimplCMSMedia } from "@/types";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import MarkdownRenderer from "@/app/components/mardownRenderer";

export default function PostDisplay({
  post,
  media,
}: {
  post: Post;
  media: SimplCMSMedia[];
}) {
  const router = useRouter();

  async function deletePost() {
    toast.promise(postActions.deletePostAction(post), {
      loading: "Deleting post...",
      success: () => {
        router.refresh();
        router.push("/admin/posts");
        return "Successfully deleted post.";
      },
      error: () => {
        return "Error deleting post.";
      },
    });
  }

  return (
    <div>
      <div className="w-full flex justify-between">
        <div className="flex gap-4 items-center">
          <h2 className="text-3xl font-bold">{post.title}</h2>
          {post.draft && (
            <div className="text-xs bg-zinc-200 dark:bg-zinc-800 w-fit p-1 rounded  left-2 top-2">
              DRAFT
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <Link href={`/admin/posts/${post._id}/edit`}>
            <Pencil className="size-4" />
          </Link>
          <AlertDialog>
            <AlertDialogTrigger>
              <Trash className="size-4" />
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogTitle>Delete Post</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this post?
              </AlertDialogDescription>
              <div className="w-full flex justify-end gap-2">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deletePost}>
                  Delete Post
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <p>{new Date(post.createdAt).toLocaleDateString()}</p>
      <p>by {post.author}</p>
      <p>{post.category}</p>
      <p>{post.subtitle}</p>
      <MarkdownRenderer content={post.content} />
    </div>
  );
}
