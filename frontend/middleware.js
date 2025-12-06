// Note: Middleware is deprecated in Next.js 16, but keeping for compatibility
// Consider migrating to proxy configuration if needed
import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
