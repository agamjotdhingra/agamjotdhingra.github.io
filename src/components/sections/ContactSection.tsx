import React, { useEffect, useState, useCallback } from 'react';
import { Profile } from '@/types';
import { getProfile } from '@/services/profileService';

// ---------------------------------------------------------------------------
// Icon helpers (inline SVGs — no extra deps)
// ---------------------------------------------------------------------------

const IconEmail: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);

const IconPhone: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
    />
  </svg>
);

const IconGitHub: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

const IconLinkedIn: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.8v8.37h-2.8v-8.37M7.86 6.72a1.63 1.63 0 0 0-1.63 1.62c0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.62-1.63-1.62Z" />
  </svg>
);

const IconCopy: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
    />
  </svg>
);

const IconCheck: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

// ---------------------------------------------------------------------------
// CopyButton — inline clipboard button for a text value
// ---------------------------------------------------------------------------

interface CopyButtonProps {
  value: string;
  label: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ value, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent fail — clipboard may not be available in all contexts
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      title={copied ? 'Copied!' : `Copy ${label}`}
      className={`inline-flex items-center justify-center rounded-lg p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
        copied
          ? 'text-emerald-400 bg-emerald-500/10'
          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
      }`}
    >
      {copied ? <IconCheck /> : <IconCopy />}
    </button>
  );
};

// ---------------------------------------------------------------------------
// ContactCard — a single contact method card
// ---------------------------------------------------------------------------

interface ContactCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  copyValue?: string;
  copyLabel?: string;
  badge?: string;
}

const ContactCard: React.FC<ContactCardProps> = ({
  icon,
  label,
  value,
  href,
  copyValue,
  copyLabel,
  badge,
}) => (
  <div className="group flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 px-5 py-4 transition-all hover:border-slate-700 hover:bg-slate-900/70">
    {/* Icon */}
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 text-slate-400 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-colors">
      {icon}
    </div>

    {/* Text */}
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
          {label}
        </span>
        {badge && (
          <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400">
            {badge}
          </span>
        )}
      </div>
      <a
        href={href}
        target={href.startsWith('mailto:') || href.startsWith('tel:') ? undefined : '_blank'}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="mt-0.5 block truncate text-sm font-medium text-slate-200 transition-colors hover:text-emerald-400"
      >
        {value}
      </a>
    </div>

    {/* Copy Button */}
    {copyValue && copyLabel && (
      <CopyButton value={copyValue} label={copyLabel} />
    )}
  </div>
);

// ---------------------------------------------------------------------------
// Loading Skeleton
// ---------------------------------------------------------------------------

const ContactSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 animate-pulse" aria-hidden="true">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className={`h-[72px] rounded-2xl border border-slate-800 bg-slate-900/30 ${i === 5 ? 'sm:col-span-2' : ''}`} />
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// ContactSection — main export
// ---------------------------------------------------------------------------

export const ContactSection: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getProfile();
    if (result.error) {
      setError(result.error);
      setProfile(null);
    } else {
      setProfile(result.profile);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Derive contact items from profile (only include non-null values)
  const hasCollegeEmail = Boolean(profile?.college_email?.trim());
  const hasPersonalEmail = Boolean(profile?.personal_email?.trim());
  const hasPhone = Boolean(profile?.phone_number?.trim());
  const hasGitHub = Boolean(profile?.github_url?.trim());
  const hasLinkedIn = Boolean(profile?.linkedin_url?.trim());

  const hasAnyContact = hasCollegeEmail || hasPersonalEmail || hasPhone || hasGitHub || hasLinkedIn;

  return (
    <section id="contact" className="w-full max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950 p-8 backdrop-blur-md sm:p-12">
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute -bottom-24 left-1/2 -z-10 h-72 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl"
          aria-hidden="true"
        />

        {/* Section header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Get in Touch</span>
          </div>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Let&apos;s build something great together.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-400">
            I&apos;m always open to discussing new opportunities, innovative projects, engineering
            challenges, or collaborating on open-source initiatives.
          </p>
        </div>

        {/* Content */}
        {loading && <ContactSkeleton />}

        {!loading && error && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <p className="text-sm text-red-400">{error}</p>
            <button
              type="button"
              onClick={fetchProfile}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 hover:border-slate-600 hover:text-white"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && !hasAnyContact && (
          <p className="py-8 text-center text-sm text-slate-500">Contact information coming soon.</p>
        )}

        {!loading && !error && hasAnyContact && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {hasCollegeEmail && (
              <ContactCard
                icon={<IconEmail />}
                label="College Email"
                value={profile!.college_email!}
                href={`mailto:${profile!.college_email}`}
                copyValue={profile!.college_email!}
                copyLabel="college email"
                badge="Thapar"
              />
            )}

            {hasPersonalEmail && (
              <ContactCard
                icon={<IconEmail />}
                label="Personal Email"
                value={profile!.personal_email!}
                href={`mailto:${profile!.personal_email}`}
                copyValue={profile!.personal_email!}
                copyLabel="personal email"
              />
            )}

            {hasPhone && (
              <ContactCard
                icon={<IconPhone />}
                label="Phone / WhatsApp"
                value={`+91 ${profile!.phone_number}`}
                href={`tel:+91${profile!.phone_number}`}
                copyValue={`+91${profile!.phone_number}`}
                copyLabel="phone number"
              />
            )}

            {hasGitHub && (
              <ContactCard
                icon={<IconGitHub />}
                label="GitHub"
                value={profile!.github_url!.replace('https://', '')}
                href={profile!.github_url!}
              />
            )}

            {hasLinkedIn && (
              <ContactCard
                icon={<IconLinkedIn />}
                label="LinkedIn"
                value="agamjot-singh-dhingra"
                href={profile!.linkedin_url!}
              />
            )}
          </div>
        )}

        {/* Footer note */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Fast response time (&lt; 24h)
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918" />
            </svg>
            Open to remote &amp; relocation
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            Patiala, Punjab, India
          </span>
        </div>
      </div>
    </section>
  );
};
