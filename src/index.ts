import {
  checkSetupCompleted,
  getProviderSiteConfig,
  getServerEnvVars,
  getSetupStep,
  getSiteConfig,
  initSiteConfig,
  validateSetup,
} from "./core/platform";
import { media } from "./core/media";
import { pages } from "./core/pages";
import { providers } from "./core/providers";
import { posts } from "./core/posts";
import { db } from "./core/db";

import {
  cn,
  defaultHomePageConfig,
  getEnvironment,
  getSiteUrl,
} from "./core/lib/utils";

export const simplCms = {
  pages,
  media,
  providers,
  posts,
  db,
  validateSetup,
  checkSetupCompleted,
  getSetupStep,
  getServerEnvVars,
  getSiteConfig,
  initSiteConfig,
  getProviderSiteConfig,
  getEnvironment,
  cn,
  getSiteUrl,
  defaultHomePageConfig,
};

export type SimplCms = typeof simplCms;
