import { useMemo, useState } from 'react';
import { ExternalLink, GitBranch, GitFork, Star } from 'lucide-react';
import type {
  ContributionDay,
  CoreStrength,
  GitHubRepoSummary,
  GitHubUserSummary,
  TimelineEntry,
} from '../types/portfolio';
import { generateContributionWeeks, summarizeContributions } from '../utils/portfolioLogic';

interface ExperienceAndGitHubProps {
  timeline: TimelineEntry[];
  coreStrengths: CoreStrength[];
  githubUrl: string;
  repos: GitHubRepoSummary[];
  connectedUser?: GitHubUserSummary | null;
  onOpenGitHubPublish: () => void;
}

const LEVEL_CLASSES: Record<ContributionDay['level'], string> = {
  0: 'bg-slate-200 dark:bg-white/10',
  1: 'bg-blue-200 dark:bg-blue-900/75',
  2: 'bg-blue-400 dark:bg-blue-600',
  3: 'bg-teal-400 dark:bg-teal-400',
  4: 'bg-emerald-500 dark:bg-emerald-300',
};

export function ExperienceAndGitHub({
  timeline,
  coreStrengths,
  githubUrl,
  repos,
  connectedUser,
  onOpenGitHubPublish,
}: ExperienceAndGitHubProps) {
  const weeks = useMemo(() => generateContributionWeeks(26, '2026-11-14'), []);
  const summary = useMemo(() => summarizeContributions(weeks), [weeks]);
  const [selectedDay, setSelectedDay] = useState<ContributionDay | null>(null);
  const activeGithubUrl = connectedUser?.htmlUrl || githubUrl;

  return (
    <>
      {/* Experience & Education */}
      <section
        id="experience"
        className="border-t border-slate-200/80 dark:border-white/10 bg-slate-100/60 dark:bg-[#071124] py-16 lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Experience & Education
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
              Career progression, production impact, and engineering foundation.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Primary Experience Card */}
            <div className="lg:col-span-7">
              {timeline
                .filter((entry) => entry.bullets && entry.bullets.length > 0)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="h-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1830] p-6 sm:p-8"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                        {entry.title}
                      </h3>
                      <span className="font-mono text-xs text-blue-700 dark:text-emerald-300 tabular-nums">
                        {entry.period}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                      {entry.organization}
                    </p>

                    <ul className="mt-5 space-y-3">
                      {entry.bullets?.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-300 shrink-0"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 border-t border-slate-200 dark:border-white/10 pt-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                      {entry.tags.join(' · ')}
                    </div>
                  </div>
                ))}
            </div>

            {/* Earlier Experience & Education Timeline */}
            <div className="space-y-3.5 lg:col-span-5">
              {timeline
                .filter((entry) => !entry.bullets || entry.bullets.length === 0)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1830] p-4 sm:p-5"
                  >
                    <div className="font-mono text-xs text-blue-700 dark:text-emerald-300 tabular-nums">
                      {entry.period}
                    </div>
                    <h4 className="mt-1 font-display text-base font-semibold text-slate-900 dark:text-white">
                      {entry.title}
                    </h4>
                    <p className="mt-0.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                      {entry.organization}
                    </p>
                    {entry.summary && (
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        {entry.summary}
                      </p>
                    )}
                    <p className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                      {entry.tags.join(' · ')}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* GitHub Activity & Attributable Recommendations */}
      <section className="border-t border-slate-200/80 dark:border-white/10 py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Open Source & Engineering Activity
              </h2>
              <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                {connectedUser
                  ? `Connected to GitHub as @${connectedUser.login} (${connectedUser.publicRepos} public repos).`
                  : 'Recent commit cadence and featured public repositories.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
              <button
                type="button"
                onClick={onOpenGitHubPublish}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 dark:bg-emerald-300 px-4 py-2.5 text-sm font-semibold text-white dark:text-slate-950 hover:bg-blue-500 dark:hover:bg-emerald-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <GitBranch className="h-4 w-4" />
                <span>
                  {connectedUser
                    ? 'Push Project to GitHub'
                    : 'Connect GitHub & Push Project'}
                </span>
              </button>
              <a
                href={activeGithubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0b1830] px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:border-blue-500/50 dark:hover:border-emerald-400/40 transition-colors whitespace-nowrap shrink-0"
              >
                <span>View GitHub Profile</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Contribution Matrix + Repositories */}
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1830] p-6 lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                    26-Week Contribution Activity
                  </h3>
                  <p className="mt-0.5 text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    {selectedDay
                      ? `${selectedDay.date}: ${selectedDay.count} commits`
                      : `${summary.totalCommits} commits across ${summary.activeDays} active days`}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map((lvl) => (
                    <span
                      key={lvl}
                      aria-hidden="true"
                      className={`h-3 w-3 rounded-[2px] ${
                        LEVEL_CLASSES[lvl as ContributionDay['level']]
                      }`}
                    />
                  ))}
                  <span>More</span>
                </div>
              </div>

              <div
                className="mt-5 overflow-x-auto pb-2"
                aria-label="Interactive 26-week GitHub contribution heatmap"
              >
                <div className="inline-flex gap-1.5">
                  {weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-1.5">
                      {week.map((day) => (
                        <button
                          key={day.date}
                          type="button"
                          onMouseEnter={() => setSelectedDay(day)}
                          onFocus={() => setSelectedDay(day)}
                          onClick={() => setSelectedDay(day)}
                          aria-label={`${day.date}: ${day.count} contributions`}
                          className={`h-3.5 w-3.5 rounded-[3px] transition-transform duration-100 hover:scale-125 focus-visible:outline-2 focus-visible:outline-emerald-300 cursor-pointer ${
                            LEVEL_CLASSES[day.level]
                          }`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-5">
              {repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.htmlUrl || `${activeGithubUrl}/${repo.name}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1830] p-5 hover:border-blue-500/45 dark:hover:border-emerald-400/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-mono text-sm font-semibold text-blue-700 dark:text-emerald-300">
                      {repo.name}
                    </h4>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {repo.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    <span>{repo.language}</span>
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" />
                      {repo.stars}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitFork className="h-3.5 w-3.5" />
                      {repo.forks}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Core Leadership & Engineering Strengths */}
          <div className="mt-16">
            <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              Leadership & Core Strengths
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {coreStrengths.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1830] p-6"
                >
                  <div>
                    <div className="font-mono text-xs text-blue-700 dark:text-emerald-300">
                      {item.subtitle}
                    </div>
                    <h4 className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
