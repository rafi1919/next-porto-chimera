import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const cookieStore = request.cookies;
    const isAuth = cookieStore.get('isAuth')?.value;

    if (isAuth !== 'true') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config ={
    matcher: ['/admin',]
}