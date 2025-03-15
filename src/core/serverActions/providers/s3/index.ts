"use server";

import { testS3Connection } from "@/providers/s3";
import { AWSS3Config } from "@/types";

export async function testS3ConnectionAction(config: AWSS3Config) {
  await testS3Connection(config);
}
