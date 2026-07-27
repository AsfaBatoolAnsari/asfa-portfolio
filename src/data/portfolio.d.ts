export interface Project {
  slug: string;
  type: 'public' | 'nda';
  title: string;
  category: string;
  year?: string;
  role?: string;
  timeline?: string;
  industry?: string;
  summary?: string;
  overview?: string;
  imageSlot?: string;
  challenge?: string;
  process?: string;
  solution?: string;
  outcome?: string;
  problem?: string;
  responsibilities?: string;
  processNote?: string;
  contributions?: string[];
  resultsNote?: string;
  services?: string[];
  tools?: string[];
  gallery?: string[];
}

export interface Design {
  slug: string;
  category: string;
  title: string;
  imageSlot: string;
  description: string;
  tools: string[];
  notes: string;
}

export const projectCategories: string[];
export const designCategories: string[];
export const projects: Project[];
export const designs: Design[];
export function findProject(slug: string | undefined | null): Project | undefined;
export function findDesign(slug: string | undefined | null): Design | undefined;
export function adjacent<T extends { slug: string }>(list: T[], slug: string): { prev: T | null; next: T | null };
