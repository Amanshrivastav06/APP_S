import type { NextRequest } from "next/server";
import { middleware as supabaseMiddleware, config as supabaseConfig } from "@/lib/supabase/middleware";

export { supabaseConfig as config };

export async function middleware(request: NextRequest) {
  return await supabaseMiddleware(request);
}
