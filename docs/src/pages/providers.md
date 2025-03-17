---
title: Providers
---

# Providers

SimplCMS is designed to be provider-agnostic, allowing you to choose the best services for hosting, data storage, media storage, and authentication. It is built specifically for **Next.js** and uses **NextAuth** under the hood for authentication.

## Available Providers

### Hosting

- **Vercel** – Deploy your SimplCMS-powered Next.js site effortlessly.

### Data Storage

- **MongoDB** – A flexible NoSQL database for storing structured content.
- **DynamoDB** _(TBA)_ – A fully managed NoSQL database by AWS.
- **MySQL** _(TBA)_ – A popular relational database for structured content storage.

### Media Storage

- **Cloudinary** – Optimized image and video storage with built-in transformations.
- **AWS S3** – Scalable cloud storage for media and assets.

### OAuth Authentication

SimplCMS uses **NextAuth** under the hood for handling authentication. Currently supported and upcoming OAuth providers:

- **Google** – Authenticate users using Google OAuth.
- **Microsoft** _(TBA)_ – Authentication via Microsoft accounts.
- **GitHub** _(TBA)_ – Authentication for developers using GitHub OAuth.

## Using Providers in SimplCMS

SimplCMS provides a built-in API at `simplcms.providers`, allowing you to access and interact with your providers seamlessly.

```ts
import { simplcms } from "simplcms";

const project = await simplcms.providers.vercel.getProject(id);
const media = await simplcms.providers.s3.getMedia();
```

## Next.js Requirement

SimplCMS is built exclusively for Next.js and leverages server-side rendering (SSR) along with API routes to handle data processing and authentication efficiently.

For more details on configuring each provider, check out our [API Reference]("").
