import React, { ReactNode } from 'react';
import serverComponentClient from '@/app/lib/supabase/auth/supabase-server';
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = serverComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
 
  if (!user) {
    redirect('/auth');
    return <></>;
  }

  return (
    <div className='container max-w-2xl'>
      <main>{children}</main>
    </div>
  );
};
