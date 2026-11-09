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
      className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8"
    >
      {/* Background Ambient Glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-3xl">
        {/* Loading State Skeleton */}
        {loading && (
          <div className="flex flex-col items-center animate-pulse" role="status" aria-label="Loading profile">
            {/* Badge skeleton */}
            <div className="h-7 w-48 rounded-full bg-slate-800" />

            {/* Title skeleton */}
            <div className="mt-8 h-12 w-3/4 max-w-md rounded-xl bg-slate-800" />

            {/* Headline skeleton */}
            <div className="mt-4 h-7 w-1/2 max-w-xs rounded-lg bg-slate-800/80" />

            {/* Bio skeleton */}
            <div className="mt-6 w-full max-w-2xl space-y-2">
              <div className="h-4.5 w-full rounded bg-slate-800/60" />
              <div className="mx-auto h-4.5 w-5/6 rounded bg-slate-800/60" />
              <div className="mx-auto h-4.5 w-2/3 rounded bg-slate-800/50" />
            </div>

            {/* Buttons skeleton */}
            <div className="mt-10 flex gap-4">
              <div className="h-11 w-36 rounded-xl bg-slate-800" />
              <div className="h-11 w-36 rounded-xl bg-slate-800" />
            </div>

            {/* Socials skeleton */}
            <div className="mt-12 flex gap-4">
              <div className="h-8 w-8 rounded-lg bg-slate-800" />
              <div className="h-8 w-8 rounded-lg bg-slate-800" />
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="mx-auto max-w-md rounded-2xl border border-red-900/40 bg-red-950/20 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-red-800/50 bg-red-900/30 text-red-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 7.5h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-200">Unable to load profile</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">{error}</p>
            <button
              type="button"
              onClick={fetchProfile}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Missing Profile State (No Record with id = 1) */}
        {!loading && !error && !profile && (
          <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900/30 p-8 text-center">
            <h3 className="text-base font-semibold text-slate-300">Profile Not Found</h3>
            <p className="mt-2 text-xs text-slate-500">
              No profile record was found with ID 1 in the database.
            </p>
            <button
              type="button"
              onClick={fetchProfile}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
            >
              Check Again
            </button>
          </div>
        )}

        {/* Dynamic Profile Loaded Successfully */}
        {!loading && !error && profile && (
          <>
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>Available for New Opportunities</span>
            </div>

            {/* Optional Avatar */}
            {profile.avatar_url && profile.avatar_url.trim().length > 0 && (
              <div className="mt-6 flex justify-center">
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="h-24 w-24 rounded-full border-2 border-emerald-500/40 object-cover shadow-lg shadow-emerald-950/30"
                />
              </div>
            )}

            {/* Dynamic Full Name */}
            <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-tight">
              Hi, I&apos;m{' '}
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                {profile.full_name}
              </span>
            </h1>

            {/* Dynamic Headline */}
            <p className="mt-4 text-xl font-medium text-emerald-400 sm:text-2xl">
              {profile.headline}
            </p>

            {/* Dynamic Bio */}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
              {profile.bio}
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <span>View Projects</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-200 backdrop-blur transition-colors hover:border-slate-600 hover:bg-slate-850 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <span>Get in Touch</span>
              </a>
            </div>

            {/* Dynamic Social Links (Rendered only when values exist) */}
            {hasSocials && (
              <div className="mt-12 flex items-center justify-center gap-6 text-slate-400">
                {hasGithub && (
                  <a
                    href={profile.github_url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 transition-colors hover:bg-slate-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    aria-label={`${profile.full_name}'s GitHub Profile`}
                    title="GitHub Profile"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                )}

                {hasLinkedin && (
                  <a
                    href={profile.linkedin_url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 transition-colors hover:bg-slate-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    aria-label={`${profile.full_name}'s LinkedIn Profile`}
                    title="LinkedIn Profile"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.8v8.37h-2.8v-8.37M7.86 6.72a1.63 1.63 0 0 0-1.63 1.62c0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.62-1.63-1.62Z" />
                    </svg>
                  </a>
                )}

                {hasEmail && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="rounded-lg p-2 transition-colors hover:bg-slate-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    aria-label={`Send Email to ${profile.full_name}`}
                    title="Send Email"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
