// middleware.ts (root)
import { NextRequest, NextResponse } from "next/server";

// Jo routes protected chahiye:
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
  const isProtected = PROTECTED.some((base) =>
    path === base || path.startsWith(base + "/")
  );
  if (!isProtected) return NextResponse.next();

  // Supabase auth cookies — access/refresh
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

// Sirf protected areas par hi middleware run hoga
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analytics/:path*",
    "/books/:path*",
    "/chapters/:path*",
    "/materials/:path*",
    "/practice/:path*",
    "/quiz/:path*",
    "/subjects/:path*",
    "/topics/:path*",
  ],
};
