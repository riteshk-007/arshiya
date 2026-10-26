import { createHash, randomBytes } from "node:crypto";

export const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

/** 256-bit random, URL-safe token. */
export const newToken = () => randomBytes(32).toString("base64url");

/** Salted hash so raw IP addresses are never stored. */
export function hashIp(ip: string) {
    return sha256(`${process.env.IP_HASH_SALT ?? ""}:${ip}`).slice(0, 40);
}

export function clientIp(headers: Headers) {
    const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    return forwarded || headers.get("x-real-ip") || "unknown";
}

/** True when a browser-sent Origin (if any) matches the host that received the request. */
export function isSameOrigin(headers: Headers) {
    const origin = headers.get("origin");
    if (!origin) {
        return true;
    }
    try {
        return new URL(origin).host === (headers.get("x-forwarded-host") ?? headers.get("host"));
    } catch {
        return false;
    }
}
