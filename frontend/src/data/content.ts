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
  emoji: string;
}

export interface SiteContent {
  person: {
    name: string;
    title: string;
    tagline: string;
    email: string;
    github: string;
    linkedin: string;
  };
  skills: Skill[];
  experience: ExperienceEntry[];
  hobbies: HobbyEntry[];
}

export const siteContent: SiteContent = {
  person: {
    name: "jussaw",
    title: "Software Engineer",
    tagline: "I build things for the web — from the database to the browser.",
    email: "hello@jussaw.com",
    github: "https://github.com/jussaw",
    linkedin: "https://linkedin.com/in/jussaw",
  },
  skills: [
    { name: "React", category: "frontend" },
    { name: "Next.js", category: "frontend" },
    { name: "TypeScript", category: "language" },
    { name: "JavaScript", category: "language" },
    { name: "Node.js", category: "backend" },
    { name: "Python", category: "backend" },
    { name: "PostgreSQL", category: "database" },
    { name: "Redis", category: "database" },
    { name: "Tailwind CSS", category: "frontend" },
    { name: "Docker", category: "devops" },
    { name: "AWS", category: "devops" },
    { name: "Git", category: "devops" },
  ],
  experience: [
    {
      company: "Acme Technologies",
      role: "Senior Software Engineer",
      period: "2022 – Present",
      location: "Remote",
      bullets: [
        "Led architecture of a distributed event-driven platform serving 2M+ daily users",
        "Reduced API latency by 40% by introducing Redis caching and query optimization",
        "Mentored a team of 4 engineers and drove quarterly roadmap planning",
      ],
    },
    {
      company: "Bright Labs",
      role: "Software Engineer",
      period: "2020 – 2022",
      location: "New York, NY",
      bullets: [
        "Built and shipped a full-stack SaaS application from zero to 10k users",
        "Designed RESTful APIs consumed by web and mobile clients",
        "Improved CI/CD pipeline reliability, cutting deploy time from 18 min to 4 min",
      ],
    },
    {
      company: "Dev Studio",
      role: "Junior Software Engineer",
      period: "2018 – 2020",
      location: "New York, NY",
      bullets: [
        "Developed responsive React interfaces for e-commerce clients",
        "Collaborated closely with designers to implement pixel-perfect UIs",
      ],
    },
  ],
  hobbies: [
    { label: "Gaming", emoji: "🎮" },
    { label: "Cooking", emoji: "🍳" },
    { label: "Rock Climbing", emoji: "🧗" },
    { label: "Open Source", emoji: "💻" },
    { label: "Photography", emoji: "📷" },
  ],
};
