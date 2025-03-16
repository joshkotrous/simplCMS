import { connectToDatabase, getDatabaseUriEnvVariable, getModels } from "@/db";
import { CreatePage, Page, pageSchema } from "@/types";

export async function getAllPages(): Promise<Page[]> {
  try {
    const uri = getDatabaseUriEnvVariable();
    const db = await connectToDatabase(uri);
    const { PageModel } = getModels(db);

    const pages = await PageModel.find({}).select("-__v");

    console.log("PAGES", pages);
    return pageSchema.array().parse(pages);
  } catch (error) {
    console.error(`Could not get all pages ${error}`);
    throw error;
  }
}
export async function createPage(
  page: CreatePage,
  uri?: string
): Promise<Page> {
  try {
    if (!uri) {
      uri = getDatabaseUriEnvVariable();
    }
    const db = await connectToDatabase(uri);
    const { PageModel } = getModels(db);
    const newPage = await PageModel.create(page);

    return pageSchema.parse(newPage);
  } catch (error) {
    console.error(`Could not create page ${error}`);
    throw error;
  }
}

export async function getPageByRoute(route: string): Promise<Page | null> {
  try {
    const uri = getDatabaseUriEnvVariable();
    const db = await connectToDatabase(uri);
    const { PageModel } = getModels(db);

    const page = await PageModel.findOne({ route });

    if (!page) {
      return null;
    }

    return pageSchema.parse(page);
  } catch (error) {
    console.error(`Could not get page by route: ${route}. Error: ${error}`);
    throw error;
  }
}

export const pages = {
  getAllPages,
  createPage,
  getPageByRoute,
};
