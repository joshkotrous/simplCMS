"use server";

import { simplcms } from "../../../../core";
import { AWSS3Config } from "../../../../../types/types";

export async function testS3ConnectionAction(config: AWSS3Config) {
  await simplcms.providers.s3.testConnection(config);
}
