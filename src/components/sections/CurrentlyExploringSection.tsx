import React, { useEffect, useState } from 'react';
import { ExplorationItem } from '@/types';
import { getPublishedExplorations } from '@/services/explorationsService';

export const CurrentlyExploringSection: React.FC = () => {
  const [items, setItems] = useState<ExplorationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getPublishedExplorations().then((res) => {
      if (mounted) {
        setItems(res.items);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="exploring" className="w-full border-t border-[#1c1e24] px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl text-left">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium tracking-wider text-zinc-400 uppercase">
              Learning Log
            </span>
            <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-300">
              In Progress
            </span>
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Currently Exploring
          </h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            A transparent record of concepts, papers, and technologies I am actively studying. These are distinct from production experience—they represent genuine intellectual curiosity and ongoing undergraduate coursework.
          </p>
        </div>

        {loading && (
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 rounded-2xl border border-[#1e2026] bg-[#111215]" />
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="mt-12 rounded-2xl border border-[#1e2026] bg-[#111215] p-10 text-center">
            <h4 className="text-sm font-medium text-zinc-300">
              No exploration logs recorded yet
            </h4>
            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-zinc-400">
              Active learning topics, coursework experiments, and research papers currently being studied will appear here once logged.
            </p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-[#1e2026] bg-[#111215] p-6 text-left transition-colors hover:border-zinc-700"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                      {item.category}
                    </span>
                    <span className="rounded border border-[#272930] bg-[#17181d] px-2 py-0.5 font-mono text-[10px] text-zinc-300">
                      {item.learning_status}
                    </span>
                  </div>

                  <h3 className="mt-2.5 text-base font-medium text-zinc-100">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                    {item.description}
                  </p>
                </div>

                {item.detailed_notes && (
                  <div className="mt-5 border-t border-[#1c1e24] pt-3 text-[11px] text-zinc-400 font-mono">
                    <span className="text-zinc-500">Notes / References: </span>
                    <span className="text-zinc-300">{item.detailed_notes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
