import { PostType, UserType, SiteConfigType } from "@/types/types";
import mongoose, { Schema } from "mongoose";

const SiteConfigSchema: Schema = new Schema<SiteConfigType>({
  logo: { type: String, required: false },
});

const UserSchema: Schema = new Schema<UserType>({
  email: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  imageUrl: { type: String, required: false },
  name: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema: Schema = new Schema<PostType>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  category: { type: String, required: true },
  subtitle: { type: String, required: true },
  draft: { type: Boolean, required: true, default: false },
});

const User =
  mongoose.models.User || mongoose.model<UserType>("User", UserSchema);
const Post =
  mongoose.models.Post || mongoose.model<PostType>("Post", PostSchema);
const SiteConfig =
  mongoose.models.SiteConfig ||
  mongoose.model<SiteConfigType>("SiteConfig", SiteConfigSchema);

export { User, Post, SiteConfig };
