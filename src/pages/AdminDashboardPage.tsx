import React, { useEffect, useState } from 'react';
import { useAuth, ADMIN_UUID } from '@/context/AuthContext';
import { useRouter } from '@/context/RouterContext';
import { AdminProjectsManager } from '@/components/admin/AdminProjectsManager';
import { AdminProfileManager } from '@/components/admin/AdminProfileManager';

type AdminTab = 'projects' | 'profile' | 'overview';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('projects');

  // Route protection: If unauthenticated or unauthorized UUID, redirect to /admin/login
  useEffect(() => {
    if (!loading) {
      if (!user || !isAdmin) {
        navigate('/admin/login');
      }
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-400" />
          <p className="text-xs text-slate-400">Verifying administrator authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Admin Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 font-mono text-sm font-extrabold text-slate-950 shadow-sm">
              AD
            </span>
            <div>
              <span className="font-bold tracking-tight text-white">Portfolio Admin</span>
              <span className="ml-2 hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400 sm:inline-block">
                Protected Mode
              </span>
            </div>
          </div>

          {/* User info & Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <div className="text-xs font-medium text-slate-200">{user.email}</div>
              <div className="font-mono text-[10px] text-slate-500">UID: {user.id.slice(0, 8)}...</div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="hidden rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-850 hover:text-white sm:inline-flex"
            >
              View Live Site &nearr;
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-xl border border-red-900/40 bg-red-950/20 px-3.5 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:border-red-800 hover:bg-red-900/30 hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-slate-800/80 bg-slate-950/50">
          <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === 'projects'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              Projects Manager
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === 'profile'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              Profile Editor
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              Session &amp; Security
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {activeTab === 'projects' && <AdminProjectsManager />}

        {activeTab === 'profile' && <AdminProfileManager />}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-slate-950 p-8 shadow-xl backdrop-blur-md sm:p-10">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Administrator Session</span>
              </div>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                System Security &amp; Authorization
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                The private Admin Panel operates under strict Row Level Security (RLS) enforcement and authenticated UUID verification.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <span className="text-[11px] font-medium text-slate-500">Authenticated Admin</span>
                  <div className="mt-1 truncate font-mono text-xs text-slate-200">{user.email}</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <span className="text-[11px] font-medium text-slate-500">Configured Admin UUID</span>
                  <div className="mt-1 truncate font-mono text-xs text-emerald-400">{ADMIN_UUID}</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <span className="text-[11px] font-medium text-slate-500">Access Policy</span>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Full Write &amp; Manage Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
