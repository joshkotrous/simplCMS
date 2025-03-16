import { connectToDatabase, getDatabaseUriEnvVariable, getModels } from "@/db";
import { User, userSchema } from "@/types";
export async function createUser(
  userData: Partial<User>,
  dbUri?: string
): Promise<void> {
  try {
    if (!dbUri) {
      dbUri = getDatabaseUriEnvVariable();
    }
    const db = await connectToDatabase(dbUri);

    const { UserModel } = getModels(db);

    const newUser = new UserModel(userData);
    await newUser.save();
  } catch (error) {
    console.error(`Could not create user ${error}`);
    throw error;
  }
}

export async function getUser(user: Partial<User>): Promise<User> {
  try {
    const uri = getDatabaseUriEnvVariable();

    const db = await connectToDatabase(uri);

    const { UserModel } = getModels(db);
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
    console.error(`Could not get user: ${error}`);
    throw error;
  }
}

export async function getAllUsers(dbUri?: string): Promise<User[]> {
  try {
    if (!dbUri) {
      dbUri = getDatabaseUriEnvVariable();
    }
    const db = await connectToDatabase(dbUri);
    const { UserModel } = getModels(db);
    const users = await UserModel.find({})
      .sort({ createdAt: -1 })
      .select("-__v");

    return userSchema.array().parse(users);
  } catch (error) {
    console.error(`Could not get all users ${error}`);
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const uri = getDatabaseUriEnvVariable();
    const db = await connectToDatabase(uri);
    const { UserModel } = getModels(db);
    const user = await UserModel.findOne({ email }).select("-__v");
    if (!user) return null;
    return userSchema.parse(user);
  } catch (error) {
    console.error(`Could not get user by email ${error}`);
    throw error;
  }
}

export async function userHasAccess(user: User): Promise<boolean> {
  try {
    const allUsers = await getAllUsers();
    const hasAccess = allUsers.some((_user) => user.email === _user.email);
    return hasAccess;
  } catch (error) {
    console.error(`Could not check user access ${error}`);
    throw error;
  }
}

export async function deleteUser(user: User): Promise<void> {
  try {
    const uri = getDatabaseUriEnvVariable();

    const db = await connectToDatabase(uri);
    const { UserModel } = getModels(db);
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
    console.error(`Could not delete user: ${error}`);
    throw error;
  }
}

export async function updateUser(user: Partial<User>): Promise<void> {
  try {
    const uri = getDatabaseUriEnvVariable();

    const db = await connectToDatabase(uri);
    const { UserModel } = getModels(db);
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
    console.error(`Could not update user: ${error}`);
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
