export type ExperienceItem = {
  role: string;
  organization: string;
  location?: string;
  dateRange: string;
  description: string;
};

export const experience: ExperienceItem[] = [
  {
    role: "Applied Scientist Intern",
    organization: "Amazon (AWS Agentic AI)",
    location: "Pasadena, CA",
    dateRange: "May 25 – Oct 25",
    description: "Worked on utility-aware LLM reasoning as part of the AWS Agentic AI team."
  }
];
