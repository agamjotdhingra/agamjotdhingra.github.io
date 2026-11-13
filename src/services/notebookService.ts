import { NotebookEntry } from '@/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const STORAGE_KEY = 'portfolio_cms_notebook_entries';

function getLocalEntries(): NotebookEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalEntries(entries: NotebookEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Local storage quota or restricted
  }
}

/**
 * Public facing query: Fetches ONLY published notebook articles.
 * Starts empty unless the user creates and publishes articles.
 */
export async function getPublishedArticles(): Promise<{ entries: NotebookEntry[]; error: string | null }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('notebook_entries')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return { entries: data as NotebookEntry[], error: null };
      }
    } catch {
      // Fallback to local published entries
    }
  }

  const local = getLocalEntries().filter((e) => e.status === 'published');
  return { entries: local, error: null };
}

/**
 * Admin facing query: Fetches ALL notebook articles (drafts + published).
 */
export async function getAllArticles(): Promise<{ entries: NotebookEntry[]; error: string | null }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('notebook_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Cache locally for offline resiliency
        saveLocalEntries(data as NotebookEntry[]);
        return { entries: data as NotebookEntry[], error: null };
      }
    } catch {
      // Fallback to local
    }
  }

  return { entries: getLocalEntries(), error: null };
}

function generateUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Creates a new article (draft or published).
 */
export async function createArticle(
  article: Omit<NotebookEntry, 'id' | 'created_at' | 'updated_at'>
): Promise<{ entry: NotebookEntry | null; error: string | null }> {
  const newEntry: NotebookEntry = {
    ...article,
    id: generateUuid(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('notebook_entries')
        .insert([newEntry])
        .select()
        .single();

      if (!error && data) {
        const current = getLocalEntries();
        saveLocalEntries([data as NotebookEntry, ...current.filter((e) => e.id !== data.id)]);
        return { entry: data as NotebookEntry, error: null };
      }
      if (error) {
        // Table might not exist yet before migration is run in Supabase SQL editor
        const current = getLocalEntries();
        saveLocalEntries([newEntry, ...current]);
        return { entry: newEntry, error: null };
      }
    } catch {
      // Fallback to local persistence
    }
  }

  const current = getLocalEntries();
  saveLocalEntries([newEntry, ...current]);
  return { entry: newEntry, error: null };
}

/**
 * Updates an existing article.
 */
export async function updateArticle(
  id: string,
  updates: Partial<NotebookEntry>
): Promise<{ entry: NotebookEntry | null; error: string | null }> {
  const payload = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('notebook_entries')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        const current = getLocalEntries();
        saveLocalEntries(current.map((e) => (e.id === id ? (data as NotebookEntry) : e)));
        return { entry: data as NotebookEntry, error: null };
      }
    } catch {
      // Fallback
    }
  }

  const current = getLocalEntries();
  let updatedItem: NotebookEntry | null = null;
  const updatedList = current.map((e) => {
    if (e.id === id) {
      updatedItem = { ...e, ...payload };
      return updatedItem;
    }
    return e;
  });

  saveLocalEntries(updatedList);
  return { entry: updatedItem, error: null };
}

/**
 * Deletes an article permanently.
 */
export async function deleteArticle(id: string): Promise<{ success: boolean; error: string | null }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('notebook_entries')
        .delete()
        .eq('id', id);

      if (!error) {
        const current = getLocalEntries();
        saveLocalEntries(current.filter((e) => e.id !== id));
        return { success: true, error: null };
      }
    } catch {
      // Fallback
    }
  }

  const current = getLocalEntries();
  saveLocalEntries(current.filter((e) => e.id !== id));
  return { success: true, error: null };
}
