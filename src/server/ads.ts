import { sqliteTable, integer, text  } from "drizzle-orm/sqlite-core";
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { eq } from "drizzle-orm";

export const ad = sqliteTable("ad", {
    id: text("id").primaryKey(),
})

const immoscoutDb = new Database("Immoscout");
export const db = drizzle(immoscoutDb);

export function adExists(id: string): boolean {
    const res = db.select().from(ad).where(eq(ad.id, id));
    return res.all().length !== 0;
}

export function storeAd(id: string) {
    db.insert(ad).values({ id }).run();
}