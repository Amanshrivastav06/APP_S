// middleware.ts – Edge runtime, no Supabase SDK import
import { NextRequest, NextResponse } from "next/server";

const PROTECTED = [
    "/dashboard",
    "/analytics",
    "/books",
    "/chapters",
    "/materials",
    "/practice",
    "/quiz",
    "/subjects",
    "/topics",
];

export function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // Run only on protected paths
    const isProtected = PROTECTED.some(
        (base) => path === base || path.startsWith(base + "/")
    );
    if (!isProtected) return NextResponse.next();

    // Simple cookie check (no SDK at edge)
    const hasAccess = req.cookies.has("sb-access-token");
    const hasRefresh = req.cookies.has("sb-refresh-token");

    if (!hasAccess && !hasRefresh) {
        const url = req.nextUrl.clone();
        url.pathname = "/auth/login";
        url.searchParams.set("next", path);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: PROTECTED.map((p) => `${p}/:path*`),
};