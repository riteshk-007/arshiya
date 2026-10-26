import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { clientIp, hashIp, newToken, sha256 } from "./security";
import { SESSION_COOKIE } from "./session-cookie";

export { SESSION_COOKIE };

const MINUTE_MS = 60_000;
const SESSION_MAX_AGE_S = 60 * 60 * 12; // absolute lifetime: 12 hours
const SESSION_IDLE_MS = 120 * MINUTE_MS; // signed out after 2 hours without activity
const MAX_FAILS_PER_USER = 5;
const LOCK_MS = 15 * MINUTE_MS;
const MAX_FAILS_PER_IP = 10;
const BCRYPT_COST = 12;

export type AdminSession = {
    sessionId: string;
    userId: string;
    username: string;
};

let dummyHash: string | undefined;

/** Compared against when the username is unknown, so response time does not reveal valid usernames. */
async function getDummyHash() {
    dummyHash ??= await bcrypt.hash(newToken(), BCRYPT_COST);
    return dummyHash;
}

export const getSession = cache(async (): Promise<AdminSession | null> => {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!token || token.length > 200) {
        return null;
    }

    const now = Date.now();
    const session = await prisma.adminSession.findFirst({
        where: {
            tokenHash: sha256(token),
            expiresAt: { gt: new Date(now) },
            lastSeenAt: { gt: new Date(now - SESSION_IDLE_MS) },
        },
        select: { id: true, lastSeenAt: true, user: { select: { id: true, username: true } } },
    });
    if (!session) {
        return null;
    }
    if (now - session.lastSeenAt.getTime() > 5 * MINUTE_MS) {
        await prisma.adminSession.update({ where: { id: session.id }, data: { lastSeenAt: new Date(now) } });
    }
    return { sessionId: session.id, userId: session.user.id, username: session.user.username };
});

/** Use at the top of every admin page, action and route. Redirects to the login page if signed out. */
export async function requireAdmin(): Promise<AdminSession> {
    const session = await getSession();
    if (!session) {
        redirect("/admin/login");
    }
    return session;
}

type LoginResult = { ok: true } | { ok: false; error: string };

const GENERIC_ERROR = "Incorrect username or password.";
const LOCKED_ERROR = "Too many attempts. Please try again in a few minutes.";

export async function login(rawUsername: string, password: string): Promise<LoginResult> {
    const username = rawUsername.trim().toLowerCase().slice(0, 64);
    const requestHeaders = await headers();
    const ipHash = hashIp(clientIp(requestHeaders));
    const userAgent = (requestHeaders.get("user-agent") ?? "").slice(0, 300);

    if (!username || !password || password.length > 128) {
        return { ok: false, error: GENERIC_ERROR };
    }

    const recentFailures = await prisma.loginAttempt.count({
        where: { ipHash, success: false, createdAt: { gt: new Date(Date.now() - 15 * MINUTE_MS) } },
    });
    if (recentFailures >= MAX_FAILS_PER_IP) {
        return { ok: false, error: LOCKED_ERROR };
    }

    const user = await prisma.adminUser.findUnique({ where: { username } });
    const locked = Boolean(user?.lockedUntil && user.lockedUntil.getTime() > Date.now());

    // Always run bcrypt, even for unknown users or locked accounts.
    const matches = await bcrypt.compare(password, user?.passwordHash ?? (await getDummyHash()));

    if (!user || locked || !matches) {
        await prisma.loginAttempt.create({ data: { ipHash, username, success: false } });
        if (user && !locked) {
            const attempts = user.failedAttempts + 1;
            await prisma.adminUser.update({
                where: { id: user.id },
                data:
                    attempts >= MAX_FAILS_PER_USER
                        ? { failedAttempts: 0, lockedUntil: new Date(Date.now() + LOCK_MS) }
                        : { failedAttempts: attempts },
            });
        }
        return { ok: false, error: locked ? LOCKED_ERROR : GENERIC_ERROR };
    }

    const token = newToken();
    await prisma.$transaction([
        prisma.adminSession.deleteMany({ where: { userId: user.id, expiresAt: { lt: new Date() } } }),
        prisma.adminSession.create({
            data: {
                userId: user.id,
                tokenHash: sha256(token),
                ipHash,
                userAgent,
                expiresAt: new Date(Date.now() + SESSION_MAX_AGE_S * 1000),
            },
        }),
        prisma.adminUser.update({
            where: { id: user.id },
            data: { failedAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
        }),
        prisma.loginAttempt.create({ data: { ipHash, username, success: true } }),
    ]);

    (await cookies()).set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: SESSION_MAX_AGE_S,
    });
    return { ok: true };
}

export async function logout() {
    const jar = await cookies();
    const token = jar.get(SESSION_COOKIE)?.value;
    if (token) {
        await prisma.adminSession.deleteMany({ where: { tokenHash: sha256(token) } });
    }
    jar.delete(SESSION_COOKIE);
}

export async function changePassword(
    session: AdminSession,
    current: string,
    next: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
    if (next.length < 12 || next.length > 128) {
        return { ok: false, error: "New password must be 12 to 128 characters." };
    }
    const user = await prisma.adminUser.findUnique({ where: { id: session.userId } });
    if (!user || !(await bcrypt.compare(current, user.passwordHash))) {
        return { ok: false, error: "Current password is incorrect." };
    }
    const passwordHash = await bcrypt.hash(next, BCRYPT_COST);
    await prisma.$transaction([
        prisma.adminUser.update({ where: { id: session.userId }, data: { passwordHash } }),
        // Sign out every other device.
        prisma.adminSession.deleteMany({ where: { userId: session.userId, id: { not: session.sessionId } } }),
    ]);
    return { ok: true };
}
