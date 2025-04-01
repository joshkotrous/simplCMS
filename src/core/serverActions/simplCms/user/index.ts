"use server";

import { User } from "../../../../types/types";
import { simplcms } from "../../..";

// Function to validate user input
function validateUser(user: Partial<User>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check if user is an object
  if (!user || typeof user !== 'object' || Array.isArray(user)) {
    errors.push('User data must be an object');
    return { isValid: false, errors };
  }
  
  // Check for malicious content in string values
  for (const [key, value] of Object.entries(user)) {
    if (typeof value === 'string') {
      // Check for potential script injection
      if (/<script|javascript:|data:|onerror=|onclick=|eval\(|setTimeout\(/i.test(value)) {
        errors.push(`Field '${key}' contains potentially unsafe content`);
      }
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

// Function to sanitize user data
function sanitizeUser(user: Partial<User>): Partial<User> {
  const sanitized: Partial<User> = {};
  
  for (const [key, value] of Object.entries(user)) {
    if (value === undefined || value === null) {
      sanitized[key as keyof User] = value;
      continue;
    }
    
    if (typeof value === 'string') {
      // Trim strings and ensure they're not excessively long
      sanitized[key as keyof User] = value.trim().slice(0, 1000) as any;
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key as keyof User] = value;
    } else if (typeof value === 'object') {
      if (Array.isArray(value)) {
        sanitized[key as keyof User] = [...value] as any; // Simple shallow copy for arrays
      } else {
        sanitized[key as keyof User] = { ...value } as any; // Simple shallow copy for objects
      }
    } else {
      // For other types, just copy the value
      sanitized[key as keyof User] = value as any;
    }
  }
  
  return sanitized;
}

export async function createUserAction(
  user: Partial<User>,
  dbUri?: string
): Promise<void> {
  try {
    // Validate user input
    const { isValid, errors } = validateUser(user);
    if (!isValid) {
      throw new Error(`Invalid user data: ${errors.join(', ')}`);
    }
    
    // Sanitize user data
    const sanitizedUser = sanitizeUser(user);
    
    // Create the user with sanitized data
    await simplcms.users.createUser(sanitizedUser, dbUri);
  } catch (error) {
    throw error;
  }
}

export async function getUserAction(user: Partial<User>): Promise<User | null> {
  try {
    // Validate user input
    const { isValid, errors } = validateUser(user);
    if (!isValid) {
      throw new Error(`Invalid user data: ${errors.join(', ')}`);
    }
    
    // Sanitize user data for lookup
    const sanitizedUser = sanitizeUser(user);
    
    const _user = await simplcms.users.getUser(sanitizedUser);
    if (!_user) throw new Error("User could not be found.");
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
    // Validate user input
    const { isValid, errors } = validateUser(user);
    if (!isValid) {
      throw new Error(`Invalid user data: ${errors.join(', ')}`);
    }
    
    // Sanitize user data before deletion
    const sanitizedUser = sanitizeUser(user);
    
    await simplcms.users.deleteUser(sanitizedUser);
  } catch (error) {
    throw error;
  }
}