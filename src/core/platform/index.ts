import {
  CreateSiteConfig,
  HostProvider,
  SetupStep,
  simplCMSDBObject,
  simplCMSHostObject,
  simplCMSMediaStorageObject,
  simplCMSOAuthObject,
  SimplCMSPlatformConfiguration,
  simplCMSPlatformConfigurationObject,
  SiteConfig,
  siteConfigSchema,
} from "../../types/types";
import { GetProjectEnvResponseBody } from "@vercel/sdk/models/getprojectenvop.js";
import {
  FilterProjectEnvsResponseBody,
  ResponseBodyEnvs,
} from "@vercel/sdk/models/filterprojectenvsop.js";
import { simplcms } from "../../core";

export type SetupValidationComponent = {
  setupComplete: boolean;
  errors: string[];
};

export type SetupValidation = {
  [K in SetupStep]: SetupValidationComponent;
};

function findEnvVar(
  envVars: FilterProjectEnvsResponseBody,
  key: string
): boolean {
  if ("envs" in envVars && Array.isArray(envVars.envs)) {
    return envVars.envs.some((env: ResponseBodyEnvs) => env.key === key);
  }
  return false;
}

export async function validateSetup({
  provider,
  vercelConfig,
  setupData,
}: {
  provider?: HostProvider;
  vercelConfig?: {
    token: string;
    projectId: string;
    teamId: string;
  };
  setupData?: SimplCMSPlatformConfiguration;
}): Promise<Partial<SetupValidation>> {
  const envVars = simplcms.platform.getPlatformConfiguration();

  if (!vercelConfig)
    return {
      host: {
        setupComplete: false,
        errors: [],
      },
      database: { setupComplete: false, errors: [] },
      mediaStorage: { setupComplete: false, errors: [] },
      oauth: { setupComplete: false, errors: [] },
      adminUser: { setupComplete: false, errors: [] },
      redeploy: { setupComplete: false, errors: [] },
    };
  const validation: Partial<SetupValidation> = {};

  const vercelClient = simplcms.providers.vercel.connect(vercelConfig.token);
  let providerEnvVars: FilterProjectEnvsResponseBody | null = null;
  try {
    providerEnvVars = await simplcms.providers.vercel.getProjectEnvVars({
      vercel: vercelClient,
      projectId: vercelConfig?.projectId,
      teamId: vercelConfig?.teamId,
    });
  } catch (error: any) {
    const errorMessage = JSON.parse(error.body).error.message;
    return {
      host: {
        setupComplete: false,
        errors: [errorMessage],
      },
      database: { setupComplete: false, errors: [] },
      mediaStorage: { setupComplete: false, errors: [] },
      oauth: { setupComplete: false, errors: [] },
      adminUser: { setupComplete: false, errors: [] },
      redeploy: { setupComplete: false, errors: [] },
    };
  }

  function checkRedeployNeeded(requiredVars: string[]): boolean {
    if (!providerEnvVars) throw new Error("Provider env vars is empty");

    return requiredVars.some(
      (varName) => findEnvVar(providerEnvVars, varName) && !process.env[varName]
    );
  }

  function checkSectionEnvVarsExist(sectionVars: string[]): boolean {
    if (!providerEnvVars) throw new Error("Provider env vars is empty");

    return sectionVars.some((varName) => findEnvVar(providerEnvVars, varName));
  }

  let redeployRequired = false;

  const hostVarNames = ["VERCEL_TOKEN", "VERCEL_PROJECT_ID", "VERCEL_TEAM_ID"];
  const mongoVarNames = ["MONGO_URI"];
  const dynamoVarNames = [
    "DYNAMODB_ACCESS_KEY_ID",
    "DYNAMODB_ACCESS_SECRET_KEY",
    "DYNAMODB_REGION",
    "DYNAMODB_TABLE_NAME",
  ];
  const googleOauthVarNames = [
    "GOOGLE_OAUTH_CLIENT_ID",
    "GOOGLE_OAUTH_CLIENT_SECRET",
    "SIMPLCMS_OAUTH_PROVIDERS",
    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",
  ];
  const cloudinaryVarNames = [
    "CLOUDINARY_URL",
    "SIMPLCMS_MEDIA_STORAGE_PROVIDERS",
  ];
  const s3VarNames = [
    "AWS_S3_BUCKET_NAME",
    "AWS_S3_BUCKET_REGION",
    "AWS_S3_ACCESS_KEY_ID",
    "AWS_S3_ACCESS_KEY_SECRET",
  ];

  // Host validation
  if (!envVars.host) {
    // Check if host vars exist in Vercel
    const hostVarsExistInProvider = checkSectionEnvVarsExist(hostVarNames);

    validation.host = {
      setupComplete: hostVarsExistInProvider, // True if found in provider
      errors: [],
    };

    // Still need to redeploy if vars exist in provider but not locally
    redeployRequired = redeployRequired || hostVarsExistInProvider;
  } else if (envVars.host.provider === null) {
    const hostVarsExistInProvider = checkSectionEnvVarsExist(hostVarNames);

    validation.host = {
      setupComplete: hostVarsExistInProvider, // True if found in provider
      errors: [],
    };

    // Still need to redeploy if vars exist in provider but not locally
    redeployRequired = redeployRequired || hostVarsExistInProvider;
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
          setupComplete:
            errors.length === 0 ||
            hostVarNames.every((v) => findEnvVar(providerEnvVars, v)),
          errors: errors,
        };
        redeployRequired =
          redeployRequired || checkRedeployNeeded(hostVarNames);
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

  // Database validation
  if (!envVars.database) {
    const dbVarsExistInProvider = checkSectionEnvVarsExist([
      ...mongoVarNames,
      ...dynamoVarNames,
    ]);

    validation.database = {
      setupComplete: dbVarsExistInProvider,
      errors: [],
    };

    redeployRequired = redeployRequired || dbVarsExistInProvider;
  } else if (envVars.database.provider === null) {
    const dbVarsExistInProvider = checkSectionEnvVarsExist([
      ...mongoVarNames,
      ...dynamoVarNames,
    ]);

    validation.database = {
      setupComplete: dbVarsExistInProvider,
      errors: [],
    };

    redeployRequired = redeployRequired || dbVarsExistInProvider;
  } else {
    switch (envVars.database.provider) {
      case "MongoDB": {
        const errors = [];
        let dbConnectionSuccessful = false;

        // Check if we have a URI to test with
        const mongoUri =
          setupData?.database?.mongo?.uri ?? process.env.MONGO_URI;

        if (!mongoUri) {
          errors.push("MongoDB URI is not configured");
        } else {
          try {
            console.log("Testing MongoDB connection with URI");
            const db = await simplcms.db.connectToDatabase(mongoUri);

            console.log("MongoDB connection successful");
            dbConnectionSuccessful = true;
          } catch (error: any) {
            console.error("MongoDB connection error:", error);
            errors.push(
              `Failed to connect to MongoDB: ${
                error.message || "Unknown error"
              }`
            );
            dbConnectionSuccessful = false;
          }
        }

        // Check if env vars are set in Vercel or locally
        const envVarsSetup = mongoVarNames.every(
          (v) => findEnvVar(providerEnvVars, v) || process.env[v]
        );

        validation.database = {
          setupComplete: dbConnectionSuccessful && envVarsSetup,
          errors: errors,
        };

        // If MongoDB is set up in provider but not locally, redeploy is needed
        redeployRequired =
          redeployRequired || checkRedeployNeeded(mongoVarNames);
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
          setupComplete:
            errors.length === 0 ||
            dynamoVarNames.every((v) => findEnvVar(providerEnvVars, v)),
          errors: errors,
        };
        redeployRequired =
          redeployRequired || checkRedeployNeeded(dynamoVarNames);
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

  const providersVar = findEnvVar(providerEnvVars, "SIMPLCMS_OAUTH_PROVIDERS");
  const oauthSetupInProvider =
    providersVar &&
    googleOauthVarNames.every((v) => findEnvVar(providerEnvVars, v));

  if (!envVars.oauth) {
    // Even if server env vars don't have OAuth, check if it's properly set in provider
    validation.oauth = {
      setupComplete: oauthSetupInProvider,
      errors: [],
    };
    redeployRequired =
      redeployRequired || checkRedeployNeeded(googleOauthVarNames);
  } else if (envVars.oauth.length === 0) {
    // Same here - check provider env vars
    validation.oauth = {
      setupComplete: oauthSetupInProvider,
      errors: oauthSetupInProvider ? [] : ["No OAuth providers configured"],
    };
    redeployRequired =
      redeployRequired || checkRedeployNeeded(googleOauthVarNames);
  } else {
    const errors: string[] = [];
    const oauthVars: string[] = [];
    envVars.oauth.forEach((oauthConfig) => {
      switch (oauthConfig.provider) {
        case "Google": {
          oauthVars.push(...googleOauthVarNames);
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

    // Check both server env vars and provider env vars
    validation.oauth = {
      setupComplete:
        errors.length === 0 ||
        oauthVars.every((v) => findEnvVar(providerEnvVars, v)) ||
        oauthSetupInProvider,
      errors: errors,
    };
    redeployRequired = redeployRequired || checkRedeployNeeded(oauthVars);
  }

  // Media storage validation
  if (!envVars.mediaStorage) {
    if (
      setupData?.mediaStorage &&
      "skipped" in setupData.mediaStorage &&
      setupData.mediaStorage.skipped === true
    ) {
      validation.mediaStorage = {
        setupComplete: true,
        errors: [],
      };
    } else {
      const storageVarsExistInProvider = checkSectionEnvVarsExist([
        ...cloudinaryVarNames,
        ...s3VarNames,
      ]);
      validation.mediaStorage = {
        setupComplete: storageVarsExistInProvider,
        errors: [],
      };
      redeployRequired = redeployRequired || storageVarsExistInProvider;
    }
  } else if (Array.isArray(envVars.mediaStorage)) {
    // Handle the array case
    if (envVars.mediaStorage.length === 0) {
      validation.mediaStorage = {
        setupComplete: false,
        errors: ["No media storage providers configured"],
      };
      redeployRequired =
        redeployRequired ||
        checkSectionEnvVarsExist([...cloudinaryVarNames, ...s3VarNames]);
    } else {
      const errors: string[] = [];
      const storageVars: string[] = [];

      envVars.mediaStorage.forEach((storageConfig) => {
        switch (storageConfig.provider) {
          case "Cloudinary": {
            storageVars.push(...cloudinaryVarNames);
            break;
          }
          case "AWS S3": {
            storageVars.push(...s3VarNames);
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
        setupComplete:
          errors.length === 0 ||
          storageVars.every((v) => findEnvVar(providerEnvVars, v)),
        errors: errors,
      };
      redeployRequired = redeployRequired || checkRedeployNeeded(storageVars);
    }
  }

  // Admin user validation
  if (!validation.database?.setupComplete) {
    validation.adminUser = {
      setupComplete: false,
      errors: [],
    };
  } else {
    try {
      const mongoUri = setupData?.database?.mongo?.uri || process.env.MONGO_URI;
      const users = await simplcms.users.getAllUsers(mongoUri);
      const adminUser = users.some((user) => user.role === "admin");
      validation.adminUser = {
        setupComplete: adminUser,
        errors: [],
      };
    } catch (error: any) {
      validation.adminUser = {
        setupComplete: false,
        errors: [error.message],
      };
    }
  }

  // Redeploy validation
  if (
    !validation.database?.setupComplete ||
    !validation.mediaStorage?.setupComplete ||
    !validation.oauth.setupComplete
  ) {
    redeployRequired = true;
  }

  validation.redeploy = {
    setupComplete: !redeployRequired,
    errors: redeployRequired
      ? ["Redeploy is required for changes to take effect"]
      : [],
  };

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

export function getSetupStep(setupValidation: Partial<SetupValidation>): {
  complete: boolean;
  step: SetupStep;
} {
  const steps: SetupStep[] = [
    "host",
    "database",
    "mediaStorage",
    "oauth",
    "adminUser",
    "redeploy",
  ];

  const isComplete = checkSetupCompleted(setupValidation);

  const currentStep =
    steps.find((step) => !setupValidation[step]?.setupComplete) || "adminUser"; // Default to adminUser if somehow all steps are complete

  return {
    complete: isComplete,
    step: currentStep,
  };
}

export function getPlatformConfiguration(): SimplCMSPlatformConfiguration {
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
                      region: process.env.AWS_S3_BUCKET_REGION ?? null,
                      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID ?? null,
                      accessSecretKey:
                        process.env.AWS_S3_ACCESS_KEY_SECRET ?? null,
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

export async function getSiteConfig(): Promise<SiteConfig | null> {
  try {
    const uri = simplcms.db.getDatabaseUriEnvVariable();
    if (!uri) return null;
    const db = await simplcms.db.connectToDatabase(uri);
    const { SiteConfigModel } = simplcms.db.getModels(db);
    const config = await SiteConfigModel.findOne().select("-__v");

    return siteConfigSchema.nullable().parse(config);
  } catch (error) {
    console.error(`Could not get site config ${error}`);
    throw error;
  }
}

export async function initSiteConfig(): Promise<void> {
  try {
    const { host, database, oauth, mediaStorage } =
      simplcms.platform.getPlatformConfiguration();
    const uri = simplcms.db.getDatabaseUriEnvVariable();
    if (!host || !database || !mediaStorage || !oauth)
      throw new Error("Setup is not completed");
    if (!uri) return;
    const db = await simplcms.db.connectToDatabase(uri);
    const { SiteConfigModel } = simplcms.db.getModels(db);

    // Handle the union type for mediaStorage
    let mediaStorageProviders: ("Cloudinary" | "AWS S3" | null)[] = [];

    if (Array.isArray(mediaStorage)) {
      // If it's an array, map it and ensure the type is correct
      mediaStorageProviders = mediaStorage.map((provider) => {
        // Only return the exact values expected by the type or null
        if (
          provider.provider === "Cloudinary" ||
          provider.provider === "AWS S3"
        ) {
          return provider.provider;
        }
        return null;
      });
    } else if (mediaStorage.skipped) {
      // If media storage is skipped, use an empty array
      mediaStorageProviders = [];
    }

    const data: CreateSiteConfig = {
      logo: null,
      simplCMSHostProvider: host.provider,
      simplCMSDbProvider: database.provider,
      simplCMSMediaStorageProviders: mediaStorageProviders,
      simplCMSOauthProviders: oauth.map((provider) => provider.provider),
    };

    const config = new SiteConfigModel(data);

    await config.save();
  } catch (error) {
    console.error(`Could not create site configuration: ${error}`);
    throw error;
  }
}

function findEnvVarId(
  envVars: FilterProjectEnvsResponseBody,
  key: string
): string | null {
  if ("envs" in envVars && Array.isArray(envVars.envs)) {
    const envVar = envVars.envs.find(
      (env: ResponseBodyEnvs) => env.key === key
    );
    return envVar?.id ?? null;
  }
  return null;
}

function getEnvValue(envVar: GetProjectEnvResponseBody): string | null {
  if ("value" in envVar && typeof envVar.value === "string") {
    return envVar.value;
  }
  return null;
}

export async function getProviderSiteConfig({
  provider,
  vercelConfig,
}: {
  provider: HostProvider;
  vercelConfig?: {
    token: string;
    projectId: string;
    teamId: string;
  };
}): Promise<SimplCMSPlatformConfiguration> {
  try {
    switch (provider) {
      case "Vercel": {
        if (!vercelConfig) throw new Error("Vercel client is not provided");
        const vercelClient = simplcms.providers.vercel.connect(
          vercelConfig.token
        );

        // Get all environment variables for the project
        const allEnvVars = await simplcms.providers.vercel.getProjectEnvVars({
          vercel: vercelClient,
          projectId: vercelConfig.projectId,
          teamId: vercelConfig.teamId,
        });

        // Helper function to get env var value by key
        async function getVarValue(key: string): Promise<string | null> {
          if (!vercelConfig) throw new Error("Vercel client is not provided");
          const varId = findEnvVarId(allEnvVars, key);
          if (!varId) return null;

          const envVar = await simplcms.providers.vercel.getProjectEnvVarValue({
            vercel: vercelClient,
            varId,
            projectId: vercelConfig.projectId,
            teamId: vercelConfig.teamId,
          });

          return getEnvValue(envVar);
        }

        // Get host provider value and parse configuration
        const hostProvider = await getVarValue("SIMPLCMS_HOST_PROVIDER");
        const host = simplCMSHostObject.nullable().parse(
          hostProvider
            ? {
                provider: hostProvider,
                vercel:
                  hostProvider === "Vercel"
                    ? {
                        token: await getVarValue("VERCEL_TOKEN"),
                        teamId: await getVarValue("VERCEL_TEAM_ID"),
                        projectId: await getVarValue("VERCEL_PROJECT_ID"),
                      }
                    : undefined,
              }
            : null
        );

        // Get database provider value and parse configuration
        const dbProvider = await getVarValue("SIMPLCMS_DB_PROVIDER");
        const database = simplCMSDBObject.nullable().parse(
          dbProvider
            ? {
                provider: dbProvider,
                mongo:
                  dbProvider === "MongoDB"
                    ? {
                        uri: await getVarValue("MONGO_URI"),
                      }
                    : undefined,
                dynamo:
                  dbProvider === "DynamoDB"
                    ? {
                        tableName: await getVarValue("DYNAMODB_TABLE_NAME"),
                        region: await getVarValue("DYNAMODB_REGION"),
                        accessKeyId: await getVarValue(
                          "DYNAMODB_ACCESS_KEY_ID"
                        ),
                        accessSecretKey: await getVarValue(
                          "DYNAMODB_ACCESS_SECRET_KEY"
                        ),
                      }
                    : undefined,
              }
            : null
        );

        // Get OAuth providers value and parse configuration
        const oauthProviders = await getVarValue("SIMPLCMS_OAUTH_PROVIDERS");
        let oauth = null;

        if (oauthProviders) {
          const oauthConfigPromises = oauthProviders
            .split(",")
            .filter(Boolean)
            .map(async (provider: string) => {
              const trimmedProvider = provider.trim();
              return {
                provider: trimmedProvider,
                google:
                  trimmedProvider === "Google"
                    ? {
                        clientId: await getVarValue("GOOGLE_OAUTH_CLIENT_ID"),
                        clientSecret: await getVarValue(
                          "GOOGLE_OAUTH_CLIENT_SECRET"
                        ),
                      }
                    : undefined,
              };
            });

          const resolvedOauthConfigs = await Promise.all(oauthConfigPromises);
          oauth = simplCMSOAuthObject.nullable().parse(resolvedOauthConfigs);
        }

        // Get media storage providers value and parse configuration
        const mediaStorageProviders = await getVarValue(
          "SIMPLCMS_MEDIA_STORAGE_PROVIDERS"
        );
        let mediaStorage = null;

        if (mediaStorageProviders) {
          const mediaStorageConfigPromises = mediaStorageProviders
            .split(",")
            .filter(Boolean)
            .map(async (provider: string) => {
              const trimmedProvider = provider.trim();
              return {
                provider: trimmedProvider,
                cloudinary:
                  trimmedProvider === "Cloudinary"
                    ? {
                        uri: await getVarValue("CLOUDINARY_URL"),
                      }
                    : undefined,
                s3:
                  trimmedProvider === "AWS S3"
                    ? {
                        bucketName: await getVarValue("AWS_S3_BUCKET_NAME"),
                        region: await getVarValue("AWS_S3_REGION"),
                        accessKeyId: await getVarValue("AWS_S3_ACCESS_KEY_ID"),
                        accessSecretKey: await getVarValue(
                          "AWS_S3_ACCESS_SECRET_KEY"
                        ),
                      }
                    : undefined,
              };
            });

          const resolvedMediaStorageConfigs = await Promise.all(
            mediaStorageConfigPromises
          );
          mediaStorage = simplCMSMediaStorageObject
            .nullable()
            .parse(resolvedMediaStorageConfigs);
        }

        // Return full configuration
        return simplCMSPlatformConfigurationObject.parse({
          host,
          database,
          oauth,
          mediaStorage,
        });
      }

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (error) {
    console.error(`Could not get ${provider} env vars: ${error}`);
    throw error;
  }
}

export const platform = {
  validateSetup,
  checkSetupCompleted,
  getSetupStep,
  getPlatformConfiguration,
  getSiteConfig,
  initSiteConfig,
  findEnvVarId,
  getEnvValue,
  getProviderSiteConfig,
};
