import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const serverComponentClient = () =>
  createServerComponentClient({
    cookies,
  });

export default serverComponentClient;
