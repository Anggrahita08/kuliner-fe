import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token_kuliner')?.value;
  const { pathname } = request.nextUrl;

  // Jika belum login dan mencoba akses dashboard, arahkan ke signin
  if ((pathname.startsWith('/admin') || pathname.startsWith('/customer')) && !token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Jika sudah login dan mencoba akses /signin, arahkan ke dashboard customer
  if (pathname === '/signin' && token) {
    return NextResponse.redirect(new URL('/customer/dashboard', request.url));
  }

  return NextResponse.next();
}

// Menambahkan '/' agar landing page ikut diperiksa status loginnya
export const config = {
  matcher: ['/admin/:path*', '/customer/:path*', '/signin', '/'],
};