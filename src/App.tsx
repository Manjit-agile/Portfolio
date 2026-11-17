/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { AboutAndSkills } from './components/AboutAndSkills';
import { CaseStudyModal } from './components/CaseStudyModal';
import { ContactAndFooter } from './components/ContactAndFooter';
import { ExperienceAndGitHub } from './components/ExperienceAndGitHub';
import { GitHubPublishModal } from './components/GitHubPublishModal';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { ProjectsSection } from './components/ProjectsSection';
import { ResumeModal } from './components/ResumeModal';
import {
  CASE_STUDIES,
  CORE_EXPERTISE,
  CORE_STRENGTHS,
  CURRENTLY_BUILDING,
  GITHUB_REPOS,
  HERO_METRICS,
  PORTFOLIO_PROFILE,
  SKILL_GROUPS,
  TIMELINE_ENTRIES,
} from './data/portfolioData';
import type { CaseStudy, GitHubStatusResponse } from './types/portfolio';
import { formatResumePlainText } from './utils/portfolioLogic';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProject, setSelectedProject] = useState<CaseStudy | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [githubModalOpen, setGithubModalOpen] = useState(false);
  const [githubStatus, setGithubStatus] = useState<GitHubStatusResponse | null>(null);
  const [githubLoading, setGithubLoading] = useState(false);

  const refreshGitHubStatus = useCallback(async () => {
    setGithubLoading(true);
    try {
      const response = await fetch('/api/github/status');
      if (response.ok) {
        const data = (await response.json()) as GitHubStatusResponse;
        setGithubStatus(data);
      }
    } catch {
      // Keep graceful static fallback if backend is unavailable
    } finally {
      setGithubLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshGitHubStatus();
  }, [refreshGitHubStatus]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        void refreshGitHubStatus();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [refreshGitHubStatus]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const sectionIds = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
    const handleScroll = () => {
      const scrollMid = window.scrollY + 180;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollMid) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleDownloadResume = () => {
    if (PORTFOLIO_PROFILE.resumePdfUrl) {
      const link = document.createElement('a');
      link.href = PORTFOLIO_PROFILE.resumePdfUrl;
      link.download = 'Manjit_Kaur_Senior_Frontend_Engineer_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const content = formatResumePlainText(
      PORTFOLIO_PROFILE,
      SKILL_GROUPS,
      TIMELINE_ENTRIES,
      CASE_STUDIES
    );
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Manjit_Kaur_Resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const displayedRepos =
    githubStatus?.connected && githubStatus.repos.length > 0
      ? githubStatus.repos
      : GITHUB_REPOS;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#040b18] dark:text-slate-100 transition-colors duration-200">
      <Navbar
        brandName={PORTFOLIO_PROFILE.name}
        activeSection={activeSection}
        onOpenResume={() => setResumeOpen(true)}
      />

      <main>
        <HeroSection
          profile={PORTFOLIO_PROFILE}
          metrics={HERO_METRICS}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onDownloadResume={handleDownloadResume}
        />

        <AboutAndSkills
          profile={PORTFOLIO_PROFILE}
          skills={SKILL_GROUPS}
          currentlyBuilding={CURRENTLY_BUILDING}
          expertise={CORE_EXPERTISE}
        />

        <ProjectsSection
          projects={CASE_STUDIES}
          onSelectProject={(project) => setSelectedProject(project)}
        />

        <ExperienceAndGitHub
          timeline={TIMELINE_ENTRIES}
          coreStrengths={CORE_STRENGTHS}
          githubUrl={PORTFOLIO_PROFILE.githubUrl}
          repos={displayedRepos}
          connectedUser={githubStatus?.user}
          onOpenGitHubPublish={() => setGithubModalOpen(true)}
        />
      </main>

      <ContactAndFooter
        profile={PORTFOLIO_PROFILE}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenResume={() => setResumeOpen(true)}
      />

      <CaseStudyModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
        onDownloadText={handleDownloadResume}
        profile={PORTFOLIO_PROFILE}
        skills={SKILL_GROUPS}
        timeline={TIMELINE_ENTRIES}
        projects={CASE_STUDIES}
      />

      <GitHubPublishModal
        isOpen={githubModalOpen}
        onClose={() => setGithubModalOpen(false)}
        status={githubStatus}
        statusLoading={githubLoading}
        onRefreshStatus={refreshGitHubStatus}
      />
    </div>
  );
}

