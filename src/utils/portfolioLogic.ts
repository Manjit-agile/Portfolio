import type {
  CaseStudy,
  ContactFormErrors,
  ContactFormValues,
  ContributionDay,
  PortfolioProfile,
  ProjectCategory,
  SkillGroup,
  TimelineEntry,
} from '../types/portfolio';

export function filterCaseStudies(
  projects: CaseStudy[],
  category: ProjectCategory,
  query: string
): CaseStudy[] {
  const normalizedQuery = query.trim().toLowerCase();

  return projects.filter((project) => {
    const matchesCategory = category === 'All' || project.category === category;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;

    const haystack = [
      project.title,
      project.category,
      project.summary,
      project.problem,
      ...project.techStack,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function getCategoryCounts(projects: CaseStudy[]): Record<ProjectCategory, number> {
  const counts: Record<ProjectCategory, number> = {
    All: projects.length,
    'Design Systems': 0,
    Publishing: 0,
    'Brand & Web': 0,
  };

  for (const project of projects) {
    counts[project.category] += 1;
  }

  return counts;
}

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};

  const trimmedName = values.name.trim();
  const trimmedEmail = values.email.trim();
  const trimmedSubject = values.subject.trim();
  const trimmedMessage = values.message.trim();

  if (trimmedName.length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail) {
    errors.email = 'Please enter your email address.';
  } else if (!emailPattern.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (trimmedSubject.length < 3) {
    errors.subject = 'Please provide a brief subject (at least 3 characters).';
  }

  if (trimmedMessage.length < 10) {
    errors.message = 'Please share a few details about your inquiry (at least 10 characters).';
  }

  return errors;
}

export function hasContactErrors(errors: ContactFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function generateContributionWeeks(
  weeksCount = 26,
  referenceDateIso = '2026-11-14'
): ContributionDay[][] {
  const weeks: ContributionDay[][] = [];
  const endDate = new Date(`${referenceDateIso}T00:00:00Z`);
  const totalDays = weeksCount * 7;
  const startDate = new Date(endDate);
  startDate.setUTCDate(endDate.getUTCDate() - totalDays + 1);

  for (let weekIdx = 0; weekIdx < weeksCount; weekIdx++) {
    const week: ContributionDay[] = [];
    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      const current = new Date(startDate);
      current.setUTCDate(startDate.getUTCDate() + weekIdx * 7 + dayIdx);

      // Deterministic pseudo-random activity weighted toward weekdays
      const seed = (weekIdx * 17 + dayIdx * 31 + 7) % 19;
      const isWeekend = dayIdx === 0 || dayIdx === 6;
      let count = 0;
      if (isWeekend) {
        count = seed > 13 ? (seed % 3) + 1 : 0;
      } else {
        if (seed === 0 || seed === 5) count = 0;
        else if (seed < 7) count = 1;
        else if (seed < 12) count = 3;
        else if (seed < 16) count = 5;
        else count = 8;
      }

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count >= 7) level = 4;
      else if (count >= 4) level = 3;
      else if (count >= 2) level = 2;
      else if (count >= 1) level = 1;

      week.push({
        date: current.toISOString().slice(0, 10),
        count,
        level,
      });
    }
    weeks.push(week);
  }

  return weeks;
}

export function summarizeContributions(weeks: ContributionDay[][]): {
  totalCommits: number;
  activeDays: number;
  peakDayCount: number;
} {
  let totalCommits = 0;
  let activeDays = 0;
  let peakDayCount = 0;

  for (const week of weeks) {
    for (const day of week) {
      totalCommits += day.count;
      if (day.count > 0) activeDays += 1;
      if (day.count > peakDayCount) peakDayCount = day.count;
    }
  }

  return { totalCommits, activeDays, peakDayCount };
}

export function formatResumePlainText(
  profile: PortfolioProfile,
  skills: SkillGroup[],
  timeline: TimelineEntry[],
  projects: CaseStudy[]
): string {
  const contactLine = [
    `Email: ${profile.email}`,
    ...(profile.phone ? [`Phone: ${profile.phone}`] : []),
    `Location: ${profile.location}`,
  ].join(' | ');

  const lines: string[] = [
    profile.name.toUpperCase(),
    `${profile.role} | ${profile.experienceLabel}`,
    contactLine,
    `GitHub: ${profile.githubUrl} | LinkedIn: ${profile.linkedinUrl}`,
    '',
    'SUMMARY',
    profile.bioSummary,
    '',
    'SKILLS',
    ...skills.map((group) => `${group.title}: ${group.items.join(', ')}`),
    '',
    'EXPERIENCE & EDUCATION',
    ...timeline.flatMap((item) => [
      `${item.title} — ${item.organization} (${item.period})`,
      ...(item.bullets ? item.bullets.map((b) => `  - ${b}`) : []),
    ]),
    '',
    'SELECTED CASE STUDIES',
    ...projects.map(
      (p) => `${p.title} (${p.timeframe}) — ${p.summary} [${p.techStack.join(', ')}]`
    ),
  ];

  return lines.join('\n');
}
