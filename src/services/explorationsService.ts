import { ExplorationItem } from '@/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const STORAGE_KEY = 'portfolio_cms_explorations';

function getLocalExplorations(): ExplorationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalExplorations(items: ExplorationItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Local storage quota or restricted
  }
}

/**
 * Public facing query: Fetches ONLY published explorations.
 * Starts empty unless the user logs and publishes explorations.
 */
export async function getPublishedExplorations(): Promise<{ items: ExplorationItem[]; error: string | null }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('explorations')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return { items: data as ExplorationItem[], error: null };
      }
    } catch {
      // Fallback
    }
  }

  const local = getLocalExplorations().filter((e) => e.status === 'published');
  return { items: local, error: null };
}

/**
 * Admin facing query: Fetches ALL explorations (drafts + published).
 */
export async function getAllExplorations(): Promise<{ items: ExplorationItem[]; error: string | null }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('explorations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        saveLocalExplorations(data as ExplorationItem[]);
        return { items: data as ExplorationItem[], error: null };
      }
    } catch {
      // Fallback
    }
  }

  return { items: getLocalExplorations(), error: null };
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
 * Creates a new exploration topic.
 */
export async function createExploration(
  exploration: Omit<ExplorationItem, 'id' | 'created_at' | 'updated_at'>
): Promise<{ item: ExplorationItem | null; error: string | null }> {
  const newItem: ExplorationItem = {
    ...exploration,
    id: generateUuid(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('explorations')
        .insert([newItem])
        .select()
        .single();

      if (!error && data) {
        const current = getLocalExplorations();
        saveLocalExplorations([data as ExplorationItem, ...current.filter((e) => e.id !== data.id)]);
        return { item: data as ExplorationItem, error: null };
      }
      if (error) {
        const current = getLocalExplorations();
        saveLocalExplorations([newItem, ...current]);
        return { item: newItem, error: null };
      }
    } catch {
      // Fallback
    }
  }

  const current = getLocalExplorations();
  saveLocalExplorations([newItem, ...current]);
  return { item: newItem, error: null };
}

/**
 * Updates an exploration topic.
 */
export async function updateExploration(
  id: string,
  updates: Partial<ExplorationItem>
): Promise<{ item: ExplorationItem | null; error: string | null }> {
  const payload = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('explorations')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        const current = getLocalExplorations();
        saveLocalExplorations(current.map((e) => (e.id === id ? (data as ExplorationItem) : e)));
        return { item: data as ExplorationItem, error: null };
      }
    } catch {
      // Fallback
    }
  }

  const current = getLocalExplorations();
  let updatedItem: ExplorationItem | null = null;
  const updatedList = current.map((e) => {
    if (e.id === id) {
      updatedItem = { ...e, ...payload };
      return updatedItem;
    }
    return e;
  });

  saveLocalExplorations(updatedList);
  return { item: updatedItem, error: null };
}

/**
 * Deletes an exploration topic permanently.
 */
export async function deleteExploration(id: string): Promise<{ success: boolean; error: string | null }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('explorations')
        .delete()
        .eq('id', id);

      if (!error) {
        const current = getLocalExplorations();
        saveLocalExplorations(current.filter((e) => e.id !== id));
        return { success: true, error: null };
      }
    } catch {
      // Fallback
    }
  }

  const current = getLocalExplorations();
  saveLocalExplorations(current.filter((e) => e.id !== id));
  return { success: true, error: null };
}

