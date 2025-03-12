"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Post } from "@/types/types";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as postActions from "@/app/actions/post";
import { toast } from "sonner";
import { useState } from "react";

export default function PostsList({ posts }: { posts: Post[] }) {
  const path = usePathname();
  const router = useRouter();
  const isDrafts = path.endsWith("/drafts");
  const categories = [...new Set(posts.map((post) => post.category))];
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleCardClick = (postId: string) => {
    router.push(`/admin/posts/${postId}`);
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  async function deletePost(post: Post) {
    toast.promise(postActions.deletePostAction(post), {
      loading: "Deleting post...",
      success: () => {
        router.refresh();
        return "Successfully deleted post";
      },
      error: () => {
        return "Error deleting post";
      },
    });
  }

  async function moveToDrafts(post: Post) {
    const updatedPost: Post = { ...post, draft: true };
    toast.promise(postActions.updatePostAction(post._id, updatedPost), {
      loading: "Moving to drafts...",
      success: () => {
        router.refresh();
        return "Successfully moved to drafts";
      },
      error: () => {
        return "Error moving post to drafts";
      },
    });
  }

  async function publishPost(post: Post) {
    const updatedPost: Post = { ...post, draft: false };
    toast.promise(postActions.updatePostAction(post._id, updatedPost), {
      loading: "Publishing post...",
      success: () => {
        router.refresh();
        return "Successfully published post";
      },
      error: () => {
        return "Error publishing post";
      },
    });
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex w-full border-b">
        <Link href="/admin/posts">
          <div
            className={`px-8 hover:border-b-foreground hover:border-b-2 ${
              !isDrafts && "border-b-foreground border-b-2"
            }`}
          >
            Published
          </div>
        </Link>
        <Link href="/admin/posts/drafts">
          <div
            className={`px-8 hover:border-b-foreground hover:border-b-2 ${
              isDrafts && "border-b-foreground border-b-2"
            }`}
          >
            Drafts
          </div>
        </Link>
      </div>
      <div className="flex gap-2 w-full p-4">
        <Input className="w-3/4" placeholder="Search..." />
        <Select>
          <SelectTrigger className="w-1/4">Category</SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category ?? ""}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <Card
              key={post._id}
              className="relative hover:scale-[99%] transition-all rounded-lg cursor-pointer"
              onClick={() => handleCardClick(post._id)}
            >
              <CardHeader className="p-2">
                <div className="w-full flex justify-between items-center">
                  <span className="font-bold text-lg">{post.title}</span>
                  <div onClick={handleDropdownClick}>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Ellipsis className="cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/posts/${post._id}/edit`);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            if (post.draft) {
                              publishPost(post);
                            } else {
                              moveToDrafts(post);
                            }
                          }}
                        >
                          {post.draft ? "Publish Post" : "Move to Drafts"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setPostToDelete(post);
                            setIsAlertOpen(true);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex w-full justify-between">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <span>by {post.author}</span>
              </CardHeader>
              <CardContent className="px-2">
                <span>{post.subtitle}</span>
                <span>{post.content}</span>
              </CardContent>
              <div className="w-full flex justify-end p-2">
                {post.draft && (
                  <div className="text-xs bg-zinc-200 dark:bg-zinc-800 w-fit p-1 rounded left-2 top-2">
                    DRAFT
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Separate AlertDialog outside of the card loop */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogTitle>Delete Post</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this post?
          </AlertDialogDescription>
          <div className="w-full flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (postToDelete) {
                  deletePost(postToDelete);
                }
                setIsAlertOpen(false);
              }}
            >
              Delete Post
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
