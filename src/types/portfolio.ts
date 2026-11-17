export type ProjectCategory = 'All' | 'Design Systems' | 'Publishing' | 'Brand & Web';

export interface CaseStudy {
  id: string;
  title: string;
  category: Exclude<ProjectCategory, 'All'>;
  status: string;
  year: string;
  timeframe: string;
  roleTitle: string;
  teamContext: string;
  summary: string;
  problem: string;
  contributions: string[];
  challenges: string[];
  techStack: string[];
  outcomes: string[];
  learnings: string[];
  ndaNote: string;
  liveUrl?: string;
  imageSrc: string;
  imageAlt: string;
  fallbackLabel: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  items: string[];
}

export interface ExpertiseItem {
  id: string;
  title: string;
  description: string;
  iconName: 'code' | 'gauge' | 'layout' | 'plug' | 'layers' | 'shield';
}

export interface TimelineEntry {
  id: string;
  period: string;
  title: string;
  organization: string;
  tags: string[];
  summary?: string;
  bullets?: string[];
}

export interface CoreStrength {
  id: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  organization: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export interface PortfolioProfile {
  name: string;
  role: string;
  experienceLabel: string;
  availability: string;
  location: string;
  email: string;
  phone?: string;
  githubUrl: string;
  linkedinUrl: string;
  resumePdfUrl?: string;
  headlineIntro: string;
  rotatingStack: string[];
  bioSummary: string;
  aboutParagraphs: string[];
  aboutHighlights?: { value: string; label: string }[];
  portraitSrc: string;
  portraitAlt: string;
  workspaceSrc: string;
  workspaceAlt: string;
}

export interface GitHubRepoSummary {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  htmlUrl?: string;
  isPrivate?: boolean;
}

export interface GitHubUserSummary {
  login: string;
  name: string;
  avatarUrl: string;
  htmlUrl: string;
  publicRepos: number;
}

export interface GitHubStatusResponse {
  configured: boolean;
  connected: boolean;
  callbackUrl: string;
  user: GitHubUserSummary | null;
  repos: GitHubRepoSummary[];
}

export interface GitHubPublishResult {
  repoUrl: string;
  fullName: string;
  branch: string;
  fileCount: number;
}

