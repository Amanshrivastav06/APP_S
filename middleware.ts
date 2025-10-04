import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export function middleware(req: NextRequest) {
    return updateSession(req);
}

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
