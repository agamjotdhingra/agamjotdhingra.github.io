import React from 'react';
import { useRouter } from '@/context/RouterContext';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { navigate } = useRouter();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-[#1c1e24] py-12 text-xs text-zinc-400">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-6 sm:flex-row sm:px-8">
        {/* Name & Academic Context */}
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-200">
              Agamjot Singh Dhingra
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400">
              ENC · Thapar Institute of Engineering and Technology
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            &copy; {currentYear} Agamjot Singh Dhingra. Built with React 19, TypeScript, Tailwind CSS &amp; Supabase.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 sm:justify-end">
          <a
            href="https://github.com/agamjotdhingra"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-200"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/agamjot-singh-dhingra-3216b7293"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-200"
          >
            LinkedIn
          </a>

          {/* Admin link */}
          <a
            href="/admin/login"
            onClick={(e) => {
              e.preventDefault();
              navigate('/admin/login');
            }}
            className="transition-colors hover:text-zinc-300"
            aria-label="Admin Portal login"
          >
            Admin
          </a>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1 transition-colors hover:text-zinc-200 focus:outline-none"
            title="Scroll to Top"
          >
            <span>Back to top</span>
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};