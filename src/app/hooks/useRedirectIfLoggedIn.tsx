// hooks/useRedirectIfLoggedIn.js

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Redirects logged-in users to the specified path
export const useRedirectIfLoggedIn = (redirectTo: string) => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const redirectIfLoggedIn = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        try {
          router.push(redirectTo);
        } catch (error) {
          console.error(error);
        }
      }
    };

    redirectIfLoggedIn();
  }, [router, redirectTo, supabase.auth]);
};
