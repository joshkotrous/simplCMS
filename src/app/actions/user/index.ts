"use server";

import { User } from "@/types/types";
import {
  getUser,
  createUser,
  getAllUsers,
  deleteUser,
} from "@/packages/core/src/user";

export async function createUserAction(user: Partial<User>): Promise<void> {
  try {
    await createUser(user);
  } catch (error) {
    throw error;
  }
}

export async function getUserAction(user: Partial<User>): Promise<User> {
  try {
    const _user = await getUser(user);
    if (!user) throw new Error("User could not be found.");
    return _user;
  } catch (error) {
    throw error;
  }
}

export async function getAllUsersAction(): Promise<User[]> {
  try {
    const users = await getAllUsers();
    return users;
  } catch (error) {
    throw error;
  }
}

export async function deleteUserAction(user: User): Promise<void> {
  try {
    await deleteUser(user);
  } catch (error) {
    throw error;
  }
}
