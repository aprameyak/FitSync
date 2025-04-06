import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};