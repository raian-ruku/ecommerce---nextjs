import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "./api/v1/jwt";

export function middleware(request: NextRequest) {
  // const token = request.cookies.get("token")?.value;
  // const pathname = request.nextUrl.pathname;
  // // Define paths that should be protected
  // const protectedPaths = ["/profile"];
  // // Check if the path is protected and there's no valid token
  // if (protectedPaths.some((path) => pathname.startsWith(path))) {
  //   if (!token || !verifyToken(token)) {
  //     const url = new URL("/login", request.url);
  //     url.searchParams.set("from", pathname);
  //     return NextResponse.redirect(url);
  //   }
  // }
  // // If there's a valid token and the user is trying to access login or signup, redirect to profile
  // if (token && verifyToken(token)) {
  //   if (pathname === "/login" || pathname === "/signup") {
  //     return NextResponse.redirect(new URL("/profile", request.url));
  //   }
  // }
  // return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
