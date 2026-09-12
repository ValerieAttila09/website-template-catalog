import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

function rewriteDemoAsset(request: NextRequest) {
  const referer = request.headers.get('referer');
  if (!referer) return null;

  const refererPath = new URL(referer).pathname;
  const demoMatch = refererPath.match(/^\/demo\/([^/]+)(?:\/|$)/);
  if (!demoMatch) return null;

  const demoFolder = decodeURIComponent(demoMatch[1]);
  const url = request.nextUrl.clone();

  if (url.pathname === '/_next/image') {
    const imagePath = url.searchParams.get('url');
    if (!imagePath?.startsWith('/images/')) return null;

    url.pathname = `/demo/${encodeURIComponent(demoFolder)}${imagePath}`;
    url.search = '';
    return NextResponse.rewrite(url);
  }

  if (
    url.pathname === '/favicon.ico' ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.endsWith('.txt')
  ) {
    url.pathname = `/demo/${encodeURIComponent(demoFolder)}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const demoAssetResponse = rewriteDemoAsset(request);
  if (demoAssetResponse) return demoAssetResponse;

  let supabaseResponse = NextResponse.next({
    request,
  });

  // 1. Sinkronisasi Cookie & Session Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Perbarui session akun user
  await supabase.auth.getUser();

  // 2. Logika Subdomain Routing (dari proxy.ts kamu)
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  const parts = hostname.split('.');

  // Jika diakses via *.demo.domainkamu.com
  if (parts.length >= 4 && parts[1] === 'demo') {
    const subdomain = parts[0];
    url.pathname = `/demo/${subdomain}${url.pathname}`;
    
    // Buat rewrite response dengan menyalin cookie Supabase terbaru
    const rewriteResponse = NextResponse.rewrite(url, { request });
    
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      rewriteResponse.cookies.set(cookie.name, cookie.value);
    });

    return rewriteResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!api).*)'],
};