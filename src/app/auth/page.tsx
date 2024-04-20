'use client'

import { useState, useEffect, FormEvent } from 'react';
import supabase from '@/app/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import LoadingScreen from '@/app/components/common/LoadingScreen';
import Link from 'next/link';

export default function LoginPage() {
  const isDev = process.env.NODE_ENV === 'development';
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [email, setEmail] = useState('john.olivierb@gmail.com')
  const [password, setPassword] = useState('123456')
  const [user, setUser] = useState(null);
  const router = useRouter();

  const emailInputClassName = `border ${emailError ? 'border-red-700 border-opacity-50' : ''}`;
  const passwordInputClassName = `border ${passwordError ? 'border-red-700 border-opacity-50' : ''}`;


  // Toggle this state to re-trigger animations
  const [triggerShake, setTriggerShake] = useState(false);
  const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.3 },
  };

  useEffect(() => {
    if (isDev) {
      setEmail('john.olivierb@gmail.com');
      setPassword('123456');
    }
  }, [isDev]);


  useEffect(() => {
    async function checkSession() {
      const session = await supabase.auth.getSession();

      console.log("checkSession - session:", session);
      const user = session.data?.session?.user;

      if (!user) {
        router.push("/auth");
        return
      }
      setUser(user as any);
    }

    checkSession();
  }, [router]);

  if (!user) {
    return <LoadingScreen />
  }

  if (user) {
    router.push('/admin/rooms')
    return
  }

  const handleLogin = async (e: FormEvent) => {
    console.log("handleLogin - e:", e);
    e.preventDefault();

    setEmailError(false);
    setPasswordError(false);

    const isEmailValid = email.trim() !== '';
    const isPasswordValid = password.trim() !== '';

    if (!isEmailValid || !isPasswordValid) {
      // Set the specific error states based on the validation results
      setEmailError(!isEmailValid);
      setPasswordError(!isPasswordValid);

      // Trigger the shake animation by toggling its state
      setTriggerShake(prevState => !prevState);
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    console.log("handleLogin - password:", password);
    console.log("handleLogin - email:", email);

    if (error) {
      console.error('Error logging in:', error.message)
      setEmailError(true);
      setPasswordError(true);

      setTriggerShake(prevState => !prevState);
      return
    }

    router.push('/admin/rooms')
  }


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
            <Button onClick={handleLogin}>Connection</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
