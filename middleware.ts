import { type NextRequest, NextResponse } from "next/server";

/**
 * Keep middleware deliberately non-blocking until Supabase environment
 * variables are configured. Authentication and authorization must also be
 * enforced in server components/actions and by PostgreSQL RLS.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
