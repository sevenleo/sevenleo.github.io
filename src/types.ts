export type BadgeTone = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

export interface Badge {
  label: string;
  tone: BadgeTone;
}

export interface ProjectLink {
  label: string;
  url: string;
  type: string;
  primary?: boolean;
}

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface ProjectTimelineItem {
  date: string;
  title: string;
  description?: string;
}

export interface ProjectVersion {
  version: string;
  date?: string;
  summary?: string;
}

export interface ProjectDownload {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  shortSummary: string;
  description: string;
  category: string;
  type: string;
  status: string;
  visibility: string;
  maturity: string;
  platforms: string[];
  languages: string[];
  technologies: string[];
  tags: string[];
  audience: string;
  problem: string;
  goal: string;
  cover: string;
  gallery: ProjectImage[];
  links: ProjectLink[];
  primaryLink: ProjectLink | null;
  downloads: ProjectDownload[];
  versions: ProjectVersion[];
  timeline: ProjectTimelineItem[];
  createdAt: string;
  updatedAt: string;
  contentReviewed: boolean;
  contentReviewedAt: string;
  badges: Badge[];
  relatedProjectSlugs: string[];
  searchText: string;
}

export interface Profile {
  name: string;
  role: string;
  headline: string;
  photo: string;
  location: string;
  summary: string;
  focus: string[];
  socials: ProjectLink[];
}

export interface Skills {
  primary: string[];
  complementary: string[];
}

export interface EducationItem {
  title: string;
  type: string;
  institution: string;
  status: string;
  period: string;
  order: number;
  highlights: string[];
}

export interface ExperienceItem {
  company: string;
  position: string;
  period: string;
  order: number;
  summary: string;
  responsibilities: string[];
  tags?: string[];
}

export interface PortfolioIndex {
  name: string;
  projectSlugs: string[];
}

export interface PortfolioManifest {
  generatedAt: string;
  profile: Profile;
  skills: Skills;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: Project[];
  stats: {
    totalProjects: number;
    publicProjects: number;
    privateProjects: number;
    reviewedProjects: number;
    unreviewedProjects: number;
    languages: number;
    categories: number;
    recentUpdates: number;
  };
  indexes: {
    languages: PortfolioIndex[];
    technologies: PortfolioIndex[];
    categories: PortfolioIndex[];
  };
}
