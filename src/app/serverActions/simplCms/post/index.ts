"use server";
import { createPost, deletePost, updatePost } from "@/posts";
import { CreatePost, Post } from "@/types/types";

export async function createNewPost(post: CreatePost): Promise<void> {
  try {
    await createPost(post);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deletePostAction(post: Post): Promise<void> {
  try {
    await deletePost(post);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updatePostAction(
  postId: string,
  post: Partial<Post>
): Promise<void> {
  try {
    await updatePost(postId, post);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
