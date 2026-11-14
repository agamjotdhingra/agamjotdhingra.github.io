import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Profile } from '@/types';
import { getProfile } from '@/services/profileService';
import DotGrid from '@/components/reactbits/DotGrid';
import Magnet from '@/components/reactbits/Magnet';
import { SplitText } from '@/components/motion/SplitText';
import { DecryptText } from '@/components/motion/DecryptText';
import { Reveal } from '@/components/motion/Reveal';
import { useReducedMotion } from '@/components/motion/useReducedMotion';

const FALLBACK_NAME = 'Agamjot Singh Dhingra';

const SIGNAL_PATH = [
  { label: 'Electronics', href: '#domains' },
  { label: 'Software', href: '#domains' },
  { label: 'AI / ML', href: '#domains' },
];

/** Local time in Patiala (IST), ticking each minute — a small "live instrument" readout. */
function usePatialaTime(): string {
  const format = () =>
    new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata',
    }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 15_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export const HeroSection: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const time = usePatialaTime();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await getProfile();

    if (result.error) {
      setError(result.error);
      setProfile(null);
    } else {
      setProfile(result.profile);
      setError(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Subtle parallax: content drifts up and fades as the hero scrolls away.
  useEffect(() => {
    const el = contentRef.current;
    if (reduced) {
      if (el) {
        el.style.transform = '';
        el.style.opacity = '';
      }
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = contentRef.current;
      if (!el) return;
      const y = Math.min(window.scrollY, window.innerHeight);
      const p = y / window.innerHeight;
      el.style.transform = `translate3d(0, ${(-y * 0.18).toFixed(1)}px, 0)`;
      el.style.opacity = String(Math.max(0, 1 - p * 1.3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    // Sync immediately (covers restored scroll positions on reload) and on resize.
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced, loading]);

  const hasGithub = Boolean(profile?.github_url && profile.github_url.trim().length > 0);
  const hasLinkedin = Boolean(profile?.linkedin_url && profile.linkedin_url.trim().length > 0);
  const hasEmail = Boolean(profile?.email && profile.email.trim().length > 0);
  const hasSocials = hasGithub || hasLinkedin || hasEmail;

  const fullName = profile?.full_name?.trim() || FALLBACK_NAME;
  const nameParts = fullName.split(/\s+/);
  const firstLine = nameParts[0];
  const secondLine = nameParts.slice(1).join(' ');

  return (
    <section id="hero" className="relative flex min-h-[100svh] w-full items-center overflow-hidden">
      {/* Interactive dot field — React Bits DotGrid */}
      <div
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_70%_40%,#000_30%,transparent_80%)]"
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
          swell={0.9}
          glow={0.6}
          fade={0.35}
          opacity={0.9}
        />
      </div>
      {/* Warm signal glow, off-axis */}
      <div
        className="pointer-events-none absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full bg-accent/[0.06] blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#0a0a0c]"
        aria-hidden="true"
      />

      <div ref={contentRef} className="relative mx-auto w-full max-w-6xl px-5 pb-28 pt-28 will-change-transform sm:px-8 sm:pt-32">
        {/* Loading Skeleton */}
        {loading && (
          <div className="max-w-3xl space-y-6 animate-pulse" role="status" aria-label="Loading profile">
            <div className="h-4 w-44 rounded bg-zinc-800" />
            <div className="h-20 w-3/4 rounded-lg bg-zinc-800" />
            <div className="h-20 w-2/3 rounded-lg bg-zinc-800" />
            <div className="h-6 w-1/2 rounded bg-zinc-800/70" />
            <div className="flex gap-4 pt-4">
              <div className="h-11 w-40 rounded-full bg-zinc-800" />
              <div className="h-11 w-32 rounded-full bg-zinc-800/70" />
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="max-w-md rounded-2xl border border-zinc-800 bg-[#121316] p-6 text-left">
            <p className="text-xs font-medium text-red-400">Unable to load profile data.</p>
            <p className="mt-1 text-xs text-zinc-500">{error}</p>
            <button
              type="button"
              onClick={fetchProfile}
              className="mt-4 rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 text-xs text-zinc-200 hover:text-white"
            >
              Try again
            </button>
          </div>
        )}

        {/* Profile Content */}
        {!loading && !error && profile && (
          <div className="text-left">
            {/* Instrument readout */}
            <Reveal
              variant="fade"
              className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500"
            >
              <span className="flex items-center gap-2 text-zinc-300">
                <span className="pulse-dot relative inline-block h-1.5 w-1.5 rounded-full bg-accent text-accent" aria-hidden="true" />
                <DecryptText text="ENC · Thapar Institute of Engineering & Technology" duration={1100} delay={150} />
              </span>
              <span className="hidden h-px w-6 bg-zinc-700 sm:block" aria-hidden="true" />
              <span>2025–2029</span>
              <span className="hidden h-px w-6 bg-zinc-700 sm:block" aria-hidden="true" />
              <span>
                Patiala <span className="text-zinc-400">{time}</span> IST
              </span>
            </Reveal>

            {/* Name */}
            <h1 className="mt-6 text-[clamp(3rem,9.5vw,7.75rem)] font-semibold leading-[0.9] tracking-display text-white" aria-label={fullName}>
              <SplitText text={firstLine} className="block" delay={200} stagger={90} />
              {secondLine && (
                <SplitText
                  text={secondLine}
                  className="block pl-[0.04em] text-zinc-400"
                  delay={320}
                  stagger={90}
                  wordClassName={(_, i) => (i === 0 ? 'font-editorial font-light italic tracking-[-0.03em] text-zinc-300' : undefined)}
                />
              )}
            </h1>

            <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                {/* Headline (CMS) */}
                <Reveal variant="blur" delay={650}>
                  <p className="max-w-2xl font-editorial text-[1.4rem] italic leading-snug text-zinc-300 sm:text-[1.7rem]">
                    {profile.headline ||
                      'Electronics and Computer Engineering student exploring software, hardware systems, and artificial intelligence.'}
                  </p>
                </Reveal>

                {/* Bio (CMS) */}
                {profile.bio && (
                  <Reveal delay={800}>
                    <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-zinc-400">{profile.bio}</p>
                  </Reveal>
                )}

                {/* Actions */}
                <Reveal delay={950} className="mt-9 flex flex-wrap items-center gap-3">
                  <Magnet padding={50} magnetStrength={3} maxOffset={10}>
                    <a
                      href="#projects"
                      className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3 text-[13px] font-semibold text-zinc-950 shadow-[0_0_0_0_rgba(244,183,64,0.4)] transition-shadow duration-500 hover:shadow-[0_0_40px_-4px_rgba(244,183,64,0.55)]"
                    >
                      Selected projects
                      <span className="inline-block transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true">
                        &darr;
                      </span>
                    </a>
                  </Magnet>
                  <Magnet padding={50} magnetStrength={3} maxOffset={10}>
                    <a
                      href="#contact"
                      className="inline-flex items-center rounded-full border border-zinc-700 bg-[#0f1013]/60 px-6 py-3 text-[13px] font-medium text-zinc-200 backdrop-blur transition-colors hover:border-zinc-400 hover:text-white"
                    >
                      Contact
                    </a>
                  </Magnet>

                  {hasSocials && (
                    <div className="flex items-center gap-5 pl-2 text-[13px] text-zinc-400">
                      {hasGithub && (
                        <a href={profile.github_url!} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-white">
                          GitHub
                        </a>
                      )}
                      {hasLinkedin && (
                        <a href={profile.linkedin_url!} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-white">
                          LinkedIn
                        </a>
                      )}
                      {hasEmail && (
                        <a href={`mailto:${profile.email}`} className="link-underline hover:text-white">
                          Email
                        </a>
                      )}
                    </div>
                  )}
                </Reveal>
              </div>

              {/* Signal path: the three domains as a tiny circuit */}
              <Reveal delay={1100} variant="fade" className="hidden lg:col-span-5 lg:block">
                <a
                  href="#domains"
                  className="group block rounded-2xl border border-[#1c1e24] bg-[#0f1013]/60 p-5 backdrop-blur-md transition-colors hover:border-[#2a2d36]"
                  aria-label="Jump to domains of focus: Electronics, Software, and AI"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                    <span>Signal path</span>
                    <span className="transition-colors group-hover:text-accent">Domains &rarr;</span>
                  </div>
                  <div className="mt-5 flex items-center">
                    {SIGNAL_PATH.map((node, i) => (
                      <React.Fragment key={node.label}>
                        <span className="flex flex-col items-center gap-2">
                          <span className="flex h-3 w-3 items-center justify-center rounded-full border border-accent/70">
                            <span className="h-1 w-1 rounded-full bg-accent" />
                          </span>
                          <span className="whitespace-nowrap font-mono text-[11px] text-zinc-300">{node.label}</span>
                        </span>
                        {i < SIGNAL_PATH.length - 1 && (
                          <span className="relative mx-2 mb-6 h-px flex-1 overflow-hidden bg-zinc-800" aria-hidden="true">
                            <span
                              className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent motion-safe:animate-[signal_2.4s_linear_infinite]"
                              style={{ animationDelay: `${i * 0.6}s` }}
                            />
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </a>
              </Reveal>
            </div>
          </div>
        )}
      </div>

      {/* Scroll cue */}
      {!loading && !error && profile && (
        <a
          href="#domains"
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:text-zinc-300 sm:flex"
          aria-label="Scroll to content"
        >
          Scroll
          <span className="relative h-10 w-px overflow-hidden bg-zinc-800" aria-hidden="true">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-accent motion-safe:animate-[scrollcue_1.8s_cubic-bezier(0.16,1,0.3,1)_infinite]" />
          </span>
        </a>
      )}
    </section>
  );
};
