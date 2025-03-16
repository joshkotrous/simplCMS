"use client";
import { Page } from "@/types";
import VerticalTreeMenu from "./pagesList";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import PageEditor from "@/app/client/components/editPageRenderer";

export default function PagePreview({ routes }: { routes: Page[] }) {
  const homeRoute = routes.find((route) => route.route === "/");
  if (!homeRoute) return;

  const [selectedRoute, setSelectedRoute] = useState<string>(homeRoute.route);
  const [isLoading, setIsLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const previewUrl = selectedRoute ? `${baseUrl}/${selectedRoute}` : baseUrl;

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleRouteSelect = (route: string) => {
    setIsLoading(true);
    setSelectedRoute(route);
  };

  return (
    <>
      <VerticalTreeMenu
        routes={routes}
        selectedRoute={selectedRoute}
        onRouteSelect={handleRouteSelect}
      />
      <div className="relative w-full h-full">
        {/* {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-zinc-900/50">
            <Loader2 className="size-6 animate-spin text-gray-500" />
          </div>
        )} */}
        <iframe
          src={previewUrl}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title="Page preview"
          onLoad={handleIframeLoad}
        />
        {/* <PageEditor onSave={() => {}} page={homeRoute} /> */}
      </div>
    </>
  );
}
