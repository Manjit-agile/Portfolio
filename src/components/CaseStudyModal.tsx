import { useEffect, useState } from 'react';
import { ExternalLink, Lock, X } from 'lucide-react';
import type { CaseStudy } from '../types/portfolio';

interface CaseStudyModalProps {
  project: CaseStudy | null;
  onClose: () => void;
}

export function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0b1830] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Banner Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-slate-200 dark:border-white/10 bg-slate-900">
          {!imgError ? (
            <img
              src={project.imageSrc}
              alt={project.imageAlt}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-[#0b1830]">
              <span className="font-display text-xl font-semibold text-emerald-300">
                {project.fallbackLabel}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close case study"
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/80 text-white hover:bg-slate-900 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Case Study Details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
              <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                {project.category}
              </span>
              <span aria-hidden="true">·</span>
              <span>{project.status}</span>
              <span aria-hidden="true">·</span>
              <span>{project.timeframe}</span>
            </div>

            <h3
              id="case-study-modal-title"
              className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl"
            >
              {project.title}
            </h3>

            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {project.roleTitle} — {project.teamContext}
            </p>
          </div>

          <div className="border-t border-slate-200 dark:border-white/10 pt-5">
            <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
              Problem Statement
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {project.problem}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 border-t border-slate-200 dark:border-white/10 pt-5">
            <div>
              <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                Key Contributions
              </h4>
              <ul className="mt-2.5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {project.contributions.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-300 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                Engineering Challenges
              </h4>
              <ul className="mt-2.5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {project.challenges.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 border-t border-slate-200 dark:border-white/10 pt-5">
            <div>
              <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                Delivered Outcomes
              </h4>
              <ul className="mt-2.5 space-y-1.5 text-sm text-slate-700 dark:text-slate-200">
                {project.outcomes.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                Key Learnings
              </h4>
              <ul className="mt-2.5 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                {project.learnings.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 dark:border-white/10 pt-5">
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Stack: {project.techStack.join(' · ')}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 dark:bg-emerald-300 px-3.5 py-2 text-xs font-semibold text-white dark:text-slate-950 hover:bg-blue-500 dark:hover:bg-emerald-200 transition-colors"
                >
                  <span>Visit Live Platform</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
                  <Lock className="h-3.5 w-3.5 shrink-0" />
                  <span>{project.ndaNote}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
