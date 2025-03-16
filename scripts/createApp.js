#!/usr/bin/env node
import { execSync } from "child_process";
import path from "path";
import fs from "fs"
import readline from "readline"

async function createApp() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    // Always prompt for project name with a default suggestion
    const defaultName = "simplcms-app";
    const appName = await new Promise((resolve) => {
      rl.question(`Project name: (${defaultName}) `, (answer) => {
        // Use the default name if user just presses Enter
        resolve(answer.trim() || defaultName);
      });
    });
    
    // Get TypeScript preference from user
    const useTypeScript = await new Promise((resolve) => {
      rl.question("Use TypeScript? (Y/n): ", (answer) => {
        const response = answer.trim().toLowerCase();
        resolve(response === "" || response === "y" || response === "yes");
      });
    });
    
    // Close readline interface after getting inputs
    rl.close();
    
    console.log(`\nCreating a new Next.js app: ${appName}`);
    console.log("This might take a few minutes...\n");
    
    // Build the create-next-app command with options
    // Use the --yes flag to skip all prompts and --no-* format for boolean flags
    let command = `npx create-next-app@latest ${appName} --yes`;
    
    // Add appropriate flags based on user choices
    if (useTypeScript) {
      command += ` --typescript`;
    } else {
      command += ` --no-typescript`;
    }
    
    // Add the rest of our default choices
    command += ` --app`;         // Always use App Router
    command += ` --eslint`;      // Always use ESLint
    command += ` --src-dir`;     // Always use src directory
    command += ` --import-alias="@/*"`;  // Set import alias
    command += ` --tailwind`;    // Include Tailwind CSS
    
    // Execute create-next-app with the correct flags
    execSync(command, { stdio: "inherit" });
    
    console.log("\nNext.js app created successfully!");
    console.log("Initializing SimplCMS...\n");
    
    // Change to the app directory
    const appDir = path.join(process.cwd(), appName);
    process.chdir(appDir);
    
    // Run the SimplCMS init command
    try {
      execSync("npx simplcms init", { stdio: "inherit" });
      console.log("\nSimplCMS initialized successfully!");
    } catch (error) {
      // Try direct import if the npx command fails
      console.log("Using local init function...");
      const { init } = await import("./init")
      await init();
    }
    
    console.log("\n✨ All done! Your Next.js app with SimplCMS is ready.");
    console.log(`\nTo get started:`);
    console.log(`  cd ${appName}`);
    console.log("  npm run dev\n");
    console.log("Then open http://localhost:3000 in your browser.");
    console.log("The SimplCMS admin panel is available at http://localhost:3000/admin");
  } catch (error) {
    console.error("Error creating app:", error);
    process.exit(1);
  }
}

// Export the function
module.exports = { createApp };