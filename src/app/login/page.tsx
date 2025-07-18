'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for a confirmation link!');
    }
  };

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert('Signed in successfully!');
    }
  };

  return (
    // Main container to center everything
    <div className="flex justify-center items-center min-h-screen p-4">

      {/* The larger, outer container with the logo */}
      <div className="group relative w-full max-w-lg p-8 rounded-2xl bg-primary/5 backdrop-blur-sm border border-primary/10 transition-all duration-300 hover:shadow-2xl hover:border-primary/20">

        <div className="flex flex-col items-center justify-center space-y-4 mb-8">
          <Image src="/logo.png" alt="Logo" width={60} height={60} />
          <h1 className="text-2xl font-bold text-primary tracking-widest uppercase">
            COMMAND IN LAW
          </h1>
        </div>

        {/* The smaller, inner container for the form */}
        <div className="w-full max-w-sm mx-auto p-8 space-y-6 bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-primary/10 transition-all duration-300 group-hover:scale-105">

          <h2 className="text-xl font-bold text-center text-primary">
            Welcome
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-bold text-secondary">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-bold text-secondary">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={handleSignIn}
              className="w-full py-2 px-4 font-semibold rounded-md text-white bg-primary hover:bg-opacity-80 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={handleSignUp}
              className="w-full py-2 px-4 font-semibold rounded-md text-white bg-secondary hover:bg-opacity-80 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}