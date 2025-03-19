import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "SimplCMS",
  tagline: "Content Management Simplified",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://docs.simplcms.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "SimplCMS", // Usually your GitHub org/user name.
  projectName: "SimplCMS", // Usually your repo name.

  onBrokenLinks: "ignore",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/joshkotrous/simplcms/tree/main/docs/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "SimplCMS | Docs",
      items: [
        {
          to: "/intro",

          label: "Intro",
        },
        {
          to: "/providers",

          label: "Providers",
        },
        {
          type: "docSidebar",
          sidebarId: "docs",
          label: "Docs",
        },
      ],
    },

    footer: {
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Introduction",
              to: "/intro",
            },
            {
              label: "Getting Started",
              to: "/docs/category/getting-started",
            },
            {
              label: "Configuration",
              to: "/docs/category/configuration",
            },
            {
              label: "Features",
              to: "/docs/category/using-simplcms",
            },
            {
              label: "Deployment",
              to: "/docs/category/deploy-your-site",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/joshkotrous/simplcms",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} SimplCMS`,
    },

    docs: {
      sidebar: {
        hideable: false,
        autoCollapseCategories: true,
      },
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
