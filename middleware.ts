import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token_kuliner')?.value;
  const { pathname } = request.nextUrl;

  // Kalau akses halaman admin/customer tapi tidak ada token → redirect ke signin
  if ((pathname.startsWith('/admin') || pathname.startsWith('/customer')) && !token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Kalau sudah login tapi akses signin → redirect ke dashboard
  if (pathname === '/signin' && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/customer/:path*', '/signin'],
};