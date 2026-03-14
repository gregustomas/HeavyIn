// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  const { pathname } = req.nextUrl;

  const isPublic =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/workout/") ||
    (pathname.startsWith("/profile/") &&
      !pathname.startsWith("/profile/undefined"));

  if (!token && !isPublic) {
    const loginUrl = new URL("/login", req.url);

    if (pathname.startsWith("/create")) {
      loginUrl.searchParams.set(
        "message",
        "Pro vytvoření tréninku se musíš přihlásit.",
      );
    } else if (
      pathname === "/profile" ||
      pathname.startsWith("/profile/undefined")
    ) {
      loginUrl.searchParams.set(
        "message",
        "Pro zobrazení profilu se musíš přihlásit.",
      );
    } else {
      loginUrl.searchParams.set(
        "message",
        "Pro pokračování se musíš přihlásit.",
      );
    }

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
