import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types';
import { normalizeTechStack } from '@/utils/formatters';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Validates URL format. Returns error message or null. */
function validateUrl(value: string, label: string): string | null {
  if (!value.trim()) return null; // optional
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return `${label} must start with http:// or https://`;
    }
    return null;
  } catch {
    return `${label} is not a valid URL.`;
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProjectFormData {
  id?: string | number;
  title: string;
  description: string;
  tech_stack_input: string;
  github_url: string;
  live_url: string;
  is_published: boolean;
  display_order: string; // kept as string for input; converted to number on save
}

interface FormFieldErrors {
  github_url?: string;
  live_url?: string;
}

const INITIAL_FORM: ProjectFormData = {
  title: '',
  description: '',
  tech_stack_input: '',
  github_url: '',
  live_url: '',
  is_published: true,
  display_order: '0',
};

// ---------------------------------------------------------------------------
// AdminProjectsManager
// ---------------------------------------------------------------------------

export const AdminProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormFieldErrors>({});

  // Delete confirmation state
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ---------------------------------------------------------------------------
  // Data fetching — ordered by display_order, then created_at desc
  // ---------------------------------------------------------------------------

  const fetchAllProjects = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchErr } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (fetchErr) {
        setError(fetchErr.message || 'Failed to load projects.');
      } else {
        setProjects((data as Project[]) || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  // ---------------------------------------------------------------------------
  // Modal helpers
  // ---------------------------------------------------------------------------

  const handleOpenCreate = () => {
    setFormData(INITIAL_FORM);
    setIsEditing(false);
    setModalError(null);
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    const tags = normalizeTechStack(project.tech_stack);
    setFormData({
      id: project.id,
      title: project.title,
      description: project.description,
      tech_stack_input: tags.join(', '),
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      is_published: Boolean(project.is_published),
      display_order: String(project.display_order ?? 0),
    });
    setIsEditing(true);
    setModalError(null);
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFieldErrors({});
    setModalError(null);
  };

  // ---------------------------------------------------------------------------
  // Quick publish toggle
  // ---------------------------------------------------------------------------

  const handleTogglePublish = async (project: Project) => {
    if (!supabase || !project.id) return;
    const newStatus = !project.is_published;

    try {
      const { error: updateErr } = await supabase
        .from('projects')
        .update({ is_published: newStatus })
        .eq('id', project.id);

      if (updateErr) {
        setError(`Failed to update status: ${updateErr.message}`);
      } else {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, is_published: newStatus } : p))
        );
        showSuccess(`"${project.title}" is now ${newStatus ? 'Published' : 'Draft'}.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed.');
    }
  };

  // ---------------------------------------------------------------------------
  // Display order update (inline, arrows)
  // ---------------------------------------------------------------------------

  const handleMoveOrder = async (project: Project, direction: 'up' | 'down') => {
    if (!supabase || !project.id) return;

    const currentIndex = projects.findIndex((p) => p.id === project.id);
    if (currentIndex === -1) return;

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (swapIndex < 0 || swapIndex >= projects.length) return;

    const other = projects[swapIndex];
    if (!other.id) return;

    const currentOrder = project.display_order ?? currentIndex;
    const otherOrder = other.display_order ?? swapIndex;

    try {
      const { error: e1 } = await supabase
        .from('projects')
        .update({ display_order: otherOrder })
        .eq('id', project.id);

      const { error: e2 } = await supabase
        .from('projects')
        .update({ display_order: currentOrder })
        .eq('id', other.id);

      if (e1 || e2) {
        setError('Failed to update display order.');
      } else {
        // Optimistic UI update
        const updated = [...projects];
        updated[currentIndex] = { ...project, display_order: otherOrder };
        updated[swapIndex] = { ...other, display_order: currentOrder };
        // Re-sort by display_order
        updated.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
        setProjects(updated);
        showSuccess(`Display order updated.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Order update failed.');
    }
  };

  // ---------------------------------------------------------------------------
  // Save project (create or update)
  // ---------------------------------------------------------------------------

  const validateForm = (): boolean => {
    const errors: FormFieldErrors = {};
    const ghErr = validateUrl(formData.github_url, 'GitHub URL');
    const liveErr = validateUrl(formData.live_url, 'Live Demo URL');
    if (ghErr) errors.github_url = ghErr;
    if (liveErr) errors.live_url = liveErr;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (!validateForm()) return;

    setSubmitting(true);
    setModalError(null);

    const techStackArray = formData.tech_stack_input
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const displayOrderNum = parseInt(formData.display_order, 10);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      tech_stack: techStackArray,
      github_url: formData.github_url.trim() || null,
      live_url: formData.live_url.trim() || null,
      is_published: formData.is_published,
      display_order: isNaN(displayOrderNum) ? 0 : displayOrderNum,
    };

    try {
      if (isEditing && formData.id) {
        const { error: updateErr } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', formData.id);

        if (updateErr) throw updateErr;
        showSuccess(`"${payload.title}" updated successfully.`);
      } else {
        const { error: insertErr } = await supabase.from('projects').insert([payload]);
        if (insertErr) throw insertErr;
        showSuccess(`"${payload.title}" created successfully.`);
      }

      handleCloseModal();
      fetchAllProjects();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to save project.');
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Delete project
  // ---------------------------------------------------------------------------

  const handleConfirmDelete = async () => {
    if (!supabase || !projectToDelete?.id) return;
    setDeleting(true);

    try {
      const { error: delErr } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectToDelete.id);

      if (delErr) {
        setError(`Failed to delete: ${delErr.message}`);
      } else {
        setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
        showSuccess(`"${projectToDelete.title}" deleted.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
    } finally {
      setDeleting(false);
      setProjectToDelete(null);
    }
  };

  // ---------------------------------------------------------------------------
  // Form field setter helper
  // ---------------------------------------------------------------------------

  const setField = <K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear field-level error on change
    if (key === 'github_url' || key === 'live_url') {
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const publishedCount = projects.filter((p) => p.is_published).length;
  const draftCount = projects.filter((p) => !p.is_published).length;

  return (
    <div className="space-y-6">
      {/* ── Top Controls ────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Projects Manager</h2>
          <p className="text-xs text-slate-400">
            Total: {projects.length} &bull; Published:{' '}
            <span className="text-emerald-400">{publishedCount}</span> &bull; Drafts:{' '}
            <span className="text-amber-400">{draftCount}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-sm transition-all hover:bg-emerald-400 hover:shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add New Project</span>
        </button>
      </div>

      {/* ── Notifications ───────────────────────────────────────── */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-400">
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-900/40 bg-red-950/20 px-4 py-3 text-xs text-red-300">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 7.5h.008v.008H12v-.008z" />
            </svg>
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError(null)} className="text-red-400 hover:text-red-200">
            &times;
          </button>
        </div>
      )}

      {/* ── Projects List ────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 rounded-2xl border border-slate-800 bg-slate-900/30 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/20 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 text-emerald-400">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <h3 className="mt-4 text-base font-semibold text-white">No projects yet</h3>
          <p className="mt-1 text-xs text-slate-400">Create your first showcase project.</p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map((project, index) => {
            const tags = normalizeTechStack(project.tech_stack);
            const isFirst = index === 0;
            const isLast = index === projects.length - 1;

            return (
              <div
                key={project.id ?? project.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition-all hover:border-slate-700 hover:bg-slate-900/70"
              >
                <div>
                  {/* Status badge + Edit/Delete controls */}
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(project)}
                      title="Click to toggle published status"
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        project.is_published
                          ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          : 'border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${project.is_published ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <span>{project.is_published ? 'Published' : 'Draft'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {/* Move Up */}
                      <button
                        type="button"
                        disabled={isFirst}
                        onClick={() => handleMoveOrder(project, 'up')}
                        title="Move up in display order"
                        className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                        </svg>
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        disabled={isLast}
                        onClick={() => handleMoveOrder(project, 'down')}
                        title="Move down in display order"
                        className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(project)}
                        title="Edit Project"
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                        </svg>
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => setProjectToDelete(project)}
                        title="Delete Project"
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-950/40 hover:text-red-400"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Title & description */}
                  <h3 className="mt-3 text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-slate-400">
                    {project.description}
                  </p>
                </div>

                {/* Footer: tags + links + order badge */}
                <div className="mt-4 border-t border-slate-800/60 pt-3">
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag, idx) => (
                        <span
                          key={`${tag}-${idx}`}
                          className="rounded bg-slate-950 px-2 py-0.5 font-mono text-[10px] text-emerald-400/90 border border-slate-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-slate-300 transition-colors"
                        >
                          GitHub ↗
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-emerald-400 transition-colors"
                        >
                          Live ↗
                        </a>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-600">
                      order: {project.display_order ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── CREATE / EDIT MODAL ────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {isEditing ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button type="button" onClick={handleCloseModal} className="text-slate-400 hover:text-white text-xl leading-none">
                &times;
              </button>
            </div>

            {modalError && (
              <div className="mt-4 rounded-xl border border-red-900/40 bg-red-950/20 p-3 text-xs text-red-300">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveProject} className="mt-5 space-y-4" noValidate>
              {/* Title */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                  Project Title <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setField('title', e.target.value)}
                  placeholder="e.g. Distributed Task Queue"
                  className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                  Description <span className="text-emerald-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setField('description', e.target.value)}
                  placeholder="Summarize the project's purpose, architecture and outcome..."
                  className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                  Tech Stack <span className="text-slate-500 normal-case font-normal">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={formData.tech_stack_input}
                  onChange={(e) => setField('tech_stack_input', e.target.value)}
                  placeholder="React, TypeScript, Node.js, PostgreSQL"
                  className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                    GitHub URL <span className="text-slate-500 normal-case font-normal">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setField('github_url', e.target.value)}
                    placeholder="https://github.com/..."
                    className={`mt-1 block w-full rounded-xl border px-3.5 py-2.5 text-sm text-white bg-slate-950 focus:outline-none focus:border-emerald-500 ${
                      fieldErrors.github_url ? 'border-red-700' : 'border-slate-700'
                    }`}
                  />
                  {fieldErrors.github_url && (
                    <p className="mt-1 text-[11px] text-red-400">{fieldErrors.github_url}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                    Live Demo URL <span className="text-slate-500 normal-case font-normal">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.live_url}
                    onChange={(e) => setField('live_url', e.target.value)}
                    placeholder="https://example.com"
                    className={`mt-1 block w-full rounded-xl border px-3.5 py-2.5 text-sm text-white bg-slate-950 focus:outline-none focus:border-emerald-500 ${
                      fieldErrors.live_url ? 'border-red-700' : 'border-slate-700'
                    }`}
                  />
                  {fieldErrors.live_url && (
                    <p className="mt-1 text-[11px] text-red-400">{fieldErrors.live_url}</p>
                  )}
                </div>
              </div>

              {/* Display Order + Publish */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.display_order}
                    onChange={(e) => setField('display_order', e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">Lower = shown first on portfolio</p>
                </div>

                <div className="flex flex-col justify-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      id="modal-is-published"
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setField('is_published', e.target.checked)}
                      className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-medium text-slate-300">Publish immediately</span>
                  </label>
                  <p className="mt-1 ml-6 text-[11px] text-slate-500">Visible to public visitors</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-750 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ─────────────────────────────── */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-red-900/40 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white">Delete Project</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              Are you sure you want to delete{' '}
              <strong className="text-white">&quot;{projectToDelete.title}&quot;</strong>?{' '}
              This action cannot be undone and will immediately remove the project from your public portfolio.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-750 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50 transition-colors"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
