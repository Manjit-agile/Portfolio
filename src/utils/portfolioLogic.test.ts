import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterCaseStudies,
  formatResumePlainText,
  generateContributionWeeks,
  getCategoryCounts,
  hasContactErrors,
  summarizeContributions,
  validateContactForm,
} from './portfolioLogic';
import type { CaseStudy, PortfolioProfile, SkillGroup, TimelineEntry } from '../types/portfolio';

const sampleProjects: CaseStudy[] = [
  {
    id: 'p1',
    title: 'Multi-Brand Design System',
    category: 'Design Systems',
    status: 'Production',
    year: '2026',
    timeframe: 'Apr 2019 – Present',
    roleTitle: 'Senior Frontend / UI Technical Lead',
    teamContext: 'India & Spain Distributed Engineering Teams',
    summary: 'Shared component library and design tokens powering ~40 websites.',
    problem: 'Fragmented stylesheets slowed multi-brand publishing.',
    contributions: ['Architected reusable UI patterns and design tokens'],
    challenges: ['Multi-brand theming at scale'],
    techStack: ['HTML5', 'SCSS', 'Design Tokens', 'TypeScript'],
    outcomes: ['~40 Websites Powered'],
    learnings: ['Scalable CSS architecture'],
    ndaNote: 'Webedia España publishing ecosystem.',
    imageSrc: '/img1.jpg',
    imageAlt: 'Design system UI',
    fallbackLabel: 'Design System',
  },
  {
    id: 'p2',
    title: 'Xataka Tech Publishing Platform',
    category: 'Publishing',
    status: 'Production',
    year: '2026',
    timeframe: 'Apr 2019 – Present',
    roleTitle: 'Senior Frontend / UI Technical Lead',
    teamContext: 'Editorial, Design & Backend Teams',
    summary: 'Core Web Vitals optimization and semantic SEO markup.',
    problem: 'High-traffic media pages required strict layout stability.',
    contributions: ['Core Web Vitals and responsive asset delivery'],
    challenges: ['CLS stabilization under ad and media loads'],
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'React'],
    outcomes: ['Improved Core Web Vitals'],
    learnings: ['Semantic SEO & WCAG validation'],
    ndaNote: 'Live platform at xataka.com.',
    liveUrl: 'https://www.xataka.com/',
    imageSrc: '/img2.jpg',
    imageAlt: 'Publishing UI',
    fallbackLabel: 'Xataka',
  },
];

test('filterCaseStudies filters by category and search query', () => {
  assert.equal(filterCaseStudies(sampleProjects, 'All', '').length, 2);
  assert.equal(filterCaseStudies(sampleProjects, 'Publishing', '').length, 1);
  assert.equal(filterCaseStudies(sampleProjects, 'Brand & Web', '').length, 0);
  assert.equal(filterCaseStudies(sampleProjects, 'All', 'tokens').length, 1);
  assert.equal(filterCaseStudies(sampleProjects, 'All', 'react')[0].id, 'p2');
});

test('getCategoryCounts computes totals accurately', () => {
  const counts = getCategoryCounts(sampleProjects);
  assert.deepEqual(counts, {
    All: 2,
    'Design Systems': 1,
    Publishing: 1,
    'Brand & Web': 0,
  });
});

test('validateContactForm enforces required fields and email format', () => {
  const emptyErrors = validateContactForm({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  assert.equal(hasContactErrors(emptyErrors), true);
  assert.ok(emptyErrors.name);
  assert.ok(emptyErrors.email);
  assert.ok(emptyErrors.subject);
  assert.ok(emptyErrors.message);

  const badEmailErrors = validateContactForm({
    name: 'Mona',
    email: 'invalid-email',
    subject: 'Project Inquiry',
    message: 'Looking to collaborate on a React dashboard.',
  });
  assert.equal(hasContactErrors(badEmailErrors), true);
  assert.ok(badEmailErrors.email);
  assert.equal(badEmailErrors.name, undefined);

  const validErrors = validateContactForm({
    name: 'Alex Chen',
    email: 'alex@example.com',
    subject: 'Frontend Role',
    message: 'We would love to schedule an introductory chat next week.',
  });
  assert.equal(hasContactErrors(validErrors), false);
});

test('generateContributionWeeks and summarizeContributions produce deterministic grid', () => {
  const weeks = generateContributionWeeks(26, '2026-11-14');
  assert.equal(weeks.length, 26);
  assert.equal(weeks[0].length, 7);
  const summary = summarizeContributions(weeks);
  assert.ok(summary.totalCommits > 100);
  assert.ok(summary.activeDays > 50);
  assert.ok(summary.peakDayCount >= 5);
});

test('formatResumePlainText includes key profile and project sections', () => {
  const profile: PortfolioProfile = {
    name: 'Manjit Kaur',
    role: 'Senior Frontend Engineer · UI Technical Lead',
    experienceLabel: '12+ Years Experience',
    availability: 'Open to Remote & Hybrid',
    location: 'Chandigarh, India',
    email: 'manjit7098@gmail.com',
    phone: '+91-9465237098 / 7888407338',
    githubUrl: 'https://github.com/Manjit-agile',
    linkedinUrl: 'https://www.linkedin.com/in/manjit-kaur-a134a8111/',
    headlineIntro: 'Architecting responsive web ecosystems',
    rotatingStack: ['Design Systems', 'TypeScript'],
    bioSummary: 'Senior Frontend Engineer building accessible design systems.',
    aboutParagraphs: ['Paragraph one'],
    portraitSrc: '/p.jpg',
    portraitAlt: 'Portrait',
    workspaceSrc: '/w.jpg',
    workspaceAlt: 'Workspace',
  };
  const skills: SkillGroup[] = [{ id: 'fe', title: 'Frontend & Frameworks', items: ['React', 'TypeScript'] }];
  const timeline: TimelineEntry[] = [
    {
      id: 't1',
      period: 'Apr 2019 – Present',
      title: 'Senior Frontend / UI Engineer & UI Technical Lead',
      organization: 'Webedia España / Agile Media Lab',
      tags: ['Design Systems'],
      bullets: ['Architected shared component library supporting ~40 websites'],
    },
  ];

  const output = formatResumePlainText(profile, skills, timeline, sampleProjects);
  assert.ok(output.includes('MANJIT KAUR'));
  assert.ok(output.includes('manjit7098@gmail.com'));
  assert.ok(output.includes('+91-9465237098'));
  assert.ok(output.includes('Multi-Brand Design System'));
  assert.ok(output.includes('Architected shared component library supporting ~40 websites'));
});
