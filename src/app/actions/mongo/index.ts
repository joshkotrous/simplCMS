"use server";

import { connectToDatabase } from "@/db";

export async function testConnection(uri: string): Promise<void> {
  try {
    await connectToDatabase(uri);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
