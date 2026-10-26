import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
    }
    // Serverless-friendly driver adapter for Neon. The app lives in its own Postgres schema
    // so it can share a database with other projects without touching their tables.
    const adapter = new PrismaNeon({ connectionString }, { schema: process.env.PRISMA_SCHEMA ?? "arshiya" });
    return new PrismaClient({ adapter });
}

function getClient() {
    globalForPrisma.prisma ??= createClient();
    return globalForPrisma.prisma;
}

/** Created on first use, so builds that never query the database do not need DATABASE_URL. */
export const prisma = new Proxy({} as PrismaClient, {
    get: (_target, property) => Reflect.get(getClient(), property),
});
