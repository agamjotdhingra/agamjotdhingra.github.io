import React, { useEffect, useState } from 'react';
import { NotebookEntry } from '@/types';
import { getPublishedArticles } from '@/services/notebookService';
import { NotebookArticleModal } from './NotebookArticleModal';

export const NotebookSection: React.FC = () => {
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<NotebookEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getPublishedArticles().then((res) => {
      if (mounted) {
        setEntries(res.entries);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const categories = ['all', ...Array.from(new Set(entries.map((e) => e.category.toLowerCase())))];

  const filteredEntries =
    selectedCategory === 'all'
      ? entries
      : entries.filter((e) => e.category.toLowerCase() === selectedCategory);

  return (
    <>
      <section id="notebook" className="w-full border-t border-[#1c1e24] px-6 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-left">
            <div className="max-w-2xl">
              <span className="text-xs font-mono font-medium tracking-wider text-zinc-400 uppercase">
                Engineering Notebook
              </span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Notes, Experiments &amp; Technical Breakdowns
              </h2>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                A public repository of written reflections documenting engineering challenges, architectural comparisons, and core concepts learned in coursework.
              </p>
            </div>

            {/* Category Filter (rendered only when entries exist) */}
            {categories.length > 2 && (
              <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-[#23252c] bg-[#111215] p-1 font-mono text-xs">
                {categories.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setSelectedCategory(tab)}
                    className={`rounded-lg px-2.5 py-1 transition-colors capitalize ${
                      selectedCategory === tab
                        ? 'bg-zinc-800 text-white font-medium'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {tab === 'all' ? 'All' : tab}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Articles List / Empty State */}
          <div className="mt-12 space-y-4 text-left">
            {loading && (
              <div className="space-y-4 animate-pulse">
                {[1, 2].map((i) => (
                  <div key={i} className="h-28 rounded-2xl border border-[#1e2026] bg-[#111215]" />
                ))}
              </div>
            )}

            {!loading && filteredEntries.length === 0 && (
              <div className="rounded-2xl border border-[#1e2026] bg-[#111215] p-10 text-center">
                <h4 className="text-sm font-medium text-zinc-300">
                  No published articles yet
                </h4>
                <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-zinc-400">
                  Technical notes, project breakdowns, and experiment analyses will be published here as they are written and documented.
                </p>
              </div>
            )}

            {!loading &&
              filteredEntries.map((entry) => (
                <article
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className="group cursor-pointer rounded-2xl border border-[#1e2026] bg-[#111215] p-6 transition-all duration-200 hover:border-zinc-700 hover:bg-[#141519] sm:p-7"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div className="flex items-center gap-2.5 font-mono text-[11px] text-zinc-400 uppercase tracking-wider">
                      <span>{entry.category}</span>
                      <span>·</span>
                      <span>{entry.reading_time}</span>
                    </div>
                    <span className="font-mono text-xs text-zinc-400">
                      {entry.publication_date}
                    </span>
                  </div>

                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-zinc-100 sm:text-xl">
                    {entry.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {entry.description}
                  </p>

                  <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                    <span>Read Article</span>
                    <span className="font-mono text-zinc-400">&rarr;</span>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>

      {/* Reader Modal */}
      {selectedEntry && (
        <NotebookArticleModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </>
  );
};
