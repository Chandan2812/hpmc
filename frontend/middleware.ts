import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const adminAuth = request.cookies.get("adminAuth");
  const employeeAuth = request.cookies.get("employeeAuth");

  const { pathname } = request.nextUrl;

  // Protect Admin Routes
  if (pathname.startsWith("/admin")) {
    if (!adminAuth) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect Employee Routes
  if (pathname.startsWith("/employee")) {
    if (!employeeAuth) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/employee/:path*"],
};
