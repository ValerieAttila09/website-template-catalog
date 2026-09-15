import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

function rewriteDemoAsset(request: NextRequest) {
  const referer = request.headers.get('referer');
  const refererPath = referer ? new URL(referer).pathname : '';
  const demoMatch = refererPath.match(/^\/demo\/([^/]+)(?:\/|$)/);
  const cookieFolder = request.cookies.get('uplift_demo_folder')?.value;
  const isApplicationReferer = ['/auth', '/catalog', '/dashboard', '/login', '/register', '/template'].some(
    (prefix) => refererPath === prefix || refererPath.startsWith(`${prefix}/`),
  ) || refererPath === '/';
  const demoFolder = demoMatch ? decodeURIComponent(demoMatch[1]) : isApplicationReferer ? null : cookieFolder;
  if (!demoFolder) return null;

  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const rewriteAsset = (assetPath: string) => {
    const headers = new Headers(request.headers);
    headers.set('x-uplift-demo-folder', demoFolder);
    headers.set('x-uplift-demo-path', assetPath);
    url.pathname = '/api/demo-asset';
    url.search = '';
    return NextResponse.rewrite(url, { request: { headers } });
  };
  const demoRoutePath = (() => {
    if (demoMatch) {
      const refererRoute = refererPath.replace(/^\/demo\/[^/]+/, '').replace(/\/index\.html$/, '').replace(/\.html$/, '');
      return refererRoute === '/index' ? '' : refererRoute;
    }

    return refererPath === '/' ? '' : refererPath;
  })();
  const isApplicationRoute = ['/auth', '/catalog', '/dashboard', '/login', '/register', '/template'].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  // Static exports also contain extensionless document links such as /docs
  // and /blog. Resolve those links to the matching exported HTML file.
  if (!isApplicationRoute && (demoMatch || pathname !== '/') && (!pathname.includes('.') && !pathname.startsWith('/_next/'))) {
    const documentPath = pathname === '/' ? '/index.html' : `${pathname}.html`;
    url.pathname = `/demo/${encodeURIComponent(demoFolder)}${documentPath}`;
    return NextResponse.rewrite(url);
  }

  // Next's static export stores route metadata with a double-underscore name,
  // while the browser requests the compact _next_* form during navigation.
  const nextExportFile = pathname.match(/^\/_next_(head|index|tree)\.txt$/);
  if (nextExportFile) {
    url.pathname = `/demo/${encodeURIComponent(demoFolder)}${demoRoutePath}/__next._${nextExportFile[1]}.txt`;
    return NextResponse.rewrite(url);
  }

  const nextRouteFile = pathname.match(/^\/_next\.(.+)$/);
  if (nextRouteFile) {
    url.pathname = `/demo/${encodeURIComponent(demoFolder)}${demoRoutePath}/__next.${nextRouteFile[1]}`;
    return NextResponse.rewrite(url);
  }

  // Exported demos commonly use root-relative asset URLs. Keep those requests
  // inside the demo folder that owns the iframe document.
  const hasStaticPrefix = [
    '/_next/',
    '/assets/',
    '/css/',
    '/fonts/',
    '/icons/',
    '/images/',
    '/js/',
    '/media/',
    '/static/',
  ].some((prefix) => pathname.startsWith(prefix));
  const hasAssetExtension = /\.(?:avif|css|gif|ico|jpe?g|js|json|map|mjs|png|svg|txt|webmanifest|webp|woff2?|eot|ttf|otf|mp4|webm)$/i.test(pathname);

  if (pathname === '/_next/image') {
    const imagePath = url.searchParams.get('url');
    if (!imagePath || !imagePath.startsWith('/')) return null;

    return rewriteAsset(imagePath);
  }

  if (pathname === '/favicon.ico' || pathname === '/site.webmanifest' || hasStaticPrefix || hasAssetExtension) {
    return rewriteAsset(pathname);
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

  const demoPathMatch = request.nextUrl.pathname.match(/^\/demo\/([^/]+)(?:\/|$)/);
  if (demoPathMatch) {
    supabaseResponse.cookies.set('uplift_demo_folder', decodeURIComponent(demoPathMatch[1]), {
      httpOnly: true,
      maxAge: 60 * 60,
      path: '/',
      sameSite: 'lax',
    });
  } else if (request.nextUrl.pathname === '/' || ['/auth', '/catalog', '/dashboard', '/login', '/register', '/template'].some(
    (prefix) => request.nextUrl.pathname === prefix || request.nextUrl.pathname.startsWith(`${prefix}/`),
  )) {
    supabaseResponse.cookies.delete('uplift_demo_folder');
  }

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