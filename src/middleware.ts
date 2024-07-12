import { supabase } from '@/app/lib/supabase/client';
import { NextResponse } from 'next/server';

export async function middleware(req: { nextUrl: { pathname: any; }; url: string | URL | undefined; }) {
  const { pathname } = req.nextUrl;
  const pathSegments = pathname.split('/').filter((segment: any) => segment);

  if (pathSegments.length >= 2) {
    const roomID = pathSegments[1];
    const teamID = pathSegments.length >= 3 ? pathSegments[2] : null;

    try {
      // Check if the room exists
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('id')
        .eq('id', roomID)
        .single();

      if (roomError || !roomData) {
        return NextResponse.redirect(new URL('/', req.url));
      }

      // If it's the spectator route, allow it
      if (teamID === 'spectator') {
        return NextResponse.next();
      }

      // Check if the team exists in the room
      if (teamID) {
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select('id')
          .eq('id', teamID)
          .eq('room_id', roomID)
          .single();

        if (teamError || !teamData) {
          return NextResponse.redirect(new URL('/', req.url));
        }
      }
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/room/:roomID/:teamID*'],
};
