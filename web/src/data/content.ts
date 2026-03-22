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
    hostingNote: string;
  };
  skills: Skill[];
  experience: ExperienceEntry[];
  hobbies: HobbyEntry[];
}

export const siteContent: SiteContent = {
  person: {
    name: "Justin Sawyer",
    title: "Software Engineer",
    tagline: "I care about how it works, how it feels, and who it's for.",
    email: "jtsaw36@gmail.com",
    github: "https://github.com/jussaw",
    linkedin: "https://linkedin.com/in/jussaw",
    hostingNote: "Hosted with ❤️ on my Raspberry Pi",
  },
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
        "Built a time tracking application using ReactJS and Spring Boot in a microservice architecture, working within an Agile team",
        "Developed a full-stack voting system with RESTful APIs and PostgreSQL, building on the same React/Spring Boot stack",
        "Assisted the Scrum Master with sprint management and writing stories",
      ],
    },
    {
      company: "Benchmark Analytics",
      role: "Full Stack Developer",
      period: "2022 – 2023",
      location: "Remote",
      bullets: [
        "Collaborated with the L3/Base Application development team weekly to identify and design root-cause fixes, reducing ticket intake by 25%",
        "Triaged tickets with the team in daily Agile stand-ups, assigning specific issues to appropriate departments",
        "Delivered fixes across the codebase while staying current with the team's ongoing ticket backlog",
      ],
    },
    {
      company: "T-Mobile",
      role: "Software Engineer",
      period: "2021 – 2022",
      location: "Remote",
      bullets: [
        "Collaborated with a distributed team to develop scalable microservices supporting T-Mobile's device and accessory supply chain",
        "Defined backend service contracts using Java Spring and Swagger API specifications within a BDD Agile environment",
        "Enhanced T-Mobile's internal application by creating a new Angular-based page enabling business teams to search and update SKU-specific store information for the BOPIS sales model",
      ],
    },
    {
      company: "KNAPP Inc.",
      role: "Software Systems Engineer",
      period: "2019 – 2020",
      location: "Atlanta Metropolitan Area",
      bullets: [
        "Developed scalable software solutions for advanced automated warehouses using Python, Java, and PL/SQL within a Linux environment",
        "Deployed and configured systems on-site at facilities worldwide, spanning the United States, Canada, South America, and Europe",
        "Partnered directly with clients to customize and optimize software to their unique operational requirements",
      ],
    },
  ],
  hobbies: [
    { label: "Ergonomic Keyboards", emoji: "⌨️" },
    { label: "Home Lab", emoji: "🖥️" },
    { label: "Gaming", emoji: "🎮" },
    { label: "Hiking", emoji: "🥾" },
    { label: "Snowboarding", emoji: "🏂" },
  ],
};
