import serverComponentClient from '@/app/lib/supabase/auth/supabase-server';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = serverComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/admin/rooms');
  }

  return (
    <main className="container h-screen max-w-2xl justify-center">
      {children}
    </main>
  );
}
