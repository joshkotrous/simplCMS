import {
  checkSetupCompleted,
  getProviderSiteConfig,
  getServerEnvVars,
  getSetupStep,
  getSiteConfig,
  initSiteConfig,
  validateSetup,
} from "./core/platform";
import * as media from "./core/media";
import * as pages from "./core/media";
import * as providers from "./core/providers";
import * as posts from "./core/posts";
import * as db from "./core/db";
import * as dev from "./core/dev";
import {
  cn,
  defaultHomePageConfig,
  getEnvironment,
  getSiteUrl,
} from "./core/lib/utils";

export const simplCms = {
  pages,
  validateSetup,
  checkSetupCompleted,
  getSetupStep,
  getServerEnvVars,
  getSiteConfig,
  initSiteConfig,
  getProviderSiteConfig,
  media,
  providers,
  getEnvironment,
  cn,
  getSiteUrl,
  defaultHomePageConfig,
  posts,
  db,
  dev,
};
