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
  /** Optional per-project intro for the "Case Study" aside; falls back to a generic sentence when unset. */
  caseIntro?: string;
  /** Path under /public, e.g. '/assets/projects/<slug>.jpg'. Undefined shows the placeholder. */
  image?: string;
  /** Optional override for the detail-page hero banner only; falls back to `image` when unset. */
  hero?: string;
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
  /** Detail-page gallery: paths under /public, e.g. '/assets/projects/<slug>/1.jpg'. */
  gallery?: string[];
  /** Detail-page link buttons — only set on 'public' projects; omit to hide. */
  behance?: string;
  github?: string;
}

export interface Design {
  slug: string;
  category: string;
  title: string;
  /** Path under /public, e.g. '/assets/designs/<slug>.jpg'. Undefined shows the placeholder. */
  image?: string;
  description: string;
  tools: string[];
  notes: string;
  /** Optional override for the "See it live" heading; falls back to "Watch this design in action" when unset. */
  liveHeading?: string;
  /** Optional override for the "See it live" paragraph; falls back to a generic sentence when unset. */
  liveNote?: string;
  /** Optional per-design social links for the "See it live" buttons. When unset, defaults to LinkedIn/YouTube/Instagram placeholders. Only platforms with a value are shown. */
  links?: { figma?: string; linkedin?: string; youtube?: string; instagram?: string; behance?: string };
}

export const projectCategories: string[];
export const designCategories: string[];
export const projects: Project[];
export const designs: Design[];
export function findProject(slug: string | undefined | null): Project | undefined;
export function findDesign(slug: string | undefined | null): Design | undefined;
export function adjacent<T extends { slug: string }>(list: T[], slug: string): { prev: T | null; next: T | null };
