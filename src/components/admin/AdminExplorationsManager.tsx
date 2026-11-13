import React, { useEffect, useState, useCallback } from 'react';
import { ExplorationItem, ContentStatus } from '@/types';
import {
  getAllExplorations,
  createExploration,
  updateExploration,
  deleteExploration,
} from '@/services/explorationsService';

interface ExplorationFormData {
  title: string;
  category: string;
  learning_status: string;
  description: string;
  detailed_notes: string;
  status: ContentStatus;
}

const DEFAULT_FORM: ExplorationFormData = {
  title: '',
  category: 'Electronics & Systems',
  learning_status: 'Studying',
  description: '',
  detailed_notes: '',
  status: 'draft',
};

const STATUS_OPTIONS = ['Planning', 'Studying', 'Prototyping', 'Deep Dive', 'Completed'];

export const AdminExplorationsManager: React.FC = () => {
  const [items, setItems] = useState<ExplorationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Editor Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExplorationFormData>(DEFAULT_FORM);

  // Delete Confirmation
  const [itemToDelete, setItemToDelete] = useState<ExplorationItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await getAllExplorations();
    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setItems(res.items);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(DEFAULT_FORM);
    setIsEditorOpen(true);
  };

  const openEditModal = (item: ExplorationItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      category: item.category,
      learning_status: item.learning_status,
      description: item.description,
      detailed_notes: item.detailed_notes,
      status: item.status,
    });
    setIsEditorOpen(true);
  };

  const handleSave = async (targetStatus: ContentStatus) => {
    if (!formData.title.trim()) {
      setErrorMsg('Please enter an exploration topic title.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    const payload = {
      ...formData,
      status: targetStatus,
    };

    if (editingId) {
      const res = await updateExploration(editingId, payload);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        showToast(`Exploration "${formData.title}" ${targetStatus === 'published' ? 'published' : 'saved as draft'}.`);
        setIsEditorOpen(false);
        fetchItems();
      }
    } else {
      const res = await createExploration(payload);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        showToast(`Exploration "${formData.title}" ${targetStatus === 'published' ? 'published' : 'saved as draft'}.`);
        setIsEditorOpen(false);
        fetchItems();
      }
    }
    setSaving(false);
  };

  const handleTogglePublish = async (item: ExplorationItem) => {
    const newStatus: ContentStatus = item.status === 'published' ? 'draft' : 'published';
    const res = await updateExploration(item.id, { status: newStatus });
    if (res.error) {
      setErrorMsg(res.error);
    } else {
      showToast(`Exploration "${item.title}" is now ${newStatus}.`);
      fetchItems();
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    const res = await deleteExploration(itemToDelete.id);
    if (res.error) {
      setErrorMsg(res.error);
    } else {
      showToast(`Exploration "${itemToDelete.title}" permanently deleted.`);
      setItemToDelete(null);
      fetchItems();
    }
    setDeleting(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header & Create Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Currently Exploring CMS</h2>
          <p className="text-xs text-zinc-400">
            Log, update, and publish topics, papers, and technologies you are actively exploring.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center rounded-lg bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-white shrink-0"
        >
          + Add Exploration
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

      {/* List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-xl border border-[#1e2026] bg-[#111215]" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-[#1e2026] bg-[#111215] p-10 text-center">
          <h4 className="text-sm font-medium text-zinc-300">No explorations logged</h4>
          <p className="mt-1 text-xs text-zinc-500">
            Click &ldquo;+ Add Exploration&rdquo; above to document an active topic you are studying.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[#1e2026] bg-[#111215] p-5 transition-colors hover:border-zinc-700"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                  <span className="uppercase text-zinc-300 font-semibold">{item.category}</span>
                  <span>·</span>
                  <span className="rounded bg-[#17181d] px-1.5 py-0.2 text-[10px] text-zinc-300">
                    {item.learning_status}
                  </span>
                  <span>·</span>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[10px] uppercase font-mono ${
                      item.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <h3 className="mt-1 text-sm font-semibold text-zinc-100">{item.title}</h3>
                <p className="mt-1 text-xs text-zinc-400 line-clamp-1">{item.description}</p>
                {item.detailed_notes && (
                  <p className="mt-1 text-[11px] font-mono text-zinc-500 truncate">
                    Notes: {item.detailed_notes}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="rounded-lg border border-[#272930] bg-[#15161a] px-2.5 py-1 text-xs text-zinc-300 hover:text-white"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleTogglePublish(item)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium border ${
                    item.status === 'published'
                      ? 'border-zinc-700 text-zinc-400 hover:text-white'
                      : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                >
                  {item.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  type="button"
                  onClick={() => setItemToDelete(item)}
                  className="rounded-lg border border-red-900/30 p-1.5 text-red-400 hover:bg-red-950/40"
                  aria-label={`Delete ${item.title}`}
                  title="Delete exploration"
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
          <div className="relative z-10 flex max-h-[92vh] w-full max-w-xl flex-col rounded-2xl border border-[#272930] bg-[#101114] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#1c1e24] px-6 py-4">
              <h3 className="text-sm font-semibold text-white">
                {editingId ? 'Edit Exploration' : 'Log New Exploration'}
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
                <label className="block text-xs font-mono uppercase text-zinc-400">Topic Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. RISC-V Pipeline Execution & Branch Prediction"
                  className="mt-1 block w-full rounded-lg border border-[#272930] bg-[#0a0a0c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400">Category / Domain</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Electronics, AI, Systems"
                    className="mt-1 block w-full rounded-lg border border-[#272930] bg-[#0a0a0c] px-3 py-2 text-xs text-white focus:border-zinc-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400">Learning Status</label>
                  <select
                    value={formData.learning_status}
                    onChange={(e) => setFormData({ ...formData, learning_status: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-[#272930] bg-[#0a0a0c] px-3 py-2 text-xs text-white focus:border-zinc-500 focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400">Summary &amp; Context</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What are you studying or attempting to understand?"
                  className="mt-1 block w-full rounded-lg border border-[#272930] bg-[#0a0a0c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400">Detailed Notes &amp; Reading References</label>
                <textarea
                  rows={4}
                  value={formData.detailed_notes}
                  onChange={(e) => setFormData({ ...formData, detailed_notes: e.target.value })}
                  placeholder="Textbooks, lab sheets, research papers, or key progress points..."
                  className="mt-1 block w-full rounded-lg border border-[#272930] bg-[#0a0a0c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 border-t border-[#1c1e24] bg-[#0d0e11] px-6 py-3.5">
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
                Publish Exploration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-black/80" onClick={() => setItemToDelete(null)} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-red-900/40 bg-[#121316] p-6 text-left">
            <h4 className="text-sm font-semibold text-white">Delete Exploration?</h4>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Are you sure you want to delete &ldquo;{itemToDelete.title}&rdquo;? This will remove this learning log entry permanently.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
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
    </div>
  );
};
