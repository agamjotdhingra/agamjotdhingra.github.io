import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Validates email format. Returns true if valid or empty string. */
function isValidEmail(value: string): boolean {
  if (!value.trim()) return true; // optional field — empty is fine
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Validates URL format. Returns true if valid or empty string. */
function isValidUrl(value: string): boolean {
  if (!value.trim()) return true; // optional field — empty is fine
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

interface FieldError {
  college_email?: string;
  personal_email?: string;
  github_url?: string;
  linkedin_url?: string;
  avatar_url?: string;
}

// ---------------------------------------------------------------------------
// Reusable form field components
// ---------------------------------------------------------------------------

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  error,
  hint,
}) => (
  <div>
    <label htmlFor={id} className="block text-xs font-medium uppercase tracking-wider text-slate-300">
      {label} {required && <span className="text-emerald-400">*</span>}
    </label>
    {hint && <p className="mt-0.5 text-[11px] text-slate-500">{hint}</p>}
    <input
      id={id}
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`mt-2 block w-full rounded-xl border px-4 py-2.5 text-sm text-white bg-slate-950 focus:outline-none focus:border-emerald-500 transition-colors ${
        error ? 'border-red-700' : 'border-slate-700'
      }`}
    />
    {error && <p className="mt-1 text-[11px] text-red-400">{error}</p>}
  </div>
);

// ---------------------------------------------------------------------------
// AdminProfileManager
// ---------------------------------------------------------------------------

export const AdminProfileManager: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});

  // Form state
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  const populateForm = (data: Profile) => {
    setProfile(data);
    setFullName(data.full_name || '');
    setHeadline(data.headline || '');
    setBio(data.bio || '');
    setAvatarUrl(data.avatar_url || '');
    setCollegeEmail(data.college_email || '');
    setPersonalEmail(data.personal_email || '');
    setPhoneNumber(data.phone_number || '');
    setGithubUrl(data.github_url || '');
    setLinkedinUrl(data.linkedin_url || '');
  };

  const fetchProfile = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { data, error: fetchErr } = await supabase
        .from('profile')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (fetchErr) {
        setError(fetchErr.message || 'Failed to load profile.');
      } else if (data) {
        populateForm(data as Profile);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Validate before saving
  const validate = (): boolean => {
    const errors: FieldError = {};

    if (!isValidEmail(collegeEmail)) {
      errors.college_email = 'Enter a valid email address.';
    }
    if (!isValidEmail(personalEmail)) {
      errors.personal_email = 'Enter a valid email address.';
    }
    if (!isValidUrl(githubUrl)) {
      errors.github_url = 'Enter a valid URL (https://...).';
    }
    if (!isValidUrl(linkedinUrl)) {
      errors.linkedin_url = 'Enter a valid URL (https://...).';
    }
    if (!isValidUrl(avatarUrl)) {
      errors.avatar_url = 'Enter a valid URL (https://...).';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (!validate()) return;

    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    const payload = {
      full_name: fullName.trim(),
      headline: headline.trim(),
      bio: bio.trim(),
      avatar_url: avatarUrl.trim() || null,
      college_email: collegeEmail.trim() || null,
      personal_email: personalEmail.trim() || null,
      phone_number: phoneNumber.trim() || null,
      github_url: githubUrl.trim() || null,
      linkedin_url: linkedinUrl.trim() || null,
      updated_at: new Date().toISOString(),
    };

    try {
      const { error: updateErr } = await supabase
        .from('profile')
        .update(payload)
        .eq('id', 1);

      if (updateErr) throw updateErr;

      setSuccessMsg('Profile updated successfully! Changes are immediately live on the portfolio.');
      setTimeout(() => setSuccessMsg(null), 4000);
      fetchProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/40 p-8 animate-pulse">
        <div className="h-6 w-48 rounded bg-slate-800" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-full rounded bg-slate-800" />
        ))}
        <div className="h-28 w-full rounded bg-slate-800" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Profile Editor</h2>
          <p className="text-xs text-slate-400">
            Edit your live profile details stored in{' '}
            <code className="font-mono text-emerald-400">public.profile</code> (id = 1).
          </p>
        </div>
        <button
          type="button"
          onClick={fetchProfile}
          className="rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          Discard / Reset
        </button>
      </div>

      {/* Success Toast */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-400">
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-900/40 bg-red-950/20 px-4 py-3 text-xs text-red-300">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="ml-3 text-red-400 hover:text-red-200">
            &times;
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl sm:p-8 space-y-7" noValidate>

        {/* ── IDENTITY ─────────────────────────────────────────────── */}
        <fieldset className="space-y-5">
          <legend className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Identity
          </legend>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              id="fullName"
              label="Full Name"
              value={fullName}
              onChange={setFullName}
              required
              placeholder="Agamjot Singh Dhingra"
            />
            <InputField
              id="avatarUrl"
              label="Avatar Image URL"
              type="url"
              value={avatarUrl}
              onChange={setAvatarUrl}
              placeholder="https://..."
              error={fieldErrors.avatar_url}
            />
          </div>

          <InputField
            id="headline"
            label="Professional Headline"
            value={headline}
            onChange={setHeadline}
            required
            placeholder="e.g. ENC Undergraduate · Electronics, Software & AI"
          />

          <div>
            <label htmlFor="bio" className="block text-xs font-medium uppercase tracking-wider text-slate-300">
              Bio &amp; Narrative <span className="text-emerald-400">*</span>
            </label>
            <textarea
              id="bio"
              required
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm leading-relaxed text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </fieldset>

        <div className="border-t border-slate-800" />

        {/* ── CONTACT ─────────────────────────────────────────────── */}
        <fieldset className="space-y-5">
          <legend className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Contact Information
          </legend>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              id="collegeEmail"
              label="College Email"
              type="email"
              value={collegeEmail}
              onChange={setCollegeEmail}
              placeholder="adhingra_be25@thapar.edu"
              error={fieldErrors.college_email}
              hint="Shown publicly in the Contact section"
            />
            <InputField
              id="personalEmail"
              label="Personal Email"
              type="email"
              value={personalEmail}
              onChange={setPersonalEmail}
              placeholder="agamjotsdhingra@gmail.com"
              error={fieldErrors.personal_email}
              hint="Shown publicly in the Contact section"
            />
          </div>

          <InputField
            id="phoneNumber"
            label="Phone Number"
            type="tel"
            value={phoneNumber}
            onChange={setPhoneNumber}
            placeholder="7087759597"
            hint="Digits only — country code (+91) is added automatically in the UI"
          />
        </fieldset>

        <div className="border-t border-slate-800" />

        {/* ── SOCIAL LINKS ─────────────────────────────────────────── */}
        <fieldset className="space-y-5">
          <legend className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Social &amp; Professional Links
          </legend>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              id="githubUrl"
              label="GitHub Profile URL"
              type="url"
              value={githubUrl}
              onChange={setGithubUrl}
              placeholder="https://github.com/agamjotdhingra"
              error={fieldErrors.github_url}
            />
            <InputField
              id="linkedinUrl"
              label="LinkedIn Profile URL"
              type="url"
              value={linkedinUrl}
              onChange={setLinkedinUrl}
              placeholder="https://linkedin.com/in/..."
              error={fieldErrors.linkedin_url}
            />
          </div>
        </fieldset>

        {/* ── Submit ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-6">
          <span className="text-[11px] text-slate-500">
            Last Updated:{' '}
            {profile?.updated_at ? new Date(profile.updated_at).toLocaleString() : 'Never'}
          </span>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-semibold text-slate-950 shadow-sm transition-all hover:bg-emerald-400 hover:shadow-emerald-500/20 disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg className="h-3.5 w-3.5 animate-spin text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Profile Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
