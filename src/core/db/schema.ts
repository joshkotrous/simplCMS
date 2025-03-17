import { Post, User, SiteConfig, Page } from "../../../types/types";
import { Schema } from "mongoose";

export const SiteConfigSchema: Schema = new Schema<SiteConfig>({
  logo: { type: String },
  simplCMSHostProvider: {
    type: String,
    enum: ["Vercel"],
    required: true,
  },
  simplCMSDbProvider: {
    type: String,
    enum: ["MongoDB", "DynamoDB"],
    required: true,
  },
  simplCMSOauthProviders: [
    {
      type: String,
      enum: ["Google", "GitHub", "Microsoft"],
      required: true,
    },
  ],
  simplCMSMediaStorageProviders: [
    {
      type: String,
      enum: ["Cloudinary", "AWS S3"],
      required: true,
    },
  ],
});

export const UserSchema: Schema = new Schema<User>({
  email: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  imageUrl: { type: String, required: false, default: null },
  name: { type: String, required: false, default: null },
  createdAt: { type: Date, default: Date.now },
});

export const PostSchema: Schema = new Schema<Post>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  category: { type: String },
  subtitle: { type: String },
  slug: { type: String },
  draft: { type: Boolean, required: true, default: false },
  metadata: {
    title: { type: String },
    description: { type: String },
    ogImage: { type: String },
  },
});

const elementSchemaDefinition = {
  type: {
    type: String,
    enum: [
      "div",
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "img",
      "a",
      "button",
      "section",
      "nav",
      "footer",
      "header",
    ],
    required: true,
  },
  styles: {
    type: [
      {
        property: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
    default: null,
  },
  attributes: {
    type: Map,
    of: String,
    default: null,
  },
  content: {
    type: String,
    default: null,
  },
  children: [Schema.Types.Mixed],
};

export const PageSchema = new Schema<Page>({
  route: {
    type: String,
    required: true,
    unique: true,
  },
  metadata: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    keywords: {
      type: [String],
      default: null,
    },
    ogImage: {
      type: String,
      default: null,
    },
  },
  elements: [elementSchemaDefinition],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  publishedAt: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    required: true,
    default: "draft",
  },
});

PageSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});
