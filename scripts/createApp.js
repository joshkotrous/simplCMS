#!/usr/bin/env node
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createApp() {
  try {
    // Get app name from arguments or prompt user
    const args = process.argv.slice(2);
    let appName = args[0];
    
    if (!appName) {
      appName = await new Promise((resolve) => {
        rl.question("What would you like to name your app? ", (answer) => {
          resolve(answer.trim());
        });
      });
      
      if (!appName) {
        console.error("App name is required.");
        process.exit(1);
      }
    }
    
    // Get TypeScript preference from user
    const useTypeScript = await new Promise((resolve) => {
      rl.question("Use TypeScript? (Y/n): ", (answer) => {
        const response = answer.trim().toLowerCase();
        resolve(response === "" || response === "y" || response === "yes");
      });
    });
    
    // Always use App Router (set as default)
    const useAppDir = true;
    
    // Close readline interface after getting inputs
    rl.close();
    
    console.log(`\nCreating a new Next.js app: ${appName}`);
    console.log("This might take a few minutes...\n");
    
    // Build the create-next-app command with options
    let command = `npx create-next-app@latest ${appName}`;
    command += ` --ts=${useTypeScript}`;
    command += ` --app=true`; // Always use App Router
    command += ` --eslint=true`;
    command += ` --src-dir=true`;
    command += ` --import-alias="@/*"`;
    
    // Execute create-next-app
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
      const { init } = require("./init");
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

// Execute the createApp function
createApp();

module.exports = { createApp };