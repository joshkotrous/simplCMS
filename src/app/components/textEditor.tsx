"use client";
import React, { useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Heading,
  List,
  ListOrdered,
  Quote,
  Image,
  Share2,
  Code,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Input } from "@/app/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import Link from "next/link";
import { CreatePost, Post, SimplCMSMedia } from "@/types";
import { createNewPost } from "@/app/serverActions/simplCms/post";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import MediaPopover from "@/app/components/mediaPopover";
import MarkdownRenderer from "@/app/components/mardownRenderer";
import { Label } from "@/app/components/ui/label";
import { Separator } from "@/app/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/components/ui/collapsible";
import { Deployments } from "@vercel/sdk/models/getdeploymentsop.js";
import * as vercelActions from "@/app/serverActions/providers/vercel";
import * as postActions from "@/app/serverActions/simplCms/post";
import useRedeployToast from "@/app/components/redeploymentToast";

// Language options for code blocks
const LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "jsx", label: "JSX" },
  { value: "tsx", label: "TSX" },
  { value: "css", label: "CSS" },
  { value: "html", label: "HTML" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "bash", label: "Bash" },
  { value: "sql", label: "SQL" },
  { value: "plaintext", label: "Plain Text" },
];

export function MarkdownEditor({
  media,
  latestDeployment,
  post,
}: {
  media: SimplCMSMedia[];
  latestDeployment: Deployments | null;
  post?: Post;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState<CreatePost>(
    post ?? {
      title: "",
      content: "",
      author: "",
      category: "",
      subtitle: "",
      draft: false,
      metadata: {
        title: "",
        description: "",
        ogImage: "",
      },
    }
  );
  const [hasOgImage, setHasOgImage] = useState(false);
  const { triggerRedeploy } = useRedeployToast();

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
      // Set cursor position after insertion
      setTimeout(() => {
        textarea.focus();
        const newPosition = selectionStart + start.length + selectedText.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  }

  function insertHeading(level: number) {
    const prefix = "#".repeat(level) + " ";
    insertMarkdown(prefix);
  }

  function insertCodeBlock(language: string = "") {
    const start = "```" + language + "\n";
    const end = "\n```";

    const textarea = document.querySelector("textarea");
    if (textarea) {
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      const selectedText = postData.content.substring(
        selectionStart,
        selectionEnd
      );

      // If text is selected, wrap it in code block
      if (selectedText) {
        insertMarkdown(start, end);
      } else {
        // If no text is selected, insert an empty code block and position cursor inside
        const textBefore = postData.content.substring(0, selectionStart);
        const textAfter = postData.content.substring(selectionEnd);
        const newText = `${textBefore}${start}${end}${textAfter}`;

        setPostData((previousState) => ({
          ...previousState,
          content: newText,
        }));

        // Set cursor position inside the code block
        setTimeout(() => {
          textarea.focus();
          const newPosition = selectionStart + start.length;
          textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
      }
    }
  }

  const handleMediaSelect = (selectedMedia: SimplCMSMedia) => {
    // Insert markdown for the selected image
    const imageMarkdown = `![${selectedMedia.name}](${selectedMedia.url})`;
    insertMarkdown(imageMarkdown);
  };

  const handleOgImageSelect = (selectedMedia: SimplCMSMedia) => {
    // Set the OG image URL in the metadata
    setPostData((previousState) => ({
      ...previousState,
      metadata: {
        ...previousState.metadata,
        ogImage: selectedMedia.url,
      },
    }));
    setHasOgImage(true);
  };

  async function submit(draft: boolean) {
    try {
      setLoading(true);
      if (post) {
        const preparedMetadata = {
          title: postData.metadata?.title || postData.title || "",
          description: postData.metadata?.description || "",
          ogImage: postData.metadata?.ogImage || "",
        };

        const updateData = {
          ...postData,
          draft: draft,
          metadata: preparedMetadata,
        };

        await toast.promise(
          postActions.updatePostAction(post._id, updateData),
          {
            loading: "Updating post...",
            success: () => {
              if (latestDeployment && !draft) {
                triggerRedeploy(latestDeployment);
              }
              router.refresh();
              router.push("/admin/posts");
              return draft
                ? "Successfully saved post as draft."
                : "Successfully published post.";
            },
            error: () => {
              return "Error updating post.";
            },
          }
        );
      } else {
        const preparedMetadata = {
          title: postData.metadata?.title || postData.title || "",
          description: postData.metadata?.description || "",
          ogImage: postData.metadata?.ogImage || "",
        };
        const data = {
          ...postData,
          draft: draft,
          metadata: preparedMetadata,
        };
        await toast.promise(createNewPost(data), {
          loading: "Creating post...",
          success: () => {
            if (latestDeployment && !draft) {
              triggerRedeploy(latestDeployment);
            }
            router.refresh();
            router.push("/admin/posts");
            return "New post created";
          },
          error: (err) => {
            console.error("Error creating post:", err);
            return "Error creating post";
          },
        });
      }
    } catch (error) {
      console.error("Unhandled error in submit:", error);
      toast.error("Failed to create/update post");
    } finally {
      setLoading(false);
    }
  }

  const isFormValid =
    postData &&
    postData.content &&
    postData.title &&
    postData.category &&
    postData.author &&
    postData.content !== "" &&
    postData.author !== "" &&
    postData.category !== "" &&
    !loading;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={postData.title}
            onChange={(event) => {
              setPostData((previousState) => ({
                ...previousState,
                title: event.target.value,
              }));
            }}
            placeholder="Enter post title..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            value={postData.subtitle ?? ""}
            onChange={(event) => {
              setPostData((previousState) => ({
                ...previousState,
                subtitle: event.target.value,
              }));
            }}
            placeholder="Enter subtitle..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={postData.category ?? ""}
              onChange={(event) => {
                setPostData((previousState) => ({
                  ...previousState,
                  category: event.target.value,
                }));
              }}
              placeholder="Enter category..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={postData.author}
              onChange={(event) => {
                setPostData((previousState) => ({
                  ...previousState,
                  author: event.target.value,
                }));
              }}
              placeholder="Enter author name(s)..."
            />
          </div>
        </div>
      </div>
      {/* SEO Metadata Section */}
      <Collapsible className="border border-zinc-800 rounded-md">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-zinc-800 rounded-md">
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <h3 className="text-sm font-medium">SEO & Social Sharing</h3>
          </div>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              value={postData.metadata?.title || ""}
              onChange={(event) => {
                setPostData((previousState) => ({
                  ...previousState,
                  metadata: {
                    ...previousState.metadata,
                    title: event.target.value,
                  },
                }));
              }}
              placeholder="SEO title (defaults to post title if empty)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={postData.metadata?.description || ""}
              onChange={(event) => {
                setPostData((previousState) => ({
                  ...previousState,
                  metadata: {
                    ...previousState.metadata,
                    description: event.target.value,
                  },
                }));
              }}
              placeholder="Brief description for search engines and social sharing"
              className="resize-none h-20"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Image</Label>
              <MediaPopover media={media} onSelect={handleOgImageSelect}>
                <Button variant="outline" size="sm" className="h-8">
                  {hasOgImage || postData.metadata?.ogImage
                    ? "Change Image"
                    : "Select Image"}
                </Button>
              </MediaPopover>
            </div>
            {postData.metadata?.ogImage && (
              <div className="relative rounded-md border overflow-hidden aspect-video w-full max-w-md mx-auto mt-2">
                <img
                  src={postData.metadata.ogImage}
                  alt="OG Image Preview"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              This image will be used when sharing the post on social media.
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
      <Tabs defaultValue="edit" className="space-y-4">
        <div className="border rounded-lg">
          <div className="flex gap-2 items-center justify-between p-2 border-b">
            <div className="flex gap-2 items-center">
              <Button
                variant="ghost"
                onClick={() => insertMarkdown("**", "**")}
                size="sm"
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => insertMarkdown("*", "*")}
                size="sm"
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>

              {/* Heading Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" title="Heading">
                    <Heading className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => insertHeading(1)}>
                    Heading 1
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => insertHeading(2)}>
                    Heading 2
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => insertHeading(3)}>
                    Heading 3
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => insertHeading(4)}>
                    Heading 4
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                onClick={() => insertMarkdown("- ")}
                size="sm"
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => insertMarkdown("1. ")}
                size="sm"
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => insertMarkdown("> ")}
                size="sm"
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </Button>

              {/* Code Block Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" title="Code Block">
                    <Code className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
                  <DropdownMenuItem onClick={() => insertCodeBlock()}>
                    Plain Code Block
                  </DropdownMenuItem>
                  <Separator className="my-1" />
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <DropdownMenuItem
                      key={lang.value}
                      onClick={() => insertCodeBlock(lang.value)}
                    >
                      {lang.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <MediaPopover media={media} onSelect={handleMediaSelect}>
                <Button variant="ghost" size="sm" title="Insert Image">
                  <Image className="size-4" />
                </Button>
              </MediaPopover>
            </div>
            <TabsList>
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>
          <div className="p-2">
            <TabsContent value="edit" className="mt-0">
              <div className="space-y-2">
                <Label htmlFor="content" className="sr-only">
                  Content
                </Label>
                <Textarea
                  id="content"
                  value={postData.content}
                  onChange={(event) => {
                    setPostData((previousState) => ({
                      ...previousState,
                      content: event.target.value,
                    }));
                  }}
                  placeholder="Type your Markdown here..."
                  className="h-[34rem] min-h-[200px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                />
              </div>
            </TabsContent>
            <TabsContent value="preview" className="mt-0">
              <div className="prose max-w-none rounded p-4 h-[34rem] overflow-auto">
                <MarkdownRenderer content={postData.content} />
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
      <div className="flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={loading} variant="destructive">
              Discard Changes
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Discard Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to discard changes?
            </AlertDialogDescription>
            <div className="w-full flex justify-end gap-2 mt-4">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Link href="/admin/posts">
                <AlertDialogAction>Discard Changes</AlertDialogAction>
              </Link>
            </div>
          </AlertDialogContent>
        </AlertDialog>
        <div className="flex gap-2">
          <Button
            onClick={() => submit(true)}
            disabled={!isFormValid}
            variant="secondary"
          >
            Save Draft
          </Button>
          <Button
            disabled={!isFormValid}
            onClick={() => submit(false)}
            variant="default"
          >
            {post ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </div>
    </div>
  );
}
