import React from 'react';
import { useRouter } from '@/context/RouterContext';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { navigate } = useRouter();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-sm text-slate-500">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
        {/* Monogram & Copyright */}
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20 font-mono text-xs font-bold text-emerald-400">
              AD
            </span>
            <span className="font-medium text-slate-300">Agamjot Dhingra</span>
          </div>
          <p className="text-xs text-slate-500">
            &copy; {currentYear} Agamjot Dhingra. Built with React 19, TypeScript, Tailwind CSS &amp; Supabase.
          </p>
        </div>

        {/* Links & Back to Top */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:justify-end">
          <a
            href="https://github.com/agamjotdhingra"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-slate-300"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/agamjotdhingra"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-slate-300"
          >
            LinkedIn
          </a>

          {/* Subtle Admin Portal Link */}
          <a
            href="/admin/login"
            onClick={(e) => {
              e.preventDefault();
              navigate('/admin/login');
            }}
            className="transition-colors hover:text-slate-300 focus:outline-none focus:underline"
            aria-label="Navigate to Admin Portal login"
          >
            Admin Portal
          </a>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 transition-colors hover:text-emerald-400 focus:outline-none"
            title="Scroll to Top"
          >
            <span>Back to Top</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};
