[**simplcms**](../README.md)

***

[simplcms](../README.md) / SetupForm

# Function: SetupForm()

> **SetupForm**(`__namedParameters`): `Element`

Defined in: [src/app/client/components/setupForm.tsx:39](https://github.com/joshkotrous/simplCMS/blob/d047d3f54c2e35ff1f967c5468fa7e1ea0e5eb8e/src/app/client/components/setupForm.tsx#L39)

## Parameters

### \_\_namedParameters

#### serverConfiguration

\{ `database`: `null` \| \{ `dynamo`: \{ `accessKeyId`: `null` \| `string`; `accessSecretKey`: `null` \| `string`; `region`: `null` \| `string`; `tableName`: `null` \| `string`; \}; `mongo`: \{ `uri`: `null` \| `string`; \}; `provider`: `"MongoDB"` \| `"DynamoDB"`; \}; `host`: `null` \| \{ `provider`: `"Vercel"`; `vercel`: \{ `projectId`: `null` \| `string`; `projectName`: `null` \| `string`; `teamId`: `null` \| `string`; `token`: `null` \| `string`; \}; \}; `mediaStorage`: `null` \| `object`[] \| \{ `skipped`: `boolean`; \} \| \{ `skipped`: `boolean`; \}; `oauth`: `null` \| `object`[]; \}

#### serverConfiguration.database

`null` \| \{ `dynamo`: \{ `accessKeyId`: `null` \| `string`; `accessSecretKey`: `null` \| `string`; `region`: `null` \| `string`; `tableName`: `null` \| `string`; \}; `mongo`: \{ `uri`: `null` \| `string`; \}; `provider`: `"MongoDB"` \| `"DynamoDB"`; \} = `...`

#### serverConfiguration.host

`null` \| \{ `provider`: `"Vercel"`; `vercel`: \{ `projectId`: `null` \| `string`; `projectName`: `null` \| `string`; `teamId`: `null` \| `string`; `token`: `null` \| `string`; \}; \} = `...`

#### serverConfiguration.mediaStorage

`null` \| `object`[] \| \{ `skipped`: `boolean`; \} \| \{ `skipped`: `boolean`; \} = `...`

#### serverConfiguration.oauth

`null` \| `object`[] = `...`

## Returns

`Element`
