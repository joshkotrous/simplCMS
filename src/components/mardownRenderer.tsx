"use client";
import Link from "next/link";
import { ComponentProps } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function MarkdownRenderer({ content }: { content: string }) {
  const markdownComponents: Components = {
    h1: (props: ComponentProps<"h1">) => (
      <h1 className="text-4xl font-bold mb-6 mt-8" {...props} />
    ),
    h2: (props: ComponentProps<"h2">) => (
      <h2 className="text-3xl font-semibold mb-4 mt-6" {...props} />
    ),
    h3: (props: ComponentProps<"h3">) => (
      <h3 className="text-2xl font-medium mb-3 mt-5" {...props} />
    ),
    h4: (props: ComponentProps<"h4">) => (
      <h4 className="text-xl font-medium mb-2 mt-4" {...props} />
    ),
    p: (props: ComponentProps<"p">) => (
      <p className="text-lg leading-relaxed my-4" {...props} />
    ),
    a: ({ href, ...props }: ComponentProps<"a">) => (
      <Link
        href={href || "#"}
        className="text-blue-500 hover:underline"
        {...props}
      />
    ),
    ul: (props: ComponentProps<"ul">) => (
      <ul className="list-disc pl-5 my-4" {...props} />
    ),
    ol: (props: ComponentProps<"ol">) => (
      <ol className="list-decimal pl-5 my-4" {...props} />
    ),
    blockquote: (props: ComponentProps<"blockquote">) => (
      <blockquote
        className="border-l-4 border-gray-400 pl-4 italic text-zinc-600 my-4"
        {...props}
      />
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
      if (inline) {
        return (
          <code
            className="bg-zinc-800 text-white px-2 py-1 rounded font-mono text-sm"
            {...props}
          >
            {children}
          </code>
        );
      }

      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";

      return (
        <div className="my-6 rounded-md overflow-hidden">
          <div className="bg-zinc-900 text-zinc-400 text-xs px-4 py-1.5 flex justify-between items-center">
            <span>{language || "plain text"}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  String(children).replace(/\n$/, "")
                );
              }}
              className="hover:text-white text-xs"
            >
              Copy
            </button>
          </div>
          <SyntaxHighlighter
            style={oneDark}
            language={language}
            PreTag="div"
            className="rounded-b-md"
            showLineNumbers
            customStyle={{
              margin: 0,
              borderRadius: "0 0 0.375rem 0.375rem",
              fontSize: "0.9em",
            }}
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      );
    },
    img: (props: ComponentProps<"img">) => (
      <img
        className="max-w-full rounded-md my-6 mx-auto"
        {...props}
        alt={props.alt || ""}
      />
    ),
    table: (props: ComponentProps<"table">) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border-collapse" {...props} />
      </div>
    ),
    thead: (props: ComponentProps<"thead">) => (
      <thead className="bg-zinc-100 dark:bg-zinc-800" {...props} />
    ),
    tbody: (props: ComponentProps<"tbody">) => (
      <tbody className="divide-y" {...props} />
    ),
    tr: (props: ComponentProps<"tr">) => (
      <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900" {...props} />
    ),
    th: (props: ComponentProps<"th">) => (
      <th className="px-4 py-2 text-left font-semibold" {...props} />
    ),
    td: (props: ComponentProps<"td">) => (
      <td className="px-4 py-2 border-t" {...props} />
    ),
  };

  return (
    <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
}
