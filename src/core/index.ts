/**
 * @module simplcms
 * @description
 * The main entry-point for the `simplcms` library, exposing the primary API objects and utilities.
 * This module aggregates the essential components required to interact with the CMS system, including
 * database operations, page management, media handling, user management, authentication providers,
 * posts handling, and general utilities.
 *
 * @example
 * ```typescript
 * import { simplcms } from 'simplcms';
 *
 * const pages = simplcms.posts.getAllPosts();
 * const mediaItem = simplcms.media.cloudinary.getMedia(');
 * ```
 */

import { platform } from "./platform";
import { media } from "./media";
import { pages } from "./pages";
import { providers } from "./providers";
import { posts } from "./posts";
import { db } from "./db";
import { users } from "./user";
import { defaultHomePageConfig, getEnvironment, getSiteUrl } from "./lib/utils";

/**
 * Primary CMS interface exposing core APIs for managing content, users, media, and configuration.
 */
export const simplcms = {
  /** API methods related to page operations such as creation, retrieval, updating, and deletion. */
  pages,

  /** API methods related to media handling such as uploads, retrieval, updates, and deletions. */
  media,

  /** Authentication and external service providers. */
  providers,

  /** API methods for handling blog or article posts, including CRUD operations and querying. */
  posts,

  /** Database interface providing direct or abstracted query methods and operations. */
  db,

  /** Information and methods regarding the platform/environment the CMS is running on. */
  platform,

  /** Retrieve the current runtime environment (e.g., development, production, testing). */
  getEnvironment,

  /** Returns the base URL of the currently running CMS site. */
  getSiteUrl,

  /** Default configuration settings for the CMS homepage. */
  defaultHomePageConfig,

  /** User-related API, including methods for managing authentication, authorization, and profiles. */
  users,
};

/**
 * Type definition representing the full API object of the CMS.
 */
export type SimplCms = typeof simplcms;
