#!/usr/bin/env node
const { init } = require("./init");
const { createApp } = require("./createApp");
const command = process.argv[2];
const appName = process.argv[3];

async function main() {
  try {
    switch (command) {
      case "init":
        await init();
        break;
      case "create-app":
        await createApp(appName);
        break;
      case undefined:
      default:
        console.log("SimplCMS CLI");
        console.log("\nUsage:");
        console.log("  npx simplcms init - Initialize SimplCMS in an existing Next.js project");
        console.log("  npx simplcms create-app [app-name] - Create a new Next.js app with SimplCMS");
        break;
    }
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();