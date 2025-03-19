import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type DocCardItem = {
  title: string;
  description: ReactNode;
  to: string;
  icon?: ReactNode;
};

const DocsList: DocCardItem[] = [
  {
    title: "Introduction",
    description: "Learn what SimplCMS can do for you",
    to: "/intro",
    icon: "👋",
  },
  {
    title: "Getting Started",
    description: "Learn the basics and set up your Docusaurus site in minutes",
    to: "/docs/category/getting-started",
    icon: "📝",
  },
  {
    title: "Configuration",
    description: "Customize your site with configuration options",
    to: "/docs/category/configuration",
    icon: "⚙️",
  },

  {
    title: "Features",
    description: "Discover all the powerful features of SimplCMS",
    to: "/docs/category/using-simplcms",
    icon: "✨",
  },
  {
    title: "Deployment",
    description: "Deploy your Docusaurus site to production environments",
    to: "/docs/category/deploy-your-site",
    icon: "🚀",
  },
];

function DocCard({ title, description, to, icon }: DocCardItem) {
  return (
    <div className={clsx("col col--4", styles.docCardWrapper)}>
      <Link to={to} className={clsx("card padding--lg", styles.docCard)}>
        <div className={styles.cardHeader}>
          {icon && <span className={styles.cardIcon}>{icon}</span>}
          <Heading as="h3" className={styles.cardTitle}>
            {title}
          </Heading>
        </div>
        <div className={styles.cardContent}>
          <p>{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageDocsSummary(): ReactNode {
  return (
    <section className={styles.docsSummary}>
      <div className="container">
        <div className={clsx("text--center margin-bottom--xl")}>
          <Heading as="h2">Documentation</Heading>
          <p>Learn more about getting started and using SimplCMS</p>
        </div>
        <div className={clsx("row", styles.rowWithGutters)}>
          {DocsList.map((props, idx) => (
            <DocCard key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
