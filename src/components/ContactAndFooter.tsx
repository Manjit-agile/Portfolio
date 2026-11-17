import { useState, type FormEvent } from 'react';
import { ArrowUp, CheckCircle2, Mail, MapPin, Send } from 'lucide-react';
import type { ContactFormErrors, ContactFormValues, PortfolioProfile } from '../types/portfolio';
import { hasContactErrors, validateContactForm } from '../utils/portfolioLogic';

interface ContactAndFooterProps {
  profile: PortfolioProfile;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenResume: () => void;
}

export function ContactAndFooter({
  profile,
  theme,
  onToggleTheme,
  onOpenResume,
}: ContactAndFooterProps) {
  const [values, setValues] = useState<ContactFormValues>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submittedRecord, setSubmittedRecord] = useState<ContactFormValues | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateContactForm(values);
    setErrors(validationErrors);
    if (hasContactErrors(validationErrors)) return;

    setSubmittedRecord({ ...values });
    setValues({ name: '', email: '', subject: '', message: '' });
  };

  const updateField = (field: keyof ContactFormValues, nextVal: string) => {
    setValues((prev) => ({ ...prev, [field]: nextVal }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  return (
    <>
      <section
        id="contact"
        className="border-t border-slate-200/80 dark:border-white/10 bg-slate-100/60 dark:bg-[#071124] py-16 lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Let’s Build Something Great
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
              Open to Senior Frontend Engineer, UI Technical Lead, and Design Systems roles.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Contact Info Column */}
            <div className="space-y-4 lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1830] p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-emerald-400/10 dark:text-emerald-300 shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                      Email & Phone
                    </h3>
                    <a
                      href={`mailto:${profile.email}`}
                      className="mt-1 block text-sm font-medium text-blue-700 dark:text-emerald-300 hover:underline"
                    >
                      {profile.email}
                    </a>
                    {profile.phone && (
                      <p className="mt-1 font-mono text-xs text-slate-600 dark:text-slate-300">
                        {profile.phone}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Typically responds within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1830] p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-emerald-400/10 dark:text-emerald-300 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                      Location & Availability
                    </h3>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                      {profile.location}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Open to Remote, Hybrid & UI Technical Lead Opportunities
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1830] p-6">
                <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                  Direct Profiles
                </h3>
                <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium">
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-emerald-300"
                  >
                    GitHub
                  </a>
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-emerald-300"
                  >
                    LinkedIn
                  </a>
                  <button
                    type="button"
                    onClick={onOpenResume}
                    className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-emerald-300 cursor-pointer"
                  >
                    Resume
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Form Column */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1830] p-6 sm:p-8 lg:col-span-7">
              {submittedRecord ? (
                <div className="flex flex-col items-start justify-center py-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-slate-900 dark:text-white">
                    Message Ready for {profile.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    Thank you, <span className="font-semibold">{submittedRecord.name}</span>. Your
                    inquiry regarding <span className="font-semibold">“{submittedRecord.subject}”</span>{' '}
                    has been captured. You can also launch your email client directly to send it immediately.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={`mailto:${profile.email}?subject=${encodeURIComponent(
                        submittedRecord.subject
                      )}&body=${encodeURIComponent(
                        `From: ${submittedRecord.name} (${submittedRecord.email})\n\n${submittedRecord.message}`
                      )}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 dark:bg-emerald-300 px-4 py-2.5 text-sm font-semibold text-white dark:text-slate-950 hover:bg-blue-500 dark:hover:bg-emerald-200"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Open in Email App</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setSubmittedRecord(null)}
                      className="inline-flex items-center rounded-lg border border-slate-300 dark:border-white/15 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                      >
                        Full Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={values.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        placeholder="Enter your name"
                        className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#0f2140] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-400/20"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                      >
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={values.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        placeholder="you@company.com"
                        className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#0f2140] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-400/20"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={values.subject}
                      onChange={(e) => updateField('subject', e.target.value)}
                      aria-invalid={Boolean(errors.subject)}
                      placeholder="Role opportunity or project inquiry"
                      className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#0f2140] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-400/20"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={values.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      aria-invalid={Boolean(errors.message)}
                      placeholder="Share details about the role, team, or timeline..."
                      className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#0f2140] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-400/20"
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 dark:bg-emerald-300 px-5 py-3 text-sm font-semibold text-white dark:text-slate-950 hover:bg-blue-500 dark:hover:bg-emerald-200 transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#040b18] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            © 2026 {profile.name}
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <a
              href={`mailto:${profile.email}`}
              className="hover:text-slate-900 dark:hover:text-white"
            >
              Email
            </a>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 dark:hover:text-white"
            >
              LinkedIn
            </a>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 dark:hover:text-white"
            >
              GitHub
            </a>
            <button
              type="button"
              onClick={onToggleTheme}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
            </button>
            <a
              href="#home"
              aria-label="Back to top"
              className="inline-flex items-center gap-1 font-medium text-blue-700 dark:text-emerald-300 hover:underline"
            >
              <span>Top</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
