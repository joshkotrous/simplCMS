[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjoshkotrous%2FsimplCMS%2Ftree%2Fmain&project-name=simplcms&repository-name=simplcms-starter)
![npm (latest)](https://img.shields.io/npm/v/simplcms/latest?label=latest&color=green)
![npm (canary)](https://img.shields.io/npm/v/simplcms/canary?label=canary&color=orange)
![Secured with Pensar](https://pensar-brand-assets.s3.us-east-1.amazonaws.com/secured-with-pensar-badge.svg)


# SimplCMS

SimplCMS is the _simplest_ CMS ecosystem that easily integrates to an existing NextJS application or use our `simplcms-starter` project for a brand new project.

## Providers

SimplCMS allows you to easily integrate with these providers within the content management platform:

### Media

1. AWS S3
2. Cloudinary

### Oauth

\*Oauth integrations are made possible by Next Auth

1. Google oauth
2. Microsoft oauth (tba)
3. Github oauth (tba)

### Data store

1. MongoDB
2. AWS Dynamo DB (tba)
3. AWS MongoDB (tba)
4. MySQL (tba)
5. Supabase (tba)

### Host

1. Vercel
2. Cloudflare (tba)

## Getting Started

### Starting a new project

To create a brand new Next JS project using the SimplCMS backend, run `npx simplcms@latest create-app`.

### Adding to existing project

To integrate SimplCMS with your existing project, run `npx simplcms@latest init` within your NextJS project. This script will:

1. Install SimplCMS and necessary depedencies
2. Create the necessary pages route for the SimplCMS router
3. Create the necessary api route for Next Auth
4. Add necessary configurations to your next config

## Whats next

### Get Support

If you need help, you can find us at https://simplcms.com

### Read our documentation

You can find more info about SimplCMS via our documentation at https://docs.simplcms.com

### Contribute

SimplCMS is 100% open source and we welcome contributions. If you find a bug to report, open an issue or see `CONTRIBUTING.md` for more contribution information.
