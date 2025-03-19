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

/**
 * Retrieves a single post by its unique slug.
 *
 * @param slug - The unique URL-friendly identifier for the post.
 * @returns A promise resolving to the post object if found, otherwise `null`.
 * @throws Throws an error if the database operation fails.
 */

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

/**
 * Creates a new blog post with the provided data.
 *
 * @param post - The data required to create the post.
 * @returns A promise resolving once the post has been successfully created.
 * @throws Throws an error if the post cannot be created due to validation or database issues.
 */
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

/**
 * Retrieves all posts stored in the database, sorted by creation date (most recent first).
 *
 * @returns A promise resolving to an array of post objects.
 * @throws Throws an error if the retrieval fails due to database issues.
 */
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

/**
 * Retrieves a single post matching at least one of the provided criteria.
 *
 * @param post - A partial object containing at least one criterion for searching the post (e.g., `_id`, `title`, `author`, etc.).
 * @returns A promise resolving to the post matching the provided criteria.
 * @throws Throws an error if no criteria are provided or the post isn't found.
 */
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

/**
 * Deletes a post identified by its unique identifier.
 *
 * @param post - The post object containing at least the `_id` field.
 * @returns A promise resolving when the deletion has successfully occurred.
 * @throws Throws an error if the post does not exist or the deletion fails.
 */
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

/**
 * Updates an existing post with the specified changes.
 *
 * @param postId - The unique identifier (`_id`) of the post to be updated.
 * @param updates - An object containing the fields and values to update.
 * @returns A promise resolving to the updated post object.
 * @throws Throws an error if the post does not exist or validation fails.
 */
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

/**
 * Retrieves all posts marked as published (not drafts), sorted by creation date (most recent first).
 *
 * @returns A promise resolving to an array of published post objects.
 * @throws Throws an error if the database operation fails.
 */
export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const uri = simplcms.db.getDatabaseUriEnvVariable();
    const db = await simplcms.db.connectToDatabase(uri);
    const { PostModel } = simplcms.db.getModels(db);
    const posts = await PostModel.find({ draft: false })
      .sort({ createdAt: -1 })
      .select("-__v");
    return postSchema.array().parse(posts);
  } catch (error) {
    console.error(`Could not get published posts: ${error}`);
    throw error;
  }
}

/**
 * Retrieves all posts marked as drafts, sorted by creation date (most recent first).
 *
 * @returns A promise resolving to an array of draft post objects.
 * @throws Throws an error if the database operation fails.
 */
export async function getDrafts(): Promise<Post[]> {
  try {
    const uri = simplcms.db.getDatabaseUriEnvVariable();
    const db = await simplcms.db.connectToDatabase(uri);
    const { PostModel } = simplcms.db.getModels(db);
    const drafts = await PostModel.find({ draft: true })
      .sort({ createdAt: -1 })
      .select("-__v");
    return postSchema.array().parse(drafts);
  } catch (error) {
    console.error(`Could not get draft posts: ${error}`);
    throw error;
  }
}

/**
 * Collection of functions to manage blog posts within the CMS.
 *
 * Provides CRUD (Create, Read, Update, Delete) operations, and additional methods to manage
 * post states, such as retrieving published posts or drafts.
 */
export const posts = {
  /** Updates an existing post by its ID with provided changes. */
  updatePost,

  /** Deletes a post by its ID. */
  deletePost,

  /** Retrieves a post matching provided criteria (e.g., ID, title, author). */
  getPost,

  /** Retrieves all existing posts sorted by most recent. */
  getAllPosts,

  /** Creates a new post with provided data. */
  createPost,

  /** Retrieves a post by its unique slug. */
  getPostBySlug,

  /** Retrieves all posts marked as published. */
  getPublishedPosts,

  /** Retrieves all posts marked as drafts. */
  getDrafts,
};
