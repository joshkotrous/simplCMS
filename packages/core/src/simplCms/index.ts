import connectToDatabase, { getDatabaseUriEnvVariable } from "@/db";
import { SiteConfigModel } from "@/db/schema";
import {
  CreateSiteConfig,
  DBProvider,
  dbProviderSchema,
  HostProvider,
  hostProviderSchema,
  MediaStorageProvider,
  mediaStorageProviderSchema,
  OAuthProvider,
  oauthProviderSchema,
  SiteConfig,
  siteConfigSchema,
} from "@/types/types";

export function getEnvironmentVars(): {
  hostProvider: HostProvider;
  dbProvider: DBProvider;
  oauthProviders: OAuthProvider[];
  mediaStorageProviders: MediaStorageProvider[];
} {
  if (!process.env.SIMPLCMS_HOST_PROVIDER)
    throw new Error("SIMPLCMS_HOST_PROVIDER is not configured");
  if (!process.env.SIMPLCMS_DB_PROVIDER)
    throw new Error("SIMPLCMS_HOST_PROVIDER is not configured");
  if (!process.env.SIMPLCMS_OAUTH_PROVIDERS)
    throw new Error("SIMPLCMS_HOST_PROVIDER is not configured");
  if (!process.env.SIMPLCMS_MEDIA_STORAGE_PROVIDERS)
    throw new Error("SIMPLCMS_HOST_PROVIDER is not configured");

  const hostProvider = hostProviderSchema.parse(
    process.env.SIMPLCMS_HOST_PROVIDER
  );

  const dbProvider = dbProviderSchema.parse(process.env.SIMPLCMS_DB_PROVIDER);
  console.log(process.env.SIMPLCMS_OAUTH_PROVIDERS?.split(","));
  const oauthProviders = oauthProviderSchema
    .array()
    .parse(process.env.SIMPLCMS_OAUTH_PROVIDERS?.split(","));
  const mediaStorageProviders = mediaStorageProviderSchema
    .array()
    .parse(process.env.SIMPLCMS_MEDIA_STORAGE_PROVIDERS.split(","));

  return { hostProvider, dbProvider, oauthProviders, mediaStorageProviders };
}

export async function getSiteConfig(): Promise<SiteConfig | null> {
  try {
    const uri = getDatabaseUriEnvVariable();

    await connectToDatabase(uri);

    const config = await SiteConfigModel.findOne().select("-__v");

    return siteConfigSchema.nullable().parse(config);
  } catch (error) {
    console.error(`Could not get site config ${error}`);
    throw error;
  }
}

export async function initSiteConfig(): Promise<void> {
  try {
    const { hostProvider, dbProvider, oauthProviders, mediaStorageProviders } =
      getEnvironmentVars();
    const uri = getDatabaseUriEnvVariable();

    await connectToDatabase(uri);
    const data: CreateSiteConfig = {
      logo: null,
      simplCMSHostProvider: hostProvider,
      simplCMSDbProvider: dbProvider,
      simplCMSMediaStorageProviders: mediaStorageProviders,
      simplCMSOauthProviders: oauthProviders,
    };
    const config = new SiteConfigModel(data);
    await config.save();
  } catch (error) {
    console.error(`Could not create site configuration: ${error}`);
    throw error;
  }
}

export * as simplCms from ".";
