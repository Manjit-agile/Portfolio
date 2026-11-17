import heroPortrait from '../assets/images/hero_engineer_portrait_1794653457441.jpg';
import workspaceScene from '../assets/images/about_workspace_scene_1794653458029.jpg';
import projectCmsGallery from '../assets/images/project_cms_gallery_1794653458781.jpg';
import projectHrScheduling from '../assets/images/project_hr_scheduling_1794653458862.jpg';
import projectLuxuryBrand from '../assets/images/project_luxury_brand_1794653460024.jpg';
import type {
  CaseStudy,
  CoreStrength,
  ExpertiseItem,
  PortfolioProfile,
  SkillGroup,
  TimelineEntry,
} from '../types/portfolio';

export const PORTFOLIO_PROFILE: PortfolioProfile = {
  name: 'Manjit Kaur',
  role: 'Senior Frontend Engineer · UI Technical Lead',
  experienceLabel: '12+ Years Experience',
  availability: 'Senior Frontend Engineer · UI Technical Lead · Design Systems',
  location: 'Chandigarh, India',
  email: 'manjit7098@gmail.com',
  phone: '+91-9465237098 / 7888407338',
  githubUrl: 'https://github.com/Manjit-agile',
  linkedinUrl: 'https://www.linkedin.com/in/manjit-kaur-a134a8111/',
  resumePdfUrl: '/assets/aistudio/Manjit_Kaur___Senior_Frontend_Engineer_Resume_a4f23937.pdf',
  headlineIntro: 'Architecting responsive, accessible web ecosystems with',
  rotatingStack: ['Design Systems', 'HTML5 & Modern CSS', 'React & TypeScript', 'Core Web Vitals'],
  bioSummary:
    'Senior Frontend Engineer with 12+ years of experience taking responsive, accessible, production-grade web interfaces from initial concept and Figma specifications to shipped products across ~40 high-traffic websites and brands.',
  aboutParagraphs: [
    'Hands-on technical owner of the HTML/CSS/UI architecture, shared component library, and design tokens powering an international digital publishing ecosystem of approximately 40 multi-language websites and brands, including high-traffic platforms such as Xataka, 3DJuegos, and Directo al Paladar.',
    'I combine deep craft in semantic HTML5, modern CSS (Grid, Flexbox, container queries, SCSS/LESS, BEM), Core Web Vitals optimization, and WCAG/ARIA compliance with practical React, TypeScript, and motion engineering using Framer Motion and GSAP.',
    'Across fast-moving, distributed cross-functional teams in India and Spain, I collaborate daily with UI/UX designers, backend engineers, product stakeholders, QA, and sysadmins—leading PR code reviews, mentoring developers, and scoping scalable frontend deliverables.',
  ],
  aboutHighlights: [
    { value: 'Design Systems', label: 'Primary Craft' },
    { value: '~40 Websites', label: 'Multi-Brand Scale' },
    { value: 'WCAG & CWV', label: 'Quality & Speed' },
  ],
  portraitSrc: heroPortrait,
  portraitAlt: 'Manjit Kaur — Senior Frontend Engineer studio portrait',
  workspaceSrc: workspaceScene,
  workspaceAlt: 'Minimalist software engineering desk setup with laptop and design system grid',
};

export const HERO_METRICS = [
  { label: 'Frontend Engineering', value: '12+ yrs' },
  { label: 'Websites & Brands Powered', value: '~40' },
  { label: 'UI Technical Lead Tenure', value: '7+ yrs' },
  { label: 'Accessibility & Speed', value: 'WCAG / CWV' },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'frontend-frameworks',
    title: 'Frontend & Frameworks',
    items: [
      'HTML5 & CSS3',
      'JavaScript (ES6+)',
      'React & TypeScript',
      'Component-Based UI Architecture',
      'Framer Motion & GSAP',
      'jQuery & Bootstrap',
    ],
  },
  {
    id: 'layout-responsive',
    title: 'Layout & Responsive UI',
    items: [
      'CSS Grid & Flexbox',
      'Container & Media Queries',
      'Responsive Typography & aspect-ratio',
      'SCSS / Sass & LESS',
      'BEM Methodology',
      'Cross-Browser Compatibility',
    ],
  },
  {
    id: 'design-systems',
    title: 'Design Systems & Tokens',
    items: [
      'Shared Component Libraries',
      'Reusable UI Patterns',
      'Design Tokens',
      'Multi-Brand Theming',
      'Scalable CSS Architecture',
      'UI Layer Technical Ownership',
    ],
  },
  {
    id: 'performance-seo',
    title: 'Performance & SEO',
    items: [
      'Core Web Vitals Optimization',
      'Layout Stability (CLS Fixes)',
      'Responsive Asset Delivery',
      'Rendering & Layout Troubleshooting',
      'Semantic SEO Markup',
      'Cross-Platform Scalability',
    ],
  },
  {
    id: 'accessibility-quality',
    title: 'Accessibility & Quality',
    items: [
      'WCAG & ARIA Compliance',
      'Semantic HTML Validation',
      'Keyboard & Screen-Reader Patterns',
      'Browser Debugging',
      'Code & PR Reviews',
      'Clean Code Standards',
    ],
  },
  {
    id: 'design-tooling',
    title: 'Design & Build Tooling',
    items: [
      'Figma, Sketch & Zeplin',
      'Material Design',
      'Git, GitHub & GitHub Copilot',
      'Gulp & PostCSS',
      'Autoprefixer & CSSNano',
      'Stylelint & Prettier',
    ],
  },
];

export const CURRENTLY_BUILDING = [
  {
    id: 'design-tokens',
    title: 'Multi-Brand Design Tokens',
    detail: 'Shared component libraries and scalable CSS theming across ~40 websites.',
  },
  {
    id: 'core-web-vitals',
    title: 'Core Web Vitals & CLS',
    detail: 'Layout stability fixes, responsive asset delivery, and rendering speed.',
  },
  {
    id: 'wcag-aria',
    title: 'WCAG & ARIA Accessibility',
    detail: 'Semantic HTML validation with inclusive keyboard and screen-reader patterns.',
  },
  {
    id: 'react-motion',
    title: 'React, TS & Motion',
    detail: 'Modern interactive components crafted with React, TypeScript, Framer Motion, and GSAP.',
  },
];

export const CORE_EXPERTISE: ExpertiseItem[] = [
  {
    id: 'design-systems',
    title: 'Design Systems & Tokens',
    description:
      'Architecting shared component libraries, reusable UI patterns, and multi-brand design tokens supporting ~40 international websites.',
    iconName: 'layers',
  },
  {
    id: 'responsive-ui',
    title: 'Layout & Responsive UI',
    description:
      'Crafting pixel-accurate layouts with CSS Grid, Flexbox, container queries, responsive typography, LESS, SCSS/Sass, and BEM.',
    iconName: 'layout',
  },
  {
    id: 'perf-seo',
    title: 'Performance & Semantic SEO',
    description:
      'Driving Core Web Vitals improvements, layout stability, responsive media delivery, and clean semantic SEO markup.',
    iconName: 'gauge',
  },
  {
    id: 'a11y-quality',
    title: 'WCAG & ARIA Accessibility',
    description:
      'Enforcing semantic HTML validation, keyboard navigation, and screen-reader usability across live publishing platforms.',
    iconName: 'shield',
  },
  {
    id: 'fe-motion',
    title: 'Frontend & Motion Engineering',
    description:
      'Delivering production interfaces from Figma prototypes using HTML5, CSS3, ES6+ JavaScript, React, TypeScript, Framer Motion, and GSAP.',
    iconName: 'code',
  },
  {
    id: 'tech-lead',
    title: 'UI Technical Leadership',
    description:
      'Leading PR code reviews, troubleshooting production cross-browser issues, scoping deliverables, and mentoring distributed developers.',
    iconName: 'plug',
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'multi-brand-design-system',
    title: 'Multi-Brand Design System & Token Library',
    category: 'Design Systems',
    status: 'Production',
    year: '2026',
    timeframe: 'Apr 2019 – Present',
    roleTitle: 'Senior Frontend / UI Technical Lead',
    teamContext: 'Webedia España / Agile Media Lab · India & Spain Teams',
    summary:
      'Shared component library, reusable UI patterns, and multi-brand design tokens powering an international ecosystem of ~40 publishing websites.',
    problem:
      'Maintaining ~40 distinct multi-language media brands required a unified yet themeable UI foundation so design updates, accessibility fixes, and layout improvements could scale without duplicating CSS or breaking brand identity.',
    contributions: [
      'Architected and maintained the shared component library and reusable UI pattern architecture',
      'Established multi-brand design tokens and scalable LESS/SCSS architecture using BEM conventions',
      'Automated build quality pipelines with Gulp, PostCSS, Autoprefixer, CSSNano, Stylelint, and Prettier',
      'Led frontend PR code reviews and mentored ~3 developers to uphold consistent UI standards',
    ],
    challenges: [
      'Supporting ~40 brand themes from a single maintainable CSS/UI codebase',
      'Preventing style regressions across legacy templates and modern responsive modules',
      'Enforcing WCAG and ARIA accessibility compliance across shared interactive components',
      'Coordinating daily UI releases with distributed engineering and QA teams in India and Spain',
    ],
    techStack: ['HTML5', 'CSS3', 'SCSS / LESS', 'Design Tokens', 'Gulp / PostCSS'],
    outcomes: [
      '~40 Websites Powered',
      'Multi-Brand Theming',
      'Shared Pattern Library',
      'Automated CSS Quality Gates',
    ],
    learnings: [
      'Token-driven theming keeps multi-brand styling predictable at scale',
      'Automated Stylelint and PostCSS pipelines catch layout bugs before QA',
      'Clear PR standards accelerate onboarding for distributed UI teams',
    ],
    ndaNote: 'Webedia España / Agile Media Lab multi-brand publishing ecosystem.',
    imageSrc: projectCmsGallery,
    imageAlt: 'Multi-brand design system and component architecture showcase',
    fallbackLabel: 'Multi-Brand Design System',
  },
  {
    id: 'xataka-publishing',
    title: 'Xataka — High-Traffic Tech Publishing UI',
    category: 'Publishing',
    status: 'Production',
    year: '2026',
    timeframe: 'Apr 2019 – Present',
    roleTitle: 'Senior Frontend / UI Technical Lead',
    teamContext: 'Webedia España / Agile Media Lab · Editorial & Platform Teams',
    summary:
      'Frontend UI ownership, Core Web Vitals optimization, layout stability fixes, and semantic SEO markup for Spain’s flagship technology publication.',
    problem:
      'High-traffic editorial portals combine dense article grids, embeds, and responsive media slots that can degrade Core Web Vitals and Cumulative Layout Shift (CLS) without disciplined frontend architecture.',
    contributions: [
      'Owned end-to-end Figma-to-code execution for responsive editorial layouts and special features',
      'Implemented semantic HTML5/SEO markup, aspect-ratio containers, and responsive asset delivery',
      'Resolved production layout stability (CLS) and cross-browser rendering bottlenecks',
      'Enforced keyboard navigation and screen-reader ARIA semantics across shared reading modules',
    ],
    challenges: [
      'Maintaining low CLS across dynamic editorial feeds and embedded media blocks',
      'Balancing rich editorial layouts with fast mobile Core Web Vitals scores',
      'Ensuring cross-browser visual accuracy from Sketch/Figma prototypes to production',
      'Coordinating live hotfixes and feature launches with sysadmins and backend engineers',
    ],
    techStack: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'SCSS', 'Core Web Vitals'],
    outcomes: [
      'Improved Layout Stability',
      'Semantic SEO Architecture',
      'WCAG & ARIA Compliance',
      'Responsive Editorial Grids',
    ],
    learnings: [
      'Explicit aspect-ratio rules and disciplined asset sizing protect CLS at scale',
      'Semantic HTML structure boosts both accessibility and search crawlability',
      'Early technical scoping prevents layout complexity during editorial sprints',
    ],
    ndaNote: 'Live international tech publishing platform at xataka.com.',
    liveUrl: 'https://www.xataka.com/',
    imageSrc: projectCmsGallery,
    imageAlt: 'Xataka high-traffic digital publishing interface preview',
    fallbackLabel: 'Xataka Publishing UI',
  },
  {
    id: '3djuegos-media',
    title: '3DJuegos — Gaming Media Platform UI',
    category: 'Publishing',
    status: 'Production',
    year: '2026',
    timeframe: 'Apr 2019 – Present',
    roleTitle: 'Senior Frontend / UI Technical Lead',
    teamContext: 'Webedia España / Agile Media Lab · Cross-Functional Product Team',
    summary:
      'Scalable CSS architecture, container-query responsive components, and accessible UI patterns for a high-volume gaming news and community portal.',
    problem:
      'Complex gaming hubs surface reviews, video galleries, comparison cards, and community discussions that must remain responsive, consistent, and accessible across desktop and mobile devices.',
    contributions: [
      'Delivered modular CSS Grid, Flexbox, and container-query components from Figma specs',
      'Unified reusable card, rating, and navigation patterns within the shared UI library',
      'Troubleshot production-critical browser compatibility and rendering issues across releases',
      'Guided junior frontend developers on BEM naming, clean markup, and responsive testing',
    ],
    challenges: [
      'Adapting dense media and review modules cleanly across varied viewport widths',
      'Keeping shared CSS specificity flat and maintainable across deep feature pages',
      'Validating keyboard and screen-reader focus flows on interactive widgets',
      'Aligning rapid visual updates across editorial, product, and QA stakeholders',
    ],
    techStack: ['HTML5', 'CSS Grid / Flexbox', 'LESS / SCSS', 'BEM', 'WCAG / ARIA'],
    outcomes: [
      'Modular Media Components',
      'Cross-Browser Parity',
      'Accessible Interactive UI',
      'Reusable Brand Tokens',
    ],
    learnings: [
      'Container queries simplify component reuse inside varied editorial sidebars and grids',
      'BEM conventions keep multi-developer CSS conflict-free',
      'Hands-on browser debugging catches subtle rendering edge cases early',
    ],
    ndaNote: 'Live gaming media platform at 3djuegos.com.',
    liveUrl: 'https://www.3djuegos.com/',
    imageSrc: projectHrScheduling,
    imageAlt: '3DJuegos responsive media grid and navigation interface',
    fallbackLabel: '3DJuegos Media UI',
  },
  {
    id: 'directo-al-paladar',
    title: 'Directo al Paladar — Culinary Publishing UI',
    category: 'Publishing',
    status: 'Production',
    year: '2026',
    timeframe: 'Apr 2019 – Present',
    roleTitle: 'Senior Frontend / UI Technical Lead',
    teamContext: 'Webedia España / Agile Media Lab · Design & Engineering',
    summary:
      'Responsive editorial storytelling, structured recipe markup, and optimized media delivery for a leading culinary publication.',
    problem:
      'Image-rich culinary publications require fast, crisp visual presentation, legible responsive typography, and semantic markup so readers and search engines navigate recipes effortlessly.',
    contributions: [
      'Translated Figma and Zeplin design specifications into responsive HTML5/CSS3 templates',
      'Optimized responsive image delivery, aspect-ratio framing, and typography scales',
      'Maintained semantic SEO markup and WCAG contrast compliance across brand tokens',
      'Reviewed frontend pull requests to uphold clean code and rendering performance',
    ],
    challenges: [
      'Delivering high-resolution culinary photography without slowing mobile page loads',
      'Maintaining readable editorial typography and spacing across mobile and tablet screens',
      'Isolating brand-specific palette tokens cleanly within the shared design system',
      'Flagging technical feasibility constraints early during product discovery',
    ],
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Typography', 'Semantic SEO'],
    outcomes: [
      'Fast Mobile Media Loads',
      'Structured Recipe Markup',
      'Brand-Aligned Tokens',
      'WCAG Contrast Verified',
    ],
    learnings: [
      'Disciplined responsive image sizing elevates both UX and Core Web Vitals',
      'Close designer-developer pairing preserves typographic rhythm in code',
      'Consistent semantic structure scales seamlessly across editorial verticals',
    ],
    ndaNote: 'Live culinary publishing platform at directoalpaladar.com.',
    liveUrl: 'https://www.directoalpaladar.com/',
    imageSrc: projectLuxuryBrand,
    imageAlt: 'Directo al Paladar editorial layout showcase',
    fallbackLabel: 'Directo al Paladar UI',
  },
  {
    id: 'lpu-institutional-web',
    title: 'Institutional Web & Digital Campaign Suite',
    category: 'Brand & Web',
    status: 'Production',
    year: '2018',
    timeframe: 'Sep 2015 – Jul 2018',
    roleTitle: 'Assistant UI/UX Designer & Frontend Dev',
    teamContext: 'Lovely Professional University · Digital & Marketing Teams',
    summary:
      'Responsive institutional websites built in HTML/CSS and WordPress alongside SEO-focused landing pages and digital campaign interfaces.',
    problem:
      'University departments and admissions campaigns needed responsive, brand-consistent web pages that loaded reliably across student devices and supported search visibility.',
    contributions: [
      'Designed, developed, and maintained responsive institutional websites in HTML/CSS and WordPress',
      'Built campaign landing pages supporting SEO and university digital outreach initiatives',
      'Standardized cross-browser responsive layouts for desktop, tablet, and mobile visitors',
      'Partnered with content and marketing stakeholders to ship timely admissions updates',
    ],
    challenges: [
      'Managing high-volume institutional content across diverse academic portals',
      'Ensuring older and modern browsers rendered responsive layouts reliably',
      'Aligning visual design assets with strict SEO and page-speed goals',
      'Supporting rapid turnaround cycles during seasonal digital campaigns',
    ],
    techStack: ['HTML5', 'CSS3', 'WordPress', 'SEO', 'Responsive UI'],
    outcomes: [
      'Multi-Portal Institutional Web',
      'SEO-Aligned Landing Pages',
      'Cross-Device Compatibility',
      '3-Year Production Ownership',
    ],
    learnings: [
      'Balancing editorial autonomy in WordPress with clean semantic HTML/CSS',
      'Structuring landing pages around both visual clarity and organic search',
      'Fast collaboration between design, content, and technical teams',
    ],
    ndaNote: 'Institutional web and digital campaign work at Lovely Professional University.',
    imageSrc: projectLuxuryBrand,
    imageAlt: 'Responsive institutional web portal and campaign layout',
    fallbackLabel: 'Institutional Web Suite',
  },
  {
    id: 'agency-responsive-web',
    title: 'Cross-Browser Brand & Responsive Web Delivery',
    category: 'Brand & Web',
    status: 'Shipped',
    year: '2019',
    timeframe: 'May 2013 – Feb 2019',
    roleTitle: 'UX/UI Designer & Frontend Developer',
    teamContext: 'Dreamweavers Group · Iniz Solutions · ASP Technologies',
    summary:
      'Client-facing responsive web, mobile-app UI, WordPress, Bootstrap, and jQuery builds delivered from requirement gathering to launch.',
    problem:
      'Growing client businesses needed cohesive brand identities, responsive websites, mobile interfaces, and email creatives that worked reliably across browsers and devices.',
    contributions: [
      'Gathered client requirements and designed responsive web and mobile-app UI concepts',
      'Implemented cross-browser layouts using HTML, CSS, JavaScript, jQuery, and Bootstrap',
      'Built custom WordPress sites, brand assets, and responsive email creatives',
      'Applied SEO-friendly HTML/CSS structure and usability best practices across launches',
    ],
    challenges: [
      'Translating varied client briefs into usable, brand-aligned digital products',
      'Supporting legacy browsers and varied mobile viewports with Bootstrap and custom CSS',
      'Maintaining clean email and web rendering across divergent client render engines',
      'Balancing visual polish with tight agency delivery schedules',
    ],
    techStack: ['HTML5', 'CSS3', 'Bootstrap', 'jQuery', 'WordPress', 'UI/UX Design'],
    outcomes: [
      'Web & Mobile UI Systems',
      'Cross-Browser Layouts',
      'SEO-Friendly Markup',
      'End-to-End Client Delivery',
    ],
    learnings: [
      'Direct client requirement discovery sharpens product thinking',
      'Foundational HTML/CSS mastery makes any modern framework easier to scale',
      'Combining UI/UX design craft with frontend execution reduces handoff friction',
    ],
    ndaNote: 'Agency and client engagements across Dreamweavers Group, Iniz Solutions, and ASP Technologies.',
    imageSrc: projectHrScheduling,
    imageAlt: 'Cross-browser brand websites and mobile UI interfaces',
    fallbackLabel: 'Brand & Responsive Web',
  },
];

export const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    id: 'exp-webedia',
    period: 'Apr 2019 – Present',
    title: 'Senior Frontend / UI Engineer & UI Technical Lead',
    organization:
      'Webedia España / Agile Media Lab · On-site (Apr 2019 – Mar 2020) | Remote (Apr 2020 – Present)',
    tags: ['Design Systems', 'HTML5 / CSS3 / SCSS / LESS', 'React / TypeScript', 'WCAG & Core Web Vitals'],
    bullets: [
      'Own end-to-end frontend execution from Figma prototypes and product concepts to shipped, responsive, pixel-accurate interfaces using HTML5, CSS3, JavaScript, LESS, and SCSS.',
      'Architect and maintain the shared component library, reusable UI patterns, and design tokens supporting ~40 multi-language websites including Xataka, 3DJuegos, and Directo al Paladar.',
      'Drive application speed, scalability, and Core Web Vitals improvements through semantic markup, responsive asset delivery, layout stability fixes, and rendering optimization.',
      'Enforce WCAG and ARIA accessibility standards across shared components and live platforms to ensure inclusive keyboard and screen-reader usability.',
      'Collaborate daily with UI/UX designers, backend engineers, product stakeholders, QA, and sysadmins across distributed teams in India and Spain.',
      'Lead frontend pull request reviews, troubleshoot production-critical cross-browser issues, mentor ~3 developers (including 2 direct reports), scope deliverables, and contribute to hiring.',
    ],
  },
  {
    id: 'exp-dreamweavers',
    period: 'Jul 2018 – Feb 2019',
    title: 'UX/UI Designer & Frontend Developer',
    organization: 'Dreamweavers Group',
    summary:
      'Gathered requirements and designed responsive web and mobile interfaces; built responsive HTML/CSS and WordPress sites, brand assets, and email creatives.',
    tags: ['HTML/CSS', 'WordPress', 'UI/UX Design', 'Email Creatives'],
  },
  {
    id: 'exp-lpu',
    period: 'Sep 2015 – Jul 2018',
    title: 'Assistant UI/UX Designer & Frontend Dev',
    organization: 'Lovely Professional University',
    summary:
      'Designed, developed, and maintained responsive institutional websites in HTML/CSS and WordPress; supported SEO and digital campaign initiatives.',
    tags: ['HTML/CSS', 'WordPress', 'SEO', 'Digital Campaigns'],
  },
  {
    id: 'exp-iniz',
    period: 'May 2014 – Sep 2015',
    title: 'UI/UX Designer & Frontend Developer',
    organization: 'Iniz Solutions',
    summary:
      'Designed responsive web and mobile-app interfaces and implemented cross-browser layouts using HTML, CSS, jQuery, and Bootstrap.',
    tags: ['HTML/CSS', 'jQuery', 'Bootstrap', 'Mobile UI'],
  },
  {
    id: 'exp-asp',
    period: 'May 2013 – May 2014',
    title: 'UI/UX Designer & SEO Specialist',
    organization: 'ASP Technologies',
    summary:
      'Collaborated with clients to design and build usable, brand-aligned responsive websites and SEO-friendly HTML/CSS layouts.',
    tags: ['UI/UX Design', 'Responsive Web', 'SEO-Friendly HTML/CSS'],
  },
  {
    id: 'edu-mca',
    period: '2013',
    title: 'Master of Computer Applications (MCA)',
    organization: 'Punjab Technical University',
    tags: ['Postgraduate Degree', 'Computer Applications'],
  },
  {
    id: 'edu-bca',
    period: '2010',
    title: 'Bachelor of Computer Applications (BCA)',
    organization: 'Guru Nanak Dev University',
    tags: ['Undergraduate Degree', 'Computer Applications'],
  },
];

export const CORE_STRENGTHS: CoreStrength[] = [
  {
    id: 'cs-1',
    title: 'End-to-End Product Ownership & Design-to-Code Craft',
    subtitle: 'Figma & Product Concepts -> Production Interfaces',
    description:
      'Translating Figma, Sketch, and Zeplin specifications into pixel-accurate, responsive, accessible web interfaces backed by clean semantic HTML5 and scalable CSS architecture.',
  },
  {
    id: 'cs-2',
    title: 'Technical Estimation, PR Reviews & Developer Mentoring',
    subtitle: 'UI Technical Lead · Team of ~3 Developers (2 Direct Reports)',
    description:
      'Scoping frontend deliverables, flagging delivery risks early, leading pull request code reviews, resolving production-critical cross-browser bugs, and mentoring engineers across India and Spain.',
  },
];

export const GITHUB_REPOS = [
  {
    id: 'r1',
    name: 'multi-brand-design-tokens',
    description:
      'Scalable SCSS/LESS design token architecture and reusable UI patterns engineered for multi-theme publishing platforms.',
    language: 'SCSS / TypeScript',
    stars: 28,
    forks: 7,
  },
  {
    id: 'r2',
    name: 'accessible-motion-ui',
    description:
      'WCAG & ARIA compliant React and TypeScript interface patterns enhanced with Framer Motion and GSAP.',
    language: 'TypeScript',
    stars: 21,
    forks: 5,
  },
];
