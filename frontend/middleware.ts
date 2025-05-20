import { NextResponse, NextRequest } from "next/server";

const PUBLIC_PATHS = ['/sign-in', '/sign-up', '/api/auth'];

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const path = req.nextUrl.pathname;

    // Allow public paths
    if (PUBLIC_PATHS.includes(path)) {
        return NextResponse.next();
    }

    if (!token) {
        const signInUrl = new URL("/sign-in", req.url);
        signInUrl.searchParams.set("redirect_url", req.url);
        return NextResponse.redirect(signInUrl);
    }

    const response = NextResponse.next();
    
    // Add user info to headers for server components
    response.headers.set('x-user-token', token);
    
    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
};