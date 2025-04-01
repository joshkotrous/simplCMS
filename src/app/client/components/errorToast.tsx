"use client";

import { useEffect } from "react";
import { toast } from "sonner";

// Helper function to safely convert the error to a displayable string
function sanitizeErrorMessage(error: any): string {
  if (error === null || error === undefined) {
    return "An unknown error occurred";
  }
  
  let errorMessage: string;
  
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error instanceof Error) {
    // For Error objects, include both name and message if available
    errorMessage = error.name ? `${error.name}: ${error.message}` : error.message;
  } else if (typeof error === 'object') {
    try {
      // Attempt to get a useful representation of the object
      errorMessage = JSON.stringify(error);
    } catch {
      errorMessage = "Error object could not be displayed";
    }
  } else {
    // Convert any other type to string
    errorMessage = String(error);
  }
  
  // Trim the error message to a reasonable length to prevent UI issues
  return errorMessage.length > 500 ? errorMessage.substring(0, 500) + "..." : errorMessage;
}

export default function ErrorToast({ error }: { error: any }) {
  useEffect(() => {
    // Sanitize the error message before displaying it
    const sanitizedError = sanitizeErrorMessage(error);
    
    toast.error(
      <div className="flex items-center gap-2 min-w-0 max-w-full">
        <span className="truncate">Error occurred: {sanitizedError}</span>
      </div>
    );
  }, [error]);

  return null;
}