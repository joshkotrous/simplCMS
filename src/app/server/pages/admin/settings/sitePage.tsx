"use server";
import MediaPopover from "../../../../client/components/mediaPopover";
import { Button } from "../../../../client/components/ui/button";
import { Separator } from "../../../../client/components/ui/separator";
import { ImageIcon } from "lucide-react";
import { InitSiteConfig } from "../../../../client/components/initSiteConfig";
import { CloudinaryMedia, SiteConfig } from "../../../../../types/types";

import { simplcms } from "../../../../../core";

// Function to redact potentially sensitive fields in configuration
function sanitizeSiteConfig(config: SiteConfig | null): any {
  if (!config) return null;
  
  // Create a deep copy to avoid modifying the original
  const sanitized = JSON.parse(JSON.stringify(config));
  
  // Patterns that might indicate sensitive data in key names
  const sensitivePatterns = [
    /password/i, /passwd/i, /pass/i,
    /secret/i, /private/i,
    /key/i, /token/i, 
    /credential/i, /cred/i,
    /auth/i, /oauth/i,
    /api[_-]?key/i, 
    /connect(ion)?[_-]?string/i,
    /access[_-]?token/i,
    /client[_-]?(id|secret)/i,
    /encryption/i, /cipher/i,
    /cert(ificate)?/i, /ssl/i,
    /hash/i, /salt/i,
    /sign(ature)?/i,
    /jwt/i
  ];
  
  // Function to recursively check and redact sensitive data
  function redactSensitiveData(obj: any) {
    if (!obj || typeof obj !== 'object') return;
    
    for (const key of Object.keys(obj)) {
      // Check if this key matches any sensitive patterns
      if (sensitivePatterns.some(pattern => pattern.test(key))) {
        obj[key] = '[REDACTED]';
      } 
      // Recursively process nested objects (both objects and arrays)
      else if (typeof obj[key] === 'object') {
        redactSensitiveData(obj[key]);
      }
    }
  }
  
  redactSensitiveData(sanitized);
  return sanitized;
}

export default async function SiteSettings() {
  let siteConfig: SiteConfig | null = null;
  const platformConfiguration = simplcms.platform.getPlatformConfiguration();
  const media = await simplcms.media.getMedia(
    platformConfiguration.mediaStorage
  );

  if (platformConfiguration.database) {
    siteConfig = await simplcms.platform.getSiteConfig();
  }
  
  // Sanitize the configuration for display
  const sanitizedConfig = sanitizeSiteConfig(siteConfig);
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">Configuration</h3>
        <InitSiteConfig siteConfig={siteConfig} />
        {sanitizedConfig && (
          <div className="bg-gray-50 p-4 rounded border">
            <p className="text-sm text-gray-500 mb-2">
              Site configuration (sensitive values redacted):
            </p>
            <pre className="text-xs overflow-auto max-h-96">
              {JSON.stringify(sanitizedConfig, null, 2)}
            </pre>
          </div>
        )}
      </div>
      <Separator />
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">Logo</h3>
        <div className="">
          <div className="w-fit h-40 p-4 border rounded-md border-dashed border-zinc-400 text-zinc-400 flex flex-col justify-center items-center gap-4">
            <div className="space-x-2 flex gap-1 items-center text-nowrap">
              <ImageIcon className="size-4" /> No Logo Configured
            </div>
            <MediaPopover media={media}>
              <Button>Select Logo</Button>
            </MediaPopover>
          </div>
        </div>
      </div>
      <Separator />
    </div>
  );
}