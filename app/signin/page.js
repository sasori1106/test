'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError('Failed to sign in: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-gray-700 via-gray-600 to-gray-300">
      {/* Header */}
      <h1 className="mt-8 text-center text-8xl font-serif">
        <span className="text-white">Vapeon</span>
        <span className="text-red-500">X</span>
      </h1>

      {/* Main Content */}
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center mt-8">
        {/* Logo Area */}
        <div className="flex w-full items-center justify-center p-8 md:w-1/2">
          <div className="text-center">
            <div className="mx-auto h-[400px] w-[400px]">
              <div className="relative h-full w-full">
                <Image
                  src="/vapeonx.png"
                  alt="VapeonX Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Area */}
        <div className="w-full p-8 md:w-1/2">
          <div className="mx-auto max-w-md">
            {error && (
              <div className="mb-4 rounded bg-red-100 p-3 text-red-500">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="email"
                  id="email"
                  className="w-full rounded border px-3 py-2 leading-tight text-white bg-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <input
                  type="password"
                  id="password"
                  className="w-full rounded border px-3 py-2 leading-tight text-white bg-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4 flex items-center justify-between">
                <label className="flex items-center text-sm text-white">
                  <input
                    type="checkbox"
                    id="remember-me"
                    className="mr-2"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Keep me signed in
                </label>
                <a
                  href="#"
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Forgot your password?
                </a>
              </div>

              <div className="mb-4">
                <button
                  type="submit"
                  className="w-full rounded bg-gray-900 py-2 px-4 font-bold text-white hover:bg-black"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </form>

            <div className="mb-2 text-center text-sm text-white">
              By logging in, you agree to VapeonX's{' '}
              <a href="#" className="text-red-500 hover:text-red-700">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="#" className="text-red-500 hover:text-red-700">
                Terms of Use
              </a>
            </div>

            <div className="text-center text-sm text-white">
              Not a Member?{' '}
              <Link href="/signup" className="text-red-500 hover:text-red-700">
                Join now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
