"use server";
import { createPost } from "@/packages/core/src/posts";
import { CreatePostType } from "@/types/types";

export async function createNewPost(post: CreatePostType): Promise<void> {
  try {
    await createPost(post);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
