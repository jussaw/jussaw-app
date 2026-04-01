export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'language' | 'devops' | 'database';
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
}

export interface HobbyEntry {
  label: string;
  icon: string;
}

export interface KitItem {
  label: string;
  value: string;
}

export interface ProjectEntry {
  title: string;
  description: string;
  highlights: string[];
  stack: string[];
  liveUrl?: string;
  githubUrl: string;
}

export interface SiteContent {
  person: {
    name: string;
    title: string;
    email: string;
    linkedin: string;
    github: string;
  };
  kit: KitItem[];
  skills: Skill[];
  experience: ExperienceEntry[];
  hobbies: HobbyEntry[];
  hostingNote: string;
  projects: ProjectEntry[];
}

export const siteContent: SiteContent = {
  person: {
    name: 'Justin Sawyer',
    title: 'Software Engineer | Ergo Keyboard Enthusiast',
    email: 'jtsaw36@gmail.com',
    github: 'https://github.com/jussaw',
    linkedin: 'https://linkedin.com/in/jussaw',
  },
  kit: [
    { label: 'keyboard', value: 'Corne LP w/ nice!nano' },
    { label: 'laptop', value: 'M2 MacBook Air' },
    { label: 'headphones', value: 'AirPods Pro 3' },
    { label: 'browser', value: 'Zen Browser' },
    { label: 'editor', value: 'VS Code' },
    { label: 'terminal', value: 'iTerm2' },
  ],
  skills: [
    { name: 'React', category: 'frontend' },
    { name: 'Next.js', category: 'frontend' },
    { name: 'Angular', category: 'frontend' },
    { name: 'Tailwind CSS', category: 'frontend' },
    { name: 'TypeScript', category: 'language' },
    { name: 'JavaScript', category: 'language' },
    { name: 'Java', category: 'language' },
    { name: 'Python', category: 'language' },
    { name: 'Node.js', category: 'backend' },
    { name: 'Spring Boot', category: 'backend' },
    { name: 'REST / OpenAPI', category: 'backend' },
    { name: 'PostgreSQL', category: 'database' },
    { name: 'MySQL', category: 'database' },
    { name: 'Redis', category: 'database' },
    { name: 'MongoDB', category: 'database' },
    { name: 'Docker', category: 'devops' },
    { name: 'AWS', category: 'devops' },
    { name: 'GitHub Actions', category: 'devops' },
  ],
  experience: [
    {
      company: 'Cargill',
      role: 'Software Engineer II',
      period: '2025 - Present',
      location: 'Atlanta, GA',
      bullets: [],
    },
    {
      company: 'Raytheon',
      role: 'Software Engineer II',
      period: '2023 - 2025',
      location: 'Denver, CO',
      bullets: [
        'Engineered a full-stack time tracking application using React and Spring Boot within a microservices architecture',
        'Designed and implemented an internal voting system with RESTful APIs and a PostgreSQL backend',
        'Partnered with the Scrum Master to facilitate sprint ceremonies and author user stories',
      ],
    },
    {
      company: 'Benchmark Analytics',
      role: 'Full Stack Developer',
      period: '2022 - 2023',
      location: 'Remote',
      bullets: [
        'Partnered with the L3/Base Application team to identify and resolve root-cause defects, reducing ticket intake by 25%',
        'Triaged and routed incoming issues during daily Agile stand-ups, directing tickets to the appropriate engineering departments',
        'Sustained consistent delivery of bug fixes across the codebase while managing a high-volume ticket backlog',
      ],
    },
    {
      company: 'T-Mobile',
      role: 'Software Engineer',
      period: '2021 - 2022',
      location: 'Remote',
      bullets: [
        "Developed scalable microservices supporting T-Mobile's device and accessory supply chain within a distributed Agile team",
        'Defined backend service contracts using Java Spring and Swagger API specifications within a BDD Agile environment',
        'Built a new Angular feature page enabling business teams to search and update SKU-level store data for the BOPIS sales model',
      ],
    },
    {
      company: 'KNAPP',
      role: 'Software Systems Engineer',
      period: '2019 - 2020',
      location: 'Atlanta, GA',
      bullets: [
        'Developed software solutions for automated warehouse systems using Python, Java, and PL/SQL in a Linux environment',
        'Deployed and configured systems on-site at facilities worldwide, spanning the United States, Canada, South America, and Europe',
        'Partnered directly with clients to customize and optimize software to their unique operational requirements',
      ],
    },
  ],
  hobbies: [
    { label: 'Ergonomic Keyboards', icon: 'FaKeyboard' },
    { label: 'Home Lab', icon: 'FaServer' },
    { label: 'Gaming', icon: 'FaGamepad' },
    { label: 'Hiking', icon: 'FaHiking' },
    { label: 'Snowboarding', icon: 'FaMountain' },
  ],
  hostingNote: 'Hosted with ❤️ on my Raspberry Pi',
  projects: [
    {
      title: 'jussaw.com',
      description: 'This site — designed, built, and self-hosted',
      highlights: [
        'Self-hosted on Raspberry Pi via Docker + Docker Compose',
        'Standalone Next.js build optimized for minimal production artifact',
        'Scroll-triggered animations with Intersection Observer API',
        'Full test coverage with Vitest + React Testing Library',
      ],
      stack: ['Next.js 16', 'TypeScript', 'Tailwind CSS 4', 'Docker', 'Raspberry Pi'],
      liveUrl: 'https://jussaw.com',
      githubUrl: 'https://github.com/jussaw/jussaw-app',
    },
    {
      title: 'zmk-config-corne',
      description: 'ZMK wireless firmware config for Corne split keyboard',
      highlights: [
        'Colemak-DHm layout with home row mods (A/R/S/T and N/E/I/O)',
        '8 layers: Windows, Mac, Lower, Upper, Adjust, Settings, Game',
        'Bluetooth multi-device support and mouse/pointer layer',
        'Hyper key macro and SOCD behavior for Game layer',
      ],
      stack: ['ZMK Firmware', 'Devicetree', 'GitHub Actions'],
      githubUrl: 'https://github.com/jussaw/zmk-config-corne',
    },
    {
      title: 'qmk_firmware',
      description: 'QMK wired firmware config for Corne split keyboard',
      highlights: [
        'Colemak-DHm layout with home row mods (A/R/S/T and N/E/I/O)',
        '8 layers: Default, Mac, Lower, Upper, Adjust, Settings, Game',
        'Mouse keys, scroll wheel, and media controls on Adjust layer',
        'SOCD handling in Game layer',
      ],
      stack: ['QMK Firmware', 'C', 'Make'],
      githubUrl: 'https://github.com/jussaw/qmk_firmware',
    },
  ],
};
