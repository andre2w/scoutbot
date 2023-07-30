import { db } from "./ads";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

migrate(db, {
    migrationsFolder: "./migrations"
})