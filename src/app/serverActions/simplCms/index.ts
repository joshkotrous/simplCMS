"use server";

import { simplCms } from "@/index";
import { HostProvider, SimplCMSPlatformConfiguration } from "@/types/types";

export async function initSiteConfig() {
  try {
    await simplCms.initSiteConfig();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function validateSetupAction({
  provider,
  vercelConfig,
  setupData,
}: {
  provider?: HostProvider;
  vercelConfig?: { token: string; projectId: string; teamId: string };
  setupData?: SimplCMSPlatformConfiguration;
}) {
  const setupValidation = await simplCms.validateSetup({
    provider: provider,
    vercelConfig,
    setupData,
  });
  return setupValidation;
}
