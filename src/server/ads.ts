import { sqliteTable, text  } from "drizzle-orm/sqlite-core";
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { and, eq, InferModel } from "drizzle-orm";

export const adTable = sqliteTable("ad", {
    id: text("id").primaryKey(),
    source: text("source").notNull(),
});

export type Ad = InferModel<typeof adTable>;

const immoscoutDb = new Database("Immoscout");
export const db = drizzle(immoscoutDb);

export function adExists(ad: Ad): boolean {
    const res = db.select().from(adTable).where(and(eq(adTable.id, ad.id), eq(adTable.source, ad.source)));
    return res.all().length !== 0;
}

export function storeAd(ad: Ad) {
    db.insert(adTable).values(ad).run();
}