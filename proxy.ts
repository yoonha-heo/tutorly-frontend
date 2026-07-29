import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/lessons", "/teachers/registration"];

const GUEST_ROUTES = ["/login", "/teachers/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // HttpOnly cookie JWT
  const token = request.cookies.get("accessToken")?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const isGuestRoute = GUEST_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isGuestRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// 동작할 라우트 범위 설정 (정적 파일 및 API 제외)
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
