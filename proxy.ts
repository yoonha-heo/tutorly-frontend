import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const AUTH_PROTECTED_ROUTES = ["/chats"];
const STUDENT_PROTECTED_ROUTES = ["/lessons", "/checkout"];
const TEACHER_PROTECTED_ROUTES = [
  "/teachers/registration",
  "/teachers/dashboard",
];
const GUEST_ROUTES = ["/login", "/teachers/login"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // JWT from HttpOnly cookies
  const hasSession = Boolean(
    request.cookies.get("accessToken")?.value ||
      request.cookies.get("refreshToken")?.value,
  );

  // login required (student and teacher)
  const isAuthRoute = AUTH_PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  if (isAuthRoute && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  // teachers only page
  const isTeacherRoute = TEACHER_PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  if (isTeacherRoute && !hasSession) {
    const loginUrl = new URL("/teachers/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  // student only page
  const isStudnetRoute = STUDENT_PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  if (isStudnetRoute && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  // guest only page
  const isGuestRoute = GUEST_ROUTES.some((route) => pathname.startsWith(route));
  if (isGuestRoute && hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
