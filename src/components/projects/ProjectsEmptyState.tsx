import React, { useEffect, useState } from 'react';

const FULL_TEXT = 'More in the works...';

export const ProjectsEmptyState: React.FC = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const typeNextChar = () => {
      if (currentIndex <= FULL_TEXT.length) {
        setDisplayedText(FULL_TEXT.slice(0, currentIndex));
        currentIndex++;
        timeoutId = setTimeout(typeNextChar, 110);
      } else {
        setIsTypingDone(true);
        // Pause for 4 seconds then gracefully loop the typing effect
        timeoutId = setTimeout(() => {
          setIsTypingDone(false);
          currentIndex = 0;
          setDisplayedText('');
          timeoutId = setTimeout(typeNextChar, 300);
        }, 4000);
      }
    };

    timeoutId = setTimeout(typeNextChar, 400);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400">
        <svg
          className="h-6 w-6 text-emerald-400/80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
          />
        </svg>
      </div>

      <div className="mt-5 flex items-center justify-center font-mono text-base font-medium text-slate-300">
        <span>{displayedText}</span>
        <span
          className={`ml-1 inline-block h-4 w-1.5 rounded-sm bg-emerald-400 transition-opacity ${
            isTypingDone ? 'animate-pulse' : 'opacity-100'
          }`}
          aria-hidden="true"
        />
      </div>

      <p className="mt-2 max-w-sm text-xs text-slate-500">
        Currently polishing several case studies and open-source projects. Check back soon!
      </p>
    </div>
  );
};

