import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const supabase = createMiddlewareClient({
      req,
      res: new NextResponse(),
    });
    const response = await supabase.auth.getSession();
    const user = response.data?.session?.user;
    const url = req.nextUrl.clone();

    // Check if the path starts with /admin
    if (url.pathname.startsWith('/admin')) {
        if (!user) {
            // Redirect unauthenticated users to the login page
            url.pathname = '/auth';
            return NextResponse.redirect(url);
        }
        // User is authenticated, allow to proceed
        return NextResponse.next();
    }

    // Non-admin paths
    return NextResponse.next();
}
