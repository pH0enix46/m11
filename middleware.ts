import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Define public paths
  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.includes(pathname);

  // 2. Identify internal/asset paths
  const isAsset =
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/api/");

  // 3. Validation: If no token (or invalid-looking token) and not a public path/asset
  const hasValidTokenStructure = token && token.split(".").length === 3;

  if (!hasValidTokenStructure && !isPublicPath && !isAsset) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (except api/auth which we handle inside)
     * - static files (images, etc in public)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
