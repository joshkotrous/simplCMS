import { TooltipProvider } from "@/components/ui/tooltip";
import { getServerEnvVars } from "@/packages/core/src/simplCms";
import SetupForm from "./setupForm";
import { Page } from "@/types/types";
import PageRenderer from "./pageRenderer";

export default async function Home() {
  const platformConfiguration = getServerEnvVars();
  const homePageConfig: Page = {
    _id: "",
    createdAt: new Date(),
    publishedAt: new Date(),
    updatedAt: new Date(),
    status: "published",
    elements: [
      {
        type: "h1",
        content: "SimplCms",
        children: [],
        attributes: null,
        styles: [
          { property: "textAlign", value: "center" },
          { property: "fontSize", value: "64px" },
          { property: "fontWeight", value: "bold" },
        ],
      },
      {
        type: "div",
        content: null,
        children: [
          {
            type: "p",
            content: "Go to the ",
            attributes: [{ name: "href", value: "/" }],
            children: [],
            styles: [{ property: "alignContent", value: "center" }],
          },
          {
            type: "a",
            content: "dashboard",
            attributes: [{ name: "href", value: "/admin" }],
            children: [],
            styles: [{ property: "alignContent", value: "center" }],
          },
          {
            type: "p",
            content: "to edit this page",
            attributes: [{ name: "href", value: "/" }],
            children: [],
            styles: [{ property: "alignContent", value: "center" }],
          },
        ],
        attributes: null,
        styles: [
          { property: "textAlign", value: "center" },
          { property: "flexBasis", value: "" },
        ],
      },
    ],
    metadata: {
      description: "",
      keywords: [""],
      ogImage: "",
      title: "",
    },
    route: "/",
  };
  return (
    <TooltipProvider>
      <div className="size-full flex justify-center items-center overflow-hidden font-[family-name:var(--font-geist-sans)] bg-[linear-gradient(215deg,rgba(0,0,0,0.25)_0%,transparent_40%)] bg-background dark:bg-[linear-gradient(215deg,rgba(255,255,255,0.1)_0%,transparent_40%)]">
        <main className="flex gap-4 items-center flex-col text-foreground">
          <h1 className="text-4xl font-bold">SimplCMS</h1>
          <SetupForm serverConfiguration={platformConfiguration} />

          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 text-foreground"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
          <PageRenderer page={homePageConfig} />
        </main>
      </div>
    </TooltipProvider>
  );
}
