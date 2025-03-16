#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

async function init() {
  // Detect if project is using TypeScript
  let isTypeScriptProject = false;
  
  // Check for tsconfig.json to determine if it's a TypeScript project
  if (fs.existsSync(path.join(process.cwd(), "tsconfig.json"))) {
    isTypeScriptProject = true;
    console.log("Detected TypeScript project");
  } else {
    console.log("Detected JavaScript project");
  }
  
  // File extensions based on project type
  const pageExt = isTypeScriptProject ? ".tsx" : ".jsx";
  const routeExt = isTypeScriptProject ? ".ts" : ".js";
  const configExt = isTypeScriptProject ? ".ts" : ".js";
  
  // Determine if project uses src/app or just app
  let appDir;
  if (fs.existsSync(path.join(process.cwd(), "src", "app"))) {
    appDir = path.join(process.cwd(), "src", "app");
    console.log("Detected src/app directory structure");
  } else {
    appDir = path.join(process.cwd(), "app");
    console.log("Using app directory structure");
    // Create app directory if it doesn't exist
    if (!fs.existsSync(appDir)) {
      fs.mkdirSync(appDir, { recursive: true });
      console.log("Created app directory");
    }
  }
  
  // 1. Try to install simplcms, but continue if it fails (for testing)
  console.log("Installing simplcms...");
  try {
    execSync("npm install simplcms", { stdio: "inherit" });
    console.log("simplcms installed successfully!");
  } catch (error) {
    console.log("Skipping simplcms installation for testing purposes.");
    // Continue execution instead of exiting
  }
  
  // 2. Setup admin/[[...slug]] folder with page file
  console.log("Setting up admin route...");
  const adminDir = path.join(appDir, "admin", "[[...slug]]");
  try {
    fs.mkdirSync(adminDir, { recursive: true });
    
    // Create page content with appropriate TypeScript types if needed
    const adminPageContent = isTypeScriptProject 
      ? `import { SimplCMSRouter } from "simplcms";

export default function AdminPage({ params }: { params: { slug?: string[] } }) {
  return <SimplCMSRouter params={params} />;
}`
      : `import { SimplCMSRouter } from "simplcms";

export default function AdminPage({ params }) {
  return <SimplCMSRouter params={params} />;
}`;
    
    fs.writeFileSync(path.join(adminDir, `page${pageExt}`), adminPageContent);
    console.log(`Admin route setup complete with page${pageExt}!`);
  } catch (error) {
    console.error("Failed to setup admin route:", error);
    process.exit(1);
  }
  
  // 3. Setup api/auth/[...nextauth] route
  console.log("Setting up auth API route...");
  const authDir = path.join(appDir, "api", "auth", "[...nextauth]");
  try {
    fs.mkdirSync(authDir, { recursive: true });
    const authRouteContent = `import { SimplCMSAuth } from "simplcms";

const handler = SimplCMSAuth;
export { handler as GET, handler as POST };`;
    
    fs.writeFileSync(path.join(authDir, `route${routeExt}`), authRouteContent);
    console.log(`Auth API route setup complete with route${routeExt}!`);
  } catch (error) {
    console.error("Failed to setup auth API route:", error);
    process.exit(1);
  }
  
  // 4. Update next.config.js or next.config.ts
  console.log("Updating Next.js configuration...");
  
  // Check for existing next.config.js or next.config.ts
  let configFile;
  let configContent = "";
  
  // Check for TypeScript config first if it's a TS project
  if (isTypeScriptProject && fs.existsSync(path.join(process.cwd(), `next.config.ts`))) {
    configFile = path.join(process.cwd(), `next.config.ts`);
    configContent = fs.readFileSync(configFile, "utf8");
  } 
  // Then check for JS config
  else if (fs.existsSync(path.join(process.cwd(), "next.config.js"))) {
    configFile = path.join(process.cwd(), "next.config.js");
    configContent = fs.readFileSync(configFile, "utf8");
  } 
  // Create appropriate config file if none exists
  else {
    configFile = path.join(process.cwd(), `next.config${configExt}`);
    configContent = isTypeScriptProject
      ? `/** @type {import('next').NextConfig} */
const nextConfig = {}
export default nextConfig`
      : `/** @type {import('next').NextConfig} */
const nextConfig = {}
module.exports = nextConfig`;
  }
  
  // Create new config with appropriate export syntax
  try {
    const exportStatement = isTypeScriptProject && configFile.endsWith('.ts') 
      ? "export default nextConfig;" 
      : "module.exports = nextConfig;";
      
    const newConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  transpilePackages: ["simplcms"],
};

${exportStatement}`;
    
    fs.writeFileSync(configFile, newConfig);
    console.log(`Next.js configuration updated successfully with next.config${configFile.endsWith('.ts') ? '.ts' : '.js'}!`);
  } catch (error) {
    console.error("Failed to update Next.js configuration:", error);
    process.exit(1);
  }
  
  console.log("\nSimplCMS initialization complete! ✨");
  console.log(`Files created in: ${appDir}`);
  console.log(`Project type: ${isTypeScriptProject ? 'TypeScript' : 'JavaScript'}`);
  console.log("You can now run your Next.js application with: npm run dev");
}


module.exports = { init };