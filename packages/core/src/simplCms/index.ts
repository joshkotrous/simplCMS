import connectToDatabase, { getDatabaseUriEnvVariable } from "@/db";
import { SiteConfigModel } from "@/db/schema";
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
} from "@/types/types";
import { vercel } from "../vercel";
import { GetProjectEnvResponseBody } from "@vercel/sdk/models/getprojectenvop.js";
import {
  FilterProjectEnvsResponseBody,
  ResponseBodyEnvs,
} from "@vercel/sdk/models/filterprojectenvsop.js";
import { user } from "../user";

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
  const envVars = getServerEnvVars();
  console.log("SERVER ENV VARS", JSON.stringify(envVars, null, 2));

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

  const vercelClient = vercel.connect(vercelConfig.token);
  const providerEnvVars = await vercel.getProjectEnvVars({
    vercel: vercelClient,
    projectId: vercelConfig?.projectId,
    teamId: vercelConfig?.teamId,
  });
  console.log("PROVIDER ENV VARS", JSON.stringify(providerEnvVars, null, 2));

  function checkRedeployNeeded(requiredVars: string[]): boolean {
    return requiredVars.some(
      (varName) => findEnvVar(providerEnvVars, varName) && !process.env[varName]
    );
  }

  function checkSectionEnvVarsExist(sectionVars: string[]): boolean {
    return sectionVars.some((varName) => findEnvVar(providerEnvVars, varName));
  }

  let validation: Partial<SetupValidation> = {};
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
    "SIMPL_CMS_OAUTH_PROVIDERS", // Added this variable
    "NEXTAUTH_URL", // Added this variable
    "NEXTAUTH_SECRET", // Added this variable
  ];
  const cloudinaryVarNames = [
    "CLOUDINARY_URL",
    "SIMPLCMS_MEDIA_STORAGE_PROVIDERS",
  ];
  const s3VarNames = [
    "AWS_S3_BUCKET_NAME",
    "AWS_S3_REGION",
    "AWS_S3_ACCESS_KEY_ID",
    "AWS_S3_ACCESS_SECRET_KEY",
  ];

  // Host validation
  if (!envVars.host) {
    validation.host = {
      setupComplete: false,
      errors: [],
    };
    // Check if host vars exist in Vercel but not locally
    redeployRequired =
      redeployRequired || checkSectionEnvVarsExist(hostVarNames);
  } else if (envVars.host.provider === null) {
    validation.host = {
      setupComplete: false,
      errors: [],
    };
    redeployRequired =
      redeployRequired || checkSectionEnvVarsExist(hostVarNames);
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
    validation.database = {
      setupComplete: false,
      errors: [],
    };
    redeployRequired =
      redeployRequired ||
      checkSectionEnvVarsExist([...mongoVarNames, ...dynamoVarNames]);
  } else if (envVars.database.provider === null) {
    validation.database = {
      setupComplete: false,
      errors: [],
    };
    redeployRequired =
      redeployRequired ||
      checkSectionEnvVarsExist([...mongoVarNames, ...dynamoVarNames]);
  } else {
    switch (envVars.database.provider) {
      case "MongoDB": {
        validation.database = {
          setupComplete: mongoVarNames.every((v) =>
            findEnvVar(providerEnvVars, v)
          ),
          errors: [],
        };
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

  const providersVar = findEnvVar(providerEnvVars, "SIMPL_CMS_OAUTH_PROVIDERS");
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
    validation.mediaStorage = {
      setupComplete: false,
      errors: [],
    };
    redeployRequired =
      redeployRequired ||
      checkSectionEnvVarsExist([...cloudinaryVarNames, ...s3VarNames]);
  } else if (envVars.mediaStorage.length === 0) {
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
          if (!storageConfig.cloudinary?.uri) {
            errors.push("Cloudinary URI not configured");
          }
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

  // Admin user validation
  if (!validation.database?.setupComplete) {
    validation.adminUser = {
      setupComplete: false,
      errors: [],
    };
  } else {
    console.log("setupData", JSON.stringify(setupData, null, 2));

    const users = await user.getAllUsers(
      setupData?.database?.mongo?.uri ?? undefined
    );
    console.log("USERS", JSON.stringify(users, null, 2));
    const adminUser = users.some((user) => user.role === "admin");
    validation.adminUser = {
      setupComplete: adminUser,
      errors: [],
    };
  }

  // Redeploy validation
  if (
    !validation.database?.setupComplete ||
    !validation.mediaStorage?.setupComplete
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
        const vercelClient = vercel.connect(vercelConfig.token);

        // Get all environment variables for the project
        const allEnvVars = await vercel.getProjectEnvVars({
          vercel: vercelClient,
          projectId: vercelConfig.projectId,
          teamId: vercelConfig.teamId,
        });

        // Helper function to get env var value by key
        async function getVarValue(key: string): Promise<string | null> {
          if (!vercelConfig) throw new Error("Vercel client is not provided");
          const varId = findEnvVarId(allEnvVars, key);
          if (!varId) return null;

          const envVar = await vercel.getProjectEnvVarValue({
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

export * as simplCms from ".";
