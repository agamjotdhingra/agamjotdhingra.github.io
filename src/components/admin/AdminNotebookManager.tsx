import React, { useEffect, useState, useCallback } from 'react';
import { NotebookEntry, ContentStatus } from '@/types';
import {
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from '@/services/notebookService';
import { NotebookArticleModal } from '@/components/notebook/NotebookArticleModal';

interface ArticleFormData {
  title: string;
  slug: string;
  category: string;
  publication_date: string;
  reading_time: string;
  description: string;
  content: string;
  status: ContentStatus;
}

const DEFAULT_FORM: ArticleFormData = {
  title: '',
  slug: '',
  category: 'Software Engineering',
  publication_date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  reading_time: '4 min read',
  description: '',
  content: '',
  status: 'draft',
};

export const AdminNotebookManager: React.FC = () => {
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ArticleFormData>(DEFAULT_FORM);

  // Preview Modal State
  const [previewEntry, setPreviewEntry] = useState<NotebookEntry | null>(null);

  // Delete Confirmation State
  const [entryToDelete, setEntryToDelete] = useState<NotebookEntry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const res = await getAllArticles();
    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setEntries(res.entries);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      ...DEFAULT_FORM,
      publication_date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    });
    setIsEditorOpen(true);
  };

  const openEditModal = (entry: NotebookEntry) => {
    setEditingId(entry.id);
    setFormData({
      title: entry.title,
      slug: entry.slug,
      category: entry.category,
      publication_date: entry.publication_date,
      reading_time: entry.reading_time,
      description: entry.description,
      content: entry.content,
      status: entry.status,
    });
    setIsEditorOpen(true);
  };

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData((prev) => ({ ...prev, title: val, slug }));
  };

  const handleSave = async (targetStatus: ContentStatus) => {
    if (!formData.title.trim()) {
      setErrorMsg('Please enter an article title.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    const payload = {
      ...formData,
      status: targetStatus,
    };

    if (editingId) {
      const res = await updateArticle(editingId, payload);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        showToast(`Article "${formData.title}" ${targetStatus === 'published' ? 'published' : 'saved as draft'}.`);
        setIsEditorOpen(false);
        fetchArticles();
      }
    } else {
      const res = await createArticle(payload);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        showToast(`Article "${formData.title}" ${targetStatus === 'published' ? 'published' : 'saved as draft'}.`);
        setIsEditorOpen(false);
        fetchArticles();
      }
    }
    setSaving(false);
  };

  const handleTogglePublish = async (entry: NotebookEntry) => {
    const newStatus: ContentStatus = entry.status === 'published' ? 'draft' : 'published';
    const res = await updateArticle(entry.id, { status: newStatus });
    if (res.error) {
      setErrorMsg(res.error);
    } else {
      showToast(`Article "${entry.title}" is now ${newStatus}.`);
      fetchArticles();
    }
  };

  const handleDelete = async () => {
    if (!entryToDelete) return;
    setDeleting(true);
    const res = await deleteArticle(entryToDelete.id);
    if (res.error) {
      setErrorMsg(res.error);
    } else {
      showToast(`Article "${entryToDelete.title}" permanently deleted.`);
      setEntryToDelete(null);
      fetchArticles();
    }
    setDeleting(false);
  };

  const handlePreviewCurrent = () => {
    setPreviewEntry({
      id: editingId || 'preview-temp',
      ...formData,
    });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header & Create Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Engineering Notebook CMS</h2>
          <p className="text-xs text-zinc-400">
            Create, edit, draft, and publish technical articles and experiment logs.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center rounded-lg bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-white shrink-0"
        >
          + Create New Article
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-400">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-2.5 text-xs text-red-300">
          {errorMsg}
        </div>
      )}

      {/* Article List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-xl border border-[#1e2026] bg-[#111215]" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-2xl border border-[#1e2026] bg-[#111215] p-10 text-center">
          <h4 className="text-sm font-medium text-zinc-300">No articles in the notebook</h4>
          <p className="mt-1 text-xs text-zinc-500">
            Click &ldquo;Create New Article&rdquo; above to write your first technical breakdown.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[#1e2026] bg-[#111215] p-5 transition-colors hover:border-zinc-700"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                  <span className="uppercase text-zinc-300 font-semibold">{entry.category}</span>
                  <span>·</span>
                  <span>{entry.publication_date}</span>
                  <span>·</span>
                  <span>{entry.reading_time}</span>
                  <span>·</span>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[10px] uppercase font-mono ${
                      entry.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {entry.status}
                  </span>
                </div>
                <h3 className="mt-1 text-sm font-semibold text-zinc-100">{entry.title}</h3>
                <p className="mt-1 text-xs text-zinc-400 line-clamp-1">{entry.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                <button
                  type="button"
                  onClick={() => setPreviewEntry(entry)}
                  className="rounded-lg border border-[#272930] bg-[#15161a] px-2.5 py-1 text-xs text-zinc-300 hover:text-white"
                  title="Preview article"
                >
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => openEditModal(entry)}
                  className="rounded-lg border border-[#272930] bg-[#15161a] px-2.5 py-1 text-xs text-zinc-300 hover:text-white"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleTogglePublish(entry)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium border ${
                    entry.status === 'published'
                      ? 'border-zinc-700 text-zinc-400 hover:text-white'
                      : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                >
                  {entry.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  type="button"
                  onClick={() => setEntryToDelete(entry)}
                  className="rounded-lg border border-red-900/30 p-1.5 text-red-400 hover:bg-red-950/40"
                  aria-label={`Delete ${entry.title}`}
                  title="Delete article"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditorOpen(false)} />
          <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col rounded-2xl border border-[#272930] bg-[#101114] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#1c1e24] px-6 py-4">
              <h3 className="text-sm font-semibold text-white">
                {editingId ? 'Edit Article' : 'Create New Article'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Evaluating Classifier Behavior on Imbalanced Distributions"
                  className="mt-1 block w-full rounded-lg border border-[#272930] bg-[#0a0a0c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400">Category / Domain</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Electronics, AI, Software"
                    className="mt-1 block w-full rounded-lg border border-[#272930] bg-[#0a0a0c] px-3 py-2 text-xs text-white focus:border-zinc-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400">Publication Date</label>
                  <input
                    type="text"
                    value={formData.publication_date}
                    onChange={(e) => setFormData({ ...formData, publication_date: e.target.value })}
                    placeholder="e.g. Nov 2024"
                    className="mt-1 block w-full rounded-lg border border-[#272930] bg-[#0a0a0c] px-3 py-2 text-xs text-white focus:border-zinc-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400">Reading Time</label>
                  <input
                    type="text"
                    value={formData.reading_time}
                    onChange={(e) => setFormData({ ...formData, reading_time: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="mt-1 block w-full rounded-lg border border-[#272930] bg-[#0a0a0c] px-3 py-2 text-xs text-white focus:border-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400">Short Summary / Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief 1-2 sentence overview shown in notebook feeds"
                  className="mt-1 block w-full rounded-lg border border-[#272930] bg-[#0a0a0c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400">Full Article Content</label>
                <p className="text-[11px] text-zinc-500 mb-1">Supports Markdown headers (###), bullet lists, and paragraphs.</p>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write full article body here..."
                  className="mt-1 block w-full rounded-lg border border-[#272930] bg-[#0a0a0c] px-3.5 py-2.5 font-mono text-xs text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between border-t border-[#1c1e24] bg-[#0d0e11] px-6 py-3.5">
              <button
                type="button"
                onClick={handlePreviewCurrent}
                disabled={!formData.title}
                className="text-xs text-zinc-400 hover:text-white disabled:opacity-40"
              >
                Preview Draft
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="rounded-lg border border-[#272930] bg-[#15161a] px-3 py-1.5 text-xs text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave('draft')}
                  className="rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 text-xs font-medium text-zinc-200 hover:text-white disabled:opacity-50"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave('published')}
                  className="rounded-lg bg-zinc-100 px-4 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-white disabled:opacity-50"
                >
                  Publish Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {entryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-black/80" onClick={() => setEntryToDelete(null)} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-red-900/40 bg-[#121316] p-6 text-left">
            <h4 className="text-sm font-semibold text-white">Delete Article?</h4>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Are you sure you want to permanently delete &ldquo;{entryToDelete.title}&rdquo;? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEntryToDelete(null)}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Preview Modal */}
      {previewEntry && (
        <NotebookArticleModal
          entry={previewEntry}
          onClose={() => setPreviewEntry(null)}
        />
      )}
    </div>
  );
};
