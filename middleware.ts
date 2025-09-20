import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

/* 
prevent admin from going to the user route
*/

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/unauthorized',
])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth()

  // Not signed in and accessing protected route
  if (!userId && !isPublicRoute(req)) {
    return redirectToSignIn()
  }

  // Signed in
  if (userId) {
    const client=await clerkClient()
    const user = await client.users.getUser(userId)
    const role = user.publicMetadata?.role

    // 🚫 Block non-admins from admin routes, redirect them to user dashboard
    if (isAdminRoute(req) && role !== 'admin') {
      return NextResponse.redirect(new URL('/user/dashboard', req.url))
    }

    // ✅ Optional: Redirect admins from root `/` to `/admin`
    if (req.nextUrl.pathname === '/' && role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    // ✅ Optional: Redirect users from root `/` to `/user/dashboard`
    if (req.nextUrl.pathname === '/' && role !== 'admin') {
      return NextResponse.redirect(new URL('/user/dashboard', req.url))
    }
  }

  // Allow if none of the above matched
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip static files and Next internals
    '/((?!_next|[^?]*\\.(?:html?|css|js|json|jpg|jpeg|png|gif|svg|woff2?|ttf|ico|txt|xml|webmanifest|map)).*)',
    // Always run for API and app routes
    '/(api|trpc)(.*)',
  ],
}


/* 
think of all the edge cases of prevention and redirecting.

admin, user routes both are blocked for users who havnt signed in
lets say a user tries to sign in to the admin i.e blocked route, redirect them to user/dashboard
*/