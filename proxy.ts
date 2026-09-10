import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl;

  const parts = hostname.split('.');

  // Jika diakses melalui subdomain *.demo.domainkamu.com
  if (parts.length >= 4 && parts[1] === 'demo') {
    const subdomain = parts[0];
    url.pathname = `/demo/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};