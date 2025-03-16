#!/usr/bin/env node
const { init } = require("./init");
const { createApp } = require("./create-app");

const command = process.argv[2];

async function main() {
  switch (command) {
    case "init":
      await init();
      break;
    case "create-app":
      await createApp();
      break;
    default:
      console.log("SimplCMS CLI");
      console.log("\nUsage:");
      console.log("  npx simplcms init - Initialize SimplCMS in an existing Next.js project");
      console.log("  npx simplcms create-app [app-name] - Create a new Next.js app with SimplCMS");
      break;
  }
}

main();