import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-cookie";

/**
 * First gate for /admin: no session cookie means no page. This is only a fast redirect;
 * every admin page, action and route still verifies the session against the database.
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isLogin = pathname === "/admin/login";
    const hasCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

    if (!isLogin && !hasCookie) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        url.search = "";
        return NextResponse.redirect(url);
    }

    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, max-age=0");
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return response;
}

export const config = {
    matcher: ["/admin/:path*"],
};
