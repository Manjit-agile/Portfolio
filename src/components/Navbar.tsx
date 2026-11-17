import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  brandName: string;
  activeSection: string;
  onOpenResume: () => void;
}

const NAV_LINKS = [
  { href: '#about', label: 'About', id: 'about' },
  { href: '#skills', label: 'Skills', id: 'skills' },
  { href: '#projects', label: 'Projects', id: 'projects' },
  { href: '#experience', label: 'Experience', id: 'experience' },
  { href: '#contact', label: 'Contact', id: 'contact' },
];

export function Navbar({ brandName, activeSection, onOpenResume }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const ratio = Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100));
      setScrollProgress(ratio);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-[#040b18]/85 backdrop-blur-md">
      <div
        aria-hidden="true"
        className="h-[2px] bg-gradient-to-r from-blue-500 to-emerald-400 transition-[width] duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-6">
        {/* Zone 1: Single-line brand wordmark */}
        <a
          href="#home"
          className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400 rounded-sm"
        >
          {brandName}
        </a>

        {/* Zone 2: 5 concise single-line text links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400 rounded-sm ${
                  isActive
                    ? 'text-blue-700 dark:text-emerald-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single primary CTA + mobile menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenResume}
            className="hidden md:inline-flex items-center justify-center rounded-lg bg-blue-600 dark:bg-emerald-300 px-4 py-2 text-sm font-semibold text-white dark:text-slate-950 hover:bg-blue-500 dark:hover:bg-emerald-200 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          >
            View Resume
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex md:hidden items-center justify-center h-11 w-11 rounded-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#071124] px-6 py-4 space-y-2"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-emerald-300"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onOpenResume();
            }}
            className="mt-2 w-full rounded-lg bg-blue-600 dark:bg-emerald-300 px-4 py-3 text-sm font-semibold text-white dark:text-slate-950 cursor-pointer"
          >
            View Resume
          </button>
        </nav>
      )}
    </header>
  );
}
