"use server";

import { simplcms } from "../../../../core";

export async function testConnection(uri: string): Promise<void> {
  try {
    await simplcms.db.connectToDatabase(uri);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
