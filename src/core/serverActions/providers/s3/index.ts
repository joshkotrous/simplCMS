"use server";

import { testConnection } from "@/providers/s3";
import { AWSS3Config } from "@/types";

export async function testS3ConnectionAction(config: AWSS3Config) {
  await testConnection(config);
}
