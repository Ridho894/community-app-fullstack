import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the path starts with /admin
    if (pathname.startsWith('/admin')) {
        // Get the token and check if the user is authenticated and has admin role
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        });

        // If no token or user is not an admin, redirect to login page
        if (!token || token.role !== 'admin') {
            const url = new URL('/auth/login', request.url);
            // Add a return URL so users can be redirected back after login
            url.searchParams.set('returnUrl', encodeURI(request.url));
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

// Only run middleware on admin routes
export const config = {
    matcher: ['/admin/:path*'],
}; 