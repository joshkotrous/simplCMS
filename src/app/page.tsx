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
        type: "p",
        content: null,
        children: [
          {
            type: "",
            content: "Go to the",
            children: [],
          },
          {
            type: "a",
            content: " dashboard ",
            attributes: [{ name: "href", value: "/admin" }],
            children: [],
            styles: [
              { property: "alignContent", value: "center" },
              { property: "fontWeight", value: "bold" },
            ],
          },
          {
            type: "",
            content: "to edit this page",
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
      <div className="size-full flex justify-center items-center overflow-hidden font-[family-name:var(--font-geist-sans)] pt-20">
        <div className="size-full absolute top-0 left-0 z-0 bg-[linear-gradient(215deg,rgba(0,0,0,0.25)_0%,transparent_40%)] bg-background dark:bg-[linear-gradient(215deg,rgba(255,255,255,0.1)_0%,transparent_40%)]" />
        <main className="flex gap-4 items-center flex-col z-50 text-foreground">
          <PageRenderer page={homePageConfig} />
        </main>
      </div>
    </TooltipProvider>
  );
}
