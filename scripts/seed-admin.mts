// Creates the first admin user.
// Run: npm run db:seed        (reads .env.local: ADMIN_USERNAME and ADMIN_PASSWORD)
// Add --reset-password to overwrite an existing admin's password.
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const { DATABASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD, PRISMA_SCHEMA } = process.env;
if (!DATABASE_URL) throw new Error("DATABASE_URL is missing (.env.local)");
if (!ADMIN_USERNAME || !ADMIN_PASSWORD) throw new Error("Set ADMIN_USERNAME and ADMIN_PASSWORD in .env.local");
if (ADMIN_PASSWORD.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters.");

const prisma = new PrismaClient({
    adapter: new PrismaNeon({ connectionString: DATABASE_URL }, { schema: PRISMA_SCHEMA ?? "arshiya" }),
});

const username = ADMIN_USERNAME.trim().toLowerCase();
const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
const existing = await prisma.adminUser.findUnique({ where: { username } });

if (!existing) {
    await prisma.adminUser.create({ data: { username, passwordHash } });
    console.log(`Admin "${username}" created.`);
} else if (process.argv.includes("--reset-password")) {
    await prisma.$transaction([
        prisma.adminUser.update({
            where: { id: existing.id },
            data: { passwordHash, failedAttempts: 0, lockedUntil: null },
        }),
        prisma.adminSession.deleteMany({ where: { userId: existing.id } }),
    ]);
    console.log(`Admin "${username}" password reset; old sessions revoked.`);
} else {
    console.log(`Admin "${username}" already exists (use --reset-password to change it).`);
}

await prisma.$disconnect();
