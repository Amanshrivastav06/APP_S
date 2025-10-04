import { NextResponse, type NextRequest } from "next/server";
import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";

export async function updateSession(req: NextRequest) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Seed the response with the incoming request headers (Edge requirement)
  const res = NextResponse.next({ request: { headers: req.headers } });

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("[supabase] Missing env: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return res; // don't crash the page
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return parseCookieHeader(req.headers.get("cookie") ?? "");
      },
      setAll(cookies) {
        // In Edge, write cookies to the *response* and re-serialize header
        for (const { name, value, options } of cookies) {
          res.cookies.set(name, value, options);
        }
        res.headers.set("set-cookie", serializeCookieHeader(res.cookies.getAll()));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = req.nextUrl.pathname;
  const isPublic =
    path === "/" || path.startsWith("/auth") || path.startsWith("/login");

  if (!user && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", path + req.nextUrl.search); // optional return-to
    return NextResponse.redirect(url);
  }

  return res;
}
