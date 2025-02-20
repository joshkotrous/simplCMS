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
  SetupStep,
  simplCMSDBObject,
  simplCMSHostConfigurationObject,
  simplCMSHostObject,
  simplCMSMediaStorageObject,
  simplCMSOAuthObject,
  SimplCMSPlatformConfiguration,
  SiteConfig,
  siteConfigSchema,
} from "@/types/types";
import { error } from "console";

type SetupValidationComponent = {
  setupComplete: boolean;
  errors: string[];
};

type SetupValidation = {
  [K in SetupStep]: SetupValidationComponent;
};

export function validateSetup(): Partial<SetupValidation> {
  const envVars = getServerEnvVars();
  let validation: Partial<SetupValidation> = {};

  if (!envVars.host) {
    validation.host = {
      setupComplete: false,
      errors: ["Host configuration not found"],
    };
  } else if (envVars.host.provider === null) {
    validation.host = {
      setupComplete: false,
      errors: ["Host provider not yet configured"],
    };
  } else {
    switch (envVars.host.provider) {
      case "Vercel": {
        const errors = [];
        if (!envVars.host.vercel?.token) {
          errors.push("Vercel token is not configured");
        }
        if (!envVars.host.vercel?.projectId) {
          errors.push("Vercel project not configured");
        }
        if (!envVars.host.vercel?.teamId) {
          errors.push("Vercel team is not configured");
        }
        validation.host = {
          setupComplete: errors.length === 0,
          errors: errors,
        };
        break;
      }
      default: {
        validation.host = {
          setupComplete: false,
          errors: ["Invalid host provider configured"],
        };
        break;
      }
    }
  }

  if (!envVars.database) {
    validation.database = {
      setupComplete: false,
      errors: ["Database configuration not found"],
    };
  } else if (envVars.database.provider === null) {
    validation.database = {
      setupComplete: false,
      errors: ["Database provider not yet configured"],
    };
  } else {
    switch (envVars.database.provider) {
      case "MongoDB": {
        const errors = [];
        if (!envVars.database.mongo?.uri) {
          errors.push("Mongo uri is not configured");
        }
        validation.database = {
          setupComplete: errors.length === 0,
          errors: errors,
        };
        break;
      }

      case "DynamoDB": {
        const errors = [];
        if (!envVars.database.dynamo?.accessKeyId) {
          errors.push("Access key ID not configured");
        }
        if (!envVars.database.dynamo?.accessSecretKey) {
          errors.push("Access key secret is not configured");
        }
        if (!envVars.database.dynamo?.region) {
          errors.push("Region is not configured");
        }
        if (!envVars.database.dynamo?.tableName) {
          errors.push("Table name is not configured");
        }
        validation.database = {
          setupComplete: errors.length === 0,
          errors: errors,
        };
        break;
      }

      default: {
        validation.database = {
          setupComplete: false,
          errors: ["Invalid database provider configured"],
        };
        break;
      }
    }
  }

  if (!envVars.oauth) {
    validation.oauth = {
      setupComplete: false,
      errors: ["OAuth configuration not found"],
    };
  } else if (envVars.oauth.length === 0) {
    validation.oauth = {
      setupComplete: false,
      errors: ["No OAuth providers configured"],
    };
  } else {
    const errors: string[] = [];
    envVars.oauth.forEach((oauthConfig) => {
      switch (oauthConfig.provider) {
        case "Google": {
          if (!oauthConfig.google?.clientId) {
            errors.push("Google OAuth client ID not configured");
          }
          if (!oauthConfig.google?.clientSecret) {
            errors.push("Google OAuth client secret not configured");
          }
          break;
        }
        default: {
          errors.push(
            `Invalid OAuth provider configured: ${oauthConfig.provider}`
          );
        }
      }
    });

    validation.oauth = {
      setupComplete: errors.length === 0,
      errors: errors,
    };
  }

  if (!envVars.mediaStorage) {
    validation.mediaStorage = {
      setupComplete: false,
      errors: ["Media storage configuration not found"],
    };
  } else if (envVars.mediaStorage.length === 0) {
    validation.mediaStorage = {
      setupComplete: false,
      errors: ["No media storage providers configured"],
    };
  } else {
    const errors: string[] = [];
    envVars.mediaStorage.forEach((storageConfig) => {
      switch (storageConfig.provider) {
        case "Cloudinary": {
          if (!storageConfig.cloudinary?.uri) {
            errors.push("Cloudinary URI not configured");
          }
          break;
        }
        case "AWS S3": {
          if (!storageConfig.s3?.bucketName) {
            errors.push("S3 bucket name not configured");
          }
          if (!storageConfig.s3?.region) {
            errors.push("S3 region not configured");
          }
          if (!storageConfig.s3?.accessKeyId) {
            errors.push("S3 access key ID not configured");
          }
          if (!storageConfig.s3?.accessSecretKey) {
            errors.push("S3 access secret key not configured");
          }
          break;
        }
        default: {
          errors.push(
            `Invalid media storage provider configured: ${storageConfig.provider}`
          );
        }
      }
    });

    validation.mediaStorage = {
      setupComplete: errors.length === 0,
      errors: errors,
    };
  }

  if (!validation.database?.setupComplete) {
    validation.adminUser = {
      setupComplete: false,
      errors: ["Database must be configured before setting up admin user"],
    };
  } else {
    validation.adminUser = {
      setupComplete: false, // For now, always false until we implement proper admin user check
      errors: ["Admin user needs to be created"],
    };
  }

  const redeployRequired = true; // if env vars are not configured on the server but are in provider
  if (redeployRequired) {
    validation.redeploy = {
      setupComplete: false,
      errors: ["Redploy is required for changes to take effect"],
    };
  } else {
    validation.redeploy = {
      setupComplete: true,
      errors: [],
    };
  }
  return validation;
}

export function checkSetupCompleted(
  setupValidation: Partial<SetupValidation>
): boolean {
  let setupComplete = true;

  Object.values(setupValidation).forEach((component) => {
    if (component.setupComplete === false) {
      setupComplete = false;
    }
  });

  return setupComplete;
}

// export function getSetupStatus(): {
//   complete: boolean;
//   step: SetupStep;
// } {
//   const setupValidation = validateSetup();
// }

export function getServerEnvVars(): SimplCMSPlatformConfiguration {
  const host = simplCMSHostObject.nullable().parse(
    process.env.SIMPLCMS_HOST_PROVIDER
      ? {
          provider: process.env.SIMPLCMS_HOST_PROVIDER,
          vercel:
            process.env.SIMPLCMS_HOST_PROVIDER === "Vercel"
              ? {
                  token: process.env.VERCEL_TOKEN ?? null,
                  teamId: process.env.VERCEL_TEAM_ID ?? null,
                  projectId: process.env.VERCEL_PROJECT_ID ?? null,
                }
              : undefined,
        }
      : null
  );

  const database = simplCMSDBObject.nullable().parse(
    process.env.SIMPLCMS_DB_PROVIDER
      ? {
          provider: process.env.SIMPLCMS_DB_PROVIDER,
          mongo:
            process.env.SIMPLCMS_DB_PROVIDER === "MongoDB"
              ? {
                  uri: process.env.MONGO_URI ?? null,
                }
              : undefined,
          dynamo:
            process.env.SIMPLCMS_DB_PROVIDER === "DynamoDB"
              ? {
                  tableName: process.env.DYNAMODB_TABLE_NAME ?? null,
                  region: process.env.DYNAMODB_REGION ?? null,
                  accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID ?? null,
                  accessSecretKey:
                    process.env.DYNAMODB_ACCESS_SECRET_KEY ?? null,
                }
              : undefined,
        }
      : null
  );

  const oauth = simplCMSOAuthObject.nullable().parse(
    process.env.SIMPLCMS_OAUTH_PROVIDERS
      ? process.env.SIMPLCMS_OAUTH_PROVIDERS.split(",")
          .filter(Boolean)
          .map((provider) => {
            const trimmedProvider = provider.trim();
            return {
              provider: trimmedProvider,
              google:
                trimmedProvider === "Google"
                  ? {
                      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID ?? null,
                      clientSecret:
                        process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? null,
                    }
                  : undefined,
            };
          })
      : null
  );

  const mediaStorage = simplCMSMediaStorageObject.nullable().parse(
    process.env.SIMPLCMS_MEDIA_STORAGE_PROVIDERS
      ? process.env.SIMPLCMS_MEDIA_STORAGE_PROVIDERS.split(",")
          .filter(Boolean)
          .map((provider) => {
            const trimmedProvider = provider.trim();
            return {
              provider: trimmedProvider,
              cloudinary:
                trimmedProvider === "Cloudinary"
                  ? {
                      uri: process.env.CLOUDINARY_URL ?? null,
                    }
                  : undefined,
              s3:
                trimmedProvider === "AWS S3"
                  ? {
                      bucketName: process.env.AWS_S3_BUCKET_NAME ?? null,
                      region: process.env.AWS_S3_REGION ?? null,
                      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID ?? null,
                      accessSecretKey:
                        process.env.AWS_S3_ACCESS_SECRET_KEY ?? null,
                    }
                  : undefined,
            };
          })
      : null
  );

  return {
    host,
    database,
    oauth,
    mediaStorage,
  };
}

export function getProviderEnvVars(provider: HostProvider) {}

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
    const { host, database, oauth, mediaStorage } = getServerEnvVars();
    const uri = getDatabaseUriEnvVariable();
    if (!host || !database || !mediaStorage || !oauth)
      throw new Error("Setup is not completed");
    await connectToDatabase(uri);
    const data: CreateSiteConfig = {
      logo: null,
      simplCMSHostProvider: host.provider,
      simplCMSDbProvider: database.provider,
      simplCMSMediaStorageProviders: mediaStorage.map(
        (provider) => provider.provider
      ),
      simplCMSOauthProviders: oauth.map((provider) => provider.provider),
    };
    const config = new SiteConfigModel(data);
    await config.save();
  } catch (error) {
    console.error(`Could not create site configuration: ${error}`);
    throw error;
  }
}

export * as simplCms from ".";
