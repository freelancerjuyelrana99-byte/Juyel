export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryId?: string;
  description: string;
  shortDesc: string;
  longDesc?: string;
  icon: string;
  isPopular?: boolean;
  popular?: boolean;
  isNew?: boolean;
  isAi?: boolean;
  published: boolean;
  seoTitle?: string;
  metaDescription?: string;
  features?: string[];
  howToUse?: string[];
  faqs?: { question: string; answer: string }[];
  views?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  coverImage?: string;
  readTime?: string;
  author: string;
  category: string;
  tags: string[];
  published: boolean;
  publishDate: string;
  views: number;
  faqs?: { question: string; answer: string }[];
}

export interface VideoItem {
  id: string;
  title: string;
  slug: string;
  url: string;
  videoType: 'youtube' | 'vimeo' | 'direct';
  thumbnail: string;
  description: string;
  category: string;
  duration: string;
  tags: string[];
  published: boolean;
  publishDate: string;
  views: number;
}

export interface PageItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  updatedAt: string;
}

export type PageContent = PageItem;

export interface Advertisement {
  id: string;
  name: string;
  network: 'Google AdSense' | 'Adsterra' | 'Custom';
  type: 'Banner' | 'Responsive' | 'Native' | 'Social Bar' | 'Popunder' | 'Custom HTML/JavaScript';
  code: string;
  placement: 
    | 'Header Top'
    | 'Below Hero'
    | 'Before Tool'
    | 'Inside Tool'
    | 'After Tool'
    | 'Between Content'
    | 'Blog Top'
    | 'Blog Middle'
    | 'Blog Bottom'
    | 'Sidebar Top'
    | 'Sidebar Middle'
    | 'Footer'
    | 'Mobile Top'
    | 'Mobile Bottom';
  device: 'All Devices' | 'Desktop' | 'Tablet' | 'Mobile';
  status: boolean;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
  mimeType: string;
  uploadedAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  contactEmail: string;
  supportPhone?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  githubUrl?: string;
  googleAnalyticsId?: string;
  adsTxt: string;
  seoTitle: string;
  metaDescription: string;
  ogImage: string;
  maintenanceMode: boolean;
}

export interface AnalyticsData {
  totalVisitors: number;
  todayVisitors: number;
  pageViews: number;
  deviceStats: { desktop: number; mobile: number; tablet: number };
  topTools: { name: string; slug: string; views: number }[];
  topPages: { path: string; views: number }[];
  dailyViews: { date: string; views: number; visitors: number }[];
}
