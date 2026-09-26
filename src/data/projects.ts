export type Project = {
  id: string
  title: string
  description: string
  technologies: string[]
  category: "web" | "automation"
  liveUrl?: string
  githubUrl?: string
}

export const projects: Project[] = [
  {
    id: "1",
    title: "MeProject",
    description:
      "A project management application for creating and managing projects, tasks, notes, and attachments.",
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "React Router",
      "Axios",
      "Day.js",
      "REST API",
      "JWT"
    ],
    category: "web",
    liveUrl: "https://me-project99-seven.vercel.app/",
    githubUrl: "https://github.com/we2004/MeProject"
  },
  {
    id: "2",
    title: "AI Academic Calendar Assistant",
    description:
      "An AI-powered Telegram assistant that turns natural-language academic tasks into structured entries in a Notion semester calendar.",
    technologies: ["n8n", "AI Agent", "Telegram", "Notion"],
    category: "automation",
    liveUrl:
      "https://drive.google.com/file/d/1iUJfX-5tkCkXWgXb8FH_wkLJ4L6kAlJp/view?usp=sharing"
  }
]
