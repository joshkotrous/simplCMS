"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Bold, Italic, Heading, List, ListOrdered, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { CreatePost } from "@/types/types";
import { createNewPost } from "@/app/actions/post";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function MarkdownEditor() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState<CreatePost>({
    title: "",
    content: "",
    author: "",
    category: "",
    subtitle: "",
    draft: false,
  });

  function insertMarkdown(start: string, end: string = "") {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      const textBefore = postData.content.substring(0, selectionStart);
      const textAfter = postData.content.substring(selectionEnd);
      const selectedText = postData.content.substring(
        selectionStart,
        selectionEnd
      );
      const newText = `${textBefore}${start}${selectedText}${end}${textAfter}`;
      setPostData((previousState) => ({
        ...previousState,
        content: newText,
      }));
      textarea.focus();
    }
  }

  async function createPost(draft: boolean) {
    setLoading(true);
    const data = draft
      ? { ...postData, draft: true }
      : { ...postData, draft: false };
    toast.promise(createNewPost(data), {
      loading: "Creating post...",
      success: () => {
        router.refresh();
        router.push("/admin/posts");
        return "New post created";
      },
      error: () => {
        return "Error creating post";
      },
    });
    setLoading(false);
  }

  return (
    <Tabs defaultValue="edit" className="space-y-4">
      <div className="space-y-2">
        <Input
          value={postData.title}
          onChange={(event) => {
            setPostData((previousState) => ({
              ...previousState,
              title: event.target.value,
            }));
          }}
          placeholder="Post title..."
        />
        <Input
          value={postData.subtitle ?? ""}
          onChange={(event) => {
            setPostData((previousState) => ({
              ...previousState,
              subtitle: event.target.value,
            }));
          }}
          placeholder="Subtitle..."
        />
        <Input
          value={postData.category ?? ""}
          onChange={(event) => {
            setPostData((previousState) => ({
              ...previousState,
              category: event.target.value,
            }));
          }}
          placeholder="Category..."
        />
        <Input
          value={postData.author}
          onChange={(event) => {
            setPostData((previousState) => ({
              ...previousState,
              author: event.target.value,
            }));
          }}
          placeholder="Author(s)..."
        />
      </div>

      <div className="container mx-auto p-4 border rounded-lg">
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => insertMarkdown("**", "**")}
              size="sm"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => insertMarkdown("*", "*")}
              size="sm"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => insertMarkdown("# ")}
              size="sm"
            >
              <Heading className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => insertMarkdown("- ")}
              size="sm"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => insertMarkdown("1. ")}
              size="sm"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => insertMarkdown("> ")}
              size="sm"
            >
              <Quote className="h-4 w-4" />
            </Button>
          </div>

          <TabsList className="">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit">
          <Textarea
            value={postData.content}
            onChange={(event) => {
              setPostData((previousState) => ({
                ...previousState,
                content: event.target.value,
              }));
            }}
            placeholder="Type your Markdown here..."
            className="h-[34rem]"
          />
        </TabsContent>
        <TabsContent value="preview">
          <div className="prose max-w-none rounded border p-4">
            <ReactMarkdown className="h-[32rem]">
              {postData.content}
            </ReactMarkdown>
          </div>
        </TabsContent>
      </div>
      <div className="flex gap-2 w-full justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={loading} variant="destructive">
              Discard
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Discard Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to discard this post?
            </AlertDialogDescription>
            <div className="w-full flex justify-end gap-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Link href="/admin/posts">
                <AlertDialogAction>Discard Post</AlertDialogAction>
              </Link>
            </div>
          </AlertDialogContent>
        </AlertDialog>
        <div className="flex gap-2">
          <Button
            onClick={() => createPost(true)}
            disabled={
              !postData ||
              !postData.content ||
              !postData.title ||
              !postData.category ||
              !postData.author ||
              postData.content === "" ||
              postData.author === "" ||
              postData.category === "" ||
              postData.author === "" ||
              loading
            }
            variant="secondary"
          >
            Save Draft
          </Button>
          <Button
            disabled={
              !postData ||
              !postData.content ||
              !postData.title ||
              !postData.category ||
              !postData.author ||
              postData.content === "" ||
              postData.author === "" ||
              postData.category === "" ||
              postData.author === "" ||
              loading
            }
            onClick={() => createPost(false)}
            variant="default"
          >
            Create Post
          </Button>
        </div>
      </div>
    </Tabs>
  );
}
