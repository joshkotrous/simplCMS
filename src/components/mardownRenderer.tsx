"use client";
import Link from "next/link";
import { ComponentProps } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({ content }: { content: string }) {
  const markdownComponents: Components = {
    h1: (props: ComponentProps<"h1">) => (
      <h1 className="text-4xl font-bold" {...props} />
    ),
    h2: (props: ComponentProps<"h2">) => (
      <h2 className="text-3xl font-semibold" {...props} />
    ),
    h3: (props: ComponentProps<"h3">) => (
      <h3 className="text-2xl font-medium" {...props} />
    ),
    p: (props: ComponentProps<"p">) => (
      <p className="text-lg leading-relaxed" {...props} />
    ),
    a: ({ href, ...props }: ComponentProps<"a">) => (
      <Link
        href={href || "#"}
        className="text-blue-500 hover:underline"
        {...props}
      />
    ),
    ul: (props: ComponentProps<"ul">) => (
      <ul className="list-disc pl-5" {...props} />
    ),
    ol: (props: ComponentProps<"ol">) => (
      <ol className="list-decimal pl-5" {...props} />
    ),
    blockquote: (props: ComponentProps<"blockquote">) => (
      <blockquote
        className="border-l-4 border-gray-400 pl-4 italic text-zinc-600"
        {...props}
      />
    ),
    code: (props: ComponentProps<"code">) => (
      <code className="bg-zinc-800 text-white px-2 py-1 rounded" {...props} />
    ),
  };

  return (
    <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
}
