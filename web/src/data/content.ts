export interface Skill {
  name: string;
  category: "frontend" | "backend" | "language" | "devops" | "database";
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

export interface SiteContent {
  person: {
    name: string;
    title: string;
    tagline: string;
    email: string;
    github: string;
    linkedin: string;
    hostingNote: string;
  };
  skills: Skill[];
  experience: ExperienceEntry[];
  hobbies: HobbyEntry[];
  kit: KitItem[];
}

export const siteContent: SiteContent = {
  person: {
    name: "Justin Sawyer",
    title: "Software Engineer | Ergo Keyboard Enthusiast",
    tagline: "I care about how it works, how it feels, and who it's for.",
    email: "jtsaw36@gmail.com",
    github: "https://github.com/jussaw",
    linkedin: "https://linkedin.com/in/jussaw",
    hostingNote: "Hosted with ❤️ on my Raspberry Pi",
  },
  kit: [
    { label: "keyboard", value: "Corne LP w/ nice!nano" },
    { label: "laptop", value: "M2 MacBook Air" },
    { label: "headphones", value: "AirPods Pro 3" },
    { label: "browser", value: "Zen Browser" },
    { label: "editor", value: "VS Code" },
    { label: "terminal", value: "iTerm2" },
  ],
  skills: [
    { name: "React", category: "frontend" },
    { name: "Next.js", category: "frontend" },
    { name: "Angular", category: "frontend" },
    { name: "Tailwind CSS", category: "frontend" },
    { name: "TypeScript", category: "language" },
    { name: "JavaScript", category: "language" },
    { name: "Java", category: "language" },
    { name: "Python", category: "language" },
    { name: "Node.js", category: "backend" },
    { name: "Spring Boot", category: "backend" },
    { name: "REST / OpenAPI", category: "backend" },
    { name: "PostgreSQL", category: "database" },
    { name: "MySQL", category: "database" },
    { name: "Redis", category: "database" },
    { name: "MongoDB", category: "database" },
    { name: "Docker", category: "devops" },
    { name: "AWS", category: "devops" },
    { name: "GitHub Actions", category: "devops" },
  ],
  experience: [
    {
      company: "Cargill",
      role: "Software Engineer II",
      period: "2025 – Present",
      location: "Atlanta, Georgia",
      bullets: [],
    },
    {
      company: "Raytheon",
      role: "Software Engineer II",
      period: "2023 – 2025",
      location: "Denver, Colorado",
      bullets: [
        "Engineered a full-stack time tracking application using React and Spring Boot within a microservices architecture",
        "Designed and implemented an internal voting system with RESTful APIs and a PostgreSQL backend",
        "Partnered with the Scrum Master to facilitate sprint ceremonies and author user stories",
      ],
    },
    {
      company: "Benchmark Analytics",
      role: "Full Stack Developer",
      period: "2022 – 2023",
      location: "Remote",
      bullets: [
        "Partnered with the L3/Base Application team to identify and resolve root-cause defects, reducing ticket intake by 25%",
        "Triaged and routed incoming issues during daily Agile stand-ups, directing tickets to the appropriate engineering departments",
        "Sustained consistent delivery of bug fixes across the codebase while managing a high-volume ticket backlog",
      ],
    },
    {
      company: "T-Mobile",
      role: "Software Engineer",
      period: "2021 – 2022",
      location: "Remote",
      bullets: [
        "Developed scalable microservices supporting T-Mobile's device and accessory supply chain within a distributed Agile team",
        "Defined backend service contracts using Java Spring and Swagger API specifications within a BDD Agile environment",
        "Built a new Angular feature page enabling business teams to search and update SKU-level store data for the BOPIS sales model",
      ],
    },
    {
      company: "KNAPP",
      role: "Software Systems Engineer",
      period: "2019 – 2020",
      location: "Atlanta Metropolitan Area",
      bullets: [
        "Developed software solutions for automated warehouse systems using Python, Java, and PL/SQL in a Linux environment",
        "Deployed and configured systems on-site at facilities worldwide, spanning the United States, Canada, South America, and Europe",
        "Partnered directly with clients to customize and optimize software to their unique operational requirements",
      ],
    },
  ],
  hobbies: [
    { label: "Ergonomic Keyboards", icon: "Keyboard" },
    { label: "Home Lab", icon: "Server" },
    { label: "Gaming", icon: "Gamepad2" },
    { label: "Hiking", icon: "Footprints" },
    { label: "Snowboarding", icon: "MountainSnow" },
  ],
};
