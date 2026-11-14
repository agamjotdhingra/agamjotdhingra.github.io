import React, { useEffect, useState } from 'react';
import { GitHubActivityItem } from '@/types';
import { getGitHubActivity } from '@/services/githubService';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Reveal } from '@/components/motion/Reveal';

export const GithubActivitySection: React.FC = () => {
  const [activity, setActivity] = useState<GitHubActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let mounted = true;
    getGitHubActivity().then((res) => {
      if (mounted) {
        setActivity(res.items);
        setIsLive(res.isLive);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="github-activity" className="w-full border-t border-[#16171c] px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index="~"
          label="Activity log"
          title="Open-source & repository commits."
          emphasis={['commits.']}
          badge={
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#272930] px-2 py-0.5 text-[9.5px] normal-case tracking-normal text-zinc-400">
              <span className={`relative h-1.5 w-1.5 rounded-full ${isLive ? 'pulse-dot bg-emerald-400 text-emerald-400' : 'bg-zinc-500'}`} />
              {isLive ? 'Live via GitHub API' : 'Archived feed'}
            </span>
          }
          aside={
            <a
              href="https://github.com/agamjotdhingra"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline font-mono text-xs text-zinc-400 hover:text-white"
            >
              github.com/agamjotdhingra &rarr;
            </a>
          }
        />

        <Reveal className="mt-14 rounded-2xl border border-[#1c1e24] bg-[#0f1013] p-5 sm:p-7">
          {loading && (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="h-4 w-2/3 rounded bg-zinc-800" />
                  <div className="h-4 w-16 rounded bg-zinc-800" />
                </div>
              ))}
            </div>
          )}

          {!loading && activity.length === 0 && (
            <p className="text-xs text-zinc-400 py-4 text-left">No recent public GitHub activity records found.</p>
          )}

          {!loading && activity.length > 0 && (
            <div className="divide-y divide-[#1c1e24] text-left">
              {activity.map((item) => (
                <div key={item.id} className="group flex flex-col justify-between gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <a
                        href={item.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs font-semibold text-zinc-200 hover:text-white transition-colors truncate"
                      >
                        {item.repoName}
                      </a>
                      <span className="rounded bg-[#17181d] px-1.5 py-0.2 font-mono text-[10px] text-zinc-400">
                        {item.type.replace('Event', '')}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-400 truncate">
                      {item.message}
                    </p>
                  </div>
                  <span className="font-mono text-[11px] text-zinc-400 shrink-0">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
};

