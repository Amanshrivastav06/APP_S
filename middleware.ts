import type { NextRequest } from "next/server";
import { middleware as supabaseMiddleware } from "@/lib/supabase/middleware";

export async function middleware(req: NextRequest) {
  return supabaseMiddleware(req);
}

// run ONLY on protected sections (not on "/")
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
