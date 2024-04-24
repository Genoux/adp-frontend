import React, { ReactNode } from 'react';
import serverComponentClient from '@/app/lib/supabase/auth/supabase-server';
import { redirect } from 'next/navigation'

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const supabase = serverComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/admin/rooms');
  }

  return (
    <main className='container max-w-2xl h-screen justify-center'>
      {children}
    </main>
  );
};
