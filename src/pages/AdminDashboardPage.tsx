import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAuth, ADMIN_UUID } from '@/context/AuthContext';
import { useRouter } from '@/context/RouterContext';
import { AdminProjectsManager } from '@/components/admin/AdminProjectsManager';
import { AdminProfileManager } from '@/components/admin/AdminProfileManager';
import { AdminNotebookManager } from '@/components/admin/AdminNotebookManager';
import { AdminExplorationsManager } from '@/components/admin/AdminExplorationsManager';
import DotGrid from '@/components/reactbits/DotGrid';
import { SplitText } from '@/components/motion/SplitText';
import { Reveal } from '@/components/motion/Reveal';

type AdminTab = 'projects' | 'profile' | 'notebook' | 'exploring' | 'overview';

const TABS: { id: AdminTab; label: string; caption: string }[] = [
  { id: 'projects', label: 'Projects', caption: 'Selected work shown in section 03' },
  { id: 'profile', label: 'Profile', caption: 'Hero headline, bio and contact details' },
  { id: 'notebook', label: 'Notebook', caption: 'Articles for the Engineering Notebook' },
  { id: 'exploring', label: 'Explorations', caption: 'Entries for the Learning Log' },
  { id: 'overview', label: 'Security', caption: 'Session and access details' },
];

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [scrolled, setScrolled] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<Partial<Record<AdminTab, HTMLButtonElement | null>>>({});

  useEffect(() => {
    if (!loading) {
      if (!user || !isAdmin) {
        navigate('/admin/login');
      }
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Slide the pill indicator under the active tab (same pattern as the public navbar).
  const measure = useCallback(() => {
    const el = tabRefs.current[activeTab];
    if (!el) return;
    const next = { left: el.offsetLeft, width: el.offsetWidth };
    // Only update when the geometry actually changed, so re-renders can't loop.
    setIndicator((prev) => (prev.left === next.left && prev.width === next.width ? prev : next));
  }, [activeTab]);

  const ready = !loading && Boolean(user) && isAdmin;
  useLayoutEffect(() => {
    measure();
  }, [measure, ready]);

  useEffect(() => {
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0c] text-zinc-100">
        <div className="flex flex-col items-center gap-4">
          <span className="relative flex h-2 w-2">
            <span className="pulse-dot relative inline-block h-2 w-2 rounded-full bg-accent text-accent" />
          </span>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-zinc-500">Verifying session…</p>
        </div>
      </div>
    );
  }

  const current = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="grain min-h-screen bg-[#0a0a0c] font-sans text-zinc-100 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50">
        <div
          className={`pointer-events-none absolute inset-0 border-b transition-all duration-500 ${
            scrolled ? 'border-[#1c1e24] bg-[#0a0a0c]/85 backdrop-blur-xl' : 'border-transparent bg-transparent'
          }`}
          aria-hidden="true"
        />
        <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#2a2d36] bg-[#0f1013] font-mono text-[11px] font-medium text-zinc-200">
              AD
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_rgba(244,183,64,0.7)]" />
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-semibold tracking-tight text-zinc-100">Portfolio Admin</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">ENC · TIET · Studio</span>
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="group inline-flex items-center gap-1.5 rounded-full border border-[#2a2d36] px-4 py-2 text-[12.5px] text-zinc-300 transition-colors hover:border-zinc-400 hover:text-white"
            >
              Live site
              <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                &rarr;
              </span>
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full border border-red-900/40 px-4 py-2 text-[12.5px] font-medium text-red-300 transition-colors hover:border-red-700/60 hover:bg-red-950/30"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Studio band */}
      <section className="relative -mt-[68px] overflow-hidden pt-[68px]">
        <div
          className="absolute inset-0 [mask-image:radial-gradient(ellipse_70%_90%_at_80%_20%,#000_20%,transparent_75%)]"
          aria-hidden="true"
        >
          <DotGrid
            dotSize={2.5}
            gap={24}
            baseColor="#25272f"
            activeColor="#f4b740"
            proximity={120}
            shockRadius={200}
            shockStrength={2}
            glow={0.5}
            fade={0.3}
            opacity={0.8}
          />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-12 sm:px-8 sm:pt-16">
          <Reveal variant="fade" className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            <span className="text-accent">00</span>
            <span className="h-px w-8 bg-zinc-700" aria-hidden="true" />
            <span>Admin</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#272930] px-2 py-0.5 text-[9.5px] normal-case tracking-normal text-zinc-400">
              <span className="pulse-dot relative h-1.5 w-1.5 rounded-full bg-emerald-400 text-emerald-400" />
              Authenticated
            </span>
          </Reveal>
          <h1 className="mt-5 text-left text-[clamp(2.6rem,7vw,5rem)] font-semibold leading-[0.95] tracking-display text-white">
            <SplitText text="Content" delay={80} />{' '}
            <SplitText
              text="studio."
              delay={160}
              wordClassName={() => 'font-editorial font-light italic tracking-[-0.03em] text-zinc-300'}
            />
          </h1>
          <Reveal delay={250}>
            <p className="mt-4 max-w-xl text-left text-[14px] leading-relaxed text-zinc-400">
              Everything published here flows straight into the live portfolio. Signed in as{' '}
              <span className="font-mono text-[12.5px] text-zinc-200">{user.email}</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Tab navigation — sticky pill, matching the public navbar */}
      <div className="sticky top-[68px] z-40 border-b border-[#16171c] bg-[#0a0a0c]/85 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl overflow-x-auto px-5 py-3 sm:px-8 [scrollbar-width:none]">
          <nav
            aria-label="Admin sections"
            role="tablist"
            className="relative inline-flex items-center rounded-full border border-[#1c1e24] bg-[#0f1013]/70 p-1"
          >
            <span
              className="absolute bottom-1 top-1 rounded-full bg-white/[0.08] ring-1 ring-inset ring-white/10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ left: indicator.left, width: indicator.width }}
              aria-hidden="true"
            />
            {TABS.map((tab, i) => (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative z-10 flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors duration-300 ${
                  activeTab === tab.id ? 'text-white' : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                <span className={`font-mono text-[10px] ${activeTab === tab.id ? 'text-accent' : 'text-zinc-600'}`}>
                  0{i + 1}
                </span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-8 flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-zinc-500">
          <span className="h-px w-6 bg-zinc-700" aria-hidden="true" />
          {current.caption}
        </div>

        <div key={activeTab} className="animate-[admin-panel-in_600ms_cubic-bezier(0.16,1,0.3,1)]">
          {activeTab === 'projects' && <AdminProjectsManager />}

          {activeTab === 'profile' && <AdminProfileManager />}

          {activeTab === 'notebook' && <AdminNotebookManager />}

          {activeTab === 'exploring' && <AdminExplorationsManager />}

          {activeTab === 'overview' && (
            <div className="space-y-6 text-left">
              <div className="rounded-2xl border border-[#1c1e24] bg-[#0f1013] p-6 sm:p-8">
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                  Session authorization &amp; <span className="font-editorial font-normal italic text-zinc-300">database security</span>
                </h2>
                <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-zinc-400">
                  Administrative access is restricted to verified authentication credentials protected by Supabase Row Level Security (RLS).
                </p>

                <dl className="mt-8 divide-y divide-[#1c1e24] rounded-xl border border-[#1c1e24]">
                  <div className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-[200px_1fr] sm:gap-6">
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-zinc-500">Authenticated email</dt>
                    <dd className="truncate font-mono text-[12.5px] text-zinc-200">{user.email}</dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-[200px_1fr] sm:gap-6">
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-zinc-500">Verified admin UUID</dt>
                    <dd className="truncate font-mono text-[12.5px] text-zinc-300">{ADMIN_UUID}</dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-[200px_1fr] sm:gap-6">
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-zinc-500">Access scope</dt>
                    <dd className="flex items-center gap-2 text-[13px] font-medium text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                      Full content access
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
