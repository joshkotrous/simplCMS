import { posts } from "@/packages/core/src/posts";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ComponentProps } from "react";
import remarkGfm from "remark-gfm";
import ReactMarkdown, { Components } from "react-markdown";
import { getServerEnvVars } from "@/packages/core/src/simplCms";

export async function generateStaticParams() {
  const platformConfiguration = getServerEnvVars();
  if (platformConfiguration.database) {
    const allPosts = await posts.getAllPosts();
    return allPosts.map((post) => ({
      slug: post.slug.replace(/\.md$/, ""),
    }));
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await posts.getPostBySlug(slug);
  if (!post) {
    return { title: "SimplCMS | Blog" };
  }
  return {
    title: `SimplCMS | ${post.title}`,
    description: post.subtitle,
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await posts.getPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  const markdownComponents: Components = {
    h1: (props: ComponentProps<"h1">) => (
      <h1 className="text-4xl font-bold" {...props} />
    ),
    h2: (props: ComponentProps<"h2">) => (
      <h2 className="text-3xl font-semibold" {...props} />
    ),
    h3: (props: ComponentProps<"h3">) => (
      <h3 className="text-2xl font-medium text-zinc-600" {...props} />
    ),
    p: (props: ComponentProps<"p">) => (
      <p className="text-lg text-zinc-500 leading-relaxed" {...props} />
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
    <div className="w-full flex min-h-screen justify-center pb-20 bg-background text-foreground">
      <div
        id="blog"
        className="flex flex-col items-start max-w-5xl w-full p-4 gap-4"
      >
        <div className="text-zinc-500">
          <Link className="hover:underline text-foreground" href="/blog">
            Blog
          </Link>
          <span className="cursor-default"> / </span>
          <Link
            className="hover:underline text-foreground"
            href={`/blog/${slug}`}
          >
            {post.title}
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <div className="flex gap-2 text-nowrap text-zinc-500">
            <p>{post.createdAt.toLocaleDateString()}</p>
            {post.author && <p>by {post.author}</p>}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-zinc-500">Share this article</p>
          <div className="flex gap-2 items-center  ">{/*shareable */}</div>
        </div>

        <ReactMarkdown
          components={markdownComponents}
          remarkPlugins={[remarkGfm]}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
