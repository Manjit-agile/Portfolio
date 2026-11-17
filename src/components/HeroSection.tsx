import { useEffect, useState } from 'react';
import { ArrowRight, Code2, Download, Moon, Sun } from 'lucide-react';
import type { PortfolioProfile } from '../types/portfolio';

interface HeroSectionProps {
  profile: PortfolioProfile;
  metrics: { label: string; value: string }[];
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onDownloadResume: () => void;
}

export function HeroSection({
  profile,
  metrics,
  theme,
  onToggleTheme,
  onDownloadResume,
}: HeroSectionProps) {
  const [stackIndex, setStackIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const timer = window.setInterval(() => {
      setStackIndex((prev) => (prev + 1) % profile.rotatingStack.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, [profile.rotatingStack.length]);

  return (
    <section id="home" className="relative overflow-hidden pt-10 pb-14 lg:pt-14 lg:pb-20">
      {/* Subtle atmospheric radial depth behind hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-[120px] dark:bg-blue-500/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[360px] w-[360px] rounded-full bg-emerald-400/10 blur-[120px] dark:bg-emerald-400/12"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-12">
          {/* Left Column: Typographic Hierarchy & Primary Actions */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <div>
              <p className="text-xs font-medium tracking-wide text-blue-700 dark:text-blue-300 font-mono">
                {profile.availability}
              </p>

              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
                {profile.name}
              </h1>

              <p className="mt-3 font-display text-xl font-semibold text-slate-700 dark:text-slate-200 sm:text-2xl">
                {profile.headlineIntro}{' '}
                <span className="text-emerald-700 dark:text-emerald-300">
                  {profile.rotatingStack[stackIndex]}
                </span>
              </p>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {profile.bioSummary}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                <span>{profile.role}</span>
                <span aria-hidden="true">·</span>
                <span>{profile.experienceLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{profile.location}</span>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
              >
                <span>Contact Me</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0b1830] px-5 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:border-blue-500/50 dark:hover:border-emerald-400/40 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
              >
                <Code2 className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                <span>View Projects</span>
              </a>

              <button
                type="button"
                onClick={onDownloadResume}
                className="inline-flex items-center gap-2 rounded-lg px-3.5 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/5 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
              >
                <Download className="h-4 w-4" />
                <span>Download Resume</span>
              </button>

              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/5 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-4 w-4 text-emerald-300" />
                    <span>Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 text-blue-600" />
                    <span>Dark</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Clean Full-Height Portrait (No Overlapping Face Badges) */}
          <div className="lg:col-span-5">
            <div className="relative h-full max-h-[380px] sm:max-h-[440px] lg:max-h-[460px] overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-200 dark:bg-[#0b1830]">
              {!imgError ? (
                <img
                  src={profile.portraitSrc}
                  alt={profile.portraitAlt}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="flex h-full min-h-[340px] flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-[#0b1830] p-8 text-center">
                  <span className="font-display text-3xl font-bold text-white">{profile.name}</span>
                  <span className="mt-2 text-sm text-emerald-300">{profile.role}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column KPI Row Below the Split */}
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metrics.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1830] p-5"
            >
              <div className="font-mono text-2xl font-semibold tracking-tight text-blue-700 dark:text-emerald-300 tabular-nums">
                {item.value}
              </div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
