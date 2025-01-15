import mongoose, { Mongoose } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function connectToDatabase(): Promise<Mongoose> {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not configured.");
    }
    const uri = process.env.MONGO_URI;
    const db = await mongoose.connect(uri);
    return db;
  } catch (error) {
    console.error(`Unable to connect to DB: ${error}`);
    throw error;
  }
}
