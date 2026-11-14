import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/context/RouterContext';
import DotGrid from '@/components/reactbits/DotGrid';
import { SplitText } from '@/components/motion/SplitText';
import { Reveal } from '@/components/motion/Reveal';

const LABEL = 'block font-mono text-[10.5px] uppercase tracking-[0.14em] text-zinc-500';
const INPUT =
  'mt-2 block w-full rounded-xl border border-[#26282f] bg-[#0a0a0c] px-4 py-3 text-[13.5px] text-white placeholder-zinc-600 transition-colors focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/15';

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
    <div className="grain grid min-h-screen grid-cols-1 bg-[#0a0a0c] text-zinc-100 lg:grid-cols-2">
      {/* Visual panel — echoes the portfolio hero */}
      <aside className="relative hidden overflow-hidden border-r border-[#16171c] lg:flex lg:flex-col lg:justify-between">
        <div
          className="absolute inset-0 [mask-image:radial-gradient(ellipse_80%_80%_at_40%_50%,#000_30%,transparent_80%)]"
          aria-hidden="true"
        >
          <DotGrid
            dotSize={3}
            gap={26}
            baseColor="#2a2d36"
            activeColor="#f4b740"
            proximity={150}
            shockRadius={260}
            shockStrength={3}
            glow={0.6}
            fade={0.3}
          />
        </div>
        <div
          className="pointer-events-none absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-accent/[0.06] blur-[110px]"
          aria-hidden="true"
        />

        <div className="relative flex items-center gap-3 p-10">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#2a2d36] bg-[#0f1013]/80 font-mono text-[11px] font-medium text-zinc-200">
            AD
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_rgba(244,183,64,0.7)]" />
          </span>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-zinc-500">
            Agamjot Singh Dhingra · Portfolio
          </span>
        </div>

        <div className="relative p-10">
          <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-semibold leading-[0.92] tracking-display text-white">
            <SplitText text="Content" className="block" delay={100} />
            <SplitText
              text="studio."
              className="block"
              delay={200}
              wordClassName={() => 'font-editorial font-light italic tracking-[-0.03em] text-zinc-300'}
            />
          </h2>
          <Reveal delay={350}>
            <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-zinc-400">
              Manage the projects, profile, notebook and learning log that power the live portfolio.
            </p>
          </Reveal>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <Reveal
            variant="fade"
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500"
          >
            <span className="text-accent">00</span>
            <span className="h-px w-8 bg-zinc-700" aria-hidden="true" />
            <span>Admin portal</span>
          </Reveal>
          <h1 className="mt-5 text-left text-4xl font-semibold tracking-[-0.035em] text-white">
            <SplitText text="Sign" delay={60} />{' '}
            <SplitText text="in." delay={120} wordClassName={() => 'font-editorial font-normal italic text-zinc-300'} />
          </h1>
          <Reveal delay={150}>
            <p className="mt-3 text-left text-[13.5px] text-zinc-400">Sign in to manage projects and profile details.</p>
          </Reveal>

          <Reveal delay={220} className="mt-10">
            {errorMessage && (
              <div
                className="mb-6 rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-left text-[12.5px] text-red-300"
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <div>
                <label htmlFor="admin-email" className={LABEL}>
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
                  className={INPUT}
                />
              </div>

              <div>
                <label htmlFor="admin-password" className={LABEL}>
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
                  className={INPUT}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-[13px] font-semibold text-zinc-950 transition-shadow duration-500 hover:shadow-[0_0_40px_-4px_rgba(244,183,64,0.55)] disabled:opacity-50"
              >
                {submitting ? 'Signing in…' : 'Sign in'}
                {!submitting && (
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                    &rarr;
                  </span>
                )}
              </button>
            </form>

            <div className="mt-8 border-t border-[#1c1e24] pt-6 text-left">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="link-underline text-[12.5px] text-zinc-400 transition-colors hover:text-white"
              >
                ← Back to portfolio
              </button>
            </div>
          </Reveal>
        </div>
      </main>
    </div>
  );
};
