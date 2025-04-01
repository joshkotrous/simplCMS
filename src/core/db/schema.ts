import { Post, User, SiteConfig, Page } from "../../types/types";
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
  // SECURITY CRITICAL: This field represents user authorization level
  // Controllers that handle user creation and updates MUST implement proper access control
  // to prevent privilege escalation. Regular users should never be able to:
  // 1. Create accounts with admin role
  // 2. Update their own role to admin
  // This should be enforced by explicit role checks in the API controllers
  role: { 
    type: String, 
    enum: ["user", "admin"], 
    default: "user",
  },
  imageUrl: { type: String, required: false, default: null },
  name: { type: String, required: false, default: null },
  createdAt: { type: Date, default: Date.now },
});

// Add middleware to enforce role security
UserSchema.pre('save', function(next) {
  // If this is a new user (being created for the first time)
  if (this.isNew) {
    // Enforce user role for new accounts, regardless of what was requested
    // This prevents privilege escalation during account creation
    this.role = "user";
  }
  next();
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

// Define a child element schema for first-level nesting
const childElementSchema = {
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
  // Allow for one more level of nesting with the same structure
  children: {
    type: [{
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
      }
      // No more nesting at this level
    }],
    default: null,
  }
};

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
  // Use the child element schema instead of Schema.Types.Mixed
  children: [childElementSchema]
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