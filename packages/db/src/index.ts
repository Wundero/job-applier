import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { env } from "./config";
import * as auth from "./schema/auth";
import * as job from "./schema/job";

export * from "drizzle-orm/sql";
export { alias } from "drizzle-orm/mysql-core";

export const schema = { ...auth, ...job };

const dbClient = neon(env.DB_URL);
export const db = drizzle(dbClient, { schema });
