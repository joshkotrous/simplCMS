"use server";
import { CreatePost, Post } from "../../../../../types/types";
import { simplcms } from "../../../../core";
export async function createNewPost(post: CreatePost): Promise<void> {
  try {
    await simplcms.posts.createPost(post);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deletePostAction(post: Post): Promise<void> {
  try {
    await simplcms.posts.deletePost(post);
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
    await simplcms.posts.updatePost(postId, post);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
