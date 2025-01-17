import type { Document } from "mongoose";

export type SiteConfigType = {
  _id: string;
  logo: string;
};

export type UserType = {
  _id: string;
  email: string;
  imageUrl: string;
  name: string;
  role: "user" | "admin";
  createdAt: Date;
};

export type PostType = {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  category: string;
  subtitle: string;
  draft: boolean;
};

export type PageInfo = {
  route: string;
  filePath: string;
  type: "static" | "dynamic";
  lastModified: Date;
};

export type CloudinaryMedia = {
  asset_id: string;
  display_name: string;
  resource_type: "image" | "video";
  secure_url: string;
  format: string;
};

export type UserDocument = UserType & Document;
export type PostDocument = PostType & Document;
export type SiteConfigDocument = SiteConfigType & Document;

export type CreateSiteConfigType = Omit<SiteConfigType, "_id">;
export type UpdateSiteConfigType = Partial<CreateSiteConfigType>;

export type CreateUserType = Omit<UserType, "_id" | "createdAt">;
export type UpdateUserType = Partial<CreateUserType>;

export type CreatePostType = Omit<PostType, "createdAt" | "_id">;
export type UpdatePostType = Partial<CreatePostType>;
