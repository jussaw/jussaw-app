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
    name: "Justin Sawyer",
    title: "Software Engineer",
    tagline: "I care about how it works, how it feels, and who it's for.",
    email: "jtsaw36@gmail.com",
    github: "https://github.com/jussaw",
    linkedin: "https://linkedin.com/in/jussaw",
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
        "Collaborated with an Agile team to develop a time tracking application with ReactJS frontend and Spring Boot backend in a microservice architecture",
        "Developed a voting system application with Spring Boot backend and ReactJS frontend, implementing RESTful APIs and PostgreSQL for database management",
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
        "Developed solutions for root-cause fixes while managing weekly tickets in an Agile environment",
      ],
    },
    {
      company: "T-Mobile",
      role: "Software Engineer",
      period: "2021 – 2022",
      location: "Remote",
      bullets: [
        "Collaborated with a distributed team to develop scalable microservices supporting T-Mobile's device and accessory supply chain",
        "Designed and implemented backend microservices using Java Spring and Swagger API definitions within a BDD Agile environment",
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
        "Implemented software solutions on-site at warehouses worldwide across the United States, Canada, South America, and Europe",
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
