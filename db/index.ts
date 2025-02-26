// db-utils.ts
import mongoose, { Connection } from "mongoose";
import { UserSchema, PostSchema, SiteConfigSchema } from "./schema";
import { User, Post, SiteConfig } from "@/types/types";

// Connection cache to reuse connections
const connectionCache: Record<string, Connection> = {};

export async function connectToDatabase(uri: string): Promise<Connection> {
  // Check if we already have this connection
  if (connectionCache[uri] && connectionCache[uri].readyState === 1) {
    return connectionCache[uri];
  }

  try {
    // Create new connection with better timeout settings
    const connection = mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });

    // Wait for connection to be established
    await new Promise<void>((resolve, reject) => {
      connection.once("connected", () => resolve());
      connection.once("error", (err) => reject(err));
    });

    // Cache the connection
    connectionCache[uri] = connection;
    return connection;
  } catch (error) {
    console.error(`Unable to connect to DB: ${error}`);
    throw error;
  }
}

export async function disconnectFromDatabase(
  connection: Connection
): Promise<void> {
  try {
    // Remove from cache and close
    Object.keys(connectionCache).forEach((key) => {
      if (connectionCache[key] === connection) {
        delete connectionCache[key];
      }
    });

    await connection.close();
  } catch (error) {
    console.error(`Error disconnecting from DB: ${error}`);
  }
}

// Get models for a specific connection
export function getModels(connection: Connection) {
  return {
    UserModel:
      connection.models.User || connection.model<User>("User", UserSchema),
    PostModel:
      connection.models.Post || connection.model<Post>("Post", PostSchema),
    SiteConfigModel:
      connection.models.SiteConfig ||
      connection.model<SiteConfig>("SiteConfig", SiteConfigSchema),
  };
}

export function getDatabaseUriEnvVariable(): string {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured.");
  return process.env.MONGO_URI;
}
