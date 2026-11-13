import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/context/RouterContext';

export const AdminLoginPage: React.FC = () => {
  const { signIn, user, isAdmin, loading } = useAuth();
  const { navigate } = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    const { error } = await signIn(email, password);

    if (error) {
      setErrorMessage(error.message || 'Invalid email or password.');
      setSubmitting(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0c] px-4 py-12 text-zinc-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#272930] bg-[#111215] font-mono text-xs font-medium text-zinc-300">
            AD
          </div>
          <h1 className="mt-5 text-xl font-semibold tracking-tight text-white">
            Admin Portal
          </h1>
          <p className="mt-1.5 text-xs text-zinc-400">
            Sign in to manage projects and profile details.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-[#1e2026] bg-[#111215] p-6 sm:p-8">
          {errorMessage && (
            <div className="mb-5 rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-xs text-red-300">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-medium text-zinc-300">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="mt-1.5 block w-full rounded-lg border border-[#272930] bg-[#0a0a0c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-medium text-zinc-300">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="mt-1.5 block w-full rounded-lg border border-[#272930] bg-[#0a0a0c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center rounded-lg bg-zinc-100 py-2.5 text-xs font-medium text-zinc-950 transition-colors hover:bg-white disabled:opacity-50"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 border-t border-[#1e2026] pt-5 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs text-zinc-400 transition-colors hover:text-white"
            >
              ← Back to portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};