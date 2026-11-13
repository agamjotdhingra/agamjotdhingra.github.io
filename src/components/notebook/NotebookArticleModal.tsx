import React, { useEffect } from 'react';
import { NotebookEntry } from '@/types';

interface NotebookArticleModalProps {
  entry: NotebookEntry | null;
  onClose: () => void;
}

export const NotebookArticleModal: React.FC<NotebookArticleModalProps> = ({ entry, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (entry) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [entry, onClose]);

  if (!entry) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-[#272930] bg-[#0f1013] shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#1c1e24] px-6 py-5 sm:px-8">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
              <span className="uppercase">{entry.category}</span>
              <span>·</span>
              <span>{entry.publication_date}</span>
              <span>·</span>
              <span>{entry.reading_time}</span>
            </div>
            <h2 id="article-title" className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {entry.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors shrink-0"
            aria-label="Close article"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Article Body */}
        <div className="overflow-y-auto px-6 py-8 sm:px-8 space-y-6 text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
          {/* Summary Callout */}
          {entry.description && (
            <div className="rounded-xl border border-[#23252c] bg-[#141519] p-4 text-sm text-zinc-300 font-editorial italic text-base">
              {entry.description}
            </div>
          )}

          {/* Formatted Content */}
          <div className="space-y-4">
            {entry.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="pt-4 text-base font-semibold text-white tracking-tight">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
                const items = paragraph.split('\n');
                return (
                  <ul key={idx} className="space-y-1.5 pl-4 list-disc text-sm text-zinc-300">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        {item.replace(/^[0-9]+\.\s+/, '').replace(/^-\s+/, '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-zinc-300 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#1c1e24] bg-[#0a0a0c]/60 px-6 py-3.5 sm:px-8 text-xs font-mono text-zinc-400">
          <span>Agamjot Singh Dhingra · TIET</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-zinc-200 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
