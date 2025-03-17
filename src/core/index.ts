import { platform } from "./platform";
import { media } from "./media";
import { pages } from "./pages";
import { providers } from "./providers";
import { posts } from "./posts";
import { db } from "./db";
import { users } from "./user";
import { defaultHomePageConfig, getEnvironment, getSiteUrl } from "./lib/utils";

export const simplcms = {
  pages,
  media,
  providers,
  posts,
  db,
  platform,
  getEnvironment,
  getSiteUrl,
  defaultHomePageConfig,
  users,
};

export type SimplCms = typeof simplcms;
