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

  // If already authenticated with verified admin UUID, redirect to /admin
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
      // On success, navigate to protected admin route
      navigate('/admin');
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      {/* Background ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="w-full max-w-md">
        {/* Monogram Brand & Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 font-mono text-base font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20">
            AD
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Admin Portal
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Sign in to access private administrative management tools.
          </p>
        </div>

        {/* Login Box */}
        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          {errorMessage && (
            <div className="mb-6 rounded-xl border border-red-900/50 bg-red-950/40 p-4 text-xs text-red-300">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 7.5h.008v.008H12v-.008z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-medium uppercase tracking-wider text-slate-300">
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
                className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-slate-950 shadow-md transition-all hover:bg-emerald-400 hover:shadow-emerald-500/25 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin text-slate-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to Admin</span>
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-800/80 pt-6 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-emerald-400"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span>Back to Public Portfolio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

