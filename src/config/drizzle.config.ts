import type { Config } from "drizzle-kit";
 
export default {
  schema: "./src/server/*",
  out: "./migrations",
} satisfies Config;