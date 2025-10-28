import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Paths that don't require authentication
const publicPaths = [
  '/',
  '/products',
  '/products/[id]',
  '/api/auth/login',
  '/api/auth/register',
  '/api/products',
];

// Paths that require admin access
const adminPaths = [
  '/admin',
  '/api/admin',
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if path is public
  const isPublicPath = publicPaths.some(publicPath => {
    if (publicPath.includes('[')) {
      // Handle dynamic routes
      const regex = new RegExp('^' + publicPath.replace(/\[.*?\]/g, '[^/]+') + '$');
      return regex.test(path);
    }
    return path === publicPath || path.startsWith(publicPath + '/');
  });

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('auth_token')?.value;

  // If no token and not a public path, redirect to login
  if (!token) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }

  try {
    // Verify token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
    );
    
    const { payload } = await jwtVerify(token, secret);
    
    // Check if admin path and user is not admin
    const isAdminPath = adminPaths.some(adminPath => 
      path === adminPath || path.startsWith(adminPath + '/')
    );
    
    if (isAdminPath && !payload.isAdmin) {
      return new NextResponse(JSON.stringify({ 
        success: false, 
        message: 'دسترسی غیرمجاز' 
      }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add user info to request headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.id as string);
    requestHeaders.set('x-user-role', payload.isAdmin ? 'admin' : 'user');

    // Continue with modified request
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Invalid token
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    '/api/:path*',
  ],
};

