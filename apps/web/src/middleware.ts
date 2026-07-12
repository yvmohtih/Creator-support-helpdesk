import { NextRequest, NextResponse } from 'next/server';

const adminSessionCookie = process.env.NEXT_PUBLIC_ADMIN_SESSION_COOKIE_NAME ?? 'admin_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login' || pathname === '/admin/unauthorized') {
    return NextResponse.next();
  }

  const hasSessionCookie = request.cookies.has(adminSessionCookie);

  if (!hasSessionCookie) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.searchParams.set('next', pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
