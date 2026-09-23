import defaultDataJson from './defaultData.json';
import { Category, Tool, BlogPost, VideoItem, PageItem, Advertisement, SiteSettings } from '../types';

export const DEFAULT_CATEGORIES: Category[] = defaultDataJson.categories as Category[];
export const DEFAULT_TOOLS: Tool[] = defaultDataJson.tools as Tool[];
export const DEFAULT_POSTS: BlogPost[] = defaultDataJson.posts as BlogPost[];
export const DEFAULT_VIDEOS: VideoItem[] = defaultDataJson.videos as VideoItem[];
export const DEFAULT_PAGES: PageItem[] = defaultDataJson.pages as PageItem[];
export const DEFAULT_ADVERTISEMENTS: Advertisement[] = defaultDataJson.advertisements as Advertisement[];
export const DEFAULT_SETTINGS: SiteSettings = defaultDataJson.settings as SiteSettings;
