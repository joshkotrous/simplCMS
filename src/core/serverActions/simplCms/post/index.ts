"use server";
import { CreatePost, Post } from "../../../../types/types";
import { simplcms } from "../../..";

// Validate that input is a proper object
function validateObject(obj: any): boolean {
  return obj !== null && typeof obj === 'object';
}

export async function createNewPost(post: CreatePost): Promise<void> {
  try {
    // Validate the post object before passing it to the sensitive operation
    if (!validateObject(post)) {
      throw new Error('Invalid post data: expected an object');
    }
    
    await simplcms.posts.createPost(post);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deletePostAction(post: Post): Promise<void> {
  try {
    // Validate the post object before passing it to the sensitive operation
    if (!post || typeof post !== 'object' || !('id' in post) || typeof post.id !== 'string') {
      throw new Error("Invalid post object provided for deletion");
    }
    
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
    // Validate postId
    if (typeof postId !== 'string') {
      throw new Error('Invalid post ID: expected a string');
    }
    
    // Validate the post object before passing it to the sensitive operation
    if (!validateObject(post)) {
      throw new Error('Invalid post data: expected an object');
    }
    
    await simplcms.posts.updatePost(postId, post);
  } catch (error) {
    console.error(error);
    throw error;
  }
}