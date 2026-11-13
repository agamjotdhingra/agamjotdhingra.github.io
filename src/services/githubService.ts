import { GitHubActivityItem } from '@/types';

const FALLBACK_ACTIVITY: GitHubActivityItem[] = [
  {
    id: 'act-1',
    type: 'PushEvent',
    repoName: 'agamjotdhingra/loan-approval',
    repoUrl: 'https://github.com/agamjotdhingra/loan-approval',
    message: 'Add data preprocessing and Streamlit interactive evaluation interface',
    date: 'Recent',
  },
  {
    id: 'act-2',
    type: 'PushEvent',
    repoName: 'agamjotdhingra/agamjotdhingra.github.io',
    repoUrl: 'https://github.com/agamjotdhingra/agamjotdhingra.github.io',
    message: 'Evolve architecture to editorial minimalist engineering portfolio',
    date: 'Recent',
  },
  {
    id: 'act-3',
    type: 'CreateEvent',
    repoName: 'agamjotdhingra/loan-approval',
    repoUrl: 'https://github.com/agamjotdhingra/loan-approval',
    message: 'Initial machine learning classifier experiments comparing Random Forest & Decision Tree',
    date: 'Recent',
  },
];

export async function getGitHubActivity(): Promise<{ items: GitHubActivityItem[]; isLive: boolean }> {
  try {
    const res = await fetch('https://api.github.com/users/agamjotdhingra/events/public?per_page=6', {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!res.ok) {
      return { items: FALLBACK_ACTIVITY, isLive: false };
    }

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return { items: FALLBACK_ACTIVITY, isLive: false };
    }

    interface RawGithubEvent {
      id: string;
      type: string;
      repo: { name: string; url: string };
      created_at: string;
      payload?: {
        commits?: Array<{ message: string }>;
        action?: string;
        ref?: string;
      };
    }

    const items: GitHubActivityItem[] = (data as RawGithubEvent[]).slice(0, 5).map((evt) => {
      let message = 'Repository activity';
      if (evt.payload?.commits && evt.payload.commits.length > 0) {
        message = evt.payload.commits[0].message;
      } else if (evt.payload?.ref) {
        message = `Updated ${evt.payload.ref}`;
      } else if (evt.type === 'WatchEvent') {
        message = 'Starred repository';
      } else if (evt.type === 'ForkEvent') {
        message = 'Forked repository';
      }

      const dateStr = new Date(evt.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      return {
        id: evt.id,
        type: evt.type,
        repoName: evt.repo.name,
        repoUrl: `https://github.com/${evt.repo.name}`,
        message,
        date: dateStr,
      };
    });

    return { items, isLive: true };
  } catch {
    return { items: FALLBACK_ACTIVITY, isLive: false };
  }
}

