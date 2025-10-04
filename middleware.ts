import type { NextRequest } from "next/server";
import { middleware as supabaseMiddleware } from "@/lib/supabase/middleware";

export async function middleware(req: NextRequest) {
  return supabaseMiddleware(req);
}

// Run auth middleware only on protected areas (tweak as needed)
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
