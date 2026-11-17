import { useEffect } from 'react';
import { Download, Printer, X } from 'lucide-react';
import type { CaseStudy, PortfolioProfile, SkillGroup, TimelineEntry } from '../types/portfolio';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadText: () => void;
  profile: PortfolioProfile;
  skills: SkillGroup[];
  timeline: TimelineEntry[];
  projects: CaseStudy[];
}

export function ResumeModal({
  isOpen,
  onClose,
  onDownloadText,
  profile,
  skills,
  timeline,
  projects,
}: ResumeModalProps) {
  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0b1830] p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
          <div>
            <h2
              id="resume-modal-title"
              className="font-display text-2xl font-bold text-slate-900 dark:text-white"
            >
              {profile.name} — Resume
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {profile.role} · {profile.experienceLabel} · {profile.email}
              {profile.phone ? ` · ${profile.phone}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-white/15 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer whitespace-nowrap"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
            {profile.resumePdfUrl ? (
              <a
                href={profile.resumePdfUrl}
                download="Manjit_Kaur_Senior_Frontend_Engineer_Resume.pdf"
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 dark:bg-emerald-300 px-3 py-2 text-xs font-semibold text-white dark:text-slate-950 hover:bg-blue-500 dark:hover:bg-emerald-200 cursor-pointer whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download PDF</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={onDownloadText}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 dark:bg-emerald-300 px-3 py-2 text-xs font-semibold text-white dark:text-slate-950 hover:bg-blue-500 dark:hover:bg-emerald-200 cursor-pointer whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close resume preview"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-6 text-sm">
          <div>
            <h3 className="font-display text-xs font-bold tracking-wider uppercase text-blue-700 dark:text-emerald-300">
              Summary
            </h3>
            <p className="mt-2 leading-relaxed text-slate-700 dark:text-slate-300">
              {profile.bioSummary}
            </p>
          </div>

          <div>
            <h3 className="font-display text-xs font-bold tracking-wider uppercase text-blue-700 dark:text-emerald-300">
              Technical Skills
            </h3>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {skills.map((group) => (
                <div key={group.id}>
                  <div className="font-semibold text-slate-900 dark:text-white">{group.title}</div>
                  <div className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {group.items.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-xs font-bold tracking-wider uppercase text-blue-700 dark:text-emerald-300">
              Experience & Education
            </h3>
            <div className="mt-2 space-y-4">
              {timeline.map((item) => (
                <div key={item.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {item.title} — {item.organization}
                    </span>
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      {item.period}
                    </span>
                  </div>
                  {item.summary && (
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      {item.summary}
                    </p>
                  )}
                  {item.bullets && (
                    <ul className="mt-1.5 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      {item.bullets.map((b) => (
                        <li key={b}>· {b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-xs font-bold tracking-wider uppercase text-blue-700 dark:text-emerald-300">
              Featured Platforms & Systems
            </h3>
            <div className="mt-2 space-y-2.5">
              {projects.slice(0, 4).map((p) => (
                <div key={p.id}>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {p.title}{' '}
                    <span className="font-mono text-xs font-normal text-slate-500 dark:text-slate-400">
                      ({p.timeframe})
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{p.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
