import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const STUDENT_PROTECTED_ROUTES = ["/lessons"];
const TEACHER_PROTECTED_ROUTES = [
  "/teachers/registration",
  "/teachers/dashboard",
];
const GUEST_ROUTES = ["/login", "/teachers/login"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // JWT from HttpOnly cookie
  const token = request.cookies.get("accessToken")?.value;

  // teachers only page
  const isTeacherRoute = TEACHER_PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  if (isTeacherRoute && !token) {
    const loginUrl = new URL("/teachers/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  // student only page
  const isStudnetRoute = STUDENT_PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  if (isStudnetRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  // guest only page
  const isGuestRoute = GUEST_ROUTES.some((route) => pathname.startsWith(route));
  if (isGuestRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
