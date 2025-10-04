import { NextRequest, NextResponse } from "next/server";
import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  // Start with a mutable response
  const res = NextResponse.next({ request: { headers: req.headers } });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If envs are missing, don't crash middleware (fail-open)
  if (!url || !anon) {
    console.warn("[middleware] Missing Supabase env");
    return res;
  }

  let supabase;
  try {
    supabase = createServerClient(url, anon, {
      cookies: {
        getAll() {
          return parseCookieHeader(req.headers.get("cookie") ?? "");
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
          res.headers.set("set-cookie", serializeCookieHeader(res.cookies.getAll()));
        },
      },
    });
  } catch (e) {
    console.error("[middleware] createServerClient failed:", e);
    return res; // fail-open
  }

  // Auth gate — only runs on paths matched by root middleware's config
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const login = req.nextUrl.clone();
      login.pathname = "/auth/login";
      // send them back here after login
      login.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(login);
    }
  } catch (e) {
    console.error("[middleware] supabase.auth.getUser() failed:", e);
    return res; // fail-open
  }

  return res;
}
