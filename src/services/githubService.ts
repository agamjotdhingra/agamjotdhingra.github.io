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

const MAX_ITEMS = 5;

interface RawGithubEvent {
  id: string;
  type: string;
  repo: { name: string; url: string };
  created_at: string;
  payload?: {
    commits?: Array<{ message: string }>;
    action?: string;
    ref?: string;
    ref_type?: string;
    head?: string;
    size?: number;
  };
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const firstLine = (msg: string) => msg.split('\n')[0].trim();

async function fetchCommitMessage(repo: string, sha: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/commits/${sha}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data?.commit?.message === 'string' ? firstLine(data.commit.message) : null;
  } catch {
    return null;
  }
}

export async function getGitHubActivity(): Promise<{ items: GitHubActivityItem[]; isLive: boolean }> {
  try {
    const res = await fetch('https://api.github.com/users/agamjotdhingra/events/public?per_page=30', {
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

    // Stars aren't work; leave them out of the activity log.
    const events = (data as RawGithubEvent[]).filter((evt) => evt.type !== 'WatchEvent');

    // Collapse consecutive pushes to the same repo on the same day into one row.
    type Group = { evt: RawGithubEvent; pushes: number };
    const groups: Group[] = [];
    for (const evt of events) {
      const prev = groups[groups.length - 1];
      if (
        prev &&
        evt.type === 'PushEvent' &&
        prev.evt.type === 'PushEvent' &&
        prev.evt.repo.name === evt.repo.name &&
        formatDate(prev.evt.created_at) === formatDate(evt.created_at)
      ) {
        prev.pushes += 1;
        continue;
      }
      groups.push({ evt, pushes: evt.type === 'PushEvent' ? 1 : 0 });
      if (groups.length >= MAX_ITEMS) break;
    }

    if (groups.length === 0) {
      return { items: FALLBACK_ACTIVITY, isLive: false };
    }

    const items: GitHubActivityItem[] = await Promise.all(
      groups.map(async ({ evt, pushes }) => {
        let message = 'Repository activity';
        if (evt.type === 'PushEvent') {
          const inline = evt.payload?.commits?.[0]?.message;
          const fetched = inline
            ? firstLine(inline)
            : evt.payload?.head
              ? await fetchCommitMessage(evt.repo.name, evt.payload.head)
              : null;
          const suffix = pushes > 1 ? ` (+${pushes - 1} more push${pushes > 2 ? 'es' : ''})` : '';
          message = (fetched ?? `Pushed to ${evt.payload?.ref?.replace('refs/heads/', '') ?? 'repository'}`) + suffix;
        } else if (evt.type === 'CreateEvent') {
          message = evt.payload?.ref_type === 'repository' ? 'Created repository' : `Created ${evt.payload?.ref_type ?? 'ref'}`;
        } else if (evt.type === 'ForkEvent') {
          message = 'Forked repository';
        } else if (evt.payload?.action) {
          message = `${evt.payload.action.charAt(0).toUpperCase()}${evt.payload.action.slice(1)}`;
        }

        return {
          id: evt.id,
          type: evt.type,
          repoName: evt.repo.name,
          repoUrl: `https://github.com/${evt.repo.name}`,
          message,
          date: formatDate(evt.created_at),
        };
      }),
    );

    return { items, isLive: true };
  } catch {
    return { items: FALLBACK_ACTIVITY, isLive: false };
  }
}
