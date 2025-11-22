<<<<<<< HEAD
import { NextResponse } from "next/server";

export function middleware(req) {
    return NextResponse.next();
=======
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export function middleware(req: NextRequest) {
    return updateSession(req);
>>>>>>> b5aa996d8586dccce958402bb9436e95456420b9
}

export const config = {
    matcher: [
        "/dashboard/:path*",
<<<<<<< HEAD
        "/practice/:path*",
        "/quiz/:path*",
    ]
=======
        "/analytics/:path*",
        "/books/:path*",
        "/chapters/:path*",
        "/materials/:path*",
        "/practice/:path*",
        "/quiz/:path*",
        "/subjects/:path*",
        "/topics/:path*",
    ],
>>>>>>> b5aa996d8586dccce958402bb9436e95456420b9
};
