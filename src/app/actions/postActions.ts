"use server";
import { createPost, deletePost, updatePost } from "@/packages/core/src/posts";
import { CreatePostType, PostType } from "@/types/types";

export async function createNewPost(post: CreatePostType): Promise<void> {
  try {
    await createPost(post);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deletePostAction(post: PostType): Promise<void> {
  try {
    await deletePost(post);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updatePostAction(
  postId: string,
  post: Partial<PostType>
): Promise<void> {
  try {
    await updatePost(postId, post);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
