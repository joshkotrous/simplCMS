import connectToDatabase from "@/db";
import { Post } from "@/db/schema";
import { CreatePostType, PostType } from "@/types/types";

export async function createPost(post: CreatePostType): Promise<void> {
  try {
    await connectToDatabase();

    const newPost = new Post(post);
    await newPost.save();
  } catch (error) {
    console.error(`Could not create post ${error}`);
    throw error;
  }
}

export async function getAllPosts(): Promise<PostType[]> {
  try {
    await connectToDatabase();
    const posts = await Post.find({}).sort({ createdAt: -1 }).select("-__v");

    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error(`Could not get all posts ${error}`);
    throw error;
  }
}

export async function getPost(post: Partial<PostType>): Promise<PostType> {
  try {
    await connectToDatabase();

    let query = {};

    if (post._id) {
      query = { _id: post._id };
    } else if (post.title) {
      query = { title: post.title };
    } else if (post.author) {
      query = { author: post.author };
    } else if (post.category) {
      query = { category: post.category };
    } else if (post.subtitle) {
      query = { subtitle: post.subtitle };
    } else if (post.content) {
      query = { content: post.content };
    } else {
      throw new Error("At least one search criteria must be provided");
    }

    const foundPost = await Post.findOne(query).select("-__v");

    if (!foundPost) {
      throw new Error("Post not found");
    }

    return JSON.parse(JSON.stringify(foundPost));
  } catch (error) {
    console.error(`Could not get post: ${error}`);
    throw error;
  }
}
