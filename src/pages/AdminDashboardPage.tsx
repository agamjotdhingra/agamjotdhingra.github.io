import React, { useEffect, useState } from 'react';
import { useAuth, ADMIN_UUID } from '@/context/AuthContext';
import { useRouter } from '@/context/RouterContext';
import { AdminProjectsManager } from '@/components/admin/AdminProjectsManager';
import { AdminProfileManager } from '@/components/admin/AdminProfileManager';
import { AdminNotebookManager } from '@/components/admin/AdminNotebookManager';
import { AdminExplorationsManager } from '@/components/admin/AdminExplorationsManager';

type AdminTab = 'projects' | 'profile' | 'notebook' | 'exploring' | 'overview';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('projects');

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
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0c] text-zinc-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-200" />
          <p className="text-xs text-zinc-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] font-sans text-zinc-100 antialiased">
      {/* Admin Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-[#1c1e24] bg-[#0a0a0c]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#272930] bg-[#111215] font-mono text-xs font-semibold text-zinc-300">
              AD
            </span>
            <div>
              <span className="font-semibold text-sm text-white">Portfolio Admin</span>
              <span className="ml-2 hidden rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-300 sm:inline-block">
                ENC · TIET
              </span>
            </div>
          </div>

          {/* User info & Actions */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-lg border border-[#272930] bg-[#111215] px-3 py-1.5 text-xs text-zinc-300 hover:text-white transition-colors"
            >
              Live Site &rarr;
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-lg border border-red-900/30 bg-red-950/20 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-900/30 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-[#1c1e24] bg-[#0a0a0c]/50">
          <div className="mx-auto flex max-w-6xl items-center gap-1.5 px-6 py-2 overflow-x-auto">
            {[
              { id: 'projects', label: 'Projects' },
              { id: 'profile', label: 'Profile' },
              { id: 'notebook', label: 'Notebook' },
              { id: 'exploring', label: 'Explorations' },
              { id: 'overview', label: 'Security' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {activeTab === 'projects' && <AdminProjectsManager />}

        {activeTab === 'profile' && <AdminProfileManager />}

        {activeTab === 'notebook' && <AdminNotebookManager />}

        {activeTab === 'exploring' && <AdminExplorationsManager />}

        {activeTab === 'overview' && (
          <div className="space-y-6 text-left">
            <div className="rounded-2xl border border-[#1e2026] bg-[#111215] p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-white">
                Session Authorization &amp; Database Security
              </h2>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                Administrative access is restricted to verified authentication credentials protected by Supabase Row Level Security (RLS).
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-[#1e2026] bg-[#0a0a0c] p-4">
                  <span className="text-[11px] text-zinc-400">Authenticated Email</span>
                  <div className="mt-1 truncate font-mono text-xs text-zinc-200">{user.email}</div>
                </div>
                <div className="rounded-xl border border-[#1e2026] bg-[#0a0a0c] p-4">
                  <span className="text-[11px] text-zinc-400">Verified Admin UUID</span>
                  <div className="mt-1 truncate font-mono text-xs text-zinc-300">{ADMIN_UUID}</div>
                </div>
                <div className="rounded-xl border border-[#1e2026] bg-[#0a0a0c] p-4">
                  <span className="text-[11px] text-zinc-400">Access Scope</span>
                  <div className="mt-1 text-xs font-medium text-emerald-400">Full Content Access</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
