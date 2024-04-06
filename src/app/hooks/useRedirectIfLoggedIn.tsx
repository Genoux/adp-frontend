// hooks/useRedirectIfLoggedIn.js

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Redirects logged-in users to the specified path
export const useRedirectIfLoggedIn = (redirectTo: string) => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const redirectIfLoggedIn = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          await router.push(redirectTo);
        } catch (error) {
          console.error(error);
        }
      }
    };

    redirectIfLoggedIn();
  }, [router, redirectTo, supabase.auth]);
};
