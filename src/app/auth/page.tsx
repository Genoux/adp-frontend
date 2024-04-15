'use client'

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { login } from '@/app/login/actions';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event: any) => {
    event.preventDefault();
    console.log("Form Submitted");  // Confirm that the form submission is captured
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      console.log("Attempting login...");  // Debug: Check if this logs
      await login(formData);
      console.log("Login successful");  // Debug: Should log after login completes
    } catch (err) {
      console.error("Login error:", err);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <main>
      <div>
        <form onSubmit={handleLogin}>
          <input 
            type="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email"
            required 
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required 
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button type="submit">Log in</Button>
        </form>
      </div>
    </main>
  );
}
