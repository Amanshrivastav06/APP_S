// middleware.ts (root) — Edge-safe, cookie-based auth

import { NextRequest, NextResponse } from "next/server";

// Protected sections (apni app ke hisaab se badha/sakate ho)
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

  // run only on protected paths
  const isProtected = PROTECTED.some(
    (base) => path === base || path.startsWith(base + "/")
  );
  if (!isProtected) return NextResponse.next();

  // Supabase auth cookies
  const hasAccess = req.cookies.has("sb-access-token");
  const hasRefresh = req.cookies.has("sb-refresh-token");

  if (!hasAccess && !hasRefresh) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", path + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: PROTECTED.map((p) => `${p}/:path*`),
};
