import { simplcms } from "../../core";
import { User, userSchema } from "../../types/types";

// Utility function to safely log errors without exposing sensitive details
function logErrorSafely(operation: string): void {
  console.error(`Error during ${operation}. Check server logs for detailed information.`);
}

export async function createUser(
  userData: Partial<User>,
  dbUri?: string | null
): Promise<void> {
  try {
    if (!dbUri) {
      dbUri = simplcms.db.getDatabaseUriEnvVariable();
      if (!dbUri) return;
    }
    const db = await simplcms.db.connectToDatabase(dbUri);

    const { UserModel } = simplcms.db.getModels(db);

    const newUser = new UserModel(userData);
    await newUser.save();
  } catch (error) {
    logErrorSafely("user creation");
    throw error;
  }
}

export async function getUser(user: Partial<User>): Promise<User | null> {
  try {
    const uri = simplcms.db.getDatabaseUriEnvVariable();
    if (!uri) return null;
    const db = await simplcms.db.connectToDatabase(uri);

    const { UserModel } = simplcms.db.getModels(db);
    let query = {};
    if (user.email) {
      query = { email: user.email };
    } else if (user._id) {
      query = { _id: user._id };
    } else {
      throw new Error("Either email or _id must be provided");
    }

    const foundUser = await UserModel.findOne(query).select("-__v");
    if (!foundUser) {
      throw new Error("User not found");
    }

    return userSchema.parse(JSON.stringify(foundUser));
  } catch (error) {
    logErrorSafely("user retrieval");
    throw error;
  }
}

export async function getAllUsers(dbUri?: string | null): Promise<User[]> {
  try {
    if (!dbUri) {
      dbUri = simplcms.db.getDatabaseUriEnvVariable();
      if (!dbUri) return [];
    }
    const db = await simplcms.db.connectToDatabase(dbUri);
    const { UserModel } = simplcms.db.getModels(db);
    const users = await UserModel.find({})
      .sort({ createdAt: -1 })
      .select("-__v");

    return userSchema.array().parse(users);
  } catch (error) {
    logErrorSafely("retrieving all users");
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const uri = simplcms.db.getDatabaseUriEnvVariable();
    if (!uri) return null;
    const db = await simplcms.db.connectToDatabase(uri);
    const { UserModel } = simplcms.db.getModels(db);
    const user = await UserModel.findOne({ email }).select("-__v");
    if (!user) return null;
    return userSchema.parse(user);
  } catch (error) {
    logErrorSafely("retrieving user by email");
    throw error;
  }
}

export async function userHasAccess(user: User): Promise<boolean> {
  try {
    const allUsers = await getAllUsers();
    const hasAccess = allUsers.some((_user) => user.email === _user.email);
    return hasAccess;
  } catch (error) {
    logErrorSafely("checking user access");
    throw error;
  }
}

export async function deleteUser(user: User): Promise<void> {
  try {
    const uri = simplcms.db.getDatabaseUriEnvVariable();
    if (!uri) return;
    const db = await simplcms.db.connectToDatabase(uri);
    const { UserModel } = simplcms.db.getModels(db);
    let query = {};
    if (user.email) {
      query = { email: user.email };
    } else if (user._id) {
      query = { _id: user._id };
    } else {
      throw new Error("Either email or _id must be provided");
    }
    const result = await UserModel.deleteOne(query);
    if (result.deletedCount === 0) {
      throw new Error("User not found");
    }
  } catch (error) {
    logErrorSafely("user deletion");
    throw error;
  }
}

export async function updateUser(user: Partial<User>): Promise<void> {
  try {
    const uri = simplcms.db.getDatabaseUriEnvVariable();
    if (!uri) return;
    const db = await simplcms.db.connectToDatabase(uri);
    const { UserModel } = simplcms.db.getModels(db);
    let query = {};
    if (user.email) {
      query = { email: user.email };
    } else if (user._id) {
      query = { _id: user._id };
    } else {
      throw new Error("Either email or _id must be provided");
    }

    const updateData = { ...user };
    delete updateData._id;
    delete updateData.email;

    const result = await UserModel.updateOne(query, { $set: updateData });

    if (result.matchedCount === 0) {
      throw new Error("User not found");
    }

    if (result.modifiedCount === 0) {
      throw new Error("No changes were made to the user");
    }
  } catch (error) {
    logErrorSafely("user update");
    throw error;
  }
}

export const users = {
  updateUser,
  deleteUser,
  userHasAccess,
  getUserByEmail,
  getAllUsers,
  getUser,
  createUser,
};