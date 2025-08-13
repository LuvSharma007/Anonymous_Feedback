import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export {default} from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({req:request})
    const url = request.nextUrl

    const publicPage = url.pathname.startsWith('/signIn') ||
                       url.pathname.startsWith('/signUp') ||
                       url.pathname.startsWith('/verify')

    if(token && publicPage){
        return NextResponse.redirect(new URL('/home', request.url))
    }

    if(!token && !publicPage){
        return NextResponse.redirect(new URL('/signIn', request.url))
    }
    
  return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/signIn',
    '/signUp',
    '/',
    '/dashboard/:path*',
    '/verify/:path*',
    '/home'
]
}