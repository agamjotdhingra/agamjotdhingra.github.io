import React, { useState } from 'react';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <a href="#hero" className="flex items-center space-x-2.5 text-lg font-bold tracking-tight text-white group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 font-mono text-sm font-extrabold text-slate-950 shadow-sm transition-transform group-hover:scale-105">
            AD
          </span>
          <span className="transition-colors group-hover:text-emerald-400">Agamjot Dhingra</span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-400">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-emerald-400"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="mailto:agamjotdhingra@gmail.com"
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-400 transition-all hover:bg-emerald-500/20"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Let&apos;s Talk
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-900 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-800 bg-slate-950 px-4 py-4 md:hidden">
          <nav className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-base font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-emerald-400"
              >
                {link.label}
              </a>
            ))}
            <a
              href="mailto:agamjotdhingra@gmail.com"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950"
            >
              Let&apos;s Talk
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
