import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  // always start with a mutable response
  const res = NextResponse.next({ request: { headers: req.headers } });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // fail-open if envs are missing (avoid crashing Edge)
  if (!url || !anon) return res;

  // IMPORTANT: don't import cookie helpers from '@supabase/ssr'
  // (they cause the browser client to be included). Use Next's cookies API.
  let supabase;
  try {
    supabase = createServerClient(url, anon, {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) => {
          for (const { name, value, options } of cookies) {
            res.cookies.set(name, value, options);
          }
        },
      },
    });
  } catch (e) {
    console.error("[middleware] createServerClient failed:", e);
    return res; // fail-open
  }

  // auth gate (only on matched routes)
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const login = req.nextUrl.clone();
      login.pathname = "/auth/login";
      login.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(login);
    }
  } catch (e) {
    console.error("[middleware] getUser failed:", e);
    return res; // fail-open
  }

  return res;
}
