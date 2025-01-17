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
import { PostType } from "@/types/types";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PostsList({ posts }: { posts: PostType[] }) {
  const path = usePathname();
  const isDrafts = path.endsWith("/drafts");
  return (
    <div className="w-[44rem] p-4 space-y-4 h-full">
      <div className="flex gap-8 w-full border-b">
        <Link href="/admin/posts">
          <div
            className={`p-2 hover:border-b-black hover:border-b-2 ${
              !isDrafts && "border-b-black border-b-2"
            }`}
          >
            Published
          </div>
        </Link>
        <Link href="/admin/posts/drafts">
          <div
            className={`p-2 hover:border-b-black hover:border-b-2 ${
              isDrafts && "border-b-black border-b-2"
            }`}
          >
            Drafts
          </div>
        </Link>
      </div>
      <div className="flex gap-2 w-full">
        <Input className="w-3/4" placeholder="Search..." />
        <Select>
          <SelectTrigger className="w-1/4">Category</SelectTrigger>
          <SelectContent>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-auto h-full">
        <div className="flex flex-1  flex-col gap-3">
          {posts.map((post) => (
            <Link href={`/admin/posts/${post._id}`} key={post._id}>
              <Card className="relative hover:scale-[99%] transition-all rounded-lg">
                <CardHeader className="p-2">
                  <div className="w-full flex justify-between items-center">
                    <span className="font-bold text-lg">{post.title}</span>

                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Ellipsis className=" right-2 cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <AlertDialogTrigger className="w-full">
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <AlertDialogContent>
                        <AlertDialogTitle>Delete Post</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this post?
                        </AlertDialogDescription>
                        <div className="w-full flex justify-end gap-2">
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Delete Post</AlertDialogAction>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
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
                    <div className="text-xs bg-zinc-200 w-fit p-1 rounded  left-2 top-2">
                      DRAFT
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
