'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient();
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  console.log(data);

  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    redirect('/error');  // Make sure this redirect is functioning as intended
  } else {
    revalidatePath('/', 'layout');
    redirect('/');  // Or any intended path
  }
}