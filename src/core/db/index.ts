import mongoose, { Connection, Mongoose } from "mongoose";
import { UserSchema, PostSchema, SiteConfigSchema, PageSchema } from "./schema";
import { User, Post, SiteConfig, Page } from "../../../types/types";

let cachedMongoose: Mongoose | null = null;

export async function connectToDatabase(uri: string): Promise<Connection> {
  if (cachedMongoose && cachedMongoose.connection.readyState === 1) {
    return cachedMongoose.connection;
  }

  if (mongoose.connections.length > 0) {
    const existingConnection = mongoose.connections.find(
      (conn) => conn.readyState === 1
    );
    if (existingConnection) {
      cachedMongoose = mongoose;
      return existingConnection;
    }
  }

  try {
    mongoose.set("strictQuery", false);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });

    cachedMongoose = mongoose;

    console.log("Connected to MongoDB");
    return mongoose.connection;
  } catch (error) {
    console.error(`MongoDB connection error: ${error}`);
    throw error;
  }
}

export async function disconnectFromDatabase(): Promise<void> {
  try {
    if (cachedMongoose) {
      await cachedMongoose.disconnect();
      cachedMongoose = null;
      console.log("Disconnected from MongoDB");
    }
  } catch (error) {
    console.error(`Error disconnecting from MongoDB: ${error}`);
  }
}

export function getModels(connection: Connection) {
  return {
    UserModel:
      connection.models.User || connection.model<User>("User", UserSchema),
    PostModel:
      connection.models.Post || connection.model<Post>("Post", PostSchema),
    SiteConfigModel:
      connection.models.SiteConfig ||
      connection.model<SiteConfig>("SiteConfig", SiteConfigSchema),
    PageModel:
      connection.models.Page || connection.model<Page>("Page", PageSchema),
  };
}

export function getDatabaseUriEnvVariable(): string {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured.");
  return process.env.MONGO_URI;
}

export const db = {
  connectToDatabase,
  disconnectFromDatabase,
  getDatabaseUriEnvVariable,
  getModels,
};
