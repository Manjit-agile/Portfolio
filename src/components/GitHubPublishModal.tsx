import { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  GitBranch,
  Lock,
  LogOut,
  Terminal,
  UploadCloud,
  X,
} from 'lucide-react';
import type {
  GitHubPublishResult,
  GitHubStatusResponse,
} from '../types/portfolio';

interface GitHubPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: GitHubStatusResponse | null;
  statusLoading: boolean;
  onRefreshStatus: () => Promise<void>;
}

const DEFAULT_REPO_NAME = 'manjit-kaur-portfolio';
const DEFAULT_DESCRIPTION =
  'Senior Frontend Engineer & UI Technical Lead portfolio built with React, TypeScript, Tailwind CSS, and Express.';

export function GitHubPublishModal({
  isOpen,
  onClose,
  status,
  statusLoading,
  onRefreshStatus,
}: GitHubPublishModalProps) {
  const [repoName, setRepoName] = useState(DEFAULT_REPO_NAME);
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [isPrivate, setIsPrivate] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [publishResult, setPublishResult] =
    useState<GitHubPublishResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<'callback' | 'git' | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const callbackUrl =
    status?.callbackUrl || `${window.location.origin}/auth/callback`;

  const gitCliSnippet = [
    'git init -b main',
    'git add .',
    'git commit -m "Initial portfolio website"',
    `git remote add origin https://github.com/<your-username>/${repoName.trim() || DEFAULT_REPO_NAME}.git`,
    'git push -u origin main',
  ].join('\n');

  const handleCopy = async (text: string, key: 'callback' | 'git') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      setErrorMessage('Clipboard copy failed. Please select and copy manually.');
    }
  };

  const handleConnectGitHub = async () => {
    setErrorMessage(null);
    setConnecting(true);
    try {
      const response = await fetch('/api/auth/github/url');
      const payload = (await response.json()) as {
        url?: string;
        error?: string;
      };
      if (!response.ok || !payload.url) {
        setErrorMessage(
          payload.error || 'Unable to start GitHub OAuth flow.'
        );
        return;
      }

      const authWindow = window.open(
        payload.url,
        'oauth_popup',
        'width=620,height=720'
      );
      if (!authWindow) {
        setErrorMessage(
          'Popup was blocked by your browser. Allow popups for this site and try again.'
        );
      }
    } catch {
      setErrorMessage('Network error while contacting the OAuth endpoint.');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setErrorMessage(null);
    setPublishResult(null);
    setDisconnecting(true);
    try {
      await fetch('/api/github/disconnect', { method: 'POST' });
      await onRefreshStatus();
    } catch {
      setErrorMessage('Failed to disconnect GitHub session.');
    } finally {
      setDisconnecting(false);
    }
  };

  const handlePublish = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setPublishResult(null);

    const trimmed = repoName.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a repository name.');
      return;
    }
    if (!/^[A-Za-z0-9._-]+$/.test(trimmed)) {
      setErrorMessage(
        'Repository name may only contain letters, numbers, hyphens, underscores, or periods.'
      );
      return;
    }

    setPublishing(true);
    try {
      const response = await fetch('/api/github/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoName: trimmed,
          description: description.trim(),
          isPrivate,
        }),
      });
      const payload = (await response.json()) as
        | GitHubPublishResult
        | { error?: string };

      if (!response.ok || !('repoUrl' in payload)) {
        setErrorMessage(
          ('error' in payload && payload.error) ||
            'Failed to create and push repository to GitHub.'
        );
        return;
      }

      setPublishResult(payload);
      await onRefreshStatus();
    } catch {
      setErrorMessage('Network error while publishing to GitHub.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="github-publish-modal-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0b1830] p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-blue-700 dark:text-emerald-300">
              <GitBranch className="h-3.5 w-3.5" />
              <span>GitHub Integration</span>
            </div>
            <h2
              id="github-publish-modal-title"
              className="mt-1.5 font-display text-2xl font-bold text-slate-900 dark:text-white"
            >
              Connect & Push Portfolio to GitHub
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Authorize your GitHub account via OAuth to create a repository and commit this project directly.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close GitHub publish modal"
            className="rounded-lg border border-slate-200 dark:border-white/10 p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300"
          >
            {errorMessage}
          </div>
        )}

        {publishResult && (
          <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              <Check className="h-4 w-4 shrink-0" />
              <span>
                Published {publishResult.fileCount} files to{' '}
                <span className="font-mono">{publishResult.fullName}</span> (
                {publishResult.branch})
              </span>
            </div>
            <a
              href={publishResult.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs text-blue-700 dark:text-emerald-300 underline hover:no-underline"
            >
              <span>{publishResult.repoUrl}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

        {/* OAuth Connection Card */}
        <div className="mt-6 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#071124] p-5">
          {statusLoading ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Checking GitHub OAuth status...
            </p>
          ) : status?.connected && status.user ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={status.user.avatarUrl}
                  alt={`${status.user.login} avatar`}
                  className="h-10 w-10 rounded-full border border-slate-200 dark:border-white/15 object-cover"
                />
                <div>
                  <div className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                    {status.user.name}
                  </div>
                  <a
                    href={status.user.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs text-blue-700 dark:text-emerald-300 hover:underline"
                  >
                    <span>@{status.user.login}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0b1830] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-rose-500/40 transition-colors cursor-pointer disabled:opacity-50"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{disconnecting ? 'Disconnecting...' : 'Disconnect'}</span>
              </button>
            </div>
          ) : status?.configured ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                  Authorize with GitHub
                </h3>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                  Opens GitHub’s OAuth consent screen in a secure popup window.
                </p>
              </div>
              <button
                type="button"
                onClick={handleConnectGitHub}
                disabled={connecting}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 dark:bg-emerald-300 px-4 py-2.5 text-sm font-semibold text-white dark:text-slate-950 hover:bg-blue-500 dark:hover:bg-emerald-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                <GitBranch className="h-4 w-4" />
                <span>
                  {connecting ? 'Opening GitHub...' : 'Connect GitHub Account'}
                </span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                    GitHub OAuth App Setup Required
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    Register an OAuth App in GitHub Developer Settings and add{' '}
                    <code className="font-mono text-blue-700 dark:text-emerald-300">
                      GITHUB_CLIENT_ID
                    </code>{' '}
                    and{' '}
                    <code className="font-mono text-blue-700 dark:text-emerald-300">
                      GITHUB_CLIENT_SECRET
                    </code>{' '}
                    to AI Studio Secrets to enable one-click pushing.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1830] px-3 py-2">
                <code className="truncate font-mono text-xs text-slate-700 dark:text-slate-300">
                  {callbackUrl}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopy(callbackUrl, 'callback')}
                  className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-blue-700 dark:text-emerald-300 hover:bg-blue-500/10 dark:hover:bg-emerald-400/10 cursor-pointer shrink-0"
                >
                  {copiedKey === 'callback' ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Callback URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Publish Repository Form */}
        <form onSubmit={handlePublish} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="gh-repo-name"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300"
            >
              Repository Name
            </label>
            <input
              id="gh-repo-name"
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="manjit-kaur-portfolio"
              className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#071124] px-3.5 py-2.5 font-mono text-sm text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-emerald-400 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="gh-repo-desc"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300"
            >
              Repository Description
            </label>
            <input
              id="gh-repo-desc"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#071124] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-emerald-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span>Create as private repository</span>
            </label>

            <button
              type="submit"
              disabled={!status?.connected || publishing}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 dark:bg-emerald-300 px-5 py-2.5 text-sm font-semibold text-white dark:text-slate-950 hover:bg-blue-500 dark:hover:bg-emerald-200 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UploadCloud className="h-4 w-4" />
              <span>
                {publishing
                  ? 'Pushing Project Files...'
                  : 'Create Repository & Push Code'}
              </span>
            </button>
          </div>
        </form>

        {/* Local Git Fallback Commands */}
        <div className="mt-6 border-t border-slate-200 dark:border-white/10 pt-5">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              <Terminal className="h-3.5 w-3.5" />
              <span>Or Push via Local Git CLI</span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(gitCliSnippet, 'git')}
              className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-blue-700 dark:text-emerald-300 hover:bg-blue-500/10 dark:hover:bg-emerald-400/10 cursor-pointer"
            >
              {copiedKey === 'git' ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied Commands</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Git Commands</span>
                </>
              )}
            </button>
          </div>
          <pre className="mt-2.5 overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-[#040b18] p-3.5 font-mono text-xs leading-relaxed text-slate-200">
            <code>{gitCliSnippet}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
