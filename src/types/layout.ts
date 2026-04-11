import type { SiteSettings } from "@/lib/site-settings";

/** Navigation item used by Header */
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

/** Minimal category shape for navigation */
export interface NavCategory {
  slug: string;
  title: string;
}

/** Recent blog post for sidebar */
export interface RecentPost {
  slug: string;
  title: string;
  image: string;
  publishedAt: string; // ISO string
  categorySlug: string;
}

/** Minimal product shape for dropdowns */
export interface NavProduct {
  id: number;
  name: string;
}

/** Props shared by Header and Footer */
export interface LayoutDataProps {
  siteSettings: SiteSettings;
  productCategories: NavCategory[];
  blogCategories: NavCategory[];
  recentPosts: RecentPost[];
  products?: NavProduct[];
}
