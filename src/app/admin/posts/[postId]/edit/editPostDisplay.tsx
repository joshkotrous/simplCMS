"use client";

import * as postActions from "@/app/actions/post";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Post, SimplCMSMedia } from "@/types/types";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MarkdownEditor } from "../../new/textEditor";
import { Deployments } from "@vercel/sdk/models/getdeploymentsop.js";

export default function EditPostDisplay({
  post,
  media,
  latestDeployment,
}: {
  post: Post;
  media: SimplCMSMedia[];
  latestDeployment: Deployments | null;
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

  async function updateDraft(draft: boolean) {
    toast.promise(postActions.updatePostAction(post._id, { draft: draft }), {
      loading: "Updating post...",
      success: () => {
        router.refresh();
        return draft
          ? "Sucessfully saved post as draft."
          : "Sucessfully published post.";
      },
      error: () => {
        return "Error updating post.";
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="w-full flex justify-between gap-8">
          <div className="flex gap-4 items-center">
            {post.draft && (
              <div className="text-xs bg-zinc-200 dark:bg-zinc-800 w-fit p-1 rounded  left-2 top-2">
                DRAFT
              </div>
            )}
          </div>
          <div className="flex gap-2 items-center">
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
        <p>Created on: {new Date(post.createdAt).toLocaleDateString()}</p>
        <MarkdownEditor
          latestDeployment={latestDeployment}
          media={media}
          post={post}
        />
      </div>
    </div>
  );
}
