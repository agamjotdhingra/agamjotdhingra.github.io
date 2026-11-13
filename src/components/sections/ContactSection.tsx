import React, { useEffect, useState, useCallback } from 'react';
import { Profile } from '@/types';
import { getProfile } from '@/services/profileService';

const IconEmail: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);

const IconPhone: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
    />
  </svg>
);

const IconGitHub: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

const IconLinkedIn: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.8v8.37h-2.8v-8.37M7.86 6.72a1.63 1.63 0 0 0-1.63 1.62c0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.62-1.63-1.62Z" />
  </svg>
);

const IconCopy: React.FC<{ className?: string }> = ({ className = 'h-3.5 w-3.5' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
    />
  </svg>
);

const IconCheck: React.FC<{ className?: string }> = ({ className = 'h-3.5 w-3.5' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

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
      // silent fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      title={copied ? 'Copied' : `Copy ${label}`}
      className={`rounded-md p-1.5 transition-colors focus:outline-none ${
        copied
          ? 'text-zinc-200 bg-zinc-800'
          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60'
      }`}
    >
      {copied ? <IconCheck /> : <IconCopy />}
    </button>
  );
};

interface ContactRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  copyValue?: string;
  copyLabel?: string;
  badge?: string;
}

const ContactRow: React.FC<ContactRowProps> = ({
  icon,
  label,
  value,
  href,
  copyValue,
  copyLabel,
  badge,
}) => (
  <div className="flex items-center justify-between gap-4 rounded-xl border border-[#1e2026] bg-[#111215] px-4 py-3.5 transition-colors hover:border-zinc-700 sm:px-5">
    <div className="flex items-center gap-3.5 min-w-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#272930] bg-[#15161a] text-zinc-400">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-zinc-400">
            {label}
          </span>
          {badge && (
            <span className="rounded border border-[#2a2d36] bg-[#18191f] px-1.5 py-0.2 text-[10px] text-zinc-400">
              {badge}
            </span>
          )}
        </div>
        <a
          href={href}
          target={href.startsWith('mailto:') || href.startsWith('tel:') ? undefined : '_blank'}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="mt-0.5 block truncate text-xs font-medium text-zinc-200 transition-colors hover:text-white"
        >
          {value}
        </a>
      </div>
    </div>

    {copyValue && copyLabel && (
      <CopyButton value={copyValue} label={copyLabel} />
    )}
  </div>
);

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

  const hasCollegeEmail = Boolean(profile?.college_email?.trim());
  const hasPersonalEmail = Boolean(profile?.personal_email?.trim());
  const hasPhone = Boolean(profile?.phone_number?.trim());
  const hasGitHub = Boolean(profile?.github_url?.trim());
  const hasLinkedIn = Boolean(profile?.linkedin_url?.trim());

  const hasAnyContact = hasCollegeEmail || hasPersonalEmail || hasPhone || hasGitHub || hasLinkedIn;

  return (
    <section id="contact" className="w-full border-t border-[#1c1e24] px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Header & Note */}
          <div className="space-y-4 text-left lg:col-span-5">
            <span className="text-xs font-mono font-medium tracking-wider text-zinc-400 uppercase">
              Contact
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Let&apos;s connect.
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              I am always happy to discuss interesting engineering challenges, software projects, embedded hardware experiments, or potential student internships.
            </p>
            <p className="text-xs leading-relaxed text-zinc-400">
              Based in Patiala, Punjab, India. You can reach out directly via college or personal email, or connect via LinkedIn and GitHub.
            </p>
          </div>

          {/* Contact Directory */}
          <div className="space-y-3 lg:col-span-7">
            {loading && (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 rounded-xl border border-[#1e2026] bg-[#111215]" />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="rounded-xl border border-zinc-800 bg-[#121316] p-6 text-center">
                <p className="text-xs text-zinc-400">{error}</p>
                <button
                  type="button"
                  onClick={fetchProfile}
                  className="mt-3 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-200 hover:text-white"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && hasAnyContact && (
              <>
                {hasCollegeEmail && (
                  <ContactRow
                    icon={<IconEmail />}
                    label="College Email"
                    value={profile!.college_email!}
                    href={`mailto:${profile!.college_email}`}
                    copyValue={profile!.college_email!}
                    copyLabel="college email"
                    badge="TIET Official"
                  />
                )}

                {hasPersonalEmail && (
                  <ContactRow
                    icon={<IconEmail />}
                    label="Personal Email"
                    value={profile!.personal_email!}
                    href={`mailto:${profile!.personal_email}`}
                    copyValue={profile!.personal_email!}
                    copyLabel="personal email"
                  />
                )}

                {hasPhone && (
                  <ContactRow
                    icon={<IconPhone />}
                    label="Phone / WhatsApp"
                    value={`+91 ${profile!.phone_number}`}
                    href={`tel:+91${profile!.phone_number}`}
                    copyValue={`+91${profile!.phone_number}`}
                    copyLabel="phone number"
                  />
                )}

                {hasGitHub && (
                  <ContactRow
                    icon={<IconGitHub />}
                    label="GitHub"
                    value={profile!.github_url!.replace('https://', '')}
                    href={profile!.github_url!}
                  />
                )}

                {hasLinkedIn && (
                  <ContactRow
                    icon={<IconLinkedIn />}
                    label="LinkedIn"
                    value="agamjot-singh-dhingra"
                    href={profile!.linkedin_url!}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};