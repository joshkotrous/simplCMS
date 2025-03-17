import { CreatePost, Post, postSchema } from "../../types/types";
import { simplcms } from "../../core";

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const uri = simplcms.db.getDatabaseUriEnvVariable();

    const db = await simplcms.db.connectToDatabase(uri);
    const { PostModel } = simplcms.db.getModels(db);

    const post = await PostModel.findOne({ slug }).select("-__v");

    if (!post) {
      return null;
    }

    return postSchema.parse(post);
  } catch (error) {
    console.error(`Could not get post by slug: ${error}`);
    throw error;
  }
}

export async function createPost(post: CreatePost): Promise<void> {
  try {
    const uri = simplcms.db.getDatabaseUriEnvVariable();
    const db = await simplcms.db.connectToDatabase(uri);
    const { PostModel } = simplcms.db.getModels(db);
    const slug = createSlug(post.title);
    const postWithSlug = {
      ...post,
      slug,
    };
    const newPost = new PostModel(postWithSlug);
    await newPost.save();
  } catch (error) {
    console.error(`Could not create post ${error}`);
    throw error;
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const uri = simplcms.db.getDatabaseUriEnvVariable();

    const db = await simplcms.db.connectToDatabase(uri);
    const { PostModel } = simplcms.db.getModels(db);
    const posts = await PostModel.find({})
      .sort({ createdAt: -1 })
      .select("-__v");

    return postSchema.array().parse(posts);
  } catch (error) {
    console.error(`Could not get all posts ${error}`);
    throw error;
  }
}

export async function getPost(post: Partial<Post>): Promise<Post> {
  try {
    const uri = simplcms.db.getDatabaseUriEnvVariable();

    const db = await simplcms.db.connectToDatabase(uri);
    const { PostModel } = simplcms.db.getModels(db);
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

    const foundPost = await PostModel.findOne(query).select("-__v");

    if (!foundPost) {
      throw new Error("Post not found");
    }

    return postSchema.parse(foundPost);
  } catch (error) {
    console.error(`Could not get post: ${error}`);
    throw error;
  }
}

export async function deletePost(post: Post): Promise<void> {
  try {
    const uri = simplcms.db.getDatabaseUriEnvVariable();

    const db = await simplcms.db.connectToDatabase(uri);
    const { PostModel } = simplcms.db.getModels(db);
    const result = await PostModel.deleteOne({ _id: post._id });

    if (result.deletedCount === 0) {
      throw new Error("Post not found");
    }
  } catch (error) {
    console.error(`Could not delete post: ${error}`);
    throw error;
  }
}

export async function updatePost(
  postId: string,
  updates: Partial<Post>
): Promise<Post> {
  try {
    const uri = simplcms.db.getDatabaseUriEnvVariable();

    const db = await simplcms.db.connectToDatabase(uri);
    const { PostModel } = simplcms.db.getModels(db);
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { $set: updates },
      {
        new: true,
        runValidators: true,
        select: "-__v",
      }
    );

    if (!updatedPost) {
      throw new Error("Post not found");
    }

    return postSchema.parse(updatedPost);
  } catch (error) {
    console.error(`Could not update post: ${error}`);
    throw error;
  }
}

export const posts = {
  updatePost,
  deletePost,
  getPost,
  getAllPosts,
  createPost,
  getPostBySlug,
};
