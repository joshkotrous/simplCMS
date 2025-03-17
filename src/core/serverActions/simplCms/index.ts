"use server";

import { simplcms } from "../../../core";
import {
  HostProvider,
  SimplCMSPlatformConfiguration,
} from "../../../../types/types";

export async function initSiteConfig() {
  try {
    await simplcms.platform.initSiteConfig();
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
  const setupValidation = await simplcms.platform.validateSetup({
    provider: provider,
    vercelConfig,
    setupData,
  });
  return setupValidation;
}
