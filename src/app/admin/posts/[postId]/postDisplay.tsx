"use client";

import * as postActions from "@/app/actions/post";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Post } from "@/types/types";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import MarkdownEditor from "../new/markdownEditor";
import { Button } from "@/components/ui/button";

export default function PostDisplay({ post }: { post: Post }) {
  const router = useRouter();
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [editedPost, setEditedPost] = useState<Post>(post);

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

  async function updatePost() {
    toast.promise(postActions.updatePostAction(post._id, editedPost), {
      loading: "Updating post...",
      success: () => {
        router.refresh();
        return "Sucessfully updated post.";
      },
      error: () => {
        return "Error updating post.";
      },
    });
    setMode("view");
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

  if (mode === "edit") {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="w-full flex justify-between gap-8">
            <div className="flex gap-4 items-center">
              <div className="space-y-1">
                <span className="text-zinc-200 dark:text-zinc-400 text-sm">
                  Title
                </span>
                <Input
                  placeholder="Title..."
                  style={{ fontSize: "1.875rem" }}
                  className="text-3xl font-bold py-6"
                  value={editedPost.title}
                  onChange={(e) =>
                    setEditedPost((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>

              {post.draft && (
                <div className="text-xs bg-zinc-200 dark:bg-zinc-800 w-fit p-1 rounded  left-2 top-2">
                  DRAFT
                </div>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <Button variant="destructive">Discard Changes</Button>
              {post.draft ? (
                <Button onClick={() => updateDraft(false)} variant="secondary">
                  Publish Post
                </Button>
              ) : (
                <Button onClick={() => updateDraft(true)} variant="secondary">
                  Move to Drafts
                </Button>
              )}
              <Button onClick={updatePost}>Save Changes</Button>
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
          <div className="flex gap-1 items-center">
            <div className="space-y-1">
              <span className="text-zinc-200 dark:text-zinc-400 text-sm">
                Author
              </span>
              <Input
                placeholder="Author..."
                value={editedPost.author}
                onChange={(e) =>
                  setEditedPost((prev) => ({ ...prev, author: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-zinc-200 dark:text-zinc-400 text-sm">
              Category
            </span>
            <Input
              placeholder="Category..."
              value={editedPost.category ?? ""}
              onChange={(e) =>
                setEditedPost((prev) => ({ ...prev, category: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <span className="text-zinc-200 dark:text-zinc-400 text-sm">
              Subtitle
            </span>
            <Input
              placeholder="Subtitle..."
              value={editedPost.subtitle ?? ""}
              onChange={(e) =>
                setEditedPost((prev) => ({ ...prev, subtitle: e.target.value }))
              }
            />
          </div>
        </div>

        <MarkdownEditor
          content={editedPost.content}
          onContentChange={(newContent) =>
            setEditedPost((prev) => ({ ...prev, content: newContent }))
          }
        />
      </div>
    );
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
          <Pencil onClick={() => setMode("edit")} className="size-4" />
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
      <p>{post.content}</p>
    </div>
  );
}
