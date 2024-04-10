'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRedirectIfLoggedIn } from '../hooks/useRedirectIfLoggedIn';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import Link from 'next/link';



export default function LoginPage() {
  
  useRedirectIfLoggedIn('/admin/rooms');

  const isDev = process.env.NODE_ENV === 'development';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Toggle this state to re-trigger animations
  const [triggerShake, setTriggerShake] = useState(false);

  const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.3 },
  };

  const emailInputClassName = `border ${emailError ? 'border-red-700 border-opacity-50' : ''}`;
  const passwordInputClassName = `border ${passwordError ? 'border-red-700 border-opacity-50' : ''}`;

  useEffect(() => {
    if (isDev) {
      setEmail('john.olivierb@gmail.com');
      setPassword('123456');
    }
  }, [isDev]);
        



  const handleSignIn = async () => {
    // Reset error states first
    setEmailError(false);
    setPasswordError(false);

    // Validate input and set errors if necessary
    const isEmailValid = email.trim() !== '';
    const isPasswordValid = password.trim() !== '';

    if (!isEmailValid || !isPasswordValid) {
        // Set the specific error states based on the validation results
        setEmailError(!isEmailValid);
        setPasswordError(!isPasswordValid);

        // Trigger the shake animation by toggling its state
        setTriggerShake(prevState => !prevState);
        
        return; // Stop execution if any validation fails
    }

    // If validation passes, attempt to sign in
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error("Signin error:", error.message);
        // Set both to true, assuming error needs to highlight both fields
        // Adjust this logic based on your error handling strategy
        setEmailError(true);
        setPasswordError(true);

        // Re-trigger the shake animation
        setTriggerShake(prevState => !prevState);
        return;
    }

    // On successful authentication, redirect the user
    router.push('/admin/rooms');
};

  return (
    <div className='h-full flex items-center'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center rounded-md border p-6 w-fit mx-auto">
        <div className="flex flex-col">
          <div className="flex flex-col gap-1 text-center mb-6">
            <h3 className="font-semibold leading-none tracking-tight text-lg">Connection admin</h3>
            <p className="text-sm text-muted-foreground">{"Si vous n'êtes pas admin, retournez à "}<Link className='underline text-white' href="/">{"l'accueil"}</Link></p>
          </div>
          <div className='flex flex-col gap-4'>
            <motion.div
              animate={emailError ? shakeAnimation : {}}
              key={triggerShake ? 'shake1' : 'shake2'}>
              <Input
                type="email"
                name="email"
                value={email}
                onFocus={() => setEmailError(false)}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={emailInputClassName}
              />
            </motion.div>

            <motion.div
              animate={passwordError ? shakeAnimation : {}}
              key={triggerShake ? 'shake3' : 'shake4'}>
              <Input
                type="password"
                name="password"
                value={password}
                onFocus={() => setPasswordError(false)}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={passwordInputClassName}
              />
            </motion.div>
            <Button onClick={handleSignIn}>Connection</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
