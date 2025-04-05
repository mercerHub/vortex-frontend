import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access-token')?.value;
  const url = request.nextUrl.clone();

  // console.log("Middleware running");
  // console.log("Cookies:", request.cookies.getAll());
  // console.log("Current Path:", url.pathname);
  
  const isRootPage = url.pathname === '/';
  const isLoginPage = url.pathname === '/auth/login';
  const isSignUpPage = url.pathname === '/auth/sign-up';
  const isForgotPasswordPage = url.pathname.startsWith('/auth/forgot-password');
  const isResetPasswordPage = url.pathname.startsWith('/auth/reset-password');
  const isVerifyOtpPage = url.pathname.startsWith('/auth/verify-otp');
  const isAuthPage = isLoginPage || isSignUpPage || isForgotPasswordPage || isResetPasswordPage || isVerifyOtpPage;
  
  const isProtectedRoute = [
    '/dashboard',
    '/learn',
    '/courses',
    '/personal-info',
    '/profile',
    '/quiz'
  ].some((route) => url.pathname.startsWith(route));
  
  if (isRootPage) {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // if (!token && isProtectedRoute) {
  //   url.pathname = '/auth/login';
  //   return NextResponse.redirect(url);
  // }

  if (token && isAuthPage) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/learn/:path*',
    '/',
    '/auth/login',
    '/auth/sign-up',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-otp',
    '/profile/:path*',
    '/quiz/:path*',
    '/personal-info',
    '/courses'
  ],
};
