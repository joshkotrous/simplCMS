import {
  connectToDatabase,
  disconnectFromDatabase,
  getDatabaseUriEnvVariable,
  getModels,
} from "@/db";
import { CreatePage, Page, pageSchema } from "@/types/types";

export async function getAllPages(): Promise<Page[]> {
  try {
    const uri = getDatabaseUriEnvVariable();
    const db = await connectToDatabase(uri);
    const { PageModel } = getModels(db);
    const pages = await PageModel.find({}).select("__v");
    await disconnectFromDatabase(db);
    return pageSchema.array().parse(pages);
  } catch (error) {
    console.error(`Could not get all pages ${error}`);
    throw error;
  }
}

export async function createPage(page: CreatePage): Promise<Page> {
  try {
    const uri = getDatabaseUriEnvVariable();
    const db = await connectToDatabase(uri);
    const { PageModel } = getModels(db);
    const newPage = await PageModel.create(page);
    await disconnectFromDatabase(db);
    return pageSchema.parse(newPage);
  } catch (error) {
    console.error(`Could not get all pages ${error}`);
    throw error;
  }
}
