import mongoose, { Mongoose } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function connectToDatabase(
  uri: string
): Promise<Mongoose> {
  try {
    const db = await mongoose.connect(uri);
    return db;
  } catch (error) {
    console.error(`Unable to connect to DB: ${error}`);
    throw error;
  }
}

export function getDatabaseUriEnvVariable(): string {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured.");
  return process.env.MONGO_URI;
}
