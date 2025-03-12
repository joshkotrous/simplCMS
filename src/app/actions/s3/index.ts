"use server";

import { testS3Connection } from "@/packages/core/src/s3";
import { AWSS3Config } from "@/types/types";

export async function testS3ConnectionAction(config: AWSS3Config) {
  await testS3Connection(config);
}
