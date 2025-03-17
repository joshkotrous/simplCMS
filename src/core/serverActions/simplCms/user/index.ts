"use server";

import { User } from "../../../../types/types";
import { simplcms } from "../../../../core";

export async function createUserAction(
  user: Partial<User>,
  dbUri?: string
): Promise<void> {
  try {
    await simplcms.users.createUser(user, dbUri);
  } catch (error) {
    throw error;
  }
}

export async function getUserAction(user: Partial<User>): Promise<User> {
  try {
    const _user = await simplcms.users.getUser(user);
    if (!user) throw new Error("User could not be found.");
    return _user;
  } catch (error) {
    throw error;
  }
}

export async function getAllUsersAction(): Promise<User[]> {
  try {
    const users = await simplcms.users.getAllUsers();
    return users;
  } catch (error) {
    throw error;
  }
}

export async function deleteUserAction(user: User): Promise<void> {
  try {
    await simplcms.users.deleteUser(user);
  } catch (error) {
    throw error;
  }
}
