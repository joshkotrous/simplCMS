import type { Document } from "mongoose";

// Base types
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

// Document types
export type UserDocument = UserType & Document;
export type PostDocument = PostType & Document;

// Optional: Create types for operations like create/update
export type CreateUserType = Omit<UserType, "_id" | "createdAt">;
export type UpdateUserType = Partial<CreateUserType>;

export type CreatePostType = Omit<PostType, "createdAt" | "_id">;
export type UpdatePostType = Partial<CreatePostType>;
