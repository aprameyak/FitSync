import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Apply middleware to all routes except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico).*)',
    // Always apply middleware to API routes
    '/api/(.*)',
  ],
};