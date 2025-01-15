"use server";

import { UserType } from "@/db/schema";
import { getUser, createUser, getAllUsers } from "@/packages/core/src/user";

export async function createUserAction(user: Partial<UserType>): Promise<void> {
  try {
    await createUser(user);
  } catch (error) {
    throw error;
  }
}

export async function getUserAction(
  user: Partial<UserType>
): Promise<UserType> {
  try {
    const _user = await getUser(user);
    if (!user) throw new Error("User could not be found.");
    return _user;
  } catch (error) {
    throw error;
  }
}

export async function getAllUsersAction(): Promise<UserType[]> {
  try {
    const users = await getAllUsers();
    return users;
  } catch (error) {
    throw error;
  }
}
