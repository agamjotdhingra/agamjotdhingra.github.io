import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Magnet from '@/components/reactbits/Magnet';

const NAV_LINKS = [
  { label: 'Domains', href: '#domains' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Notebook', href: '#notebook' },
  { label: 'Contact', href: '#contact' },
];

type Indicator = { left: number; width: number; visible: boolean };

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('');
  const [indicator, setIndicator] = useState<Indicator>({ left: 0, width: 0, visible: false });
  const progressRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  // Scroll state, reading progress and scroll-spy share one rAF-throttled listener.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 24);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      }

      // Active section = last section whose top is above 40% of the viewport.
      const probe = window.innerHeight * 0.4;
      let current = '';
      for (const link of NAV_LINKS) {
        const el = document.querySelector(link.href);
        if (el && el.getBoundingClientRect().top <= probe) current = link.href;
      }
      // At the very bottom, the last section is active even if it's short.
      if (max > 0 && y >= max - 4) {
        const last = [...NAV_LINKS].reverse().find((l) => document.querySelector(l.href));
        if (last) current = last.href;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Slide the pill indicator under the active link.
  const measure = useCallback(() => {
    const el = active ? linkRefs.current[active] : null;
    const nav = navRef.current;
    if (!el || !nav) {
      setIndicator((prev) => ({ ...prev, visible: false }));
      return;
    }
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth, visible: true });
  }, [active]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    if (!document.fonts?.ready) return;
    document.fonts.ready.then(measure).catch(() => undefined);
  }, [measure]);

  // Lock page scroll and support Escape while the mobile menu is open.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* Soft fade so content scrolling underneath doesn't collide with the floating nav */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0a0a0c] via-[#0a0a0c]/70 to-transparent transition-opacity duration-500 ${
            scrolled ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />
        {/* Reading progress hairline */}
        <div
          ref={progressRef}
          className="absolute inset-x-0 top-0 h-px origin-left bg-accent/80"
          style={{ transform: 'scaleX(0)' }}
          aria-hidden="true"
        />

        <div
          className={`mx-auto flex max-w-6xl items-center justify-between px-5 transition-[padding] duration-500 sm:px-8 ${
            scrolled ? 'py-3' : 'py-5'
          }`}
        >
          {/* Brand */}
          <a
            href="#hero"
            className="group relative z-[70] flex items-center gap-3"
            aria-label="Agamjot Singh Dhingra — back to top"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#2a2d36] bg-[#0f1013]/80 font-mono text-[11px] font-medium text-zinc-200 backdrop-blur-md transition-colors group-hover:border-accent/60">
              AD
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_rgba(244,183,64,0.7)]" />
            </span>
            <span
              className={`hidden flex-col leading-tight transition-all duration-500 sm:flex ${
                scrolled ? 'pointer-events-none -translate-x-2 opacity-0' : 'opacity-100'
              }`}
            >
              <span className="text-sm font-semibold tracking-tight text-zinc-100">Agamjot Singh Dhingra</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">ENC · TIET</span>
            </span>
          </a>

          {/* Desktop pill navigation */}
          <nav
            ref={navRef}
            aria-label="Primary"
            className={`absolute left-1/2 hidden -translate-x-1/2 items-center rounded-full border p-1 backdrop-blur-xl transition-colors duration-500 md:flex ${
              scrolled ? 'border-[#26282f] bg-[#0f1013]/75' : 'border-[#1c1e24] bg-[#0f1013]/40'
            }`}
          >
            <span
              className="absolute top-1 bottom-1 rounded-full bg-white/[0.08] ring-1 ring-inset ring-white/10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                left: indicator.left,
                width: indicator.width,
                opacity: indicator.visible ? 1 : 0,
              }}
              aria-hidden="true"
            />
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                ref={(el) => {
                  linkRefs.current[link.href] = el;
                }}
                href={link.href}
                aria-current={active === link.href ? 'true' : undefined}
                className={`relative z-10 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors duration-300 ${
                  active === link.href ? 'text-white' : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Magnet padding={40} magnetStrength={4} maxOffset={8}>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-[13px] font-medium text-zinc-950 transition-colors hover:bg-white"
              >
                Get in touch
                <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                  &rarr;
                </span>
              </a>
            </Magnet>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="relative z-[70] flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2d36] bg-[#0f1013]/80 backdrop-blur-md md:hidden"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="relative block h-3 w-4" aria-hidden="true">
              <span
                className={`absolute left-0 h-px w-4 bg-zinc-200 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  mobileMenuOpen ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 h-px w-4 bg-zinc-200 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  mobileMenuOpen ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile full-screen menu (staggered, after React Bits' StaggeredMenu) */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-[#0a0a0c]/95 px-6 pb-10 pt-28 backdrop-blur-xl transition-[opacity,visibility] duration-500 md:hidden ${
          mobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              tabIndex={mobileMenuOpen ? 0 : -1}
              onClick={() => setMobileMenuOpen(false)}
              className={`group flex items-baseline gap-4 border-b border-[#1c1e24] py-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: mobileMenuOpen ? `${120 + i * 60}ms` : '0ms' }}
            >
              <span className="font-mono text-[11px] text-accent">0{i + 1}</span>
              <span
                className={`text-4xl font-semibold tracking-[-0.04em] ${
                  active === link.href ? 'text-white' : 'text-zinc-400 group-hover:text-white'
                }`}
              >
                {link.label}
              </span>
            </a>
          ))}
        </nav>
        <p
          className={`font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500 transition-opacity delay-500 duration-700 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Patiala, Punjab · ENC 2025–2029
        </p>
      </div>
    </>
  );
};
