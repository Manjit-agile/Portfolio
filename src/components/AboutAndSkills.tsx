import { useState } from 'react';
import { Code2, Gauge, Layers, LayoutGrid, Plug, ShieldCheck } from 'lucide-react';
import type { ExpertiseItem, PortfolioProfile, SkillGroup } from '../types/portfolio';

interface AboutAndSkillsProps {
  profile: PortfolioProfile;
  skills: SkillGroup[];
  currentlyBuilding: { id: string; title: string; detail: string }[];
  expertise: ExpertiseItem[];
}

function renderExpertiseIcon(name: ExpertiseItem['iconName']) {
  const cls = 'h-5 w-5 text-blue-600 dark:text-emerald-300';
  switch (name) {
    case 'code':
      return <Code2 className={cls} />;
    case 'gauge':
      return <Gauge className={cls} />;
    case 'layout':
      return <LayoutGrid className={cls} />;
    case 'plug':
      return <Plug className={cls} />;
    case 'layers':
      return <Layers className={cls} />;
    case 'shield':
      return <ShieldCheck className={cls} />;
  }
}

export function AboutAndSkills({
  profile,
  skills,
  currentlyBuilding,
  expertise,
}: AboutAndSkillsProps) {
  const [workspaceError, setWorkspaceError] = useState(false);

  return (
    <>
      {/* About Me Section */}
      <section
        id="about"
        className="border-t border-slate-200/80 dark:border-white/10 py-16 lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              About Me
            </h2>
            <div className="mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
            <div className="lg:col-span-5">
              <div className="h-full min-h-[280px] overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-200 dark:bg-[#0b1830]">
                {!workspaceError ? (
                  <img
                    src={profile.workspaceSrc}
                    alt={profile.workspaceAlt}
                    referrerPolicy="no-referrer"
                    onError={() => setWorkspaceError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[280px] items-center justify-center bg-gradient-to-br from-slate-800 to-[#0b1830] p-8 text-center">
                    <span className="font-display text-lg font-semibold text-slate-200">
                      Frontend Engineering Studio
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-5 lg:col-span-7">
              {profile.aboutParagraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-base leading-relaxed text-slate-600 dark:text-slate-300"
                >
                  {paragraph}
                </p>
              ))}

              {profile.aboutHighlights && profile.aboutHighlights.length > 0 && (
                <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3 border-t border-slate-200 dark:border-white/10">
                  {profile.aboutHighlights.map((item) => (
                    <div key={item.label}>
                      <div className="font-mono text-lg font-semibold text-blue-700 dark:text-emerald-300 tabular-nums">
                        {item.value}
                      </div>
                      <div className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Engineering Process Section */}
      <section
        id="skills"
        className="border-t border-slate-200/80 dark:border-white/10 bg-slate-100/60 dark:bg-[#071124] py-16 lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Technical Skills & Expertise
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
              Technologies, architectural practices, and workflows I rely on to ship production software.
            </p>
          </div>

          {/* 6-Category Skill Matrix */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((group) => (
              <div
                key={group.id}
                className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1830] p-6"
              >
                <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300"
                    >
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-300 shrink-0"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Core Engineering Focus Strip */}
          <div className="mt-10">
            <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
              Engineering Focus & Craft
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {currentlyBuilding.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1830] p-5"
                >
                  <div className="font-display text-sm font-semibold text-blue-700 dark:text-blue-300">
                    {item.title}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Core Expertise 3x2 Grid */}
          <div className="mt-14">
            <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
              Core Engineering Capabilities
            </h3>
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {expertise.map((cap) => (
                <div
                  key={cap.id}
                  className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1830] p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 dark:bg-emerald-400/10">
                    {renderExpertiseIcon(cap.iconName)}
                  </div>
                  <h4 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
                    {cap.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {cap.description}
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
