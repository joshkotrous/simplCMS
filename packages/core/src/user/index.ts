import connectToDatabase, { getDatabaseUriEnvVariable } from "@/db";
import { User } from "@/db/schema";
import { UserType } from "@/types/types";
export async function createUser(userData: Partial<UserType>): Promise<void> {
  try {
    const uri = getDatabaseUriEnvVariable();

    await connectToDatabase(uri);
    const newUser = new User(userData);
    await newUser.save();
  } catch (error) {
    console.error(`Could not create user ${error}`);
    throw error;
  }
}

export async function getUser(user: Partial<UserType>): Promise<UserType> {
  try {
    const uri = getDatabaseUriEnvVariable();

    await connectToDatabase(uri);
    let query = {};
    if (user.email) {
      query = { email: user.email };
    } else if (user._id) {
      query = { _id: user._id };
    } else {
      throw new Error("Either email or _id must be provided");
    }

    const foundUser = await User.findOne(query).select("-__v");
    if (!foundUser) {
      throw new Error("User not found");
    }

    return JSON.parse(JSON.stringify(foundUser));
  } catch (error) {
    console.error(`Could not get user: ${error}`);
    throw error;
  }
}

export async function getAllUsers(): Promise<UserType[]> {
  try {
    const uri = getDatabaseUriEnvVariable();

    await connectToDatabase(uri);
    const users = await User.find({}).sort({ createdAt: -1 }).select("-__v");
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error(`Could not get all users ${error}`);
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<UserType> {
  try {
    const uri = getDatabaseUriEnvVariable();

    await connectToDatabase(uri);
    const user = await User.findOne({ email }).select("-__v");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error(`Could not get user by email ${error}`);
    throw error;
  }
}

export async function userHasAccess(user: UserType): Promise<boolean> {
  try {
    const uri = getDatabaseUriEnvVariable();

    await connectToDatabase(uri);
    const allUsers = await getAllUsers();
    const hasAccess = allUsers.some((_user) => user.email === _user.email);
    return hasAccess;
  } catch (error) {
    console.error(`Could not check user access ${error}`);
    throw error;
  }
}

export async function deleteUser(user: UserType): Promise<void> {
  try {
    const uri = getDatabaseUriEnvVariable();

    await connectToDatabase(uri);
    let query = {};
    if (user.email) {
      query = { email: user.email };
    } else if (user._id) {
      query = { _id: user._id };
    } else {
      throw new Error("Either email or _id must be provided");
    }

    const result = await User.deleteOne(query);
    if (result.deletedCount === 0) {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error(`Could not delete user: ${error}`);
    throw error;
  }
}

export async function updateUser(user: Partial<UserType>): Promise<void> {
  try {
    const uri = getDatabaseUriEnvVariable();
    await connectToDatabase(uri);

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

    const result = await User.updateOne(query, { $set: updateData });

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
export * as user from ".";
