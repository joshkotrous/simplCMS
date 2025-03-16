import { platform } from "./core/platform";
import { media } from "./core/media";
import { pages } from "./core/pages";
import { providers } from "./core/providers";
import { posts } from "./core/posts";
import { db } from "./core/db";
import { users } from "./core/user";
import {
  cn,
  defaultHomePageConfig,
  getEnvironment,
  getSiteUrl,
} from "./core/lib/utils";
export { SimplCMSAuth } from "./app/server/routes/nextAuthRoute";
export { default as SimplCMSRouter } from "./app/server/router/adminRouter";

export const simplcms = {
  pages,
  media,
  providers,
  posts,
  db,
  platform,
  getEnvironment,
  cn,
  getSiteUrl,
  defaultHomePageConfig,
  users,
};

export type SimplCms = typeof simplcms;
