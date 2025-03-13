import { posts } from "@/packages/core/src/posts";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ComponentProps } from "react";
import remarkGfm from "remark-gfm";
import ReactMarkdown, { Components } from "react-markdown";
import { getServerEnvVars } from "@/packages/core/src/simplCms";
import MarkdownRenderer from "@/components/mardownRenderer";

export async function generateStaticParams() {
  const platformConfiguration = getServerEnvVars();
  if (platformConfiguration.database) {
    const allPosts = await posts.getAllPosts();
    return allPosts.map((post) => ({
      slug: post.slug.replace(/\.md$/, ""),
    }));
  } else {
    return [];
  }
}

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const post = await posts.getPostBySlug(slug);
  if (!post) {
    return { title: "SimplCMS | Blog" };
  }

  const metadata: Metadata = {
    title: `SimplCMS | ${post.title}`,
    description: post.subtitle,
    openGraph: {
      title: `SimplCMS | ${post.title}`,
      description: post.metadata.description ?? post.subtitle ?? "",
    },
  };

  if (post.metadata.ogImage) {
    metadata.openGraph = {
      ...metadata.openGraph,
      images: [
        {
          url: post.metadata.ogImage,
          width: 1200,
          height: 630,
          alt: post.title || "Blog post image",
        },
      ],
    };
  }

  return metadata;
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
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

  return (
    <div className="size-full flex min-h-screen justify-center pb-20 bg-background text-foreground pt-20 overflow-auto">
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
            <p>{formatDate(post.createdAt)}</p>
            {post.author && <p>by {post.author}</p>}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-zinc-500">Share this article</p>
          <div className="flex gap-2 items-center  ">{/*shareable */}</div>
        </div>

        <MarkdownRenderer content={post.content} />
      </div>
    </div>
  );
}
