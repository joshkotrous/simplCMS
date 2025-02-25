import { z } from "zod";

export const hostProviderSchema = z.enum(["Vercel"]);
export const dbProviderSchema = z.enum(["MongoDB", "DynamoDB"]);
export const oauthProviderSchema = z.enum(["Google", "GitHub", "Microsoft"]);
export const mediaStorageProviderSchema = z.enum(["Cloudinary", "AWS S3"]);
export const setupStepSchema = z.enum([
  "host",
  "database",
  "mediaStorage",
  "oauth",
  "redeploy",
  "adminUser",
]);
export type SetupStep = z.infer<typeof setupStepSchema>;

export const userSchema = z.object({
  _id: z.preprocess((val: any) => JSON.stringify(val._id), z.string()),
  email: z.string().email(),
  imageUrl: z.string().url(),
  name: z.string().nullable(),
  role: z.enum(["user", "admin"]),
  createdAt: z.date(),
});

export const postSchema = z.object({
  _id: z.preprocess((val: any) => JSON.stringify(val._id), z.string()),
  title: z.string(),
  content: z.string(),
  author: z.string(),
  createdAt: z.date(),
  category: z.string().nullable(),
  subtitle: z.string().nullable(),
  draft: z.boolean(),
  slug: z.string(),
});

export const pageInfoSchema = z.object({
  route: z.string(),
  filePath: z.string(),
  type: z.enum(["static", "dynamic"]),
  lastModified: z.date(),
});

export const cloudinaryMediaSchema = z.object({
  asset_id: z.string(),
  display_name: z.string(),
  resource_type: z.enum(["image", "video"]),
  secure_url: z.string().url(),
  format: z.string(),
});

const vercelConfig = z.object({
  token: z.string().nullable(),
  teamId: z.string().nullable(),
  projectId: z.string().nullable(),
});

const mongoConfig = z.object({ uri: z.string().nullable() });

const googleOauthConfig = z.object({
  clientId: z.string().nullable(),
  clientSecret: z.string().nullable(),
});

const cloudinaryConfig = z.object({
  uri: z.string().nullable(),
});

const awsS3Config = z.object({
  bucketName: z.string().nullable(),
  region: z.string().nullable(),
  accessKeyId: z.string().nullable(),
  accessSecretKey: z.string().nullable(),
});

const awsDynamoConfig = z.object({
  tableName: z.string().nullable(),
  region: z.string().nullable(),
  accessKeyId: z.string().nullable(),
  accessSecretKey: z.string().nullable(),
});

export const simplCMSHostObject = z.object({
  provider: hostProviderSchema,
  vercel: vercelConfig
    .extend({ projectName: z.string().nullable().optional() })
    .optional(),
});

export const simplCMSDBObject = z.object({
  provider: dbProviderSchema,
  mongo: mongoConfig.optional(),
  dynamo: awsDynamoConfig.optional(),
});

export const simplCMSOAuthObject = z
  .object({
    provider: oauthProviderSchema,
    google: googleOauthConfig.optional(),
  })
  .array();
export const simplCMSMediaStorageObject = z
  .object({
    provider: mediaStorageProviderSchema,
    cloudinary: cloudinaryConfig.optional(),
    s3: awsS3Config.optional(),
  })
  .array();

export const simplCMSHostConfigurationObject = z.object({
  host: simplCMSHostObject,
});
export const simplCMSDBConfigurationObject = z.object({
  database: simplCMSDBObject,
});
export const simplCMSOAuthConfigurationObject = z.object({
  oauth: simplCMSOAuthObject,
});
export const simplCMSOMediaStorageConfigurationObject = z.object({
  mediaStorage: simplCMSMediaStorageObject,
});

export const simplCMSPlatformConfigurationObject = z.object({
  host: simplCMSHostObject.nullable(),
  database: simplCMSDBObject.nullable(),
  oauth: simplCMSOAuthObject.nullable(),
  mediaStorage: simplCMSMediaStorageObject.nullable(),
});

export const siteConfigSchema = z.object({
  _id: z.string().transform((id) => ({ _id: id.toString() })),
  logo: z.string().nullable(),
  simplCMSHostProvider: hostProviderSchema,
  simplCMSDbProvider: dbProviderSchema,
  simplCMSOauthProviders: oauthProviderSchema.array(),
  simplCMSMediaStorageProviders: mediaStorageProviderSchema.array(),
});

export const userDocumentSchema = userSchema;
export const postDocumentSchema = postSchema;
export const siteConfigDocumentSchema = siteConfigSchema;

export const createSiteConfigSchema = siteConfigSchema.omit({ _id: true });
export const updateSiteConfigSchema = createSiteConfigSchema.partial();

export const createUserSchema = userSchema.omit({ _id: true, createdAt: true });
export const updateUserSchema = createUserSchema.partial();

export const createPostSchema = postSchema.omit({
  _id: true,
  createdAt: true,
  slug: true,
});
export const updatePostSchema = createPostSchema.partial();

export type OAuthProvider = z.infer<typeof oauthProviderSchema>;
export type MediaStorageProvider = z.infer<typeof mediaStorageProviderSchema>;
export type HostProvider = z.infer<typeof hostProviderSchema>;
export type DBProvider = z.infer<typeof dbProviderSchema>;
export type SiteConfig = z.infer<typeof siteConfigSchema>;
export type User = z.infer<typeof userSchema>;
export type Post = z.infer<typeof postSchema>;
export type PageInfo = z.infer<typeof pageInfoSchema>;
export type CloudinaryMedia = z.infer<typeof cloudinaryMediaSchema>;

export type CreateSiteConfig = z.infer<typeof createSiteConfigSchema>;
export type UpdateSiteConfig = z.infer<typeof updateSiteConfigSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type CreatePost = z.infer<typeof createPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
export type SimplCMSPlatformConfiguration = z.infer<
  typeof simplCMSPlatformConfigurationObject
>;
