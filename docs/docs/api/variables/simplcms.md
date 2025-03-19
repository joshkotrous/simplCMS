[**simplcms**](../README.md)

***

[simplcms](../README.md) / simplcms

# Variable: simplcms

> `const` **simplcms**: `object`

Defined in: [src/core/index.ts:30](https://github.com/joshkotrous/simplCMS/blob/d047d3f54c2e35ff1f967c5468fa7e1ea0e5eb8e/src/core/index.ts#L30)

Primary CMS interface exposing core APIs for managing content, users, media, and configuration.

## Type declaration

### db

> **db**: `object`

Database interface providing direct or abstracted query methods and operations.

#### db.connectToDatabase()

> **connectToDatabase**: (`uri`) => `Promise`\<`Connection`\>

##### Parameters

###### uri

`string`

##### Returns

`Promise`\<`Connection`\>

#### db.disconnectFromDatabase()

> **disconnectFromDatabase**: () => `Promise`\<`void`\>

##### Returns

`Promise`\<`void`\>

#### db.getDatabaseUriEnvVariable()

> **getDatabaseUriEnvVariable**: () => `string`

##### Returns

`string`

#### db.getModels()

> **getModels**: (`connection`) => `object`

##### Parameters

###### connection

`Connection`

##### Returns

`object`

###### PageModel

> **PageModel**: `Model`\<`any`, \{\}, \{\}, \{\}, `any`, `any`\>

###### PostModel

> **PostModel**: `Model`\<`any`, \{\}, \{\}, \{\}, `any`, `any`\>

###### SiteConfigModel

> **SiteConfigModel**: `Model`\<`any`, \{\}, \{\}, \{\}, `any`, `any`\>

###### UserModel

> **UserModel**: `Model`\<`any`, \{\}, \{\}, \{\}, `any`, `any`\>

### defaultHomePageConfig

> **defaultHomePageConfig**: `object`

Default configuration settings for the CMS homepage.

#### defaultHomePageConfig.\_id

> **\_id**: `string`

#### defaultHomePageConfig.createdAt

> **createdAt**: `null` \| `Date`

#### defaultHomePageConfig.elements

> **elements**: `object`[]

#### defaultHomePageConfig.metadata

> **metadata**: `object`

#### defaultHomePageConfig.metadata.description

> **description**: `string`

#### defaultHomePageConfig.metadata.keywords

> **keywords**: `null` \| `string`[]

#### defaultHomePageConfig.metadata.ogImage

> **ogImage**: `null` \| `string`

#### defaultHomePageConfig.metadata.title

> **title**: `string`

#### defaultHomePageConfig.publishedAt

> **publishedAt**: `null` \| `Date`

#### defaultHomePageConfig.route

> **route**: `string`

#### defaultHomePageConfig.status

> **status**: `"draft"` \| `"published"` \| `"archived"`

#### defaultHomePageConfig.updatedAt

> **updatedAt**: `null` \| `Date`

### getEnvironment()

> **getEnvironment**: () => `"dev"` \| `"prod"`

Retrieve the current runtime environment (e.g., development, production, testing).

#### Returns

`"dev"` \| `"prod"`

### getSiteUrl()

> **getSiteUrl**: () => `object`

Returns the base URL of the currently running CMS site.

#### Returns

`object`

##### siteUrl

> **siteUrl**: `string`

### media

> **media**: `object`

API methods related to media handling such as uploads, retrieval, updates, and deletions.

#### media.deleteMedia()

> **deleteMedia**: (`media`, `mediaStorageConfiguration`) => `Promise`\<`void`\>

##### Parameters

###### media

###### id

`string` = `...`

###### name

`string` = `...`

###### source

`"Cloudinary"` \| `"AWS S3"` = `mediaStorageProviderSchema`

###### type

`"image"` \| `"video"` = `...`

###### url

`string` = `...`

###### mediaStorageConfiguration

`null` | `object`[] | \{ `skipped`: `boolean`; \}

##### Returns

`Promise`\<`void`\>

#### media.getMedia()

> **getMedia**: (`mediaStorageConfiguration`) => `Promise`\<`object`[]\>

##### Parameters

###### mediaStorageConfiguration

`null` | `object`[] | \{ `skipped`: `boolean`; \}

##### Returns

`Promise`\<`object`[]\>

#### media.uploadMedia()

> **uploadMedia**: (`files`, `mediaStorageConfiguration`) => `Promise`\<`object`[]\>

##### Parameters

###### files

`File`[]

###### mediaStorageConfiguration

`null` | `object`[] | \{ `skipped`: `boolean`; \}

##### Returns

`Promise`\<`object`[]\>

### pages

> **pages**: `object`

API methods related to page operations such as creation, retrieval, updating, and deletion.

#### pages.createPage()

> **createPage**: (`page`, `uri`?) => `Promise`\<\{ `_id`: `string`; `createdAt`: `null` \| `Date`; `elements`: `object`[]; `metadata`: \{ `description`: `string`; `keywords`: `null` \| `string`[]; `ogImage`: `null` \| `string`; `title`: `string`; \}; `publishedAt`: `null` \| `Date`; `route`: `string`; `status`: `"draft"` \| `"published"` \| `"archived"`; `updatedAt`: `null` \| `Date`; \}\>

##### Parameters

###### page

###### elements

`object`[] = `...`

###### metadata

\{ `description`: `string`; `keywords`: `null` \| `string`[]; `ogImage`: `null` \| `string`; `title`: `string`; \} = `...`

###### metadata.description

`string` = `...`

###### metadata.keywords

`null` \| `string`[] = `...`

###### metadata.ogImage

`null` \| `string` = `...`

###### metadata.title

`string` = `...`

###### route

`string` = `...`

###### status

`"draft"` \| `"published"` \| `"archived"` = `...`

###### uri?

`string`

##### Returns

`Promise`\<\{ `_id`: `string`; `createdAt`: `null` \| `Date`; `elements`: `object`[]; `metadata`: \{ `description`: `string`; `keywords`: `null` \| `string`[]; `ogImage`: `null` \| `string`; `title`: `string`; \}; `publishedAt`: `null` \| `Date`; `route`: `string`; `status`: `"draft"` \| `"published"` \| `"archived"`; `updatedAt`: `null` \| `Date`; \}\>

#### pages.getAllPages()

> **getAllPages**: () => `Promise`\<`object`[]\>

##### Returns

`Promise`\<`object`[]\>

#### pages.getPageByRoute()

> **getPageByRoute**: (`route`) => `Promise`\<`null` \| \{ `_id`: `string`; `createdAt`: `null` \| `Date`; `elements`: `object`[]; `metadata`: \{ `description`: `string`; `keywords`: `null` \| `string`[]; `ogImage`: `null` \| `string`; `title`: `string`; \}; `publishedAt`: `null` \| `Date`; `route`: `string`; `status`: `"draft"` \| `"published"` \| `"archived"`; `updatedAt`: `null` \| `Date`; \}\>

##### Parameters

###### route

`string`

##### Returns

`Promise`\<`null` \| \{ `_id`: `string`; `createdAt`: `null` \| `Date`; `elements`: `object`[]; `metadata`: \{ `description`: `string`; `keywords`: `null` \| `string`[]; `ogImage`: `null` \| `string`; `title`: `string`; \}; `publishedAt`: `null` \| `Date`; `route`: `string`; `status`: `"draft"` \| `"published"` \| `"archived"`; `updatedAt`: `null` \| `Date`; \}\>

### platform

> **platform**: `object`

Information and methods regarding the platform/environment the CMS is running on.

#### platform.checkSetupCompleted()

> **checkSetupCompleted**: (`setupValidation`) => `boolean`

##### Parameters

###### setupValidation

`Partial`\<`SetupValidation`\>

##### Returns

`boolean`

#### platform.findEnvVarId()

> **findEnvVarId**: (`envVars`, `key`) => `null` \| `string`

##### Parameters

###### envVars

`FilterProjectEnvsResponseBody`

###### key

`string`

##### Returns

`null` \| `string`

#### platform.getEnvValue()

> **getEnvValue**: (`envVar`) => `null` \| `string`

##### Parameters

###### envVar

`GetProjectEnvResponseBody`

##### Returns

`null` \| `string`

#### platform.getPlatformConfiguration()

> **getPlatformConfiguration**: () => `object`

##### Returns

`object`

###### database

> **database**: `null` \| \{ `dynamo`: \{ `accessKeyId`: `null` \| `string`; `accessSecretKey`: `null` \| `string`; `region`: `null` \| `string`; `tableName`: `null` \| `string`; \}; `mongo`: \{ `uri`: `null` \| `string`; \}; `provider`: `"MongoDB"` \| `"DynamoDB"`; \}

###### host

> **host**: `null` \| \{ `provider`: `"Vercel"`; `vercel`: \{ `projectId`: `null` \| `string`; `projectName`: `null` \| `string`; `teamId`: `null` \| `string`; `token`: `null` \| `string`; \}; \}

###### mediaStorage

> **mediaStorage**: `null` \| `object`[] \| \{ `skipped`: `boolean`; \} \| \{ `skipped`: `boolean`; \}

###### oauth

> **oauth**: `null` \| `object`[]

#### platform.getProviderSiteConfig()

> **getProviderSiteConfig**: (`__namedParameters`) => `Promise`\<\{ `database`: `null` \| \{ `dynamo`: \{ `accessKeyId`: `null` \| `string`; `accessSecretKey`: `null` \| `string`; `region`: `null` \| `string`; `tableName`: `null` \| `string`; \}; `mongo`: \{ `uri`: `null` \| `string`; \}; `provider`: `"MongoDB"` \| `"DynamoDB"`; \}; `host`: `null` \| \{ `provider`: `"Vercel"`; `vercel`: \{ `projectId`: `null` \| `string`; `projectName`: `null` \| `string`; `teamId`: `null` \| `string`; `token`: `null` \| `string`; \}; \}; `mediaStorage`: `null` \| `object`[] \| \{ `skipped`: `boolean`; \} \| \{ `skipped`: `boolean`; \}; `oauth`: `null` \| `object`[]; \}\>

##### Parameters

###### \_\_namedParameters

###### provider

`"Vercel"`

###### vercelConfig?

\{ `projectId`: `string`; `teamId`: `string`; `token`: `string`; \}

###### vercelConfig.projectId

`string`

###### vercelConfig.teamId

`string`

###### vercelConfig.token

`string`

##### Returns

`Promise`\<\{ `database`: `null` \| \{ `dynamo`: \{ `accessKeyId`: `null` \| `string`; `accessSecretKey`: `null` \| `string`; `region`: `null` \| `string`; `tableName`: `null` \| `string`; \}; `mongo`: \{ `uri`: `null` \| `string`; \}; `provider`: `"MongoDB"` \| `"DynamoDB"`; \}; `host`: `null` \| \{ `provider`: `"Vercel"`; `vercel`: \{ `projectId`: `null` \| `string`; `projectName`: `null` \| `string`; `teamId`: `null` \| `string`; `token`: `null` \| `string`; \}; \}; `mediaStorage`: `null` \| `object`[] \| \{ `skipped`: `boolean`; \} \| \{ `skipped`: `boolean`; \}; `oauth`: `null` \| `object`[]; \}\>

#### platform.getSetupStep()

> **getSetupStep**: (`setupValidation`) => `object`

##### Parameters

###### setupValidation

`Partial`\<`SetupValidation`\>

##### Returns

`object`

###### complete

> **complete**: `boolean`

###### step

> **step**: `"host"` \| `"database"` \| `"mediaStorage"` \| `"oauth"` \| `"redeploy"` \| `"adminUser"`

#### platform.getSiteConfig()

> **getSiteConfig**: () => `Promise`\<`null` \| \{ `_id`: `string`; `logo`: `null` \| `string`; `simplCMSDbProvider`: `"MongoDB"` \| `"DynamoDB"`; `simplCMSHostProvider`: `"Vercel"`; `simplCMSMediaStorageProviders`: (`null` \| `"Cloudinary"` \| `"AWS S3"`)[]; `simplCMSOauthProviders`: (`"Google"` \| `"GitHub"` \| `"Microsoft"`)[]; \}\>

##### Returns

`Promise`\<`null` \| \{ `_id`: `string`; `logo`: `null` \| `string`; `simplCMSDbProvider`: `"MongoDB"` \| `"DynamoDB"`; `simplCMSHostProvider`: `"Vercel"`; `simplCMSMediaStorageProviders`: (`null` \| `"Cloudinary"` \| `"AWS S3"`)[]; `simplCMSOauthProviders`: (`"Google"` \| `"GitHub"` \| `"Microsoft"`)[]; \}\>

#### platform.initSiteConfig()

> **initSiteConfig**: () => `Promise`\<`void`\>

##### Returns

`Promise`\<`void`\>

#### platform.validateSetup()

> **validateSetup**: (`__namedParameters`) => `Promise`\<`Partial`\<`SetupValidation`\>\>

##### Parameters

###### \_\_namedParameters

###### provider?

`"Vercel"`

###### setupData?

\{ `database`: `null` \| \{ `dynamo`: \{ `accessKeyId`: ... \| ...; `accessSecretKey`: ... \| ...; `region`: ... \| ...; `tableName`: ... \| ...; \}; `mongo`: \{ `uri`: ... \| ...; \}; `provider`: `"MongoDB"` \| `"DynamoDB"`; \}; `host`: `null` \| \{ `provider`: `"Vercel"`; `vercel`: \{ `projectId`: ... \| ...; `projectName`: ... \| ... \| ...; `teamId`: ... \| ...; `token`: ... \| ...; \}; \}; `mediaStorage`: `null` \| `object`[] \| \{ `skipped`: `boolean`; \} \| \{ `skipped`: `boolean`; \}; `oauth`: `null` \| `object`[]; \}

###### setupData.database

`null` \| \{ `dynamo`: \{ `accessKeyId`: ... \| ...; `accessSecretKey`: ... \| ...; `region`: ... \| ...; `tableName`: ... \| ...; \}; `mongo`: \{ `uri`: ... \| ...; \}; `provider`: `"MongoDB"` \| `"DynamoDB"`; \} = `...`

###### setupData.host

`null` \| \{ `provider`: `"Vercel"`; `vercel`: \{ `projectId`: ... \| ...; `projectName`: ... \| ... \| ...; `teamId`: ... \| ...; `token`: ... \| ...; \}; \} = `...`

###### setupData.mediaStorage

`null` \| `object`[] \| \{ `skipped`: `boolean`; \} \| \{ `skipped`: `boolean`; \} = `...`

###### setupData.oauth

`null` \| `object`[] = `...`

###### vercelConfig?

\{ `projectId`: `string`; `teamId`: `string`; `token`: `string`; \}

###### vercelConfig.projectId

`string`

###### vercelConfig.teamId

`string`

###### vercelConfig.token

`string`

##### Returns

`Promise`\<`Partial`\<`SetupValidation`\>\>

### posts

> **posts**: `object`

API methods for handling blog or article posts, including CRUD operations and querying.

#### posts.createPost()

> **createPost**: (`post`) => `Promise`\<`void`\>

Creates a new post with provided data.

Creates a new blog post with the provided data.

##### Parameters

###### post

The data required to create the post.

###### author

`string` = `...`

###### category

`null` \| `string` = `...`

###### content

`string` = `...`

###### draft

`boolean` = `...`

###### metadata

\{ `description`: `string`; `ogImage`: `string`; `title`: `string`; \} = `...`

###### metadata.description

`string` = `...`

###### metadata.ogImage

`string` = `...`

###### metadata.title

`string` = `...`

###### subtitle

`null` \| `string` = `...`

###### title

`string` = `...`

##### Returns

`Promise`\<`void`\>

A promise resolving once the post has been successfully created.

##### Throws

Throws an error if the post cannot be created due to validation or database issues.

#### posts.deletePost()

> **deletePost**: (`post`) => `Promise`\<`void`\>

Deletes a post by its ID.

Deletes a post identified by its unique identifier.

##### Parameters

###### post

The post object containing at least the `_id` field.

###### _id

`string` = `...`

###### author

`string` = `...`

###### category

`null` \| `string` = `...`

###### content

`string` = `...`

###### createdAt

`Date` = `...`

###### draft

`boolean` = `...`

###### metadata

\{ `description`: `string`; `ogImage`: `string`; `title`: `string`; \} = `...`

###### metadata.description

`string` = `...`

###### metadata.ogImage

`string` = `...`

###### metadata.title

`string` = `...`

###### slug

`string` = `...`

###### subtitle

`null` \| `string` = `...`

###### title

`string` = `...`

##### Returns

`Promise`\<`void`\>

A promise resolving when the deletion has successfully occurred.

##### Throws

Throws an error if the post does not exist or the deletion fails.

#### posts.getAllPosts()

> **getAllPosts**: () => `Promise`\<`object`[]\>

Retrieves all existing posts sorted by most recent.

Retrieves all posts stored in the database, sorted by creation date (most recent first).

##### Returns

`Promise`\<`object`[]\>

A promise resolving to an array of post objects.

##### Throws

Throws an error if the retrieval fails due to database issues.

#### posts.getDrafts()

> **getDrafts**: () => `Promise`\<`object`[]\>

Retrieves all posts marked as drafts.

Retrieves all posts marked as drafts, sorted by creation date (most recent first).

##### Returns

`Promise`\<`object`[]\>

A promise resolving to an array of draft post objects.

##### Throws

Throws an error if the database operation fails.

#### posts.getPost()

> **getPost**: (`post`) => `Promise`\<\{ `_id`: `string`; `author`: `string`; `category`: `null` \| `string`; `content`: `string`; `createdAt`: `Date`; `draft`: `boolean`; `metadata`: \{ `description`: `string`; `ogImage`: `string`; `title`: `string`; \}; `slug`: `string`; `subtitle`: `null` \| `string`; `title`: `string`; \}\>

Retrieves a post matching provided criteria (e.g., ID, title, author).

Retrieves a single post matching at least one of the provided criteria.

##### Parameters

###### post

`Partial`\<\{ `_id`: `string`; `author`: `string`; `category`: `null` \| `string`; `content`: `string`; `createdAt`: `Date`; `draft`: `boolean`; `metadata`: \{ `description`: `string`; `ogImage`: `string`; `title`: `string`; \}; `slug`: `string`; `subtitle`: `null` \| `string`; `title`: `string`; \}\>

A partial object containing at least one criterion for searching the post (e.g., `_id`, `title`, `author`, etc.).

##### Returns

`Promise`\<\{ `_id`: `string`; `author`: `string`; `category`: `null` \| `string`; `content`: `string`; `createdAt`: `Date`; `draft`: `boolean`; `metadata`: \{ `description`: `string`; `ogImage`: `string`; `title`: `string`; \}; `slug`: `string`; `subtitle`: `null` \| `string`; `title`: `string`; \}\>

A promise resolving to the post matching the provided criteria.

##### Throws

Throws an error if no criteria are provided or the post isn't found.

#### posts.getPostBySlug()

> **getPostBySlug**: (`slug`) => `Promise`\<`null` \| \{ `_id`: `string`; `author`: `string`; `category`: `null` \| `string`; `content`: `string`; `createdAt`: `Date`; `draft`: `boolean`; `metadata`: \{ `description`: `string`; `ogImage`: `string`; `title`: `string`; \}; `slug`: `string`; `subtitle`: `null` \| `string`; `title`: `string`; \}\>

Retrieves a post by its unique slug.

Retrieves a single post by its unique slug.

##### Parameters

###### slug

`string`

The unique URL-friendly identifier for the post.

##### Returns

`Promise`\<`null` \| \{ `_id`: `string`; `author`: `string`; `category`: `null` \| `string`; `content`: `string`; `createdAt`: `Date`; `draft`: `boolean`; `metadata`: \{ `description`: `string`; `ogImage`: `string`; `title`: `string`; \}; `slug`: `string`; `subtitle`: `null` \| `string`; `title`: `string`; \}\>

A promise resolving to the post object if found, otherwise `null`.

##### Throws

Throws an error if the database operation fails.

#### posts.getPublishedPosts()

> **getPublishedPosts**: () => `Promise`\<`object`[]\>

Retrieves all posts marked as published.

Retrieves all posts marked as published (not drafts), sorted by creation date (most recent first).

##### Returns

`Promise`\<`object`[]\>

A promise resolving to an array of published post objects.

##### Throws

Throws an error if the database operation fails.

#### posts.updatePost()

> **updatePost**: (`postId`, `updates`) => `Promise`\<\{ `_id`: `string`; `author`: `string`; `category`: `null` \| `string`; `content`: `string`; `createdAt`: `Date`; `draft`: `boolean`; `metadata`: \{ `description`: `string`; `ogImage`: `string`; `title`: `string`; \}; `slug`: `string`; `subtitle`: `null` \| `string`; `title`: `string`; \}\>

Updates an existing post by its ID with provided changes.

Updates an existing post with the specified changes.

##### Parameters

###### postId

`string`

The unique identifier (`_id`) of the post to be updated.

###### updates

`Partial`\<\{ `_id`: `string`; `author`: `string`; `category`: `null` \| `string`; `content`: `string`; `createdAt`: `Date`; `draft`: `boolean`; `metadata`: \{ `description`: `string`; `ogImage`: `string`; `title`: `string`; \}; `slug`: `string`; `subtitle`: `null` \| `string`; `title`: `string`; \}\>

An object containing the fields and values to update.

##### Returns

`Promise`\<\{ `_id`: `string`; `author`: `string`; `category`: `null` \| `string`; `content`: `string`; `createdAt`: `Date`; `draft`: `boolean`; `metadata`: \{ `description`: `string`; `ogImage`: `string`; `title`: `string`; \}; `slug`: `string`; `subtitle`: `null` \| `string`; `title`: `string`; \}\>

A promise resolving to the updated post object.

##### Throws

Throws an error if the post does not exist or validation fails.

### providers

> **providers**: `object`

Authentication and external service providers.

#### providers.cloudinary

> **cloudinary**: `object`

#### providers.cloudinary.deleteCloudinaryMedia()

> **deleteCloudinaryMedia**: (`media`, `mediaStorageConfiguration`) => `Promise`\<`void`\>

##### Parameters

###### media

###### id

`string` = `...`

###### name

`string` = `...`

###### source

`"Cloudinary"` \| `"AWS S3"` = `mediaStorageProviderSchema`

###### type

`"image"` \| `"video"` = `...`

###### url

`string` = `...`

###### mediaStorageConfiguration

`null` | `object`[] | \{ `skipped`: `boolean`; \}

##### Returns

`Promise`\<`void`\>

#### providers.cloudinary.getMedia()

> **getMedia**: (`resourceType`?) => `Promise`\<`object`[]\>

##### Parameters

###### resourceType?

`"image"` | `"video"`

##### Returns

`Promise`\<`object`[]\>

#### providers.cloudinary.testConnection()

> **testConnection**: (`url`?) => `Promise`\<`void`\>

##### Parameters

###### url?

`string`

##### Returns

`Promise`\<`void`\>

#### providers.cloudinary.updateCloudinaryMediaName()

> **updateCloudinaryMediaName**: (`media`, `newName`, `mediaStorageConfiguration`) => `Promise`\<\{ `id`: `string`; `name`: `string`; `source`: `"Cloudinary"` \| `"AWS S3"`; `type`: `"image"` \| `"video"`; `url`: `string`; \}\>

##### Parameters

###### media

###### id

`string` = `...`

###### name

`string` = `...`

###### source

`"Cloudinary"` \| `"AWS S3"` = `mediaStorageProviderSchema`

###### type

`"image"` \| `"video"` = `...`

###### url

`string` = `...`

###### newName

`string`

###### mediaStorageConfiguration

`null` | `object`[] | \{ `skipped`: `boolean`; \}

##### Returns

`Promise`\<\{ `id`: `string`; `name`: `string`; `source`: `"Cloudinary"` \| `"AWS S3"`; `type`: `"image"` \| `"video"`; `url`: `string`; \}\>

#### providers.cloudinary.uploadFiles()

> **uploadFiles**: (`files`) => `Promise`\<`void`\>

##### Parameters

###### files

`Blob`[]

##### Returns

`Promise`\<`void`\>

#### providers.s3

> **s3**: `object`

#### providers.s3.deleteMedia()

> **deleteMedia**: (`media`, `mediaStorageConfiguration`) => `Promise`\<`void`\>

##### Parameters

###### media

###### id

`string` = `...`

###### name

`string` = `...`

###### source

`"Cloudinary"` \| `"AWS S3"` = `mediaStorageProviderSchema`

###### type

`"image"` \| `"video"` = `...`

###### url

`string` = `...`

###### mediaStorageConfiguration

`null` | `object`[] | \{ `skipped`: `boolean`; \}

##### Returns

`Promise`\<`void`\>

#### providers.s3.getMedia()

> **getMedia**: (`config`, `prefix`, `maxItems`) => `Promise`\<`object`[]\>

##### Parameters

###### config

###### accessKeyId

`null` \| `string` = `...`

###### accessSecretKey

`null` \| `string` = `...`

###### bucketName

`null` \| `string` = `...`

###### region

`null` \| `string` = `...`

###### prefix

`string` = `""`

###### maxItems

`number` = `1000`

##### Returns

`Promise`\<`object`[]\>

#### providers.s3.testConnection()

> **testConnection**: (`config`) => `Promise`\<`ListObjectsV2CommandOutput`\>

##### Parameters

###### config

###### accessKeyId

`null` \| `string` = `...`

###### accessSecretKey

`null` \| `string` = `...`

###### bucketName

`null` \| `string` = `...`

###### region

`null` \| `string` = `...`

##### Returns

`Promise`\<`ListObjectsV2CommandOutput`\>

#### providers.s3.updateMediaName()

> **updateMediaName**: (`media`, `newName`, `mediaStorageConfiguration`) => `Promise`\<\{ `id`: `string`; `name`: `string`; `source`: `"Cloudinary"` \| `"AWS S3"`; `type`: `"image"` \| `"video"`; `url`: `string`; \}\>

##### Parameters

###### media

###### id

`string` = `...`

###### name

`string` = `...`

###### source

`"Cloudinary"` \| `"AWS S3"` = `mediaStorageProviderSchema`

###### type

`"image"` \| `"video"` = `...`

###### url

`string` = `...`

###### newName

`string`

###### mediaStorageConfiguration

`null` | `object`[] | \{ `skipped`: `boolean`; \}

##### Returns

`Promise`\<\{ `id`: `string`; `name`: `string`; `source`: `"Cloudinary"` \| `"AWS S3"`; `type`: `"image"` \| `"video"`; `url`: `string`; \}\>

#### providers.s3.uploadFiles()

> **uploadFiles**: (`config`, `files`) => `Promise`\<`object`[]\>

##### Parameters

###### config

###### accessKeyId

`null` \| `string` = `...`

###### accessSecretKey

`null` \| `string` = `...`

###### bucketName

`null` \| `string` = `...`

###### region

`null` \| `string` = `...`

###### files

`Blob`[]

##### Returns

`Promise`\<`object`[]\>

#### providers.vercel

> **vercel**: `object`

#### providers.vercel.addEnvToProject()

> **addEnvToProject**: (`__namedParameters`) => `Promise`\<`void`\>

##### Parameters

###### \_\_namedParameters

###### key

`string`

###### projectId

`string`

###### target

(`"production"` \| `"preview"` \| `"development"`)[] = `...`

###### teamId

`string`

###### type

`"system"` \| `"encrypted"` \| `"plain"` \| `"sensitive"` \| `"secret"` = `"plain"`

###### value

`string`

###### vercel

`Vercel`

##### Returns

`Promise`\<`void`\>

#### providers.vercel.connect()

> **connect**: (`apiKey`) => `Vercel`

##### Parameters

###### apiKey

`string`

##### Returns

`Vercel`

#### providers.vercel.getDeploymentById()

> **getDeploymentById**: (`__namedParameters`) => `Promise`\<`GetDeploymentResponseBody`\>

##### Parameters

###### \_\_namedParameters

###### deploymentId

`string`

###### teamId

`string`

###### vercel

`Vercel`

##### Returns

`Promise`\<`GetDeploymentResponseBody`\>

#### providers.vercel.getLatestDeployment()

> **getLatestDeployment**: (`__namedParameters`) => `Promise`\<`null` \| `Deployments`\>

##### Parameters

###### \_\_namedParameters

###### projectId

`string`

###### teamId

`string`

###### vercel

`Vercel`

##### Returns

`Promise`\<`null` \| `Deployments`\>

#### providers.vercel.getProjectById()

> **getProjectById**: (`__namedParameters`) => `Promise`\<`GetProjectsProjects`\>

##### Parameters

###### \_\_namedParameters

###### projectId

`string`

###### teamId

`string`

###### vercel

`Vercel`

##### Returns

`Promise`\<`GetProjectsProjects`\>

#### providers.vercel.getProjectEnvVars()

> **getProjectEnvVars**: (`__namedParameters`) => `Promise`\<`FilterProjectEnvsResponseBody`\>

##### Parameters

###### \_\_namedParameters

###### projectId

`string`

###### target?

(`"production"` \| `"preview"` \| `"development"`)[]

###### teamId

`string`

###### vercel

`Vercel`

##### Returns

`Promise`\<`FilterProjectEnvsResponseBody`\>

#### providers.vercel.getProjectEnvVarValue()

> **getProjectEnvVarValue**: (`__namedParameters`) => `Promise`\<`GetProjectEnvResponseBody`\>

##### Parameters

###### \_\_namedParameters

###### projectId

`string`

###### target?

(`"production"` \| `"preview"` \| `"development"`)[]

###### teamId

`string`

###### varId

`string`

###### vercel

`Vercel`

##### Returns

`Promise`\<`GetProjectEnvResponseBody`\>

#### providers.vercel.getProjects()

> **getProjects**: (`vercel`, `teamId`) => `Promise`\<`GetProjectsResponseBody`\>

##### Parameters

###### vercel

`Vercel`

###### teamId

`string`

##### Returns

`Promise`\<`GetProjectsResponseBody`\>

#### providers.vercel.getRunningDeployments()

> **getRunningDeployments**: (`__namedParameters`) => `Promise`\<`Deployments`[]\>

##### Parameters

###### \_\_namedParameters

###### projectId

`string`

###### teamId

`string`

###### vercel

`Vercel`

##### Returns

`Promise`\<`Deployments`[]\>

#### providers.vercel.getTeamById()

> **getTeamById**: (`__namedParameters`) => `Promise`\<\{\}\>

##### Parameters

###### \_\_namedParameters

###### teamId

`string`

###### vercel

`Vercel`

##### Returns

`Promise`\<\{\}\>

#### providers.vercel.getUserTeams()

> **getUserTeams**: (`vercel`) => `Promise`\<`GetTeamsResponseBody`\>

##### Parameters

###### vercel

`Vercel`

##### Returns

`Promise`\<`GetTeamsResponseBody`\>

#### providers.vercel.getVercelEnvVars()

> **getVercelEnvVars**: () => `object`

##### Returns

`object`

###### projectId

> **projectId**: `string`

###### teamId

> **teamId**: `string`

###### token

> **token**: `string`

#### providers.vercel.getVercelToken()

> **getVercelToken**: () => `string`

##### Returns

`string`

#### providers.vercel.triggerDeployment()

> **triggerDeployment**: (`__namedParameters`) => `Promise`\<`CreateDeploymentResponseBody`\>

##### Parameters

###### \_\_namedParameters

###### name?

`string` = `"Production Deployment"`

###### projectId

`string`

###### target?

`"production"` \| `"staging"` = `"production"`

###### teamId

`string`

###### vercel

`Vercel`

##### Returns

`Promise`\<`CreateDeploymentResponseBody`\>

#### providers.vercel.triggerRedeploy()

> **triggerRedeploy**: (`__namedParameters`) => `Promise`\<`CreateDeploymentResponseBody`\>

##### Parameters

###### \_\_namedParameters

###### deploymentId?

`string`

###### name?

`string` = `"Production Deployment"`

###### projectId

`string`

###### target?

`"production"` \| `"preview"` \| `"staging"` = `"production"`

###### teamId

`string`

###### vercel

`Vercel`

##### Returns

`Promise`\<`CreateDeploymentResponseBody`\>

### users

> **users**: `object`

User-related API, including methods for managing authentication, authorization, and profiles.

#### users.createUser()

> **createUser**: (`userData`, `dbUri`?) => `Promise`\<`void`\>

##### Parameters

###### userData

`Partial`\<\{ `_id`: `string`; `createdAt`: `Date`; `email`: `string`; `imageUrl`: `null` \| `string`; `name`: `null` \| `string`; `role`: `"user"` \| `"admin"`; \}\>

###### dbUri?

`string`

##### Returns

`Promise`\<`void`\>

#### users.deleteUser()

> **deleteUser**: (`user`) => `Promise`\<`void`\>

##### Parameters

###### user

###### _id

`string` = `...`

###### createdAt

`Date` = `...`

###### email

`string` = `...`

###### imageUrl

`null` \| `string` = `...`

###### name

`null` \| `string` = `...`

###### role

`"user"` \| `"admin"` = `...`

##### Returns

`Promise`\<`void`\>

#### users.getAllUsers()

> **getAllUsers**: (`dbUri`?) => `Promise`\<`object`[]\>

##### Parameters

###### dbUri?

`string`

##### Returns

`Promise`\<`object`[]\>

#### users.getUser()

> **getUser**: (`user`) => `Promise`\<\{ `_id`: `string`; `createdAt`: `Date`; `email`: `string`; `imageUrl`: `null` \| `string`; `name`: `null` \| `string`; `role`: `"user"` \| `"admin"`; \}\>

##### Parameters

###### user

`Partial`\<\{ `_id`: `string`; `createdAt`: `Date`; `email`: `string`; `imageUrl`: `null` \| `string`; `name`: `null` \| `string`; `role`: `"user"` \| `"admin"`; \}\>

##### Returns

`Promise`\<\{ `_id`: `string`; `createdAt`: `Date`; `email`: `string`; `imageUrl`: `null` \| `string`; `name`: `null` \| `string`; `role`: `"user"` \| `"admin"`; \}\>

#### users.getUserByEmail()

> **getUserByEmail**: (`email`) => `Promise`\<`null` \| \{ `_id`: `string`; `createdAt`: `Date`; `email`: `string`; `imageUrl`: `null` \| `string`; `name`: `null` \| `string`; `role`: `"user"` \| `"admin"`; \}\>

##### Parameters

###### email

`string`

##### Returns

`Promise`\<`null` \| \{ `_id`: `string`; `createdAt`: `Date`; `email`: `string`; `imageUrl`: `null` \| `string`; `name`: `null` \| `string`; `role`: `"user"` \| `"admin"`; \}\>

#### users.updateUser()

> **updateUser**: (`user`) => `Promise`\<`void`\>

##### Parameters

###### user

`Partial`\<\{ `_id`: `string`; `createdAt`: `Date`; `email`: `string`; `imageUrl`: `null` \| `string`; `name`: `null` \| `string`; `role`: `"user"` \| `"admin"`; \}\>

##### Returns

`Promise`\<`void`\>

#### users.userHasAccess()

> **userHasAccess**: (`user`) => `Promise`\<`boolean`\>

##### Parameters

###### user

###### _id

`string` = `...`

###### createdAt

`Date` = `...`

###### email

`string` = `...`

###### imageUrl

`null` \| `string` = `...`

###### name

`null` \| `string` = `...`

###### role

`"user"` \| `"admin"` = `...`

##### Returns

`Promise`\<`boolean`\>
