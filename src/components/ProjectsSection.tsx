import { useMemo, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import type { CaseStudy, ProjectCategory } from '../types/portfolio';
import { filterCaseStudies, getCategoryCounts } from '../utils/portfolioLogic';

interface ProjectsSectionProps {
  projects: CaseStudy[];
  onSelectProject: (project: CaseStudy) => void;
}

const CATEGORIES: ProjectCategory[] = ['All', 'Design Systems', 'Publishing', 'Brand & Web'];

export function ProjectsSection({ projects, onSelectProject }: ProjectsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const counts = useMemo(() => getCategoryCounts(projects), [projects]);

  const filteredProjects = useMemo(
    () => filterCaseStudies(projects, activeCategory, searchQuery),
    [projects, activeCategory, searchQuery]
  );

  return (
    <section
      id="projects"
      className="border-t border-slate-200/80 dark:border-white/10 py-16 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Featured Platforms & Systems
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
              High-traffic publishing sites, multi-brand design systems, and responsive web architectures.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <label htmlFor="project-search" className="sr-only">
              Search case studies by title or technology
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              id="project-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by stack or keyword..."
              className="w-full rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0b1830] py-2.5 pl-10 pr-9 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-400/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear project search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Interactive Segmented Category Filter */}
        <div
          role="group"
          aria-label="Filter case studies by category"
          className="mt-8 inline-flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#0b1830] p-1"
        >
          {CATEGORIES.map((category) => {
            const isSelected = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setActiveCategory(category)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 dark:bg-emerald-300 text-white dark:text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{category}</span>
                <span className="font-mono text-[11px] opacity-75 tabular-nums">
                  ({counts[category]})
                </span>
              </button>
            );
          })}
        </div>

        {/* Empty State or 2-Column Case Study Grid */}
        {filteredProjects.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1830] p-10 text-center">
            <p className="text-base font-medium text-slate-800 dark:text-slate-200">
              No case studies match your current filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 inline-flex items-center rounded-lg bg-blue-600 dark:bg-emerald-300 px-4 py-2 text-sm font-semibold text-white dark:text-slate-950 hover:bg-blue-500 dark:hover:bg-emerald-200 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredProjects.map((project) => {
              const imgFailed = failedImages[project.id];
              return (
                <article
                  key={project.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1830] transition-colors duration-150 hover:border-blue-500/45 dark:hover:border-emerald-400/40"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-slate-200 dark:border-white/10 bg-slate-900">
                    {!imgFailed ? (
                      <img
                        src={project.imageSrc}
                        alt={project.imageAlt}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [project.id]: true }))
                        }
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-[#0b1830] p-6 text-center">
                        <span className="font-display text-lg font-semibold text-emerald-300">
                          {project.fallbackLabel}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      {/* Unboxed typographic metadata — no pill capsules */}
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                        <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                          {project.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{project.status}</span>
                        <span aria-hidden="true">·</span>
                        <span>{project.timeframe}</span>
                      </div>

                      <h3 className="mt-2.5 font-display text-xl font-bold text-slate-900 dark:text-white">
                        {project.title}
                      </h3>

                      <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {project.summary}
                      </p>

                      {/* Key highlight metrics inline */}
                      <p className="mt-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                        {project.outcomes.slice(0, 3).join(' · ')}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-200 dark:border-white/10 pt-4">
                      <span className="truncate text-xs font-mono text-slate-500 dark:text-slate-400">
                        {project.techStack.slice(0, 4).join(' / ')}
                      </span>

                      <button
                        type="button"
                        onClick={() => onSelectProject(project)}
                        aria-label={`Read case study for ${project.title}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 dark:bg-white/10 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-600 dark:hover:bg-emerald-300 dark:hover:text-slate-950 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
                      >
                        <span>Read Case Study</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
