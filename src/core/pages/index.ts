import { CreatePage, Page, pageSchema } from "../../types/types";
import { simplcms } from "../../core";
export async function getAllPages(): Promise<Page[]> {
  try {
    const uri = simplcms.db.getDatabaseUriEnvVariable();
    if (!uri) return [];
    const db = await simplcms.db.connectToDatabase(uri);
    const { PageModel } = simplcms.db.getModels(db);

    const pages = await PageModel.find({}).select("-__v");

    console.log("PAGES", pages);
    return pageSchema.array().parse(pages);
  } catch (error) {
    // Generic error message that doesn't expose implementation details
    console.error("Error retrieving pages: Operation failed");
    throw error;
  }
}
export async function createPage(
  page: CreatePage,
  uri?: string | null
): Promise<Page | null> {
  try {
    if (!uri) {
      uri = simplcms.db.getDatabaseUriEnvVariable();
      if (!uri) return null;
    }
    const db = await simplcms.db.connectToDatabase(uri);
    const { PageModel } = simplcms.db.getModels(db);
    const newPage = await PageModel.create(page);

    return pageSchema.parse(newPage);
  } catch (error) {
    // Generic error message that doesn't expose implementation details
    console.error("Error creating page: Operation failed");
    throw error;
  }
}

export async function getPageByRoute(route: string): Promise<Page | null> {
  try {
    const uri = simplcms.db.getDatabaseUriEnvVariable();
    if (!uri) return null;
    const db = await simplcms.db.connectToDatabase(uri);
    const { PageModel } = simplcms.db.getModels(db);

    const page = await PageModel.findOne({ route });

    if (!page) {
      return null;
    }

    return pageSchema.parse(page);
  } catch (error) {
    // Only include the route parameter as it's user-provided and not sensitive
    console.error(`Error retrieving page with route '${route}': Operation failed`);
    throw error;
  }
}

export const pages = {
  getAllPages,
  createPage,
  getPageByRoute,
};