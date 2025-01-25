import { Post, User, SiteConfig, HostProvider } from "@/types/types";
import mongoose, { Schema } from "mongoose";

const SiteConfigSchema: Schema = new Schema<SiteConfig>({
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

const UserSchema: Schema = new Schema<User>({
  email: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  imageUrl: { type: String, required: true, default: null },
  name: { type: String, required: true, default: null },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema: Schema = new Schema<Post>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  category: { type: String },
  subtitle: { type: String },
  draft: { type: Boolean, required: true, default: false },
});

const UserModel =
  mongoose.models.User || mongoose.model<User>("User", UserSchema);
const PostModel =
  mongoose.models.Post || mongoose.model<Post>("Post", PostSchema);
const SiteConfigModel =
  mongoose.models.SiteConfig ||
  mongoose.model<SiteConfig>("SiteConfig", SiteConfigSchema);

export { UserModel, PostModel, SiteConfigModel };
