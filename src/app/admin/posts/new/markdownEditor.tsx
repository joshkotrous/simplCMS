"use client";
import MarkdownRenderer from "@/components/mardownRenderer";
import MediaPopover from "@/components/mediaPopover";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { SimplCMSMedia } from "@/types/types";
import {
  Bold,
  Heading,
  Image,
  Italic,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function MarkdownEditor({
  content,
  onContentChange,
  media,
}: {
  content: string;
  onContentChange: (content: string) => void;
  media: SimplCMSMedia[];
}) {
  function insertMarkdown(start: string, end: string = "") {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      const textBefore = content.substring(0, selectionStart);
      const textAfter = content.substring(selectionEnd);
      const selectedText = content.substring(selectionStart, selectionEnd);
      const newText = `${textBefore}${start}${selectedText}${end}${textAfter}`;
      onContentChange(newText);
      textarea.focus();
    }
  }

  const handleMediaSelect = (selectedMedia: SimplCMSMedia) => {
    // Insert markdown for the selected image
    const imageMarkdown = `![${selectedMedia.name}](${selectedMedia.url})`;
    insertMarkdown(imageMarkdown);
  };

  return (
    <Tabs defaultValue="edit">
      <div className=" mx-auto p-4 border dark:border-zinc-800 rounded-lg">
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
            <MediaPopover media={media} onSelect={handleMediaSelect}>
              <Button variant="ghost" size="sm">
                <Image className="size-4" />
              </Button>
            </MediaPopover>
          </div>
          <TabsList className="">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="edit">
          <Textarea
            value={content}
            onChange={(event) => onContentChange(event.target.value)}
            placeholder="Type your Markdown here..."
            className="h-[34rem]"
          />
        </TabsContent>
        <TabsContent value="preview">
          <div className="prose max-w-none rounded border dark:border-zinc-800 p-4">
            <MarkdownRenderer content={content} />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
