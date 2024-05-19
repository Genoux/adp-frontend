'use client';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import supabase from '@/app/lib/supabase/auth/supabase-browser';
import { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

export default function LoginPage() {
  const isDev = process.env.NODE_ENV === 'development';
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [email, setEmail] = useState('john.olivierb@gmail.com');
  const [password, setPassword] = useState('123456');
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const emailInputClassName = `border ${emailError ? 'border-red-700 border-opacity-50' : ''}`;
  const passwordInputClassName = `border ${passwordError ? 'border-red-700 border-opacity-50' : ''}`;

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

  const handleLogin = async (e: FormEvent) => {
    console.log('handleLogin - e:', e);
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
      setTriggerShake((prevState) => !prevState);
    }

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error logging in:', error.message);
      setEmailError(true);
      setPasswordError(true);

      setTriggerShake((prevState) => !prevState);
      return;
    }
    setUser(data.user); // Update user state
    console.log('handleLogin - user:', user);

    router.push('/admin/rooms'); // Redirect to the admin dashboard
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="mx-auto flex w-fit flex-col items-center border p-6"
    >
      <div className="flex flex-col">
        <div className="mb-6 flex flex-col gap-1 text-center">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            Connection admin
          </h3>
          <p className="text-sm text-muted-foreground">
            {"Si vous n'êtes pas admin, retournez à "}
            <Link className="text-white underline" href="/">
              {"l'accueil"}
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <motion.div
            animate={emailError ? shakeAnimation : {}}
            key={triggerShake ? 'shake1' : 'shake2'}
          >
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
            key={triggerShake ? 'shake3' : 'shake4'}
          >
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
  );
}
