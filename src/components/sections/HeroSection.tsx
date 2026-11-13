import React, { useEffect, useState, useCallback } from 'react';
import { Profile } from '@/types';
import { getProfile } from '@/services/profileService';

export const HeroSection: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
      setError(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const hasGithub = Boolean(profile?.github_url && profile.github_url.trim().length > 0);
  const hasLinkedin = Boolean(profile?.linkedin_url && profile.linkedin_url.trim().length > 0);
  const hasEmail = Boolean(profile?.email && profile.email.trim().length > 0);
  const hasSocials = hasGithub || hasLinkedin || hasEmail;

  return (
    <section
      id="hero"
      className="relative w-full px-6 pt-20 pb-24 sm:px-8 sm:pt-28 sm:pb-32"
    >
      <div className="mx-auto max-w-5xl">
        {/* Loading Skeleton */}
        {loading && (
          <div className="max-w-3xl space-y-6 animate-pulse" role="status" aria-label="Loading profile">
            <div className="h-4 w-44 rounded bg-zinc-800" />
            <div className="h-14 w-3/4 rounded-lg bg-zinc-800" />
            <div className="h-6 w-1/2 rounded bg-zinc-850" />
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full rounded bg-zinc-850" />
              <div className="h-4 w-5/6 rounded bg-zinc-850" />
            </div>
            <div className="flex gap-4 pt-4">
              <div className="h-10 w-32 rounded-full bg-zinc-800" />
              <div className="h-10 w-32 rounded-full bg-zinc-850" />
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
          <div className="max-w-3xl space-y-8 text-left">
            {/* Identity Subhead */}
            <div className="flex items-center gap-3 text-xs tracking-wide text-zinc-400">
              <span className="font-mono font-medium text-zinc-400">
                ENC · Thapar Institute of Engineering and Technology
              </span>
              <span className="h-1 w-1 rounded-full bg-zinc-600" />
              <span className="font-mono text-zinc-400">2025–2029</span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl sm:leading-[1.12]">
                Agamjot Singh Dhingra
              </h1>
              <p className="mt-4 text-xl font-normal text-zinc-400 sm:text-2xl sm:leading-relaxed font-editorial italic">
                {profile.headline || 'Electronics and Computer Engineering student exploring software, hardware systems, and artificial intelligence.'}
              </p>
            </div>

            {/* Authentic Narrative Bio */}
            <p className="max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg sm:leading-relaxed">
              {profile.bio}
            </p>

            {/* Action Links & Socials */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-full bg-zinc-100 px-5 py-2.5 text-xs font-medium text-zinc-950 transition-colors hover:bg-white"
              >
                Selected Projects
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-zinc-700 bg-transparent px-5 py-2.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
              >
                Contact
              </a>

              {hasSocials && (
                <div className="flex items-center gap-4 pl-2 text-xs text-zinc-400">
                  {hasGithub && (
                    <a
                      href={profile.github_url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-zinc-200"
                    >
                      GitHub
                    </a>
                  )}
                  {hasLinkedin && (
                    <a
                      href={profile.linkedin_url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-zinc-200"
                    >
                      LinkedIn
                    </a>
                  )}
                  {hasEmail && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="transition-colors hover:text-zinc-200"
                    >
                      Email
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};