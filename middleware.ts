import { NextRequest, NextResponse } from "next/server";

// Stránky dostupné POUZE nepřihlášeným
const authRoutes = ["/login", "/signup"];

// Stránky dostupné POUZE přihlášeným
const protectedRoutes = ["/create", "/profile"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  const isLoggedIn = !!token;
  const isAuthRoute = ["/login", "/signup"].some((r) => pathname.startsWith(r));

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isLoggedIn && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Na kterých cestách middleware běží (vynech statické soubory)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
